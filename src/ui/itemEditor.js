import { html, raw } from './dom.js';
import { openSheet } from './sheet.js';
import { BTN_PRIMARY, BTN_DANGER, FIELD } from './buttons.js';
import { parseDecimal, parsePriceToCents, centsToInput, itemSubtotalCents, formatMoney } from '../calc.js';

const UNIT_LABEL = 'flex items-center justify-center min-h-11 px-4 rounded-lg border border-line bg-surface text-ink font-semibold peer-checked:bg-primary peer-checked:text-on-primary peer-checked:border-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2';

function unitOption(id, name, value, checked) {
  return html`
    <div class="flex-1">
      <input type="radio" id="${id}-unit-${value}" name="${name}" value="${value}" class="peer sr-only" ${raw(checked ? 'checked' : '')}>
      <label for="${id}-unit-${value}" class="${UNIT_LABEL}">${value}</label>
    </div>`;
}

function field(id, name, label, control) {
  return html`
    <div class="flex flex-col gap-1">
      ${label}
      ${control}
      <p id="${id}-${name}-error" role="alert" class="text-danger text-sm" hidden></p>
    </div>`;
}

/**
 * Bottom-sheet editor for a template/list item. Knows nothing about templates or lists:
 * validates, then hands clean data to onSave. The caller sets id/order/checked and persists.
 */
export function openItemEditor({ item = null, title, focus = 'name', onSave, onDelete }) {
  return openSheet({
    title,
    render(body, close) {
      const id = `item-${crypto.randomUUID()}`;
      const unit = item?.unit === 'kg' ? 'kg' : 'un';
      const quantity = item ? String(item.quantity).replace('.', ',') : '1';
      const priceAuto = focus === 'price' ? 'autofocus' : '';
      const nameAuto = focus === 'price' ? '' : 'autofocus';

      body.innerHTML = html`
        <form novalidate class="flex flex-col gap-3">
          ${field(id, 'name', html`<label for="${id}-name" class="font-medium">Nome</label>`, html`
            <input id="${id}-name" name="name" type="text" autocomplete="off" autocapitalize="sentences"
              aria-describedby="${id}-name-error" value="${item?.name ?? ''}" class="${FIELD}" ${raw(nameAuto)}>`)}
          ${field(id, 'quantity', html`<label for="${id}-quantity" class="font-medium">Quantidade</label>`, html`
            <input id="${id}-quantity" name="quantity" type="text" inputmode="decimal" autocomplete="off"
              aria-describedby="${id}-quantity-error" value="${quantity}" class="${FIELD} tabular-nums">`)}
          <fieldset class="flex flex-col gap-1">
            <legend class="font-medium mb-1">Unidade</legend>
            <div class="flex gap-2">
              ${unitOption(id, `${id}-unit`, 'un', unit === 'un')}
              ${unitOption(id, `${id}-unit`, 'kg', unit === 'kg')}
            </div>
          </fieldset>
          ${field(id, 'price', html`<label for="${id}-price" class="font-medium" data-price-label>Valor por ${unit}</label>`, html`
            <div class="flex items-center gap-2">
              <span aria-hidden="true" class="text-muted">R$</span>
              <input id="${id}-price" name="price" type="text" inputmode="decimal" autocomplete="off" placeholder="Opcional"
                aria-describedby="${id}-price-error" value="${centsToInput(item?.priceCents ?? null)}" class="${FIELD} tabular-nums" ${raw(priceAuto)}>
            </div>`)}
          <p data-subtotal class="font-semibold tabular-nums" aria-live="polite" hidden></p>
          <button type="submit" class="${BTN_PRIMARY}">Salvar</button>
          ${onDelete && item ? html`<button type="button" data-delete class="${BTN_DANGER}">Excluir</button>` : ''}
        </form>`.toString();

      const form = body.querySelector('form');
      const nameInput = form.elements.name;
      const quantityInput = form.elements.quantity;
      const priceInput = form.elements.price;
      const priceLabel = body.querySelector('[data-price-label]');
      const subtotalEl = body.querySelector('[data-subtotal]');
      const submitBtn = form.querySelector('button[type="submit"]');
      const inputs = { name: nameInput, quantity: quantityInput, price: priceInput };

      const currentUnit = () => form.querySelector('input[type="radio"]:checked').value;

      function setError(key, message) {
        const input = inputs[key];
        const el = body.querySelector(`#${id}-${key}-error`);
        el.textContent = message ?? '';
        el.hidden = !message;
        if (message) input.setAttribute('aria-invalid', 'true');
        else input.removeAttribute('aria-invalid');
      }

      function quantityError(result) {
        if (result.ok) return result.value > 0 ? null : 'Informe uma quantidade maior que zero';
        return result.reason === 'too_many_decimals' ? 'Use até 3 casas decimais' : 'Informe uma quantidade maior que zero';
      }
      function priceError(result) {
        if (result.ok) return null;
        return result.reason === 'too_many_decimals' ? 'Use até 2 casas decimais' : 'Valor inválido';
      }

      function updateSubtotal() {
        const q = parseDecimal(quantityInput.value, { maxDecimals: 3 });
        const p = parsePriceToCents(priceInput.value);
        if (q.ok && q.value > 0 && p.ok && p.value !== null) {
          subtotalEl.textContent = `Subtotal: ${formatMoney(itemSubtotalCents({ quantity: q.value, priceCents: p.value }))}`;
          subtotalEl.hidden = false;
        } else {
          subtotalEl.hidden = true;
        }
      }

      nameInput.addEventListener('input', () => setError('name', null));
      quantityInput.addEventListener('input', () => { setError('quantity', null); updateSubtotal(); });
      priceInput.addEventListener('input', () => { setError('price', null); updateSubtotal(); });
      form.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.addEventListener('change', () => {
          priceLabel.textContent = `Valor por ${currentUnit()}`;
        });
      });
      updateSubtotal();

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = nameInput.value.trim();
        const q = parseDecimal(quantityInput.value, { maxDecimals: 3 });
        const p = parsePriceToCents(priceInput.value);

        const errors = {
          name: name ? null : 'Informe o nome',
          quantity: quantityError(q),
          price: priceError(p),
        };
        let firstInvalid = null;
        for (const key of ['name', 'quantity', 'price']) {
          setError(key, errors[key]);
          if (errors[key] && !firstInvalid) firstInvalid = inputs[key];
        }
        if (firstInvalid) {
          firstInvalid.focus();
          return;
        }

        submitBtn.disabled = true;
        try {
          await onSave({ name, quantity: q.value, unit: currentUnit(), priceCents: p.value });
          close();
        } catch (error) {
          submitBtn.disabled = false;
          throw error;
        }
      });

      body.querySelector('[data-delete]')?.addEventListener('click', async () => {
        await onDelete();
        close();
      });
    },
  });
}
