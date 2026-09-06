<script setup>
import { computed, nextTick, ref } from 'vue';
import PortfolioDialog from '../ui/PortfolioDialog.vue';
import { projects } from '../../data/projects';
import { experience } from '../../data/experience';
import { useSystemMode } from '../../composables/useSystemMode';
import { parsePortfolioCommand } from '../../lib/v3';
const props = defineProps({ lang: { type: String, required: true }, t: { type: Function, required: true }, themeName: String, isDark: Boolean });
const emit = defineEmits(['close', 'open-project']);
const system = useSystemMode();
const dialog = ref(null);
const input = ref('');
const output = ref(null);
const entries = ref([{ command: 'help' }]);
const history = ref([]);
const historyIndex = ref(0);
const commands = ['help', 'whoami', 'stack', 'projects', 'experience', 'contact', 'system', 'goto architecture', 'status', 'clear'];
const response = (command) => {
  if (command === 'whoami') return `${props.t('hero.name')} — ${props.t('hero.role')}. ${props.t('v2.heroProof')}`;
  if (command === 'stack') return 'Vue.js · Node.js · Express.js · MySQL · REST APIs';
  if (command === 'projects') return projects.slice(0, 4).map(p => p.title[props.lang]).join(' · ');
  if (command === 'experience') return experience.map(item => `${item.company[props.lang]} — ${item.role[props.lang]}`).join('\n');
  if (command === 'contact') return props.t('v2.talk');
  if (command === 'kerolos') return props.t('v2.terminal.egg');
  if (command === 'help') return `${props.t('v2.terminal.help')}\n${props.t('v3.terminal.help')}`;
  return props.t('v2.terminal.unknown');
};
const latest = computed(() => entries.value.at(-1));
async function execute(value = input.value) {
  const command = value.trim().toLowerCase().slice(0, 80);
  if (!command) return;
  history.value = [...history.value.slice(-29), command];
  historyIndex.value = history.value.length;
  input.value = '';
  const action = parsePortfolioCommand(command, projects.map(project => project.id));
  let result;
  if (action?.type === 'system') {
    if (action.value === 'toggle') system.toggle(); else system.set(action.value === 'on');
    result = props.t(system.enabled.value ? 'v3.system.on' : 'v3.system.off');
  }
  if (action?.type === 'theme') result = `${props.t('v3.terminal.theme')}: ${props.themeName} · ${props.isDark ? 'Dark' : 'Light'}`;
  if (action?.type === 'status') result = `${props.t('v3.terminal.status')}\n${props.t(system.enabled.value ? 'v3.system.on' : 'v3.system.off')}`;
  if (action?.type === 'goto') { result = props.t('v3.terminal.go'); navigate(action.id); }
  if (action?.type === 'project') { result = props.t('v3.terminal.project'); projectDestination = action.id; dialog.value.close(); }
  if (command === 'clear') entries.value = [];
  else entries.value = [...entries.value.slice(-19), { command, result }];
  await nextTick();
  if (output.value) output.value.scrollTop = output.value.scrollHeight;
}
function recall(direction) {
  historyIndex.value = Math.max(0, Math.min(history.value.length, historyIndex.value + direction));
  input.value = history.value[historyIndex.value] || '';
}
let destination;
let projectDestination;
function navigate(id) { destination = id; dialog.value.close(); }
function closed() {
  emit('close');
  if (projectDestination) emit('open-project', projectDestination);
  if (destination) requestAnimationFrame(() => document.getElementById(destination)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
}
</script>

<template>
  <PortfolioDialog ref="dialog" compact :title="t('v2.terminal.title')" :close-label="t('v2.close')" @close="closed">
    <div class="terminal-body">
      <p class="terminal-intro">{{ t('v2.terminal.intro') }}</p>
      <div class="terminal-commands"><button v-for="command in commands" :key="command" type="button" @click="execute(command)">{{ command }}</button></div>
      <div ref="output" class="terminal-output" tabindex="0" :aria-label="t('v2.terminal.title')">
        <p v-if="!entries.length" class="terminal-muted">{{ t('v2.terminal.empty') }}</p>
        <div v-for="(entry, index) in entries" :key="index" class="terminal-entry"><p class="terminal-command" dir="ltr"><span aria-hidden="true">❯</span> {{ entry.command }}</p><p class="terminal-response">{{ entry.result || response(entry.command) }}</p>
          <button v-if="entry.command === 'projects'" type="button" class="terminal-link" @click="navigate('portfolio')">{{ t('v2.terminal.visit') }} ↓</button>
          <button v-if="entry.command === 'experience'" type="button" class="terminal-link" @click="navigate('experience')">{{ t('v2.terminal.experience') }} ↓</button>
          <button v-if="entry.command === 'contact'" type="button" class="terminal-link" @click="navigate('contact')">{{ t('v2.terminal.contact') }} ↓</button>
        </div>
      </div>
      <p class="sr-only" role="status" aria-live="polite">{{ latest ? latest.result || response(latest.command) : t('v2.terminal.empty') }}</p>
      <form class="terminal-form" @submit.prevent="execute()"><span class="terminal-caret" aria-hidden="true">❯</span><input v-model="input" :aria-label="t('v2.terminal.label')" :placeholder="t('v2.terminal.prompt')" autocomplete="off" autocapitalize="off" :spellcheck="false" maxlength="80" dir="ltr" @keydown.up.prevent="recall(-1)" @keydown.down.prevent="recall(1)" /><button type="submit" class="v2-icon-button" :aria-label="t('v2.terminal.run')"><i class="fa-solid fa-arrow-turn-down" aria-hidden="true"></i></button></form>
      <p class="terminal-muted terminal-help">{{ t('v2.terminal.hint') }}</p><p class="terminal-muted terminal-help">{{ t('v2.terminal.local') }}</p>
    </div>
  </PortfolioDialog>
</template>

<style scoped>
.terminal-body { padding: 1.5rem; }
.terminal-intro { line-height: 1.8; color: var(--v2-muted); margin-bottom: 1rem; }
.terminal-commands { display: flex; flex-wrap: wrap; gap: .4rem; direction: ltr; margin-bottom: 1.25rem; }
.terminal-commands button { border: 1px solid var(--v2-border); border-radius: .65rem; min-height: 44px; padding: .5rem .75rem; font: .85rem monospace; transition: border-color var(--motion-fast), background-color var(--motion-fast); }
.terminal-commands button:hover { border-color: var(--color-primary); background: var(--v2-inset); }
.terminal-output { min-height: 180px; max-height: 38dvh; overflow-y: auto; overflow-wrap: anywhere; border-block: 1px solid var(--v2-border); padding-block: 1.25rem; }
.terminal-entry + .terminal-entry { margin-top: 1.25rem; }
.terminal-command { color: var(--v2-accent-text); font: .95rem monospace; margin-bottom: .5rem; }
.terminal-response { white-space: pre-line; line-height: 1.8; }
.terminal-link { display: inline-flex; align-items: center; min-height: 44px; color: var(--v2-accent-text); text-decoration: underline; text-underline-offset: 4px; }
.terminal-form { display: flex; align-items: center; gap: .75rem; margin-top: 1rem; border: 1px solid var(--v2-border); border-radius: .75rem; padding: .5rem; direction: ltr; background: var(--v2-inset); }
.terminal-form:focus-within { border-color: var(--color-primary); }
.terminal-form input { width: 100%; min-width: 0; padding: .5rem; border: 0; background: transparent; color: var(--v2-text); font: 16px monospace; }
.terminal-caret { margin-inline-start: .5rem; color: var(--v2-accent-text); animation: caret 1.5s ease-in-out infinite; }
.terminal-muted { color: var(--v2-muted); }
.terminal-help { font-size: .75rem; margin-top: .8rem; }
@keyframes caret { 50% { opacity: .35; } }
@media (prefers-reduced-motion: reduce) { .terminal-caret { animation: none; } }
</style>
