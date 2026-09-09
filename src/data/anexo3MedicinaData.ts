export interface Anexo3Directriz {
  numero: number;
  regla: string;
  descripcion: string;
  ejemplos?: string[];
}

export interface Anexo3SipocRow {
  id: string;
  proveedorCodigo?: string;
  proveedorNombre?: string;
  entradaCodigo?: string;
  entradaNombre?: string;
  procesoCodigo?: string;
  procesoNombre?: string;
  salidaCodigo?: string;
  salidaNombre?: string;
  beneficiarioCodigo?: string;
  beneficiarioNombre?: string;
}

export interface Anexo3FichaTecnica {
  codigo: string;
  nombre: string;
  responsable: string;
  tipo: 'ESTRATÉGICO' | 'MISIONAL' | 'SOPORTE';
  alcance?: string;
  version: string;
  vinculacion: string;
  objetivo: string;
  sipoc: Anexo3SipocRow[];
  recursos: {
    humanos?: string;
    fisicos?: string;
    equiposTecnologicos?: string;
    sistemasInformaticos?: string;
  };
  registros?: string;
  riesgos?: string;
  controles?: string;
  indicadores?: string;
}

export const ANEXO3_DIRECTRICES: Anexo3Directriz[] = [
  {
    numero: 1,
    regla: 'Regla Obligatoria: Fuente Tipográfica',
    descripcion: 'Toda información colocada debe ir con la fuente "Calibri".',
  },
  {
    numero: 2,
    regla: 'Regla Obligatoria: Codificación de Proveedores (Columna B)',
    descripcion:
      'Al completar la información de la columna B, correspondiente a "Proveedores", cada proveedor deberá consignarse utilizando su codificación correspondiente de acuerdo con la estructura: PR.XX_FYY (PR = Proveedor, XX = número correlativo, FYY = código de facultad, ej. F01). Cuando un mismo proveedor se repita en otra ficha técnica de la misma facultad, deberá conservarse la misma codificación asignada.',
    ejemplos: [
      'PR.01_F01 OFICINA DE PLANES Y PROGRAMAS - OGPL',
      'PR.02_F01 OFICINA DE RACIONALIZACIÓN - OGPL',
      'PR.03_F01 OFICINA DE PRESUPUESTO - OGPL',
    ],
  },
  {
    numero: 3,
    regla: 'Regla Obligatoria: Codificación de Entradas (Columna D)',
    descripcion:
      'En la columna D, correspondiente a "Entradas", se deberán registrar las normativas, leyes, reglamentos, directivas, guías u otros documentos que generen, regulen, orienten o establezcan disposiciones para el desarrollo del proceso, siguiendo la estructura EN.XX_FYY. Cuando una misma entrada se repita en otra ficha técnica de la misma facultad, deberá conservarse la misma codificación asignada.',
    ejemplos: [
      'EN.01_F01 GUÍA PARA EL PLANEAMIENTO INSTITUCIONAL - CEPLAN',
      'EN.02_F01 DIRECTIVA PARA LA FORMULACIÓN, SEGUIMIENTO Y EVALUACIÓN DE PLANES ESTRATÉGICOS DE LAS FACULTADES DE LA UNMSM',
      'EN.03_F01 NORMA TÉCNICA N.° 002-2025-PCM-SGP',
    ],
  },
  {
    numero: 4,
    regla: 'Regla Obligatoria: Procesos Nivel 1 en Celdas Independientes (Columna F)',
    descripcion:
      'En la columna F, correspondiente a "Procesos", se deberán registrar los procesos de Nivel 1, consignando su respectiva codificación y denominación de acuerdo con la estructura establecida. La numeración deberá mantener un orden correlativo y secuencial. Asimismo, cuando se cuente con más de un proceso, cada proceso deberá registrarse en una celda independiente, sin combinar o agrupar varios procesos en una sola celda.',
    ejemplos: [
      'PE.01.01_F01 GESTIÓN DE PLANES',
      'PE.01.02_F01 MODERNIZACIÓN DE LA FACULTAD',
      'PE.01.03_F01 GESTIÓN PRESUPUESTAL',
    ],
  },
  {
    numero: 5,
    regla: 'Regla Obligatoria: Salidas correspondientes al Anexo 1 (Columna H)',
    descripcion:
      'En la columna H, correspondiente a "Salidas", se deberán registrar únicamente los productos finales generados como resultado de cada proceso. Se debe completar con la codificación y denominación ya establecidas en el Anexo 1.',
    ejemplos: [
      'PE.01.01.01_F01 PLAN ESTRATÉGICO "FM"',
      'PE.01.01.02_F01 PLAN OPERATIVO "FM"',
    ],
  },
  {
    numero: 6,
    regla: 'Regla Obligatoria: Codificación de Beneficiarios (Columna J)',
    descripcion:
      'En la columna J, correspondiente a "Beneficiarios", se deberán registrar las personas, grupos, unidades orgánicas, entidades u otros destinatarios que se benefician o reciben los productos generados por el proceso, siguiendo la estructura BE.XX_FYY. Cuando un mismo beneficiario se repita en otra ficha técnica de la misma facultad, deberá conservarse la misma codificación asignada.',
    ejemplos: [
      'BE.01_F01 AUTORIDADES',
      'BE.02_F01 DOCENTES',
      'BE.03_F01 ADMINISTRATIVOS',
    ],
  },
  {
    numero: 7,
    regla: 'Regla Obligatoria: Registros y Productos Parciales',
    descripcion:
      'En el apartado de "Registros", se deberán consignar únicamente los productos parciales identificados en el Anexo 1. En caso de que se identifique un producto parcial adicional que no se encuentre registrado en dicho anexo, se deberá incorporar y consignar la misma denominación en ambos anexos.',
    ejemplos: [
      'PE.01.01_F01 GESTIÓN PLANES',
      'PE.02.02.01_F01 EXPEDIENTE DE VISITA EXTERNA COMPLETO',
    ],
  },
];

export const ANEXO3_FICHAS: Anexo3FichaTecnica[] = [
  {
    codigo: 'PE.01_F01',
    nombre: 'GESTIÓN ESTRATÉGICA',
    responsable: 'JEFE DE LA UNIDAD DE PLANIFICACIÓN, PRESUPUESTO Y RACIONALIZACIÓN',
    tipo: 'ESTRATÉGICO',
    alcance:
      'LO ESTABLECIDO EN LA PRESENTE FICHA COMPRENDE A TODAS LAS UNIDADES DE ORGANIZACIÓN DE LA FM DE LA UNMSM Y A LOS RESPONSABLES O DUEÑOS DE LOS PROCESOS IDENTIFICADOS.',
    version: '1',
    vinculacion: 'OEI.04 – MODERNIZAR LA GESTIÓN INTERNA',
    objetivo:
      'DIRIGIR Y ARTICULAR LA PLANIFICACIÓN, IMPLEMENTACIÓN, SEGUIMIENTO Y CONTROL DE LA ESTRATEGIA DE LA FACULTAD, PROMOVIENDO LA MODERNIZACIÓN DE LA GESTIÓN, LA FORMULACIÓN DE INSTRUMENTOS NORMATIVOS Y LA PROGRAMACIÓN EFICIENTE DE RECURSOS, CON EL PROPÓSITO DE ASEGURAR EL CUMPLIMIENTO DE LOS OBJETIVOS Y LA GENERACIÓN DE VALOR PÚBLICO.',
    sipoc: [
      {
        id: 'pe01-1',
        proveedorCodigo: 'PR.07_F01',
        proveedorNombre: 'OFICINA DE PLANES Y PROGRAMAS - OGPL',
        entradaCodigo: 'EN.11_F01',
        entradaNombre: 'GUÍA PARA EL PLANEAMIENTO INSTITUCIONAL - CEPLAN',
        procesoCodigo: 'PE.01.01_F01',
        procesoNombre: 'GESTIÓN PLANES',
        salidaCodigo: 'PE.01.01.01_F01\nPE.01.01.02_F01',
        salidaNombre: 'PLAN ESTRATÉGICO "FM"\nPLAN OPERATIVO "FM"',
        beneficiarioCodigo: 'BE.01_F01\nBE.02_F01\nBE.03_F01\nBE.04_F01\nBE.05_F01',
        beneficiarioNombre:
          'AUTORIDADES\nDOCENTES\nADMINISTRATIVOS\nESTUDIANTES\nOFICINA GENERAL DE PLANIFICACIÓN',
      },
      {
        id: 'pe01-2',
        proveedorCodigo: 'PR.07_F01',
        proveedorNombre: 'OFICINA DE PLANES Y PROGRAMAS - OGPL',
        entradaCodigo: 'EN.14_F01',
        entradaNombre:
          'DIRECTIVA PARA LA FORMULACIÓN, SEGUIMIENTO Y EVALUACIÓN DE PLANES ESTRATÉGICOS DE LAS FACULTADES DE LA UNMSM',
        procesoCodigo: 'PE.01.01_F01',
        procesoNombre: 'GESTIÓN PLANES',
        salidaCodigo: '',
        salidaNombre: '',
        beneficiarioCodigo: '',
        beneficiarioNombre: '',
      },
      {
        id: 'pe01-3',
        proveedorCodigo: 'PR.08_F01',
        proveedorNombre: 'OFICINA DE RACIONALIZACIÓN - OGPL',
        entradaCodigo: 'EN.15_F01',
        entradaNombre: 'NORMA TÉCNICA N° 002-2025-PCM-SGP',
        procesoCodigo: 'PE.01.02_F01',
        procesoNombre: 'MODERNIZACIÓN DE LA FACULTAD',
        salidaCodigo: 'PE.01.02.01_F01\nPE.01.02.02_F01',
        salidaNombre: 'MAGPROF APROBADO\nTARIFARIO ACTUALIZADO',
        beneficiarioCodigo: 'BE.01_F01\nBE.02_F01\nBE.03_F01\nBE.04_F01\nBE.05_F01',
        beneficiarioNombre:
          'AUTORIDADES\nDOCENTES\nADMINISTRATIVOS\nESTUDIANTES\nOFICINA GENERAL DE PLANIFICACIÓN',
      },
      {
        id: 'pe01-4',
        proveedorCodigo: 'PR.08_F01',
        proveedorNombre: 'OFICINA DE RACIONALIZACIÓN - OGPL',
        entradaCodigo: 'EN.16_F01',
        entradaNombre: 'NORMA TÉCNICA PARA LA GESTIÓN POR PROCESOS EN LAS ENTIDADES DE LA ADMINISTRACIÓN PÚBLICA',
        procesoCodigo: 'PE.01.02_F01',
        procesoNombre: 'MODERNIZACIÓN DE LA FACULTAD',
        salidaCodigo: '',
        salidaNombre: '',
        beneficiarioCodigo: '',
        beneficiarioNombre: '',
      },
      {
        id: 'pe01-5',
        proveedorCodigo: 'PR.08_F01',
        proveedorNombre: 'OFICINA DE RACIONALIZACIÓN - OGPL',
        entradaCodigo: 'EN.17_F01',
        entradaNombre: 'GUÍA PRÁCTICA DE IMPLEMENTACIÓN DE LA GESTIÓN POR PROCESOS EN FACULTADES FASE Nº 1',
        procesoCodigo: 'PE.01.02_F01',
        procesoNombre: 'MODERNIZACIÓN DE LA FACULTAD',
        salidaCodigo: '',
        salidaNombre: '',
        beneficiarioCodigo: '',
        beneficiarioNombre: '',
      },
      {
        id: 'pe01-6',
        proveedorCodigo: 'PR.09_F01',
        proveedorNombre: 'OFICINA DE PRESUPUESTO - OGPL',
        entradaCodigo: 'EN.18_F01',
        entradaNombre: 'LEY DE PRESUPUESTO',
        procesoCodigo: 'PE.01.03_F01',
        procesoNombre: 'GESTIÓN PRESUPUESTAL',
        salidaCodigo: 'PE.01.03.01_F01',
        salidaNombre: 'MODIFICACIÓN PRESUPUESTAL APROBADA',
        beneficiarioCodigo: 'BE.01_F01\nBE.02_F01\nBE.03_F01\nBE.04_F01\nBE.05_F01',
        beneficiarioNombre:
          'AUTORIDADES\nDOCENTES\nADMINISTRATIVOS\nESTUDIANTES\nOFICINA GENERAL DE PLANIFICACIÓN',
      },
      {
        id: 'pe01-7',
        proveedorCodigo: 'PR.09_F01',
        proveedorNombre: 'OFICINA DE PRESUPUESTO - OGPL',
        entradaCodigo: 'EN.19_F01',
        entradaNombre: 'APROBACIÓN PIA RESOLUCIÓN RECTORAL',
        procesoCodigo: 'PE.01.03_F01',
        procesoNombre: 'GESTIÓN PRESUPUESTAL',
        salidaCodigo: '',
        salidaNombre: '',
        beneficiarioCodigo: '',
        beneficiarioNombre: '',
      },
    ],
    recursos: {
      humanos:
        'PERSONAL NO DOCENTE:\n • JEFE DE LA UNIDAD DE PLANIFICACIÓN, PRESUPUESTO Y RACIONALIZACIÓN\n • ASISTENTES ADMINISTRATIVOS DE LA UNIDAD DE PLANIFICACIÓN, PRESUPUESTO Y RACIONALIZACIÓN',
      fisicos: 'OFICINA ADMINISTRATIVA EQUIPADA',
      equiposTecnologicos: '• COMPUTADORA\n• IMPRESORA\n• ESCÁNER, ENTRE OTROS',
      sistemasInformaticos:
        'INTERNOS:\n • SISTEMA QUIPUCAMAYOC\n • CORREO INSTITUCIONAL\n EXTERNOS:\n • APLICATIVO CEPLAN',
    },
    registros: 'PE.01.01_F01 GESTIÓN PLANES',
    riesgos:
      'MODIFICACIONES NORMATIVAS (EN PARTICULAR, EN LA ESTRUCTURA ORGÁNICA DE LA FACULTAD).\nREDUCCIÓN DE PRESUPUESTO.\nACTIVIDADES PROGRAMADAS NO EJECUTADAS.\nSOPORTE TECNOLÓGICO.',
    controles: '• RESULTADOS DEL INDICADOR DE DESEMPEÑO DEL PROCESO',
    indicadores:
      'PORCENTAJE DE EJECUCIÓN PRESUPUESTAL\nPORCENTAJE DE CUMPLIMIENTO DE ACTIVIDADES\nÍNDICE DE CUMPLIMIENTO ESTRATÉGICO',
  },
  {
    codigo: 'PE.02_F01',
    nombre: 'GESTIÓN DE LA CALIDAD Y MEJORA CONTINUA',
    responsable: 'JEFE DE OFICINA DE CALIDAD ACADÉMICA Y ACREDITACIÓN',
    tipo: 'ESTRATÉGICO',
    alcance:
      'LO ESTABLECIDO EN LA PRESENTE FICHA COMPRENDE A TODAS LAS UNIDADES DE ORGANIZACIÓN DE LA FM DE LA UNMSM Y A LOS RESPONSABLES O DUEÑOS DE LOS PROCESOS IDENTIFICADOS.',
    version: '1',
    vinculacion: 'OE.01 - MEJORAR LA FORMACIÓN UNIVERSITARIA DE LOS ESTUDIANTES',
    objetivo:
      'GESTIONAR Y CONDUCIR LA MEJORA CONTINUA DEL SISTEMA DE GESTIÓN DE LA CALIDAD DE LA FACULTAD, MEDIANTE LA EJECUCIÓN DE PROCESOS DE AUTOEVALUACIÓN, ACREDITACIÓN Y CUMPLIMIENTO DE ESTÁNDARES NACIONALES E INTERNACIONALES; A FIN DE ASEGURAR LA EXCELENCIA ACADÉMICA, LA SOSTENIBILIDAD DE LOS PROGRAMAS Y LA SATISFACCIÓN DE SU COMUNIDAD',
    sipoc: [
      {
        id: 'pe02-1',
        proveedorCodigo: 'PR.10_F01',
        proveedorNombre: 'UNIDADES DE ORGANIZACIÓN DE LA FACULTAD',
        entradaCodigo: 'EN.20_F01',
        entradaNombre: 'DIRECTIVAS DE LA FACULTAD DE MEDICINA',
        procesoCodigo: 'PE.02.01_F01',
        procesoNombre: 'ASEGURAMIENTO DE LA CALIDAD',
        salidaCodigo: 'PE.02.01.01_F01\nPE.02.01.02_F01\nPE.02.01.03_F01',
        salidaNombre:
          'PROGRAMAS ACREDITADOS NACIONALES\nPROGRAMAS ACREDITADOS INTERNACIONALES\nRESOLUCIÓN DECANAL DE CONFORMACIÓN DEL COMITÉ',
        beneficiarioCodigo: 'BE.01_F01\nBE.02_F01\nBE.03_F01\nBE.04_F01\nBE.06_F01\nBE.07_F01\nBE.08_F01',
        beneficiarioNombre:
          'AUTORIDADES\nDOCENTES\nADMINISTRATIVOS\nESTUDIANTES\nOFICINA CENTRAL DE CALIDAD ACADÉMICA Y ACREDITACIÓN\nSINEACE\nSUNEDU',
      },
      {
        id: 'pe02-2',
        proveedorCodigo: 'PR.11_F01',
        proveedorNombre: 'OFICINA CENTRAL DE CALIDAD ACADÉMICA Y ACREDITACIÓN',
        entradaCodigo: 'EN.21_F01',
        entradaNombre: 'REQUERIMIENTOS DE LAS ESCUELAS PROFESIONALES DE LA FM',
        procesoCodigo: 'PE.02.01_F01',
        procesoNombre: 'ASEGURAMIENTO DE LA CALIDAD',
      },
      {
        id: 'pe02-3',
        entradaCodigo: 'EN.22_F01',
        entradaNombre: 'PLAN DE CALIDAD DE LA UNMSM',
        procesoCodigo: 'PE.02.01_F01',
        procesoNombre: 'ASEGURAMIENTO DE LA CALIDAD',
      },
      {
        id: 'pe02-4',
        proveedorCodigo: 'PR.12_F01',
        proveedorNombre: 'SINEACE',
        entradaCodigo: 'EN.23_F01',
        entradaNombre: 'NORMATIVAS DE ACREDITACIÓN',
        procesoCodigo: 'PE.02.02_F01',
        procesoNombre: 'AUTOEVALUACIÓN',
        salidaCodigo: 'PE.02.02.02_F01\nPE.02.02.04_F01',
        salidaNombre: 'PLANES DE MEJORA POST ACREDITACIÓN\nRESOLUCIÓN DEL SGC',
        beneficiarioCodigo: 'BE.01_F01\nBE.02_F01\nBE.03_F01\nBE.04_F01\nBE.06_F01\nBE.07_F01\nBE.08_F01',
        beneficiarioNombre:
          'AUTORIDADES\nDOCENTES\nADMINISTRATIVOS\nESTUDIANTES\nOFICINA CENTRAL DE CALIDAD ACADÉMICA Y ACREDITACIÓN\nSINEACE\nSUNEDU',
      },
      {
        id: 'pe02-5',
        proveedorCodigo: 'PR.13_F01',
        proveedorNombre: 'SUNEDU',
        entradaCodigo: 'EN.24_F01',
        entradaNombre: 'NORMATIVAS DE ESTÁNDARES DE CALIDAD',
        procesoCodigo: 'PE.02.02_F01',
        procesoNombre: 'AUTOEVALUACIÓN',
      },
    ],
    recursos: {
      humanos: 'PERSONAL DOCENTE:\n • JEFE DE LA OFICINA DE CALIDAD ACADÉMICA Y ACREDITACIÓN',
      fisicos: 'OFICINA ADMINISTRATIVA EQUIPADA',
      equiposTecnologicos: '• COMPUTADORA\n• IMPRESORA\n• ESCÁNER, ENTRE OTROS',
      sistemasInformaticos:
        'INTERNOS:\n • SISTEMA QUIPUCAMAYOC\n • CORREO INSTITUCIONAL\n EXTERNOS:\n • SINEACE',
    },
    registros:
      'PE.02.02.01_F01 EXPEDIENTE DE VISITA EXTERNA COMPLETO\nPE.02.02.03_F01 REPORTE DE SOCIALIZACIÓN DE RESULTADOS',
    controles:
      'REPORTE DE AVANCE DE AUTOEVALUACIÓN DE LAS ESCUELAS DE PREGRADO\nREPORTE DE AVANCE DE AUTOEVALUACIÓN DE LOS PROGRAMAS DE POSGRADO\nRESULTADOS DEL INDICADOR DE DESEMPEÑO DEL PROCESO',
    indicadores:
      'PORCENTAJE DE INFORMES DE AUTOEVALUACIÓN REMITIDOS\nNIVEL DE SATISFACCIÓN DE LOS PARTICIPANTES RESPECTO A LA CULTURA DE LA CALIDAD.',
  },
  {
    codigo: 'PE.03_F01',
    nombre: 'GESTIÓN DE RELACIONES INTERINSTITUCIONALES',
    responsable: 'DECANO DE FACULTAD',
    tipo: 'ESTRATÉGICO',
    alcance: 'Facultad de Medicina - Ámbito Nacional e Internacional',
    version: '1',
    vinculacion:
      'OEI.02 – FORTALECER LA INVESTIGACIÓN CIENTÍFICA, INNOVACIÓN, DESARROLLO, TRANSFERENCIA TECNOLÓGICA Y EMPRENDIMIENTO',
    objetivo:
      'GESTIONAR Y ARTICULAR LAS ALIANZAS ESTRATÉGICAS Y LA COOPERACIÓN TÉCNICA DE LA FACULTAD, MEDIANTE LA FORMALIZACIÓN DE CONVENIOS, REDES Y PROGRAMAS DE MOVILIDAD, ENTRE OTROS, CON LA FINALIDAD DE POTENCIAR LA CALIDAD ACADÉMICA, LA INVESTIGACIÓN Y EL POSICIONAMIENTO INSTITUCIONAL EN EL ÁMBITO NACIONAL E INTERNACIONAL.',
    sipoc: [
      {
        id: 'pe03-1',
        proveedorCodigo: 'PR.14_F01',
        proveedorNombre: 'UNIVERSIDADES / ENTIDADES NACIONALES E INTERNACIONALES',
        entradaCodigo: 'EN.25_F01',
        entradaNombre: 'PROPUESTAS DE CONVENIOS Y CARTAS DE INTENCIÓN',
        procesoCodigo: 'PE.03.01_F01',
        procesoNombre: 'GESTIÓN DE CONVENIOS',
        salidaCodigo: 'PE.03.01.01_F01',
        salidaNombre: 'CONVENIOS Y ALIANZAS SUSCRITAS',
        beneficiarioCodigo: 'BE.01_F01\nBE.02_F01\nBE.04_F01',
        beneficiarioNombre: 'AUTORIDADES\nDOCENTES\nESTUDIANTES',
      },
    ],
    recursos: {
      humanos: 'DECANATO, OFICINA DE COOPERACIÓN Y RELACIONES INTERINSTITUCIONALES',
      fisicos: 'OFICINA DE COOPERACIÓN EQUIPADA',
      equiposTecnologicos: 'COMPUTADORAS, CONEXIÓN DE RED',
      sistemasInformaticos: 'SISTEMA QUIPUCAMAYOC, CORREO INSTITUCIONAL',
    },
    registros:
      'PE.03.05_F01 INFORMES DE PARTICIPACIÓN Y RESULTADOS OBTENIDOS EN MOVILIDAD DOCENTE Y ESTUDIANTIL',
    indicadores:
      'PORCENTAJE DE PARTICIPACIÓN EN PROGRAMAS DE MOVILIDAD ACADÉMICA\nPORCENTAJE DE VARIACIÓN DE CONVENIOS ACTIVOS MENSUALES',
  },
  {
    codigo: 'PM.01_F01',
    nombre: 'GESTIÓN DE LA FORMACIÓN ACADÉMICA',
    responsable: 'VICEDECANO ACADÉMICO DE PREGRADO',
    tipo: 'MISIONAL',
    version: '1',
    vinculacion: 'OEI.01 – GARANTIZAR LA CALIDAD DE LA FORMACIÓN INTEGRAL DE LOS ESTUDIANTES',
    objetivo:
      'DIRIGIR Y GESTIONAR LA FORMACIÓN ACADÉMICA DE PREGRADO Y POSGRADO DE LA FACULTAD, MEDIANTE LA INNOVACIÓN CURRICULAR, EL DESARROLLO DOCENTE Y EL ACOMPAÑAMIENTO CONTINUO AL ESTUDIANTE Y EGRESADO, A FIN DE GARANTIZAR EL LOGRO DE COMPETENCIAS PROFESIONALES',
    sipoc: [
      {
        id: 'pm01-1',
        proveedorCodigo: 'PR.15_F01',
        proveedorNombre: 'DIRECCIÓN DE ESCUELAS PROFESIONALES',
        entradaCodigo: 'EN.26_F01',
        entradaNombre: 'PLANES DE ESTUDIO Y MALLAS CURRICULARES ACTUALIZADAS',
        procesoCodigo: 'PM.01.01_F01',
        procesoNombre: 'PLANIFICACIÓN CURRICULAR',
        salidaCodigo: 'PM.01.01.01_F01',
        salidaNombre: 'PLANES DE ESTUDIO APROBADOS POR CONSEJO DE FACULTAD',
        beneficiarioCodigo: 'BE.02_F01\nBE.04_F01',
        beneficiarioNombre: 'DOCENTES\nESTUDIANTES',
      },
    ],
    recursos: {
      humanos: 'VICEDECANATO ACADÉMICO, DIRECTORES DE ESCUELAS, DOCENTES',
      fisicos: 'AULAS, LABORATORIOS CLÍNICOS Y SIMULACIÓN MÉDICA',
      equiposTecnologicos: 'EQUIPAMIENTO BIOMÉDICO Y TECNOLOGÍA EDUCATIVA',
      sistemasInformaticos: 'SISTEMA ÚNICO DE MATRÍCULA (SUM), CLASSROOM / AULA VIRTUAL',
    },
    indicadores:
      'PORCENTAJE DE ESTUDIANTES APROBADOS QUE REALIZARON EL INTERCAMBIO ACADÉMICO\nPORCENTAJE DE CURSOS ACADÉMICOS NO CUBIERTOS POR DOCENTES ORDINARIOS\nPORCENTAJE DE ESTUDIANTES DESAPROBADOS POR CICLO ACADÉMICO',
  },
  {
    codigo: 'PM.02_F01',
    nombre: 'GESTIÓN DE LA INVESTIGACIÓN',
    responsable: 'VICEDECANATO DE INVESTIGACIÓN Y POSGRADO',
    tipo: 'MISIONAL',
    version: '1',
    vinculacion:
      'OEI.02 – FORTALECER LA INVESTIGACIÓN CIENTÍFICA, INNOVACIÓN, DESARROLLO, TRANSFERENCIA TECNOLÓGICA Y EMPRENDIMIENTO',
    objetivo:
      'GESTIONAR Y PROMOVER LA GENERACIÓN DE CONOCIMIENTO CIENTÍFICO, EL DESARROLLO TECNOLÓGICO Y LA INNOVACIÓN, MEDIANTE EL FORTALECIMIENTO DE GRUPOS DE INVESTIGACIÓN DE LA FACULTAD, EL ASEGURAMIENTO DE LA PRODUCCIÓN CIENTÍFICA, A FIN DE CONTRIBUIR AL DESARROLLO SOSTENIBLE Y A LA SOLUCIÓN DE PROBLEMAS SOCIALES.',
    sipoc: [
      {
        id: 'pm02-1',
        proveedorCodigo: 'PR.16_F01',
        proveedorNombre: 'VICERRECTORADO DE INVESTIGACIÓN Y POSGRADO (VRIP)',
        entradaCodigo: 'EN.27_F01',
        entradaNombre: 'BASES DE CONCURSOS Y FONDOS CONCURSABLES DE INVESTIGACIÓN',
        procesoCodigo: 'PM.02.01_F01',
        procesoNombre: 'GESTIÓN DE PROYECTOS DE INVESTIGACIÓN',
        salidaCodigo: 'PM.02.01.01_F01',
        salidaNombre: 'PROYECTOS Y ARTÍCULOS CIENTÍFICOS PUBLICADOS EN SCOPUS/WOS',
        beneficiarioCodigo: 'BE.02_F01\nBE.04_F01\nBE.09_F01',
        beneficiarioNombre: 'DOCENTES INVESTIGADORES\nESTUDIANTES\nCOMUNIDAD CIENTÍFICA',
      },
    ],
    recursos: {
      humanos: 'VICEDECANATO DE INVESTIGACIÓN, INSTITUTO DE MEDICINA TROPICAL, DOCENTES INVESTIGADORES',
      fisicos: 'LABORATORIOS DE INVESTIGACIÓN BIOMÉDICA',
      equiposTecnologicos: 'EQUIPOS CIENTÍFICOS DE ALTA PRECISIÓN',
      sistemasInformaticos: 'RAIS UNMSM, PLATAFORMA REGINA/RENACYT',
    },
    indicadores: 'PORCENTAJE DE TALLERES ACTIVOS\nNÚMERO DE PUBLICACIONES EN REVISTAS INDEXADAS',
  },
  {
    codigo: 'PM.03_01',
    nombre: 'GESTIÓN DE LA RESPONSABILIDAD Y VINCULACIÓN SOCIAL',
    responsable: 'JEFE DE CENTRO DE RESPONSABILIDAD SOCIAL Y EXTENSIÓN UNIVERSITARIA',
    tipo: 'MISIONAL',
    version: '1',
    vinculacion: 'OEI.03 – 3 FORTALECER LA RESPONSABILIDAD SOCIAL EN BENEFICIO DE LA SOCIEDAD.',
    objetivo:
      'GESTIONAR Y FORTALECER LA VINCULACIÓN ESTRATÉGICA DE LA FACULTAD CON EL ESTADO, LA EMPRESA Y LA SOCIEDAD CIVIL; MEDIANTE PROGRAMAS DE RESPONSABILIDAD SOCIAL, EXTENSIÓN UNIVERSITARIA Y PROYECCIÓN SOCIAL; A FIN DE CONTRIBUIR AL DESARROLLO SOSTENIBLE Y LA FORMACIÓN INTEGRAL CON COMPROMISO ÉTICO.',
    sipoc: [
      {
        id: 'pm03-1',
        proveedorCodigo: 'PR.17_F01',
        proveedorNombre: 'DGPS / COMUNIDAD Y REDES DE SALUD',
        entradaCodigo: 'EN.28_F01',
        entradaNombre: 'DEMANDAS DE INTERVENCIÓN EN SALUD PÚBLICA',
        procesoCodigo: 'PM.03.01_F01',
        procesoNombre: 'PROYECCIÓN Y EXTENSIÓN EN SALUD',
        salidaCodigo: 'PM.03.01.01_F01',
        salidaNombre: 'CAMPAÑAS Y PROGRAMAS DE SALUD COMUNITARIA EJECUTADOS',
        beneficiarioCodigo: 'BE.10_F01',
        beneficiarioNombre: 'POBLACIÓN VULNERABLE Y COMUNIDAD EN GENERAL',
      },
    ],
    recursos: {
      humanos: 'PERSONAL CERSEU, DOCENTES Y ESTUDIANTES VOLUNTARIOS',
      fisicos: 'MÓDULOS DE ATENCIÓN Y ESPACIOS COMUNITARIOS',
      equiposTecnologicos: 'EQUIPAMIENTO DE ATENCIÓN BÁSICA',
      sistemasInformaticos: 'REGISTRO DE BENEFICIARIOS CERSEU',
    },
    indicadores:
      'NÚMERO DE EVENTOS ACADÉMICOS REALIZADOS\nPORCENTAJE DE PROYECTOS DE PROYECCIÓN SOCIAL APROBADOS',
  },
  {
    codigo: 'PS.01',
    nombre: 'GESTIÓN DE ADMISIÓN Y MATRÍCULA',
    responsable: 'JEFE DE UNIDAD DE MATRÍCULA, REGISTRO ACADÉMICO, GRADOS Y TÍTULOS',
    tipo: 'SOPORTE',
    version: '1',
    vinculacion: 'OEI.01 – GARANTIZAR LA CALIDAD DE LA FORMACIÓN INTEGRAL DE LOS ESTUDIANTES',
    objetivo:
      'GESTIONAR Y EJECUTAR LOS PROCESOS DE ADMISIÓN E INSCRIPCIÓN DE MATRÍCULA; MEDIANTE EL CUMPLIMIENTO ESTRICTO DEL CRONOGRAMA ACADÉMICO Y LA NORMATIVA INSTITUCIONAL; A FIN DE GARANTIZAR LA FORMALIZACIÓN DEL INGRESO, LA CONTINUIDAD DE LOS ESTUDIOS Y LA TRANSPARENCIA EN EL ACCESO A LA FACULTAD.',
    sipoc: [
      {
        id: 'ps01-1',
        proveedorCodigo: 'PR.18_F01',
        proveedorNombre: 'OFICINA CENTRAL DE ADMISIÓN (OCA) / SUM',
        entradaCodigo: 'EN.29_F01',
        entradaNombre: 'RELACIÓN DE INGRESANTES Y CRONOGRAMA GENERAL DE MATRÍCULA',
        procesoCodigo: 'PS.01.01_F01',
        procesoNombre: 'INSCRIPCIÓN Y REGISTRO DE MATRÍCULA',
        salidaCodigo: 'PS.01.01.01_F01',
        salidaNombre: 'PADRÓN DE ESTUDIANTES MATRICULADOS OFICIAL',
        beneficiarioCodigo: 'BE.04_F01',
        beneficiarioNombre: 'ESTUDIANTES DE PREGRADO Y POSGRADO',
      },
    ],
    recursos: {
      humanos: 'JEFE DE UNIDAD DE MATRÍCULA, REGISTRO ACADÉMICO, ASISTENTES',
      fisicos: 'VENTANILLAS DE ATENCIÓN Y ARCHIVO DE ACTAS',
      equiposTecnologicos: 'COMPUTADORAS E IMPRESORAS DE SEGURIDAD',
      sistemasInformaticos: 'SISTEMA ÚNICO DE MATRÍCULA (SUM), QUIPUCAMAYOC',
    },
    indicadores:
      'PORCENTAJE DE ALUMNOS QUE DESERTAN\nPORCENTAJE DE ESTUDIANTES QUE RETORNAN A ESTUDIAR',
  },
  {
    codigo: 'PS.02_F01',
    nombre: 'GESTIÓN DOCUMENTAL',
    responsable: 'JEFE DE UNIDAD DE TRÁMITE DOCUMENTARIO Y ARCHIVO',
    tipo: 'SOPORTE',
    version: '1',
    vinculacion: 'OEI.04 – MODERNIZAR LA GESTIÓN INTERNA',
    objetivo:
      'GESTIONAR INTEGRALMENTE EL PATRIMONIO DOCUMENTAL DE LA FACULTAD, MEDIANTE LA ADMINISTRACIÓN EFICIENTE DEL TRÁMITE DOCUMENTARIO Y LA ORGANIZACIÓN DE ARCHIVOS, A FIN DE ASEGURAR LA TRAZABILIDAD, CUSTODIA Y EL ACCESO OPORTUNO A LA INFORMACIÓN PARA SUS USUARIOS, DENTRO DEL ÁMBITO ADMINISTRATIVO QUE CORRESPONDE AL PROCESO.',
    sipoc: [
      {
        id: 'ps02-1',
        proveedorCodigo: 'PR.19_F01',
        proveedorNombre: 'USUARIOS INTERNOS Y EXTERNOS',
        entradaCodigo: 'EN.30_F01',
        entradaNombre: 'EXPEDIENTES, SOLICITUDES Y OFICIOS',
        procesoCodigo: 'PS.02.01_F01',
        procesoNombre: 'RECEPCIÓN, DERIVACIÓN Y ARCHIVO DOCUMENTAL',
        salidaCodigo: 'PS.02.01.01_F01',
        salidaNombre: 'DOCUMENTOS DERIVADOS Y NOTIFICADOS / CARPETA ARCHIVADA',
        beneficiarioCodigo: 'BE.01_F01\nBE.02_F01\nBE.03_F01\nBE.04_F01',
        beneficiarioNombre: 'AUTORIDADES, DOCENTES, ADMINISTRATIVOS, ESTUDIANTES',
      },
    ],
    recursos: {
      humanos: 'PERSONAL DE MESA DE PARTES Y ARCHIVO CENTRAL',
      fisicos: 'MESA DE PARTES FÍSICA Y REPOSITORIO DE ARCHIVOS',
      equiposTecnologicos: 'ESCÁNERES DE ALTA VELOCIDAD Y TERMINALES DE ATENCIÓN',
      sistemasInformaticos: 'SISTEMA DE GESTIÓN DOCUMENTAL (SGD / SISGEDO)',
    },
    indicadores: 'PORCENTAJE DE EXPEDIENTES OBSERVADOS POR LA UNIDAD USUARIA',
  },
  {
    codigo: 'PS.03_F01',
    nombre: 'GESTIÓN DE BIENESTAR INTEGRAL',
    responsable: 'JEFE DE UNIDAD DE BIENESTAR',
    tipo: 'SOPORTE',
    version: '1',
    vinculacion: 'OEI.01 – GARANTIZAR LA CALIDAD DE LA FORMACIÓN INTEGRAL DE LOS ESTUDIANTES',
    objetivo:
      'GARANTIZAR EL BIENESTAR INTEGRAL DE LOS ESTUDIANTES, DOCENTES Y ADMINISTRATIVOS DE LA FACULTAD; MEDIANTE LA ARTICULACIÓN DE PROGRAMAS DE INTEGRACIÓN SOCIAL, ASISTENCIA PSICOLÓGICA, ASESORAMIENTO ACADÉMICO Y PROMOCIÓN CULTURAL; A FIN DE FORTALECER LA ESTABILIDAD EMOCIONAL, EL RENDIMIENTO ACADÉMICO Y EL DESARROLLO HUMANO INTEGRAL DE LA COMUNIDAD INTERNA',
    sipoc: [
      {
        id: 'ps03-1',
        proveedorCodigo: 'PR.20_F01',
        proveedorNombre: 'DIRECCIÓN GENERAL DE BIENESTAR UNIVERSITARIO (OGBU)',
        entradaCodigo: 'EN.31_F01',
        entradaNombre: 'DIRECTIVAS DE ATENCIÓN MÉDICA, PSICOLÓGICA Y BECAS',
        procesoCodigo: 'PS.03.01_F01',
        procesoNombre: 'ASISTENCIA PSICOPEDAGÓGICA Y SOCIAL',
        salidaCodigo: 'PS.03.01.01_F01',
        salidaNombre: 'REPORTES DE TAMIZAJE Y ATENCIONES CONCLUIDAS',
        beneficiarioCodigo: 'BE.02_F01\nBE.03_F01\nBE.04_F01',
        beneficiarioNombre: 'DOCENTES, ADMINISTRATIVOS, ESTUDIANTES',
      },
    ],
    recursos: {
      humanos: 'ASISTENTES SOCIALES, PSICÓLOGOS, MÉDICOS GENERALES',
      fisicos: 'TÓPICO DE SALUD Y CONSULTORIOS DE PSICOLOGÍA',
      equiposTecnologicos: 'EQUIPOS MÉDICOS DE DIAGNÓSTICO PREVENTIVO',
      sistemasInformaticos: 'SISTEMA DE GESTIÓN DE ATENCIÓN DE BIENESTAR',
    },
    indicadores:
      'DISTRIBUCIÓN PORCENTUAL DE CAUSAS DE REPITENCIA IDENTIFICADAS EN EL TAMIZAJE PSICOLÓGICO',
  },
  {
    codigo: 'PS.04_F01',
    nombre: 'GESTIÓN DE RECURSOS ECONÓMICOS',
    responsable: 'JEFE DE UNIDAD DE ECONOMÍA',
    tipo: 'SOPORTE',
    version: '1',
    vinculacion: 'OEI.04 – MODERNIZAR LA GESTIÓN INTERNA',
    objetivo:
      'ADMINISTRAR Y CONTROLAR LOS RECURSOS ECONÓMICOS DE LA FACULTAD, MEDIANTE LA GESTIÓN DE LA RECAUDACIÓN, LA FISCALIZACIÓN DE INGRESOS Y EGRESOS, Y EL REGISTRO CONTABLE, A FIN DE ASEGURAR LA TRANSPARENCIA, LA LEGALIDAD EN EL USO DE LOS FONDOS Y LA SOSTENIBILIDAD OPERATIVA.',
    sipoc: [
      {
        id: 'ps04-1',
        proveedorCodigo: 'PR.21_F01',
        proveedorNombre: 'DGA - DIRECCIÓN GENERAL DE ADMINISTRACIÓN',
        entradaCodigo: 'EN.32_F01',
        entradaNombre: 'NORMAS DE TESORERÍA, RECAUDACIÓN Y CIERRE FISCAL',
        procesoCodigo: 'PS.04.01_F01',
        procesoNombre: 'RECAUDACIÓN, PAGO Y RENDICIÓN CONTABLE',
        salidaCodigo: 'PS.04.01.01_F01',
        salidaNombre: 'ESTADOS FINANCIEROS Y BALANCES DE EJECUCIÓN ECONÓMICA',
        beneficiarioCodigo: 'BE.01_F01\nBE.05_F01',
        beneficiarioNombre: 'AUTORIDADES DE FACULTAD, OGPL / DGA',
      },
    ],
    recursos: {
      humanos: 'CONTADORES, CAJEROS, ASISTENTES ECONÓMICOS',
      fisicos: 'OFICINA DE ECONOMÍA Y CAJA DE COBRANZAS',
      equiposTecnologicos: 'TERMINALES POS, COMPUTADORAS, IMPRESORAS TÉRMICAS',
      sistemasInformaticos: 'SISTEMA INTEGRADO QUIPUCAMAYOC, SIAF-SP',
    },
    indicadores: 'MONTO TOTAL DE CUENTAS POR COBRAR PENDIENTES',
  },
  {
    codigo: 'PS.05_F01',
    nombre: 'GESTIÓN DE RECURSOS HUMANOS',
    responsable: 'JEFE DE UNIDAD DE PERSONAL',
    tipo: 'SOPORTE',
    version: '1',
    vinculacion: 'OEI.04 – MODERNIZAR LA GESTIÓN INTERNA',
    objetivo:
      'ADMINISTRAR Y CONTROLAR LA DISPONIBILIDAD Y PERMANENCIA DEL PERSONAL DOCENTE Y ADMINISTRATIVO, MEDIANTE LA GESTIÓN DE REQUERIMIENTOS DE PLAZAS, LA FISCALIZACIÓN DE ASISTENCIA Y EL REPORTE DE INCIDENCIAS, A FIN DE ASEGURAR LA CONTINUIDAD OPERATIVA DE LA FACULTAD, EL CUMPLIMIENTO DE LA NORMATIVA LABORAL Y EL CORRECTO PROCESAMIENTO DE PLANILLAS.',
    sipoc: [
      {
        id: 'ps05-1',
        proveedorCodigo: 'PR.22_F01',
        proveedorNombre: 'OFICINA GENERAL DE RECURSOS HUMANOS (OGRRH)',
        entradaCodigo: 'EN.33_F01',
        entradaNombre: 'DIRECTIVAS DE ASISTENCIA, CONTRATACIÓN Y EVALUACIÓN LABORAL',
        procesoCodigo: 'PS.05.01_F01',
        procesoNombre: 'CONTROL DE ASISTENCIA Y GESTIÓN DEL TALENTO',
        salidaCodigo: 'PS.05.01.01_F01',
        salidaNombre: 'REPORTES MENSUALES DE ASISTENCIA Y REMISIÓN DE PLANILLAS',
        beneficiarioCodigo: 'BE.02_F01\nBE.03_F01',
        beneficiarioNombre: 'DOCENTES Y PERSONAL ADMINISTRATIVO',
      },
    ],
    recursos: {
      humanos: 'JEFE DE PERSONAL, ESPECIALISTAS EN CONTROL DE ASISTENCIA',
      fisicos: 'OFICINA DE PERSONAL Y RELOJES BIOMÉTRICOS',
      equiposTecnologicos: 'RELOJES BIOMÉTRICOS, COMPUTADORAS',
      sistemasInformaticos: 'SISTEMA DE ASISTENCIA BIOMÉTRICA, QUIPUCAMAYOC',
    },
    indicadores: 'PORCENTAJE DE PERSONAL CON MÁS DE TRES INASISTENCIAS MENSUALES.',
  },
  {
    codigo: 'PS.06_F01',
    nombre: 'GESTIÓN DE ABASTECIMIENTO Y SERVICIOS',
    responsable: 'JEFE DE UNIDAD DE SERVICIOS GENERALES, OPERACIONES Y MANTENIMIENTO',
    tipo: 'SOPORTE',
    version: '1',
    vinculacion: 'OEI.04 – MODERNIZAR LA GESTIÓN INTERNA',
    objetivo:
      'GESTIONAR Y ASEGURAR EL ABASTECIMIENTO DE BIENES Y SERVICIOS, ASÍ COMO EL MANTENIMIENTO DE LA INFRAESTRUCTURA Y EQUIPAMIENTO; MEDIANTE LA PROGRAMACIÓN, ADQUISICIÓN, ALMACENAMIENTO, DISTRIBUCIÓN, EJECUCIÓN DE SERVICIOS Y CONTROL PATRIMONIAL; A FIN DE GARANTIZAR LA DISPONIBILIDAD, FUNCIONALIDAD DE LOS RECURSOS NECESARIOS PARA LA OPERATIVIDAD DE LA FACULTAD,',
    sipoc: [
      {
        id: 'ps06-1',
        proveedorCodigo: 'PR.23_F01',
        proveedorNombre: 'PROVEEDORES EXTERNOS / OFICINA GENERAL DE ABASTECIMIENTO',
        entradaCodigo: 'EN.34_F01',
        entradaNombre: 'CUADRO DE NECESIDADES Y PEDIDOS DE COMPRA (PECAS)',
        procesoCodigo: 'PS.06.01_F01',
        procesoNombre: 'ADQUISICIONES, ALMACÉN Y MANTENIMIENTO',
        salidaCodigo: 'PS.06.01.01_F01',
        salidaNombre: 'BIENES ENTREGADOS Y MANTENIMIENTOS CONCLUIDOS',
        beneficiarioCodigo: 'BE.01_F01\nBE.02_F01\nBE.03_F01',
        beneficiarioNombre: 'TODAS LAS UNIDADES ORGÁNICAS DE LA FACULTAD',
      },
    ],
    recursos: {
      humanos: 'JEFE DE SERVICIOS GENERALES, TÉCNICOS DE MANTENIMIENTO, ALMACENERO',
      fisicos: 'ALMACÉN GENERAL Y TALLERES DE MANTENIMIENTO',
      equiposTecnologicos: 'HERRAMIENTAS DE MANTENIMIENTO Y EQUIPOS DE CARGA',
      sistemasInformaticos: 'SISTEMA SIGA-MEF, QUIPUCAMAYOC',
    },
    indicadores: 'NÚMERO DE ORDENES DE COMPRAS',
  },
  {
    codigo: 'PS.07_F01',
    nombre: 'GESTIÓN DE TECNOLOGÍA DE LA INFORMACIÓN',
    responsable: 'JEFE DE UNIDAD DE ESTADÍSTICA E INFORMÁTICA',
    tipo: 'SOPORTE',
    version: '1',
    vinculacion: 'OEI.04 – MODERNIZAR LA GESTIÓN INTERNA',
    objetivo:
      'GESTIONAR Y BRINDAR SOPORTE A LOS RECURSOS TECNOLÓGICOS Y SISTEMAS DE INFORMACIÓN DE LA FACULTAD, MEDIANTE LA ADMINISTRACIÓN DE LABORATORIOS DE CÓMPUTO, EQUIPOS Y SOFTWARE, LA ATENCIÓN A USUARIOS, Y LA GESTIÓN DE DATOS, PLATAFORMAS Y HERRAMIENTAS DIGITALES INSTITUCIONALES, A FIN DE ASEGURAR LA DISPONIBILIDAD, OPERATIVIDAD, SEGURIDAD Y CONTINUIDAD DE LAS ACTIVIDADES ACADÉMICAS, DE INVESTIGACIÓN Y ADMINISTRATIVAS.',
    sipoc: [
      {
        id: 'ps07-1',
        proveedorCodigo: 'PR.24_F01',
        proveedorNombre: 'RED TELEMÁTICA UNMSM / PROVEEDORES DE ENLACE',
        entradaCodigo: 'EN.35_F01',
        entradaNombre: 'SOLICITUDES DE SOPORTE TÉCNICO Y POLÍTICAS DE SEGURIDAD TI',
        procesoCodigo: 'PS.07.01_F01',
        procesoNombre: 'SOPORTE TÉCNICO, REDES Y DIGITALIZACIÓN',
        salidaCodigo: 'PS.07.01.01_F01',
        salidaNombre: 'EQUIPOS OPERATIVOS, RED SEGURA Y PLATAFORMAS DIGITALES',
        beneficiarioCodigo: 'BE.01_F01\nBE.02_F01\nBE.03_F01\nBE.04_F01',
        beneficiarioNombre: 'COMUNIDAD UNIVERSITARIA DE LA FACULTAD DE MEDICINA',
      },
    ],
    recursos: {
      humanos: 'INGENIEROS DE SISTEMAS, TÉCNICOS DE RED Y SOPORTE',
      fisicos: 'CENTRO DE DATOS Y LABORATORIOS INFORMÁTICOS',
      equiposTecnologicos: 'SERVIDORES, SWITCHES, ROUTERS, HERRAMIENTAS DE DIAGNÓSTICO',
      sistemasInformaticos: 'SISTEMA DE TICKETS DE SOPORTE, GLPI, PLATAFORMAS VIRTUALES',
    },
    indicadores:
      'PORCENTAJE DE EQUIPOS CON FALLAS POST-MANTENIMIENTO PREVENTIVO\nNÚMERO DE PROYECTOS DE DIGITALIZACIÓN EJECUTADOS',
  },
  {
    codigo: 'PS.08_F01',
    nombre: 'GESTIÓN DE ACTIVIDADES PRODUCTIVAS',
    responsable: 'JEFE DEL CENTRO DE PRODUCCIÓN DE BIENES Y/O SERVICIOS',
    tipo: 'SOPORTE',
    version: '1',
    vinculacion:
      'OEI.02 – FORTALECER LA INVESTIGACIÓN CIENTÍFICA, INNOVACIÓN, DESARROLLO, TRANSFERENCIA TECNOLÓGICA Y EMPRENDIMIENTO DE LA UNIVERSIDAD.',
    objetivo:
      'GESTIONAR LA PRODUCCIÓN DE BIENES Y LA PRESTACIÓN DE SERVICIOS DE LA FACULTAD, MEDIANTE LA IDENTIFICACIÓN DE LA DEMANDA DEL MERCADO, A FIN DE FORTALECER EL PROCESO DE ENSEÑANZA-APRENDIZAJE, INTEGRAR A LA COMUNIDAD INTERNA Y ASEGURAR LA GENERACIÓN DE RECURSOS.',
    sipoc: [
      {
        id: 'ps08-1',
        proveedorCodigo: 'PR.25_F01',
        proveedorNombre: 'CENTROS DE DIAGNÓSTICO Y LABORATORIOS PRODUCTIVOS',
        entradaCodigo: 'EN.36_F01',
        entradaNombre: 'SOLICITUDES DE SERVICIOS ESPECIALIZADOS DE SALUD',
        procesoCodigo: 'PS.08.01_F01',
        procesoNombre: 'PRESTACIÓN DE SERVICIOS DE SALUD Y CAPACITACIÓN',
        salidaCodigo: 'PS.08.01.01_F01',
        salidaNombre: 'INFORMES DE RESULTADOS CLÍNICOS Y CERTIFICADOS EMITIDOS',
        beneficiarioCodigo: 'BE.11_F01',
        beneficiarioNombre: 'USUARIOS PARTICULARES E INSTITUCIONES DE SALUD',
      },
    ],
    recursos: {
      humanos: 'MÉDICOS ESPECIALISTAS, BIÓLOGOS, ASISTENTES DE LABORATORIO',
      fisicos: 'LABORATORIOS CLÍNICOS PRODUCTIVOS Y CENTROS DE ATENCIÓN',
      equiposTecnologicos: 'ANALIZADORES BIOQUÍMICOS, MICROSCOPIOS Y REACTIVOS',
      sistemasInformaticos: 'SISTEMA DE FACTURACIÓN Y EMISIÓN DE RESULTADOS',
    },
    indicadores: 'CUMPLIMIENTO DE METAS DE RECAUDACIÓN Y VOLUMEN DE SERVICIOS PRESTADOS',
  },
  {
    codigo: 'PS.09_F01',
    nombre: 'GESTIÓN DE RECURSOS BIBLIOGRÁFICOS',
    responsable: 'JEFE DE UNIDAD DE BIBLIOTECA, HEMEROTECA Y CENTRO DE DOCUMENTACIÓN',
    tipo: 'SOPORTE',
    version: '1',
    vinculacion: 'OEI.01 – GARANTIZAR LA CALIDAD DE LA FORMACIÓN INTEGRAL DE LOS ESTUDIANTES',
    objetivo:
      'GESTIONAR Y PROPORCIONAR EL ACCESO A RECURSOS BIBLIOGRÁFICOS DE FORMA FÍSICA Y DIGITAL; MEDIANTE LA ADMINISTRACIÓN DE COLECCIONES, BASES DE DATOS Y SERVICIOS DE BIBLIOTECA; A FIN DE GARANTIZAR LA DISPONIBILIDAD DE MATERIAL ACTUALIZADO QUE SOPORTE LA DOCENCIA, LA INVESTIGACIÓN Y LA FORMACIÓN CONTINUA EN LA FACULTAD.',
    sipoc: [
      {
        id: 'ps09-1',
        proveedorCodigo: 'PR.26_F01',
        proveedorNombre: 'EDITORIALES MÉDICAS / BASES DE DATOS CIENTÍFICAS',
        entradaCodigo: 'EN.37_F01',
        entradaNombre: 'SUSCRIPCIONES A REVISTAS CIENTÍFICAS Y COMPRA DE TEXTOS',
        procesoCodigo: 'PS.09.01_F01',
        procesoNombre: 'CATALOGACIÓN, PRÉSTAMO Y ACCESO A BASES DE DATOS',
        salidaCodigo: 'PS.09.01.01_F01',
        salidaNombre: 'ATENCIONES EN SALA Y ACCESOS A RECURSOS VIRTUALES',
        beneficiarioCodigo: 'BE.02_F01\nBE.04_F01',
        beneficiarioNombre: 'DOCENTES, INVESTIGADORES Y ESTUDIANTES',
      },
    ],
    recursos: {
      humanos: 'BIBLIOTECÓLOGOS Y AUXILIARES DE BIBLIOTECA',
      fisicos: 'SALAS DE LECTURA, HEMEROTECA Y REPOSITORIO HISTÓRICO',
      equiposTecnologicos: 'TERMINALES DE BÚSQUEDA Y LECTORES DE CÓDIGOS',
      sistemasInformaticos: 'SISTEMA KOHA UNMSM, CYBERTESIS, PUBMED, CLINICALKEY',
    },
    indicadores: 'PORCENTAJE DE ESTUDIANTES QUE NO DEVUELVEN EL MATERIAL BIBLIOGRÁFICO',
  },
  {
    codigo: 'PS.10_F01',
    nombre: 'GESTIÓN DE LA COMUNICACIÓN',
    responsable: 'ASESOR DE DECANATO',
    tipo: 'SOPORTE',
    version: '1',
    vinculacion: 'OEI.03 – 3 FORTALECER LA RESPONSABILIDAD SOCIAL EN BENEFICIO DE LA SOCIEDAD.',
    objetivo:
      'GESTIONAR Y ARTICULAR LAS COMUNICACIONES E IMAGEN DE LA FACULTAD, ADMINISTRANDO LOS CANALES DE DIFUSIÓN, EL PROTOCOLO Y LAS RELACIONES PÚBLICAS, A FIN DE FORTALECER LA REPUTACIÓN E IDENTIDAD ACADÉMICA Y GARANTIZAR LA TRANSPARENCIA INFORMATIVA HACIA LA COMUNIDAD Y LA SOCIEDAD.',
    sipoc: [
      {
        id: 'ps10-1',
        proveedorCodigo: 'PR.27_F01',
        proveedorNombre: 'UNIDADES ACADÉMICAS Y ADMINISTRATIVAS DE LA FACULTAD',
        entradaCodigo: 'EN.38_F01',
        entradaNombre: 'NOTAS DE PRENSA, CONVOCATORIAS Y ACTIVIDADES INSTITUCIONALES',
        procesoCodigo: 'PS.10.01_F01',
        procesoNombre: 'DIFUSIÓN, PRENSA Y RELACIONES PÚBLICAS',
        salidaCodigo: 'PS.10.01.01_F01',
        salidaNombre: 'COMUNICADOS OFICIALES, BOLETINES Y COBERTURA EN REDES',
        beneficiarioCodigo: 'BE.01_F01\nBE.02_F01\nBE.03_F01\nBE.04_F01\nBE.12_F01',
        beneficiarioNombre: 'COMUNIDAD INTERNA Y SOCIEDAD CIVIL',
      },
    ],
    recursos: {
      humanos: 'COMUNICADORES SOCIALES, DISEÑADORES GRÁFICOS, FOTÓGRAFOS',
      fisicos: 'SALA DE PRENSA Y PROTOCOLO',
      equiposTecnologicos: 'CÁMARAS FOTOGRÁFICAS, EQUIPO DE ILUMINACIÓN Y AUDIO',
      sistemasInformaticos: 'PORTAL WEB FM UNMSM, REDES SOCIALES OFICIALES',
    },
    indicadores: 'ALCANCE MENSUAL DE PUBLICACIONES Y NÚMERO DE COMUNICADOS DIFUNDIDOS',
  },
];
