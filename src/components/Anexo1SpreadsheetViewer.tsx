import React, { useState, useEffect, useMemo } from 'react';
import {
  ExternalLink,
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  Info,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Table as TableIcon,
  Globe,
  Sparkles,
  Plus,
  Trash2,
  Layers,
  ShieldCheck,
  Check,
  Copy,
  Edit3,
} from 'lucide-react';
import {
  ANEXO1_GOOGLE_SHEET_URL,
  ANEXO1_DIRECTRICES,
  ANEXO1_MEDICINA_ROWS,
  Anexo1Row,
} from '../data/anexo1MedicinaData';

interface Anexo1BannerData {
  titulo: string;
  descripcion: string;
}

const DEFAULT_ANEXO1_BANNER: Anexo1BannerData = {
  titulo: 'Directriz Oficial SIGPRO · UNMSM:',
  descripcion:
    'Los anexos oficiales conectados son Anexo 1-A1 (Inventario de Productos y Procesos) y Anexo 3 (A3) (Ficha Técnica). Dado que el Anexo 2 tenía celdas combinadas no compatibles con la ingesta automática, el tipo de proceso se cataloga ahora directamente en esta matriz.',
};

interface Anexo1SpreadsheetViewerProps {
  onOpenFullEditor?: () => void;
  hideTopBar?: boolean;
  customSheetUrl?: string;
}

export const Anexo1SpreadsheetViewer: React.FC<Anexo1SpreadsheetViewerProps> = ({
  hideTopBar = false,
  customSheetUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'tabla' | 'directrices' | 'hojaLive'>('tabla');
  const [filterType, setFilterType] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [rows, setRows] = useState<Anexo1Row[]>(() => {
    try {
      const saved = localStorage.getItem('sigpro_fm_anexo1_rows_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading anexo1 rows', e);
    }
    return ANEXO1_MEDICINA_ROWS;
  });
  const [showDirectricesBanner, setShowDirectricesBanner] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Listen for direct navigation into the Directrices y Reglas tab
  useEffect(() => {
    const handleOpenDirectrices = () => setActiveTab('directrices');
    window.addEventListener('unmsm_open_anexo1_directrices', handleOpenDirectrices);
    return () => window.removeEventListener('unmsm_open_anexo1_directrices', handleOpenDirectrices);
  }, []);

  // Banner directriz state & auto-save
  const [bannerData, setBannerData] = useState<Anexo1BannerData>(() => {
    try {
      const saved = localStorage.getItem('sigpro_anexo1_banner_data_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading anexo1 banner', e);
    }
    return DEFAULT_ANEXO1_BANNER;
  });
  const [isEditingBanner, setIsEditingBanner] = useState<boolean>(false);
  const [bannerEditTemp, setBannerEditTemp] = useState<Anexo1BannerData>(bannerData);
  const [bannerSavedToast, setBannerSavedToast] = useState<boolean>(false);

  const saveBannerData = (newData: Anexo1BannerData) => {
    setBannerData(newData);
    try {
      localStorage.setItem('sigpro_anexo1_banner_data_v2', JSON.stringify(newData));
      setBannerSavedToast(true);
      setTimeout(() => setBannerSavedToast(false), 2500);
    } catch (e) {
      console.error('Error saving anexo1 banner', e);
    }
  };

  // Directrices list state & auto-save
  const [directrices, setDirectrices] = useState<{ titulo: string; texto: string }[]>(() => {
    try {
      const saved = localStorage.getItem('sigpro_anexo1_directrices_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading anexo1 directrices', e);
    }
    return ANEXO1_DIRECTRICES;
  });
  const [editingDirectrizIndex, setEditingDirectrizIndex] = useState<number | null>(null);
  const [directricesSavedToast, setDirectricesSavedToast] = useState<boolean>(false);

  const saveDirectrices = (newDirectrices: { titulo: string; texto: string }[]) => {
    setDirectrices(newDirectrices);
    try {
      localStorage.setItem('sigpro_anexo1_directrices_v2', JSON.stringify(newDirectrices));
      setDirectricesSavedToast(true);
      setTimeout(() => setDirectricesSavedToast(false), 2200);
    } catch (e) {
      console.error('Error saving anexo1 directrices', e);
    }
  };

  const handleUpdateDirectriz = (index: number, field: 'titulo' | 'texto', value: string) => {
    const updated = directrices.map((d, i) => (i === index ? { ...d, [field]: value } : d));
    saveDirectrices(updated);
  };

  const handleAddDirectriz = () => {
    const newRule = {
      titulo: `Regla Obligatoria N° ${directrices.length + 1}`,
      texto: 'Especifique la disposición obligatoria para el llenado y estandarización del Anexo 1.',
    };
    const updated = [...directrices, newRule];
    saveDirectrices(updated);
    setEditingDirectrizIndex(updated.length - 1);
  };

  const handleDeleteDirectriz = (index: number) => {
    const updated = directrices.filter((_, i) => i !== index);
    saveDirectrices(updated);
    if (editingDirectrizIndex === index) {
      setEditingDirectrizIndex(null);
    }
  };

  const handleResetDirectrices = () => {
    saveDirectrices(ANEXO1_DIRECTRICES);
    setEditingDirectrizIndex(null);
  };

  // Save helper
  const saveRows = (newRows: Anexo1Row[]) => {
    setRows(newRows);
    try {
      localStorage.setItem('sigpro_fm_anexo1_rows_v2', JSON.stringify(newRows));
    } catch (e) {
      console.error('Error saving anexo1 rows', e);
    }
  };

  // Filtered rows calculation
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (r.isSectionHeader) return true;

      const matchesSearch =
        searchTerm === '' ||
        r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.fuenteAccionEstrategica &&
          r.fuenteAccionEstrategica.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.actividadOperativa &&
          r.actividadOperativa.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.clasificacion && r.clasificacion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.atributos && r.atributos.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterType === 'todos') return true;
      if (filterType === 'PE') return r.code.startsWith('PE');
      if (filterType === 'PM') return r.code.startsWith('PM');
      if (filterType === 'Regulación') return r.clasificacion === 'Regulación';
      if (filterType === 'Servicio') return r.clasificacion === 'Servicio';
      if (filterType === 'Bien') return r.clasificacion === 'Bien';

      return true;
    });
  }, [rows, searchTerm, filterType]);

  const handleCopySheetLink = () => {
    navigator.clipboard.writeText(ANEXO1_GOOGLE_SHEET_URL);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCellEdit = (id: string, field: keyof Anexo1Row, value: string) => {
    const updated = rows.map((row) => (row.id === id ? { ...row, [field]: value } : row));
    saveRows(updated);
  };

  const handleAddRow = () => {
    const newId = `row-custom-${Date.now()}`;
    const newRow: Anexo1Row = {
      id: newId,
      code: 'PM.01.20_F01',
      producto: 'NUEVO PRODUCTO CATALOGADO',
      tipoProducto: 'Final / Salida (Servicio)',
      fuenteAccionEstrategica: 'AE 01.01 Actualización continua',
      actividadOperativa: 'GESTIÓN OPERATIVA FM',
      clasificacion: 'Servicio',
      atributos: 'Calidad',
      variablesCalidad: '1. Tiempo de atención, 3. Claridad de la información',
      criteriosValidacion: '3. Contribuye al cumplimiento de la misión institucional',
    };
    saveRows([...rows, newRow]);
  };

  const handleDeleteRow = (id: string) => {
    const updated = rows.filter((r) => r.id !== id);
    saveRows(updated);
  };

  const handleExportCSV = () => {
    const headers = [
      'CÓDIGO',
      'PRODUCTOS (Columna B)',
      'TIPO DE PRODUCTO (Columna C)',
      'FUENTE - ACCIÓN ESTRATÉGICA (Columna D)',
      'ACTIVIDAD OPERATIVA (Columna E)',
      'CLASIFICACIÓN (Columna F)',
      'ATRIBUTOS (Columna G)',
      'VARIABLES DE CALIDAD (Columna H)',
      'CRITERIOS DE VALIDACIÓN (Columna I)',
    ];

    const csvContent = [
      'Facultad de Medicina - Anexo 1',
      headers.join(','),
      ...rows.map((r) =>
        [
          `"${r.code || ''}"`,
          `"${(r.producto || '').replace(/"/g, '""')}"`,
          `"${(r.tipoProducto || '').replace(/"/g, '""')}"`,
          `"${(r.fuenteAccionEstrategica || '').replace(/"/g, '""')}"`,
          `"${(r.actividadOperativa || '').replace(/"/g, '""')}"`,
          `"${(r.clasificacion || '').replace(/"/g, '""')}"`,
          `"${(r.atributos || '').replace(/"/g, '""')}"`,
          `"${(r.variablesCalidad || '').replace(/"/g, '""')}"`,
          `"${(r.criteriosValidacion || '').replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Facultad_Medicina_Anexo_1_Inventario.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const effectiveSheetUrl =
    customSheetUrl ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('sigpro_fm_anexo1_sheet_url')
      : null) ||
    ANEXO1_GOOGLE_SHEET_URL;

  // Google Sheet embed link (preview mode)
  const embedUrl = effectiveSheetUrl.includes('/preview')
    ? effectiveSheetUrl
    : effectiveSheetUrl.includes('/edit')
    ? effectiveSheetUrl.replace(/\/edit.*$/, '/preview')
    : effectiveSheetUrl.replace(/\/?$/, '/preview');

  return (
    <div className="space-y-4">
      {/* Top Bar with Prominent Redirection Button on the TOP-LEFT */}
      {!hideTopBar && (
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-2xl border border-emerald-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          {/* PARTE SUPERIOR IZQUIERDA: REDIRECCIÓN A LA HOJA DE CÁLCULO */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={effectiveSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="btn-redireccion-hoja-calculo-anexo1"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold rounded-xl text-xs shadow-sm hover:shadow transition-all group cursor-pointer ring-2 ring-emerald-500/20"
              title="Redirección a la Hoja de Cálculo Oficial en Google Sheets"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform shrink-0" />
              <span className="tracking-wide">Redirección a la Hoja de Cálculo</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
            </a>

            <button
              onClick={handleCopySheetLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs border border-emerald-200/80 shadow-2xs transition-colors cursor-pointer"
              title="Copiar enlace de Google Sheets"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copiar Enlace</span>
                </>
              )}
            </button>
          </div>

          {/* View Modes Selector & Actions */}
          <div className="flex items-center gap-1.5 bg-white/90 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('tabla')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'tabla'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Matriz de Datos ({rows.filter((r) => !r.isSectionHeader).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('hojaLive')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'hojaLive'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Vista Live Embebida</span>
            </button>

            <button
              onClick={() => setActiveTab('directrices')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'directrices'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Directrices & Reglas</span>
            </button>
          </div>
        </div>
      )}

      {/* When hideTopBar is true, provide clean sub-toggle between Tabla, Directrices, and Live Sheets */}
      {hideTopBar && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-2xs text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('tabla')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'tabla'
                  ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Catálogo de Productos ({rows.filter((r) => !r.isSectionHeader).length})</span>
            </button>
            <button
              type="button"
              id="btn-subtab-directrices-anexo1"
              onClick={() => setActiveTab('directrices')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'directrices'
                  ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Directrices & Reglas ({directrices.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hojaLive')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'hojaLive'
                  ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Live Sheets</span>
            </button>
          </div>
        </div>
      )}

      {/* Directrices Collapsible & Editable Banner */}
      {showDirectricesBanner && activeTab === 'tabla' && (
        !isEditingBanner ? (
          <div
            id="anexo1-banner-directrices"
            className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-2xl text-xs text-amber-900 shadow-2xs transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-amber-950 text-xs">
                      {bannerData.titulo}
                    </p>
                    {bannerSavedToast && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Guardado automáticamente
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-amber-800 leading-relaxed text-[11px] whitespace-pre-line">
                    {bannerData.descripcion}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  id="btn-editar-banner-directrices-anexo1"
                  onClick={() => {
                    setBannerEditTemp(bannerData);
                    setIsEditingBanner(true);
                  }}
                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-amber-300 shadow-2xs"
                  title="Editar texto de esta directriz"
                >
                  <Edit3 className="w-3 h-3 text-amber-800" />
                  <span>Editar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('directrices')}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100/70 text-amber-950 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer border border-amber-200"
                  title="Ver y editar todas las directrices"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Ver Reglas</span> ({directrices.length})
                </button>
                <button
                  type="button"
                  onClick={() => setShowDirectricesBanner(false)}
                  className="text-amber-700 hover:text-amber-950 font-bold p-1 rounded hover:bg-amber-100 text-xs shrink-0 cursor-pointer"
                  title="Ocultar aviso"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            id="anexo1-banner-directrices-editor"
            className="p-3.5 bg-amber-50/95 border-2 border-amber-400 rounded-2xl text-xs text-amber-950 shadow-xs space-y-2.5 transition-all"
          >
            <div className="flex items-center justify-between gap-2 border-b border-amber-200 pb-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-950 text-xs">
                <Edit3 className="w-4 h-4 text-amber-700" />
                <span>Editar Contenido de la Directriz (Guarda automáticamente)</span>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Auto-guardado activo
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-bold text-amber-900 mb-0.5">
                  Título de la Directriz:
                </label>
                <input
                  type="text"
                  value={bannerEditTemp.titulo}
                  onChange={(e) => {
                    const val = e.target.value;
                    const updated = { ...bannerEditTemp, titulo: val };
                    setBannerEditTemp(updated);
                    saveBannerData(updated);
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Título de la directriz..."
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-amber-900 mb-0.5">
                  Contenido y Reglas de la Directriz:
                </label>
                <textarea
                  value={bannerEditTemp.descripcion}
                  onChange={(e) => {
                    const val = e.target.value;
                    const updated = { ...bannerEditTemp, descripcion: val };
                    setBannerEditTemp(updated);
                    saveBannerData(updated);
                  }}
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed font-sans"
                  placeholder="Escribe el contenido detallado de la directriz..."
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  saveBannerData(DEFAULT_ANEXO1_BANNER);
                  setBannerEditTemp(DEFAULT_ANEXO1_BANNER);
                }}
                className="text-amber-800 hover:text-amber-950 text-[11px] font-semibold underline cursor-pointer"
              >
                Restablecer original
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    saveBannerData(bannerEditTemp);
                    setIsEditingBanner(false);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Listo / Guardar</span>
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {/* TAB 1: Live Iframe Embed from Google Sheets */}
      {activeTab === 'hojaLive' && (
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
          <div className="p-3 bg-slate-100/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800">
                Hoja de Cálculo Oficial en Vivo · Google Sheets
              </span>
              <span className="text-[11px] text-slate-500">
                (Facultad de Medicina - Anexo 1)
              </span>
            </div>

            <a
              href={ANEXO1_GOOGLE_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              Abrir pestaña completa <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative w-full h-[600px] bg-slate-100">
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              title="Google Sheets - Facultad de Medicina Anexo 1"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* TAB 2: Directrices & Technical Rules View (Fully Editable & Auto-saved) */}
      {activeTab === 'directrices' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Directrices y Reglas Obligatorias de Llenado · Anexo 1
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cumplimiento normativo para la vinculación automática con el aplicativo SIGPRO y validación de las 20 facultades.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {directricesSavedToast && (
                  <span className="text-[11px] text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-2xs animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Guardado automáticamente
                  </span>
                )}
                <button
                  type="button"
                  id="btn-agregar-directriz-anexo1"
                  onClick={handleAddDirectriz}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Directriz</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetDirectrices}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold transition-all border border-slate-200 cursor-pointer"
                  title="Restablecer directrices oficiales predeterminadas"
                >
                  Restablecer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {directrices.map((d, index) => {
                const isEditing = editingDirectrizIndex === index;

                if (isEditing) {
                  return (
                    <div
                      key={index}
                      className="p-4 bg-white rounded-xl border-2 border-emerald-500 shadow-md space-y-3 md:col-span-2"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                            Regla {index + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-700">Modo Edición</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Guarda mientras escribes
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingDirectrizIndex(null)}
                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Listo</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                            Título de la Regla:
                          </label>
                          <input
                            type="text"
                            value={d.titulo}
                            onChange={(e) => handleUpdateDirectriz(index, 'titulo', e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            placeholder="Ej. Regla Obligatoria: Formato de Código..."
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                            Descripción y Criterio Normativo:
                          </label>
                          <textarea
                            value={d.texto}
                            onChange={(e) => handleUpdateDirectriz(index, 'texto', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed font-sans"
                            placeholder="Describa la directriz obligatoria para el Anexo 1..."
                          />
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={index}
                    className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition-colors space-y-2 flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100 shrink-0">
                            Regla {index + 1}
                          </span>
                          <h4 className="font-bold text-xs text-slate-800 leading-snug">
                            {d.titulo}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingDirectrizIndex(index)}
                            className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                            title="Editar esta regla"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDirectriz(index)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            title="Eliminar esta regla"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">
                        {d.texto}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Inventario de Procesos · UNMSM</span>
                      <button
                        type="button"
                        onClick={() => setEditingDirectrizIndex(index)}
                        className="text-emerald-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> Editar contenido
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Complete Interactive Spreadsheet Table */}
      {activeTab === 'tabla' && (
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
          {/* Table Controls Bar */}
          <div className="p-3.5 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Search & Filter */}
            <div className="flex items-center gap-2 flex-wrap flex-1 min-w-[280px]">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar proceso, producto, código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-[11px]">
                <Filter className="w-3 h-3 text-slate-400 ml-1" />
                {['todos', 'PE', 'PM', 'Regulación', 'Servicio', 'Bien'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterType(f)}
                    className={`px-2 py-0.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      filterType === f
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {f === 'todos' ? 'Todos' : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddRow}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                title="Añadir una nueva fila de producto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Fila</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                title="Descargar datos en formato CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          {/* Spreadsheet Table Container */}
          <div className="overflow-x-auto max-h-[600px] select-text">
            <table className="w-full border-collapse text-left text-xs font-sans">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-[11px] sticky top-0 z-10 shadow-2xs">
                  <th className="py-2.5 px-3 border-r border-slate-200 w-12 text-center bg-slate-100">
                    #
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 min-w-[260px] bg-slate-100">
                    PRODUCTOS (Columna B)
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 min-w-[160px] bg-slate-100">
                    TIPO DE PRODUCTO (Columna C)
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 min-w-[220px] bg-slate-100">
                    ACCIÓN ESTRATÉGICA (Columna D)
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 min-w-[180px] bg-slate-100">
                    ACTIVIDAD OPERATIVA (Columna E)
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 min-w-[110px] bg-slate-100 text-center">
                    CLASIFICACIÓN
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 min-w-[100px] bg-slate-100 text-center">
                    ATRIBUTOS
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 min-w-[200px] bg-slate-100">
                    VARIABLES DE CALIDAD
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 min-w-[220px] bg-slate-100">
                    CRITERIOS DE VALIDACIÓN
                  </th>
                  <th className="py-2.5 px-2 text-center w-10 bg-slate-100">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRows.map((row, idx) => {
                  if (row.isSectionHeader) {
                    return (
                      <tr
                        key={row.id}
                        className="bg-slate-800 text-white font-bold tracking-wider uppercase text-[11px]"
                      >
                        <td colSpan={10} className="py-2 px-4">
                          <div className="flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5 text-sky-400" />
                            <span>{row.producto}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  if (row.isMacroproceso) {
                    return (
                      <tr
                        key={row.id}
                        className="bg-sky-50/90 text-sky-950 font-bold border-y-2 border-sky-200"
                      >
                        <td className="py-2 px-3 text-center border-r border-slate-200 font-mono text-[10px] text-sky-700">
                          {idx + 1}
                        </td>
                        <td colSpan={4} className="py-2 px-3 border-r border-slate-200 font-mono">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-sky-600 text-white text-[10px]">
                              Nivel 0
                            </span>
                            <span>{row.producto}</span>
                          </div>
                        </td>
                        <td colSpan={5} className="py-2 px-3 text-slate-500 italic text-[11px]">
                          {row.tipoProducto || 'Macroproceso Obligatorio UNMSM'}
                        </td>
                      </tr>
                    );
                  }

                  if (row.isSubproceso) {
                    return (
                      <tr
                        key={row.id}
                        className="bg-indigo-50/60 text-indigo-950 font-semibold border-y border-indigo-200"
                      >
                        <td className="py-2 px-3 text-center border-r border-slate-200 font-mono text-[10px] text-indigo-700">
                          {idx + 1}
                        </td>
                        <td colSpan={9} className="py-2 px-3">
                          <div className="flex items-center gap-2 pl-4">
                            <span className="px-2 py-0.5 rounded bg-indigo-200 text-indigo-900 text-[10px] font-mono">
                              Nivel 1
                            </span>
                            <span className="font-bold">{row.producto}</span>
                            {row.tipoProducto && (
                              <span className="text-xs text-slate-500 font-normal">
                                · {row.tipoProducto}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-sky-50/40 transition-colors group text-slate-800"
                    >
                      {/* Row Index */}
                      <td className="py-2 px-3 text-center border-r border-slate-200 font-mono text-[10px] text-slate-400 bg-slate-50/50">
                        {idx + 1}
                      </td>

                      {/* PRODUCTOS (Columna B) */}
                      <td className="py-2 px-3 border-r border-slate-200 font-medium">
                        <input
                          type="text"
                          value={row.producto}
                          onChange={(e) => handleCellEdit(row.id, 'producto', e.target.value)}
                          className="w-full bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent hover:border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors text-xs"
                        />
                      </td>

                      {/* TIPO DE PRODUCTO (Columna C) */}
                      <td className="py-2 px-3 border-r border-slate-200 text-[11px] text-slate-600">
                        <input
                          type="text"
                          value={row.tipoProducto || ''}
                          onChange={(e) => handleCellEdit(row.id, 'tipoProducto', e.target.value)}
                          placeholder="Final / Parcial"
                          className="w-full bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent hover:border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors text-[11px]"
                        />
                      </td>

                      {/* FUENTE - ACCIÓN ESTRATÉGICA (Columna D) */}
                      <td className="py-2 px-3 border-r border-slate-200 text-[11px] text-slate-600">
                        <textarea
                          rows={2}
                          value={row.fuenteAccionEstrategica || ''}
                          onChange={(e) =>
                            handleCellEdit(row.id, 'fuenteAccionEstrategica', e.target.value)
                          }
                          placeholder="AE..."
                          className="w-full bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent hover:border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors text-[11px] resize-none"
                        />
                      </td>

                      {/* ACTIVIDAD OPERATIVA (Columna E) */}
                      <td className="py-2 px-3 border-r border-slate-200 text-[11px] text-slate-600">
                        <input
                          type="text"
                          value={row.actividadOperativa || ''}
                          onChange={(e) =>
                            handleCellEdit(row.id, 'actividadOperativa', e.target.value)
                          }
                          placeholder="Actividad operativa"
                          className="w-full bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent hover:border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors text-[11px]"
                        />
                      </td>

                      {/* CLASIFICACIÓN (Columna F) */}
                      <td className="py-2 px-3 border-r border-slate-200 text-center">
                        <select
                          value={row.clasificacion || 'Servicio'}
                          onChange={(e) => handleCellEdit(row.id, 'clasificacion', e.target.value)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer ${
                            row.clasificacion === 'Regulación'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : row.clasificacion === 'Servicio'
                              ? 'bg-sky-50 text-sky-800 border-sky-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          <option value="Regulación">Regulación</option>
                          <option value="Servicio">Servicio</option>
                          <option value="Bien">Bien</option>
                        </select>
                      </td>

                      {/* ATRIBUTOS (Columna G) */}
                      <td className="py-2 px-3 border-r border-slate-200 text-center">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            row.atributos === 'Ente rector'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {row.atributos || 'Calidad'}
                        </span>
                      </td>

                      {/* VARIABLES DE CALIDAD (Columna H) */}
                      <td className="py-2 px-3 border-r border-slate-200 text-[11px] text-slate-600">
                        <input
                          type="text"
                          value={row.variablesCalidad || ''}
                          onChange={(e) =>
                            handleCellEdit(row.id, 'variablesCalidad', e.target.value)
                          }
                          placeholder="Variables de calidad"
                          className="w-full bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent hover:border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors text-[11px]"
                        />
                      </td>

                      {/* CRITERIOS DE VALIDACIÓN (Columna I) */}
                      <td className="py-2 px-3 border-r border-slate-200 text-[11px] text-slate-600">
                        <textarea
                          rows={2}
                          value={row.criteriosValidacion || ''}
                          onChange={(e) =>
                            handleCellEdit(row.id, 'criteriosValidacion', e.target.value)
                          }
                          placeholder="Criterios de validación"
                          className="w-full bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent hover:border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors text-[11px] resize-none"
                        />
                      </td>

                      {/* Row Delete Action */}
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => handleDeleteRow(row.id)}
                          className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Eliminar fila"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer Stats */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-3">
              <span>
                Mostrando <strong>{filteredRows.length}</strong> de {rows.length} registros
              </span>
              <span>·</span>
              <span>Conexión activa con SIGPRO UNMSM</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold">
                ✓ Estandarización PE / PM / PS verificada
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
