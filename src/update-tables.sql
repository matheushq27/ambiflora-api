-- MUNICIPIO
ALTER TABLE "Municipio"
ADD CONSTRAINT key_municipio PRIMARY KEY ("IDMunicipio");


ALTER TABLE "ProcessoMunicipio"
ADD CONSTRAINT fk_id_municipio 
FOREIGN KEY ("IDMunicipio") references "Municipio"("IDMunicipio");


-- EVENTO
ALTER TABLE "Evento"
ADD CONSTRAINT key_evento PRIMARY KEY ("IDEvento");

ALTER TABLE "ProcessoEvento"
ADD CONSTRAINT fk_id_evento 
FOREIGN KEY ("IDEvento") references "Evento"("IDEvento");


--DOCUMENTO
ALTER TABLE "TipoDocumento"
ADD CONSTRAINT key_documento PRIMARY KEY ("IDTipoDocumento");

ALTER TABLE "ProcessoDocumentacao" 
ADD CONSTRAINT fk_id_documento 
FOREIGN KEY ("IDTipoDocumento") references "TipoDocumento"("IDTipoDocumento");


--ASSOCIACAO
ALTER TABLE "TipoAssociacao"
ADD CONSTRAINT key_associacao PRIMARY KEY ("IDTipoAssociacao");

ALTER TABLE "ProcessoAssociacao" 
ADD CONSTRAINT fk_id_associacao 
FOREIGN KEY ("IDTipoAssociacao") references "TipoAssociacao"("IDTipoAssociacao");


--GERAIS
ALTER TABLE "UnidadeProtocolizadora" 
ADD CONSTRAINT key_unidade_protocolizadora PRIMARY KEY ("IDUnidadeProtocolizadora");

ALTER TABLE "UnidadeAdministrativaRegional" 
ADD CONSTRAINT key_unidade_adm_regional PRIMARY KEY ("IDUnidadeAdministrativaRegional");

ALTER TABLE "FaseProcesso" 
ADD CONSTRAINT key_fase_processo PRIMARY KEY ("IDFaseProcesso");

ALTER TABLE "TipoRequerimento" 
ADD CONSTRAINT key_tipo_requerimento PRIMARY KEY ("IDTipoRequerimento");


--PROPRIEDADE
ALTER TABLE "CondicaoPropriedadeSolo" 
ADD CONSTRAINT key_condicao_solo PRIMARY KEY ("IDCondicaoPropriedadeSolo");

ALTER TABLE "ProcessoPropriedadeSolo" 
ADD CONSTRAINT fk_id_processo_propriedade_solo
FOREIGN KEY ("IDCondicaoPropriedadeSolo") references "CondicaoPropriedadeSolo"("IDCondicaoPropriedadeSolo");


--SUBSTANCIA
ALTER TABLE "Substancia" 
ADD CONSTRAINT key_substancia PRIMARY KEY ("IDSubstancia");

ALTER TABLE "TipoUsoSubstancia" 
ADD CONSTRAINT key_tipo_uso_substancia PRIMARY KEY ("IDTipoUsoSubstancia");

ALTER TABLE "MotivoEncerramentoSubstancia" 
ADD CONSTRAINT key_motivo_encerramento_substancia PRIMARY KEY ("IDMotivoEncerramentoSubstancia");

INSERT INTO "Substancia" ("IDSubstancia")
SELECT DISTINCT "IDSubstancia"
FROM "ProcessoSubstancia"
WHERE "IDSubstancia" NOT IN (SELECT "IDSubstancia" FROM "Substancia");

ALTER TABLE "ProcessoSubstancia" 
ADD CONSTRAINT fk_id_processo_substancia
FOREIGN KEY ("IDSubstancia") references "Substancia"("IDSubstancia");

ALTER TABLE "ProcessoSubstancia" 
ADD CONSTRAINT fk_id_processo_tipo_substancia
FOREIGN KEY ("IDTipoUsoSubstancia") references "TipoUsoSubstancia"("IDTipoUsoSubstancia");

INSERT INTO "MotivoEncerramentoSubstancia" ("IDMotivoEncerramentoSubstancia", "DSMotivoEncerramentoSubstancia") values ('', 'Não Encerrada'); 
INSERT INTO "MotivoEncerramentoSubstancia" ("IDMotivoEncerramentoSubstancia", "DSMotivoEncerramentoSubstancia") values ('0', 'Outro'); 

ALTER TABLE "ProcessoSubstancia" 
ADD CONSTRAINT fk_id_processo_encerramento_substancia
FOREIGN KEY ("IDMotivoEncerramentoSubstancia") references "MotivoEncerramentoSubstancia"("IDMotivoEncerramentoSubstancia");


--TITULO
ALTER TABLE "DocumentoLegal" 
ADD CONSTRAINT key_documento_legal PRIMARY KEY ("IDDocumentoLegal");

ALTER TABLE "TipoDocumentoLegal" 
ADD CONSTRAINT key_tipo_documento_legal PRIMARY KEY ("IDTipoDocumentoLegal");

ALTER TABLE "SituacaoDocumentoLegal" 
ADD CONSTRAINT key_Situacao_documento_legal PRIMARY KEY ("IDSituacaoDocumentoLegal");

INSERT INTO "DocumentoLegal" ("IDDocumentoLegal", "DSDocumentoLegal")
SELECT DISTINCT "IDDocumentoLegal", 'Outros'
FROM "ProcessoTitulo"
WHERE "IDDocumentoLegal" NOT IN (SELECT "IDDocumentoLegal" FROM "DocumentoLegal");

ALTER TABLE "ProcessoTitulo" 
ADD CONSTRAINT fk_id_processo_titulo_documento
FOREIGN KEY ("IDDocumentoLegal") references "DocumentoLegal"("IDDocumentoLegal");

ALTER TABLE "ProcessoTitulo" 
ADD CONSTRAINT fk_id_processo_titulo_tipo_documento
FOREIGN KEY ("IDTipoDocumentoLegal") references "TipoDocumentoLegal"("IDTipoDocumentoLegal");

ALTER TABLE "ProcessoTitulo" 
ADD CONSTRAINT fk_id_processo_titulo_situacao_documento
FOREIGN KEY ("IDSituacaoDocumentoLegal") references "SituacaoDocumentoLegal"("IDSituacaoDocumentoLegal");


--PESSOA
ALTER TABLE "Pessoa" 
ADD CONSTRAINT key_pessoa PRIMARY KEY ("IDPessoa");

ALTER TABLE "TipoRelacao" 
ADD CONSTRAINT key_tipo_relacao PRIMARY KEY ("IDTipoRelacao");

ALTER TABLE "TipoResponsabilidadeTecnica" 
ADD CONSTRAINT key_tipo_responsabilidade PRIMARY KEY ("IDTipoResponsabilidadeTecnica");

ALTER TABLE "TipoRepresentacaoLegal" 
ADD CONSTRAINT key_tipo_representacao PRIMARY KEY ("IDTipoRepresentacaoLegal");

INSERT INTO "Pessoa" ("IDPessoa")
SELECT DISTINCT "IDPessoa"
FROM "ProcessoPessoa" mpp
WHERE NOT EXISTS (
    SELECT 1 
    FROM "Pessoa" mp
    WHERE mp."IDPessoa" = mpp."IDPessoa"
);

ALTER TABLE "ProcessoPessoa" 
ADD CONSTRAINT fk_id_processo_pessoa
FOREIGN KEY ("IDPessoa") references "Pessoa"("IDPessoa");

ALTER TABLE "ProcessoPessoa" 
ADD CONSTRAINT fk_id_processo_tipo_relacao
FOREIGN KEY ("IDTipoRelacao") references "TipoRelacao"("IDTipoRelacao");

--INSERT INTO "TipoResponsabilidadeTecnica" ("IDTipoResponsabilidadeTecnica", "DSTipoResponsabilidadeTecnica")
--SELECT DISTINCT "IDTipoResponsabilidadeTecnica", 'Outro'
--FROM "ProcessoPessoa" mpp
--WHERE NOT EXISTS (
  --  SELECT 1 
 --   FROM "TipoResponsabilidadeTecnica" mp
 --   WHERE mp."IDTipoResponsabilidadeTecnica" = mpp."IDTipoResponsabilidadeTecnica"
--);

INSERT INTO "TipoResponsabilidadeTecnica" ("IDTipoResponsabilidadeTecnica", "DSTipoResponsabilidadeTecnica")
SELECT DISTINCT "IDTipoResponsabilidadeTecnica", 'Outro'
FROM "ProcessoPessoa" mpp
WHERE mpp."IDTipoResponsabilidadeTecnica" IS NOT NULL -- <--- aqui está a correção
  AND NOT EXISTS (
    SELECT 1 
    FROM "TipoResponsabilidadeTecnica" mp
    WHERE mp."IDTipoResponsabilidadeTecnica" = mpp."IDTipoResponsabilidadeTecnica"
);


ALTER TABLE "ProcessoPessoa" 
ADD CONSTRAINT fk_id_processo_responsabilidade_tecnica
FOREIGN KEY ("IDTipoResponsabilidadeTecnica") references "TipoResponsabilidadeTecnica"("IDTipoResponsabilidadeTecnica");

--INSERT INTO "TipoRepresentacaoLegal" ("IDTipoRepresentacaoLegal", "DSTipoRepresentacaoLegal")
--SELECT DISTINCT "IDTipoRepresentacaoLegal", ''
--FROM "ProcessoPessoa" mpp
--WHERE NOT EXISTS (
  --  SELECT 1 
  --  FROM "TipoRepresentacaoLegal" mp
   -- WHERE mp."IDTipoRepresentacaoLegal" = mpp."IDTipoRepresentacaoLegal"
--);

INSERT INTO "TipoRepresentacaoLegal" ("IDTipoRepresentacaoLegal", "DSTipoRepresentacaoLegal")
SELECT DISTINCT "IDTipoRepresentacaoLegal", 'Sem descrição'
FROM "ProcessoPessoa" mpp
WHERE "IDTipoRepresentacaoLegal" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 
    FROM "TipoRepresentacaoLegal" mp
    WHERE mp."IDTipoRepresentacaoLegal" = mpp."IDTipoRepresentacaoLegal"
);


ALTER TABLE "ProcessoPessoa" 
ADD CONSTRAINT fk_id_processo_representacao_legal
FOREIGN KEY ("IDTipoRepresentacaoLegal") references "TipoRepresentacaoLegal"("IDTipoRepresentacaoLegal");


--PROCESSO
ALTER TABLE "Processo" 
ADD CONSTRAINT key_processo PRIMARY KEY ("DSProcesso");

--INSERT INTO "TipoRequerimento" ("IDTipoRequerimento", "DSTipoRequerimento")
--SELECT DISTINCT "IDTipoRequerimento", ''
--FROM "Processo" mpp
--WHERE NOT EXISTS (
  --  SELECT 1 
    --FROM "TipoRequerimento" mp
    --WHERE mp."IDTipoRequerimento" = mpp."IDTipoRequerimento"
--);

INSERT INTO "TipoRequerimento" ("IDTipoRequerimento", "DSTipoRequerimento")
SELECT DISTINCT "IDTipoRequerimento", ''
FROM "Processo" mpp
WHERE mpp."IDTipoRequerimento" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 
    FROM "TipoRequerimento" mp
    WHERE mp."IDTipoRequerimento" = mpp."IDTipoRequerimento"
);


ALTER TABLE "Processo" 
ADD CONSTRAINT fk_id_processo_tipo_requerimento
FOREIGN KEY ("IDTipoRequerimento") references "TipoRequerimento"("IDTipoRequerimento");

ALTER TABLE "Processo" 
ADD CONSTRAINT fk_id_processo_fase_processo
FOREIGN KEY ("IDFaseProcesso") references "FaseProcesso"("IDFaseProcesso");

ALTER TABLE "Processo" 
ADD CONSTRAINT fk_id_processo_unidade_administrativa
FOREIGN KEY ("IDUnidadeAdministrativaRegional") references "UnidadeAdministrativaRegional"("IDUnidadeAdministrativaRegional");

--INSERT INTO "UnidadeProtocolizadora" ("IDUnidadeProtocolizadora", "DSUnidadeProtocolizadora")
--SELECT DISTINCT "IDUnidadeProtocolizadora", ''
--FROM "Processo" mpp
--WHERE NOT EXISTS (
    --SELECT 1 
    --FROM "UnidadeProtocolizadora" mp
    --WHERE mp."IDUnidadeProtocolizadora" = mpp."IDUnidadeProtocolizadora"
--);

INSERT INTO "UnidadeProtocolizadora" ("IDUnidadeProtocolizadora", "DSUnidadeProtocolizadora")
SELECT DISTINCT "IDUnidadeProtocolizadora", ''
FROM "Processo" mpp
WHERE "IDUnidadeProtocolizadora" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 
    FROM "UnidadeProtocolizadora" mp
    WHERE mp."IDUnidadeProtocolizadora" = mpp."IDUnidadeProtocolizadora"
);


ALTER TABLE "Processo" 
ADD CONSTRAINT fk_id_processo_unidade_protocolizadora
FOREIGN KEY ("IDUnidadeProtocolizadora") references "UnidadeProtocolizadora"("IDUnidadeProtocolizadora");


--Ligadas a Processo

INSERT INTO "ProcessoMunicipio" ("DSProcesso")
SELECT DISTINCT "DSProcesso"
FROM "Processo" mpp
WHERE NOT EXISTS (
    SELECT 1 
    FROM "ProcessoMunicipio" mp
    WHERE mp."DSProcesso" = mpp."DSProcesso"
);

INSERT INTO "Processo" ("DSProcesso")
SELECT DISTINCT "DSProcesso"
FROM "ProcessoMunicipio" mpp
WHERE NOT EXISTS (
    SELECT 1 
    FROM "Processo" mp
    WHERE mp."DSProcesso" = mpp."DSProcesso"
);


ALTER TABLE "ProcessoMunicipio" 
ADD CONSTRAINT fk_id_processo_processos_por_municipio
FOREIGN KEY ("DSProcesso") references "Processo"("DSProcesso");

INSERT INTO "Processo" ("DSProcesso")
SELECT DISTINCT "DSProcesso"
FROM "ProcessoEvento" mpp
WHERE NOT EXISTS (
    SELECT 1 
    FROM "Processo" mp
    WHERE mp."DSProcesso" = mpp."DSProcesso"
);

ALTER TABLE "ProcessoEvento" 
ADD CONSTRAINT fk_id_processo_processos_por_evento
FOREIGN KEY ("DSProcesso") references "Processo"("DSProcesso");

ALTER TABLE "ProcessoDocumentacao" 
ADD CONSTRAINT fk_id_processo_processos_por_documentacao
FOREIGN KEY ("DSProcesso") references "Processo"("DSProcesso");

ALTER TABLE "ProcessoAssociacao" 
ADD CONSTRAINT fk_id_processo_processos_por_associacao
FOREIGN KEY ("DSProcesso") references "Processo"("DSProcesso");

ALTER TABLE "ProcessoPropriedadeSolo" 
ADD CONSTRAINT fk_id_processo_processos_por_propriedade_solo
FOREIGN KEY ("DSProcesso") references "Processo"("DSProcesso");

ALTER TABLE "ProcessoSubstancia" 
ADD CONSTRAINT fk_id_processo_processos_por_substancia
FOREIGN KEY ("DSProcesso") references "Processo"("DSProcesso");

ALTER TABLE "ProcessoTitulo" 
ADD CONSTRAINT fk_id_processo_processos_por_titulo
FOREIGN KEY ("DSProcesso") references "Processo"("DSProcesso");

ALTER TABLE "ProcessoPessoa" 
ADD CONSTRAINT fk_id_processo_processos_por_pessoa
FOREIGN KEY ("DSProcesso") references "Processo"("DSProcesso");

ALTER TABLE "ProcessoSubstancia" ADD COLUMN id SERIAL;
WITH numeracao AS (
    SELECT ctid, ROW_NUMBER() OVER () AS novo_id FROM "ProcessoSubstancia"
)
UPDATE "ProcessoSubstancia" t
SET id = n.novo_id
FROM numeracao n
WHERE t.ctid = n.ctid;
ALTER TABLE "ProcessoSubstancia" ADD CONSTRAINT pk_processo_substancia PRIMARY KEY (id);



ALTER TABLE "ProcessoTitulo" ADD COLUMN id SERIAL;
WITH numeracao AS (
    SELECT ctid, ROW_NUMBER() OVER () AS novo_id FROM "ProcessoTitulo"
)
UPDATE "ProcessoTitulo" t
SET id = n.novo_id
FROM numeracao n
WHERE t.ctid = n.ctid;

ALTER TABLE "ProcessoTitulo" ADD CONSTRAINT pk_processo_titulo PRIMARY KEY (id);

ALTER TABLE "ProcessoPessoa" ADD COLUMN id SERIAL;
UPDATE "ProcessoPessoa" t
SET id = sub.novo_id
FROM (
    SELECT id, ROW_NUMBER() OVER () AS novo_id FROM "ProcessoPessoa"
) AS sub
WHERE t.id IS NULL;
ALTER TABLE "ProcessoPessoa" ADD CONSTRAINT pk_processo_pessoa PRIMARY KEY (id);


ALTER TABLE "ProcessoMunicipio" ADD COLUMN id SERIAL;
UPDATE "ProcessoMunicipio" t
SET id = sub.novo_id
FROM (
    SELECT id, ROW_NUMBER() OVER () AS novo_id FROM "ProcessoMunicipio"
) AS sub
WHERE t.id IS NULL;
ALTER TABLE "ProcessoMunicipio" ADD CONSTRAINT pk_processo_Municipio PRIMARY KEY (id);


ALTER TABLE "ProcessoEvento" ADD COLUMN id SERIAL;
UPDATE "ProcessoEvento" t
SET id = sub.novo_id
FROM (
    SELECT id, ROW_NUMBER() OVER () AS novo_id FROM "ProcessoEvento"
) AS sub
WHERE t.id IS NULL;
ALTER TABLE "ProcessoEvento" ADD CONSTRAINT pk_processo_Evento PRIMARY KEY (id);



ALTER TABLE "ProcessoDocumentacao" ADD COLUMN id SERIAL;
UPDATE "ProcessoDocumentacao" t
SET id = sub.novo_id
FROM (
    SELECT id, ROW_NUMBER() OVER () AS novo_id FROM "ProcessoDocumentacao"
) AS sub
WHERE t.id IS NULL;
ALTER TABLE "ProcessoDocumentacao" ADD CONSTRAINT pk_processo_Documentacao PRIMARY KEY (id);



ALTER TABLE "ProcessoAssociacao" ADD COLUMN id SERIAL;
UPDATE "ProcessoAssociacao" t
SET id = sub.novo_id
FROM (
    SELECT id, ROW_NUMBER() OVER () AS novo_id FROM "ProcessoAssociacao"
) AS sub
WHERE t.id IS NULL;
ALTER TABLE "ProcessoAssociacao" ADD CONSTRAINT pk_processo_Associacao PRIMARY KEY (id);



ALTER TABLE "ProcessoPropriedadeSolo" ADD COLUMN id SERIAL;
UPDATE "ProcessoPropriedadeSolo" t
SET id = sub.novo_id
FROM (
    SELECT id, ROW_NUMBER() OVER () AS novo_id FROM "ProcessoPropriedadeSolo"
) AS sub
WHERE t.id IS NULL;
ALTER TABLE "ProcessoPropriedadeSolo" ADD CONSTRAINT pk_processo_PropriedadeSolo PRIMARY KEY (id);
