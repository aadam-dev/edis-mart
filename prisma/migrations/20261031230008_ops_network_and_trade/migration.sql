-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceKey" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "verificationStatus" TEXT NOT NULL DEFAULT 'unverified',
    "relationshipMonths" INTEGER,
    "relationshipStartedAt" DATETIME,
    "notes" TEXT,
    "sourceDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SupplierOffering" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partnerId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "unit" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SupplierOffering_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RetailerAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partnerId" TEXT NOT NULL,
    "creditLimitPesewas" INTEGER NOT NULL DEFAULT 0,
    "paymentTermsDays" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RetailerAccount_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RetailerLedgerEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partnerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amountPesewas" INTEGER NOT NULL,
    "dueDate" DATETIME,
    "reference" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RetailerLedgerEntry_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductionBatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "batchCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "plannedAt" DATETIME,
    "startedAt" DATETIME,
    "releasedAt" DATETIME,
    "yieldNotes" TEXT,
    "wasteNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BatchInput" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "batchId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "lot" TEXT,
    "quantity" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "costPesewas" INTEGER NOT NULL DEFAULT 0,
    "supplierName" TEXT,
    CONSTRAINT "BatchInput_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ProductionBatch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BatchOutput" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "batchId" TEXT NOT NULL,
    "variantId" TEXT,
    "productName" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "plannedQty" INTEGER NOT NULL DEFAULT 0,
    "actualQty" INTEGER NOT NULL DEFAULT 0,
    "unitCostPesewas" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "BatchOutput_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ProductionBatch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QualityCheck" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "batchId" TEXT NOT NULL,
    "checkpoint" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "measuredValue" TEXT,
    "notes" TEXT,
    "checkedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QualityCheck_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ProductionBatch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EquipmentAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "capacity" TEXT,
    "status" TEXT NOT NULL DEFAULT 'in_use',
    "targetDate" DATETIME,
    "acquiredDate" DATETIME,
    "costPesewas" INTEGER,
    "notes" TEXT,
    "sourceDate" DATETIME,
    "verificationStatus" TEXT NOT NULL DEFAULT 'baseline',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ComplianceItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authority" TEXT,
    "status" TEXT NOT NULL DEFAULT 'roadmap',
    "issuedAt" DATETIME,
    "expiresAt" DATETIME,
    "targetDate" DATETIME,
    "evidenceUrl" TEXT,
    "ownerNote" TEXT,
    "sourceDate" DATETIME,
    "verificationStatus" TEXT NOT NULL DEFAULT 'unverified',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TradeInquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organization" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "targetMarket" TEXT NOT NULL,
    "productsJson" TEXT NOT NULL DEFAULT '[]',
    "volumeBand" TEXT NOT NULL,
    "privateLabel" BOOLEAN NOT NULL DEFAULT false,
    "certificationNeeds" TEXT,
    "notes" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'new',
    "ownerNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BusinessBaseline" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceKey" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "valueJson" TEXT NOT NULL,
    "sourceDate" DATETIME NOT NULL,
    "verificationStatus" TEXT NOT NULL DEFAULT 'needs_verification',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT,
    "actorEmail" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Sale_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TillSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Sale_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Sale_servedById_fkey" FOREIGN KEY ("servedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Sale" ("bankPesewas", "cashPesewas", "changeGiven", "createdAt", "customerId", "customerName", "customerPhone", "id", "idempotencyKey", "momoPesewas", "momoRef", "oversellNote", "paymentMethod", "receiptNumber", "returnNote", "returnedAt", "servedById", "sessionId", "status", "subtotal", "tendered", "total", "updatedAt") SELECT "bankPesewas", "cashPesewas", "changeGiven", "createdAt", "customerId", "customerName", "customerPhone", "id", "idempotencyKey", "momoPesewas", "momoRef", "oversellNote", "paymentMethod", "receiptNumber", "returnNote", "returnedAt", "servedById", "sessionId", "status", "subtotal", "tendered", "total", "updatedAt" FROM "Sale";
DROP TABLE "Sale";
ALTER TABLE "new_Sale" RENAME TO "Sale";
CREATE UNIQUE INDEX "Sale_receiptNumber_key" ON "Sale"("receiptNumber");
CREATE UNIQUE INDEX "Sale_idempotencyKey_key" ON "Sale"("idempotencyKey");
CREATE INDEX "Sale_sessionId_idx" ON "Sale"("sessionId");
CREATE INDEX "Sale_createdAt_idx" ON "Sale"("createdAt");
CREATE INDEX "Sale_customerId_idx" ON "Sale"("customerId");
CREATE INDEX "Sale_status_idx" ON "Sale"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Partner_sourceKey_key" ON "Partner"("sourceKey");

-- CreateIndex
CREATE INDEX "Partner_kind_idx" ON "Partner"("kind");

-- CreateIndex
CREATE INDEX "Partner_status_idx" ON "Partner"("status");

-- CreateIndex
CREATE INDEX "SupplierOffering_partnerId_idx" ON "SupplierOffering"("partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "RetailerAccount_partnerId_key" ON "RetailerAccount"("partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "RetailerLedgerEntry_idempotencyKey_key" ON "RetailerLedgerEntry"("idempotencyKey");

-- CreateIndex
CREATE INDEX "RetailerLedgerEntry_partnerId_idx" ON "RetailerLedgerEntry"("partnerId");

-- CreateIndex
CREATE INDEX "RetailerLedgerEntry_createdAt_idx" ON "RetailerLedgerEntry"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionBatch_batchCode_key" ON "ProductionBatch"("batchCode");

-- CreateIndex
CREATE INDEX "BatchInput_batchId_idx" ON "BatchInput"("batchId");

-- CreateIndex
CREATE INDEX "BatchOutput_batchId_idx" ON "BatchOutput"("batchId");

-- CreateIndex
CREATE INDEX "QualityCheck_batchId_idx" ON "QualityCheck"("batchId");

-- CreateIndex
CREATE INDEX "ComplianceItem_kind_idx" ON "ComplianceItem"("kind");

-- CreateIndex
CREATE INDEX "ComplianceItem_status_idx" ON "ComplianceItem"("status");

-- CreateIndex
CREATE INDEX "TradeInquiry_status_idx" ON "TradeInquiry"("status");

-- CreateIndex
CREATE INDEX "TradeInquiry_createdAt_idx" ON "TradeInquiry"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessBaseline_sourceKey_key" ON "BusinessBaseline"("sourceKey");

-- CreateIndex
CREATE INDEX "AuditEvent_createdAt_idx" ON "AuditEvent"("createdAt");

-- CreateIndex
CREATE INDEX "AuditEvent_entityType_entityId_idx" ON "AuditEvent"("entityType", "entityId");
