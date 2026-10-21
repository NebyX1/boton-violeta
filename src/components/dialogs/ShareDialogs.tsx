import { useDemo } from '@/providers/DemoStateProvider';
import { Sheet } from '@/components/common/Sheet';
import { Button } from '@/components/common/Button';
import { Note } from '@/components/common/Note';

/** Permiso de ubicación desactivado al iniciar un acompañamiento. */
export function GpsDialog() {
  const { dispatch } = useDemo();
  return (
    <Sheet
      title="Ubicación de prueba desactivada"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <Button onClick={() => dispatch({ type: 'go', screen: 'permissions' })}>
          Revisar permisos
        </Button>
      }
    >
      <Note icon="pin" color="amber">
        Habilitá el permiso simulado para iniciar una sesión de acompañamiento. Un SOS sí puede
        enviarse sin ubicación.
      </Note>
    </Sheet>
  );
}

/** Confirmación para dejar de compartir la ubicación. */
export function StopShareDialog() {
  const { dispatch } = useDemo();
  return (
    <Sheet
      title="¿Dejar de compartir?"
      onClose={() => dispatch({ type: 'closeSheet' })}
      actions={
        <>
          <Button onClick={() => dispatch({ type: 'stopSharing' })}>
            Retirar permiso de seguimiento
          </Button>
          <Button variant="outline" onClick={() => dispatch({ type: 'closeSheet' })}>
            Seguir compartiendo
          </Button>
        </>
      }
    >
      <Note icon="lock">
        Las personas autorizadas perderán acceso a esta sesión de seguimiento. Esto no desactiva un
        SOS que siga activo.
      </Note>
    </Sheet>
  );
}
