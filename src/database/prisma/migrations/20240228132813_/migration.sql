/*
  Warnings:

  - Added the required column `imgUrl` to the `Deals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deals" ADD COLUMN     "imgUrl" TEXT NOT NULL;
