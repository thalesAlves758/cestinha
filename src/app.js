import { createRouter } from './router.js';
import { qs } from './ui/dom.js';

const routes = {
  '/lists': () => import('./views/lists.js'),
  '/list/:id': () => import('./views/list.js'),
  '/templates': () => import('./views/templates.js'),
  '/template/:id': () => import('./views/template.js'),
  '/settings': () => import('./views/settings.js'),
};

const tabs = qs('#tabs');
const TOP_LEVEL = new Set(['/lists', '/templates']);

function updateShell(path) {
  tabs.hidden = !TOP_LEVEL.has(path);
  for (const link of tabs.querySelectorAll('[data-tab]')) {
    if (link.dataset.tab === path) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
}

createRouter({ routes, container: qs('#view'), onChange: updateShell }).start();
