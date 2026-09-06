import { onMounted, onUnmounted, shallowRef } from 'vue';
import { projects } from '../data/projects';
import { trackEvent } from '../lib/analytics';

export function useProjectDetails() {
  const selectedProject = shallowRef(null);
  let trigger;
  let destination;
  let navigationFrame;
  let origin;
  let scrollRestoration;
  function retainScroll() {
    if (scrollRestoration !== undefined) return;
    origin = { left: window.scrollX, top: window.scrollY };
    scrollRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';
  }
  function finishClose() {
    if (scrollRestoration === undefined) return;
    cancelAnimationFrame(navigationFrame);
    // Native history must not restore a stale pre-anchor scroll position.
    // Wait for the dialog unmount before returning both viewport and focus.
    navigationFrame = requestAnimationFrame(() => {
      navigationFrame = requestAnimationFrame(() => {
        if (origin) window.scrollTo({ ...origin, behavior: 'instant' });
        if (trigger?.isConnected) trigger.focus({ preventScroll: true });
        history.scrollRestoration = scrollRestoration;
        scrollRestoration = undefined;
        origin = null;
        if (destination) document.getElementById(destination)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        destination = null;
      });
    });
  }
  function readLocation() {
    const id = new URL(location.href).searchParams.get('project');
    selectedProject.value = projects.find((project) => project.id === id) || null;
    if (selectedProject.value) retainScroll();
    else finishClose();
  }
  function openProject(project, event) {
    trigger = event?.currentTarget || document.activeElement;
    retainScroll();
    const url = new URL(location.href);
    url.searchParams.set('project', project.id);
    history.pushState({ ...history.state, portfolioProject: true }, '', url);
    selectedProject.value = project;
    trackEvent('project_case_study_open', project.id);
  }
  function closeProject(nextSection) {
    destination = nextSection === 'contact' ? 'contact' : null;
    selectedProject.value = null;
    if (history.state?.portfolioProject) history.back();
    else {
      const url = new URL(location.href);
      url.searchParams.delete('project');
      history.replaceState(history.state, '', url);
      finishClose();
    }
  }
  onMounted(() => { readLocation(); window.addEventListener('popstate', readLocation); });
  onUnmounted(() => {
    window.removeEventListener('popstate', readLocation);
    cancelAnimationFrame(navigationFrame);
    if (scrollRestoration !== undefined) history.scrollRestoration = scrollRestoration;
  });
  return { selectedProject, openProject, closeProject };
}
