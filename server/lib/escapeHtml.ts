// Escapes user-supplied text before it is interpolated into email HTML
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Escapes text and preserves line breaks
export function escapeHtmlMultiline(value: unknown): string {
  return escapeHtml(value).replace(/\n/g, '<br>');
}
