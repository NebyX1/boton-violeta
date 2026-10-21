/* eslint-disable @typescript-eslint/no-explicit-any -- Leaflet se carga en runtime sin tipos propios. */
import { useEffect, useRef, useState } from 'react';
import { BASE_POS } from '@/lib/geo';
import type { MapMarker } from '@/components/map/mapMarkers';

/* Leaflet se carga bajo demanda; los marcadores siguen siendo ficticios. */
declare global {
  interface Window {
    L?: any;
    leafletLoading?: boolean;
  }
}

function loadLeaflet(): Promise<boolean> {
  if (window.L) return Promise.resolve(true);
  if (window.leafletLoading) return Promise.resolve(false);
  window.leafletLoading = true;
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.append(link);
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    s.onload = () => {
      window.leafletLoading = false;
      resolve(!!window.L);
    };
    s.onerror = () => {
      window.leafletLoading = false;
      resolve(false);
    };
    document.head.append(s);
    setTimeout(() => resolve(!!window.L), 7000);
  });
}

/**
 * Capa opcional de cartografía real (OpenStreetMap vía Leaflet).
 * Si no hay conexión o falla la carga, el plano vectorial sigue visible.
 */
export function LeafletLayer({
  ctx,
  markers,
  trail,
}: {
  ctx: string;
  markers: MapMarker[];
  trail: [number, number][] | null;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const mapRef = useRef<any>(null);
  const trackRef = useRef<any[]>([]);
  const lineRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then((ok) => {
      if (!cancelled && ok) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !window.L || !hostRef.current || mapRef.current) return;
    const map = window.L.map(hostRef.current, {
      zoomControl: false,
      scrollWheelZoom: false,
    }).setView(BASE_POS, 15);
    window.L
      .tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
      })
      .addTo(map);
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 80);
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [ready]);

  /* Marcadores y trayectoria ficticios sobre la cartografía real. */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.L) return;
    trackRef.current.forEach((m) => m.remove());
    trackRef.current = [];
    markers.forEach((p) => {
      const marker = window.L.marker(p.pos, {
        icon: window.L.divIcon({
          className: 'leafmarker ' + p.color,
          html: p.label,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        }),
      }).addTo(map);
      trackRef.current.push(marker);
    });
    if (lineRef.current) {
      lineRef.current.remove();
      lineRef.current = null;
    }
    if (trail) {
      lineRef.current = window.L.polyline(trail, {
        color: '#a67ed4',
        weight: 4,
        dashArray: '3,8',
      }).addTo(map);
    }
  }, [ready, markers, trail, ctx]);

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 z-[100]"
      aria-hidden="true"
      style={{ opacity: ready ? 1 : 0, transition: 'opacity .2s' }}
    />
  );
}
