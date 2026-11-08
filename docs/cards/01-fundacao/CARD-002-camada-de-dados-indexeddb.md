---
id: CARD-002
titulo: Camada de dados com IndexedDB
contexto: fundacao
tipo: dados
camadas: [banco, front]
complexidade: M
prioridade: mvp
incerteza: baixa
status: todo
requisitos: [RNF03, RNF07, RN08, RN12, RN13]
depende_de: [CARD-001]
---

# CARD-002 — Camada de dados com IndexedDB

## Contexto
O Cestinha guarda tudo no aparelho, sem servidor nem login. Templates (listas padrão) e listas do dia ficam no IndexedDB, com os itens embutidos no próprio registro, porque a tela sempre abre a lista inteira. Todas as telas dependem dessa camada.

## Objetivo
Criar `src/db.js`, o único módulo que acessa o IndexedDB, com migrações versionadas e CRUD de templates e listas. Criar também `src/model.js`, com as fábricas puras dos registros, incluindo a cópia de template para lista.

## Detalhamento técnico
- **`src/db.js`:** banco `cestinha`, `DB_VERSION = 1`. `openDb()` memoizado (uma promise só).
  ```js
  request.onupgradeneeded = (event) => {
    const db = request.result;
    if (event.oldVersion < 1) {
      const templates = db.createObjectStore('templates', { keyPath: 'id' });
      templates.createIndex('updatedAt', 'updatedAt');
      const lists = db.createObjectStore('lists', { keyPath: 'id' });
      lists.createIndex('createdAt', 'createdAt');
      lists.createIndex('templateId', 'templateId');
    }
    // if (event.oldVersion < 2) { ... }  ← migrações futuras, sem editar o bloco v1
  };
  ```
  - Tratar `onblocked` e `db.onversionchange`: fechar a conexão, pensando em migrações futuras com o app aberto em outra aba.
  - Helpers internos: `promisify(request)` e `withStore(name, mode, fn)`, que resolve no `oncomplete` da transação.
- **API pública:**
  ```js
  export async function getAllTemplates()   // ordenados por updatedAt desc
  export async function getTemplate(id)     // ou undefined
  export async function putTemplate(t)      // define updatedAt = agora
  export async function deleteTemplate(id)  // NÃO mexe em listas (RN13)
  export async function getAllLists()       // createdAt desc (cursor 'prev' no índice)
  export async function getList(id)
  export async function putList(l)          // define updatedAt = agora
  export async function deleteList(id)
  export async function requestPersistence() // navigator.storage.persist(), se disponível
  ```
- **`src/model.js`** (funções puras, sem I/O):
  ```js
  export function createTemplate(name)                    // { id, name, createdAt, updatedAt, items: [] }
  export function createList({ name, templateId = null, items = [] })
  export function createItem({ name, quantity = 1, unit = 'un', priceCents = null }, order)
  export function listFromTemplate(template, name)        // itens copiados com id novo e checked:false
  export function nextOrder(items)                        // max(order) + 1, ou 0
  ```
  - Formato do item: `{ id, name, quantity, unit, priceCents, order }`. Item de lista tem também `checked`.
  - IDs com `crypto.randomUUID()`. Datas com `new Date().toISOString()`.
- **`src/app.js`:** chamar `requestPersistence()` na inicialização (RNF07). Falha ou recusa é ignorada em silêncio.

## Critérios de aceite
- [ ] Na primeira execução, o banco `cestinha` v1 é criado com os stores `templates` (índice `updatedAt`) e `lists` (índices `createdAt` e `templateId`), conferível em DevTools › Application › IndexedDB.
- [ ] Criar, ler, atualizar e excluir funcionam nos dois stores, e os dados persistem após recarregar a página.
- [ ] `getAllLists()` devolve as listas da mais recente para a mais antiga.
- [ ] `putTemplate` e `putList` atualizam `updatedAt` e nunca alteram `createdAt`.
- [ ] Dado um template com itens, `listFromTemplate` gera itens com `id` novo, `checked: false` e mesmos `name`, `quantity`, `unit`, `priceCents` e `order`. Alterar a lista gerada não altera o objeto do template (RN08).
- [ ] `deleteTemplate` não exclui nem altera listas cujo `templateId` aponte para ele (RN13).
- [ ] `navigator.storage.persist()` é solicitado na inicialização. Se o navegador não suportar ou recusar, o app segue normal.
- [ ] Com o IndexedDB indisponível, `openDb()` rejeita com um `Error` tratável, sem travar o app.
- [ ] Nenhuma biblioteca é usada (RNF03).
- [ ] Totais e progresso não são gravados nos registros.

## Observações
- Valores monetários em centavos inteiros (`priceCents`, aceita `null`).
- A ordem dos templates por `updatedAt` desc é premissa: o refinamento não define, e o índice existente sugere esse uso.
- O exemplo do refinamento usa offset `-03:00` e `toISOString()` gera `Z`. Os dois são ISO 8601; a exibição converte para o horário local.
- Toda migração futura entra como novo bloco `if (oldVersion < N)`. Nunca editar o bloco v1 depois de publicado.

## Pendências
- [ ] [CARD-001 — Setup do projeto e app shell](../01-fundacao/CARD-001-setup-projeto-app-shell.md)

## Fora do escopo
Telas, cálculos de totais (CARD-003), exportar e importar dados (CARD-017).

## Como testar
No console do DevTools:
```js
const db = await import('./src/db.js');
const m = await import('./src/model.js');
const t = m.createTemplate('Teste');
t.items.push(m.createItem({ name: 'Arroz' }, 0));
await db.putTemplate(t);
await db.putList(m.listFromTemplate(t, 'Teste'));
await db.getAllLists();
```

## Referências
Refinamento: seção 11 (modelo de dados) e 12 (migrações, persistência). RNF03, RNF07, RN08, RN12 e RN13.

## Justificativa da complexidade
M: API nativa verbosa (promises, transações, migrações), mas o modelo é simples.
