/*
  Warnings:

  - The primary key for the `MineralProcesso` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."MineralProcesso" DROP CONSTRAINT "MineralProcesso_pkey",
ALTER COLUMN "DSProcesso" DROP NOT NULL;
