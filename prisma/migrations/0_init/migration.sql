-- CreateTable
CREATE TABLE "CondicaoPropriedadeSolo" (
    "IDCondicaoPropriedadeSolo" TEXT NOT NULL,
    "DSCondicaoPropriedadeSolo" TEXT,

    CONSTRAINT "key_condicao_solo" PRIMARY KEY ("IDCondicaoPropriedadeSolo")
);

-- CreateTable
CREATE TABLE "DocumentoLegal" (
    "IDDocumentoLegal" TEXT NOT NULL,
    "DSDocumentoLegal" TEXT,

    CONSTRAINT "key_documento_legal" PRIMARY KEY ("IDDocumentoLegal")
);

-- CreateTable
CREATE TABLE "Evento" (
    "IDEvento" TEXT NOT NULL,
    "DSEvento" TEXT,

    CONSTRAINT "key_evento" PRIMARY KEY ("IDEvento")
);

-- CreateTable
CREATE TABLE "FaseProcesso" (
    "IDFaseProcesso" TEXT NOT NULL,
    "DSFaseProcesso" TEXT,

    CONSTRAINT "key_fase_processo" PRIMARY KEY ("IDFaseProcesso")
);

-- CreateTable
CREATE TABLE "MotivoEncerramentoSubstancia" (
    "IDMotivoEncerramentoSubstancia" TEXT NOT NULL,
    "DSMotivoEncerramentoSubstancia" TEXT,

    CONSTRAINT "key_motivo_encerramento_substancia" PRIMARY KEY ("IDMotivoEncerramentoSubstancia")
);

-- CreateTable
CREATE TABLE "Municipio" (
    "IDMunicipio" TEXT NOT NULL,
    "NMMunicipio" TEXT,
    "SGUF" TEXT,

    CONSTRAINT "key_municipio" PRIMARY KEY ("IDMunicipio")
);

-- CreateTable
CREATE TABLE "Pessoa" (
    "IDPessoa" TEXT NOT NULL,
    "NRCPFCNPJ" TEXT,
    "TPPessoa" TEXT,
    "NMPessoa" TEXT,

    CONSTRAINT "key_pessoa" PRIMARY KEY ("IDPessoa")
);

-- CreateTable
CREATE TABLE "Processo" (
    "DSProcesso" TEXT NOT NULL,
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
    "QTAreaHA" TEXT,

    CONSTRAINT "key_processo" PRIMARY KEY ("DSProcesso")
);

-- CreateTable
CREATE TABLE "ProcessoAssociacao" (
    "DSProcesso" TEXT,
    "DSProcessoAssociado" TEXT,
    "IDTipoAssociacao" TEXT,
    "DTAssociacao" TEXT,
    "DTDesassociacao" TEXT,
    "OBAssociacao" TEXT,
    "id" SERIAL NOT NULL,

    CONSTRAINT "pk_processo_associacao" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessoDocumentacao" (
    "DSProcesso" TEXT,
    "IDTipoDocumento" TEXT,
    "DTProtocolo" TEXT,
    "id" SERIAL NOT NULL,

    CONSTRAINT "pk_processo_documentacao" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessoEvento" (
    "DSProcesso" TEXT,
    "IDEvento" TEXT,
    "DTEvento" TEXT,
    "OBEvento" TEXT,
    "DSPublicacaoDOU" TEXT,
    "id" SERIAL NOT NULL,

    CONSTRAINT "pk_processo_evento" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessoMunicipio" (
    "DSProcesso" TEXT,
    "IDMunicipio" TEXT,
    "id" SERIAL NOT NULL,

    CONSTRAINT "pk_processo_municipio" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessoPessoa" (
    "DSProcesso" TEXT,
    "IDPessoa" TEXT,
    "IDTipoRelacao" TEXT,
    "IDTipoResponsabilidadeTecnica" TEXT,
    "IDTipoRepresentacaoLegal" TEXT,
    "DTPrazoArrendamento" TEXT,
    "DTInicioVigencia" TEXT,
    "DTFimVigencia" TEXT,
    "id" SERIAL NOT NULL,

    CONSTRAINT "pk_processo_pessoa" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessoPropriedadeSolo" (
    "DSProcesso" TEXT,
    "IDCondicaoPropriedadeSolo" TEXT,
    "id" SERIAL NOT NULL,

    CONSTRAINT "pk_processo_propriedadesolo" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessoSubstancia" (
    "DSProcesso" TEXT,
    "IDSubstancia" TEXT,
    "IDTipoUsoSubstancia" TEXT,
    "IDMotivoEncerramentoSubstancia" TEXT,
    "DTInicioVigencia" TEXT,
    "DTFimVigencia" TEXT,
    "id" SERIAL NOT NULL,

    CONSTRAINT "pk_processo_substancia" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessoTitulo" (
    "DSProcesso" TEXT,
    "NRTitulo" TEXT,
    "IDDocumentoLegal" TEXT,
    "IDTipoDocumentoLegal" TEXT,
    "IDSituacaoDocumentoLegal" TEXT,
    "DTPublicacao" TEXT,
    "DTVencimento" TEXT,
    "id" SERIAL NOT NULL,

    CONSTRAINT "pk_processo_titulo" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SituacaoDocumentoLegal" (
    "IDSituacaoDocumentoLegal" TEXT NOT NULL,
    "DSSituacaoDocumentoLegal" TEXT,

    CONSTRAINT "key_situacao_documento_legal" PRIMARY KEY ("IDSituacaoDocumentoLegal")
);

-- CreateTable
CREATE TABLE "Substancia" (
    "IDSubstancia" TEXT NOT NULL,
    "NMSubstancia" TEXT,

    CONSTRAINT "key_substancia" PRIMARY KEY ("IDSubstancia")
);

-- CreateTable
CREATE TABLE "TipoAssociacao" (
    "IDTipoAssociacao" TEXT NOT NULL,
    "DSTipoAssociacao" TEXT,

    CONSTRAINT "key_associacao" PRIMARY KEY ("IDTipoAssociacao")
);

-- CreateTable
CREATE TABLE "TipoDocumento" (
    "IDTipoDocumento" TEXT NOT NULL,
    "DSTipoDocumento" TEXT,

    CONSTRAINT "key_documento" PRIMARY KEY ("IDTipoDocumento")
);

-- CreateTable
CREATE TABLE "TipoDocumentoLegal" (
    "IDTipoDocumentoLegal" TEXT NOT NULL,
    "DSTipoDocumentoLegal" TEXT,

    CONSTRAINT "key_tipo_documento_legal" PRIMARY KEY ("IDTipoDocumentoLegal")
);

-- CreateTable
CREATE TABLE "TipoRelacao" (
    "IDTipoRelacao" TEXT NOT NULL,
    "DSTipoRelacao" TEXT,

    CONSTRAINT "key_tipo_relacao" PRIMARY KEY ("IDTipoRelacao")
);

-- CreateTable
CREATE TABLE "TipoRepresentacaoLegal" (
    "IDTipoRepresentacaoLegal" TEXT NOT NULL,
    "DSTipoRepresentacaoLegal" TEXT,

    CONSTRAINT "key_tipo_representacao" PRIMARY KEY ("IDTipoRepresentacaoLegal")
);

-- CreateTable
CREATE TABLE "TipoRequerimento" (
    "IDTipoRequerimento" TEXT NOT NULL,
    "DSTipoRequerimento" TEXT,

    CONSTRAINT "key_tipo_requerimento" PRIMARY KEY ("IDTipoRequerimento")
);

-- CreateTable
CREATE TABLE "TipoResponsabilidadeTecnica" (
    "IDTipoResponsabilidadeTecnica" TEXT NOT NULL,
    "DSTipoResponsabilidadeTecnica" TEXT,

    CONSTRAINT "key_tipo_responsabilidade" PRIMARY KEY ("IDTipoResponsabilidadeTecnica")
);

-- CreateTable
CREATE TABLE "TipoUsoSubstancia" (
    "IDTipoUsoSubstancia" TEXT NOT NULL,
    "DSTipoUsoSubstancia" TEXT,

    CONSTRAINT "key_tipo_uso_substancia" PRIMARY KEY ("IDTipoUsoSubstancia")
);

-- CreateTable
CREATE TABLE "UnidadeAdministrativaRegional" (
    "IDUnidadeAdministrativaRegional" TEXT NOT NULL,
    "DSUnidadeAdministrativaRegional" TEXT,

    CONSTRAINT "key_unidade_adm_regional" PRIMARY KEY ("IDUnidadeAdministrativaRegional")
);

-- CreateTable
CREATE TABLE "UnidadeProtocolizadora" (
    "IDUnidadeProtocolizadora" TEXT NOT NULL,
    "DSUnidadeProtocolizadora" TEXT,

    CONSTRAINT "key_unidade_protocolizadora" PRIMARY KEY ("IDUnidadeProtocolizadora")
);

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "fk_id_processo_fase_processo" FOREIGN KEY ("IDFaseProcesso") REFERENCES "FaseProcesso"("IDFaseProcesso") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "fk_id_processo_tipo_requerimento" FOREIGN KEY ("IDTipoRequerimento") REFERENCES "TipoRequerimento"("IDTipoRequerimento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "fk_id_processo_unidade_administrativa" FOREIGN KEY ("IDUnidadeAdministrativaRegional") REFERENCES "UnidadeAdministrativaRegional"("IDUnidadeAdministrativaRegional") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "fk_id_processo_unidade_protocolizadora" FOREIGN KEY ("IDUnidadeProtocolizadora") REFERENCES "UnidadeProtocolizadora"("IDUnidadeProtocolizadora") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoAssociacao" ADD CONSTRAINT "fk_id_associacao" FOREIGN KEY ("IDTipoAssociacao") REFERENCES "TipoAssociacao"("IDTipoAssociacao") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoAssociacao" ADD CONSTRAINT "fk_id_processo_processos_por_associacao" FOREIGN KEY ("DSProcesso") REFERENCES "Processo"("DSProcesso") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoDocumentacao" ADD CONSTRAINT "fk_id_documento" FOREIGN KEY ("IDTipoDocumento") REFERENCES "TipoDocumento"("IDTipoDocumento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoDocumentacao" ADD CONSTRAINT "fk_id_processo_processos_por_documentacao" FOREIGN KEY ("DSProcesso") REFERENCES "Processo"("DSProcesso") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoEvento" ADD CONSTRAINT "fk_id_evento" FOREIGN KEY ("IDEvento") REFERENCES "Evento"("IDEvento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoEvento" ADD CONSTRAINT "fk_id_processo_processos_por_evento" FOREIGN KEY ("DSProcesso") REFERENCES "Processo"("DSProcesso") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoMunicipio" ADD CONSTRAINT "fk_id_municipio" FOREIGN KEY ("IDMunicipio") REFERENCES "Municipio"("IDMunicipio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoMunicipio" ADD CONSTRAINT "fk_id_processo_processos_por_municipio" FOREIGN KEY ("DSProcesso") REFERENCES "Processo"("DSProcesso") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoPessoa" ADD CONSTRAINT "fk_id_processo_pessoa" FOREIGN KEY ("IDPessoa") REFERENCES "Pessoa"("IDPessoa") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoPessoa" ADD CONSTRAINT "fk_id_processo_processos_por_pessoa" FOREIGN KEY ("DSProcesso") REFERENCES "Processo"("DSProcesso") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoPessoa" ADD CONSTRAINT "fk_id_processo_representacao_legal" FOREIGN KEY ("IDTipoRepresentacaoLegal") REFERENCES "TipoRepresentacaoLegal"("IDTipoRepresentacaoLegal") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoPessoa" ADD CONSTRAINT "fk_id_processo_responsabilidade_tecnica" FOREIGN KEY ("IDTipoResponsabilidadeTecnica") REFERENCES "TipoResponsabilidadeTecnica"("IDTipoResponsabilidadeTecnica") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoPessoa" ADD CONSTRAINT "fk_id_processo_tipo_relacao" FOREIGN KEY ("IDTipoRelacao") REFERENCES "TipoRelacao"("IDTipoRelacao") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoPropriedadeSolo" ADD CONSTRAINT "fk_id_processo_processos_por_propriedade_solo" FOREIGN KEY ("DSProcesso") REFERENCES "Processo"("DSProcesso") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoPropriedadeSolo" ADD CONSTRAINT "fk_id_processo_propriedade_solo" FOREIGN KEY ("IDCondicaoPropriedadeSolo") REFERENCES "CondicaoPropriedadeSolo"("IDCondicaoPropriedadeSolo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoSubstancia" ADD CONSTRAINT "fk_id_processo_encerramento_substancia" FOREIGN KEY ("IDMotivoEncerramentoSubstancia") REFERENCES "MotivoEncerramentoSubstancia"("IDMotivoEncerramentoSubstancia") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoSubstancia" ADD CONSTRAINT "fk_id_processo_processos_por_substancia" FOREIGN KEY ("DSProcesso") REFERENCES "Processo"("DSProcesso") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoSubstancia" ADD CONSTRAINT "fk_id_processo_substancia" FOREIGN KEY ("IDSubstancia") REFERENCES "Substancia"("IDSubstancia") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoSubstancia" ADD CONSTRAINT "fk_id_processo_tipo_substancia" FOREIGN KEY ("IDTipoUsoSubstancia") REFERENCES "TipoUsoSubstancia"("IDTipoUsoSubstancia") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoTitulo" ADD CONSTRAINT "fk_id_processo_processos_por_titulo" FOREIGN KEY ("DSProcesso") REFERENCES "Processo"("DSProcesso") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoTitulo" ADD CONSTRAINT "fk_id_processo_titulo_documento" FOREIGN KEY ("IDDocumentoLegal") REFERENCES "DocumentoLegal"("IDDocumentoLegal") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoTitulo" ADD CONSTRAINT "fk_id_processo_titulo_situacao_documento" FOREIGN KEY ("IDSituacaoDocumentoLegal") REFERENCES "SituacaoDocumentoLegal"("IDSituacaoDocumentoLegal") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProcessoTitulo" ADD CONSTRAINT "fk_id_processo_titulo_tipo_documento" FOREIGN KEY ("IDTipoDocumentoLegal") REFERENCES "TipoDocumentoLegal"("IDTipoDocumentoLegal") ON DELETE NO ACTION ON UPDATE NO ACTION;
