<script setup>
import { socials } from "../data/socials";

defineProps({ t: { type: Function, required: true } });

const links = [
  ["#hero-section", "nav.home"],
  ["#about", "nav.about"],
  ["#portfolio", "nav.projects"],
  ["#experience", "nav.experience"],
  ["#testimonials", "nav.testimonials"],
  ["#contact", "nav.contact"],
];

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer
    id="footer"
    class="bg-slate-100 dark:bg-slate-950 py-16 px-4 md:px-8 border-t border-slate-200 dark:border-slate-800"
    aria-labelledby="footer-title"
  >
    <div class="container mx-auto max-w-7xl">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12" data-reveal>
        <div class="col-span-1 md:col-span-2">
          <a href="#hero-section" class="inline-flex items-center gap-3 mb-6" aria-label="Back to the hero section">
            <span class="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-black shadow-lg shadow-primary/20" aria-hidden="true">K</span>
            <h2 id="footer-title" class="text-3xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{{ t('footer.name') }}</h2>
          </a>
          <p class="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8 max-w-2xl">{{ t('footer.summary') }}</p>

          <a
            href="/Kerolos-Morcos-Full-Stack-Developer-CV.pdf"
            download
            class="inline-flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-4 rounded-xl hover:border-primary/50 hover:-translate-y-1 transition-interactive group w-full md:w-auto"
          >
            <span class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl" aria-hidden="true">
              <i class="fa-solid fa-file-arrow-down"></i>
            </span>
            <span class="text-start">
              <span class="block text-sm text-slate-500 dark:text-slate-400">{{ t('footer.expertise') }}</span>
              <span class="block font-bold text-slate-800 dark:text-white">{{ t('footer.cv') }}</span>
            </span>
            <i class="fa-solid fa-arrow-up-right-from-square text-slate-400 group-hover:text-primary transition-colors" aria-hidden="true"></i>
          </a>
        </div>

        <div>
          <h3 class="text-xl font-bold mb-6 text-slate-800 dark:text-white">{{ t('footer.quickLinks') }}</h3>
          <ul class="space-y-3">
            <li v-for="item in links" :key="item[0]">
              <a :href="item[0]" class="text-slate-600 dark:text-slate-400 text-lg hover:text-primary transition-colors">{{ t(item[1]) }}</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-xl font-bold mb-6 text-slate-800 dark:text-white">{{ t('footer.services') }}</h3>
          <ul class="space-y-3">
            <li v-for="service in t('footer.serviceItems')" :key="service" class="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-lg">
              <span class="w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden="true"></span>
              <span>{{ service }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-slate-200 dark:border-slate-800 pt-8" data-reveal>
        <div class="flex flex-col md:flex-row justify-between items-center gap-5">
          <p class="text-slate-500 dark:text-slate-400 text-lg text-center md:text-start">© {{ currentYear }} {{ t('footer.name') }}. {{ t('footer.rights') }}</p>
          <div class="flex gap-3">
            <a
              v-for="social in socials"
              :key="social.id"
              :href="social.href"
              :aria-label="social.label"
              class="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-interactive"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i :class="social.icon" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
