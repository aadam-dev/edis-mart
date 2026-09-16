/*
  Warnings:

  - Added the required column `updatedAt` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
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
    "returnNote" TEXT,
    "returnedAt" DATETIME,
    "idempotencyKey" TEXT NOT NULL,
    "servedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Sale_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TillSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Sale_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Sale_servedById_fkey" FOREIGN KEY ("servedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Sale" ("bankPesewas", "cashPesewas", "changeGiven", "createdAt", "customerId", "customerName", "customerPhone", "id", "idempotencyKey", "momoPesewas", "momoRef", "oversellNote", "paymentMethod", "receiptNumber", "servedById", "sessionId", "subtotal", "tendered", "total", "status", "updatedAt") SELECT "bankPesewas", "cashPesewas", "changeGiven", "createdAt", "customerId", "customerName", "customerPhone", "id", "idempotencyKey", "momoPesewas", "momoRef", "oversellNote", "paymentMethod", "receiptNumber", "servedById", "sessionId", "subtotal", "tendered", "total", 'completed', "createdAt" FROM "Sale";
DROP TABLE "Sale";
ALTER TABLE "new_Sale" RENAME TO "Sale";
CREATE UNIQUE INDEX "Sale_receiptNumber_key" ON "Sale"("receiptNumber");
CREATE UNIQUE INDEX "Sale_idempotencyKey_key" ON "Sale"("idempotencyKey");
CREATE INDEX "Sale_sessionId_idx" ON "Sale"("sessionId");
CREATE INDEX "Sale_createdAt_idx" ON "Sale"("createdAt");
CREATE INDEX "Sale_customerId_idx" ON "Sale"("customerId");
CREATE INDEX "Sale_status_idx" ON "Sale"("status");
CREATE TABLE "new_SaleLine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "saleId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "lineTotal" INTEGER NOT NULL,
    "costStamped" INTEGER NOT NULL DEFAULT 0,
    "returnedQty" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SaleLine_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SaleLine_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SaleLine" ("costStamped", "id", "lineTotal", "productName", "quantity", "saleId", "size", "sku", "unitPrice", "variantId") SELECT "costStamped", "id", "lineTotal", "productName", "quantity", "saleId", "size", "sku", "unitPrice", "variantId" FROM "SaleLine";
DROP TABLE "SaleLine";
ALTER TABLE "new_SaleLine" RENAME TO "SaleLine";
CREATE INDEX "SaleLine_saleId_idx" ON "SaleLine"("saleId");
CREATE INDEX "SaleLine_variantId_idx" ON "SaleLine"("variantId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
