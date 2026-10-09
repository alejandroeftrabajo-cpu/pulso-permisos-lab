# PERMISOS 2D · Revisión visual controlada
IES Virgen de la Caridad · Loja

## Origen
Copia de la versión 6.7 del laboratorio público `alejandroeftrabajo-cpu/pulso-permisos-lab`.
Se preserva el nombre del repositorio y los archivos originales de funcionamiento.

## Cambios
- `index.html`: marca PERMISOS 2D, título, identidad institucional, breadcrumb del Ecosistema Digital, banner de Profesorado y botón de menú móvil. Iconos SVG locales en navegación.
- `styles.css`: ajustes de sidebar, cabecera, banner y menú responsive; reglas añadidas al final sin reconstruir los estilos existentes.
- `identity-ui.js` (nuevo): abre/cierra el menú en dispositivos estrechos; no accede a solicitudes, autenticación ni almacenamiento.
- `analytics.js`: **solo** sustitución de la denominación visible en el informe generado en navegador. Cálculos intactos.

## Sin cambios
`app.js`, `ledger.js`, `logo.jpg`; cálculos, formularios, datos ficticios, permisos y backend.

## Validación pendiente
Revisión real en Safari móvil, iPad vertical y horizontal, escritorio y flujos de navegación.
La ejecución automatizada del navegador en este entorno está bloqueada.
No existe PWA manifest en la copia inspeccionada. No se ha añadido ni modificado autenticación.

## Publicación
No publicado. GitHub denegó la creación de la rama mediante la integración (403).
Se entrega un paquete revisable para subir manualmente a una rama nueva; no sustituir `main`.
