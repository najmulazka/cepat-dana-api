/*
  Warnings:

  - You are about to drop the column `marialStatus` on the `IdentityCards` table. All the data in the column will be lost.
  - Added the required column `maritalStatus` to the `IdentityCards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IdentityCards" DROP COLUMN "marialStatus",
ADD COLUMN     "maritalStatus" TEXT NOT NULL;
