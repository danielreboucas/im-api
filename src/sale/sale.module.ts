import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';

@Module({
  imports: [PrismaModule],
  controllers: [SaleController],
  providers: [SaleService],
})
export class SaleModule {}
