import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { SaleModule } from './sale/sale.module';

@Module({
  imports: [UserModule, PrismaModule, AuthModule, ProductModule, SaleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
