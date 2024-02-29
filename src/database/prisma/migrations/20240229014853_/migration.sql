/*
  Warnings:

  - The primary key for the `LikedDeals` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `LikedDeals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LikedDeals" DROP CONSTRAINT "LikedDeals_pkey",
DROP COLUMN "id";
