import React, { useState, useEffect, useRef } from 'react';
import { DocItem } from '../types';
import { X, Save, Trash2, Eye, Edit3, Download, Sparkles, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

interface DocumentEditorModalProps {
  isOpen: boolean;
  doc: DocItem | null;
  isNew?: boolean;
  onClose: () => void;
  onSave: (updatedDoc: DocItem) => void;
  onAutoSave?: (updatedDoc: DocItem) => void;
  onDelete?: (docId: string) => void;
}

export const DocumentEditorModal: React.FC<DocumentEditorModalProps> = ({
  isOpen,
  doc,
  isNew = false,
  onClose,
  onSave,
  onAutoSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<DocItem>({
    id: `doc-${Date.now()}`,
    category: 'gestion',
    code: 'DOC-UNMSM-' + new Date().getFullYear(),
    title: '',
    description: '',
    content: '',
    type: 'Documento Oficial (.pdf)',
    size: '1.5 MB',
    date: new Date().toLocaleDateString('es-PE'),
    author: 'Oficina General de Planificación',
    status: 'Vigente',
    tags: ['Procesos', 'UNMSM'],
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [autoSaveState, setAutoSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const hasUserEditedRef = useRef<boolean>(false);
  const isInitialMountRef = useRef<boolean>(true);

  useEffect(() => {
    isInitialMountRef.current = true;
    hasUserEditedRef.current = false;
    if (doc) {
      setFormData(doc);
      setTagInput(doc.tags ? doc.tags.join(', ') : '');
    } else if (isNew) {
      setFormData({
        id: `doc-${Date.now()}`,
        category: 'personalizado',
        code: `DOC-UNMSM-${Math.floor(Math.random() * 1000)}`,
        title: 'Nuevo Documento Institucional',
        description: 'Descripción breve de los objetivos y alcance del documento.',
        content: `# Título del Documento\n\n## 1. Introducción\nRedacta aquí el contenido detallado del documento...\n\n## 2. Metodología y Acuerdos\n- Punto 1\n- Punto 2\n\n## 3. Responsables y Aprobaciones\nOficina de Procesos - UNMSM`,
        type: 'Documento Word (.docx)',
        size: '1.2 MB',
        date: new Date().toLocaleDateString('es-PE'),
        author: 'Oficina General de Planificación (OGP)',
        status: 'Borrador',
        tags: ['Nuevo', 'OGP'],
      });
      setTagInput('Nuevo, OGP');
    }
    // Allow initial state setup before listening for edits
    const timer = setTimeout(() => {
      isInitialMountRef.current = false;
    }, 100);
    return () => clearTimeout(timer);
  }, [doc, isNew, isOpen]);

  // Debounced auto-save whenever user changes any field
  useEffect(() => {
    if (isInitialMountRef.current || !hasUserEditedRef.current || !formData.title.trim()) {
      return;
    }

    setAutoSaveState('saving');
    const timer = setTimeout(() => {
      const parsedTags = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const updatedSnapshot: DocItem = {
        ...formData,
        tags: parsedTags,
      };

      if (onAutoSave) {
        onAutoSave(updatedSnapshot);
      }
      setAutoSaveState('saved');
    }, 300);

    return () => clearTimeout(timer);
  }, [formData, tagInput, onAutoSave]);

  if (!isOpen) return null;

  const handleFieldChange = <K extends keyof DocItem>(field: K, value: DocItem[K]) => {
    hasUserEditedRef.current = true;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSafeClose = () => {
    // If user edited, ensure auto-save fires immediately before close
    if (hasUserEditedRef.current && formData.title.trim() && onAutoSave) {
      const parsedTags = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      onAutoSave({
        ...formData,
        tags: parsedTags,
      });
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Por favor ingrese un título para el documento.');
      return;
    }
    const parsedTags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const finalDoc = {
      ...formData,
      tags: parsedTags,
    };

    if (onAutoSave) {
      onAutoSave(finalDoc);
    }
    onSave(finalDoc);
  };

  const handleExportText = () => {
    const textContent = `${formData.title}\nCódigo: ${formData.code}\nFecha: ${formData.date}\nAutor: ${formData.author}\nEstado: ${formData.status}\n\nDescripción:\n${formData.description}\n\n---\nCONTENIDO:\n\n${formData.content}`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.code || 'documento'}-${formData.title.slice(0, 20)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={handleSafeClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold font-poppins text-slate-900">
                  {isNew ? 'Crear Nuevo Documento' : 'Editar / Reescribir Documento'}
                </h2>
                {autoSaveState === 'saving' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                    Guardando automáticamente...
                  </span>
                ) : autoSaveState === 'saved' || hasUserEditedRef.current ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Guardado automáticamente
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isNew ? 'Agrega una nueva directriz o formato al sistema' : `Modificando: ${formData.code || formData.title}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                previewMode
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {previewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{previewMode ? 'Modo Edición' : 'Vista Previa'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportText}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Descargar documento en texto (.txt)"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSafeClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {!previewMode ? (
            <>
              {/* Row 1: Title & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Título del Documento *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    placeholder="Ej. Anexo 5: Matriz de Control Operacional"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Código Oficial
                  </label>
                  <input
                    type="text"
                    value={formData.code || ''}
                    onChange={(e) => handleFieldChange('code', e.target.value)}
                    placeholder="OGP-DOC-01"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Row 2: Category, Format/Type, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleFieldChange('category', e.target.value as DocItem['category'])
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="gestion">Plan de Gestión</option>
                    <option value="cronograma">Plan de Cronograma</option>
                    <option value="bitacora">Bitácora de Acuerdos</option>
                    <option value="formatos">Formatos y Anexos</option>
                    <option value="sistemas">Sistemas Digitales</option>
                    <option value="normativa">Normativa y Guías</option>
                    <option value="personalizado">Personalizado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipo / Formato de Descarga
                  </label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => handleFieldChange('type', e.target.value)}
                    placeholder="Excel (.xlsx), PDF (.pdf), etc."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleFieldChange('status', e.target.value as DocItem['status'])
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Vigente">Vigente</option>
                    <option value="Oficial">Oficial</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="En revisión">En revisión</option>
                    <option value="Borrador">Borrador</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Author & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Autor / Dependencia Responsable
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => handleFieldChange('author', e.target.value)}
                    placeholder="Oficina General de Planificación"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fecha de Emisión / Revisión
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    placeholder="02/09/2026"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Resumen Ejecutivo / Descripción
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Explica sintéticamente para qué sirve este documento y a quién está dirigido..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Etiquetas (separadas por comas)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => {
                    hasUserEditedRef.current = true;
                    setTagInput(e.target.value);
                  }}
                  placeholder="Procesos, Anexo, Fase 1, Calidad"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Rewrite / Content Body Editor */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Contenido Completo / Texto del Documento (Markdown / Texto enriquecido) *
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Soporta títulos (#), viñetas (-), y subtítulos
                  </span>
                </div>
                <textarea
                  required
                  rows={10}
                  value={formData.content}
                  onChange={(e) => handleFieldChange('content', e.target.value)}
                  placeholder="Redacta o reescribe aquí el texto completo del documento..."
                  className="w-full font-mono text-xs px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
                />
              </div>
            </>
          ) : (
            /* Live Preview Mode */
            <div className="p-6 bg-slate-50/50 rounded-xl border border-slate-200 space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 mb-1">
                  <span>{formData.code}</span>
                  <span>·</span>
                  <span className="uppercase text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                    {formData.category}
                  </span>
                  <span>·</span>
                  <span className="text-emerald-700 bg-emerald-100 text-[10px] px-2 py-0.5 rounded-full">
                    {formData.status}
                  </span>
                </div>
                <h1 className="text-2xl font-bold font-poppins text-slate-900">
                  {formData.title}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Autor: {formData.author} | Fecha: {formData.date} | Formato: {formData.type}
                </p>
                {formData.description && (
                  <p className="text-sm text-slate-700 mt-3 p-3 bg-white rounded-lg border border-slate-200 italic">
                    {formData.description}
                  </p>
                )}
              </div>

              {/* Rendered content */}
              <div className="prose prose-sm max-w-none text-slate-800 whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed p-4 bg-white rounded-xl border border-slate-200">
                {formData.content}
              </div>
            </div>
          )}

          {/* Footer with Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              {!isNew && onDelete && (
                <div>
                  {!confirmDelete ? (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar documento</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 p-1.5 bg-rose-50 border border-rose-200 rounded-xl animate-in fade-in">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span className="text-xs text-rose-800 font-medium">¿Confirmas eliminar?</span>
                      <button
                        type="button"
                        onClick={() => onDelete(formData.id)}
                        className="px-2.5 py-1 text-xs bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 cursor-pointer"
                      >
                        Sí, eliminar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md shadow-sky-200 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
