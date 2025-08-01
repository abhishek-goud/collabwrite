-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('read', 'write', 'admin');

-- CreateTable
CREATE TABLE "permissions" (
    "userId" VARCHAR(255) NOT NULL,
    "docId" VARCHAR(255) NOT NULL,
    "access" "AccessLevel" NOT NULL DEFAULT 'read',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("userId","docId")
);

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_docId_fkey" FOREIGN KEY ("docId") REFERENCES "documents"("docId") ON DELETE CASCADE ON UPDATE CASCADE;
