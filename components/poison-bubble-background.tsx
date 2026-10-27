"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const MODEL_VIEWER_URL = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.4.0/model-viewer.min.js";

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function randomizeBubbleCluster(source: ArrayBuffer, animate: boolean): Blob {
  const sourceView = new DataView(source);
  const jsonLength = sourceView.getUint32(12, true);
  const jsonStart = 20;
  const json = JSON.parse(new TextDecoder().decode(new Uint8Array(source, jsonStart, jsonLength)));
  const sourceBinaryHeader = jsonStart + jsonLength;
  const binaryLength = sourceView.getUint32(sourceBinaryHeader, true);
  const binaryStart = sourceBinaryHeader + 8;
  const binary = source.slice(binaryStart, binaryStart + binaryLength);
  const binaryView = new DataView(binary);
  const animations = json.animations ?? [];
  const animation = animations.find((item: { name: string }) => item.name === "Bubbles rising and popping");
  const roots = json.nodes
    .map((node: { name?: string }, index: number) => ({ node, index }))
    .filter((item: { node: { name?: string } }) => item.node.name?.startsWith("Floating poison bubble"));

  const xPositions: number[] = [];
  for (let i = 0; i < roots.length; i += 1) {
    let x = randomBetween(-6.7, 6.7);
    for (let attempt = 0; attempt < 40 && xPositions.some((placed) => Math.abs(placed - x) < 1.25); attempt += 1) {
      x = randomBetween(-6.7, 6.7);
    }
    xPositions.push(x);
  }

  const readAccessor = (accessorId: number) => {
    const accessor = json.accessors[accessorId];
    const view = json.bufferViews[accessor.bufferView];
    return { accessor, start: (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0) };
  };
  const writeTimes = (accessorId: number, delay: number, duration: number) => {
    const { accessor, start } = readAccessor(accessorId);
    const times = [delay, delay + 0.25, delay + duration * 0.82, delay + duration * 0.93, delay + duration];
    times.forEach((value, i) => binaryView.setFloat32(start + i * 4, value, true));
    accessor.min = [times[0]];
    accessor.max = [times[times.length - 1]];
  };

  roots.forEach(({ node, index }: { node: { translation?: number[]; scale?: number[] }; index: number }, bubbleIndex: number) => {
    const x = xPositions[bubbleIndex];
    const z = randomBetween(-0.75, 0.75);
    const size = randomBetween(0.26, 0.72);
    const startY = randomBetween(-8.25, -7.75);
    const baseScale = node.scale?.[0] ?? size;
    node.translation = animate ? [x, startY, z] : [x, randomBetween(-4.8, 4.8), z];
    node.scale = [size, size, size];
    if (!animate || !animation) return;

    const channels = animation.channels.filter((channel: { target: { node: number } }) => channel.target.node === index);
    const translationChannel = channels.find((channel: { target: { path: string } }) => channel.target.path === "translation");
    const scaleChannel = channels.find((channel: { target: { path: string } }) => channel.target.path === "scale");
    if (!translationChannel || !scaleChannel) return;
    const translationSampler = animation.samplers[translationChannel.sampler];
    const scaleSampler = animation.samplers[scaleChannel.sampler];
    const timeId = translationSampler.input;
    const duration = randomBetween(3.8, 4.9);
    const delay = randomBetween(0, 4.2);
    const drift = randomBetween(-0.7, 0.7);
    const crestY = randomBetween(4.7, 5.35);
    const fadeY = crestY + randomBetween(0.55, 0.8);
    const popY = fadeY + randomBetween(0.55, 0.8);
    const xDrift = [0, drift * 0.35, drift, drift * 0.85, drift * 0.65];
    const positions = [
      x, startY, z,
      x + xDrift[1], startY + 1, z,
      x + xDrift[2], crestY, z,
      x + xDrift[3], fadeY, z,
      x + xDrift[4], popY, z,
    ];
    const positionAccessorId = translationSampler.output;
    const sizeAccessorId = scaleSampler.output;
    const factor = size / baseScale;
    const { accessor: sizeAccessor, start: sizeStart } = readAccessor(sizeAccessorId);
    const scaledValues: number[] = [];
    for (let i = 0; i < sizeAccessor.count * 3; i += 1) {
      const scaled = binaryView.getFloat32(sizeStart + i * 4, true) * factor;
      binaryView.setFloat32(sizeStart + i * 4, scaled, true);
      scaledValues.push(scaled);
    }
    const minScale = Math.min(...scaledValues);
    const maxScale = Math.max(...scaledValues);
    sizeAccessor.min = [minScale, minScale, minScale];
    sizeAccessor.max = [maxScale, maxScale, maxScale];
    const { accessor: positionAccessor, start: positionStart } = readAccessor(positionAccessorId);
    positions.forEach((value, i) => binaryView.setFloat32(positionStart + i * 4, value, true));
    positionAccessor.min = [Math.min(...positions.filter((_, i) => i % 3 === 0)), Math.min(...positions.filter((_, i) => i % 3 === 1)), Math.min(...positions.filter((_, i) => i % 3 === 2))];
    positionAccessor.max = [Math.max(...positions.filter((_, i) => i % 3 === 0)), Math.max(...positions.filter((_, i) => i % 3 === 1)), Math.max(...positions.filter((_, i) => i % 3 === 2))];
    writeTimes(timeId, delay, duration);
  });

  const encoder = new TextEncoder();
  const jsonBytes = encoder.encode(JSON.stringify(json));
  const paddedJsonLength = jsonBytes.length + ((4 - (jsonBytes.length % 4)) % 4);
  const paddedBinaryLength = binary.byteLength + ((4 - (binary.byteLength % 4)) % 4);
  const totalLength = 12 + 8 + paddedJsonLength + 8 + paddedBinaryLength;
  const output = new ArrayBuffer(totalLength);
  const outputView = new DataView(output);
  outputView.setUint32(0, 0x46546c67, true);
  outputView.setUint32(4, 2, true);
  outputView.setUint32(8, totalLength, true);
  outputView.setUint32(12, paddedJsonLength, true);
  outputView.setUint32(16, 0x4e4f534a, true);
  new Uint8Array(output, 20, jsonBytes.length).set(jsonBytes);
  new Uint8Array(output, 20 + jsonBytes.length, paddedJsonLength - jsonBytes.length).fill(0x20);
  const binaryHeader = 20 + paddedJsonLength;
  outputView.setUint32(binaryHeader, paddedBinaryLength, true);
  outputView.setUint32(binaryHeader + 4, 0x004e4942, true);
  new Uint8Array(output, binaryHeader + 8, binary.byteLength).set(new Uint8Array(binary));
  return new Blob([output], { type: "model/gltf-binary" });
}

export function PoisonBubbleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let viewer: HTMLElement | undefined;
    let modelUrl: string | undefined;
    const mountViewer = () => {
      const container = containerRef.current;
      if (cancelled || !container || viewer) return;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      viewer = document.createElement("model-viewer");
      viewer.setAttribute("alt", "");
      viewer.setAttribute("aria-hidden", "true");
      viewer.setAttribute("loading", "eager");
      viewer.setAttribute("reveal", "auto");
      viewer.setAttribute("camera-orbit", "0deg 72deg 17m");
      viewer.setAttribute("camera-target", "0m 0m 0m");
      viewer.setAttribute("field-of-view", "35deg");
      viewer.setAttribute("environment-image", "neutral");
      viewer.setAttribute("exposure", "0.8");
      viewer.setAttribute("shadow-intensity", "0");
      viewer.setAttribute("interaction-prompt", "none");
      if (!reducedMotion) {
        viewer.setAttribute("autoplay", "");
        viewer.setAttribute("animation-name", "Bubbles rising and popping");
      }
      viewer.addEventListener("load", () => {
        if (cancelled) return;
        setReady(true);
        if (!reducedMotion) {
          const animatedViewer = viewer as HTMLElement & { play?: (options?: { repetitions?: number }) => void };
          animatedViewer.play?.({ repetitions: Infinity });
        }
      }, { once: true });
      container.appendChild(viewer);
      void fetch("/models/poison-bubble-cluster.glb")
        .then((response) => {
          if (!response.ok) throw new Error("Could not load the bubble model");
          return response.arrayBuffer();
        })
        .then((source) => {
          if (cancelled || !viewer) return;
          modelUrl = URL.createObjectURL(randomizeBubbleCluster(source, !reducedMotion));
          viewer.setAttribute("src", modelUrl);
        })
        .catch(() => {
          if (!cancelled) setReady(false);
        });
    };

    if (customElements.get("model-viewer")) mountViewer();
    else customElements.whenDefined("model-viewer").then(mountViewer);

    return () => {
      cancelled = true;
      viewer?.remove();
      if (modelUrl) URL.revokeObjectURL(modelUrl);
    };
  }, []);

  return (
    <>
      <Script src={MODEL_VIEWER_URL} type="module" strategy="afterInteractive" />
      <div className={`poison-bubble-background${ready ? " is-ready" : ""}`} aria-hidden="true">
        <div className="poison-bubble-fallback"><i /><i /><i /><i /><i /><i /></div>
        <div className="poison-bubble-model" ref={containerRef} />
      </div>
    </>
  );
}
