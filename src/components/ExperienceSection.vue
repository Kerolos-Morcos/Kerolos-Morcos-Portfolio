<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { certificates } from "../data/certificates";
import { experience } from "../data/experience";

const props = defineProps({ lang: { type: String, required: true }, t: { type: Function, required: true } });

const trainingIndex = ref(0);
const visibleCount = ref(1);
const trainingDirection = ref("next");
const pointerStartX = ref(null);
const trainingPageCount = computed(() => Math.max(1, certificates.length - visibleCount.value + 1));
const visibleCertificates = computed(() => certificates.slice(trainingIndex.value, trainingIndex.value + visibleCount.value));
const trainingTransitionName = computed(() => trainingDirection.value === "next" ? "training-next" : "training-previous");

function getVisibleCount() {
  if (typeof window === "undefined") return 1;
  return window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
}
function updateVisibleCount() { visibleCount.value = getVisibleCount(); }
function selectTrainingPage(page, direction = "next") {
  trainingDirection.value = direction;
  trainingIndex.value = Math.min(Math.max(page, 0), trainingPageCount.value - 1);
}
function nextTraining() { selectTrainingPage(trainingIndex.value + 1 >= trainingPageCount.value ? 0 : trainingIndex.value + 1, "next"); }
function previousTraining() { selectTrainingPage(trainingIndex.value - 1 < 0 ? trainingPageCount.value - 1 : trainingIndex.value - 1, "previous"); }
function startTrainingSwipe(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  pointerStartX.value = event.clientX;
}
function finishTrainingSwipe(event) {
  if (pointerStartX.value === null) return;
  const distance = event.clientX - pointerStartX.value;
  pointerStartX.value = null;
  if (Math.abs(distance) < 48) return;
  if (distance < 0) nextTraining();
  else previousTraining();
}
function handleTrainingKeydown(event) {
  const nextKey = props.lang === "ar" ? "ArrowLeft" : "ArrowRight";
  const previousKey = props.lang === "ar" ? "ArrowRight" : "ArrowLeft";
  if (event.key === nextKey) { event.preventDefault(); nextTraining(); }
  if (event.key === previousKey) { event.preventDefault(); previousTraining(); }
}

watch(visibleCount, () => selectTrainingPage(trainingIndex.value));
onMounted(() => {
  updateVisibleCount();
  window.addEventListener("resize", updateVisibleCount, { passive: true });
});
onUnmounted(() => window.removeEventListener("resize", updateVisibleCount));
</script>

<template>
  <section id="experience" class="experience-section py-24 px-4 md:px-8 bg-slate-50 dark:bg-transparent relative overflow-hidden" aria-labelledby="experience-title" data-motion-section>
    <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary rounded-full filter blur-3xl opacity-10"></div>
    <div class="container mx-auto max-w-7xl relative z-10">
      <div class="text-center mb-16" data-motion="fade-up" data-motion-heading>
        <span class="text-secondary text-lg font-medium mb-3 block">{{ t('experience.eyebrow') }}</span>
        <h2 id="experience-title" class="section-title text-5xl font-black mb-4">{{ t('experience.titleLead') }} <span class="bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">{{ t('experience.titleAccent') }}</span></h2>
        <div class="w-24 h-1.5 bg-linear-to-r from-secondary to-accent mx-auto rounded-full"></div>
      </div>

      <div class="relative">
        <div :class="['absolute top-0 transform h-full w-1 bg-linear-to-b from-primary via-secondary to-accent', lang === 'ar' ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2']"></div>

        <div class="space-y-16">
          <div v-for="(item, index) in experience" :key="item.id" class="relative flex items-center">
            <div v-if="index % 2 === 0" :class="['timeline-side w-1/2', lang === 'ar' ? 'text-right' : 'text-left']">
              <article class="timeline-card-left bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:border-primary transition-interactive duration-300 transform" data-motion="fade-side" data-motion-side="start" :data-motion-step="index + 1">
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <span class="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-bold">{{ item.period[lang] }}</span>
                    <i class="fa-solid fa-briefcase text-3xl text-primary" aria-hidden="true"></i>
                  </div>
                  <h3 class="text-2xl font-bold mb-2">{{ item.role[lang] }}</h3>
                  <p class="text-xl text-secondary mb-3">{{ item.company[lang] }}</p>
                  <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{{ item.description[lang] }}</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="tag in item.tags" :key="tag" class="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs">{{ tag }}</span>
                  </div>
                </div>
              </article>
            </div>
            <div v-else class="timeline-side w-1/2"></div>

            <div :class="['absolute transform w-6 h-6 rounded-full border-4 border-white dark:border-slate-950 z-10', lang === 'ar' ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2', index % 2 === 0 ? 'bg-primary' : 'bg-secondary']" aria-hidden="true"></div>

            <div v-if="index % 2 === 1" :class="['timeline-side w-1/2', lang === 'ar' ? 'text-right' : 'text-left']">
              <article class="timeline-card-right bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:border-secondary transition-interactive duration-300 transform" data-motion="fade-side" data-motion-side="end" :data-motion-step="index + 1">
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <span class="px-4 py-2 bg-secondary/20 text-secondary rounded-lg text-sm font-bold">{{ item.period[lang] }}</span>
                    <i class="fa-solid fa-laptop-code text-3xl text-secondary" aria-hidden="true"></i>
                  </div>
                  <h3 class="text-2xl font-bold mb-2">{{ item.role[lang] }}</h3>
                  <p class="text-xl text-secondary mb-3">{{ item.company[lang] }}</p>
                  <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{{ item.description[lang] }}</p>
                  <div :class="['flex flex-wrap gap-2', lang === 'ar' ? 'justify-end' : 'justify-start']">
                    <span v-for="tag in item.tags" :key="tag" class="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs">{{ tag }}</span>
                  </div>
                </div>
              </article>
            </div>
            <div v-else class="timeline-side w-1/2"></div>
          </div>
        </div>
      </div>

      <div class="mt-20" data-motion-section>
        <h3 class="section-title text-3xl font-black text-center mb-10" data-motion="fade-up" data-motion-heading><span class="bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">{{ t('experience.trainingTitle') }}</span></h3>
        <p class="text-center text-slate-500 dark:text-slate-400 mb-8" data-motion="fade-up" data-motion-step="1">{{ t('experience.certificates') }}</p>
        <TransitionGroup :name="trainingTransitionName" tag="div" class="training-carousel grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="region" aria-roledescription="carousel" :aria-label="t('experience.trainingTitle')" tabindex="0" data-motion="fade-up" data-motion-step="2" @pointerdown="startTrainingSwipe" @pointerup="finishTrainingSwipe" @pointercancel="pointerStartX = null" @keydown="handleTrainingKeydown">
          <article v-for="(certificate, index) in visibleCertificates" :key="certificate.id" class="training-card bg-slate-50 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-300 dark:border-slate-700 text-center hover:border-primary transition-interactive duration-300 transform hover:-translate-y-1">
            <div>
              <span :class="['training-icon w-16 h-16 bg-linear-to-br rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl text-white', certificate.tone === 'secondary' ? 'from-secondary to-accent' : certificate.tone === 'accent' ? 'from-accent to-primary' : 'from-primary to-secondary']"><i :class="certificate.icon" aria-hidden="true"></i></span>
              <p class="text-primary font-bold mb-2">{{ certificate.provider }}</p>
              <h4 class="text-2xl font-bold mb-2">{{ certificate.title[lang] }}</h4>
              <p class="text-slate-500 dark:text-slate-400">{{ certificate.period[lang] }}</p>
            </div>
          </article>
        </TransitionGroup>
      </div>
    </div>
  </section>
</template>
