/*
  Warnings:

  - You are about to drop the column `mineralProcessoDSProcesso` on the `MineralProcessoAssociacao` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MineralProcessoAssociacao" DROP CONSTRAINT "MineralProcessoAssociacao_mineralProcessoDSProcesso_fkey";

-- AlterTable
ALTER TABLE "public"."MineralProcessoAssociacao" DROP COLUMN "mineralProcessoDSProcesso";

-- AddForeignKey
ALTER TABLE "public"."MineralProcessoAssociacao" ADD CONSTRAINT "MineralProcessoAssociacao_DSProcesso_fkey" FOREIGN KEY ("DSProcesso") REFERENCES "public"."MineralProcesso"("DSProcesso") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MineralProcessoAssociacao" ADD CONSTRAINT "MineralProcessoAssociacao_IDTipoAssociacao_fkey" FOREIGN KEY ("IDTipoAssociacao") REFERENCES "public"."MineralTipoAssociacao"("IDTipoAssociacao") ON DELETE SET NULL ON UPDATE CASCADE;
