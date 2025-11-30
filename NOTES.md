# Notas de Desarrollo - SaBio Backend

## Zonas y Lotes: Variabilidad según el Cultivo

**Contexto**: Las rutas en [src/routes/finca.routes.js](src/routes/finca.routes.js) utilizan una estructura de Finca → Zonas → Lotes, pero esta división puede variar dependiendo del tipo de cultivo.

### Consideraciones Importantes:

- **Uso General**: Normalmente usamos "Zonas" para delimitar áreas productivas dentro de una finca
- **Problema Actual**: Los nombres y divisiones pueden variar según el tipo de cultivo o actividad productiva (Parcela, Lote, Cama, Sub-division,etc...)
- **Pendiente**: Necesitamos encontrar una forma de estandarizar estas divisiones para que sean consistentes en todo el sistema

### Caso Especial: Ganadería Lechera (Leche)

En el manejo de ganado lechero, la terminología y estructura es diferente:

- **Potreros**: Son equivalentes a las "Zonas" en otros cultivos. Representan áreas delimitadas dentro de la finca
- **Franjas**: Son subdivisiones de tamaño variable que se encuentran DENTRO de los potreros (equivalente a los "Lotes")
- Los potreros tienen un manejo rotacional específico del ganado

**Acción Requerida**: Evaluar si necesitamos un sistema flexible que permita renombrar o adaptar la jerarquía según el tipo de producción, o mantener la estructura actual (Zona/Lote) como genérica.

---

## Relación Finca-Empresa

**Importante**: La relación entre Finca y Empresa es de **muchos a uno** (many-to-one):
- **Muchas Fincas** pueden pertenecer a **una Empresa**
- **NO es** una relación de una Finca a muchas Empresas

Esto está correctamente implementado en el modelo con el campo `empresa_owner` en [src/models/finca.model.js](src/models/finca.model.js).

---

## Seguimiento de Pilas de Compost

**Estado**: ✅ Ya implementado correctamente

El modelo [src/models/pilaCompost.model.js](src/models/pilaCompost.model.js) ya incluye los campos necesarios para el seguimiento:

### Monitoreo de Humedad y Temperatura:
El esquema embebido `seguimientoSchema` incluye:
- `temp_prom`: Temperatura promedio
- `hum_prom`: Humedad promedio
- `volteo`: Indica si se realizó volteo
- `observaciones`: Notas adicionales
- `imagen`: URL de imagen del seguimiento

Cada pila puede tener múltiples registros de seguimiento en el array `seguimiento[]`.

### Variaciones de la Plantilla:
El campo `variaciones_plantilla` en el esquema principal permite documentar si el usuario:
- Usó los mismos ingredientes y proporciones de la plantilla
- Hizo modificaciones a las cantidades o ingredientes
- Agregó o eliminó componentes

**Conclusión**: El modelo actual ya soporta todo el seguimiento necesario para las pilas de compost.

---

## Pendientes y Decisiones de Arquitectura

1. [ ] Definir estrategia para manejar la variabilidad de divisiones productivas (Zonas/Lotes vs Potreros/Franjas)
2. [ ] Considerar si necesitamos un campo de "tipo_produccion" en Finca para adaptar la UI
3. [ ] Documentar mejores prácticas para el uso de `variaciones_plantilla` en pilas de compost
