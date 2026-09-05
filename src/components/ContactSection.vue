<script setup>
import { onUnmounted, reactive, ref } from "vue";
import { socials } from "../data/socials";

const props = defineProps({ lang: { type: String, required: true }, t: { type: Function, required: true } });
const form = reactive({ name: "", email: "", phone: "", projectType: "", otherProjectType: "", budget: "", details: "", website: "" });
const openSelect = ref(null);
const submitState = ref("idle");
const lastDeliveryDebug = ref(null);
const projectTypeValues = ["fullstack", "frontend", "restApis", "bugFixing", "other"];
let outsideClickListenerAttached = false;
let successResetTimer;

function getProjectTypeLabel(value) {
  const optionIndex = projectTypeValues.indexOf(value);
  return optionIndex >= 0 ? props.t(`contact.projectTypes.${optionIndex}`) : "";
}

function closeSelect() {
  openSelect.value = null;
  if (outsideClickListenerAttached) {
    document.removeEventListener("pointerdown", handleOutsidePointerDown);
    outsideClickListenerAttached = false;
  }
}

function handleOutsidePointerDown(event) {
  if (!openSelect.value) return;
  const target = event.target;
  if (target?.closest?.(".custom-select-wrapper")) return;
  closeSelect();
}

function openOutsideClickListener() {
  if (outsideClickListenerAttached) return;
  document.addEventListener("pointerdown", handleOutsidePointerDown);
  outsideClickListenerAttached = true;
}

function toggleSelect(name) {
  if (openSelect.value === name) {
    closeSelect();
    return;
  }
  openSelect.value = name;
  openOutsideClickListener();
}

function selectOption(name, value) {
  form[name] = value;
  if (name === "projectType" && value !== "other") form.otherProjectType = "";
  closeSelect();
}

async function submitForm() {
  if (submitState.value === "submitting") return;

  submitState.value = "submitting";
  lastDeliveryDebug.value = null;
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: getProjectTypeLabel(form.projectType),
        projectType: form.projectType,
        otherProjectType: form.otherProjectType,
        budget: form.budget,
        message: form.details,
        website: form.website,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success !== true) {
      lastDeliveryDebug.value = {
        status: response.status,
        apiError: typeof result.message === "string" ? result.message : "Contact request failed",
        response: result,
      };
      throw new Error(lastDeliveryDebug.value.apiError);
    }

    Object.assign(form, { name: "", email: "", phone: "", projectType: "", otherProjectType: "", budget: "", details: "", website: "" });
    submitState.value = "success";
    window.clearTimeout(successResetTimer);
    successResetTimer = window.setTimeout(() => { submitState.value = "idle"; }, 7000);
  } catch (error) {
    lastDeliveryDebug.value ??= { status: null, apiError: error?.message || "Contact request failed", response: null };
    if (import.meta.env.DEV) console.error("Contact form delivery failed", lastDeliveryDebug.value);
    submitState.value = "error";
  }
}

onUnmounted(() => {
  window.clearTimeout(successResetTimer);
  closeSelect();
});
</script>

<template>
  <section id="contact" class="py-24 px-4 md:px-8 bg-white dark:bg-slate-900/50 relative overflow-hidden" aria-labelledby="contact-title">
    <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full filter blur-3xl opacity-10"></div>
    <div class="container mx-auto max-w-7xl relative z-10">
      <div class="text-center mb-16" data-motion="fade-up" data-motion-heading>
        <span class="text-primary text-lg font-medium mb-3 block">{{ t('contact.eyebrow') }}</span>
        <h2 id="contact-title" class="section-title text-5xl font-black mb-4">{{ t('contact.titleLead') }} <span class="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{{ t('contact.titleAccent') }}</span></h2>
        <div class="w-24 h-1.5 bg-linear-to-r from-primary to-secondary mx-auto rounded-full"></div>
        <p class="text-xl text-slate-600 dark:text-slate-300 mt-6 max-w-2xl mx-auto">{{ t('contact.description') }}</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="space-y-8">
          <a :href="`mailto:${t('contact.emailValue')}`" class="group block bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary hover:shadow-lg contact-card-transition duration-300">
            <div class="flex items-center gap-5" data-motion="fade-up" data-motion-step="2">
              <div class="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300 shrink-0"><i class="fa-solid fa-envelope text-3xl" aria-hidden="true"></i></div>
              <div><h3 class="text-lg font-bold text-slate-500 dark:text-slate-400 mb-1">{{ t('contact.email') }}</h3><p class="text-xl font-bold text-slate-800 dark:text-white direction-ltr" dir="ltr">{{ t('contact.emailValue') }}</p><p class="text-sm text-slate-400 mt-1">{{ t('contact.emailNote') }}</p></div>
            </div>
          </a>

          <a href="https://wa.me/201206868603" target="_blank" rel="noopener noreferrer" class="group block cursor-pointer bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-secondary hover:shadow-lg contact-card-transition duration-300">
            <div class="flex items-center gap-5" data-motion="fade-up" data-motion-step="3">
              <div class="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center text-white shadow-lg shadow-secondary/30 group-hover:scale-110 transition-transform duration-300 shrink-0"><i class="fa-brands fa-whatsapp text-3xl" aria-hidden="true"></i></div>
              <div><h3 class="text-lg font-bold text-slate-500 dark:text-slate-400 mb-1">{{ t('contact.whatsapp') }}</h3><p class="text-xl font-bold text-slate-800 dark:text-white direction-ltr" dir="ltr">{{ t('contact.whatsappValue') }}</p><p class="text-sm text-slate-400 mt-1">{{ t('contact.whatsappNote') }}</p></div>
            </div>
          </a>

          <div class="group block bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-accent hover:shadow-lg contact-card-transition duration-300">
            <div class="flex items-center gap-5" data-motion="fade-up" data-motion-step="4">
              <div class="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-accent/30 group-hover:scale-110 transition-transform duration-300 shrink-0"><i class="fa-solid fa-location-dot text-3xl" aria-hidden="true"></i></div>
              <div><h3 class="text-lg font-bold text-slate-500 dark:text-slate-400 mb-1">{{ t('contact.location') }}</h3><p class="text-xl font-bold text-slate-800 dark:text-white">{{ t('contact.locationValue') }}</p><p class="text-sm text-slate-400 mt-1">{{ t('contact.locationNote') }}</p></div>
            </div>
          </div>

          <div class="bg-linear-to-r from-primary via-secondary to-accent p-1 rounded-2xl">
            <div class="bg-white dark:bg-slate-900 rounded-2xl p-8">
              <h3 class="text-2xl font-bold mb-4 text-center text-slate-800 dark:text-white">{{ t('contact.follow') }}</h3>
              <div class="flex justify-center gap-4">
                <a v-for="social in socials" :key="social.id" :href="social.href" class="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center hover:bg-primary transition-interactive duration-300 transform hover:scale-110 group" :aria-label="social.label" target="_blank" rel="noopener noreferrer"><i :class="social.icon" class="text-2xl text-slate-700 dark:text-white group-hover:text-white" aria-hidden="true"></i></a>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
          <form class="space-y-6" :aria-label="t('contact.formTitle')" @submit.prevent="submitForm">
            <div class="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label for="website">Website</label>
              <input id="website" v-model="form.website" name="website" tabindex="-1" autocomplete="off" type="text" />
            </div>
            <div data-motion="fade-in" data-motion-mobile="skip">
              <label for="full-name" class="block text-lg font-medium mb-2">{{ t('contact.fullName') }}</label>
              <input id="full-name" v-model="form.name" name="full-name" autocomplete="name" required type="text" :placeholder="t('contact.fullNamePlaceholder')" class="w-full bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl px-6 py-4 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div data-motion="fade-in" data-motion-mobile="skip">
              <label for="email" class="block text-lg font-medium mb-2">{{ t('contact.email') }}</label>
              <input id="email" v-model="form.email" name="email" autocomplete="email" required type="email" dir="ltr" :placeholder="t('contact.emailPlaceholder')" class="w-full bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl px-6 py-4 text-left text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div data-motion="fade-in" data-motion-mobile="skip">
              <label for="phone" class="block text-lg font-medium mb-2">{{ t('contact.phone') }}</label>
              <input id="phone" v-model="form.phone" name="phone" autocomplete="tel" type="tel" dir="ltr" :placeholder="t('contact.phonePlaceholder')" class="w-full bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl px-6 py-4 text-left text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div data-motion="fade-in" data-motion-mobile="skip">
              <label id="project-type-label" class="block text-lg font-medium mb-2">{{ t('contact.projectType') }}</label>
              <div class="custom-select-wrapper relative">
                <div class="custom-select w-full bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl px-6 py-4 text-slate-800 dark:text-white focus:border-primary transition-interactive cursor-pointer flex justify-between items-center hover:border-primary" role="combobox" aria-labelledby="project-type-label" aria-haspopup="listbox" :aria-expanded="openSelect === 'projectType'" tabindex="0" @click="toggleSelect('projectType')" @keydown.enter.prevent="toggleSelect('projectType')" @keydown.space.prevent="toggleSelect('projectType')" @keydown.escape.prevent="closeSelect">
                  <span :class="form.projectType ? '' : 'text-slate-500 dark:text-slate-400'">{{ getProjectTypeLabel(form.projectType) || t('contact.projectTypePlaceholder') }}</span><i class="fa-solid fa-chevron-down transition-transform duration-300 text-slate-600 dark:text-slate-400" :class="{ 'rotate-180': openSelect === 'projectType' }" aria-hidden="true"></i>
                </div>
                <div v-if="openSelect === 'projectType'" class="custom-options absolute w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl mt-2 shadow-2xl z-50 overflow-hidden" role="listbox" aria-labelledby="project-type-label">
                  <div v-for="(option, index) in t('contact.projectTypes')" :key="option" class="custom-option px-6 py-3 hover:bg-primary/20 cursor-pointer transition-colors text-slate-700 dark:text-slate-200" role="option" @click.stop="selectOption('projectType', projectTypeValues[index])">{{ option }}</div>
                </div>
              </div>
            </div>
            <div v-if="form.projectType === 'other'">
              <label for="other-project-type" class="block text-lg font-medium mb-2">{{ t('contact.otherProjectType') }}</label>
              <input id="other-project-type" v-model="form.otherProjectType" name="other-project-type" required type="text" :placeholder="t('contact.otherProjectTypePlaceholder')" class="w-full bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl px-6 py-4 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div data-motion="fade-in" data-motion-mobile="skip">
              <label id="budget-label" class="block text-lg font-medium mb-2">{{ t('contact.budget') }}</label>
              <div class="custom-select-wrapper relative">
                <div class="custom-select w-full bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl px-6 py-4 text-slate-800 dark:text-white focus:border-primary transition-interactive cursor-pointer flex justify-between items-center hover:border-primary" role="combobox" aria-labelledby="budget-label" aria-haspopup="listbox" :aria-expanded="openSelect === 'budget'" tabindex="0" @click="toggleSelect('budget')" @keydown.enter.prevent="toggleSelect('budget')" @keydown.space.prevent="toggleSelect('budget')" @keydown.escape.prevent="closeSelect">
                  <span :class="form.budget ? '' : 'text-slate-500 dark:text-slate-400'">{{ form.budget || t('contact.budgetPlaceholder') }}</span><i class="fa-solid fa-chevron-down transition-transform duration-300 text-slate-600 dark:text-slate-400" :class="{ 'rotate-180': openSelect === 'budget' }" aria-hidden="true"></i>
                </div>
                <div v-if="openSelect === 'budget'" class="custom-options absolute w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl mt-2 shadow-2xl z-50 overflow-hidden" role="listbox" aria-labelledby="budget-label">
                  <div v-for="option in t('contact.budgets')" :key="option" class="custom-option px-6 py-3 hover:bg-secondary/20 cursor-pointer transition-colors text-slate-700 dark:text-slate-200" role="option" @click.stop="selectOption('budget', option)">{{ option }}</div>
                </div>
              </div>
            </div>
            <div data-motion="fade-in" data-motion-mobile="skip">
              <label for="project-details" class="block text-lg font-medium mb-2">{{ t('contact.details') }}</label>
              <textarea id="project-details" v-model="form.details" name="project-details" required rows="5" :placeholder="t('contact.detailsPlaceholder')" class="w-full bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl px-6 py-4 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-primary transition-colors resize-none"></textarea>
            </div>
            <button type="submit" :disabled="submitState === 'submitting'" class="w-full bg-linear-to-r from-primary to-secondary py-4 rounded-xl text-lg font-bold text-white flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-primary/50 transition-interactive duration-300 transform hover:scale-105 disabled:cursor-wait disabled:opacity-70"><span>{{ submitState === 'submitting' ? t('contact.sending') : t('contact.submit') }}</span><i class="fa-solid fa-paper-plane" aria-hidden="true"></i></button>
            <p v-if="submitState === 'success'" class="text-center text-emerald-600 dark:text-emerald-400" role="status" aria-live="polite">{{ t('contact.success') }}</p>
            <p v-else-if="submitState === 'error'" class="text-center text-red-600 dark:text-red-400" role="alert">{{ t('contact.error') }}</p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-card-transition {
  transition-property: border-color, box-shadow;
  transition-timing-function: var(--default-transition-timing-function, cubic-bezier(.4, 0, .2, 1));
}
</style>
