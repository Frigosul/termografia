/*
  Warnings:

  - You are about to drop the column `isActiive` on the `instruments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "instruments" DROP COLUMN "isActiive",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;
