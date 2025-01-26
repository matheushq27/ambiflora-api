/*
  Warnings:

  - The primary key for the `MineralCondicaoPropriedadeSolo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralDocumentoLegal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralEvento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralFaseProcesso` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralMotivoEncerramentoSubstancia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralMunicipio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralPessoa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralProcessoAssociacao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralSituacaoDocumentoLegal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralSubstancia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralTipoAssociacao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralTipoDocumento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralTipoDocumentoLegal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralTipoRelacao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralTipoRepresentacaoLegal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralTipoRequerimento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralTipoResponsabilidadeTecnica` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralTipoUsoSubstancia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralUnidadeAdministrativaRegional` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MineralUnidadeProtocolizadora` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."MineralProcessoAssociacao" DROP CONSTRAINT "MineralProcessoAssociacao_DSProcesso_fkey";

-- DropForeignKey
ALTER TABLE "public"."MineralProcessoAssociacao" DROP CONSTRAINT "MineralProcessoAssociacao_IDTipoAssociacao_fkey";

-- AlterTable
ALTER TABLE "public"."MineralCondicaoPropriedadeSolo" DROP CONSTRAINT "MineralCondicaoPropriedadeSolo_pkey",
ALTER COLUMN "IDCondicaoPropriedadeSolo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralDocumentoLegal" DROP CONSTRAINT "MineralDocumentoLegal_pkey",
ALTER COLUMN "IDDocumentoLegal" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralEvento" DROP CONSTRAINT "MineralEvento_pkey",
ALTER COLUMN "IDEvento" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralFaseProcesso" DROP CONSTRAINT "MineralFaseProcesso_pkey",
ALTER COLUMN "IDFaseProcesso" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralMotivoEncerramentoSubstancia" DROP CONSTRAINT "MineralMotivoEncerramentoSubstancia_pkey",
ALTER COLUMN "IDMotivoEncerramentoSubstancia" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralMunicipio" DROP CONSTRAINT "MineralMunicipio_pkey",
ALTER COLUMN "IDMunicipio" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralPessoa" DROP CONSTRAINT "MineralPessoa_pkey",
ALTER COLUMN "IDPessoa" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralProcessoAssociacao" DROP CONSTRAINT "MineralProcessoAssociacao_pkey",
ALTER COLUMN "DSProcessoAssociado" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralProcessoDocumentacao" ALTER COLUMN "DSProcesso" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralProcessoEvento" ALTER COLUMN "DSProcesso" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralProcessoMunicipio" ALTER COLUMN "DSProcesso" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralProcessoPessoa" ALTER COLUMN "DSProcesso" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralProcessoPropriedadeSolo" ALTER COLUMN "DSProcesso" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralProcessoSubstancia" ALTER COLUMN "DSProcesso" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralProcessoTitulo" ALTER COLUMN "DSProcesso" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralSituacaoDocumentoLegal" DROP CONSTRAINT "MineralSituacaoDocumentoLegal_pkey",
ALTER COLUMN "IDSituacaoDocumentoLegal" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralSubstancia" DROP CONSTRAINT "MineralSubstancia_pkey",
ALTER COLUMN "IDSubstancia" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralTipoAssociacao" DROP CONSTRAINT "MineralTipoAssociacao_pkey",
ALTER COLUMN "IDTipoAssociacao" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralTipoDocumento" DROP CONSTRAINT "MineralTipoDocumento_pkey",
ALTER COLUMN "IDTipoDocumento" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralTipoDocumentoLegal" DROP CONSTRAINT "MineralTipoDocumentoLegal_pkey",
ALTER COLUMN "IDTipoDocumentoLegal" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralTipoRelacao" DROP CONSTRAINT "MineralTipoRelacao_pkey",
ALTER COLUMN "IDTipoRelacao" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralTipoRepresentacaoLegal" DROP CONSTRAINT "MineralTipoRepresentacaoLegal_pkey",
ALTER COLUMN "IDTipoRepresentacaoLegal" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralTipoRequerimento" DROP CONSTRAINT "MineralTipoRequerimento_pkey",
ALTER COLUMN "IDTipoRequerimento" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralTipoResponsabilidadeTecnica" DROP CONSTRAINT "MineralTipoResponsabilidadeTecnica_pkey",
ALTER COLUMN "IDTipoResponsabilidadeTecnica" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralTipoUsoSubstancia" DROP CONSTRAINT "MineralTipoUsoSubstancia_pkey",
ALTER COLUMN "IDTipoUsoSubstancia" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralUnidadeAdministrativaRegional" DROP CONSTRAINT "MineralUnidadeAdministrativaRegional_pkey",
ALTER COLUMN "IDUnidadeAdministrativaRegional" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."MineralUnidadeProtocolizadora" DROP CONSTRAINT "MineralUnidadeProtocolizadora_pkey",
ALTER COLUMN "IDUnidadeProtocolizadora" DROP NOT NULL;
