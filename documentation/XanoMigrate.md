# Plan de Migración de Datos (Paso 38)

## 1. Objetivo

Este documento define la estrategia y el mapeo de datos para migrar la base de datos existente de Xano (PostgreSQL, ~64 tablas) a nuestra nueva arquitectura optimizada en MongoDB.

## 2. Estrategia General

La migración se ejecutará a través de un **script de Node.js** (`/scripts/migrate.js`) que se conectará a ambas bases de datos (leyendo de Xano vía API y escribiendo en MongoDB vía Mongoose).

El script ejecutará la migración en un orden lógico para preservar las relaciones (`_id`), primero migrando los "padres" (como Usuarios y Empresas) y luego los "hijos" (Fincas, Pilas, etc.), guardando las nuevas IDs de MongoDB para vincularlas.

## 3. Mapeo de Tablas (Xano $\rightarrow$ MongoDB)

A continuación se detalla el plan de transformación de la data:

### Fase 1: Usuarios y Compañías

| Tabla Xano (Origen) | Colección MongoDB (Destino) | Notas de Transformación |
| :--- | :--- | :--- |
| `staff` | `users` | Mapeo de `role` a nuevos roles (ej. `sabio_admin`, `sabio_tecnico`). Las contraseñas se re-hashearán. |
| `user` | `users` | Mapeo a `role: 'cliente_owner'`. Se vinculará a su `empresa` en el siguiente paso. |
| `empresas` | `empresas` | Mapeo 1:1. El script guardará una tabla de consulta (ej. `Map<xanoEmpresaId, mongoEmpresaId>`). |
| `contacto_contabilidad` | `empresas` | **EMBEBIDO**. Los datos se moverán al objeto `contacto_contabilidad` dentro de la `empresa` correspondiente. |
| `corporativos` (Nuevo) | `corporativos` | (Sin migración, es un modelo nuevo). |
| `leads` (Nuevo) | `leads` | (Sin migración, es un modelo nuevo). |

### Fase 2: Jerarquía de Fincas

| Tabla Xano (Origen) | Colección MongoDB (Destino) | Notas de Transformación |
| :--- | :--- | :--- |
| `fincas` | `fincas` | Mapeo 1:1. Se usará la `Map` de `empresas` para vincular `empresa_owner`. Se guardará `Map<xanoFincaId, mongoFincaId>`. |
| `zonas` | `fincas` | **EMBEBIDO**. Se buscarán todas las zonas de una finca y se insertarán en el array `divisiones_primarias` de la `finca` correspondiente. |
| `lotes_zona` | `fincas` | **EMBEBIDO (Nivel 2)**. Se buscarán todos los lotes de una zona y se insertarán en `divisiones_primarias.divisiones_secundarias`. |
| `franjas` | `fincas` | **EMBEBIDO (Nivel 2)**. Se migrarán igual que `lotes_zona` (al array `divisiones_secundarias`). |

### Fase 3: Módulo de Compost

| Tabla Xano (Origen) | Colección MongoDB (Destino) | Notas de Transformación |
| :--- | :--- | :--- |
| `plantillas_compost` | `plantillacomposts` | Mapeo 1:1. |
| `pilas_compost` (antes `recetas_compost`) | `pilacomposts` | Mapeo 1:1. Se usarán las `Map` para vincular `finca` y `plantilla_usada`. Se guardará `Map<xanoPilaId, mongoPilaId>`. |
| `seguimiento_compost` | `pilacomposts` | **EMBEBIDO**. Se buscarán todos los seguimientos de una pila y se insertarán en el array `seguimiento` de la `pilacompost` correspondiente. |

### Fase 4: Módulo de Laboratorio

| Tabla Xano (Origen) | Colección MongoDB (Destino) | Notas de Transformación |
| :--- | :--- | :--- |
| `master_muestras` / `metadata_muestras` | `muestras` | Mapeo 1:1. Se unificarán y se usarán las `Map` para vincular `finca` y `pila_compost`. Se guardará `Map<xanoMuestraId, mongoMuestraId>`. |
| `conteo_bacterias` | `muestras` | **EMBEBIDO**. Los datos se moverán al objeto `conteo_bacterias` de la `muestra` correspondiente. |
| `conteo_hongo_oomycet` | `muestras` | **EMBEBIDO**. Los datos se moverán al objeto `conteo_hongos` de la `muestra` correspondiente. |
| `analisis_quimico_suelo` | `muestras` | **EMBEBIDO**. Los datos se moverán al objeto `resultados_quimicos` de la `muestra` correspondiente. |
| `analisis_fisico` | `muestras` | **EMBEBIDO**. (Requiere añadir `resultados_fisicos` al `muestra.model.js`). |
| `analisis_foliar` | `muestras` | **EMBEBIDO**. (Requiere añadir `resultados_foliares` al `muestra.model.js`). |
| `info_fovs`, `macro_scan_muestra`, etc. | `muestras` | **EMBEBIDO**. Se añadirán como nuevos objetos en el `muestra.model.js`. |

### Fase 5: Módulo de Operaciones

| Tabla Xano (Origen) | Colección MongoDB (Destino) | Notas de Transformación |
| :--- | :--- | :--- |
| `productos_fertilizantes` | `productos` | **UNIFICADO**. Se insertarán con `tipo_producto: 'Fertilizante'`. Se guardará `Map<xanoProdId, mongoProdId>`. |
| `productos_fumigacion` | `productos` | **UNIFICADO**. Se insertarán con `tipo_producto` correspondiente. Se guardará `Map<xanoProdId, mongoProdId>`. |
| Todas las tablas `aplicaciones_*` (4) | `aplicacions` | **UNIFICADO**. Se migrarán todos los registros a la colección única, usando las `Map` para vincular `producto`, `finca` y `lote`. |

## 4. Tablas Ignoradas (Post-MVP)

Las siguientes tablas de Xano **NO** se migrarán en la primera fase (MVP) para reducir la complejidad:

* `diagnosticos` (Flujo antiguo, reemplazado por `Muestra`).
* `avances_cursos` (Feature de Fase 2).
* `videollamadas` (Feature de Fase 2).
* `facturas` (Feature de Fase 2).
* `media` (Se implementará con Cloudinary/S3 o similar).
* `paquetes_muestras`, `muestras_ingreso` (Flujo logístico interno, reemplazado por la creación directa de `Muestra`).
* ...y cualquier otra tabla de soporte (`pluviosidad`, `ref_muestreos`, etc.) que será reemplazada por nuevas features (ej. API del Clima, Mapas).