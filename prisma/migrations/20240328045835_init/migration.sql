/*
  Warnings:

  - Added the required column `province` to the `CurrentLocations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regency` to the `CurrentLocations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `IdentityCards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regency` to the `IdentityCards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CurrentLocations" ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "regency" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "IdentityCards" ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "regency" TEXT NOT NULL;
