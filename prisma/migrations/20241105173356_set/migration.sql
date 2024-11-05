-- AlterTable
ALTER TABLE "instruments" ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'temp';
