---
id: CARD-016
titulo: Deploy no GitHub Pages e validação no Android
contexto: pwa
tipo: infra
camadas: [front]
complexidade: M
prioridade: mvp
incerteza: baixa
status: todo
requisitos: [RF16, RNF01, RNF02, RNF05, RNF06, RNF08]
depende_de: [CARD-007, CARD-011, CARD-013, CARD-015]
---

# CARD-016 — Deploy no GitHub Pages e validação no Android

## Contexto
O Cestinha é hospedado de graça no GitHub Pages, com o HTTPS que o PWA exige, e usado como app instalado no celular Android. O objetivo do MVP é substituir de vez o Listonic no uso do dia a dia. Para isso, o app precisa funcionar de verdade no aparelho, offline, dentro do mercado.

## Objetivo
Publicar o app no GitHub Pages e validar no Android real: instalação, offline, fluxos completos, acessibilidade e atualização de versão.

## Detalhamento técnico
- **Repositório:**
  - criar o repositório `cestinha` no GitHub e fazer o push do `main`;
  - Settings › Pages › Deploy from branch `main` / root;
  - adicionar um `.nojekyll` vazio na raiz, para servir os arquivos como estão.
- **CSS:** o GitHub Pages não roda build. O `styles/output.css` é gerado com `--minify` e **commitado**.
- **Checklist de deploy** em `docs/deploy.md`:
  1. incrementar `APP_VERSION` em `version.js`;
  2. rodar `./tailwindcss.exe -i styles/input.css -o styles/output.css --minify`;
  3. conferir que todo arquivo novo está no `APP_SHELL` do `sw.js`;
  4. fazer commit e push;
  5. abrir o site e confirmar que o aviso de nova versão aparece.
- **Validação no Android (Chrome)** em `https://<usuario>.github.io/cestinha/`:
  - instalar na tela inicial; o app abre em modo standalone, com ícone e cor corretos;
  - em modo avião, fazer os fluxos F1 a F4 completos;
  - fechar e reabrir: os dados continuam lá;
  - tema seguindo o sistema e fixado manualmente;
  - teclado decimal nos campos de quantidade e valor;
  - voltar do Android fecha painéis;
  - resumo fixo e campo de adição rápida usáveis com o teclado aberto.
- **Acessibilidade:** Lighthouse (Accessibility e PWA) nos dois temas e correção dos problemas de contraste encontrados.

## Critérios de aceite
- [ ] O app está acessível em `https://<usuario>.github.io/cestinha/`, sem 404 em nenhum recurso (caminhos relativos funcionando no subcaminho).
- [ ] O app instala no Android e abre em tela cheia, sem a barra do navegador (RNF01).
- [ ] Em modo avião, todos os fluxos do MVP funcionam: criar template, gerar lista, marcar, informar valor, ver totais e sugestão RF14 (RF16, RNF02).
- [ ] Marcar itens e editar valores respondem na hora no aparelho (RNF05).
- [ ] Alvos de toque confortáveis com uma mão e teclado decimal nos campos numéricos (RNF06).
- [ ] O Lighthouse Accessibility não aponta erro de contraste nos temas claro e escuro (RNF08).
- [ ] Um segundo deploy com versão incrementada chega ao celular pelo aviso "Nova versão disponível".
- [ ] O `docs/deploy.md` existe com o checklist.

## Observações
- Gerar o CSS por GitHub Actions foi descartado no MVP: commitar o `output.css` é mais simples e não depende de CI.
- Problemas encontrados no aparelho que exijam mudanças maiores viram cards novos, em vez de ampliar este.

## Pendências
- [ ] Repositório criado no GitHub, com acesso para push e Pages habilitado
- [ ] [CARD-007 — Detalhe do template](../03-templates/CARD-007-detalhe-do-template.md)
- [ ] [CARD-011 — Modo compra](../04-listas/CARD-011-modo-compra.md)
- [ ] [CARD-013 — Tema e Configurações](../05-configuracoes/CARD-013-tema-e-configuracoes.md)
- [ ] [CARD-015 — Service Worker e funcionamento offline](../06-pwa/CARD-015-service-worker-offline.md)

## Referências
Refinamento: seção 7 (hospedagem), seção 12 (subcaminho e atualização do SW), sinais de sucesso (seção 1), RF16, RNF01, RNF02, RNF05, RNF06 e RNF08.

## Justificativa da complexidade
M: o deploy é simples, mas a validação ponta a ponta no aparelho real tende a revelar ajustes.
