-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "description" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "OrderItems" ADD COLUMN     "description" TEXT DEFAULT '';
