<script setup>
import { computed, ref } from "vue";
import { TransitionGroup } from "vue";
import { projects } from "../data/projects";

const props = defineProps({ lang: { type: String, required: true }, t: { type: Function, required: true } });
const selectedFilter = ref("all");
const filterKeys = ["all", "fullstack", "frontend", "mobile"];
const filteredProjects = computed(() => selectedFilter.value === "all" ? projects : projects.filter((project) => project.category === selectedFilter.value));
const localized = (value) => value[props.lang];
</script>

<template>
  <section id="portfolio" class="py-24 px-4 md:px-8 bg-white dark:bg-slate-900/50 relative overflow-hidden" aria-labelledby="portfolio-title">
    <div class="absolute top-1/4 left-0 w-96 h-96 bg-primary rounded-full filter blur-3xl opacity-10"></div>
    <div class="container mx-auto max-w-7xl relative z-10">
      <div class="text-center mb-16" data-reveal>
        <span class="text-accent text-lg font-medium mb-3 block">{{ t('projects.eyebrow') }}</span>
        <h2 id="portfolio-title" class="text-5xl font-black mb-4">{{ t('projects.title') }}</h2>
        <div class="w-24 h-1.5 bg-linear-to-r from-accent to-primary mx-auto rounded-full"></div>
        <p class="text-slate-500 dark:text-slate-400 mt-6">{{ t('projects.count') }}</p>
      </div>

      <div id="portfolio-filters" class="flex flex-wrap justify-center gap-3 mb-12" role="group" :aria-label="t('projects.filtersLabel')">
        <button v-for="filter in filterKeys" :key="filter" type="button" :aria-pressed="selectedFilter === filter" :class="['px-6 py-3 rounded-xl border transition-all duration-300 font-medium', selectedFilter === filter ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary']" @click="selectedFilter = filter">{{ t(`projects.filters.${filter}`) }}</button>
      </div>

      <TransitionGroup name="project-list" tag="div" id="portfolio-grid" class="project-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-reveal>
        <article v-for="project in filteredProjects" :key="project.id" class="portfolio-item group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 hover:border-primary transition-all duration-300">
          <div class="relative h-72 overflow-hidden">
            <img v-if="project.image" :src="project.image" :alt="`${localized(project.title)} project preview`" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" decoding="async" />
            <div v-else class="project-preview-fallback w-full h-full flex flex-col items-center justify-center text-white bg-gradient-to-br from-slate-950 via-primary/70 to-secondary"><i class="fa-solid fa-car-side text-6xl mb-4" aria-hidden="true"></i><span class="font-bold text-lg">{{ t('projects.unavailablePreview') }}</span><small class="mt-2 text-white/70">{{ t('projects.unavailableNote') }}</small></div>
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

      <div class="text-center mt-12"><a href="#contact" class="inline-flex items-center gap-3 bg-linear-to-l from-primary to-secondary px-8 py-4 rounded-2xl text-lg font-bold text-white hover:-translate-y-1 transition-all duration-300"><span>{{ t('projects.moreCta') }}</span><i class="fa-solid fa-arrow-left" aria-hidden="true"></i></a></div>
    </div>
  </section>
</template>
