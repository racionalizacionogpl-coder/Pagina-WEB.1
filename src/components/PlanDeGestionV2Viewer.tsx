import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  PLAN_DE_GESTION_V2_DATA,
  PlanDeGestionV2Data,
  PlanDecision,
  PlanAlcanceItem,
  PlanEdtItem,
  PlanRequisito,
  PlanCriterio,
  PlanRaciRow,
  PlanRaciColumnas,
  PlanRedaccionAlcance,
  PlanControlCambio,
  PlanControlCambioColumna,
  PlanMedicionCalidad,
  PlanRiesgo,
  PlanInteresado,
  PlanDocIntegrado,
} from '../data/planDeGestionV2Data';
import { CRONOGRAMA_V2_DATA, CronogramaItem } from '../data/cronogramaV2Data';
import { CronogramaDetailedTable } from './CronogramaDetailedTable';
import {
  FileText,
  Globe,
  Lock,
  ExternalLink,
  Copy,
  Check,
  Edit3,
  Save,
  RotateCcw,
  Download,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Users,
  Layers,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  GripVertical,
  ListOrdered,
  Move,
  Sparkles,
  Share2,
  Plus,
  Trash2,
  Columns3,
  RefreshCw,
  FileSpreadsheet,
  Calendar,
  X,
  Table,
} from 'lucide-react';

export interface PlanDeGestionV2ViewerProps {
  onOpenFullEditor?: () => void;
  onExportDoc?: () => void;
  onSaveDocPlan?: (updatedData: PlanDeGestionV2Data) => void;
  onNavigateToDoc?: (docId: string) => void;
}

export const STORAGE_KEY_PLAN_V2 = 'unmsm_gxp_plan_de_gestion_v2_custom';
export const STORAGE_KEY_PUBLIC_STATUS = 'unmsm_gxp_plan_de_gestion_v2_is_public';

// Helper to keep global document registries synchronized with Plan de Gestión modifications
export const syncPlanDeGestionToDocsStorage = (planData: PlanDeGestionV2Data) => {
  try {
    const keys = ['unmsm_gxp_docs_custom_v2', 'unmsm_gxp_docs_custom'];
    keys.forEach((key) => {
      const saved = localStorage.getItem(key);
      if (saved) {
        const docsList = JSON.parse(saved);
        if (Array.isArray(docsList)) {
          const updatedList = docsList.map((doc: any) => {
            if (doc.id === 'doc-plan-gestion') {
              return {
                ...doc,
                title: planData.titulo,
                description: planData.subtitulo,
                code: planData.ceja,
                date: new Date().toLocaleDateString('es-PE'),
              };
            }
            return doc;
          });
          localStorage.setItem(key, JSON.stringify(updatedList));
        }
      }
    });
  } catch (e) {
    console.error('Error syncing plan de gestion to docs storage', e);
  }
};

export const PlanDeGestionV2Viewer: React.FC<PlanDeGestionV2ViewerProps> = ({
  onOpenFullEditor,
  onExportDoc,
  onSaveDocPlan,
  onNavigateToDoc,
}) => {
  // Load stored customized data or default
  const [data, setData] = useState<PlanDeGestionV2Data>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLAN_V2);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (!parsed.rolesColumnas) {
            parsed.rolesColumnas = {
              actividad: 'Actividad',
              decano: 'Decano',
              respGxP: 'Resp. GxP Fac.',
              ofRacionalizacion: 'Of. Racionaliz.',
              jefeOgpl: 'Jefe OGPL',
              rectorado: 'Rectorado',
            };
          }
          if (!parsed.redaccionAlcance) {
            parsed.redaccionAlcance = PLAN_DE_GESTION_V2_DATA.redaccionAlcance;
          }
          if (
            !parsed.controlCambiosTexto ||
            parsed.controlCambiosTexto.includes('Seis pasos, todos con responsable asignado') ||
            !parsed.controlCambiosDirectrices
          ) {
            parsed.controlCambiosTexto = PLAN_DE_GESTION_V2_DATA.controlCambiosTexto;
            parsed.controlCambios = PLAN_DE_GESTION_V2_DATA.controlCambios;
            parsed.controlCambiosDirectrices = PLAN_DE_GESTION_V2_DATA.controlCambiosDirectrices;
            try {
              localStorage.setItem(STORAGE_KEY_PLAN_V2, JSON.stringify(parsed));
            } catch (e) {}
          }
          if (
            !parsed.controlCambiosColumnas ||
            !Array.isArray(parsed.controlCambiosColumnas) ||
            parsed.controlCambiosColumnas.length === 0
          ) {
            parsed.controlCambiosColumnas = PLAN_DE_GESTION_V2_DATA.controlCambiosColumnas;
            try {
              localStorage.setItem(STORAGE_KEY_PLAN_V2, JSON.stringify(parsed));
            } catch (e) {}
          }
          if (Array.isArray(parsed.criterios) && parsed.criterios.length > 0) {
          const magprofIdx = parsed.criterios.findIndex((c: any) =>
            c.entregable?.toLowerCase().includes('magprof')
          );
          if (magprofIdx !== -1) {
            const currentCriterio = parsed.criterios[magprofIdx].criterio || '';
            if (
              !currentCriterio ||
              currentCriterio.includes('Los 16 procesos de Nivel 0 registrados')
            ) {
              parsed.criterios[magprofIdx].criterio =
                'Para la aceptación del MAGPROF se realizará el cumplimiento de las siguientes directrices.';
              localStorage.setItem(STORAGE_KEY_PLAN_V2, JSON.stringify(parsed));
            }
          }
        }
          if (
            !parsed.cronogramaTexto ||
            parsed.cronogramaTexto.includes('El detalle completo vive en el Cronograma v2.0') ||
            !parsed.cronogramaTexto.includes('El modelo del cronograma del proyecto centraliza')
          ) {
            parsed.cronogramaTexto = PLAN_DE_GESTION_V2_DATA.cronogramaTexto;
            parsed.cronogramaReglas = PLAN_DE_GESTION_V2_DATA.cronogramaReglas;
            parsed.cronogramaBotonTexto = PLAN_DE_GESTION_V2_DATA.cronogramaBotonTexto;
            parsed.cronogramaBotonSubtexto = PLAN_DE_GESTION_V2_DATA.cronogramaBotonSubtexto;
            parsed.cronogramaUrlRedireccion = PLAN_DE_GESTION_V2_DATA.cronogramaUrlRedireccion;
            parsed.cronogramaAvisoRutaCritica = '';
            try {
              localStorage.setItem(STORAGE_KEY_PLAN_V2, JSON.stringify(parsed));
            } catch (e) {}
          }
          if (!parsed.decisionesTexto) {
            parsed.decisionesTexto = PLAN_DE_GESTION_V2_DATA.decisionesTexto;
          }
          if (!parsed.criteriosTexto) {
            parsed.criteriosTexto = PLAN_DE_GESTION_V2_DATA.criteriosTexto;
          }
          if (!parsed.interesadosTexto) {
            parsed.interesadosTexto = PLAN_DE_GESTION_V2_DATA.interesadosTexto;
          }
          if (!parsed.documentosIntegradosTexto) {
            parsed.documentosIntegradosTexto = PLAN_DE_GESTION_V2_DATA.documentosIntegradosTexto;
          }
          if (
            !parsed.calidadMediciones ||
            !Array.isArray(parsed.calidadMediciones) ||
            parsed.calidadMediciones.length < 4 ||
            !parsed.calidadMediciones[0]?.responsable ||
            parsed.calidadMediciones[0]?.medicion?.includes('Avance de fase · oficial')
          ) {
            parsed.calidadMediciones = PLAN_DE_GESTION_V2_DATA.calidadMediciones;
            try {
              localStorage.setItem(STORAGE_KEY_PLAN_V2, JSON.stringify(parsed));
            } catch (e) {}
          }
          if (
            !parsed.riesgos ||
            !Array.isArray(parsed.riesgos) ||
            !parsed.riesgos[0]?.categoria ||
            !parsed.riesgos[0]?.respuesta
          ) {
            parsed.riesgos = PLAN_DE_GESTION_V2_DATA.riesgos;
            try {
              localStorage.setItem(STORAGE_KEY_PLAN_V2, JSON.stringify(parsed));
            } catch (e) {}
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading custom plan v2', e);
    }
    return PLAN_DE_GESTION_V2_DATA;
  });

  const [isPublic, setIsPublic] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PUBLIC_STATUS);
    return saved !== null ? saved === 'true' : true; // default public
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isEditingRedaccion, setIsEditingRedaccion] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string>('');
  const [activeSectionTab, setActiveSectionTab] = useState<string>('all');
  const isInitialMountRef = useRef(true);

  // Direct section description editing state
  const [activeEditingDescKey, setActiveEditingDescKey] = useState<string | null>(null);
  const [tempDescValue, setTempDescValue] = useState<string>('');

  const handleStartEditingDesc = (key: string, initialValue: string) => {
    setActiveEditingDescKey(key);
    setTempDescValue(initialValue);
  };

  const handleSaveDesc = (field: keyof PlanDeGestionV2Data) => {
    const updated = {
      ...data,
      [field]: tempDescValue,
    };
    setData(updated);
    setActiveEditingDescKey(null);
    try {
      localStorage.setItem(STORAGE_KEY_PLAN_V2, JSON.stringify(updated));
      syncPlanDeGestionToDocsStorage(updated);
      if (onSaveDocPlan) {
        onSaveDocPlan(updated);
      }
      window.dispatchEvent(
        new CustomEvent('unmsm_plan_de_gestion_saved', { detail: updated })
      );
      setSaveSuccess(true);
      setLastSavedTimestamp(
        new Date().toLocaleTimeString('es-PE', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (e) {
      console.error('Error saving description', e);
    }
  };

  const handleCancelDesc = () => {
    setActiveEditingDescKey(null);
    setTempDescValue('');
  };

  // Cronograma CSV / Detailed State (Fases F1 Identificación, F2 Implementación, F3 Medición)
  const STORAGE_KEY_CRONOGRAMA = 'unmsm_gxp_cronograma_v2_exact_36_tables';
  const [cronogramaTasks, setCronogramaTasks] = useState<CronogramaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CRONOGRAMA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.tareas) && parsed.tareas.length === 36) return parsed.tareas;
      }
    } catch (e) {
      console.error('Error loading cronograma tasks in plan de gestion', e);
    }
    return CRONOGRAMA_V2_DATA.tareas;
  });

  const [cronogramaViewFormat, setCronogramaViewFormat] = useState<'csv' | 'pmi' | 'markdown'>('csv');
  const [edtViewMode, setEdtViewMode] = useState<'cronograma_csv' | 'edt'>('cronograma_csv');
  const [copiedFaseSec9, setCopiedFaseSec9] = useState<string | null>(null);
  const [copiedAllMdSec9, setCopiedAllMdSec9] = useState(false);

  const cronogramaTareasByFase = useMemo(() => {
    const groups: { [key: string]: CronogramaItem[] } = {};
    cronogramaTasks.forEach((t) => {
      let phase = t.fase || 'Fase General';
      if (phase.includes('F1')) {
        phase = 'F1 · Identificación';
      } else if (phase.includes('F2')) {
        phase = 'F2 · Implementación';
      } else if (phase.includes('F3') || phase.toLowerCase().includes('medici') || phase.toLowerCase().includes('evaluaci')) {
        phase = 'F3 · Evaluación';
      }
      if (!groups[phase]) groups[phase] = [];
      groups[phase].push(t);
    });
    return groups;
  }, [cronogramaTasks]);

  const handleCronogramaTaskChange = (index: number, field: keyof CronogramaItem, value: any) => {
    const updated = [...cronogramaTasks];
    updated[index] = { ...updated[index], [field]: value };
    setCronogramaTasks(updated);
    try {
      const current = localStorage.getItem(STORAGE_KEY_CRONOGRAMA);
      const parsed = current ? JSON.parse(current) : { ...CRONOGRAMA_V2_DATA };
      parsed.tareas = updated;
      localStorage.setItem(STORAGE_KEY_CRONOGRAMA, JSON.stringify(parsed));
    } catch (e) {
      console.error('Error saving task in plan de gestion', e);
    }
  };

  const handleDeleteCronogramaTask = (index: number) => {
    const updated = cronogramaTasks.filter((_, i) => i !== index);
    setCronogramaTasks(updated);
    try {
      const current = localStorage.getItem(STORAGE_KEY_CRONOGRAMA);
      const parsed = current ? JSON.parse(current) : { ...CRONOGRAMA_V2_DATA };
      parsed.tareas = updated;
      localStorage.setItem(STORAGE_KEY_CRONOGRAMA, JSON.stringify(parsed));
    } catch (e) {
      console.error('Error saving deleted task in plan de gestion', e);
    }
  };

  const generatePhaseMarkdownSec9 = (phaseName: string, items: CronogramaItem[]) => {
    let md = `### ${phaseName}\n\n`;
    md += `| Etapa (Nivel 2) | Actividad (Nivel 3) | Tarea (Nivel 4) | Fecha de Inicio | Fecha de Cierre |\n`;
    md += `|---|---|---|---|---|\n`;
    items.forEach((item) => {
      md += `| ${item.etapa} | ${item.actividad} | ${item.tarea} | ${item.inicio} | ${item.fin} |\n`;
    });
    return md;
  };

  const generateAllMarkdownSec9 = () => {
    return Object.entries(cronogramaTareasByFase)
      .map(([fase, items]) => generatePhaseMarkdownSec9(fase, items as CronogramaItem[]))
      .join('\n\n');
  };

  const handleCopyPhaseMdSec9 = (phaseName: string, items: CronogramaItem[]) => {
    const md = generatePhaseMarkdownSec9(phaseName, items);
    navigator.clipboard.writeText(md);
    setCopiedFaseSec9(phaseName);
    setTimeout(() => setCopiedFaseSec9(null), 2500);
  };

  const handleCopyAllMdSec9 = () => {
    const md = generateAllMarkdownSec9();
    navigator.clipboard.writeText(md);
    setCopiedAllMdSec9(true);
    setTimeout(() => setCopiedAllMdSec9(false), 2500);
  };

  const handleDownload5ColCsvSec9 = () => {
    const headers = ['Etapa (Nivel 2)', 'Actividad (Nivel 3)', 'Tarea (Nivel 4)', 'Fecha de Inicio', 'Fecha de Cierre'];
    const rows = cronogramaTasks.map((t) => [
      `"${t.etapa.replace(/"/g, '""')}"`,
      `"${t.actividad.replace(/"/g, '""')}"`,
      `"${t.tarea.replace(/"/g, '""')}"`,
      `"${t.inicio}"`,
      `"${t.fin}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cronograma-detallado-5-columnas.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Table Section 8 interactive state (moving columns/rows & sorting)
  const [controlCambiosSort, setControlCambiosSort] = useState<{
    colId: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [draggedColIdx, setDraggedColIdx] = useState<number | null>(null);
  const [dragOverColIdx, setDragOverColIdx] = useState<number | null>(null);
  const [draggedRowIdx, setDraggedRowIdx] = useState<number | null>(null);
  const [dragOverRowIdx, setDragOverRowIdx] = useState<number | null>(null);

  const handleSortControlCambios = (colId: string) => {
    let nextDir: 'asc' | 'desc' = 'asc';
    if (
      controlCambiosSort &&
      controlCambiosSort.colId === colId &&
      controlCambiosSort.direction === 'asc'
    ) {
      nextDir = 'desc';
    }
    setControlCambiosSort({ colId, direction: nextDir });

    const sortedRows = [...data.controlCambios].sort((a, b) => {
      const valA = a[colId] !== undefined && a[colId] !== null ? a[colId] : '';
      const valB = b[colId] !== undefined && b[colId] !== null ? b[colId] : '';

      const numA = Number(valA);
      const numB = Number(valB);
      if (!isNaN(numA) && !isNaN(numB) && valA !== '' && valB !== '') {
        return nextDir === 'asc' ? numA - numB : numB - numA;
      }
      return nextDir === 'asc'
        ? String(valA).localeCompare(String(valB), 'es', {
            numeric: true,
            sensitivity: 'base',
          })
        : String(valB).localeCompare(String(valA), 'es', {
            numeric: true,
            sensitivity: 'base',
          });
    });

    setData((prev) => ({ ...prev, controlCambios: sortedRows }));
  };

  const handleMoveColumn = (index: number, direction: 'left' | 'right') => {
    const currentCols = [
      ...(data.controlCambiosColumnas ||
        PLAN_DE_GESTION_V2_DATA.controlCambiosColumnas ||
        []),
    ];
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentCols.length) return;
    const [moved] = currentCols.splice(index, 1);
    currentCols.splice(targetIdx, 0, moved);
    setData((prev) => ({ ...prev, controlCambiosColumnas: currentCols }));
  };

  const handleMoveRow = (index: number, direction: 'up' | 'down') => {
    const currentRows = [...data.controlCambios];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentRows.length) return;
    const [moved] = currentRows.splice(index, 1);
    currentRows.splice(targetIdx, 0, moved);
    setData((prev) => ({ ...prev, controlCambios: currentRows }));
  };

  const handleRenumberPasos = () => {
    const renumbered = data.controlCambios.map((row, idx) => ({
      ...row,
      paso: idx + 1,
    }));
    setData((prev) => ({ ...prev, controlCambios: renumbered }));
  };

  const handleColDragStart = (e: React.DragEvent, index: number) => {
    setDraggedColIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `col-${index}`);
  };

  const handleColDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColIdx !== index) {
      setDragOverColIdx(index);
    }
  };

  const handleColDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedColIdx === null || draggedColIdx === targetIndex) {
      setDraggedColIdx(null);
      setDragOverColIdx(null);
      return;
    }
    const currentCols = [
      ...(data.controlCambiosColumnas ||
        PLAN_DE_GESTION_V2_DATA.controlCambiosColumnas ||
        []),
    ];
    const [moved] = currentCols.splice(draggedColIdx, 1);
    currentCols.splice(targetIndex, 0, moved);
    setData((prev) => ({ ...prev, controlCambiosColumnas: currentCols }));
    setDraggedColIdx(null);
    setDragOverColIdx(null);
  };

  const handleRowDragStart = (e: React.DragEvent, index: number) => {
    setDraggedRowIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `row-${index}`);
  };

  const handleRowDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverRowIdx !== index) {
      setDragOverRowIdx(index);
    }
  };

  const handleRowDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedRowIdx === null || draggedRowIdx === targetIndex) {
      setDraggedRowIdx(null);
      setDragOverRowIdx(null);
      return;
    }
    const currentRows = [...data.controlCambios];
    const [moved] = currentRows.splice(draggedRowIdx, 1);
    currentRows.splice(targetIndex, 0, moved);
    setData((prev) => ({ ...prev, controlCambios: currentRows }));
    setDraggedRowIdx(null);
    setDragOverRowIdx(null);
  };

  // Listen for external updates (e.g. from DocModal editor)
  useEffect(() => {
    const handleExternalUpdate = (e: any) => {
      if (e.detail) {
        setData(e.detail);
      } else {
        const saved = localStorage.getItem(STORAGE_KEY_PLAN_V2);
        if (saved) {
          try {
            setData(JSON.parse(saved));
          } catch (err) {}
        }
      }
    };
    window.addEventListener('unmsm_plan_de_gestion_saved', handleExternalUpdate);
    window.addEventListener('storage', handleExternalUpdate);
    return () => {
      window.removeEventListener('unmsm_plan_de_gestion_saved', handleExternalUpdate);
      window.removeEventListener('storage', handleExternalUpdate);
    };
  }, []);

  // Background auto-save safety net for any changes made in real-time
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_PLAN_V2, JSON.stringify(data));
        syncPlanDeGestionToDocsStorage(data);
      } catch (e) {
        console.error('Error auto-saving plan v2', e);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [data]);

  const handleTogglePublic = () => {
    const newVal = !isPublic;
    setIsPublic(newVal);
    localStorage.setItem(STORAGE_KEY_PUBLIC_STATUS, String(newVal));
  };

  // MANDATORY SAVE: Guarantees 100% persistence across all storage keys, parent components, and triggers
  const handleSaveData = () => {
    try {
      // 1. Save directly to primary key
      localStorage.setItem(STORAGE_KEY_PLAN_V2, JSON.stringify(data));

      // 2. Synchronize to global docs registries (v1 and v2)
      syncPlanDeGestionToDocsStorage(data);

      // 3. Notify parent callback if provided
      if (onSaveDocPlan) {
        onSaveDocPlan(data);
      }

      // 4. Dispatch global events so all components re-render immediately
      window.dispatchEvent(
        new CustomEvent('unmsm_plan_de_gestion_saved', { detail: data })
      );

      // 5. Update local view state & feedback
      const timestamp = new Date().toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastSavedTimestamp(timestamp);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 6000);
    } catch (err) {
      console.error('Error al guardar datos del plan obligatoriamente', err);
      alert('Hubo un error al guardar los datos. Por favor reintente.');
    }
  };

  const handleResetToOfficial = () => {
    if (
      window.confirm(
        '¿Deseas restablecer el documento a la versión oficial original de OGPL? Se sobrescribirán las modificaciones locales.'
      )
    ) {
      setData(PLAN_DE_GESTION_V2_DATA);
      localStorage.setItem(
        STORAGE_KEY_PLAN_V2,
        JSON.stringify(PLAN_DE_GESTION_V2_DATA)
      );
      syncPlanDeGestionToDocsStorage(PLAN_DE_GESTION_V2_DATA);
      if (onSaveDocPlan) {
        onSaveDocPlan(PLAN_DE_GESTION_V2_DATA);
      }
      window.dispatchEvent(
        new CustomEvent('unmsm_plan_de_gestion_saved', {
          detail: PLAN_DE_GESTION_V2_DATA,
        })
      );
      setIsEditing(false);
      setSaveSuccess(true);
      setLastSavedTimestamp('Restablecido a versión oficial');
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  const handleOpenAnexo1Directrices = () => {
    if (onNavigateToDoc) onNavigateToDoc('doc-anexo-1');
    window.dispatchEvent(new CustomEvent('unmsm_navigate_to_doc', { detail: 'doc-anexo-1' }));
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('unmsm_open_anexo1_directrices'));
    }, 120);
  };

  const handleOpenAnexo3Directrices = () => {
    if (onNavigateToDoc) onNavigateToDoc('doc-anexo-3');
    window.dispatchEvent(new CustomEvent('unmsm_navigate_to_doc', { detail: 'doc-anexo-3' }));
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('unmsm_open_anexo3_directrices'));
    }, 120);
  };

  const handleInsertEdtRow = (
    targetIndex?: number,
    phasePreset?: { id: string; nombre: string; plazo: string }
  ) => {
    const defaultPhase =
      phasePreset ||
      (targetIndex !== undefined && targetIndex >= 0 && targetIndex < data.edtItems.length
        ? {
            id: data.edtItems[targetIndex].faseId,
            nombre: data.edtItems[targetIndex].faseNombre,
            plazo: data.edtItems[targetIndex].fasePlazo,
          }
        : data.edtItems.length > 0
        ? {
            id: data.edtItems[data.edtItems.length - 1].faseId,
            nombre: data.edtItems[data.edtItems.length - 1].faseNombre,
            plazo: data.edtItems[data.edtItems.length - 1].fasePlazo,
          }
        : { id: 'F1', nombre: 'Identificación', plazo: 'Jun - Sep' });

    const newRow: PlanEdtItem = {
      faseId: defaultPhase.id,
      faseNombre: defaultPhase.nombre,
      fasePlazo: defaultPhase.plazo,
      faseRowSpan: 1,
      etapa: 'Nueva Etapa',
      actividad: 'Nueva Actividad / Tarea',
      paqueteTrabajo: 'Nuevo Paquete de Trabajo / Entregable',
    };

    let updated: PlanEdtItem[];
    if (targetIndex !== undefined && targetIndex >= 0 && targetIndex < data.edtItems.length) {
      updated = [
        ...data.edtItems.slice(0, targetIndex + 1),
        newRow,
        ...data.edtItems.slice(targetIndex + 1),
      ];
    } else {
      updated = [...data.edtItems, newRow];
    }

    const newData = { ...data, edtItems: updated };
    setData(newData);
    setIsEditing(true);

    try {
      localStorage.setItem(STORAGE_KEY_PLAN_V2, JSON.stringify(newData));
    } catch (e) {
      console.error('Error saving updated EDT rows', e);
    }
  };

  const handleDuplicateEdtRow = (index: number) => {
    const itemToCopy = data.edtItems[index];
    const newRow: PlanEdtItem = {
      ...itemToCopy,
      actividad: `${itemToCopy.actividad} (Copia)`,
      paqueteTrabajo: `${itemToCopy.paqueteTrabajo} (Copia)`,
    };
    const updated = [
      ...data.edtItems.slice(0, index + 1),
      newRow,
      ...data.edtItems.slice(index + 1),
    ];
    const newData = { ...data, edtItems: updated };
    setData(newData);
    setIsEditing(true);

    try {
      localStorage.setItem(STORAGE_KEY_PLAN_V2, JSON.stringify(newData));
    } catch (e) {
      console.error('Error duplicating EDT row', e);
    }
  };

  const handleDeleteEdtRow = (index: number) => {
    if (data.edtItems.length <= 1) {
      return;
    }
    const updated = data.edtItems.filter((_, i) => i !== index);
    const newData = { ...data, edtItems: updated };
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY_PLAN_V2, JSON.stringify(newData));
    } catch (e) {
      console.error('Error deleting EDT row', e);
    }
  };

  const rolesCols: PlanRaciColumnas = data.rolesColumnas || {
    actividad: 'Actividad',
    decano: 'Decano',
    respGxP: 'Resp. GxP Fac.',
    ofRacionalizacion: 'Of. Racionaliz.',
    jefeOgpl: 'Jefe OGPL',
    rectorado: 'Rectorado',
  };

  const handleUpdateRoleColumn = (
    colKey: keyof PlanRaciColumnas,
    newText: string
  ) => {
    const updatedCols: PlanRaciColumnas = {
      ...rolesCols,
      [colKey]: newText,
    };
    const newData: PlanDeGestionV2Data = {
      ...data,
      rolesColumnas: updatedCols,
    };
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY_PLAN_V2, JSON.stringify(newData));
    } catch (e) {
      console.error('Error saving role column header', e);
    }
  };

  const redaccionAlcanceData: PlanRedaccionAlcance = data.redaccionAlcance ||
    PLAN_DE_GESTION_V2_DATA.redaccionAlcance || {
      titulo: '3.  Redacción de la   Definición Alcance',
      parrafos: [
        'El proyecto comprende el diseño, implementación y evaluación de la Gestión por Procesos (Fases 1 a 3) para las 20 Facultades de la Universidad Nacional Mayor de San Marcos (UNMSM), enmarcado en un estricto horizonte temporal escalonado: la Fase 1 (Identificación) tiene como plazo límite el 30 de setiembre de 2026; la Fase 2 (Implementación) se ejecutará hasta abril de 2027; y la Fase 3 (Evaluación) concluirá en junio de 2027.',
        'Durante la Fase 1, el núcleo del esfuerzo se centrará en la elaboración.  del Manual de Gestión por Procesos (MAGPROF) para cada Facultad. Esto abarca la identificación de los procesos (estratégicos, misionales y de soporte), la consolidación de un reajuste para el Mapa de Procesos Estándar, la redacción de las fichas de caracterización y la determinación de indicadores, asegurando la alineación con la Norma Técnica SGP y .Como también se comenzará con el Desarrollo de Front-end  / Back-end. del SIGPRO y de manera transversal, se ejecutará un plan de capacitación dirigido a los Dueños de Proceso y culminara con el Manual de Gestión por Procesos (MAGPROF)  Aprobado con las facultades que termine en el mencionado plazo  .',
        'Para la Fase 2, el trabajo se enfocará en la diagramación detallada de los procedimientos asociados a los Procesos del Mapa Estándar. Esta etapa se desarrollará conjuntamente con el despliegue e implementación de la Plataforma Web Institucional (SIGPRO), la cual centralizará operativamente los módulos de gestión . Finalmente se culminará con  aprobación y  la publicación oficial de los Manuales de Procedimientos (MAPROs)',
        'Durante la Fase 3, se llevará a cabo la evaluación integral del sistema, lo cual contempla la medición de todos los indicadores establecidos previamente en las fichas de caracterización (abarcando tanto los indicadores de eficacia como los de eficiencia de cada proceso). Esta medición permitirá monitorear el desempeño real de los procesos y validar su nivel de cumplimiento frente a las metas institucionales planteadas.',
        'Quedan estrictamente excluidos del alcance del presente proyecto el rediseño de la estructura orgánica de la universidad, así como la estandarización a nivel de subprocesos y productos. las certificaciones externas de calidad (ISO) ni la modificación de la normativa nacional. Finalmente, se precisa que la Fase 4 (Mejora) no se contempla en el presente alcance, dado que su ejecución requiere un plan independiente que integrará la planificación y precisión de los tiempos operativos una vez concluidas las tres fases iniciales.',
      ],
    };

  const handleUpdateRedaccionTitulo = (newTitulo: string) => {
    const newData: PlanDeGestionV2Data = {
      ...data,
      redaccionAlcance: {
        titulo: newTitulo,
        parrafos: redaccionAlcanceData.parrafos,
      },
    };
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY_PLAN_V2, JSON.stringify(newData));
    } catch (e) {
      console.error('Error saving redaccion alcance titulo', e);
    }
  };

  const handleUpdateRedaccionParrafo = (index: number, newText: string) => {
    const updated = [...redaccionAlcanceData.parrafos];
    updated[index] = newText;
    const newData: PlanDeGestionV2Data = {
      ...data,
      redaccionAlcance: {
        titulo: redaccionAlcanceData.titulo,
        parrafos: updated,
      },
    };
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY_PLAN_V2, JSON.stringify(newData));
    } catch (e) {
      console.error('Error saving redaccion alcance parrafo', e);
    }
  };

  const handleAddRedaccionParrafo = () => {
    const updated = [
      ...redaccionAlcanceData.parrafos,
      'Nuevo párrafo de redacción del alcance.',
    ];
    const newData: PlanDeGestionV2Data = {
      ...data,
      redaccionAlcance: {
        titulo: redaccionAlcanceData.titulo,
        parrafos: updated,
      },
    };
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY_PLAN_V2, JSON.stringify(newData));
    } catch (e) {
      console.error('Error adding redaccion alcance parrafo', e);
    }
  };

  const handleDeleteRedaccionParrafo = (index: number) => {
    if (redaccionAlcanceData.parrafos.length <= 1) return;
    const updated = redaccionAlcanceData.parrafos.filter((_, i) => i !== index);
    const newData: PlanDeGestionV2Data = {
      ...data,
      redaccionAlcance: {
        titulo: redaccionAlcanceData.titulo,
        parrafos: updated,
      },
    };
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY_PLAN_V2, JSON.stringify(newData));
    } catch (e) {
      console.error('Error deleting redaccion alcance parrafo', e);
    }
  };

  const handleCopyPublicUrl = () => {
    navigator.clipboard.writeText(data.urlOficial);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadHtml = () => {
    const content = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>${data.titulo} · UNMSM</title>
<style>
  body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 960px; margin: 40px auto; padding: 0 20px; color: #1e293b; }
  h1 { color: #0f172a; margin-bottom: 8px; }
  .sub { color: #64748b; font-size: 1.1rem; margin-bottom: 24px; }
  .ficha { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin-bottom: 30px; }
  .ficha div span { display: block; font-size: 11px; text-transform: uppercase; color: #64748b; }
  .ficha div b { font-size: 14px; color: #0f172a; }
  h2 { border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 36px; color: #0f172a; }
  .dec { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px; margin-bottom: 14px; border-radius: 4px; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
  th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
  th { background: #f1f5f9; }
</style>
</head>
<body>
  <h1>${data.titulo}</h1>
  <p class="sub">${data.subtitulo}</p>
  <div class="ficha">
    <div><span>Proyecto</span><b>${data.ficha.proyecto}</b></div>
    <div><span>Área responsable</span><b>${data.ficha.areaResponsable}</b></div>
    <div><span>Alcance</span><b>${data.ficha.alcanceTemporal}</b></div>
    <div><span>Inicio</span><b>${data.ficha.inicio}</b></div>
    <div><span>Cierre Fase 1</span><b>${data.ficha.cierreFase1}</b></div>
    <div><span>Cierre Proyecto</span><b>${data.ficha.cierreProyecto}</b></div>
    <div><span>Versión</span><b>${data.ficha.version}</b></div>
    <div><span>Avance Fase 1</span><b>${data.ficha.avanceFase1}</b></div>
  </div>
  <h2>1. Propósito del plan</h2>
  ${data.proposito.map((p) => `<p>${p}</p>`).join('')}
  <h2>2. Decisiones adoptadas</h2>
  ${data.decisiones
    .map(
      (d) =>
        `<div class="dec"><strong>${d.etiqueta}: ${d.titulo}</strong><p>${d.descripcion}</p></div>`
    )
    .join('')}
  <h2>3. Enunciado del alcance</h2>
  <p>${data.alcanceTexto}</p>
  <table>
    <thead><tr><th>Dentro del alcance</th><th>Fuera del alcance</th></tr></thead>
    <tbody>
      ${data.alcanceItems
        .map(
          (i) =>
            `<tr><td>${i.dentro}</td><td>${i.fuera}</td></tr>`
        )
        .join('')}
    </tbody>
  </table>
  <div style="border: 1px solid #1e40af; border-radius: 8px; margin-top: 20px; overflow: hidden;">
    <div style="background: #1e40af; color: white; padding: 10px 16px; font-weight: bold;">
      ${redaccionAlcanceData.titulo}
    </div>
    <div style="padding: 16px; font-size: 13px; line-height: 1.6;">
      ${redaccionAlcanceData.parrafos
        .map((p) => `<p style="margin-bottom: 12px; text-align: justify;">${p}</p>`)
        .join('')}
    </div>
  </div>
  <h2>8. Control de Cambios del Alcance</h2>
  <p>${data.controlCambiosTexto}</p>
  <table>
    <thead>
      <tr>
        ${(
          data.controlCambiosColumnas || [
            { id: 'paso', nombre: 'Paso' },
            {
              id: 'accion',
              nombre:
                'Acción (Alineada al PMBOK 6ta Edición y Alcance del Proyecto)',
            },
            { id: 'responsable', nombre: 'Responsable' },
          ]
        )
          .map((col) => `<th>${col.nombre}</th>`)
          .join('')}
      </tr>
    </thead>
    <tbody>
      ${data.controlCambios
        .map(
          (c) =>
            `<tr>${(
              data.controlCambiosColumnas || [
                { id: 'paso', nombre: 'Paso' },
                {
                  id: 'accion',
                  nombre:
                    'Acción (Alineada al PMBOK 6ta Edición y Alcance del Proyecto)',
                },
                { id: 'responsable', nombre: 'Responsable' },
              ]
            )
              .map((col) => `<td>${c[col.id] ?? ''}</td>`)
              .join('')}</tr>`
        )
        .join('')}
    </tbody>
  </table>
  ${
    (data.controlCambiosDirectrices || []).length > 0
      ? `<div style="margin-top: 16px;">
           <h3 style="font-size: 14px; margin-bottom: 8px;">Directrices Complementarias para la Gestión del Cambio:</h3>
           <ul>
             ${(data.controlCambiosDirectrices || [])
               .map((d) => `<li><b>${d.titulo}:</b> ${d.descripcion}</li>`)
               .join('')}
           </ul>
         </div>`
      : ''
  }
  <h2 style="color: #0f172a; margin-top: 28px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">9. Gestión del cronograma</h2>
  <p style="font-size: 14px; color: #334155; line-height: 1.6;">${data.cronogramaTexto}</p>
  <ul style="font-size: 14px; color: #334155; line-height: 1.6; padding-left: 20px;">
    ${data.cronogramaReglas
      .map((r) => {
        const colon = r.indexOf(':');
        if (colon !== -1) {
          return `<li><b>${r.substring(0, colon)}:</b>${r.substring(colon + 1)}</li>`;
        }
        return `<li>${r}</li>`;
      })
      .join('')}
  </ul>
  <div style="margin: 24px 0; text-align: center;">
    <a href="${data.cronogramaUrlRedireccion || 'https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/docs/02-cronograma-v2.html'}" target="_blank" style="display: inline-block; padding: 12px 24px; background: #0284c7; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
      ${data.cronogramaBotonTexto || '📅 Acceder al Cronograma Completo y Actualizado'}
    </a>
    <p style="font-size: 12px; color: #64748b; margin-top: 6px;">${data.cronogramaBotonSubtexto || '(Este enlace redirige al documento maestro del cronograma)'}</p>
  </div>
</body>
</html>`;

    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'UNMSM-Plan-de-Gestion-v2.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-slate-800 text-sm relative pb-16">
      {/* 1. Header & Institutional Banner */}
      <div className="banner-navy-gradient text-white rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden border-b-2 border-b-[#b8933f]/40">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          {/* Top Badges Row */}
          <div className="flex items-center gap-2 flex-wrap">
            {isEditing ? (
              <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg border border-white/20">
                <span className="text-[10px] uppercase font-bold text-white/70">
                  Ceja / Código:
                </span>
                <input
                  type="text"
                  value={data.ceja}
                  onChange={(e) => setData({ ...data, ceja: e.target.value })}
                  className="text-xs font-mono font-semibold bg-transparent text-white border-b border-[#d9b872] focus:outline-none px-1"
                  placeholder="Ceja institucional..."
                />
              </div>
            ) : (
              <span className="btn-banner-neutral inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium">
                <FileText className="w-3.5 h-3.5 text-white/80" />
                {data.ceja}
              </span>
            )}

            <button
              onClick={handleTogglePublic}
              id="toggle-public-doc-btn"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                isPublic
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30'
                  : 'chip-gold-accent hover:brightness-110'
              }`}
              title={
                isPublic
                  ? 'Documento público institucional'
                  : 'Documento privado en borrador'
              }
            >
              {isPublic ? (
                <>
                  <Globe className="w-3.5 h-3.5" />
                  Público
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#d9b872]" />
                  Privado
                </>
              )}
            </button>

            {lastSavedTimestamp && (
              <span className="text-[11px] text-emerald-300/90 font-medium bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                Guardado: {lastSavedTimestamp}
              </span>
            )}
          </div>

          {/* Main Row: Title & Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-2 my-1">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-amber-300 block mb-1">
                      Título del Plan de Gestión *
                    </label>
                    <input
                      type="text"
                      value={data.titulo}
                      onChange={(e) =>
                        setData({ ...data, titulo: e.target.value })
                      }
                      className="w-full text-xl sm:text-2xl font-bold bg-white/15 border border-amber-400/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="Título del documento..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">
                      Subtítulo / Descripción
                    </label>
                    <textarea
                      value={data.subtitulo}
                      onChange={(e) =>
                        setData({ ...data, subtitulo: e.target.value })
                      }
                      rows={2}
                      className="w-full text-xs sm:text-sm bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white/80 focus:outline-none focus:ring-2 focus:ring-sky-400 leading-relaxed"
                      placeholder="Descripción del documento..."
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                    {data.titulo}
                  </h1>
                  <p className="text-xs sm:text-sm text-white/72 mt-1.5 max-w-3xl leading-relaxed">
                    {data.subtitulo}
                  </p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
              <span className="chip-gold-accent px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold">
                {data.ficha?.version || 'v2.0'}
              </span>

              {isEditing ? (
                <button
                  onClick={handleSaveData}
                  id="btn-guardar-cambios-plan"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl transition-all cursor-pointer ring-2 ring-emerald-300 animate-pulse"
                  title="Guardar obligatoriamente todos los cambios en el sistema"
                >
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>GUARDAR CAMBIOS</span>
                </button>
              ) : null}

              <button
                onClick={handleCopyPublicUrl}
                className="btn-banner-neutral inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer"
                title="Copiar enlace oficial público"
              >
                {copiedLink ? (
                  <Check className="w-4 h-4 text-emerald-300" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copiedLink ? 'Enlace copiado' : 'Copiar enlace'}
              </button>

              <a
                href={data.urlOficial}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-steel-blue-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                Ver web oficial
              </a>

              <button
                onClick={() => setIsEditing(!isEditing)}
                id="btn-activar-modo-edicion"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isEditing
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-lg ring-2 ring-amber-300/60'
                    : 'btn-banner-neutral'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? 'Salir de edición' : 'Modo edición'}
              </button>

              <button
                onClick={handleDownloadHtml}
                className="btn-banner-neutral inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer"
                title="Descargar documento HTML oficial"
              >
                <Download className="w-4 h-4" />
                HTML
              </button>

              <button
                onClick={handleResetToOfficial}
                className="btn-banner-neutral p-2 rounded-xl text-xs text-white/70 hover:text-white cursor-pointer"
                title="Restablecer al texto original oficial"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Mandatory Save Notification Alert */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl border border-emerald-400 flex items-center justify-between gap-3 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-wide">
                ¡INFORMACIÓN GUARDADA OBLIGATORIAMENTE!
              </h4>
              <p className="text-xs text-emerald-100 mt-0.5">
                Todas las modificaciones realizadas en el Plan de Gestión del Proyecto han sido guardadas y sincronizadas con éxito en el sistema local ({lastSavedTimestamp}).
              </p>
            </div>
          </div>
          <button
            onClick={() => setSaveSuccess(false)}
            className="text-white/80 hover:text-white px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Ficha Técnica del Proyecto (8 Metadatos Oficiales) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-200/80 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            Ficha Técnica del Plan (Línea Base Oficial)
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Avance Fase 1: {data.ficha.avanceFase1}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
            <span className="block text-[10px] uppercase font-bold text-slate-400">
              Proyecto
            </span>
            {isEditing ? (
              <input
                type="text"
                value={data.ficha.proyecto}
                onChange={(e) =>
                  setData({
                    ...data,
                    ficha: { ...data.ficha, proyecto: e.target.value },
                  })
                }
                className="w-full font-bold text-slate-800 text-xs border border-sky-300 rounded px-1.5 py-0.5 mt-0.5 bg-sky-50/20"
              />
            ) : (
              <strong className="text-slate-800 text-xs">
                {data.ficha.proyecto}
              </strong>
            )}
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
            <span className="block text-[10px] uppercase font-bold text-slate-400">
              Área Responsable
            </span>
            {isEditing ? (
              <input
                type="text"
                value={data.ficha.areaResponsable}
                onChange={(e) =>
                  setData({
                    ...data,
                    ficha: { ...data.ficha, areaResponsable: e.target.value },
                  })
                }
                className="w-full font-bold text-slate-800 text-xs border border-sky-300 rounded px-1.5 py-0.5 mt-0.5 bg-sky-50/20"
              />
            ) : (
              <strong className="text-slate-800 text-xs">
                {data.ficha.areaResponsable}
              </strong>
            )}
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
            <span className="block text-[10px] uppercase font-bold text-slate-400">
              Alcance Temporal
            </span>
            {isEditing ? (
              <input
                type="text"
                value={data.ficha.alcanceTemporal}
                onChange={(e) =>
                  setData({
                    ...data,
                    ficha: { ...data.ficha, alcanceTemporal: e.target.value },
                  })
                }
                className="w-full font-bold text-slate-800 text-xs border border-sky-300 rounded px-1.5 py-0.5 mt-0.5 bg-sky-50/20"
              />
            ) : (
              <strong className="text-slate-800 text-xs">
                {data.ficha.alcanceTemporal}
              </strong>
            )}
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
            <span className="block text-[10px] uppercase font-bold text-slate-400">
              Fecha de Inicio
            </span>
            {isEditing ? (
              <input
                type="text"
                value={data.ficha.inicio}
                onChange={(e) =>
                  setData({
                    ...data,
                    ficha: { ...data.ficha, inicio: e.target.value },
                  })
                }
                className="w-full font-bold text-slate-800 text-xs border border-sky-300 rounded px-1.5 py-0.5 mt-0.5 bg-sky-50/20"
              />
            ) : (
              <strong className="text-slate-800 text-xs">
                {data.ficha.inicio}
              </strong>
            )}
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-emerald-200 bg-emerald-50/30">
            <span className="block text-[10px] uppercase font-bold text-emerald-700">
              Cierre Fase 1
            </span>
            {isEditing ? (
              <input
                type="text"
                value={data.ficha.cierreFase1}
                onChange={(e) =>
                  setData({
                    ...data,
                    ficha: { ...data.ficha, cierreFase1: e.target.value },
                  })
                }
                className="w-full font-bold text-emerald-800 text-xs border border-emerald-300 rounded px-1.5 py-0.5 mt-0.5 bg-white"
              />
            ) : (
              <strong className="text-emerald-800 text-xs">
                {data.ficha.cierreFase1}
              </strong>
            )}
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
            <span className="block text-[10px] uppercase font-bold text-slate-400">
              Cierre del Proyecto
            </span>
            {isEditing ? (
              <input
                type="text"
                value={data.ficha.cierreProyecto}
                onChange={(e) =>
                  setData({
                    ...data,
                    ficha: { ...data.ficha, cierreProyecto: e.target.value },
                  })
                }
                className="w-full font-bold text-slate-800 text-xs border border-sky-300 rounded px-1.5 py-0.5 mt-0.5 bg-sky-50/20"
              />
            ) : (
              <strong className="text-slate-800 text-xs">
                {data.ficha.cierreProyecto}
              </strong>
            )}
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
            <span className="block text-[10px] uppercase font-bold text-slate-400">
              Versión Oficial
            </span>
            {isEditing ? (
              <input
                type="text"
                value={data.ficha.version}
                onChange={(e) =>
                  setData({
                    ...data,
                    ficha: { ...data.ficha, version: e.target.value },
                  })
                }
                className="w-full font-bold text-slate-800 text-xs border border-sky-300 rounded px-1.5 py-0.5 mt-0.5 bg-sky-50/20"
              />
            ) : (
              <strong className="text-slate-800 text-xs">
                {data.ficha.version}
              </strong>
            )}
          </div>

          <div className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-200">
            <span className="block text-[10px] uppercase font-bold text-indigo-700">
              Avance Fase 1
            </span>
            {isEditing ? (
              <input
                type="text"
                value={data.ficha.avanceFase1}
                onChange={(e) =>
                  setData({
                    ...data,
                    ficha: { ...data.ficha, avanceFase1: e.target.value },
                  })
                }
                className="w-full font-bold text-indigo-800 text-xs border border-indigo-300 rounded px-1.5 py-0.5 mt-0.5 bg-white"
              />
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <strong className="text-indigo-800 text-sm">
                  {data.ficha.avanceFase1}
                </strong>
                <div className="flex-1 bg-indigo-200/70 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: '65%' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Jump Bar for 13 Sections */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-200">
        <span className="font-bold text-slate-400 uppercase text-[10px] pr-1">
          Secciones:
        </span>
        {[
          { id: 'all', label: 'Ver Todo' },
          { id: 'sec-1', label: '1. Propósito' },
          { id: 'sec-2', label: '2. Decisiones' },
          { id: 'sec-3', label: '3. Alcance' },
          { id: 'sec-4', label: '4. EDT / WBS' },
          { id: 'sec-5', label: '5. Requisitos' },
          { id: 'sec-6', label: '6. Criterios' },
          { id: 'sec-7', label: '7. RACI' },
          { id: 'sec-8', label: '8. Cambios' },
          { id: 'sec-9', label: '9. Cronograma' },
          { id: 'sec-10', label: '10. Calidad' },
          { id: 'sec-11', label: '11. Riesgos' },
          { id: 'sec-12', label: '12. Interesados' },
          { id: 'sec-13', label: '13. Documentos' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSectionTab(tab.id)}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer text-xs ${
              activeSectionTab === tab.id
                ? 'bg-sky-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= SECCIÓN 1: Propósito del plan ================= */}
      {(activeSectionTab === 'all' || activeSectionTab === 'sec-1') && (
        <div
          id="sec-1"
          className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              Propósito del plan
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    proposito: [...data.proposito, 'Nuevo párrafo del propósito...'],
                  })
                }
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Añadir Párrafo
              </button>
            )}
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {data.proposito.map((paragraph, idx) => (
              <div key={idx} className="relative group">
                {isEditing || activeEditingDescKey === `sec-1-p-${idx}` ? (
                  <div className="space-y-1.5 p-3 bg-sky-50/40 border border-sky-300/80 rounded-xl">
                    <div className="flex items-center justify-between text-xs font-bold text-sky-900">
                      <span>Párrafo {idx + 1} del propósito:</span>
                      <div className="flex items-center gap-1.5">
                        {activeEditingDescKey === `sec-1-p-${idx}` && !isEditing && (
                          <>
                            <button
                              type="button"
                              onClick={handleCancelDesc}
                              className="px-2 py-0.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                            >
                              <X className="w-3 h-3" /> Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...data.proposito];
                                updated[idx] = tempDescValue;
                                const newData = { ...data, proposito: updated };
                                setData(newData);
                                setActiveEditingDescKey(null);
                                try {
                                  localStorage.setItem(STORAGE_KEY_PLAN_V2, JSON.stringify(newData));
                                  syncPlanDeGestionToDocsStorage(newData);
                                  setSaveSuccess(true);
                                  setTimeout(() => setSaveSuccess(false), 3000);
                                } catch (e) {}
                              }}
                              className="px-2.5 py-0.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3 h-3" /> Guardar
                            </button>
                          </>
                        )}
                        {data.proposito.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = data.proposito.filter((_, i) => i !== idx);
                              setData({ ...data, proposito: updated });
                            }}
                            className="text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer text-xs ml-2"
                          >
                            <Trash2 className="w-3 h-3" /> Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      value={isEditing ? paragraph : tempDescValue}
                      onChange={(e) => {
                        if (isEditing) {
                          const updated = [...data.proposito];
                          updated[idx] = e.target.value;
                          setData({ ...data, proposito: updated });
                        } else {
                          setTempDescValue(e.target.value);
                        }
                      }}
                      className="w-full text-xs sm:text-sm text-slate-800 border border-sky-300 rounded-lg p-2.5 bg-white focus:ring-1 focus:ring-sky-500 focus:outline-none leading-relaxed"
                    />
                  </div>
                ) : (
                  <p
                    id={`desc-sec-1-${idx}`}
                    onClick={() => handleStartEditingDesc(`sec-1-p-${idx}`, paragraph)}
                    title="Haz clic para editar este párrafo"
                    className="p-1.5 -m-1.5 rounded-lg border border-transparent hover:border-sky-300/70 hover:bg-sky-50/50 cursor-pointer group transition-all flex items-start justify-between gap-2"
                  >
                    <span className="flex-1">{paragraph}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-100/80 group-hover:bg-sky-200 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <Edit3 className="w-3 h-3" /> Editar
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SECCIÓN 2: Decisiones adoptadas ================= */}
      {(activeSectionTab === 'all' || activeSectionTab === 'sec-2') && (
        <div
          id="sec-2"
          className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              Decisiones adoptadas en esta versión
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  const nextNum = data.decisiones.length + 1;
                  setData({
                    ...data,
                    decisiones: [
                      ...data.decisiones,
                      {
                        numero: nextNum,
                        etiqueta: `Decisión ${nextNum} (D1-0${nextNum})`,
                        titulo: 'Nueva Decisión Adoptada',
                        descripcion: 'Descripción del criterio oficial adoptado...',
                      },
                    ],
                  });
                }}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Añadir Decisión
              </button>
            )}
          </div>

          {isEditing || activeEditingDescKey === 'sec-2' ? (
            <div className="space-y-2 p-3 bg-sky-50/40 border border-sky-300/80 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Descripción de decisiones adoptadas:</span>
                </label>
                {activeEditingDescKey === 'sec-2' && !isEditing && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCancelDesc}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <X className="w-3 h-3" />
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveDesc('decisionesTexto')}
                      className="px-3 py-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Guardar
                    </button>
                  </div>
                )}
              </div>
              <textarea
                rows={3}
                value={isEditing ? (data.decisionesTexto ?? PLAN_DE_GESTION_V2_DATA.decisionesTexto) : tempDescValue}
                onChange={(e) => {
                  if (isEditing) {
                    setData({ ...data, decisionesTexto: e.target.value });
                  } else {
                    setTempDescValue(e.target.value);
                  }
                }}
                className="w-full text-xs sm:text-sm text-slate-800 border border-sky-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed shadow-2xs"
                placeholder="Escribe la descripción de las decisiones adoptadas..."
              />
              <p className="text-[11px] text-slate-500">
                {isEditing ? 'Edición en vivo habilitada por el Modo Edición general.' : 'Presiona "Guardar" para actualizar y sincronizar esta descripción en todo el sistema.'}
              </p>
            </div>
          ) : (
            <p
              id="desc-sec-2"
              onClick={() => handleStartEditingDesc('sec-2', data.decisionesTexto || PLAN_DE_GESTION_V2_DATA.decisionesTexto || '')}
              title="Haz clic para editar la descripción de este apartado"
              className="text-xs text-slate-600 leading-relaxed p-2 -m-2 rounded-lg border border-transparent hover:border-sky-300/70 hover:bg-sky-50/50 cursor-pointer group transition-all flex items-start justify-between gap-3"
            >
              <span className="flex-1">
                {data.decisionesTexto || PLAN_DE_GESTION_V2_DATA.decisionesTexto}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-100/80 group-hover:bg-sky-200 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Edit3 className="w-3 h-3" />
                Editar descripción
              </span>
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {data.decisiones.map((dec, idx) => (
              <div
                key={idx}
                className="bg-emerald-50/50 border border-emerald-200/90 rounded-xl p-3.5 hover:shadow-xs transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={dec.etiqueta}
                        onChange={(e) => {
                          const updated = [...data.decisiones];
                          updated[idx] = { ...updated[idx], etiqueta: e.target.value };
                          setData({ ...data, decisiones: updated });
                        }}
                        className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-white border border-emerald-300 px-2 py-0.5 rounded-md"
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/80 px-2 py-0.5 rounded-md inline-block">
                        {dec.etiqueta}
                      </span>
                    )}

                    {isEditing && data.decisiones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = data.decisiones.filter((_, i) => i !== idx);
                          setData({ ...data, decisiones: updated });
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        title="Eliminar decisión"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-1.5 mt-2">
                      <input
                        type="text"
                        value={dec.titulo}
                        onChange={(e) => {
                          const updated = [...data.decisiones];
                          updated[idx] = { ...updated[idx], titulo: e.target.value };
                          setData({ ...data, decisiones: updated });
                        }}
                        className="w-full text-xs font-bold text-slate-900 border border-emerald-300 rounded px-2 py-1 bg-white focus:ring-1 focus:ring-emerald-500"
                        placeholder="Título de la decisión..."
                      />
                      <textarea
                        rows={3}
                        value={dec.descripcion}
                        onChange={(e) => {
                          const updated = [...data.decisiones];
                          updated[idx] = { ...updated[idx], descripcion: e.target.value };
                          setData({ ...data, decisiones: updated });
                        }}
                        className="w-full text-xs text-slate-700 border border-emerald-300 rounded p-2 bg-white focus:ring-1 focus:ring-emerald-500"
                        placeholder="Detalle o justificación..."
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 mb-1.5">
                        {dec.titulo}
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {dec.descripcion}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SECCIÓN 3: Enunciado del alcance ================= */}
      {(activeSectionTab === 'all' || activeSectionTab === 'sec-3') && (
        <div
          id="sec-3"
          className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center shrink-0">
                3
              </span>
              Enunciado del alcance
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setData({
                    ...data,
                    alcanceItems: [
                      ...data.alcanceItems,
                      {
                        dentro: 'Nuevo elemento dentro del alcance',
                        fuera: 'Elemento fuera del alcance',
                      },
                    ],
                  });
                }}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Añadir Fila
              </button>
            )}
          </div>

          {isEditing || activeEditingDescKey === 'sec-3' ? (
            <div className="space-y-2 p-3 bg-sky-50/40 border border-sky-300/80 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Descripción del enunciado del alcance:</span>
                </label>
                {activeEditingDescKey === 'sec-3' && !isEditing && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCancelDesc}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <X className="w-3 h-3" />
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveDesc('alcanceTexto')}
                      className="px-3 py-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Guardar
                    </button>
                  </div>
                )}
              </div>
              <textarea
                rows={3}
                value={isEditing ? data.alcanceTexto : tempDescValue}
                onChange={(e) => {
                  if (isEditing) {
                    setData({ ...data, alcanceTexto: e.target.value });
                  } else {
                    setTempDescValue(e.target.value);
                  }
                }}
                className="w-full text-xs sm:text-sm text-slate-800 border border-sky-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed shadow-2xs"
                placeholder="Escribe la descripción general del alcance..."
              />
              <p className="text-[11px] text-slate-500">
                {isEditing ? 'Edición en vivo habilitada por el Modo Edición general.' : 'Presiona "Guardar" para actualizar y sincronizar esta descripción en todo el sistema.'}
              </p>
            </div>
          ) : (
            <p
              id="desc-sec-3"
              onClick={() => handleStartEditingDesc('sec-3', data.alcanceTexto)}
              title="Haz clic para editar la descripción de este apartado"
              className="text-xs sm:text-[13px] text-slate-700 leading-relaxed p-2 -m-2 rounded-lg border border-transparent hover:border-sky-300/70 hover:bg-sky-50/50 cursor-pointer group transition-all flex items-start justify-between gap-3"
            >
              <span className="flex-1">{data.alcanceTexto}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-100/80 group-hover:bg-sky-200 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Edit3 className="w-3 h-3" />
                Editar descripción
              </span>
            </p>
          )}

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-1/2">Dentro del alcance</th>
                  <th className="p-3 w-1/2">Fuera del alcance</th>
                  {isEditing && <th className="p-3 w-12 text-center">Acción</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {data.alcanceItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className={
                      item.destacado
                        ? 'bg-emerald-50/70 font-semibold text-emerald-950'
                        : 'hover:bg-slate-50/60'
                    }
                  >
                    <td className="p-2.5 sm:p-3 border-r border-slate-200">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.dentro}
                          onChange={(e) => {
                            const updated = [...data.alcanceItems];
                            updated[idx] = { ...updated[idx], dentro: e.target.value };
                            setData({ ...data, alcanceItems: updated });
                          }}
                          className="w-full text-xs p-1 bg-white border border-slate-300 rounded"
                        />
                      ) : (
                        <span>{item.dentro}</span>
                      )}
                    </td>
                    <td className="p-2.5 sm:p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.fuera}
                          onChange={(e) => {
                            const updated = [...data.alcanceItems];
                            updated[idx] = { ...updated[idx], fuera: e.target.value };
                            setData({ ...data, alcanceItems: updated });
                          }}
                          className="w-full text-xs p-1 bg-white border border-slate-300 rounded"
                        />
                      ) : (
                        <span>{item.fuera}</span>
                      )}
                    </td>
                    {isEditing && (
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = data.alcanceItems.filter((_, i) => i !== idx);
                            setData({ ...data, alcanceItems: updated });
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cuadro de Redacción de la Definición Alcance (conforme a la imagen adjunta) */}
          <div
            id="cuadro-redaccion-definicion-alcance"
            className="mt-6 border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs"
          >
            <div className="bg-[#1e40af] text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                {isEditing || isEditingRedaccion ? (
                  <input
                    type="text"
                    value={redaccionAlcanceData.titulo}
                    onChange={(e) => handleUpdateRedaccionTitulo(e.target.value)}
                    className="w-full max-w-lg text-sm sm:text-base font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-blue-200 focus:outline-none"
                    placeholder="3.  Redacción de la   Definición Alcance"
                  />
                ) : (
                  <h3 className="text-sm sm:text-base font-bold tracking-tight text-white">
                    {redaccionAlcanceData.titulo}
                  </h3>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-edit-redaccion-alcance"
                  onClick={() => setIsEditingRedaccion(!isEditingRedaccion)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Editar texto de redacción del alcance"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditing || isEditingRedaccion ? 'Ver Formato' : 'Editar'}</span>
                </button>
                {(isEditing || isEditingRedaccion) && (
                  <button
                    type="button"
                    onClick={handleAddRedaccionParrafo}
                    className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white text-[#1e40af] hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3 h-3" /> Añadir Párrafo
                  </button>
                )}
              </div>
            </div>

            <div className="p-5 sm:p-7 space-y-4 text-slate-800 text-xs sm:text-[13.5px] leading-relaxed font-normal bg-white">
              {redaccionAlcanceData.parrafos.map((parrafo, pIdx) => {
                if (isEditing || isEditingRedaccion) {
                  return (
                    <div
                      key={pIdx}
                      className="space-y-1 bg-slate-50/70 p-3 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span>Párrafo {pIdx + 1}</span>
                        {redaccionAlcanceData.parrafos.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteRedaccionParrafo(pIdx)}
                            className="text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Eliminar
                          </button>
                        )}
                      </div>
                      <textarea
                        rows={3}
                        value={parrafo}
                        onChange={(e) =>
                          handleUpdateRedaccionParrafo(pIdx, e.target.value)
                        }
                        className="w-full text-xs sm:text-[13px] text-slate-800 border border-sky-300 rounded p-2 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                  );
                }

                // Render with highlight
                const highlightPhrase =
                  'con las facultades que termine en el mencionado plazo';
                const lower = parrafo.toLowerCase();
                const targetIndex = lower.indexOf(highlightPhrase.toLowerCase());

                if (targetIndex !== -1) {
                  const before = parrafo.substring(0, targetIndex);
                  const segmentMatch = parrafo.substring(targetIndex);
                  const periodMatch = segmentMatch.match(
                    /^con las facultades que termine en el mencionado plazo\s*\.?/i
                  );
                  const matchedText = periodMatch
                    ? periodMatch[0]
                    : parrafo.substring(
                        targetIndex,
                        targetIndex + highlightPhrase.length
                      );
                  const after = parrafo.substring(
                    targetIndex + matchedText.length
                  );

                  return (
                    <p
                      key={pIdx}
                      className="text-justify text-slate-800 leading-relaxed"
                    >
                      {before}
                      <mark className="bg-yellow-300 text-slate-950 font-semibold px-1 py-0.5 rounded-xs">
                        {matchedText}
                      </mark>
                      {after}
                    </p>
                  );
                }

                return (
                  <p
                    key={pIdx}
                    className="text-justify text-slate-800 leading-relaxed"
                  >
                    {parrafo}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= SECCIÓN 4: EDT / WBS ================= */}
      {(activeSectionTab === 'all' || activeSectionTab === 'sec-4') && (
        <div
          id="sec-4"
          className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center shrink-0">
                4
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Estructura de desglose del trabajo (EDT / WBS)
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-sky-50 text-sky-800 rounded-full border border-sky-200 font-mono">
                {edtViewMode === 'cronograma_csv'
                  ? `${cronogramaTasks.length} tareas (CSV Transcrito)`
                  : `${data.edtItems.length} filas`}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  id="btn-switch-edt-cronograma-csv"
                  onClick={() => setEdtViewMode('cronograma_csv')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    edtViewMode === 'cronograma_csv'
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Mostrar cuadros por fase con las 5 columnas extraídas del cronograma CSV"
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Cuadros por Fase (CSV)</span>
                </button>
                <button
                  type="button"
                  id="btn-switch-edt-resumen"
                  onClick={() => setEdtViewMode('edt')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    edtViewMode === 'edt'
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Mostrar tabla EDT institucional resumida"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>EDT Resumen</span>
                </button>
              </div>

              {edtViewMode === 'edt' && (
                <button
                  type="button"
                  id="btn-insertar-fila-edt-header"
                  onClick={() => handleInsertEdtRow()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  title="Insertar nueva fila al final de la tabla EDT"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insertar Fila EDT</span>
                </button>
              )}

              {!isEditing && (
                <button
                  type="button"
                  id="btn-activar-edicion-edt"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  title="Activar edición de campos en la EDT"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Modo Edición</span>
                </button>
              )}
            </div>
          </div>

          {isEditing || activeEditingDescKey === 'sec-4' ? (
            <div className="space-y-2 p-3 bg-sky-50/40 border border-sky-300/80 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Descripción de la EDT / WBS:</span>
                </label>
                {activeEditingDescKey === 'sec-4' && !isEditing && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCancelDesc}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <X className="w-3 h-3" />
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveDesc('edtTexto')}
                      className="px-3 py-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Guardar
                    </button>
                  </div>
                )}
              </div>
              <textarea
                rows={3}
                value={isEditing ? data.edtTexto : tempDescValue}
                onChange={(e) => {
                  if (isEditing) {
                    setData({ ...data, edtTexto: e.target.value });
                  } else {
                    setTempDescValue(e.target.value);
                  }
                }}
                className="w-full text-xs sm:text-sm text-slate-800 border border-sky-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed shadow-2xs"
                placeholder="Escribe la descripción de la EDT..."
              />
              <p className="text-[11px] text-slate-500">
                {isEditing ? 'Edición en vivo habilitada por el Modo Edición general.' : 'Presiona "Guardar" para actualizar y sincronizar esta descripción en todo el sistema.'}
              </p>
            </div>
          ) : (
            <p
              id="desc-sec-4"
              onClick={() => handleStartEditingDesc('sec-4', data.edtTexto)}
              title="Haz clic para editar la descripción de este apartado"
              className="text-xs text-slate-600 leading-relaxed p-2 -m-2 rounded-lg border border-transparent hover:border-sky-300/70 hover:bg-sky-50/50 cursor-pointer group transition-all flex items-start justify-between gap-3"
            >
              <span className="flex-1">{data.edtTexto}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-100/80 group-hover:bg-sky-200 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Edit3 className="w-3 h-3" />
                Editar descripción
              </span>
            </p>
          )}

          {edtViewMode === 'cronograma_csv' ? (
            <div className="space-y-6 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2.5 bg-sky-50/70 p-3.5 rounded-xl border border-sky-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-950">
                    Transcripción Oficial Fiel de Tareas por Fases (Formato CSV 5 Columnas)
                  </span>
                  <span className="text-[11px] font-mono text-sky-800 bg-white px-2.5 py-0.5 rounded-full border border-sky-300 font-bold">
                    {cronogramaTasks.length} Tareas Totales
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyAllMdSec9}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    {copiedAllMdSec9 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAllMdSec9 ? '¡Copiado!' : 'Copiar Todo Markdown'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload5ColCsvSec9}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Descargar CSV</span>
                  </button>
                </div>
              </div>

              {Object.entries(cronogramaTareasByFase).map(([fase, items]) => {
                const tareas = items as CronogramaItem[];
                return (
                  <div key={fase} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="bg-slate-800 text-white px-4 py-3 font-bold text-xs uppercase tracking-wide flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                        <span className="font-bold text-sm tracking-tight text-white capitalize">{fase}</span>
                        <span className="text-xs text-slate-300 font-mono bg-slate-700/80 px-2 py-0.5 rounded">
                          {tareas.length} {tareas.length === 1 ? 'tarea' : 'tareas'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyPhaseMdSec9(fase, tareas)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-100 hover:text-white text-xs font-medium transition-colors cursor-pointer border border-slate-600"
                      >
                        {copiedFaseSec9 === fase ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300 font-bold">¡Copiada!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-300" />
                            <span>Copiar Tabla Markdown</span>
                          </>
                        )}
                      </button>
                    </div>

                    <CronogramaDetailedTable
                      tareas={tareas}
                      allTareas={cronogramaTasks}
                      viewFormat="csv"
                      isEditing={isEditing}
                      onTaskChange={handleCronogramaTaskChange}
                      onDeleteTask={handleDeleteCronogramaTask}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 w-28">Fase</th>
                  <th className="p-2.5 w-44">Etapa</th>
                  <th className="p-2.5 w-52">Actividad</th>
                  <th className="p-2.5">Paquete de trabajo</th>
                  <th className="p-2.5 w-28 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {data.edtItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-mono font-bold text-slate-900 border-r border-slate-200 bg-slate-50/40">
                      {isEditing ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={item.faseId}
                            onChange={(e) => {
                              const updated = [...data.edtItems];
                              updated[idx] = { ...updated[idx], faseId: e.target.value };
                              setData({ ...data, edtItems: updated });
                            }}
                            className="w-full text-xs font-bold p-1 bg-white border border-slate-300 rounded"
                            placeholder="Fase (ej: F1)..."
                          />
                          <input
                            type="text"
                            value={item.faseNombre}
                            onChange={(e) => {
                              const updated = [...data.edtItems];
                              updated[idx] = { ...updated[idx], faseNombre: e.target.value };
                              setData({ ...data, edtItems: updated });
                            }}
                            className="w-full text-[11px] p-1 bg-white border border-slate-300 rounded"
                            placeholder="Nombre fase..."
                          />
                          <input
                            type="text"
                            value={item.fasePlazo || ''}
                            onChange={(e) => {
                              const updated = [...data.edtItems];
                              updated[idx] = { ...updated[idx], fasePlazo: e.target.value };
                              setData({ ...data, edtItems: updated });
                            }}
                            className="w-full text-[10px] p-1 bg-white border border-slate-300 rounded text-slate-500"
                            placeholder="Plazo (ej: Jun - Sep)..."
                          />
                        </div>
                      ) : (
                        <div>
                          <span className="text-sky-700 font-bold">{item.faseId}</span>
                          <div className="text-[11px] font-medium text-slate-600">
                            {item.faseNombre}
                          </div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {item.fasePlazo}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 font-medium text-slate-800">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.etapa}
                          onChange={(e) => {
                            const updated = [...data.edtItems];
                            updated[idx] = { ...updated[idx], etapa: e.target.value };
                            setData({ ...data, edtItems: updated });
                          }}
                          className="w-full text-xs p-1 bg-white border border-slate-300 rounded"
                          placeholder="Etapa..."
                        />
                      ) : (
                        item.etapa
                      )}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-slate-700 font-medium">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.actividad}
                          onChange={(e) => {
                            const updated = [...data.edtItems];
                            updated[idx] = { ...updated[idx], actividad: e.target.value };
                            setData({ ...data, edtItems: updated });
                          }}
                          className="w-full text-xs p-1 bg-white border border-slate-300 rounded"
                          placeholder="Actividad..."
                        />
                      ) : (
                        item.actividad
                      )}
                    </td>
                    <td className="p-2.5 text-slate-800">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.paqueteTrabajo}
                          onChange={(e) => {
                            const updated = [...data.edtItems];
                            updated[idx] = {
                              ...updated[idx],
                              paqueteTrabajo: e.target.value,
                            };
                            setData({ ...data, edtItems: updated });
                          }}
                          className="w-full text-xs p-1 bg-white border border-slate-300 rounded"
                          placeholder="Paquete de trabajo / Entregable..."
                        />
                      ) : (
                        item.paqueteTrabajo
                      )}
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          id={`btn-insert-below-${idx}`}
                          onClick={() => handleInsertEdtRow(idx)}
                          className="p-1.5 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded transition-colors cursor-pointer"
                          title="Insertar nueva fila debajo de esta"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          id={`btn-duplicate-${idx}`}
                          onClick={() => handleDuplicateEdtRow(idx)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Duplicar esta fila"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {data.edtItems.length > 1 && (
                          <button
                            type="button"
                            id={`btn-delete-${idx}`}
                            onClick={() => handleDeleteEdtRow(idx)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Eliminar esta fila"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Toolbar inferior para insertar más filas */}
            <div className="p-3 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-insertar-fila-al-final"
                  onClick={() => handleInsertEdtRow()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Insertar fila al final</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-500 font-medium mr-1">
                  Insertar por fase:
                </span>
                <button
                  type="button"
                  id="btn-insert-fase1"
                  onClick={() =>
                    handleInsertEdtRow(undefined, {
                      id: 'F1',
                      nombre: 'Identificación',
                      plazo: 'Jun - Sep',
                    })
                  }
                  className="px-2 py-1 rounded bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-300 hover:border-sky-300 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  + En Fase 1 (Identificación)
                </button>
                <button
                  type="button"
                  id="btn-insert-fase2"
                  onClick={() =>
                    handleInsertEdtRow(undefined, {
                      id: 'F2',
                      nombre: 'Implementación',
                      plazo: 'Oct - Dic',
                    })
                  }
                  className="px-2 py-1 rounded bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-300 hover:border-sky-300 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  + En Fase 2 (Implementación)
                </button>
                <button
                  type="button"
                  id="btn-insert-fase3"
                  onClick={() =>
                    handleInsertEdtRow(undefined, {
                      id: 'F3',
                      nombre: 'Evaluación y Cierre',
                      plazo: 'Ene - Mar',
                    })
                  }
                  className="px-2 py-1 rounded bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-300 hover:border-sky-300 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  + En Fase 3 (Evaluación)
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      )}

      {/* ================= SECCIÓN 5: Matriz de trazabilidad de requisitos ================= */}
      {(activeSectionTab === 'all' || activeSectionTab === 'sec-5') && (
        <div
          id="sec-5"
          className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center shrink-0">
                5
              </span>
              Matriz de trazabilidad de requisitos ({data.requisitos.length})
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  const nextId = `REQ-0${data.requisitos.length + 1}`;
                  setData({
                    ...data,
                    requisitos: [
                      ...data.requisitos,
                      {
                        id: nextId,
                        requisito: 'Nuevo requisito técnico...',
                        origen: 'OGPL',
                        entregable: 'Informe',
                        tarea: 'T-00',
                        estado: 'En proceso',
                      },
                    ],
                  });
                }}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Añadir Requisito
              </button>
            )}
          </div>

          {isEditing || activeEditingDescKey === 'sec-5' ? (
            <div className="space-y-2 p-3 bg-sky-50/40 border border-sky-300/80 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Descripción de la matriz de requisitos:</span>
                </label>
                {activeEditingDescKey === 'sec-5' && !isEditing && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCancelDesc}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <X className="w-3 h-3" />
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveDesc('requisitosTexto')}
                      className="px-3 py-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Guardar
                    </button>
                  </div>
                )}
              </div>
              <textarea
                rows={3}
                value={isEditing ? data.requisitosTexto : tempDescValue}
                onChange={(e) => {
                  if (isEditing) {
                    setData({ ...data, requisitosTexto: e.target.value });
                  } else {
                    setTempDescValue(e.target.value);
                  }
                }}
                className="w-full text-xs sm:text-sm text-slate-800 border border-sky-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed shadow-2xs"
                placeholder="Escribe la descripción de la matriz de requisitos..."
              />
              <p className="text-[11px] text-slate-500">
                {isEditing ? 'Edición en vivo habilitada por el Modo Edición general.' : 'Presiona "Guardar" para actualizar y sincronizar esta descripción en todo el sistema.'}
              </p>
            </div>
          ) : (
            <p
              id="desc-sec-5"
              onClick={() => handleStartEditingDesc('sec-5', data.requisitosTexto)}
              title="Haz clic para editar la descripción de este apartado"
              className="text-xs text-slate-600 leading-relaxed p-2 -m-2 rounded-lg border border-transparent hover:border-sky-300/70 hover:bg-sky-50/50 cursor-pointer group transition-all flex items-start justify-between gap-3"
            >
              <span className="flex-1">{data.requisitosTexto}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-100/80 group-hover:bg-sky-200 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Edit3 className="w-3 h-3" />
                Editar descripción
              </span>
            </p>
          )}

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 w-16">ID</th>
                  <th className="p-2.5">Requisito</th>
                  <th className="p-2.5 w-24">Origen</th>
                  <th className="p-2.5 w-28">Entregable</th>
                  <th className="p-2.5 w-32 font-mono">Tarea Cronograma</th>
                  <th className="p-2.5 w-28 text-center">Estado</th>
                  {isEditing && <th className="p-2.5 w-12 text-center">Acción</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {data.requisitos.map((req, idx) => (
                  <tr
                    key={req.id || idx}
                    className={
                      req.destacado
                        ? 'bg-emerald-50/60 font-semibold'
                        : 'hover:bg-slate-50/50'
                    }
                  >
                    <td className="p-2.5 font-mono font-bold text-sky-800 border-r border-slate-200">
                      {isEditing ? (
                        <input
                          type="text"
                          value={req.id}
                          onChange={(e) => {
                            const updated = [...data.requisitos];
                            updated[idx] = { ...updated[idx], id: e.target.value };
                            setData({ ...data, requisitos: updated });
                          }}
                          className="w-full text-xs font-bold p-1 bg-white border border-slate-300 rounded"
                        />
                      ) : (
                        req.id
                      )}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-slate-900">
                      {isEditing ? (
                        <input
                          type="text"
                          value={req.requisito}
                          onChange={(e) => {
                            const updated = [...data.requisitos];
                            updated[idx] = { ...updated[idx], requisito: e.target.value };
                            setData({ ...data, requisitos: updated });
                          }}
                          className="w-full text-xs p-1 bg-white border border-slate-300 rounded"
                        />
                      ) : (
                        req.requisito
                      )}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-slate-600">
                      {isEditing ? (
                        <input
                          type="text"
                          value={req.origen}
                          onChange={(e) => {
                            const updated = [...data.requisitos];
                            updated[idx] = { ...updated[idx], origen: e.target.value };
                            setData({ ...data, requisitos: updated });
                          }}
                          className="w-full text-xs p-1 bg-white border border-slate-300 rounded"
                        />
                      ) : (
                        req.origen
                      )}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 font-medium text-slate-700">
                      {isEditing ? (
                        <input
                          type="text"
                          value={req.entregable}
                          onChange={(e) => {
                            const updated = [...data.requisitos];
                            updated[idx] = { ...updated[idx], entregable: e.target.value };
                            setData({ ...data, requisitos: updated });
                          }}
                          className="w-full text-xs p-1 bg-white border border-slate-300 rounded"
                        />
                      ) : (
                        req.entregable
                      )}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 font-mono text-[11px] text-slate-600">
                      {isEditing ? (
                        <input
                          type="text"
                          value={req.tarea}
                          onChange={(e) => {
                            const updated = [...data.requisitos];
                            updated[idx] = { ...updated[idx], tarea: e.target.value };
                            setData({ ...data, requisitos: updated });
                          }}
                          className="w-full text-xs p-1 bg-white border border-slate-300 rounded"
                        />
                      ) : (
                        req.tarea
                      )}
                    </td>
                    <td className="p-2.5 text-center">
                      {isEditing ? (
                        <select
                          value={req.estado}
                          onChange={(e) => {
                            const updated = [...data.requisitos];
                            updated[idx] = {
                              ...updated[idx],
                              estado: e.target.value as any,
                            };
                            setData({ ...data, requisitos: updated });
                          }}
                          className="text-xs p-1 bg-white border border-slate-300 rounded"
                        >
                          <option value="Conforme">Conforme</option>
                          <option value="En proceso">En proceso</option>
                          <option value="No iniciado">No iniciado</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            req.estado === 'Conforme'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.estado === 'En proceso'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {req.estado}
                        </span>
                      )}
                    </td>
                    {isEditing && (
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = data.requisitos.filter((_, i) => i !== idx);
                            setData({ ...data, requisitos: updated });
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SECCIÓN 6: Criterios de aceptación ================= */}
      {(activeSectionTab === 'all' || activeSectionTab === 'sec-6') && (
        <div
          id="sec-6"
          className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center shrink-0">
                6
              </span>
              Criterios de aceptación ({data.criterios.length})
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setData({
                    ...data,
                    criterios: [
                      ...data.criterios,
                      {
                        entregable: 'Nuevo Entregable',
                        revisorTecnico: 'Oficina de Racionalización',
                        criterio: 'Criterio técnico de aprobación...',
                        aprobador: 'Jefe OGPL',
                      },
                    ],
                  });
                }}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Añadir Criterio
              </button>
            )}
          </div>

          {isEditing || activeEditingDescKey === 'sec-6' ? (
            <div className="space-y-2 p-3 bg-sky-50/40 border border-sky-300/80 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Descripción de criterios de aceptación:</span>
                </label>
                {activeEditingDescKey === 'sec-6' && !isEditing && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCancelDesc}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <X className="w-3 h-3" />
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveDesc('criteriosTexto')}
                      className="px-3 py-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Guardar
                    </button>
                  </div>
                )}
              </div>
              <textarea
                rows={2}
                value={isEditing ? (data.criteriosTexto ?? PLAN_DE_GESTION_V2_DATA.criteriosTexto) : tempDescValue}
                onChange={(e) => {
                  if (isEditing) {
                    setData({ ...data, criteriosTexto: e.target.value });
                  } else {
                    setTempDescValue(e.target.value);
                  }
                }}
                className="w-full text-xs sm:text-sm text-slate-800 border border-sky-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed shadow-2xs"
                placeholder="Escribe la descripción de los criterios de aceptación..."
              />
              <p className="text-[11px] text-slate-500">
                {isEditing ? 'Edición en vivo habilitada por el Modo Edición general.' : 'Presiona "Guardar" para actualizar y sincronizar esta descripción en todo el sistema.'}
              </p>
            </div>
          ) : (
            <p
              id="desc-sec-6"
              onClick={() => handleStartEditingDesc('sec-6', data.criteriosTexto || PLAN_DE_GESTION_V2_DATA.criteriosTexto || '')}
              title="Haz clic para editar la descripción de este apartado"
              className="text-xs text-slate-600 leading-relaxed p-2 -m-2 rounded-lg border border-transparent hover:border-sky-300/70 hover:bg-sky-50/50 cursor-pointer group transition-all flex items-start justify-between gap-3"
            >
              <span className="flex-1">
                {data.criteriosTexto || PLAN_DE_GESTION_V2_DATA.criteriosTexto}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-100/80 group-hover:bg-sky-200 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Edit3 className="w-3 h-3" />
                Editar descripción
              </span>
            </p>
          )}

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 w-44">Entregable</th>
                  <th className="p-2.5 w-40">Revisor técnico</th>
                  <th className="p-2.5">Criterio de aceptación</th>
                  <th className="p-2.5 w-32">Aprobador</th>
                  {isEditing && <th className="p-2.5 w-12 text-center">Acción</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {data.criterios.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200">
                      {isEditing ? (
                        <input
                          type="text"
                          value={c.entregable}
                          onChange={(e) => {
                            const updated = [...data.criterios];
                            updated[idx] = { ...updated[idx], entregable: e.target.value };
                            setData({ ...data, criterios: updated });
                          }}
                          className="w-full text-xs font-bold p-1 bg-white border border-slate-300 rounded"
                        />
                      ) : (
                        c.entregable
                      )}
                    </td>
                    <td className="p-2.5 text-slate-700 border-r border-slate-200">
                      {isEditing ? (
                        <input
                          type="text"
                          value={c.revisorTecnico}
                          onChange={(e) => {
                            const updated = [...data.criterios];
                            updated[idx] = {
                              ...updated[idx],
                              revisorTecnico: e.target.value,
                            };
                            setData({ ...data, criterios: updated });
                          }}
                          className="w-full text-xs p-1 bg-white border border-slate-300 rounded"
                        />
                      ) : (
                        c.revisorTecnico
                      )}
                    </td>
                    <td className="p-2.5 text-slate-800 border-r border-slate-200 leading-relaxed">
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            value={c.criterio}
                            onChange={(e) => {
                              const updated = [...data.criterios];
                              updated[idx] = { ...updated[idx], criterio: e.target.value };
                              setData({ ...data, criterios: updated });
                            }}
                            className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 font-medium"
                          />
                          {(idx === 0 || c.entregable.toLowerCase().includes('magprof')) && (
                            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 pt-1">
                              <button
                                type="button"
                                id="link-directrices-anexo1-edit"
                                onClick={handleOpenAnexo1Directrices}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors shadow-2xs cursor-pointer group"
                                title="Abrir Directrices y Reglas Obligatorias de Llenado · Anexo 1"
                              >
                                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="underline decoration-emerald-500 underline-offset-2">
                                  Directrices y Reglas Obligatorias de Llenado · Anexo 1
                                </span>
                                <ExternalLink className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                              </button>
                              <button
                                type="button"
                                id="link-directrices-anexo3-edit"
                                onClick={handleOpenAnexo3Directrices}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 transition-colors shadow-2xs cursor-pointer group"
                                title="Abrir Directrices y Reglas Oficiales de Llenado · Anexo 3"
                              >
                                <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                <span className="underline decoration-sky-500 underline-offset-2">
                                  Directrices y Reglas Oficiales de Llenado · Anexo 3
                                </span>
                                <ExternalLink className="w-2.5 h-2.5 text-sky-600 shrink-0" />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="text-slate-800 font-medium leading-relaxed">
                            {c.criterio}
                          </p>
                          {(idx === 0 || c.entregable.toLowerCase().includes('magprof')) && (
                            <div className="mt-2.5 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
                              <button
                                type="button"
                                id="link-directrices-anexo1"
                                onClick={handleOpenAnexo1Directrices}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 hover:text-emerald-950 border border-emerald-300 hover:border-emerald-400 shadow-2xs transition-all cursor-pointer group text-left"
                                title="Abrir ventana: Directrices y Reglas Obligatorias de Llenado · Anexo 1"
                              >
                                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
                                <span className="underline decoration-emerald-500 decoration-1 underline-offset-2">
                                  Directrices y Reglas Obligatorias de Llenado · Anexo 1
                                </span>
                                <ExternalLink className="w-3 h-3 text-emerald-600 shrink-0" />
                              </button>

                              <button
                                type="button"
                                id="link-directrices-anexo3"
                                onClick={handleOpenAnexo3Directrices}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 hover:text-sky-950 border border-sky-300 hover:border-sky-400 shadow-2xs transition-all cursor-pointer group text-left"
                                title="Abrir ventana: Directrices y Reglas Oficiales de Llenado · Anexo 3"
                              >
                                <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600 group-hover:scale-110 transition-transform shrink-0" />
                                <span className="underline decoration-sky-500 decoration-1 underline-offset-2">
                                  Directrices y Reglas Oficiales de Llenado · Anexo 3
                                </span>
                                <ExternalLink className="w-3 h-3 text-sky-600 shrink-0" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-2.5 font-semibold text-sky-800">
                      {isEditing ? (
                        <input
                          type="text"
                          value={c.aprobador}
                          onChange={(e) => {
                            const updated = [...data.criterios];
                            updated[idx] = { ...updated[idx], aprobador: e.target.value };
                            setData({ ...data, criterios: updated });
                          }}
                          className="w-full text-xs p-1 bg-white border border-slate-300 rounded font-semibold text-sky-800"
                        />
                      ) : (
                        c.aprobador
                      )}
                    </td>
                    {isEditing && (
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = data.criterios.filter((_, i) => i !== idx);
                            setData({ ...data, criterios: updated });
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SECCIÓN 7: Matriz RACI ================= */}
      {(activeSectionTab === 'all' || activeSectionTab === 'sec-7') && (
        <div
          id="sec-7"
          className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center shrink-0">
                7
              </span>
              Roles y responsabilidades (Matriz RACI)
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-toggle-edit-raci"
                onClick={() => setIsEditing(!isEditing)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isEditing
                    ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                    : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                }`}
                title="Permite editar los textos de los encabezados y celdas de la Matriz RACI"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditing ? 'Terminar Edición' : 'Editar Encabezados'}</span>
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setData({
                      ...data,
                      rolesRaci: [
                        ...data.rolesRaci,
                        {
                          actividad: 'Nueva Actividad RACI',
                          decano: 'I',
                          respGxP: 'R',
                          ofRacionalizacion: 'A',
                          jefeOgpl: 'I',
                          rectorado: 'I',
                        },
                      ],
                    });
                  }}
                  className="text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Plus className="w-3 h-3" /> Añadir Fila RACI
                </button>
              )}
            </div>
          </div>

          {isEditing || activeEditingDescKey === 'sec-7' ? (
            <div className="space-y-2 p-3 bg-sky-50/40 border border-sky-300/80 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Descripción de roles y responsabilidades (Matriz RACI):</span>
                </label>
                {activeEditingDescKey === 'sec-7' && !isEditing && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCancelDesc}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <X className="w-3 h-3" />
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveDesc('rolesTexto')}
                      className="px-3 py-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Guardar
                    </button>
                  </div>
                )}
              </div>
              <textarea
                rows={3}
                value={isEditing ? data.rolesTexto : tempDescValue}
                onChange={(e) => {
                  if (isEditing) {
                    setData({ ...data, rolesTexto: e.target.value });
                  } else {
                    setTempDescValue(e.target.value);
                  }
                }}
                className="w-full text-xs sm:text-sm text-slate-800 border border-sky-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed shadow-2xs"
                placeholder="Escribe la descripción de la Matriz RACI..."
              />
              <p className="text-[11px] text-slate-500">
                {isEditing ? 'Edición en vivo habilitada por el Modo Edición general.' : 'Presiona "Guardar" para actualizar y sincronizar esta descripción en todo el sistema.'}
              </p>
            </div>
          ) : (
            <p
              id="desc-sec-7"
              onClick={() => handleStartEditingDesc('sec-7', data.rolesTexto)}
              title="Haz clic para editar la descripción de este apartado"
              className="text-xs text-slate-600 leading-relaxed p-2 -m-2 rounded-lg border border-transparent hover:border-sky-300/70 hover:bg-sky-50/50 cursor-pointer group transition-all flex items-start justify-between gap-3"
            >
              <span className="flex-1">{data.rolesTexto}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-100/80 group-hover:bg-sky-200 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Edit3 className="w-3 h-3" />
                Editar descripción
              </span>
            </p>
          )}

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-center text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 text-left min-w-[200px]">
                    {isEditing ? (
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="text-[10px] uppercase font-semibold text-sky-700 tracking-wider">
                          Columna 1
                        </span>
                        <input
                          type="text"
                          value={rolesCols.actividad}
                          onChange={(e) =>
                            handleUpdateRoleColumn('actividad', e.target.value)
                          }
                          className="w-full text-xs font-bold text-slate-800 p-1.5 bg-white border border-sky-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                          placeholder="Actividad"
                          title="Editar encabezado de columna Actividad"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer group inline-flex items-center gap-1.5 hover:text-sky-700 transition-colors"
                        title="Clic para editar este encabezado"
                      >
                        <span>{rolesCols.actividad}</span>
                        <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-sky-600 transition-opacity" />
                      </div>
                    )}
                  </th>
                  <th className="p-2.5 w-24 text-center">
                    {isEditing ? (
                      <div className="flex flex-col gap-0.5 items-center">
                        <span className="text-[10px] uppercase font-semibold text-sky-700 tracking-wider">
                          Columna 2
                        </span>
                        <input
                          type="text"
                          value={rolesCols.decano}
                          onChange={(e) =>
                            handleUpdateRoleColumn('decano', e.target.value)
                          }
                          className="w-full text-center text-xs font-bold text-slate-800 p-1.5 bg-white border border-sky-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                          placeholder="Decano"
                          title="Editar encabezado Decano"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer group inline-flex items-center justify-center gap-1 hover:text-sky-700 transition-colors"
                        title="Clic para editar este encabezado"
                      >
                        <span>{rolesCols.decano}</span>
                        <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-sky-600 transition-opacity" />
                      </div>
                    )}
                  </th>
                  <th className="p-2.5 w-32 text-center">
                    {isEditing ? (
                      <div className="flex flex-col gap-0.5 items-center">
                        <span className="text-[10px] uppercase font-semibold text-sky-700 tracking-wider">
                          Columna 3
                        </span>
                        <input
                          type="text"
                          value={rolesCols.respGxP}
                          onChange={(e) =>
                            handleUpdateRoleColumn('respGxP', e.target.value)
                          }
                          className="w-full text-center text-xs font-bold text-slate-800 p-1.5 bg-white border border-sky-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                          placeholder="Resp. GxP Fac."
                          title="Editar encabezado Resp. GxP Fac."
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer group inline-flex items-center justify-center gap-1 hover:text-sky-700 transition-colors"
                        title="Clic para editar este encabezado"
                      >
                        <span>{rolesCols.respGxP}</span>
                        <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-sky-600 transition-opacity" />
                      </div>
                    )}
                  </th>
                  <th className="p-2.5 w-32 text-center">
                    {isEditing ? (
                      <div className="flex flex-col gap-0.5 items-center">
                        <span className="text-[10px] uppercase font-semibold text-sky-700 tracking-wider">
                          Columna 4
                        </span>
                        <input
                          type="text"
                          value={rolesCols.ofRacionalizacion}
                          onChange={(e) =>
                            handleUpdateRoleColumn(
                              'ofRacionalizacion',
                              e.target.value
                            )
                          }
                          className="w-full text-center text-xs font-bold text-slate-800 p-1.5 bg-white border border-sky-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                          placeholder="Of. Racionaliz."
                          title="Editar encabezado Of. Racionaliz."
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer group inline-flex items-center justify-center gap-1 hover:text-sky-700 transition-colors"
                        title="Clic para editar este encabezado"
                      >
                        <span>{rolesCols.ofRacionalizacion}</span>
                        <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-sky-600 transition-opacity" />
                      </div>
                    )}
                  </th>
                  <th className="p-2.5 w-28 text-center">
                    {isEditing ? (
                      <div className="flex flex-col gap-0.5 items-center">
                        <span className="text-[10px] uppercase font-semibold text-sky-700 tracking-wider">
                          Columna 5
                        </span>
                        <input
                          type="text"
                          value={rolesCols.jefeOgpl}
                          onChange={(e) =>
                            handleUpdateRoleColumn('jefeOgpl', e.target.value)
                          }
                          className="w-full text-center text-xs font-bold text-slate-800 p-1.5 bg-white border border-sky-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                          placeholder="Jefe OGPL"
                          title="Editar encabezado Jefe OGPL"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer group inline-flex items-center justify-center gap-1 hover:text-sky-700 transition-colors"
                        title="Clic para editar este encabezado"
                      >
                        <span>{rolesCols.jefeOgpl}</span>
                        <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-sky-600 transition-opacity" />
                      </div>
                    )}
                  </th>
                  <th className="p-2.5 w-28 text-center">
                    {isEditing ? (
                      <div className="flex flex-col gap-0.5 items-center">
                        <span className="text-[10px] uppercase font-semibold text-sky-700 tracking-wider">
                          Columna 6
                        </span>
                        <input
                          type="text"
                          value={rolesCols.rectorado}
                          onChange={(e) =>
                            handleUpdateRoleColumn('rectorado', e.target.value)
                          }
                          className="w-full text-center text-xs font-bold text-slate-800 p-1.5 bg-white border border-sky-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                          placeholder="Rectorado"
                          title="Editar encabezado Rectorado"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer group inline-flex items-center justify-center gap-1 hover:text-sky-700 transition-colors"
                        title="Clic para editar este encabezado"
                      >
                        <span>{rolesCols.rectorado}</span>
                        <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-sky-600 transition-opacity" />
                      </div>
                    )}
                  </th>
                  {isEditing && <th className="p-2.5 w-12 text-center">Acción</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {data.rolesRaci.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-2.5 text-left font-medium text-slate-900 border-r border-slate-200">
                      {isEditing ? (
                        <input
                          type="text"
                          value={r.actividad}
                          onChange={(e) => {
                            const updated = [...data.rolesRaci];
                            updated[idx] = { ...updated[idx], actividad: e.target.value };
                            setData({ ...data, rolesRaci: updated });
                          }}
                          className="w-full text-xs p-1 bg-white border border-slate-300 rounded"
                        />
                      ) : (
                        r.actividad
                      )}
                    </td>
                    {['decano', 'respGxP', 'ofRacionalizacion', 'jefeOgpl', 'rectorado'].map(
                      (roleKey) => {
                        const val = (r as any)[roleKey];
                        return (
                          <td
                            key={roleKey}
                            className={`p-2.5 border-r border-slate-200 font-bold ${
                              val === 'A' ? 'bg-amber-100 text-amber-900' : ''
                            }`}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={val}
                                onChange={(e) => {
                                  const updated = [...data.rolesRaci];
                                  (updated[idx] as any)[roleKey] = e.target.value.toUpperCase();
                                  setData({ ...data, rolesRaci: updated });
                                }}
                                className="w-10 text-center font-bold text-xs p-0.5 bg-white border border-slate-300 rounded"
                              />
                            ) : (
                              val
                            )}
                          </td>
                        );
                      }
                    )}
                    {isEditing && (
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = data.rolesRaci.filter((_, i) => i !== idx);
                            setData({ ...data, rolesRaci: updated });
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400">
            R = Responsable de ejecución · A = Aprobador final único · C = Consultado · I = Informado
          </p>
        </div>
      )}

      {/* ================= SECCIÓN 8: Control de cambios ================= */}
      {(activeSectionTab === 'all' || activeSectionTab === 'sec-8') && (
        <div
          id="sec-8"
          className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center shrink-0">
                8
              </span>
              8. Control de Cambios del Alcance
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                id="btn-toggle-edit-sec8"
                onClick={() => setIsEditing(!isEditing)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isEditing
                    ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                    : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                }`}
                title="Permite editar la tabla, añadir filas y columnas, y moverlas"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditing ? 'Terminar Edición' : 'Editar Tabla'}</span>
              </button>

              <button
                type="button"
                id="btn-sort-paso-sec8"
                onClick={() => handleSortControlCambios('paso')}
                className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                title="Ordenar filas por número de Paso (1..N)"
              >
                <ArrowUpDown className="w-3 h-3 text-slate-600" />
                <span>Ordenar por Paso</span>
              </button>

              {isEditing && (
                <>
                  <button
                    type="button"
                    id="btn-renumber-paso-sec8"
                    onClick={handleRenumberPasos}
                    className="text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                    title="Renumerar pasos correlativamente (1, 2, 3...) según el orden actual de las filas"
                  >
                    <ListOrdered className="w-3 h-3 text-emerald-700" />
                    <span>Renumerar (1..N)</span>
                  </button>

                  <button
                    type="button"
                    id="btn-add-row-sec8"
                    onClick={() => {
                      const cols =
                        data.controlCambiosColumnas ||
                        PLAN_DE_GESTION_V2_DATA.controlCambiosColumnas ||
                        [];
                      const nextPaso = data.controlCambios.length + 1;
                      const newRow: PlanControlCambio = {
                        paso: nextPaso,
                        accion: 'Nueva acción: Descripción del paso...',
                        responsable: 'Oficina de Racionalización',
                      };
                      cols.forEach((col) => {
                        if (
                          col.id !== 'paso' &&
                          col.id !== 'accion' &&
                          col.id !== 'responsable'
                        ) {
                          newRow[col.id] = '';
                        }
                      });
                      setData({
                        ...data,
                        controlCambios: [...data.controlCambios, newRow],
                      });
                    }}
                    className="text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus className="w-3 h-3" /> Añadir Fila
                  </button>

                  <button
                    type="button"
                    id="btn-add-col-sec8"
                    onClick={() => {
                      const currentCols =
                        data.controlCambiosColumnas ||
                        PLAN_DE_GESTION_V2_DATA.controlCambiosColumnas || [
                          { id: 'paso', nombre: 'Paso' },
                          {
                            id: 'accion',
                            nombre:
                              'Acción (Alineada al PMBOK 6ta Edición y Alcance del Proyecto)',
                          },
                          { id: 'responsable', nombre: 'Responsable' },
                        ];
                      const newColId = `col_${Date.now()}`;
                      const newColName = `Columna ${currentCols.length + 1}`;
                      const updatedCols = [
                        ...currentCols,
                        { id: newColId, nombre: newColName },
                      ];
                      const updatedRows = data.controlCambios.map((r) => ({
                        ...r,
                        [newColId]: '',
                      }));
                      setData({
                        ...data,
                        controlCambiosColumnas: updatedCols,
                        controlCambios: updatedRows,
                      });
                    }}
                    className="text-xs font-semibold text-sky-800 bg-sky-100 hover:bg-sky-200 border border-sky-300 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Columns3 className="w-3 h-3" /> Añadir Columna
                  </button>
                </>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="bg-sky-50/70 border border-sky-200 rounded-lg p-2 text-xs text-sky-800 flex items-center gap-2">
              <Move className="w-4 h-4 shrink-0 text-sky-600" />
              <span>
                <strong>Modo interactivo:</strong> Arrastra columnas o filas para reordenarlas libremente, o usa las flechas ◀ ▶ en los encabezados y ▲ ▼ en cada fila. Puedes ordenar los datos haciendo clic en cualquier encabezado o con el botón &ldquo;Ordenar&rdquo;.
              </span>
            </div>
          )}

          {isEditing || activeEditingDescKey === 'sec-8' ? (
            <div className="space-y-2 p-3 bg-sky-50/40 border border-sky-300/80 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Descripción del control de cambios del alcance:</span>
                </label>
                {activeEditingDescKey === 'sec-8' && !isEditing && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCancelDesc}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <X className="w-3 h-3" />
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveDesc('controlCambiosTexto')}
                      className="px-3 py-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Guardar
                    </button>
                  </div>
                )}
              </div>
              <textarea
                rows={4}
                value={isEditing ? data.controlCambiosTexto : tempDescValue}
                onChange={(e) => {
                  if (isEditing) {
                    setData({ ...data, controlCambiosTexto: e.target.value });
                  } else {
                    setTempDescValue(e.target.value);
                  }
                }}
                className="w-full text-xs sm:text-sm text-slate-800 border border-sky-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed shadow-2xs"
                placeholder="Escribe la descripción del control de cambios del alcance..."
              />
              <p className="text-[11px] text-slate-500">
                {isEditing ? 'Edición en vivo habilitada por el Modo Edición general.' : 'Presiona "Guardar" para actualizar y sincronizar esta descripción en todo el sistema.'}
              </p>
            </div>
          ) : (
            <p
              id="desc-sec-8"
              onClick={() => handleStartEditingDesc('sec-8', data.controlCambiosTexto)}
              title="Haz clic para editar la descripción de este apartado"
              className="text-xs text-slate-700 leading-relaxed text-justify p-2 -m-2 rounded-lg border border-transparent hover:border-sky-300/70 hover:bg-sky-50/50 cursor-pointer group transition-all flex items-start justify-between gap-3"
            >
              <span className="flex-1">{data.controlCambiosTexto}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-100/80 group-hover:bg-sky-200 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Edit3 className="w-3 h-3" />
                Editar descripción
              </span>
            </p>
          )}

          {(() => {
            const controlCols =
              data.controlCambiosColumnas ||
              PLAN_DE_GESTION_V2_DATA.controlCambiosColumnas || [
                { id: 'paso', nombre: 'Paso' },
                {
                  id: 'accion',
                  nombre:
                    'Acción (Alineada al PMBOK 6ta Edición y Alcance del Proyecto)',
                },
                { id: 'responsable', nombre: 'Responsable' },
              ];

            return (
              <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      {controlCols.map((col, colIdx) => (
                        <th
                          key={col.id}
                          draggable={true}
                          onDragStart={(e) => handleColDragStart(e, colIdx)}
                          onDragOver={(e) => handleColDragOver(e, colIdx)}
                          onDrop={(e) => handleColDrop(e, colIdx)}
                          onDragEnd={() => {
                            setDraggedColIdx(null);
                            setDragOverColIdx(null);
                          }}
                          className={`p-2.5 border-r border-slate-200 last:border-r-0 transition-colors select-none ${
                            dragOverColIdx === colIdx
                              ? 'bg-sky-100 border-l-4 border-l-sky-600'
                              : 'bg-slate-50 hover:bg-slate-100/70'
                          } ${
                            col.id === 'paso'
                              ? 'w-28 text-center'
                              : col.id === 'responsable'
                              ? 'w-56 sm:w-64'
                              : 'min-w-[220px]'
                          }`}
                        >
                          {isEditing ? (
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between gap-1">
                                <div className="flex items-center gap-0.5">
                                  <span
                                    title="Arrastrar para mover columna"
                                    className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-0.5"
                                  >
                                    <GripVertical className="w-3.5 h-3.5" />
                                  </span>
                                  {/* Mover a la izquierda */}
                                  <button
                                    type="button"
                                    title="Mover columna a la izquierda"
                                    disabled={colIdx === 0}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveColumn(colIdx, 'left');
                                    }}
                                    className={`p-1 rounded transition-colors ${
                                      colIdx === 0
                                        ? 'text-slate-300 cursor-not-allowed'
                                        : 'text-slate-600 hover:text-sky-700 hover:bg-sky-100 cursor-pointer'
                                    }`}
                                  >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                  </button>
                                  {/* Mover a la derecha */}
                                  <button
                                    type="button"
                                    title="Mover columna a la derecha"
                                    disabled={colIdx === controlCols.length - 1}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveColumn(colIdx, 'right');
                                    }}
                                    className={`p-1 rounded transition-colors ${
                                      colIdx === controlCols.length - 1
                                        ? 'text-slate-300 cursor-not-allowed'
                                        : 'text-slate-600 hover:text-sky-700 hover:bg-sky-100 cursor-pointer'
                                    }`}
                                  >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <div className="flex items-center gap-1">
                                  {/* Ordenar */}
                                  <button
                                    type="button"
                                    title="Ordenar filas por esta columna"
                                    onClick={() => handleSortControlCambios(col.id)}
                                    className={`p-1 rounded flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                                      controlCambiosSort?.colId === col.id
                                        ? 'text-sky-700 bg-sky-100 ring-1 ring-sky-300'
                                        : 'text-slate-500 hover:text-sky-700 hover:bg-slate-200/70'
                                    }`}
                                  >
                                    {controlCambiosSort?.colId === col.id ? (
                                      controlCambiosSort.direction === 'asc' ? (
                                        <ArrowUp className="w-3 h-3 text-sky-700" />
                                      ) : (
                                        <ArrowDown className="w-3 h-3 text-sky-700" />
                                      )
                                    ) : (
                                      <ArrowUpDown className="w-3 h-3" />
                                    )}
                                  </button>

                                  {/* Eliminar columna */}
                                  {controlCols.length > 1 && (
                                    <button
                                      type="button"
                                      title="Eliminar columna"
                                      onClick={() => {
                                        const updatedCols = controlCols.filter(
                                          (_, i) => i !== colIdx
                                        );
                                        const updatedRows = data.controlCambios.map(
                                          (r) => {
                                            const copy = { ...r };
                                            delete copy[col.id];
                                            return copy;
                                          }
                                        );
                                        setData({
                                          ...data,
                                          controlCambiosColumnas: updatedCols,
                                          controlCambios: updatedRows,
                                        });
                                      }}
                                      className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1 rounded shrink-0 cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <input
                                type="text"
                                value={col.nombre}
                                onChange={(e) => {
                                  const updatedCols = [...controlCols];
                                  updatedCols[colIdx] = {
                                    ...updatedCols[colIdx],
                                    nombre: e.target.value,
                                  };
                                  setData({
                                    ...data,
                                    controlCambiosColumnas: updatedCols,
                                  });
                                }}
                                className="w-full text-xs font-bold p-1 bg-white border border-sky-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                placeholder="Nombre columna"
                              />
                            </div>
                          ) : (
                            <div
                              className="flex items-center justify-between gap-1.5 cursor-pointer group py-0.5"
                              onClick={() => handleSortControlCambios(col.id)}
                              title="Clic para ordenar por esta columna (o arrastra para mover columna)"
                            >
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="text-slate-300 group-hover:text-slate-500 cursor-grab active:cursor-grabbing p-0.5"
                                  title="Arrastrar para mover columna"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <GripVertical className="w-3 h-3" />
                                </span>
                                <span className="font-bold text-slate-800 group-hover:text-sky-800 transition-colors">
                                  {col.nombre}
                                </span>
                              </div>
                              <span
                                className={`p-1 rounded transition-colors ${
                                  controlCambiosSort?.colId === col.id
                                    ? 'text-sky-700 bg-sky-100 font-bold'
                                    : 'text-slate-400 group-hover:text-slate-700'
                                }`}
                              >
                                {controlCambiosSort?.colId === col.id ? (
                                  controlCambiosSort.direction === 'asc' ? (
                                    <ArrowUp className="w-3.5 h-3.5 text-sky-700" />
                                  ) : (
                                    <ArrowDown className="w-3.5 h-3.5 text-sky-700" />
                                  )
                                ) : (
                                  <ArrowUpDown className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                                )}
                              </span>
                            </div>
                          )}
                        </th>
                      ))}
                      {isEditing && (
                        <th className="p-2.5 w-16 text-center text-slate-700 font-bold">
                          Acción
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {data.controlCambios.map((c, idx) => (
                      <tr
                        key={idx}
                        draggable={true}
                        onDragStart={(e) => handleRowDragStart(e, idx)}
                        onDragOver={(e) => handleRowDragOver(e, idx)}
                        onDrop={(e) => handleRowDrop(e, idx)}
                        onDragEnd={() => {
                          setDraggedRowIdx(null);
                          setDragOverRowIdx(null);
                        }}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          dragOverRowIdx === idx
                            ? 'border-t-4 border-t-sky-500 bg-sky-50/60'
                            : ''
                        }`}
                      >
                        {controlCols.map((col) => {
                          if (col.id === 'paso') {
                            return (
                              <td
                                key={col.id}
                                className="p-2 text-center font-mono font-bold text-sky-800 border-r border-slate-200 bg-slate-50/50 select-none"
                              >
                                {isEditing ? (
                                  <div className="flex items-center justify-center gap-1">
                                    <span
                                      title="Arrastrar para mover fila"
                                      className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
                                    >
                                      <GripVertical className="w-3.5 h-3.5" />
                                    </span>
                                    <div className="flex flex-col gap-0.5">
                                      <button
                                        type="button"
                                        title="Subir fila"
                                        disabled={idx === 0}
                                        onClick={() => handleMoveRow(idx, 'up')}
                                        className={`p-0.5 rounded transition-colors ${
                                          idx === 0
                                            ? 'text-slate-300 cursor-not-allowed'
                                            : 'text-slate-600 hover:text-sky-700 hover:bg-sky-100 cursor-pointer'
                                        }`}
                                      >
                                        <ChevronUp className="w-3 h-3" />
                                      </button>
                                      <button
                                        type="button"
                                        title="Bajar fila"
                                        disabled={
                                          idx === data.controlCambios.length - 1
                                        }
                                        onClick={() => handleMoveRow(idx, 'down')}
                                        className={`p-0.5 rounded transition-colors ${
                                          idx === data.controlCambios.length - 1
                                            ? 'text-slate-300 cursor-not-allowed'
                                            : 'text-slate-600 hover:text-sky-700 hover:bg-sky-100 cursor-pointer'
                                        }`}
                                      >
                                        <ChevronDown className="w-3 h-3" />
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      value={c.paso}
                                      onChange={(e) => {
                                        const updated = [...data.controlCambios];
                                        updated[idx] = {
                                          ...updated[idx],
                                          paso: e.target.value,
                                        };
                                        setData({
                                          ...data,
                                          controlCambios: updated,
                                        });
                                      }}
                                      className="w-10 text-center text-xs p-1 font-mono font-bold bg-white border border-slate-300 rounded"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center gap-1.5">
                                    <span
                                      title="Arrastrar para mover fila"
                                      className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500"
                                    >
                                      <GripVertical className="w-3 h-3" />
                                    </span>
                                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center">
                                      {c.paso}
                                    </span>
                                  </div>
                                )}
                              </td>
                            );
                          }

                          if (col.id === 'accion') {
                            return (
                              <td
                                key={col.id}
                                className="p-2.5 text-slate-900 border-r border-slate-200"
                              >
                                {isEditing ? (
                                  <textarea
                                    rows={2}
                                    value={c.accion}
                                    onChange={(e) => {
                                      const updated = [...data.controlCambios];
                                      updated[idx] = {
                                        ...updated[idx],
                                        accion: e.target.value,
                                      };
                                      setData({
                                        ...data,
                                        controlCambios: updated,
                                      });
                                    }}
                                    className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded leading-relaxed"
                                  />
                                ) : (
                                  (() => {
                                    const colonIdx = c.accion.indexOf(':');
                                    if (colonIdx > 0 && colonIdx < 65) {
                                      const title = c.accion.substring(
                                        0,
                                        colonIdx
                                      );
                                      const rest = c.accion.substring(
                                        colonIdx + 1
                                      );
                                      return (
                                        <div className="leading-relaxed">
                                          <strong className="text-slate-900 font-semibold">
                                            {title}:
                                          </strong>
                                          <span className="text-slate-700">
                                            {rest}
                                          </span>
                                        </div>
                                      );
                                    }
                                    return (
                                      <span className="leading-relaxed text-slate-700">
                                        {c.accion}
                                      </span>
                                    );
                                  })()
                                )}
                              </td>
                            );
                          }

                          if (col.id === 'responsable') {
                            return (
                              <td
                                key={col.id}
                                className="p-2.5 font-medium text-slate-800 border-r border-slate-200"
                              >
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={c.responsable}
                                    onChange={(e) => {
                                      const updated = [...data.controlCambios];
                                      updated[idx] = {
                                        ...updated[idx],
                                        responsable: e.target.value,
                                      };
                                      setData({
                                        ...data,
                                        controlCambios: updated,
                                      });
                                    }}
                                    className="w-full text-xs p-1 bg-white border border-slate-300 rounded font-medium"
                                  />
                                ) : (
                                  c.responsable
                                )}
                              </td>
                            );
                          }

                          // Generic additional dynamic column
                          return (
                            <td
                              key={col.id}
                              className="p-2.5 text-slate-800 border-r border-slate-200"
                            >
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={c[col.id] || ''}
                                  onChange={(e) => {
                                    const updated = [...data.controlCambios];
                                    updated[idx] = {
                                      ...updated[idx],
                                      [col.id]: e.target.value,
                                    };
                                    setData({
                                      ...data,
                                      controlCambios: updated,
                                    });
                                  }}
                                  className="w-full text-xs p-1 bg-white border border-slate-300 rounded"
                                  placeholder="Valor..."
                                />
                              ) : (
                                <span className="text-slate-700">
                                  {c[col.id] || '—'}
                                </span>
                              )}
                            </td>
                          );
                        })}

                        {isEditing && (
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              title="Eliminar fila"
                              onClick={() => {
                                const updated = data.controlCambios.filter(
                                  (_, i) => i !== idx
                                );
                                setData({ ...data, controlCambios: updated });
                              }}
                              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {isEditing && (
                  <div className="flex flex-wrap items-center justify-between p-2.5 bg-slate-50/90 border-t border-slate-200 text-xs gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          const cols =
                            data.controlCambiosColumnas ||
                            PLAN_DE_GESTION_V2_DATA.controlCambiosColumnas ||
                            [];
                          const nextPaso = data.controlCambios.length + 1;
                          const newRow: PlanControlCambio = {
                            paso: nextPaso,
                            accion: 'Nueva acción: Descripción del paso...',
                            responsable: 'Oficina de Racionalización',
                          };
                          cols.forEach((col) => {
                            if (
                              col.id !== 'paso' &&
                              col.id !== 'accion' &&
                              col.id !== 'responsable'
                            ) {
                              newRow[col.id] = '';
                            }
                          });
                          setData({
                            ...data,
                            controlCambios: [...data.controlCambios, newRow],
                          });
                        }}
                        className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer px-2 py-1 rounded hover:bg-sky-50"
                      >
                        <Plus className="w-3.5 h-3.5" /> Añadir Fila
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const currentCols =
                            data.controlCambiosColumnas ||
                            PLAN_DE_GESTION_V2_DATA.controlCambiosColumnas || [
                              { id: 'paso', nombre: 'Paso' },
                              {
                                id: 'accion',
                                nombre:
                                  'Acción (Alineada al PMBOK 6ta Edición y Alcance del Proyecto)',
                              },
                              { id: 'responsable', nombre: 'Responsable' },
                            ];
                          const newColId = `col_${Date.now()}`;
                          const newColName = `Columna ${currentCols.length + 1}`;
                          const updatedCols = [
                            ...currentCols,
                            { id: newColId, nombre: newColName },
                          ];
                          const updatedRows = data.controlCambios.map((r) => ({
                            ...r,
                            [newColId]: '',
                          }));
                          setData({
                            ...data,
                            controlCambiosColumnas: updatedCols,
                            controlCambios: updatedRows,
                          });
                        }}
                        className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer px-2 py-1 rounded hover:bg-sky-50"
                      >
                        <Columns3 className="w-3.5 h-3.5" /> Añadir Columna
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSortControlCambios('paso')}
                        className="text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer px-2 py-1 rounded hover:bg-slate-200/60"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" /> Ordenar por Paso
                      </button>

                      <button
                        type="button"
                        onClick={handleRenumberPasos}
                        className="text-xs font-medium text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer px-2 py-1 rounded hover:bg-emerald-50"
                      >
                        <ListOrdered className="w-3.5 h-3.5" /> Renumerar Pasos (1..N)
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {data.controlCambios.length} filas · {controlCols.length} columnas
                    </span>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Directrices Complementarias para la Gestión del Cambio */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-[13px] font-bold text-slate-900">
                Directrices Complementarias para la Gestión del Cambio:
              </h3>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    const directrices =
                      data.controlCambiosDirectrices ||
                      PLAN_DE_GESTION_V2_DATA.controlCambiosDirectrices ||
                      [];
                    setData({
                      ...data,
                      controlCambiosDirectrices: [
                        ...directrices,
                        {
                          titulo: 'Nueva Directriz',
                          descripcion: 'Descripción detallada de la directriz...',
                        },
                      ],
                    });
                  }}
                  className="text-[11px] font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Añadir Directriz
                </button>
              )}
            </div>

            <ul className="space-y-2 text-xs">
              {(
                data.controlCambiosDirectrices ||
                PLAN_DE_GESTION_V2_DATA.controlCambiosDirectrices ||
                []
              ).map((dir, dIdx) => (
                <li key={dIdx} className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold select-none leading-relaxed">
                    •
                  </span>
                  {isEditing ? (
                    <div className="flex-1 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-300">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={dir.titulo}
                          onChange={(e) => {
                            const currentDirs = [
                              ...(data.controlCambiosDirectrices ||
                                PLAN_DE_GESTION_V2_DATA.controlCambiosDirectrices ||
                                []),
                            ];
                            currentDirs[dIdx] = {
                              ...currentDirs[dIdx],
                              titulo: e.target.value,
                            };
                            setData({
                              ...data,
                              controlCambiosDirectrices: currentDirs,
                            });
                          }}
                          className="text-xs font-bold text-slate-900 p-1 border border-slate-300 rounded flex-1"
                          placeholder="Título de la directriz"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const currentDirs = (
                              data.controlCambiosDirectrices ||
                              PLAN_DE_GESTION_V2_DATA.controlCambiosDirectrices ||
                              []
                            ).filter((_, i) => i !== dIdx);
                            setData({
                              ...data,
                              controlCambiosDirectrices: currentDirs,
                            });
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={dir.descripcion}
                        onChange={(e) => {
                          const currentDirs = [
                            ...(data.controlCambiosDirectrices ||
                              PLAN_DE_GESTION_V2_DATA.controlCambiosDirectrices ||
                              []),
                          ];
                          currentDirs[dIdx] = {
                            ...currentDirs[dIdx],
                            descripcion: e.target.value,
                          };
                          setData({
                            ...data,
                            controlCambiosDirectrices: currentDirs,
                          });
                        }}
                        className="w-full text-xs p-1 border border-slate-300 rounded"
                        placeholder="Descripción de la directriz"
                      />
                    </div>
                  ) : (
                    <div className="leading-relaxed text-slate-700">
                      <strong className="text-slate-900 font-semibold">
                        {dir.titulo}:
                      </strong>{' '}
                      {dir.descripcion}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ================= SECCIÓN 9: Gestión del cronograma ================= */}
      {(activeSectionTab === 'all' || activeSectionTab === 'sec-9') && (
        <div
          id="sec-9"
          className="space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs"
        >
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center shrink-0">
                9
              </span>
              Gestión del cronograma
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setData({
                    ...data,
                    cronogramaReglas: [
                      ...data.cronogramaReglas,
                      'Nuevo Parámetro: Descripción del parámetro del cronograma...',
                    ],
                  });
                }}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir Parámetro
              </button>
            )}
          </div>

          {isEditing || activeEditingDescKey === 'sec-9' ? (
            <div className="space-y-2 p-3 bg-sky-50/40 border border-sky-300/80 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Descripción de la gestión del cronograma:</span>
                </label>
                {activeEditingDescKey === 'sec-9' && !isEditing && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCancelDesc}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <X className="w-3 h-3" />
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveDesc('cronogramaTexto')}
                      className="px-3 py-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Guardar
                    </button>
                  </div>
                )}
              </div>
              <textarea
                rows={3}
                value={isEditing ? data.cronogramaTexto : tempDescValue}
                onChange={(e) => {
                  if (isEditing) {
                    setData({ ...data, cronogramaTexto: e.target.value });
                  } else {
                    setTempDescValue(e.target.value);
                  }
                }}
                className="w-full text-xs sm:text-sm text-slate-800 border border-sky-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed shadow-2xs"
                placeholder="Escribe la descripción de la gestión del cronograma..."
              />
              <p className="text-[11px] text-slate-500">
                {isEditing ? 'Edición en vivo habilitada por el Modo Edición general.' : 'Presiona "Guardar" para actualizar y sincronizar esta descripción en todo el sistema.'}
              </p>
            </div>
          ) : (
            <p
              id="desc-sec-9"
              onClick={() => handleStartEditingDesc('sec-9', data.cronogramaTexto)}
              title="Haz clic para editar la descripción de este apartado"
              className="text-xs sm:text-[13px] text-slate-700 leading-relaxed p-2 -m-2 rounded-lg border border-transparent hover:border-sky-300/70 hover:bg-sky-50/50 cursor-pointer group transition-all flex items-start justify-between gap-3"
            >
              <span className="flex-1">{data.cronogramaTexto}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-100/80 group-hover:bg-sky-200 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Edit3 className="w-3 h-3" />
                Editar descripción
              </span>
            </p>
          )}

          <div className="space-y-2.5 pt-1">
            {data.cronogramaReglas.map((regla, idx) => {
              const colonIdx = regla.indexOf(':');
              const hasColon = colonIdx !== -1;
              const paramTitle = hasColon ? regla.substring(0, colonIdx).trim() : '';
              const paramDesc = hasColon ? regla.substring(colonIdx + 1).trim() : regla;

              return (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0" />
                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={regla}
                        onChange={(e) => {
                          const updated = [...data.cronogramaReglas];
                          updated[idx] = e.target.value;
                          setData({ ...data, cronogramaReglas: updated });
                        }}
                        className="flex-1 text-xs p-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                        placeholder="Título: Descripción del parámetro..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = data.cronogramaReglas.filter((_, i) => i !== idx);
                          setData({ ...data, cronogramaReglas: updated });
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1.5 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Eliminar parámetro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                      {hasColon ? (
                        <>
                          <strong className="font-bold text-slate-900 mr-1.5">
                            {paramTitle}:
                          </strong>
                          <span>{paramDesc}</span>
                        </>
                      ) : (
                        <span>{regla}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Botón de redirección al documento maestro del cronograma */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center justify-center text-center gap-2">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                id="btn-acceder-cronograma-sec9"
                onClick={() => {
                  if (onNavigateToDoc) {
                    onNavigateToDoc('doc-plan-cronograma');
                  } else {
                    window.open(
                      data.cronogramaUrlRedireccion ||
                        'https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/docs/02-cronograma-v2.html',
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all cursor-pointer group"
                title="Acceder al documento maestro del cronograma completo y actualizado"
              >
                <Calendar className="w-4 h-4 text-white shrink-0 group-hover:scale-110 transition-transform" />
                <span>
                  {data.cronogramaBotonTexto ||
                    '📅 Acceder al Cronograma Completo y Actualizado'}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-sky-200 group-hover:text-white shrink-0" />
              </button>

              {onNavigateToDoc && (
                <a
                  href={
                    data.cronogramaUrlRedireccion ||
                    'https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/docs/02-cronograma-v2.html'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
                  title="Abrir documento maestro en la web oficial (pestaña nueva)"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ver en Web</span>
                </a>
              )}
            </div>

            <p className="text-xs text-slate-500 italic">
              {data.cronogramaBotonSubtexto ||
                '(Este enlace redirige al documento maestro del cronograma)'}
            </p>

            {isEditing && (
              <div className="w-full max-w-lg mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2.5">
                <span className="font-semibold text-slate-700 block text-xs">
                  Configuración del Botón de Redirección:
                </span>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5 font-medium">
                    Texto del botón:
                  </label>
                  <input
                    type="text"
                    value={
                      data.cronogramaBotonTexto ||
                      '📅 Acceder al Cronograma Completo y Actualizado'
                    }
                    onChange={(e) =>
                      setData({ ...data, cronogramaBotonTexto: e.target.value })
                    }
                    className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5 font-medium">
                    Aclaración / Subtexto:
                  </label>
                  <input
                    type="text"
                    value={
                      data.cronogramaBotonSubtexto ||
                      '(Este enlace redirige al documento maestro del cronograma)'
                    }
                    onChange={(e) =>
                      setData({ ...data, cronogramaBotonSubtexto: e.target.value })
                    }
                    className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5 font-medium">
                    URL Externa del Documento Maestro:
                  </label>
                  <input
                    type="text"
                    value={
                      data.cronogramaUrlRedireccion ||
                      'https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/docs/02-cronograma-v2.html'
                    }
                    onChange={(e) =>
                      setData({ ...data, cronogramaUrlRedireccion: e.target.value })
                    }
                    className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Aviso opcional de ruta crítica sólo si el usuario introduce un texto personalizado */}
          {data.cronogramaAvisoRutaCritica && data.cronogramaAvisoRutaCritica.trim().length > 0 && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed flex-1">
                <strong>Estado de la ruta crítica:</strong>{' '}
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={data.cronogramaAvisoRutaCritica}
                    onChange={(e) =>
                      setData({
                        ...data,
                        cronogramaAvisoRutaCritica: e.target.value,
                      })
                    }
                    className="w-full text-xs text-rose-950 border border-rose-300 rounded p-1.5 bg-white mt-1"
                  />
                ) : (
                  data.cronogramaAvisoRutaCritica
                )}
              </div>
            </div>
          )}

          {/* Cuadros de Identificación, Implementación y Medición del Cronograma Detallado */}
          <div className="mt-6 pt-5 border-t border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Table className="w-4 h-4 text-sky-700" />
                  <span>Detalle Operativo del Cronograma por Fases (Transcripción Fiel CSV)</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Estructura jerárquica: Etapa (Nivel 2) · Actividad (Nivel 3) · Tarea (Nivel 4) · Fecha de Inicio · Fecha de Cierre
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex rounded-lg border border-slate-300 p-0.5 bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setCronogramaViewFormat('csv')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      cronogramaViewFormat === 'csv'
                        ? 'bg-sky-700 text-white font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    CSV (5 Col)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCronogramaViewFormat('pmi')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      cronogramaViewFormat === 'pmi'
                        ? 'bg-sky-700 text-white font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    PMI (10 Col)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCronogramaViewFormat('markdown')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      cronogramaViewFormat === 'markdown'
                        ? 'bg-sky-700 text-white font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Markdown
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAllMdSec9}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  {copiedAllMdSec9 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAllMdSec9 ? '¡Copiado!' : 'Copiar Todo MD'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload5ColCsvSec9}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* Bloques / Cuadros por Fase: F1 · Identificación, F2 · Implementación, F3 · Evaluación */}
            <div className="space-y-6">
              {Object.entries(cronogramaTareasByFase).map(([fase, items]) => {
                const tareas = items as CronogramaItem[];
                return (
                  <div key={fase} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="bg-slate-800 text-white px-4 py-3 font-bold text-xs uppercase tracking-wide flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                        <span className="font-bold text-sm tracking-tight text-white capitalize">{fase}</span>
                        <span className="text-xs text-slate-300 font-mono bg-slate-700/80 px-2 py-0.5 rounded">
                          {tareas.length} {tareas.length === 1 ? 'tarea' : 'tareas'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyPhaseMdSec9(fase, tareas)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-100 hover:text-white text-xs font-medium transition-colors cursor-pointer border border-slate-600"
                      >
                        {copiedFaseSec9 === fase ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300 font-bold">¡Copiada!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-300" />
                            <span>Copiar Tabla Markdown</span>
                          </>
                        )}
                      </button>
                    </div>

                    <CronogramaDetailedTable
                      tareas={tareas}
                      allTareas={cronogramaTasks}
                      viewFormat={cronogramaViewFormat}
                      isEditing={isEditing}
                      onTaskChange={handleCronogramaTaskChange}
                      onDeleteTask={handleDeleteCronogramaTask}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= SECCIÓN 10: Calidad ================= */}
      {(activeSectionTab === 'all' || activeSectionTab === 'sec-10') && (
        <div
          id="sec-10"
          className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center shrink-0">
                10
              </span>
              Gestión de la calidad ({data.calidadMediciones.length})
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setData({
                    ...data,
                    calidadMediciones: [
                      ...data.calidadMediciones,
                      {
                        indicador: 'Nuevo Indicador',
                        medicion: 'Nuevo Indicador',
                        responsable: 'Responsable de la Gestión por Proceso de la Facultad',
                        formula: '([% ...] + [% ...]) / N',
                        uso: 'Para medir el cumplimiento.\nFuente: Dashboard',
                      },
                    ],
                  });
                }}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Añadir Indicador
              </button>
            )}
          </div>

          {isEditing || activeEditingDescKey === 'sec-10' ? (
            <div className="space-y-2 p-3 bg-sky-50/40 border border-sky-300/80 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Descripción de gestión de la calidad:</span>
                </label>
                {activeEditingDescKey === 'sec-10' && !isEditing && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCancelDesc}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <X className="w-3 h-3" />
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveDesc('calidadTexto')}
                      className="px-3 py-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Guardar
                    </button>
                  </div>
                )}
              </div>
              <textarea
                rows={3}
                value={isEditing ? data.calidadTexto : tempDescValue}
                onChange={(e) => {
                  if (isEditing) {
                    setData({ ...data, calidadTexto: e.target.value });
                  } else {
                    setTempDescValue(e.target.value);
                  }
                }}
                className="w-full text-xs sm:text-sm text-slate-800 border border-sky-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed shadow-2xs"
                placeholder="Escribe la descripción de gestión de calidad..."
              />
              <p className="text-[11px] text-slate-500">
                {isEditing ? 'Edición en vivo habilitada por el Modo Edición general.' : 'Presiona "Guardar" para actualizar y sincronizar esta descripción en todo el sistema.'}
              </p>
            </div>
          ) : (
            <p
              id="desc-sec-10"
              onClick={() => handleStartEditingDesc('sec-10', data.calidadTexto)}
              title="Haz clic para editar la descripción de este apartado"
              className="text-xs text-slate-700 leading-relaxed p-2 -m-2 rounded-lg border border-transparent hover:border-sky-300/70 hover:bg-sky-50/50 cursor-pointer group transition-all flex items-start justify-between gap-3"
            >
              <span className="flex-1">{data.calidadTexto}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-100/80 group-hover:bg-sky-200 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Edit3 className="w-3 h-3" />
                Editar descripción
              </span>
            </p>
          )}

          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 font-bold border-r border-slate-200 w-3/12">
                    Indicador
                  </th>
                  <th className="p-2.5 font-bold border-r border-slate-200 w-3/12">
                    Responsable
                  </th>
                  <th className="p-2.5 font-bold border-r border-slate-200 w-3/12">
                    Fórmula
                  </th>
                  <th className="p-2.5 font-bold w-3/12">
                    Uso
                  </th>
                  {isEditing && (
                    <th className="p-2.5 text-center font-bold border-l border-slate-200 w-12">
                      Acción
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {data.calidadMediciones.map((m, idx) => {
                  const indicadorVal = m.indicador || m.medicion || '';
                  const responsableVal =
                    m.responsable || 'Responsable de la Gestión por Proceso de la Facultad';
                  const formulaVal = m.formula || '';
                  const usoVal = m.uso || '';

                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      {/* 1. Indicador (Bold text, left-aligned) */}
                      <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200 align-top">
                        {isEditing ? (
                          <textarea
                            rows={3}
                            value={indicadorVal}
                            onChange={(e) => {
                              const updated = [...data.calidadMediciones];
                              updated[idx] = {
                                ...updated[idx],
                                indicador: e.target.value,
                                medicion: e.target.value,
                              };
                              setData({ ...data, calidadMediciones: updated });
                            }}
                            className="w-full text-xs font-bold p-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                            placeholder="Nombre del indicador..."
                          />
                        ) : (
                          <span className="leading-snug block font-bold text-slate-950">
                            {indicadorVal}
                          </span>
                        )}
                      </td>

                      {/* 2. Responsable */}
                      <td className="p-2.5 text-slate-800 border-r border-slate-200 align-top">
                        {isEditing ? (
                          <textarea
                            rows={3}
                            value={responsableVal}
                            onChange={(e) => {
                              const updated = [...data.calidadMediciones];
                              updated[idx] = {
                                ...updated[idx],
                                responsable: e.target.value,
                              };
                              setData({ ...data, calidadMediciones: updated });
                            }}
                            className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                            placeholder="Responsable..."
                          />
                        ) : (
                          <span className="leading-snug block text-slate-800">
                            {responsableVal}
                          </span>
                        )}
                      </td>

                      {/* 3. Fórmula */}
                      <td className="p-2.5 text-slate-800 border-r border-slate-200 align-top">
                        {isEditing ? (
                          <textarea
                            rows={3}
                            value={formulaVal}
                            onChange={(e) => {
                              const updated = [...data.calidadMediciones];
                              updated[idx] = {
                                ...updated[idx],
                                formula: e.target.value,
                              };
                              setData({ ...data, calidadMediciones: updated });
                            }}
                            className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                            placeholder="Fórmula..."
                          />
                        ) : (
                          <span className="leading-snug block text-slate-800 font-mono text-[11px] sm:text-xs">
                            {formulaVal}
                          </span>
                        )}
                      </td>

                      {/* 4. Uso */}
                      <td className="p-2.5 text-slate-800 align-top">
                        {isEditing ? (
                          <textarea
                            rows={3}
                            value={usoVal}
                            onChange={(e) => {
                              const updated = [...data.calidadMediciones];
                              updated[idx] = {
                                ...updated[idx],
                                uso: e.target.value,
                              };
                              setData({ ...data, calidadMediciones: updated });
                            }}
                            className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                            placeholder="Uso y fuente..."
                          />
                        ) : (
                          <div className="leading-snug space-y-1 text-slate-800 text-xs">
                            {usoVal.split('\n').map((line, lIdx) => (
                              <p
                                key={lIdx}
                                className={
                                  line.trim().toLowerCase().startsWith('fuente:')
                                    ? 'text-slate-600 font-medium'
                                    : 'text-slate-800'
                                }
                              >
                                {line}
                              </p>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Edit mode: delete */}
                      {isEditing && (
                        <td className="p-2.5 text-center border-l border-slate-200 align-middle">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = data.calidadMediciones.filter(
                                (_, i) => i !== idx
                              );
                              setData({ ...data, calidadMediciones: updated });
                            }}
                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer transition-colors"
                            title="Eliminar fila"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
            {isEditing ? (
              <textarea
                rows={2}
                value={data.calidadNota}
                onChange={(e) => setData({ ...data, calidadNota: e.target.value })}
                className="w-full text-xs text-slate-600 border border-slate-300 rounded p-1.5 bg-white"
              />
            ) : (
              data.calidadNota
            )}
          </p>
        </div>
      )}

      {/* ================= SECCIÓN 11: Riesgos ================= */}
      {(activeSectionTab === 'all' || activeSectionTab === 'sec-11') && (
        <div
          id="sec-11"
          className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center shrink-0">
                11
              </span>
              Gestión de riesgos ({data.riesgos.length})
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setData({
                    ...data,
                    riesgos: [
                      ...data.riesgos,
                      {
                        riesgo: 'Nuevo riesgo identificado...',
                        categoria: 'Facultad',
                        probImpacto: 'Alta / Alto',
                        responsable: 'Responsable de la Gestión por Proceso en la facultad',
                        respuesta: 'Respuesta o acción mitigadora...',
                        impacto: 'Alto',
                        estado: 'Abierto',
                      },
                    ],
                  });
                }}
                className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Añadir Riesgo
              </button>
            )}
          </div>

          {isEditing || activeEditingDescKey === 'sec-11' ? (
            <div className="space-y-2 p-3 bg-rose-50/40 border border-rose-300/80 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Descripción de la gestión de riesgos:</span>
                </label>
                {activeEditingDescKey === 'sec-11' && !isEditing && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCancelDesc}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <X className="w-3 h-3" />
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveDesc('riesgosTexto')}
                      className="px-3 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Guardar
                    </button>
                  </div>
                )}
              </div>
              <textarea
                rows={3}
                value={isEditing ? data.riesgosTexto : tempDescValue}
                onChange={(e) => {
                  if (isEditing) {
                    setData({ ...data, riesgosTexto: e.target.value });
                  } else {
                    setTempDescValue(e.target.value);
                  }
                }}
                className="w-full text-xs sm:text-sm text-slate-800 border border-rose-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed shadow-2xs"
                placeholder="Escribe la descripción de la gestión de riesgos..."
              />
              <p className="text-[11px] text-slate-500">
                {isEditing ? 'Edición en vivo habilitada por el Modo Edición general.' : 'Presiona "Guardar" para actualizar y sincronizar esta descripción en todo el sistema.'}
              </p>
            </div>
          ) : (
            <p
              id="desc-sec-11"
              onClick={() => handleStartEditingDesc('sec-11', data.riesgosTexto)}
              title="Haz clic para editar la descripción de este apartado"
              className="text-xs text-slate-700 leading-relaxed p-2 -m-2 rounded-lg border border-transparent hover:border-rose-300/70 hover:bg-rose-50/50 cursor-pointer group transition-all flex items-start justify-between gap-3"
            >
              <span className="flex-1">{data.riesgosTexto}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-100/80 group-hover:bg-rose-200 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Edit3 className="w-3 h-3" />
                Editar descripción
              </span>
            </p>
          )}

          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 border-r border-slate-200 w-3/12 font-bold">
                    RIESGOS
                  </th>
                  <th className="p-2.5 border-r border-slate-200 w-24 text-center font-bold">
                    CATEGORÍA
                  </th>
                  <th className="p-2.5 border-r border-slate-200 w-28 text-center font-bold">
                    PROB/IMPACTO
                  </th>
                  <th className="p-2.5 border-r border-slate-200 w-3/12 font-bold">
                    RESPONSABLE
                  </th>
                  <th className="p-2.5 font-bold">
                    Respuesta
                  </th>
                  {isEditing && (
                    <th className="p-2.5 w-12 text-center border-l border-slate-200 font-bold">
                      Acción
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {data.riesgos.map((r, idx) => {
                  const riesgoVal = r.riesgo || '';
                  const categoriaVal = r.categoria || 'Facultad';
                  const probImpactoVal = r.probImpacto || (r.impacto ? `Alta / ${r.impacto}` : 'Alta / Alto');
                  const responsableVal = r.responsable || '';
                  const respuestaVal = r.respuesta || '';

                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      {/* 1. RIESGOS */}
                      <td className="p-2.5 border-r border-slate-200 align-top">
                        {isEditing ? (
                          <textarea
                            rows={3}
                            value={riesgoVal}
                            onChange={(e) => {
                              const updated = [...data.riesgos];
                              updated[idx] = { ...updated[idx], riesgo: e.target.value };
                              setData({ ...data, riesgos: updated });
                            }}
                            className="w-full text-xs font-bold p-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-rose-500"
                            placeholder="Descripción del riesgo..."
                          />
                        ) : (
                          (() => {
                            const parenStart = riesgoVal.lastIndexOf('(');
                            const parenEnd = riesgoVal.lastIndexOf(')');
                            if (parenStart !== -1 && parenEnd > parenStart) {
                              const title = (
                                riesgoVal.slice(0, parenStart) + riesgoVal.slice(parenEnd + 1)
                              ).trim();
                              const detail = riesgoVal.slice(parenStart + 1, parenEnd).trim();
                              return (
                                <div className="leading-snug space-y-1">
                                  <span className="font-bold text-slate-900 block text-xs sm:text-xs">
                                    {title}
                                  </span>
                                  <span className="text-[11px] sm:text-xs text-slate-500 italic block font-normal leading-normal">
                                    {detail}
                                  </span>
                                </div>
                              );
                            }
                            return (
                              <span className="font-bold text-slate-900 leading-snug block">
                                {riesgoVal}
                              </span>
                            );
                          })()
                        )}
                      </td>

                      {/* 2. CATEGORÍA */}
                      <td className="p-2.5 text-center border-r border-slate-200 align-top">
                        {isEditing ? (
                          <input
                            type="text"
                            value={categoriaVal}
                            onChange={(e) => {
                              const updated = [...data.riesgos];
                              updated[idx] = { ...updated[idx], categoria: e.target.value };
                              setData({ ...data, riesgos: updated });
                            }}
                            className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded text-center focus:ring-1 focus:ring-rose-500"
                            placeholder="Categoría..."
                          />
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                            {categoriaVal}
                          </span>
                        )}
                      </td>

                      {/* 3. PROB/IMPACTO */}
                      <td className="p-2.5 text-center border-r border-slate-200 align-top">
                        {isEditing ? (
                          <input
                            type="text"
                            value={probImpactoVal}
                            onChange={(e) => {
                              const updated = [...data.riesgos];
                              updated[idx] = { ...updated[idx], probImpacto: e.target.value };
                              setData({ ...data, riesgos: updated });
                            }}
                            className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded text-center focus:ring-1 focus:ring-rose-500"
                            placeholder="Prob / Impacto..."
                          />
                        ) : (
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold text-center leading-tight ${
                              probImpactoVal.toLowerCase().includes('crítico')
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : probImpactoVal.toLowerCase().includes('alto')
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {probImpactoVal}
                          </span>
                        )}
                      </td>

                      {/* 4. RESPONSABLE */}
                      <td className="p-2.5 border-r border-slate-200 align-top">
                        {isEditing ? (
                          <textarea
                            rows={3}
                            value={responsableVal}
                            onChange={(e) => {
                              const updated = [...data.riesgos];
                              updated[idx] = { ...updated[idx], responsable: e.target.value };
                              setData({ ...data, riesgos: updated });
                            }}
                            className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-rose-500"
                            placeholder="Responsable..."
                          />
                        ) : (
                          <span className="text-slate-800 text-xs leading-snug block font-medium">
                            {responsableVal}
                          </span>
                        )}
                      </td>

                      {/* 5. Respuesta */}
                      <td className="p-2.5 align-top">
                        {isEditing ? (
                          <textarea
                            rows={4}
                            value={respuestaVal}
                            onChange={(e) => {
                              const updated = [...data.riesgos];
                              updated[idx] = { ...updated[idx], respuesta: e.target.value };
                              setData({ ...data, riesgos: updated });
                            }}
                            className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-rose-500"
                            placeholder="Respuesta o acción de mitigación..."
                          />
                        ) : (
                          <span className="text-slate-800 text-xs leading-relaxed block">
                            {respuestaVal}
                          </span>
                        )}
                      </td>

                      {/* Edit mode: Acción */}
                      {isEditing && (
                        <td className="p-2.5 text-center border-l border-slate-200 align-middle">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = data.riesgos.filter((_, i) => i !== idx);
                              setData({ ...data, riesgos: updated });
                            }}
                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer transition-colors"
                            title="Eliminar riesgo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SECCIÓN 12: Interesados ================= */}
      {(activeSectionTab === 'all' || activeSectionTab === 'sec-12') && (
        <div
          id="sec-12"
          className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center shrink-0">
                12
              </span>
              Interesados y comunicaciones ({data.interesados.length})
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setData({
                    ...data,
                    interesados: [
                      ...data.interesados,
                      {
                        interesado: 'Nuevo Interesado',
                        influencia: 'Media',
                        interesExpectativa: 'Expectativa institucional...',
                        comunicacion: 'Informes periódicos',
                      },
                    ],
                  });
                }}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Añadir Interesado
              </button>
            )}
          </div>

          {isEditing || activeEditingDescKey === 'sec-12' ? (
            <div className="space-y-2 p-3 bg-sky-50/40 border border-sky-300/80 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Descripción de interesados y comunicaciones:</span>
                </label>
                {activeEditingDescKey === 'sec-12' && !isEditing && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCancelDesc}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <X className="w-3 h-3" />
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveDesc('interesadosTexto')}
                      className="px-3 py-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Guardar
                    </button>
                  </div>
                )}
              </div>
              <textarea
                rows={2}
                value={isEditing ? (data.interesadosTexto ?? PLAN_DE_GESTION_V2_DATA.interesadosTexto) : tempDescValue}
                onChange={(e) => {
                  if (isEditing) {
                    setData({ ...data, interesadosTexto: e.target.value });
                  } else {
                    setTempDescValue(e.target.value);
                  }
                }}
                className="w-full text-xs sm:text-sm text-slate-800 border border-sky-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed shadow-2xs"
                placeholder="Escribe la descripción de interesados y comunicaciones..."
              />
              <p className="text-[11px] text-slate-500">
                {isEditing ? 'Edición en vivo habilitada por el Modo Edición general.' : 'Presiona "Guardar" para actualizar y sincronizar esta descripción en todo el sistema.'}
              </p>
            </div>
          ) : (
            <p
              id="desc-sec-12"
              onClick={() => handleStartEditingDesc('sec-12', data.interesadosTexto || PLAN_DE_GESTION_V2_DATA.interesadosTexto || '')}
              title="Haz clic para editar la descripción de este apartado"
              className="text-xs text-slate-600 leading-relaxed p-2 -m-2 rounded-lg border border-transparent hover:border-sky-300/70 hover:bg-sky-50/50 cursor-pointer group transition-all flex items-start justify-between gap-3"
            >
              <span className="flex-1">
                {data.interesadosTexto || PLAN_DE_GESTION_V2_DATA.interesadosTexto}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-100/80 group-hover:bg-sky-200 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Edit3 className="w-3 h-3" />
                Editar descripción
              </span>
            </p>
          )}

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 w-44">Interesado</th>
                  <th className="p-2.5 w-24 text-center">Influencia</th>
                  <th className="p-2.5">Interés y expectativa</th>
                  <th className="p-2.5 w-56">Comunicación</th>
                  {isEditing && <th className="p-2.5 w-12 text-center">Acción</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {data.interesados.map((i, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200">
                      {isEditing ? (
                        <input
                          type="text"
                          value={i.interesado}
                          onChange={(e) => {
                            const updated = [...data.interesados];
                            updated[idx] = { ...updated[idx], interesado: e.target.value };
                            setData({ ...data, interesados: updated });
                          }}
                          className="w-full text-xs font-bold p-1 bg-white border border-slate-300 rounded"
                        />
                      ) : (
                        i.interesado
                      )}
                    </td>
                    <td className="p-2.5 text-center border-r border-slate-200">
                      {isEditing ? (
                        <select
                          value={i.influencia}
                          onChange={(e) => {
                            const updated = [...data.interesados];
                            updated[idx] = {
                              ...updated[idx],
                              influencia: e.target.value as any,
                            };
                            setData({ ...data, interesados: updated });
                          }}
                          className="text-xs p-1 bg-white border border-slate-300 rounded"
                        >
                          <option value="Alta">Alta</option>
                          <option value="Media">Media</option>
                          <option value="Baja">Baja</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            i.influencia === 'Alta'
                              ? 'bg-purple-100 text-purple-800'
                              : i.influencia === 'Media'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {i.influencia}
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-slate-800 border-r border-slate-200">
                      {isEditing ? (
                        <input
                          type="text"
                          value={i.interesExpectativa}
                          onChange={(e) => {
                            const updated = [...data.interesados];
                            updated[idx] = {
                              ...updated[idx],
                              interesExpectativa: e.target.value,
                            };
                            setData({ ...data, interesados: updated });
                          }}
                          className="w-full text-xs p-1 bg-white border border-slate-300 rounded"
                        />
                      ) : (
                        i.interesExpectativa
                      )}
                    </td>
                    <td className="p-2.5 text-slate-700">
                      {isEditing ? (
                        <input
                          type="text"
                          value={i.comunicacion}
                          onChange={(e) => {
                            const updated = [...data.interesados];
                            updated[idx] = {
                              ...updated[idx],
                              comunicacion: e.target.value,
                            };
                            setData({ ...data, interesados: updated });
                          }}
                          className="w-full text-xs p-1 bg-white border border-slate-300 rounded"
                        />
                      ) : (
                        i.comunicacion
                      )}
                    </td>
                    {isEditing && (
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = data.interesados.filter((_, i) => i !== idx);
                            setData({ ...data, interesados: updated });
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SECCIÓN 13: Documentos integrados ================= */}
      {(activeSectionTab === 'all' || activeSectionTab === 'sec-13') && (
        <div
          id="sec-13"
          className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center shrink-0">
                13
              </span>
              Documentos que integran este plan ({data.documentosIntegrados.length})
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setData({
                    ...data,
                    documentosIntegrados: [
                      ...data.documentosIntegrados,
                      {
                        documento: 'Nuevo Documento Integrado',
                        version: '1.0',
                        contenidoFuente: 'Fuente oficial y contenido...',
                      },
                    ],
                  });
                }}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Añadir Documento
              </button>
            )}
          </div>

          {isEditing || activeEditingDescKey === 'sec-13' ? (
            <div className="space-y-2 p-3 bg-sky-50/40 border border-sky-300/80 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Descripción de documentos que integran este plan:</span>
                </label>
                {activeEditingDescKey === 'sec-13' && !isEditing && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCancelDesc}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <X className="w-3 h-3" />
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveDesc('documentosIntegradosTexto')}
                      className="px-3 py-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Guardar
                    </button>
                  </div>
                )}
              </div>
              <textarea
                rows={2}
                value={isEditing ? (data.documentosIntegradosTexto ?? PLAN_DE_GESTION_V2_DATA.documentosIntegradosTexto) : tempDescValue}
                onChange={(e) => {
                  if (isEditing) {
                    setData({ ...data, documentosIntegradosTexto: e.target.value });
                  } else {
                    setTempDescValue(e.target.value);
                  }
                }}
                className="w-full text-xs sm:text-sm text-slate-800 border border-sky-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed shadow-2xs"
                placeholder="Escribe la descripción de los documentos integrados..."
              />
              <p className="text-[11px] text-slate-500">
                {isEditing ? 'Edición en vivo habilitada por el Modo Edición general.' : 'Presiona "Guardar" para actualizar y sincronizar esta descripción en todo el sistema.'}
              </p>
            </div>
          ) : (
            <p
              id="desc-sec-13"
              onClick={() => handleStartEditingDesc('sec-13', data.documentosIntegradosTexto || PLAN_DE_GESTION_V2_DATA.documentosIntegradosTexto || '')}
              title="Haz clic para editar la descripción de este apartado"
              className="text-xs text-slate-600 leading-relaxed p-2 -m-2 rounded-lg border border-transparent hover:border-sky-300/70 hover:bg-sky-50/50 cursor-pointer group transition-all flex items-start justify-between gap-3"
            >
              <span className="flex-1">
                {data.documentosIntegradosTexto || PLAN_DE_GESTION_V2_DATA.documentosIntegradosTexto}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-100/80 group-hover:bg-sky-200 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Edit3 className="w-3 h-3" />
                Editar descripción
              </span>
            </p>
          )}

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 w-52">Documento</th>
                  <th className="p-2.5 w-32 font-mono">Versión</th>
                  <th className="p-2.5">Contenido y fuente única que provee</th>
                  {isEditing && <th className="p-2.5 w-12 text-center">Acción</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {data.documentosIntegrados.map((doc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200">
                      {isEditing ? (
                        <input
                          type="text"
                          value={doc.documento}
                          onChange={(e) => {
                            const updated = [...data.documentosIntegrados];
                            updated[idx] = { ...updated[idx], documento: e.target.value };
                            setData({ ...data, documentosIntegrados: updated });
                          }}
                          className="w-full text-xs font-bold p-1 bg-white border border-slate-300 rounded"
                        />
                      ) : (
                        doc.documento
                      )}
                    </td>
                    <td className="p-2.5 font-mono text-[11px] text-slate-600 border-r border-slate-200">
                      {isEditing ? (
                        <input
                          type="text"
                          value={doc.version}
                          onChange={(e) => {
                            const updated = [...data.documentosIntegrados];
                            updated[idx] = { ...updated[idx], version: e.target.value };
                            setData({ ...data, documentosIntegrados: updated });
                          }}
                          className="w-full text-xs font-mono p-1 bg-white border border-slate-300 rounded"
                        />
                      ) : (
                        doc.version
                      )}
                    </td>
                    <td className="p-2.5 text-slate-800">
                      {isEditing ? (
                        <input
                          type="text"
                          value={doc.contenidoFuente}
                          onChange={(e) => {
                            const updated = [...data.documentosIntegrados];
                            updated[idx] = {
                              ...updated[idx],
                              contenidoFuente: e.target.value,
                            };
                            setData({ ...data, documentosIntegrados: updated });
                          }}
                          className="w-full text-xs p-1 bg-white border border-slate-300 rounded"
                        />
                      ) : (
                        doc.contenidoFuente
                      )}
                    </td>
                    {isEditing && (
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = data.documentosIntegrados.filter(
                              (_, i) => i !== idx
                            );
                            setData({ ...data, documentosIntegrados: updated });
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <a
              href="https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/docs/01-plan-de-gestion-v2.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Web Oficial Publicada</span>
            </a>

            <button
              onClick={handleCopyPublicUrl}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>
                {copiedLink
                  ? '¡Enlace copiado!'
                  : 'Compartir / Copiar Enlace Público'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Floating Save Bar (Always visible while editing anywhere in the 13 sections) */}
      {isEditing && (
        <div className="sticky bottom-3 z-40 bg-slate-950/90 backdrop-blur-md text-white px-4 py-3 rounded-2xl border border-amber-400/80 shadow-2xl flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-bottom-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 uppercase tracking-wider shadow-xs">
              <Edit3 className="w-3.5 h-3.5" /> Edición Activa
            </span>
            <span className="text-xs text-slate-300 hidden md:inline">
              Toda modificación que realices se guardará obligatoriamente al hacer clic en Guardar.
            </span>
            {lastSavedTimestamp && (
              <span className="text-[11px] text-slate-400">
                Último guardado: {lastSavedTimestamp}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              Salir sin Guardar
            </button>
            <button
              type="button"
              id="btn-guardar-flotante-obligatorio"
              onClick={handleSaveData}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-300 transition-all cursor-pointer transform active:scale-95"
            >
              <Save className="w-4 h-4 text-slate-950" />
              <span>GUARDAR CAMBIOS AHORA</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer Acknowledgement */}
      <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span>
          Plan de Gestión del Proyecto v2.0 · Oficina de Racionalización · OGPL
          UNMSM
        </span>
        <span>Línea Base: Norma Técnica N.º 002-2025-PCM-SGP</span>
      </div>
    </div>
  );
};
