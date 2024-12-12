-- CreateTable
CREATE TABLE "pressures" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editValue" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "userUpdatedAt" TEXT,

    CONSTRAINT "pressures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pressure_instrument" (
    "instrument_id" TEXT NOT NULL,
    "pressure_id" TEXT NOT NULL,

    CONSTRAINT "pressure_instrument_pkey" PRIMARY KEY ("instrument_id","pressure_id")
);

-- CreateTable
CREATE TABLE "union_instruments" (
    "id" TEXT NOT NULL,
    "first_instrument_id" TEXT NOT NULL,
    "second_instrument_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "union_instruments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pressure_instrument" ADD CONSTRAINT "pressure_instrument_instrument_id_fkey" FOREIGN KEY ("instrument_id") REFERENCES "instruments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pressure_instrument" ADD CONSTRAINT "pressure_instrument_pressure_id_fkey" FOREIGN KEY ("pressure_id") REFERENCES "pressures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
