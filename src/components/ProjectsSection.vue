<script setup>
import { computed, onUnmounted, ref, watch } from "vue";
import { TransitionGroup } from "vue";
import { projects } from "../data/projects";

const props = defineProps({ lang: { type: String, required: true }, t: { type: Function, required: true } });
const selectedFilter = ref("all");
const filterKeys = ["all", "fullstack", "frontend", "mobile"];
const projectsPerPage = 3;
const currentPage = ref(1);
const gridMinHeight = ref(0);
const pointerStart = ref(null);
let releaseGridHeightTimer;
const filteredProjects = computed(() => selectedFilter.value === "all" ? projects : projects.filter((project) => project.category === selectedFilter.value));
const pageCount = computed(() => Math.max(1, Math.ceil(filteredProjects.value.length / projectsPerPage)));
const paginatedProjects = computed(() => filteredProjects.value.slice((currentPage.value - 1) * projectsPerPage, currentPage.value * projectsPerPage));
const localized = (value) => value[props.lang];

function preserveGridHeight(releaseAfterTransition = false) {
  const grid = document.getElementById("portfolio-grid");
  if (!grid) return;
  const scrollY = window.scrollY;
  gridMinHeight.value = Math.max(gridMinHeight.value, Math.ceil(grid.getBoundingClientRect().height));
  window.clearTimeout(releaseGridHeightTimer);
  if (releaseAfterTransition) releaseGridHeightTimer = window.setTimeout(() => {
    gridMinHeight.value = 0;
    window.requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: "auto" }));
  }, 460);
}
function setFilter(filter) {
  if (filter === selectedFilter.value) return;
  preserveGridHeight(true);
  selectedFilter.value = filter;
}
function goToPage(page) {
  const nextPage = Math.min(Math.max(page, 1), pageCount.value);
  if (nextPage === currentPage.value) return;
  preserveGridHeight();
  currentPage.value = nextPage;
}
function nextPage() { goToPage(currentPage.value + 1); }
function previousPage() { goToPage(currentPage.value - 1); }
function startProjectSwipe(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  if (event.target instanceof Element && event.target.closest("a, button")) return;
  pointerStart.value = { x: event.clientX, y: event.clientY };
}
function finishProjectSwipe(event) {
  if (!pointerStart.value) return;
  const distanceX = event.clientX - pointerStart.value.x;
  const distanceY = event.clientY - pointerStart.value.y;
  pointerStart.value = null;
  if (Math.abs(distanceX) < 56 || Math.abs(distanceX) <= Math.abs(distanceY) * 1.25 || pageCount.value <= 1) return;
  const shouldAdvance = props.lang === "ar" ? distanceX > 0 : distanceX < 0;
  if (shouldAdvance) nextPage();
  else previousPage();
}
function cancelProjectSwipe() { pointerStart.value = null; }

watch(selectedFilter, () => { currentPage.value = 1; });
watch(pageCount, (totalPages) => { if (currentPage.value > totalPages) currentPage.value = totalPages; });
onUnmounted(() => window.clearTimeout(releaseGridHeightTimer));
</script>

<template>
  <section id="portfolio" class="py-24 px-4 md:px-8 bg-white dark:bg-slate-900/50 relative overflow-hidden" aria-labelledby="portfolio-title">
    <div class="absolute top-1/4 left-0 w-96 h-96 bg-primary rounded-full filter blur-3xl opacity-10"></div>
    <div class="container mx-auto max-w-7xl relative z-10">
      <div class="text-center mb-16" data-reveal>
        <span class="text-accent text-lg font-medium mb-3 block">{{ t('projects.eyebrow') }}</span>
        <h2 id="portfolio-title" class="section-title text-5xl font-black mb-4">{{ t('projects.titleLead') }} <span class="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{{ t('projects.titleAccent') }}</span></h2>
        <div class="w-24 h-1.5 bg-linear-to-r from-accent to-primary mx-auto rounded-full"></div>
        <p class="text-slate-500 dark:text-slate-400 mt-6">{{ t('projects.count') }}</p>
      </div>

      <div id="portfolio-filters" class="flex justify-center gap-4 mb-12 flex-wrap" role="group" :aria-label="t('projects.filtersLabel')">
        <button v-for="filter in filterKeys" :key="filter" type="button" :aria-pressed="selectedFilter === filter" :class="['project-filter px-8 py-3 rounded-xl font-bold', selectedFilter === filter ? 'text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700']" @click="setFilter(filter)"><span>{{ t(`projects.filters.${filter}`) }}</span></button>
      </div>

      <div v-if="pageCount > 1" class="project-pagination project-pagination--mobile md:hidden" role="navigation" :aria-label="t('projects.page')">
        <div class="project-pagination__panel">
          <button type="button" class="project-pagination__control project-pagination__control--previous" :aria-label="t('projects.previousPage')" :disabled="currentPage === 1" @click="previousPage"><i class="fa-solid" :class="lang === 'ar' ? 'fa-chevron-right' : 'fa-chevron-left'" aria-hidden="true"></i></button>
          <div class="project-pagination__indicators" role="tablist" :aria-label="t('projects.page')">
            <button v-for="page in pageCount" :key="page" type="button" role="tab" :aria-selected="currentPage === page" :aria-label="`${t('projects.page')} ${page}`" :class="['project-pagination__indicator', { 'is-active': currentPage === page }]" @click="goToPage(page)"></button>
          </div>
          <button type="button" class="project-pagination__control project-pagination__control--next" :aria-label="t('projects.nextPage')" :disabled="currentPage === pageCount" @click="nextPage"><i class="fa-solid" :class="lang === 'ar' ? 'fa-chevron-left' : 'fa-chevron-right'" aria-hidden="true"></i></button>
        </div>
      </div>

      <TransitionGroup name="project-list" tag="div" id="portfolio-grid" class="project-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" :style="{ minHeight: gridMinHeight ? `${gridMinHeight}px` : undefined }" data-reveal @pointerdown="startProjectSwipe" @pointerup="finishProjectSwipe" @pointercancel="cancelProjectSwipe" @pointerleave="cancelProjectSwipe">
        <article v-for="project in paginatedProjects" :key="project.id" class="portfolio-item group relative bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-primary transition-all duration-300">
          <div class="relative h-72 overflow-hidden">
            <img :src="project.image" :alt="`${localized(project.title)} project preview`" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" width="1265" height="712" sizes="(min-width: 1024px) 27rem, (min-width: 768px) 43vw, 100vw" loading="lazy" decoding="async" />
            <div class="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span v-if="project.live" class="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg"><i class="fa-solid fa-circle text-[8px] mr-1" aria-hidden="true"></i>{{ t('projects.live') }}</span>
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between gap-4 mb-3">
              <span :class="['px-4 py-1 rounded-full text-sm font-medium', project.tone === 'secondary' ? 'bg-secondary/20 text-secondary' : project.tone === 'accent' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary']">{{ t(`projects.filters.${project.category}`) }}</span>
              <div class="flex gap-2">
                <a v-if="project.live" :href="project.live" class="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300" :aria-label="`${t('projects.live')}: ${localized(project.title)}`" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-eye" aria-hidden="true"></i></a>
                <a v-if="project.github" :href="project.github" class="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center hover:bg-secondary hover:text-white transition-colors duration-300" :aria-label="`${t('projects.github')}: ${localized(project.title)}`" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github" aria-hidden="true"></i></a>
              </div>
            </div>
            <h3 class="text-2xl font-bold mb-2">{{ localized(project.title) }}</h3>
            <p class="text-slate-500 dark:text-slate-400 mb-4">{{ localized(project.description) }}</p>
            <div class="flex flex-wrap gap-2"><span v-for="technology in project.technologies" :key="technology" class="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs">{{ technology }}</span></div>
          </div>
        </article>
      </TransitionGroup>

      <div v-if="pageCount > 1" class="project-pagination project-pagination--desktop hidden md:flex" role="navigation" :aria-label="t('projects.page')">
        <div class="project-pagination__panel">
          <button type="button" class="project-pagination__control project-pagination__control--previous" :aria-label="t('projects.previousPage')" :disabled="currentPage === 1" @click="previousPage"><i class="fa-solid" :class="lang === 'ar' ? 'fa-chevron-right' : 'fa-chevron-left'" aria-hidden="true"></i></button>
          <div class="project-pagination__indicators" role="tablist" :aria-label="t('projects.page')">
            <button v-for="page in pageCount" :key="page" type="button" role="tab" :aria-selected="currentPage === page" :aria-label="`${t('projects.page')} ${page}`" :class="['project-pagination__indicator', { 'is-active': currentPage === page }]" @click="goToPage(page)"></button>
          </div>
          <button type="button" class="project-pagination__control project-pagination__control--next" :aria-label="t('projects.nextPage')" :disabled="currentPage === pageCount" @click="nextPage"><i class="fa-solid" :class="lang === 'ar' ? 'fa-chevron-left' : 'fa-chevron-right'" aria-hidden="true"></i></button>
        </div>
      </div>

      <div class="project-cta-wrap text-center"><a href="#contact" class="project-cta inline-flex items-center gap-3 px-12 py-4 rounded-xl text-lg font-bold text-white"><span>{{ t('projects.moreCta') }}</span><i class="fa-solid fa-rocket" aria-hidden="true"></i></a></div>
    </div>
  </section>
</template>
