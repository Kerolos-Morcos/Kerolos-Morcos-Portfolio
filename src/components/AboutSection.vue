<script setup>
import { socials } from "../data/socials";

defineProps({ lang: { type: String, required: true }, t: { type: Function, required: true } });
</script>

<template>
  <section id="about" class="py-24 px-4 md:px-8 bg-white dark:bg-slate-900/50 relative overflow-hidden" aria-labelledby="about-title">
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full filter blur-3xl opacity-10"></div>
    <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary rounded-full filter blur-3xl opacity-10"></div>

    <div class="container mx-auto max-w-7xl relative z-10">
      <div class="text-center mb-16" data-reveal>
        <span class="text-primary text-lg font-medium mb-3 block">{{ t('about.eyebrow') }}</span>
        <h2 id="about-title" class="section-title text-5xl font-black mb-4">{{ t('about.titleLead') }} <span class="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">{{ t('about.titleAccent') }}</span></h2>
        <div class="w-24 h-1.5 bg-gradient-to-l from-primary to-secondary mx-auto rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div class="space-y-8">
          <div class="relative" data-reveal>
            <div class="absolute -top-4 -right-2 text-8xl text-primary/10 font-serif leading-none" aria-hidden="true">&quot;</div>
            <div class="relative z-10">
              <h3 class="text-3xl font-black mb-6 text-slate-800 dark:text-white">{{ t('about.heading') }} <span class="text-primary">{{ t('about.headingAccent') }}</span></h3>
              <p class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{{ t('about.paragraphOne') }}</p>
              <p class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{{ t('about.paragraphTwo') }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4 flex-wrap" data-reveal>
            <div v-for="(badge, index) in t('about.badges')" :key="badge" class="flex items-center gap-2 bg-gray-200 dark:bg-slate-800 px-4 py-2 rounded-full"><i :class="['fa-solid', index === 0 ? 'fa-layer-group text-primary' : index === 1 ? 'fa-briefcase text-secondary' : 'fa-location-dot text-accent']" aria-hidden="true"></i><span class="text-sm font-medium">{{ badge }}</span></div>
          </div>

          <div class="bg-slate-50 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700" data-reveal>
            <h4 class="font-bold text-lg mb-4 flex items-center gap-2">{{ t('about.servicesTitle') }} <i class="fa-solid fa-rocket text-primary" aria-hidden="true"></i></h4>
            <div class="space-y-3">
              <div v-for="(service, index) in t('about.services')" :key="service" class="flex items-start gap-3 text-slate-600 dark:text-slate-300"><span :class="['w-2 h-2 rounded-full mt-2 shrink-0', index % 4 === 0 ? 'bg-primary' : index % 4 === 1 ? 'bg-secondary' : index % 4 === 2 ? 'bg-accent' : 'bg-emerald-500']"></span><span>{{ service }}</span></div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-slate-900 dark:bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 hover:shadow-primary/20 hover:border-slate-600 transition-all duration-500 transform hover:-translate-y-1" data-reveal>
            <div class="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700"><span class="w-3 h-3 rounded-full bg-red-500"></span><span class="w-3 h-3 rounded-full bg-yellow-500"></span><span class="w-3 h-3 rounded-full bg-green-500"></span><span class="text-slate-400 text-sm mr-4 font-mono">{{ t('about.codeFile') }}</span></div>
            <div class="p-6 font-mono text-sm md:text-base leading-relaxed overflow-x-auto text-slate-200" dir="ltr">
              <p class="text-slate-500">{{ t('about.codeComment') }}</p>
              <p class="mt-3"><span class="text-purple-400">const</span> <span class="text-blue-400">kerolos</span> = {</p>
              <p class="ml-4"><span class="text-green-400">name</span>: <span class="text-yellow-400">&quot;{{ t('about.code.name') }}&quot;</span>,</p>
              <p class="ml-4"><span class="text-green-400">role</span>: <span class="text-yellow-400">&quot;{{ t('about.code.role') }}&quot;</span>,</p>
              <p class="ml-4"><span class="text-green-400">experience</span>: <span class="text-yellow-400">&quot;{{ t('about.code.experience') }}&quot;</span>,</p>
              <p class="ml-4"><span class="text-green-400">location</span>: <span class="text-yellow-400">&quot;{{ t('about.code.location') }}&quot;</span>,</p>
              <p class="ml-4"><span class="text-green-400">skills</span>: [</p>
              <p class="ml-8"><span class="text-yellow-400">&quot;Vue.js&quot;</span>,</p>
              <p class="ml-8"><span class="text-yellow-400">&quot;Node.js&quot;</span>,</p>
              <p class="ml-8"><span class="text-yellow-400">&quot;Express.js&quot;</span>,</p>
              <p class="ml-8"><span class="text-yellow-400">&quot;MySQL&quot;</span></p>
              <p class="ml-4">],</p>
              <p class="ml-4"><span class="text-green-400">passion</span>: <span class="text-yellow-400">&quot;{{ t('about.code.passion') }}&quot;</span>,</p>
              <p class="ml-4"><span class="text-green-400">available</span>: <span class="text-blue-400">true</span></p>
              <p>};</p>
              <p class="mt-4"><span class="text-purple-400">export default</span> <span class="text-blue-400">kerolos</span>;</p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4" data-reveal>
            <div v-for="(stat, index) in t('about.quickStats')" :key="stat.label" :class="['bg-slate-50 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-700 hover:border-primary transition-all duration-300', index === 1 ? 'hover:border-secondary' : index === 2 ? 'hover:border-accent' : '']"><div :class="['text-3xl font-black mb-1', index === 1 ? 'text-secondary' : index === 2 ? 'text-accent' : 'text-primary']">{{ stat.value }}</div><div class="text-sm text-slate-600 dark:text-slate-400">{{ stat.label }}</div></div>
          </div>

          <div class="flex gap-4 justify-center lg:justify-end" :aria-label="t('about.socialLabel')">
            <a v-for="social in socials" :key="social.id" :href="social.href" :class="['w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-white transition-all duration-300 border border-slate-200 dark:border-slate-700', social.hover]" :aria-label="social.label" target="_blank" rel="noopener noreferrer"><i :class="social.icon" aria-hidden="true"></i></a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
