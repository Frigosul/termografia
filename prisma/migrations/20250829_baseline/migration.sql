-- CreateEnum
CREATE TYPE "InstrumentType" AS ENUM ('TEMPERATURE', 'PRESSURE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instruments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_sitrad" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "max_value" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "min_value" DOUBLE PRECISION NOT NULL DEFAULT -100,
    "order_display" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "type" "InstrumentType" NOT NULL,

    CONSTRAINT "instruments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instrument_data" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "instrument_id" TEXT NOT NULL,
    "user_edit_data" TEXT,
    "data" DOUBLE PRECISION NOT NULL,
    "edit_data" DOUBLE PRECISION NOT NULL,
    "generate_data" DOUBLE PRECISION,

    CONSTRAINT "instrument_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "union_instruments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "first_instrument_id" TEXT NOT NULL,
    "second_instrument_id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "union_instruments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "instruments_slug_key" ON "instruments"("slug");

-- CreateIndex
CREATE INDEX "instrument_time_index" ON "instrument_data"("instrument_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "instrument_data_instrument_id_created_at_key" ON "instrument_data"("instrument_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "union_instruments_name_key" ON "union_instruments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "union_instruments_first_instrument_id_second_instrument_id_key" ON "union_instruments"("first_instrument_id", "second_instrument_id");

-- AddForeignKey
ALTER TABLE "instrument_data" ADD CONSTRAINT "instrument_data_instrument_id_fkey" FOREIGN KEY ("instrument_id") REFERENCES "instruments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "union_instruments" ADD CONSTRAINT "union_instruments_first_instrument_id_fkey" FOREIGN KEY ("first_instrument_id") REFERENCES "instruments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "union_instruments" ADD CONSTRAINT "union_instruments_second_instrument_id_fkey" FOREIGN KEY ("second_instrument_id") REFERENCES "instruments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

