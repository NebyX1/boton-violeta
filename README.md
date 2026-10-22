# Botón Violeta · Frontend (React + Vite + Tailwind)

Prototipo interactivo de una **red de cuidado para Lavalleja**. Este proyecto es la migración de la
maqueta HTML autocontenida (`../Boton_Violeta_Prototipo_Interactivo.html`) a una aplicación
**React + TypeScript**, con la arquitectura de
[`sala-de-medios-frontend`](https://github.com/IntendenciaDeLavalleja/sala-de-medios-frontend) y
estilos con **Tailwind CSS v4** (plugin de Vite).

> **Importante:** es una demostración de diseño. No es un canal de emergencia, no envía alertas
> reales, no usa GPS/cámara/micrófono, y todas las personas, posiciones, reportes y respuestas son
> ficticios. El estado vive en la memoria de la pestaña: recargar reinicia la sesión.

## Comandos

```bash
npm install --legacy-peer-deps   # el workaround evita un bug de npm 11 con peers opcionales de vitest
npm run dev                      # servidor de desarrollo (http://localhost:5173)
npm run build                    # type-check + build de producción
npm run lint                     # ESLint
npm test                         # Vitest
```

## Arquitectura

Sigue el patrón de carpetas del repo de referencia:

```
src/
├── app/App.tsx                  # Composición raíz: proveedor de estado + vistas
├── main.tsx                     # Punto de entrada
├── components/
│   ├── common/                  # Primitivas reutilizables (Button, Icon, Badge, Avatar,
│   │                            #   Toggle, Note, Tile, Sheet, Toast, Clock, Field…)
│   ├── layout/                  # Estructura: StudioLayout, StudioHeader (navbar),
│   │                            #   PhoneFrame, StatusBar, DemoBar, BottomTabBar (footer/tab),
│   │                            #   HomeIndicator, PageTop, AppHeader, InspectorPanel
│   ├── map/                     # VectorMap, StreetPlan, LeafletLayer, mapMarkers
│   ├── sos/                     # SosCard (botón orbital)
│   ├── incidents/               # IncidentCard, AlertBanner
│   ├── contacts/                # ContactCard, PersonPick, ContactPreview
│   ├── chat/                    # ChatBubble, ChatComposer, ChatThread, QuickReplies
│   ├── console/                 # Consola: ConsoleRail, ConsoleLayout, paneles, tablas
│   └── dialogs/                 # Sheets/diálogos por dominio + DialogHost
├── screens/
│   ├── mobile/                  # 1 archivo por pantalla (Home, Near, Circle, Share, Sos,
│   │                            #   RoleSelection, LockScreen…)
│   └── console/                 # Pantallas institucionales (Dashboard, Incidents, Guardians…)
├── pages/GuardianRegistryPage.tsx  # Web independiente de registro de vigilantes
├── providers/
│   ├── DemoStateProvider.tsx    # Contexto + reloj de simulación + toast transitorio
│   ├── demoReducer.ts           # Toda la lógica de interacción (equivalente a act())
│   └── demoSelectors.ts         # Selectores puros (ownAlert, watchedAlert, nearAlerts…)
├── services/demoData.ts         # Estado inicial, perfiles y datos semilla ficticios
├── services/qrCodes.ts          # QR de demostración por token
├── lib/                         # format, geo, cn, iconPaths, routes (registro)
├── styles/global.css            # Tailwind + tokens de tema + estilos base
└── types/demo.ts                # Modelos de datos de la demo
```

### Principios

1. **Un componente por responsabilidad.** El footer/tab (`BottomTabBar`), la navbar
   (`StudioHeader`, `ConsoleRail`), cada pantalla y cada pieza dentro de una pantalla viven en su
   propio archivo.
2. **Estado centralizado y puro.** La lógica que en la maqueta vivía en `act()` está en
   `demoReducer.ts` como acciones tipadas; los componentes solo despachan acciones. Es testeable
   sin navegador (`npm test`).
3. **Sin dependencias de UI pesadas.** El sistema de diseño es Tailwind v4 con tokens semánticos
   (`brand`, `ink`, `muted`, `line`, `canvas`, `paper`, `green/red/amber`) definidos en
   `@theme`. El modo oscuro es un scope `.dark` dentro del simulador que reasigna los tokens.
4. **Textos en un solo lugar.** Todos los textos están en los componentes en español rioplatense,
   listos para extraer a un diccionario de i18n (ver abajo).

## Traducción a React Native (Expo + NativeWind)

El código está pensado para portarse con el mínimo de fricción:

| Web (este repo)                              | React Native                              |
| -------------------------------------------- | ----------------------------------------- |
| `components/common/*` con clases Tailwind     | Mismos componentes con NativeWind          |
| `Icon` (SVG inline)                          | `react-native-svg` con las mismas rutas    |
| `PhoneFrame`, `StudioLayout`, consola        | Se descartan (son el "studio" de diseño)   |
| `BottomTabBar`                               | `tabBar` de React Navigation               |
| `demoReducer` + `demoSelectors` + `services` | Se copian tal cual (TypeScript puro)       |
| `Sheet`, `Toast`, `Toggle`, `Avatar`…        | `Modal`/`Switch`/`View` nativos            |
| `VectorMap` (plano SVG)                      | `react-native-svg` o `react-native-maps`   |
| `screens/mobile/*`                           | Pantallas de Expo Router 1:1               |

Como los estilos usan clases Tailwind semánticas (no selectores CSS arbitrarios), NativeWind puede
consumirlos sin reescritura. Las únicas excepciones web están marcadas en
`src/styles/global.css` (`@layer components`): sombras, gradientes y `backdrop-blur`.

## Traducción de textos (i18n)

Cada pantalla y componente contiene sus cadenas literales. Para localizar:

1. Extraer cadenas a `src/i18n/es-UY.ts` con claves por dominio
   (`home.title`, `sos.stop`, etc.).
2. Reemplazar literales por `t('clave')` (react-i18next o un hook propio `useTranslation`).
3. Los tipos de `types/demo.ts` ya separan datos de presentación; los textos de estado
   (`incidentStatusLabel`) están centralizados en `services/demoData.ts`.

## Alcance de la demo

- **9 perfiles/dispositivos** seleccionables desde el inicio (y en cualquier momento): 3 personas,
  3 vigilantes del círculo familiar y 3 vigilantes comunitarios. Todos pueden pedir ayuda con SOS.
  Cada perfil representa un dispositivo vinculado a la misma red.
- **Visibilidad del SOS configurable**: solo el círculo, o círculo + personas cercanas. La decisión se
  toma en Privacidad o en Ajustes y se puede cambiar al activar la alerta.
- **Alertas entre dispositivos**: un SOS activado se ve en los dispositivos vinculados según la
  audiencia elegida (círculo, comunidad) y el radio configurado. En la cuenta del círculo familiar, el
  SOS aparece como **alerta roja principal**, con ubicación, estado de la central, confirmación de
  recepción, aviso de estar presente y llamada directa al 911.
- **Pantalla bloqueada de ejemplo**: botón de SOS que aparece al encender la pantalla (si la opción
  está activa, por defecto sí) y exige mantener pulsado **5 segundos fijos** para activarse, sin
  abrir la app. Se abre desde el quinto acceso **Bloqueado** de la barra superior o desde Mi cuenta.
- **Registro de vigilantes comunitarios** (web independiente en `/registro-vigilantes`): formulario
  de postulación, criterios de prueba con puntaje y revisión con alta, revisión o rechazo. Un alta
  aprobada se convierte en un dispositivo comunitario disponible en la app y en la consola.
- 4 perspectivas conectadas: **Mi app**, **Círculo familiar**, **Comunidad** y **Central (Mariana)**.
- SOS con cuenta regresiva, audiencia configurable y consentimiento explícito para difusión
  comunitaria.
- Consentimiento por vínculo: vincular no comparte ubicación; cada permiso es individual y revocable.
- Acompañamiento temporal con duración, revocación y vencimiento automático.
- Estados sin conexión (`Pendiente de envío` → `Recibida` al reconectar).
- Reportes no urgentes en 3 pasos con comprobante exportable.
- Consola institucional: bandeja, detalle operativo, asignación de recursos, bitácora, vigilantes y
  exportación.
- Mapa vectorial ilustrativo offline + cartografía real opcional (Leaflet/OpenStreetMap).

## Web independiente de registro

El registro de vigilantes se sirve como una página aparte con su propio layout:

- Ruta: `http://localhost:5173/registro-vigilantes`.
- Se llega desde la app (selección de perfil o Mi cuenta) sin perder el estado de la demo.
- Comparte el mismo `DemoStateProvider`, por lo que una postulación enviada aparece en la consola
  institucional (**Vigilantes**) y un alta aprobada se suma a los perfiles disponibles.

## Créditos y referencias

Diseño original "Botón Violeta · Concepto Lavalleja v0.1". Referencias funcionales:
PulsePoint Respond y GoodSAM. Objetivo tecnológico: React Native + Expo + NativeWind, backend Flask.
