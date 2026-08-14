# Arquitectura

## Principios
1. Separación entre interfaz, dominio, persistencia e integraciones externas.
2. Proveedores de IA intercambiables mediante una interfaz común.
3. Reglas de seguridad aplicadas antes de generar recomendaciones.
4. Ningún secreto o dato real en el repositorio.
5. Las estimaciones provenientes de fotografías se presentan como estimaciones.

## Capas

### Presentación
Pantallas móviles para onboarding, perfil, cámara/foto, resultado, corrección, comidas, actividad y evolución.

### Dominio
Entidades y casos de uso independientes de frameworks:
- Perfil de usuario.
- Análisis de alimento.
- Estimación de porción y nutrientes.
- Registro de comida.
- Actividad física.
- Resumen y evolución.
- Personalización.
- Seguridad.

### Servicios
- `VisionProvider`: recibe una imagen y devuelve candidatos de alimentos y atributos estimados.
- `NutritionProvider`: obtiene datos nutricionales de alimentos/porciones.
- `PersonalizationEngine`: aplica objetivo, actividad y condiciones declaradas.
- `SafetyEngine`: verifica restricciones y genera advertencias.

### Persistencia
Repositorio local/remoto desacoplado mediante interfaces. El modelo inicial está definido en `docs/DATABASE.md`.

## Flujo principal
1. Usuario completa el perfil.
2. Usuario toma/carga una foto.
3. `VisionProvider` analiza la imagen.
4. Se propone alimento y porción estimada.
5. Usuario puede corregir alimento o porción.
6. `NutritionProvider` calcula valores nutricionales estimados.
7. `SafetyEngine` revisa advertencias.
8. Se registra la comida.
9. El resumen diario y el historial se actualizan.
