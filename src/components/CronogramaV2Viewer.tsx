import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  CRONOGRAMA_V2_DATA,
  CronogramaV2Data,
  CronogramaItem,
  CronogramaCambioV1,
  CronogramaTareaNueva,
} from '../data/cronogramaV2Data';
import {
  Globe,
  Lock,
  ExternalLink,
  Copy,
  Check,
  Edit3,
  Save,
  RotateCcw,
  Download,
  Search,
  Filter,
  Plus,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  Star,
  ShieldAlert,
  FileText,
  Table,
} from 'lucide-react';
import { CronogramaDetailedTable } from './CronogramaDetailedTable';

interface CronogramaV2ViewerProps {
  onOpenFullEditor?: () => void;
}

const STORAGE_KEY_CRONOGRAMA = 'unmsm_gxp_cronograma_v2_exact_36_tables';
const STORAGE_KEY_PUBLIC = 'unmsm_gxp_cronograma_v2_is_public';

export const CronogramaV2Viewer: React.FC<CronogramaV2ViewerProps> = ({
  onOpenFullEditor,
}) => {
  // Load persisted custom data or default
  const [data, setData] = useState<CronogramaV2Data>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CRONOGRAMA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.tareas && parsed.tareas.length === 36) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading custom cronograma v2', e);
    }
    return CRONOGRAMA_V2_DATA;
  });

  const [isPublic, setIsPublic] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PUBLIC);
    return saved !== null ? saved === 'true' : true;
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const isInitialMountRef = useRef(true);
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_CRONOGRAMA, JSON.stringify(data));
      } catch (e) {
        console.error('Error auto-saving cronograma v2', e);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [data]);

  // Filters
  const [activeTab, setActiveTab] = useState<'detallado' | 'ruta_critica' | 'cambios' | 'nuevas'>('detallado');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterFase, setFilterFase] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [onlyCritica, setOnlyCritica] = useState<boolean>(false);

  // View format for detailed phase tables: 'csv' (5 columns as requested), 'pmi' (10 columns), 'markdown' (raw text)
  const [viewFormat, setViewFormat] = useState<'csv' | 'pmi' | 'markdown'>('csv');
  const [copiedFase, setCopiedFase] = useState<string | null>(null);
  const [copiedAllMd, setCopiedAllMd] = useState<boolean>(false);

  // Toggle Public / Private
  const handleTogglePublic = () => {
    const nextVal = !isPublic;
    setIsPublic(nextVal);
    localStorage.setItem(STORAGE_KEY_PUBLIC, String(nextVal));
  };

  // Copy official link
  const handleCopyPublicUrl = () => {
    navigator.clipboard.writeText(data.urlOficial);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Save changes to localStorage
  const handleSaveData = () => {
    const totalTareas = data.tareas.length;
    const totalHitos = data.tareas.filter((t) => t.esHito).length;
    const enRutaCritica = data.tareas.filter((t) => t.rutaCritica).length;
    const conformes = data.tareas.filter((t) => t.estado.toUpperCase().includes('CONFORME')).length;
    const enProceso = data.tareas.filter((t) => t.estado.toUpperCase().includes('PROCESO')).length;
    const noIniciadas = data.tareas.filter((t) => t.estado.toUpperCase().includes('NO INICIADO')).length;

    const updatedData: CronogramaV2Data = {
      ...data,
      stats: {
        ...data.stats,
        totalTareas,
        totalHitos,
        enRutaCritica,
        conformes,
        enProceso,
        noIniciadas,
      },
    };

    setData(updatedData);
    localStorage.setItem(STORAGE_KEY_CRONOGRAMA, JSON.stringify(updatedData));
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Reset to original extracted data
  const handleResetData = () => {
    if (window.confirm('¿Deseas restablecer el cronograma al contenido oficial extraído de GitHub Pages?')) {
      setData(CRONOGRAMA_V2_DATA);
      localStorage.removeItem(STORAGE_KEY_CRONOGRAMA);
      setIsEditing(false);
    }
  };

  // Export to CSV
  const handleDownloadCsv = () => {
    const headers = [
      'Fase',
      'Código',
      'Etapa',
      'Actividad',
      'Tarea',
      'Nota Metodológica',
      'Responsable',
      'Inicio',
      'Fin',
      'Días',
      'Estado',
      'Predecesora',
      'Vínculo',
      'Ruta Crítica',
      'Es Hito',
    ];

    const rows = data.tareas.map((t) => [
      `"${t.fase.replace(/"/g, '""')}"`,
      `"${t.codigo}"`,
      `"${t.etapa.replace(/"/g, '""')}"`,
      `"${t.actividad.replace(/"/g, '""')}"`,
      `"${t.tarea.replace(/"/g, '""')}"`,
      `"${(t.nota || '').replace(/"/g, '""')}"`,
      `"${t.responsable}"`,
      `"${t.inicio}"`,
      `"${t.fin}"`,
      `"${t.dias}"`,
      `"${t.estado}"`,
      `"${t.predecesora || ''}"`,
      `"${t.vinculo || ''}"`,
      `"${t.rutaCritica ? 'SÍ' : 'NO'}"`,
      `"${t.esHito ? 'SÍ' : 'NO'}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '02-cronograma-v2-unmsm.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export 5 columns CSV as requested
  const handleDownload5ColCsv = () => {
    const headers = ['Etapa (Nivel 2)', 'Actividad (Nivel 3)', 'Tarea (Nivel 4)', 'Fecha de Inicio', 'Fecha de Cierre'];
    const rows = filteredTareas.map((t) => [
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

  // Helper to generate Markdown table for a phase
  const generatePhaseMarkdown = (phaseName: string, items: CronogramaItem[]) => {
    let md = `### ${phaseName}\n\n`;
    md += `| Etapa (Nivel 2) | Actividad (Nivel 3) | Tarea (Nivel 4) | Fecha de Inicio | Fecha de Cierre |\n`;
    md += `|---|---|---|---|---|\n`;
    items.forEach((item) => {
      md += `| ${item.etapa} | ${item.actividad} | ${item.tarea} | ${item.inicio} | ${item.fin} |\n`;
    });
    return md;
  };

  // Helper to generate all phases in Markdown
  const generateAllMarkdown = () => {
    return Object.entries(tareasByFase)
      .map(([fase, items]) => generatePhaseMarkdown(fase, items as CronogramaItem[]))
      .join('\n\n');
  };

  // Copy single phase markdown
  const handleCopyPhaseMd = (phaseName: string, items: CronogramaItem[]) => {
    const md = generatePhaseMarkdown(phaseName, items);
    navigator.clipboard.writeText(md);
    setCopiedFase(phaseName);
    setTimeout(() => setCopiedFase(null), 2500);
  };

  // Copy all markdown
  const handleCopyAllMd = () => {
    const md = generateAllMarkdown();
    navigator.clipboard.writeText(md);
    setCopiedAllMd(true);
    setTimeout(() => setCopiedAllMd(false), 2500);
  };

  // Editing helpers
  const handleTaskChange = (index: number, field: keyof CronogramaItem, value: any) => {
    const updated = [...data.tareas];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, tareas: updated });
  };

  const handleAddTask = () => {
    const newTask: CronogramaItem = {
      fase: filterFase !== 'all' ? filterFase : 'F1 · Identificación',
      codigo: `T1.3.${Date.now().toString().slice(-4)}`,
      etapa: 'E1.3 Elaboración del MAGPROF',
      actividad: 'A1.3.3 Documentación de procesos',
      tarea: 'Nueva tarea operativa de gestión por procesos',
      responsable: 'OR / Facultades',
      inicio: '27/08/2026',
      fin: '10/09/2026',
      dias: '10',
      estado: 'NO INICIADO',
      predecesora: '',
      vinculo: 'FC',
      rutaCritica: false,
      esHito: false,
    };
    setData({ ...data, tareas: [newTask, ...data.tareas] });
  };

  const handleDeleteTask = (index: number) => {
    const updated = data.tareas.filter((_, i) => i !== index);
    const updatedData: CronogramaV2Data = {
      ...data,
      tareas: updated,
    };
    setData(updatedData);
    try {
      localStorage.setItem(STORAGE_KEY_CRONOGRAMA, JSON.stringify(updatedData));
    } catch (e) {
      console.error('Error saving cronograma deletion', e);
    }
  };

  const handleCambioChange = (index: number, field: keyof CronogramaCambioV1, value: string) => {
    const updated = [...data.cambiosV1];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, cambiosV1: updated });
  };

  const handleTareaNuevaChange = (index: number, field: keyof CronogramaTareaNueva, value: string) => {
    const updated = [...data.tareasNuevas];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, tareasNuevas: updated });
  };

  // Filtered tareas
  const filteredTareas = useMemo(() => {
    return data.tareas.filter((t) => {
      // Phase filter
      if (filterFase !== 'all') {
        if (filterFase === 'F1' && !t.fase.includes('F1')) return false;
        if (filterFase === 'F2' && !t.fase.includes('F2')) return false;
        if (filterFase === 'F3' && !t.fase.includes('F3') && !t.fase.toLowerCase().includes('medici') && !t.fase.toLowerCase().includes('evaluaci')) return false;
      }
      // Status filter
      if (filterStatus !== 'all') {
        if (filterStatus === 'CONFORME' && !t.estado.toUpperCase().includes('CONFORME')) return false;
        if (filterStatus === 'PROCESO' && !t.estado.toUpperCase().includes('PROCESO')) return false;
        if (filterStatus === 'NO INICIADO' && !t.estado.toUpperCase().includes('NO INICIADO')) return false;
      }
      // Critical path only
      if (onlyCritica && !t.rutaCritica) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inCode = t.codigo.toLowerCase().includes(q);
        const inTarea = t.tarea.toLowerCase().includes(q);
        const inEtapa = t.etapa.toLowerCase().includes(q);
        const inActividad = t.actividad.toLowerCase().includes(q);
        const inResp = t.responsable.toLowerCase().includes(q);
        const inNota = (t.nota || '').toLowerCase().includes(q);
        return inCode || inTarea || inEtapa || inActividad || inResp || inNota;
      }
      return true;
    });
  }, [data.tareas, filterFase, filterStatus, onlyCritica, searchQuery]);

  // Group filtered tareas by Phase (normalizing to standard F1, F2, F3)
  const tareasByFase = useMemo(() => {
    const groups: { [key: string]: CronogramaItem[] } = {};
    filteredTareas.forEach((t) => {
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
  }, [filteredTareas]);

  return (
    <div className="space-y-6 pb-12" id="cronograma-v2-root-viewer">
      {/* 1. Header & Institutional Banner */}
      <div className="banner-navy-gradient text-white rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden border-b-2 border-b-[#b8933f]/40">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="btn-banner-neutral inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium">
                <Calendar className="w-3.5 h-3.5 text-white/80" />
                {data.ceja}
              </span>
              <button
                onClick={handleTogglePublic}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  isPublic
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30'
                    : 'chip-gold-accent hover:brightness-110'
                }`}
                title={isPublic ? 'Documento público institucional' : 'Documento privado en borrador'}
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
            </div>

            {isEditing ? (
              <div className="space-y-2 my-1">
                <input
                  type="text"
                  value={data.titulo}
                  onChange={(e) => setData({ ...data, titulo: e.target.value })}
                  className="w-full text-xl sm:text-2xl font-bold bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-[#d9b872]"
                  placeholder="Título del cronograma..."
                />
                <textarea
                  value={data.subtitulo}
                  onChange={(e) => setData({ ...data, subtitulo: e.target.value })}
                  rows={2}
                  className="w-full text-xs sm:text-sm bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white/80 focus:outline-none focus:ring-2 focus:ring-[#d9b872] leading-relaxed"
                  placeholder="Descripción del cronograma..."
                />
              </div>
            ) : (
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  {data.titulo}
                  <span className="chip-gold-accent text-xs font-mono font-bold px-2 py-0.5 rounded-md">
                    v2.0
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-white/72 mt-1.5 max-w-3xl leading-relaxed">
                  {data.subtitulo}
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
            <button
              onClick={handleCopyPublicUrl}
              className="btn-banner-neutral inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer"
              title="Copiar enlace oficial de GitHub Pages"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copiedLink ? 'Enlace Copiado' : 'Copiar Enlace'}
            </button>

            <a
              href={data.urlOficial}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-steel-blue-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              Ver Web Oficial
            </a>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isEditing
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-lg ring-2 ring-amber-300/60'
                  : 'btn-banner-neutral'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? 'Salir de Edición' : 'Modo Edición'}
            </button>

            {isEditing && (
              <button
                onClick={handleSaveData}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all cursor-pointer ring-2 ring-emerald-400/50"
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
            )}

            <button
              onClick={handleDownloadCsv}
              className="btn-banner-neutral inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer"
              title="Descargar cronograma en formato CSV para Excel o Google Sheets"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>

            <button
              onClick={handleResetData}
              className="p-2 rounded-xl text-xs text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Restablecer datos originales"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Save success toast banner */}
        {saveSuccess && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-400/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>¡Los cambios en el cronograma han sido guardados exitosamente en el almacenamiento institucional!</span>
          </div>
        )}
      </div>

      {/* 2. Key Metrics & Diagnostic Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Metric 1: Total Tareas */}
        <div
          onClick={() => {
            setOnlyCritica(false);
            setFilterStatus('all');
            setActiveTab('detallado');
          }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="text-3xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
            {data.tareas.length}
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-0.5">Tareas en Cronograma</div>
          <div className="text-[11px] text-slate-400 mt-1">Conteo fiel 1:1 (36 tareas)</div>
        </div>

        {/* Metric 2: Hitos Declarados */}
        <div
          onClick={() => {
            setActiveTab('ruta_critica');
          }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-3xl font-extrabold text-amber-600 group-hover:text-amber-500 transition-colors">
              {data.stats.totalHitos}
            </div>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-0.5">Hito de Cierre Fase 1</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">H1.3.5.03 (30/09/2026)</div>
        </div>

        {/* Metric 3: Ruta Crítica */}
        <div
          onClick={() => {
            setOnlyCritica(true);
            setActiveTab('detallado');
          }}
          className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/30 shadow-sm hover:border-red-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-3xl font-extrabold text-red-600 group-hover:text-red-500 transition-colors">
              {data.stats.enRutaCritica}
            </div>
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-xs font-semibold text-red-950 mt-0.5">En la Ruta Crítica</div>
          <div className="text-[11px] text-red-600 font-bold mt-1">Holgura: 1 día</div>
        </div>

        {/* Metric 4: Tareas Nuevas */}
        <div
          onClick={() => setActiveTab('nuevas')}
          className="bg-white p-4 rounded-xl border border-purple-200 bg-purple-50/20 shadow-sm hover:border-purple-400 transition-all cursor-pointer group"
        >
          <div className="text-3xl font-extrabold text-purple-600 group-hover:text-purple-500 transition-colors">
            {data.stats.tareasNuevas}
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-0.5">Tareas Nuevas</div>
          <div className="text-[11px] text-purple-700 mt-1">Incorporadas en v2.0</div>
        </div>

        {/* Metric 5: Códigos Duplicados */}
        <div
          onClick={() => setActiveTab('cambios')}
          className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm hover:border-emerald-400 transition-all cursor-pointer group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between">
            <div className="text-3xl font-extrabold text-emerald-600 group-hover:text-emerald-500 transition-colors">
              0
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-0.5">Códigos Duplicados</div>
          <div className="text-[11px] text-emerald-700 mt-1">11 Hallazgos resueltos</div>
        </div>
      </div>

      {/* 3. Ruta Crítica de la Fase 1 Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <h2 className="text-base font-bold text-white">Ruta Crítica de la Fase 1 (Identificación)</h2>
          <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30 font-semibold ml-auto">
            Holgura Total: 1 Día Hábil
          </span>
        </div>
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          {data.rutaCriticaFase1.descripcion}
        </p>

        {/* Step-by-step 5 linked critical chain elements */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 mb-4">
          {data.rutaCriticaFase1.elementos.map((elem, idx) => (
            <div
              key={elem.codigo}
              className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex flex-col justify-between relative hover:border-blue-500 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-blue-400 font-bold mb-1">
                  <span>{elem.codigo}</span>
                  {idx === 4 && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                </div>
                <div className="text-xs font-semibold text-slate-100 leading-tight">
                  {elem.nombre}
                </div>
              </div>
              {idx < 4 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-slate-900 rounded-full p-0.5 text-slate-400 border border-slate-700">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Diagnostic Alert Box */}
        <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl text-xs text-red-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-red-300 font-bold">Advertencia de plazo oficial: </strong>
            {data.rutaCriticaFase1.advertencia}
          </div>
        </div>
      </div>

      {/* 4. Tab Navigation */}
      <div className="border-b border-slate-200 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('detallado')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'detallado'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            Cronograma Detallado ({data.tareas.length})
          </button>

          <button
            onClick={() => setActiveTab('ruta_critica')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ruta_critica'
                ? 'border-red-600 text-red-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Ruta Crítica & Hitos ({data.stats.enRutaCritica})
          </button>

          <button
            onClick={() => setActiveTab('cambios')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'cambios'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Qué Cambió de v1 ({data.cambiosV1.length})
          </button>

          <button
            onClick={() => setActiveTab('nuevas')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'nuevas'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Star className="w-4 h-4" />
            4 Tareas Nuevas ({data.tareasNuevas.length})
          </button>
        </div>

        {isEditing && (
          <div className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 animate-pulse whitespace-nowrap">
            Modo Edición Activo
          </div>
        )}
      </div>

      {/* 5. Tab Content: Detallado */}
      {activeTab === 'detallado' && (
        <div className="space-y-4">
          {/* Controls & Filters Bar */}
          <div className="flex flex-col gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
                {/* Search input */}
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por código, tarea, etapa o responsable..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
                  />
                </div>

                {/* Fase Filter */}
                <select
                  value={filterFase}
                  onChange={(e) => setFilterFase(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer shadow-2xs"
                >
                  <option value="all">Todas las Fases (3)</option>
                  <option value="F1">F1 · Identificación</option>
                  <option value="F2">F2 · Implementación</option>
                  <option value="F3">F3 · Evaluación</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer shadow-2xs"
                >
                  <option value="all">Todos los Estados</option>
                  <option value="CONFORME">Conforme</option>
                  <option value="PROCESO">En Proceso</option>
                  <option value="NO INICIADO">No Iniciado</option>
                </select>

                {/* Only Ruta Crítica toggle */}
                <button
                  type="button"
                  onClick={() => setOnlyCritica(!onlyCritica)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs ${
                    onlyCritica
                      ? 'bg-red-600 text-white border-red-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Solo Ruta Crítica
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyAllMd}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
                  title="Copiar todas las fases y tablas estructuradas en Markdown"
                >
                  {copiedAllMd ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>¡Todo Copiado en Markdown!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Todo en Markdown</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownload5ColCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                  title="Descargar archivo CSV con las 5 columnas solicitadas"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Descargar CSV (5 Col)</span>
                </button>

                {/* Add Task Button (when editing) */}
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleAddTask}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    Añadir Tarea
                  </button>
                )}
              </div>
            </div>

            {/* View Format Selector Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/80">
              <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewFormat('csv')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewFormat === 'csv'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Formato de 5 columnas original: Etapa (Nivel 2), Actividad (Nivel 3), Tarea (Nivel 4), Fecha de Inicio, Fecha de Cierre"
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Formato CSV Original (5 Columnas)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewFormat('pmi')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewFormat === 'pmi'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Vista extendida con Código, Responsable, Días, Estado, Predecesora y Ruta Crítica"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Matriz Extendida PMI (10 Col)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewFormat('markdown')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewFormat === 'markdown'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Ver texto plano Markdown para copiar y pegar"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Vista Texto Markdown</span>
                </button>
              </div>

              <div className="text-xs text-slate-500">
                Mostrando <strong>{filteredTareas.length}</strong> de {data.tareas.length} tareas · dd/mm/aaaa
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: MARKDOWN RAW */}
          {viewFormat === 'markdown' && (
            <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-900 shadow-sm text-slate-100">
              <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono font-bold text-xs text-slate-200">
                    Tablas de Cronograma en Formato Markdown Oficial (5 Columnas Estrictas)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAllMd}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold cursor-pointer transition-colors"
                >
                  {copiedAllMd ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Markdown Completo</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed text-slate-200 whitespace-pre select-all max-h-[600px]">
                {generateAllMarkdown()}
              </pre>
            </div>
          )}

          {/* Detailed Table Grouped by Phase */}
          {viewFormat !== 'markdown' && (
            <div className="space-y-6">
              {Object.entries(tareasByFase).map(([fase, items]) => {
                const tareas = items as CronogramaItem[];
                return (
                  <div key={fase} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    {/* Phase Header */}
                    <div className="bg-slate-800 text-white px-4 py-2.5 font-bold text-xs uppercase tracking-wide flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                        <span className="font-bold text-sm tracking-tight text-white capitalize">{fase}</span>
                        <span className="text-xs text-slate-300 font-mono bg-slate-700/80 px-2 py-0.5 rounded">
                          {tareas.length} {tareas.length === 1 ? 'tarea' : 'tareas'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyPhaseMd(fase, tareas)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-100 hover:text-white text-xs font-medium transition-colors cursor-pointer border border-slate-600"
                        title={`Copiar tabla de ${fase} en formato Markdown`}
                      >
                        {copiedFase === fase ? (
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

                    {/* Table View Component */}
                    <CronogramaDetailedTable
                      tareas={tareas}
                      allTareas={data.tareas}
                      viewFormat={viewFormat}
                      isEditing={isEditing}
                      onTaskChange={handleTaskChange}
                      onDeleteTask={handleDeleteTask}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. Tab Content: Ruta Crítica & Hitos */}
      {activeTab === 'ruta_critica' && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              Análisis Estructural de Ruta Crítica e Hitos
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              La ruta crítica concentra las tareas que no admiten demora sin postergar la fecha de cierre institucional fijada para el 30 de setiembre de 2026. A continuación se listan las 15 tareas en ruta crítica y los 6 hitos declarados.
            </p>
          </div>

          {/* List of 15 Critical Path Tasks */}
          <div className="border border-red-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="bg-red-900 text-white px-4 py-2.5 font-bold text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" />
                15 Tareas en la Ruta Crítica (Cero Holgura)
              </div>
              <span className="text-[11px] text-red-200 font-mono">Consumo: 24 de 25 días hábiles</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-red-50/60 border-b border-red-200 text-slate-700 font-semibold">
                    <th className="py-2.5 px-3 w-28 font-mono">Código</th>
                    <th className="py-2.5 px-3">Tarea Crítica</th>
                    <th className="py-2.5 px-3 w-32">Responsable</th>
                    <th className="py-2.5 px-3 w-24 text-center">Inicio</th>
                    <th className="py-2.5 px-3 w-24 text-center">Fin</th>
                    <th className="py-2.5 px-3 w-16 text-center">Días</th>
                    <th className="py-2.5 px-3 w-28 text-center">Estado</th>
                    <th className="py-2.5 px-3 w-28 text-center">Predecesora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.tareas
                    .filter((t) => t.rutaCritica)
                    .map((item) => (
                      <tr key={item.codigo} className="hover:bg-red-50/40 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-red-900 whitespace-nowrap">
                          {item.codigo}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-900">{item.tarea}</div>
                          {item.nota && (
                            <div className="text-[11px] text-red-800 bg-red-50 border border-red-200/60 rounded px-2 py-0.5 mt-0.5 font-sans">
                              {item.nota}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 font-medium">{item.responsable}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{item.inicio}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{item.fin}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold">{item.dias}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              item.estado.toUpperCase().includes('CONFORME')
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : item.estado.toUpperCase().includes('PROCESO')
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-slate-100 text-slate-600 border border-slate-300'
                            }`}
                          >
                            {item.estado}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-[11px]">
                          {item.predecesora ? `${item.predecesora} (${item.vinculo})` : '—'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* List of 6 Milestones */}
          <div className="border border-amber-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="bg-amber-800 text-white px-4 py-2.5 font-bold text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                6 Hitos Oficiales Declarados
              </div>
              <span className="text-[11px] text-amber-200 font-mono">Puntos de Control Contractuales</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-amber-50/60 border-b border-amber-200 text-slate-700 font-semibold">
                    <th className="py-2.5 px-3 w-28 font-mono">Código</th>
                    <th className="py-2.5 px-3">Hito Oficial</th>
                    <th className="py-2.5 px-3 w-32">Responsable</th>
                    <th className="py-2.5 px-3 w-28 text-center">Fecha Límite</th>
                    <th className="py-2.5 px-3 w-28 text-center">Estado</th>
                    <th className="py-2.5 px-3 w-28 text-center">Predecesora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.tareas
                    .filter((t) => t.esHito || t.codigo.startsWith('H'))
                    .map((item) => (
                      <tr key={item.codigo} className="hover:bg-amber-50/30 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-amber-900 flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          {item.codigo}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{item.tarea}</div>
                          {item.nota && (
                            <div className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200/60 rounded px-2 py-0.5 mt-0.5">
                              {item.nota}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 font-medium">{item.responsable}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">{item.fin}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              item.estado.toUpperCase().includes('CONFORME')
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-100 text-slate-600 border border-slate-300'
                            }`}
                          >
                            {item.estado}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-[11px]">
                          {item.predecesora ? `${item.predecesora} (${item.vinculo})` : '—'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. Tab Content: Qué Cambió de la Versión 1 */}
      {activeTab === 'cambios' && (
        <div className="space-y-4">
          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-200">
            <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              14 Hallazgos Resueltos respecto de la Versión 1 (24/07/2026)
            </h3>
            <p className="text-xs text-indigo-900 leading-relaxed">
              El diagnóstico técnico reveló inconsistencias de numeración, tareas fantasma y dependencias invertidas en la plantilla previa. Cada una fue corregida de forma auditada en esta versión 2.0.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-4 w-28 font-mono">Hallazgo</th>
                    <th className="py-2.5 px-4">Corrección Aplicada en v2.0</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.cambiosV1.map((cambio, index) => (
                    <tr key={cambio.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700 align-top">
                        {cambio.id}
                      </td>
                      <td className="py-3 px-4 text-slate-800 leading-relaxed align-top">
                        {isEditing ? (
                          <textarea
                            value={cambio.correccion}
                            onChange={(e) => handleCambioChange(index, 'correccion', e.target.value)}
                            rows={2}
                            className="w-full text-xs border border-slate-300 rounded p-1.5 focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          cambio.correccion
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 8. Tab Content: 4 Tareas Nuevas */}
      {activeTab === 'nuevas' && (
        <div className="space-y-4">
          <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200">
            <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-purple-600" />
              Cuatro Tareas que no existían en el Cronograma Original
            </h3>
            <p className="text-xs text-purple-900 leading-relaxed">
              Tareas operativas indispensables para el cierre de la Fase 1 que omitía la versión 1.0, generando brechas críticas de ejecución y auditoría.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-4 w-28 font-mono">Código</th>
                    <th className="py-2.5 px-4 w-72">Tarea Incorporada</th>
                    <th className="py-2.5 px-4">Por qué Faltaba y Justificación de Incorporación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.tareasNuevas.map((t, index) => (
                    <tr key={t.codigo} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-purple-700 align-top">
                        {t.codigo}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 align-top">
                        {isEditing ? (
                          <input
                            type="text"
                            value={t.tarea}
                            onChange={(e) => handleTareaNuevaChange(index, 'tarea', e.target.value)}
                            className="w-full text-xs border border-slate-300 rounded p-1"
                          />
                        ) : (
                          t.tarea
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700 leading-relaxed align-top">
                        {isEditing ? (
                          <textarea
                            value={t.motivo}
                            onChange={(e) => handleTareaNuevaChange(index, 'motivo', e.target.value)}
                            rows={2}
                            className="w-full text-xs border border-slate-300 rounded p-1.5 focus:ring-2 focus:ring-purple-500"
                          />
                        ) : (
                          t.motivo
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 9. Footer with Download CTA and Metadata */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-slate-500" />
          <span>Descarga oficial con codificación UTF-8 con BOM. Se importa directamente en Excel o Google Sheets sin desajustes.</span>
        </div>
        <button
          onClick={handleDownloadCsv}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs shadow-sm transition-all cursor-pointer whitespace-nowrap"
        >
          Descargar CSV (UTF-8 BOM)
        </button>
      </div>
    </div>
  );
};
