// Archivo generado con la extracción completa y fidedigna de
// https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/docs/03-bitacora-v2.html

export interface BitacoraSubtarea {
  codigo: string;
  subtarea: string;
  responsable: string;
  proceso: string;
  inicio: string;
  fin: string;
  estado: string;
  tareaPadre: string;
}

export interface BitacoraRiesgo {
  id: string;
  riesgo: string;
  evidencia: string;
  categoria: string;
  probImpacto: string;
  responsable: string;
  respuesta: string;
  estado: string;
}

export interface BitacoraIncidencia {
  id: string;
  periodo: string;
  dias: string;
  evento: string;
  efecto: string;
  area: string;
}

export interface BitacoraCambioV1 {
  id: string;
  correccion: string;
}

export interface BitacoraV2Data {
  ceja: string;
  titulo: string;
  subtitulo: string;
  urlOficial: string;
  stats: {
    totalSubtareas: number;
    conformes: number;
    enProceso: number;
    observadas: number;
    noIniciadas: number;
  };
  estructuraCodigo: {
    ejemplo: string;
    partes: {
      segmento: string;
      descripcion: string;
    }[];
    regla: string;
  };
  subtareas: BitacoraSubtarea[];
  riesgos: BitacoraRiesgo[];
  incidencias: BitacoraIncidencia[];
  cambiosV1: BitacoraCambioV1[];
}

export const BITACORA_V2_DATA: BitacoraV2Data = {
  "ceja": "D3 · Versión 2.0 · Reemplaza a la bitácora de plantilla Vertex42",
  "titulo": "Bitácora de ejecución",
  "subtitulo": "Registro reconstruido sobre la EDT: cada subtarea cuelga de una tarea real del cronograma, con código único, estado del diccionario común y fecha en formato dd/mm/aaaa.",
  "urlOficial": "https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/docs/03-bitacora-v2.html",
  "stats": {
    "totalSubtareas": 111,
    "conformes": 99,
    "enProceso": 6,
    "observadas": 5,
    "noIniciadas": 1
  },
  "estructuraCodigo": {
    "ejemplo": "S1.3.2.02.14",
    "partes": [
      {
        "segmento": "S",
        "descripcion": "Subtarea de bitácora"
      },
      {
        "segmento": "1.3.2.02",
        "descripcion": "Tarea padre en el cronograma, sin el prefijo T"
      },
      {
        "segmento": "14",
        "descripcion": "Correlativo de dos dígitos dentro de esa tarea, sin reutilizar"
      }
    ],
    "regla": "Con esta regla, cualquier fila de la bitácora se cruza con el cronograma por el campo Tarea_padre_cronograma. Es la conexión que no existía entre los dos documentos."
  },
  "subtareas": [
    {
      "codigo": "S1.3.2.01.01",
      "subtarea": "Revisar los indicadores del Plan Estratégico 2026-2030",
      "responsable": "OR",
      "proceso": "PE.01",
      "inicio": "10/03/2026",
      "fin": "13/03/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.01"
    },
    {
      "codigo": "S1.3.2.01.02",
      "subtarea": "Determinar el mecanismo de control «Porcentaje de ejecución presupuestaria de recursos directamente recaudados»",
      "responsable": "OR",
      "proceso": "PE.01",
      "inicio": "17/03/2026",
      "fin": "18/03/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.01"
    },
    {
      "codigo": "S1.3.2.01.03",
      "subtarea": "Determinar el mecanismo de control «Hoja de reporte de recursos ordinarios (RO)»",
      "responsable": "OR",
      "proceso": "PE.01",
      "inicio": "19/03/2026",
      "fin": "20/03/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.01"
    },
    {
      "codigo": "S1.3.2.01.04",
      "subtarea": "Determinar el mecanismo de control «Porcentaje de cumplimiento de acciones estratégicas»",
      "responsable": "OR",
      "proceso": "PE.01",
      "inicio": "23/03/2026",
      "fin": "24/03/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.01"
    },
    {
      "codigo": "S1.3.2.01.05",
      "subtarea": "Determinar el mecanismo de control «Hoja de reporte de actividades operativas ejecutadas»",
      "responsable": "OR",
      "proceso": "PE.01",
      "inicio": "25/03/2026",
      "fin": "26/03/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.01"
    },
    {
      "codigo": "S1.3.2.01.06",
      "subtarea": "Diagramar el procedimiento D.01 Formulación del Plan Estratégico",
      "responsable": "OR",
      "proceso": "PE.01",
      "inicio": "27/03/2026",
      "fin": "28/03/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.01"
    },
    {
      "codigo": "S1.3.2.01.07",
      "subtarea": "Diagramar el procedimiento D.02 Seguimiento del Plan Estratégico",
      "responsable": "OR",
      "proceso": "PE.01",
      "inicio": "31/03/2026",
      "fin": "02/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.01"
    },
    {
      "codigo": "S1.3.2.01.08",
      "subtarea": "Diagramar el procedimiento D.03 Evaluación del Plan Estratégico",
      "responsable": "OR",
      "proceso": "PE.01",
      "inicio": "03/04/2026",
      "fin": "05/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.01"
    },
    {
      "codigo": "S1.3.2.01.09",
      "subtarea": "Diagramar el procedimiento D.04 Formulación del Plan Operativo",
      "responsable": "OR",
      "proceso": "PE.01",
      "inicio": "06/04/2026",
      "fin": "07/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.01"
    },
    {
      "codigo": "S1.3.2.01.10",
      "subtarea": "Diagramar el procedimiento D.05 Evaluación del Plan Operativo",
      "responsable": "OR",
      "proceso": "PE.01",
      "inicio": "10/04/2026",
      "fin": "12/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.01"
    },
    {
      "codigo": "S1.3.2.02.01",
      "subtarea": "Reunión de trabajo: presentar el indicador de PE.02Reunión virtual por cierre de la universidad.",
      "responsable": "OGPL / OCCAA / OCAA",
      "proceso": "PE.02",
      "inicio": "13/04/2026",
      "fin": "13/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.02",
      "subtarea": "Elaborar el diagrama preliminar",
      "responsable": "OGPL",
      "proceso": "PE.02",
      "inicio": "14/04/2026",
      "fin": "14/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.03",
      "subtarea": "Revisar y analizar los flujogramas de PE.02 remitidos por las facultadesSolo 6 de 20 facultades remitieron la diagramación. Riesgo R-01.",
      "responsable": "OR",
      "proceso": "PE.02",
      "inicio": "14/04/2026",
      "fin": "14/04/2026",
      "estado": "OBSERVADO",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.04",
      "subtarea": "Diagramar D.01 Formación del Comité de CalidadBase: guías publicadas por la OCCAA.",
      "responsable": "OR",
      "proceso": "PE.02",
      "inicio": "14/04/2026",
      "fin": "15/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.05",
      "subtarea": "Diagramar D.02 Planificación de la Autoevaluación",
      "responsable": "OR",
      "proceso": "PE.02",
      "inicio": "15/04/2026",
      "fin": "15/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.06",
      "subtarea": "Diagramar D.03 Desarrollo de la Autoevaluación",
      "responsable": "OR",
      "proceso": "PE.02",
      "inicio": "15/04/2026",
      "fin": "16/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.07",
      "subtarea": "Diagramar D.04 Evaluación Externa",
      "responsable": "OR",
      "proceso": "PE.02",
      "inicio": "16/04/2026",
      "fin": "16/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.08",
      "subtarea": "Diagramar D.05 Acreditación",
      "responsable": "OR",
      "proceso": "PE.02",
      "inicio": "16/04/2026",
      "fin": "17/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.09",
      "subtarea": "Diagramar D.06 Seguimiento",
      "responsable": "OR",
      "proceso": "PE.02",
      "inicio": "17/04/2026",
      "fin": "17/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.10",
      "subtarea": "Ajustar los diagramas",
      "responsable": "OR",
      "proceso": "PE.02",
      "inicio": "17/04/2026",
      "fin": "17/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.11",
      "subtarea": "Ajustar los procedimientos preliminares con la OCCAAVisita de pares evaluadores dificultó la reunión. Incidencia INC-05.",
      "responsable": "OCCAA",
      "proceso": "PE.02",
      "inicio": "20/04/2026",
      "fin": "20/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.12",
      "subtarea": "Reajustar o aprobar D.01 Formación del Comité de CalidadLa OCCAA brindó observaciones de reajuste.",
      "responsable": "OCCAA",
      "proceso": "PE.02",
      "inicio": "21/04/2026",
      "fin": "22/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.13",
      "subtarea": "Reajustar o aprobar D.02 Planificación de la AutoevaluaciónLa OCCAA brindó observaciones de reajuste.",
      "responsable": "OCCAA",
      "proceso": "PE.02",
      "inicio": "22/04/2026",
      "fin": "23/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.14",
      "subtarea": "Reajustar o aprobar D.03 Desarrollo de la AutoevaluaciónLa OCCAA no emitió recomendación: falta listar las evidencias por estándar del modelo CONEAU 2025. Riesgo R-03.",
      "responsable": "OCCAA",
      "proceso": "PE.02",
      "inicio": "23/04/2026",
      "fin": "24/04/2026",
      "estado": "EN PROCESO",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.15",
      "subtarea": "Reajustar o aprobar D.04 Evaluación ExternaLa OCCAA brindó observaciones de reajuste.",
      "responsable": "OCCAA",
      "proceso": "PE.02",
      "inicio": "24/04/2026",
      "fin": "25/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.16",
      "subtarea": "Reajustar o aprobar D.05 AcreditaciónLa OCCAA brindó observaciones de reajuste.",
      "responsable": "OCCAA",
      "proceso": "PE.02",
      "inicio": "25/04/2026",
      "fin": "26/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.17",
      "subtarea": "Reajustar o aprobar D.06 SeguimientoLa OCCAA brindó observaciones de reajuste.",
      "responsable": "OCCAA",
      "proceso": "PE.02",
      "inicio": "26/04/2026",
      "fin": "27/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.18",
      "subtarea": "Aprobar los procedimientos de PE.02Bloqueado por la falta del listado de evidencias. Riesgo R-03.",
      "responsable": "OCCAA",
      "proceso": "PE.02",
      "inicio": "27/04/2026",
      "fin": "30/04/2026",
      "estado": "NO INICIADO",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.19",
      "subtarea": "Desarrollar el instrumento de encuesta para medir los 29 indicadores de CONEAUReprogramada por cruce con actividades de aniversario.",
      "responsable": "OR",
      "proceso": "PE.02",
      "inicio": "06/05/2026",
      "fin": "06/05/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.20",
      "subtarea": "Revisar bibliografía para las encuestas dirigidas a estudiantes",
      "responsable": "OR",
      "proceso": "PE.02",
      "inicio": "06/05/2026",
      "fin": "11/05/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.21",
      "subtarea": "Redactar las encuestas dirigidas a estudiantesReanudada tras la toma de la universidad. Incidencia INC-01.",
      "responsable": "OR",
      "proceso": "PE.02",
      "inicio": "22/05/2026",
      "fin": "23/05/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.22",
      "subtarea": "Revisar bibliografía para las encuestas dirigidas a docentes",
      "responsable": "OR",
      "proceso": "PE.02",
      "inicio": "23/05/2026",
      "fin": "26/05/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.23",
      "subtarea": "Redactar las encuestas dirigidas a docentes",
      "responsable": "OR",
      "proceso": "PE.02",
      "inicio": "26/05/2026",
      "fin": "31/05/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.24",
      "subtarea": "Revisar bibliografía para las encuestas dirigidas a egresados",
      "responsable": "OR",
      "proceso": "PE.02",
      "inicio": "31/05/2026",
      "fin": "03/06/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.25",
      "subtarea": "Redactar las encuestas dirigidas a egresados",
      "responsable": "OR",
      "proceso": "PE.02",
      "inicio": "03/06/2026",
      "fin": "05/06/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.26",
      "subtarea": "Reunión de revisión de los ítems propuestos",
      "responsable": "OCCAA",
      "proceso": "PE.02",
      "inicio": "10/06/2026",
      "fin": "10/06/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.27",
      "subtarea": "Remitir los ítems preliminares al VRAP, a los jefes de OCAA y al presidente del comité",
      "responsable": "OR",
      "proceso": "PE.02",
      "inicio": "10/06/2026",
      "fin": "10/06/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.28",
      "subtarea": "Recepcionar la retroalimentación de los ítemsSolo 3 facultades respondieron; el VRAP no remitió retroalimentación. Riesgo R-02.",
      "responsable": "OR",
      "proceso": "PE.02",
      "inicio": "10/06/2026",
      "fin": "18/06/2026",
      "estado": "OBSERVADO",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.29",
      "subtarea": "Analizar la incorporación de las retroalimentaciones",
      "responsable": "OR",
      "proceso": "PE.02",
      "inicio": "18/06/2026",
      "fin": "22/06/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.30",
      "subtarea": "Reuniones con presidentes de comité y jefes de OCAA",
      "responsable": "OCCAA",
      "proceso": "PE.02",
      "inicio": "23/06/2026",
      "fin": "26/06/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.31",
      "subtarea": "Reunión OGPL–OCCAA–Quipucamayoc para contratar un programador y un bolsistaLas contrataciones no se hicieron efectivas en julio. Riesgo R-06.",
      "responsable": "OCCAA",
      "proceso": "PE.02",
      "inicio": "01/07/2026",
      "fin": "01/07/2026",
      "estado": "OBSERVADO",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.02.32",
      "subtarea": "Revisar la retroalimentación de las encuestasSolo se completó la encuesta de alumnos; se paralizó por renuncia de personal. Riesgo R-04.",
      "responsable": "OR / OCCAA",
      "proceso": "PE.02",
      "inicio": "02/07/2026",
      "fin": "11/07/2026",
      "estado": "OBSERVADO",
      "tareaPadre": "Tarea padre · T1.3.2.02"
    },
    {
      "codigo": "S1.3.2.04.01",
      "subtarea": "Extraer los procesos y productos de PE.03 desde el Anexo 1",
      "responsable": "OR – ALV / OR – ISA",
      "proceso": "PE.03",
      "inicio": "03/08/2026",
      "fin": "03/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.04"
    },
    {
      "codigo": "S1.3.2.04.02",
      "subtarea": "Analizar la denominación de los subprocesos de PE.03",
      "responsable": "OR – ALV",
      "proceso": "PE.03",
      "inicio": "03/08/2026",
      "fin": "03/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.04"
    },
    {
      "codigo": "S1.3.2.04.03",
      "subtarea": "Determinar el primer mecanismo de control de PE.03: «Porcentaje de convenios activos»",
      "responsable": "OR – ALV",
      "proceso": "PE.03",
      "inicio": "03/08/2026",
      "fin": "04/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.04"
    },
    {
      "codigo": "S1.3.2.04.04",
      "subtarea": "Determinar el segundo mecanismo de control de PE.03Corregido: en la bitácora v1 repetía el mismo indicador del primero.",
      "responsable": "OR – ALV",
      "proceso": "PE.03",
      "inicio": "03/08/2026",
      "fin": "03/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.04"
    },
    {
      "codigo": "S1.3.2.04.05",
      "subtarea": "Analizar la denominación de los subprocesos de PM.02Recodificada: en v1 figuraba bajo PE.03 por error de copia.",
      "responsable": "OR – ALV",
      "proceso": "PM.02",
      "inicio": "03/08/2026",
      "fin": "03/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.2.04"
    },
    {
      "codigo": "S1.3.2.04.06",
      "subtarea": "Determinar el mecanismo de control de PM.02 Gestión de la InvestigaciónEn v1 se le asignó «Porcentaje de convenios activos», que corresponde a PE.03. Debe redefinirse.",
      "responsable": "OR – ALV",
      "proceso": "PM.02",
      "inicio": "04/08/2026",
      "fin": "04/08/2026",
      "estado": "OBSERVADO",
      "tareaPadre": "Tarea padre · T1.3.2.04"
    },
    {
      "codigo": "S1.3.3.01.01",
      "subtarea": "Revisar los avances del llenado de los Anexos 1 y 3",
      "responsable": "OR – ISA",
      "proceso": "Todos",
      "inicio": "03/08/2026",
      "fin": "03/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.02",
      "subtarea": "Revisar el Manual de Procesos para el envío, recepción y trámites del proceso de matrícula",
      "responsable": "OR – ALV",
      "proceso": "PS.01",
      "inicio": "03/08/2026",
      "fin": "03/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.03",
      "subtarea": "Integrar los indicadores de las facultades por tramo de avance",
      "responsable": "OR – ALV",
      "proceso": "Todos",
      "inicio": "03/08/2026",
      "fin": "04/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.04",
      "subtarea": "Verificar las fórmulas de porcentaje de avance por facultadFórmula confirmada: (completos + 0,5 × observados) ÷ total.",
      "responsable": "OR – ISA",
      "proceso": "Todos",
      "inicio": "04/08/2026",
      "fin": "04/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.05",
      "subtarea": "Adecuar la bitácora al Plan de Gestión del CronogramaSe completa con esta versión 2.0.",
      "responsable": "OR – ALV",
      "proceso": "Todos",
      "inicio": "04/08/2026",
      "fin": "04/08/2026",
      "estado": "EN PROCESO",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.06",
      "subtarea": "Revisar el Anexo 1 de la Facultad de Medicina VeterinariaPendientes los Anexos 2 y 3.",
      "responsable": "OR – ISA",
      "proceso": "Todos",
      "inicio": "04/08/2026",
      "fin": "04/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.07",
      "subtarea": "Elaborar y enviar el cronograma de visitas a las facultades sobre 80%",
      "responsable": "OR – ALV",
      "proceso": "Todos",
      "inicio": "04/08/2026",
      "fin": "04/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.08",
      "subtarea": "Coordinar la reunión con el SUM",
      "responsable": "OR – ALV",
      "proceso": "PS.01",
      "inicio": "04/08/2026",
      "fin": "04/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.09",
      "subtarea": "Revisar los Anexos 2 y 3 de Medicina Veterinaria",
      "responsable": "OR – ISA",
      "proceso": "Todos",
      "inicio": "05/08/2026",
      "fin": "05/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.10",
      "subtarea": "Revisar los Anexos 1 y 3 de Ciencias Económicas",
      "responsable": "OR – ISA",
      "proceso": "Todos",
      "inicio": "05/08/2026",
      "fin": "05/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.11",
      "subtarea": "Enviar el informe de cumplimiento de los acuerdos del 1 de julio a OCCAA y Quipucamayoc",
      "responsable": "OR – ALV",
      "proceso": "Todos",
      "inicio": "05/08/2026",
      "fin": "05/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.12",
      "subtarea": "Revisar los Anexos 1 y 3 de Ciencias Contables",
      "responsable": "OR – ISA",
      "proceso": "Todos",
      "inicio": "07/08/2026",
      "fin": "07/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.13",
      "subtarea": "Presidir la reunión de observaciones con FMV",
      "responsable": "OR – ALV / OR – ISA",
      "proceso": "Todos",
      "inicio": "07/08/2026",
      "fin": "07/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.14",
      "subtarea": "Presidir la reunión de observaciones con FCE",
      "responsable": "OR – ALV / OR – ISA",
      "proceso": "Todos",
      "inicio": "10/08/2026",
      "fin": "10/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.15",
      "subtarea": "Preparar y enviar el correo de documentos observados a FMV",
      "responsable": "OR – ISA / OR – ALV",
      "proceso": "Todos",
      "inicio": "10/08/2026",
      "fin": "10/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.16",
      "subtarea": "Presidir la reunión de observaciones con FCC",
      "responsable": "OR – ALV / OR – ISA",
      "proceso": "Todos",
      "inicio": "10/08/2026",
      "fin": "10/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.17",
      "subtarea": "Presidir la reunión de observaciones con el SUM",
      "responsable": "OR – ALV",
      "proceso": "PS.01",
      "inicio": "11/08/2026",
      "fin": "11/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.18",
      "subtarea": "Actualizar y mejorar la automatización del tablero de los anexos",
      "responsable": "OR – ALV / OR – ISA",
      "proceso": "Todos",
      "inicio": "11/08/2026",
      "fin": "11/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.19",
      "subtarea": "Preparar y enviar el correo de documentos observados al SUM",
      "responsable": "OR – ALV / OR – ISA",
      "proceso": "PS.01",
      "inicio": "11/08/2026",
      "fin": "11/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.20",
      "subtarea": "Presidir la reunión de observaciones con FE",
      "responsable": "OR – ALV / OR – ISA",
      "proceso": "Todos",
      "inicio": "12/08/2026",
      "fin": "12/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.21",
      "subtarea": "Preparar y enviar el correo de documentos observados a FE",
      "responsable": "OR – ALV / OR – ISA",
      "proceso": "Todos",
      "inicio": "12/08/2026",
      "fin": "12/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.22",
      "subtarea": "Actualizar los Anexos 1 y 3",
      "responsable": "OR – ALV / OR – ISA",
      "proceso": "Todos",
      "inicio": "13/08/2026",
      "fin": "13/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.23",
      "subtarea": "Crear el primer prototipo en Apps Script para automatizar la revisión de los anexos",
      "responsable": "OR – ALV / OR – ISA",
      "proceso": "Todos",
      "inicio": "13/08/2026",
      "fin": "13/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.24",
      "subtarea": "Crear el prototipo en Apps Script para la revisión del Anexo 1",
      "responsable": "OR – ALV",
      "proceso": "Todos",
      "inicio": "14/08/2026",
      "fin": "14/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.25",
      "subtarea": "Incorporar la firma digital y el llenado automático de participantes en el SIGEA",
      "responsable": "OR – ALV",
      "proceso": "Todos",
      "inicio": "14/08/2026",
      "fin": "14/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.26",
      "subtarea": "Actualizar y mejorar el Anexo 3",
      "responsable": "OR – ISA",
      "proceso": "Todos",
      "inicio": "17/08/2026",
      "fin": "17/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.27",
      "subtarea": "Actualizar y mejorar el Anexo 1",
      "responsable": "OR – ALV",
      "proceso": "Todos",
      "inicio": "17/08/2026",
      "fin": "18/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.28",
      "subtarea": "Automatizar el Anexo 3 con fórmulas en la hoja de FDCP",
      "responsable": "OR – ISA",
      "proceso": "Todos",
      "inicio": "18/08/2026",
      "fin": "18/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.29",
      "subtarea": "Automatizar el apartado de subprocesos del Anexo 3 en FDCPEn v1 tres subtareas distintas compartían el número 31.",
      "responsable": "OR – ISA",
      "proceso": "Todos",
      "inicio": "19/08/2026",
      "fin": "19/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.30",
      "subtarea": "Automatizar el apartado de proveedores y entradas del Anexo 3 en FDCP",
      "responsable": "OR – ALV",
      "proceso": "Todos",
      "inicio": "19/08/2026",
      "fin": "19/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.31",
      "subtarea": "Automatizar el apartado de salidas, beneficiarios y registros del Anexo 3 en FDCP",
      "responsable": "OR – ISA",
      "proceso": "Todos",
      "inicio": "20/08/2026",
      "fin": "21/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.32",
      "subtarea": "Participar en la reunión con el programador backend para validar el cronograma",
      "responsable": "OR – ALV",
      "proceso": "Todos",
      "inicio": "20/08/2026",
      "fin": "20/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.33",
      "subtarea": "Automatizar el Anexo 3 con Apps Script en la hoja de FPSIC",
      "responsable": "OR – ISA",
      "proceso": "Todos",
      "inicio": "21/08/2026",
      "fin": "21/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.3.01.34",
      "subtarea": "Crear el prototipo de llenado automático en Docs de los Anexos 1 y 3El script no reproduce correctamente el cuadro del Anexo 1. Riesgo R-05.",
      "responsable": "OR – ISA / OR – ALV",
      "proceso": "Todos",
      "inicio": "21/08/2026",
      "fin": "24/08/2026",
      "estado": "EN PROCESO",
      "tareaPadre": "Tarea padre · T1.3.3.01"
    },
    {
      "codigo": "S1.3.4.01.01",
      "subtarea": "Finalizar los diseños en Figma de la página web",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "02/03/2026",
      "fin": "05/03/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.02",
      "subtarea": "Integrar el front-end del primer prototipo para la vista pública",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "05/03/2026",
      "fin": "17/03/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.03",
      "subtarea": "Integrar el ingreso al portal con dos vías de acceso: facultades y Oficina de Racionalización",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "18/03/2026",
      "fin": "17/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.04",
      "subtarea": "Desarrollar el primer prototipo del backend",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "30/03/2026",
      "fin": "01/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.05",
      "subtarea": "Mejorar el diseño del módulo público: título e información general",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "20/04/2026",
      "fin": "24/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.06",
      "subtarea": "Implementar las secciones de indicadores, flujogramas y fichas de caracterización",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "20/04/2026",
      "fin": "24/04/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.07",
      "subtarea": "Culminar el primer prototipo de backend en Java",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "13/04/2026",
      "fin": "06/05/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.08",
      "subtarea": "Integrar el front-end con el backend",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "07/05/2026",
      "fin": "30/06/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.09",
      "subtarea": "Adaptar la interfaz a los requerimientos del backend",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "07/05/2026",
      "fin": "30/06/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.10",
      "subtarea": "Culminar las pruebas del backend en las secciones administrativa y de facultades",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "08/06/2026",
      "fin": "12/06/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.11",
      "subtarea": "Revisar el backend del módulo público y el inicio de sesión",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "22/06/2026",
      "fin": "29/06/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.12",
      "subtarea": "Adaptar el backend a un esquema híbrido con datos estáticos para pruebas",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "02/07/2026",
      "fin": "14/07/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.13",
      "subtarea": "Implementar ajustes menores en el front-end",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "15/07/2026",
      "fin": "21/07/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.14",
      "subtarea": "Implementar la descarga de expedientes",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "22/07/2026",
      "fin": "24/07/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.15",
      "subtarea": "Implementar la descarga de la ficha de indicadores",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "27/07/2026",
      "fin": "30/07/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.16",
      "subtarea": "Revisar todos los módulos respecto del uso de la API híbrida",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "31/07/2026",
      "fin": "12/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.17",
      "subtarea": "Revisar el envío de documentos del módulo de OR hacia las facultades",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "12/08/2026",
      "fin": "12/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.18",
      "subtarea": "Implementar los colores oscuros en las pestañas del módulo de facultades",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "11/08/2026",
      "fin": "12/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.19",
      "subtarea": "Conectar el envío de documentos entre Racionalización y las facultades",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "13/08/2026",
      "fin": "20/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.20",
      "subtarea": "Implementar el nuevo diseño de fichas técnicas y hojas de inventario",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "18/08/2026",
      "fin": "20/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.21",
      "subtarea": "Conectar los documentos de Google Sheets al repositorio de inventario y fichas",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "19/08/2026",
      "fin": "20/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.22",
      "subtarea": "Modificar el diseño de previsualización de los documentos de Google Sheets",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "19/08/2026",
      "fin": "20/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.23",
      "subtarea": "Cambiar el diseño del mapa de procesos del módulo público",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "19/08/2026",
      "fin": "20/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.24",
      "subtarea": "Implementar el botón «Inventario» para previsualizar el documento",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "19/08/2026",
      "fin": "20/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.25",
      "subtarea": "Corregir el botón «Inventario» para cada tipo de proceso",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "21/08/2026",
      "fin": "21/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.26",
      "subtarea": "Elaborar el cronograma de entregables de SIGPRO",
      "responsable": "OR – MELI / OR – ALV",
      "proceso": "SIGPRO",
      "inicio": "20/08/2026",
      "fin": "20/08/2026",
      "estado": "CONFORME",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.27",
      "subtarea": "Diseñar la encuesta para facultades en el módulo público",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "24/08/2026",
      "fin": "24/08/2026",
      "estado": "EN PROCESO",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.28",
      "subtarea": "Ajustar el módulo de facultades",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "24/08/2026",
      "fin": "24/08/2026",
      "estado": "EN PROCESO",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    },
    {
      "codigo": "S1.3.4.01.29",
      "subtarea": "Corregir los expedientes de caracterización",
      "responsable": "OR – MELI",
      "proceso": "SIGPRO",
      "inicio": "24/08/2026",
      "fin": "24/08/2026",
      "estado": "EN PROCESO",
      "tareaPadre": "Tarea padre · T1.3.4.01"
    }
  ],
  "riesgos": [
    {
      "id": "R-01",
      "riesgo": "Las facultades no remiten la documentación solicitada en plazo",
      "evidencia": "Solo 6 de 20 facultades remitieron la diagramación de PE.02",
      "categoria": "Dependencia externa",
      "probImpacto": "Alta / Alto",
      "responsable": "OR",
      "respuesta": "Escalamiento formal por oficio decanal con plazo de 5 días hábiles y copia al Vicerrectorado",
      "estado": "Materializado"
    },
    {
      "id": "R-02",
      "riesgo": "Los órganos consultados no emiten retroalimentación",
      "evidencia": "Solo 3 facultades respondieron los ítems; el VRAP no remitió su retroalimentación",
      "categoria": "Dependencia externa",
      "probImpacto": "Alta / Medio",
      "responsable": "OR",
      "respuesta": "Regla de silencio administrativo positivo: transcurridos 5 días hábiles se da por conforme",
      "estado": "Materializado"
    },
    {
      "id": "R-03",
      "riesgo": "La OCCAA no aprueba los procedimientos de PE.02 por falta del listado de evidencias CONEAU 2025",
      "evidencia": "Subtarea S1.3.2.02.18 bloqueada desde el 30/04/2026",
      "categoria": "Dependencia externa",
      "probImpacto": "Alta / Alto",
      "responsable": "OGPL",
      "respuesta": "Fijar hito conjunto con la OCCAA y fecha límite; si no se cumple, aprobar con la evidencia disponible",
      "estado": "Materializado"
    },
    {
      "id": "R-04",
      "riesgo": "Dependencia de una sola persona para el desarrollo de SIGPRO",
      "evidencia": "Las 29 subtareas de SIGPRO están asignadas a OR – MELI",
      "categoria": "Recursos",
      "probImpacto": "Alta / Crítico",
      "responsable": "OGPL",
      "respuesta": "Documentar el código en el repositorio y designar un segundo responsable técnico",
      "estado": "Abierto"
    },
    {
      "id": "R-05",
      "riesgo": "El script de llenado automático no reproduce el cuadro del Anexo 1",
      "evidencia": "Subtarea S1.3.3.01.34 en proceso desde el 21/08/2026",
      "categoria": "Técnico",
      "probImpacto": "Media / Medio",
      "responsable": "OR – ISA",
      "respuesta": "Asignar responsable y fecha de cierre; plan alterno de llenado manual asistido",
      "estado": "Abierto"
    },
    {
      "id": "R-06",
      "riesgo": "Las contrataciones de programador y bolsista no se concretan",
      "evidencia": "Acordadas el 01/07/2026, sin efectivizar al 26/08/2026",
      "categoria": "Adquisiciones",
      "probImpacto": "Alta / Alto",
      "responsable": "OGPL",
      "respuesta": "Plan alterno: reasignar horas del equipo interno si no se concreta en setiembre",
      "estado": "Abierto"
    },
    {
      "id": "R-07",
      "riesgo": "Datos contaminados entre facultades por uso de formularios ajenos",
      "evidencia": "FCF usa mayoritariamente el sufijo _F02, que pertenece a FDCP",
      "categoria": "Calidad",
      "probImpacto": "Media / Alto",
      "responsable": "OR",
      "respuesta": "Auditoría de codificación T1.3.3.04 y validación automática del sufijo por pestaña",
      "estado": "Abierto"
    },
    {
      "id": "R-08",
      "riesgo": "Dos numeraciones de procesos de soporte en circulación",
      "evidencia": "PS.04 a PS.10 desplazados un dígito en la bitácora y en varias facultades",
      "categoria": "Alcance",
      "probImpacto": "Alta / Crítico",
      "responsable": "OGPL",
      "respuesta": "Publicar el catálogo maestro y auditar las 20 pestañas antes de continuar el llenado",
      "estado": "Abierto"
    },
    {
      "id": "R-09",
      "riesgo": "La ruta crítica no admite retrasos: 24 días de trabajo en 25 disponibles",
      "evidencia": "T1.3.3.02 → T1.3.5.01 → T1.3.5.02 → H1.3.5.03",
      "categoria": "Cronograma",
      "probImpacto": "Alta / Crítico",
      "responsable": "OGPL",
      "respuesta": "Arrancar el levantamiento de observaciones esta semana; preparar solicitud de cambio de plazo",
      "estado": "Abierto"
    }
  ],
  "incidencias": [
    {
      "id": "INC-01",
      "periodo": "11/05/2026 – 22/05/2026",
      "dias": "10",
      "evento": "Toma de la universidad",
      "efecto": "Paralización total de actividades",
      "area": "Cronograma"
    },
    {
      "id": "INC-02",
      "periodo": "12/07/2026 – 31/07/2026",
      "dias": "14",
      "evento": "Reorganización del personal de la Oficina de Racionalización",
      "efecto": "Paralización de actividades",
      "area": "Cronograma"
    },
    {
      "id": "INC-03",
      "periodo": "01/07/2026 – 31/07/2026",
      "dias": "—",
      "evento": "Ausencia temporal de la jefatura por causa de fuerza mayor",
      "efecto": "Las contrataciones acordadas no se hicieron efectivas",
      "area": "Recursos"
    },
    {
      "id": "INC-04",
      "periodo": "12/07/2026 – 31/07/2026",
      "dias": "—",
      "evento": "Renuncia de personal sin reemplazo durante el mes",
      "efecto": "Se detuvo la revisión de las encuestas",
      "area": "Recursos"
    },
    {
      "id": "INC-05",
      "periodo": "20/04/2026 – 20/04/2026",
      "dias": "—",
      "evento": "Visita de pares evaluadores para evaluación externa",
      "efecto": "Dificultó las reuniones con la OCCAA",
      "area": "Cronograma"
    },
    {
      "id": "INC-06",
      "periodo": "19/03/2026 – 20/03/2026",
      "dias": "2",
      "evento": "Semana Santa",
      "efecto": "Feriado institucional",
      "area": "Calendario"
    }
  ],
  "cambiosV1": [
    {
      "id": "D3-01",
      "correccion": "Cada subtarea declara su tarea padre con el código del cronograma. El indicador de PE.01 es T1.3.2.01 en ambos documentos."
    },
    {
      "id": "D3-02",
      "correccion": "Desaparece «Sub Tarea 1»: todas tienen correlativo único de dos dígitos."
    },
    {
      "id": "D3-03",
      "correccion": "Sin códigos repetidos. Las tres «Subtarea 31» son ahora S1.3.3.01.29, .30 y .31."
    },
    {
      "id": "D3-04",
      "correccion": "La fecha de inicio del proyecto es 01/06/2025, igual que en el cronograma."
    },
    {
      "id": "D3-05",
      "correccion": "Se abandona la plantilla de Excel: no hay fórmulas heredadas ni celdas #NAME?."
    },
    {
      "id": "D3-06",
      "correccion": "Las paralizaciones pasan al registro de incidencias, con días hábiles cuantificados."
    },
    {
      "id": "D3-07",
      "correccion": "Los riesgos de las observaciones pasan al registro de riesgos, con responsable y respuesta."
    },
    {
      "id": "D3-08",
      "correccion": "Un archivo por objeto: la bitácora ya no contiene el cronograma de visitas ni el de capacitación."
    },
    {
      "id": "D3-09",
      "correccion": "Las subtareas de PM.02 se separan de PE.03 y su indicador queda marcado como pendiente de redefinir."
    },
    {
      "id": "D3-10",
      "correccion": "Formato de fecha dd/mm/aaaa en todas las filas."
    }
  ]
};
