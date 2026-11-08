import { html } from '../ui/dom.js';

export function render(container, params = {}) {
  container.innerHTML = html`
    <h2 class="text-xl font-semibold">Lista</h2>
    <p class="text-muted">Em construção (id: ${params.id})</p>`;
}
