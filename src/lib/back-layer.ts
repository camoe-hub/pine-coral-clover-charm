import { useEffect, useRef } from "react";

const closers: (() => void)[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** The top sheet closes first. Returns false when nothing is open. */
export function closeBackLayer() {
  const close = closers.pop();
  if (!close) return false;
  close();
  return true;
}

export function backLayerCount() {
  return closers.length;
}

export function addBackLayer(close: () => void) {
  if (closers.includes(close)) return;
  closers.push(close);
}

export function removeBackLayer(close: () => void) {
  const index = closers.lastIndexOf(close);
  if (index >= 0) closers.splice(index, 1);
}

export function onBackLayers(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** While `open` is true, the phone's Back button closes this instead of leaving. `resetKey` rebuilds the step when a stack grows. */
export function useBackLayer(open: boolean, close: () => void, resetKey: unknown = 0) {
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    if (!open) return;
    const fn = () => closeRef.current();
    closers.push(fn);
    emit();
    return () => {
      const index = closers.lastIndexOf(fn);
      if (index >= 0) closers.splice(index, 1);
      emit();
    };
  }, [open, resetKey]);
}
