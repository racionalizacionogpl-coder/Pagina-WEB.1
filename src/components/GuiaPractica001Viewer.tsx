import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  GUIA_PRACTICA_001_DATA,
  GuiaPractica001Data,
  GuiaSeccion,
} from '../data/guiaPractica001Data';
import {
  BookOpen,
  Edit3,
  Save,
  RotateCcw,
  Globe,
  Lock,
  ExternalLink,
  Copy,
  Check,
  Search,
  Plus,
  Trash2,
  FileSpreadsheet,
  FileText,
  Layers,
  Sparkles,
  ShieldCheck,
  Download,
  Printer,
  ChevronRight,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface GuiaPractica001ViewerProps {
  onOpenFullEditor?: () => void;
}

const STORAGE_KEY_GUIA = 'unmsm_gxp_guia001_custom';
const STORAGE_KEY_PUBLIC = 'unmsm_gxp_guia001_is_public';

export const GuiaPractica001Viewer: React.FC<GuiaPractica001ViewerProps> = () => {
  // Data state with localStorage persistence
  const [data, setData] = useState<GuiaPractica001Data>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GUIA);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading custom guia 001', e);
    }
    return GUIA_PRACTICA_001_DATA;
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
        localStorage.setItem(STORAGE_KEY_GUIA, JSON.stringify(data));
      } catch (e) {
        console.error('Error auto-saving guia 001', e);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [data]);
  const [activeSectionId, setActiveSectionId] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toggle Public / Private
  const handleTogglePublic = () => {
    const nextVal = !isPublic;
    setIsPublic(nextVal);
    localStorage.setItem(STORAGE_KEY_PUBLIC, String(nextVal));
  };

  // Copy link
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Save changes to localStorage
  const handleSaveData = () => {
    localStorage.setItem(STORAGE_KEY_GUIA, JSON.stringify(data));
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Reset to original extracted data
  const handleResetData = () => {
    if (window.confirm('¿Deseas restablecer la guía completa al contenido original extraído del PDF?')) {
      setData(GUIA_PRACTICA_001_DATA);
      localStorage.removeItem(STORAGE_KEY_GUIA);
      setIsEditing(false);
    }
  };

  // Edit Header / Meta
  const handleMetaChange = (field: keyof GuiaPractica001Data, value: any) => {
    setData({ ...data, [field]: value });
  };

  // Edit section title / subtitle
  const handleSectionTitleChange = (secIdx: number, field: 'titulo' | 'subtitulo' | 'capitulo', value: string) => {
    const updatedSecs = [...data.secciones];
    updatedSecs[secIdx] = { ...updatedSecs[secIdx], [field]: value };
    setData({ ...data, secciones: updatedSecs });
  };

  // Edit block title
  const handleBlockTitleChange = (secIdx: number, blockIdx: number, value: string) => {
    const updatedSecs = [...data.secciones];
    const sec = updatedSecs[secIdx];
    const updatedBlocks = [...sec.contenido];
    updatedBlocks[blockIdx] = { ...updatedBlocks[blockIdx], tituloBloque: value };
    sec.contenido = updatedBlocks;
    setData({ ...data, secciones: updatedSecs });
  };

  // Edit paragraph
  const handleParagraphChange = (secIdx: number, blockIdx: number, pIdx: number, value: string) => {
    const updatedSecs = [...data.secciones];
    const sec = updatedSecs[secIdx];
    const block = { ...sec.contenido[blockIdx] };
    const parrafos = [...(block.parrafos || [])];
    parrafos[pIdx] = value;
    block.parrafos = parrafos;
    sec.contenido[blockIdx] = block;
    setData({ ...data, secciones: updatedSecs });
  };

  // Add paragraph
  const handleAddParagraph = (secIdx: number, blockIdx: number) => {
    const updatedSecs = [...data.secciones];
    const sec = updatedSecs[secIdx];
    const block = { ...sec.contenido[blockIdx] };
    block.parrafos = [...(block.parrafos || []), 'Nuevo párrafo redactado...'];
    sec.contenido[blockIdx] = block;
    setData({ ...data, secciones: updatedSecs });
  };

  // Remove paragraph
  const handleRemoveParagraph = (secIdx: number, blockIdx: number, pIdx: number) => {
    const updatedSecs = [...data.secciones];
    const sec = updatedSecs[secIdx];
    const block = { ...sec.contenido[blockIdx] };
    block.parrafos = (block.parrafos || []).filter((_, i) => i !== pIdx);
    sec.contenido[blockIdx] = block;
    const updatedData = { ...data, secciones: updatedSecs };
    setData(updatedData);
    try {
      localStorage.setItem(STORAGE_KEY_GUIA, JSON.stringify(updatedData));
    } catch (e) {
      console.error('Error saving guia paragraph removal', e);
    }
  };

  // Edit list item
  const handleListItemChange = (secIdx: number, blockIdx: number, itemIdx: number, value: string) => {
    const updatedSecs = [...data.secciones];
    const sec = updatedSecs[secIdx];
    const block = { ...sec.contenido[blockIdx] };
    const items = [...(block.itemsLista || [])];
    items[itemIdx] = value;
    block.itemsLista = items;
    sec.contenido[blockIdx] = block;
    setData({ ...data, secciones: updatedSecs });
  };

  // Edit Leo callout
  const handleLeoMessageChange = (secIdx: number, blockIdx: number, value: string) => {
    const updatedSecs = [...data.secciones];
    const sec = updatedSecs[secIdx];
    const block = { ...sec.contenido[blockIdx] };
    block.mensajeLeo = value;
    sec.contenido[blockIdx] = block;
    setData({ ...data, secciones: updatedSecs });
  };

  // Edit table cell
  const handleTableCellChange = (secIdx: number, blockIdx: number, rowIdx: number, colIdx: number, value: string) => {
    const updatedSecs = [...data.secciones];
    const sec = updatedSecs[secIdx];
    const block = { ...sec.contenido[blockIdx] };
    const filas = [...(block.filasTabla || [])];
    const fila = [...filas[rowIdx]];
    fila[colIdx] = value;
    filas[rowIdx] = fila;
    block.filasTabla = filas;
    sec.contenido[blockIdx] = block;
    setData({ ...data, secciones: updatedSecs });
  };

  // Edit external link
  const handleLinkChange = (secIdx: number, blockIdx: number, field: 'texto' | 'url', value: string) => {
    const updatedSecs = [...data.secciones];
    const sec = updatedSecs[secIdx];
    const block = { ...sec.contenido[blockIdx] };
    if (block.enlaceExterno) {
      block.enlaceExterno = { ...block.enlaceExterno, [field]: value };
      sec.contenido[blockIdx] = block;
      setData({ ...data, secciones: updatedSecs });
    }
  };

  // Filter sections by search or active tab
  const displayedSections = useMemo(() => {
    return data.secciones.filter((sec) => {
      if (activeSectionId !== 'todas' && sec.id !== activeSectionId) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = sec.titulo.toLowerCase().includes(q);
        const inCap = sec.capitulo.toLowerCase().includes(q);
        const inContent = sec.contenido.some((c) =>
          (c.tituloBloque || '').toLowerCase().includes(q) ||
          (c.parrafos || []).some((p) => p.toLowerCase().includes(q)) ||
          (c.itemsLista || []).some((item) => item.toLowerCase().includes(q)) ||
          (c.mensajeLeo || '').toLowerCase().includes(q)
        );
        return inTitle || inCap || inContent;
      }
      return true;
    });
  }, [data.secciones, activeSectionId, searchQuery]);

  return (
    <div className="space-y-6 pb-12 font-sans" id="guia-001-viewer-root">
      {/* 1. Header Banner institucional - Paleta Navy Oficial, Acento Dorado, Azul Acero */}
      <div className="banner-navy-gradient text-white rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden border-b-2 border-b-[#b8933f]/40">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          {/* Top Badges Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="btn-banner-neutral inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-white/80" />
              {isEditing ? (
                <input
                  type="text"
                  value={data.codigo}
                  onChange={(e) => handleMetaChange('codigo', e.target.value)}
                  className="bg-white/10 border border-white/20 rounded px-1.5 text-xs text-white"
                />
              ) : (
                <span>{data.codigo} · Normativa & Guía</span>
              )}
            </span>

            <span className="btn-banner-neutral text-xs px-2.5 py-1 rounded-lg font-medium text-white/80">
              64 Páginas Oficiales
            </span>

            <button
              onClick={handleTogglePublic}
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
          </div>

          {/* Main Row: Title & Action Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-2 my-1">
                  <input
                    type="text"
                    value={data.titulo}
                    onChange={(e) => handleMetaChange('titulo', e.target.value)}
                    className="w-full text-2xl lg:text-3xl font-bold bg-white/10 border border-amber-400/60 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    type="text"
                    value={data.subtitulo}
                    onChange={(e) => handleMetaChange('subtitulo', e.target.value)}
                    className="w-full text-sm bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white/80 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
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

              <div className="flex items-center gap-2.5 mt-2 text-xs text-white/50 flex-wrap">
                <span>{data.entidad}</span>
                <span>•</span>
                <span>{data.dependencia}</span>
                <span>•</span>
                <span>{data.subdependencia}</span>
                <span>•</span>
                <span>Jefe: {data.autoridades.jefeOgpl}</span>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
              <span className="chip-gold-accent px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold">
                Oficial
              </span>

              <button
                onClick={handleCopyLink}
                className="btn-banner-neutral inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer"
                title="Copiar enlace"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? 'Copiado' : 'Copiar enlace'}
              </button>

              <a
                href="https://ogpl.unmsm.edu.pe"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-steel-blue-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                Ver web oficial
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
                {isEditing ? 'Salir de edición' : 'Modo edición'}
              </button>

              {isEditing && (
                <button
                  onClick={handleSaveData}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all cursor-pointer ring-2 ring-emerald-400/50"
                >
                  <Save className="w-4 h-4" />
                  Guardar cambios
                </button>
              )}

              <button
                onClick={handleResetData}
                className="btn-banner-neutral p-2 rounded-xl text-xs text-white/70 hover:text-white cursor-pointer"
                title="Restablecer documento original"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Save confirmation banner */}
        {saveSuccess && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-400/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>¡Todos los cambios y ediciones en la Guía han sido guardados permanentemente!</span>
          </div>
        )}
      </div>

      {/* 2. Quick Navigation & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar en las 64 páginas de la guía..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#851827] focus:outline-none"
            />
          </div>

          <select
            value={activeSectionId}
            onChange={(e) => setActiveSectionId(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-[#851827] focus:outline-none cursor-pointer"
          >
            <option value="todas">Ver Guía Completa (Todas las Secciones)</option>
            {data.secciones.map((sec) => (
              <option key={sec.id} value={sec.id}>
                Pág. {sec.paginaPdf} · {sec.titulo}
              </option>
            ))}
          </select>
        </div>

        {isEditing && (
          <div className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-lg border border-amber-300 animate-pulse whitespace-nowrap">
            Modo Edición: Toda letra, dato o encabezado es editable
          </div>
        )}
      </div>

      {/* 3. Render Secciones Extraídas del PDF */}
      <div className="space-y-8">
        {displayedSections.map((sec, secIdx) => (
          <section
            key={sec.id}
            id={`seccion-${sec.id}`}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-slate-300"
          >
            {/* Section Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-5 py-3.5 border-b border-slate-700 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono font-bold bg-[#851827] text-white px-2.5 py-0.5 rounded border border-amber-400/40">
                  PDF Pág. {sec.paginaPdf}
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={sec.capitulo}
                    onChange={(e) => handleSectionTitleChange(secIdx, 'capitulo', e.target.value)}
                    className="bg-black/40 border border-slate-500 rounded px-2 py-0.5 text-xs text-amber-300 font-bold"
                  />
                ) : (
                  <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                    {sec.capitulo}
                  </span>
                )}
              </div>

              {isEditing ? (
                <input
                  type="text"
                  value={sec.titulo}
                  onChange={(e) => handleSectionTitleChange(secIdx, 'titulo', e.target.value)}
                  className="bg-black/40 border border-slate-500 rounded px-2 py-0.5 text-sm font-bold text-white flex-1 max-w-md"
                />
              ) : (
                <h2 className="text-sm font-bold text-white">
                  {sec.titulo}
                </h2>
              )}
            </div>

            {/* Section Content Blocks */}
            <div className="p-6 space-y-6">
              {sec.contenido.map((block, blockIdx) => (
                <div key={blockIdx} className="space-y-3">
                  {/* Block Title */}
                  {block.tituloBloque && (
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={block.tituloBloque}
                          onChange={(e) => handleBlockTitleChange(secIdx, blockIdx, e.target.value)}
                          className="font-bold text-sm text-[#851827] border border-slate-300 rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <h3 className="text-sm font-bold text-[#851827] flex items-center gap-2">
                          <span className="w-1.5 h-3.5 bg-[#851827] rounded-full" />
                          {block.tituloBloque}
                        </h3>
                      )}
                    </div>
                  )}

                  {/* Text Paragraphs */}
                  {block.parrafos && (
                    <div className="space-y-2.5">
                      {block.parrafos.map((p, pIdx) => (
                        <div key={pIdx} className="relative group">
                          {isEditing ? (
                            <div className="flex items-start gap-2">
                              <textarea
                                value={p}
                                onChange={(e) => handleParagraphChange(secIdx, blockIdx, pIdx, e.target.value)}
                                rows={Math.max(2, Math.ceil(p.length / 90))}
                                className="w-full text-xs text-slate-800 border border-slate-300 rounded p-2 focus:ring-2 focus:ring-[#851827] focus:outline-none"
                              />
                              <button
                                onClick={() => handleRemoveParagraph(secIdx, blockIdx, pIdx)}
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                                title="Eliminar párrafo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-700 leading-relaxed text-justify">
                              {p}
                            </p>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <button
                          onClick={() => handleAddParagraph(secIdx, blockIdx)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#851827] hover:underline cursor-pointer pt-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Añadir Párrafo
                        </button>
                      )}
                    </div>
                  )}

                  {/* Mascot "Leo" Callout Speech Bubble (as in pages 5, 9, 10, 11, 49, 54) */}
                  {block.tipo === 'callout_leo' && (
                    <div className="bg-amber-50/70 border-2 border-amber-400/60 rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Character avatar badge */}
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shrink-0 shadow-md flex items-center justify-center text-center">
                        <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center p-1">
                          <span className="text-xl">🦁</span>
                          <span className="text-[9px] font-black tracking-tighter text-[#851827] uppercase">LEO</span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#851827] mb-1">
                          Nota Explicativa de Leo · Acompañante de Procesos
                        </div>
                        {isEditing ? (
                          <textarea
                            value={block.mensajeLeo || ''}
                            onChange={(e) => handleLeoMessageChange(secIdx, blockIdx, e.target.value)}
                            rows={3}
                            className="w-full text-xs text-slate-800 bg-white border border-amber-300 rounded p-2 focus:outline-none"
                          />
                        ) : (
                          <p className="text-xs text-slate-800 italic leading-relaxed font-medium">
                            "{block.mensajeLeo}"
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Lists */}
                  {block.itemsLista && (
                    <ul className="space-y-1.5 pl-2">
                      {block.itemsLista.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#851827] mt-1.5 shrink-0" />
                          {isEditing ? (
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleListItemChange(secIdx, blockIdx, itemIdx, e.target.value)}
                              className="w-full text-xs border border-slate-300 rounded px-2 py-0.5"
                            />
                          ) : (
                            <span className="leading-relaxed">{item}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tables */}
                  {block.columnasTabla && block.filasTabla && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-[#851827] text-white font-semibold">
                              {block.columnasTabla.map((col, cIdx) => (
                                <th key={cIdx} className="py-2.5 px-3">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {block.filasTabla.map((fila, rIdx) => (
                              <tr key={rIdx} className="hover:bg-amber-50/20 transition-colors">
                                {fila.map((celda, cIdx) => {
                                  const cellVal = typeof celda === 'string' ? celda : celda.valor;
                                  return (
                                    <td key={cIdx} className="py-2.5 px-3 align-top text-slate-700">
                                      {isEditing ? (
                                        <textarea
                                          value={cellVal}
                                          onChange={(e) =>
                                            handleTableCellChange(secIdx, blockIdx, rIdx, cIdx, e.target.value)
                                          }
                                          rows={2}
                                          className="w-full text-xs border border-slate-300 rounded p-1"
                                        />
                                      ) : (
                                        <span className={cIdx === 0 ? 'font-bold text-slate-900' : ''}>
                                          {cellVal}
                                        </span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Official Annexes with External Links */}
                  {block.tipo === 'anexo' && block.enlaceExterno && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                          <FileSpreadsheet className="w-4 h-4 text-[#851827]" />
                          {block.tituloBloque}
                        </div>
                        {block.parrafos && (
                          <p className="text-[11px] text-slate-500 mt-1">
                            {block.parrafos[0]}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={block.enlaceExterno.url}
                            onChange={(e) => handleLinkChange(secIdx, blockIdx, 'url', e.target.value)}
                            className="text-xs border border-slate-300 rounded px-2 py-1 w-64"
                          />
                        ) : (
                          <a
                            href={block.enlaceExterno.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#851827] hover:bg-[#63141e] text-white shadow transition-all whitespace-nowrap"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {block.enlaceExterno.texto}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 4. Footer Summary */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <div className="font-bold text-sm text-amber-400">
            GUÍA N°. 001-2025-OGPL-R/UNMSM · Implementación de la Gestión por Procesos en Facultades
          </div>
          <div className="text-slate-400 text-[11px] mt-0.5">
            Oficina General de Planificación · Oficina de Racionalización · 64 Páginas Oficiales
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              onClick={handleSaveData}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Guardar Todo
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all cursor-pointer border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir / PDF
          </button>
        </div>
      </div>
    </div>
  );
};
