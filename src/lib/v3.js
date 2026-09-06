export const REQUEST_STATES = ['idle', 'request', 'api', 'server', 'database', 'response', 'complete'];
export const nextRequestState = state => REQUEST_STATES[Math.min(REQUEST_STATES.indexOf(state) + 1, REQUEST_STATES.length - 1)];
export const clampDepth = value => Math.max(-1, Math.min(1, value));

// Allowlisted UI actions only: no eval, shell, arbitrary URLs, or network calls.
export function parsePortfolioCommand(input, projectIds) {
  const command = input.trim().toLowerCase();
  if (/^system(?: (?:on|off))?$/.test(command)) return { type: 'system', value: command.split(' ')[1] || 'toggle' };
  if (command === 'theme' || command === 'status') return { type: command };
  const sections = { projects: 'portfolio', architecture: 'engineering', contact: 'contact' };
  if (command.startsWith('goto ') && sections[command.slice(5)]) return { type: 'goto', id: sections[command.slice(5)] };
  if (command.startsWith('open ') && projectIds.includes(command.slice(5))) return { type: 'project', id: command.slice(5) };
  return null;
}

export function claimHeroEntrance(storage) {
  try {
    if (storage.getItem('portfolio-v3-entered') === '1') return false;
    storage.setItem('portfolio-v3-entered', '1');
  } catch { /* Storage restriction must not block content. */ }
  return true;
}
