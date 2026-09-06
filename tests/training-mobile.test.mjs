import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { computed, ref, watch } from 'vue';
import { parse, compileStyle } from '@vue/compiler-sfc';
import { certificates } from '../src/data/certificates.js';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const { descriptor } = parse(read('src/components/ExperienceSection.vue'));

// Exercise the actual section logic without a DOM dependency. Lifecycle and
// viewport are controlled; Vue refs/computed values remain real.
function training(width = 390, lang = 'en') {
  const props = { lang };
  const mounted = [];
  const window = { innerWidth: width, addEventListener() {} };
  const context = {
    computed, ref, watch: (value, callback) => watch(value, callback, { flush: 'sync' }),
    onMounted: callback => mounted.push(callback), onUnmounted() {},
    defineProps: () => props, certificates, window,
  };
  runInNewContext(descriptor.scriptSetup.content.replace(/^import .+;$/gm, '') + `
    testApi = { trainingIndex, visibleCount, isMobile, visibleCertificates,
      trainingPageCount, nextTraining, previousTraining, selectTrainingPage,
      startTrainingSwipe, moveTrainingSwipe, finishTrainingSwipe,
      handleTrainingKeydown, updateVisibleCount, pointerStart };`, context);
  mounted.forEach(callback => callback());
  return { ...context.testApi, props, window };
}
const pointer = (x, y = 100, extra = {}) => ({
  clientX: x, clientY: y, pointerId: 1, pointerType: 'touch', isPrimary: true,
  currentTarget: { setPointerCapture() {} }, ...extra,
});

test('code snapshot retains resting classes but has no hover or pointer hooks', () => {
  const source = read('src/components/AboutSection.vue');
  const card = source.match(/<div class="code-editor [^"]+">/)[0];
  assert.equal(card, '<div class="code-editor rounded-2xl overflow-hidden shadow-2xl">');
  const editorMarkup = source.slice(source.indexOf(card), source.indexOf('<div class="grid grid-cols-3'));
  assert.doesNotMatch(editorMarkup, /hover:|v-spotlight|v-magnetic|pointer-active/);
});

test('mobile retains each certificate once and cycles through all three', () => {
  const c = training();
  assert.equal(c.isMobile.value, true);
  assert.equal(c.visibleCount.value, 1);
  assert.equal(c.visibleCertificates.value, certificates);
  assert.equal(c.trainingPageCount.value, 3);
  c.previousTraining(); assert.equal(c.trainingIndex.value, 2);
  c.nextTraining(); assert.equal(c.trainingIndex.value, 0);
  c.nextTraining(); assert.equal(c.trainingIndex.value, 1);
  c.selectTrainingPage(99); assert.equal(c.trainingIndex.value, 2);
});

test('mobile swipe follows LTR/RTL and ignores short, vertical, diagonal and secondary gestures', () => {
  for (const lang of ['en', 'ar']) {
    const c = training(390, lang);
    const end = lang === 'ar' ? 260 : 60;
    c.startTrainingSwipe(pointer(160)); c.finishTrainingSwipe(pointer(end));
    assert.equal(c.trainingIndex.value, 1);
    c.startTrainingSwipe(pointer(end)); c.finishTrainingSwipe(pointer(160));
    assert.equal(c.trainingIndex.value, 0);
    c.startTrainingSwipe(pointer(160)); c.finishTrainingSwipe(pointer(140));
    c.startTrainingSwipe(pointer(160)); c.moveTrainingSwipe(pointer(155, 150)); c.finishTrainingSwipe(pointer(60, 150));
    c.startTrainingSwipe(pointer(160)); c.finishTrainingSwipe(pointer(60, 190));
    c.startTrainingSwipe(pointer(160, 100, { isPrimary: false })); c.finishTrainingSwipe(pointer(60));
    assert.equal(c.trainingIndex.value, 0);
    c.startTrainingSwipe(pointer(160)); c.pointerStart.value = null; c.finishTrainingSwipe(pointer(60));
    assert.equal(c.trainingIndex.value, 0);
  }
});

test('arrow keys mirror for Arabic and do not consume vertical scrolling keys', () => {
  for (const lang of ['en', 'ar']) {
    const c = training(390, lang);
    let prevented = 0;
    c.handleTrainingKeydown({ key: lang === 'ar' ? 'ArrowLeft' : 'ArrowRight', preventDefault: () => prevented++ });
    assert.equal(c.trainingIndex.value, 1);
    c.handleTrainingKeydown({ key: 'ArrowDown', preventDefault: () => prevented++ });
    assert.equal(prevented, 1);
  }
});

test('tablet/desktop retain original counts and slicing at 768/1024', () => {
  for (const [width, count] of [[360, 1], [390, 1], [430, 1], [767, 1], [768, 2], [1024, 3], [1440, 3]]) {
    const c = training(width);
    assert.equal(c.visibleCount.value, count);
    assert.equal(c.isMobile.value, width < 768);
    if (width >= 768) assert.deepEqual(c.visibleCertificates.value, certificates.slice(0, count));
  }
  const c = training(); c.selectTrainingPage(2);
  c.window.innerWidth = 1024; c.updateVisibleCount();
  assert.equal(c.trainingIndex.value, 0);
});

test('mobile slides use a stable intrinsic grid and stay outside entrance enrollment', () => {
  const template = descriptor.template.content;
  assert.match(template, /<div data-motion="fade-up" data-motion-step="2">\s*<TransitionGroup/);
  assert.doesNotMatch(template.match(/<article v-for="\(certificate[\s\S]*?<\/article>/)[0], /data-motion/);
  assert.match(template, /:css="!isMobile"/);
  assert.match(template, /:inert="isMobile && index !== trainingIndex"/);
  assert.match(template, /<nav v-if="isMobile"/);
  const style = descriptor.styles[0];
  assert.match(style.content, /max-width: 767px/);
  assert.match(style.content, /grid-area: 1 \/ 1; align-self: start/);
  assert.match(style.content, /touch-action: pan-y pinch-zoom/);
  assert.match(style.content, /prefers-reduced-motion: reduce/);
  const result = compileStyle({ source: style.content, filename: 'ExperienceSection.vue', id: 'data-v-training', scoped: true });
  assert.deepEqual(result.errors, []);
  assert.doesNotMatch(result.code, /html\[dir[^\]]+\]\s*\{|transition:\s*all\b/);
});
