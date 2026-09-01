<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { certificates } from "../data/certificates";
import { experience } from "../data/experience";

const props = defineProps({ lang: { type: String, required: true }, t: { type: Function, required: true } });

const trainingIndex = ref(0);
const visibleCount = ref(1);
const trainingPageCount = computed(() => Math.max(1, certificates.length - visibleCount.value + 1));
const visibleCertificates = computed(() => certificates.slice(trainingIndex.value, trainingIndex.value + visibleCount.value));

function getVisibleCount() {
  if (typeof window === "undefined") return 1;
  return window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
}
function updateVisibleCount() { visibleCount.value = getVisibleCount(); }
function selectTrainingPage(page) { trainingIndex.value = Math.min(Math.max(page, 0), trainingPageCount.value - 1); }
function nextTraining() { selectTrainingPage(trainingIndex.value + 1 >= trainingPageCount.value ? 0 : trainingIndex.value + 1); }
function previousTraining() { selectTrainingPage(trainingIndex.value - 1 < 0 ? trainingPageCount.value - 1 : trainingIndex.value - 1); }

watch(visibleCount, () => selectTrainingPage(trainingIndex.value));
onMounted(() => {
  updateVisibleCount();
  window.addEventListener("resize", updateVisibleCount, { passive: true });
});
onUnmounted(() => window.removeEventListener("resize", updateVisibleCount));
</script>

<template>
  <section id="experience" class="experience-section py-24 px-4 md:px-8 bg-slate-50 dark:bg-transparent relative overflow-hidden" aria-labelledby="experience-title">
    <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary rounded-full filter blur-3xl opacity-10"></div>
    <div class="container mx-auto max-w-7xl relative z-10">
      <div class="text-center mb-16" data-reveal>
        <span class="text-secondary text-lg font-medium mb-3 block">{{ t('experience.eyebrow') }}</span>
        <h2 id="experience-title" class="section-title text-5xl font-black mb-4">{{ t('experience.titleLead') }} <span class="bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">{{ t('experience.titleAccent') }}</span></h2>
        <div class="w-24 h-1.5 bg-linear-to-r from-secondary to-accent mx-auto rounded-full"></div>
      </div>

      <div class="relative">
        <div class="absolute right-1/2 transform translate-x-1/2 h-full w-1 bg-linear-to-b from-primary via-secondary to-accent"></div>

        <div class="space-y-12">
          <div v-for="(item, index) in experience" :key="item.id" class="relative flex items-center">
            <div v-if="index % 2 === 0" class="timeline-side w-1/2 pl-8 text-right">
              <article class="timeline-card-left bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:border-primary transition-all duration-300 transform" data-reveal>
                <div class="flex items-center justify-between mb-4">
                  <span class="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-bold">{{ item.period[lang] }}</span>
                  <i class="fa-solid fa-briefcase text-3xl text-primary" aria-hidden="true"></i>
                </div>
                <h3 class="text-2xl font-bold mb-2">{{ item.role[lang] }}</h3>
                <p class="text-xl text-secondary mb-3">{{ item.company[lang] }}</p>
                <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{{ item.description[lang] }}</p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in item.tags" :key="tag" class="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs">{{ tag }}</span>
                </div>
              </article>
            </div>
            <div v-else class="timeline-side w-1/2 pr-8"></div>

            <div :class="['absolute right-1/2 transform translate-x-1/2 w-6 h-6 rounded-full border-4 border-white dark:border-slate-950 z-10', index % 2 === 0 ? 'bg-primary' : 'bg-secondary']" aria-hidden="true"></div>

            <div v-if="index % 2 === 1" class="timeline-side w-1/2 pr-8 text-right">
              <article class="timeline-card-right bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:border-secondary transition-all duration-300 transform" data-reveal>
                <div class="flex items-center justify-between mb-4">
                  <i class="fa-solid fa-laptop-code text-3xl text-secondary" aria-hidden="true"></i>
                  <span class="px-4 py-2 bg-secondary/20 text-secondary rounded-lg text-sm font-bold">{{ item.period[lang] }}</span>
                </div>
                <h3 class="text-2xl font-bold mb-2">{{ item.role[lang] }}</h3>
                <p class="text-xl text-secondary mb-3">{{ item.company[lang] }}</p>
                <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{{ item.description[lang] }}</p>
                <div class="flex flex-wrap gap-2 justify-end">
                  <span v-for="tag in item.tags" :key="tag" class="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs">{{ tag }}</span>
                </div>
              </article>
            </div>
            <div v-else class="timeline-side w-1/2 pl-8"></div>
          </div>
        </div>
      </div>

      <div class="mt-20">
        <h3 class="section-title text-3xl font-black text-center mb-10" data-reveal><span class="bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">{{ t('experience.trainingTitle') }}</span></h3>
        <p class="text-center text-slate-500 dark:text-slate-400 mb-8" data-reveal>{{ t('experience.certificates') }}</p>
        <TransitionGroup name="training-cards" tag="div" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article v-for="(certificate, index) in visibleCertificates" :key="certificate.id" class="training-card bg-slate-50 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-300 dark:border-slate-700 text-center hover:border-primary transition-all duration-300 transform hover:-translate-y-1" data-reveal :style="{ '--reveal-delay': `${index * 80}ms` }">
            <span :class="['w-16 h-16 bg-linear-to-br rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl text-white', certificate.tone === 'secondary' ? 'from-secondary to-accent' : certificate.tone === 'accent' ? 'from-accent to-primary' : 'from-primary to-secondary']"><i :class="certificate.icon" aria-hidden="true"></i></span>
            <p class="text-primary font-bold mb-2">{{ certificate.provider }}</p>
            <h4 class="text-2xl font-bold mb-2">{{ certificate.title[lang] }}</h4>
            <p class="text-slate-500 dark:text-slate-400">{{ certificate.period[lang] }}</p>
          </article>
        </TransitionGroup>
        <div class="training-pagination flex items-center justify-center gap-4 mt-10" role="group" :aria-label="t('experience.trainingTitle')" data-reveal>
          <button type="button" class="w-12 h-12 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-primary hover:text-white transition-all duration-300 border border-slate-300 dark:border-slate-700" :aria-label="t('experience.previousTraining')" @click="previousTraining"><i class="fa-solid" :class="lang === 'ar' ? 'fa-chevron-right' : 'fa-chevron-left'" aria-hidden="true"></i></button>
          <div class="flex gap-3" role="tablist">
            <button v-for="page in trainingPageCount" :key="page" type="button" role="tab" :aria-selected="trainingIndex === page - 1" :aria-label="`${t('experience.trainingPage')} ${page}`" :class="['w-3 h-3 rounded-full transition-all duration-300 hover:scale-125', trainingIndex === page - 1 ? 'bg-accent scale-125' : 'bg-slate-400 dark:bg-slate-600']" @click="selectTrainingPage(page - 1)"></button>
          </div>
          <button type="button" class="w-12 h-12 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-secondary hover:text-white transition-all duration-300 border border-slate-300 dark:border-slate-700" :aria-label="t('experience.nextTraining')" @click="nextTraining"><i class="fa-solid" :class="lang === 'ar' ? 'fa-chevron-left' : 'fa-chevron-right'" aria-hidden="true"></i></button>
        </div>
      </div>
    </div>
  </section>
</template>
