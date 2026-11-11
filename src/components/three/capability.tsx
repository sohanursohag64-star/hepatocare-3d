"use client";

import { useReducedMotion } from "framer-motion";
import { Component, useEffect, useState, type ReactNode } from "react";

export type Capability = "pending" | "3d" | "fallback";

/** Decide whether this device should get real-time 3D, or the lightweight 2D fallback. */
export function detectCapability(): Exclude<Capability, "pending"> {
  try {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    if (nav.connection?.saveData) return "fallback";
    if (nav.deviceMemory !== undefined && nav.deviceMemory < 2) return "fallback";
    if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4) return "fallback";
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return "fallback";
    (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    return "3d";
  } catch {
    return "fallback";
  }
}

/** Client-side capability, also honouring the user's reduced-motion preference. */
export function use3DCapability() {
  const reduceMotion = useReducedMotion();
  const [capability, setCapability] = useState<Capability>("pending");
  useEffect(() => {
    setCapability(reduceMotion ? "fallback" : detectCapability());
  }, [reduceMotion]);
  return [capability, setCapability] as const;
}

export class SceneErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
