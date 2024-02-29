-- DropIndex
DROP INDEX "LikedDeals_likerId_dealsId_key";

-- AlterTable
ALTER TABLE "LikedDeals" ADD CONSTRAINT "LikedDeals_pkey" PRIMARY KEY ("likerId", "dealsId");
