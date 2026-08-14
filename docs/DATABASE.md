# Modelo de datos inicial

## UserProfile
- `id`
- `age`
- `weight`
- `height`
- `goal`
- `activity_level`
- `declared_conditions[]`
- `created_at`
- `updated_at`

## FoodAnalysis
- `id`
- `user_id`
- `image_reference`
- `identified_items[]`
- `estimated_portion`
- `estimated_calories`
- `estimated_nutrients`
- `confidence`
- `warnings[]`
- `created_at`

## Meal
- `id`
- `user_id`
- `date_time`
- `meal_type`
- `items[]`
- `notes`
- `created_at`

## ActivityEntry
- `id`
- `user_id`
- `activity_type`
- `duration_minutes`
- `intensity`
- `date_time`

## DailySummary
- `id`
- `user_id`
- `date`
- `meal_count`
- `estimated_calories`
- `estimated_nutrients`
- `activity_minutes`

## EvolutionEntry
- `id`
- `user_id`
- `date`
- `weight`
- `notes`

## Reglas de almacenamiento
- No almacenar imágenes ni datos sensibles más tiempo del necesario.
- Las referencias a imágenes deben poder eliminarse sin romper el historial nutricional corregido.
- Los campos derivados de IA deben conservar su carácter de estimación.
- Usar identificadores internos; no incluir datos reales en el repositorio.
