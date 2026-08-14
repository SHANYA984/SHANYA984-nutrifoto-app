# Motor de personalización

## Entradas
- Edad.
- Peso.
- Altura.
- Objetivo declarado.
- Nivel de actividad.
- Condiciones declaradas.
- Registro de comidas y actividad, cuando exista.

## Salida
El motor transforma las entradas en preferencias y reglas de personalización para la experiencia de la app. No realiza diagnóstico médico.

## Orden de evaluación
1. Validar que el perfil esté completo y sea de un adulto.
2. Aplicar reglas de seguridad.
3. Interpretar objetivo y actividad como contexto de personalización.
4. Incorporar historial disponible.
5. Generar recomendaciones generales compatibles con las reglas.
6. Etiquetar cualquier estimación nutricional como estimada.

## Condiciones declaradas
Las condiciones no deben activar diagnósticos ni tratamientos. Pueden activar:
- Advertencias.
- Restricciones de personalización.
- Solicitud de revisión profesional cuando corresponda.

## Diseño extensible
El motor debe funcionar con reglas versionadas y testeables, separadas de la interfaz. Toda regla debe poder identificarse por nombre/versión para facilitar auditoría y cambios posteriores.
