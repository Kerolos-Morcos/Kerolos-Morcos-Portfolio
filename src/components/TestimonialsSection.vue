<script setup>
import { computed, ref } from "vue";

const props = defineProps({ lang: { type: String, required: true }, t: { type: Function, required: true } });
const activeIndex = ref(0);
const visibleItems = computed(() => {
  const items = props.t("credibility.items");
  return [items[activeIndex.value], items[(activeIndex.value + 1) % items.length], items[(activeIndex.value + 2) % items.length]];
});
function next() { activeIndex.value = (activeIndex.value + 1) % props.t("credibility.items").length; }
function previous() { const total = props.t("credibility.items").length; activeIndex.value = (activeIndex.value - 1 + total) % total; }
</script>

<template>
  <section id="testimonials" class="py-24 px-4 md:px-8 bg-white dark:bg-slate-900/50 relative overflow-hidden" aria-labelledby="testimonials-title">
    <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary rounded-full filter blur-3xl opacity-10"></div>
    <div class="container mx-auto max-w-7xl relative z-10">
      <div class="text-center mb-16" data-reveal><span class="text-secondary text-lg font-medium mb-3 block">{{ t('credibility.eyebrow') }}</span><h2 id="testimonials-title" class="text-5xl font-black mb-4">{{ t('credibility.title') }}</h2><div class="w-24 h-1.5 bg-linear-to-r from-secondary to-accent mx-auto rounded-full"></div><p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mt-6">{{ t('credibility.description') }}</p></div>

      <div class="relative" aria-live="polite">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article v-for="(item, index) in visibleItems" :key="`${activeIndex}-${item.title}`" class="principle-card bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:border-accent transition-all duration-300 flex flex-col min-h-[250px]" data-reveal><div class="flex items-center justify-between mb-6"><span :class="['w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl', index === 0 ? 'bg-primary' : index === 1 ? 'bg-secondary' : 'bg-accent']"><i :class="index === 0 ? 'fa-solid fa-comments' : index === 1 ? 'fa-solid fa-magnifying-glass' : 'fa-solid fa-arrows-rotate'" aria-hidden="true"></i></span><span class="text-primary text-3xl font-black">0{{ (activeIndex + index) % 4 + 1 }}</span></div><h3 class="text-2xl font-bold mb-3">{{ item.title }}</h3><p class="text-slate-600 dark:text-slate-300 leading-relaxed flex-grow">{{ item.text }}</p></article>
        </div>

        <div class="flex items-center justify-center gap-4 mt-10"><button type="button" class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-primary hover:text-white transition-all" :aria-label="t('credibility.next')" @click="next"><i class="fa-solid" :class="lang === 'ar' ? 'fa-arrow-right' : 'fa-arrow-left'" aria-hidden="true"></i></button><div class="flex gap-3" role="tablist" :aria-label="t('credibility.title')"><button v-for="(_, index) in t('credibility.items')" :key="index" type="button" role="tab" :aria-selected="activeIndex === index" :aria-label="`${t('credibility.indicator')} ${index + 1}`" :class="['w-3 h-3 rounded-full transition-all duration-300', activeIndex === index ? 'bg-accent scale-125' : 'bg-slate-400 dark:bg-slate-600']" @click="activeIndex = index"></button></div><button type="button" class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-secondary hover:text-white transition-all" :aria-label="t('credibility.previous')" @click="previous"><i class="fa-solid" :class="lang === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'" aria-hidden="true"></i></button></div>
      </div>

      <div class="mt-20 bg-linear-to-l from-primary to-secondary rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden" data-reveal><div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 30px 30px"></div><div class="relative z-10"><h3 class="text-3xl font-bold mb-4">{{ t('credibility.ctaTitle') }}</h3><p class="text-white/80 text-lg mb-8">{{ t('credibility.ctaText') }}</p><div class="flex flex-wrap justify-center gap-4"><a href="#contact" class="bg-white text-primary px-7 py-3 rounded-xl font-bold hover:-translate-y-1 transition-transform">{{ t('credibility.ctaContact') }}</a><a href="#portfolio" class="border-2 border-white/60 text-white px-7 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors">{{ t('credibility.ctaProjects') }}</a></div></div></div>
    </div>
  </section>
</template>
