/*
  Warnings:

  - You are about to drop the `_UserProducts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserProducts" DROP CONSTRAINT "_UserProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserProducts" DROP CONSTRAINT "_UserProducts_B_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_UserProducts";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
