-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "momoRef" TEXT,
    "cashPesewas" INTEGER NOT NULL DEFAULT 0,
    "momoPesewas" INTEGER NOT NULL DEFAULT 0,
    "bankPesewas" INTEGER NOT NULL DEFAULT 0,
    "customerId" TEXT,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "subtotal" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "tendered" INTEGER,
    "changeGiven" INTEGER,
    "oversellNote" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "servedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Sale_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TillSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Sale_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Sale_servedById_fkey" FOREIGN KEY ("servedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Sale" ("changeGiven", "createdAt", "customerId", "customerName", "customerPhone", "id", "idempotencyKey", "momoRef", "oversellNote", "paymentMethod", "receiptNumber", "servedById", "sessionId", "subtotal", "tendered", "total") SELECT "changeGiven", "createdAt", "customerId", "customerName", "customerPhone", "id", "idempotencyKey", "momoRef", "oversellNote", "paymentMethod", "receiptNumber", "servedById", "sessionId", "subtotal", "tendered", "total" FROM "Sale";
DROP TABLE "Sale";
ALTER TABLE "new_Sale" RENAME TO "Sale";
CREATE UNIQUE INDEX "Sale_receiptNumber_key" ON "Sale"("receiptNumber");
CREATE UNIQUE INDEX "Sale_idempotencyKey_key" ON "Sale"("idempotencyKey");
CREATE INDEX "Sale_sessionId_idx" ON "Sale"("sessionId");
CREATE INDEX "Sale_createdAt_idx" ON "Sale"("createdAt");
CREATE INDEX "Sale_customerId_idx" ON "Sale"("customerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
