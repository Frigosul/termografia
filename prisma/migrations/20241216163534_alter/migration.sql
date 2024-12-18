-- AddForeignKey
ALTER TABLE "union_instruments" ADD CONSTRAINT "union_instruments_first_instrument_id_fkey" FOREIGN KEY ("first_instrument_id") REFERENCES "instruments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "union_instruments" ADD CONSTRAINT "union_instruments_second_instrument_id_fkey" FOREIGN KEY ("second_instrument_id") REFERENCES "instruments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
