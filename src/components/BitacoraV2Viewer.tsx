import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  BITACORA_V2_DATA,
  BitacoraV2Data,
  BitacoraSubtarea,
  BitacoraRiesgo,
  BitacoraIncidencia,
  BitacoraCambioV1,
} from '../data/bitacoraV2Data';
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
  Share2,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

interface BitacoraV2ViewerProps {
  onOpenFullEditor?: () => void;
}

const STORAGE_KEY_BITACORA = 'unmsm_gxp_bitacora_v2_custom';
const STORAGE_KEY_PUBLIC = 'unmsm_gxp_bitacora_v2_is_public';

export const BitacoraV2Viewer: React.FC<BitacoraV2ViewerProps> = ({
  onOpenFullEditor,
}) => {
  // Load persisted custom data or default
  const [data, setData] = useState<BitacoraV2Data>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BITACORA);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading custom bitacora v2', e);
    }
    return BITACORA_V2_DATA;
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
        localStorage.setItem(STORAGE_KEY_BITACORA, JSON.stringify(data));
      } catch (e) {
        console.error('Error auto-saving bitacora v2', e);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [data]);

  // Filters
  const [activeTab, setActiveTab] = useState<'ejecucion' | 'riesgos' | 'incidencias' | 'cambios'>('ejecucion');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterParentTask, setFilterParentTask] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

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
    // Recalculate stats
    const total = data.subtareas.length;
    const conformes = data.subtareas.filter((s) => s.estado.toUpperCase().includes('CONFORME')).length;
    const enProceso = data.subtareas.filter((s) => s.estado.toUpperCase().includes('PROCESO')).length;
    const observadas = data.subtareas.filter((s) => s.estado.toUpperCase().includes('OBSERVADO')).length;
    const noIniciadas = data.subtareas.filter((s) => s.estado.toUpperCase().includes('NO INICIADO')).length;

    const updatedData: BitacoraV2Data = {
      ...data,
      stats: {
        totalSubtareas: total,
        conformes,
        enProceso,
        observadas,
        noIniciadas,
      },
    };

    setData(updatedData);
    localStorage.setItem(STORAGE_KEY_BITACORA, JSON.stringify(updatedData));
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Reset to original extracted data
  const handleReset = () => {
    if (window.confirm('¿Deseas restablecer la Bitácora v2.0 a su versión oficial original?')) {
      setData(BITACORA_V2_DATA);
      localStorage.setItem(STORAGE_KEY_BITACORA, JSON.stringify(BITACORA_V2_DATA));
      setIsEditing(false);
    }
  };

  // Download CSV
  const handleDownloadCsv = () => {
    const headers = 'Código,Subtarea,Responsable,Proceso,Inicio,Fin,Estado,Tarea Padre\n';
    const rows = data.subtareas
      .map(
        (s) =>
          `"${s.codigo}","${s.subtarea.replace(/"/g, '""')}","${s.responsable}","${s.proceso}","${s.inicio}","${s.fin}","${s.estado}","${s.tareaPadre}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'UNMSM-Bitacora-v2.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Subtask list helpers
  const handleUpdateSubtask = (idx: number, field: keyof BitacoraSubtarea, value: string) => {
    const updated = [...data.subtareas];
    updated[idx] = { ...updated[idx], [field]: value };
    setData({ ...data, subtareas: updated });
  };

  const handleDeleteSubtask = (idx: number) => {
    const updated = data.subtareas.filter((_, i) => i !== idx);
    const updatedData: BitacoraV2Data = {
      ...data,
      subtareas: updated,
    };
    setData(updatedData);
    try {
      localStorage.setItem(STORAGE_KEY_BITACORA, JSON.stringify(updatedData));
    } catch (e) {
      console.error('Error saving bitacora deletion', e);
    }
  };

  const handleAddSubtask = () => {
    const newRow: BitacoraSubtarea = {
      codigo: `S1.3.2.01.${String(data.subtareas.length + 1).padStart(2, '0')}`,
      subtarea: 'Nueva subtarea de gestión de procesos',
      responsable: 'OR',
      proceso: 'PE.01',
      inicio: '01/09/2026',
      fin: '30/09/2026',
      estado: 'EN PROCESO',
      tareaPadre: filterParentTask !== 'all' ? filterParentTask : 'Tarea padre · T1.3.2.01',
    };
    setData({ ...data, subtareas: [newRow, ...data.subtareas] });
  };

  // Filtered Subtasks
  const filteredSubtasks = useMemo(() => {
    return data.subtareas.filter((s) => {
      const matchSearch =
        searchQuery === '' ||
        s.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.subtarea.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.responsable.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.proceso.toLowerCase().includes(searchQuery.toLowerCase());

      const matchParent = filterParentTask === 'all' || s.tareaPadre.includes(filterParentTask);

      const matchStatus =
        filterStatus === 'all' ||
        s.estado.toUpperCase().replace(/\s+/g, '') === filterStatus.toUpperCase().replace(/\s+/g, '');

      return matchSearch && matchParent && matchStatus;
    });
  }, [data.subtareas, searchQuery, filterParentTask, filterStatus]);

  // Unique Parent Tasks for Filter
  const parentTasksList = useMemo(() => {
    return Array.from(new Set(data.subtareas.map((s) => s.tareaPadre))).filter(Boolean);
  }, [data.subtareas]);

  return (
    <div className="space-y-6 text-slate-800 text-sm">
      {/* 1. Header & Institutional Banner (Unified Gradient Structure matching Cronograma) */}
      <div className="banner-navy-gradient text-white rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden border-b-2 border-b-[#b8933f]/40">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="btn-banner-neutral inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium">
                <Clock className="w-3.5 h-3.5 text-white/80" />
                {data.ceja}
              </span>
              <button
                onClick={handleTogglePublic}
                id="toggle-public-bitacora-btn"
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
                  placeholder="Título de la bitácora..."
                />
                <textarea
                  value={data.subtitulo}
                  onChange={(e) => setData({ ...data, subtitulo: e.target.value })}
                  rows={2}
                  className="w-full text-xs sm:text-sm bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white/80 focus:outline-none focus:ring-2 focus:ring-[#d9b872] leading-relaxed"
                  placeholder="Descripción de la bitácora..."
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

          {/* Actions Toolbar */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
            <button
              onClick={handleCopyPublicUrl}
              className="btn-banner-neutral inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer"
              title="Copiar enlace oficial público"
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
              id="btn-activar-modo-edicion-bitacora"
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
              title="Descargar Bitácora en formato CSV"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl text-xs text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Restablecer a la versión oficial original"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>¡Los cambios en la Bitácora v2.0 se guardaron correctamente en el almacenamiento local!</span>
        </div>
      )}

      {/* 5 KPI Metric Cards (Interactive click filters) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setFilterStatus('all')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            filterStatus === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-400/40'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className={`block text-[10px] uppercase font-bold ${filterStatus === 'all' ? 'text-slate-300' : 'text-slate-400'}`}>
            Total Subtareas
          </span>
          <span className="text-2xl font-black font-poppins">{data.stats.totalSubtareas}</span>
          <span className={`block text-[10px] ${filterStatus === 'all' ? 'text-slate-400' : 'text-slate-500'}`}>
            100% de la EDT
          </span>
        </button>

        <button
          onClick={() => setFilterStatus('CONFORME')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            filterStatus === 'CONFORME'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400/40'
              : 'bg-emerald-50/50 text-emerald-950 border-emerald-200 hover:bg-emerald-100/60'
          }`}
        >
          <span className={`block text-[10px] uppercase font-bold ${filterStatus === 'CONFORME' ? 'text-emerald-200' : 'text-emerald-700'}`}>
            Conformes
          </span>
          <span className="text-2xl font-black font-poppins">{data.stats.conformes}</span>
          <span className={`block text-[10px] ${filterStatus === 'CONFORME' ? 'text-emerald-200' : 'text-emerald-600 font-semibold'}`}>
            {((data.stats.conformes / data.stats.totalSubtareas) * 100).toFixed(1)}%
          </span>
        </button>

        <button
          onClick={() => setFilterStatus('EN PROCESO')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            filterStatus === 'EN PROCESO'
              ? 'bg-sky-700 text-white border-sky-700 shadow-md ring-2 ring-sky-400/40'
              : 'bg-sky-50/50 text-sky-950 border-sky-200 hover:bg-sky-100/60'
          }`}
        >
          <span className={`block text-[10px] uppercase font-bold ${filterStatus === 'EN PROCESO' ? 'text-sky-200' : 'text-sky-700'}`}>
            En Proceso
          </span>
          <span className="text-2xl font-black font-poppins">{data.stats.enProceso}</span>
          <span className={`block text-[10px] ${filterStatus === 'EN PROCESO' ? 'text-sky-200' : 'text-sky-600 font-semibold'}`}>
            {((data.stats.enProceso / data.stats.totalSubtareas) * 100).toFixed(1)}%
          </span>
        </button>

        <button
          onClick={() => setFilterStatus('OBSERVADO')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            filterStatus === 'OBSERVADO'
              ? 'bg-amber-700 text-white border-amber-700 shadow-md ring-2 ring-amber-400/40'
              : 'bg-amber-50/50 text-amber-950 border-amber-200 hover:bg-amber-100/60'
          }`}
        >
          <span className={`block text-[10px] uppercase font-bold ${filterStatus === 'OBSERVADO' ? 'text-amber-200' : 'text-amber-700'}`}>
            Observadas
          </span>
          <span className="text-2xl font-black font-poppins">{data.stats.observadas}</span>
          <span className={`block text-[10px] ${filterStatus === 'OBSERVADO' ? 'text-amber-200' : 'text-amber-600 font-semibold'}`}>
            {((data.stats.observadas / data.stats.totalSubtareas) * 100).toFixed(1)}%
          </span>
        </button>

        <button
          onClick={() => setFilterStatus('NO INICIADO')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            filterStatus === 'NO INICIADO'
              ? 'bg-slate-700 text-white border-slate-700 shadow-md ring-2 ring-slate-400/40'
              : 'bg-slate-100/80 text-slate-800 border-slate-300 hover:bg-slate-200'
          }`}
        >
          <span className={`block text-[10px] uppercase font-bold ${filterStatus === 'NO INICIADO' ? 'text-slate-300' : 'text-slate-500'}`}>
            No Iniciadas
          </span>
          <span className="text-2xl font-black font-poppins">{data.stats.noIniciadas}</span>
          <span className={`block text-[10px] ${filterStatus === 'NO INICIADO' ? 'text-slate-300' : 'text-slate-500'}`}>
            {((data.stats.noIniciadas / data.stats.totalSubtareas) * 100).toFixed(1)}%
          </span>
        </button>
      </div>

      {/* Widget: Estructura del código de subtarea */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-sky-600" />
          Estructura del código de subtarea
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="font-mono text-xl sm:text-2xl font-bold text-sky-900 bg-sky-50 px-3.5 py-1.5 rounded-lg border border-sky-200 tracking-wider shrink-0 text-center">
            {data.estructuraCodigo.ejemplo}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 text-xs">
            {data.estructuraCodigo.partes.map((p, idx) => (
              <div key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="font-mono font-bold text-sky-700 block text-xs">{p.segmento}</span>
                <span className="text-[11px] text-slate-600">{p.descripcion}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
          {data.estructuraCodigo.regla}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs">
        <button
          onClick={() => setActiveTab('ejecucion')}
          className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'ejecucion'
              ? 'bg-sky-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span>Registro de ejecución</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 text-white font-mono">
            {data.subtareas.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('riesgos')}
          className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'riesgos'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span>Registro de riesgos</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 text-white font-mono">
            {data.riesgos.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('incidencias')}
          className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'incidencias'
              ? 'bg-amber-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span>Registro de incidencias</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 text-white font-mono">
            {data.incidencias.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('cambios')}
          className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'cambios'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span>Qué cambió de v1</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 text-white font-mono">
            {data.cambiosV1.length}
          </span>
        </button>
      </div>

      {/* ================= TAB 1: REGISTRO DE EJECUCIÓN ================= */}
      {activeTab === 'ejecucion' && (
        <div className="space-y-4">
          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar subtarea, código, responsable o proceso..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Filter by Parent Task */}
              <select
                value={filterParentTask}
                onChange={(e) => setFilterParentTask(e.target.value)}
                className="text-xs bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">Todas las tareas padre</option>
                {parentTasksList.map((pt, i) => (
                  <option key={i} value={pt}>
                    {pt}
                  </option>
                ))}
              </select>

              {/* Filter by Status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">Todos los estados</option>
                <option value="CONFORME">Conforme</option>
                <option value="EN PROCESO">En proceso</option>
                <option value="OBSERVADO">Observado</option>
                <option value="NO INICIADO">No iniciado</option>
              </select>

              {/* Add New Subtask button (when in edit mode) */}
              {isEditing && (
                <button
                  onClick={handleAddSubtask}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Fila</span>
                </button>
              )}
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center justify-between px-1">
            <span>
              Mostrando <strong>{filteredSubtasks.length}</strong> de <strong>{data.subtareas.length}</strong> subtareas
            </span>
            <span>Agrupado por tarea padre de la EDT</span>
          </div>

          {/* Subtasks Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-32 font-mono">Código</th>
                  <th className="p-3">Subtarea</th>
                  <th className="p-3 w-28">Responsable</th>
                  <th className="p-3 w-20">Proceso</th>
                  <th className="p-3 w-24">Inicio</th>
                  <th className="p-3 w-24">Fin</th>
                  <th className="p-3 w-28 text-center">Estado</th>
                  {isEditing && <th className="p-3 w-12 text-center">Acción</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredSubtasks.map((s, idx) => {
                  const globalIdx = data.subtareas.findIndex((item) => item.codigo === s.codigo);
                  return (
                    <tr
                      key={s.codigo || idx}
                      className={
                        s.estado.includes('OBSERVADO')
                          ? 'bg-amber-50/50 hover:bg-amber-50'
                          : s.estado.includes('PROCESO')
                          ? 'bg-sky-50/30 hover:bg-sky-50/60'
                          : 'hover:bg-slate-50/70'
                      }
                    >
                      <td className="p-2.5 font-mono font-bold text-sky-900 border-r border-slate-200 bg-slate-50/40">
                        {isEditing ? (
                          <input
                            type="text"
                            value={s.codigo}
                            onChange={(e) => handleUpdateSubtask(globalIdx, 'codigo', e.target.value)}
                            className="w-full font-mono text-xs p-1 border rounded"
                          />
                        ) : (
                          <span>{s.codigo}</span>
                        )}
                        <span className="block text-[9px] text-slate-400 font-sans font-normal truncate">
                          {s.tareaPadre.replace('Tarea padre · ', '')}
                        </span>
                      </td>

                      <td className="p-2.5 text-slate-900 border-r border-slate-200 font-medium">
                        {isEditing ? (
                          <textarea
                            rows={2}
                            value={s.subtarea}
                            onChange={(e) => handleUpdateSubtask(globalIdx, 'subtarea', e.target.value)}
                            className="w-full text-xs p-1 border rounded"
                          />
                        ) : (
                          <span>{s.subtarea}</span>
                        )}
                      </td>

                      <td className="p-2.5 text-slate-700 border-r border-slate-200">
                        {isEditing ? (
                          <input
                            type="text"
                            value={s.responsable}
                            onChange={(e) => handleUpdateSubtask(globalIdx, 'responsable', e.target.value)}
                            className="w-full text-xs p-1 border rounded"
                          />
                        ) : (
                          <span>{s.responsable}</span>
                        )}
                      </td>

                      <td className="p-2.5 font-mono text-sky-800 border-r border-slate-200">
                        {isEditing ? (
                          <input
                            type="text"
                            value={s.proceso}
                            onChange={(e) => handleUpdateSubtask(globalIdx, 'proceso', e.target.value)}
                            className="w-full text-xs p-1 border rounded"
                          />
                        ) : (
                          <span>{s.proceso}</span>
                        )}
                      </td>

                      <td className="p-2.5 font-mono text-[11px] text-slate-600 border-r border-slate-200">
                        {isEditing ? (
                          <input
                            type="text"
                            value={s.inicio}
                            onChange={(e) => handleUpdateSubtask(globalIdx, 'inicio', e.target.value)}
                            className="w-full text-xs p-1 border rounded"
                          />
                        ) : (
                          <span>{s.inicio}</span>
                        )}
                      </td>

                      <td className="p-2.5 font-mono text-[11px] text-slate-600 border-r border-slate-200">
                        {isEditing ? (
                          <input
                            type="text"
                            value={s.fin}
                            onChange={(e) => handleUpdateSubtask(globalIdx, 'fin', e.target.value)}
                            className="w-full text-xs p-1 border rounded"
                          />
                        ) : (
                          <span>{s.fin}</span>
                        )}
                      </td>

                      <td className="p-2.5 text-center">
                        {isEditing ? (
                          <select
                            value={s.estado}
                            onChange={(e) => handleUpdateSubtask(globalIdx, 'estado', e.target.value)}
                            className="text-xs p-1 border rounded bg-white"
                          >
                            <option value="CONFORME">CONFORME</option>
                            <option value="EN PROCESO">EN PROCESO</option>
                            <option value="OBSERVADO">OBSERVADO</option>
                            <option value="NO INICIADO">NO INICIADO</option>
                          </select>
                        ) : (
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              s.estado === 'CONFORME'
                                ? 'bg-emerald-100 text-emerald-800'
                                : s.estado === 'EN PROCESO'
                                ? 'bg-blue-100 text-blue-800'
                                : s.estado === 'OBSERVADO'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {s.estado}
                          </span>
                        )}
                      </td>

                      {isEditing && (
                        <td className="p-2.5 text-center">
                          <button
                            onClick={() => handleDeleteSubtask(globalIdx)}
                            className="text-rose-500 hover:text-rose-700 cursor-pointer"
                            title="Eliminar fila"
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

      {/* ================= TAB 2: REGISTRO DE RIESGOS ================= */}
      {activeTab === 'riesgos' && (
        <div className="space-y-4">
          <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-2xl text-xs text-rose-950 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Matriz de Riesgos Identificados en Ejecución:</strong> Los riesgos extraídos de las observaciones de las subtareas se formalizan aquí con responsable asignado y plan de respuesta institucional.
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-16 font-mono">ID</th>
                  <th className="p-3">Riesgo y Evidencia</th>
                  <th className="p-3 w-36">Categoría</th>
                  <th className="p-3 w-32">Prob. / Impacto</th>
                  <th className="p-3 w-24">Responsable</th>
                  <th className="p-3">Respuesta Institucional</th>
                  <th className="p-3 w-28 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {data.riesgos.map((r, idx) => (
                  <tr key={r.id || idx} className="hover:bg-slate-50/70">
                    <td className="p-2.5 font-mono font-bold text-slate-900 border-r border-slate-200 bg-slate-50/40">
                      {r.id}
                    </td>

                    <td className="p-2.5 border-r border-slate-200 text-slate-900">
                      {isEditing ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={r.riesgo}
                            onChange={(e) => {
                              const updated = [...data.riesgos];
                              updated[idx].riesgo = e.target.value;
                              setData({ ...data, riesgos: updated });
                            }}
                            className="w-full text-xs p-1 border rounded font-semibold"
                          />
                          <input
                            type="text"
                            value={r.evidencia}
                            onChange={(e) => {
                              const updated = [...data.riesgos];
                              updated[idx].evidencia = e.target.value;
                              setData({ ...data, riesgos: updated });
                            }}
                            className="w-full text-[11px] p-1 border rounded text-slate-500"
                          />
                        </div>
                      ) : (
                        <div>
                          <strong className="text-slate-900 block">{r.riesgo}</strong>
                          {r.evidencia && (
                            <span className="text-[11px] text-slate-500 block mt-0.5">{r.evidencia}</span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="p-2.5 border-r border-slate-200 text-slate-700 font-medium">
                      {r.categoria}
                    </td>

                    <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-800">
                      {r.probImpacto}
                    </td>

                    <td className="p-2.5 border-r border-slate-200 font-bold text-sky-800">
                      {r.responsable}
                    </td>

                    <td className="p-2.5 border-r border-slate-200 text-slate-800 leading-relaxed">
                      {isEditing ? (
                        <textarea
                          rows={2}
                          value={r.respuesta}
                          onChange={(e) => {
                            const updated = [...data.riesgos];
                            updated[idx].respuesta = e.target.value;
                            setData({ ...data, riesgos: updated });
                          }}
                          className="w-full text-xs p-1 border rounded"
                        />
                      ) : (
                        <span>{r.respuesta}</span>
                      )}
                    </td>

                    <td className="p-2.5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          r.estado === 'Materializado'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {r.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: REGISTRO DE INCIDENCIAS ================= */}
      {activeTab === 'incidencias' && (
        <div className="space-y-4">
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Registro Histórico de Incidencias y Paralizaciones:</strong> Las paralizaciones ocurridas durante el periodo del proyecto se cuantifican con días hábiles y su efecto sobre el avance.
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-20 font-mono">ID</th>
                  <th className="p-3 w-48 font-mono">Periodo</th>
                  <th className="p-3 w-20 text-center">Días</th>
                  <th className="p-3">Evento Ocurrido</th>
                  <th className="p-3">Efecto / Impacto</th>
                  <th className="p-3 w-32">Área Afectada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {data.incidencias.map((inc, idx) => (
                  <tr key={inc.id || idx} className="hover:bg-slate-50/70">
                    <td className="p-2.5 font-mono font-bold text-slate-900 border-r border-slate-200 bg-slate-50/40">
                      {inc.id}
                    </td>

                    <td className="p-2.5 font-mono text-[11px] text-slate-700 border-r border-slate-200">
                      {inc.periodo}
                    </td>

                    <td className="p-2.5 text-center font-bold text-amber-800 border-r border-slate-200">
                      {inc.dias}
                    </td>

                    <td className="p-2.5 font-semibold text-slate-900 border-r border-slate-200">
                      {isEditing ? (
                        <input
                          type="text"
                          value={inc.evento}
                          onChange={(e) => {
                            const updated = [...data.incidencias];
                            updated[idx].evento = e.target.value;
                            setData({ ...data, incidencias: updated });
                          }}
                          className="w-full text-xs p-1 border rounded"
                        />
                      ) : (
                        <span>{inc.evento}</span>
                      )}
                    </td>

                    <td className="p-2.5 text-slate-800 border-r border-slate-200">
                      {isEditing ? (
                        <input
                          type="text"
                          value={inc.efecto}
                          onChange={(e) => {
                            const updated = [...data.incidencias];
                            updated[idx].efecto = e.target.value;
                            setData({ ...data, incidencias: updated });
                          }}
                          className="w-full text-xs p-1 border rounded"
                        />
                      ) : (
                        <span>{inc.efecto}</span>
                      )}
                    </td>

                    <td className="p-2.5 font-medium text-slate-700">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                        {inc.area}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 4: QUÉ CAMBIÓ RESPECTO DE LA VERSIÓN 1 ================= */}
      {activeTab === 'cambios' && (
        <div className="space-y-4">
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl text-xs text-indigo-950 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>10 Mejoras y Correcciones Clave respecto de la versión 1:</strong> Reconstrucción de la bitácora para alinear cada subtarea con el cronograma y eliminar redundancias del formato de plantilla anterior.
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-24 font-mono">Hallazgo</th>
                  <th className="p-3">Corrección Aplicada en la Versión 2.0</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {data.cambiosV1.map((c, idx) => (
                  <tr key={c.id || idx} className="hover:bg-slate-50/70">
                    <td className="p-2.5 font-mono font-bold text-indigo-800 border-r border-slate-200 bg-indigo-50/30">
                      {c.id}
                    </td>
                    <td className="p-2.5 text-slate-800 leading-relaxed font-medium">
                      {isEditing ? (
                        <textarea
                          rows={2}
                          value={c.correccion}
                          onChange={(e) => {
                            const updated = [...data.cambiosV1];
                            updated[idx].correccion = e.target.value;
                            setData({ ...data, cambiosV1: updated });
                          }}
                          className="w-full text-xs p-1 border rounded"
                        />
                      ) : (
                        <span>{c.correccion}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom links & Downloads */}
      <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadCsv}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Bitácora v2.0 · CSV</span>
          </button>

          <button
            onClick={handleCopyPublicUrl}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? '¡Enlace copiado!' : 'Copiar Enlace Público'}</span>
          </button>

          <a
            href={data.urlOficial}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Web Oficial</span>
          </a>
        </div>

        <span className="text-[11px] text-slate-400">
          Bitácora v2.0 · Oficina de Racionalización · OGPL UNMSM
        </span>
      </div>
    </div>
  );
};
