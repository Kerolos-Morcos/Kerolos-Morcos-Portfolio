import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { computed, ref } from 'vue';
import { parse, compileStyle } from '@vue/compiler-sfc';
import { v3Ar, v3En } from '../src/i18n/v3.js';
import { REQUEST_STATES, nextRequestState, clampDepth, claimHeroEntrance, parsePortfolioCommand } from '../src/lib/v3.js';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('V3 content is bilingual with matching nonempty keys and arrays', () => {
  function shape(value) {
    if (Array.isArray(value)) return value.map(shape);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)]));
    assert.equal(typeof value, 'string'); assert.ok(value.trim()); return 'text';
  }
  assert.deepEqual(shape(v3Ar), shape(v3En));
});

test('request lifecycle terminates predictably and never implies real measurements', () => {
  let state = 'idle';
  for (const expected of REQUEST_STATES.slice(1)) { state = nextRequestState(state); assert.equal(state, expected); }
  assert.equal(nextRequestState('complete'), 'complete');
  assert.match(v3En.request.simulation, /SIMULATION/);
  assert.doesNotMatch(read('src/components/engineering/RequestJourney.vue'), /fetch\(|axios|\d+ms/);
  assert.match(read('src/components/engineering/EngineeringFlow.vue'), /\.request-journey\.is-running \.engineering-connection\.is-connected i/);
});

test('terminal only accepts safe, known portfolio actions', () => {
  const ids = ['mission-car-users'];
  assert.deepEqual(parsePortfolioCommand('system on', ids), { type: 'system', value: 'on' });
  assert.deepEqual(parsePortfolioCommand('system off', ids), { type: 'system', value: 'off' });
  assert.deepEqual(parsePortfolioCommand('system', ids), { type: 'system', value: 'toggle' });
  assert.deepEqual(parsePortfolioCommand(' GOTO ARCHITECTURE ', ids), { type: 'goto', id: 'engineering' });
  assert.deepEqual(parsePortfolioCommand('open mission-car-users', ids), { type: 'project', id: 'mission-car-users' });
  for (const input of ['system delete', 'open javascript:alert(1)', 'goto https://example.com', 'open unknown', 'eval process', 'system on; fetch()']) assert.equal(parsePortfolioCommand(input, ids), null);
});

test('intro is claimed only once per session and blocked storage is harmless', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  assert.equal(claimHeroEntrance(storage), true);
  assert.equal(claimHeroEntrance(storage), false);
  assert.equal(claimHeroEntrance({ getItem() { throw new Error('blocked'); } }), true);
  assert.deepEqual([...values.keys()], ['portfolio-v3-entered']);
});

test('depth is bounded without changing magnetic CTA distance', () => {
  assert.equal(clampDepth(-20), -1); assert.equal(clampDepth(20), 1); assert.equal(clampDepth(.2), .2);
  assert.match(read('src/directives/projectDepth.js'), /\* 4/);
  assert.doesNotMatch(read('src/components/hero/HeroExperience.vue'), /setInterval|data-motion-hero|overflow\s*=\s*['"]hidden/);
});

test('request timers cancel on hide, reduced-motion change, and unmount', () => {
  const mounted = [], unmounted = [], events = new Map(), timers = new Map();
  let counter = 0;
  const query = { matches: false, addEventListener: (_, cb) => events.set('motion', cb), removeEventListener: () => events.delete('motion') };
  const document = { hidden: false, addEventListener: (name, cb) => events.set(name, cb), removeEventListener: name => events.delete(name) };
  const context = { computed, ref, REQUEST_STATES, nextRequestState, document, matchMedia: () => query, onMounted: cb => mounted.push(cb), onUnmounted: cb => unmounted.push(cb), setTimeout: cb => { timers.set(++counter, cb); return counter; }, clearTimeout: id => timers.delete(id) };
  const source = read('src/composables/useRequestJourney.js').replace(/^import .+;$/gm, '').replace('export function', 'function');
  runInNewContext(source + '\nsubject = useRequestJourney();', context);
  mounted.forEach(cb => cb()); const api = context.subject;
  api.run(); api.run(); assert.equal(timers.size, 1); assert.equal(api.state.value, 'request');
  document.hidden = true; events.get('visibilitychange')(); assert.equal(timers.size, 0); assert.equal(api.state.value, 'idle');
  document.hidden = false; api.run(); query.matches = true; events.get('motion')(); assert.equal(api.state.value, 'complete'); assert.equal(timers.size, 0);
  api.run(); assert.equal(api.state.value, 'complete'); assert.equal(timers.size, 0);
  query.matches = false; events.get('motion')(); api.run(); unmounted.forEach(cb => cb()); assert.equal(timers.size, 0); assert.equal(events.size, 0);
});

test('V3 scoped styling cannot leak transforms to the page root', () => {
  for (const file of ['hero/HeroExperience', 'hero/HeroSystemScene', 'system/SystemMode', 'engineering/RequestJourney', 'portfolio/ContextPointer']) {
    const { descriptor } = parse(read(`src/components/${file}.vue`));
    for (const style of descriptor.styles) {
      const result = compileStyle({ source: style.content, filename: `${file}.vue`, id: 'data-v-v3test', scoped: style.scoped });
      assert.deepEqual(result.errors, []);
      assert.doesNotMatch(result.code, /(?:html|body)\s*\{|transition:\s*all\b|cursor:\s*none/);
    }
  }
  const overlay = read('src/components/system/SystemMode.vue');
  assert.match(overlay, /position: absolute/); assert.match(overlay, /pointer-events: none/);
  assert.match(overlay, /useSystemMode/); assert.match(read('src/components/terminal/DeveloperTerminal.vue'), /useSystemMode/);
});
