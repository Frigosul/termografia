/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `instruments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "instruments_name_key" ON "instruments"("name");
