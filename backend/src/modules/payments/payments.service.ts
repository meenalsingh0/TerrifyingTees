import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { CreateRazorpayOrderDto } from './dto/create-payment-intent.dto';
import { PaymentStatus, Prisma } from '@prisma/client';
import { VerifyPaymentDto } from './dto/confirm-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';

@Injectable()
export class PaymentsService {
  private razorpay: Razorpay | null = null;
  private readonly logger = new Logger(PaymentsService.name);
  private readonly keyId: string;
  private readonly keySecret: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.keyId = this.configService.get<string>('RAZORPAY_KEY_ID') || '';
    this.keySecret =
      this.configService.get<string>('RAZORPAY_KEY_SECRET') || '';

    if (this.keyId && this.keySecret) {
      this.razorpay = new Razorpay({
        key_id: this.keyId,
        key_secret: this.keySecret,
      });
    } else {
      this.logger.warn(
        'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set. Payment features will be unavailable.',
      );
    }
  }

  private getRazorpay(): Razorpay {
    if (!this.razorpay) {
      throw new BadRequestException(
        'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment.',
      );
    }
    return this.razorpay;
  }

  // Create a Razorpay order
  async createOrder(
    userId: string,
    createOrderDto: CreateRazorpayOrderDto,
  ): Promise<{
    success: boolean;
    data: {
      razorpayOrderId: string;
      paymentId: string;
      amount: number;
      currency: string;
      keyId: string;
    };
    message: string;
  }> {
    const { orderId, amount, currency = 'INR' } = createOrderDto;

    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const existingPayment = await this.prisma.payment.findFirst({
      where: { orderId },
    });

    if (existingPayment && existingPayment.status === PaymentStatus.COMPLETED) {
      throw new BadRequestException(
        'Payment already completed for this order',
      );
    }

    // Razorpay expects amount in smallest currency unit (paise for INR)
    const amountInPaise = Math.round(amount * 100);

    const razorpayOrder = await this.getRazorpay().orders.create({
      amount: amountInPaise,
      currency,
      receipt: orderId,
      notes: {
        orderId,
        userId,
      },
    });

    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        userId,
        amount,
        currency,
        status: PaymentStatus.PENDING,
        paymentMethod: 'RAZORPAY',
        transactionId: razorpayOrder.id, // Store Razorpay order ID initially
      },
    });

    return {
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        paymentId: payment.id,
        amount: amountInPaise,
        currency,
        keyId: this.keyId, // Frontend needs this to initialize Razorpay checkout
      },
      message: 'Razorpay order created successfully',
    };
  }

  // Verify Razorpay payment signature and confirm payment
  async verifyPayment(
    userId: string,
    verifyPaymentDto: VerifyPaymentDto,
  ): Promise<{ success: boolean; data: PaymentResponseDto; message: string }> {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
      verifyPaymentDto;

    const payment = await this.prisma.payment.findFirst({
      where: {
        orderId,
        userId,
        transactionId: razorpayOrderId, // We stored the Razorpay order ID during creation
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status === PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment already completed');
    }

    // Verify Razorpay signature using HMAC SHA256
    const generatedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      // Mark payment as failed
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED },
      });

      throw new BadRequestException('Payment verification failed: invalid signature');
    }

    // Signature valid — update payment and order in a transaction
    const [updatedPayment] = await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.COMPLETED,
          transactionId: razorpayPaymentId, // Update to the actual payment ID
        },
      }),

      this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'PROCESSING' },
      }),
    ]);

    // Mark the cart as checked out
    const dbOrder = await this.prisma.order.findFirst({
      where: { id: orderId },
    });

    if (dbOrder?.cartId) {
      await this.prisma.cart.update({
        where: { id: dbOrder.cartId },
        data: { checkedOut: true },
      });
    }

    return {
      success: true,
      data: this.mapToPaymentResponse(updatedPayment),
      message: 'Payment verified and confirmed successfully',
    };
  }

  // Get all payments for current user
  async findAll(userId: string): Promise<{
    success: boolean;
    data: PaymentResponseDto[];
    message: string;
  }> {
    const payments = await this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: payments.map((payment) => this.mapToPaymentResponse(payment)),
      message: 'Payments retrieved successfully',
    };
  }

  // Get payment by ID
  async findOne(
    id: string,
    userId: string,
  ): Promise<{
    success: boolean;
    data: PaymentResponseDto;
    message: string;
  }> {
    const payment = await this.prisma.payment.findFirst({
      where: { id, userId },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return {
      success: true,
      data: this.mapToPaymentResponse(payment),
      message: 'Payment retrieved successfully',
    };
  }

  // Get payment by Order ID
  async findByOrder(
    orderId: string,
    userId: string,
  ): Promise<{
    success: boolean;
    data: PaymentResponseDto | null;
    message: string;
  }> {
    const payment = await this.prisma.payment.findFirst({
      where: { orderId, userId },
    });

    return {
      success: true,
      data: payment ? this.mapToPaymentResponse(payment) : null,
      message: 'Payment retrieved successfully',
    };
  }

  private mapToPaymentResponse(payment: {
    id: string;
    orderId: string;
    userId: string;
    amount: Prisma.Decimal;
    currency: string;
    status: PaymentStatus;
    paymentMethod: string | null;
    transactionId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): PaymentResponseDto {
    return {
      id: payment.id,
      orderId: payment.orderId,
      userId: payment.userId,
      currency: payment.currency,
      amount: payment.amount.toNumber(),
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
