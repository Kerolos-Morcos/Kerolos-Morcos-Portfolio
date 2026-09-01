<script setup>
import { reactive } from "vue";
import { socials } from "../data/socials";

const props = defineProps({ lang: { type: String, required: true }, t: { type: Function, required: true } });
const form = reactive({ name: "", email: "", phone: "", projectType: "", budget: "", details: "" });

function openEmailDraft() {
  const subject = props.lang === "ar" ? `استفسار عن مشروع من ${form.name}` : `Project inquiry from ${form.name}`;
  const body = [
    `${props.t("contact.fullName")}: ${form.name}`,
    `${props.t("contact.email")}: ${form.email}`,
    `${props.t("contact.phone")}: ${form.phone || "-"}`,
    `${props.t("contact.projectType")}: ${form.projectType || "-"}`,
    `${props.t("contact.budget")}: ${form.budget || "-"}`,
    `${props.t("contact.details")}: ${form.details}`,
  ].join("\n");
  window.location.href = `mailto:${props.t("contact.emailValue")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
</script>

<template>
  <section id="contact" class="py-24 px-4 md:px-8 bg-white dark:bg-slate-900/50 relative overflow-hidden" aria-labelledby="contact-title">
    <div class="absolute top-0 right-1/4 w-96 h-96 bg-primary rounded-full filter blur-3xl opacity-10"></div>
    <div class="container mx-auto max-w-7xl relative z-10">
      <div class="text-center mb-16"><span class="text-primary text-lg font-medium mb-3 block">{{ t('contact.eyebrow') }}</span><h2 id="contact-title" class="text-5xl font-black mb-4">{{ t('contact.title') }}</h2><div class="w-24 h-1.5 bg-linear-to-r from-primary to-secondary mx-auto rounded-full"></div><p class="text-slate-500 dark:text-slate-400 mt-6">{{ t('contact.description') }}</p></div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div class="space-y-5">
          <a :href="`mailto:${t('contact.emailValue')}`" class="flex items-center gap-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary transition-all duration-300"><span class="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl"><i class="fa-solid fa-envelope" aria-hidden="true"></i></span><span><span class="block font-bold text-xl">{{ t('contact.email') }}</span><span class="block text-primary">{{ t('contact.emailValue') }}</span><span class="block text-sm text-slate-500 dark:text-slate-400 mt-1">{{ t('contact.emailNote') }}</span></span></a>
          <a href="tel:+201206868603" class="flex items-center gap-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-secondary transition-all duration-300"><span class="w-14 h-14 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center text-2xl"><i class="fa-solid fa-phone" aria-hidden="true"></i></span><span><span class="block font-bold text-xl">{{ t('contact.phone') }}</span><span class="block text-secondary">{{ t('contact.phoneValue') }}</span><span class="block text-sm text-slate-500 dark:text-slate-400 mt-1">{{ t('contact.phoneNote') }}</span></span></a>
          <div class="flex items-center gap-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"><span class="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-2xl"><i class="fa-solid fa-location-dot" aria-hidden="true"></i></span><span><span class="block font-bold text-xl">{{ t('contact.location') }}</span><span class="block text-accent">{{ t('contact.locationValue') }}</span><span class="block text-sm text-slate-500 dark:text-slate-400 mt-1">{{ t('contact.locationNote') }}</span></span></div>
          <div class="pt-4"><h3 class="text-xl font-bold mb-4">{{ t('contact.follow') }}</h3><div class="flex gap-4"><a v-for="social in socials" :key="social.id" :href="social.href" class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all" :aria-label="social.label" target="_blank" rel="noopener noreferrer"><i :class="social.icon" aria-hidden="true"></i></a></div></div>
        </div>

        <form class="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-7 md:p-8 border border-slate-200 dark:border-slate-700" :aria-label="t('contact.formTitle')" @submit.prevent="openEmailDraft">
          <h3 class="text-2xl font-bold mb-6">{{ t('contact.formTitle') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label class="block"><span class="block text-sm font-bold mb-2">{{ t('contact.fullName') }}</span><input v-model="form.name" required type="text" :placeholder="t('contact.fullNamePlaceholder')" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" /></label>
            <label class="block"><span class="block text-sm font-bold mb-2">{{ t('contact.email') }}</span><input v-model="form.email" required type="email" :placeholder="t('contact.emailPlaceholder')" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" /></label>
            <label class="block"><span class="block text-sm font-bold mb-2">{{ t('contact.phone') }}</span><input v-model="form.phone" type="tel" :placeholder="t('contact.phonePlaceholder')" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" /></label>
            <label class="block"><span class="block text-sm font-bold mb-2">{{ t('contact.projectType') }}</span><select v-model="form.projectType" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"><option value="">{{ t('contact.projectTypePlaceholder') }}</option><option v-for="option in t('contact.projectTypes')" :key="option" :value="option">{{ option }}</option></select></label>
            <label class="block md:col-span-2"><span class="block text-sm font-bold mb-2">{{ t('contact.budget') }}</span><select v-model="form.budget" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"><option value="">{{ t('contact.budgetPlaceholder') }}</option><option v-for="option in t('contact.budgets')" :key="option" :value="option">{{ option }}</option></select></label>
            <label class="block md:col-span-2"><span class="block text-sm font-bold mb-2">{{ t('contact.details') }}</span><textarea v-model="form.details" required rows="5" :placeholder="t('contact.detailsPlaceholder')" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"></textarea></label>
          </div>
          <button type="submit" class="mt-6 w-full inline-flex items-center justify-center gap-3 bg-linear-to-l from-primary to-secondary px-6 py-4 rounded-xl text-lg font-bold text-white hover:-translate-y-1 transition-all"><span>{{ t('contact.submit') }}</span><i class="fa-solid fa-paper-plane" aria-hidden="true"></i></button>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">{{ t('contact.formNote') }}</p>
        </form>
      </div>
    </div>
  </section>
</template>
