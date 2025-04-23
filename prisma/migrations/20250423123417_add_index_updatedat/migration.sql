-- CreateIndex
CREATE INDEX "idx_pressures_updated_at" ON "pressures"("updatedAt", "id");

-- CreateIndex
CREATE INDEX "idx_temperatures_updated_at" ON "temperatures"("updatedAt", "id");
