# 🧺 Cestinha — Documento de Refinamento

> **Data:** 08/11/2026 · **Autor:** Thales Alves · **Status:** MVP refinado, pronto para iniciar o desenvolvimento
>
> **Revisão 10/11/2026:** nome sugerido da lista passa a ser a data de hoje (RN11 alterada) e as listas ganham seletor de ordenação (RF09 alterado, RF21 e RN16 novos, T01 alterada).
>
> **Revisão 10/11/2026 (plataformas):** o iPhone passa a ser alvo oficial, junto com o Android (RNF01 e RF16 alterados, risco 11 novo).
>
> **Revisão 10/11/2026 (escopo):** RF14 (sugestão de adicionar ao template) e RF19 (preço sugerido com base na última compra) foram **descartados**: saem do "Depois" e passam a não-objetivos (RN08, RN10, RN13, T03 e riscos 3 e 5 ajustados).
>
> **Revisão 10/11/2026 (backup):** o backup manual (RF20) sai do "Depois" e entra no MVP: exportar todos os dados para um arquivo JSON pelo menu de compartilhar do celular e importá-lo substituindo os dados do aparelho (RF20 alterado, RN17 e RN18 novas, RNF04 e RNF07 ajustados, fluxo F6 novo, T07 alterada, formato do arquivo na seção 11, riscos 1, 11 a 14). O fluxo F3 e o diagrama central deixam de citar a sugestão do RF14 (descartado).
>
> **Revisão 12/11/2026 (excluir arrastando):** itens, listas e templates podem ser excluídos arrastando para a esquerda, como atalho além do menu e do editor; toda exclusão passa a ser imediata, sem confirmação, com "Desfazer" no aviso (RF22, RF23 e RN19 novos; RF02, RF03, RF07 e RF08 alterados; fluxo F7 novo; T01, T03, T04, T05 e T06 alteradas; riscos 15 a 17).

---

## 1. Visão geral

**Problema**
As compras de mercado se repetem muito de uma vez para outra: no geral são os mesmos itens, com alguns acréscimos e remoções. No app usado hoje (Listonic), não existe uma "lista padrão": para não montar tudo do zero, a saída é duplicar uma lista antiga. Só que a lista antiga reflete o que foi *planejado* naquele dia, inclusive itens que acabaram não sendo comprados, então a nova lista já nasce enviesada.

**Solução**
Um PWA de lista de compras, offline, em que o usuário mantém **templates** (listas padrão) separados das compras do dia. A partir de um template, ele gera a **lista do dia** com todos os itens já incluídos, ajusta o que precisar e usa a lista no mercado: marca o que coloca no carrinho, informa os valores e acompanha os totais. O template é mantido pelo próprio usuário, que o edita quando a rotina de compras muda.

**Público-alvo**
Uso pessoal (o próprio autor), em celular Android ou iPhone.

**Proposta de valor**
Lista do dia pronta em segundos a partir de uma base confiável, com o controle de gastos na hora (previsto x no carrinho).

**Sinais de sucesso**
- Montar a lista do dia a partir de um template em 1 a 2 minutos.
- Listas geradas sem "itens fantasma" de compras anteriores.
- Substituir de vez o Listonic no uso do dia a dia.

---

## 2. Escopo

### ✅ MVP
- Vários templates (criar, editar, renomear, excluir).
- Gerar lista a partir de um template, com todos os itens incluídos.
- Criar lista em branco (sem template).
- Várias listas existindo ao mesmo tempo.
- Itens com nome, quantidade (aceita decimais), unidade (`un` / `kg`) e valor opcional.
- Modo compra: marcar item como "no carrinho", adicionar item na hora, informar/editar valor.
- Subtotal por item (quantidade × valor) e dois totais: **previsto** e **no carrinho**.
- Barra de progresso por lista (itens marcados / total).
- Lista única na tela inicial, que funciona também como histórico.
- Ordenação das listas na tela inicial por critério (mais recentes, mais antigas, alteradas por último, nome A–Z), com a escolha lembrada.
- Nome da lista nova sugerido com a data de hoje (DD/MM/AAAA).
- Tema claro e escuro.
- Funcionamento 100% offline e instalável no celular.
- Backup manual: exportar todos os dados para um arquivo e importá-lo de volta, inclusive em outro celular (substitui os dados do aparelho).
- Excluir itens, listas e templates arrastando para a esquerda (atalho), com toda exclusão imediata e "Desfazer" no aviso.

### ⏳ Depois
- Lista compartilhada (exige login e sincronização).
- Categorias/setores do mercado organizando a lista.
- Arrastar um item da lista para a **direita** para marcar/desmarcar.

### 🚫 Não-objetivos (MVP)
- Contas, login ou qualquer servidor/back-end.
- Publicação em lojas de aplicativos.
- Botão/estado de "finalizar compra".
- Combinar vários templates numa mesma lista (para isso, cria-se um template novo).
- Unidade em gramas (usa-se `kg` com decimais, ex.: 0,3 kg).
- Histórico de preços por item.
- Sugerir incluir no template os itens adicionados durante a compra (RF14, descartado).
- Sugerir o valor de um item com base na última compra (RF19, descartado).
- Reordenar listas manualmente (arrastar) ou fixar listas no topo — o seletor de critério atende à necessidade.
- Ordenação na aba Templates (segue por data de alteração, da mais recente para a mais antiga).
- Backup automático ou em nuvem (exigiria servidor); o backup é sempre um toque do usuário.
- Juntar (mesclar) os dados do arquivo com os do aparelho na importação; importar sempre substitui tudo.
- Exportar só parte dos dados (templates ou listas escolhidos).
- Importar dados de outros apps (ex.: Listonic) ou de planilhas.
- Lembrete ativo de backup atrasado (aviso ou faixa); Configurações só mostra a data do último backup.
- Desfazer várias exclusões de uma vez ou um histórico de "lixeira"; só a última exclusão pode ser desfeita.
- Arrastar para revelar um botão "Excluir" (o gesto exclui ao soltar) e o gesto como único caminho para excluir (menu e editor continuam).

---

## 3. Perfis de usuário

| Perfil | Descrição | O que pode fazer |
|---|---|---|
| **Usuário** | Dono do aparelho; único perfil do MVP | Tudo: gerenciar templates, listas, itens e configurações |

Não há login nem distinção de permissões. Os dados pertencem ao navegador/aparelho onde o app está instalado.

---

## 4. Requisitos funcionais

| ID | Requisito (ação → resposta do sistema) | Prioridade |
|---|---|---|
| RF01 | Usuário cria um template informando o nome → template é salvo vazio e aparece na aba Templates | MVP |
| RF02 | Usuário edita um template (renomear; adicionar, editar e remover itens) → alterações são salvas na hora; remover item segue o RF23 | MVP |
| RF03 | Usuário exclui um template → sistema remove o template na hora, com opção de desfazer (RF23), sem afetar listas já geradas | MVP |
| RF04 | Usuário abre a aba Templates → sistema exibe todos os templates com nome e quantidade de itens | MVP |
| RF05 | Usuário cria uma lista a partir de um template → sistema cria uma lista nova com cópia de todos os itens do template, todos incluídos e desmarcados | MVP |
| RF06 | Usuário cria uma lista em branco → sistema cria uma lista vazia | MVP |
| RF07 | Usuário adiciona, edita ou remove itens de uma lista → lista é atualizada e totais/progresso recalculados; remover item segue o RF23 | MVP |
| RF08 | Usuário renomeia ou exclui uma lista → sistema aplica a alteração (exclusão imediata, com opção de desfazer, RF23) | MVP |
| RF09 | Usuário abre o app → tela inicial exibe todas as listas, na ordem escolhida pelo RF21 (padrão: da mais recente para a mais antiga), com barra de progresso e total previsto | MVP |
| RF10 | Usuário marca/desmarca um item → item muda de estado ("no carrinho"), progresso e total no carrinho são recalculados | MVP |
| RF11 | Usuário informa ou edita o valor de um item (preço por unidade ou por kg) → valor é salvo e subtotal calculado | MVP |
| RF12 | Sistema exibe o subtotal de cada item com valor (quantidade × valor) | MVP |
| RF13 | Sistema exibe na lista o **total previsto** (todos os itens com valor) e o **total no carrinho** (itens marcados com valor) | MVP |
| RF14 | Usuário adiciona à lista um item que não existe no template de origem → sistema pergunta se quer adicioná-lo também ao template; se sim, o item é incluído no template | Descartado |
| RF15 | Usuário troca o tema nas configurações (claro, escuro ou automático) → interface muda na hora e a escolha fica salva | MVP |
| RF16 | Usuário instala o app na tela inicial do Android ou do iPhone e o utiliza sem internet → todas as funcionalidades continuam disponíveis | MVP |
| RF17 | Usuário compartilha uma lista com outra pessoa, que pode editá-la em tempo real | Depois |
| RF18 | Sistema organiza os itens da lista por categoria/setor do mercado | Depois |
| RF19 | Sistema sugere o valor de um item com base na última compra | Descartado |
| RF20 | Usuário exporta todos os seus dados (templates, listas e preferências) para um arquivo, enviado pelo menu de compartilhar do celular, e importa esse arquivo neste ou em outro aparelho → os dados do aparelho são substituídos pelos do arquivo, após confirmação | MVP |
| RF21 | Usuário escolhe a ordem das listas na tela inicial (Mais recentes, Mais antigas, Alteradas por último, Nome A–Z) → listas são reordenadas na hora e a escolha fica salva para as próximas aberturas | MVP |
| RF22 | Usuário arrasta para a esquerda um item (da lista ou do template) ou um card (de lista ou de template) e solta depois do ponto de exclusão → o elemento é excluído na hora, como atalho além do menu e do editor | MVP |
| RF23 | Usuário exclui um item, uma lista ou um template, por qualquer caminho (gesto, menu ou editor) → a exclusão é imediata, sem confirmação, e um aviso oferece "Desfazer" por 6 segundos; desfazer devolve o que foi excluído | MVP |

### Critérios de aceite (principais)

**RF05 — Criar lista a partir de template**
- **Dado** que existe o template "Compra do mês" com 20 itens
- **Quando** o usuário toca em "+", escolhe esse template e confirma o nome da lista
- **Então** é criada uma lista nova com os 20 itens (nome, quantidade, unidade e valor, quando houver), todos desmarcados, e ela aparece no topo da tela inicial
- **E** alterações feitas nessa lista não alteram o template

**RF10 — Marcar item**
- **Dado** uma lista com 10 itens, nenhum marcado
- **Quando** o usuário marca 3 itens
- **Então** os itens aparecem como "no carrinho", a barra de progresso mostra 30% e o total no carrinho soma os subtotais desses 3 itens (os que têm valor)
- **E** ao desmarcar um deles, progresso e total voltam a refletir apenas os marcados

**RF13 — Totais**
- **Dado** uma lista com: Arroz (1 un × R$ 25,00, marcado), Carne (1,5 kg × R$ 40,00, não marcado) e Sabão (2 un, sem valor, marcado)
- **Quando** o usuário visualiza a lista
- **Então** o total previsto é R$ 85,00 e o total no carrinho é R$ 25,00
- **E** o item sem valor não entra em nenhum dos totais, mas conta para o progresso

**RF09 — Tela inicial**
- **Dado** que existem 5 listas, de datas diferentes
- **Quando** o usuário abre o app
- **Então** as listas aparecem da mais recente para a mais antiga, cada uma com nome, data, barra de progresso (marcados/total) e total previsto
- **E** se o usuário escolheu antes outro critério (RF21), as listas aparecem nesse critério

**RN11 — Nome sugerido com a data**
- **Dado** que hoje é 10/11/2026, no horário do aparelho (inclusive às 22h)
- **Quando** o usuário abre o painel "Nova lista"
- **Então** o campo de nome vem preenchido com "10/11/2026", tanto com um template selecionado quanto com "Lista em branco"
- **E** trocar a origem no painel não altera o nome; um nome já editado pelo usuário é mantido
- **E** o usuário pode apagar e digitar outro nome; nome vazio continua bloqueando a criação

**RF21 — Ordenar listas**
- **Dado** as listas "Feira 10" (criada em 01/11, alterada hoje), "Feira 2" (criada em 05/11, sem alteração depois) e "Ávila" (criada em 08/11)
- **Quando** o usuário toca no seletor e escolhe cada critério
- **Então** "Mais recentes" mostra Ávila, Feira 2, Feira 10; "Mais antigas" mostra Feira 10, Feira 2, Ávila; "Alteradas por último" mostra Feira 10 primeiro; "Nome A–Z" mostra Ávila, Feira 2, Feira 10 (ignora acentos e usa ordem natural de números)
- **E** a tela volta ao topo, o botão passa a exibir o critério escolhido e, ao fechar e reabrir o app, a ordem escolhida é mantida
- **E** com 0 ou 1 lista, o seletor não aparece

**RF20 — Exportar backup**
- **Dado** que existem 3 templates e 12 listas, e o tema está fixado em "Escuro"
- **Quando** o usuário toca em "Exportar dados" em Configurações
- **Então** abre o menu de compartilhar do celular com o arquivo `cestinha-backup-2026-11-10.json` (ou, onde o menu não existir, o arquivo é baixado), e o arquivo abre num editor de texto mostrando os 3 templates, as 12 listas e as preferências
- **E** ao concluir o envio, Configurações passa a mostrar "Último backup: hoje (10/11/2026)"; se o usuário cancelar o menu de compartilhar, o "Último backup" não muda
- **E** sem nenhum template nem lista, o botão fica desativado com o texto "Nada para exportar ainda"

**RF20 — Importar backup**
- **Dado** um celular com 1 template e 2 listas, e o arquivo exportado acima
- **Quando** o usuário toca em "Importar dados" e escolhe o arquivo
- **Então** aparece a confirmação "Backup de 10/11/2026, com 3 templates e 12 listas. Os 1 template e 2 listas deste aparelho serão apagados. Isso não pode ser desfeito." com "Cancelar" e "Substituir"
- **E** ao tocar em "Substituir", o app vai para a tela Listas com o aviso "Backup importado", mostrando as 12 listas na mesma ordem do celular de origem, com itens, marcações e valores iguais, e o tema passa a "Escuro"
- **E** ao tocar em "Cancelar", nada muda
- **E** um arquivo que não é backup do Cestinha, um backup com registro inválido ou de uma versão mais nova do app é recusado com mensagem clara, sem alterar nenhum dado (RN17)

**RF22 — Excluir arrastando**
- **Dado** uma lista com "Arroz", "Feijão" e "Café"
- **Quando** o usuário arrasta "Feijão" para a esquerda
- **Então** surge atrás do item um fundo vermelho com "Excluir"; ao passar de 40% da largura, o texto muda para "Solte para excluir" (e o celular vibra de leve, no Android)
- **E** ao soltar depois desse ponto, o item sai pela esquerda, "Café" sobe para o lugar dele e aparece o aviso "\"Feijão\" excluído" com "Desfazer"
- **E** ao soltar antes desse ponto, o item volta ao lugar, nada é excluído e o editor não abre
- **E** um movimento principalmente vertical rola a tela, sem arrastar o item
- **E** o mesmo vale para os itens do template e para os cards de lista (T01) e de template (T05)

**RF23 — Desfazer exclusão**
- **Dado** que o usuário acabou de excluir "Feijão", que estava marcado, pelo gesto ou pelo editor
- **Quando** toca em "Desfazer" em até 6 segundos
- **Então** "Feijão" volta para a mesma posição, marcado, com quantidade e valor, e os totais e o progresso voltam a contá-lo
- **E** se o usuário marcou outro item nesse meio-tempo, essa marcação é mantida
- **Dado** que o usuário excluiu a lista "10/11/2026" pelo menu dentro dela
- **Quando** o app volta para a tela inicial com o aviso "Lista \"10/11/2026\" excluída" e o usuário toca em "Desfazer"
- **Então** o card reaparece na mesma posição da ordenação, com todos os itens, e o usuário continua na tela inicial
- **E** excluir outra coisa antes de desfazer troca o aviso, e a exclusão anterior fica definitiva
- **E** a exclusão de listas e templates não pede mais confirmação

---

## 5. Regras de negócio

| ID | Regra |
|---|---|
| RN01 | A unidade de um item é `un` ou `kg`. Padrão: `un`. |
| RN02 | A quantidade é obrigatória e maior que zero. Aceita decimais (até 3 casas), com vírgula como separador na digitação. Padrão: 1. |
| RN03 | O valor é opcional, maior ou igual a zero, em reais com 2 casas decimais. Representa o preço **por unidade** (`un`) ou **por kg** (`kg`). |
| RN04 | Subtotal do item = quantidade × valor, arredondado para 2 casas. Item sem valor não tem subtotal. |
| RN05 | Total previsto = soma dos subtotais de **todos** os itens com valor. |
| RN06 | Total no carrinho = soma dos subtotais dos itens **marcados** com valor. |
| RN07 | Progresso = itens marcados ÷ total de itens da lista (independe de valor). Lista vazia exibe 0%. |
| RN08 | Uma lista gerada de template é uma **cópia independente**: editar o template não altera listas existentes e editar a lista não altera o template. |
| RN09 | Não existe estado "finalizada". A lista permanece como o usuário deixou, e o conjunto de listas forma o histórico. |
| RN10 | ~~A sugestão do RF14 só ocorre em listas cujo template de origem ainda existe, e compara nomes ignorando maiúsculas/minúsculas, acentos e espaços extras.~~ Descartada junto com o RF14. |
| RN11 | Nome de lista e de template é obrigatório. Ao criar a lista (de template ou em branco), o nome vem pré-preenchido com a **data local do aparelho** no formato DD/MM/AAAA (ex.: 10/11/2026), calculada ao abrir o painel, e o usuário pode alterá-lo. Trocar a origem no painel não muda o nome sugerido. Nomes repetidos são permitidos. |
| RN12 | Pode haver qualquer número de listas ao mesmo tempo. |
| RN13 | Excluir um template não exclui as listas geradas a partir dele. |
| RN14 | Na lista, itens marcados ficam riscados e descem para o final; itens desmarcados mantêm a ordem de inserção. |
| RN15 | Valores são exibidos no formato monetário brasileiro (R$ 1.234,56) e quantidades com vírgula decimal (1,5 kg). |
| RN16 | Ordenação das listas (RF21): **Mais recentes** = `createdAt` decrescente (padrão); **Mais antigas** = `createdAt` crescente; **Alteradas por último** = `updatedAt` decrescente (marcar item, editar item ou renomear contam como alteração); **Nome A–Z** = alfabética pt-BR ignorando maiúsculas/minúsculas e acentos, com ordem natural de números ("Feira 2" antes de "Feira 10"). Empates são desempatados pela mais recente (`createdAt` decrescente). A ordem é calculada na exibição, nunca armazenada. A escolha fica salva no aparelho; se estiver ausente ou inválida, vale "Mais recentes". |
| RN17 | Importação de backup (RF20): é **tudo ou nada** e **substitui** todos os templates, listas e preferências do aparelho, numa única operação; se algo falhar, nada muda. Só ocorre após confirmação que mostra a data do backup, o que ele contém e o que será apagado. O arquivo é recusado inteiro, sem alterar dados, quando: não é um backup do Cestinha; tem algum template, lista ou item inválido (pelas regras RN01–RN03 e RN11); ou foi gerado por um formato mais novo do que o app conhece (a mensagem pede para atualizar o app). Backups de formatos mais antigos são sempre aceitos, convertidos na hora. Datas de criação e de alteração do arquivo são mantidas. Preferências desconhecidas ou inválidas voltam ao padrão, sem recusar o arquivo. |
| RN18 | Exportação de backup (RF20): inclui sempre **todos** os templates e listas e as preferências de tema e de ordenação. Só fica disponível quando há pelo menos um template ou uma lista. O "Último backup" é registrado no aparelho apenas quando o envio pelo menu de compartilhar é concluído ou o download acontece (cancelar não conta); não vai no arquivo, então um aparelho recém-importado mostra "nunca". É exibido como tempo relativo em dias de calendário mais a data: "hoje (10/11/2026)", "há 1 dia (09/11/2026)", "há 12 dias (29/10/2026)" ou "nunca". |
| RN19 | Exclusão e desfazer (RF22, RF23): toda exclusão de item, lista ou template é gravada **na hora**, sem confirmação, e mostra o aviso "\"Nome\" excluído" (item), "Lista \"Nome\" excluída" ou "Template \"Nome\" excluído" com "Desfazer" por 6 segundos. Só a **última** exclusão pode ser desfeita: um novo aviso substitui o anterior e torna a exclusão anterior definitiva. Desfazer grava de volta o mesmo registro (mesmo `id`, `order`, `checked`, quantidade, unidade e valor). **Item:** é reinserido na lista ou no template como estão no momento do desfazer (mudanças feitas nesse meio-tempo são mantidas), e isso conta como alteração (`updatedAt` atualizado); se a lista ou o template não existir mais, o desfazer não faz nada. **Lista ou template:** volta com as datas originais (`createdAt` e `updatedAt`), ocupando a mesma posição na ordenação; um template restaurado volta a ser a origem das listas que guardam seu `id`. O aviso e o desfazer continuam valendo se o usuário trocar de tela. Excluir uma lista ou um template de dentro da própria tela volta para a tela anterior (T01 ou T05), e desfazer só faz o card reaparecer lá, sem reabrir. |

---

## 6. Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF01 | **Plataforma:** PWA instalável (Web App Manifest + ícones), com alvo no **Chrome para Android** e no **iPhone** (Safari e Chrome, que no iOS usam o mesmo motor WebKit). Toda mudança de interface deve funcionar nos dois; comportamentos que só um sistema tem (ex.: teclado virtual) ficam a cargo da plataforma sempre que possível, em vez de compensados à mão. |
| RNF02 | **Offline total:** Service Worker com cache do app shell; nenhuma funcionalidade depende de rede após o primeiro acesso. |
| RNF03 | **Armazenamento:** dados locais em IndexedDB (API nativa, sem bibliotecas). Sem servidor e sem login. |
| RNF04 | **Privacidade/LGPD:** nenhum dado sai do aparelho por conta do app; sem analytics, rastreamento ou chamadas externas. A única saída é o arquivo de backup (RF20), gerado localmente e enviado só para onde o próprio usuário escolher no menu de compartilhar. |
| RNF05 | **Desempenho:** ações frequentes (marcar item, editar valor) com resposta imediata na interface; app abre rápido, mesmo offline. |
| RNF06 | **Uso no mercado:** alvos de toque com no mínimo 44 px, uso confortável com uma mão e teclado numérico decimal (`inputmode="decimal"`) para quantidade e valor. |
| RNF07 | **Persistência:** solicitar `navigator.storage.persist()` para reduzir o risco de o navegador limpar os dados. A perda de dados é reduzida pelo backup manual (RF20), que depende de o usuário exportar de vez em quando. |
| RNF08 | **Acessibilidade básica:** contraste mínimo WCAG AA nos dois temas, campos com rótulos e estados não indicados só por cor (ex.: item marcado também fica riscado). Gestos (RF22) são sempre atalhos: toda ação feita por gesto também existe por toque (menu ou editor). Animações respeitam a preferência do sistema por menos movimento. |
| RNF09 | **Tema:** claro e escuro, seguindo o sistema por padrão, com opção de fixar manualmente. |
| RNF10 | **Idioma do código:** todo o código em **inglês** (variáveis, funções, arquivos, pastas, rotas, stores e campos do banco, comentários). Apenas os textos exibidos na interface ficam em **português (pt-BR)**. Detalhes na seção 12. |

---

## 7. Stack definida

| Camada | Escolha | Origem | Justificativa | Alternativa |
|---|---|---|---|---|
| Plataforma | PWA | Usuário | Instala no celular sem loja, offline, mesmo modelo do Diário de Rolê | App nativo Android |
| Front-end | JavaScript vanilla | Recomendação aceita | App pequeno, domínio do autor em JS, zero dependência de framework | React |
| Estilo | Tailwind CSS via **CLI** (standalone, sem Node) | Usuário (desejável) | Visual mais caprichado com pouco CSS manual; CLI gera CSS enxuto | CSS puro |
| Banco | IndexedDB nativo | Usuário | Suporta histórico crescente e funciona offline; sem libs | Dexie.js / localStorage |
| Offline | Service Worker | Recomendação aceita | Requisito obrigatório: sinal ruim dentro do mercado | — |
| Hospedagem | GitHub Pages | Recomendação aceita | Grátis, deploy direto do repositório, HTTPS (exigido por PWA) | Vercel / Netlify |
| Integrações | Nenhuma no MVP | — | — | — |

> ⚠️ Evitar o Tailwind via CDN ("Play CDN"): é voltado a protótipo, mais pesado e não recomendado para produção.

---

## 8. Fluxos do usuário

### F1 — Criar um template
1. Aba **Templates** → toca em **"+"**.
2. Informa o nome (ex.: "Compra do mês") → template criado.
3. Adiciona itens: nome, quantidade, unidade e, se quiser, valor.

### F2 — Criar a lista do dia a partir de um template
1. Aba **Listas** → toca em **"+"**.
2. Escolhe um template (ou "Lista em branco").
3. Confirma o nome sugerido (a data de hoje, ex.: 10/11/2026) ou digita outro.
4. Lista criada com todos os itens do template → remove o que não precisa e adiciona extras.

### F3 — Fazer a compra no mercado (fluxo central)
1. Abre a lista (funciona offline).
2. Pega um item na prateleira:
   - se já está na lista → marca como "no carrinho" e informa/ajusta o valor;
   - se não está → adiciona o item na hora (com valor) e já marca.
3. Acompanha a barra de progresso, o total no carrinho e o total previsto.
4. Ao terminar, simplesmente fecha o app: a lista fica salva como parou e passa a fazer parte do histórico.

### F4 — Consultar compras antigas
1. Na tela inicial, rola até as listas mais antigas (ou escolhe "Mais antigas" no seletor de ordenação).
2. Abre a lista para ver itens, valores e totais daquela compra.

### F5 — Ordenar as listas
1. Na tela inicial (com 2 ou mais listas), toca no botão de ordenação ao lado do título ("⇅ Mais recentes ▾").
2. Escolhe o critério no painel de opções (o atual aparece com ✓).
3. As listas são reordenadas na hora e a tela volta ao topo; o botão passa a mostrar o critério escolhido.
4. Nas próximas aberturas do app, a tela inicial já abre nesse critério.

### F6 — Levar os dados para outro celular (backup)
1. No celular atual: engrenagem → **Configurações** → seção **Backup** → **"Exportar dados"**.
2. Abre o menu de compartilhar do celular; o usuário envia o arquivo para onde quiser (Drive, WhatsApp, e-mail, "Salvar em Arquivos"). O "Último backup" passa a "hoje".
3. No celular novo: instala o Cestinha → **Configurações** → **"Importar dados"** → escolhe o arquivo.
4. Confere o resumo da confirmação (data do backup, o que vem e o que será apagado) → **"Substituir"**.
5. O app abre a tela **Listas** com o aviso "Backup importado", com tudo como estava no celular antigo.

```mermaid
flowchart TD
    A[Configurações › Exportar dados] --> B{Menu de compartilhar disponível?}
    B -- Sim --> C[Usuário escolhe o destino]
    B -- Não --> D[Arquivo baixado]
    C -- Concluído --> E[Último backup = hoje]
    C -- Cancelado --> F([Nada muda])
    D --> E
    E --> G[No outro aparelho: Configurações › Importar dados]
    G --> H[Escolhe o arquivo]
    H --> I{Arquivo válido? RN17}
    I -- Não --> J([Mensagem de erro; nada muda])
    I -- Sim --> K[Confirmação com o resumo]
    K -- Cancelar --> F
    K -- Substituir --> L[Substitui tudo numa única operação]
    L --> M([Tela Listas + aviso Backup importado])
```

### F7 — Excluir arrastando e desfazer
1. Em qualquer lista de itens (lista ou template) ou de cards (Listas ou Templates), o usuário arrasta o elemento para a esquerda, começando pelo meio dele.
2. Aparece o fundo vermelho com "Excluir"; ao passar de 40% da largura, vira "Solte para excluir" (vibra no Android).
3. Solta → o elemento sai pela esquerda, os de baixo sobem e aparece o aviso "… excluído" com "Desfazer" por 6 segundos. Soltar antes do ponto faz o elemento voltar ao lugar.
4. Se foi engano, toca em "Desfazer" → o elemento volta para a mesma posição, como estava.

```mermaid
flowchart TD
    A[Arrasta o elemento] --> B{Movimento horizontal?}
    B -- Não --> C([Rola a tela])
    B -- Sim --> D[Fundo vermelho: Excluir]
    D --> E{Soltou depois de 40%?}
    E -- Não --> F([Volta ao lugar; nada muda])
    E -- Sim --> G[Excluído na hora + aviso com Desfazer]
    G --> H{Desfazer em até 6 s?}
    H -- Sim --> I([Elemento volta como estava])
    H -- Não --> J([Exclusão definitiva])
```

### Diagrama do fluxo central (F2 + F3)

```mermaid
flowchart TD
    A([Abre o Cestinha]) --> B[Tela Listas]
    B -->|toca em +| C{Usar template?}
    C -- Sim --> D[Escolhe o template]
    D --> E[Lista criada com todos os itens do template]
    C -- Não --> F[Lista em branco]
    E --> G[Ajusta a lista: remove, adiciona, edita]
    F --> G
    G --> H[No mercado: abre a lista offline]
    H --> I{Item já está na lista?}
    I -- Sim --> J[Marca como no carrinho]
    I -- Não --> K[Adiciona item novo]
    K --> J
    J --> N[Informa ou ajusta o valor]
    N --> O[Progresso e totais atualizados]
    O --> P{Mais itens?}
    P -- Sim --> I
    P -- Não --> Q([Fecha o app: lista fica salva como parou])
```

---

## 9. Diretrizes de design

- **Estilo:** minimalista, limpo, com bastante respiro e poucos elementos por tela.
- **Cor principal:** verde escuro, remetendo a mercado/hortifruti. Sugestão de partida:
  - Tema claro: primária `#1F5A3D`, fundo `#F7F8F6`, superfícies brancas.
  - Tema escuro: primária `#5FB98A` (verde mais claro para manter contraste), fundo `#0F1512`, superfícies `#18201C`.
- **Temas:** claro e escuro, seguindo o sistema por padrão, com troca manual na engrenagem.
- **Tipografia:** fonte do sistema (sem download de fontes, melhor para offline e desempenho); valores e totais com algarismos tabulares para não "pularem" ao atualizar.
- **Navegação:** abas inferiores **🛒 Listas · 📋 Templates**; ícone de **engrenagem** no topo para configurações.
- **Elemento marcante:** barra de progresso em cada lista, enchendo em verde conforme os itens são marcados.
- **Itens marcados:** riscados, com menos destaque, e descendo para o fim da lista.
- **Botão "+":** flutuante no canto inferior direito, ao alcance do polegar.

---

## 10. Telas

### T01 — Listas (tela inicial)
- **Objetivo:** ver todas as listas (em andamento e antigas), ordená-las e criar uma nova.
- **Elementos:**
  - Cabeçalho: nome do app e ícone de engrenagem.
  - Linha do título: "Listas" à esquerda; à direita, botão de ordenação com ícone e o critério atual ("⇅ Mais recentes ▾"), visível só com 2 ou mais listas. O botão abre o painel de opções (o mesmo componente do menu do card) com título "Ordenar por" e os quatro critérios, o atual marcado com ✓ (não só por cor).
  - Conteúdo: cards de lista na ordem escolhida (RN16), cada um com nome, data, barra de progresso, contagem "marcados/total" e total previsto. A data continua no card mesmo quando repete o nome.
  - Ações: tocar no card abre a lista; botão "+" abre T02; menu do card permite renomear e excluir; arrastar o card para a esquerda exclui a lista (RF22); toda exclusão mostra "Lista \"Nome\" excluída" com "Desfazer" (RN19); trocar o critério reordena na hora e volta ao topo.
  - Rodapé: abas Listas · Templates.
- **Wireframe (validado):**
  ```
  ┌────────────────────────────────────┐
  │ Cestinha                        ⚙  │
  ├────────────────────────────────────┤
  │ Listas          [⇅ Mais recentes ▾]│
  │ ┌────────────────────────────────┐ │
  │ │ 10/11/2026     10 de nov. 2026 ⋮│ │
  │ │ ████████░░░░░░░░               │ │
  │ │ 8/20            Previsto R$ 312│ │
  │ └────────────────────────────────┘ │
  │ ┌────────────────────────────────┐ │
  │ │ 03/11/2026      3 de nov. 2026 ⋮│ │
  │ └────────────────────────────────┘ │
  │                              ( + ) │
  ├────────────────────────────────────┤
  │      Listas      │    Templates    │
  └────────────────────────────────────┘

  Painel de opções do seletor:
  ┌────────────────────────────────────┐
  │ Ordenar por                        │
  │ ✓ Mais recentes                    │
  │   Mais antigas                     │
  │   Alteradas por último             │
  │   Nome A–Z                         │
  └────────────────────────────────────┘
  ```
- **Estados:**
  - Vazio: mensagem convidando a criar o primeiro template ou a primeira lista (sem seletor).
  - Uma lista só: card sem seletor.
  - Carregando: esqueleto dos cards (leitura do IndexedDB).
  - Erro: aviso caso o armazenamento esteja indisponível.
- **RFs:** RF06, RF08, RF09, RF21, RF22, RF23.

### T02 — Nova lista (painel inferior)
- **Objetivo:** escolher a origem da lista e dar um nome.
- **Elementos:** opções de templates existentes + "Lista em branco"; campo de nome pré-preenchido com a data de hoje (DD/MM/AAAA, RN11), igual para qualquer origem; botão "Criar".
- **Estados:**
  - Sem templates: só a opção "Lista em branco", com um atalho para criar template.
- **RFs:** RF05, RF06.

### T03 — Lista (detalhe / modo compra)
- **Objetivo:** ajustar a lista e usá-la durante a compra.
- **Elementos:**
  - Cabeçalho: nome da lista (editável), voltar, menu (renomear, excluir).
  - Resumo fixo no topo: barra de progresso, **total no carrinho** em destaque e **total previsto**.
  - Conteúdo: itens com checkbox, nome, quantidade + unidade, valor e subtotal; marcados riscados e no final.
  - Ações: tocar no checkbox marca/desmarca; tocar no item abre T04; campo/botão para adicionar item rápido; remover item pelo editor (T04) ou arrastando para a esquerda (RF22), inclusive itens marcados; excluir a lista pelo menu volta para T01 com o aviso de desfazer (RN19).
- **Gesto de excluir (validado; o mesmo em T01, T05 e T06):**
  ```
  Arrastando (antes do ponto de exclusão):
  ┌────────────────────────────────────┐
  │ ☐ Arroz            1 un    R$ 25,00│
  │ ☐ Feij│████████████  Excluir  🗑 ██│  ← fundo vermelho surgindo à direita
  │ ☐ Café             1 un    R$ 18,90│
  └────────────────────────────────────┘

  Passou de 40% (vibra no Android):
  │ ☐ F│██████  Solte para excluir  🗑 ██│

  Ao soltar: o item sai pela esquerda, os de baixo sobem, e aparece o aviso:
  ┌────────────────────────────────────┐
  │ "Feijão" excluído       [Desfazer] │
  └────────────────────────────────────┘
  ```
- **Estados:**
  - Vazio: convite para adicionar o primeiro item.
  - Tudo marcado: barra cheia, com destaque visual de conclusão.
  - Erro: falha ao salvar item, com opção de tentar de novo.
- **RFs:** RF07, RF08, RF10, RF11, RF12, RF13, RF22, RF23.

### T04 — Editor de item (painel inferior)
- **Objetivo:** criar ou editar um item de lista ou de template.
- **Elementos:** nome; quantidade (teclado decimal); seletor `un` / `kg`; valor (R$, teclado decimal, rótulo muda para "por un" ou "por kg"); subtotal calculado ao vivo; botões Salvar e Excluir. "Excluir" fecha o editor e mostra o aviso com "Desfazer" (RN19).
- **Estados:**
  - Validação: nome vazio ou quantidade ≤ 0 bloqueiam o salvar com mensagem no campo.
- **RFs:** RF02, RF07, RF11, RF12, RF23.

### T05 — Templates
- **Objetivo:** ver e criar templates.
- **Elementos:** lista de templates com nome e quantidade de itens; botão "+" para novo template; arrastar um card para a esquerda exclui o template (RF22), com o aviso "Template \"Nome\" excluído" e "Desfazer".
- **Estados:**
  - Vazio: explicação curta do que é um template e botão para criar o primeiro.
- **RFs:** RF01, RF03, RF04, RF22, RF23.

### T06 — Template (detalhe)
- **Objetivo:** manter os itens de um template.
- **Elementos:** nome (editável); lista de itens (nome, quantidade + unidade, valor opcional); adicionar item; arrastar um item para a esquerda o exclui (RF22); menu com excluir template, que volta para T05 com o aviso de desfazer (RN19).
- **Estados:**
  - Vazio: convite para adicionar itens.
- **RFs:** RF02, RF03, RF22, RF23.

### T07 — Configurações
- **Objetivo:** personalização e backup dos dados.
- **Elementos:**
  - Cabeçalho: voltar e título "Configurações".
  - Seção **Tema:** seletor Automático / Claro / Escuro.
  - Seção **Backup:** texto "Último backup: há 12 dias (29/10/2026)" (ou "hoje (…)", "nunca", RN18); botão principal **"Exportar dados"**; botão secundário **"Importar dados"** (abre o seletor de arquivos do sistema); nota "Importar substitui todos os dados deste aparelho."
  - Rodapé: versão do app, presa ao fim da tela.
- **Wireframe (validado):**
  ```
  ┌────────────────────────────────┐
  │ ←  Configurações               │
  │                                │
  │ Tema                           │
  │ [Automático][ Claro ][ Escuro ]│
  │                                │
  │ Backup                         │
  │ Último backup: há 12 dias      │
  │ (29/10/2026)                   │
  │ [        Exportar dados      ] │  ← botão principal
  │ [        Importar dados      ] │  ← botão secundário
  │ Importar substitui todos os    │
  │ dados deste aparelho.          │
  │                                │
  │ Versão 0.3.0                   │
  └────────────────────────────────┘

  Confirmação ao importar (diálogo):
  ┌────────────────────────────────┐
  │ Substituir os dados?           │
  │                                │
  │ Backup de 10/11/2026, com      │
  │ 3 templates e 12 listas.       │
  │ Os 1 template e 2 listas deste │
  │ aparelho serão apagados. Isso  │
  │ não pode ser desfeito.         │
  │                                │
  │    [Cancelar]  [Substituir]    │  ← "Substituir" como ação de perigo
  └────────────────────────────────┘
  ```
- **Estados:**
  - Sem dados: "Exportar dados" desativado, com o texto "Nada para exportar ainda" (o "Importar dados" continua disponível).
  - Aparelho sem dados ao importar: a confirmação diz "Este aparelho não tem dados." em vez da linha do que será apagado.
  - Erro ao importar: mensagem clara, sem alterar dados:
    - "Este arquivo não é um backup do Cestinha."
    - "O backup está com problema e não foi importado."
    - "Este backup é de uma versão mais nova do Cestinha. Atualize o app e tente de novo."
  - Erro ao exportar ou ao gravar: aviso "Não foi possível exportar/importar. Tente de novo."
  - Sucesso ao importar: vai para T01 com o aviso "Backup importado".
- **RFs:** RF15, RF20.

### Rastreabilidade (RF de MVP → tela)

| RF | Tela(s) |
|---|---|
| RF01, RF04 | T05 |
| RF02 | T06, T04 |
| RF03 | T06 |
| RF05 | T02 |
| RF06 | T01, T02 |
| RF07 | T03, T04 |
| RF08 | T01, T03 |
| RF09, RF21 | T01 |
| RF10, RF13 | T03 |
| RF11, RF12 | T03, T04 |
| RF15, RF20 | T07 |
| RF22, RF23 | T01, T03, T04 (só RF23), T05, T06 |
| RF16 | Transversal (todas as telas; ver RNF01 e RNF02) |

---

## 11. Modelo de dados

Banco IndexedDB `cestinha`, com dois object stores principais. Os itens ficam embutidos no próprio registro (template ou lista): simplifica as transações do IndexedDB nativo e casa com o padrão de uso (sempre se abre a lista inteira).

Nomes de stores, entidades e campos seguem o RNF10 (inglês).

| Store | Chave | Índices |
|---|---|---|
| `templates` | `id` | `updatedAt` |
| `lists` | `id` | `createdAt`, `templateId` |

A preferência de tema fica no `localStorage`, na chave `cestinha.theme` (é lida antes da renderização, evitando "piscar" o tema errado).

O critério de ordenação das listas (RF21) também fica no `localStorage`, na chave `cestinha.listSort`, com os valores `newest` (padrão), `oldest`, `updated` ou `name`. É uma preferência de interface, não um dado: não entra no IndexedDB, não exige nova versão do banco nem índice novo — a ordenação é feita em memória sobre `getAllLists()`, usando os campos `createdAt`, `updatedAt` e `name` que já existem. Leitura e escrita protegidas com `try/catch`; valor ausente ou inválido vira `newest`.

O nome sugerido com a data (RN11) é só o valor inicial do campo: a lista guarda `name` como qualquer outro texto, sem campo novo. Listas já existentes mantêm seus nomes.

A data do último backup (RN18) fica no `localStorage`, na chave `cestinha.lastBackup` (data ISO 8601). Não entra no IndexedDB nem no arquivo de backup; valor ausente ou ilegível é exibido como "nunca".

**Arquivo de backup (RF20)**

O backup é uma "fotografia" dos dados: o banco não muda (sem nova versão do IndexedDB nem índice novo). O arquivo é um JSON legível (indentado), com o nome `cestinha-backup-AAAA-MM-DD.json` (data local da exportação; ano-mês-dia para os arquivos ficarem em ordem cronológica numa pasta).

| Campo | Tipo | Conteúdo |
|---|---|---|
| `app` | string | Sempre `"cestinha"`; identifica o arquivo. Outro valor → recusado. |
| `backupVersion` | int | Versão do **formato do arquivo**; começa em `1` e só sobe quando o modelo mudar (ex.: categorias). Maior que a conhecida pelo app → recusado (RN17); menor → convertido na importação. |
| `appVersion` | string | `APP_VERSION` de quem exportou; só informativo. |
| `exportedAt` | string | Data ISO 8601 da exportação; exibida na confirmação ("Backup de 10/11/2026"). |
| `preferences` | objeto | `{ "theme": "auto" \| "light" \| "dark", "listSort": "newest" \| "oldest" \| "updated" \| "name" }`. Valores ausentes ou inválidos → padrão. |
| `templates` | array | Registros do store `templates`, exatamente como estão no banco. |
| `lists` | array | Registros do store `lists`, exatamente como estão no banco. |

```json
{
  "app": "cestinha",
  "backupVersion": 1,
  "appVersion": "0.3.0",
  "exportedAt": "2026-11-10T18:00:00.000Z",
  "preferences": { "theme": "dark", "listSort": "newest" },
  "templates": [
    { "id": "a92d…", "name": "Compra do mês", "createdAt": "…", "updatedAt": "…",
      "items": [ { "id": "9f…", "name": "Arroz", "quantity": 1, "unit": "un", "priceCents": 2500, "order": 0 } ] }
  ],
  "lists": [
    { "id": "6f1c…", "name": "10/11/2026", "templateId": "a92d…", "createdAt": "…", "updatedAt": "…",
      "items": [ { "id": "1b…", "name": "Arroz", "quantity": 1, "unit": "un", "priceCents": 2500, "checked": true, "order": 0 } ] }
  ]
}
```

**Importação:** esvazia os stores `templates` e `lists` e grava todos os registros do arquivo numa **única transação** sobre os dois stores (falhou, nada muda); só depois aplica as preferências. Os registros são gravados como vieram, **sem** atualizar `updatedAt` (diferente do `put*` normal), para manter a ordem "Alteradas por último". `templateId` de uma lista pode apontar para um template que não existe mais, como no uso normal (RN13).

**Convenções**
- `id`: `crypto.randomUUID()` (facilita uma futura sincronização).
- Valores monetários em **centavos** (inteiro, campo `priceCents`), para evitar erros de ponto flutuante.
- `unit` guarda os códigos `"un"` ou `"kg"`, que também são exibidos na interface.
- Datas em ISO 8601.
- Totais, subtotais e progresso são **calculados**, nunca armazenados.
- Item de template e item de lista têm o mesmo formato; o item de lista tem, a mais, o campo `checked`. Ao gerar uma lista de um template, cada item é copiado com um `id` novo e `checked: false`.

```mermaid
erDiagram
    TEMPLATE ||--o{ TEMPLATE_ITEM : contains
    TEMPLATE |o--o{ LIST : originates
    LIST ||--o{ LIST_ITEM : contains

    TEMPLATE {
        string id PK
        string name
        string createdAt
        string updatedAt
    }
    TEMPLATE_ITEM {
        string id PK
        string name
        number quantity
        string unit "un or kg"
        int priceCents "optional"
        int order
    }
    LIST {
        string id PK
        string name
        string templateId FK "optional"
        string createdAt
        string updatedAt
    }
    LIST_ITEM {
        string id PK
        string name
        number quantity
        string unit "un or kg"
        int priceCents "optional"
        boolean checked
        int order
    }
```

**Exemplo de registro em `lists`**

O conteúdo digitado pelo usuário (nomes de listas e itens) fica naturalmente em português; só a estrutura é em inglês.

```json
{
  "id": "6f1c…",
  "name": "08/11/2026",
  "templateId": "a92d…",
  "createdAt": "2026-11-08T15:30:00-03:00",
  "updatedAt": "2026-11-08T16:10:00-03:00",
  "items": [
    { "id": "1b…", "name": "Arroz", "quantity": 1, "unit": "un", "priceCents": 2500, "checked": true, "order": 0 },
    { "id": "2c…", "name": "Carne moída", "quantity": 1.5, "unit": "kg", "priceCents": 4000, "checked": false, "order": 1 },
    { "id": "3d…", "name": "Sabão em pó", "quantity": 2, "unit": "un", "priceCents": null, "checked": true, "order": 2 }
  ]
}
```

---

## 12. Arquitetura e pontos de atenção

**Visão macro**

```
GitHub Pages (HTTPS, arquivos estáticos)
        │  primeiro acesso / atualizações
        ▼
┌─────────────────────────── Navegador (Android) ───────────────────────────┐
│  Service Worker  ──cache──►  app shell (HTML, JS, CSS, ícones)            │
│  UI (JS vanilla + Tailwind)  ◄──►  camada de dados (db.js)  ◄──►  IndexedDB│
│  localStorage: preferências de tema e de ordenação, data do último backup │
│  Backup: arquivo JSON ──► menu de compartilhar do sistema (ou download)  │
└───────────────────────────────────────────────────────────────────────────┘
```

**Estrutura de pastas sugerida**

```
cestinha/
├── docs/
│   └── refinamento.md
├── index.html
├── manifest.webmanifest
├── sw.js
├── icons/
├── src/
│   ├── app.js          # inicialização e roteamento por hash (#/listas, #/lista/:id…)
│   ├── db.js           # abertura do IndexedDB, migrações e CRUD
│   ├── calc.js         # subtotal, totais, progresso, formatação pt-BR
│   ├── theme.js
│   └── views/          # listas, lista, templates, template, configuracoes
└── styles/
    ├── input.css       # entrada do Tailwind
    └── output.css      # gerado pelo Tailwind CLI
```

**Pontos de atenção técnicos**
- **GitHub Pages em subcaminho** (`/cestinha/`): usar caminhos relativos no manifest (`start_url`, `scope`) e no registro do Service Worker; preferir roteamento por hash para não precisar de fallback de 404.
- **Atualização do Service Worker:** versionar o nome do cache a cada deploy e limpar caches antigos no `activate`; caso contrário o celular fica preso numa versão velha.
- **Migrações do IndexedDB:** centralizar em `onupgradeneeded`, por número de versão, desde o primeiro commit.
- **Entrada numérica pt-BR:** aceitar vírgula na digitação e converter para número; formatar com `Intl.NumberFormat('pt-BR')`.
- **Arredondamento:** calcular em centavos (`Math.round(quantidade * valorCentavos)`) para evitar diferenças de centavos nos totais.
- **Tema com Tailwind:** para alternar o tema manualmente (e não só pelo sistema), configurar a variante `dark` baseada em classe no `html` (no Tailwind v4, via `@custom-variant dark (&:where(.dark, .dark *));`).
- **Persistência:** chamar `navigator.storage.persist()` na primeira execução.
- **Data do nome sugerido (RN11):** usar a data **local** do aparelho (`Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })`), nunca `toISOString().slice(…)`, que usa UTC e daria o dia seguinte a partir das 21h no horário de Brasília.
- **Ordenação por nome (RN16):** usar `Intl.Collator('pt-BR', { sensitivity: 'base', numeric: true })` para ignorar acentos/maiúsculas e ordenar números de forma natural.
- **Exportar no celular (RF20):** usar `navigator.share({ files: [file] })` quando `navigator.canShare({ files })` for verdadeiro (Android Chrome e iOS). Se o usuário cancelar (`AbortError`), não registrar o backup; em qualquer outra falha, ou sem suporte, cair para o download via `<a download>` com `URL.createObjectURL`. No iPhone, o download dentro do app instalado é pouco confiável, por isso o menu de compartilhar vem primeiro. Gerar o arquivo com tipo `application/json`.
- **Importar no iPhone:** o `<input type="file">` deve aceitar `.json,application/json`; filtrar só pelo tipo às vezes deixa arquivos `.json` desativados no app Arquivos.
- **Validação do arquivo:** tratar o conteúdo como dado não confiável; validar a estrutura de cada template, lista e item (tipos, `unit`, `quantity > 0`, `priceCents` inteiro ≥ 0 ou `null`, nome não vazio) antes de abrir a transação. Nomes vindos do arquivo continuam passando pelo escape do `html` na exibição.
- **Importação atômica:** a gravação usa uma transação sobre os dois stores (`db.transaction(['templates', 'lists'], 'readwrite')`) com `clear()` e `put()` direto, sem passar por `putTemplate`/`putList` (que sobrescrevem `updatedAt`). Fica em `db.js`, o único módulo que acessa o IndexedDB.
- **Tema após importar:** aplicar a preferência importada na hora (mesma rotina da troca manual de tema).
- **Arrastar para excluir (RF22):** usar Pointer Events (`pointerdown`/`pointermove`/`pointerup`/`pointercancel`) com `touch-action: pan-y` no elemento, para o navegador continuar cuidando da rolagem vertical. Só entrar em modo arraste depois de um deslocamento horizontal claro (ex.: > 10 px e maior que o vertical); enquanto arrasta, mover o elemento com `transform: translateX`. Ponto de exclusão em 40% da largura do elemento. Se houve arraste, cancelar o `click` seguinte (não abrir o editor nem a lista). Um único componente reutilizável em `src/ui/` serve às quatro telas.
- **Vibração:** `navigator.vibrate?.(10)` ao cruzar o ponto, protegido por checagem (existe no Android; no iPhone não existe e é ignorado).
- **Animação:** saída lateral e recolhimento da altura em cerca de 200 ms; com `prefers-reduced-motion: reduce`, sem animação.
- **Fundo vermelho:** usar o token de perigo do tema; se for preciso texto claro sobre ele, criar tokens semânticos novos (ex.: `bg-danger`/`text-on-danger`) com contraste AA nos dois temas, em vez de cores fixas.
- **Desfazer (RF23):** a exclusão grava na hora; o aviso guarda uma cópia do registro excluído (e, no item, o `id` da lista/template de origem) e, em "Desfazer", grava de volta. Lista e template restaurados não podem passar por `putList`/`putTemplate` (que sobrescrevem `updatedAt`): é preciso uma gravação "como veio", em `db.js`. O aviso de 6 segundos já existe (`showToast` com ação); ele vive fora da view, por isso sobrevive à troca de tela.

---

## 13. Riscos e perguntas em aberto

| # | Tipo | Descrição | Encaminhamento |
|---|---|---|---|
| 1 | Risco | Perda de dados ao limpar o navegador, desinstalar ou trocar de celular | Reduzido pelo backup manual (RF20); o que mudou depois do último backup ainda se perde |
| 2 | Risco | Sem "finalizar" nem arquivamento, a tela inicial cresce indefinidamente | Avaliar após uso real: agrupar por mês, busca ou ocultar listas antigas |
| 3 | Risco | Comparação por nome no RF14 pode errar (ex.: "Arroz 5kg" x "Arroz") | Encerrado: RF14 descartado |
| 4 | Pergunta | Permitir item com nome repetido na mesma lista, ou avisar/somar quantidade? | Definir durante o desenvolvimento; padrão: permitir |
| 5 | Pergunta | Ao aceitar a sugestão do RF14, levar também o valor para o template? | Encerrada: RF14 e RF19 descartados |
| 6 | Futuro | Compartilhamento exigirá back-end, login e migração dos dados locais | Modelo já usa UUID e datas, o que facilita sincronização futura |
| 7 | Futuro | Nome "Cestinha" pode conflitar com apps existentes | Só importa se um dia for publicado |
| 8 | Pergunta | Com o nome sugerido sendo a data, o card de T01 repete a data ("10/11/2026 … 10 de nov. de 2026") | Mantido por enquanto; rever após uso (ex.: esconder a data quando o nome já é a data de criação, ou mostrar "alterada há X dias") |
| 9 | Risco | Listas de templates diferentes criadas no mesmo dia ficam com o mesmo nome e só se distinguem abrindo | Aceito; o usuário pode editar o nome na criação ou renomear depois |
| 10 | Risco | "Nome A–Z" com nomes em DD/MM/AAAA agrupa por dia, não em ordem cronológica ("01/12/2026" antes de "10/11/2026") | Aceito, pois a lista aceita qualquer nome; para ordem cronológica há "Mais recentes"/"Mais antigas" |
| 11 | Risco | No iPhone, o WebKit pode apagar os dados de sites usados **no navegador** depois de 7 dias sem acesso; apps adicionados à tela de início ficam fora dessa regra | Usar o Cestinha instalado na tela de início ("Compartilhar › Adicionar à Tela de Início"); o backup (RF20) reduz o risco |
| 12 | Risco | O usuário esquece de exportar, e o backup fica desatualizado | Aceito: os dados de compra são de baixa importância; Configurações mostra "Último backup: há N dias" (RN18). Lembrete ativo é não-objetivo |
| 13 | Risco | Importar o arquivo errado (ex.: um backup antigo) apaga dados mais novos do aparelho | Confirmação com a data do backup e o que será apagado (RN17); não há desfazer |
| 14 | Risco | O menu de compartilhar com arquivo e o seletor de arquivos se comportam diferente no Android e no iPhone | Download como alternativa ao compartilhar; `accept=".json,application/json"`; validar nos dois aparelhos após o deploy |
| 15 | Risco | Arrastar a partir da borda direita da tela dispara o "voltar" do Android (navegação por gestos) ou o "avançar" do Safari fora do app instalado; o app não consegue bloquear | Aceito: o gesto começa pelo meio do card, que é o movimento natural; validar nos dois aparelhos |
| 16 | Risco | Exclusão acidental ao rolar uma lista longa | O arraste só começa com movimento claramente horizontal, exige passar de 40% e tem "Desfazer" |
| 17 | Risco | Sem confirmação, uma lista ou template inteiro se perde se o usuário não vir o aviso de 6 segundos ou excluir outra coisa logo depois | Aceito pelo usuário (6 s para tudo); o backup (RF20) reduz o impacto |

---

## 14. Premissas assumidas

- Métricas de sucesso propostas pelo assistente (seção 1), não definidas explicitamente pelo usuário.
- Quantidade aceita até 3 casas decimais; quantidade padrão 1 e unidade padrão `un`.
- O valor informado é sempre preço por unidade ou por kg; não existe opção de digitar o "valor total" do item.
- Nome da lista vem pré-preenchido e é editável pelo usuário.
- (Revisão 10/11) A data sugerida é calculada ao abrir o painel "Nova lista"; se o painel ficar aberto na virada do dia, vale a data da abertura.
- (Revisão 10/11) Trocar a origem no painel não altera o nome sugerido; um nome editado pelo usuário é mantido.
- (Revisão 10/11) Listas criadas antes da revisão mantêm seus nomes; nada é migrado.
- (Revisão 10/11) Renomear a lista conta como alteração e a leva ao topo em "Alteradas por último".
- (Revisão 10/11) Critério de ordenação ausente ou inválido no `localStorage` volta para "Mais recentes".
- (Revisão backup) Uso principal do backup: levar os dados para outro celular; a proteção contra perda é secundária.
- (Revisão backup) Textos das mensagens de erro e do aviso "Backup importado" (T07) propostos pelo assistente.
- (Revisão backup) Preferências inválidas no arquivo voltam ao padrão em vez de recusar o arquivo; só templates e listas são validados de forma estrita.
- (Revisão backup) O tema importado é aplicado na hora.
- (Revisão backup) "Há N dias" conta dias de calendário; data ilegível no aparelho vira "nunca".
- (Revisão backup) Falha no menu de compartilhar que não seja cancelamento cai para o download.
- (Revisão backup) O seletor de arquivos aceita `.json,application/json` por causa do iPhone.
- (Revisão backup) "Importar dados" fica disponível mesmo sem dados no aparelho (é o caso do celular novo).
- (Revisão 12/11) Se houve arraste, soltar não abre o item nem a lista; só um elemento é arrastado por vez, e a tela não rola durante o arraste.
- (Revisão 12/11) Itens marcados também podem ser excluídos arrastando.
- (Revisão 12/11) "Excluir" no editor de item fecha o editor e mostra o aviso com "Desfazer".
- (Revisão 12/11) O botão "Desfazer" tem no mínimo 44 px, e o aviso fica na posição atual (acima da barra de adicionar item e do botão "+").
- (Revisão 12/11) Desfazer a exclusão de um item cuja lista ou template já não existe não faz nada.
- (Revisão 12/11) O fundo vermelho do gesto usa a cor de perigo do tema, com contraste AA nos dois temas.
- Itens marcados ficam riscados e descem para o final da lista.
- Excluir template não exclui as listas geradas a partir dele.
- O tema segue o sistema por padrão, com opção de fixar claro ou escuro; a preferência fica no `localStorage`.
- Itens embutidos nos registros de template/lista no IndexedDB; valores em centavos.
- Paleta de cores e tipografia (seção 9) são sugestões iniciais.
- Roteamento por hash, para simplificar a hospedagem no GitHub Pages.
