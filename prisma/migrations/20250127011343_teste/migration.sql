/*
  Warnings:

  - Made the column `IDPessoa` on table `MineralProcessoPessoa` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."MineralProcessoPessoa" ADD COLUMN     "IdProcessoPessoa" SERIAL NOT NULL,
ADD COLUMN     "mineralPessoaIDPessoa" TEXT,
ALTER COLUMN "IDPessoa" SET NOT NULL,
ADD CONSTRAINT "MineralProcessoPessoa_pkey" PRIMARY KEY ("IdProcessoPessoa");

-- AddForeignKey
ALTER TABLE "public"."MineralProcessoPessoa" ADD CONSTRAINT "MineralProcessoPessoa_IDPessoa_fkey" FOREIGN KEY ("IDPessoa") REFERENCES "public"."MineralPessoa"("IDPessoa") ON DELETE RESTRICT ON UPDATE CASCADE;
