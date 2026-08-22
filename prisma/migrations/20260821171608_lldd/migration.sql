/*
  Warnings:

  - You are about to drop the column `userAgen` on the `RefreshToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "userAgen",
ADD COLUMN     "userAgent" TEXT;
