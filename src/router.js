const DEFAULT_PATH = '/lists';

function compile(pattern) {
  const names = [];
  const source = pattern.replace(/:([A-Za-z]+)/g, (_, name) => {
    names.push(name);
    return '([^/]+)';
  });
  return { regex: new RegExp(`^${source}$`), names };
}

function currentPath() {
  const hash = location.hash.replace(/^#/, '');
  return hash.split('?')[0];
}

/**
 * Hash router. `routes` maps a pattern ('/list/:id') to a loader returning a
 * module that exports `render(container, params)` (optionally returning a cleanup).
 * `onChange(path)` runs after each navigation (used for the shell: tabs, etc.).
 */
export function createRouter({ routes, container, onChange }) {
  const table = Object.entries(routes).map(([pattern, load]) => ({ ...compile(pattern), load }));
  let cleanup = null;
  let token = 0;

  function match(path) {
    for (const route of table) {
      const m = route.regex.exec(path);
      if (m) {
        const params = {};
        route.names.forEach((name, i) => { params[name] = decodeURIComponent(m[i + 1]); });
        return { route, params };
      }
    }
    return null;
  }

  async function resolve() {
    const path = currentPath();
    const found = match(path);
    if (!found) {
      location.replace(`#${DEFAULT_PATH}`);
      return;
    }
    const current = ++token;
    const view = await found.route.load();
    if (current !== token) return; // a newer navigation superseded this one

    if (typeof cleanup === 'function') cleanup();
    cleanup = null;
    container.replaceChildren();
    cleanup = view.render(container, found.params) ?? null;
    onChange?.(path);
  }

  return {
    start() {
      window.addEventListener('hashchange', resolve);
      resolve();
    },
  };
}
