/**
 * AddressesController — REST endpoints for user address management.
 *
 * All routes are protected by JwtAuthGuard. The user ID is always
 * extracted from the JWT token via @GetUser('id') — never from
 * the request body.
 *
 * Routes:
 *   GET    /addresses              → list all user addresses
 *   POST   /addresses              → create a new address
 *   PATCH  /addresses/:id          → partial update an address
 *   DELETE /addresses/:id          → delete an address
 *   PATCH  /addresses/:id/default  → set an address as default
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressResponseDto } from './dto/address-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  /**
   * GET /addresses — List all addresses for the authenticated user
   */
  @Get()
  @ApiOperation({ summary: 'Get all addresses for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of user addresses, default first',
    type: [AddressResponseDto],
  })
  async findAll(
    @GetUser('id') userId: string,
  ): Promise<AddressResponseDto[]> {
    return this.addressesService.findAll(userId);
  }

  /**
   * POST /addresses — Create a new address
   */
  @Post()
  @ApiOperation({ summary: 'Create a new address' })
  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({
    status: 201,
    description: 'Address created',
    type: AddressResponseDto,
  })
  async create(
    @GetUser('id') userId: string,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<AddressResponseDto> {
    return this.addressesService.create(userId, createAddressDto);
  }

  /**
   * PATCH /addresses/:id — Partially update an address
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing address (partial)' })
  @ApiBody({ type: UpdateAddressDto })
  @ApiResponse({
    status: 200,
    description: 'Address updated',
    type: AddressResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Not your address' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async update(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<AddressResponseDto> {
    return this.addressesService.update(userId, id, updateAddressDto);
  }

  /**
   * DELETE /addresses/:id — Delete an address
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an address' })
  @ApiResponse({ status: 204, description: 'Address deleted' })
  @ApiResponse({ status: 403, description: 'Not your address' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async remove(
    @GetUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.addressesService.remove(userId, id);
  }

  /**
   * PATCH /addresses/:id/default — Set an address as the default
   */
  @Patch(':id/default')
  @ApiOperation({ summary: 'Set an address as the default' })
  @ApiResponse({
    status: 200,
    description: 'Address set as default',
    type: AddressResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Not your address' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async setDefault(
    @GetUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<AddressResponseDto> {
    return this.addressesService.setDefault(userId, id);
  }
}
