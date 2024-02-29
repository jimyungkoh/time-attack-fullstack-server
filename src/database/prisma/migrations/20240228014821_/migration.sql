-- CreateTable
CREATE TABLE "Deals" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "imgSrc" TEXT,
    "favoriteCnt" INTEGER NOT NULL DEFAULT 0,
    "viewCnt" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikedDeals" (
    "likerId" TEXT NOT NULL,
    "dealsId" TEXT NOT NULL,

    CONSTRAINT "LikedDeals_pkey" PRIMARY KEY ("likerId","dealsId")
);

-- AddForeignKey
ALTER TABLE "Deals" ADD CONSTRAINT "Deals_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedDeals" ADD CONSTRAINT "LikedDeals_likerId_fkey" FOREIGN KEY ("likerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedDeals" ADD CONSTRAINT "LikedDeals_dealsId_fkey" FOREIGN KEY ("dealsId") REFERENCES "Deals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
