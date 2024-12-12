/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `union_instruments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `union_instruments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "union_instruments" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "union_instruments_name_key" ON "union_instruments"("name");
