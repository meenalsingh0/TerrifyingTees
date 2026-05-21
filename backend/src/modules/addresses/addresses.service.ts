/**
 * AddressesService — Business logic for user address management.
 *
 * Strategy:
 *   • Every user can have multiple addresses, but only ONE can be
 *     the default at any time.
 *   • The first address a user adds is automatically made default.
 *   • When a default address is deleted, the oldest remaining
 *     address is auto-promoted to default.
 *   • All operations that touch multiple rows (unsetting old default
 *     + setting new default) use prisma.$transaction for atomicity.
 *   • Ownership is always checked before update/delete — the userId
 *     from the JWT must match the address's userId.
 */

import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressResponseDto } from './dto/address-response.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) { }

  /**
   * findAll — Return all addresses for a user, sorted so the
   * default address appears first, then by creation date ascending.
   */
  async findAll(userId: string): Promise<AddressResponseDto[]> {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'asc' },
      ],
    });
  }

  /**
   * create — Add a new address for the user.
   *
   * If isDefault is true OR this is the user's first address,
   * we use a transaction to:
   *   1. Unset isDefault on all existing addresses
   *   2. Create the new address with isDefault = true
   * This guarantees at most one default at all times.
   */
  async create(
    userId: string,
    dto: CreateAddressDto,
  ): Promise<AddressResponseDto> {
    // Check if the user has any addresses yet
    const existingCount = await this.prisma.address.count({
      where: { userId },
    });

    // First address is always default, regardless of dto.isDefault
    const shouldBeDefault = dto.isDefault === true || existingCount === 0;

    if (shouldBeDefault) {
      // Interactive transaction: unset all existing defaults, then create with isDefault = true
      const created = await this.prisma.$transaction(async (tx) => {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
        return tx.address.create({
          data: {
            userId,
            name: dto.name,
            phone: dto.phone,
            street: dto.street,
            city: dto.city,
            state: dto.state,
            pincode: dto.pincode,
            isDefault: true,
          },
        });
      });
      return created;
    }

    // Normal case: just create with isDefault = false
    return this.prisma.address.create({
      data: {
        userId,
        name: dto.name,
        phone: dto.phone,
        street: dto.street,
        city: dto.city,
        state: dto.state,
        pincode: dto.pincode,
        isDefault: false,
      },
    });
  }

  /**
   * update — Partial update of an existing address.
   *
   * Ownership check: the address must belong to the requesting user,
   * otherwise we throw ForbiddenException.
   *
   * If dto.isDefault === true, we use a transaction to unset all
   * other defaults first to maintain the single-default invariant.
   */
  async update(
    userId: string,
    addressId: string,
    dto: UpdateAddressDto,
  ): Promise<AddressResponseDto> {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // Ownership check — never trust the request body for userId
    if (address.userId !== userId) {
      throw new ForbiddenException('You do not own this address');
    }

    if (dto.isDefault === true) {
      // Interactive transaction: unset all defaults, then update this address
      const updated = await this.prisma.$transaction(async (tx) => {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
        return tx.address.update({
          where: { id: addressId },
          data: { ...dto, isDefault: true },
        });
      });
      return updated;
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: dto,
    });
  }

  /**
   * remove — Delete an address.
   *
   * If the deleted address was the default, auto-promote the oldest
   * remaining address to default within the same transaction.
   */
  async remove(userId: string, addressId: string): Promise<void> {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('You do not own this address');
    }

    if (address.isDefault) {
      // Transaction: delete, then promote the oldest remaining address
      await this.prisma.$transaction(async (tx) => {
        await tx.address.delete({ where: { id: addressId } });

        // Find the oldest remaining address for this user
        const oldest = await tx.address.findFirst({
          where: { userId },
          orderBy: { createdAt: 'asc' },
        });

        // If there's a remaining address, make it the new default
        if (oldest) {
          await tx.address.update({
            where: { id: oldest.id },
            data: { isDefault: true },
          });
        }
      });
    } else {
      // Non-default address — simple delete, no promotion needed
      await this.prisma.address.delete({ where: { id: addressId } });
    }
  }

  /**
   * setDefault — Mark a specific address as the default.
   *
   * Uses a transaction to unset all existing defaults, then
   * set the target address as default. Guarantees exactly one
   * default address at all times.
   */
  async setDefault(
    userId: string,
    addressId: string,
  ): Promise<AddressResponseDto> {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('You do not own this address');
    }

    // Interactive transaction: unset all defaults, then set this one
    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
      return tx.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      });
    });

    return updated;
  }
}
