// Plan de Gestión del Proyecto v2.0 - UNMSM OGPL
// Fuente oficial extraída de: https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/docs/01-plan-de-gestion-v2.html

export interface PlanDeGestionFicha {
  proyecto: string;
  areaResponsable: string;
  alcanceTemporal: string;
  inicio: string;
  cierreFase1: string;
  cierreProyecto: string;
  version: string;
  avanceFase1: string;
}

export interface PlanDecision {
  numero: number;
  etiqueta: string;
  titulo: string;
  descripcion: string;
}

export interface PlanAlcanceItem {
  dentro: string;
  fuera: string;
  destacado?: boolean;
}

export interface PlanEdtItem {
  faseId: string;
  faseNombre: string;
  fasePlazo: string;
  faseRowSpan?: number;
  etapa: string;
  actividad: string;
  paqueteTrabajo: string;
  isFirstOfPhase?: boolean;
}

export interface PlanRequisito {
  id: string;
  requisito: string;
  origen: string;
  entregable: string;
  tarea: string;
  estado: "Conforme" | "En proceso" | "No iniciado";
  destacado?: boolean;
}

export interface PlanCriterio {
  entregable: string;
  revisorTecnico: string;
  criterio: string;
  aprobador: string;
}

export interface PlanRaciRow {
  actividad: string;
  decano: string;
  respGxP: string;
  ofRacionalizacion: string;
  jefeOgpl: string;
  rectorado: string;
}

export interface PlanRaciColumnas {
  actividad: string;
  decano: string;
  respGxP: string;
  ofRacionalizacion: string;
  jefeOgpl: string;
  rectorado: string;
}

export interface PlanControlCambioColumna {
  id: string;
  nombre: string;
}

export interface PlanControlCambioDirectriz {
  titulo: string;
  descripcion: string;
}

export interface PlanControlCambio {
  paso: number | string;
  accion: string;
  responsable: string;
  [key: string]: any;
}

export interface PlanMedicionCalidad {
  indicador?: string;
  medicion?: string;
  responsable?: string;
  formula: string;
  uso: string;
  fuente?: string;
  oficial?: boolean;
}

export interface PlanRiesgo {
  id?: string;
  riesgo: string;
  categoria: string;
  probImpacto: string;
  responsable: string;
  respuesta: string;
  impacto?: "Crítico" | "Alto" | "Medio" | string;
  estado?: "Abierto" | "Materializado" | string;
}

export interface PlanInteresado {
  interesado: string;
  influencia: "Alta" | "Media" | "Baja";
  interesExpectativa: string;
  comunicacion: string;
}

export interface PlanDocIntegrado {
  documento: string;
  version: string;
  contenidoFuente: string;
  link?: string;
}

export interface PlanRedaccionAlcance {
  titulo: string;
  parrafos: string[];
}

export interface PlanDeGestionV2Data {
  ceja: string;
  titulo: string;
  subtitulo: string;
  urlOficial: string;
  ficha: PlanDeGestionFicha;
  proposito: string[];
  propositoTexto?: string;
  decisiones: PlanDecision[];
  decisionesTexto?: string;
  alcanceTexto: string;
  alcanceItems: PlanAlcanceItem[];
  redaccionAlcance?: PlanRedaccionAlcance;
  edtTexto: string;
  edtItems: PlanEdtItem[];
  requisitosTexto: string;
  requisitos: PlanRequisito[];
  requisitosNota: string;
  criterios: PlanCriterio[];
  criteriosTexto?: string;
  rolesTexto: string;
  rolesColumnas?: PlanRaciColumnas;
  rolesRaci: PlanRaciRow[];
  controlCambiosColumnas?: PlanControlCambioColumna[];
  controlCambiosTexto: string;
  controlCambios: PlanControlCambio[];
  controlCambiosDirectrices?: PlanControlCambioDirectriz[];
  cronogramaTexto: string;
  cronogramaReglas: string[];
  cronogramaAvisoRutaCritica: string;
  cronogramaBotonTexto?: string;
  cronogramaBotonSubtexto?: string;
  cronogramaUrlRedireccion?: string;
  calidadTexto: string;
  calidadMediciones: PlanMedicionCalidad[];
  calidadNota: string;
  riesgosTexto: string;
  riesgos: PlanRiesgo[];
  interesados: PlanInteresado[];
  interesadosTexto?: string;
  interesadosNotaSilencio?: string;
  documentosIntegrados: PlanDocIntegrado[];
  documentosIntegradosTexto?: string;
}

export const PLAN_DE_GESTION_V2_DATA: PlanDeGestionV2Data = {
  ceja: "D1 · Versión 2.0 · Reemplaza al Plan de Gestión del Alcance v1.0",
  titulo: "Plan de Gestión del Proyecto",
  subtitulo: "Implementación de la Gestión por Procesos en las 20 Facultades de la UNMSM. Incorpora las correcciones de los nueve hallazgos del diagnóstico y suma las áreas del PMBOK que el plan anterior no cubría.",
  urlOficial: "https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/docs/01-plan-de-gestion-v2.html",
  decisionesTexto: "Decisiones que cierran las contradicciones detectadas entre los documentos de referencia, fijando una fuente única.",
  criteriosTexto: "Criterios técnicos formalizados y aprobadores únicos requeridos para la conformidad y validación de cada entregable.",
  interesadosTexto: "Estrategia de comunicación y gestión de expectativas para los interesados clave del proyecto en las 20 facultades.",
  documentosIntegradosTexto: "Relación de documentos y anexos oficiales del proyecto que proveen la fuente única de información aprobada.",
  ficha: {
    proyecto: "Implementación de la Gestión por Procesos",
    areaResponsable: "OGPL · Oficina de Racionalización",
    alcanceTemporal: "Fases 1 a 3",
    inicio: "01/06/2025",
    cierreFase1: "30/09/2026",
    cierreProyecto: "30/06/2027",
    version: "2.0 · 26/08/2026",
    avanceFase1: "63%",
  },
  proposito: [
    "Este plan establece las directrices para definir, desarrollar, supervisar, controlar y validar el alcance global del proyecto y el de cada Manual de Gestión por Procesos de Facultad (MAGPROF), tomando como línea base la Norma Técnica N.º 002-2025-PCM-SGP. Incluye además la diagramación de los procedimientos que integran cada proceso del Mapa de Procesos Estándar.",
    "A diferencia de la versión 1.0, que cubría únicamente el área de Alcance, esta versión incorpora cronograma, calidad, recursos, comunicaciones, riesgos e interesados, y establece una fuente única para cada dato del proyecto."
  ],
  decisiones: [
    {
      numero: 1,
      etiqueta: "Decisión 1 · resuelve el hallazgo D1-01",
      titulo: "Documentación de procesos",
      descripcion: "Está dentro del alcance la documentación que cada Facultad elabora en el Anexo 1 y el Anexo 3. Está fuera la documentación de procesos de unidades centrales de la universidad ajenas a las Facultades. La redacción contradictoria de la versión 1.0 queda derogada."
    },
    {
      numero: 2,
      etiqueta: "Decisión 2 · resuelve D1-02",
      titulo: "Alcance del término «automatización»",
      descripcion: "La exclusión se refiere a la automatización de los procesos de negocio de las Facultades. Sí está dentro del alcance automatizar la carga y validación de datos dentro de la plataforma SIGPRO. La tarea del cronograma se renombra en consecuencia."
    },
    {
      numero: 3,
      etiqueta: "Decisión 3 · resuelve D1-03",
      titulo: "Ubicación de SIGPRO en las fases",
      descripcion: "La Fase 1 exige únicamente la disponibilidad de SIGPRO en modo consulta al 30 de setiembre de 2026 (hito H1.3.4.02). El backend, los módulos de encuesta, facultades, acta digital y automatización, y el despliegue completo, se ejecutan en la Fase 2. Así el retraso de un módulo ya no bloquea el cierre de la Fase 1."
    },
    {
      numero: 4,
      etiqueta: "Decisión 4 · resuelve D2-04",
      titulo: "Fecha única de cierre de la Fase 1",
      descripcion: "30 de setiembre de 2026. Esta fecha rige en el plan, en el nombre del hito y en las fechas del cronograma. Quedan sin efecto las menciones a «30 de octubre» y al rango 01–03/10."
    },
    {
      numero: 5,
      etiqueta: "Decisión 5 · resuelve D2-01",
      titulo: "Fuente única del avance de fase",
      descripcion: "El avance de fase se mide exclusivamente con la revisión interna (D4), mediante la fórmula (Completos + 0,5 × Observados) ÷ Total de productos. El porcentaje del cronograma se reclasifica como «actividades iniciadas o culminadas» y no se usa para reportar avance."
    },
    {
      numero: 6,
      etiqueta: "Decisión 6 · resuelve D4-07 y R-08",
      titulo: "Catálogo maestro de procesos",
      descripcion: "Rige un único catálogo de los 16 procesos de Nivel 0. Toda codificación que use la numeración desplazada de PS.04 a PS.10 debe corregirse antes de continuar el llenado. La auditoría está programada como tarea T1.3.3.04."
    },
    {
      numero: 7,
      etiqueta: "Decisión 7 · resuelve D4-05 y D4-06",
      titulo: "Derogación del Anexo 2",
      descripcion: "El Anexo 2 no se llena: su contenido pasó al Anexo 1 por incompatibilidad de las celdas combinadas con SIGPRO. Se retiran sus columnas de la revisión interna, junto con las del «Anexo 4», que carece de archivo y de regla que lo defina."
    },
    {
      numero: 8,
      etiqueta: "Decisión 8 · resuelve D1-06",
      titulo: "Un solo aprobador por entregable",
      descripcion: "El Decano aprueba el MAGPROF y el MAPRO de su Facultad. El Jefe de OGPL pasa a consultado. La aprobación institucional consolidada se registra como hito aparte, a cargo del Rectorado."
    }
  ],
  alcanceTexto: "El proyecto comprende el diseño, la implementación y la evaluación de la Gestión por Procesos (Fases 1 a 3) en las 20 Facultades de la UNMSM. La Fase 1 (Identificación) cierra el 30 de setiembre de 2026; la Fase 2 (Implementación) el 30 de abril de 2027; la Fase 3 (Evaluación) el 30 de junio de 2027. La Fase 4 (Mejora) requiere un plan independiente y no forma parte de este alcance.",
  alcanceItems: [
    { dentro: "Elaboración del MAGPROF en las 20 Facultades", fuera: "Rediseño de la estructura orgánica de la universidad" },
    { dentro: "Identificación de procesos estratégicos, misionales y de soporte", fuera: "Estandarización de subprocesos" },
    { dentro: "Consolidación del Mapa de Procesos Estándar", fuera: "Procesos de entidades externas vinculadas a la UNMSM" },
    { dentro: "Fichas de caracterización por proceso (Anexo 3)", fuera: "Modificación de normativa nacional aplicable" },
    { dentro: "Capacitación a los Dueños de Proceso", fuera: "Certificación externa de calidad (ISO u otra)" },
    { dentro: "Documentación de procesos elaborada por cada Facultad en los Anexos 1 y 3", fuera: "Documentación de procesos de unidades centrales ajenas a las Facultades", destacado: true },
    { dentro: "Determinación de los indicadores estándar por proceso", fuera: "Estandarización de productos" },
    { dentro: "Desarrollo de la plataforma SIGPRO y automatización de la carga de datos en ella", fuera: "Automatización de los procesos de negocio de las Facultades", destacado: true },
    { dentro: "Diagramación de los procedimientos del Mapa Estándar en las 20 Facultades", fuera: "Automatización de los procedimientos diagramados" },
    { dentro: "Implementación y evaluación (Fases 2 y 3)", fuera: "Fase 4 — Mejora continua posterior" }
  ],
  redaccionAlcance: {
    titulo: "3.  Redacción de la   Definición Alcance",
    parrafos: [
      "El proyecto comprende el diseño, implementación y evaluación de la Gestión por Procesos (Fases 1 a 3) para las 20 Facultades de la Universidad Nacional Mayor de San Marcos (UNMSM), enmarcado en un estricto horizonte temporal escalonado: la Fase 1 (Identificación) tiene como plazo límite el 30 de setiembre de 2026; la Fase 2 (Implementación) se ejecutará hasta abril de 2027; y la Fase 3 (Evaluación) concluirá en junio de 2027.",
      "Durante la Fase 1, el núcleo del esfuerzo se centrará en la elaboración.  del Manual de Gestión por Procesos (MAGPROF) para cada Facultad. Esto abarca la identificación de los procesos (estratégicos, misionales y de soporte), la consolidación de un reajuste para el Mapa de Procesos Estándar, la redacción de las fichas de caracterización y la determinación de indicadores, asegurando la alineación con la Norma Técnica SGP y .Como también se comenzará con el Desarrollo de Front-end  / Back-end. del SIGPRO y de manera transversal, se ejecutará un plan de capacitación dirigido a los Dueños de Proceso y culminara con el Manual de Gestión por Procesos (MAGPROF)  Aprobado con las facultades que termine en el mencionado plazo  .",
      "Para la Fase 2, el trabajo se enfocará en la diagramación detallada de los procedimientos asociados a los Procesos del Mapa Estándar. Esta etapa se desarrollará conjuntamente con el despliegue e implementación de la Plataforma Web Institucional (SIGPRO), la cual centralizará operativamente los módulos de gestión . Finalmente se culminará con  aprobación y  la publicación oficial de los Manuales de Procedimientos (MAPROs)",
      "Durante la Fase 3, se llevará a cabo la evaluación integral del sistema, lo cual contempla la medición de todos los indicadores establecidos previamente en las fichas de caracterización (abarcando tanto los indicadores de eficacia como los de eficiencia de cada proceso). Esta medición permitirá monitorear el desempeño real de los procesos y validar su nivel de cumplimiento frente a las metas institucionales planteadas.",
      "Quedan estrictamente excluidos del alcance del presente proyecto el rediseño de la estructura orgánica de la universidad, así como la estandarización a nivel de subprocesos y productos. las certificaciones externas de calidad (ISO) ni la modificación de la normativa nacional. Finalmente, se precisa que la Fase 4 (Mejora) no se contempla en el presente alcance, dado que su ejecución requiere un plan independiente que integrará la planificación y precisión de los tiempos operativos una vez concluidas las tres fases iniciales."
    ]
  },
  edtTexto: "Cuatro niveles, idénticos a los del cronograma: Fase › Etapa › Actividad › Tarea. La versión 1.0 llegaba solo a tres y no permitía trazar una tarea hasta su paquete de trabajo.",
  edtItems: [
    { faseId: "F1", faseNombre: "Identificación", fasePlazo: "hasta 30/09/2026", faseRowSpan: 9, isFirstOfPhase: true, etapa: "E1.1 Inicio y sensibilización", actividad: "A1.1.1 Revisión de la norma", paqueteTrabajo: "Análisis de la NT 002-2025-PCM-SGP" },
    { faseId: "F1", faseNombre: "Identificación", fasePlazo: "hasta 30/09/2026", faseRowSpan: 9, etapa: "E1.1 Inicio y sensibilización", actividad: "A1.1.2 Difusión y arranque", paqueteTrabajo: "Material de difusión y presentación de continuidad" },
    { faseId: "F1", faseNombre: "Identificación", fasePlazo: "hasta 30/09/2026", faseRowSpan: 9, etapa: "E1.1 Inicio y sensibilización", actividad: "A1.1.3 Capacitación inicial", paqueteTrabajo: "Capacitación a Dueños de Proceso" },
    { faseId: "F1", faseNombre: "Identificación", fasePlazo: "hasta 30/09/2026", faseRowSpan: 9, etapa: "E1.2 Identificación de procesos", actividad: "A1.2.1 Elaboración de la Guía", paqueteTrabajo: "Material base de la Guía de GxP" },
    { faseId: "F1", faseNombre: "Identificación", fasePlazo: "hasta 30/09/2026", faseRowSpan: 9, etapa: "E1.2 Identificación de procesos", actividad: "A1.2.2 Reajuste del Mapa de Procesos", paqueteTrabajo: "Mapa de Procesos Estándar de Facultades" },
    { faseId: "F1", faseNombre: "Identificación", fasePlazo: "hasta 30/09/2026", faseRowSpan: 9, etapa: "E1.2 Identificación de procesos", actividad: "A1.2.3 Aprobación de la Guía", paqueteTrabajo: "Guía de GxP emitida" },
    { faseId: "F1", faseNombre: "Identificación", fasePlazo: "hasta 30/09/2026", faseRowSpan: 9, etapa: "E1.3 Elaboración del MAGPROF", actividad: "A1.3.1 Ajuste de instrumentos · A1.3.2 Indicadores", paqueteTrabajo: "Fichas ajustadas · 16 indicadores estándar" },
    { faseId: "F1", faseNombre: "Identificación", fasePlazo: "hasta 30/09/2026", faseRowSpan: 9, etapa: "E1.3 Elaboración del MAGPROF", actividad: "A1.3.3 Documentación · A1.3.4 SIGPRO mínimo", paqueteTrabajo: "Anexos 1 y 3 por facultad · SIGPRO en modo consulta" },
    { faseId: "F1", faseNombre: "Identificación", fasePlazo: "hasta 30/09/2026", faseRowSpan: 9, etapa: "E1.3 Elaboración del MAGPROF", actividad: "A1.3.5 Consolidación y cierre", paqueteTrabajo: "20 MAGPROF validados y aprobados" },
    
    { faseId: "F2", faseNombre: "Implementación", fasePlazo: "hasta 30/04/2027", faseRowSpan: 3, isFirstOfPhase: true, etapa: "E2.1 Diagramación de procedimientos", actividad: "A2.1.1 Desarrollo de flujogramas", paqueteTrabajo: "Procedimientos diagramados y validados en Bizagi" },
    { faseId: "F2", faseNombre: "Implementación", fasePlazo: "hasta 30/04/2027", faseRowSpan: 3, etapa: "E2.2 SIGPRO · desarrollo y despliegue", actividad: "A2.2.1 Construcción del sistema", paqueteTrabajo: "Backend, módulos y despliegue del módulo de procesos" },
    { faseId: "F2", faseNombre: "Implementación", fasePlazo: "hasta 30/04/2027", faseRowSpan: 3, etapa: "E2.3 Publicación oficial", actividad: "A2.3.1 Emisión del MAPRO", paqueteTrabajo: "MAPRO publicado y aprobado" },
    
    { faseId: "F3", faseNombre: "Evaluación", fasePlazo: "hasta 30/06/2027", faseRowSpan: 2, isFirstOfPhase: true, etapa: "E3.1 Medición de indicadores", actividad: "A3.1.1 Recolección · A3.1.2 Auditoría", paqueteTrabajo: "Medición de eficacia y eficiencia · auditoría de cumplimiento" },
    { faseId: "F3", faseNombre: "Evaluación", fasePlazo: "hasta 30/06/2027", faseRowSpan: 2, etapa: "E3.2 Informe final", actividad: "A3.2.1 Resultados del sistema", paqueteTrabajo: "Informe de Evaluación aprobado" }
  ],
  requisitosTexto: "Cada requisito apunta ahora a la tarea del cronograma que lo entrega. Es el vínculo que la versión 1.0 no tenía y que impedía verificar que todo requisito tuviera trabajo asignado.",
  requisitos: [
    { id: "RQ-01", requisito: "Nombres de procesos definidos (estratégico, misional, soporte)", origen: "NT SGP", entregable: "MAGPROF", tarea: "T1.2.2.01 – T1.2.2.03", estado: "Conforme" },
    { id: "RQ-02", requisito: "Mapa de Procesos Estándar para Facultades", origen: "OGPL", entregable: "Mapa institucional", tarea: "H1.2.2.04", estado: "Conforme" },
    { id: "RQ-03", requisito: "Fichas de indicadores estándar de los 16 procesos", origen: "NT SGP", entregable: "MAGPROF", tarea: "T1.3.2.01 – T1.3.2.06", estado: "En proceso" },
    { id: "RQ-04", requisito: "Ficha de caracterización por proceso", origen: "NT SGP", entregable: "MAGPROF", tarea: "T1.3.3.01 – T1.3.3.04", estado: "En proceso" },
    { id: "RQ-05", requisito: "Aprobación del MAGPROF por los 20 Decanos", origen: "OGPL", entregable: "MAGPROF", tarea: "T1.3.5.02", estado: "No iniciado" },
    { id: "RQ-06", requisito: "Plataforma SIGPRO disponible en modo consulta", origen: "OGPL", entregable: "SIGPRO", tarea: "T1.3.4.01 · H1.3.4.02", estado: "En proceso" },
    { id: "RQ-07", requisito: "MAPRO — Manual de procedimientos publicado", origen: "OGPL", entregable: "MAPRO", tarea: "T2.3.1.01 – T2.3.1.02", estado: "No iniciado" },
    { id: "RQ-08", requisito: "Los 16 procesos de Nivel 0 registrados en las 20 Facultades", origen: "NT SGP · Regla 2.1", entregable: "Anexo 1", tarea: "T1.3.3.03", estado: "No iniciado", destacado: true },
    { id: "RQ-09", requisito: "Codificación conforme al catálogo maestro en las 20 pestañas", origen: "OGPL", entregable: "Anexos 1 y 3", tarea: "T1.3.3.04", estado: "No iniciado", destacado: true }
  ],
  requisitosNota: "RQ-08 y RQ-09 son requisitos nuevos: recogen los 73 procesos obligatorios ausentes y el problema de codificación que el diagnóstico detectó y que no tenían requisito ni tarea.",
  criterios: [
    { entregable: "MAGPROF de Facultad", revisorTecnico: "Oficina de Racionalización", criterio: "Para la aceptación del MAGPROF se realizará el cumplimiento de las siguientes directrices.", aprobador: "Decano" },
    { entregable: "SIGPRO · modo consulta", revisorTecnico: "Oficina de Racionalización", criterio: "Front-end operativo con acceso público y por facultad; visualización de mapa, indicadores y fichas", aprobador: "Jefe de OGPL" },
    { entregable: "SIGPRO · versión completa", revisorTecnico: "Oficina de Racionalización", criterio: "Todos los módulos funcionales y operativos, con carga de datos automatizada", aprobador: "Jefe de OGPL" },
    { entregable: "MAPRO de Facultad", revisorTecnico: "Oficina de Racionalización", criterio: "Procedimientos alineados a los procesos validados en el MAGPROF y diagramados en Bizagi", aprobador: "Decano" },
    { entregable: "Informe de Evaluación", revisorTecnico: "OGPL · OCCAA", criterio: "Medición de los indicadores de eficacia y eficiencia de los 16 procesos, con auditoría de cumplimiento", aprobador: "Rectorado" }
  ],
  rolesTexto: "Un solo aprobador por actividad. La versión 1.0 asignaba doble responsabilidad final en dos filas, con lo que ninguna decisión quedaba formalmente cerrada.",
  rolesColumnas: {
    actividad: "Actividad",
    decano: "Decano",
    respGxP: "Resp. GxP Fac.",
    ofRacionalizacion: "Of. Racionaliz.",
    jefeOgpl: "Jefe OGPL",
    rectorado: "Rectorado",
  },
  rolesRaci: [
    { actividad: "Capacitar en la implementación de GxP", decano: "I", respGxP: "I", ofRacionalizacion: "R", jefeOgpl: "A", rectorado: "I" },
    { actividad: "Elaborar el MAGPROF", decano: "I", respGxP: "R", ofRacionalizacion: "C", jefeOgpl: "I", rectorado: "—" },
    { actividad: "Validar la documentación", decano: "C", respGxP: "C", ofRacionalizacion: "R", jefeOgpl: "A", rectorado: "I" },
    { actividad: "Aprobar el MAGPROF de la Facultad", decano: "A", respGxP: "I", ofRacionalizacion: "C", jefeOgpl: "C", rectorado: "I" },
    { actividad: "Aprobar el MAPRO de la Facultad", decano: "A", respGxP: "I", ofRacionalizacion: "C", jefeOgpl: "C", rectorado: "I" },
    { actividad: "Desarrollar la plataforma SIGPRO", decano: "I", respGxP: "I", ofRacionalizacion: "R", jefeOgpl: "A", rectorado: "I" },
    { actividad: "Aprobar el Mapa Institucional", decano: "C", respGxP: "C", ofRacionalizacion: "C", jefeOgpl: "R", rectorado: "A" },
    { actividad: "Auditar y evaluar el avance institucional", decano: "I", respGxP: "I", ofRacionalizacion: "R", jefeOgpl: "C", rectorado: "A" }
  ],
  controlCambiosColumnas: [
    { id: "paso", nombre: "Paso" },
    { id: "accion", nombre: "Acción (Alineada al PMBOK 6ta Edición y Alcance del Proyecto)" },
    { id: "responsable", nombre: "Responsable" }
  ],
  controlCambiosTexto: "El siguiente procedimiento formaliza el proceso de Control Integrado de Cambios conforme a las buenas prácticas del PMBOK (6ta Edición), adaptado a las restricciones de escalonamiento obligatorio (regla del 100 % de avance por fase) y a los entregables específicos del proyecto (MAGPROF, MAPRO, SIGPRO, Bizagi). Toda solicitud que vulnere las exclusiones del proyecto (modificación de estructura orgánica, estandarización de subprocesos/productos, normativa ISO o modificación de normativa nacional) será rechazada en la fase de evaluación técnica.",
  controlCambios: [
    {
      paso: 1,
      accion: "Generación y Registro de la Solicitud de Cambio: Emisión formal y documentada de la necesidad de modificación sobre entregables (Mapa de Nivel 1/2, Fichas de Anexo 1 y 3, diagramas BPMN o requerimientos del SIGPRO). Debe justificar la causa y enviarse antes del cierre de la fase respectiva.",
      responsable: "Responsable de GxP de Facultad"
    },
    {
      paso: 2,
      accion: "Análisis Integrado de Impactos: Evaluación de viabilidad técnica y normativa (alineación con la NT N°.002-2025-PCM-SGP). Se debe medir el impacto en la ruta crítica del cronograma escalonado, verificando que no impida la culminación obligatoria del 100 % de la fase en curso.",
      responsable: "Oficina de Racionalización"
    },
    {
      paso: 3,
      accion: "Dictamen del Comité de Control de Cambios (CCB): Revisión de la evaluación de impacto para emitir la resolución oficial: Aprobar, Rechazar o Diferir la solicitud. Se asume la autoridad de control de cambios institucional.",
      responsable: "Jefe de OGPL"
    },
    {
      paso: 4,
      accion: "Actualización de Líneas Base y Artefactos: Modificación de la Línea Base del Alcance (Enunciado, EDT/WBS) y actualización de los documentos afectados (Mapa de Procesos Estándar, fichas de caracterización, indicadores o backlog del SIGPRO).",
      responsable: "Oficina de Racionalización"
    },
    {
      paso: 5,
      accion: "Validación y Aprobación de Nuevas Versiones: Aprobación formal de los entregables actualizados (incluyendo los diagramas en Bizagi Modeler y módulos del SIGPRO) y establecimiento de la nueva línea base vigente.",
      responsable: "Jefe de OGPL"
    },
    {
      paso: 6,
      accion: "Gestión de la Configuración y Comunicación: Inscripción del estado final en el Registro de Cambios (Bitácora del Proyecto), actualización del repositorio central y notificación formal a los Dueños de Proceso de las facultades y al equipo de desarrollo informático.",
      responsable: "Oficina de Racionalización"
    }
  ],
  controlCambiosDirectrices: [
    {
      titulo: "Bloqueo por Cambio de Fase",
      descripcion: "Ningún cambio al alcance de la Fase 1 (Identificación) será evaluado si la facultad ya ha transitado a la Fase 2 (Implementación), garantizando la inmutabilidad de la línea base aprobada para la diagramación de procedimientos."
    },
    {
      titulo: "Trazabilidad Única",
      descripcion: "Todo cambio aprobado en el Paso 3 y ejecutado en el Paso 4 debe reflejarse simultáneamente en los documentos normativos (MAGPROF/MAPRO) y en la arquitectura del sistema informático (SIGPRO) para mantener la fuente única de verdad."
    },
    {
      titulo: "Evaluación de Riesgos",
      descripcion: "Durante el Paso 2, la Oficina de Racionalización deberá identificar si el cambio solicitado genera riesgos sobre los hitos límite del proyecto (30 de septiembre de 2026, abril de 2027 y junio de 2027)."
    }
  ],
  cronogramaTexto: "El modelo del cronograma del proyecto centraliza la planificación y el control de los tiempos, asegurando el cumplimiento de la regla de avance escalonado obligatorio para las tres fases. La estructura, actualización y mantenimiento del cronograma se rigen por los siguientes parámetros:",
  cronogramaReglas: [
    "Codificación Jerárquica: Cada elemento posee un código alfanumérico único e irrepetible estructurado por niveles de desglose (ej. T1.1.1.01). Se utiliza el prefijo «T» para las tareas operativas y «H» para los hitos.",
    "Atributos de Actividad: El registro de toda tarea exige documentar de forma obligatoria su categorización («Etapa y Actividad»), la descripción de la «Tarea», el «Responsable» de su ejecución (ej. OR), la duración estimada en «Días» (hábiles) y las fechas de «Inicio» y «Fin» en formato estandarizado (dd/mm/aaaa).",
    "Lógica de Red y Ruta Crítica: Toda tarea debe declarar al menos una «Predecesora» y su respectivo tipo de vínculo lógico (ej. FC - Fin a Comienzo) para garantizar la continuidad del flujo de trabajo y el cálculo exacto de la ruta crítica. No se admiten tareas sin dependencias.",
    "Monitoreo y Control de Estado: El avance se supervisa a través del campo «Estado» (ej. CONFORME). Cualquier paralización u holgura no planificada se registra como incidencia, descontándose del calendario laboral del proyecto.",
    "Gestión de Hitos: Todo elemento temporal de duración igual a cero (0) días se tipifica exclusivamente como un hito de control; bajo ninguna circunstancia se registrará como tarea de esfuerzo."
  ],
  cronogramaAvisoRutaCritica: "",
  cronogramaBotonTexto: "📅 Acceder al Cronograma Completo y Actualizado",
  cronogramaBotonSubtexto: "(Este enlace redirige al documento maestro del cronograma)",
  cronogramaUrlRedireccion: "https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/docs/02-cronograma-v2.html",
  calidadTexto: "El control de calidad se ejerce mediante la revisión interna de los Anexos 1 y 3 contra los criterios de validación vigentes. Es la única fuente del avance de fase.",
  calidadMediciones: [
    {
      indicador: "Porcentaje de Avance de la fase 1 del proyecto",
      medicion: "Porcentaje de Avance de la fase 1 del proyecto",
      responsable: "Responsable de la Gestión por Proceso de la Facultad",
      formula: "([% Fase 1 –FM] + [% Fase 1-FCDP] + [% Fase 1- FLCH] + … + [% Fase 1- FISI)] / 20",
      uso: "Para medir el cumplimiento de la fase 1 del proyecto.\nFuente: Dashboard",
      fuente: "Dashboard",
      oficial: true
    },
    {
      indicador: "Porcentaje de Avance de la fase 1 por Facultad",
      medicion: "Porcentaje de Avance de la fase 1 por Facultad",
      responsable: "Responsable de la Gestión por Proceso de la Facultad",
      formula: "(% ANEXO 1 × 0.5) + (% ANEXO 3 × 0.5)",
      uso: "Para medir el cumplimiento general del proyecto.\nFuente: Dashboard",
      fuente: "Dashboard",
      oficial: true
    },
    {
      indicador: "Porcentaje de Ejecución de tareas de la Fase 1",
      medicion: "Porcentaje de Ejecución de tareas de la Fase 1",
      responsable: "La oficina de Racionalización",
      formula: "Tareas ejecutadas ÷ Total de Tareas del proyecto (FASE 1)",
      uso: "Para medir el cumplimiento del cronograma de la fase 1.\nFuente: Cronograma",
      fuente: "Cronograma"
    },
    {
      indicador: "Porcentaje de Ejecución de tareas del proyecto",
      medicion: "Porcentaje de Ejecución de tareas del proyecto",
      responsable: "La oficina de Racionalización",
      formula: "Tareas ejecutadas ÷ Total de Tareas del proyecto (FASE 1,2,3)",
      uso: "Para medir el cumplimiento del cronograma del proyecto.\nFuente: Cronograma",
      fuente: "Cronograma"
    }
  ],
  calidadNota: "El coeficiente 0,5 acredita medio punto al producto ya catalogado que aún tiene observaciones por levantar. Ajuste pendiente: el denominador debe incluir los 16 procesos obligatorios de Nivel 0 aunque no se hayan cargado; de lo contrario, registrar menos procesos eleva artificialmente el porcentaje, como ocurre hoy con FCM al 100% pese a que le falta PS.10.",
  riesgosTexto: "Nueve riesgos identificados, seis ya materializados. El registro completo, con probabilidad, impacto, responsable y respuesta, está en la Bitácora v2.0.",
  riesgos: [
    {
      riesgo: "Las facultades no remiten la documentación solicitada en plazo (Solo 6 de 20 facultades remitieron la diagramación de PE.02)",
      categoria: "Facultad",
      probImpacto: "Alta / Alto",
      responsable: "Responsable de la Gestión por Proceso en la facultad",
      respuesta: "Regla de silencio administrativo positivo: transcurridos 5 días hábiles se da por conforme",
      impacto: "Alto",
      estado: "Materializado",
    },
    {
      riesgo: "Los órganos consultados no emiten retroalimentación (Solo 3 facultades remitieron su retroalimentación de los ítems de las preguntas de la encuesta / modelo CONEAU y el VRAP no remitió)",
      categoria: "Facultad",
      probImpacto: "Alta / Medio",
      responsable: "OCAA de la facultad / VRAP",
      respuesta: "Regla de silencio administrativo positivo: transcurridos 5 días hábiles se da por conforme",
      impacto: "Medio",
      estado: "Materializado",
    },
    {
      riesgo: "La OCCAA no aprueba los procedimientos de PE.02 por falta del listado de evidencias CONEAU 2025 (Subtarea S1.3.2.02.18 bloqueada desde el 30/04/2026)",
      categoria: "Facultad",
      probImpacto: "Alta / Alto",
      responsable: "OCCAA",
      respuesta: "Se fijará el hito conjunto con la OCCAA y fecha límite; si no se cumple, aprobar con la evidencia disponible",
      impacto: "Alto",
      estado: "Materializado",
    },
    {
      riesgo: "Dependencia de una sola persona para el desarrollo de SIGPRO (Las 29 subtareas de SIGPRO están asignadas a OR – MELI)",
      categoria: "Recursos",
      probImpacto: "Alta / Crítico",
      responsable: "OGPL",
      respuesta: "Se contrató a un programador senior con experiencia en backend y frontend.",
      impacto: "Crítico",
      estado: "Abierto",
    },
    {
      riesgo: "Las contrataciones de programador a cargo de OGPL/QUIPUCAMAYOC concretada con retraso (Acordadas el 01/07/2026, se efectivizó el 26/08/2026)",
      categoria: "Contratos",
      probImpacto: "Alta / Alto",
      responsable: "OGPL/QUIPUCAMAYOC",
      respuesta: "Se dio el seguimiento e impulsó activamente la gestión hasta lograr la contratación del programador.",
      impacto: "Alto",
      estado: "Materializado",
    },
    {
      riesgo: "La contratación del Bolsista por parte de la OCCAA para laborar en la OGPL para el análisis, procesamiento y culmino de la encuesta/CONEAU no se concretó (Acordadas el 01/07/2026, sin concretarse hasta la fecha 09/09/2026 )",
      categoria: "Contratos",
      probImpacto: "Alta / Alto",
      responsable: "OCCAA",
      respuesta: "Se remitió un oficio y un correo electrónico a la OCCAA para la incorporación de un bolsista pero hasta la fecha no se tiene respuesta.",
      impacto: "Alto",
      estado: "Abierto",
    },
    {
      riesgo: "Datos contaminados entre facultades por uso de formularios ajenos (FCF usa mayoritariamente el sufijo _F02, que pertenece a FDCP)",
      categoria: "Calidad",
      probImpacto: "Media / Alto",
      responsable: "Responsable de la Gestión por Proceso en la facultad y dueño de procesos",
      respuesta: "Se elaboró una automatización en apps script para el llenado y de los Anexos 1 y 3.",
      impacto: "Alto",
      estado: "Abierto",
    },
    {
      riesgo: "Dos numeraciones de procesos de soporte en circulación (PS.04 a PS.10 desplazados el código PS.08 en varias facultades)",
      categoria: "Decisión",
      probImpacto: "Alta / Crítico",
      responsable: "Responsable de la Gestión por Proceso en la facultad y dueño de procesos",
      respuesta: "Se hizo la aclaración en el apartado de decisión N°8 del plan de Gestión del Proyecto.",
      impacto: "Crítico",
      estado: "Abierto",
    },
    {
      riesgo: "La ruta crítica no admite retrasos: 15 días hábiles desde el 09/09/2026 T1.3.3.02 → T1.3.5.01 → T1.3.5.02 → H1.3.5.03",
      categoria: "Cronograma",
      probImpacto: "Alta / Crítico",
      responsable: "OGPL",
      respuesta: "Se establece el 30 de setiembre de 2026 como fecha límite para el cierre de la Fase 1, la cual rige en el plan del cronograma. El paso a la Fase 2 se realizará con las facultades que hayan completado el 100 % el registro de los Anexos 1 y 3. Queda establecido que, para transitar hacia cualquier fase subsiguiente, se debe cumplir con el 100 % de avance en las fases previas. Las facultades con registros pendientes quedarán en su fase actual y deberán culminarla de manera obligatoria antes de continuar a la siguiente fase.",
      impacto: "Crítico",
      estado: "Abierto",
    },
  ],
  interesados: [
    { interesado: "Rectorado", influencia: "Alta", interesExpectativa: "Cumplimiento de la Norma Técnica SGP y de los plazos comprometidos", comunicacion: "Reporte de avance mensual con la cifra oficial del D4" },
    { interesado: "Jefe de OGPL", influencia: "Alta", interesExpectativa: "Cierre de la Fase 1 en plazo y disponibilidad de SIGPRO", comunicacion: "Reunión semanal de seguimiento de la ruta crítica" },
    { interesado: "Decanos (20)", influencia: "Alta", interesExpectativa: "Aprobar un MAGPROF que refleje la realidad de su Facultad", comunicacion: "Oficio con observaciones y plazo; reunión de cierre por facultad" },
    { interesado: "Responsables de GxP de Facultad", influencia: "Media", interesExpectativa: "Instrucciones claras y estables sobre qué anexos llenar", comunicacion: "Correo con observaciones tras cada revisión; reuniones de levantamiento" },
    { interesado: "OCCAA y OCAA", influencia: "Media", interesExpectativa: "Alineamiento con el modelo de acreditación CONEAU 2025", comunicacion: "Reuniones de validación de procedimientos de PE.02" },
    { interesado: "VRAP", influencia: "Media", interesExpectativa: "Consistencia académica de los procesos misionales", comunicacion: "Remisión de ítems para retroalimentación, con plazo de 5 días hábiles" },
    { interesado: "Quipucamayoc", influencia: "Baja", interesExpectativa: "Integración técnica de SIGPRO con los sistemas institucionales", comunicacion: "Coordinación puntual por hito técnico" }
  ],
  interesadosNotaSilencio: "Regla de silencio administrativo: Transcurridos 5 días hábiles desde la remisión formal sin respuesta del órgano consultado, la propuesta se da por conforme y el proyecto avanza. Se adopta como respuesta al riesgo R-02, que ya se materializó dos veces.",
  documentosIntegrados: [
    { documento: "Plan de Gestión del Proyecto", version: "v2.0 · este documento", contenidoFuente: "Alcance, EDT, trazabilidad, RACI, control de cambios, calidad, riesgos e interesados" },
    { documento: "Cronograma", version: "v2.0", contenidoFuente: "Fechas, dependencias, responsables, hitos y ruta crítica", link: "02-cronograma-v2.html" },
    { documento: "Bitácora de ejecución", version: "v2.0", contenidoFuente: "Registro diario, registro de riesgos y registro de incidencias", link: "03-bitacora-v2.html" },
    { documento: "Revisión interna de avances", version: "vigente", contenidoFuente: "Avance de fase por facultad y control de calidad de los Anexos 1 y 3" },
    { documento: "Catálogo maestro de procesos", version: "v1.0 · nuevo", contenidoFuente: "Denominación oficial de los 16 procesos de Nivel 0" },
    { documento: "Diccionario de estados", version: "v1.0 · nuevo", contenidoFuente: "Cinco estados únicos y su peso en el cálculo del avance" }
  ]
};
