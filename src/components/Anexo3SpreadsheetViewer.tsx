import React, { useState, useEffect, useMemo } from 'react';
import {
  ExternalLink,
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  Info,
  ChevronRight,
  ShieldCheck,
  Layers,
  FileText,
  Copy,
  Check,
  Plus,
  Trash2,
  Users,
  Cpu,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Globe,
  Table as TableIcon,
  Edit3,
} from 'lucide-react';
import {
  ANEXO3_DIRECTRICES,
  ANEXO3_FICHAS,
  Anexo3FichaTecnica,
  Anexo3SipocRow,
  Anexo3Directriz,
} from '../data/anexo3MedicinaData';
import { ANEXO1_GOOGLE_SHEET_URL } from '../data/anexo1MedicinaData';

interface Anexo3BannerData {
  titulo: string;
  descripcion: string;
}

const DEFAULT_ANEXO3_BANNER: Anexo3BannerData = {
  titulo: 'Directriz Oficial SIGPRO · UNMSM - Anexo 3 (Fichas Técnicas):',
  descripcion:
    'Toda información colocada debe ir con fuente Calibri. Los Proveedores llevan la codificación PR.XX_F01 (Col B), las Entradas EN.XX_F01 (Col D), los Procesos Nivel 1 en celdas independientes (Col F), las Salidas corresponden a los productos finales del Anexo 1 (Col H), los Beneficiarios BE.XX_F01 (Col J) y en Registros únicamente los productos parciales identificados en el Anexo 1.',
};

interface Anexo3SpreadsheetViewerProps {
  onOpenFullEditor?: () => void;
  initialFichaCode?: string;
  hideTopBar?: boolean;
  activeTab?: 'fichas' | 'matrizSipoc' | 'directrices' | 'hojaLive';
  onTabChange?: (tab: 'fichas' | 'matrizSipoc' | 'directrices' | 'hojaLive') => void;
  hideSubBar?: boolean;
  customGoogleSheetUrl?: string;
}

export const Anexo3SpreadsheetViewer: React.FC<Anexo3SpreadsheetViewerProps> = ({
  initialFichaCode = 'PE.01_F01',
  hideTopBar = false,
  activeTab: controlledActiveTab,
  onTabChange,
  hideSubBar = false,
  customGoogleSheetUrl,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<
    'fichas' | 'matrizSipoc' | 'directrices' | 'hojaLive'
  >('fichas');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  const setActiveTab = (tab: 'fichas' | 'matrizSipoc' | 'directrices' | 'hojaLive') => {
    if (onTabChange) onTabChange(tab);
    setInternalActiveTab(tab);
  };
  const [selectedFichaCodigo, setSelectedFichaCodigo] = useState<string>(initialFichaCode);
  const [fichas, setFichas] = useState<Anexo3FichaTecnica[]>(ANEXO3_FICHAS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showDirectricesBanner, setShowDirectricesBanner] = useState<boolean>(true);

  // Listen for direct navigation into the Directrices y Reglas tab
  useEffect(() => {
    const handleOpenDirectrices = () => setActiveTab('directrices');
    window.addEventListener('unmsm_open_anexo3_directrices', handleOpenDirectrices);
    return () => window.removeEventListener('unmsm_open_anexo3_directrices', handleOpenDirectrices);
  }, []);

  // Banner directriz state & auto-save
  const [bannerData, setBannerData] = useState<Anexo3BannerData>(() => {
    try {
      const saved = localStorage.getItem('sigpro_anexo3_banner_data_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading anexo3 banner', e);
    }
    return DEFAULT_ANEXO3_BANNER;
  });
  const [isEditingBanner, setIsEditingBanner] = useState<boolean>(false);
  const [bannerEditTemp, setBannerEditTemp] = useState<Anexo3BannerData>(bannerData);
  const [bannerSavedToast, setBannerSavedToast] = useState<boolean>(false);

  const saveBannerData = (newData: Anexo3BannerData) => {
    setBannerData(newData);
    try {
      localStorage.setItem('sigpro_anexo3_banner_data_v2', JSON.stringify(newData));
      setBannerSavedToast(true);
      setTimeout(() => setBannerSavedToast(false), 2500);
    } catch (e) {
      console.error('Error saving anexo3 banner', e);
    }
  };

  // Directrices list state & auto-save
  const [directrices, setDirectrices] = useState<Anexo3Directriz[]>(() => {
    try {
      const saved = localStorage.getItem('sigpro_anexo3_directrices_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading anexo3 directrices', e);
    }
    return ANEXO3_DIRECTRICES;
  });
  const [editingDirectrizId, setEditingDirectrizId] = useState<number | null>(null);
  const [directricesSavedToast, setDirectricesSavedToast] = useState<boolean>(false);

  const saveDirectrices = (newDirectrices: Anexo3Directriz[]) => {
    setDirectrices(newDirectrices);
    try {
      localStorage.setItem('sigpro_anexo3_directrices_v2', JSON.stringify(newDirectrices));
      setDirectricesSavedToast(true);
      setTimeout(() => setDirectricesSavedToast(false), 2200);
    } catch (e) {
      console.error('Error saving anexo3 directrices', e);
    }
  };

  const handleUpdateDirectriz = (numero: number, field: keyof Anexo3Directriz, value: any) => {
    const updated = directrices.map((d) => (d.numero === numero ? { ...d, [field]: value } : d));
    saveDirectrices(updated);
  };

  const handleAddDirectriz = () => {
    const nextNum = directrices.length > 0 ? Math.max(...directrices.map((d) => d.numero)) + 1 : 1;
    const newRule: Anexo3Directriz = {
      numero: nextNum,
      regla: `Regla Obligatoria: Nueva Directriz N° ${nextNum}`,
      descripcion: 'Especifique la directriz o criterio técnico de estandarización para el llenado del Anexo 3.',
      ejemplos: ['Ejemplo de codificación o valor esperado'],
    };
    const updated = [...directrices, newRule];
    saveDirectrices(updated);
    setEditingDirectrizId(nextNum);
  };

  const handleDeleteDirectriz = (numero: number) => {
    const updated = directrices.filter((d) => d.numero !== numero);
    saveDirectrices(updated);
    if (editingDirectrizId === numero) {
      setEditingDirectrizId(null);
    }
  };

  const handleResetDirectrices = () => {
    saveDirectrices(ANEXO3_DIRECTRICES);
    setEditingDirectrizId(null);
  };

  const handleAddEjemplo = (numero: number) => {
    const updated = directrices.map((d) => {
      if (d.numero === numero) {
        return {
          ...d,
          ejemplos: [...(d.ejemplos || []), 'Nuevo ejemplo oficial'],
        };
      }
      return d;
    });
    saveDirectrices(updated);
  };

  const handleUpdateEjemplo = (numero: number, index: number, value: string) => {
    const updated = directrices.map((d) => {
      if (d.numero === numero && d.ejemplos) {
        const nextEj = [...d.ejemplos];
        nextEj[index] = value;
        return { ...d, ejemplos: nextEj };
      }
      return d;
    });
    saveDirectrices(updated);
  };

  const handleDeleteEjemplo = (numero: number, index: number) => {
    const updated = directrices.map((d) => {
      if (d.numero === numero && d.ejemplos) {
        const nextEj = d.ejemplos.filter((_, i) => i !== index);
        return { ...d, ejemplos: nextEj };
      }
      return d;
    });
    saveDirectrices(updated);
  };

  // Current active ficha
  const activeFicha = useMemo(() => {
    return (
      fichas.find((f) => f.codigo === selectedFichaCodigo) ||
      fichas[0]
    );
  }, [fichas, selectedFichaCodigo]);

  // Filtered fichas list for sidebar/dropdown
  const filteredFichas = useMemo(() => {
    return fichas.filter((f) => {
      const matchesSearch =
        searchTerm === '' ||
        f.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.responsable.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filterTipo === 'todos') return true;
      if (filterTipo === 'ESTRATÉGICO') return f.tipo === 'ESTRATÉGICO';
      if (filterTipo === 'MISIONAL') return f.tipo === 'MISIONAL';
      if (filterTipo === 'SOPORTE') return f.tipo === 'SOPORTE';

      return true;
    });
  }, [fichas, searchTerm, filterTipo]);

  // Flattened SIPOC rows across all fichas for the full matrix view
  const allSipocRows = useMemo(() => {
    const list: { fichaCodigo: string; fichaNombre: string; tipo: string; row: Anexo3SipocRow }[] = [];
    fichas.forEach((f) => {
      f.sipoc.forEach((s) => {
        list.push({
          fichaCodigo: f.codigo,
          fichaNombre: f.nombre,
          tipo: f.tipo,
          row: s,
        });
      });
    });
    return list;
  }, [fichas]);

  const filteredSipocRows = useMemo(() => {
    return allSipocRows.filter((item) => {
      const s = item.row;
      const matchesSearch =
        searchTerm === '' ||
        item.fichaCodigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fichaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.proveedorNombre && s.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.entradaNombre && s.entradaNombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.procesoNombre && s.procesoNombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.salidaNombre && s.salidaNombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.beneficiarioNombre && s.beneficiarioNombre.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;
      if (filterTipo === 'todos') return true;
      return item.tipo === filterTipo;
    });
  }, [allSipocRows, searchTerm, filterTipo]);

  const handleCopySheetLink = () => {
    navigator.clipboard.writeText(ANEXO1_GOOGLE_SHEET_URL);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportCSV = () => {
    const lines: string[] = [];
    lines.push('FACULTAD DE MEDICINA - ANEXO 3: FICHAS TÉCNICAS DE PRODUCTO Y PROCESO');
    lines.push('');
    lines.push('DIRECTRICES');
    ANEXO3_DIRECTRICES.forEach((d) => {
      lines.push(`"${d.numero}. ${d.regla}: ${d.descripcion}"`);
    });
    lines.push('');
    lines.push('CÓDIGO,PROCESO,TIPO,RESPONSABLE,VINCULACIÓN,OBJETIVO,PROVEEDOR (Col B),ENTRADA (Col D),PROCESO (Col F),SALIDA (Col H),BENEFICIARIOS (Col J),INDICADORES');

    fichas.forEach((f) => {
      if (f.sipoc.length === 0) {
        lines.push(
          `"${f.codigo}","${f.nombre}","${f.tipo}","${f.responsable}","${f.vinculacion}","${f.objetivo.replace(/"/g, '""')}","","","","","","${(f.indicadores || '').replace(/"/g, '""')}"`
        );
      } else {
        f.sipoc.forEach((s) => {
          lines.push(
            `"${f.codigo}","${f.nombre}","${f.tipo}","${f.responsable}","${f.vinculacion}","${f.objetivo.replace(/"/g, '""')}","${s.proveedorCodigo || ''} ${s.proveedorNombre || ''}","${s.entradaCodigo || ''} ${s.entradaNombre || ''}","${s.procesoCodigo || ''} ${s.procesoNombre || ''}","${(s.salidaNombre || '').replace(/"/g, '""')}","${(s.beneficiarioNombre || '').replace(/"/g, '""')}","${(f.indicadores || '').replace(/"/g, '""')}"`
          );
        });
      }
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Facultad_Medicina_Anexo_3_Fichas_Tecnicas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const embedUrl =
    'https://docs.google.com/spreadsheets/d/1IdbcV-JwsslkBdM2xmDqpEFNbGGePwOmS7UgjFEEU_Q/preview';

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* Top Bar with Prominent Redirection Button on the TOP-LEFT */}
      {!hideTopBar && (
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-2xl border border-emerald-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          {/* PARTE SUPERIOR IZQUIERDA: REDIRECCIÓN A LA HOJA DE CÁLCULO */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={ANEXO1_GOOGLE_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              id="btn-redireccion-hoja-calculo-anexo3"
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

            <span className="text-[11px] font-bold text-sky-800 bg-sky-100/70 border border-sky-200 px-2.5 py-1 rounded-lg">
              Facultad de Medicina · Anexo 3 (Fichas Técnicas)
            </span>
          </div>

          {/* View Mode Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-white/90 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('fichas')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'fichas'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Fichas Técnicas ({fichas.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('matrizSipoc')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'matrizSipoc'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Matriz SIPOC</span>
            </button>

            <button
              onClick={() => setActiveTab('directrices')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'directrices'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>7 Reglas Obligatorias</span>
            </button>

            <button
              onClick={() => setActiveTab('hojaLive')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'hojaLive'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Live Sheets</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              title="Exportar Anexo 3 en formato CSV"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* When hideTopBar is true and hideSubBar is false, provide clean sub-toggle between Fichas, Matriz SIPOC, and Directrices */}
      {hideTopBar && !hideSubBar && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-2xs text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('fichas')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'fichas'
                  ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Fichas Técnicas ({fichas.length} Procesos)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('matrizSipoc')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'matrizSipoc'
                  ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Matriz SIPOC Completa ({allSipocRows.length} Filas)</span>
            </button>
            <button
              type="button"
              id="btn-subtab-directrices-anexo3"
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
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs font-semibold"
            title="Exportar Anexo 3 en formato CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar CSV</span>
          </button>
        </div>
      )}

      {/* Directrices Collapsible & Editable Banner */}
      {showDirectricesBanner && (
        !isEditingBanner ? (
          <div
            id="anexo3-banner-directrices"
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
                  id="btn-editar-banner-directrices-anexo3"
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
                  title="Ver y editar todas las directrices detalladas"
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
            id="anexo3-banner-directrices-editor"
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
                  saveBannerData(DEFAULT_ANEXO3_BANNER);
                  setBannerEditTemp(DEFAULT_ANEXO3_BANNER);
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

      {/* TAB 1: FICHAS TÉCNICAS (Vista individual de cada uno de los 16 procesos) */}
      {activeTab === 'fichas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Sidebar with Process List */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-3 space-y-3 shadow-2xs">
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar ficha o responsable..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 flex-wrap text-[11px]">
                {['todos', 'ESTRATÉGICO', 'MISIONAL', 'SOPORTE'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterTipo(t)}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                      filterTipo === t
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t === 'todos' ? 'Todos' : t.slice(0, 4)}
                  </button>
                ))}
              </div>
            </div>

            {/* List of 16 Fichas */}
            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1 select-text">
              {filteredFichas.map((ficha) => {
                const isSelected = ficha.codigo === activeFicha.codigo;
                return (
                  <button
                    key={ficha.codigo}
                    onClick={() => setSelectedFichaCodigo(ficha.codigo)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-300 ring-1 ring-emerald-400/40 text-emerald-950 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/70 text-slate-700'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            ficha.tipo === 'ESTRATÉGICO'
                              ? 'bg-purple-100 text-purple-800'
                              : ficha.tipo === 'MISIONAL'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          {ficha.codigo}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {ficha.tipo}
                        </span>
                      </div>
                      <p className="font-bold text-xs truncate leading-snug">{ficha.nombre}</p>
                      <p className="text-[10px] text-slate-500 truncate">{ficha.responsable}</p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 mt-2 transition-transform ${
                        isSelected ? 'text-emerald-700 translate-x-0.5' : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Ficha Detail View */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4 max-h-[700px] overflow-y-auto select-text">
            {/* Ficha Header Table */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-800 text-white p-2.5 px-4 font-bold text-xs flex items-center justify-between">
                <span>FICHA TÉCNICA DE PRODUCTO Y PROCESO · FACULTAD DE MEDICINA</span>
                <span className="font-mono text-[11px] bg-emerald-600 px-2 py-0.5 rounded text-white font-bold">
                  {activeFicha.codigo}
                </span>
              </div>

              <table className="w-full text-xs border-collapse font-sans">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="w-28 font-bold bg-slate-100 p-2 border-r border-slate-200 text-slate-700">
                      NOMBRE
                    </td>
                    <td className="p-2 font-bold text-slate-900 border-r border-slate-200">
                      {activeFicha.nombre}
                    </td>
                    <td className="w-20 font-bold bg-slate-100 p-2 border-r border-slate-200 text-slate-700">
                      CÓDIGO
                    </td>
                    <td className="p-2 font-mono font-bold text-emerald-800">
                      {activeFicha.codigo}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="font-bold bg-slate-100 p-2 border-r border-slate-200 text-slate-700">
                      RESPONSABLE
                    </td>
                    <td className="p-2 text-slate-800 border-r border-slate-200">
                      {activeFicha.responsable}
                    </td>
                    <td className="font-bold bg-slate-100 p-2 border-r border-slate-200 text-slate-700">
                      TIPO
                    </td>
                    <td className="p-2 font-semibold">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          activeFicha.tipo === 'ESTRATÉGICO'
                            ? 'bg-purple-100 text-purple-800'
                            : activeFicha.tipo === 'MISIONAL'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {activeFicha.tipo}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="font-bold bg-slate-100 p-2 border-r border-slate-200 text-slate-700">
                      ALCANCE
                    </td>
                    <td className="p-2 text-slate-700 border-r border-slate-200 text-[11px] leading-relaxed">
                      {activeFicha.alcance ||
                        'LO ESTABLECIDO EN LA PRESENTE FICHA COMPRENDE A TODAS LAS UNIDADES DE ORGANIZACIÓN DE LA FM DE LA UNMSM.'}
                    </td>
                    <td className="font-bold bg-slate-100 p-2 border-r border-slate-200 text-slate-700">
                      VERSIÓN
                    </td>
                    <td className="p-2 font-mono font-bold text-slate-800">
                      {activeFicha.version}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="font-bold bg-slate-100 p-2 border-r border-slate-200 text-slate-700">
                      VINCULACIÓN
                    </td>
                    <td colSpan={3} className="p-2 font-semibold text-slate-800 bg-sky-50/50">
                      {activeFicha.vinculacion}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold bg-slate-100 p-2 border-r border-slate-200 text-slate-700">
                      OBJETIVO
                    </td>
                    <td colSpan={3} className="p-2 text-slate-800 leading-relaxed text-[11px]">
                      {activeFicha.objetivo}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SIPOC Table for this Ficha */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-100 p-2 px-3 border-b border-slate-200 font-bold text-xs text-slate-800 flex items-center justify-between">
                <span>DESCRIPCIÓN DEL PROCESO (MATRIZ SIPOC)</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  Columnas B, D, F, H y J estandarizadas
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                      <th className="py-2 px-3 border-r border-slate-200 min-w-[160px] text-left">
                        PROVEEDORES (Col B)
                      </th>
                      <th className="py-2 px-3 border-r border-slate-200 min-w-[180px] text-left">
                        ENTRADAS (Col D)
                      </th>
                      <th className="py-2 px-3 border-r border-slate-200 min-w-[150px] text-left">
                        PROCESO (Col F)
                      </th>
                      <th className="py-2 px-3 border-r border-slate-200 min-w-[170px] text-left">
                        SALIDAS (Col H)
                      </th>
                      <th className="py-2 px-3 min-w-[160px] text-left">
                        BENEFICIARIOS (Col J)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activeFicha.sipoc.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-slate-400 italic">
                          Ficha técnica formal en proceso de actualización de matriz SIPOC por la comisión FM
                        </td>
                      </tr>
                    ) : (
                      activeFicha.sipoc.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors align-top">
                          {/* Proveedor */}
                          <td className="py-2 px-3 border-r border-slate-200 text-[11px]">
                            {s.proveedorCodigo && (
                              <span className="font-mono font-bold text-emerald-800 block text-[10px]">
                                {s.proveedorCodigo}
                              </span>
                            )}
                            <span className="text-slate-800">{s.proveedorNombre || '—'}</span>
                          </td>

                          {/* Entrada */}
                          <td className="py-2 px-3 border-r border-slate-200 text-[11px]">
                            {s.entradaCodigo && (
                              <span className="font-mono font-bold text-sky-800 block text-[10px]">
                                {s.entradaCodigo}
                              </span>
                            )}
                            <span className="text-slate-800">{s.entradaNombre || '—'}</span>
                          </td>

                          {/* Proceso */}
                          <td className="py-2 px-3 border-r border-slate-200 text-[11px] font-semibold text-slate-900 bg-slate-50/40">
                            {s.procesoCodigo && (
                              <span className="font-mono font-bold text-slate-700 block text-[10px]">
                                {s.procesoCodigo}
                              </span>
                            )}
                            <span>{s.procesoNombre || '—'}</span>
                          </td>

                          {/* Salida */}
                          <td className="py-2 px-3 border-r border-slate-200 text-[11px] whitespace-pre-line text-emerald-950">
                            {s.salidaCodigo && (
                              <span className="font-mono font-bold text-emerald-700 block text-[10px]">
                                {s.salidaCodigo}
                              </span>
                            )}
                            <span className="font-medium">{s.salidaNombre || '—'}</span>
                          </td>

                          {/* Beneficiarios */}
                          <td className="py-2 px-3 text-[11px] whitespace-pre-line text-slate-700">
                            {s.beneficiarioCodigo && (
                              <span className="font-mono font-bold text-indigo-700 block text-[10px]">
                                {s.beneficiarioCodigo}
                              </span>
                            )}
                            <span>{s.beneficiarioNombre || '—'}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ejecución del Proceso: Recursos, Registros, Indicadores, Riesgos, Controles */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-100 p-2 px-3 border-b border-slate-200 font-bold text-xs text-slate-800">
                EJECUCIÓN DEL PROCESO
              </div>

              <div className="p-3 bg-slate-50/50 space-y-3 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Recursos */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      Recursos Humanos & Físicos
                    </h5>
                    <div className="text-[11px] text-slate-700 space-y-1 whitespace-pre-line leading-relaxed">
                      <p>
                        <strong>Humanos:</strong>{' '}
                        {activeFicha.recursos?.humanos || 'Personal directivo y administrativo FM'}
                      </p>
                      <p>
                        <strong>Físicos:</strong>{' '}
                        {activeFicha.recursos?.fisicos || 'Oficinas y ambientes institucionales equipados'}
                      </p>
                    </div>
                  </div>

                  {/* Tecnología & Sistemas */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <Cpu className="w-3.5 h-3.5 text-sky-600" />
                      Equipos y Sistemas Informáticos
                    </h5>
                    <div className="text-[11px] text-slate-700 space-y-1 whitespace-pre-line leading-relaxed">
                      <p>
                        <strong>Equipos:</strong>{' '}
                        {activeFicha.recursos?.equiposTecnologicos ||
                          '• Computadora • Impresora • Escáner'}
                      </p>
                      <p>
                        <strong>Sistemas:</strong>{' '}
                        {activeFicha.recursos?.sistemasInformaticos ||
                          'Sistema Quipucamayoc, SUM, Correo Institucional'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Registros */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                    <h5 className="font-bold text-slate-900 flex items-center gap-1 text-[11px]">
                      <FileText className="w-3 h-3 text-indigo-600" />
                      Registros (Productos Parciales)
                    </h5>
                    <p className="text-[11px] text-slate-700 whitespace-pre-line">
                      {activeFicha.registros || 'Conforme a los productos parciales del Anexo 1'}
                    </p>
                  </div>

                  {/* Riesgos y Controles */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                    <h5 className="font-bold text-slate-900 flex items-center gap-1 text-[11px]">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      Riesgos y Controles
                    </h5>
                    <p className="text-[11px] text-slate-700 whitespace-pre-line">
                      {activeFicha.riesgos || 'Modificaciones normativas, reducción presupuestal'}
                    </p>
                    <p className="text-[11px] text-emerald-800 font-semibold pt-1 border-t border-slate-100">
                      Control: {activeFicha.controles || 'Resultados de indicadores de desempeño'}
                    </p>
                  </div>

                  {/* Indicadores */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                    <h5 className="font-bold text-slate-900 flex items-center gap-1 text-[11px]">
                      <Activity className="w-3 h-3 text-rose-600" />
                      Indicadores de Desempeño
                    </h5>
                    <p className="text-[11px] text-slate-700 whitespace-pre-line font-medium">
                      {activeFicha.indicadores || 'Cumplimiento de objetivos estratégicos'}
                    </p>
                  </div>
                </div>

                {/* Formalización */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-bold text-slate-700">FORMALIZACIÓN DEL PROCESO:</span>
                    <span>Elaboración: Comité de Procesos FM</span>
                    <span>·</span>
                    <span>Revisión: OGPL / OGP</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold">Validado para SIGPRO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MATRIZ SIPOC COMPLETA */}
      {activeTab === 'matrizSipoc' && (
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar proveedor, entrada, salida..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-[11px]">
                {['todos', 'ESTRATÉGICO', 'MISIONAL', 'SOPORTE'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterTipo(t)}
                    className={`px-2 py-0.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      filterTipo === t
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t === 'todos' ? 'Todos' : t}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-500">
              Registros SIPOC: <strong>{filteredSipocRows.length}</strong>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[600px] select-text">
            <table className="w-full text-xs border-collapse text-left font-sans">
              <thead className="bg-slate-100 sticky top-0 z-10 border-b border-slate-300 text-slate-700">
                <tr>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-28">PROCESO</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 min-w-[180px]">PROVEEDORES (Col B)</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 min-w-[200px]">ENTRADAS (Col D)</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 min-w-[170px]">PROCESO NIVEL 1 (Col F)</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 min-w-[200px]">SALIDAS (Col H)</th>
                  <th className="py-2.5 px-3 min-w-[180px]">BENEFICIARIOS (Col J)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredSipocRows.map((item, idx) => (
                  <tr key={idx} className="hover:bg-sky-50/40 transition-colors align-top">
                    <td className="py-2 px-3 border-r border-slate-200 bg-slate-50/50">
                      <span className="font-mono font-bold text-slate-800 text-[10px] block">
                        {item.fichaCodigo}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {item.fichaNombre}
                      </span>
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-[11px]">
                      {item.row.proveedorCodigo && (
                        <span className="font-mono font-bold text-emerald-800 block text-[10px]">
                          {item.row.proveedorCodigo}
                        </span>
                      )}
                      <span>{item.row.proveedorNombre || '—'}</span>
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-[11px]">
                      {item.row.entradaCodigo && (
                        <span className="font-mono font-bold text-sky-800 block text-[10px]">
                          {item.row.entradaCodigo}
                        </span>
                      )}
                      <span>{item.row.entradaNombre || '—'}</span>
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-[11px] font-semibold text-slate-900 bg-slate-50/30">
                      {item.row.procesoCodigo && (
                        <span className="font-mono font-bold text-slate-700 block text-[10px]">
                          {item.row.procesoCodigo}
                        </span>
                      )}
                      <span>{item.row.procesoNombre || '—'}</span>
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-[11px] whitespace-pre-line text-emerald-950 font-medium">
                      {item.row.salidaCodigo && (
                        <span className="font-mono font-bold text-emerald-700 block text-[10px]">
                          {item.row.salidaCodigo}
                        </span>
                      )}
                      <span>{item.row.salidaNombre || '—'}</span>
                    </td>
                    <td className="py-2 px-3 text-[11px] whitespace-pre-line text-slate-700">
                      {item.row.beneficiarioCodigo && (
                        <span className="font-mono font-bold text-indigo-700 block text-[10px]">
                          {item.row.beneficiarioCodigo}
                        </span>
                      )}
                      <span>{item.row.beneficiarioNombre || '—'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REGLAS Y DIRECTRICES OFICIALES TOTALMENTE EDITABLES */}
      {activeTab === 'directrices' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Directrices y Reglas Oficiales de Llenado · Anexo 3
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Estandarización obligatoria para la vinculación con SIGPRO y consistencia con el Anexo 1.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {directricesSavedToast && (
                  <span className="text-[11px] text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-2xs animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Guardado automático
                  </span>
                )}
                <button
                  type="button"
                  id="btn-agregar-directriz-anexo3"
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
                  title="Restablecer a las 7 reglas oficiales predeterminadas"
                >
                  Restablecer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {directrices.map((d) => {
                const isEditing = editingDirectrizId === d.numero;

                if (isEditing) {
                  return (
                    <div
                      key={d.numero}
                      className="p-4 bg-white rounded-xl border-2 border-emerald-500 shadow-md space-y-3 md:col-span-2"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                            Regla {d.numero}
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
                            onClick={() => setEditingDirectrizId(null)}
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
                            value={d.regla}
                            onChange={(e) => handleUpdateDirectriz(d.numero, 'regla', e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            placeholder="Ej. Regla Obligatoria: Fuente Tipográfica..."
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                            Descripción y Criterio Técnico:
                          </label>
                          <textarea
                            value={d.descripcion}
                            onChange={(e) => handleUpdateDirectriz(d.numero, 'descripcion', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                            placeholder="Describa la directriz obligatoria..."
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-slate-700">
                              Ejemplos oficiales de codificación / llenado:
                            </label>
                            <button
                              type="button"
                              onClick={() => handleAddEjemplo(d.numero)}
                              className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded cursor-pointer"
                            >
                              <Plus className="w-3 h-3" /> Agregar ejemplo
                            </button>
                          </div>

                          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                            {(d.ejemplos || []).map((ej, idx) => (
                              <div key={idx} className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={ej}
                                  onChange={(e) => handleUpdateEjemplo(d.numero, idx, e.target.value)}
                                  className="flex-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded font-mono text-[11px] text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleDeleteEjemplo(d.numero, idx)}
                                  className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                                  title="Eliminar ejemplo"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={d.numero}
                    className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition-colors space-y-2 flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md shrink-0">
                            Regla {d.numero}
                          </span>
                          <h4 className="font-bold text-xs text-slate-800 leading-snug">
                            {d.regla}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingDirectrizId(d.numero)}
                            className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                            title="Editar esta regla"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDirectriz(d.numero)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            title="Eliminar esta regla"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">
                        {d.descripcion}
                      </p>

                      {d.ejemplos && d.ejemplos.length > 0 && (
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono text-[10px] text-slate-700 space-y-1">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block font-sans">
                            Ejemplos oficiales:
                          </span>
                          {d.ejemplos.map((ej, i) => (
                            <div key={i} className="truncate text-slate-800">
                              • {ej}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Facultad de Medicina · UNMSM</span>
                      <button
                        type="button"
                        onClick={() => setEditingDirectrizId(d.numero)}
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

      {/* TAB 4: LIVE GOOGLE SHEETS EMBED */}
      {activeTab === 'hojaLive' && (
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
          <div className="p-3 bg-slate-100/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800">
                Google Sheets en Vivo · Facultad de Medicina Anexo 1 y Anexo 3
              </span>
            </div>

            <a
              href={ANEXO1_GOOGLE_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              Abrir en pestaña nueva <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative w-full h-[600px] bg-slate-100">
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              title="Google Sheets - Facultad de Medicina"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};
