/*
  Warnings:

  - The primary key for the `documents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `documents` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "documents_docId_idx";

-- DropIndex
DROP INDEX "documents_docId_key";

-- DropIndex
DROP INDEX "users_userId_idx";

-- DropIndex
DROP INDEX "users_userId_key";

-- AlterTable
ALTER TABLE "documents" DROP CONSTRAINT "documents_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "documents_pkey" PRIMARY KEY ("docId");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("userId");
