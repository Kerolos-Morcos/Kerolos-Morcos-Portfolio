<script setup>
defineProps({ t: { type: Function, required: true } });
const stats = [
  { value: "20+", key: "projects", color: "primary", icon: "fa-solid fa-briefcase" },
  { value: "1+", key: "experience", color: "secondary", icon: "fa-solid fa-calendar-check" },
  { value: "Full-Stack", key: "stack", color: "accent", icon: "fa-solid fa-layer-group" },
  { value: "∞", key: "learning", color: "primary", icon: "fa-solid fa-graduation-cap" },
];
</script>

<template>
  <section id="statistics-section" class="py-20 px-4 md:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden" aria-label="Professional highlights">
    <div class="container mx-auto max-w-7xl"><div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"><div v-for="stat in stats" :key="stat.key" class="bg-white dark:bg-slate-800/60 rounded-2xl p-6 md:p-8 text-center border border-slate-200 dark:border-slate-700 hover:border-primary transition-all duration-300"><i :class="[stat.icon, `text-${stat.color}`]" class="text-3xl mb-4" aria-hidden="true"></i><div :class="[`text-${stat.color}`]" class="text-3xl md:text-4xl font-black mb-2">{{ stat.value }}</div><p class="text-slate-600 dark:text-slate-400 font-medium">{{ t(`stats.${stat.key}`) }}</p></div></div></div>
  </section>
</template>
