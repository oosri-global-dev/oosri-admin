export async function sanitizeHTML(html) {
  if (typeof window === 'undefined') return html;

  const DOMPurify = (await import('dompurify')).default;

  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'p',
      'a',
      'ul',
      'ol',
      'nl',
      'li',
      'b',
      'i',
      'strong',
      'em',
      'strike',
      'code',
      'hr',
      'br',
      'div',
      'span',
    ],
    ALLOWED_ATTR: [
      'href',
      'target',
      'rel',
      'class',
      'style',
      'src',
      'alt',
      'title',
    ],
  });
}
