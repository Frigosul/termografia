-- AlterTable
ALTER TABLE "chambers" ADD COLUMN     "error" TEXT,
ADD COLUMN     "isSensorError" BOOLEAN NOT NULL DEFAULT false;
