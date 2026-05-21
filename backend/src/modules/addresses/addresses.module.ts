/**
 * AddressesModule — Wires up the addresses feature.
 *
 * Imports PrismaModule for database access, registers the
 * controller and service, and exports the service so other
 * modules (e.g., orders) can use it if needed.
 */

import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService],
})
export class AddressesModule {}
