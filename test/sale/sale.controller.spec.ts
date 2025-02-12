import { Test, TestingModule } from '@nestjs/testing';
import { SaleController } from '../../src/sale/sale.controller';
import { SaleService } from '../../src/sale/sale.service';

describe('SaleController', () => {
  let controller: SaleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleController],
      providers: [SaleService],
    }).compile();

    controller = module.get<SaleController>(SaleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
