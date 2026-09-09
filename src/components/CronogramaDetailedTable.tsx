import React from 'react';
import { Star, Trash2 } from 'lucide-react';
import { CronogramaItem } from '../data/cronogramaV2Data';

interface Props {
  tareas: CronogramaItem[];
  allTareas: CronogramaItem[];
  viewFormat: 'csv' | 'pmi' | 'markdown';
  isEditing: boolean;
  onTaskChange: (globalIndex: number, field: keyof CronogramaItem, value: any) => void;
  onDeleteTask: (globalIndex: number) => void;
}

export const CronogramaDetailedTable: React.FC<Props> = ({
  tareas,
  allTareas,
  viewFormat,
  isEditing,
  onTaskChange,
  onDeleteTask,
}) => {
  if (viewFormat === 'csv') {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3.5 w-1/4 font-semibold text-slate-700">Etapa (Nivel 2)</th>
              <th className="py-2.5 px-3.5 w-1/4 font-semibold text-slate-700">Actividad (Nivel 3)</th>
              <th className="py-2.5 px-3.5 min-w-[280px] font-semibold text-slate-700">Tarea (Nivel 4)</th>
              <th className="py-2.5 px-3.5 w-28 text-center font-semibold text-slate-700">Fecha de Inicio</th>
              <th className="py-2.5 px-3.5 w-28 text-center font-semibold text-slate-700">Fecha de Cierre</th>
              {isEditing && <th className="py-2.5 px-2 w-14 text-center">Acción</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {tareas.map((item, idx) => {
              const globalIndex = allTareas.findIndex((t) => t.codigo === item.codigo);
              const isRC = item.rutaCritica;
              const isHito = item.esHito || item.codigo.startsWith('H');

              return (
                <tr
                  key={`${item.codigo}-${idx}`}
                  className={`hover:bg-slate-50/90 transition-colors ${
                    isRC ? 'bg-red-50/20' : ''
                  } ${isHito ? 'bg-amber-50/30' : ''}`}
                >
                  {/* Etapa (Nivel 2) */}
                  <td className="py-2.5 px-3.5 align-top font-medium text-slate-800">
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.etapa}
                        onChange={(e) => onTaskChange(globalIndex, 'etapa', e.target.value)}
                        className="w-full text-xs border border-slate-300 rounded px-2 py-1"
                      />
                    ) : (
                      <span className="text-slate-900 font-medium">{item.etapa}</span>
                    )}
                  </td>

                  {/* Actividad (Nivel 3) */}
                  <td className="py-2.5 px-3.5 align-top text-slate-700">
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.actividad}
                        onChange={(e) => onTaskChange(globalIndex, 'actividad', e.target.value)}
                        className="w-full text-xs border border-slate-300 rounded px-2 py-1"
                      />
                    ) : (
                      <span className="text-slate-700">{item.actividad}</span>
                    )}
                  </td>

                  {/* Tarea (Nivel 4) */}
                  <td className="py-2.5 px-3.5 align-top font-semibold text-slate-900">
                    {isEditing ? (
                      <textarea
                        value={item.tarea}
                        onChange={(e) => onTaskChange(globalIndex, 'tarea', e.target.value)}
                        rows={2}
                        className="w-full text-xs border border-slate-300 rounded p-1.5"
                      />
                    ) : (
                      <div className="flex items-start gap-1.5 flex-wrap">
                        <span className="text-slate-900">{item.tarea}</span>
                        {isHito && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            Hito
                          </span>
                        )}
                        {isRC && (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                            RC
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Fecha de Inicio */}
                  <td className="py-2.5 px-3.5 align-top text-center font-mono text-slate-700 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.inicio}
                        onChange={(e) => onTaskChange(globalIndex, 'inicio', e.target.value)}
                        className="w-full font-mono text-xs border border-slate-300 rounded px-1 py-1 text-center"
                      />
                    ) : (
                      item.inicio
                    )}
                  </td>

                  {/* Fecha de Cierre */}
                  <td className="py-2.5 px-3.5 align-top text-center font-mono text-slate-700 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.fin}
                        onChange={(e) => onTaskChange(globalIndex, 'fin', e.target.value)}
                        className="w-full font-mono text-xs border border-slate-300 rounded px-1 py-1 text-center"
                      />
                    ) : (
                      item.fin
                    )}
                  </td>

                  {/* Action button when editing */}
                  {isEditing && (
                    <td className="py-2.5 px-2 align-top text-center">
                      <button
                        type="button"
                        onClick={() => onDeleteTask(globalIndex)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title="Eliminar tarea"
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
    );
  }

  // Extended PMI Table
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <th className="py-2.5 px-3 w-28 font-mono">Código</th>
            <th className="py-2.5 px-3 w-52">Etapa y Actividad</th>
            <th className="py-2.5 px-3 min-w-[240px]">Tarea</th>
            <th className="py-2.5 px-3 w-32">Responsable</th>
            <th className="py-2.5 px-3 w-24 text-center">Inicio</th>
            <th className="py-2.5 px-3 w-24 text-center">Fin</th>
            <th className="py-2.5 px-3 w-16 text-center">Días</th>
            <th className="py-2.5 px-3 w-28 text-center">Estado</th>
            <th className="py-2.5 px-3 w-28 text-center">Predecesora</th>
            <th className="py-2.5 px-3 w-14 text-center">RC</th>
            {isEditing && <th className="py-2.5 px-3 w-14 text-center">Acción</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {tareas.map((item, idx) => {
            const globalIndex = allTareas.findIndex((t) => t.codigo === item.codigo);
            const isRC = item.rutaCritica;
            const isHito = item.esHito || item.codigo.startsWith('H');

            return (
              <tr
                key={`${item.codigo}-${idx}`}
                className={`hover:bg-slate-50/80 transition-colors ${
                  isRC ? 'bg-red-50/20' : ''
                } ${isHito ? 'bg-amber-50/30' : ''}`}
              >
                {/* Código */}
                <td className="py-2.5 px-3 font-mono font-bold text-slate-800 align-top whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="text"
                      value={item.codigo}
                      onChange={(e) => onTaskChange(globalIndex, 'codigo', e.target.value)}
                      className="w-full font-mono text-xs border border-slate-300 rounded px-1.5 py-0.5"
                    />
                  ) : (
                    <span className="flex items-center gap-1">
                      {item.codigo}
                      {isHito && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                    </span>
                  )}
                </td>

                {/* Etapa y Actividad */}
                <td className="py-2.5 px-3 align-top text-slate-700">
                  {isEditing ? (
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={item.etapa}
                        onChange={(e) => onTaskChange(globalIndex, 'etapa', e.target.value)}
                        placeholder="Etapa"
                        className="w-full text-[11px] border border-slate-300 rounded px-1 py-0.5"
                      />
                      <input
                        type="text"
                        value={item.actividad}
                        onChange={(e) => onTaskChange(globalIndex, 'actividad', e.target.value)}
                        placeholder="Actividad"
                        className="w-full text-[11px] border border-slate-300 rounded px-1 py-0.5 text-slate-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="font-semibold text-slate-800">{item.etapa}</div>
                      <div className="text-slate-500">{item.actividad}</div>
                    </div>
                  )}
                </td>

                {/* Tarea */}
                <td className="py-2.5 px-3 align-top font-medium text-slate-900">
                  {isEditing ? (
                    <textarea
                      value={item.tarea}
                      onChange={(e) => onTaskChange(globalIndex, 'tarea', e.target.value)}
                      rows={2}
                      className="w-full text-xs border border-slate-300 rounded p-1"
                    />
                  ) : (
                    <div>
                      <p className="font-semibold text-slate-800">{item.tarea}</p>
                      {item.nota && (
                        <p className="text-[11px] text-slate-500 italic mt-0.5">
                          Nota: {item.nota}
                        </p>
                      )}
                    </div>
                  )}
                </td>

                {/* Responsable */}
                <td className="py-2.5 px-3 align-top text-slate-600">
                  {isEditing ? (
                    <input
                      type="text"
                      value={item.responsable}
                      onChange={(e) => onTaskChange(globalIndex, 'responsable', e.target.value)}
                      className="w-full text-[11px] border border-slate-300 rounded px-1 py-0.5"
                    />
                  ) : (
                    item.responsable
                  )}
                </td>

                {/* Inicio */}
                <td className="py-2.5 px-3 align-top text-center font-mono text-slate-700 whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="text"
                      value={item.inicio}
                      onChange={(e) => onTaskChange(globalIndex, 'inicio', e.target.value)}
                      className="w-full font-mono text-[11px] border border-slate-300 rounded px-1 py-0.5 text-center"
                    />
                  ) : (
                    item.inicio
                  )}
                </td>

                {/* Fin */}
                <td className="py-2.5 px-3 align-top text-center font-mono text-slate-700 whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="text"
                      value={item.fin}
                      onChange={(e) => onTaskChange(globalIndex, 'fin', e.target.value)}
                      className="w-full font-mono text-[11px] border border-slate-300 rounded px-1 py-0.5 text-center"
                    />
                  ) : (
                    item.fin
                  )}
                </td>

                {/* Días */}
                <td className="py-2.5 px-3 align-top text-center font-mono font-bold text-slate-800">
                  {isEditing ? (
                    <input
                      type="text"
                      value={item.dias}
                      onChange={(e) => onTaskChange(globalIndex, 'dias', e.target.value)}
                      className="w-12 font-mono text-[11px] border border-slate-300 rounded px-1 py-0.5 text-center"
                    />
                  ) : (
                    item.dias
                  )}
                </td>

                {/* Estado */}
                <td className="py-2.5 px-3 align-top text-center">
                  {isEditing ? (
                    <select
                      value={item.estado}
                      onChange={(e) => onTaskChange(globalIndex, 'estado', e.target.value)}
                      className="text-[11px] border border-slate-300 rounded px-1 py-0.5"
                    >
                      <option value="CONFORME">CONFORME</option>
                      <option value="EN PROCESO">EN PROCESO</option>
                      <option value="NO INICIADO">NO INICIADO</option>
                    </select>
                  ) : (
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
                  )}
                </td>

                {/* Predecesora + Vínculo */}
                <td className="py-2.5 px-3 align-top text-center font-mono text-[11px] text-slate-700 whitespace-nowrap">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={item.predecesora || ''}
                        onChange={(e) => onTaskChange(globalIndex, 'predecesora', e.target.value)}
                        placeholder="Pred"
                        className="w-14 font-mono text-[11px] border border-slate-300 rounded px-1 py-0.5"
                      />
                      <input
                        type="text"
                        value={item.vinculo || ''}
                        onChange={(e) => onTaskChange(globalIndex, 'vinculo', e.target.value)}
                        placeholder="FC/CC"
                        className="w-8 font-mono text-[11px] border border-slate-300 rounded px-1 py-0.5"
                      />
                    </div>
                  ) : (
                    <div>
                      {item.predecesora ? (
                        <>
                          <span>{item.predecesora}</span>
                          {item.vinculo && (
                            <span className="ml-1 text-[10px] text-slate-500 font-semibold bg-slate-100 px-1 rounded">
                              {item.vinculo}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </div>
                  )}
                </td>

                {/* Ruta Crítica (●) */}
                <td className="py-2.5 px-3 align-top text-center font-bold">
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={item.rutaCritica}
                      onChange={(e) => onTaskChange(globalIndex, 'rutaCritica', e.target.checked)}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                  ) : (
                    item.rutaCritica && (
                      <span
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs font-bold shadow-sm"
                        title="En la ruta crítica sin holgura"
                      >
                        ●
                      </span>
                    )
                  )}
                </td>

                {/* Delete button (in editing mode) */}
                {isEditing && (
                  <td className="py-2.5 px-3 align-top text-center">
                    <button
                      type="button"
                      onClick={() => onDeleteTask(globalIndex)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Eliminar tarea"
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
  );
};
