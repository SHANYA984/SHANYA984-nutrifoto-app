# Nutrifoto App

MVP de una app móvil de nutrición personalizada para adultos.

## Objetivo
Permitir que una persona registre su perfil, tome o cargue una foto de un alimento, obtenga una identificación y estimación nutricional orientativa, corrija los datos manualmente y lleve un registro diario de comidas, actividad y evolución.

## Alcance del MVP
- Perfil: edad, peso, altura, objetivo y nivel de actividad.
- Condiciones declaradas por el usuario para personalizar precauciones y recomendaciones.
- Captura mediante cámara o carga de fotografía.
- Análisis de imagen mediante un proveedor de visión IA intercambiable.
- Identificación estimada de alimentos y porciones.
- Estimación de calorías y nutrientes.
- Corrección manual por parte del usuario.
- Registro de comidas diarias.
- Registro de actividad física.
- Resumen diario y evolución/historial.

## Seguridad
La app no diagnostica enfermedades, no modifica medicamentos y no reemplaza la atención de profesionales de la salud. Las imágenes producen estimaciones y no mediciones exactas. Las recomendaciones deben aplicar reglas de seguridad y derivar a un profesional cuando corresponda.

## Privacidad
El repositorio no contiene claves API, credenciales ni datos personales o médicos reales. Los proveedores de IA deben poder reemplazarse sin acoplar la aplicación a un único servicio.

## Documentación
- `docs/ARCHITECTURE.md` — arquitectura y separación de responsabilidades.
- `docs/MVP_SPEC.md` — especificación funcional del MVP.
- `docs/SECURITY_RULES.md` — reglas de seguridad y límites.
- `docs/PERSONALIZATION_ENGINE.md` — motor de personalización.
- `docs/DATABASE.md` — modelo de datos inicial.
