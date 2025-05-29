/*
  Warnings:

  - Made the column `description` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `OrderItems` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "OrderItems" ALTER COLUMN "description" SET NOT NULL;
