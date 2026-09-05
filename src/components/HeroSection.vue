<script setup>
import profileImage from "../assets/profile/kerolos-morcos.webp";

defineProps({ lang: { type: String, required: true }, t: { type: Function, required: true } });

const techIcons = [
  { name: "Vue.js", icon: "fa-brands fa-vuejs", color: "#42b883" },
  { name: "Node.js", icon: "fa-brands fa-node-js", color: "#68a063" },
  { name: "Express.js", icon: "fa-solid fa-server", color: "#8b5cf6" },
  { name: "MySQL", icon: "fa-solid fa-database", color: "#00758f" },
];
</script>

<template>
  <section id="hero-section" class="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16" aria-labelledby="hero-title">
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
      <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 40px 40px"></div>
    </div>

    <div class="container mx-auto pt-40 lg:pt-0 px-4 md:px-8 z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-36 lg:gap-16 items-center">
        <div class="hero-copy order-2 lg:order-1 text-center">
          <div :class="lang === 'ar' ? 'lg:text-right' : 'lg:text-left'">
          <div class="inline-flex items-center gap-3 mt-3 lg:mt-0 bg-gradient-to-l from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-emerald-500/10 backdrop-blur-sm border border-emerald-500/30 rounded-full px-5 py-2.5 mb-8" data-motion="fade-in" data-motion-hero>
            <span class="relative flex h-2.5 w-2.5"><span class="hero-availability-ping animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span></span>
            <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{{ t('hero.available') }}</span>
          </div>

          <div class="mb-8" data-motion="fade-up" data-motion-heading data-motion-hero data-motion-step="1">
            <p class="text-xl md:text-2xl text-slate-500 dark:text-slate-400 mb-3 font-medium">{{ t('hero.greeting') }}</p>
            <h1 id="hero-title" class="text-4xl md:text-6xl lg:text-7xl font-black leading-tight"><span class="relative inline-block"><span class="hero-name-gradient bg-gradient-to-l pb-8 from-primary via-secondary to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient" :data-text="t('hero.name')">{{ t('hero.name') }}</span></span></h1>
          </div>

          <div class="inline-flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-full mb-8">
            <div class="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center"><i class="fa-solid fa-code text-white text-sm" aria-hidden="true"></i></div>
            <span class="font-bold text-slate-800 dark:text-white">{{ t('hero.role') }}</span>
          </div>

          <p class="hero-description text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed" data-motion="fade-up" data-motion-hero data-motion-step="2">
            {{ t('hero.descriptionBefore') }} <span class="text-primary font-semibold">{{ t('hero.descriptionHighlight') }}</span>{{ t('hero.descriptionAfter') }}
          </p>

          <div class="hero-actions flex flex-wrap justify-center gap-4 mb-10" data-motion="fade-up" data-motion-hero data-motion-step="3">
            <a href="#portfolio" class="group relative inline-flex items-center gap-3 bg-gradient-to-l from-primary to-secondary px-8 py-4 rounded-2xl text-lg font-bold text-white overflow-hidden transition-polished"><span class="relative z-10">{{ t('hero.projectsCta') }}</span><i :class="['fa-solid relative z-10 transition-polished', lang === 'ar' ? 'fa-arrow-left group-hover:-translate-x-2' : 'fa-arrow-right group-hover:translate-x-2']" aria-hidden="true"></i><span class="absolute inset-0 bg-gradient-to-l from-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span></a>
            <a href="#contact" class="group inline-flex items-center gap-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white px-8 py-4 rounded-2xl text-lg font-bold transition-polished hover:border-primary hover:text-primary hover:shadow-lg"><span>{{ t('hero.contactCta') }}</span><i class="fa-solid fa-paper-plane transition-polished group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true"></i></a>
          </div>

          <div class="hero-tech-list flex flex-wrap justify-center gap-2" aria-label="Core technologies" data-motion="fade-in" data-motion-hero data-motion-step="4">
            <div v-for="(tech, index) in techIcons" :key="tech.name" class="hero-tech-chip flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-interactive duration-300 group" :style="{ '--tech-color': tech.color, '--float-delay': `${index * 180}ms` }"><i :class="tech.icon" class="text-xl group-hover:rotate-180 transition-transform duration-500" :style="{ color: tech.color }" aria-hidden="true"></i><span class="text-sm font-semibold text-slate-700 dark:text-slate-300">{{ tech.name }}</span></div>
          </div>
          </div>
        </div>

        <div class="order-1 lg:order-2 relative flex justify-center lg:justify-start">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="hero-orbit w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full border-2 border-dashed border-primary/30 animate-spin" style="--hero-orbit-duration: 30s"></div>
          </div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="hero-orbit hero-orbit--inner w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-full border-2 border-secondary/20 animate-spin" style="--hero-orbit-duration: 20s"></div>
          </div>

          <div class="relative z-10">
            <div class="hero-profile-pulse absolute -inset-3 bg-gradient-to-br from-primary via-secondary to-accent rounded-full opacity-75 blur-sm animate-pulse"></div>
            <div class="absolute -inset-2 bg-gradient-to-br from-primary via-secondary to-accent rounded-full"></div>
            <div class="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-900">
              <img :src="profileImage" :alt="t('hero.heroImageAlt')" class="w-full h-full object-cover" width="900" height="900" loading="eager" fetchpriority="high" decoding="async" />
            </div>

            <div class="hero-floating-icon absolute -top-4 -right-4 bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-xl border border-slate-200 dark:border-slate-700 animate-bounce" style="--hero-float-duration: 3s" aria-hidden="true"><i class="fa-brands fa-vuejs text-3xl text-[#4FC08D]"></i></div>
            <div class="hero-floating-icon absolute top-1/4 -left-6 bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-xl border border-slate-200 dark:border-slate-700 animate-bounce" style="--hero-float-duration: 2.5s; --hero-float-delay: .5s" aria-hidden="true"><i class="fa-brands fa-node-js text-3xl text-[#68A063]"></i></div>
            <div class="hero-floating-icon absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-xl border border-slate-200 dark:border-slate-700 animate-bounce" style="--hero-float-duration: 3.5s; --hero-float-delay: 1s" aria-hidden="true"><i class="fa-brands fa-figma text-3xl text-[#F24E1E]"></i></div>
            <div class="hero-floating-icon absolute bottom-1/4 -left-6 bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-xl border border-slate-200 dark:border-slate-700 animate-bounce" style="--hero-float-duration: 2s; --hero-float-delay: 1.5s" aria-hidden="true"><i class="fa-solid fa-code text-3xl text-primary"></i></div>
          </div>
        </div>
      </div>
    </div>

    <a href="#about" class="hero-scroll-indicator absolute left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 animate-bounce hover:text-primary transition-colors duration-300" :aria-label="t('hero.scrollLabel')">
      <span class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary">{{ t('hero.scrollText') }}</span>
      <span class="w-6 h-10 rounded-full border-2 border-slate-400 dark:border-slate-600 hover:border-primary flex justify-center pt-2 transition-colors duration-300"><span class="w-1.5 h-2 rounded-full bg-primary"></span></span>
    </a>
  </section>
</template>
