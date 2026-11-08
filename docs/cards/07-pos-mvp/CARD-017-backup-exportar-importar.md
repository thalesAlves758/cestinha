---
id: CARD-017
titulo: Backup — exportar e importar dados
contexto: pos-mvp
tipo: feature
camadas: [front, banco]
complexidade: M
prioridade: depois
incerteza: baixa
status: todo
requisitos: [RF20]
depende_de: [CARD-002, CARD-013]
---

# CARD-017 — Backup: exportar e importar dados

## Contexto
Todos os dados do Cestinha ficam só no navegador do aparelho. Limpar os dados do navegador, desinstalar o app ou trocar de celular faz perder templates e histórico. O MVP aceita esse risco (risco 1 do refinamento). Este card o resolve com backup manual.

## Objetivo
Permitir exportar todos os templates e listas para um arquivo JSON e importar esse arquivo de volta, pela tela de Configurações.

## Detalhamento técnico
- **Formato do arquivo** `cestinha-backup-AAAA-MM-DD.json`:
  ```json
  { "app": "cestinha", "schemaVersion": 1, "exportedAt": "2026-11-08T18:00:00.000Z",
    "templates": [ ... ], "lists": [ ... ] }
  ```
- **`src/backup.js`:**
  - `exportData()`: lê os dois stores e gera um `Blob` baixado via `<a download>`. Opcional: `navigator.share({ files })` no Android, para mandar direto ao Drive ou WhatsApp.
  - `importData(file)`:
    - valida `app` e `schemaVersion`, além da estrutura mínima de cada registro;
    - grava os registros numa única transação nos dois stores.
- **`src/views/settings.js`:** seção "Backup" com os botões "Exportar dados" e "Importar dados" (`<input type="file" accept="application/json">`).
  - Antes de importar, mostrar uma confirmação com o resumo: "N templates e M listas serão importados".

## Critérios de aceite
- [ ] Exportar gera um JSON com todos os templates e listas, e o arquivo abre num editor de texto (RF20).
- [ ] Importar esse arquivo num navegador limpo restaura tudo: templates, listas, itens, marcações e valores.
- [ ] Arquivo inválido ou de outro app é recusado com mensagem clara, sem alterar dados.
- [ ] Uma falha no meio da importação não deixa dados pela metade (transação única).
- [ ] Nenhum dado é enviado para a rede: o arquivo é gerado localmente.

## Observações
- `schemaVersion` permite migrar backups antigos se o modelo mudar (ex.: categorias, CARD-019).

## Pendências
- [ ] Decidir a estratégia de importação: **mesclar** (sobrescreve por `id` e mantém o resto) ou **substituir tudo**. Sugestão: mesclar.
- [ ] [CARD-002 — Camada de dados com IndexedDB](../01-fundacao/CARD-002-camada-de-dados-indexeddb.md)
- [ ] [CARD-013 — Tema e Configurações](../05-configuracoes/CARD-013-tema-e-configuracoes.md)

## Referências
Refinamento: RF20, risco 1 da seção 13, escopo "Depois".

## Justificativa da complexidade
M: geração e leitura de arquivo, validação e transação de importação.
