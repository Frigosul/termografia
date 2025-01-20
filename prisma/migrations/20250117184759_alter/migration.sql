/*
  Warnings:

  - The `model` column on the `instruments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "instruments" DROP COLUMN "model",
ADD COLUMN     "model" INTEGER;
