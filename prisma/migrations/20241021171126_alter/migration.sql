-- CreateTable
CREATE TABLE "temperatures" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "temperatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temperature_instrument" (
    "instrument_id" TEXT NOT NULL,
    "temperature_id" TEXT NOT NULL,

    CONSTRAINT "temperature_instrument_pkey" PRIMARY KEY ("instrument_id","temperature_id")
);

-- AddForeignKey
ALTER TABLE "temperature_instrument" ADD CONSTRAINT "temperature_instrument_instrument_id_fkey" FOREIGN KEY ("instrument_id") REFERENCES "instruments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temperature_instrument" ADD CONSTRAINT "temperature_instrument_temperature_id_fkey" FOREIGN KEY ("temperature_id") REFERENCES "temperatures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
