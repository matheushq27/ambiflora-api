/*
  Warnings:

  - You are about to drop the `anm_processes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `companies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `IDCondicaoPropriedadeSolo` on table `MineralCondicaoPropriedadeSolo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IDDocumentoLegal` on table `MineralDocumentoLegal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IDEvento` on table `MineralEvento` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IDFaseProcesso` on table `MineralFaseProcesso` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IDMotivoEncerramentoSubstancia` on table `MineralMotivoEncerramentoSubstancia` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IDMunicipio` on table `MineralMunicipio` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IDPessoa` on table `MineralPessoa` required. This step will fail if there are existing NULL values in that column.
  - Made the column `DSProcesso` on table `MineralProcesso` required. This step will fail if there are existing NULL values in that column.
  - Made the column `DSProcesso` on table `MineralProcessoAssociacao` required. This step will fail if there are existing NULL values in that column.
  - Made the column `DSProcesso` on table `MineralProcessoDocumentacao` required. This step will fail if there are existing NULL values in that column.
  - Made the column `DSProcesso` on table `MineralProcessoEvento` required. This step will fail if there are existing NULL values in that column.
  - Made the column `DSProcesso` on table `MineralProcessoMunicipio` required. This step will fail if there are existing NULL values in that column.
  - Made the column `DSProcesso` on table `MineralProcessoPessoa` required. This step will fail if there are existing NULL values in that column.
  - Made the column `DSProcesso` on table `MineralProcessoPropriedadeSolo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `DSProcesso` on table `MineralProcessoSubstancia` required. This step will fail if there are existing NULL values in that column.
  - Made the column `DSProcesso` on table `MineralProcessoTitulo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IDSituacaoDocumentoLegal` on table `MineralSituacaoDocumentoLegal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IDSubstancia` on table `MineralSubstancia` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IDTipoAssociacao` on table `MineralTipoAssociacao` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IDTipoDocumento` on table `MineralTipoDocumento` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IDTipoDocumentoLegal` on table `MineralTipoDocumentoLegal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IDTipoRelacao` on table `MineralTipoRelacao` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IDTipoRepresentacaoLegal` on table `MineralTipoRepresentacaoLegal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IDTipoRequerimento` on table `MineralTipoRequerimento` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IDTipoResponsabilidadeTecnica` on table `MineralTipoResponsabilidadeTecnica` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IDTipoUsoSubstancia` on table `MineralTipoUsoSubstancia` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IDUnidadeAdministrativaRegional` on table `MineralUnidadeAdministrativaRegional` required. This step will fail if there are existing NULL values in that column.
  - Made the column `IDUnidadeProtocolizadora` on table `MineralUnidadeProtocolizadora` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."anm_processes" DROP CONSTRAINT "anm_processes_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_company_id_fkey";

-- AlterTable
ALTER TABLE "public"."MineralCondicaoPropriedadeSolo" ALTER COLUMN "IDCondicaoPropriedadeSolo" SET NOT NULL,
ADD CONSTRAINT "MineralCondicaoPropriedadeSolo_pkey" PRIMARY KEY ("IDCondicaoPropriedadeSolo");

-- AlterTable
ALTER TABLE "public"."MineralDocumentoLegal" ALTER COLUMN "IDDocumentoLegal" SET NOT NULL,
ADD CONSTRAINT "MineralDocumentoLegal_pkey" PRIMARY KEY ("IDDocumentoLegal");

-- AlterTable
ALTER TABLE "public"."MineralEvento" ALTER COLUMN "IDEvento" SET NOT NULL,
ADD CONSTRAINT "MineralEvento_pkey" PRIMARY KEY ("IDEvento");

-- AlterTable
ALTER TABLE "public"."MineralFaseProcesso" ALTER COLUMN "IDFaseProcesso" SET NOT NULL,
ADD CONSTRAINT "MineralFaseProcesso_pkey" PRIMARY KEY ("IDFaseProcesso");

-- AlterTable
ALTER TABLE "public"."MineralMotivoEncerramentoSubstancia" ALTER COLUMN "IDMotivoEncerramentoSubstancia" SET NOT NULL,
ADD CONSTRAINT "MineralMotivoEncerramentoSubstancia_pkey" PRIMARY KEY ("IDMotivoEncerramentoSubstancia");

-- AlterTable
ALTER TABLE "public"."MineralMunicipio" ALTER COLUMN "IDMunicipio" SET NOT NULL,
ADD CONSTRAINT "MineralMunicipio_pkey" PRIMARY KEY ("IDMunicipio");

-- AlterTable
ALTER TABLE "public"."MineralPessoa" ALTER COLUMN "IDPessoa" SET NOT NULL,
ADD CONSTRAINT "MineralPessoa_pkey" PRIMARY KEY ("IDPessoa");

-- AlterTable
ALTER TABLE "public"."MineralProcesso" ALTER COLUMN "DSProcesso" SET NOT NULL,
ADD CONSTRAINT "MineralProcesso_pkey" PRIMARY KEY ("DSProcesso");

-- AlterTable
ALTER TABLE "public"."MineralProcessoAssociacao" ALTER COLUMN "DSProcesso" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralProcessoDocumentacao" ALTER COLUMN "DSProcesso" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralProcessoEvento" ALTER COLUMN "DSProcesso" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralProcessoMunicipio" ALTER COLUMN "DSProcesso" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralProcessoPessoa" ALTER COLUMN "DSProcesso" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralProcessoPropriedadeSolo" ALTER COLUMN "DSProcesso" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralProcessoSubstancia" ALTER COLUMN "DSProcesso" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralProcessoTitulo" ALTER COLUMN "DSProcesso" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralSituacaoDocumentoLegal" ALTER COLUMN "IDSituacaoDocumentoLegal" SET NOT NULL,
ADD CONSTRAINT "MineralSituacaoDocumentoLegal_pkey" PRIMARY KEY ("IDSituacaoDocumentoLegal");

-- AlterTable
ALTER TABLE "public"."MineralSubstancia" ALTER COLUMN "IDSubstancia" SET NOT NULL,
ADD CONSTRAINT "MineralSubstancia_pkey" PRIMARY KEY ("IDSubstancia");

-- AlterTable
ALTER TABLE "public"."MineralTipoAssociacao" ALTER COLUMN "IDTipoAssociacao" SET NOT NULL,
ADD CONSTRAINT "MineralTipoAssociacao_pkey" PRIMARY KEY ("IDTipoAssociacao");

-- AlterTable
ALTER TABLE "public"."MineralTipoDocumento" ALTER COLUMN "IDTipoDocumento" SET NOT NULL,
ADD CONSTRAINT "MineralTipoDocumento_pkey" PRIMARY KEY ("IDTipoDocumento");

-- AlterTable
ALTER TABLE "public"."MineralTipoDocumentoLegal" ALTER COLUMN "IDTipoDocumentoLegal" SET NOT NULL,
ADD CONSTRAINT "MineralTipoDocumentoLegal_pkey" PRIMARY KEY ("IDTipoDocumentoLegal");

-- AlterTable
ALTER TABLE "public"."MineralTipoRelacao" ALTER COLUMN "IDTipoRelacao" SET NOT NULL,
ADD CONSTRAINT "MineralTipoRelacao_pkey" PRIMARY KEY ("IDTipoRelacao");

-- AlterTable
ALTER TABLE "public"."MineralTipoRepresentacaoLegal" ALTER COLUMN "IDTipoRepresentacaoLegal" SET NOT NULL,
ADD CONSTRAINT "MineralTipoRepresentacaoLegal_pkey" PRIMARY KEY ("IDTipoRepresentacaoLegal");

-- AlterTable
ALTER TABLE "public"."MineralTipoRequerimento" ALTER COLUMN "IDTipoRequerimento" SET NOT NULL,
ADD CONSTRAINT "MineralTipoRequerimento_pkey" PRIMARY KEY ("IDTipoRequerimento");

-- AlterTable
ALTER TABLE "public"."MineralTipoResponsabilidadeTecnica" ALTER COLUMN "IDTipoResponsabilidadeTecnica" SET NOT NULL,
ADD CONSTRAINT "MineralTipoResponsabilidadeTecnica_pkey" PRIMARY KEY ("IDTipoResponsabilidadeTecnica");

-- AlterTable
ALTER TABLE "public"."MineralTipoUsoSubstancia" ALTER COLUMN "IDTipoUsoSubstancia" SET NOT NULL,
ADD CONSTRAINT "MineralTipoUsoSubstancia_pkey" PRIMARY KEY ("IDTipoUsoSubstancia");

-- AlterTable
ALTER TABLE "public"."MineralUnidadeAdministrativaRegional" ALTER COLUMN "IDUnidadeAdministrativaRegional" SET NOT NULL,
ADD CONSTRAINT "MineralUnidadeAdministrativaRegional_pkey" PRIMARY KEY ("IDUnidadeAdministrativaRegional");

-- AlterTable
ALTER TABLE "public"."MineralUnidadeProtocolizadora" ALTER COLUMN "IDUnidadeProtocolizadora" SET NOT NULL,
ADD CONSTRAINT "MineralUnidadeProtocolizadora_pkey" PRIMARY KEY ("IDUnidadeProtocolizadora");

-- DropTable
DROP TABLE "public"."anm_processes";

-- DropTable
DROP TABLE "public"."companies";

-- DropTable
DROP TABLE "public"."users";

-- DropEnum
DROP TYPE "public"."UserType";
