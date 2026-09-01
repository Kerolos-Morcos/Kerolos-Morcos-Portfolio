<script setup>
import { skills } from "../data/skills";

defineProps({ lang: { type: String, required: true }, t: { type: Function, required: true } });
</script>

<template>
  <section id="skills-section" class="py-24 px-4 md:px-8 bg-slate-50 dark:bg-transparent relative overflow-hidden" aria-labelledby="skills-title">
    <div class="absolute bottom-0 right-1/3 w-96 h-96 bg-secondary rounded-full filter blur-3xl opacity-10"></div>
    <div class="container mx-auto max-w-7xl relative z-10">
      <div class="text-center mb-16">
        <span class="text-secondary text-lg font-medium mb-3 block">{{ t('skills.eyebrow') }}</span>
        <h2 id="skills-title" class="text-5xl font-black mb-4">{{ t('skills.titleLead') }} <span class="bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">{{ t('skills.titleAccent') }}</span></h2>
        <div class="w-24 h-1.5 bg-linear-to-r from-secondary to-accent mx-auto rounded-full"></div>
        <p class="text-slate-500 dark:text-slate-400 mt-6 max-w-2xl mx-auto">{{ t('skills.supporting') }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article v-for="skill in skills" :key="skill.id" class="bg-white dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-300 dark:border-slate-700 hover:border-primary transition-all duration-300 hover:transform hover:scale-105">
          <div class="flex items-center justify-between mb-6"><h3 class="text-2xl font-bold">{{ skill.name }}</h3><i :class="skill.icon" :style="{ color: `var(--color-${skill.color})` }" class="text-4xl" aria-hidden="true"></i></div>
          <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-3" role="progressbar" :aria-valuenow="skill.level" aria-valuemin="0" aria-valuemax="100" :aria-label="lang === 'ar' ? `مجال التركيز في ${skill.name}` : `Focus area: ${skill.name}`"><div :class="['h-3 rounded-full', skill.tone === 'secondary' ? 'bg-linear-to-r from-secondary to-accent' : skill.tone === 'accent' ? 'bg-linear-to-r from-accent to-primary' : 'bg-linear-to-r from-primary to-secondary']" :style="{ width: `${skill.level}%` }"></div></div>
          <p class="text-slate-500 dark:text-slate-400">{{ skill.description[lang] }}</p>
        </article>
      </div>
      <p class="text-center text-xs text-slate-400 dark:text-slate-500 mt-8">{{ t('skills.decorativeBar') }}</p>
    </div>
  </section>
</template>
