/**
 * AddressResponseDto — Shape of the address object returned by
 * all address endpoints. Uses @ApiProperty for Swagger docs.
 */

import { ApiProperty } from '@nestjs/swagger';

export class AddressResponseDto {
  @ApiProperty({
    description: 'Address UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Owner user UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  @ApiProperty({
    description: 'Recipient name',
    example: 'Rahul Sharma',
  })
  name: string;

  @ApiProperty({
    description: 'Phone number (10 digits)',
    example: '9876543210',
  })
  phone: string;

  @ApiProperty({
    description: 'Street address',
    example: '42, MG Road, Koramangala',
  })
  street: string;

  @ApiProperty({
    description: 'City',
    example: 'Bangalore',
  })
  city: string;

  @ApiProperty({
    description: 'State',
    example: 'Karnataka',
  })
  state: string;

  @ApiProperty({
    description: 'Pincode (6 digits)',
    example: '560034',
  })
  pincode: string;

  @ApiProperty({
    description: 'Whether this is the default address',
    example: true,
  })
  isDefault: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
