<script setup>
import { skills } from "../data/skills";

const secondarySkills = [
  { name: "HTML5", icon: "fa-brands fa-html5", color: "#e34f26" },
  { name: "CSS3", icon: "fa-brands fa-css3-alt", color: "#1572b6" },
  { name: "JavaScript", icon: "fa-brands fa-js", color: "#f7df1e" },
  { name: "Git", icon: "fa-brands fa-git-alt", color: "#f05032" },
];

defineProps({ lang: { type: String, required: true }, t: { type: Function, required: true } });
</script>

<template>
  <section id="skills-section" class="py-24 px-4 md:px-8 bg-slate-50 dark:bg-transparent relative overflow-hidden" aria-labelledby="skills-title">
    <div class="absolute bottom-0 right-1/3 w-96 h-96 bg-secondary rounded-full filter blur-3xl opacity-10"></div>
    <div class="container mx-auto max-w-7xl relative z-10">
      <div class="text-center mb-16" data-reveal>
        <span class="text-secondary text-lg font-medium mb-3 block">{{ t('skills.eyebrow') }}</span>
        <h2 id="skills-title" class="section-title text-5xl font-black mb-4">{{ t('skills.titleLead') }} <span class="bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">{{ t('skills.titleAccent') }}</span></h2>
        <div class="w-24 h-1.5 bg-linear-to-r from-secondary to-accent mx-auto rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article v-for="(skill, index) in skills" :key="skill.id" class="skill-card main-skill-card bg-white dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-300 dark:border-slate-700" data-reveal :style="{ '--reveal-delay': `${index * 70}ms` }">
          <div class="flex items-center justify-between mb-6"><h3 class="text-2xl font-bold">{{ skill.name }}</h3><i :class="skill.icon" :style="{ color: `var(--color-${skill.color})` }" class="text-4xl" aria-hidden="true"></i></div>
          <div class="skill-focus-line w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-3" aria-hidden="true"><div :class="['h-3 rounded-full', skill.tone === 'secondary' ? 'bg-linear-to-r from-secondary to-accent' : skill.tone === 'accent' ? 'bg-linear-to-r from-accent to-primary' : 'bg-linear-to-r from-primary to-secondary']" :style="{ width: skill.focus }"></div></div>
          <p class="text-slate-500 dark:text-slate-400">{{ skill.description[lang] }}</p>
        </article>
      </div>
      <div class="secondary-tech-list mt-16 grid grid-cols-2 md:grid-cols-4 gap-6" data-reveal aria-label="Supporting technologies">
        <div v-for="tech in secondarySkills" :key="tech.name" class="supporting-tech-card text-center p-6 bg-slate-100 dark:bg-slate-800/20 rounded-xl border border-slate-300 dark:border-slate-700">
          <i :class="tech.icon" :style="{ color: tech.color }" class="text-5xl mb-3" aria-hidden="true"></i>
          <p class="text-slate-600 dark:text-slate-300 font-medium">{{ tech.name }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
