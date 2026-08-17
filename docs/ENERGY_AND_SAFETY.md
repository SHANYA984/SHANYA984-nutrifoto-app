# Energía y reglas de seguridad

## Propósito

NutriFoto puede mostrar una **referencia energética orientativa para adultos** cuando dispone de datos suficientes. La referencia no constituye diagnóstico, prescripción ni indicación médica.

## Reglas

1. La aplicación es exclusivamente para personas de 18 años o más.
2. No se genera automáticamente un objetivo de descenso de peso cuando el perfil declara una condición de salud.
3. La estimación de mantenimiento puede utilizar una ecuación validada y un factor de actividad, pero siempre se presenta como estimación.
4. El análisis fotográfico debe indicar que las calorías y porciones son aproximadas.
5. El usuario puede corregir alimentos, porciones y valores antes de guardar una comida.
6. La app no diagnostica enfermedades.
7. La app no recomienda iniciar, suspender ni modificar medicamentos.
8. La app debe derivar a revisión profesional cuando el perfil o la situación declarada requiera precaución.
9. No se deben almacenar datos médicos reales en el repositorio de código.
10. Las claves de proveedores de IA deben permanecer en variables de entorno del servidor.

## Arquitectura de energía

`perfil adulto -> validación -> referencia energética -> reglas de seguridad -> presentación orientativa`

Cuando hay condiciones declaradas, el sistema conserva la referencia de mantenimiento disponible y bloquea la generación automática de un déficit.

## Estado actual

- Captura y registro de comidas: implementado.
- Corrección manual: implementada.
- Modo demo de visión: implementado para pruebas sin coste de API.
- Proxy seguro para proveedor de visión: implementado.
- Referencia energética adulta: implementada como servicio separado.
- Integración con proveedor real de visión: pendiente de configurar mediante una credencial segura en Vercel.
- Cuentas sincronizadas entre dispositivos: pendiente.
