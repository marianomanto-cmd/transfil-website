/**
 * Scroll to an in-page anchor AND move keyboard focus there.
 *
 * Scrolling alone leaves focus on the link that was activated, so the next
 * Tab jumps back to the top of the page — which is exactly what a skip-link
 * exists to prevent. The target gets `tabindex="-1"` (only if it has none)
 * so it can take focus without becoming a tab stop, and `preventScroll`
 * keeps the focus call from cancelling the smooth scroll.
 *
 * Smooth only when the visitor hasn't asked for reduced motion.
 */
export function goToAnchor(target: string | Element | null): boolean {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!(el instanceof HTMLElement)) return false;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  return true;
}
