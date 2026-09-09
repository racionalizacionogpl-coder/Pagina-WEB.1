// Extracción completa, fidedigna y estructurada de las 64 páginas de:
// GUÍA N°. 001-2025-OGPL-R/UNMSM
// "Guía Práctica de Implementación de la Gestión por Procesos en Facultades – FASE N° 1"
// Universidad Nacional Mayor de San Marcos - Oficina General de Planificación (OGPL) - Oficina de Racionalización

export interface GuiaSeccion {
  id: string;
  capitulo: string;
  titulo: string;
  subtitulo?: string;
  paginaPdf: number;
  contenido: {
    tipo: 'texto' | 'tabla' | 'callout_leo' | 'lista' | 'bpmn_elementos' | 'anexo' | 'creditos' | 'flujo';
    tituloBloque?: string;
    parrafos?: string[];
    itemsLista?: string[];
    mensajeLeo?: string;
    columnasTabla?: string[];
    filasTabla?: (string | { valor: string; destacado?: boolean })[][];
    enlaceExterno?: { texto: string; url: string };
    datosAdicionales?: Record<string, any>;
  }[];
}

export interface GuiaPractica001Data {
  codigo: string;
  titulo: string;
  subtitulo: string;
  resolucion: string;
  entidad: string;
  dependencia: string;
  subdependencia: string;
  autoridades: {
    jefeOgpl: string;
    equipoAdministrativo: string[];
    disenoDiagramacion: string[];
    elaboracionAprobacion: string;
  };
  fecha: string;
  version: string;
  urlOficialDocs?: string;
  secciones: GuiaSeccion[];
}

export const GUIA_PRACTICA_001_DATA: GuiaPractica001Data = {
  codigo: 'GUÍA N°. 001-2025-OGPL-R/UNMSM',
  titulo: 'Guía Práctica de Implementación de la Gestión por Procesos en Facultades – FASE N° 1',
  subtitulo: 'Guía práctica para la identificación e implementación de procesos en las 20 Facultades de la UNMSM',
  resolucion: 'Resolución Rectoral N° 009248-2025-R/UNMSM / Directiva OGPL',
  entidad: 'Universidad Nacional Mayor de San Marcos (Universidad del Perú, Decana de América)',
  dependencia: 'Oficina General de Planificación (OGPL)',
  subdependencia: 'Oficina de Racionalización (OR)',
  fecha: '04/03/2026',
  version: '1.0 Oficial (Fase 1)',
  autoridades: {
    jefeOgpl: 'CPC Heiner Armando Chávez Andrade',
    equipoAdministrativo: [
      'Elizabeth Castillo Espinoza',
      'Alvaro Rojas Carnero',
      'Axel Giuseppe Vargas Barrios',
      'John Diego Chancahuana Castillo',
    ],
    disenoDiagramacion: ['John Diego Chancahuana Castillo'],
    elaboracionAprobacion: 'Oficina de Racionalización',
  },
  secciones: [
    {
      id: 'portada-creditos',
      capitulo: 'Portada e Institucionalidad',
      titulo: 'Carátula y Créditos Oficiales',
      paginaPdf: 1,
      contenido: [
        {
          tipo: 'creditos',
          tituloBloque: 'Ficha Técnica Institucional del Documento',
          parrafos: [
            'UNIVERSIDAD NACIONAL MAYOR DE SAN MARCOS (Decana de América)',
            'Oficina General de Planificación · Oficina de Racionalización',
            'GUÍA N°. 001-2025-OGPL-R/UNMSM',
            'Guía Práctica de Implementación de la Gestión por Procesos en Facultades – FASE N° 1',
            'Firmado digitalmente por CHAVEZ ANDRADE Heiner Armando FAU 20148092282 soft. Motivo: Autor del documento. Fecha: 04.03.2026',
          ],
        },
        {
          tipo: 'callout_leo',
          tituloBloque: 'Acompañante Oficial de la Guía: Leo',
          mensajeLeo:
            '¡Hola! Mi nombre es Leo y seré tu acompañante a lo largo de esta guía. Te ayudaré a comprender la Gestión por Procesos para su implementación en tu facultad, compartiendo buenas prácticas y notas útiles. Apareceré de vez en cuando para aclarar dudas y resaltar aspectos clave que te ayuden a aplicar los conceptos de manera clara y ordenada.',
        },
      ],
    },
    {
      id: 'indice-presentacion',
      capitulo: 'Contenido y Presentación',
      titulo: 'Presentación de la Guía',
      paginaPdf: 6,
      contenido: [
        {
          tipo: 'texto',
          tituloBloque: '¿Qué es y cuál es el propósito de la Guía?',
          parrafos: [
            'La Guía práctica para la gestión por procesos en las facultades de la UNMSM —en adelante, la Guía— tiene como propósito apoyar a los responsables de procesos y unidades encargadas de la elaboración del Manual de Gestión por Procesos de las Facultades (MAGPROF), en el desarrollo de los documentos y tareas correspondientes a la fase "Planear", establecida en la Norma Técnica N.º 002-2025-PCM/SGP, orientada a la identificación de productos y procesos.',
          ],
        },
        {
          tipo: 'texto',
          tituloBloque: '¿Qué encontrarás en esta Guía?',
          parrafos: [
            'En estas páginas encontrarás lineamientos, herramientas y ejemplos prácticos para la identificación, diseño y validación de productos y procesos. Asimismo, se incluyen formatos y plantillas de apoyo, tales como el inventario de productos, la ficha de producto y proceso y el formato de procedimiento, entre otros; que facilitan la articulación de la gestión por procesos en cada facultad.',
          ],
        },
        {
          tipo: 'lista',
          tituloBloque: '¿Qué comprende esta Guía? (Fase 1: Planear - Ciclo de Deming)',
          itemsLista: [
            'a. Identificar productos',
            'b. Determinar procesos',
            'c. Documentar procesos',
            'd. Aprobar la documentación de procesos',
          ],
        },
      ],
    },
    {
      id: 'aspectos-generales',
      capitulo: 'I. Aspectos Generales',
      titulo: 'Objetivo, Alcance y Base Normativa',
      paginaPdf: 8,
      contenido: [
        {
          tipo: 'texto',
          tituloBloque: '1. Objetivo',
          parrafos: [
            'Brindar el marco metodológico y soporte técnico para que las facultades implementen la gestión por procesos en su primera fase —según la Norma Técnica N.º 002-2025-PCM/SGP—, facilitando la identificación y documentación de procesos.',
          ],
        },
        {
          tipo: 'texto',
          tituloBloque: '2. Alcance',
          parrafos: [
            'Lo establecido en el presente documento está dirigido a los responsables de procesos y unidades encargadas de la gestión por procesos en las facultades de la UNMSM.',
          ],
        },
        {
          tipo: 'lista',
          tituloBloque: '3. Base Normativa Legal e Institucional',
          itemsLista: [
            'Ley N° 27658, Ley Marco de Modernización de la Gestión del Estado y sus modificatorias.',
            'Ley N° 30220, Ley Universitaria y sus modificatorias.',
            'Decreto Supremo N° 030-2002-PCM, que aprueba el Reglamento de la Ley Marco de Modernización de la Gestión del Estado.',
            'Decreto Supremo N° 123-2018-PCM, que aprueba el Reglamento del Sistema Administrativo de Modernización de la Gestión Pública.',
            'Decreto Supremo N° 103-2022-PCM, que aprueba la Política Nacional de Modernización de la Gestión Pública al 2030.',
            'Resolución de Secretaría de Gestión Pública N.º 002-2025-PCM/SGP, que aprueba la Norma Técnica N° 002-2025-PCM/SGP.',
            'Resolución de Secretaría de Gestión Pública N.° 009-2025-PCM-SGP, que aprueba los Lineamientos Nº 001-2025-PCM/SGP "Guía práctica para la Gestión por Procesos en las entidades de la Administración Pública".',
            'Resolución Rectoral N° 009248-2025-R/UNMSM, que aprueba el Plan Estratégico Institucional (PEI) 2026–2030 de la Universidad Nacional Mayor de San Marcos, y sus modificatorias.',
          ],
        },
      ],
    },
    {
      id: 'marco-conceptual-fundamentos',
      capitulo: 'II. Marco Conceptual',
      titulo: '1. Fundamentos: ¿Qué es un proceso? y Modelo SIPOC',
      paginaPdf: 9,
      contenido: [
        {
          tipo: 'texto',
          tituloBloque: '1.1 ¿Qué es un proceso?',
          parrafos: [
            'Conjunto de actividades interrelacionadas que transforma elementos de entrada en salidas, con el propósito de alcanzar un objetivo y generar valor para las partes interesadas. La estructura de un proceso comprende los siguientes elementos:',
          ],
        },
        {
          tipo: 'lista',
          tituloBloque: 'Elementos Estructurales del Proceso',
          itemsLista: [
            'Entradas: Son las necesidades y expectativas de las personas a quienes está dirigido el proceso; estas pueden ser de naturaleza tangible o intangible.',
            'Actividades: Son las acciones coordinadas que permiten la transformación de las entradas en productos o servicios.',
            'Productos (Parcial o Final): Son los resultados generados por un proceso, cuya finalidad es satisfacer las necesidades de las partes interesadas. Producto parcial: Salida que no satisface directamente la necesidad, pero contribuye al logro del producto final (ej. plan o informe). Producto final: Salida que satisface directamente la necesidad (ej. servicio de atención psicológica).',
            'Beneficiarios (Interno o Externo): Son los actores que reciben el resultado del proceso y valoran si cumple sus expectativas. Interno: Unidad orgánica de la facultad (ej. Unidad de Economía). Externo: Persona u oficina ajena a la facultad (ej. oficina central, estudiantes, egresados).',
            'Proveedores (Interno o Externo): Son los agentes que suministran las entradas necesarias para la ejecución del proceso.',
          ],
        },
        {
          tipo: 'callout_leo',
          tituloBloque: 'Consejo de Leo sobre Generar Valor',
          mensajeLeo:
            'Cuando hablamos de generar valor, nos referimos al beneficio que siente el usuario cuando logramos solucionar su problema o cumplir con lo que esperaba de nosotros. ¡Es nuestra meta principal!',
        },
        {
          tipo: 'texto',
          tituloBloque: 'Metodología SIPOC (Supplier, Input, Process, Output, Customer)',
          parrafos: [
            'Esta estructura coincide con la metodología SIPOC, un estándar internacional cuyo nombre es un acrónimo en inglés de sus cinco componentes: Proveedores (Supplier), Entradas (Input), Proceso (Process), Salidas (Output) y Beneficiarios (Customer).',
            'El valor del modelo SIPOC reside en su capacidad para esquematizar el flujo de trabajo, permitiendo visualizar, en una sola mirada, la ruta que siguen los insumos hasta transformarse en el resultado final.',
            'En la gestión pública, el uso de esta herramienta es fundamental para evitar el "aislamiento" de las áreas. Permite entender que una oficina produce el insumo necesario para que otra pueda trabajar, fortaleciendo así la articulación institucional.',
            'El SIPOC sirve como el cimiento sobre el cual se construirá la Ficha de Caracterización.',
          ],
        },
        {
          tipo: 'callout_leo',
          tituloBloque: 'Consejo de Leo sobre el SIPOC',
          mensajeLeo:
            '¡No te compliques! El SIPOC es simplemente una herramienta para aclarar el panorama: te ayuda a identificar quién te entrega la información, qué haces con ella y quién es el usuario que finalmente recibe tu producto. Si logras entender este flujo, completar la documentación técnica será mucho más sencillo.',
        },
      ],
    },
    {
      id: 'clasificacion-procesos',
      capitulo: 'II. Marco Conceptual',
      titulo: '1.2 Clasificación de Procesos: Criterio Jerárquico y Funcional',
      paginaPdf: 11,
      contenido: [
        {
          tipo: 'texto',
          tituloBloque: 'A. Criterio Jerárquico',
          parrafos: [
            'Permite desagregar los procesos desde una visión general hasta el mayor nivel de detalle, en función de la naturaleza de las actividades y su operatividad.',
          ],
        },
        {
          tipo: 'lista',
          tituloBloque: 'Jerarquía de Procesos UNMSM',
          itemsLista: [
            'Macroproceso (Nivel 0): Proceso de mayor amplitud (ej. Gestión Estratégica, Formación Académica).',
            'Subproceso (Nivel 1, 2, ...): Proceso desagregado de otro, según complejidad respecto al nivel 0 (ej. Gestión Curricular).',
            'Actividad: Conjunto de tareas interrelacionadas y secuenciales que generan productos parciales o registros (ej. Diseño curricular).',
            'Tarea: Unidad mínima de trabajo (ej. firmar la aprobación).',
          ],
        },
        {
          tipo: 'callout_leo',
          tituloBloque: 'Nota de Leo sobre el Registro',
          mensajeLeo:
            'El registro es solo la evidencia (física o virtual) de que la tarea se realizó. Como su función es solo documentar el trabajo, no se considera un producto final ni genera valor directo para el beneficiario.',
        },
        {
          tipo: 'texto',
          tituloBloque: '¿Cuándo es Subproceso vs Cuándo es Actividad?',
          parrafos: [
            'Se considera subproceso cuando presenta: Autonomía (se gestiona con responsable, recursos e indicadores propios), Orientación al valor (contribuye a la misión institucional), Delimitación (inicio y fin definidos con entradas y salidas coherentes), y Complejidad (bajo nivel de operatividad y alto carácter transversal).',
            'Si la desagregación solo representa una etapa dentro del flujo —sin autonomía ni contacto directo con el beneficiario y con un nivel medio de operatividad—, se considera una actividad.',
          ],
        },
        {
          tipo: 'texto',
          tituloBloque: 'B. Criterio Funcional',
          parrafos: [
            'Permite clasificar los procesos según la finalidad que cumplen en la entidad para satisfacer las necesidades de los clientes:',
            '1. Procesos Estratégicos (PE): Definen la planificación, políticas y estrategias de la Facultad (ej. Gestión Estratégica, Calidad).',
            '2. Procesos Misionales (PM): Generan los bienes o servicios principales que dan razón de ser a la institución (ej. Gestión de la Formación Académica, Investigación, Responsabilidad Social).',
            '3. Procesos de Soporte (PS): Proporcionan los recursos y el apoyo necesario para que los demás procesos funcionen (ej. Bienestar Integral, Economía, Abastecimiento, TIC).',
          ],
        },
      ],
    },
    {
      id: 'procedimientos-gobernanza',
      capitulo: 'II. Marco Conceptual',
      titulo: '1.3 Procedimientos, Gestión por Procesos y Gobernanza',
      paginaPdf: 13,
      contenido: [
        {
          tipo: 'texto',
          tituloBloque: '1.3 ¿Qué es un procedimiento? y el MAPRO',
          parrafos: [
            'Es el conjunto de instrucciones detalladas para ejecutar un proceso o actividad. Este se materializa como un documento que establece de forma ordenada las tareas, su secuencia y los responsables de su ejecución.',
            'Sirve para garantizar que las actividades se realicen de forma controlada y estandarizada, asegurando calidad y coherencia en los resultados.',
            'Los procedimientos se elaboran únicamente para procesos de último nivel —aquellos que se desagregan directamente en actividades—. Bajo esta premisa, el Manual de Procedimientos (MAPRO) agrupa todos los procedimientos de la Facultad según formatos oficiales aprobados por la UNMSM.',
          ],
        },
        {
          tipo: 'lista',
          tituloBloque: '¿Cuándo elaborar un procedimiento? (Criterios)',
          itemsLista: [
            'No estar regulado por norma interna.',
            'Ser un proceso complejo o técnico.',
            'Involucrar personal diverso.',
            'Tener una alta carga operativa.',
            'Carecer de automatización.',
            'Contar con personal de alta rotación o baja experiencia.',
          ],
        },
        {
          tipo: 'texto',
          tituloBloque: '2. Gestión por Procesos: Beneficios e Implementación',
          parrafos: [
            'Es una metodología que optimiza el trabajo desde un enfoque sistémico y transversal, orientando los procesos a generar valor y satisfacer las necesidades de los beneficiarios.',
            'Beneficios: Objetivos (cumplimiento eficiente de metas), Optimización (reducción de recursos, tiempos y costos), Calidad (estandarización), Productividad (rendimiento), Transparencia (toma de decisiones basada en datos), Bienestar (mejora del entorno laboral).',
            'Se implementa en cuatro fases del Ciclo de Deming: 1. Identificación de productos y procesos, 2. Implementación de procesos, 3. Evaluación de productos y procesos, 4. Mejora de productos y procesos.',
          ],
        },
        {
          tipo: 'lista',
          tituloBloque: '3. Gobernanza y los 7 Pilares de APQC',
          itemsLista: [
            '1. Estrategia: Iniciativas alineadas con la visión y objetivos estratégicos.',
            '2. Gobierno: Estructura de roles para despliegue y propiedad de procesos.',
            '3. Cultura organizacional: Colaboración y capacitación continua.',
            '4. Modelamiento de procesos: Mapeo end-to-end con lenguaje común.',
            '5. Desempeño de procesos: Indicadores clave (KPI) para decisiones críticas.',
            '6. Mejora de procesos: Enfoque continuo (Six Sigma, Lean, Kaizen) sin desperdicios.',
            '7. Herramientas y tecnología: Modelado, automatización y BPMS.',
          ],
        },
      ],
    },
    {
      id: 'roles-glosario',
      capitulo: 'II. Marco Conceptual',
      titulo: '3.1 Roles en Facultad y 4. Glosario de Siglas',
      paginaPdf: 16,
      contenido: [
        {
          tipo: 'texto',
          tituloBloque: 'Estructura de Roles en la Facultad',
          parrafos: [
            'Conforme a la Norma Técnica N.º 002-2025-PCM/SGP y los Estatutos UNMSM:',
            'A. Máxima Autoridad Administrativa: El Decano (Art. 70 y 72 del Estatuto UNMSM). Supervisa y aprueba el Mapa de Procesos.',
            'B. Unidad Orgánica Encargada de la Gestión por Procesos: La Unidad de Planificación, Presupuesto y Racionalización (UPPR). Lidera, brinda asistencia técnica, custodia la documentación y canaliza consultas con la OGPL. (La OCAA brinda apoyo técnico en calidad pero no conduce administrativamente).',
            'C. Responsable del Proceso (Dueño del Proceso): Persona designada con competencia directa sobre el proceso. Funciones: Diseño y mejora, supervisión, control e indicadores, gestión de recursos, normatividad y consultas.',
          ],
        },
        {
          tipo: 'tabla',
          tituloBloque: '4. Glosario Oficial de Siglas UNMSM',
          columnasTabla: ['Sigla', 'Significado Oficial'],
          filasTabla: [
            ['MAGPROF', 'Manual de Gestión por Procesos de la Facultad'],
            ['MAPRO', 'Manual de Procedimientos'],
            ['OGPL', 'Oficina General de Planificación'],
            ['OR', 'Oficina de Racionalización'],
            ['PE', 'Procesos Estratégicos'],
            ['PM', 'Procesos Misionales'],
            ['PS', 'Procesos de Soporte'],
            ['OE', 'Objetivo Estratégico'],
            ['AE', 'Acción Estratégica'],
            ['AO', 'Acción Operativa'],
            ['CAP', 'Cuadro de Asignación de Personal'],
            ['UNMSM', 'Universidad Nacional Mayor de San Marcos'],
          ],
        },
      ],
    },
    {
      id: 'metodologia-productos',
      capitulo: 'III. Marco Metodológico',
      titulo: '1.1 Identificación de Productos: Planteamiento, Clasificación, Caracterización y Validación',
      paginaPdf: 19,
      contenido: [
        {
          tipo: 'texto',
          tituloBloque: 'Cuatro Pasos para la Identificación de Productos',
          parrafos: [
            'A. Planteamiento: Surgen de Instrumentos estratégicos (Acciones Estratégicas AE y Actividades Operativas AO) o Análisis interno. Pregunta orientadora: ¿Qué producto existe para el cumplimiento de esta AE/AO?',
            'B. Clasificación: Se clasifican en Bien (tangible: sílabos, diplomas), Servicio (intangible: clases, asesorías) o Regulación (instrumentos normativos: reglamentos, protocolos). Si no es ninguno, se descarta.',
          ],
        },
        {
          tipo: 'tabla',
          tituloBloque: 'C. Caracterización: Atributo de Calidad (5 Variables)',
          columnasTabla: ['Variable', 'Pregunta de Identificación'],
          filasTabla: [
            ['1. Tiempo de atención', '¿Los beneficiarios valoran que el producto se entregue con rapidez?'],
            ['2. Cumplimiento de plazos', '¿Los beneficiarios valoran que se respeten los tiempos establecidos?'],
            ['3. Claridad de la información', '¿Los beneficiarios valoran que la información sea clara?'],
            ['4. Trato recibido', '¿Los beneficiarios valoran recibir el producto con amabilidad?'],
            ['5. Facilidad de acceso', '¿Los beneficiarios valoran que el producto sea fácil de obtener?'],
          ],
        },
        {
          tipo: 'texto',
          tituloBloque: 'Atributo de Ente Rector y Regla de Validación',
          parrafos: [
            'Atributo de Ente Rector: Responde a la pregunta: ¿Este producto responde a una norma, directiva o mandato emitido por un ente superior (ej. SUNEDU, MINEDU, VRAP, VRIP)? Si es "Sí", posee atributo de ente rector.',
            'Regla de descarte: Si un producto no presenta atributo de calidad ni de ente rector, debe descartarse.',
          ],
        },
        {
          tipo: 'tabla',
          tituloBloque: 'D. Validación de Productos (5 Criterios Objetivos)',
          columnasTabla: ['Criterio de Validación', 'Pregunta Orientadora', 'Finalidad del Criterio'],
          filasTabla: [
            [
              '1. Contribuye a solucionar un problema público',
              '¿Este producto contribuye a la solución de algún problema público?',
              'Asegurar impacto en la mejora de una situación relevante para la comunidad.',
            ],
            [
              '2. Enmarcado en funciones sustantivas',
              '¿Tengo competencia legal para ofrecer este producto?',
              'Verificar que se encuentre dentro de las atribuciones legales de la facultad.',
            ],
            [
              '3. Cumplimiento de misión y estrategia',
              '¿El producto está alineado a mi estrategia institucional (PO/PE)?',
              'Confirmar la coherencia con los instrumentos de planeamiento.',
            ],
            [
              '4. Responde a necesidades de los beneficiarios',
              '¿Este producto beneficia a beneficiarios internos o externos de la facultad?',
              'Comprobar generación de valor público o utilidad directa.',
            ],
            [
              '5. Desarrollo y fortalecimiento de la facultad',
              '¿Este producto contribuye al desarrollo o fortalecimiento de la facultad?',
              'Validar que favorece la mejora continua y sostenibilidad institucional.',
            ],
          ],
        },
      ],
    },
    {
      id: 'metodologia-procesos',
      capitulo: 'III. Marco Metodológico',
      titulo: '1.2 Determinación de Procesos y Reglas de Codificación / Redacción',
      paginaPdf: 25,
      contenido: [
        {
          tipo: 'texto',
          tituloBloque: 'Determinación de Procesos: Criterio por Proceso vs Criterio por Producto',
          parrafos: [
            'Criterio por Proceso: Se parte de un macroproceso general (nivel 0) y se pregunta: ¿Qué se requiere lograr para cumplir el resultado del nivel superior? (ej. Formación académica → Gestión del desarrollo docente, Gestión curricular, Gestión de la enseñanza).',
            'Criterio por Producto: Se asignan los productos validados a los procesos de nivel 0, se agrupan funcionalmente y se proponen subprocesos de nivel 1 a más.',
          ],
        },
        {
          tipo: 'tabla',
          tituloBloque: 'Vinculación de Procesos con el Planeamiento Institucional',
          columnasTabla: ['Nivel en Gestión por Procesos', 'Planeamiento Institucional', 'Instrumento de Gestión'],
          filasTabla: [
            ['Proceso de nivel 0 (Macroproceso)', 'Objetivo Estratégico (OEI)', 'Plan Estratégico (PE)'],
            ['Proceso de nivel 1 (Subproceso)', 'Acción Estratégica (AEI)', 'Plan Estratégico (PE)'],
            ['Proceso de nivel 2 a más (Actividad)', 'Actividad Operativa (AO)', 'Plan Operativo (PO)'],
          ],
        },
        {
          tipo: 'lista',
          tituloBloque: 'Reglas Obligatorias de Redacción y Nomenclatura',
          itemsLista: [
            'Nombre de Proceso: Acción (Sustantivo derivado de verbo en "-ión") + Objeto/Materia (donde recae la acción). Ej: "Gestión de la enseñanza-aprendizaje".',
            'Estructura del Código: Primer prefijo: Tipo de proceso (PE / PM / PS). Segundo prefijo: Correlativo de nivel 0 (.01). Tercer prefijo: Correlativo de nivel 1 (.02). Cuarto prefijo: Nivel 2 (.03).',
            'Objetivo del Proceso: Fórmula = Resultado (qué busca lograr) + Medio (qué medios incorporará) + Valor Agregado (qué valor aporta a los beneficiarios).',
            'Nombre del Producto: Sustantivo (entregable) + Complemento (especificación). Ej: "Servicio de capacitación docente", "Sílabo de asignatura".',
          ],
        },
      ],
    },
    {
      id: 'diseno-bpmn',
      capitulo: 'III. Marco Metodológico',
      titulo: 'C. Diseño de Procesos y Notación BPMN 2.0',
      paginaPdf: 31,
      contenido: [
        {
          tipo: 'texto',
          tituloBloque: 'Modelado en Notación BPMN 2.0',
          parrafos: [
            'Para mantener la estandarización entre las 20 facultades de la UNMSM, se emplea la notación Business Process Model and Notation (BPMN 2.0) en la elaboración de flujogramas.',
          ],
        },
        {
          tipo: 'bpmn_elementos',
          tituloBloque: 'Elementos Oficiales de Notación BPMN 2.0',
          parrafos: [
            '1. Evento de Inicio (Círculo verde delgado): Disparador que inicia el proceso (ej. recepción de expediente).',
            '2. Actividad / Tarea (Rectángulo con esquinas redondeadas): Paso concreto donde se transforma una entrada en salida. Verbo en infinitivo + objeto.',
            '3. Subproceso (Rectángulo con símbolo [+]): Proceso desagregado de otro nivel.',
            '4. Evento Intermedio (Doble círculo): Suceso o espera durante la ejecución.',
            '5. Compuerta Lógica (Rombo): Punto de decisión condicional (exclusiva, paralela).',
            '6. Evento de Fin (Círculo rojo grueso): Conclusión del proceso y entrega del producto.',
            '7. Flujo de Secuencia (Flecha sólida continua): Orden cronológico de izquierda a derecha.',
            '8. Flujo de Mensaje (Línea discontinua con círculo de origen): Comunicación interinstitucional con otros Pools (ej. Rectorado, OGPL, OCAA).',
            '9. Asociación (Línea punteada): Vinculación de artefactos y registros con las tareas.',
            '10. Pool (Piscina): Contenedor principal que representa a la organización o proceso.',
            '11. Lane (Carril): Partición horizontal dentro del Pool para asignar responsabilidades funcionales.',
            '12. Objeto de Datos: Ícono de página para representar registros documentales físicos o virtuales.',
            '13. Depósito de Datos: Contenedor cilíndrico para bases de datos o sistemas de información permanentes.',
          ],
        },
        {
          tipo: 'lista',
          tituloBloque: 'Reglas de Diagramación de Estilo UNMSM',
          itemsLista: [
            'El flujo lógico siempre debe diagramarse estrictamente de izquierda a derecha.',
            'Todo proceso debe diagramarse completamente dentro de un contenedor (Pool). Nunca fuera.',
            'Defina tantos contenedores como procesos independientes. Siempre debe haber al menos un contenedor.',
            'Cada actividad debe iniciar con verbo en infinitivo seguido de un objeto (ej. "Redactar informe", "Firmar resolución").',
          ],
        },
      ],
    },
    {
      id: 'documentacion-fichas',
      capitulo: 'III. Marco Metodológico',
      titulo: '1.3 Documentación Normada: Fichas, Inventarios e Indicadores',
      paginaPdf: 36,
      contenido: [
        {
          tipo: 'lista',
          tituloBloque: 'Los 5 Instrumentos Técnicos Normados (Norma Técnica N° 002-2025-PCM/SGP)',
          itemsLista: [
            '1. Mapa de Procesos: Gráfica general con procesos estratégicos, misionales y de soporte.',
            '2. Inventario de Productos y Procesos: Matriz ordenada de procesos Nivel 0, Nivel 1 y productos.',
            '3. Ficha Técnica de Producto y Proceso: Caracterización completa con definición, descripción SIPOC, gestión y recursos.',
            '4. Ficha de Indicador de Proceso: Definición métrica, fórmula, periodicidad, rangos de semaforización (Riesgo, Estable, Óptimo) y seguimiento.',
            '5. Formato de Procedimiento: Desglose secuencial paso a paso de tareas, responsables y tiempos.',
          ],
        },
        {
          tipo: 'tabla',
          tituloBloque: 'Ficha Técnica Modelo: PM.01 Gestión de la Formación Académica',
          columnasTabla: ['Campo', 'Detalle Técnico'],
          filasTabla: [
            ['Nombre', 'Gestión de la Formación Académica'],
            ['Código', 'PM.01'],
            ['Dueño del Proceso', 'Vicedecano Académico'],
            ['Tipo', 'Misional'],
            ['Versión', '001'],
            ['Vinculación', 'OE.01 Mejorar la formación universitaria de los estudiantes'],
            [
              'Objetivo',
              'Implementar una gestión académica para los estudiantes que fomente la innovación curricular, asegure la calidad de los procesos educativos y promueva el seguimiento de egresados.',
            ],
            [
              'Alcance',
              'Inicia con el diseño y actualización del plan curricular y termina con el seguimiento de egresados.',
            ],
            ['Proveedores', 'VRAP, VRIP, Vicedecanato Académico, Escuelas Profesionales, OCAA'],
            ['Entradas', 'Solicitud de actualización curricular, sílabos aprobados, historial académico'],
            ['Salidas / Productos', 'Planes de estudio actualizados, cursos dictados, alertas académicas, egresados capacitados'],
            ['Beneficiarios', 'Estudiantes de pregrado y posgrado, egresados, comunidad universitaria'],
            ['Recursos Humanos', 'Vicedecano Académico, Directores de Escuelas Profesionales, Plana Docente'],
            ['Recursos Informáticos', 'SUM (Sistema Único de Matrícula), Aula Virtual Google Classroom, Biblioteca Virtual'],
          ],
        },
      ],
    },
    {
      id: 'aprobacion-proceso',
      capitulo: 'III. Marco Metodológico',
      titulo: '1.4 Aprobación de la Documentación en 4 Pasos Clave',
      paginaPdf: 46,
      contenido: [
        {
          tipo: 'tabla',
          tituloBloque: 'Etapas de Aprobación del MAGPROF',
          columnasTabla: ['Etapa', 'Responsable(s)', 'Acciones Clave', 'Resultado / Documento'],
          filasTabla: [
            [
              '1. Consolidar y Verificación',
              'UPPR o OCAA de la Facultad',
              'Consolidar el MAGPROF. Verificar notación BPMN y alineación al PEI. Verificar firmas en señal de conformidad.',
              'Conformidad técnica (Fichas e indicadores firmados)',
            ],
            [
              '2. Opinión Técnica',
              'Oficina de Racionalización (OGPL)',
              'Verificar coherencia metodológica institucional. Asegurar que no existan duplicidades de procesos en la universidad.',
              'Opinión Técnica Favorable',
            ],
            [
              '3. Aprobación',
              'Decano y Consejo de Facultad',
              'El Decano presenta la propuesta al Consejo de Facultad. El Consejo aprueba formalmente el MAGPROF.',
              'Resolución Decanal de Aprobación y publicación',
            ],
            [
              '4. Ratificación',
              'Dirección General de Administración (DGA)',
              'Revisar cumplimiento de normas administrativas transversales de la universidad y ratificar lo aprobado.',
              'Resolución Directoral de la DGA de ratificación',
            ],
          ],
        },
        {
          tipo: 'callout_leo',
          tituloBloque: 'Mensaje de Cierre de Leo',
          mensajeLeo:
            '¡Felicidades! Ya tienen todo lo necesario para arrancar con la gestión por procesos. Si algo se les traba, siempre pueden volver a revisar esta guía o comunicarse con la Oficina de Racionalización para darles una mano con la asistencia técnica. ¡Un gusto trabajar con ustedes!',
        },
      ],
    },
    {
      id: 'anexos-oficiales',
      capitulo: 'IV. Anexos Oficiales',
      titulo: 'Los 7 Anexos Oficiales y Plantillas en la Nube (Google Sheets / Docs)',
      paginaPdf: 55,
      contenido: [
        {
          tipo: 'anexo',
          tituloBloque: 'Anexo 1: Listado de Productos Validados',
          parrafos: [
            'Estructura: N°, Producto propuesto, Fuente, Clasificación, Atributos, Variables de calidad, Criterios de validación.',
          ],
          enlaceExterno: {
            texto: 'Abrir Anexo 1 en Google Sheets',
            url: 'https://docs.google.com/spreadsheets/d/1IdbcV-JwsslkBdM2xmDqpEFNbGGePwOmS7UgjFEEU_Q/edit?usp=sharing',
          },
        },
        {
          tipo: 'anexo',
          tituloBloque: 'Anexo 2: Inventario de Productos y Procesos',
          parrafos: [
            'Estructura: Tipo de Proceso (Estratégico, Misional, Soporte), N° Código Nivel 0, Proceso Nivel 0, N° Código Nivel 1, Proceso Nivel 1, N° Código Nivel 2, Proceso Nivel 2, Productos.',
          ],
          enlaceExterno: {
            texto: 'Abrir Anexo 2 en Google Sheets',
            url: 'https://docs.google.com/spreadsheets/d/1AOHxWCkIp7919H8gRhPUfJwQIE1dzcCjdtmspNuPEdY/edit?usp=sharing',
          },
        },
        {
          tipo: 'anexo',
          tituloBloque: 'Anexo 3: Ficha Técnica de Producto y Proceso',
          parrafos: [
            'Estructura: Definición del proceso (Nombre, Código, Dueño, Tipo, Versión, Alcance, Vinculación, Objetivo), Descripción del proceso (Proveedores, Entradas, Proceso, Salidas, Beneficiarios), Ejecución (Recursos humanos, físicos, tecnológicos, informáticos, registros, riesgos, controles) y Formalización.',
          ],
          enlaceExterno: {
            texto: 'Abrir Anexo 3 en Google Sheets',
            url: 'https://docs.google.com/spreadsheets/d/1zMxQGWllzVlKNDrq1GRqILFllDKPjIV_Ao78lhG1l18/edit?usp=sharing',
          },
        },
        {
          tipo: 'anexo',
          tituloBloque: 'Anexo 4: Ficha de Indicador de Producto o Proceso',
          parrafos: [
            'Estructura: Proceso, Código, Responsable, Versión, Objetivo, Nombre de indicador, Meta, Rangos semafóricos (<75% Riesgo, 75%-90% Aceptable, >=90% Óptimo), Variables, Fórmula, Frecuencia, Tabla de Seguimiento y Gráfica.',
          ],
          enlaceExterno: {
            texto: 'Abrir Anexo 4 en Google Sheets',
            url: 'https://docs.google.com/spreadsheets/d/1O_tiR3qxKpZd6Q9vFC_Mq0gZh_by3qhqTOgKGHLprs/edit?usp=sharing',
          },
        },
        {
          tipo: 'anexo',
          tituloBloque: 'Anexo 5: Formato de Procedimiento',
          parrafos: [
            'Estructura: Proceso, Código, Nombre, Versión, Tabla de tareas (N°, Descripción de la tarea con verbos en infinitivo, Predecesor, Responsable) y Firmas de elaboración, revisión y aprobación.',
          ],
          enlaceExterno: {
            texto: 'Abrir Anexo 5 en Google Sheets',
            url: 'https://docs.google.com/spreadsheets/d/1_oy2ubWuqTLfiqJX8EW6l4L76Q6PkgWCZdKTACqK68/edit?usp=sharing',
          },
        },
        {
          tipo: 'anexo',
          tituloBloque: 'Anexo 6: Plantilla de Identificación de Productos',
          parrafos: [
            'Estructura: Planteamiento, Clasificación (Bien, Servicio, Regulación), Caracterización (Atributos de calidad y ente rector), Validación (5 criterios objetivos) y Resultado final.',
          ],
          enlaceExterno: {
            texto: 'Abrir Anexo 6 en Google Docs',
            url: 'https://docs.google.com/document/d/15KcVvD7IsBsH-YX8Mvo3vYK3hra45EqWE7s_vGYrD0/edit?usp=sharing',
          },
        },
        {
          tipo: 'anexo',
          tituloBloque: 'Anexo 7: Matriz de Identificación de Dueños de Procesos',
          parrafos: [
            'Estructura: Nivel de proceso, Criterios de evaluación (Autoridad 30%, Interés 25%, Influencia 20%, Conocimiento 15%, Participación 10%), Calificación de candidatos (Vicedecano Académico, Vicedecano de Investigación, Decano) y Ponderaciones.',
          ],
          enlaceExterno: {
            texto: 'Abrir Anexo 7 en Google Sheets',
            url: 'https://docs.google.com/spreadsheets/d/14U31FfcbC7qtVtYDCH6MnM9Xk3x60vWHmQfsqZmXLo/edit?usp=sharing',
          },
        },
      ],
    },
  ],
};
