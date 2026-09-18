"use client";

import { useEffect, useRef } from "react";

// Below this many px of horizontal movement, a mousedown+up is a click on
// whatever's inside the row (e.g. an ActivityCard), not a drag-to-scroll
// gesture — real, confirmed regression: capturing the pointer on every
// mousedown (even a plain click with zero movement) swallowed the click
// on the card underneath it, breaking "Recall exercice" entirely.
const DRAG_THRESHOLD_PX = 5;

/**
 * Mouse-drag-to-scroll for a horizontally overflowing row — click and drag
 * with a mouse to scroll it, the same gesture a touchscreen already gives
 * you for free. Only intercepts `pointerType === "mouse"`; touch/pen
 * pointer events pass through untouched so real touch devices keep their
 * native scroll-by-swipe instead of fighting this handler.
 *
 * Pointer capture (and therefore any interception of the click) only
 * kicks in once the pointer has actually moved past DRAG_THRESHOLD_PX — a
 * plain click never captures anything, so it reaches whatever's under the
 * cursor exactly as it would without this hook attached.
 *
 * Pair with hiding the native scrollbar (`scrollbar-width: none` +
 * `::-webkit-scrollbar { display: none }`) on the same element — the
 * point is to read as touch-draggable content, not a desktop scroll pane.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let pointerDown = false;
    let dragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let pointerId: number | null = null;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointerDown = true;
      dragging = false;
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
      pointerId = e.pointerId;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointerDown) return;
      const delta = e.clientX - startX;

      if (!dragging) {
        if (Math.abs(delta) < DRAG_THRESHOLD_PX) return;
        dragging = true;
        el.style.cursor = "grabbing";
        if (pointerId !== null) el.setPointerCapture(pointerId);
      }

      el.scrollLeft = startScrollLeft - delta;
    };

    const endDrag = (e: PointerEvent) => {
      pointerDown = false;
      if (dragging) {
        el.style.cursor = "";
        if (pointerId !== null && el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId);
      }
      dragging = false;
      pointerId = null;
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  return ref;
}
