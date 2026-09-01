<script setup>
import { socials } from "../data/socials";

defineProps({ t: { type: Function, required: true } });
const links = [
  ["footer.quickLinks", "#hero-section", "nav.home"], ["footer.quickLinks", "#about", "nav.about"], ["footer.quickLinks", "#portfolio", "nav.projects"], ["footer.quickLinks", "#experience", "nav.experience"], ["footer.quickLinks", "#testimonials", "nav.testimonials"], ["footer.quickLinks", "#contact", "nav.contact"],
];
</script>

<template>
  <footer id="footer" class="bg-slate-950 text-white py-16 px-4 md:px-8" aria-labelledby="footer-title">
    <div class="container mx-auto max-w-7xl">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-12 border-b border-slate-800">
        <div><h2 id="footer-title" class="text-3xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-5">{{ t('footer.name') }}</h2><p class="text-slate-400 leading-relaxed mb-6">{{ t('footer.summary') }}</p><a href="/Kerolos-Morcos-Full-Stack-Developer-CV.pdf" download class="inline-flex items-center gap-3 bg-linear-to-l from-primary to-secondary px-5 py-3 rounded-xl font-bold hover:-translate-y-1 transition-transform"><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i>{{ t('footer.cv') }}</a></div>
        <div><h3 class="text-xl font-bold mb-6">{{ t('footer.quickLinks') }}</h3><ul class="grid grid-cols-2 gap-3 text-slate-400"><li v-for="item in links" :key="item[1]"><a :href="item[1]" class="hover:text-primary transition-colors">{{ t(item[2]) }}</a></li></ul></div>
        <div><h3 class="text-xl font-bold mb-6">{{ t('footer.services') }}</h3><ul class="space-y-3 text-slate-400"><li v-for="service in t('footer.serviceItems')" :key="service" class="flex items-center gap-3"><span class="w-1.5 h-1.5 rounded-full bg-primary"></span>{{ service }}</li></ul></div>
      </div>
      <div class="flex flex-col md:flex-row items-center justify-between gap-5 pt-8"><p class="text-slate-500">© 2026 {{ t('footer.name') }}. {{ t('footer.rights') }}</p><div class="flex gap-3"><a v-for="social in socials" :key="social.id" :href="social.href" :aria-label="social.label" class="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all" target="_blank" rel="noopener noreferrer"><i :class="social.icon" aria-hidden="true"></i></a></div></div>
    </div>
  </footer>
</template>
