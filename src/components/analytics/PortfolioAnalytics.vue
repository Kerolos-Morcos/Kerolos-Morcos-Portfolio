<script setup>
import { onMounted } from 'vue';
import { inject, pageview } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { analyticsEnabled, redactEvent } from '../../lib/analytics';
// Official framework-independent SDKs avoid adding Vue Router to a one-page site.
onMounted(() => {
  if (!analyticsEnabled()) return;
  inject({ mode: 'production', debug: false, beforeSend: redactEvent, disableAutoTrack: true });
  pageview({ path: location.pathname });
  injectSpeedInsights({ debug: false, beforeSend: redactEvent });
});
</script>

<template></template>
