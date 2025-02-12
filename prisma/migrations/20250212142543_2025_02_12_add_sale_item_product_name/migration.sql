-- AlterTable
ALTER TABLE "Sale" ALTER COLUMN "totalPrice" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "SaleItem" ADD COLUMN     "productName" TEXT;
