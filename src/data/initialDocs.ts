import { DocItem } from '../types';

export const INITIAL_DOCS: DocItem[] = [
  {
    id: 'doc-guia-001',
    category: 'normativa',
    code: 'GUÍA N°. 001-2025-OGPL-R/UNMSM',
    title: 'Guía Práctica de Implementación de la Gestión por Procesos en Facultades – FASE N° 1',
    description:
      'Documento oficial rector de 64 páginas emitido por la Oficina General de Planificación (OGPL) y la Oficina de Racionalización de la UNMSM. Contiene el marco conceptual, modelo SIPOC, clasificación jerárquica y funcional, notación BPMN 2.0, procedimiento de aprobación en 4 pasos y los 7 anexos oficiales con enlaces en la nube.',
    content: `# GUÍA N°. 001-2025-OGPL-R/UNMSM
Guía Práctica de Implementación de la Gestión por Procesos en Facultades – FASE N° 1

Universidad Nacional Mayor de San Marcos (Decana de América)
Oficina General de Planificación (OGPL) · Oficina de Racionalización (OR)
64 Páginas Oficiales

## Estructura Integral de la Guía
- **Aspectos Generales:** Objetivo, Alcance y Base Normativa (Ley 27658, Ley 30220, DS 030-2002-PCM, DS 123-2018-PCM, DS 103-2022-PCM, NT 002-2025-PCM/SGP, RR 009248-2025-R/UNMSM PEI 2026-2030).
- **Marco Conceptual:** Fundamentos, Procesos, Modelo SIPOC, Criterio Jerárquico (Nivel 0 al Nivel 2), Criterio Funcional (PE, PM, PS), Procedimientos (MAPRO), Beneficios y los 7 Pilares de Gobernanza APQC.
- **Roles en Facultades:** Máxima Autoridad Administrativa (Decano), Unidad encargada (UPPR con soporte OCAA) y Responsable del Proceso.
- **Marco Metodológico (Fase 1: Planear):** 1. Identificación de Productos (atributos de calidad y ente rector, 5 criterios de validación), 2. Determinación de Procesos (criterio por proceso vs producto, fórmulas de redacción), 3. Diseño en Notación BPMN 2.0 (piscinas, carriles, eventos, compuertas), 4. Documentación Normada (Mapa, Inventario, Fichas Técnicas, Indicadores, Procedimientos) y Aprobación en 4 Pasos (Consolidación, Opinión Técnica OGPL, Aprobación Consejo de Facultad, Ratificación DGA).
- **Los 7 Anexos Oficiales en Google Docs / Sheets:** Listado de productos, inventario, ficha técnica, ficha de indicador, formato de procedimiento, plantilla de identificación y matriz de dueños de procesos.`,
    type: 'Documento Rector Institucional (64 Páginas)',
    size: '14.2 MB',
    date: '04/03/2026',
    author: 'OGPL · Oficina de Racionalización UNMSM',
    status: 'Vigente',
    isPublic: true,
    publicUrl: 'https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/docs/01-plan-de-gestion-v2.html#guia-001',
    version: '1.0 Oficial',
    tags: ['Guía Rectoral', '64 Páginas', 'FASE 1', 'BPMN 2.0', 'SIPOC', '7 Anexos', 'Público'],
  },
  {
    id: 'doc-plan-gestion',
    category: 'gestion',
    code: 'PGP-UNMSM-2026-v2.0',
    title: 'Plan de Gestión del Proyecto · Versión 2.0 (Oficial)',
    description: 'Implementación de la Gestión por Procesos en las 20 Facultades de la UNMSM. Incorpora las correcciones de los nueve hallazgos del diagnóstico y suma las áreas del PMBOK.',
    content: `# Plan de Gestión del Proyecto · Versión 2.0
D1 · Versión 2.0 · Reemplaza al Plan de Gestión del Alcance v1.0

## Ficha Técnica del Proyecto
- **Proyecto:** Implementación de la Gestión por Procesos
- **Área responsable:** OGPL · Oficina de Racionalización
- **Alcance temporal:** Fases 1 a 3
- **Inicio:** 01/06/2025 | **Cierre de Fase 1:** 30/09/2026 | **Cierre del proyecto:** 30/06/2027
- **Versión:** 2.0 · 26/08/2026 | **Avance de Fase 1:** 63%

---

## 1. Propósito del plan
Este plan establece las directrices para definir, desarrollar, supervisar, controlar y validar el alcance global del proyecto y el de cada Manual de Gestión por Procesos de Facultad (MAGPROF), tomando como línea base la Norma Técnica N.º 002-2025-PCM-SGP. Incluye además la diagramación de los procedimientos que integran cada proceso del Mapa de Procesos Estándar.

A diferencia de la versión 1.0, que cubría únicamente el área de Alcance, esta versión incorpora cronograma, calidad, recursos, comunicaciones, riesgos e interesados, y establece una fuente única para cada dato del proyecto.

---

## 2. Decisiones adoptadas en esta versión (8 Decisiones Clave)
1. **Decisión 1 (D1-01) · Documentación de procesos:** Está dentro del alcance la documentación de Anexos 1 y 3 por Facultad. Queda derogada la redacción contradictoria previa.
2. **Decisión 2 (D1-02) · Alcance del término «automatización»:** Se automatiza la carga y validación de datos en SIGPRO; los procesos de negocio de facultades son manuales/estandarizados.
3. **Decisión 3 (D1-03) · Ubicación de SIGPRO en las fases:** Fase 1 exige solo SIGPRO en modo consulta al 30/09/2026 (hito H1.3.4.02). El despliegue completo pasa a Fase 2.
4. **Decisión 4 (D2-04) · Fecha única de cierre de Fase 1:** 30 de setiembre de 2026 como fecha rectora.
5. **Decisión 5 (D2-01) · Fuente única del avance de fase:** Se mide exclusivamente con la revisión interna (D4): (Completos + 0.5 × Observados) / Total de productos.
6. **Decisión 6 (D4-07 y R-08) · Catálogo maestro de procesos:** Rige un único catálogo de 16 procesos de Nivel 0.
7. **Decisión 7 (D4-05 y D4-06) · Derogación del Anexo 2:** El Anexo 2 no se llena; su contenido pasó al Anexo 1.
8. **Decisión 8 (D1-06) · Un solo aprobador por entregable:** El Decano aprueba MAGPROF y MAPRO de su Facultad.

---

## 3. Enunciado del alcance
El proyecto comprende el diseño, implementación y evaluación (Fases 1 a 3) en las 20 Facultades de la UNMSM. Cierre Fase 1: 30/09/2026; Fase 2: 30/04/2027; Fase 3: 30/06/2027.

---

## 4. Estructura de desglose del trabajo (EDT / WBS)
Cuatro niveles alineados al cronograma: Fase > Etapa > Actividad > Tarea (F1 Identificación, F2 Implementación, F3 Evaluación).

---

## 5. Matriz de trazabilidad de requisitos
RQ-01 a RQ-09 vinculados estrictamente con cada tarea del cronograma y estado de cumplimiento.

---

## 6. Criterios de aceptación
Criterios formales de aceptación y revisión técnica por la Oficina de Racionalización y aprobación de Decanatos, Jefatura OGPL y Rectorado.

---

## 7. Roles y responsabilidades (Matriz RACI)
Un solo aprobador final 'A' por cada actividad clave.

---

## 8. Control de cambios del alcance
Procedimiento estándar de 6 pasos para evaluar y aprobar solicitudes de cambio formalmente.

---

## 9. Gestión del cronograma
Centralización de la planificación y control de tiempos bajo avance escalonado obligatorio. Parámetros de codificación jerárquica, atributos de actividad, lógica de red y ruta crítica, monitoreo de estado y gestión de hitos (0 días). Enlace directo al documento maestro del cronograma institucional.

---

## 10. Gestión de la calidad
Fórmula oficial de avance: (Completos + 0.5 × Observados) / Total productos.

---

## 11. Gestión de riesgos
9 riesgos identificados (R-01 a R-09), incluyendo mitigación y seguimiento en Bitácora.

---

## 12. Interesados y comunicaciones
Matriz institucional y regla de silencio administrativo (5 días hábiles).

---

## 13. Documentos que integran este plan
Integración con Cronograma v2.0, Bitácora v2.0, Catálogo Maestro de Procesos y Diccionario de Estados.`,
    type: 'Documento Oficial (.html / .pdf)',
    size: '3.8 MB',
    date: '26/08/2026',
    author: 'OGPL · Oficina de Racionalización UNMSM',
    status: 'Vigente',
    isPublic: true,
    publicUrl: 'https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/docs/01-plan-de-gestion-v2.html',
    version: '2.0',
    tags: ['Oficial', 'Directriz v2.0', 'OGP', '20 Facultades', 'Público'],
  },
  {
    id: 'doc-plan-cronograma',
    category: 'cronograma',
    code: 'D2 · Cronograma v2.0',
    title: 'Plan de Gestión del Cronograma · Versión 2.0 (36 Tareas · Alineado 1:1 con Excel)',
    description:
      'Estructura completa con códigos únicos, responsables, dependencias, hito de cierre y ruta crítica. Alineado estrictamente 1:1 con las 36 tareas del Excel CSV del proyecto.',
    content: `# Plan de Gestión del Cronograma · Versión 2.0

**Documento D2 · Reemplaza al cronograma del 24 de julio de 2026**
Estructura completa con códigos únicos, responsables, dependencias, hito de cierre y ruta crítica. Los 11 hallazgos del diagnóstico están resueltos y anotados fila por fila.

## Métricas Clave del Cronograma v2.0
- **36** Tareas en cronograma (Alineación 1:1 con Excel CSV)
- **1** Hito clave de cierre (H1.3.5.03 Cierre Fase 1 · 30/09/2026)
- **15** Elementos en la ruta crítica
- **4** Tareas nuevas incorporadas (T1.3.2.06, T1.3.3.02, T1.3.3.03, T1.3.3.04)
- **0** Códigos duplicados (100% validados sin colisión)

## Ruta Crítica de la Fase 1 (Identificación)
Cinco elementos encadenados sin holgura. Cualquier día de atraso en uno de ellos mueve el cierre del 30 de setiembre:
1. **T1.3.3.01:** Llenado de Anexos 1 y 3 por facultad
2. **T1.3.3.02:** Levantamiento de las observaciones de los 1 901 productos
3. **T1.3.5.01:** Revisión y validación de los MAGPROF de las 20 facultades
4. **T1.3.5.02:** Aprobación de los MAGPROF por los Decanos
5. **H1.3.5.03:** Cierre de la Fase 1 — Identificación (30/09/2026)

## Advertencia de Plazo Oficial
Al 26 de agosto quedan 25 días hábiles hasta el cierre y la ruta crítica consume 24. La holgura total del proyecto es de un día. El levantamiento de las 1 901 observaciones debe arrancar inmediatamente; si se retrasa, el 30 de setiembre deja de ser alcanzable y corresponde tramitar una solicitud de cambio del alcance temporal.`,
    type: 'Cronograma Oficial (.html / .csv)',
    size: '2.8 MB',
    date: '26/08/2026',
    author: 'OGPL · Oficina de Racionalización UNMSM',
    status: 'Vigente',
    isPublic: true,
    publicUrl: 'https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/docs/02-cronograma-v2.html',
    version: '2.0',
    tags: ['Cronograma v2.0', 'Ruta Crítica', '36 Tareas', 'Excel CSV 1:1', 'EDT', 'Público'],
  },
  {
    id: 'doc-bitacora',
    category: 'bitacora',
    code: 'D3 · Bitácora v2.0',
    title: 'Bitácora de ejecución · Versión 2.0 (111 Subtareas, 9 Riesgos, 6 Incidencias)',
    description:
      'Registro reconstruido sobre la EDT: cada subtarea cuelga de una tarea real del cronograma, con código único, estado del diccionario común y fecha en formato dd/mm/aaaa. Reemplaza a la bitácora de plantilla Vertex42.',
    content: `# Bitácora de ejecución · Versión 2.0

**Documento D3 · Reemplaza a la bitácora de plantilla Vertex42**
Registro reconstruido sobre la EDT: cada subtarea cuelga de una tarea real del cronograma, con código único, estado del diccionario común y fecha en formato dd/mm/aaaa.

## Estadísticas Clave
- **111** Subtareas registradas
- **99** Conformes (89,2%)
- **6** En proceso (5,4%)
- **5** Observadas (4,5%)
- **1** No iniciada (0,9%)

## Estructura del código de subtarea
Ejemplo: \`S1.3.2.02.14\`
- **S:** Subtarea de bitácora
- **1.3.2.02:** Tarea padre en el cronograma (sin el prefijo T)
- **14:** Correlativo de dos dígitos dentro de esa tarea, sin reutilizar

## Registros Integrados
1. **Registro de ejecución:** 111 subtareas agrupadas por tarea padre (T1.3.2.01, T1.3.2.02, T1.3.2.04, T1.3.3.01, T1.3.4.01).
2. **Registro de riesgos:** 9 riesgos identificados en ejecución (R-01 a R-09) con responsable y plan de respuesta.
3. **Registro de incidencias:** 6 eventos y paralizaciones cuantificados en días hábiles.
4. **Qué cambió de v1:** 10 decisiones D3-01 a D3-10 que eliminan errores de fórmulas y plantillas obsoletas.`,
    type: 'Bitácora Oficial (.html / .csv)',
    size: '2.4 MB',
    date: '26/08/2026',
    author: 'OGPL · Oficina de Racionalización UNMSM',
    status: 'Vigente',
    isPublic: true,
    publicUrl: 'https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/docs/03-bitacora-v2.html',
    version: '2.0',
    tags: ['Bitácora v2.0', '111 Subtareas', 'EDT', 'Riesgos', 'Incidencias', 'Público'],
  },
  {
    id: 'doc-anexo-1',
    category: 'formatos',
    code: 'FM-ANEXO-01-v3.2',
    title: 'Facultad de Medicina - Anexo 1: Inventario de Productos y Procesos',
    description:
      'Matriz oficial de la Facultad de Medicina con el inventario estandarizado de productos y procesos (PE y PM) para SIGPRO y Google Sheets.',
    content: `# Facultad de Medicina (FM) - Anexo 1: Inventario de Productos y Procesos
Enlace Oficial en Google Sheets: https://docs.google.com/spreadsheets/d/1IdbcV-JwsslkBdM2xmDqpEFNbGGePwOmS7UgjFEEU_Q/edit?usp=sharing

## Directrices Técnicas de Llenado SIGPRO
Los anexos oficiales conectados al sistema SIGPRO son el Anexo 1-A1 (Inventario de Productos y Procesos) y el Anexo 3 (A3 - Ficha Técnica de Producto y Proceso). La información que contenía el Anexo 2 ahora se consolida directamente en el Anexo 1.

## Reglas Obligatorias
- Regla 1.1: Cada proceso y subproceso cuenta con su código y nombre completo estandarizado (PE.01, PM.01, etc.).
- Regla 2.1: Asignación a los 16 procesos de Nivel 0 obligatorios de la UNMSM.
- Regla 3.1: En columna C Acción Estratégica (AE...) y en columna D Actividad Operativa.
- Regla 4.1: Clasificación exclusiva en Regulación, Servicio o Bien.
- Regla 5.1: Atributo exclusivo: Ente rector o Calidad.
- Regla 6.1: Variables de calidad: Tiempo de atención, Cumplimiento de plazos, Claridad, Trato recibido, Facilidad de acceso.`,
    type: 'Hoja de Cálculo Google Sheets / Excel (.xlsx)',
    size: '1.8 MB (En Línea)',
    date: '04/09/2026',
    author: 'Facultad de Medicina / OGP UNMSM',
    status: 'Oficial',
    isPublic: true,
    publicUrl: 'https://docs.google.com/spreadsheets/d/1IdbcV-JwsslkBdM2xmDqpEFNbGGePwOmS7UgjFEEU_Q/edit?usp=sharing',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1IdbcV-JwsslkBdM2xmDqpEFNbGGePwOmS7UgjFEEU_Q/edit?usp=sharing',
    version: '3.2',
    tags: ['Medicina (FM)', 'Anexo 1', 'Google Sheets', 'SIGPRO', 'Oficial'],
  },
  {
    id: 'doc-anexo-3',
    category: 'formatos',
    code: 'FM-ANEXO-03-v1.0',
    title: 'Facultad de Medicina - Anexo 3: Fichas Técnicas de Producto y Proceso',
    description: 'Fichas técnicas oficiales de caracterización de producto y proceso de la Facultad de Medicina (16 procesos PE, PM, PS) con SIPOC, recursos, registros, indicadores y directrices SIGPRO.',
    content: `# FACULTAD DE MEDICINA - ANEXO 3: FICHAS TÉCNICAS DE PRODUCTO Y PROCESO

## DIRECTRICES Y REGLAS OBLIGATORIAS DE LLENADO
1. **Regla Obligatoria (Fuente Tipográfica):** Toda información colocada debe ir con la fuente "Calibri".
2. **Regla Obligatoria (Proveedores Columna B):** Cada proveedor deberá consignarse utilizando su codificación correspondiente: PR.XX_FYY (ej. PR.01_F01 OFICINA DE PLANES Y PROGRAMAS - OGPL). Conservar la misma codificación al repetirse.
3. **Regla Obligatoria (Entradas Columna D):** Normativas, directivas, guías siguiendo la codificación EN.XX_FYY (ej. EN.01_F01 GUÍA PARA EL PLANEAMIENTO INSTITUCIONAL - CEPLAN).
4. **Regla Obligatoria (Procesos Columna F):** Procesos de Nivel 1 con su codificación y denominación en celdas independientes sin combinar (ej. PE.01.01_F01 GESTIÓN DE PLANES).
5. **Regla Obligatoria (Salidas Columna H):** Únicamente los productos finales generados como resultado de cada proceso, correspondientes a los del Anexo 1.
6. **Regla Obligatoria (Beneficiarios Columna J):** Destinatarios con su codificación BE.XX_FYY (ej. BE.01_F01 AUTORIDADES, BE.02_F01 DOCENTES).
7. **Regla Obligatoria (Registros):** Únicamente productos parciales identificados en el Anexo 1.

## INVENTARIO DE LOS 16 PROCESOS CARACTERIZADOS
- **PE.01_F01:** Gestión Estratégica (Jefe UPPR)
- **PE.02_F01:** Gestión de la Calidad y Mejora Continua (Jefe OCAA)
- **PE.03_F01:** Gestión de Relaciones Interinstitucionales (Decano)
- **PM.01_F01:** Gestión de la Formación Académica (Vicedecano Académico)
- **PM.02_F01:** Gestión de la Investigación (Vicedecanato de Investigación y Posgrado)
- **PM.03_01:** Gestión de la Responsabilidad y Vinculación Social (CERSEU)
- **PS.01:** Gestión de Admisión y Matrícula (Unidad de Matrícula)
- **PS.02_F01:** Gestión Documental (Trámite Documentario y Archivo)
- **PS.03_F01:** Gestión de Bienestar Integral (Unidad de Bienestar)
- **PS.04_F01:** Gestión de Recursos Económicos (Unidad de Economía)
- **PS.05_F01:** Gestión de Recursos Humanos (Unidad de Personal)
- **PS.06_F01:** Gestión de Abastecimiento y Servicios (Servicios Generales)
- **PS.07_F01:** Gestión de Tecnología de la Información (Estadística e Informática)
- **PS.08_F01:** Gestión de Actividades Productivas (Centro de Producción)
- **PS.09_F01:** Gestión de Recursos Bibliográficos (Biblioteca y Hemeroteca)
- **PS.10_F01:** Gestión de la Comunicación (Asesor de Decanato)`,
    type: 'Hoja de Cálculo / Ficha Oficial',
    size: '1.4 MB',
    date: '04/09/2026',
    author: 'Facultad de Medicina (FM) - UNMSM / OGPL',
    status: 'Oficial',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1IdbcV-JwsslkBdM2xmDqpEFNbGGePwOmS7UgjFEEU_Q/edit?usp=sharing',
    version: '1.0',
    tags: ['Medicina (FM)', 'Anexo 3', 'Fichas Técnicas', 'SIPOC', 'SIGPRO', 'Oficial'],
  },
  {
    id: 'doc-indicadores',
    category: 'formatos',
    code: 'UNMSM-REP-IND-2026',
    title: 'Reporte de Avance de Indicadores · Libro Oficial de 35 Hojas',
    description:
      'Reporte integral de avance de los 34 indicadores por proceso (PE, PM, PS) con hoja de resumen consolidada, ponderaciones (7 aprobados al 100%, 27 propuestos al 25%, promedio 40%) y fichas técnicas por cada una de las 34 hojas.',
    content: `# Reporte de Avance de Indicadores - UNMSM
Libro Oficial de Hojas de Cálculo (35 Hojas Integradas)

## Resumen Ejecutivo Consolidado
- Total de Hojas: 35 (1 Hoja de Resumen + 34 Hojas de Indicadores)
- Indicadores Aprobados: 7 (100% de cumplimiento formal)
- Indicadores Propuestos: 27 (25% en formulación)
- Promedio Total Ponderado: 40%

## Estructura por Macroprocesos
- Procesos Estratégicos (PE): PE.01 a PE.03
- Procesos Misionales (PM): PM.01 a PM.03
- Procesos de Soporte (PS): PS.01 a PS.10

Navega a través de las pestañas superiores para revisar cada una de las 35 hojas en detalle.`,
    type: 'Libro de Hojas de Cálculo (35 Hojas)',
    size: '3.2 MB (En Línea)',
    date: '06/09/2026',
    author: 'OGPL · Oficina de Racionalización UNMSM',
    status: 'Oficial',
    isPublic: true,
    publicUrl: 'https://docs.google.com/spreadsheets/d/1O_tiR3qxKpZd6Q9vFC_Mq0gZh_by3qhqTOgKGHLprs/edit?usp=sharing',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1O_tiR3qxKpZd6Q9vFC_Mq0gZh_by3qhqTOgKGHLprs/edit?usp=sharing',
    version: '1.0 Oficial',
    tags: ['Indicadores', '35 Hojas', 'Reporte de Avance', 'PE/PM/PS', 'Google Sheets', 'Oficial'],
  },
  {
    id: 'doc-anexo-4',
    category: 'formatos',
    code: 'OGP-ANEXO-04-v2.1',
    title: 'Anexo 4: Fichas de Indicadores y Reporte de Avance (35 Hojas)',
    description: 'Catálogo de métricas, fórmulas matemáticas, frecuencias de cálculo, fuentes de datos, semáforos institucionales y avance de 34 indicadores.',
    content: `# Instructivo Técnico: Anexo 4 (Indicadores de Gestión y Reporte de Avance)
Enlace Oficial: https://docs.google.com/spreadsheets/d/1O_tiR3qxKpZd6Q9vFC_Mq0gZh_by3qhqTOgKGHLprs/edit?usp=sharing

## Monitoreo Consolidado de 35 Hojas
1. Hoja de Resumen de Avance: 7 Aprobados (100%), 27 Propuestos (25%), Promedio 40%.
2. 34 Hojas de Fichas Técnicas individuales por cada indicador de proceso PE, PM y PS.

## Requisitos de Formulación en cada Hoja
Cada indicador posee:
1. **Nombre del Indicador:** Claro y unívoco.
2. **Fórmula Matemática:** Expresión cuantitativa con variables definidas.
3. **Sentido del Indicador:** Creciente o decreciente.
4. **Periodicidad:** Mensual, Semestral o Anual.
5. **Línea Base:** Último valor histórico registrado.
6. **Meta 2026:** Valor objetivo institucional acordado.
7. **Fuente de Datos:** Sistema oficial (SIAF-SP, RO, SUM, SGD, MAT, CONEAU).`,
    type: 'Libro de Hojas de Cálculo (.xlsx / Sheets)',
    size: '3.2 MB',
    date: '06/09/2026',
    author: 'OGPL · Oficina de Racionalización UNMSM',
    status: 'Oficial',
    isPublic: true,
    publicUrl: 'https://docs.google.com/spreadsheets/d/1O_tiR3qxKpZd6Q9vFC_Mq0gZh_by3qhqTOgKGHLprs/edit?usp=sharing',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1O_tiR3qxKpZd6Q9vFC_Mq0gZh_by3qhqTOgKGHLprs/edit?usp=sharing',
    version: '2.1 Oficial',
    tags: ['Anexo 4', 'Indicadores', '35 Hojas', 'Métricas', 'Google Sheets'],
  },
  {
    id: 'doc-guia-metodologica',
    category: 'normativa',
    code: 'GUIA-PCM-UNMSM-2026',
    title: 'Guía Metodológica para la Gestión por Procesos en Facultades',
    description: 'Manual de 120 páginas con casos prácticos, lineamientos de la PCM y recomendaciones para la simplificación administrativa.',
    content: `# Guía Metodológica de Gestión por Procesos

## Marco Conceptual
La Gestión por Procesos es una forma de conducir la organización poniendo el foco en los resultados que generan valor para la ciudadanía y la comunidad sanmarquina.

## Pasos para la Implementación en Facultades:
1. Conformar el Comité de Procesos de la Facultad presidido por el Vicedecanato Académico.
2. Revisar el Mapa de Procesos Institucional de la UNMSM.
3. Completar el Inventario (Anexo 1) identificando todos los servicios a estudiantes y docentes.
4. Caracterizar los procesos críticos mediante el Anexo 3.
5. Definir los indicadores de medición a través del Anexo 4.
6. Presentar la carpeta final ante la Oficina General de Planificación.`,
    type: 'Manual Técnico (.pdf)',
    size: '5.2 MB',
    date: '15/08/2026',
    author: 'Equipo Metodológico OGP - UNMSM',
    status: 'Oficial',
    tags: ['Guía', 'Metodología', 'Manual', 'Capacitación'],
  },
  {
    id: 'doc-dashboard',
    category: 'dashboard',
    code: 'DASHBOARD-GXP-UNMSM',
    title: 'Dashboard de avance · Monitoreo en Tiempo Real (20 Facultades)',
    description:
      'Panel de control interactivo oficial de la Gestión por Procesos de la UNMSM (Fase 1). Monitoreo de avances del Anexo 1, Anexo 3, Anexo 4, semaforización y auditoría en tiempo real.',
    content: `# Dashboard de avance · Gestión por Procesos UNMSM
Acceso en vivo al Panel de Control Oficial de la Oficina de Racionalización OGPL UNMSM.
URL Oficial: https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/Dashboard.html

El mismo tablero que se publica en la portada. Se actualiza con cada corrida de la auditoría de los anexos.`,
    type: 'Tablero Interactivo Web',
    size: 'En Línea',
    date: 'En vivo',
    author: 'Oficina de Racionalización · OGPL UNMSM',
    status: 'Oficial',
    isPublic: true,
    publicUrl: 'https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/Dashboard.html',
    version: 'En Vivo',
    tags: ['Dashboard', 'Monitoreo', '20 Facultades', 'Anexos', 'En Vivo', 'Oficial'],
  },
];
