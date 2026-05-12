import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { CreateRazorpayOrderDto } from './dto/create-payment-intent.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import {
  CreateRazorpayOrderApiResponseDto,
  PaymentApiResponseDto,
} from './dto/payment-response.dto';
import { VerifyPaymentDto } from './dto/confirm-payment.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiTags('payments')
@ApiBearerAuth('JWT-auth')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  @ApiOperation({
    summary: 'Create Razorpay order',
    description: 'Create a Razorpay order for payment processing',
  })
  @ApiCreatedResponse({
    description: 'Razorpay order created successfully',
    type: CreateRazorpayOrderApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data or order not found',
  })
  async createOrder(
    @Body() createOrderDto: CreateRazorpayOrderDto,
    @GetUser('id') userId: string,
  ) {
    return await this.paymentsService.createOrder(userId, createOrderDto);
  }

  @Post('verify')
  @ApiOperation({
    summary: 'Verify Razorpay payment',
    description:
      'Verify the Razorpay payment signature and confirm the payment',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment verified and confirmed successfully',
    type: PaymentApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Payment not found, already completed, or signature invalid',
  })
  async verifyPayment(
    @Body() verifyPaymentDto: VerifyPaymentDto,
    @GetUser('id') userId: string,
  ) {
    return await this.paymentsService.verifyPayment(userId, verifyPaymentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all payments',
    description: 'Get all payments for the current user',
  })
  @ApiOkResponse({
    description: 'Payments retrieved successfully',
    type: PaymentApiResponseDto,
  })
  async findAll(@GetUser('id') userId: string) {
    return await this.paymentsService.findAll(userId);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Payment ID',
    example: '154sd4848ds5d-4654-4sdd8s7d-sd4656',
  })
  @ApiOperation({
    summary: 'Get payment by ID',
    description: 'Get a specific payment by its ID',
  })
  @ApiOkResponse({
    description: 'Payment retrieved successfully',
    type: PaymentApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Payment not found',
  })
  async findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return await this.paymentsService.findOne(id, userId);
  }

  // Get payment by order ID
  @Get('order/:orderId')
  @ApiParam({
    name: 'orderId',
    description: 'Order ID',
    example: 'order-123',
  })
  @ApiOperation({
    summary: 'Get payment by order ID',
    description: 'Get payment information for a specific order',
  })
  @ApiOkResponse({
    description: 'Payment retrieved successfully',
    type: PaymentApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Payment not found',
  })
  async findByOrder(
    @Param('orderId') orderId: string,
    @GetUser('id') userId: string,
  ) {
    return await this.paymentsService.findByOrder(orderId, userId);
  }
}
