import { useDemo } from '@/providers/DemoStateProvider';
import { followHasPosition, watchedAlert } from '@/providers/demoSelectors';
import { incidentStatusLabel } from '@/services/demoData';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Elapsed } from '@/components/common/Clock';
import { Icon } from '@/components/common/Icon';
import { MapLabel, VectorMap } from '@/components/map/VectorMap';

/**
 * SOS recibido por una cuenta del círculo familiar.
 * Es la alerta más importante de la pantalla: ocupa el lugar principal,
 * en rojo, con ubicación y acciones inmediatas.
 */
export function FamilyAlertCard() {
  const { state, dispatch } = useDemo();
  const alert = watchedAlert(state);
  if (!alert) return null;

  const person = alert.name.split(' ')[0];
  const hasPosition = followHasPosition(state);

  return (
    <section
      aria-label={`SOS activo de ${alert.name}`}
      className="relative mt-4 overflow-hidden rounded-[24px] border-2 border-[#d52f55] bg-gradient-to-b from-[#ffe4ea] via-[#fff0f3] to-[#fff8f9] p-4 shadow-[0_14px_34px_#d52f5533]"
    >
      <span className="pointer-events-none absolute -right-10 -top-12 h-[130px] w-[130px] rounded-full bg-[#d52f55]/10" />

      <div className="relative flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d52f55] px-2.5 py-[5px] text-[8px] font-extrabold tracking-[0.9px] text-white shadow-sm">
          <i className="h-[5px] w-[5px] rounded-full bg-white animate-pulse-live" />
          SOS ACTIVO · NECESITA AYUDA
        </span>
        <span className="flex items-center gap-1 text-[11px] font-extrabold text-[#b71339]">
          <Icon name="clock" size="sm" className="h-3 w-3" />
          <Elapsed since={alert.started} />
        </span>
      </div>

      <div className="relative mt-3 flex items-center gap-3">
        <span className="relative">
          <Avatar name={alert.name} size="lg" color="pink" />
          <span className="absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-[#ffe4ea] bg-[#d52f55] text-[9px] font-extrabold text-white">
            !
          </span>
        </span>
        <div className="min-w-0">
          <h2 className="text-[23px] leading-[1.1] tracking-[-0.7px] text-[#8f1836]">
            {person} pidió ayuda
          </h2>
          <p className="mt-1 text-[10px] font-semibold text-[#a34a63]">
            {alert.title} · recibida por tu cuenta familiar
          </p>
        </div>
      </div>

      <div className="relative mt-3 flex flex-wrap gap-1">
        <Badge color="red">CENTRAL: {incidentStatusLabel(alert.status).toUpperCase()}</Badge>
        {alert.family && <Badge color="red">TU CÍRCULO</Badge>}
        {alert.public && <Badge color="red">COMUNIDAD</Badge>}
        {alert.noTalk && <Badge color="red">SOLO MENSAJES</Badge>}
      </div>

      <div className="relative mt-3 overflow-hidden rounded-[16px] border-2 border-[#d52f5533]">
        {hasPosition ? (
          <VectorMap
            ctx="follow"
            variant="mini"
            label={
              <MapLabel
                icon={<Icon name="pin" size="sm" className="h-3 w-3 text-[#d52f55]" />}
                title={`Ubicación de ${person}`}
                sub="Compartida por el SOS · datos ficticios"
              />
            }
          />
        ) : (
          <div className="flex flex-col items-center gap-1 bg-white/70 px-3 py-4 text-center">
            <Icon name="pin" className="text-[#d52f55]" />
            <strong className="text-[10px] text-[#8f1836]">Sin coordenadas disponibles</strong>
            <p className="text-[9px] text-[#a34a63]">
              La alerta llegó, pero la ubicación no está habilitada. No se inventa una posición.
            </p>
          </div>
        )}
      </div>

      <div className="relative mt-3 flex flex-col gap-2">
        <Button
          variant="danger"
          block
          icon="pin"
          onClick={() => dispatch({ type: 'go', screen: 'follow' })}
        >
          Ver ubicación en vivo
        </Button>
        <a
          href="tel:911"
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[13px] bg-[#b71339] px-4 py-2 text-[12px] font-extrabold text-white shadow-[0_5px_14px_#b7133940] transition-transform hover:-translate-y-px active:scale-[0.98]"
        >
          <Icon name="phone" size="sm" />
          Llamar al 911
        </a>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            small
            icon="check2"
            onClick={() => dispatch({ type: 'familyAck' })}
            className="border-[#d52f55] text-[#b71339]"
          >
            {alert.familyAck ? 'Recepción confirmada' : 'Ya lo vi'}
          </Button>
          <Button
            variant="outline"
            small
            icon="users"
            onClick={() => dispatch({ type: 'familyPresent' })}
            className="border-[#d52f55] text-[#b71339]"
          >
            {alert.familyPresent ? `Estás con ${person}` : `Estoy con ${person}`}
          </Button>
        </div>
      </div>

      <p className="relative mt-2 flex items-start gap-1 text-[8px] leading-relaxed text-[#a34a63]">
        <Icon name="shield" size="sm" className="mt-[1px] h-3 w-3 shrink-0" />
        La alerta sigue activa hasta que {person} la detenga. Ofrecer ayuda no autoriza a confrontar a
        nadie.
      </p>
    </section>
  );
}
