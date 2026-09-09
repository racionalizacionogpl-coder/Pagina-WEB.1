// Archivo generado con la transcripción fiel 1:1 de las 36 tareas en las 3 tablas oficiales
// F1 · Identificación (21 tareas) | F2 · Implementación (11 tareas) | F3 · Evaluación (4 tareas)

export interface CronogramaItem {
  fase: string;
  codigo: string;
  etapa: string;
  actividad: string;
  tarea: string;
  nota?: string;
  responsable: string;
  inicio: string;
  fin: string;
  dias: string;
  estado: string;
  predecesora?: string;
  vinculo?: string;
  rutaCritica: boolean;
  esHito: boolean;
}

export interface CronogramaCambioV1 {
  id: string;
  correccion: string;
}

export interface CronogramaTareaNueva {
  codigo: string;
  tarea: string;
  motivo: string;
}

export interface CronogramaV2Data {
  ceja: string;
  titulo: string;
  subtitulo: string;
  urlOficial: string;
  stats: {
    totalTareas: number;
    totalHitos: number;
    enRutaCritica: number;
    tareasNuevas: number;
    codigosDuplicados: number;
    conformes: number;
    enProceso: number;
    noIniciadas: number;
  };
  rutaCriticaFase1: {
    descripcion: string;
    elementos: {
      codigo: string;
      nombre: string;
    }[];
    advertencia: string;
  };
  tareas: CronogramaItem[];
  cambiosV1: CronogramaCambioV1[];
  tareasNuevas: CronogramaTareaNueva[];
}

export const CRONOGRAMA_V2_DATA: CronogramaV2Data = {
  ceja: "D2 · Versión 2.0 · Reemplaza al cronograma del 24 de julio de 2026",
  titulo: "Plan de Gestión del Cronograma",
  subtitulo: "Estructura completa de 36 tareas distribuidas en 3 fases: F1 Identificación (21), F2 Implementación (11) y F3 Evaluación (4).",
  urlOficial: "https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/docs/02-cronograma-v2.html",
  stats: {
    totalTareas: 36,
    totalHitos: 2,
    enRutaCritica: 16,
    tareasNuevas: 4,
    codigosDuplicados: 0,
    conformes: 7,
    enProceso: 5,
    noIniciadas: 24
  },
  rutaCriticaFase1: {
    descripcion: "Cinco elementos encadenados sin holgura. Cualquier día de atraso en uno de ellos mueve el cierre del 30 de setiembre.",
    elementos: [
      {
        codigo: "T1.1.1.1",
        nombre: "Matriz de análisis de la documentación de la Nueva Norma Técnica N°.002- 2025- PCM - SGP"
      },
      {
        codigo: "T1.3.1.1",
        nombre: "Preparación del material para la elaboración de la guía"
      },
      {
        codigo: "T1.3.2.1",
        nombre: "Análisis de la información Pre Existente (Mapa e Indicadores)"
      },
      {
        codigo: "T1.4.3.1",
        nombre: "LLenado de las Fichas de Productos y Procesos (Anexos 1, 2, 3)"
      },
      {
        codigo: "T1.4.5.3",
        nombre: "Cierre de Fase 1 (Cierre 30 Set)"
      }
    ],
    advertencia: "Cualquier atraso en la ruta crítica consume la holgura de 1 día hábil antes del cierre fijado para el 30 de setiembre de 2026."
  },
  tareas: [
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.1.1.1",
    "etapa": "E1.1 Inicio",
    "actividad": "A1.1.1 Revisión de la Nueva Norma",
    "tarea": "T1.1.1.1 Matriz de análisis de la documentación de la Nueva Norma Técnica N°.002- 2025- PCM - SGP",
    "nota": "Análisis documental de la Directiva N° 002-2021-PCM/SGP y lineamientos metodológicos.",
    "responsable": "OGPL",
    "inicio": "01/06/2025",
    "fin": "22/07/2025",
    "dias": "52",
    "estado": "CONFORME",
    "predecesora": "—",
    "vinculo": "—",
    "rutaCritica": true,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.2.1.1",
    "etapa": "E1.2 Sensibilización",
    "actividad": "A1.2.1 Arranque de la Implementación",
    "tarea": "T1.2.1.1 Material de difusión de la Gestión por Procesos",
    "nota": "Material audiovisual e infografías sobre la gestión por procesos.",
    "responsable": "OGPL",
    "inicio": "22/07/2025",
    "fin": "04/08/2025",
    "dias": "14",
    "estado": "CONFORME",
    "predecesora": "T1.1.1.1",
    "vinculo": "FC",
    "rutaCritica": false,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.2.2.1",
    "etapa": "E1.2 Sensibilización",
    "actividad": "A1.2.2 Campaña de Difusión",
    "tarea": "T1.2.2.1 Presentación de la Continuidad de la Gestión por Procesos",
    "nota": "Sesión institucional con autoridades universitarias y decanos.",
    "responsable": "OGPL",
    "inicio": "04/08/2025",
    "fin": "09/08/2025",
    "dias": "6",
    "estado": "CONFORME",
    "predecesora": "T1.2.1.1",
    "vinculo": "FC",
    "rutaCritica": false,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.2.3.1",
    "etapa": "E1.2 Sensibilización",
    "actividad": "A1.2.3 Ejecución de la capacitación inicial",
    "tarea": "T1.2.3.1 Orientación Técnica a Responsables de la Gestión por Procesoslos y Dueños de Proceso",
    "nota": "Talleres presenciales y virtuales con las 20 facultades.",
    "responsable": "OGPL / Facultades",
    "inicio": "11/08/2025",
    "fin": "20/09/2025",
    "dias": "41",
    "estado": "CONFORME",
    "predecesora": "T1.2.2.1",
    "vinculo": "FC",
    "rutaCritica": false,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.3.1.1",
    "etapa": "E1.3 Identificación de Procesos",
    "actividad": "A1.3.1 Elaboración de la Guía de Gestión Por Procesos",
    "tarea": "T1.3.1.1 Preparación del material para la elaboración de la guía",
    "nota": "Recopilación de insumos normativos y metodológicos para la Guía.",
    "responsable": "OGPL",
    "inicio": "23/09/2025",
    "fin": "04/10/2025",
    "dias": "12",
    "estado": "CONFORME",
    "predecesora": "T1.2.3.1",
    "vinculo": "FC",
    "rutaCritica": true,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.3.2.1",
    "etapa": "E1.3 Identificación de Procesos",
    "actividad": "A1.3.2 Reajuste del Mapa de Procesos",
    "tarea": "T1.3.2.1 Análisis de la información Pre Existente (Mapa e Indicadores)",
    "nota": "Evaluación del estado de los mapas de procesos vigentes de las facultades.",
    "responsable": "OGPL",
    "inicio": "06/10/2025",
    "fin": "17/10/2025",
    "dias": "12",
    "estado": "CONFORME",
    "predecesora": "T1.3.1.1",
    "vinculo": "FC",
    "rutaCritica": true,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.3.2.2",
    "etapa": "E1.3 Identificación de Procesos",
    "actividad": "A1.3.2 Reajuste del Mapa de Procesos",
    "tarea": "T1.3.2.2 Presentación de los Hallazgos del Mapa e Indicadores",
    "nota": "Informe consolidado de diagnóstico y brechas en procesos.",
    "responsable": "OGPL",
    "inicio": "27/10/2025",
    "fin": "31/10/2025",
    "dias": "5",
    "estado": "CONFORME",
    "predecesora": "T1.3.2.1",
    "vinculo": "FC",
    "rutaCritica": true,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.3.2.3",
    "etapa": "E1.3 Identificación de Procesos",
    "actividad": "A1.3.2 Reajuste del Mapa de Procesos",
    "tarea": "T1.3.2.3 Recepción del Feedbacks de Mapa de Procesos de la Facultades",
    "nota": "Recepción de observaciones, aportes y ajustes de las 20 facultades.",
    "responsable": "Facultades / OGPL",
    "inicio": "16/12/2025",
    "fin": "14/03/2026",
    "dias": "89",
    "estado": "EN PROCESO",
    "predecesora": "T1.3.2.2",
    "vinculo": "FC",
    "rutaCritica": false,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.3.2.4",
    "etapa": "E1.3 Identificación de Procesos",
    "actividad": "A1.3.2 Reajuste del Mapa de Procesos",
    "tarea": "T1.3.2.4 Presentación del Mapa Estandarizado para Facultades",
    "nota": "Presentación plenaria del mapa tipo estandarizado para las facultades.",
    "responsable": "OGPL",
    "inicio": "27/02/2026",
    "fin": "27/02/2026",
    "dias": "1",
    "estado": "EN PROCESO",
    "predecesora": "T1.3.2.3",
    "vinculo": "FC",
    "rutaCritica": false,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.3.3.1",
    "etapa": "E1.3 Identificación de Procesos",
    "actividad": "A1.3.3 Presentación Guía de Gestión por Procesos",
    "tarea": "T1.3.3.1 Aprobación y Emisión de la Guía de Gestión por Procesos",
    "nota": "Emisión de la Resolución Rectoral de aprobación de la Guía.",
    "responsable": "Rectorado / OGPL",
    "inicio": "02/03/2026",
    "fin": "02/03/2026",
    "dias": "1",
    "estado": "EN PROCESO",
    "predecesora": "T1.3.1.1",
    "vinculo": "FC",
    "rutaCritica": true,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.4.1.1",
    "etapa": "E1.4 Elaboración de MAGPROF",
    "actividad": "A1.4.1 Presentación de la Documentación de Proceso",
    "tarea": "T1.4.1.1 Fichas ajustadas y estandarizadas de inventario - (Anexo 1) y Ficha de caracterización - (Anexo 3)",
    "nota": "Plantillas y formatos oficiales estandarizados distribuidos.",
    "responsable": "OGPL",
    "inicio": "27/02/2026",
    "fin": "07/03/2026",
    "dias": "9",
    "estado": "EN PROCESO",
    "predecesora": "T1.3.2.4",
    "vinculo": "FC",
    "rutaCritica": false,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.4.2.1",
    "etapa": "E1.4 Elaboración de MAGPROF",
    "actividad": "A1.4.2 Indicadores",
    "tarea": "T1.4.2.1 Determinación del Indicador Estándar de PE.01",
    "nota": "Definición técnica de fórmula, umbral y fuente para PE.01.",
    "responsable": "OGPL / Dueños PE",
    "inicio": "02/03/2026",
    "fin": "09/03/2026",
    "dias": "8",
    "estado": "EN PROCESO",
    "predecesora": "T1.3.3.1",
    "vinculo": "FC",
    "rutaCritica": false,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.4.2.2",
    "etapa": "E1.4 Elaboración de MAGPROF",
    "actividad": "A1.4.2 Indicadores",
    "tarea": "T1.4.2.2 Determinación del Indicador Estándar de PE.02",
    "nota": "Definición técnica para PE.02.",
    "responsable": "OGPL / Dueños PE",
    "inicio": "27/04/2026",
    "fin": "06/05/2026",
    "dias": "10",
    "estado": "NO INICIADO",
    "predecesora": "T1.4.2.1",
    "vinculo": "FC",
    "rutaCritica": false,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.4.2.3",
    "etapa": "E1.4 Elaboración de MAGPROF",
    "actividad": "A1.4.2 Indicadores",
    "tarea": "T1.4.2.3 Determinación del Indicador Estándar de PM.01, PS.01, PS.02, PS.03",
    "nota": "Fichas técnicas de indicadores para PM.01, PS.01, PS.02, PS.03.",
    "responsable": "OGPL / Dueños Proc.",
    "inicio": "27/04/2026",
    "fin": "06/05/2026",
    "dias": "10",
    "estado": "NO INICIADO",
    "predecesora": "T1.4.2.1",
    "vinculo": "FC",
    "rutaCritica": false,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.4.2.4",
    "etapa": "E1.4 Elaboración de MAGPROF",
    "actividad": "A1.4.2 Indicadores",
    "tarea": "T1.4.2.4 Determinación del Indicador Estándar de PE.03, PM.02",
    "nota": "Fichas de indicadores para PE.03, PM.02.",
    "responsable": "OGPL / Dueños Proc.",
    "inicio": "03/08/2026",
    "fin": "04/08/2026",
    "dias": "2",
    "estado": "NO INICIADO",
    "predecesora": "T1.4.2.3",
    "vinculo": "FC",
    "rutaCritica": false,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.4.2.5",
    "etapa": "E1.4 Elaboración de MAGPROF",
    "actividad": "A1.4.2 Indicadores",
    "tarea": "T1.4.2.5 Determinación del Indicador Estándar de PM.03, PS.(04, 05, 06, 07, 08, 09)",
    "nota": "Fichas técnicas para PM.03 y grupo PS.04 a PS.09.",
    "responsable": "OGPL / Dueños Proc.",
    "inicio": "03/08/2026",
    "fin": "30/09/2026",
    "dias": "59",
    "estado": "NO INICIADO",
    "predecesora": "T1.4.2.4",
    "vinculo": "FC",
    "rutaCritica": false,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.4.3.1",
    "etapa": "E1.4 Elaboración de MAGPROF",
    "actividad": "A1.4.3 Documentación de los Procesos",
    "tarea": "T1.4.3.1 LLenado de las Fichas de Productos y Procesos (Anexos 1, 2, 3)",
    "nota": "Carga de datos por equipos de facultades y dependencias en Anexos 1, 2, 3.",
    "responsable": "Facultades / OGPL",
    "inicio": "03/03/2026",
    "fin": "30/09/2026",
    "dias": "212",
    "estado": "EN PROCESO",
    "predecesora": "T1.4.1.1",
    "vinculo": "FC",
    "rutaCritica": true,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.4.4.1",
    "etapa": "E1.4 Elaboración de MAGPROF",
    "actividad": "A1.4.4 Construcción de la arquitectura del SIGPRO",
    "tarea": "T1.4.4.1 Construcción del Front-End y Backent.",
    "nota": "Implementación del software SIGPRO UNMSM (Front-End y Backend).",
    "responsable": "OGPL / TI",
    "inicio": "01/09/2026",
    "fin": "25/09/2026",
    "dias": "25",
    "estado": "NO INICIADO",
    "predecesora": "T1.4.3.1",
    "vinculo": "CC",
    "rutaCritica": false,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.4.5.1",
    "etapa": "E1.4 Elaboración de MAGPROF",
    "actividad": "A1.4.5 Consolidación Fase 1",
    "tarea": "T1.4.5.1 Revisión y validación de MAGPROF",
    "nota": "Revisión metodológica y técnica de los expedientes MAGPROF.",
    "responsable": "OGPL",
    "inicio": "01/09/2026",
    "fin": "18/09/2026",
    "dias": "18",
    "estado": "NO INICIADO",
    "predecesora": "T1.4.3.1",
    "vinculo": "CC",
    "rutaCritica": true,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.4.5.2",
    "etapa": "E1.4 Elaboración de MAGPROF",
    "actividad": "A1.4.5 Consolidación Fase 1",
    "tarea": "T1.4.5.2 Aprobación de los MAGPROF",
    "nota": "Aprobación formal de los Manuales de Procesos por Consejo de Facultad.",
    "responsable": "Decanos / Consejos de Fac.",
    "inicio": "16/09/2026",
    "fin": "30/09/2026",
    "dias": "15",
    "estado": "NO INICIADO",
    "predecesora": "T1.4.5.1",
    "vinculo": "FC",
    "rutaCritica": true,
    "esHito": false
  },
  {
    "fase": "F1 · Identificación",
    "codigo": "T1.4.5.3",
    "etapa": "E1.4 Elaboración de MAGPROF",
    "actividad": "A1.4.5 Consolidación Fase 1",
    "tarea": "T1.4.5.3 Cierre de Fase 1 (Cierre 30 Set)",
    "nota": "Hito institucional de culminación formal de la Fase 1 al 30 de setiembre.",
    "responsable": "Rectorado / OGPL",
    "inicio": "01/10/2026",
    "fin": "02/10/2026",
    "dias": "2",
    "estado": "NO INICIADO",
    "predecesora": "T1.4.5.2",
    "vinculo": "FC",
    "rutaCritica": true,
    "esHito": true
  },
  {
    "fase": "F2 · Implementación",
    "codigo": "T2.1.1.1",
    "etapa": "E2.1 Despliegue del SIGPRO",
    "actividad": "A2.1.1 Desarrollo del SIGPRO",
    "tarea": "T2.1.1.1 Pruebas y despliegues de los módulos",
    "nota": "Pruebas integrales de carga y seguridad del sistema SIGPRO.",
    "responsable": "OGPL / TI",
    "inicio": "08/10/2026",
    "fin": "14/10/2026",
    "dias": "7",
    "estado": "NO INICIADO",
    "predecesora": "T1.4.5.3",
    "vinculo": "FC",
    "rutaCritica": true,
    "esHito": false
  },
  {
    "fase": "F2 · Implementación",
    "codigo": "T2.1.2.1",
    "etapa": "E2.1 Despliegue del SIGPRO",
    "actividad": "A2.1.2 Configuración de SIGPRO",
    "tarea": "T2.1.2.1 Desarrollo del sistema completado.",
    "nota": "Conformidad técnica de la arquitectura SIGPRO.",
    "responsable": "OGPL / TI",
    "inicio": "15/10/2026",
    "fin": "16/10/2026",
    "dias": "2",
    "estado": "NO INICIADO",
    "predecesora": "T2.1.1.1",
    "vinculo": "FC",
    "rutaCritica": true,
    "esHito": false
  },
  {
    "fase": "F2 · Implementación",
    "codigo": "T2.2.1.1",
    "etapa": "E2.2 Elaboración del MAPRO",
    "actividad": "A2.2.1 Desarrollo de Flujogramas",
    "tarea": "T2.2.1.1 Diagramación de Procedimientos en Bizagi de las facultades",
    "nota": "Diagramación BPMN de procedimientos priorizados en Bizagi Modeler.",
    "responsable": "Facultades / OGPL",
    "inicio": "16/10/2026",
    "fin": "30/11/2026",
    "dias": "46",
    "estado": "NO INICIADO",
    "predecesora": "T2.1.2.1",
    "vinculo": "FC",
    "rutaCritica": true,
    "esHito": false
  },
  {
    "fase": "F2 · Implementación",
    "codigo": "T2.1.2.2",
    "etapa": "E2.1 Despliegue del SIGPRO",
    "actividad": "A2.1.2 Configuración de SIGPRO",
    "tarea": "T2.1.2.2 Módulo de encuesta.",
    "nota": "Implementación del módulo de satisfacción y consulta ciudadana.",
    "responsable": "OGPL / TI",
    "inicio": "19/10/2026",
    "fin": "30/10/2026",
    "dias": "12",
    "estado": "NO INICIADO",
    "predecesora": "T2.1.2.1",
    "vinculo": "FC",
    "rutaCritica": false,
    "esHito": false
  },
  {
    "fase": "F2 · Implementación",
    "codigo": "T2.1.2.3",
    "etapa": "E2.1 Despliegue del SIGPRO",
    "actividad": "A2.1.2 Configuración de SIGPRO",
    "tarea": "T2.1.2.3 Módulo de evidencia.",
    "nota": "Repositorio digital de evidencias documentales de procesos.",
    "responsable": "OGPL / TI",
    "inicio": "02/11/2026",
    "fin": "10/11/2026",
    "dias": "9",
    "estado": "NO INICIADO",
    "predecesora": "T2.1.2.2",
    "vinculo": "FC",
    "rutaCritica": false,
    "esHito": false
  },
  {
    "fase": "F2 · Implementación",
    "codigo": "T2.1.2.4",
    "etapa": "E2.1 Despliegue del SIGPRO",
    "actividad": "A2.1.2 Configuración de SIGPRO",
    "tarea": "T2.1.2.4 Módulo del acta digital terminado.",
    "nota": "Módulo de firma y emisión de actas digitales de comités.",
    "responsable": "OGPL / TI",
    "inicio": "11/11/2026",
    "fin": "20/11/2026",
    "dias": "10",
    "estado": "NO INICIADO",
    "predecesora": "T2.1.2.3",
    "vinculo": "FC",
    "rutaCritica": false,
    "esHito": false
  },
  {
    "fase": "F2 · Implementación",
    "codigo": "T2.1.2.5",
    "etapa": "E2.1 Despliegue del SIGPRO",
    "actividad": "A2.1.2 Configuración de SIGPRO",
    "tarea": "T2.1.2.5 Automatización del reporte de indicadores a los dueños de proceso",
    "nota": "Motor de generación automatizada de reportes periódicos.",
    "responsable": "OGPL / TI",
    "inicio": "24/11/2026",
    "fin": "27/11/2026",
    "dias": "4",
    "estado": "NO INICIADO",
    "predecesora": "T2.1.2.4",
    "vinculo": "FC",
    "rutaCritica": false,
    "esHito": false
  },
  {
    "fase": "F2 · Implementación",
    "codigo": "T2.2.1.2",
    "etapa": "E2.2 Elaboración del MAPRO",
    "actividad": "A2.2.1 Desarrollo de Flujogramas",
    "tarea": "T2.2.1.2 Validación de los Procedimientos en Bizagi con Facultades",
    "nota": "Talleres de revisión y validación de flujogramas con facultades.",
    "responsable": "Facultades / OGPL",
    "inicio": "01/12/2026",
    "fin": "15/01/2027",
    "dias": "46",
    "estado": "NO INICIADO",
    "predecesora": "T2.2.1.1",
    "vinculo": "FC",
    "rutaCritica": true,
    "esHito": false
  },
  {
    "fase": "F2 · Implementación",
    "codigo": "T2.2.2.1",
    "etapa": "E2.2 Elaboración del MAPRO",
    "actividad": "A2.2.2 Consolidación de la fase 2",
    "tarea": "T2.2.2.1 Aprobación del MAPROs",
    "nota": "Resolución de aprobación formal de los MAPRO de facultades.",
    "responsable": "Decanos / Rectorado",
    "inicio": "16/01/2027",
    "fin": "28/02/2027",
    "dias": "44",
    "estado": "NO INICIADO",
    "predecesora": "T2.2.1.2",
    "vinculo": "FC",
    "rutaCritica": true,
    "esHito": false
  },
  {
    "fase": "F2 · Implementación",
    "codigo": "T2.2.2.2",
    "etapa": "E2.2 Elaboración del MAPRO",
    "actividad": "A2.2.2 Consolidación de la fase 2",
    "tarea": "T2.2.2.2 Publicación de los MAPROS en SIGPRO",
    "nota": "Carga y puesta a disposición pública institucional en SIGPRO.",
    "responsable": "OGPL",
    "inicio": "01/03/2027",
    "fin": "31/03/2027",
    "dias": "31",
    "estado": "NO INICIADO",
    "predecesora": "T2.2.2.1",
    "vinculo": "FC",
    "rutaCritica": true,
    "esHito": false
  },
  {
    "fase": "F2 · Implementación",
    "codigo": "T2.2.2.3",
    "etapa": "E2.2 Elaboración del MAPRO",
    "actividad": "A2.2.2 Consolidación de la fase 2",
    "tarea": "T2.2.2.3 Cierre de Fase 2",
    "nota": "Cierre operativo y administrativo de la Fase de Implementación.",
    "responsable": "OGPL",
    "inicio": "01/04/2027",
    "fin": "30/04/2027",
    "dias": "30",
    "estado": "NO INICIADO",
    "predecesora": "T2.2.2.2",
    "vinculo": "FC",
    "rutaCritica": true,
    "esHito": false
  },
  {
    "fase": "F3 · Evaluación",
    "codigo": "T3.1.1.1",
    "etapa": "E3.1 Evaluación de Indicadores",
    "actividad": "A3.1.1 Recolección de Datos",
    "tarea": "T3.1.1.1 Medición de indicadores",
    "nota": "Primer ciclo de medición y captura de datos en el sistema.",
    "responsable": "OGPL / Facultades",
    "inicio": "01/05/2027",
    "fin": "20/05/2027",
    "dias": "20",
    "estado": "NO INICIADO",
    "predecesora": "T2.2.2.3",
    "vinculo": "FC",
    "rutaCritica": true,
    "esHito": false
  },
  {
    "fase": "F3 · Evaluación",
    "codigo": "T3.1.2.1",
    "etapa": "E3.1 Evaluación de Indicadores",
    "actividad": "A3.1.2 Auditoría Interna",
    "tarea": "T3.1.2.1 Verificación y control del cumplimiento de los indicadores",
    "nota": "Auditoría de cumplimiento de metas y coherencia estadística.",
    "responsable": "OGPL / OCI",
    "inicio": "21/05/2027",
    "fin": "10/06/2027",
    "dias": "21",
    "estado": "NO INICIADO",
    "predecesora": "T3.1.1.1",
    "vinculo": "FC",
    "rutaCritica": true,
    "esHito": false
  },
  {
    "fase": "F3 · Evaluación",
    "codigo": "T3.2.1.1",
    "etapa": "E3.2 Informe Final",
    "actividad": "A3.2.1 Resultados del Sistema",
    "tarea": "T3.2.1.1 Informe de evaluación de indicadores no registrados y críticos",
    "nota": "Documento oficial de evaluación final y plan de mejora continua.",
    "responsable": "OGPL",
    "inicio": "11/06/2027",
    "fin": "25/06/2027",
    "dias": "15",
    "estado": "NO INICIADO",
    "predecesora": "T3.1.2.1",
    "vinculo": "FC",
    "rutaCritica": true,
    "esHito": false
  },
  {
    "fase": "F3 · Evaluación",
    "codigo": "T3.2.1.2",
    "etapa": "E3.2 Informe Final",
    "actividad": "A3.2.1 Resultados del Sistema",
    "tarea": "T3.2.1.2 Aprobación y Cierre de Proyecto",
    "nota": "Resolución Rectoral de culminación y cierre del proyecto de modernización.",
    "responsable": "Rectorado / OGPL",
    "inicio": "26/06/2027",
    "fin": "30/06/2027",
    "dias": "5",
    "estado": "NO INICIADO",
    "predecesora": "T3.2.1.1",
    "vinculo": "FC",
    "rutaCritica": true,
    "esHito": true
  }
],
  cambiosV1: [
    {
      id: "D2-01",
      correccion: "Alineación 1:1 estricta con las 3 tablas del proyecto: F1 Identificación (21), F2 Implementación (11), F3 Evaluación (4)."
    },
    {
      id: "D2-02",
      correccion: "Los contadores se rotulan explícitamente como actividades y se separan de los de tareas."
    },
    {
      id: "D2-03",
      correccion: "«Desarrollo del sistema» ya no empieza antes que el front-end del que depende: pasa a T2.1.2.1 con inicio 15/10/2026."
    },
    {
      id: "D2-04",
      correccion: "Fecha única de cierre de Fase 1: 30/09/2026, con cierre administrativo al 02/10/2026 en T1.4.5.3."
    },
    {
      id: "D2-05",
      correccion: "Códigos de 4 niveles validados sin colisión (T1.1.1.1 a T3.2.1.2)."
    }
  ],
  tareasNuevas: [
    {
      codigo: "T1.4.2.5",
      tarea: "Determinación del Indicador Estándar de PM.03, PS.(04, 05, 06, 07, 08, 09)",
      motivo: "Cobertura completa de los indicadores operativos y de soporte de facultades."
    },
    {
      codigo: "T1.4.4.1",
      tarea: "Construcción del Front-End y Backent.",
      motivo: "Arquitectura base del software SIGPRO."
    },
    {
      codigo: "T2.1.2.5",
      tarea: "Automatización del reporte de indicadores a los dueños de proceso",
      motivo: "Generación automatizada de reportes periódicos."
    },
    {
      codigo: "T3.2.1.2",
      tarea: "Aprobación y Cierre de Proyecto",
      motivo: "Hito final de resolución rectoral y cierre de proyecto."
    }
  ]
};
