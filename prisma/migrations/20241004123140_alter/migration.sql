/*
  Warnings:

  - You are about to drop the `charts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "charts";

-- CreateTable
CREATE TABLE "chambers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chambers_pkey" PRIMARY KEY ("id")
);
