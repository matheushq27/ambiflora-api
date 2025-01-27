/*
  Warnings:

  - Made the column `IDPessoa` on table `MineralPessoa` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."MineralPessoa" ALTER COLUMN "IDPessoa" SET NOT NULL,
ADD CONSTRAINT "MineralPessoa_pkey" PRIMARY KEY ("IDPessoa");
