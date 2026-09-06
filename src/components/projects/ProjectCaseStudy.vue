<script setup>
import { computed, ref } from 'vue';
import PortfolioDialog from '../ui/PortfolioDialog.vue';
import { trackEvent } from '../../lib/analytics';
const props = defineProps({ project: { type: Object, required: true }, lang: { type: String, required: true }, t: { type: Function, required: true } });
defineEmits(['close']);
const dialog = ref(null);
const copyState = ref('');
const detail = computed(() => props.project.caseStudy);
const local = (value) => value?.[props.lang] || '';
const sections = computed(() => ['problem', 'role', 'solution', 'challenge', 'decisions', 'result', 'lessons'].filter(key => detail.value?.[key]));
async function share() {
  try { await navigator.clipboard.writeText(location.href); copyState.value = 'copied'; }
  catch { copyState.value = 'copyFailed'; }
}
function contact() {
  dialog.value.close();
  // Anchor navigation happens after the dialog's close transition in @close.
  goToContact.value = true;
}
const goToContact = ref(false);
function afterClose(emit) {
  emit('close', goToContact.value ? 'contact' : null);
}
</script>

<template>
  <PortfolioDialog ref="dialog" :title="`${t('v2.overview')} / ${local(project.title)}`" :close-label="t('v2.close')" @close="afterClose($emit)">
    <div class="case-intro">
      <p class="v2-eyebrow">{{ t(`projects.filters.${project.category}`) }} <span aria-hidden="true">/</span> {{ project.technologies.slice(0, 2).join(' + ') }}</p>
      <h2>{{ local(project.title) }}</h2>
      <p class="case-description">{{ local(project.description) }}</p>
      <div class="v2-actions">
        <a v-if="project.live" :href="project.live" :data-cursor-label="t('v3.pointer.visit')" target="_blank" rel="noopener noreferrer" class="v2-button v2-button--primary" @click="trackEvent('project_case_study_live_click', project.id)">{{ t('v2.live') }} <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>
        <a v-if="project.github" :href="project.github" target="_blank" rel="noopener noreferrer" class="v2-button" @click="trackEvent('github_project_click', project.id)"><i class="fa-brands fa-github" aria-hidden="true"></i>{{ t('v2.source') }}</a>
        <button type="button" class="v2-button" @click="share"><i class="fa-solid fa-link" aria-hidden="true"></i>{{ t('v2.share') }}</button>
      </div>
      <p v-if="copyState" role="status" class="case-copy-status">{{ t(`v2.${copyState}`) }}</p>
    </div>
    <figure class="case-image"><div v-if="!detail?.previewNote" class="case-browser-frame" aria-hidden="true"><span>● ● ●</span><code>{{ local(project.title) }}</code><i class="fa-solid fa-arrow-up-right-from-square"></i></div><img :src="project.image" :alt="`${local(project.title)} — ${local(detail?.previewNote) || t('v2.preview')}`" width="1265" height="712" /><figcaption>{{ local(detail?.previewNote) || t('v2.preview') }} <span aria-hidden="true">·</span> {{ local(project.title) }}</figcaption></figure>
    <div class="case-body">
      <div class="case-stories">
        <section v-for="(key, index) in sections" :key="key" class="case-story"><span class="case-index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span><div><h3>{{ t(`v2.${key}`) }}</h3><p>{{ local(detail[key]) }}</p></div></section>
        <section v-if="detail?.architecture" class="case-architecture"><h3>{{ t('v2.architecture') }}</h3><ol><li v-for="node in detail.architecture" :key="node.en">{{ local(node) }}</li></ol></section>
      </div>
      <aside class="case-facts">
        <h3>{{ t('v2.stack') }}</h3>
        <ul><li v-for="tech in project.technologies" :key="tech"><span class="case-dot" aria-hidden="true"></span><bdi>{{ tech }}</bdi></li></ul>
        <p v-for="note in detail?.stackNotes" :key="note.en" class="case-note">{{ local(note) }}</p>
        <template v-if="detail?.features"><h3>{{ t('v2.features') }}</h3><ul><li v-for="feature in detail.features" :key="feature.en"><i class="fa-solid fa-check" aria-hidden="true"></i>{{ local(feature) }}</li></ul></template>
        <p class="case-note">{{ t('v2.evidence') }}</p>
      </aside>
    </div>
    <footer class="case-footer"><div><p class="v2-eyebrow">{{ t('v2.similar') }}</p><h3>{{ t('v2.talk') }}</h3></div><button class="v2-button v2-button--primary" type="button" @click="contact">{{ t('hero.contactCta') }} <i class="fa-solid fa-paper-plane" aria-hidden="true"></i></button></footer>
  </PortfolioDialog>
</template>

<style scoped>
.case-intro { padding: 2.5rem 2.5rem 2rem; background: radial-gradient(ellipse at 100% 0%, rgb(var(--accent-primary-rgb) / .10), transparent 65%); }
.case-browser-frame { display: flex; align-items: center; gap: 1rem; padding: .75rem 1rem; border-bottom: 1px solid var(--v2-border); color: var(--v2-muted); font-size: .65rem; }
.case-browser-frame > span { color: var(--v2-accent-text); letter-spacing: 3px; }.case-browser-frame code { flex: 1; text-align: center; font-size: .7rem; }
.case-intro h2 { font-size: clamp(2rem, 5vw, 3.25rem); font-weight: 900; line-height: 1.2; margin-block: .75rem 1rem; overflow-wrap: anywhere; }
.case-description { max-width: 680px; font-size: 1.2rem; color: var(--v2-muted); line-height: 1.8; margin-bottom: 1.5rem; }
.case-image { margin-inline: 2.5rem; border: 1px solid var(--v2-border); border-radius: 1rem; overflow: hidden; background: var(--v2-inset); }
.case-image img { width: 100%; max-height: 480px; aspect-ratio: 1265/712; object-fit: contain; }
.case-image figcaption { padding: .75rem 1rem; font-size: .8rem; color: var(--v2-muted); border-top: 1px solid var(--v2-border); }
.case-body { padding: 2.5rem; display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 2.5rem; }
.case-stories:empty { display: none; }
.case-body:has(.case-stories:empty) { grid-template-columns: 1fr; }
.case-story { display: flex; gap: 1rem; margin-bottom: 2rem; }
.case-index { color: var(--v2-accent-text); font: .8rem monospace; padding-top: .3rem; }
h3 { font-size: 1.15rem; font-weight: 800; margin-bottom: .6rem; }
.case-story p, .case-note { color: var(--v2-muted); line-height: 1.8; }
.case-facts { padding-inline-start: 1.5rem; border-inline-start: 1px solid var(--v2-border); }
.case-facts ul { display: grid; gap: .7rem; padding: 0; margin-block: 0 1.5rem; list-style: none; }
.case-facts li { display: flex; align-items: center; gap: .6rem; }
.case-facts i { color: var(--v2-accent-text); }
.case-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-primary); }
.case-note { font-size: .9rem; margin-bottom: 1rem; }
.case-architecture ol { list-style: none; display: flex; flex-wrap: wrap; gap: .5rem; padding: 0; }
.case-architecture li { border: 1px solid var(--v2-border); border-radius: .75rem; padding: .8rem; background: var(--v2-inset); font-size: .85rem; }
.case-footer { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; padding: 2rem 2.5rem; background: var(--v2-inset); border-top: 1px solid var(--v2-border); }
.case-copy-status { margin-top: .75rem; }
@media (max-width: 640px) { .case-intro, .case-body, .case-footer { padding: 1.5rem; } .case-image { margin-inline: 1.5rem; } .case-body { grid-template-columns: 1fr; gap: 1rem; } .case-facts { border-inline-start: 0; padding-inline-start: 0; border-top: 1px solid var(--v2-border); padding-top: 1.5rem; } .case-footer { align-items: stretch; flex-direction: column; } }
</style>
