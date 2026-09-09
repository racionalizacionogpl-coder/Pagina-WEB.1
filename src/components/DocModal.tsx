import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ActiveDocModal, DocItem } from '../types';
import { UNMSM_FACULTIES } from '../data/initialData';
import { INITIAL_DOCS } from '../data/initialDocs';
import { DocumentEditorModal } from './DocumentEditorModal';
import { EditableText } from './EditableText';
import { PlanDeGestionV2Viewer } from './PlanDeGestionV2Viewer';
import { BitacoraV2Viewer } from './BitacoraV2Viewer';
import { CronogramaV2Viewer } from './CronogramaV2Viewer';
import { GuiaPractica001Viewer } from './GuiaPractica001Viewer';
import { Anexo1SpreadsheetViewer } from './Anexo1SpreadsheetViewer';
import { Anexo3SpreadsheetViewer } from './Anexo3SpreadsheetViewer';
import { ReporteIndicadoresSpreadsheetViewer } from './ReporteIndicadoresSpreadsheetViewer';
import { ANEXO1_GOOGLE_SHEET_URL } from '../data/anexo1MedicinaData';
import { ANEXO3_DIRECTRICES, ANEXO3_FICHAS } from '../data/anexo3MedicinaData';
import {
  X,
  FileText,
  Calendar,
  BookOpen,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Building2,
  Search,
  Monitor,
  FolderArchive,
  FolderOpen,
  FileSpreadsheet,
  Table as TableIcon,
  Clock,
  Users,
  Bell,
  Download,
  ExternalLink,
  Sparkles,
  Layers,
  Plus,
  Edit3,
  Trash2,
  RotateCcw,
  ArrowRight,
  Globe,
  Lock,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface DocModalProps {
  activeDoc: ActiveDocModal;
  onClose: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: string;
}

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Dra. Jeri Ramón Ruffner',
    role: 'Rectora de la UNMSM',
    department: 'Alta Dirección Universitaria',
    status: 'Líder Institucional',
  },
  {
    id: 'team-2',
    name: 'Director General de Planificación',
    role: 'Dirección General OGP',
    department: 'Oficina General de Planificación',
    status: 'Dirección Estratégica',
  },
  {
    id: 'team-3',
    name: 'Jefatura de la Oficina de Procesos',
    role: 'Líder Técnico de Gestión por Procesos',
    department: 'OGP - Oficina de Desarrollo y Procesos',
    status: 'Coordinación General',
  },
  {
    id: 'team-4',
    name: 'Especialistas Metodológicos y de Calidad',
    role: 'Asesores de Levantamiento y Documentación',
    department: 'OGP - Equipo de Calidad',
    status: 'Asesoría Técnica',
  },
  {
    id: 'team-5',
    name: 'Comité de Calidad de las 20 Facultades',
    role: 'Enlaces Oficiales de Procesos',
    department: '20 Facultades UNMSM',
    status: 'Validación en Campo',
  },
  {
    id: 'team-6',
    name: 'Equipo de Sistemas Quipucamayoc',
    role: 'Plataforma y Soporte Digital',
    department: 'OGP / Red Telemática UNMSM',
    status: 'Desarrollo Digital',
  },
];

const STORAGE_KEY_DOCS = 'kpi_edit_corporativo_custom_docs_v1';
const STORAGE_KEY_DOCS_V2 = 'unmsm_gxp_centro_documentacion_docs_v2';
const STORAGE_KEY_DELETED_DOCS = 'unmsm_gxp_deleted_docs_ids_v2';
const STORAGE_KEY_TEAM = 'quipucamayoc_team_members_v1';

export const DocModal: React.FC<DocModalProps> = ({ activeDoc, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEAM);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_TEAM_MEMBERS;
  });
  const [docs, setDocs] = useState<DocItem[]>(() => {
    let deletedIds = new Set<string>();
    try {
      const savedDeleted = localStorage.getItem(STORAGE_KEY_DELETED_DOCS);
      if (savedDeleted) {
        deletedIds = new Set<string>(JSON.parse(savedDeleted));
      }
    } catch (e) {
      console.error('Error parsing deleted doc ids', e);
    }

    const saved =
      localStorage.getItem(STORAGE_KEY_DOCS_V2) ||
      localStorage.getItem(STORAGE_KEY_DOCS);
    if (saved) {
      try {
        let parsed: DocItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out explicitly deleted documents
          let filtered = parsed.filter((d) => !deletedIds.has(d.id));
          const existingIds = new Set(filtered.map((d) => d.id));
          INITIAL_DOCS.forEach((initDoc) => {
            if (!existingIds.has(initDoc.id) && !deletedIds.has(initDoc.id)) {
              filtered.push(initDoc);
            }
          });
          return filtered;
        }
      } catch (e) {
        console.error('Error parsing saved docs', e);
      }
    }
    return INITIAL_DOCS.filter((d) => !deletedIds.has(d.id));
  });

  const [activeSelectedDoc, setActiveSelectedDoc] = useState<DocItem | null>(null);
  const [spreadsheetFormat, setSpreadsheetFormat] = useState<'indicadores' | 'anexo3' | 'anexo1'>('indicadores');
  const [spreadsheetViewMode, setSpreadsheetViewMode] = useState<'matriz' | 'embebida'>('matriz');
  const [editorOpen, setEditorOpen] = useState(false);
  const [isNewDoc, setIsNewDoc] = useState(false);
  const [editingTargetDoc, setEditingTargetDoc] = useState<DocItem | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Independent Google Sheets URLs for Indicadores (35 Hojas), Anexo 1 and Anexo 3
  const [indicadoresSheetUrl, setIndicadoresSheetUrl] = useState<string>(() => {
    return (
      localStorage.getItem('unmsm_indicadores_sheet_url') ||
      'https://docs.google.com/spreadsheets/d/1O_tiR3qxKpZd6Q9vFC_Mq0gZh_by3qhqTOgKGHLprs/edit?usp=sharing'
    );
  });

  const [anexo1SheetUrl, setAnexo1SheetUrl] = useState<string>(() => {
    return (
      localStorage.getItem('sigpro_fm_anexo1_sheet_url') ||
      'https://docs.google.com/spreadsheets/d/1IdbcV-JwsslkBdM2xmDqpEFNbGGePwOmS7UgjFEEU_Q/edit?usp=sharing'
    );
  });

  const [anexo3SheetUrl, setAnexo3SheetUrl] = useState<string>(() => {
    return (
      localStorage.getItem('sigpro_fm_anexo3_sheet_url') ||
      'https://docs.google.com/spreadsheets/d/1IdbcV-JwsslkBdM2xmDqpEFNbGGePwOmS7UgjFEEU_Q/edit?usp=sharing'
    );
  });

  const [isEditingSheetUrl, setIsEditingSheetUrl] = useState<boolean>(false);
  const [tempSheetUrl, setTempSheetUrl] = useState<string>('');

  // Sidebar visibility state with local storage persistence
  const [isSidebarHidden, setIsSidebarHidden] = useState<boolean>(() => {
    try {
      return localStorage.getItem('unmsm_doc_sidebar_hidden') === 'true';
    } catch (e) {
      return false;
    }
  });

  const setSidebarHiddenWithStorage = (hidden: boolean) => {
    setIsSidebarHidden(hidden);
    try {
      localStorage.setItem('unmsm_doc_sidebar_hidden', String(hidden));
    } catch (e) {}
  };

  const toggleSidebar = () => {
    setSidebarHiddenWithStorage(!isSidebarHidden);
  };

  const currentDocFormat: 'indicadores' | 'anexo3' | 'anexo1' = useMemo(() => {
    if (!activeSelectedDoc) return 'indicadores';
    const id = activeSelectedDoc.id?.toLowerCase() || '';
    const title = activeSelectedDoc.title?.toLowerCase() || '';
    const code = activeSelectedDoc.code?.toLowerCase() || '';
    if (id.includes('indicador') || id.includes('anexo-4') || title.includes('indicador') || code.includes('ind')) {
      return 'indicadores';
    }
    if (id.includes('anexo-1') || title.includes('anexo 1') || code.includes('anexo-01')) {
      return 'anexo1';
    }
    if (id.includes('anexo-3') || title.includes('anexo 3') || code.includes('anexo-03')) {
      return 'anexo3';
    }
    return 'indicadores';
  }, [activeSelectedDoc]);

  const currentSpreadsheetUrl =
    currentDocFormat === 'indicadores'
      ? indicadoresSheetUrl
      : currentDocFormat === 'anexo1'
      ? anexo1SheetUrl
      : anexo3SheetUrl;

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('/preview')) return url;
    if (url.includes('/edit')) return url.replace(/\/edit.*$/, '/preview');
    return url.replace(/\/?$/, '/preview');
  };

  const handleSaveSheetUrl = () => {
    if (!tempSheetUrl.trim()) return;
    const cleanUrl = tempSheetUrl.trim();
    if (currentDocFormat === 'indicadores') {
      setIndicadoresSheetUrl(cleanUrl);
      localStorage.setItem('unmsm_indicadores_sheet_url', cleanUrl);
      setDocs((prev) =>
        prev.map((d) =>
          d.id === 'doc-indicadores' || d.id === 'doc-anexo-4'
            ? { ...d, googleSheetUrl: cleanUrl, publicUrl: cleanUrl }
            : d
        )
      );
      if (activeSelectedDoc?.id === 'doc-indicadores' || activeSelectedDoc?.id === 'doc-anexo-4') {
        setActiveSelectedDoc((prev) =>
          prev ? { ...prev, googleSheetUrl: cleanUrl, publicUrl: cleanUrl } : null
        );
      }
      setFeedbackToast('Enlace de Google Sheets para Reporte de Indicadores actualizado exitosamente');
    } else if (currentDocFormat === 'anexo1') {
      setAnexo1SheetUrl(cleanUrl);
      localStorage.setItem('sigpro_fm_anexo1_sheet_url', cleanUrl);
      setDocs((prev) =>
        prev.map((d) =>
          d.id === 'doc-anexo-1' ? { ...d, googleSheetUrl: cleanUrl, publicUrl: cleanUrl } : d
        )
      );
      if (activeSelectedDoc?.id === 'doc-anexo-1') {
        setActiveSelectedDoc((prev) =>
          prev ? { ...prev, googleSheetUrl: cleanUrl, publicUrl: cleanUrl } : null
        );
      }
      setFeedbackToast('Enlace de Google Sheets para Anexo 1 actualizado exitosamente');
    } else {
      setAnexo3SheetUrl(cleanUrl);
      localStorage.setItem('sigpro_fm_anexo3_sheet_url', cleanUrl);
      setDocs((prev) =>
        prev.map((d) =>
          d.id === 'doc-anexo-3' ? { ...d, googleSheetUrl: cleanUrl, publicUrl: cleanUrl } : d
        )
      );
      if (activeSelectedDoc?.id === 'doc-anexo-3') {
        setActiveSelectedDoc((prev) =>
          prev ? { ...prev, googleSheetUrl: cleanUrl, publicUrl: cleanUrl } : null
        );
      }
      setFeedbackToast('Enlace de Google Sheets para Anexo 3 actualizado exitosamente');
    }
    setIsEditingSheetUrl(false);
  };

  // Sub-tab state for Anexo 3 (Fichas Técnicas vs Matriz SIPOC Completa)
  const [anexo3SubTab, setAnexo3SubTab] = useState<'fichas' | 'matrizSipoc'>('fichas');

  // Export CSV for Anexo 3 directly from unified single-line toolbar
  const handleExportAnexo3CSV = () => {
    const lines: string[] = [];
    lines.push('FACULTAD DE MEDICINA - ANEXO 3: FICHAS TÉCNICAS DE PRODUCTO Y PROCESO');
    lines.push('');
    lines.push('DIRECTRICES');
    ANEXO3_DIRECTRICES.forEach((d) => {
      lines.push(`"${d.numero}. ${d.regla}: ${d.descripcion}"`);
    });
    lines.push('');
    lines.push(
      'CÓDIGO,PROCESO,TIPO,RESPONSABLE,VINCULACIÓN,OBJETIVO,PROVEEDOR (Col B),ENTRADA (Col D),PROCESO (Col F),SALIDA (Col H),BENEFICIARIOS (Col J),INDICADORES'
    );

    ANEXO3_FICHAS.forEach((f) => {
      if (f.sipoc.length === 0) {
        lines.push(
          `"${f.codigo}","${f.nombre}","${f.tipo}","${f.responsable}","${f.vinculacion}","${f.objetivo.replace(
            /"/g,
            '""'
          )}","","","","","","${(f.indicadores || '').replace(/"/g, '""')}"`
        );
      } else {
        f.sipoc.forEach((s) => {
          lines.push(
            `"${f.codigo}","${f.nombre}","${f.tipo}","${f.responsable}","${f.vinculacion}","${f.objetivo.replace(
              /"/g,
              '""'
            )}","${s.proveedorCodigo || ''} ${s.proveedorNombre || ''}","${s.entradaCodigo || ''} ${
              s.entradaNombre || ''
            }","${s.procesoCodigo || ''} ${s.procesoNombre || ''}","${(
              s.salidaNombre || ''
            ).replace(/"/g, '""')}","${(s.beneficiarioNombre || '').replace(/"/g, '""')}","${(
              f.indicadores || ''
            ).replace(/"/g, '""')}"`
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

  // Dashboard view states - default to 'tabla' for instant, reliable rendering
  const OFFICIAL_DASHBOARD_URL =
    'https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/Dashboard.html';
  const [dashboardViewMode, setDashboardViewMode] = useState<'tablero' | 'tabla'>('tabla');
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState<number>(0);
  const [copiedDashboardLink, setCopiedDashboardLink] = useState(false);

  // Fullscreen toggle state (defaults to true per user request)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    const saved = localStorage.getItem('unmsm_doc_modal_fullscreen');
    return saved !== null ? saved === 'true' : true;
  });

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => {
      const next = !prev;
      localStorage.setItem('unmsm_doc_modal_fullscreen', String(next));
      return next;
    });
  };

  // Sync to localStorage
  const saveDocsList = (updatedDocs: DocItem[]) => {
    setDocs(updatedDocs);
    try {
      localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(updatedDocs));
      localStorage.setItem(STORAGE_KEY_DOCS_V2, JSON.stringify(updatedDocs));
    } catch (e) {
      console.error('Error saving docs to localStorage', e);
    }
  };

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleAutoSaveDoc = (updatedDoc: DocItem) => {
    setDocs((prevDocs) => {
      let nextDocs: DocItem[];
      const exists = prevDocs.some((d) => d.id === updatedDoc.id);
      if (exists) {
        nextDocs = prevDocs.map((d) => (d.id === updatedDoc.id ? updatedDoc : d));
      } else {
        nextDocs = [updatedDoc, ...prevDocs];
      }
      try {
        localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(nextDocs));
        localStorage.setItem(STORAGE_KEY_DOCS_V2, JSON.stringify(nextDocs));
      } catch (e) {
        console.error('Error auto-saving doc', e);
      }
      return nextDocs;
    });

    if (activeSelectedDoc?.id === updatedDoc.id) {
      setActiveSelectedDoc(updatedDoc);
    }

    // Two-way synchronization with specialized viewers if applicable
    if (updatedDoc.id === 'doc-plan-gestion') {
      try {
        const saved = localStorage.getItem('unmsm_gxp_plan_de_gestion_v2_custom');
        let parsed = saved ? JSON.parse(saved) : null;
        if (parsed) {
          parsed.titulo = updatedDoc.title;
          if (updatedDoc.code) parsed.ceja = updatedDoc.code;
          if (updatedDoc.description) parsed.subtitulo = updatedDoc.description;
          localStorage.setItem('unmsm_gxp_plan_de_gestion_v2_custom', JSON.stringify(parsed));
          window.dispatchEvent(new CustomEvent('unmsm_plan_de_gestion_saved', { detail: parsed }));
        }
      } catch (e) {}
    } else if (updatedDoc.id === 'doc-bitacora') {
      try {
        const saved = localStorage.getItem('unmsm_gxp_bitacora_v2_custom');
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.titulo = updatedDoc.title;
          if (updatedDoc.code) parsed.ceja = updatedDoc.code;
          localStorage.setItem('unmsm_gxp_bitacora_v2_custom', JSON.stringify(parsed));
        }
      } catch (e) {}
    } else if (updatedDoc.id === 'doc-plan-cronograma') {
      try {
        const saved = localStorage.getItem('unmsm_gxp_cronograma_v2_custom');
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.titulo = updatedDoc.title;
          if (updatedDoc.code) parsed.ceja = updatedDoc.code;
          localStorage.setItem('unmsm_gxp_cronograma_v2_custom', JSON.stringify(parsed));
        }
      } catch (e) {}
    } else if (updatedDoc.id === 'doc-guia-001') {
      try {
        const saved = localStorage.getItem('unmsm_gxp_guia001_custom');
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.titulo = updatedDoc.title;
          if (updatedDoc.code) parsed.codigo = updatedDoc.code;
          localStorage.setItem('unmsm_gxp_guia001_custom', JSON.stringify(parsed));
        }
      } catch (e) {}
    }
  };

  const handleInlineContentChange = (docId: string, newContent: string) => {
    setDocs((prevDocs) => {
      const nextDocs = prevDocs.map((d) => (d.id === docId ? { ...d, content: newContent } : d));
      try {
        localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(nextDocs));
        localStorage.setItem(STORAGE_KEY_DOCS_V2, JSON.stringify(nextDocs));
      } catch (e) {
        console.error('Error auto-saving inline content', e);
      }
      return nextDocs;
    });
    setActiveSelectedDoc((prev) => (prev && prev.id === docId ? { ...prev, content: newContent } : prev));
  };

  const handleToggleDocPublic = (docId: string) => {
    const updated = docs.map((d) => {
      if (d.id === docId) {
        const nextPublic = !d.isPublic;
        showToast(nextPublic ? `"${d.title}" ahora es público institucionalmente.` : `"${d.title}" ahora es privado.`);
        return { ...d, isPublic: nextPublic };
      }
      return d;
    });
    saveDocsList(updated);
    if (activeSelectedDoc?.id === docId) {
      setActiveSelectedDoc((prev) => (prev ? { ...prev, isPublic: !prev.isPublic } : null));
    }
  };

  const handleCopyDocLink = (doc: DocItem) => {
    const url = doc.publicUrl || `https://racionalizacionogpl-coder.github.io/DOC_DE_GXP_UNMSM/docs/01-plan-de-gestion-v2.html#${doc.id}`;
    navigator.clipboard.writeText(url);
    showToast(`Enlace copiado al portapapeles: ${url}`);
  };

  const prevActiveDocRef = useRef<ActiveDocModal>(null);

  // Determine which doc or view to focus on based on activeDoc prop
  useEffect(() => {
    if (!activeDoc) return;

    if (prevActiveDocRef.current === activeDoc && activeSelectedDoc) {
      const currentInDocs = docs.find((d) => d.id === activeSelectedDoc.id);
      if (currentInDocs && currentInDocs !== activeSelectedDoc) {
        setActiveSelectedDoc(currentInDocs);
      }
      return;
    }
    prevActiveDocRef.current = activeDoc;

    if (activeDoc === 'plan-gestion') {
      const match = docs.find((d) => d.id === 'doc-plan-gestion' || d.category === 'gestion') || docs[0];
      setActiveSelectedDoc(match || null);
      setSelectedCategory('gestion');
    } else if (activeDoc === 'plan-cronograma') {
      const match = docs.find((d) => d.id === 'doc-plan-cronograma' || d.category === 'cronograma');
      setActiveSelectedDoc(match || null);
      setSelectedCategory('cronograma');
    } else if (activeDoc === 'bitacora') {
      const match = docs.find((d) => d.id === 'doc-bitacora' || d.category === 'bitacora');
      setActiveSelectedDoc(match || null);
      setSelectedCategory('bitacora');
    } else if (
      activeDoc === 'recursos' ||
      activeDoc === 'indicadores' ||
      activeDoc === 'anexo-4' ||
      activeDoc === 'doc-indicadores' ||
      activeDoc === 'doc-anexo-4'
    ) {
      const match =
        docs.find(
          (d) =>
            d.id === 'doc-indicadores' ||
            d.id === 'doc-anexo-4' ||
            d.id === 'doc-anexo-3' ||
            d.category === 'formatos' ||
            d.id === 'doc-anexo-1'
        );
      setActiveSelectedDoc(match || null);
      setSelectedCategory('formatos');
      setSpreadsheetFormat('indicadores');
    } else if (activeDoc === 'guia-001' || activeDoc === 'normativa' || activeDoc === 'doc-guia-001') {
      const match = docs.find((d) => d.id === 'doc-guia-001' || d.category === 'normativa');
      setActiveSelectedDoc(match || null);
      setSelectedCategory('normativa');
    } else if (
      activeDoc === 'dashboard' ||
      activeDoc === 'metricas' ||
      activeDoc === 'dashboard-20-facultades' ||
      activeDoc === 'dashboard_20_facultades' ||
      activeDoc.toLowerCase().includes('dashboard') ||
      activeDoc.toLowerCase().includes('facultad')
    ) {
      setSelectedCategory('dashboard');
      setActiveSelectedDoc(null);
    } else if (
      activeDoc === 'equipos' ||
      activeDoc === 'equipo' ||
      activeDoc === 'equipo-trabajo' ||
      activeDoc === 'equipo-de-trabajo' ||
      activeDoc.toLowerCase().includes('equipo')
    ) {
      setSelectedCategory('equipos');
      setActiveSelectedDoc(null);
    } else if (activeDoc.startsWith('doc-')) {
      const match = docs.find((d) => d.id === activeDoc);
      if (match) {
        setActiveSelectedDoc(match);
        setSelectedCategory(match.category);
      }
    } else {
      // Fallback default: show Plan de Gestión v2.0
      const defaultDoc = docs.find((d) => d.id === 'doc-plan-gestion') || docs[0];
      setActiveSelectedDoc(defaultDoc || null);
    }
  }, [activeDoc, docs, activeSelectedDoc]);

  useEffect(() => {
    if (activeSelectedDoc?.id === 'doc-anexo-3') {
      setSpreadsheetFormat('anexo3');
    } else if (activeSelectedDoc?.id === 'doc-anexo-1') {
      setSpreadsheetFormat('anexo1');
    }
  }, [activeSelectedDoc]);

  // Synchronize document state when Plan de Gestión v2.0 is saved
  useEffect(() => {
    const handlePlanSaved = (e: any) => {
      const planData = e.detail;
      if (!planData) return;
      setDocs((prevDocs) =>
        prevDocs.map((doc) => {
          if (doc.id === 'doc-plan-gestion') {
            return {
              ...doc,
              title: planData.titulo || doc.title,
              description: planData.subtitulo || doc.description,
              code: planData.ceja || doc.code,
              date: new Date().toLocaleDateString('es-PE'),
            };
          }
          return doc;
        })
      );
      setActiveSelectedDoc((prev) => {
        if (prev?.id === 'doc-plan-gestion') {
          return {
            ...prev,
            title: planData.titulo || prev.title,
            description: planData.subtitulo || prev.description,
            code: planData.ceja || prev.code,
            date: new Date().toLocaleDateString('es-PE'),
          };
        }
        return prev;
      });
    };

    window.addEventListener('unmsm_plan_de_gestion_saved', handlePlanSaved);
    return () => {
      window.removeEventListener('unmsm_plan_de_gestion_saved', handlePlanSaved);
    };
  }, []);

  // Listen for direct navigation events to documents (e.g. from Plan de Gestión hyperlinks)
  useEffect(() => {
    const handleNavigate = (e: any) => {
      const docId = e.detail;
      if (!docId) return;
      const target = docs.find((d) => d.id === docId);
      if (target) {
        setSelectedCategory(target.category);
        setActiveSelectedDoc(target);
        if (docId === 'doc-anexo-1') {
          setSpreadsheetFormat('anexo1');
        } else if (docId === 'doc-anexo-3') {
          setSpreadsheetFormat('anexo3');
        }
      }
    };
    window.addEventListener('unmsm_navigate_to_doc', handleNavigate);
    return () => {
      window.removeEventListener('unmsm_navigate_to_doc', handleNavigate);
    };
  }, [docs]);

  // Tab definitions with icons and default document mapping
  const CATEGORY_TABS: {
    id: string;
    label: string;
    docId?: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'todos', label: 'Todos los Documentos', icon: FolderOpen },
    { id: 'gestion', label: 'Plan de Gestión', docId: 'doc-plan-gestion', icon: FileText },
    { id: 'cronograma', label: 'Cronograma', docId: 'doc-plan-cronograma', icon: Calendar },
    { id: 'bitacora', label: 'Bitácora', docId: 'doc-bitacora', icon: Clock },
    { id: 'formatos', label: 'Formatos & Anexos', docId: 'doc-anexo-3', icon: FileSpreadsheet },
    { id: 'normativa', label: 'Normativas & Guías', docId: 'doc-guia-001', icon: BookOpen },
    { id: 'dashboard', label: 'Dashboard 20 Facultades', icon: BarChart3 },
    { id: 'equipos', label: 'Equipo de Trabajo', icon: Users },
  ];

  // Handler to immediately present the respective document when clicking a category box
  const handleCategoryTabClick = (catId: string, defaultDocId?: string) => {
    setSelectedCategory(catId);
    setSearchTerm('');

    if (catId === 'dashboard') {
      setActiveSelectedDoc(null);
      return;
    }

    if (catId === 'equipos') {
      setActiveSelectedDoc(null);
      return;
    }

    if (defaultDocId) {
      const match = docs.find((d) => d.id === defaultDocId);
      if (match) {
        setActiveSelectedDoc(match);
        setTimeout(() => {
          document.getElementById('doc-content-viewer-panel')?.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
        return;
      }
    }

    if (catId !== 'todos') {
      const firstInCat = docs.find((d) => d.category === catId);
      if (firstInCat) {
        setActiveSelectedDoc(firstInCat);
        setTimeout(() => {
          document.getElementById('doc-content-viewer-panel')?.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
      }
    } else {
      if (!activeSelectedDoc) {
        const defaultDoc = docs.find((d) => d.id === 'doc-plan-gestion') || docs[0];
        if (defaultDoc) setActiveSelectedDoc(defaultDoc);
      }
    }
  };

  if (!activeDoc) return null;

  // Handlers for Document Editing & Rewriting
  const handleOpenEdit = (docToEdit: DocItem) => {
    setEditingTargetDoc(docToEdit);
    setIsNewDoc(false);
    setEditorOpen(true);
  };

  const handleOpenNew = () => {
    setEditingTargetDoc(null);
    setIsNewDoc(true);
    setEditorOpen(true);
  };

  const handleSaveDoc = (updatedDoc: DocItem) => {
    let newDocs: DocItem[];
    if (isNewDoc) {
      newDocs = [updatedDoc, ...docs];
      showToast(`Documento "${updatedDoc.title}" creado exitosamente.`);
    } else {
      newDocs = docs.map((d) => (d.id === updatedDoc.id ? updatedDoc : d));
      showToast(`Documento "${updatedDoc.title}" actualizado.`);
    }
    saveDocsList(newDocs);
    setActiveSelectedDoc(updatedDoc);
    setEditorOpen(false);
  };

  const handleDeleteDoc = (docId: string) => {
    // 1. Immediately register in deleted IDs list so it permanently persists and is never restored
    try {
      const savedDeleted = localStorage.getItem(STORAGE_KEY_DELETED_DOCS);
      const deletedArr: string[] = savedDeleted ? JSON.parse(savedDeleted) : [];
      if (!deletedArr.includes(docId)) {
        deletedArr.push(docId);
        localStorage.setItem(STORAGE_KEY_DELETED_DOCS, JSON.stringify(deletedArr));
      }
    } catch (e) {
      console.error('Error saving deleted doc ID', e);
    }

    // 2. Filter from state and auto-save to storage
    const newDocs = docs.filter((d) => d.id !== docId);
    saveDocsList(newDocs);

    // 3. Update current active selected document
    if (activeSelectedDoc && activeSelectedDoc.id === docId) {
      setActiveSelectedDoc(newDocs[0] || null);
    }

    setEditorOpen(false);
    showToast('Documento eliminado correctamente y guardado automáticamente.');
  };

  const handleResetDocs = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_DELETED_DOCS);
    } catch (e) {
      console.error(e);
    }
    saveDocsList(INITIAL_DOCS);
    setActiveSelectedDoc(INITIAL_DOCS[0]);
    showToast('Documentos restablecidos a la versión original de la OGP.');
  };

  const handleUpdateMember = (id: string, field: keyof TeamMember, val: string) => {
    const updated = teamMembers.map((m) => (m.id === id ? { ...m, [field]: val } : m));
    setTeamMembers(updated);
    localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(updated));
    showToast('Integrante del equipo actualizado.');
  };

  const handleAddMember = () => {
    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: 'Nuevo Integrante',
      role: 'Especialista / Coordinador',
      department: 'Oficina General de Planificación',
      status: 'Activo',
    };
    const updated = [...teamMembers, newMember];
    setTeamMembers(updated);
    localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(updated));
    showToast('Nuevo integrante añadido al equipo.');
  };

  const handleDeleteMember = (id: string) => {
    const updated = teamMembers.filter((m) => m.id !== id);
    setTeamMembers(updated);
    localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(updated));
    showToast('Integrante eliminado.');
  };

  const handleResetTeam = () => {
    setTeamMembers(DEFAULT_TEAM_MEMBERS);
    localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(DEFAULT_TEAM_MEMBERS));
    showToast('Equipo restablecido a valores originales.');
  };

  const filteredFaculties = UNMSM_FACULTIES.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDocs = docs.filter((d) => {
    const matchesCategory =
      selectedCategory === 'todos' || d.category === selectedCategory;
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.code && d.code.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const isSpecialView =
    activeDoc === 'dashboard' ||
    activeDoc === 'metricas' ||
    activeDoc === 'sistemas' ||
    activeDoc === 'soluciones' ||
    activeDoc === 'equipos' ||
    activeDoc === 'novedades' ||
    activeDoc === 'eventos';

  return (
    <>
      <div
        id="doc-modal-backdrop"
        className={`fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center transition-all duration-200 ${
          isFullscreen ? 'p-0 overflow-hidden' : 'p-2 sm:p-4 backdrop-blur-xs overflow-y-auto'
        }`}
        onClick={onClose}
      >
        <div
          id="doc-modal-card"
          className={`bg-white shadow-2xl flex flex-col overflow-hidden border border-slate-200 transition-all duration-200 ${
            isFullscreen
              ? 'w-full h-full max-w-none max-h-none rounded-none fixed inset-0 z-50'
              : 'rounded-2xl max-w-7xl w-full max-h-[92vh] animate-in fade-in zoom-in-95 duration-150'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main Top Header */}
          <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center bg-slate-50 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-poppins text-slate-900 flex items-center gap-2">
                  <EditableText
                    storageKey="header_doc_modal_title"
                    defaultText="Centro de Documentación y Gestión de Procesos"
                    className="font-bold"
                    showIconOnHover={true}
                  />
                  <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full shrink-0">
                    {docs.length} documentos
                  </span>
                  {isFullscreen && (
                    <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md hidden sm:inline-block">
                      Pantalla Completa
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500">
                  UNMSM · Oficina General de Planificación (OGP) · Edición y Control Oficial
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenNew}
                id="btn-nuevo-documento"
                className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                title="Crear un nuevo documento, anexo o directriz"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Documento</span>
              </button>

              <button
                onClick={handleResetDocs}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Restablecer todos los documentos originales"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Fullscreen Toggle Button */}
              <button
                onClick={toggleFullscreen}
                id="btn-toggle-fullscreen-doc-modal"
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isFullscreen
                    ? 'text-sky-700 bg-sky-100 hover:bg-sky-200'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                }`}
                title={isFullscreen ? 'Salir de pantalla completa' : 'Abrir a pantalla completa'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                id="close-doc-modal-btn"
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader: Category Navigation & Search */}
          <div className="px-5 py-2.5 bg-slate-100/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {CATEGORY_TABS.map((cat) => (
                <button
                  key={cat.id}
                  id={`btn-tab-${cat.id}`}
                  onClick={() => handleCategoryTabClick(cat.id, cat.docId)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 select-none active:scale-[0.98] ${
                    selectedCategory === cat.id
                      ? 'bg-sky-700 text-white shadow-xs border border-sky-800 ring-2 ring-sky-400/40'
                      : 'bg-white/90 text-slate-700 hover:text-slate-950 hover:bg-white border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs'
                  }`}
                  title={`Presentar de inmediato: ${cat.label}`}
                >
                  <cat.icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      selectedCategory === cat.id ? 'text-white' : 'text-slate-500'
                    }`}
                  />
                  <span>{cat.label}</span>
                  {cat.docId && selectedCategory === cat.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse ml-0.5" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {selectedCategory !== 'dashboard' && selectedCategory !== 'equipos' && (
                <button
                  id="btn-toggle-doc-sidebar"
                  onClick={toggleSidebar}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 select-none text-xs active:scale-[0.98] ${
                    isSidebarHidden
                      ? 'bg-sky-700 text-white border border-sky-800 shadow-xs ring-2 ring-sky-400/40'
                      : 'bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50 border border-slate-200 shadow-2xs'
                  }`}
                  title={isSidebarHidden ? 'Mostrar panel lateral con lista de documentos' : 'Ocultar panel lateral para ampliar área de lectura'}
                >
                  {isSidebarHidden ? (
                    <>
                      <PanelLeftOpen className="w-3.5 h-3.5 text-white" />
                      <span>Mostrar Lista ({filteredDocs.length})</span>
                    </>
                  ) : (
                    <>
                      <PanelLeftClose className="w-3.5 h-3.5 text-slate-500" />
                      <span className="hidden sm:inline">Ocultar Lista</span>
                    </>
                  )}
                </button>
              )}

              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar documento o texto..."
                  className="w-full pl-8 pr-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Modal Main Body */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* If Dashboard view is selected */}
            {selectedCategory === 'dashboard' ? (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#eef1f5]">
                {/* Header Banner Institucional - Paleta Navy Oficial, Acento Dorado, Azul Acero */}
                <div className="banner-navy-gradient text-white rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden border-b-2 border-b-[#b8933f]/40">
                  <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 space-y-3">
                    {/* Top Badges Row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="btn-banner-neutral inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium">
                        <BarChart3 className="w-3.5 h-3.5 text-white/80" />
                        Tablero Oficial · Monitoreo Fase 1
                      </span>

                      <span className="chip-gold-accent inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold">
                        <Lock className="w-3.5 h-3.5 text-[#d9b872]" />
                        Privado
                      </span>

                      <span className="btn-banner-neutral text-xs px-2.5 py-1 rounded-lg font-medium text-white/80">
                        20 Facultades UNMSM
                      </span>
                    </div>

                    {/* Main Row: Title & Action Controls */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                          <EditableText
                            storageKey="header_dashboard_modal_title"
                            defaultText="Dashboard de Avance: 20 Facultades UNMSM"
                            className="font-extrabold text-white text-2xl lg:text-3xl tracking-tight"
                            showIconOnHover={true}
                          />
                        </h3>
                        <p className="text-xs sm:text-sm text-white/72 mt-1.5 max-w-3xl leading-relaxed">
                          Tablero institucional de control y seguimiento del inventario de procesos (Anexo 1), fichas de caracterización (Anexo 3) y diseño de indicadores (Anexo 4).
                        </p>
                      </div>

                      {/* Controls Bar */}
                      <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
                        <span className="chip-gold-accent px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold">
                          v2.0
                        </span>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(OFFICIAL_DASHBOARD_URL);
                            showToast('¡Enlace del dashboard copiado al portapapeles!');
                          }}
                          className="btn-banner-neutral inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer"
                          title="Copiar enlace del dashboard"
                        >
                          <Copy className="w-4 h-4" />
                          Copiar enlace
                        </button>

                        <a
                          href={OFFICIAL_DASHBOARD_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-steel-blue-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium cursor-pointer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Ver web oficial
                        </a>

                        <button
                          onClick={() => {
                            showToast('¡Datos del dashboard sincronizados con la auditoría!');
                          }}
                          className="btn-banner-neutral p-2 rounded-xl text-xs text-white/70 hover:text-white cursor-pointer"
                          title="Actualizar datos del tablero"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5 KPI Metric Summary Cards - Always visible */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">% Avance Fase 1</span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-blue-600">65,2%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">Cierre: 30 Set. 2026</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">% Inventario (Anexo 1)</span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-indigo-600">68,0%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">Inventario consolidado</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">% Fichas (Anexo 3)</span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-emerald-600">66,4%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">Caracterización</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">% Indicadores (Anexo 4)</span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-amber-600">40,4%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">Fórmulas y metas</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between col-span-2 sm:col-span-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Facultades</span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-slate-800">20</span>
                      <span className="text-xs font-semibold text-slate-500">/ 20</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1">100% bajo monitoreo</span>
                  </div>
                </div>

                {/* Sub-toolbar with view switcher, copy link, and refresh */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200 text-xs shadow-2xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDashboardViewMode('tablero')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        dashboardViewMode === 'tablero'
                          ? 'bg-sky-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Tablero en Vivo (Oficial)</span>
                    </button>
                    <button
                      onClick={() => setDashboardViewMode('tabla')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        dashboardViewMode === 'tabla'
                          ? 'bg-sky-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Tabla 20 Facultades ({filteredFaculties.length})</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={OFFICIAL_DASHBOARD_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden lg:flex items-center gap-1.5 text-[11px] text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-lg font-mono truncate max-w-xs transition-colors"
                      title="Haga clic para ir al enlace oficial"
                    >
                      <Globe className="w-3 h-3 text-sky-600 shrink-0" />
                      <span className="truncate">racionalizacionogpl-coder.github.io/.../Dashboard.html</span>
                      <ExternalLink className="w-3 h-3 text-sky-500 shrink-0" />
                    </a>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(OFFICIAL_DASHBOARD_URL);
                        setCopiedDashboardLink(true);
                        showToast('Enlace copiado al portapapeles');
                        setTimeout(() => setCopiedDashboardLink(false), 2500);
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      title="Copiar enlace oficial al portapapeles"
                    >
                      {copiedDashboardLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copiar enlace</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setDashboardRefreshKey((prev) => prev + 1);
                        showToast('Tablero de control actualizado');
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      title="Recargar panel interactivo"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Recargar</span>
                    </button>
                  </div>
                </div>

                {dashboardViewMode === 'tablero' ? (
                  /* Live Embedded Dashboard View */
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    {/* Notice bar with quick link */}
                    <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-semibold text-slate-800">Panel Oficial de Control · UNMSM OGPL:</span>
                        <span className="text-slate-500 hidden sm:inline">
                          Interactúa con los filtros y gráficos o pulsa para abrir la versión externa.
                        </span>
                      </div>
                      <a
                        href={OFFICIAL_DASHBOARD_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 underline underline-offset-2 ml-auto cursor-pointer"
                      >
                        <span>Ir a la web del Dashboard</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="w-full h-[680px] md:h-[780px] lg:h-[840px] relative bg-[#e8eef3]">
                      <iframe
                        key={dashboardRefreshKey}
                        src={OFFICIAL_DASHBOARD_URL}
                        title="Dashboard Gestion por Procesos - OGPL UNMSM"
                        className="w-full h-full border-0"
                        allow="fullscreen; clipboard-read; clipboard-write"
                        loading="eager"
                      />
                    </div>
                  </div>
                ) : (
                  /* 20 Faculties Table View */
                  <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Facultad</th>
                          <th className="px-4 py-3 text-center">Estado</th>
                          <th className="px-4 py-3 text-center">Avance Fase 1</th>
                          <th className="px-4 py-3 text-center">Anexo 3</th>
                          <th className="px-4 py-3 text-center">Anexo 4</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredFaculties.map((fac, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-4 py-2.5 font-medium text-slate-900 flex items-center gap-2">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              {fac.name}
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  fac.status === 'Líder'
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : fac.status === 'Avanzado'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : fac.status === 'En progreso'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {fac.status}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span className="font-semibold text-slate-800 w-8 text-right">{fac.progress}%</span>
                                <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-blue-600 h-full rounded-full"
                                    style={{ width: `${fac.progress}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-2.5 text-center font-medium text-slate-600">{fac.annex3}</td>
                            <td className="px-4 py-2.5 text-center font-medium text-slate-600">{fac.annex4}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : selectedCategory === 'equipos' ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#eef1f5]">
                {/* Header Banner Institucional - Paleta Navy Oficial, Acento Dorado, Azul Acero */}
                <div className="banner-navy-gradient text-white rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden border-b-2 border-b-[#b8933f]/40">
                  <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 space-y-3">
                    {/* Top Badges Row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="btn-banner-neutral inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium">
                        <Users className="w-3.5 h-3.5 text-white/80" />
                        Estructura Institucional · Gestión por Procesos
                      </span>

                      <span className="chip-gold-accent inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold">
                        <Lock className="w-3.5 h-3.5 text-[#d9b872]" />
                        Privado
                      </span>

                      <span className="btn-banner-neutral text-xs px-2.5 py-1 rounded-lg font-medium text-white/80">
                        {teamMembers.length} Miembros Activos
                      </span>
                    </div>

                    {/* Main Row: Title & Action Controls */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                          <EditableText
                            storageKey="header_team_modal_title"
                            defaultText="Equipo de Trabajo - Gestión por Procesos (OGP)"
                            className="font-extrabold text-white text-2xl lg:text-3xl tracking-tight"
                            showIconOnHover={true}
                          />
                        </h3>
                        <p className="text-xs sm:text-sm text-white/72 mt-1.5 max-w-3xl leading-relaxed">
                          <EditableText
                            storageKey="header_team_modal_desc"
                            defaultText="Líderes, coordinadores y especialistas responsables de la modernización institucional y gestión por procesos en las 20 facultades."
                            className="text-white/72"
                            showIconOnHover={true}
                          />
                        </p>
                      </div>

                      {/* Controls Bar */}
                      <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
                        <span className="chip-gold-accent px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold">
                          OGP
                        </span>

                        <button
                          onClick={handleAddMember}
                          className="btn-steel-blue-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium cursor-pointer"
                          title="Añadir nuevo miembro al equipo"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Añadir Miembro</span>
                        </button>

                        <a
                          href="https://ogpl.unmsm.edu.pe"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-banner-neutral inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Web OGPL
                        </a>

                        <button
                          onClick={handleResetTeam}
                          className="btn-banner-neutral p-2 rounded-xl text-xs text-white/70 hover:text-white cursor-pointer"
                          title="Restablecer integrantes a valores originales"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-shadow relative group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {member.status}
                          </span>
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Eliminar del equipo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-1 mt-1">
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleUpdateMember(member.id, 'name', e.target.value)}
                            className="w-full text-sm font-bold text-slate-900 bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent hover:border-slate-200 focus:border-indigo-400 focus:outline-none transition-all"
                            title="Haz clic para editar nombre"
                          />
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => handleUpdateMember(member.id, 'role', e.target.value)}
                            className="w-full text-xs font-semibold text-indigo-700 bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent hover:border-slate-200 focus:border-indigo-400 focus:outline-none transition-all"
                            title="Haz clic para editar cargo"
                          />
                          <input
                            type="text"
                            value={member.department}
                            onChange={(e) => handleUpdateMember(member.id, 'department', e.target.value)}
                            className="w-full text-[11px] text-slate-500 bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent hover:border-slate-200 focus:border-indigo-400 focus:outline-none transition-all"
                            title="Haz clic para editar dependencia"
                          />
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>UNMSM · OGP</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Edit3 className="w-2.5 h-2.5" /> editable
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Two-Column Document Manager: Sidebar List + Detail & Edit View */
              <>
                {/* Left: Document List Sidebar */}
                {!isSidebarHidden && (
                  <div
                    id="doc-modal-sidebar-list"
                    className="w-full md:w-80 border-r border-slate-200 overflow-y-auto bg-slate-50/50 p-3 space-y-2 shrink-0 max-h-60 md:max-h-none transition-all duration-200 animate-in fade-in slide-in-from-left-2"
                  >
                    <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <TableIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>Lista ({filteredDocs.length})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={handleOpenNew}
                          className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-0.5 cursor-pointer px-1.5 py-0.5 rounded hover:bg-emerald-50 transition-colors"
                          title="Crear un nuevo documento"
                        >
                          <Plus className="w-3 h-3" /> Nuevo
                        </button>
                        <button
                          onClick={() => setSidebarHiddenWithStorage(true)}
                          id="btn-hide-doc-sidebar"
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
                          title="Ocultar este panel lateral (Lista de documentos)"
                        >
                          <PanelLeftClose className="w-3.5 h-3.5 text-slate-500" />
                          <span className="hidden sm:inline">Ocultar</span>
                        </button>
                      </div>
                    </div>

                  {filteredDocs.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No se encontraron documentos con este criterio.
                    </div>
                  ) : (
                    filteredDocs.map((item) => {
                      const isSelected = activeSelectedDoc?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setActiveSelectedDoc(item)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer group text-left ${
                            isSelected
                              ? 'bg-white border-sky-400 shadow-md ring-1 ring-sky-300'
                              : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                              {item.code || item.category}
                            </span>
                            <span className="text-slate-400">{item.date}</span>
                          </div>
                          <h4 className="font-bold text-xs text-slate-800 group-hover:text-sky-700 line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                            {item.description}
                          </p>

                          {/* Quick Hover Controls */}
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-medium">{item.type}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEdit(item);
                                }}
                                className="text-sky-600 hover:text-sky-800 flex items-center gap-0.5 font-semibold"
                                title="Editar o reescribir"
                              >
                                <Edit3 className="w-3 h-3" /> Editar
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDoc(item.id);
                                }}
                                className="p-1 text-rose-500 hover:text-white hover:bg-rose-600 rounded-md transition-all cursor-pointer"
                                title={`Eliminar "${item.title}"`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

                {/* Right: Active Document Full Content & Rewrite/Edit Panel */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between bg-[#eef1f5]" id="doc-content-viewer-panel">
                  {/* Option to restore the hidden sidebar / list */}
                  {isSidebarHidden && (
                    <div
                      id="banner-restore-doc-sidebar"
                      className="mb-4 bg-white/95 backdrop-blur-xs border border-sky-200/80 px-3.5 py-2.5 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150 shrink-0"
                    >
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => setSidebarHiddenWithStorage(false)}
                          id="btn-restore-doc-sidebar"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                          title="Volver a poner la lista de documentos"
                        >
                          <PanelLeftOpen className="w-3.5 h-3.5" />
                          <span>Volver a poner lista ({filteredDocs.length})</span>
                        </button>
                        <span className="text-xs text-slate-600 font-medium hidden sm:inline">
                          El panel lateral está oculto para ampliar la vista del documento.
                        </span>
                      </div>
                      {activeSelectedDoc && (
                        <span className="text-[11px] font-semibold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100 truncate max-w-xs">
                          {activeSelectedDoc.title}
                        </span>
                      )}
                    </div>
                  )}

                  {activeSelectedDoc ? (
                    activeSelectedDoc.id === 'doc-guia-001' ||
                    activeSelectedDoc.code?.includes('001-2025-OGPL') ||
                    activeSelectedDoc.category === 'normativa' ||
                    activeSelectedDoc.title?.includes('Guía Práctica') ? (
                      <GuiaPractica001Viewer
                        onOpenFullEditor={() => handleOpenEdit(activeSelectedDoc)}
                      />
                    ) : activeSelectedDoc.id === 'doc-plan-gestion' ||
                    activeSelectedDoc.code?.includes('PGP-UNMSM') ||
                    activeSelectedDoc.category === 'gestion' ? (
                      <PlanDeGestionV2Viewer
                        onOpenFullEditor={() => handleOpenEdit(activeSelectedDoc)}
                        onNavigateToDoc={(docId) => {
                          const target = docs.find((d) => d.id === docId);
                          if (target) {
                            setSelectedCategory(target.category);
                            setActiveSelectedDoc(target);
                            if (docId === 'doc-anexo-1') {
                              setSpreadsheetFormat('anexo1');
                            } else if (docId === 'doc-anexo-3') {
                              setSpreadsheetFormat('anexo3');
                            }
                          }
                        }}
                        onSaveDocPlan={(updatedPlan) => {
                          handleAutoSaveDoc({
                            ...activeSelectedDoc,
                            title: updatedPlan.titulo,
                            description: updatedPlan.subtitulo,
                            code: updatedPlan.ceja,
                            date: new Date().toLocaleDateString('es-PE'),
                          });
                          showToast('¡Plan de Gestión guardado obligatoriamente en el sistema!');
                        }}
                      />
                    ) : activeSelectedDoc.id === 'doc-bitacora' ||
                      activeSelectedDoc.category === 'bitacora' ||
                      activeSelectedDoc.code?.includes('Bitácora') ||
                      activeSelectedDoc.code?.includes('D3') ? (
                      <BitacoraV2Viewer
                        onOpenFullEditor={() => handleOpenEdit(activeSelectedDoc)}
                      />
                    ) : activeSelectedDoc.id === 'doc-plan-cronograma' ||
                      activeSelectedDoc.category === 'cronograma' ||
                      activeSelectedDoc.code?.includes('Cronograma') ||
                      activeSelectedDoc.code?.includes('D2') ||
                      activeSelectedDoc.code?.includes('CRONO') ? (
                      <CronogramaV2Viewer
                        onOpenFullEditor={() => handleOpenEdit(activeSelectedDoc)}
                      />
                    ) : (
                      <div className="space-y-5">
                        {/* 1. Header & Institutional Banner (Unified Gradient Structure matching Cronograma) */}
                        <div className="banner-navy-gradient text-white rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden border-b-2 border-b-[#b8933f]/40">
                          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                          <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="btn-banner-neutral inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium">
                                  <FileSpreadsheet className="w-3.5 h-3.5 text-white/80" />
                                  {activeSelectedDoc.code || 'DOC-UNMSM'} · Formato Oficial
                                </span>

                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                  {activeSelectedDoc.status || 'Aprobado'}
                                </span>

                                <button
                                  onClick={() => handleToggleDocPublic(activeSelectedDoc.id)}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                                    activeSelectedDoc.isPublic
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30'
                                      : 'chip-gold-accent hover:brightness-110'
                                  }`}
                                  title="Alternar visibilidad pública del documento"
                                >
                                  {activeSelectedDoc.isPublic ? (
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

                              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                                {activeSelectedDoc.title}
                                <span className="chip-gold-accent px-2 py-0.5 rounded text-xs font-mono font-bold">
                                  {activeSelectedDoc.code?.includes('ANEXO') ? 'SIGPRO' : 'v2.0'}
                                </span>
                              </h1>

                              {activeSelectedDoc.description && (
                                <p className="text-xs sm:text-sm text-white/72 mt-1.5 max-w-3xl leading-relaxed">
                                  {activeSelectedDoc.description}
                                </p>
                              )}

                              <div className="flex items-center gap-3 mt-3 text-xs text-white/60 flex-wrap">
                                <span><strong className="text-white/80">Responsable:</strong> {activeSelectedDoc.author}</span>
                                <span>•</span>
                                <span><strong className="text-white/80">Fecha:</strong> {activeSelectedDoc.date}</span>
                                <span>•</span>
                                <span>{activeSelectedDoc.type} · {activeSelectedDoc.size || 'Oficial'}</span>
                              </div>
                            </div>

                            {/* Action buttons toolbar */}
                            <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
                              <button
                                onClick={() => handleCopyDocLink(activeSelectedDoc)}
                                className="btn-banner-neutral inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer"
                                title="Copiar enlace oficial público"
                              >
                                <Copy className="w-4 h-4" />
                                Copiar enlace
                              </button>

                              {(activeSelectedDoc.googleSheetUrl ||
                                activeSelectedDoc.id === 'doc-anexo-1' ||
                                activeSelectedDoc.id === 'doc-anexo-3' ||
                                activeSelectedDoc.id === 'doc-indicadores' ||
                                activeSelectedDoc.category === 'formatos') && (
                                <a
                                  href={currentSpreadsheetUrl || activeSelectedDoc.googleSheetUrl || ANEXO1_GOOGLE_SHEET_URL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  id="btn-header-redireccion-sheets"
                                  className="btn-steel-blue-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium cursor-pointer"
                                  title="Abrir Hoja de Cálculo oficial en Google Sheets"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Hoja de cálculo ↗
                                </a>
                              )}

                              <button
                                onClick={() => handleOpenEdit(activeSelectedDoc)}
                                id="btn-editar-documento-activo"
                                className="btn-banner-neutral inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4" />
                                Modo edición
                              </button>

                              <button
                                type="button"
                                id="btn-eliminar-documento-activo"
                                onClick={() => handleDeleteDoc(activeSelectedDoc.id)}
                                className="p-2 rounded-xl text-xs text-rose-300 hover:text-white hover:bg-rose-600/50 transition-all cursor-pointer"
                                title={`Eliminar documento "${activeSelectedDoc.title}"`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Full Document Text / Markdown Body / Spreadsheet Content Recuadro */}
                        <div
                          id="recuadro-contenido-documento"
                          className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 shadow-2xs"
                        >
                          {/* PARTE SUPERIOR: REDIRECCIÓN A LA HOJA DE CÁLCULO */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-slate-200/90">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              {/* PRIORITARIO: REDIRECCIÓN A LA HOJA DE CÁLCULO */}
                              <a
                                href={currentSpreadsheetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                id="btn-redireccion-hoja-calculo-recuadro"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold rounded-xl text-xs shadow-xs hover:shadow transition-all group cursor-pointer ring-2 ring-emerald-500/20"
                                title={`Abrir Hoja de Cálculo Oficial en Google Sheets (${
                                  currentDocFormat === 'indicadores'
                                    ? 'Reporte de Indicadores: 35 Hojas'
                                    : currentDocFormat === 'anexo1'
                                    ? 'Anexo 1: Inventario'
                                    : 'Anexo 3: Fichas Técnicas'
                                })`}
                              >
                                <FileSpreadsheet className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform shrink-0" />
                                <span className="tracking-wide">
                                  Redirección a la Hoja de Cálculo ({
                                    currentDocFormat === 'indicadores'
                                      ? 'Reporte de Indicadores · 35 Hojas'
                                      : currentDocFormat === 'anexo1'
                                      ? 'Anexo 1'
                                      : 'Anexo 3'
                                  })
                                </span>
                                <ExternalLink className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                              </a>

                              {/* CONFIGURAR / EDITAR ENLACE ESPECÍFICO */}
                              <button
                                type="button"
                                onClick={() => {
                                  setTempSheetUrl(currentSpreadsheetUrl);
                                  setIsEditingSheetUrl(!isEditingSheetUrl);
                                }}
                                id="btn-editar-enlace-hoja-calculo"
                                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                  isEditingSheetUrl
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                                    : 'bg-white text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 border-slate-200 shadow-2xs'
                                }`}
                                title={`Editar o pegar enlace de Google Sheets para ${
                                  currentDocFormat === 'indicadores'
                                    ? 'Reporte de Indicadores'
                                    : currentDocFormat === 'anexo1'
                                    ? 'Anexo 1'
                                    : 'Anexo 3'
                                }`}
                              >
                                <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="font-medium">
                                  {isEditingSheetUrl ? 'Cerrar' : 'Editar Enlace'}
                                </span>
                              </button>

                              {currentDocFormat === 'anexo3' && (
                                <button
                                  type="button"
                                  onClick={handleExportAnexo3CSV}
                                  className="px-3 py-2 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs font-semibold transition-colors"
                                  title="Exportar Anexo 3 en formato CSV"
                                >
                                  <Download className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Exportar CSV</span>
                                </button>
                              )}
                            </div>

                            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span>
                                Conexión activa · {
                                  currentDocFormat === 'indicadores'
                                    ? 'Reporte de Indicadores (35 Hojas)'
                                    : currentDocFormat === 'anexo1'
                                    ? 'Anexo 1'
                                    : 'Anexo 3'
                                }
                              </span>
                            </div>
                          </div>

                          {/* BARRA FLOTANTE DE CONFIGURACIÓN DE ENLACE */}
                          {isEditingSheetUrl && (
                            <div className="mb-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl shadow-xs">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <span className="text-xs font-bold text-emerald-900 whitespace-nowrap">
                                  Enlace Google Sheets ({
                                    currentDocFormat === 'indicadores'
                                      ? 'Reporte de Indicadores'
                                      : currentDocFormat === 'anexo1'
                                      ? 'Anexo 1'
                                      : 'Anexo 3'
                                  }):
                                </span>
                                <input
                                  type="url"
                                  value={tempSheetUrl}
                                  onChange={(e) => setTempSheetUrl(e.target.value)}
                                  placeholder="https://docs.google.com/spreadsheets/d/.../edit?usp=sharing"
                                  className="flex-1 px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                                />
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    type="button"
                                    onClick={handleSaveSheetUrl}
                                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-2xs"
                                  >
                                    Guardar Enlace
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setIsEditingSheetUrl(false)}
                                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-600 font-semibold text-xs rounded-lg border border-slate-200 transition-all cursor-pointer"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* CONTENIDO ÚNICO: MATRIZ DE DATOS */}
                          {activeSelectedDoc.id === 'doc-indicadores' ||
                          activeSelectedDoc.id === 'doc-anexo-4' ||
                          activeSelectedDoc.id === 'doc-anexo-3' ||
                          activeSelectedDoc.id === 'doc-anexo-1' ||
                          activeSelectedDoc.category === 'formatos' ||
                          activeSelectedDoc.code?.includes('ANEXO') ||
                          activeSelectedDoc.title?.toLowerCase().includes('anexo') ||
                          activeSelectedDoc.title?.toLowerCase().includes('indicador') ||
                          Boolean(activeSelectedDoc.googleSheetUrl) ? (
                            currentDocFormat === 'indicadores' ? (
                              <ReporteIndicadoresSpreadsheetViewer
                                customGoogleSheetUrl={indicadoresSheetUrl}
                                onOpenFullEditor={() => handleOpenEdit(activeSelectedDoc)}
                              />
                            ) : currentDocFormat === 'anexo3' ? (
                              <Anexo3SpreadsheetViewer
                                hideTopBar={true}
                                hideSubBar={false}
                                customGoogleSheetUrl={anexo3SheetUrl}
                                onOpenFullEditor={() => handleOpenEdit(activeSelectedDoc)}
                              />
                            ) : (
                              <Anexo1SpreadsheetViewer
                                hideTopBar={true}
                                customSheetUrl={anexo1SheetUrl}
                                onOpenFullEditor={() => handleOpenEdit(activeSelectedDoc)}
                              />
                            )
                          ) : (
                            <div>
                              <div className="text-xs uppercase font-bold text-slate-400 mb-3 flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-bold text-slate-700">
                                  <FileText className="w-4 h-4 text-sky-600" />
                                  Texto del Documento
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium flex items-center gap-1 shadow-2xs">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    Autoguardado activado
                                  </span>
                                  <button
                                    onClick={() => handleOpenEdit(activeSelectedDoc)}
                                    className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-semibold border border-sky-200 transition-colors flex items-center gap-1 cursor-pointer"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Reescribir / Editar</span>
                                  </button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <textarea
                                  value={activeSelectedDoc.content}
                                  onChange={(e) => handleInlineContentChange(activeSelectedDoc.id, e.target.value)}
                                  rows={Math.min(22, Math.max(8, activeSelectedDoc.content.split('\n').length + 2))}
                                  className="w-full p-4 bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-slate-800 font-mono text-xs sm:text-sm leading-relaxed rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none transition-all resize-y shadow-2xs"
                                  placeholder="Escribe o edita el contenido del documento aquí..."
                                />
                                <div className="text-[11px] text-slate-500 flex justify-between items-center px-1">
                                  <span className="flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 inline" />
                                    Los cambios se guardan de forma instantánea y persistente en el navegador.
                                  </span>
                                  <span>{activeSelectedDoc.content.length} caracteres</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400">
                      <FileText className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
                      <p className="text-sm font-medium text-slate-600">
                        Selecciona un documento para visualizarlo, editarlo o reescribirlo.
                      </p>
                      <button
                        onClick={handleOpenNew}
                        className="mt-3 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition-colors"
                      >
                        Crear nuevo documento
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-between items-center text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Universidad Nacional Mayor de San Marcos · Gestión por Procesos OGP</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors font-semibold cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-70 bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Full Document Editor Modal */}
      <DocumentEditorModal
        isOpen={editorOpen}
        doc={editingTargetDoc}
        isNew={isNewDoc}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveDoc}
        onAutoSave={handleAutoSaveDoc}
        onDelete={handleDeleteDoc}
      />
    </>
  );
};
