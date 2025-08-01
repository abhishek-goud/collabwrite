-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "docId" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL DEFAULT 'Untitled Document',
    "content" TEXT NOT NULL DEFAULT '',
    "createdBy" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_docId_key" ON "documents"("docId");

-- CreateIndex
CREATE INDEX "documents_docId_idx" ON "documents"("docId");

-- CreateIndex
CREATE INDEX "documents_createdBy_idx" ON "documents"("createdBy");
