/*
  Warnings:

  - The primary key for the `LikedDeals` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[likerId,dealsId]` on the table `LikedDeals` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `LikedDeals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LikedDeals" DROP CONSTRAINT "LikedDeals_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "LikedDeals_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "LikedDeals_likerId_dealsId_key" ON "LikedDeals"("likerId", "dealsId");
