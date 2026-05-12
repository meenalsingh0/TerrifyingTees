import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPaymentDto {
  @ApiProperty({ example: 'order_LxxxxxxxxxxxxX', description: 'Razorpay order ID' })
  @IsNotEmpty()
  @IsString()
  razorpayOrderId: string;

  @ApiProperty({ example: 'pay_LxxxxxxxxxxxxX', description: 'Razorpay payment ID' })
  @IsNotEmpty()
  @IsString()
  razorpayPaymentId: string;

  @ApiProperty({ example: 'abcdef1234567890...', description: 'Razorpay HMAC signature' })
  @IsNotEmpty()
  @IsString()
  razorpaySignature: string;

  @ApiProperty({ example: 'order-uuid-123', description: 'Your database order ID' })
  @IsNotEmpty()
  @IsString()
  orderId: string;
}
