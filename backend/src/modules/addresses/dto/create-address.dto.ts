/**
 * CreateAddressDto — Validates incoming data for creating a new address.
 *
 * Validation rules:
 *   • name, street, city, state — required non-empty strings
 *   • phone — exactly 10 digits (Indian mobile format)
 *   • pincode — exactly 6 digits (Indian postal code)
 *   • isDefault — optional boolean; when true the service will
 *     unset all other defaults in a transaction
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    description: 'Full name of the recipient',
    example: 'Rahul Sharma',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Phone number — exactly 10 digits',
    example: '9876543210',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/, {
    message: 'phone must be exactly 10 digits',
  })
  phone: string;

  @ApiProperty({
    description: 'Street address line',
    example: '42, MG Road, Koramangala',
  })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    description: 'City name',
    example: 'Bangalore',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'State name',
    example: 'Karnataka',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'Pincode — exactly 6 digits',
    example: '560034',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, {
    message: 'pincode must be exactly 6 digits',
  })
  pincode: string;

  @ApiProperty({
    description: 'Whether this address should be the default',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
