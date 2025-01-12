-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "ambiflora";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ambiflora"."UserType" AS ENUM ('SUPER_ADMIN', 'DEVELOPER', 'ADMIN', 'USER');

-- CreateTable
CREATE TABLE "ambiflora"."companies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "postal_code" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "location_number" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ambiflora"."users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "user_type" "ambiflora"."UserType" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "company_id" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ambiflora"."anm_processes" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "userId" INTEGER,
    "cardholder_name" TEXT NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "current_phase" TEXT NOT NULL,
    "municipalities" TEXT NOT NULL,
    "requirement_type" TEXT NOT NULL,
    "situation" TEXT NOT NULL,
    "substances" TEXT NOT NULL,
    "types_of_use" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anm_processes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MineralCondicaoPropriedadeSolo" (
    "IDCondicaoPropriedadeSolo" TEXT,
    "DSCondicaoPropriedadeSolo" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralDocumentoLegal" (
    "IDDocumentoLegal" TEXT,
    "DSDocumentoLegal" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralEvento" (
    "IDEvento" TEXT,
    "DSEvento" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralFaseProcesso" (
    "IDFaseProcesso" TEXT,
    "DSFaseProcesso" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralMotivoEncerramentoSubstancia" (
    "IDMotivoEncerramentoSubstancia" TEXT,
    "DSMotivoEncerramentoSubstancia" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralMunicipio" (
    "IDMunicipio" TEXT,
    "NMMunicipio" TEXT,
    "SGUF" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralPessoa" (
    "IDPessoa" TEXT,
    "NRCPFCNPJ" TEXT,
    "TPPessoa" TEXT,
    "NMPessoa" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralProcesso" (
    "DSProcesso" TEXT,
    "NRProcesso" TEXT,
    "NRAnoProcesso" TEXT,
    "BTAtivo" TEXT,
    "NRNUP" TEXT,
    "IDTipoRequerimento" TEXT,
    "IDFaseProcesso" TEXT,
    "IDUnidadeAdministrativaRegional" TEXT,
    "IDUnidadeProtocolizadora" TEXT,
    "DTProtocolo" TEXT,
    "DTPrioridade" TEXT,
    "QTAreaHA" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralProcessoAssociacao" (
    "DSProcesso" TEXT,
    "DSProcessoAssociado" TEXT,
    "IDTipoAssociacao" TEXT,
    "DTAssociacao" TEXT,
    "DTDesassociacao" TEXT,
    "OBAssociacao" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralProcessoDocumentacao" (
    "DSProcesso" TEXT,
    "IDTipoDocumento" TEXT,
    "DTProtocolo" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralProcessoEvento" (
    "DSProcesso" TEXT,
    "IDEvento" TEXT,
    "DTEvento" TEXT,
    "OBEvento" TEXT,
    "DSPublicacaoDOU" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralProcessoMunicipio" (
    "DSProcesso" TEXT,
    "IDMunicipio" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralProcessoPessoa" (
    "DSProcesso" TEXT,
    "IDPessoa" TEXT,
    "IDTipoRelacao" TEXT,
    "IDTipoResponsabilidadeTecnica" TEXT,
    "IDTipoRepresentacaoLegal" TEXT,
    "DTPrazoArrendamento" TEXT,
    "DTInicioVigencia" TEXT,
    "DTFimVigencia" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralProcessoPropriedadeSolo" (
    "DSProcesso" TEXT,
    "IDCondicaoPropriedadeSolo" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralProcessoSubstancia" (
    "DSProcesso" TEXT,
    "IDSubstancia" TEXT,
    "IDTipoUsoSubstancia" TEXT,
    "IDMotivoEncerramentoSubstancia" TEXT,
    "DTInicioVigencia" TEXT,
    "DTFimVigencia" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralProcessoTitulo" (
    "DSProcesso" TEXT,
    "NRTitulo" TEXT,
    "IDDocumentoLegal" TEXT,
    "IDTipoDocumentoLegal" TEXT,
    "IDSituacaoDocumentoLegal" TEXT,
    "DTPublicacao" TEXT,
    "DTVencimento" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralSituacaoDocumentoLegal" (
    "IDSituacaoDocumentoLegal" TEXT,
    "DSSituacaoDocumentoLegal" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralSubstancia" (
    "IDSubstancia" TEXT,
    "NMSubstancia" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralTipoAssociacao" (
    "IDTipoAssociacao" TEXT,
    "DSTipoAssociacao" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralTipoDocumento" (
    "IDTipoDocumento" TEXT,
    "DSTipoDocumento" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralTipoDocumentoLegal" (
    "IDTipoDocumentoLegal" TEXT,
    "DSTipoDocumentoLegal" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralTipoRelacao" (
    "IDTipoRelacao" TEXT,
    "DSTipoRelacao" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralTipoRepresentacaoLegal" (
    "IDTipoRepresentacaoLegal" TEXT,
    "DSTipoRepresentacaoLegal" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralTipoRequerimento" (
    "IDTipoRequerimento" TEXT,
    "DSTipoRequerimento" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralTipoResponsabilidadeTecnica" (
    "IDTipoResponsabilidadeTecnica" TEXT,
    "DSTipoResponsabilidadeTecnica" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralTipoUsoSubstancia" (
    "IDTipoUsoSubstancia" TEXT,
    "DSTipoUsoSubstancia" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralUnidadeAdministrativaRegional" (
    "IDUnidadeAdministrativaRegional" TEXT,
    "DSUnidadeAdministrativaRegional" TEXT
);

-- CreateTable
CREATE TABLE "public"."MineralUnidadeProtocolizadora" (
    "IDUnidadeProtocolizadora" TEXT,
    "DSUnidadeProtocolizadora" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "ambiflora"."users"("email");

-- AddForeignKey
ALTER TABLE "ambiflora"."users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "ambiflora"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambiflora"."anm_processes" ADD CONSTRAINT "anm_processes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ambiflora"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

