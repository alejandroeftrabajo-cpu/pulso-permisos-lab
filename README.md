# Portal Permiso x Caridad · Laboratorio v6.7

Base visual conservada de v6.6. Nueva marca y registro de resoluciones ficticias.

## Funciones
- Dashboard Profesorado y Dirección con datos de prueba.
- Analítica por fecha solicitada, no por fecha de presentación (dato no disponible).
- Registro en memoria de resolución, motivo, referencia, fecha y observaciones.
- Recalcula indicadores del laboratorio a partir del último estado simulado.
- Genera una vista imprimible para Guardar como PDF en Safari.
- Incluye PDF demostrativo maquetado con ReportLab, separado de la exportación del navegador.

## Límites críticos
- NO es un sistema de autenticación, ni de autorizaciones administrativas.
- El registro de resoluciones se pierde al recargar: no hay persistencia, auditoría inmutable ni conexión a Sheets.
- El calendario de no lectivos es parcial y no debe usarse para informes reales.
- Los estados iniciales de concesión no tienen motivación documental asociada.
- La detección de concurrencias no equivale a desempate o aplicación de normativa.
- El filtro temporal usa la fecha solicitada; no hay fecha de registro.
- El PDF del botón se obtiene mediante impresión del navegador y requiere revisión en Safari.

## Publicación de laboratorio
Subir index.html, styles.css, app.js, analytics.js, ledger.js y logo.jpg a GitHub Pages. Mantener la versión previa en el historial Git.
