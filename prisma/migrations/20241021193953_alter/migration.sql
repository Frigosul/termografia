/*
  Warnings:

  - Added the required column `editValue` to the `temperatures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "instruments" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "temperatures" ADD COLUMN     "editValue" DOUBLE PRECISION NOT NULL;
