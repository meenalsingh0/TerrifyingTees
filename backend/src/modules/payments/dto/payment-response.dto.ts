import { ApiProperty } from '@nestjs/swagger';

export class CreateRazorpayOrderResponse {
  @ApiProperty({
    example: 'order_LxxxxxxxxxxxxX',
    description: 'Razorpay order ID to be used on the frontend checkout',
  })
  razorpayOrderId: string;

  @ApiProperty({
    example: '2165465-454-sds4s854d65',
    description: 'Payment ID in your database',
  })
  paymentId: string;

  @ApiProperty({
    example: 49999,
    description: 'Amount in smallest currency unit (paise for INR)',
  })
  amount: number;

  @ApiProperty({
    example: 'INR',
    description: 'Currency code',
  })
  currency: string;

  @ApiProperty({
    example: 'rzp_test_xxxxxxxxxxxx',
    description: 'Razorpay key ID for frontend initialization',
  })
  keyId: string;
}

export class PaymentResponseDto {
  @ApiProperty({
    example: '1215645s454sdosd4s-454sd',
  })
  id: string;

  @ApiProperty({
    example: 'order-123',
  })
  orderId: string;

  @ApiProperty({
    example: 499.99,
  })
  amount: number;

  @ApiProperty({
    example: 'user-456',
  })
  userId: string;

  @ApiProperty({
    example: 'INR',
  })
  currency: string;

  @ApiProperty({
    example: 'COMPLETED',
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
  })
  status: string;

  @ApiProperty({
    example: 'RAZORPAY',
    nullable: true,
  })
  paymentMethod: string | null;

  @ApiProperty({
    example: 'pay_LxxxxxxxxxxxxX',
    nullable: true,
  })
  transactionId: string | null;

  @ApiProperty({})
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PaymentApiResponseDto {
  @ApiProperty({
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: PaymentResponseDto,
  })
  data: PaymentResponseDto;

  @ApiProperty({
    example: 'Payment retrieved successfully',
    required: false,
  })
  message?: string;
}

export class CreateRazorpayOrderApiResponseDto {
  @ApiProperty({
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: CreateRazorpayOrderResponse,
  })
  data: CreateRazorpayOrderResponse;

  @ApiProperty({
    example: 'Razorpay order created successfully',
    required: false,
  })
  message?: string;
}
