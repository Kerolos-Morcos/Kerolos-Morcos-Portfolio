// Pure privacy policy: no arbitrary text or form values become event properties.
export const allowedEvents = new Set(['cv_download', 'project_live_click', 'github_project_click', 'linkedin_click', 'contact_submit_success', 'contact_submit_failure', 'project_case_study_open', 'project_case_study_live_click']);

export function sanitizedUrl(value) {
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    url.username = '';
    url.password = '';
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch { return null; }
}

export function interactionProperties(projectId, knownIds) {
  return typeof projectId === 'string' && knownIds.has(projectId) ? { project: projectId } : undefined;
}
