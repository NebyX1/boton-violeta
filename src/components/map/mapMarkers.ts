import {
  followHasPosition,
  nearAlerts,
  nearbyFeed,
  ownAlert,
  received,
  watchedAlert,
} from '@/providers/demoSelectors';
import { places } from '@/services/demoData';
import type { DemoState, LatLng } from '@/types/demo';

export type MarkerColor = 'purple' | 'green' | 'red' | 'blue';

export interface MapMarker {
  id: string;
  pos: LatLng;
  label: string;
  color: MarkerColor;
  track?: boolean;
  action?: 'incident' | 'select-incident' | 'place' | 'unit-info';
  name?: string;
  urgent?: boolean;
}

export const markerColors: Record<MarkerColor, string> = {
  purple: '#9164d1',
  green: '#6fa28b',
  red: '#d52f55',
  blue: '#7d9dc8',
};

/**
 * Marcadores ficticios visibles según la pantalla y los permisos vigentes.
 * Nunca se muestra una posición inventada: si no hay coordenadas, no hay marcador.
 */
export function buildMarkers(s: DemoState, ctx: string): MapMarker[] {
  const out: MapMarker[] = [];

  if (['near', 'community', 'central', 'alerts'].includes(ctx)) {
    const list =
      ctx === 'central'
        ? s.incidents.filter((a) => received(a) && a.status !== 'resolved')
        : ctx === 'alerts'
          ? nearbyFeed(s)
          : nearAlerts(s);
    list
      .filter((a) => a.pos)
      .forEach((a) =>
        out.push({
          id: a.id,
          pos: a.pos as LatLng,
          label: a.owner === 'self' ? 'C' : a.name[0],
          urgent: ctx === 'near' || ctx === 'alerts',
          color: ctx === 'central' ? (a.kind === 'medical' ? 'green' : 'red') : 'red',
          action: ctx === 'central' ? 'select-incident' : 'incident',
          track: a.owner === 'self' && a.active,
          name: a.name,
        }),
      );
  }

  if (['home', 'active', 'share', 'follow'].includes(ctx)) {
    let ok = ctx !== 'follow' || followHasPosition(s);
    const a = ownAlert(s);
    if (ctx === 'active' && !a?.pos) ok = false;
    const followAlert = ctx === 'follow' ? watchedAlert(s) : null;
    if (ok) {
      out.push({
        id: 'self',
        pos: followAlert?.pos ?? s.position,
        label: 'C',
        color: followAlert ? 'red' : 'purple',
        urgent: !!followAlert,
        track: true,
        name: followAlert?.name ?? s.profile.name,
      });
    }
  }

  if (ctx.startsWith('incident:')) {
    const a = s.incidents.find((x) => x.id === ctx.split(':')[1]);
    if (a?.active && a.public && received(a) && a.pos) {
      out.push({
        id: a.id,
        pos: a.pos,
        label: a.owner === 'self' ? 'C' : a.name[0],
        color: 'red',
        track: a.owner === 'self',
        name: a.name,
      });
    }
  }

  if (ctx === 'incoming' && s.incoming?.active) {
    out.push({ id: 'sofi', pos: s.incoming.pos, label: 'S', color: 'red', name: 'Sofía Acosta' });
  }

  if (['home', 'near', 'community', 'places'].includes(ctx)) {
    places.forEach((p) =>
      out.push({ ...p, label: '+', color: 'green', action: 'place', name: p.name }),
    );
  }

  if (ctx === 'central') {
    out.push({
      id: 'unit',
      pos: [-34.3788, -55.2318],
      label: 'V',
      color: 'blue',
      action: 'unit-info',
    });
  }

  return out;
}
