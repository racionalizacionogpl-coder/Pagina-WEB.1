import React, { useState, useMemo, useEffect } from 'react';
import {
  FileSpreadsheet,
  Table as TableIcon,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  BarChart2,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  REPORTE_INDICADORES_INITIAL_DATA,
  IndicadorSheetItem,
  ReporteIndicadoresData,
} from '../data/reporteIndicadoresData';

interface ReporteIndicadoresSpreadsheetViewerProps {
  onOpenFullEditor?: () => void;
  customGoogleSheetUrl?: string;
}

export const ReporteIndicadoresSpreadsheetViewer: React.FC<ReporteIndicadoresSpreadsheetViewerProps> = ({
  customGoogleSheetUrl = 'https://docs.google.com/spreadsheets/d/1O_tiR3qxKpZd6Q9vFC_Mq0gZh_by3qhqTOgKGHLprs/edit?usp=sharing',
}) => {
  // Persistence in localStorage
  const [data, setData] = useState<ReporteIndicadoresData>(() => {
    try {
      const saved = localStorage.getItem('unmsm_reporte_indicadores_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return REPORTE_INDICADORES_INITIAL_DATA;
  });

  // Active sheet: 0 = 'Reporte de Avance de Indicadores', 1..34 = individual indicator sheets
  const [activeSheetIndex, setActiveSheetIndex] = useState<number>(0);

  // Search and filter for the main summary sheet
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEstado, setFilterEstado] = useState<'todos' | 'Aprobado' | 'Propuesto'>('todos');
  const [filterTipoProceso, setFilterTipoProceso] = useState<'todos' | 'Estratégico' | 'Misional' | 'Soporte'>('todos');

  // Save to localStorage when modified
  const handleUpdateObservacion = (id: string, newObs: string) => {
    setData((prev) => {
      const updated = {
        ...prev,
        indicadores: prev.indicadores.map((item) =>
          item.id === id ? { ...item, observacion: newObs } : item
        ),
      };
      localStorage.setItem('unmsm_reporte_indicadores_data', JSON.stringify(updated));
      return updated;
    });
  };

  const handleResetData = () => {
    if (window.confirm('¿Deseas restablecer los datos del libro de indicadores al estado original?')) {
      setData(REPORTE_INDICADORES_INITIAL_DATA);
      localStorage.removeItem('unmsm_reporte_indicadores_data');
    }
  };

  // Filtered indicators in sheet 0
  const filteredIndicadores = useMemo(() => {
    return data.indicadores.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.proceso.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hoja.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.indicador.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.observacion.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEstado = filterEstado === 'todos' || item.estadoActual === filterEstado;
      const matchesTipo = filterTipoProceso === 'todos' || item.tipoProceso === filterTipoProceso;

      return matchesSearch && matchesEstado && matchesTipo;
    });
  }, [data.indicadores, searchQuery, filterEstado, filterTipoProceso]);

  // Current active indicator sheet (if index > 0)
  const currentSheetItem: IndicadorSheetItem | undefined = useMemo(() => {
    if (activeSheetIndex === 0) return undefined;
    return data.indicadores[activeSheetIndex - 1];
  }, [data.indicadores, activeSheetIndex]);

  // Export full workbook CSV matching the user's structure
  const handleExportCSV = () => {
    let csv = `Total de Indicadores Aprobados:,${data.totalIndicadoresAprobados},,,,,\n`;
    csv += `,,,,,,\n`;
    csv += `Reporte de Avance de Indicadores,,,,,,\n`;
    csv += `CÓDIGO,PROCESO,HOJA,INDICADOR,ESTADO ACTUAL,PORCENTAJE,OBSERVACIÓN\n`;

    data.indicadores.forEach((item) => {
      const cleanCodigo = `"${item.codigo.replace(/"/g, '""')}"`;
      const cleanProceso = `"${item.proceso.replace(/"/g, '""')}"`;
      const cleanHoja = `"${item.hoja.replace(/"/g, '""')}"`;
      const cleanIndicador = `"${item.indicador.replace(/"/g, '""')}"`;
      const cleanEstado = item.estadoActual;
      const cleanPct = `${item.porcentaje}%`;
      const cleanObs = `"${(item.observacion || '').replace(/"/g, '""')}"`;

      csv += `${cleanCodigo},${cleanProceso},${cleanHoja},${cleanIndicador},${cleanEstado},${cleanPct},${cleanObs}\n`;
    });

    csv += `,,,,PROMEDIO TOTAL:,${data.promedioTotal}%,\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Reporte_Avance_Indicadores_UNMSM.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* HEADER PRINCIPAL DEL LIBRO DE HOJAS DE CÁLCULO */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-4 sm:p-5 border-b border-emerald-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Libro de Hojas de Cálculo · 35 Hojas Integradas</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Reporte de Avance de Indicadores
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl">
              Sistema de monitoreo oficial de indicadores por proceso (PE, PM, PS). Revisa cada una de las 34 hojas de cálculo y la hoja de resumen consolidada.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-start md:self-center">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold rounded-xl border border-emerald-500/40 shadow-xs transition-all cursor-pointer"
              title="Descargar libro en CSV oficial"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>

            <a
              href={customGoogleSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-emerald-100 hover:text-white text-xs font-semibold rounded-xl border border-white/20 transition-all cursor-pointer"
              title="Abrir en Google Sheets"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir Google Sheets</span>
            </a>

            <button
              type="button"
              onClick={handleResetData}
              className="p-2 text-emerald-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title="Restablecer datos originales"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* BARRA DE TABS DE TODAS LAS HOJAS (ESTILO GOOGLE SHEETS / EXCEL) */}
      <div className="bg-slate-100 border-b border-slate-200 px-2 py-1.5 flex items-center justify-between gap-2 overflow-hidden select-none">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin py-1 px-1">
          {/* BOTÓN HOJA 0: REPORTE GENERAL */}
          <button
            type="button"
            onClick={() => setActiveSheetIndex(0)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              activeSheetIndex === 0
                ? 'bg-emerald-700 text-white shadow-xs ring-1 ring-emerald-800'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Hoja 0 · Resumen de Avance</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeSheetIndex === 0 ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
              }`}
            >
              34 Indicadores
            </span>
          </button>

          {/* LISTA DE PESTAÑAS DE CADA HOJA INDIVIDUAL (1 A 34) */}
          {data.indicadores.map((item, idx) => {
            const sheetIdx = idx + 1;
            const isApproved = item.estadoActual === 'Aprobado';
            const isActive = activeSheetIndex === sheetIdx;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSheetIndex(sheetIdx)}
                title={`${item.hoja} (${item.estadoActual} - ${item.porcentaje}%)`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs ring-1 ring-emerald-800'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isApproved ? 'bg-emerald-400 ring-2 ring-emerald-200/60' : 'bg-amber-400'
                  }`}
                />
                <span className="font-mono text-[11px] font-bold opacity-80">{item.codigo}</span>
                <span className="max-w-[170px] truncate">{item.hoja.trim()}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    isActive
                      ? 'bg-emerald-800 text-emerald-100'
                      : isApproved
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {item.porcentaje}%
                </span>
              </button>
            );
          })}
        </div>

        {/* SELECTOR RÁPIDO DESPLEGABLE PARA SALTAR A CUALQUIERA DE LAS 35 HOJAS */}
        <div className="shrink-0 flex items-center gap-1.5 pl-2 border-l border-slate-200">
          <label htmlFor="select-hoja-rapida" className="text-[11px] font-bold text-slate-500 hidden sm:inline whitespace-nowrap">
            Ir a hoja:
          </label>
          <select
            id="select-hoja-rapida"
            value={activeSheetIndex}
            onChange={(e) => setActiveSheetIndex(Number(e.target.value))}
            className="text-xs py-1 px-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer max-w-[200px]"
          >
            <option value={0}>📊 Hoja 0: Reporte de Avance (Resumen)</option>
            {data.indicadores.map((item, idx) => (
              <option key={`opt-${item.id}`} value={idx + 1}>
                {idx + 1}. [{item.codigo}] {item.hoja.trim()} ({item.estadoActual} - {item.porcentaje}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CONTENIDO DE LA HOJA: CASO 1: HOJA 0 (REPORTE GENERAL) O CASO 2: HOJA ESPECÍFICA */}
      {activeSheetIndex === 0 ? (
        <div className="p-4 sm:p-6 space-y-6">
          {/* TARJETAS RESUMEN DE INDICADORES (CONFORME AL REQUERIMIENTO) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* CARD 1: INDICADORES APROBADOS */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Total Indicadores Aprobados
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-emerald-950">
                    {data.totalIndicadoresAprobados}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold">de {data.indicadores.length} hojas</span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-1">Al 100% de cumplimiento formal</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            {/* CARD 2: INDICADORES PROPUESTOS */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Total Indicadores Propuestos
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-amber-950">
                    {data.totalIndicadoresPropuestos}
                  </span>
                  <span className="text-xs text-amber-700 font-bold">de {data.indicadores.length} hojas</span>
                </div>
                <p className="text-[11px] text-amber-700 mt-1">En formulación inicial (25%)</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {/* CARD 3: TOTAL HOJAS DE INDICADORES */}
            <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-sky-800 uppercase tracking-wider">
                  Total Hojas del Libro
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-sky-950">35</span>
                  <span className="text-xs text-sky-700 font-bold">1 Resumen + 34 Hojas</span>
                </div>
                <p className="text-[11px] text-sky-700 mt-1">PE, PM y PS caracterizados</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                <Layers className="w-6 h-6" />
              </div>
            </div>

            {/* CARD 4: PROMEDIO TOTAL DE AVANCE */}
            <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Promedio Total de Avance
                </p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                  Fase 1
                </span>
              </div>
              <div className="my-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-white">{data.promedioTotal}%</span>
                  <span className="text-xs text-slate-300 font-medium">Meta Global: 100%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-emerald-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${data.promedioTotal}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400">Ponderado consolidado oficial</p>
            </div>
          </div>

          {/* BARRA DE BÚSQUEDA Y FILTRADO DE LA TABLA PRINCIPAL */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por código (PE.01, PM1...), proceso, indicador o nombre de hoja..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* FILTRO ESTADO */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs font-semibold">
                <span className="text-[11px] text-slate-400 px-2">Estado:</span>
                <button
                  type="button"
                  onClick={() => setFilterEstado('todos')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    filterEstado === 'todos' ? 'bg-slate-800 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Todos ({data.indicadores.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterEstado('Aprobado')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    filterEstado === 'Aprobado'
                      ? 'bg-emerald-700 text-white font-bold'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  Aprobado ({data.totalIndicadoresAprobados})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterEstado('Propuesto')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    filterEstado === 'Propuesto'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  Propuesto ({data.totalIndicadoresPropuestos})
                </button>
              </div>

              {/* FILTRO TIPO DE PROCESO */}
              <select
                value={filterTipoProceso}
                onChange={(e) =>
                  setFilterTipoProceso(e.target.value as 'todos' | 'Estratégico' | 'Misional' | 'Soporte')
                }
                className="text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="todos">Todos los Procesos (PE, PM, PS)</option>
                <option value="Estratégico">Procesos Estratégicos (PE)</option>
                <option value="Misional">Procesos Misionales (PM)</option>
                <option value="Soporte">Procesos de Soporte (PS)</option>
              </select>
            </div>
          </div>

          {/* TABLA PRINCIPAL DEL REPORTE DE AVANCE DE INDICADORES */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-700 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-3 w-12 text-center">N°</th>
                    <th className="py-3 px-3 w-24">CÓDIGO</th>
                    <th className="py-3 px-4 min-w-[200px]">PROCESO</th>
                    <th className="py-3 px-4 min-w-[260px]">HOJA</th>
                    <th className="py-3 px-4 min-w-[320px]">INDICADOR</th>
                    <th className="py-3 px-3 w-28 text-center">ESTADO ACTUAL</th>
                    <th className="py-3 px-3 w-24 text-center">PORCENTAJE</th>
                    <th className="py-3 px-4 min-w-[220px]">OBSERVACIÓN</th>
                    <th className="py-3 px-3 w-28 text-center">ACCIÓN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {filteredIndicadores.map((item, index) => {
                    const isApproved = item.estadoActual === 'Aprobado';
                    const targetSheetIndex = data.indicadores.findIndex((i) => i.id === item.id) + 1;

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors hover:bg-emerald-50/40 ${
                          isApproved ? 'bg-white' : 'bg-slate-50/40'
                        }`}
                      >
                        {/* N° */}
                        <td className="py-3 px-3 text-center text-slate-400 font-mono font-semibold">
                          {item.sheetNumber}
                        </td>

                        {/* CÓDIGO */}
                        <td className="py-3 px-3 font-mono font-bold text-slate-800">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] inline-block ${
                              item.codigo.startsWith('PE')
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : item.codigo.startsWith('PM')
                                ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {item.codigo}
                          </span>
                        </td>

                        {/* PROCESO */}
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span>{item.proceso}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-normal uppercase">
                            Proceso {item.tipoProceso}
                          </span>
                        </td>

                        {/* HOJA */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => setActiveSheetIndex(targetSheetIndex)}
                            className="text-left font-mono font-medium text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1 cursor-pointer group"
                            title={`Abrir hoja técnica: ${item.hoja}`}
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
                            <span>{item.hoja}</span>
                          </button>
                        </td>

                        {/* INDICADOR */}
                        <td className="py-3 px-4 text-slate-700 font-normal leading-relaxed">
                          {item.indicador ? (
                            <span>{item.indicador}</span>
                          ) : (
                            <span className="text-slate-400 italic">
                              En proceso de definición según {item.hoja.trim()}
                            </span>
                          )}
                        </td>

                        {/* ESTADO ACTUAL */}
                        <td className="py-3 px-3 text-center">
                          {isApproved ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Aprobado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Propuesto
                            </span>
                          )}
                        </td>

                        {/* PORCENTAJE */}
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span
                              className={`font-black text-xs px-2 py-0.5 rounded ${
                                isApproved
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {item.porcentaje}%
                            </span>
                            <div className="w-12 bg-slate-200 rounded-full h-1 mt-1 overflow-hidden">
                              <div
                                className={`h-1 rounded-full ${isApproved ? 'bg-emerald-600' : 'bg-amber-500'}`}
                                style={{ width: `${item.porcentaje}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* OBSERVACIÓN */}
                        <td className="py-3 px-4 text-slate-600 text-xs">
                          <input
                            type="text"
                            value={item.observacion}
                            onChange={(e) => handleUpdateObservacion(item.id, e.target.value)}
                            placeholder="Agregar observación..."
                            className="w-full px-2 py-1 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-emerald-500 rounded text-xs text-slate-700 transition-all focus:outline-none"
                          />
                        </td>

                        {/* ACCIÓN: ABRIR HOJA */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => setActiveSheetIndex(targetSheetIndex)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg font-bold text-xs border border-emerald-200 hover:border-emerald-600 transition-all cursor-pointer shadow-2xs"
                            title={`Revisar hoja completa: ${item.hoja}`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Hoja</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PIE DE TABLA CON PROMEDIO OFICIAL */}
            <div className="bg-slate-900 text-white p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Total Filas Monitoreadas:</span>
                <span className="font-bold text-white">{data.indicadores.length} indicadores</span>
                <span className="text-slate-500">·</span>
                <span className="text-emerald-400 font-bold">{data.totalIndicadoresAprobados} Aprobados</span>
                <span className="text-slate-500">·</span>
                <span className="text-amber-400 font-bold">{data.totalIndicadoresPropuestos} Propuestos</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-emerald-300 font-bold uppercase tracking-wider">PROMEDIO TOTAL:</span>
                <span className="text-xl font-black text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-500/40">
                  {data.promedioTotal}%
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* CASO 2: VISTA DETALLADA DE LA HOJA INDIVIDUAL (HOJAS 1 A 34) */
        currentSheetItem && (
          <div className="p-4 sm:p-6 space-y-6">
            {/* BARRA SUPERIOR DE NAVEGACIÓN ENTRE HOJAS */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSheetIndex(0)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Volver al Reporte de Avance</span>
                </button>

                <div className="h-4 w-px bg-slate-200" />

                <span className="text-xs text-slate-500 font-semibold">
                  Hoja {activeSheetIndex} de {data.indicadores.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={activeSheetIndex <= 1}
                  onClick={() => setActiveSheetIndex((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  title="Hoja anterior"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </button>

                <button
                  type="button"
                  disabled={activeSheetIndex >= data.indicadores.length}
                  onClick={() => setActiveSheetIndex((prev) => Math.min(data.indicadores.length, prev + 1))}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  title="Siguiente hoja"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CABECERA OFICIAL DE LA HOJA DE INDICADOR */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-5 rounded-2xl border border-slate-700/60 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-lg text-xs font-bold font-mono">
                      {currentSheetItem.codigo}
                    </span>
                    <span className="px-2.5 py-1 bg-white/10 text-slate-200 border border-white/15 rounded-lg text-xs font-semibold">
                      {currentSheetItem.proceso}
                    </span>
                    <span className="px-2.5 py-1 bg-teal-500/20 text-teal-300 border border-teal-400/30 rounded-lg text-xs font-medium">
                      Proceso {currentSheetItem.tipoProceso}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Hoja: {currentSheetItem.hoja}</span>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                    <strong className="text-emerald-300">Denominación Oficial: </strong>
                    {currentSheetItem.indicador || `Ficha de caracterización y reporte: ${currentSheetItem.hoja.trim()}`}
                  </p>
                </div>

                {/* BADGE DE ESTADO Y PORCENTAJE */}
                <div className="flex flex-col items-end shrink-0 bg-white/5 border border-white/10 p-3.5 rounded-xl">
                  <div className="flex items-center gap-2">
                    {currentSheetItem.estadoActual === 'Aprobado' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white text-xs font-extrabold rounded-full shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Aprobado (100%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white text-xs font-extrabold rounded-full shadow-xs">
                        <Clock className="w-3.5 h-3.5" />
                        Propuesto (25%)
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-2 font-medium">
                    Frecuencia: {currentSheetItem.frecuencia}
                  </span>
                </div>
              </div>
            </div>

            {/* SECCIÓN DETALLADA: FICHA TÉCNICA DEL INDICADOR (ANEXO 4 NORMALIZADO) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* COLUMNA IZQUIERDA: PARÁMETROS TÉCNICOS Y FÓRMULA */}
              <div className="lg:col-span-2 space-y-5">
                {/* CAJA DE FÓRMULA MATEMÁTICA */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Fórmula Matemática de Cálculo</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs sm:text-sm text-emerald-950 font-bold shadow-2xs overflow-x-auto">
                    {currentSheetItem.formula}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Línea Base Histórica:</span>
                      <span className="font-bold text-slate-800">{currentSheetItem.lineaBase}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Meta Institucional 2026:</span>
                      <span className="font-bold text-emerald-700">{currentSheetItem.meta}</span>
                    </div>
                  </div>
                </div>

                {/* OBJETIVO Y ALCANCE */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span>Objetivo del Indicador</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {currentSheetItem.objetivo}
                  </p>

                  <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Unidad Orgánica Responsable:</span>
                      <span className="font-semibold text-slate-800">{currentSheetItem.responsable}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Fuente de Información / Sistema:</span>
                      <span className="font-semibold text-slate-800">{currentSheetItem.fuenteDatos}</span>
                    </div>
                  </div>
                </div>

                {/* REGISTRO HISTÓRICO / SEGUIMIENTO MENSUAL */}
                {currentSheetItem.registrosSeguimiento && currentSheetItem.registrosSeguimiento.length > 0 && (
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <TableIcon className="w-4 h-4 text-emerald-600" />
                      <span>Tabla de Seguimiento de Ejecución en Hoja</span>
                    </h4>

                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                            <th className="p-2.5">Período</th>
                            <th className="p-2.5 text-center">Meta Programada</th>
                            <th className="p-2.5 text-center">Valor Ejecutado</th>
                            <th className="p-2.5 text-center">Cumplimiento</th>
                            <th className="p-2.5 text-center">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentSheetItem.registrosSeguimiento.map((reg, rIdx) => (
                            <tr key={`reg-${rIdx}`} className="hover:bg-slate-50">
                              <td className="p-2.5 font-semibold text-slate-800">{reg.periodo}</td>
                              <td className="p-2.5 text-center text-slate-600">{reg.metaPeriodo}%</td>
                              <td className="p-2.5 text-center font-bold text-slate-900">{reg.ejecutado}%</td>
                              <td className="p-2.5 text-center">
                                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                  {reg.cumplimiento}%
                                </span>
                              </td>
                              <td className="p-2.5 text-center">
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  {reg.estado}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* COLUMNA DERECHA: SEMÁFORO Y OBSERVACIONES */}
              <div className="space-y-5">
                {/* RANGOS SEMAFÓRICOS INSTITUCIONALES */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-emerald-600" />
                    <span>Criterios de Semáforo (UNMSM)</span>
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-600" />
                        <span className="font-bold text-emerald-900">Nivel Óptimo</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-800">
                        {currentSheetItem.semaforo.optimo}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="font-bold text-amber-900">En Alerta / Aceptable</span>
                      </div>
                      <span className="font-mono font-bold text-amber-800">
                        {currentSheetItem.semaforo.aceptable}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-600" />
                        <span className="font-bold text-rose-900">Riesgo / Crítico</span>
                      </div>
                      <span className="font-mono font-bold text-rose-800">
                        {currentSheetItem.semaforo.riesgo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* OBSERVACIÓN EDITABLE DE LA HOJA */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-600" />
                    <span>Observación y Dictamen Técnico</span>
                  </h4>
                  <textarea
                    value={currentSheetItem.observacion}
                    onChange={(e) => handleUpdateObservacion(currentSheetItem.id, e.target.value)}
                    rows={4}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-y shadow-2xs"
                    placeholder="Escribe observaciones técnicas para esta hoja..."
                  />
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Los cambios se guardan automáticamente en tu navegador.</span>
                  </div>
                </div>

                {/* RESUMEN DE PROGRESO DE LA HOJA */}
                <div className="p-4 rounded-xl bg-emerald-950 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 uppercase">Estado en Libro</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {currentSheetItem.porcentaje}%
                    </span>
                  </div>
                  <div className="w-full bg-emerald-900/80 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-2 rounded-full"
                      style={{ width: `${currentSheetItem.porcentaje}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-emerald-200/80">
                    {currentSheetItem.estadoActual === 'Aprobado'
                      ? 'Hoja validada y aprobada por la Oficina de Racionalización OGPL.'
                      : 'Hoja en etapa de propuesta inicial (25%). Pendiente de cierre formal.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
