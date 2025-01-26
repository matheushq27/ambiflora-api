/*
  Warnings:

  - Made the column `DSProcessoAssociado` on table `MineralProcessoAssociacao` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."MineralProcessoAssociacao" ADD COLUMN     "mineralProcessoDSProcesso" TEXT,
ALTER COLUMN "DSProcesso" DROP NOT NULL,
ALTER COLUMN "DSProcessoAssociado" SET NOT NULL,
ADD CONSTRAINT "MineralProcessoAssociacao_pkey" PRIMARY KEY ("DSProcessoAssociado");

-- AddForeignKey
ALTER TABLE "public"."MineralProcessoAssociacao" ADD CONSTRAINT "MineralProcessoAssociacao_mineralProcessoDSProcesso_fkey" FOREIGN KEY ("mineralProcessoDSProcesso") REFERENCES "public"."MineralProcesso"("DSProcesso") ON DELETE SET NULL ON UPDATE CASCADE;
