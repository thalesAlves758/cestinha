import { html } from '../ui/dom.js';

export function render(container, params = {}) {
  container.innerHTML = html`
    <h2 class="text-xl font-semibold">Configurações</h2>
    <p class="text-muted">Em construção</p>`;
}
