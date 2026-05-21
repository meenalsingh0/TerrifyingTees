/**
 * UpdateAddressDto — Partial version of CreateAddressDto.
 *
 * All fields are optional so the client can send only the
 * fields that need to change (PATCH semantics). PartialType
 * from @nestjs/swagger preserves both class-validator decorators
 * and Swagger metadata while marking everything @IsOptional().
 */

import { PartialType } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
