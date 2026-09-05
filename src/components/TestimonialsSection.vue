<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({ lang: { type: String, required: true }, t: { type: Function, required: true } });
const activeIndex = ref(0);
const visibleCount = ref(1);
const items = computed(() => props.t("credibility.items"));
const pageCount = computed(() => Math.max(1, items.value.length - visibleCount.value + 1));
const visibleItems = computed(() => items.value.slice(activeIndex.value, activeIndex.value + visibleCount.value));

function getVisibleCount() {
  if (typeof window === "undefined") return 1;
  return window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
}
function updateVisibleCount() { visibleCount.value = getVisibleCount(); }
function selectPage(page) { activeIndex.value = Math.min(Math.max(page, 0), pageCount.value - 1); }
function next() { selectPage(activeIndex.value + 1 >= pageCount.value ? 0 : activeIndex.value + 1); }
function previous() { selectPage(activeIndex.value - 1 < 0 ? pageCount.value - 1 : activeIndex.value - 1); }

watch(visibleCount, () => selectPage(activeIndex.value));
onMounted(() => {
  updateVisibleCount();
  window.addEventListener("resize", updateVisibleCount, { passive: true });
});
onUnmounted(() => window.removeEventListener("resize", updateVisibleCount));
</script>

<template>
  <section id="testimonials" class="py-24 px-4 md:px-8 bg-white dark:bg-slate-900/50 relative overflow-hidden" aria-labelledby="testimonials-title">
    <div class="absolute top-0 left-1/3 w-96 h-96 bg-accent rounded-full filter blur-3xl opacity-10"></div>
    <div class="container mx-auto max-w-7xl relative z-10">
      <div class="text-center mb-16" data-motion="fade-up" data-motion-heading>
        <span class="text-accent text-lg font-medium mb-3 block">{{ t('credibility.eyebrow') }}</span>
        <h2 id="testimonials-title" class="section-title text-5xl font-black mb-4">{{ t('credibility.titleLead') }} <span class="bg-linear-to-r from-accent to-primary bg-clip-text text-transparent">{{ t('credibility.titleAccent') }}</span></h2>
        <div class="w-24 h-1.5 bg-linear-to-r from-accent to-primary mx-auto rounded-full"></div>
        <p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mt-6">{{ t('credibility.description') }}</p>
      </div>

      <div class="px-2 lg:px-8" aria-live="polite">
        <div class="overflow-hidden">
          <Transition name="credibility-fade" mode="out-in">
            <div :key="activeIndex" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <article v-for="(item, index) in visibleItems" :key="`${activeIndex}-${item.title}`" class="principle-card bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:border-accent transition-interactive duration-300 flex flex-col h-full">
                <div class="flex items-center justify-between mb-6"><span :class="['w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl', index === 0 ? 'bg-primary' : index === 1 ? 'bg-secondary' : 'bg-accent']"><i :class="index === 0 ? 'fa-solid fa-comments' : index === 1 ? 'fa-solid fa-magnifying-glass' : 'fa-solid fa-arrows-rotate'" aria-hidden="true"></i></span><span class="text-primary text-3xl font-black">0{{ (activeIndex + index) % 4 + 1 }}</span></div>
                <h3 class="text-2xl font-bold mb-3">{{ item.title }}</h3>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed flex-grow">{{ item.text }}</p>
              </article>
            </div>
          </Transition>
        </div>
      </div>

      <div class="methodology-controls flex items-center justify-center gap-4 mt-8 mb-12" data-motion="fade-in" data-motion-step="1" role="navigation" :aria-label="t('credibility.titleLead')">
        <button type="button" class="methodology-nav-button bg-white/90 dark:bg-slate-800/90 hover:bg-secondary text-slate-900 dark:text-white w-12 h-12 rounded-full flex items-center justify-center transition-interactive duration-300 hover:scale-110 border border-slate-300 dark:border-slate-700" :aria-label="t('credibility.previous')" @click="previous"><i class="fa-solid" :class="lang === 'ar' ? 'fa-chevron-right' : 'fa-chevron-left'" aria-hidden="true"></i></button>
        <div class="flex justify-center gap-3" role="tablist" :aria-label="t('credibility.titleLead')">
          <button v-for="page in pageCount" :key="page" type="button" role="tab" :aria-selected="activeIndex === page - 1" :aria-label="`${t('credibility.indicator')} ${page}`" :class="['w-3 h-3 rounded-full transition-interactive duration-300 hover:scale-125', activeIndex === page - 1 ? 'bg-accent scale-125' : 'bg-slate-400 dark:bg-slate-600']" @click="selectPage(page - 1)"></button>
        </div>
        <button type="button" class="methodology-nav-button bg-white/90 dark:bg-slate-800/90 hover:bg-primary text-slate-900 dark:text-white w-12 h-12 rounded-full flex items-center justify-center transition-interactive duration-300 hover:scale-110 border border-slate-300 dark:border-slate-700" :aria-label="t('credibility.next')" @click="next"><i class="fa-solid" :class="lang === 'ar' ? 'fa-chevron-left' : 'fa-chevron-right'" aria-hidden="true"></i></button>
      </div>

      <div class="bg-linear-to-r from-primary via-secondary to-accent p-1 rounded-3xl">
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center">
          <h3 class="text-3xl font-bold mb-4" data-motion="fade-up">{{ t('credibility.ctaTitle') }}</h3>
          <p class="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto" data-motion="fade-up" data-motion-step="1">{{ t('credibility.ctaText') }}</p>
          <div class="flex justify-center gap-4 flex-wrap" data-motion="fade-up" data-motion-step="2"><a href="#contact" class="bg-linear-to-r from-primary to-secondary text-white px-10 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-primary/30 transition-interactive duration-300">{{ t('credibility.ctaContact') }}</a><a href="#portfolio" class="border-2 border-primary dark:border-white text-primary dark:text-white px-10 py-4 rounded-xl font-bold hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-interactive duration-300">{{ t('credibility.ctaProjects') }}</a></div>
        </div>
      </div>
    </div>
  </section>
</template>
