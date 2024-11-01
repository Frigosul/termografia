-- DropForeignKey
ALTER TABLE "temperature_instrument" DROP CONSTRAINT "temperature_instrument_instrument_id_fkey";

-- AlterTable
ALTER TABLE "temperatures" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "temperature_instrument" ADD CONSTRAINT "temperature_instrument_instrument_id_fkey" FOREIGN KEY ("instrument_id") REFERENCES "instruments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
