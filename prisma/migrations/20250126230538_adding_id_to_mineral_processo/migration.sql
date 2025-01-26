/*
  Warnings:

  - Made the column `DSProcesso` on table `MineralProcesso` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."MineralProcesso" ALTER COLUMN "DSProcesso" SET NOT NULL,
ADD CONSTRAINT "MineralProcesso_pkey" PRIMARY KEY ("DSProcesso");
