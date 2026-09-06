<template><div class="reading-progress" aria-hidden="true"></div></template>
<style scoped>
.reading-progress { display: none; }
@supports (animation-timeline: scroll()) { .reading-progress { display: block; position: fixed; inset: 0 0 auto; height: 2px; background: linear-gradient(to right, var(--color-primary), var(--color-accent)); z-index: 80; pointer-events: none; transform-origin: left; animation: reading linear both; animation-timeline: scroll(root block); } }
.reading-progress:dir(rtl) { transform-origin: right; }
@keyframes reading { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@media (prefers-reduced-motion: reduce) { .reading-progress { display: none; } }
</style>
