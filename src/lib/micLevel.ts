"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Live per-bar microphone amplitude (0–1), sampled from the browser's real
 * `getUserMedia` stream via the Web Audio API — not mocked, not a canned
 * animation loop. Mirrors `micPermission.ts`'s own reasoning: the mocked
 * recall is about not judging or transcribing the audio, not about
 * avoiding real audio APIs. `null` while inactive or if the stream can't
 * be read (permission was already required to reach the Recording screen
 * in the first place, so this is a defensive fallback, not the normal
 * path) — callers should fall back to Waveform's static bars in that case.
 */

const BAR_COUNT = 20;

export function useMicLevel(active: boolean): number[] | null {
  const [levels, setLevels] = useState<number[] | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setLevels(null);
      return;
    }

    let audioContext: AudioContext | null = null;
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        audioContext = new AudioContext();
        await audioContext.resume().catch(() => {});
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        const bucket = Math.max(1, Math.floor(data.length / BAR_COUNT));

        const tick = () => {
          analyser.getByteFrequencyData(data);
          const next: number[] = [];
          for (let i = 0; i < BAR_COUNT; i++) {
            let sum = 0;
            for (let j = i * bucket; j < i * bucket + bucket && j < data.length; j++) sum += data[j];
            next.push(sum / bucket / 255);
          }
          setLevels(next);
          frameRef.current = requestAnimationFrame(tick);
        };
        tick();
      } catch {
        // Mic unavailable mid-recording (hardware busy, revoked
        // permission, etc.) is out of scope per voice_ux_gap_scope.md —
        // levels stays null and the caller shows the static bars instead.
      }
    }

    start();

    return () => {
      cancelled = true;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      audioContext?.close().catch(() => {});
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [active]);

  return levels;
}
