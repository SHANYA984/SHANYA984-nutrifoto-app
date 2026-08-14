# Privacidad y datos

Nutrifoto debe aplicar minimización de datos desde el diseño.

## MVP actual
Los registros del usuario se almacenan localmente en el navegador mediante `localStorage`. No se envían a un servidor por defecto.

## Próxima arquitectura cloud
Cuando se incorpore backend:
- Las credenciales nunca estarán en el cliente.
- Las claves de proveedores de IA vivirán únicamente en el servidor.
- Las imágenes tendrán retención limitada y eliminación explícita.
- El usuario podrá solicitar eliminación de sus datos.
- Se separarán datos de cuenta, perfil nutricional y registros.
- Se evitará conservar fotografías si el resultado corregido es suficiente para el funcionamiento.

## Datos sensibles
Las condiciones declaradas pueden contener información de salud. No deben incluirse en logs, errores, analytics ni ejemplos públicos.

## Transparencia
Toda identificación o valor nutricional derivado de una fotografía debe mostrarse como estimación y no como medición clínica.
