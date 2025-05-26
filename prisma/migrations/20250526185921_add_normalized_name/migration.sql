/*
  Warnings:

  - A unique constraint covering the columns `[normalizedName]` on the table `instruments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "instruments" ADD COLUMN     "normalizedName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "instruments_normalizedName_key" ON "instruments"("normalizedName");
