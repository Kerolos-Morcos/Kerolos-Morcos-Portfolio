<script setup>
defineProps({ t: { type: Function, required: true } });

const stats = [
  { value: "20+", key: "projects", icon: "fa-solid fa-project-diagram", tone: "primary" },
  { value: "1+", key: "experience", icon: "fa-solid fa-calendar-check", tone: "secondary" },
  { value: "Full-Stack", key: "stack", icon: "fa-solid fa-layer-group", tone: "accent" },
  { value: "∞", key: "learning", icon: "fa-solid fa-graduation-cap", tone: "primary" },
];
</script>

<template>
  <section id="statistics-section" class="py-24 px-4 md:px-8 bg-slate-50 dark:bg-transparent relative overflow-hidden" aria-label="Professional highlights" data-motion-section>
    <div class="container mx-auto max-w-7xl relative z-10">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8" data-motion="fade-up">
        <div v-for="stat in stats" :key="stat.key" class="text-center">
          <div :class="['w-24 h-24 bg-linear-to-br rounded-2xl flex items-center justify-center mx-auto mb-4', stat.tone === 'secondary' ? 'from-secondary to-accent' : stat.tone === 'accent' ? 'from-accent to-primary' : 'from-primary to-secondary']"><i :class="[stat.icon, 'text-4xl text-white']" aria-hidden="true"></i></div>
          <div :class="['text-5xl font-black bg-linear-to-r bg-clip-text text-transparent mb-2', stat.tone === 'secondary' ? 'from-secondary to-accent' : stat.tone === 'accent' ? 'from-accent to-primary' : 'from-primary to-secondary']">{{ stat.value }}</div>
          <p class="text-slate-400 text-lg">{{ t(`stats.${stat.key}`) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
