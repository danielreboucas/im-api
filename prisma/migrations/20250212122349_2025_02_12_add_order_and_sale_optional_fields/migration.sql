-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "totalPrice" DOUBLE PRECISION,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Sale" ALTER COLUMN "totalPrice" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
