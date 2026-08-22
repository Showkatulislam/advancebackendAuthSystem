/*
  Warnings:

  - You are about to drop the column `replaceByTokenId` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `RefreshToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jti]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jti` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_sessionId_fkey";

-- DropIndex
DROP INDEX "RefreshToken_userId_sessionId_idx";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "replaceByTokenId",
DROP COLUMN "sessionId",
ADD COLUMN     "jti" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_jti_key" ON "RefreshToken"("jti");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");
