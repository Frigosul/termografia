/*
  Warnings:

  - Made the column `normalizedName` on table `instruments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "instruments" ALTER COLUMN "normalizedName" SET NOT NULL;
