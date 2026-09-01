<script setup>
import { certificates } from "../data/certificates";
import { experience } from "../data/experience";

defineProps({ lang: { type: String, required: true }, t: { type: Function, required: true } });
</script>

<template>
  <section id="experience" class="experience-section py-24 px-4 md:px-8 bg-slate-50 dark:bg-transparent relative overflow-hidden" aria-labelledby="experience-title">
    <div class="absolute top-0 right-1/4 w-96 h-96 bg-accent rounded-full filter blur-3xl opacity-10"></div>
    <div class="container mx-auto max-w-7xl relative z-10">
      <div class="text-center mb-16"><span class="text-primary text-lg font-medium mb-3 block">{{ t('experience.eyebrow') }}</span><h2 id="experience-title" class="text-5xl font-black mb-4">{{ t('experience.title') }}</h2><div class="w-24 h-1.5 bg-linear-to-r from-primary to-accent mx-auto rounded-full"></div></div>

      <div class="mb-20">
        <h3 class="text-3xl font-black text-center mb-12"><span class="text-primary">{{ t('experience.workTitle') }}</span></h3>
        <div class="relative">
          <div class="absolute top-0 bottom-0 right-1/2 w-1 bg-linear-to-b from-primary via-secondary to-accent transform translate-x-1/2"></div>
          <div v-for="(item, index) in experience" :key="item.id" class="relative flex items-center mb-12">
            <div v-if="index % 2 === 0" class="w-1/2 pl-16"><article class="timeline-card-left bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary transition-all duration-300"><div class="flex items-center justify-between gap-4 mb-3"><span class="text-primary font-bold">{{ item.period[lang] }}</span><i class="fa-solid fa-briefcase text-2xl text-primary" aria-hidden="true"></i></div><h4 class="text-2xl font-bold mb-2">{{ item.role[lang] }}</h4><p class="text-secondary font-semibold mb-3">{{ item.company[lang] }}</p><p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{{ item.description[lang] }}</p><div class="flex flex-wrap gap-2"><span v-for="tag in item.tags" :key="tag" class="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs">{{ tag }}</span></div></article></div><div v-else class="w-1/2 pl-16"></div>
            <div class="absolute right-1/2 w-6 h-6 bg-white dark:bg-slate-900 border-4 border-primary rounded-full transform translate-x-1/2 z-10" aria-hidden="true"></div>
            <div v-if="index % 2 === 1" class="w-1/2 pr-16"><article class="timeline-card-right bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-secondary transition-all duration-300"><div class="flex items-center justify-between gap-4 mb-3"><i class="fa-solid fa-briefcase text-2xl text-secondary" aria-hidden="true"></i><span class="text-secondary font-bold">{{ item.period[lang] }}</span></div><h4 class="text-2xl font-bold mb-2">{{ item.role[lang] }}</h4><p class="text-primary font-semibold mb-3">{{ item.company[lang] }}</p><p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{{ item.description[lang] }}</p><div class="flex flex-wrap gap-2"><span v-for="tag in item.tags" :key="tag" class="px-3 py-1 bg-secondary/10 text-secondary rounded-lg text-xs">{{ tag }}</span></div></article></div><div v-else class="w-1/2 pr-16"></div>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-3xl font-black text-center mb-10"><span class="bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">{{ t('experience.trainingTitle') }}</span></h3>
        <p class="text-center text-slate-500 dark:text-slate-400 mb-8">{{ t('experience.certificates') }}</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article v-for="certificate in certificates" :key="certificate.id" class="bg-white dark:bg-slate-800/40 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 hover:border-primary transition-all duration-300 hover:-translate-y-1"><div class="flex items-center justify-between mb-5"><span :class="['w-14 h-14 rounded-xl flex items-center justify-center text-2xl text-white bg-gradient-to-br', certificate.tone === 'secondary' ? 'from-secondary to-accent' : certificate.tone === 'accent' ? 'from-accent to-primary' : 'from-primary to-secondary']"><i :class="certificate.icon" aria-hidden="true"></i></span><span class="text-sm font-semibold text-slate-500 dark:text-slate-400">{{ certificate.period[lang] }}</span></div><p class="text-primary font-bold mb-2">{{ certificate.provider }}</p><h4 class="text-xl font-bold leading-relaxed">{{ certificate.title[lang] }}</h4></article>
        </div>
      </div>
    </div>
  </section>
</template>
