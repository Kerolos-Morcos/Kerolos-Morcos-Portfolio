import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { parse, compileStyle } from '@vue/compiler-sfc';
import { v2En, v2Ar } from '../src/i18n/v2.js';
import { caseStudies } from '../src/data/caseStudies.js';
import { allowedEvents, sanitizedUrl, interactionProperties } from '../src/lib/analyticsPolicy.js';
import { MOTION, EASING } from '../src/motion.js';
import { themes } from '../src/theme.js';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
  assert.equal(typeof value, 'string');
  assert.ok(value.trim());
  return 'text';
}

test('English and Arabic V2 content have identical nonempty shapes', () => {
  assert.deepEqual(shape(v2En), shape(v2Ar));
});

test('case studies only extend real projects and carry bilingual content', () => {
  const source = read('src/data/projects.js');
  for (const [id, detail] of Object.entries(caseStudies)) {
    assert.ok(source.includes(`id: "${id}"`));
    for (const value of Object.values(detail)) {
      for (const item of Array.isArray(value) ? value : [value]) {
        assert.ok(item.en?.trim());
        assert.ok(item.ar?.trim());
      }
    }
    assert.equal(detail.metrics, undefined);
  }
  assert.match(caseStudies['bookly-app'].previewNote.en, /not an application screenshot/);
});

test('analytics removes URL query, hash, and credentials', () => {
  assert.equal(sanitizedUrl('https://name:secret@example.com/?email=private#message'), 'https://example.com/');
  assert.equal(sanitizedUrl('javascript:alert(1)'), null);
  assert.equal(sanitizedUrl('not a URL'), null);
});

test('analytics accepts only known interaction events and project IDs', () => {
  assert.equal(allowedEvents.size, 8);
  assert.equal(allowedEvents.has('contact_message_text'), false);
  const ids = new Set(['mission-car-users']);
  assert.deepEqual(interactionProperties('mission-car-users', ids), { project: 'mission-car-users' });
  assert.equal(interactionProperties('private@example.com', ids), undefined);
  assert.equal(interactionProperties({ name: 'Private', message: 'secret' }, ids), undefined);
});

test('motion hierarchy retains accepted easing and bounded pointer distance', () => {
  assert.equal(EASING, 'cubic-bezier(.22, 1, .36, 1)');
  assert.ok(MOTION.fast < MOTION.medium && MOTION.medium < MOTION.slow);
  assert.ok(MOTION.magneticDistance >= 3 && MOTION.magneticDistance <= 6);
});

test('new primary buttons meet 4.5:1 contrast in every palette and hover state', () => {
  const rgb = hex => hex.slice(1).match(/\w\w/g).map(value => parseInt(value, 16) / 255);
  const luminance = color => color.map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
  const base = rgb('#0f172a');
  for (const theme of themes) {
    for (const key of ['primary', 'secondary']) {
      const background = rgb(theme[key]).map((value, index) => value * .6 + base[index] * .4);
      assert.ok(1.05 / (luminance(background) + .05) >= 4.5, `${theme.name}: ${key}`);
    }
  }
  assert.match(read('src/assets/portfolio-v2.css'), /var\(--color-primary\) 60%, #0f172a/);
});

test('component-scoped RTL selectors cannot transform the html root', () => {
  for (const folder of ['engineering', 'portfolio', 'projects', 'terminal', 'ui']) {
    for (const file of readdirSync(new URL(`src/components/${folder}/`, root))) {
      if (!file.endsWith('.vue')) continue;
      const { descriptor } = parse(read(`src/components/${folder}/${file}`));
      for (const style of descriptor.styles) {
        const result = compileStyle({ source: style.content, filename: file, id: 'data-v-test', scoped: style.scoped });
        assert.deepEqual(result.errors, []);
        assert.doesNotMatch(result.code, /html\[dir[^\]]+\]\s*\{/);
        assert.doesNotMatch(result.code, /transition:\s*all\b/);
      }
    }
  }
});
