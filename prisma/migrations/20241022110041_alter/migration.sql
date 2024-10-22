-- AlterTable
ALTER TABLE "temperatures" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userUpdatedAt" TEXT;
