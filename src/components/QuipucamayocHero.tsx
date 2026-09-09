import React, { useState, useRef, useEffect, useCallback } from 'react';
import { HeroPool, HeroActionButton } from '../types';
import { PoolEditorModal } from './PoolEditorModal';
import { EditableText } from './EditableText';
import { FloatingKpiWidget } from './FloatingKpiWidget';
import {
  ArrowRight,
  BarChart3,
  Monitor,
  Users,
  FolderArchive,
  GripVertical,
  Plus,
  Edit3,
  RotateCcw,
  Sparkles,
  Move,
  Check,
  Activity,
  FileText,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Copy,
  Trash2,
  Sliders,
  Box,
  Minus,
  Maximize2,
  Minimize2,
  X,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
} from 'lucide-react';

interface QuipucamayocHeroProps {
  onExploreSystems?: () => void;
  onSelectNode?: (nodeKey: string) => void;
}

export interface IsometricAxisLine {
  id: string;
  type: 'solid' | 'dashed';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dx: number;
  dy: number;
  strokeWidth?: number;
}

export type Circle3DColor = 'purple' | 'green' | 'cyan' | 'blue';

export interface Movable3DCircle {
  id: string;
  name: string;
  x: number; // Desplazamiento X
  y: number; // Desplazamiento Y
  z: number; // Altura / Elevación eje Z (-150 a +320)
  rotation360: number; // Giro 360 grados (0 a 360)
  radius: number;
  color: Circle3DColor;
  isPrimary?: boolean;
  cubeKey?: CubeKey;
}

export const CIRCLE_3D_COLORS: Record<
  Circle3DColor,
  {
    name: string;
    hex: string;
    gradientId: string;
    filterId: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    strokeColor: string;
    ringColor: string;
  }
> = {
  purple: {
    name: 'Morado',
    hex: '#9333ea',
    gradientId: 'grad-3d-purple',
    filterId: 'circle-3d-glow-purple',
    bgClass: 'bg-purple-600',
    textClass: 'text-purple-600',
    borderClass: 'border-purple-300',
    strokeColor: '#9333ea',
    ringColor: '#c084fc',
  },
  green: {
    name: 'Verde',
    hex: '#16a34a',
    gradientId: 'grad-3d-green',
    filterId: 'circle-3d-glow-green',
    bgClass: 'bg-emerald-600',
    textClass: 'text-emerald-600',
    borderClass: 'border-emerald-300',
    strokeColor: '#16a34a',
    ringColor: '#4ade80',
  },
  cyan: {
    name: 'Celeste',
    hex: '#0284c7',
    gradientId: 'grad-3d-cyan',
    filterId: 'circle-3d-glow-cyan',
    bgClass: 'bg-sky-500',
    textClass: 'text-sky-600',
    borderClass: 'border-sky-300',
    strokeColor: '#0284c7',
    ringColor: '#38bdf8',
  },
  blue: {
    name: 'Azul',
    hex: '#2563eb',
    gradientId: 'grad-3d-blue',
    filterId: 'circle-3d-glow-blue',
    bgClass: 'bg-blue-600',
    textClass: 'text-blue-600',
    borderClass: 'border-blue-300',
    strokeColor: '#2563eb',
    ringColor: '#60a5fa',
  },
};

export const DEFAULT_PRIMARY_CIRCLE: Movable3DCircle = {
  id: 'circle-3d-primary',
  name: 'Círculo 3D Principal',
  x: 0,
  y: 0,
  z: 85,
  rotation360: 0,
  radius: 9,
  color: 'purple',
  isPrimary: true,
  cubeKey: 'purple',
};

const STORAGE_KEY_3D_CIRCLES = 'quipucamayoc_movable_3d_circles_v4';

export const DEFAULT_ISOMETRIC_LINES: IsometricAxisLine[] = [
  {
    id: 'line-dashed-default',
    type: 'dashed',
    x1: 100,
    y1: 180,
    x2: 900,
    y2: 480,
    dx: 0,
    dy: 0,
    strokeWidth: 3,
  },
  {
    id: 'line-solid-default',
    type: 'solid',
    x1: 200,
    y1: 460,
    x2: 800,
    y2: 150,
    dx: 0,
    dy: 0,
    strokeWidth: 3,
  },
];

const STORAGE_KEY_LINES = 'quipucamayoc_isometric_lines_v1';

export interface IsometricCubesPositions {
  center: { dx: number; dy: number };
  purple: { dx: number; dy: number };
  blue: { dx: number; dy: number };
  green: { dx: number; dy: number };
  cyan: { dx: number; dy: number };
  sphereCyan: { dx: number; dy: number };
  spherePurple: { dx: number; dy: number };
}

export interface IsometricElementsVisibility {
  center: boolean;
  purple: boolean;
  blue: boolean;
  green: boolean;
  cyan: boolean;
  sphereCyan: boolean;
  spherePurple: boolean;
}

export const DEFAULT_CUBES_VISIBILITY: IsometricElementsVisibility = {
  center: true,
  purple: true,
  blue: true,
  green: true,
  cyan: false, // Eliminado según selección del usuario (g:nth-of-type(8))
  sphereCyan: true,
  spherePurple: false, // Eliminado según selección del usuario (g:nth-of-type(10))
};

export const DEFAULT_CUBES_POSITIONS: IsometricCubesPositions = {
  center: { dx: 0, dy: 0 },
  purple: { dx: 0, dy: 0 },
  blue: { dx: 0, dy: 0 },
  green: { dx: 0, dy: 0 },
  cyan: { dx: 0, dy: 0 },
  sphereCyan: { dx: 0, dy: 0 },
  spherePurple: { dx: 0, dy: 0 },
};

export type CubeKey = 'center' | 'purple' | 'blue' | 'green' | 'cyan';

export interface CubeDimensions {
  widthScale: number; // Multiplicador de ancho (0.3 a 3.0)
  thickness: number; // Grosor / espesor 3D en píxeles (2px a 90px)
  depthScale: number; // Profundidad / largo isométrico (0.3 a 3.0)
  overallScale: number; // Tamaño general / escala global (0.4 a 2.5)
}

export const DEFAULT_CUBE_DIMENSIONS: Record<CubeKey, CubeDimensions> = {
  center: { widthScale: 1, thickness: 25, depthScale: 1, overallScale: 1 },
  purple: { widthScale: 1, thickness: 15, depthScale: 1, overallScale: 1 },
  blue: { widthScale: 1, thickness: 15, depthScale: 1, overallScale: 1 },
  green: { widthScale: 1, thickness: 15, depthScale: 1, overallScale: 1 },
  cyan: { widthScale: 1, thickness: 10, depthScale: 1, overallScale: 1 },
};

export const CUBE_BASE_SPECS: Record<
  CubeKey,
  {
    name: string;
    subtitle: string;
    cx: number;
    cy: number;
    baseRx: number;
    baseRy: number;
    baseThickness: number;
    color: string;
    borderColor: string;
    bgLight: string;
    textColor: string;
    stroke: string;
    fillTop: string;
    fillLeft: string;
    fillRight: string;
  }
> = {
  center: {
    name: 'Plataforma Central',
    subtitle: 'UNMSM Base',
    cx: 500,
    cy: 270,
    baseRx: 180,
    baseRy: 70,
    baseThickness: 25,
    color: '#0284c7',
    borderColor: 'border-sky-300',
    bgLight: 'bg-sky-50',
    textColor: 'text-sky-700',
    stroke: '#93c5fd',
    fillTop: 'url(#iso-platform)',
    fillLeft: '#cbd5e1',
    fillRight: '#94a3b8',
  },
  purple: {
    name: 'Cubo % Anexo 1',
    subtitle: '(Inventario)',
    cx: 220,
    cy: 330,
    baseRx: 100,
    baseRy: 40,
    baseThickness: 15,
    color: '#a855f7',
    borderColor: 'border-purple-300',
    bgLight: 'bg-purple-50',
    textColor: 'text-purple-700',
    stroke: '#c084fc',
    fillTop: '#ffffff',
    fillLeft: '#e9d5ff',
    fillRight: '#d8b4fe',
  },
  blue: {
    name: 'Cubo % Fase 1',
    subtitle: '',
    cx: 460,
    cy: 390,
    baseRx: 100,
    baseRy: 40,
    baseThickness: 15,
    color: '#3b82f6',
    borderColor: 'border-blue-300',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-700',
    stroke: '#60a5fa',
    fillTop: '#ffffff',
    fillLeft: '#dbeafe',
    fillRight: '#bfdbfe',
  },
  green: {
    name: 'Cubo % Anexo 3',
    subtitle: '(Ficha caracterización)',
    cx: 680,
    cy: 320,
    baseRx: 100,
    baseRy: 40,
    baseThickness: 15,
    color: '#22c55e',
    borderColor: 'border-emerald-300',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    stroke: '#4ade80',
    fillTop: '#ffffff',
    fillLeft: '#dcfce7',
    fillRight: '#bbf7d0',
  },
  cyan: {
    name: 'Cubo % Anexo 4',
    subtitle: '(Indicadores)',
    cx: 800,
    cy: 275,
    baseRx: 90,
    baseRy: 35,
    baseThickness: 10,
    color: '#06b6d4',
    borderColor: 'border-cyan-300',
    bgLight: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    stroke: '#38bdf8',
    fillTop: '#ffffff',
    fillLeft: '#bae6fd',
    fillRight: '#7dd3fc',
  },
};

export const computeCubePolygons = (key: CubeKey, dim?: CubeDimensions) => {
  const spec = CUBE_BASE_SPECS[key];
  const currentDim = dim || DEFAULT_CUBE_DIMENSIONS[key];
  const scale = currentDim.overallScale;
  const rx = Math.max(15, spec.baseRx * currentDim.widthScale * scale);
  const ry = Math.max(8, spec.baseRy * currentDim.depthScale * scale);
  const thickness = Math.max(2, currentDim.thickness * scale);
  const cx = spec.cx;
  const cy = spec.cy;

  const pTop = `${cx},${cy - ry} ${cx + rx},${cy} ${cx},${cy + ry} ${cx - rx},${cy}`;
  const pLeft = `${cx - rx},${cy} ${cx},${cy + ry} ${cx},${cy + ry + thickness} ${cx - rx},${cy + thickness}`;
  const pRight = `${cx},${cy + ry} ${cx + rx},${cy} ${cx + rx},${cy + thickness} ${cx},${cy + ry + thickness}`;

  return { pTop, pLeft, pRight, cx, cy, rx, ry, thickness };
};

const STORAGE_KEY_CUBES_DIMENSIONS = 'quipucamayoc_3d_cubes_dimensions_v1';
const STORAGE_KEY_CUBES = 'quipucamayoc_3d_cubes_positions_v1';
const STORAGE_KEY_CUBES_VISIBILITY = 'quipucamayoc_3d_cubes_visibility_v2';
const STORAGE_KEY_POOLS = 'quipucamayoc_pools_positions_v3';
const STORAGE_KEY_BUTTONS = 'quipucamayoc_action_buttons_v2';

const DEFAULT_POOLS: HeroPool[] = [
  {
    id: 'pool-metricas',
    title: '% de Anexo 1',
    subtitle: '(Inventario)',
    icon: 'chart',
    color: 'purple',
    leftPercent: 6,
    topPercent: 68,
    targetAction: 'metricas',
  },
  {
    id: 'pool-soluciones',
    title: '% de Fase 1',
    subtitle: '',
    icon: 'monitor',
    color: 'blue',
    leftPercent: 36,
    topPercent: 82,
    targetAction: 'soluciones',
  },
  {
    id: 'pool-equipos',
    title: '% de Anexo 3',
    subtitle: '(Ficha caracterización)',
    icon: 'users',
    color: 'emerald',
    leftPercent: 64,
    topPercent: 66,
    targetAction: 'equipos',
  },
  {
    id: 'pool-recursos',
    title: '% de Anexo 4',
    subtitle: '(Indicadores)',
    icon: 'folder',
    color: 'navy',
    leftPercent: 80,
    topPercent: 54,
    targetAction: 'recursos',
  },
];

const migratePools = (list: HeroPool[]): HeroPool[] => {
  return list.map((p) => {
    if (
      p.id === 'pool-soluciones' ||
      p.title.toLowerCase().includes('solucion')
    ) {
      return {
        ...p,
        title: '% de Fase 1',
        subtitle: '',
      };
    }
    if (
      p.id === 'pool-metricas' ||
      p.title.toLowerCase().includes('métrica') ||
      p.title.toLowerCase().includes('metrica')
    ) {
      return {
        ...p,
        title: '% de Anexo 1',
        subtitle: '(Inventario)',
      };
    }
    if (
      p.id === 'pool-equipos' ||
      p.title.toLowerCase().includes('gestión') ||
      p.title.toLowerCase().includes('gestion') ||
      p.title.toLowerCase().includes('equipo')
    ) {
      return {
        ...p,
        title: '% de Anexo 3',
        subtitle: '(Ficha caracterización)',
      };
    }
    if (
      p.id === 'pool-recursos' ||
      p.title.toLowerCase().includes('recurso') ||
      p.title.toLowerCase().includes('documento')
    ) {
      return {
        ...p,
        title: '% de Anexo 4',
        subtitle: '(Indicadores)',
      };
    }
    return p;
  });
};

const DEFAULT_BUTTONS: HeroActionButton[] = [
  {
    id: 'btn-sistemas',
    label: 'Ver sistemas institucionales',
    variant: 'secondary',
    actionType: 'modal',
    target: 'sistemas',
  },
];

export const QuipucamayocHero: React.FC<QuipucamayocHeroProps> = ({
  onExploreSystems,
  onSelectNode,
}) => {
  // Pools State
  const [pools, setPools] = useState<HeroPool[]>(() => {
    // Clear outdated single-key overrides for equipos
    const oldEquipos = localStorage.getItem('kpi_edit_corporativo_header_pool_equipos_title');
    if (oldEquipos && (oldEquipos.toLowerCase().includes('gesti') || oldEquipos.toLowerCase().includes('equipo'))) {
      localStorage.removeItem('kpi_edit_corporativo_header_pool_equipos_title');
    }
    const oldEquiposSub = localStorage.getItem('kpi_edit_corporativo_header_pool_equipos_subtitle');
    if (oldEquiposSub && oldEquiposSub.toLowerCase().includes('equipo')) {
      localStorage.removeItem('kpi_edit_corporativo_header_pool_equipos_subtitle');
    }

    const savedV3 = localStorage.getItem(STORAGE_KEY_POOLS);
    if (savedV3) {
      try {
        const parsed: HeroPool[] = JSON.parse(savedV3);
        const migrated = migratePools(parsed);
        localStorage.setItem(STORAGE_KEY_POOLS, JSON.stringify(migrated));
        return migrated;
      } catch (e) {
        console.error('Error parsing pools v3', e);
      }
    }

    const savedV2 = localStorage.getItem('quipucamayoc_pools_positions_v2');
    if (savedV2) {
      try {
        const parsed: HeroPool[] = JSON.parse(savedV2);
        const migrated = migratePools(parsed);
        localStorage.setItem(STORAGE_KEY_POOLS, JSON.stringify(migrated));
        return migrated;
      } catch (e) {
        console.error('Error parsing pools v2', e);
      }
    }

    localStorage.setItem(STORAGE_KEY_POOLS, JSON.stringify(DEFAULT_POOLS));
    return DEFAULT_POOLS;
  });

  // Action Buttons State
  const [actionButtons, setActionButtons] = useState<HeroActionButton[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BUTTONS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(
            (b) => b.id !== 'btn-kpi-monitoreo' && !b.label?.toLowerCase().includes('monitoreo')
          );
          if (filtered.length > 0) {
            localStorage.setItem(STORAGE_KEY_BUTTONS, JSON.stringify(filtered));
            return filtered;
          }
        }
      } catch (e) {
        console.error('Error parsing buttons', e);
      }
    }
    localStorage.setItem(STORAGE_KEY_BUTTONS, JSON.stringify(DEFAULT_BUTTONS));
    return DEFAULT_BUTTONS;
  });
  const [editingBtnIndex, setEditingBtnIndex] = useState<number | null>(null);
  const [tempBtnLabel, setTempBtnLabel] = useState<string>('');

  // Isometric 3D Cubes State
  const [cubesPositions, setCubesPositions] = useState<IsometricCubesPositions>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CUBES);
    if (saved) {
      try {
        return { ...DEFAULT_CUBES_POSITIONS, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Error parsing 3D cubes positions', e);
      }
    }
    return DEFAULT_CUBES_POSITIONS;
  });

  // 3D Cubes & Spheres Visibility State
  const [cubesVisibility, setCubesVisibility] = useState<IsometricElementsVisibility>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CUBES_VISIBILITY);
    if (saved) {
      try {
        return { ...DEFAULT_CUBES_VISIBILITY, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Error parsing cubes visibility', e);
      }
    }
    return DEFAULT_CUBES_VISIBILITY;
  });

  const [hoveredCubeKey, setHoveredCubeKey] = useState<keyof IsometricCubesPositions | null>(null);
  const [showRestoreMenu, setShowRestoreMenu] = useState<boolean>(false);

  const saveCubesVisibility = (newVisibility: IsometricElementsVisibility) => {
    setCubesVisibility(newVisibility);
    localStorage.setItem(STORAGE_KEY_CUBES_VISIBILITY, JSON.stringify(newVisibility));
  };

  const handleDeleteElement = (key: keyof IsometricElementsVisibility, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = { ...cubesVisibility, [key]: false };
    saveCubesVisibility(updated);
  };

  const handleRestoreElement = (key: keyof IsometricElementsVisibility, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = { ...cubesVisibility, [key]: true };
    saveCubesVisibility(updated);
  };

  const handleRestoreAllElements = () => {
    const allVisible: IsometricElementsVisibility = {
      center: true,
      purple: true,
      blue: true,
      green: true,
      cyan: true,
      sphereCyan: true,
      spherePurple: true,
    };
    saveCubesVisibility(allVisible);
  };

  const [draggingCubeKey, setDraggingCubeKey] = useState<keyof IsometricCubesPositions | null>(null);
  const dragCubeStartRef = useRef<{
    svgX: number;
    svgY: number;
    initDx: number;
    initDy: number;
  }>({ svgX: 0, svgY: 0, initDx: 0, initDy: 0 });

  // 3D Cubes Dimensions State (Width, Thickness, Depth, Overall Scale)
  const [cubesDimensions, setCubesDimensions] = useState<Record<CubeKey, CubeDimensions>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CUBES_DIMENSIONS);
    if (saved) {
      try {
        return { ...DEFAULT_CUBE_DIMENSIONS, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Error parsing 3D cubes dimensions', e);
      }
    }
    return DEFAULT_CUBE_DIMENSIONS;
  });

  // 3D Movable Circles State (X, Y, Z, 360°, Color Morado/Verde, Duplicables)
  const [circles3D, setCircles3D] = useState<Movable3DCircle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_3D_CIRCLES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c: any) => ({
            ...c,
            z: typeof c.z === 'number' && c.z !== 0 ? c.z : 85,
            cubeKey: c.cubeKey || 'purple',
          }));
        }
      } catch (e) {
        console.error('Error parsing 3D circles', e);
      }
    }
    return [DEFAULT_PRIMARY_CIRCLE];
  });

  // Animación dinámica de elevación 3D para esferas
  const [isSpheresAnimationActive, setIsSpheresAnimationActive] = useState<boolean>(true);

  const [selectedCircleId, setSelectedCircleId] = useState<string | null>('circle-3d-primary');
  const [hoveredCircleId, setHoveredCircleId] = useState<string | null>(null);

  const [draggingCircleTarget, setDraggingCircleTarget] = useState<{
    id: string;
    mode: 'xy' | 'z' | 'rotate';
  } | null>(null);

  const dragCircleStartRef = useRef<{
    svgX: number;
    svgY: number;
    initX: number;
    initY: number;
    initZ: number;
    initRot: number;
    centerX: number;
    centerY: number;
  }>({
    svgX: 0,
    svgY: 0,
    initX: 0,
    initY: 0,
    initZ: 0,
    initRot: 0,
    centerX: 0,
    centerY: 0,
  });

  const saveCircles3D = (newCircles: Movable3DCircle[]) => {
    setCircles3D(newCircles);
    localStorage.setItem(STORAGE_KEY_3D_CIRCLES, JSON.stringify(newCircles));
  };

  const handleDuplicateCircle = (circleId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const source = circles3D.find((c) => c.id === circleId) || circles3D[0] || DEFAULT_PRIMARY_CIRCLE;
    const newId = `circle-3d-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newCircle: Movable3DCircle = {
      ...source,
      id: newId,
      name: `Círculo 3D (${CIRCLE_3D_COLORS[source.color].name}) ${circles3D.length + 1}`,
      x: source.x + 35,
      y: source.y + 20,
      z: source.z + 20,
      rotation360: (source.rotation360 + 45) % 360,
      isPrimary: false,
    };
    const updated = [...circles3D, newCircle];
    saveCircles3D(updated);
    setSelectedCircleId(newId);
  };

  const handleDeleteCircle = (circleId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (circles3D.length <= 1) {
      const reset = [{ ...DEFAULT_PRIMARY_CIRCLE }];
      saveCircles3D(reset);
      setSelectedCircleId('circle-3d-primary');
      return;
    }
    const updated = circles3D.filter((c) => c.id !== circleId);
    saveCircles3D(updated);
    if (selectedCircleId === circleId) {
      setSelectedCircleId(updated[0]?.id || null);
    }
  };

  const handleSetCircleColor = (circleId: string, color: Circle3DColor, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = circles3D.map((c) => (c.id === circleId ? { ...c, color } : c));
    saveCircles3D(updated);
  };

  const handleToggleCircleColor = (circleId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = circles3D.find((c) => c.id === circleId) || circles3D[0];
    if (!target) return;
    const colorOrder: Circle3DColor[] = ['purple', 'green', 'cyan', 'blue'];
    const curIdx = colorOrder.indexOf(target.color);
    const nextColor = colorOrder[(curIdx + 1) % colorOrder.length];
    handleSetCircleColor(target.id, nextColor);
  };

  const handleAdjustZ = (circleId: string, deltaZ: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = circles3D.map((c) =>
      c.id === circleId ? { ...c, z: Math.max(-150, Math.min(320, c.z + deltaZ)) } : c
    );
    saveCircles3D(updated);
  };

  const handleAdjustRotation = (circleId: string, deltaDeg: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = circles3D.map((c) => {
      if (c.id !== circleId) return c;
      let newDeg = (c.rotation360 + deltaDeg) % 360;
      if (newDeg < 0) newDeg += 360;
      return { ...c, rotation360: newDeg };
    });
    saveCircles3D(updated);
  };

  const handleSetRotationExact = (circleId: string, deg: number) => {
    let normalized = deg % 360;
    if (normalized < 0) normalized += 360;
    const updated = circles3D.map((c) => (c.id === circleId ? { ...c, rotation360: normalized } : c));
    saveCircles3D(updated);
  };

  const handleResetCircle3D = (circleId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = circles3D.map((c) =>
      c.id === circleId ? { ...c, x: 0, y: 0, z: 0, rotation360: 0 } : c
    );
    saveCircles3D(updated);
  };

  // Selected cube for editing dimensions (defaults to 'purple' so user's clicked cube is active immediately)
  const [selectedCubeKey, setSelectedCubeKey] = useState<CubeKey | null>('purple');
  const [activeDimensionMenuCube, setActiveDimensionMenuCube] = useState<CubeKey | null>(null);

  const [resizingTarget, setResizingTarget] = useState<{
    key: CubeKey;
    dimension: 'width' | 'thickness' | 'depth' | 'scale';
  } | null>(null);

  const resizeStartRef = useRef<{
    svgX: number;
    svgY: number;
    initWidthScale: number;
    initThickness: number;
    initDepthScale: number;
    initOverallScale: number;
    baseRx: number;
    baseRy: number;
  }>({
    svgX: 0,
    svgY: 0,
    initWidthScale: 1,
    initThickness: 15,
    initDepthScale: 1,
    initOverallScale: 1,
    baseRx: 100,
    baseRy: 40,
  });

  const saveCubesDimensions = (newDims: Record<CubeKey, CubeDimensions>) => {
    setCubesDimensions(newDims);
    localStorage.setItem(STORAGE_KEY_CUBES_DIMENSIONS, JSON.stringify(newDims));
  };

  const handleAdjustWidth = (key: CubeKey, delta: number) => {
    setCubesDimensions((prev) => {
      const current = prev[key] || DEFAULT_CUBE_DIMENSIONS[key];
      const newWidth = Math.max(0.3, Math.min(3.0, Math.round((current.widthScale + delta) * 10) / 10));
      const updated = {
        ...prev,
        [key]: { ...current, widthScale: newWidth },
      };
      saveCubesDimensions(updated);
      return updated;
    });
  };

  const handleAdjustThickness = (key: CubeKey, delta: number) => {
    setCubesDimensions((prev) => {
      const current = prev[key] || DEFAULT_CUBE_DIMENSIONS[key];
      const newThickness = Math.max(2, Math.min(90, Math.round(current.thickness + delta)));
      const updated = {
        ...prev,
        [key]: { ...current, thickness: newThickness },
      };
      saveCubesDimensions(updated);
      return updated;
    });
  };

  const handleAdjustScale = (key: CubeKey, delta: number) => {
    setCubesDimensions((prev) => {
      const current = prev[key] || DEFAULT_CUBE_DIMENSIONS[key];
      const newScale = Math.max(0.4, Math.min(2.5, Math.round((current.overallScale + delta) * 10) / 10));
      const updated = {
        ...prev,
        [key]: { ...current, overallScale: newScale },
      };
      saveCubesDimensions(updated);
      return updated;
    });
  };

  const handleAdjustDepth = (key: CubeKey, delta: number) => {
    setCubesDimensions((prev) => {
      const current = prev[key] || DEFAULT_CUBE_DIMENSIONS[key];
      const newDepth = Math.max(0.3, Math.min(2.5, Math.round((current.depthScale + delta) * 10) / 10));
      const updated = {
        ...prev,
        [key]: { ...current, depthScale: newDepth },
      };
      saveCubesDimensions(updated);
      return updated;
    });
  };

  const handleSetCubeDimension = (key: CubeKey, partialDim: Partial<CubeDimensions>) => {
    setCubesDimensions((prev) => {
      const current = prev[key] || DEFAULT_CUBE_DIMENSIONS[key];
      const updated = {
        ...prev,
        [key]: { ...current, ...partialDim },
      };
      saveCubesDimensions(updated);
      return updated;
    });
  };

  const handleResetCubeDimensions = (key: CubeKey) => {
    setCubesDimensions((prev) => {
      const updated = {
        ...prev,
        [key]: { ...DEFAULT_CUBE_DIMENSIONS[key] },
      };
      saveCubesDimensions(updated);
      return updated;
    });
  };

  const svgRef = useRef<SVGSVGElement>(null);

  const saveCubes = (newCubes: IsometricCubesPositions) => {
    setCubesPositions(newCubes);
    localStorage.setItem(STORAGE_KEY_CUBES, JSON.stringify(newCubes));
  };

  // Isometric Lines State (Solid & Dashed)
  const [lines, setLines] = useState<IsometricAxisLine[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LINES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error parsing isometric lines', e);
      }
    }
    return DEFAULT_ISOMETRIC_LINES;
  });

  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [hoveredLineId, setHoveredLineId] = useState<string | null>(null);

  const [draggingLineTarget, setDraggingLineTarget] = useState<{
    id: string;
    mode: 'move' | 'p1' | 'p2' | 'rotate';
  } | null>(null);

  const dragLineStartRef = useRef<{
    svgX: number;
    svgY: number;
    initDx: number;
    initDy: number;
    initX1: number;
    initY1: number;
    initX2: number;
    initY2: number;
    midX: number;
    midY: number;
    halfLen: number;
  }>({
    svgX: 0,
    svgY: 0,
    initDx: 0,
    initDy: 0,
    initX1: 0,
    initY1: 0,
    initX2: 0,
    initY2: 0,
    midX: 0,
    midY: 0,
    halfLen: 0,
  });

  const saveLines = (newLines: IsometricAxisLine[]) => {
    setLines(newLines);
    localStorage.setItem(STORAGE_KEY_LINES, JSON.stringify(newLines));
  };

  const handleDuplicateLine = (lineId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const source = lines.find((l) => l.id === lineId);
    if (!source) return;
    const newLine: IsometricAxisLine = {
      ...source,
      id: `line-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      dx: source.dx + 25,
      dy: source.dy + 25,
    };
    const updated = [...lines, newLine];
    saveLines(updated);
    setSelectedLineId(newLine.id);
  };

  const handleAddSolidLine = () => {
    const offset = ((lines.length + 1) % 6) * 20;
    const newLine: IsometricAxisLine = {
      id: `line-solid-${Date.now()}`,
      type: 'solid',
      x1: 200,
      y1: 460,
      x2: 800,
      y2: 150,
      dx: offset,
      dy: -offset,
      strokeWidth: 3,
    };
    saveLines([...lines, newLine]);
    setSelectedLineId(newLine.id);
  };

  const handleAddDashedLine = () => {
    const offset = ((lines.length + 1) % 6) * 20;
    const newLine: IsometricAxisLine = {
      id: `line-dashed-${Date.now()}`,
      type: 'dashed',
      x1: 100,
      y1: 180,
      x2: 900,
      y2: 480,
      dx: offset,
      dy: offset,
      strokeWidth: 3,
    };
    saveLines([...lines, newLine]);
    setSelectedLineId(newLine.id);
  };

  const handleDeleteLine = (lineId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lines.length <= 1) {
      alert('Debe haber al menos una línea en el lienzo.');
      return;
    }
    const updated = lines.filter((l) => l.id !== lineId);
    saveLines(updated);
    if (selectedLineId === lineId) {
      setSelectedLineId(null);
    }
  };

  const handleToggleLineType = (lineId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = lines.map((l) =>
      l.id === lineId ? { ...l, type: l.type === 'solid' ? ('dashed' as const) : ('solid' as const) } : l
    );
    saveLines(updated);
  };

  const handleRotateLine = (lineId: string, targetAngleDeg: number) => {
    setLines((prev) => {
      const updated = prev.map((l) => {
        if (l.id !== lineId) return l;
        const midX = (l.x1 + l.x2) / 2;
        const midY = (l.y1 + l.y2) / 2;
        const halfLen = Math.hypot(l.x2 - l.x1, l.y2 - l.y1) / 2 || 150;
        const rad = ((targetAngleDeg % 360) * Math.PI) / 180;
        const hdx = halfLen * Math.cos(rad);
        const hdy = halfLen * Math.sin(rad);
        return {
          ...l,
          x1: Math.round(midX - hdx),
          y1: Math.round(midY - hdy),
          x2: Math.round(midX + hdx),
          y2: Math.round(midY + hdy),
        };
      });
      localStorage.setItem(STORAGE_KEY_LINES, JSON.stringify(updated));
      return updated;
    });
  };

  const handleStepLineRotation = (lineId: string, deltaDeg: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targetLine = lines.find((l) => l.id === lineId);
    if (!targetLine) return;
    const curAngle = Math.atan2(targetLine.y2 - targetLine.y1, targetLine.x2 - targetLine.x1) * (180 / Math.PI);
    const normalized = ((curAngle % 360) + 360) % 360;
    handleRotateLine(lineId, normalized + deltaDeg);
  };

  const handleStartDragLine = (
    e: React.MouseEvent | React.TouchEvent,
    lineId: string,
    mode: 'move' | 'p1' | 'p2' | 'rotate' = 'move'
  ) => {
    e.stopPropagation();
    setSelectedLineId(lineId);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const { x, y } = getSvgCoordinates(clientX, clientY);

    const targetLine = lines.find((l) => l.id === lineId);
    if (!targetLine) return;

    const midX = (targetLine.x1 + targetLine.x2) / 2 + targetLine.dx;
    const midY = (targetLine.y1 + targetLine.y2) / 2 + targetLine.dy;
    const halfLen = Math.hypot(targetLine.x2 - targetLine.x1, targetLine.y2 - targetLine.y1) / 2 || 150;

    setDraggingLineTarget({ id: lineId, mode });
    dragLineStartRef.current = {
      svgX: x,
      svgY: y,
      initDx: targetLine.dx,
      initDy: targetLine.dy,
      initX1: targetLine.x1,
      initY1: targetLine.y1,
      initX2: targetLine.x2,
      initY2: targetLine.y2,
      midX,
      midY,
      halfLen,
    };
  };

  // Edit / Move Mode toggle
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Pool editing modal
  const [editingPool, setEditingPool] = useState<HeroPool | null>(null);
  const [isNewPool, setIsNewPool] = useState(false);
  const [poolModalOpen, setPoolModalOpen] = useState(false);

  // Dragging state
  const [draggingPoolId, setDraggingPoolId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const savePools = (newPools: HeroPool[]) => {
    setPools(newPools);
    localStorage.setItem(STORAGE_KEY_POOLS, JSON.stringify(newPools));
  };

  const saveButtons = (newButtons: HeroActionButton[]) => {
    setActionButtons(newButtons);
    localStorage.setItem(STORAGE_KEY_BUTTONS, JSON.stringify(newButtons));
  };

  // Drag Handlers for Pools
  const handleMouseDownOnPool = (e: React.MouseEvent, poolId: string) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const pool = pools.find((p) => p.id === poolId);
    if (!pool) return;

    setDraggingPoolId(poolId);
    dragStartOffset.current = {
      x: e.clientX - (rect.left + (pool.leftPercent / 100) * rect.width),
      y: e.clientY - (rect.top + (pool.topPercent / 100) * rect.height),
    };
  };

  const handleTouchStartOnPool = (e: React.TouchEvent, poolId: string) => {
    if (!canvasRef.current || e.touches.length === 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const pool = pools.find((p) => p.id === poolId);
    if (!pool) return;

    setDraggingPoolId(poolId);
    const touch = e.touches[0];
    dragStartOffset.current = {
      x: touch.clientX - (rect.left + (pool.leftPercent / 100) * rect.width),
      y: touch.clientY - (rect.top + (pool.topPercent / 100) * rect.height),
    };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggingPoolId || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();

      const newX = e.clientX - rect.left - dragStartOffset.current.x;
      const newY = e.clientY - rect.top - dragStartOffset.current.y;

      let leftPercent = Math.max(1, Math.min(88, (newX / rect.width) * 100));
      let topPercent = Math.max(10, Math.min(88, (newY / rect.height) * 100));

      setPools((prev) =>
        prev.map((p) => (p.id === draggingPoolId ? { ...p, leftPercent, topPercent } : p))
      );
    },
    [draggingPoolId]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!draggingPoolId || !canvasRef.current || e.touches.length === 0) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const touch = e.touches[0];

      const newX = touch.clientX - rect.left - dragStartOffset.current.x;
      const newY = touch.clientY - rect.top - dragStartOffset.current.y;

      let leftPercent = Math.max(1, Math.min(88, (newX / rect.width) * 100));
      let topPercent = Math.max(10, Math.min(88, (newY / rect.height) * 100));

      setPools((prev) =>
        prev.map((p) => (p.id === draggingPoolId ? { ...p, leftPercent, topPercent } : p))
      );
    },
    [draggingPoolId]
  );

  const handleEndDrag = useCallback(() => {
    if (draggingPoolId) {
      setDraggingPoolId(null);
      savePools(pools);
    }
  }, [draggingPoolId, pools]);

  useEffect(() => {
    if (draggingPoolId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEndDrag);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEndDrag);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleEndDrag);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleEndDrag);
      };
    }
  }, [draggingPoolId, handleMouseMove, handleTouchMove, handleEndDrag]);

  // SVG Coordinates Converter for 3D Isometric Cubes
  const getSvgCoordinates = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (ctm) {
      const inv = pt.matrixTransform(ctm.inverse());
      return { x: inv.x, y: inv.y };
    }
    const rect = svg.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / (rect.width || 1)) * 1000,
      y: ((clientY - rect.top) / (rect.height || 1)) * 500,
    };
  }, []);

  // Start dragging a 3D isometric cube/platform
  const handleStartDragCube = (
    e: React.MouseEvent | React.TouchEvent,
    key: keyof IsometricCubesPositions
  ) => {
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const { x, y } = getSvgCoordinates(clientX, clientY);

    setDraggingCubeKey(key);
    dragCubeStartRef.current = {
      svgX: x,
      svgY: y,
      initDx: cubesPositions[key].dx,
      initDy: cubesPositions[key].dy,
    };
  };

  // Listeners for dragging 3D cubes
  useEffect(() => {
    if (!draggingCubeKey) return;

    const onMouseMove = (e: MouseEvent) => {
      const { x, y } = getSvgCoordinates(e.clientX, e.clientY);
      const deltaX = x - dragCubeStartRef.current.svgX;
      const deltaY = y - dragCubeStartRef.current.svgY;

      setCubesPositions((prev) => ({
        ...prev,
        [draggingCubeKey]: {
          dx: Math.round(dragCubeStartRef.current.initDx + deltaX),
          dy: Math.round(dragCubeStartRef.current.initDy + deltaY),
        },
      }));
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const { x, y } = getSvgCoordinates(touch.clientX, touch.clientY);
      const deltaX = x - dragCubeStartRef.current.svgX;
      const deltaY = y - dragCubeStartRef.current.svgY;

      setCubesPositions((prev) => ({
        ...prev,
        [draggingCubeKey]: {
          dx: Math.round(dragCubeStartRef.current.initDx + deltaX),
          dy: Math.round(dragCubeStartRef.current.initDy + deltaY),
        },
      }));
    };

    const onEndDrag = () => {
      setDraggingCubeKey(null);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEndDrag);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onEndDrag);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEndDrag);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEndDrag);
    };
  }, [draggingCubeKey, getSvgCoordinates]);

  // Persist cube positions when dragging ends
  useEffect(() => {
    if (!draggingCubeKey) {
      localStorage.setItem(STORAGE_KEY_CUBES, JSON.stringify(cubesPositions));
    }
  }, [draggingCubeKey, cubesPositions]);

  // Start direct handle resize on an isometric cube
  const handleStartResize = (
    e: React.MouseEvent | React.TouchEvent,
    key: CubeKey,
    dimension: 'width' | 'thickness' | 'depth' | 'scale'
  ) => {
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const { x, y } = getSvgCoordinates(clientX, clientY);

    const curDim = cubesDimensions[key] || DEFAULT_CUBE_DIMENSIONS[key];
    const spec = CUBE_BASE_SPECS[key];

    setResizingTarget({ key, dimension });
    resizeStartRef.current = {
      svgX: x,
      svgY: y,
      initWidthScale: curDim.widthScale,
      initThickness: curDim.thickness,
      initDepthScale: curDim.depthScale,
      initOverallScale: curDim.overallScale,
      baseRx: spec.baseRx,
      baseRy: spec.baseRy,
    };
  };

  // Listeners for resizing 3D cubes via interactive SVG handles
  useEffect(() => {
    if (!resizingTarget) return;

    const onMouseMove = (e: MouseEvent) => {
      const { x, y } = getSvgCoordinates(e.clientX, e.clientY);
      const deltaX = x - resizeStartRef.current.svgX;
      const deltaY = y - resizeStartRef.current.svgY;
      const { key, dimension } = resizingTarget;
      const start = resizeStartRef.current;

      if (dimension === 'width') {
        const baseRxScaled = start.baseRx * start.initOverallScale;
        const newWidth = Math.max(
          0.3,
          Math.min(3.0, (start.baseRx * start.initWidthScale * start.initOverallScale + deltaX) / baseRxScaled)
        );
        setCubesDimensions((prev) => ({
          ...prev,
          [key]: { ...prev[key], widthScale: Math.round(newWidth * 100) / 100 },
        }));
      } else if (dimension === 'thickness') {
        const newThick = Math.max(2, Math.min(90, start.initThickness + deltaY / start.initOverallScale));
        setCubesDimensions((prev) => ({
          ...prev,
          [key]: { ...prev[key], thickness: Math.round(newThick) },
        }));
      } else if (dimension === 'depth') {
        const baseRyScaled = start.baseRy * start.initOverallScale;
        const newDepth = Math.max(
          0.3,
          Math.min(2.5, (start.baseRy * start.initDepthScale * start.initOverallScale - deltaY) / baseRyScaled)
        );
        setCubesDimensions((prev) => ({
          ...prev,
          [key]: { ...prev[key], depthScale: Math.round(newDepth * 100) / 100 },
        }));
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const { x, y } = getSvgCoordinates(touch.clientX, touch.clientY);
      const deltaX = x - resizeStartRef.current.svgX;
      const deltaY = y - resizeStartRef.current.svgY;
      const { key, dimension } = resizingTarget;
      const start = resizeStartRef.current;

      if (dimension === 'width') {
        const baseRxScaled = start.baseRx * start.initOverallScale;
        const newWidth = Math.max(
          0.3,
          Math.min(3.0, (start.baseRx * start.initWidthScale * start.initOverallScale + deltaX) / baseRxScaled)
        );
        setCubesDimensions((prev) => ({
          ...prev,
          [key]: { ...prev[key], widthScale: Math.round(newWidth * 100) / 100 },
        }));
      } else if (dimension === 'thickness') {
        const newThick = Math.max(2, Math.min(90, start.initThickness + deltaY / start.initOverallScale));
        setCubesDimensions((prev) => ({
          ...prev,
          [key]: { ...prev[key], thickness: Math.round(newThick) },
        }));
      } else if (dimension === 'depth') {
        const baseRyScaled = start.baseRy * start.initOverallScale;
        const newDepth = Math.max(
          0.3,
          Math.min(2.5, (start.baseRy * start.initDepthScale * start.initOverallScale - deltaY) / baseRyScaled)
        );
        setCubesDimensions((prev) => ({
          ...prev,
          [key]: { ...prev[key], depthScale: Math.round(newDepth * 100) / 100 },
        }));
      }
    };

    const onEndResize = () => {
      setResizingTarget(null);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEndResize);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onEndResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEndResize);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEndResize);
    };
  }, [resizingTarget, getSvgCoordinates]);

  // Persist cube dimensions when resizing ends
  useEffect(() => {
    if (!resizingTarget) {
      localStorage.setItem(STORAGE_KEY_CUBES_DIMENSIONS, JSON.stringify(cubesDimensions));
    }
  }, [resizingTarget, cubesDimensions]);

  // Drag listeners for isometric axis lines
  useEffect(() => {
    if (!draggingLineTarget) return;

    const onMouseMove = (e: MouseEvent) => {
      const { x, y } = getSvgCoordinates(e.clientX, e.clientY);
      const deltaX = x - dragLineStartRef.current.svgX;
      const deltaY = y - dragLineStartRef.current.svgY;

      setLines((prev) =>
        prev.map((l) => {
          if (l.id !== draggingLineTarget.id) return l;
          if (draggingLineTarget.mode === 'move') {
            return {
              ...l,
              dx: Math.round(dragLineStartRef.current.initDx + deltaX),
              dy: Math.round(dragLineStartRef.current.initDy + deltaY),
            };
          } else if (draggingLineTarget.mode === 'p1') {
            return {
              ...l,
              x1: Math.round(dragLineStartRef.current.initX1 + deltaX),
              y1: Math.round(dragLineStartRef.current.initY1 + deltaY),
            };
          } else if (draggingLineTarget.mode === 'p2') {
            return {
              ...l,
              x2: Math.round(dragLineStartRef.current.initX2 + deltaX),
              y2: Math.round(dragLineStartRef.current.initY2 + deltaY),
            };
          } else {
            // Mode 'rotate': 360° rotation around line midpoint (up, down, left, right)
            const { midX, midY, halfLen } = dragLineStartRef.current;
            const angleRad = Math.atan2(y - midY, x - midX);
            const hdx = halfLen * Math.cos(angleRad);
            const hdy = halfLen * Math.sin(angleRad);
            const relMidX = midX - l.dx;
            const relMidY = midY - l.dy;
            return {
              ...l,
              x1: Math.round(relMidX - hdx),
              y1: Math.round(relMidY - hdy),
              x2: Math.round(relMidX + hdx),
              y2: Math.round(relMidY + hdy),
            };
          }
        })
      );
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const { x, y } = getSvgCoordinates(touch.clientX, touch.clientY);
      const deltaX = x - dragLineStartRef.current.svgX;
      const deltaY = y - dragLineStartRef.current.svgY;

      setLines((prev) =>
        prev.map((l) => {
          if (l.id !== draggingLineTarget.id) return l;
          if (draggingLineTarget.mode === 'move') {
            return {
              ...l,
              dx: Math.round(dragLineStartRef.current.initDx + deltaX),
              dy: Math.round(dragLineStartRef.current.initDy + deltaY),
            };
          } else if (draggingLineTarget.mode === 'p1') {
            return {
              ...l,
              x1: Math.round(dragLineStartRef.current.initX1 + deltaX),
              y1: Math.round(dragLineStartRef.current.initY1 + deltaY),
            };
          } else if (draggingLineTarget.mode === 'p2') {
            return {
              ...l,
              x2: Math.round(dragLineStartRef.current.initX2 + deltaX),
              y2: Math.round(dragLineStartRef.current.initY2 + deltaY),
            };
          } else {
            // Mode 'rotate': 360° rotation around line midpoint
            const { midX, midY, halfLen } = dragLineStartRef.current;
            const angleRad = Math.atan2(y - midY, x - midX);
            const hdx = halfLen * Math.cos(angleRad);
            const hdy = halfLen * Math.sin(angleRad);
            const relMidX = midX - l.dx;
            const relMidY = midY - l.dy;
            return {
              ...l,
              x1: Math.round(relMidX - hdx),
              y1: Math.round(relMidY - hdy),
              x2: Math.round(relMidX + hdx),
              y2: Math.round(relMidY + hdy),
            };
          }
        })
      );
    };

    const onEndDrag = () => {
      setDraggingLineTarget(null);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEndDrag);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onEndDrag);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEndDrag);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEndDrag);
    };
  }, [draggingLineTarget, getSvgCoordinates]);

  // Persist lines when dragging ends
  useEffect(() => {
    if (!draggingLineTarget) {
      localStorage.setItem(STORAGE_KEY_LINES, JSON.stringify(lines));
    }
  }, [draggingLineTarget, lines]);

  // Start dragging a 3D circle in X/Y (360° translation), Z (elevation), or 360° rotation
  const handleStartDragCircle = (
    e: React.MouseEvent | React.TouchEvent,
    circleId: string,
    mode: 'xy' | 'z' | 'rotate'
  ) => {
    e.stopPropagation();
    setSelectedCircleId(circleId);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const { x, y } = getSvgCoordinates(clientX, clientY);

    const target = circles3D.find((c) => c.id === circleId) || circles3D[0];
    if (!target) return;

    const polysPurple = computeCubePolygons('purple', cubesDimensions.purple);
    const baseX = polysPurple.cx + cubesPositions.purple.dx;
    const baseY = polysPurple.cy + polysPurple.ry + polysPurple.thickness + cubesPositions.purple.dy;
    const cX = baseX + target.x;
    const cY = baseY + target.y - target.z;

    setDraggingCircleTarget({ id: target.id, mode });
    dragCircleStartRef.current = {
      svgX: x,
      svgY: y,
      initX: target.x,
      initY: target.y,
      initZ: target.z,
      initRot: target.rotation360,
      centerX: cX,
      centerY: cY,
    };
  };

  // Drag listeners for 3D circles
  useEffect(() => {
    if (!draggingCircleTarget) return;

    const onMouseMove = (e: MouseEvent) => {
      const { x, y } = getSvgCoordinates(e.clientX, e.clientY);
      const start = dragCircleStartRef.current;
      const deltaX = x - start.svgX;
      const deltaY = y - start.svgY;
      const { id, mode } = draggingCircleTarget;

      setCircles3D((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          if (mode === 'xy') {
            return {
              ...c,
              x: Math.round(start.initX + deltaX),
              y: Math.round(start.initY + deltaY),
            };
          } else if (mode === 'z') {
            const newZ = Math.round(start.initZ - deltaY);
            return {
              ...c,
              z: Math.max(-150, Math.min(320, newZ)),
            };
          } else if (mode === 'rotate') {
            const dx = x - start.centerX;
            const dy = (y - start.centerY) * 2;
            let deg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
            if (deg < 0) deg += 360;
            return {
              ...c,
              rotation360: deg,
            };
          }
          return c;
        })
      );
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const { x, y } = getSvgCoordinates(touch.clientX, touch.clientY);
      const start = dragCircleStartRef.current;
      const deltaX = x - start.svgX;
      const deltaY = y - start.svgY;
      const { id, mode } = draggingCircleTarget;

      setCircles3D((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          if (mode === 'xy') {
            return {
              ...c,
              x: Math.round(start.initX + deltaX),
              y: Math.round(start.initY + deltaY),
            };
          } else if (mode === 'z') {
            const newZ = Math.round(start.initZ - deltaY);
            return {
              ...c,
              z: Math.max(-150, Math.min(320, newZ)),
            };
          } else if (mode === 'rotate') {
            const dx = x - start.centerX;
            const dy = (y - start.centerY) * 2;
            let deg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
            if (deg < 0) deg += 360;
            return {
              ...c,
              rotation360: deg,
            };
          }
          return c;
        })
      );
    };

    const onEndDrag = () => {
      setDraggingCircleTarget(null);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEndDrag);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onEndDrag);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEndDrag);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEndDrag);
    };
  }, [draggingCircleTarget, getSvgCoordinates]);

  // Persist 3D circles when dragging ends
  useEffect(() => {
    if (!draggingCircleTarget) {
      localStorage.setItem(STORAGE_KEY_3D_CIRCLES, JSON.stringify(circles3D));
    }
  }, [draggingCircleTarget, circles3D]);

  // Button Reordering
  const handleMoveButton = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= actionButtons.length) return;
    const newButtons = [...actionButtons];
    const temp = newButtons[index];
    newButtons[index] = newButtons[targetIdx];
    newButtons[targetIdx] = temp;
    saveButtons(newButtons);
  };

  const handleEditButton = (index: number) => {
    setEditingBtnIndex(index);
    setTempBtnLabel(actionButtons[index].label);
  };

  const handleSaveButtonLabel = (index: number, newLabel: string) => {
    if (newLabel && newLabel.trim()) {
      const newButtons = [...actionButtons];
      newButtons[index] = { ...newButtons[index], label: newLabel.trim() };
      saveButtons(newButtons);
    }
  };

  const handleAddButton = () => {
    const label = window.prompt('Texto del nuevo botón de acción:', 'Nuevo Enlace');
    if (label && label.trim()) {
      const newBtn: HeroActionButton = {
        id: `btn-${Date.now()}`,
        label: label.trim(),
        variant: 'secondary',
        actionType: 'modal',
        target: 'plan-gestion',
      };
      saveButtons([...actionButtons, newBtn]);
    }
  };

  const handleDeleteButton = (id: string) => {
    const updated = actionButtons.filter((b) => b.id !== id);
    saveButtons(updated);
  };

  // Pools Management
  const handleOpenEditPool = (pool: HeroPool) => {
    setEditingPool(pool);
    setIsNewPool(false);
    setPoolModalOpen(true);
  };

  const handleOpenAddPool = () => {
    setEditingPool(null);
    setIsNewPool(true);
    setPoolModalOpen(true);
  };

  const handleSavePool = (savedPool: HeroPool) => {
    let updated: HeroPool[];
    if (isNewPool) {
      updated = [...pools, savedPool];
    } else {
      updated = pools.map((p) => (p.id === savedPool.id ? savedPool : p));
    }
    savePools(updated);
    setPoolModalOpen(false);
  };

  const handleDeletePool = (poolId: string) => {
    savePools(pools.filter((p) => p.id !== poolId));
    setPoolModalOpen(false);
  };

  const handleResetPositions = () => {
    if (window.confirm('¿Deseas restablecer las posiciones originales de los cubos 3D, círculos 3D, líneas (sólida y discontinua), pools y botones?')) {
      savePools(DEFAULT_POOLS);
      saveButtons(DEFAULT_BUTTONS);
      saveCubes(DEFAULT_CUBES_POSITIONS);
      saveCubesDimensions(DEFAULT_CUBE_DIMENSIONS);
      saveCubesVisibility(DEFAULT_CUBES_VISIBILITY);
      saveLines(DEFAULT_ISOMETRIC_LINES);
      saveCircles3D([DEFAULT_PRIMARY_CIRCLE]);
      setSelectedCircleId('circle-3d-primary');
      setSelectedLineId(null);
      window.dispatchEvent(new CustomEvent('quipucamayoc_reset_floating_kpis'));
    }
  };

  // Helper for rendering icons
  const renderIcon = (iconName: HeroPool['icon']) => {
    switch (iconName) {
      case 'chart':
        return <BarChart3 className="w-4 h-4" />;
      case 'monitor':
        return <Monitor className="w-4 h-4" />;
      case 'users':
        return <Users className="w-4 h-4" />;
      case 'folder':
        return <FolderArchive className="w-4 h-4" />;
      case 'activity':
        return <Activity className="w-4 h-4" />;
      case 'file':
        return <FileText className="w-4 h-4" />;
      case 'shield':
        return <Shield className="w-4 h-4" />;
      case 'star':
        return <Star className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  // Helper for color styles
  const getColorClasses = (color: HeroPool['color']) => {
    switch (color) {
      case 'purple':
        return {
          iconBg: 'bg-purple-500 group-hover:bg-purple-600',
          border: 'border-purple-100 hover:border-purple-300',
          ring: 'focus:ring-purple-400',
        };
      case 'blue':
        return {
          iconBg: 'bg-sky-500 group-hover:bg-sky-600',
          border: 'border-blue-100 hover:border-blue-300',
          ring: 'focus:ring-sky-400',
        };
      case 'emerald':
        return {
          iconBg: 'bg-emerald-500 group-hover:bg-emerald-600',
          border: 'border-emerald-100 hover:border-emerald-300',
          ring: 'focus:ring-emerald-400',
        };
      case 'navy':
        return {
          iconBg: 'bg-[#10233f] group-hover:bg-[#1e3a8a]',
          border: 'border-slate-200 hover:border-slate-400',
          ring: 'focus:ring-slate-500',
        };
      case 'amber':
        return {
          iconBg: 'bg-amber-500 group-hover:bg-amber-600',
          border: 'border-amber-100 hover:border-amber-300',
          ring: 'focus:ring-amber-400',
        };
      case 'rose':
        return {
          iconBg: 'bg-rose-500 group-hover:bg-rose-600',
          border: 'border-rose-100 hover:border-rose-300',
          ring: 'focus:ring-rose-400',
        };
      default:
        return {
          iconBg: 'bg-sky-500',
          border: 'border-sky-200',
          ring: 'focus:ring-sky-400',
        };
    }
  };

  return (
    <section
      id="quipucamayoc-portal-hero"
      className="relative pt-28 pb-16 px-4 sm:px-6 md:px-8 overflow-hidden bg-radial from-sky-50/70 via-slate-50/50 to-white"
    >
      {/* Background ambient decorative light grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Floating Customization Toolbar */}
        <div className="mb-4 inline-flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/90 backdrop-blur-md rounded-full border border-slate-200 shadow-md text-xs">
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            id="toggle-customization-btn"
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isCustomizing
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Move className="w-3.5 h-3.5" />
            <span>{isCustomizing ? 'Listo / Guardar Vista' : 'Mover Líneas, Cubos 3D y Pools'}</span>
          </button>

          {isCustomizing && (
            <>
              {/* Add / Duplicate Lines */}
              <button
                onClick={handleAddSolidLine}
                className="px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-50 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                title="Añadir o duplicar una línea sólida"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Línea Sólida</span>
              </button>

              <button
                onClick={handleAddDashedLine}
                className="px-3 py-1.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-50 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                title="Añadir o duplicar una línea discontinua"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Línea Discontinua</span>
              </button>

              {/* Line 360° Rotation Quick Bar when a line is selected */}
              {selectedLineId && (
                <div className="flex items-center gap-1 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200 text-xs">
                  <Compass className="w-3.5 h-3.5 text-sky-600" />
                  <span className="font-semibold text-sky-900 text-[11px]">Girar Línea:</span>
                  <button
                    onClick={() => handleRotateLine(selectedLineId, 270)}
                    className="px-1.5 py-0.5 text-[10px] font-bold bg-white text-slate-700 hover:bg-sky-100 rounded border border-slate-200 cursor-pointer"
                    title="Girar 90° hacia Arriba (270°)"
                  >
                    ↑ Arriba
                  </button>
                  <button
                    onClick={() => handleRotateLine(selectedLineId, 90)}
                    className="px-1.5 py-0.5 text-[10px] font-bold bg-white text-slate-700 hover:bg-sky-100 rounded border border-slate-200 cursor-pointer"
                    title="Girar 90° hacia Abajo (90°)"
                  >
                    ↓ Abajo
                  </button>
                  <button
                    onClick={() => handleRotateLine(selectedLineId, 180)}
                    className="px-1.5 py-0.5 text-[10px] font-bold bg-white text-slate-700 hover:bg-sky-100 rounded border border-slate-200 cursor-pointer"
                    title="Girar hacia la Izquierda (180°)"
                  >
                    ← Izq
                  </button>
                  <button
                    onClick={() => handleRotateLine(selectedLineId, 0)}
                    className="px-1.5 py-0.5 text-[10px] font-bold bg-white text-slate-700 hover:bg-sky-100 rounded border border-slate-200 cursor-pointer"
                    title="Girar hacia la Derecha (0°)"
                  >
                    → Der
                  </button>
                  <button
                    onClick={(e) => handleStepLineRotation(selectedLineId, 15, e)}
                    className="px-1.5 py-0.5 text-[10px] font-bold bg-white text-sky-700 hover:bg-sky-100 rounded border border-slate-200 cursor-pointer"
                    title="Girar +15°"
                  >
                    +15°
                  </button>
                </div>
              )}

              <button
                onClick={handleOpenAddPool}
                id="btn-add-pool"
                className="px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Pool</span>
              </button>

              <button
                onClick={handleAddButton}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Botón</span>
              </button>

              <button
                onClick={() => {
                  localStorage.setItem('quipucamayoc_floating_kpi_fase1_visible_v1', 'true');
                  window.dispatchEvent(new CustomEvent('quipucamayoc_duplicate_floating_kpi'));
                }}
                id="btn-duplicate-kpi-toolbar"
                className="px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-full flex items-center gap-1 cursor-pointer transition-colors border border-sky-200"
                title="Duplicar bloque de números flotantes e indicador KPI"
              >
                <Copy className="w-3.5 h-3.5 text-sky-600" />
                <span>+ Duplicar Bloque KPI</span>
              </button>

              <button
                onClick={() => {
                  localStorage.setItem('quipucamayoc_floating_kpi_fase1_visible_v1', 'true');
                  localStorage.removeItem('quipucamayoc_floating_kpi_fase1_pos_v2');
                  window.dispatchEvent(new Event('storage'));
                  window.location.reload();
                }}
                className="px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-full flex items-center gap-1 cursor-pointer transition-colors border border-sky-200"
                title="Mostrar y alinear números flotantes (Fase 1) sobre la plataforma"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Números Flotantes KPI</span>
              </button>

              <button
                onClick={() => {
                  setSelectedCubeKey((prev) => (prev ? null : 'purple'));
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1 cursor-pointer transition-colors border ${
                  selectedCubeKey
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'text-purple-800 bg-purple-50 hover:bg-purple-100 border-purple-200'
                }`}
                title="Ajustar tamaño, ancho y grosor de los cubos 3D"
              >
                <Box className="w-3.5 h-3.5" />
                <span>Dimensiones Cubos 3D</span>
              </button>

              {/* 3D Movable Circle Toolbar Controls */}
              <button
                onClick={() => setIsSpheresAnimationActive((prev) => !prev)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer transition-colors border shadow-xs ${
                  isSpheresAnimationActive
                    ? 'text-sky-900 bg-sky-100 hover:bg-sky-200 border-sky-300'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-300'
                }`}
                title="Alternar animación dinámica de elevación 3D desde la base del cubo"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isSpheresAnimationActive ? 'text-sky-600' : 'text-slate-500'}`} />
                <span>{isSpheresAnimationActive ? 'Elevación Dinámica: Activa' : 'Elevación: Pausada'}</span>
              </button>

              <button
                onClick={() =>
                  handleDuplicateCircle(selectedCircleId || circles3D[0]?.id || 'circle-3d-primary')
                }
                className="px-3 py-1.5 text-xs font-semibold text-purple-900 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center gap-1.5 cursor-pointer transition-colors border border-purple-300 shadow-xs"
                title="Duplicar el círculo 3D"
              >
                <Copy className="w-3.5 h-3.5 text-purple-700" />
                <span>+ Duplicar Círculo 3D</span>
              </button>

              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-slate-200 shadow-xs">
                <span className="text-slate-600 text-[11px] font-semibold flex items-center gap-1 mr-0.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Color Círculo 3D:</span>
                </span>
                {(['purple', 'green', 'cyan', 'blue'] as Circle3DColor[]).map((col) => {
                  const activeCircle =
                    circles3D.find((c) => c.id === (selectedCircleId || circles3D[0]?.id)) || circles3D[0];
                  const isCurrent = activeCircle?.color === col;
                  const info = CIRCLE_3D_COLORS[col];
                  return (
                    <button
                      key={col}
                      onClick={() => handleSetCircleColor(activeCircle.id, col)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        isCurrent
                          ? `${info.bgClass} text-white shadow-xs scale-105`
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                      title={`Cambiar color a ${info.name}`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: isCurrent ? '#ffffff' : info.hex }}
                      />
                      <span>{info.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Restore Hidden 3D Elements Menu */}
              {Object.values(cubesVisibility).some((v) => !v) && (
                <div className="relative">
                  <button
                    onClick={() => setShowRestoreMenu(!showRestoreMenu)}
                    className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-full flex items-center gap-1 cursor-pointer transition-colors border border-amber-200"
                    title="Restaurar cubos 3D o esferas eliminadas"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                    <span>Restaurar 3D</span>
                  </button>
                  {showRestoreMenu && (
                    <div className="absolute top-full right-0 mt-1 w-52 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
                      <div className="font-bold text-slate-700 pb-1 mb-1 border-b border-slate-100 flex items-center justify-between">
                        <span>Elementos Eliminados</span>
                        <button
                          onClick={() => {
                            handleRestoreAllElements();
                            setShowRestoreMenu(false);
                          }}
                          className="text-[10px] text-sky-600 hover:underline font-semibold cursor-pointer"
                        >
                          Restaurar Todo
                        </button>
                      </div>
                      {!cubesVisibility.cyan && (
                        <button
                          onClick={() => handleRestoreElement('cyan')}
                          className="w-full text-left px-2 py-1 rounded-lg text-slate-700 hover:bg-sky-50 flex items-center justify-between text-[11px] cursor-pointer"
                        >
                          <span>Cubo Cyan (% Anexo 4)</span>
                          <span className="text-sky-600 font-bold">+</span>
                        </button>
                      )}
                      {!cubesVisibility.spherePurple && (
                        <button
                          onClick={() => handleRestoreElement('spherePurple')}
                          className="w-full text-left px-2 py-1 rounded-lg text-slate-700 hover:bg-sky-50 flex items-center justify-between text-[11px] cursor-pointer"
                        >
                          <span>Esfera Púrpura</span>
                          <span className="text-purple-600 font-bold">+</span>
                        </button>
                      )}
                      {!cubesVisibility.sphereCyan && (
                        <button
                          onClick={() => handleRestoreElement('sphereCyan')}
                          className="w-full text-left px-2 py-1 rounded-lg text-slate-700 hover:bg-sky-50 flex items-center justify-between text-[11px] cursor-pointer"
                        >
                          <span>Esfera Celeste</span>
                          <span className="text-sky-600 font-bold">+</span>
                        </button>
                      )}
                      {!cubesVisibility.green && (
                        <button
                          onClick={() => handleRestoreElement('green')}
                          className="w-full text-left px-2 py-1 rounded-lg text-slate-700 hover:bg-sky-50 flex items-center justify-between text-[11px] cursor-pointer"
                        >
                          <span>Cubo Verde (% Anexo 3)</span>
                          <span className="text-emerald-600 font-bold">+</span>
                        </button>
                      )}
                      {!cubesVisibility.blue && (
                        <button
                          onClick={() => handleRestoreElement('blue')}
                          className="w-full text-left px-2 py-1 rounded-lg text-slate-700 hover:bg-sky-50 flex items-center justify-between text-[11px] cursor-pointer"
                        >
                          <span>Cubo Azul (% Fase 1)</span>
                          <span className="text-blue-600 font-bold">+</span>
                        </button>
                      )}
                      {!cubesVisibility.purple && (
                        <button
                          onClick={() => handleRestoreElement('purple')}
                          className="w-full text-left px-2 py-1 rounded-lg text-slate-700 hover:bg-sky-50 flex items-center justify-between text-[11px] cursor-pointer"
                        >
                          <span>Cubo Púrpura (% Anexo 1)</span>
                          <span className="text-purple-600 font-bold">+</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleResetPositions}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
                title="Restablecer posiciones originales de cubos, líneas y pools"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Oficina de Racionalización Header Tagline */}
        <div className="flex items-center gap-2 mb-2 select-none">
          <span className="font-poppins font-bold text-2xl sm:text-3xl text-sky-500 tracking-tight flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
            <EditableText
              storageKey="portal_brand_name_oficina"
              defaultText="Oficina de Racionalización"
              tag="span"
            />
          </span>
        </div>

        {/* Big Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black font-poppins text-[#10233f] tracking-tight leading-tight max-w-4xl">
          <EditableText
            storageKey="quipucamayoc_main_title"
            defaultText="Sistemas Digitales Institucionales"
            tag="span"
          />
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
          <EditableText
            storageKey="quipucamayoc_main_subtitle"
            defaultText="Transformamos la tecnología en soluciones innovadoras que impulsan el avance digital en la UNMSM"
            tag="span"
          />
        </p>

        {/* Action Buttons Section - Movable and Editable */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 relative">
          {actionButtons.map((btn, index) => {
            const isFirst = index === 0;
            const isLast = index === actionButtons.length - 1;

            const handleBtnClick = () => {
              if (btn.actionType === 'scroll') {
                const el = document.getElementById(btn.target);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              } else if (onExploreSystems) {
                onExploreSystems();
              }
            };

            return (
              <div key={btn.id} className="relative group flex items-center">
                {isCustomizing && (
                  <button
                    onClick={() => handleMoveButton(index, 'left')}
                    disabled={isFirst}
                    className={`p-1 mr-1 text-slate-400 hover:text-slate-700 bg-white rounded-full border border-slate-200 shadow-2xs ${
                      isFirst ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100'
                    }`}
                    title="Mover botón a la izquierda"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={handleBtnClick}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleEditButton(index);
                  }}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer ${
                    btn.variant === 'dark'
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'border border-sky-300/80 bg-white/90 text-sky-700 hover:bg-sky-500 hover:text-white hover:border-sky-500'
                  }`}
                >
                  {btn.variant === 'dark' ? (
                    <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : null}

                  {editingBtnIndex === index ? (
                    <input
                      type="text"
                      value={tempBtnLabel}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setTempBtnLabel(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveButtonLabel(index, tempBtnLabel);
                          setEditingBtnIndex(null);
                        } else if (e.key === 'Escape') {
                          setEditingBtnIndex(null);
                        }
                      }}
                      onBlur={() => {
                        handleSaveButtonLabel(index, tempBtnLabel);
                        setEditingBtnIndex(null);
                      }}
                      className={`rounded px-2 py-0.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 min-w-[140px] ${
                        btn.variant === 'dark'
                          ? 'bg-slate-800 text-white border border-slate-700'
                          : 'bg-white text-slate-800 border border-sky-300'
                      }`}
                    />
                  ) : (
                    <span className="inline-flex items-center gap-1.5 group/btnlabel">
                      <span>{btn.label}</span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditButton(index);
                        }}
                        className="opacity-60 hover:opacity-100 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-all cursor-pointer inline-flex items-center justify-center"
                        title="Clic para editar el nombre de este botón"
                      >
                        <Edit3 className="w-3 h-3" />
                      </span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteButton(btn.id);
                        }}
                        className="opacity-0 group-hover/btnlabel:opacity-60 hover:!opacity-100 p-0.5 rounded-full hover:bg-rose-500/20 text-rose-500 hover:text-rose-700 transition-all cursor-pointer inline-flex items-center justify-center"
                        title="Eliminar este botón"
                      >
                        <Trash2 className="w-3 h-3" />
                      </span>
                    </span>
                  )}

                  {btn.variant !== 'dark' && editingBtnIndex !== index ? (
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 shrink-0" />
                  ) : null}
                </button>

                {isCustomizing && (
                  <div className="flex items-center ml-1 gap-0.5 bg-white p-0.5 rounded-full border border-slate-200 shadow-xs">
                    <button
                      onClick={() => handleEditButton(index)}
                      className="p-1 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-full cursor-pointer"
                      title="Editar texto del botón"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteButton(btn.id)}
                      className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full cursor-pointer"
                      title="Eliminar este botón"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMoveButton(index, 'right')}
                      disabled={isLast}
                      className={`p-1 text-slate-400 hover:text-slate-700 rounded-full ${
                        isLast ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100'
                      }`}
                      title="Mover botón a la derecha"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Isometric 3D Technology Landscape Canvas with Movable & Draggable Pools */}
        <div
          ref={canvasRef}
          className={`mt-10 w-full max-w-5xl relative min-h-[380px] sm:min-h-[460px] flex items-center justify-center select-none rounded-3xl transition-all ${
            isCustomizing ? 'ring-2 ring-sky-400/60 bg-sky-50/20' : ''
          }`}
        >
          {isCustomizing && (
            <div className="absolute top-2 left-3 z-40 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-sky-200 text-xs font-semibold text-sky-800 shadow-md flex items-center gap-2 pointer-events-none animate-pulse">
              <Move className="w-3.5 h-3.5 text-sky-600" />
              <span>Haz clic y arrastra directamente cualquier línea, cubo 3D o pool para moverlo</span>
            </div>
          )}

          {/* Isometric Campus Grid SVG Graphic */}
          <svg
            ref={svgRef}
            className="w-full h-auto max-h-[440px] drop-shadow-lg"
            viewBox="0 0 1000 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="iso-axis-1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="iso-platform" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="iso-glow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
              <filter id="iso-drag-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0284c7" floodOpacity="0.5" />
              </filter>
              {/* 3D Sphere Gradients & Lighting */}
              <radialGradient id="grad-3d-purple" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#f3e8ff" />
                <stop offset="25%" stopColor="#d8b4fe" />
                <stop offset="65%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#581c87" />
              </radialGradient>
              <radialGradient id="grad-3d-green" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="25%" stopColor="#86efac" />
                <stop offset="65%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#14532d" />
              </radialGradient>
              <radialGradient id="grad-3d-cyan" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#f0f9ff" />
                <stop offset="25%" stopColor="#7dd3fc" />
                <stop offset="65%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0c4a6e" />
              </radialGradient>
              <radialGradient id="grad-3d-blue" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#eff6ff" />
                <stop offset="25%" stopColor="#93c5fd" />
                <stop offset="65%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </radialGradient>
              <filter id="circle-3d-glow-purple" x="-35%" y="-35%" width="170%" height="170%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#9333ea" floodOpacity="0.55" />
              </filter>
              <filter id="circle-3d-glow-green" x="-35%" y="-35%" width="170%" height="170%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#16a34a" floodOpacity="0.55" />
              </filter>
              <filter id="circle-3d-glow-cyan" x="-35%" y="-35%" width="170%" height="170%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0284c7" floodOpacity="0.55" />
              </filter>
              <filter id="circle-3d-glow-blue" x="-35%" y="-35%" width="170%" height="170%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#2563eb" floodOpacity="0.55" />
              </filter>
            </defs>

            {/* Isometric Axis Lines (Solid & Dashed - Movable, Editable & Duplicable) */}
            {lines.map((line) => {
              const isSelected = selectedLineId === line.id;
              const isHovered = hoveredLineId === line.id;
              const isDragging = draggingLineTarget?.id === line.id;
              const lx1 = line.x1 + line.dx;
              const ly1 = line.y1 + line.dy;
              const lx2 = line.x2 + line.dx;
              const ly2 = line.y2 + line.dy;

              const midX = (lx1 + lx2) / 2;
              const midY = (ly1 + ly2) / 2;
              const currentAngleRad = Math.atan2(ly2 - ly1, lx2 - lx1);
              const currentAngleDeg = Math.round(((currentAngleRad * (180 / Math.PI)) + 360) % 360);
              const compassRadius = 36;
              const knobX = midX + compassRadius * Math.cos(currentAngleRad);
              const knobY = midY + compassRadius * Math.sin(currentAngleRad);

              return (
                <g
                  key={line.id}
                  className="group"
                  onMouseEnter={() => setHoveredLineId(line.id)}
                  onMouseLeave={() => setHoveredLineId(null)}
                >
                  {/* Visual Line */}
                  <line
                    x1={lx1}
                    y1={ly1}
                    x2={lx2}
                    y2={ly2}
                    stroke={isSelected ? '#0284c7' : 'url(#iso-axis-1)'}
                    strokeWidth={isSelected ? 4.5 : (line.strokeWidth || 3)}
                    strokeDasharray={line.type === 'dashed' ? '7 7' : undefined}
                    filter={isSelected || isDragging ? 'url(#iso-drag-glow)' : undefined}
                    className="transition-all pointer-events-none"
                  />

                  {/* Broad invisible hit area for easy clicking & dragging */}
                  <line
                    x1={lx1}
                    y1={ly1}
                    x2={lx2}
                    y2={ly2}
                    stroke="transparent"
                    strokeWidth={32}
                    strokeLinecap="round"
                    className="cursor-grab active:cursor-grabbing pointer-events-auto"
                    onMouseDown={(e) => handleStartDragLine(e, line.id, 'move')}
                    onTouchStart={(e) => handleStartDragLine(e, line.id, 'move')}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLineId(line.id);
                    }}
                  >
                    <title>
                      {line.type === 'dashed' ? 'Línea Discontinua' : 'Línea Sólida'} (Arrastra para mover o haz clic para rotar en 360° y editar)
                    </title>
                  </line>

                  {/* Endpoint 1 handle (Draggable to change angle/stretch) */}
                  {(isSelected || isCustomizing || isHovered) && (
                    <circle
                      cx={lx1}
                      cy={ly1}
                      r={isSelected ? 7 : 5}
                      fill="#0284c7"
                      stroke="#ffffff"
                      strokeWidth={2}
                      className="cursor-crosshair active:cursor-crosshair pointer-events-auto hover:scale-125 transition-transform drop-shadow-sm"
                      onMouseDown={(e) => handleStartDragLine(e, line.id, 'p1')}
                      onTouchStart={(e) => handleStartDragLine(e, line.id, 'p1')}
                    >
                      <title>Ajustar extremo inicial</title>
                    </circle>
                  )}

                  {/* Endpoint 2 handle (Draggable to change angle/stretch) */}
                  {(isSelected || isCustomizing || isHovered) && (
                    <circle
                      cx={lx2}
                      cy={ly2}
                      r={isSelected ? 7 : 5}
                      fill="#0284c7"
                      stroke="#ffffff"
                      strokeWidth={2}
                      className="cursor-crosshair active:cursor-crosshair pointer-events-auto hover:scale-125 transition-transform drop-shadow-sm"
                      onMouseDown={(e) => handleStartDragLine(e, line.id, 'p2')}
                      onTouchStart={(e) => handleStartDragLine(e, line.id, 'p2')}
                    >
                      <title>Ajustar extremo final</title>
                    </circle>
                  )}

                  {/* Interactive 360° Rotation Compass & Dial (Up, Down, Left, Right) */}
                  {(isSelected || isCustomizing || isHovered) && (
                    <g className="pointer-events-auto">
                      {/* Central Pivot Dot */}
                      <circle
                        cx={midX}
                        cy={midY}
                        r={3.5}
                        fill="#0284c7"
                        stroke="#ffffff"
                        strokeWidth={1.5}
                        className="pointer-events-none"
                      />

                      {/* 360° Compass Orbit Ring */}
                      <circle
                        cx={midX}
                        cy={midY}
                        r={compassRadius}
                        fill="rgba(2, 132, 199, 0.05)"
                        stroke="#0284c7"
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                        opacity={isSelected ? 0.95 : 0.65}
                        className="cursor-crosshair pointer-events-auto"
                        onMouseDown={(e) => handleStartDragLine(e, line.id, 'rotate')}
                        onTouchStart={(e) => handleStartDragLine(e, line.id, 'rotate')}
                      >
                        <title>Anillo de rotación 360°: Arrastra para girar hacia arriba, abajo, izquierda o derecha</title>
                      </circle>

                      {/* Cardinal Snapping Ticks */}
                      {/* 270° Arriba */}
                      <circle
                        cx={midX}
                        cy={midY - compassRadius}
                        r={3}
                        fill="#0284c7"
                        className="cursor-pointer hover:scale-150 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRotateLine(line.id, 270);
                        }}
                      >
                        <title>Girar hacia Arriba (270°)</title>
                      </circle>
                      {/* 90° Abajo */}
                      <circle
                        cx={midX}
                        cy={midY + compassRadius}
                        r={3}
                        fill="#0284c7"
                        className="cursor-pointer hover:scale-150 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRotateLine(line.id, 90);
                        }}
                      >
                        <title>Girar hacia Abajo (90°)</title>
                      </circle>
                      {/* 0° Derecha */}
                      <circle
                        cx={midX + compassRadius}
                        cy={midY}
                        r={3}
                        fill="#0284c7"
                        className="cursor-pointer hover:scale-150 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRotateLine(line.id, 0);
                        }}
                      >
                        <title>Girar hacia la Derecha (0°)</title>
                      </circle>
                      {/* 180° Izquierda */}
                      <circle
                        cx={midX - compassRadius}
                        cy={midY}
                        r={3}
                        fill="#0284c7"
                        className="cursor-pointer hover:scale-150 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRotateLine(line.id, 180);
                        }}
                      >
                        <title>Girar hacia la Izquierda (180°)</title>
                      </circle>

                      {/* Radial Guide Ray */}
                      <line
                        x1={midX}
                        y1={midY}
                        x2={knobX}
                        y2={knobY}
                        stroke="#0284c7"
                        strokeWidth={2}
                        className="pointer-events-none"
                      />

                      {/* 360° Rotation Knob Handle */}
                      <circle
                        cx={knobX}
                        cy={knobY}
                        r={8}
                        fill="#0284c7"
                        stroke="#ffffff"
                        strokeWidth={2.5}
                        className="cursor-crosshair active:cursor-crosshair pointer-events-auto hover:scale-125 transition-transform drop-shadow-md"
                        onMouseDown={(e) => handleStartDragLine(e, line.id, 'rotate')}
                        onTouchStart={(e) => handleStartDragLine(e, line.id, 'rotate')}
                      >
                        <title>Girar línea en 360° (Arrastra hacia arriba, abajo, izquierda o derecha)</title>
                      </circle>
                      <circle
                        cx={knobX}
                        cy={knobY}
                        r={3}
                        fill="#ffffff"
                        className="pointer-events-none"
                      />

                      {/* Angle Readout Badge */}
                      <g className="pointer-events-none">
                        <rect
                          x={midX - 28}
                          y={midY - compassRadius - 22}
                          width={56}
                          height={18}
                          rx={9}
                          fill="rgba(15, 23, 42, 0.9)"
                          stroke="#38bdf8"
                          strokeWidth={0.8}
                        />
                        <text
                          x={midX}
                          y={midY - compassRadius - 10}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="9.5"
                          fontWeight="bold"
                        >
                          {currentAngleDeg}° {currentAngleDeg >= 250 && currentAngleDeg <= 290 ? '↑' : currentAngleDeg >= 70 && currentAngleDeg <= 110 ? '↓' : (currentAngleDeg >= 340 || currentAngleDeg <= 20) ? '→' : currentAngleDeg >= 160 && currentAngleDeg <= 200 ? '←' : ''}
                        </text>
                      </g>
                    </g>
                  )}
                </g>
              );
            })}
            
            {/* Center Isometric Base Platform (Draggable & Resizable) */}
            {cubesVisibility.center && (() => {
              const polys = computeCubePolygons('center', cubesDimensions.center);
              const isSelected = selectedCubeKey === 'center';
              return (
                <g
                  transform={`translate(${cubesPositions.center.dx}, ${cubesPositions.center.dy})`}
                  className={`cursor-grab active:cursor-grabbing pointer-events-auto transition-all ${
                    draggingCubeKey === 'center' ? 'opacity-95' : 'hover:brightness-105'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCubeKey((prev) => (prev === 'center' ? null : 'center'));
                  }}
                  onMouseDown={(e) => handleStartDragCube(e, 'center')}
                  onTouchStart={(e) => handleStartDragCube(e, 'center')}
                  onMouseEnter={() => setHoveredCubeKey('center')}
                  onMouseLeave={() => setHoveredCubeKey(null)}
                  filter={draggingCubeKey === 'center' ? 'url(#iso-drag-glow)' : undefined}
                >
                  <title>Plataforma Central UNMSM (Arrastra para mover, clic para ajustar dimensiones)</title>
                  <polygon
                    points={polys.pTop}
                    fill="url(#iso-platform)"
                    stroke={isSelected ? '#0284c7' : '#93c5fd'}
                    strokeWidth={isSelected ? '3.5' : '2.5'}
                    className="drop-shadow-md"
                  />
                  <polygon points={polys.pLeft} fill="#cbd5e1" />
                  <polygon points={polys.pRight} fill="#94a3b8" />

                  {/* Interactive resize handles */}
                  {(isSelected || isCustomizing) && (
                    <>
                      {/* Width resize handle (East tip) */}
                      <circle
                        cx={polys.cx + polys.rx}
                        cy={polys.cy}
                        r={6.5}
                        fill="#0284c7"
                        stroke="#ffffff"
                        strokeWidth={2}
                        className="cursor-ew-resize pointer-events-auto hover:scale-125 transition-transform drop-shadow-sm"
                        onMouseDown={(e) => handleStartResize(e, 'center', 'width')}
                        onTouchStart={(e) => handleStartResize(e, 'center', 'width')}
                      >
                        <title>Arrastra horizontalmente para alargar o achicar ancho</title>
                      </circle>
                      {/* Thickness resize handle (Bottom tip) */}
                      <circle
                        cx={polys.cx}
                        cy={polys.cy + polys.ry + polys.thickness}
                        r={6.5}
                        fill="#0284c7"
                        stroke="#ffffff"
                        strokeWidth={2}
                        className="cursor-ns-resize pointer-events-auto hover:scale-125 transition-transform drop-shadow-sm"
                        onMouseDown={(e) => handleStartResize(e, 'center', 'thickness')}
                        onTouchStart={(e) => handleStartResize(e, 'center', 'thickness')}
                      >
                        <title>Arrastra verticalmente para alargar o achicar grosor</title>
                      </circle>
                      {/* Depth resize handle (Top tip) */}
                      <circle
                        cx={polys.cx}
                        cy={polys.cy - polys.ry}
                        r={5.5}
                        fill="#0284c7"
                        stroke="#ffffff"
                        strokeWidth={2}
                        className="cursor-ns-resize pointer-events-auto hover:scale-125 transition-transform drop-shadow-sm"
                        onMouseDown={(e) => handleStartResize(e, 'center', 'depth')}
                        onTouchStart={(e) => handleStartResize(e, 'center', 'depth')}
                      >
                        <title>Arrastra verticalmente para alargar o achicar profundidad</title>
                      </circle>
                    </>
                  )}
                </g>
              );
            })()}

            {/* Sub Platforms - Movable & Resizable 3D Cubes */}
            {/* 1. Purple cube (% Anexo 1 - Inventario) */}
            {cubesVisibility.purple && (() => {
              const polys = computeCubePolygons('purple', cubesDimensions.purple);
              const isSelected = selectedCubeKey === 'purple';
              const primaryCircle =
                circles3D.find((c) => c.isPrimary) || circles3D[0] || DEFAULT_PRIMARY_CIRCLE;
              const pBaseX = polys.cx;
              const pBaseY = polys.cy + polys.ry + polys.thickness;
              const effectiveZ = primaryCircle.z && primaryCircle.z !== 0 ? primaryCircle.z : 85;
              const pX = pBaseX + primaryCircle.x;
              const pStartY = pBaseY + primaryCircle.y;
              const pTargetY = pStartY - effectiveZ;
              const pY = pBaseY + primaryCircle.y - primaryCircle.z;
              const isCircleActive = selectedCircleId === primaryCircle.id;
              const isThisDragging = draggingCircleTarget?.id === primaryCircle.id;
              const colInfo = CIRCLE_3D_COLORS[primaryCircle.color];

              return (
                <g
                  transform={`translate(${cubesPositions.purple.dx}, ${cubesPositions.purple.dy})`}
                  className={`cursor-grab active:cursor-grabbing pointer-events-auto transition-all ${
                    draggingCubeKey === 'purple' ? 'opacity-95' : 'hover:brightness-105'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCubeKey((prev) => (prev === 'purple' ? null : 'purple'));
                  }}
                  onMouseDown={(e) => handleStartDragCube(e, 'purple')}
                  onTouchStart={(e) => handleStartDragCube(e, 'purple')}
                  onMouseEnter={() => setHoveredCubeKey('purple')}
                  onMouseLeave={() => setHoveredCubeKey(null)}
                  filter={draggingCubeKey === 'purple' ? 'url(#iso-drag-glow)' : undefined}
                >
                  <title>Cubo % Anexo 1 (Inventario) - Haz clic para ajustar tamaño/ancho/grosor, arrastra para mover</title>
                  <polygon
                    points={polys.pTop}
                    fill="#ffffff"
                    stroke={isSelected ? '#7e22ce' : '#c084fc'}
                    strokeWidth={isSelected ? '3.5' : '2.5'}
                  />
                  <polygon points={polys.pLeft} fill="#e9d5ff" />
                  <polygon points={polys.pRight} fill="#d8b4fe" />

                  {/* Interactive resize handles & 3D Movable Circle */}
                  {/* Width resize handle (East tip) - circle:nth-of-type(1) */}
                  <circle
                    cx={polys.cx + polys.rx}
                    cy={polys.cy}
                    r={6.5}
                    fill="#9333ea"
                    stroke="#ffffff"
                    strokeWidth={2}
                    opacity={isSelected || isCustomizing ? 1 : 0.4}
                    className="cursor-ew-resize pointer-events-auto hover:scale-125 transition-transform drop-shadow-sm"
                    onMouseDown={(e) => handleStartResize(e, 'purple', 'width')}
                    onTouchStart={(e) => handleStartResize(e, 'purple', 'width')}
                  >
                    <title>Arrastra horizontalmente para alargar o achicar ancho</title>
                  </circle>

                  {/* 3D MOVABLE CIRCLE (Targeted: circle:nth-of-type(2) - Animación dinámica que asciende desde la base del cubo) */}
                  <circle
                    id="movable-3d-circle-primary"
                    cx={pX}
                    cy={isSpheresAnimationActive && !isThisDragging ? pTargetY : pY}
                    r={primaryCircle.radius || 9}
                    fill={`url(#${colInfo.gradientId})`}
                    stroke="#ffffff"
                    strokeWidth={isCircleActive ? 3 : 2}
                    filter={`url(#${colInfo.filterId})`}
                    className={`cursor-move pointer-events-auto transition-transform ${
                      isCircleActive ? 'scale-125 drop-shadow-md' : 'hover:scale-115'
                    }`}
                    onMouseDown={(e) => handleStartDragCircle(e, primaryCircle.id, 'xy')}
                    onTouchStart={(e) => handleStartDragCircle(e, primaryCircle.id, 'xy')}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCircleId(primaryCircle.id);
                    }}
                    onDoubleClick={(e) => handleToggleCircleColor(primaryCircle.id, e)}
                  >
                    {isSpheresAnimationActive && !isThisDragging && (
                      <animate
                        attributeName="cy"
                        values={`${pStartY}; ${pTargetY}; ${pTargetY - 3}; ${pTargetY}; ${pStartY}`}
                        keyTimes="0; 0.38; 0.65; 0.85; 1"
                        dur="4.5s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.25 0.1 0.25 1; 0.45 0 0.55 1; 0.45 0 0.55 1; 0.4 0 0.2 1"
                      />
                    )}
                    <title>
                      {`Círculo 3D (${colInfo.name}) - Animación dinámica de elevación desde la base del cubo hacia la parte superior. Arrastra para mover en 360°, clic para controles.`}
                    </title>
                  </circle>

                  {/* Depth resize handle (Top tip) - circle:nth-of-type(3) */}
                  <circle
                    cx={polys.cx}
                    cy={polys.cy - polys.ry}
                    r={5.5}
                    fill="#9333ea"
                    stroke="#ffffff"
                    strokeWidth={2}
                    opacity={isSelected || isCustomizing ? 1 : 0.4}
                    className="cursor-ns-resize pointer-events-auto hover:scale-125 transition-transform drop-shadow-sm"
                    onMouseDown={(e) => handleStartResize(e, 'purple', 'depth')}
                    onTouchStart={(e) => handleStartResize(e, 'purple', 'depth')}
                  >
                    <title>Arrastra verticalmente para alargar o achicar profundidad</title>
                  </circle>

                  {/* Launch Ripple at the Base when ascending */}
                  {isSpheresAnimationActive && !isThisDragging && (
                    <ellipse
                      cx={pX}
                      cy={pStartY}
                      rx={8}
                      ry={4}
                      fill="none"
                      stroke={colInfo.strokeColor}
                      strokeWidth={1.5}
                      opacity={0}
                      className="pointer-events-none"
                    >
                      <animate
                        attributeName="rx"
                        values="4; 18; 4"
                        keyTimes="0; 0.22; 1"
                        dur="4.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="ry"
                        values="2; 9; 2"
                        keyTimes="0; 0.22; 1"
                        dur="4.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8; 0; 0"
                        keyTimes="0; 0.22; 1"
                        dur="4.5s"
                        repeatCount="indefinite"
                      />
                    </ellipse>
                  )}

                  {/* 3D Ground Shadow at the base of the cube */}
                  <ellipse
                    cx={pX}
                    cy={pStartY}
                    rx={Math.max(4, 9 * (1 - effectiveZ * 0.002))}
                    ry={Math.max(2, 4.5 * (1 - effectiveZ * 0.002))}
                    fill="#000000"
                    opacity={0.35}
                    className="pointer-events-none"
                  >
                    {isSpheresAnimationActive && !isThisDragging && (
                      <>
                        <animate
                          attributeName="rx"
                          values={`9; ${Math.max(4, 9 * (1 - effectiveZ * 0.002))}; ${Math.max(4, 9 * (1 - effectiveZ * 0.002))}; 9`}
                          keyTimes="0; 0.38; 0.85; 1"
                          dur="4.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.45; 0.15; 0.15; 0.45"
                          keyTimes="0; 0.38; 0.85; 1"
                          dur="4.5s"
                          repeatCount="indefinite"
                        />
                      </>
                    )}
                  </ellipse>

                  {/* Dashed Height Trail (Rastro punteado que se eleva y desaparece al llegar a la cima) */}
                  {isSpheresAnimationActive && !isThisDragging ? (
                    <line
                      x1={pX}
                      y1={pStartY}
                      x2={pX}
                      y2={pTargetY}
                      stroke={colInfo.strokeColor}
                      strokeWidth={1.75}
                      strokeDasharray="3 3"
                      className="pointer-events-none"
                    >
                      <animate
                        attributeName="y2"
                        values={`${pStartY}; ${pTargetY}; ${pTargetY}; ${pTargetY}; ${pStartY}`}
                        keyTimes="0; 0.38; 0.85; 0.95; 1"
                        dur="4.5s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.25 0.1 0.25 1; 0 0 1 1; 0.4 0 0.2 1; 0 0 1 1"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.85; 0.85; 0; 0; 0.85"
                        keyTimes="0; 0.35; 0.48; 0.95; 1"
                        dur="4.5s"
                        repeatCount="indefinite"
                      />
                    </line>
                  ) : (
                    primaryCircle.z !== 0 && (
                      <line
                        x1={pX}
                        y1={pStartY}
                        x2={pX}
                        y2={pY}
                        stroke={colInfo.strokeColor}
                        strokeWidth={1.5}
                        strokeDasharray="2 2"
                        opacity={0.8}
                        className="pointer-events-none"
                      />
                    )
                  )}

                  {/* Ascending Photon Light Bead along the dashed path */}
                  {isSpheresAnimationActive && !isThisDragging && (
                    <circle
                      cx={pX}
                      cy={pStartY}
                      r={3}
                      fill="#ffffff"
                      filter={`url(#${colInfo.filterId})`}
                      opacity={0}
                      className="pointer-events-none"
                    >
                      <animate
                        attributeName="cy"
                        values={`${pStartY}; ${pTargetY}; ${pTargetY}`}
                        keyTimes="0; 0.38; 1"
                        dur="4.5s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.25 0.1 0.25 1; 0 0 1 1"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.9; 0.9; 0; 0"
                        keyTimes="0; 0.32; 0.42; 1"
                        dur="4.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Interactive Z-Axis Elevation Stem & Arrow Handle */}
                  {(isCircleActive || !isSpheresAnimationActive || isThisDragging) && (
                    <g
                      className="cursor-ns-resize pointer-events-auto hover:scale-125 transition-transform"
                      onMouseDown={(e) => handleStartDragCircle(e, primaryCircle.id, 'z')}
                      onTouchStart={(e) => handleStartDragCircle(e, primaryCircle.id, 'z')}
                    >
                      <line
                        x1={pX}
                        y1={(isSpheresAnimationActive && !isThisDragging ? pTargetY : pY) - 9}
                        x2={pX}
                        y2={(isSpheresAnimationActive && !isThisDragging ? pTargetY : pY) - 24}
                        stroke={colInfo.strokeColor}
                        strokeWidth={2.5}
                      />
                      <polygon
                        points={`${pX},${(isSpheresAnimationActive && !isThisDragging ? pTargetY : pY) - 30} ${pX - 5},${(isSpheresAnimationActive && !isThisDragging ? pTargetY : pY) - 22} ${pX + 5},${(isSpheresAnimationActive && !isThisDragging ? pTargetY : pY) - 22}`}
                        fill={colInfo.strokeColor}
                      />
                      <title>Eje Z (Elevación 3D): Arrastra verticalmente para subir o bajar en el espacio 3D</title>
                    </g>
                  )}

                  {/* 360° Rotational Orbit Compass Ring & Handle */}
                  <g>
                    <ellipse
                      cx={pX}
                      cy={isSpheresAnimationActive && !isThisDragging ? pTargetY : pY}
                      rx={22}
                      ry={11}
                      fill="none"
                      stroke={colInfo.ringColor}
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                      opacity={isCircleActive ? 0.8 : 0.4}
                      className="pointer-events-none"
                    >
                      {isSpheresAnimationActive && !isThisDragging && (
                        <animate
                          attributeName="cy"
                          values={`${pStartY}; ${pTargetY}; ${pTargetY - 3}; ${pTargetY}; ${pStartY}`}
                          keyTimes="0; 0.38; 0.65; 0.85; 1"
                          dur="4.5s"
                          repeatCount="indefinite"
                          calcMode="spline"
                          keySplines="0.25 0.1 0.25 1; 0.45 0 0.55 1; 0.45 0 0.55 1; 0.4 0 0.2 1"
                        />
                      )}
                    </ellipse>
                    {/* Angle pointer inside circle */}
                    <line
                      x1={pX}
                      y1={isSpheresAnimationActive && !isThisDragging ? pTargetY : pY}
                      x2={pX + 7 * Math.cos((primaryCircle.rotation360 * Math.PI) / 180)}
                      y2={(isSpheresAnimationActive && !isThisDragging ? pTargetY : pY) + 3.5 * Math.sin((primaryCircle.rotation360 * Math.PI) / 180)}
                      stroke="#ffffff"
                      strokeWidth={2}
                      strokeLinecap="round"
                      className="pointer-events-none"
                    />
                    {/* 360° Rotation Drag Handle */}
                    {(isCircleActive || !isSpheresAnimationActive || isThisDragging) && (
                      <g
                        className="cursor-crosshair pointer-events-auto hover:scale-125 transition-transform"
                        onMouseDown={(e) => handleStartDragCircle(e, primaryCircle.id, 'rotate')}
                        onTouchStart={(e) => handleStartDragCircle(e, primaryCircle.id, 'rotate')}
                      >
                        <circle
                          cx={pX + 22 * Math.cos((primaryCircle.rotation360 * Math.PI) / 180)}
                          cy={(isSpheresAnimationActive && !isThisDragging ? pTargetY : pY) + 11 * Math.sin((primaryCircle.rotation360 * Math.PI) / 180)}
                          r={4.5}
                          fill={colInfo.strokeColor}
                          stroke="#ffffff"
                          strokeWidth={1.5}
                        />
                        <title>Giro 360°: Arrastra para orientar o rotar 360 grados</title>
                      </g>
                    )}
                  </g>
                </g>
              );
            })()}

            {/* 2. Blue cube (% Fase 1) */}
            {cubesVisibility.blue && (() => {
              const polys = computeCubePolygons('blue', cubesDimensions.blue);
              const isSelected = selectedCubeKey === 'blue';
              return (
                <g
                  transform={`translate(${cubesPositions.blue.dx}, ${cubesPositions.blue.dy})`}
                  className={`cursor-grab active:cursor-grabbing pointer-events-auto transition-all ${
                    draggingCubeKey === 'blue' ? 'opacity-95' : 'hover:brightness-105'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCubeKey((prev) => (prev === 'blue' ? null : 'blue'));
                  }}
                  onMouseDown={(e) => handleStartDragCube(e, 'blue')}
                  onTouchStart={(e) => handleStartDragCube(e, 'blue')}
                  onMouseEnter={() => setHoveredCubeKey('blue')}
                  onMouseLeave={() => setHoveredCubeKey(null)}
                  filter={draggingCubeKey === 'blue' ? 'url(#iso-drag-glow)' : undefined}
                >
                  <title>Cubo % Fase 1 - Haz clic para ajustar tamaño/ancho/grosor, arrastra para mover</title>
                  <polygon
                    points={polys.pTop}
                    fill="#ffffff"
                    stroke={isSelected ? '#1d4ed8' : '#60a5fa'}
                    strokeWidth={isSelected ? '3.5' : '2.5'}
                  />
                  <polygon points={polys.pLeft} fill="#dbeafe" />
                  <polygon points={polys.pRight} fill="#bfdbfe" />

                  {/* Interactive resize handles */}
                  {(isSelected || isCustomizing) && (
                    <>
                      {/* Width resize handle */}
                      <circle
                        cx={polys.cx + polys.rx}
                        cy={polys.cy}
                        r={6.5}
                        fill="#2563eb"
                        stroke="#ffffff"
                        strokeWidth={2}
                        className="cursor-ew-resize pointer-events-auto hover:scale-125 transition-transform drop-shadow-sm"
                        onMouseDown={(e) => handleStartResize(e, 'blue', 'width')}
                        onTouchStart={(e) => handleStartResize(e, 'blue', 'width')}
                      >
                        <title>Arrastra horizontalmente para alargar o achicar ancho</title>
                      </circle>
                      {/* Thickness resize handle */}
                      <circle
                        cx={polys.cx}
                        cy={polys.cy + polys.ry + polys.thickness}
                        r={6.5}
                        fill="#2563eb"
                        stroke="#ffffff"
                        strokeWidth={2}
                        className="cursor-ns-resize pointer-events-auto hover:scale-125 transition-transform drop-shadow-sm"
                        onMouseDown={(e) => handleStartResize(e, 'blue', 'thickness')}
                        onTouchStart={(e) => handleStartResize(e, 'blue', 'thickness')}
                      >
                        <title>Arrastra verticalmente para alargar o achicar grosor</title>
                      </circle>
                      {/* Depth resize handle */}
                      <circle
                        cx={polys.cx}
                        cy={polys.cy - polys.ry}
                        r={5.5}
                        fill="#2563eb"
                        stroke="#ffffff"
                        strokeWidth={2}
                        className="cursor-ns-resize pointer-events-auto hover:scale-125 transition-transform drop-shadow-sm"
                        onMouseDown={(e) => handleStartResize(e, 'blue', 'depth')}
                        onTouchStart={(e) => handleStartResize(e, 'blue', 'depth')}
                      >
                        <title>Arrastra verticalmente para alargar o achicar profundidad</title>
                      </circle>
                    </>
                  )}
                </g>
              );
            })()}

            {/* 3. Green cube (% Anexo 3 - Ficha caracterización) */}
            {cubesVisibility.green && (() => {
              const polys = computeCubePolygons('green', cubesDimensions.green);
              const isSelected = selectedCubeKey === 'green';
              return (
                <g
                  transform={`translate(${cubesPositions.green.dx}, ${cubesPositions.green.dy})`}
                  className={`cursor-grab active:cursor-grabbing pointer-events-auto transition-all ${
                    draggingCubeKey === 'green' ? 'opacity-95' : 'hover:brightness-105'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCubeKey((prev) => (prev === 'green' ? null : 'green'));
                  }}
                  onMouseDown={(e) => handleStartDragCube(e, 'green')}
                  onTouchStart={(e) => handleStartDragCube(e, 'green')}
                  onMouseEnter={() => setHoveredCubeKey('green')}
                  onMouseLeave={() => setHoveredCubeKey(null)}
                  filter={draggingCubeKey === 'green' ? 'url(#iso-drag-glow)' : undefined}
                >
                  <title>Cubo % Anexo 3 - Haz clic para ajustar tamaño/ancho/grosor, arrastra para mover</title>
                  <polygon
                    points={polys.pTop}
                    fill="#ffffff"
                    stroke={isSelected ? '#15803d' : '#4ade80'}
                    strokeWidth={isSelected ? '3.5' : '2.5'}
                  />
                  <polygon points={polys.pLeft} fill="#dcfce7" />
                  <polygon points={polys.pRight} fill="#bbf7d0" />

                  {/* Interactive resize handles */}
                  {(isSelected || isCustomizing) && (
                    <>
                      {/* Width resize handle */}
                      <circle
                        cx={polys.cx + polys.rx}
                        cy={polys.cy}
                        r={6.5}
                        fill="#16a34a"
                        stroke="#ffffff"
                        strokeWidth={2}
                        className="cursor-ew-resize pointer-events-auto hover:scale-125 transition-transform drop-shadow-sm"
                        onMouseDown={(e) => handleStartResize(e, 'green', 'width')}
                        onTouchStart={(e) => handleStartResize(e, 'green', 'width')}
                      >
                        <title>Arrastra horizontalmente para alargar o achicar ancho</title>
                      </circle>
                      {/* Thickness resize handle */}
                      <circle
                        cx={polys.cx}
                        cy={polys.cy + polys.ry + polys.thickness}
                        r={6.5}
                        fill="#16a34a"
                        stroke="#ffffff"
                        strokeWidth={2}
                        className="cursor-ns-resize pointer-events-auto hover:scale-125 transition-transform drop-shadow-sm"
                        onMouseDown={(e) => handleStartResize(e, 'green', 'thickness')}
                        onTouchStart={(e) => handleStartResize(e, 'green', 'thickness')}
                      >
                        <title>Arrastra verticalmente para alargar o achicar grosor</title>
                      </circle>
                      {/* Depth resize handle */}
                      <circle
                        cx={polys.cx}
                        cy={polys.cy - polys.ry}
                        r={5.5}
                        fill="#16a34a"
                        stroke="#ffffff"
                        strokeWidth={2}
                        className="cursor-ns-resize pointer-events-auto hover:scale-125 transition-transform drop-shadow-sm"
                        onMouseDown={(e) => handleStartResize(e, 'green', 'depth')}
                        onTouchStart={(e) => handleStartResize(e, 'green', 'depth')}
                      >
                        <title>Arrastra verticalmente para alargar o achicar profundidad</title>
                      </circle>
                    </>
                  )}
                </g>
              );
            })()}

            {/* 4. Cyan cube (% Anexo 4 - Indicadores) */}
            {cubesVisibility.cyan && (() => {
              const polys = computeCubePolygons('cyan', cubesDimensions.cyan);
              const isSelected = selectedCubeKey === 'cyan';
              return (
                <g
                  transform={`translate(${cubesPositions.cyan.dx}, ${cubesPositions.cyan.dy})`}
                  className={`cursor-grab active:cursor-grabbing pointer-events-auto transition-all ${
                    draggingCubeKey === 'cyan' ? 'opacity-95' : 'hover:brightness-105'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCubeKey((prev) => (prev === 'cyan' ? null : 'cyan'));
                  }}
                  onMouseDown={(e) => handleStartDragCube(e, 'cyan')}
                  onTouchStart={(e) => handleStartDragCube(e, 'cyan')}
                  onMouseEnter={() => setHoveredCubeKey('cyan')}
                  onMouseLeave={() => setHoveredCubeKey(null)}
                  filter={draggingCubeKey === 'cyan' ? 'url(#iso-drag-glow)' : undefined}
                >
                  <title>Cubo % Anexo 4 (Indicadores) - Haz clic para ajustar tamaño/ancho/grosor, arrastra para mover</title>
                  <polygon
                    points={polys.pTop}
                    fill="#ffffff"
                    stroke={isSelected ? '#0369a1' : '#38bdf8'}
                    strokeWidth={isSelected ? '3.5' : '2.5'}
                  />
                  <polygon points={polys.pLeft} fill="#bae6fd" />
                  <polygon points={polys.pRight} fill="#7dd3fc" />

                  {/* Interactive resize handles */}
                  {(isSelected || isCustomizing) && (
                    <>
                      {/* Width resize handle */}
                      <circle
                        cx={polys.cx + polys.rx}
                        cy={polys.cy}
                        r={6.5}
                        fill="#0284c7"
                        stroke="#ffffff"
                        strokeWidth={2}
                        className="cursor-ew-resize pointer-events-auto hover:scale-125 transition-transform drop-shadow-sm"
                        onMouseDown={(e) => handleStartResize(e, 'cyan', 'width')}
                        onTouchStart={(e) => handleStartResize(e, 'cyan', 'width')}
                      >
                        <title>Arrastra horizontalmente para alargar o achicar ancho</title>
                      </circle>
                      {/* Thickness resize handle */}
                      <circle
                        cx={polys.cx}
                        cy={polys.cy + polys.ry + polys.thickness}
                        r={6.5}
                        fill="#0284c7"
                        stroke="#ffffff"
                        strokeWidth={2}
                        className="cursor-ns-resize pointer-events-auto hover:scale-125 transition-transform drop-shadow-sm"
                        onMouseDown={(e) => handleStartResize(e, 'cyan', 'thickness')}
                        onTouchStart={(e) => handleStartResize(e, 'cyan', 'thickness')}
                      >
                        <title>Arrastra verticalmente para alargar o achicar grosor</title>
                      </circle>
                      {/* Depth resize handle */}
                      <circle
                        cx={polys.cx}
                        cy={polys.cy - polys.ry}
                        r={5.5}
                        fill="#0284c7"
                        stroke="#ffffff"
                        strokeWidth={2}
                        className="cursor-ns-resize pointer-events-auto hover:scale-125 transition-transform drop-shadow-sm"
                        onMouseDown={(e) => handleStartResize(e, 'cyan', 'depth')}
                        onTouchStart={(e) => handleStartResize(e, 'cyan', 'depth')}
                      >
                        <title>Arrastra verticalmente para alargar o achicar profundidad</title>
                      </circle>
                    </>
                  )}
                </g>
              );
            })()}

            {/* Decorative Spheres (Draggable) */}
            {cubesVisibility.sphereCyan && (
              <g
                transform={`translate(${cubesPositions.sphereCyan.dx}, ${cubesPositions.sphereCyan.dy})`}
                className="cursor-grab active:cursor-grabbing pointer-events-auto hover:brightness-110 transition-all"
                onMouseDown={(e) => handleStartDragCube(e, 'sphereCyan')}
                onTouchStart={(e) => handleStartDragCube(e, 'sphereCyan')}
                onMouseEnter={() => setHoveredCubeKey('sphereCyan')}
                onMouseLeave={() => setHoveredCubeKey(null)}
              >
                <title>Esfera Celeste (Arrastra para mover)</title>
                <ellipse cx="320" cy="220" rx="45" ry="40" fill="url(#iso-glow)" stroke="#38bdf8" strokeWidth="2" />
              </g>
            )}
            {cubesVisibility.spherePurple && (
              <g
                transform={`translate(${cubesPositions.spherePurple.dx}, ${cubesPositions.spherePurple.dy})`}
                className="cursor-grab active:cursor-grabbing pointer-events-auto hover:brightness-110 transition-all"
                onMouseDown={(e) => handleStartDragCube(e, 'spherePurple')}
                onTouchStart={(e) => handleStartDragCube(e, 'spherePurple')}
                onMouseEnter={() => setHoveredCubeKey('spherePurple')}
                onMouseLeave={() => setHoveredCubeKey(null)}
              >
                <title>Esfera Púrpura (Arrastra para mover)</title>
                <ellipse cx="680" cy="220" rx="35" ry="32" fill="url(#iso-glow)" stroke="#a855f7" strokeWidth="1.5" />
              </g>
            )}

            {/* Extra Duplicated 3D Circles (Movable in X, Y, Z, 360°, Morado / Verde / Celeste / Azul con Animación Dinámica de Elevación) */}
            {circles3D
              .filter((c) => !c.isPrimary)
              .map((circle, idx) => {
                const targetCubeKey = circle.cubeKey || 'purple';
                const polysP = computeCubePolygons(targetCubeKey, cubesDimensions[targetCubeKey]);
                const baseX = polysP.cx + cubesPositions[targetCubeKey].dx;
                const baseY = polysP.cy + polysP.ry + polysP.thickness + cubesPositions[targetCubeKey].dy;
                const effectiveZ = circle.z && circle.z !== 0 ? circle.z : 80;
                const startX = baseX + circle.x;
                const startY = baseY + circle.y;
                const targetY = startY - effectiveZ;
                const curX = baseX + circle.x;
                const curY = baseY + circle.y - circle.z;
                const isSelected = selectedCircleId === circle.id;
                const isThisDragging = draggingCircleTarget?.id === circle.id;
                const colInfo = CIRCLE_3D_COLORS[circle.color];
                const staggerSec = ((idx + 1) * 0.9) % 4.5;
                const beginAttr = `${staggerSec.toFixed(1)}s`;

                return (
                  <g key={circle.id} className="pointer-events-auto">
                    {/* Launch Ripple at the Base when ascending */}
                    {isSpheresAnimationActive && !isThisDragging && (
                      <ellipse
                        cx={startX}
                        cy={startY}
                        rx={8}
                        ry={4}
                        fill="none"
                        stroke={colInfo.strokeColor}
                        strokeWidth={1.5}
                        opacity={0}
                        className="pointer-events-none"
                      >
                        <animate
                          attributeName="rx"
                          values="4; 18; 4"
                          keyTimes="0; 0.22; 1"
                          dur="4.5s"
                          begin={beginAttr}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="ry"
                          values="2; 9; 2"
                          keyTimes="0; 0.22; 1"
                          dur="4.5s"
                          begin={beginAttr}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.8; 0; 0"
                          keyTimes="0; 0.22; 1"
                          dur="4.5s"
                          begin={beginAttr}
                          repeatCount="indefinite"
                        />
                      </ellipse>
                    )}

                    {/* Ground shadow at base of the cube */}
                    <ellipse
                      cx={startX}
                      cy={startY}
                      rx={Math.max(4, 9 * (1 - effectiveZ * 0.002))}
                      ry={Math.max(2, 4.5 * (1 - effectiveZ * 0.002))}
                      fill="#000000"
                      opacity={0.35}
                      className="pointer-events-none"
                    >
                      {isSpheresAnimationActive && !isThisDragging && (
                        <>
                          <animate
                            attributeName="rx"
                            values={`9; ${Math.max(4, 9 * (1 - effectiveZ * 0.002))}; ${Math.max(4, 9 * (1 - effectiveZ * 0.002))}; 9`}
                            keyTimes="0; 0.38; 0.85; 1"
                            dur="4.5s"
                            begin={beginAttr}
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.45; 0.15; 0.15; 0.45"
                            keyTimes="0; 0.38; 0.85; 1"
                            dur="4.5s"
                            begin={beginAttr}
                            repeatCount="indefinite"
                          />
                        </>
                      )}
                    </ellipse>

                    {/* Dashed Height Trail (Rastro punteado que se eleva y desaparece al llegar a la cima) */}
                    {isSpheresAnimationActive && !isThisDragging ? (
                      <line
                        x1={startX}
                        y1={startY}
                        x2={startX}
                        y2={targetY}
                        stroke={colInfo.strokeColor}
                        strokeWidth={1.75}
                        strokeDasharray="3 3"
                        className="pointer-events-none"
                      >
                        <animate
                          attributeName="y2"
                          values={`${startY}; ${targetY}; ${targetY}; ${targetY}; ${startY}`}
                          keyTimes="0; 0.38; 0.85; 0.95; 1"
                          dur="4.5s"
                          begin={beginAttr}
                          repeatCount="indefinite"
                          calcMode="spline"
                          keySplines="0.25 0.1 0.25 1; 0 0 1 1; 0.4 0 0.2 1; 0 0 1 1"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.85; 0.85; 0; 0; 0.85"
                          keyTimes="0; 0.35; 0.48; 0.95; 1"
                          dur="4.5s"
                          begin={beginAttr}
                          repeatCount="indefinite"
                        />
                      </line>
                    ) : (
                      circle.z !== 0 && (
                        <line
                          x1={startX}
                          y1={startY}
                          x2={curX}
                          y2={curY}
                          stroke={colInfo.strokeColor}
                          strokeWidth={1.5}
                          strokeDasharray="2 2"
                          opacity={0.8}
                          className="pointer-events-none"
                        />
                      )
                    )}

                    {/* Ascending Photon Light Bead along the dashed path */}
                    {isSpheresAnimationActive && !isThisDragging && (
                      <circle
                        cx={startX}
                        cy={startY}
                        r={3}
                        fill="#ffffff"
                        filter={`url(#${colInfo.filterId})`}
                        opacity={0}
                        className="pointer-events-none"
                      >
                        <animate
                          attributeName="cy"
                          values={`${startY}; ${targetY}; ${targetY}`}
                          keyTimes="0; 0.38; 1"
                          dur="4.5s"
                          begin={beginAttr}
                          repeatCount="indefinite"
                          calcMode="spline"
                          keySplines="0.25 0.1 0.25 1; 0 0 1 1"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.9; 0.9; 0; 0"
                          keyTimes="0; 0.32; 0.42; 1"
                          dur="4.5s"
                          begin={beginAttr}
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* 360 Rotation orbit line */}
                    <ellipse
                      cx={curX}
                      cy={isSpheresAnimationActive && !isThisDragging ? targetY : curY}
                      rx={20}
                      ry={10}
                      fill="none"
                      stroke={colInfo.ringColor}
                      strokeWidth={1.2}
                      strokeDasharray="3 3"
                      opacity={isSelected ? 0.8 : 0.4}
                      className="pointer-events-none"
                    >
                      {isSpheresAnimationActive && !isThisDragging && (
                        <animate
                          attributeName="cy"
                          values={`${startY}; ${targetY}; ${targetY - 3}; ${targetY}; ${startY}`}
                          keyTimes="0; 0.38; 0.65; 0.85; 1"
                          dur="4.5s"
                          begin={beginAttr}
                          repeatCount="indefinite"
                          calcMode="spline"
                          keySplines="0.25 0.1 0.25 1; 0.45 0 0.55 1; 0.45 0 0.55 1; 0.4 0 0.2 1"
                        />
                      )}
                    </ellipse>

                    {/* Circle Body (Sphere) */}
                    <circle
                      cx={curX}
                      cy={isSpheresAnimationActive && !isThisDragging ? targetY : curY}
                      r={circle.radius || 9}
                      fill={`url(#${colInfo.gradientId})`}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 3 : 2}
                      filter={`url(#${colInfo.filterId})`}
                      className={`cursor-move transition-transform ${
                        isSelected ? 'scale-125 drop-shadow-md' : 'hover:scale-115'
                      }`}
                      onMouseDown={(e) => handleStartDragCircle(e, circle.id, 'xy')}
                      onTouchStart={(e) => handleStartDragCircle(e, circle.id, 'xy')}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCircleId(circle.id);
                      }}
                      onDoubleClick={(e) => handleToggleCircleColor(circle.id, e)}
                    >
                      {isSpheresAnimationActive && !isThisDragging && (
                        <animate
                          attributeName="cy"
                          values={`${startY}; ${targetY}; ${targetY - 3}; ${targetY}; ${startY}`}
                          keyTimes="0; 0.38; 0.65; 0.85; 1"
                          dur="4.5s"
                          begin={beginAttr}
                          repeatCount="indefinite"
                          calcMode="spline"
                          keySplines="0.25 0.1 0.25 1; 0.45 0 0.55 1; 0.45 0 0.55 1; 0.4 0 0.2 1"
                        />
                      )}
                      <title>{`${circle.name} (${colInfo.name}) - Elevación dinámica desde la base del cubo hacia la parte superior. Arrastra para mover 360°, clic para seleccionar, doble clic para cambiar color.`}</title>
                    </circle>

                    {/* Elevation Z Handle */}
                    {(isSelected || !isSpheresAnimationActive || isThisDragging) && (
                      <g
                        className="cursor-ns-resize hover:scale-125 transition-transform pointer-events-auto"
                        onMouseDown={(e) => handleStartDragCircle(e, circle.id, 'z')}
                        onTouchStart={(e) => handleStartDragCircle(e, circle.id, 'z')}
                      >
                        <line
                          x1={curX}
                          y1={(isSpheresAnimationActive && !isThisDragging ? targetY : curY) - 9}
                          x2={curX}
                          y2={(isSpheresAnimationActive && !isThisDragging ? targetY : curY) - 24}
                          stroke={colInfo.strokeColor}
                          strokeWidth={2}
                        />
                        <polygon
                          points={`${curX},${(isSpheresAnimationActive && !isThisDragging ? targetY : curY) - 28} ${curX - 4},${(isSpheresAnimationActive && !isThisDragging ? targetY : curY) - 20} ${curX + 4},${(isSpheresAnimationActive && !isThisDragging ? targetY : curY) - 20}`}
                          fill={colInfo.strokeColor}
                        />
                        <title>Eje Z: Arrastra verticalmente para mover en el eje Z</title>
                      </g>
                    )}

                    {/* 360 Rotation Handle */}
                    {(isSelected || !isSpheresAnimationActive || isThisDragging) && (
                      <g
                        className="cursor-crosshair hover:scale-125 transition-transform pointer-events-auto"
                        onMouseDown={(e) => handleStartDragCircle(e, circle.id, 'rotate')}
                        onTouchStart={(e) => handleStartDragCircle(e, circle.id, 'rotate')}
                      >
                        <circle
                          cx={curX + 20 * Math.cos((circle.rotation360 * Math.PI) / 180)}
                          cy={(isSpheresAnimationActive && !isThisDragging ? targetY : curY) + 10 * Math.sin((circle.rotation360 * Math.PI) / 180)}
                          r={4}
                          fill={colInfo.strokeColor}
                          stroke="#ffffff"
                          strokeWidth={1.5}
                        />
                        <title>Giro 360°: Arrastra para girar 360°</title>
                      </g>
                    )}
                  </g>
                );
              })}
          </svg>

          {/* Floating Dimension & Action Controls for 3D Cubes */}
          {(['center', 'purple', 'blue', 'green', 'cyan'] as CubeKey[]).map((key) => {
            if (!cubesVisibility[key]) return null;
            const isVisibleBadge =
              isCustomizing ||
              selectedCubeKey === key ||
              hoveredCubeKey === key ||
              activeDimensionMenuCube === key;
            if (!isVisibleBadge) return null;

            const spec = CUBE_BASE_SPECS[key];
            const dim = cubesDimensions[key] || DEFAULT_CUBE_DIMENSIONS[key];
            const polys = computeCubePolygons(key, dim);
            const posX = spec.cx + cubesPositions[key].dx;
            const posY = spec.cy - polys.ry + cubesPositions[key].dy;
            const isMenuOpen = activeDimensionMenuCube === key;

            return (
              <div
                key={`cube-ctrl-${key}`}
                style={{
                  left: `${(posX / 1000) * 100}%`,
                  top: `${(posY / 500) * 100}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-full z-40 mb-2 flex flex-col items-center bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border ${spec.borderColor} p-2 text-xs pointer-events-auto select-none transition-all`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between w-full gap-2 pb-1 border-b border-slate-100 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: spec.color }}
                    />
                    <span className="font-bold text-slate-800 text-[11px] whitespace-nowrap">
                      {spec.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setActiveDimensionMenuCube(isMenuOpen ? null : key)
                      }
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        isMenuOpen
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-500 hover:bg-slate-100'
                      }`}
                      title="Abrir controles detallados y presets"
                    >
                      <Sliders className="w-3 h-3" />
                    </button>
                    {isCustomizing && (
                      <button
                        onClick={(e) => handleDeleteElement(key, e)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        title="Eliminar este cubo 3D"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                    {selectedCubeKey === key && (
                      <button
                        onClick={() => setSelectedCubeKey(null)}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer"
                        title="Cerrar ajustes"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick adjustments row */}
                <div className="flex items-center gap-2 text-[11px]">
                  {/* Width (Ancho) */}
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 px-1 gap-1">
                    <span className="text-slate-500 text-[10px] font-medium">Ancho:</span>
                    <button
                      onClick={() => handleAdjustWidth(key, -0.1)}
                      className="w-4 h-4 flex items-center justify-center rounded text-slate-600 hover:bg-slate-200 cursor-pointer"
                      title="Achicar ancho"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="font-bold text-slate-800 min-w-7 text-center">
                      {Math.round(dim.widthScale * 100)}%
                    </span>
                    <button
                      onClick={() => handleAdjustWidth(key, 0.1)}
                      className="w-4 h-4 flex items-center justify-center rounded text-slate-600 hover:bg-slate-200 cursor-pointer"
                      title="Alargar ancho"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  {/* Thickness (Grosor) */}
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 px-1 gap-1">
                    <span className="text-slate-500 text-[10px] font-medium">Grosor:</span>
                    <button
                      onClick={() => handleAdjustThickness(key, -2)}
                      className="w-4 h-4 flex items-center justify-center rounded text-slate-600 hover:bg-slate-200 cursor-pointer"
                      title="Achicar grosor"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="font-bold text-slate-800 min-w-8 text-center">
                      {Math.round(dim.thickness)}px
                    </span>
                    <button
                      onClick={() => handleAdjustThickness(key, 2)}
                      className="w-4 h-4 flex items-center justify-center rounded text-slate-600 hover:bg-slate-200 cursor-pointer"
                      title="Alargar grosor"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  {/* Overall Scale (Tamaño) */}
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 px-1 gap-1">
                    <span className="text-slate-500 text-[10px] font-medium">Tamaño:</span>
                    <button
                      onClick={() => handleAdjustScale(key, -0.1)}
                      className="w-4 h-4 flex items-center justify-center rounded text-slate-600 hover:bg-slate-200 cursor-pointer"
                      title="Achicar tamaño"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="font-bold text-slate-800 min-w-7 text-center">
                      {Math.round(dim.overallScale * 100)}%
                    </span>
                    <button
                      onClick={() => handleAdjustScale(key, 0.1)}
                      className="w-4 h-4 flex items-center justify-center rounded text-slate-600 hover:bg-slate-200 cursor-pointer"
                      title="Agrandar tamaño"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Sliders & Presets Popover */}
                {isMenuOpen && (
                  <div className="w-full mt-2 pt-2 border-t border-slate-100 flex flex-col gap-2 animate-in fade-in">
                    {/* Ancho Slider */}
                    <div className="flex items-center justify-between gap-2 text-[10px]">
                      <span className="text-slate-600 font-medium">Ancho horizontal:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="range"
                          min="0.3"
                          max="2.5"
                          step="0.05"
                          value={dim.widthScale}
                          onChange={(e) =>
                            handleSetCubeDimension(key, {
                              widthScale: parseFloat(e.target.value),
                            })
                          }
                          className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                        />
                        <span className="w-8 text-right font-bold text-slate-700">
                          {Math.round(dim.widthScale * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Grosor 3D Slider */}
                    <div className="flex items-center justify-between gap-2 text-[10px]">
                      <span className="text-slate-600 font-medium">Grosor / Altura 3D:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="range"
                          min="2"
                          max="80"
                          step="1"
                          value={dim.thickness}
                          onChange={(e) =>
                            handleSetCubeDimension(key, {
                              thickness: parseInt(e.target.value, 10),
                            })
                          }
                          className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                        <span className="w-8 text-right font-bold text-slate-700">
                          {Math.round(dim.thickness)}px
                        </span>
                      </div>
                    </div>

                    {/* Profundidad Slider */}
                    <div className="flex items-center justify-between gap-2 text-[10px]">
                      <span className="text-slate-600 font-medium">Profundidad isométrica:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="range"
                          min="0.3"
                          max="2.5"
                          step="0.05"
                          value={dim.depthScale}
                          onChange={(e) =>
                            handleSetCubeDimension(key, {
                              depthScale: parseFloat(e.target.value),
                            })
                          }
                          className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                        <span className="w-8 text-right font-bold text-slate-700">
                          {Math.round(dim.depthScale * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            handleSetCubeDimension(key, { thickness: 5 })
                          }
                          className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium cursor-pointer"
                        >
                          Extra Delgado
                        </button>
                        <button
                          onClick={() =>
                            handleSetCubeDimension(key, { thickness: 35 })
                          }
                          className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium cursor-pointer"
                        >
                          Muy Grueso
                        </button>
                        <button
                          onClick={() =>
                            handleSetCubeDimension(key, { widthScale: 1.6 })
                          }
                          className="px-1.5 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium cursor-pointer"
                        >
                          Alargado
                        </button>
                      </div>
                      <button
                        onClick={() => handleResetCubeDimensions(key)}
                        className="px-1.5 py-0.5 text-[9px] text-amber-700 hover:bg-amber-50 rounded font-medium flex items-center gap-0.5 cursor-pointer"
                        title="Restablecer dimensiones predeterminadas de este cubo"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>Restablecer</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Floating Delete Badges for Spheres in Customization Mode */}
          {isCustomizing && (
            <>
              {cubesVisibility.sphereCyan && (
                <div
                  style={{
                    left: `${((320 + cubesPositions.sphereCyan.dx) / 1000) * 100}%`,
                    top: `${((180 + cubesPositions.sphereCyan.dy) / 500) * 100}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-full z-40 mb-1 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full shadow-md border border-sky-200 text-[10px] pointer-events-auto select-none"
                >
                  <span className="font-semibold text-sky-700">Esfera Celeste</span>
                  <button
                    onClick={(e) => handleDeleteElement('sphereCyan', e)}
                    className="p-0.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full cursor-pointer transition-colors"
                    title="Eliminar esta esfera"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
              {cubesVisibility.spherePurple && (
                <div
                  style={{
                    left: `${((680 + cubesPositions.spherePurple.dx) / 1000) * 100}%`,
                    top: `${((180 + cubesPositions.spherePurple.dy) / 500) * 100}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-full z-40 mb-1 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full shadow-md border border-purple-200 text-[10px] pointer-events-auto select-none"
                >
                  <span className="font-semibold text-purple-700">Esfera Púrpura</span>
                  <button
                    onClick={(e) => handleDeleteElement('spherePurple', e)}
                    className="p-0.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full cursor-pointer transition-colors"
                    title="Eliminar esta esfera"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Floating Action Badge & 360° Rotation Inspector for Line */}
          {(() => {
            const activeLine =
              lines.find((l) => l.id === selectedLineId) ||
              (isCustomizing ? lines.find((l) => l.id === hoveredLineId) : null);
            if (!activeLine) return null;

            const isCurrentSelected = selectedLineId === activeLine.id;
            const midX = (activeLine.x1 + activeLine.x2) / 2 + activeLine.dx;
            const midY = (activeLine.y1 + activeLine.y2) / 2 + activeLine.dy;
            const curRad = Math.atan2(activeLine.y2 - activeLine.y1, activeLine.x2 - activeLine.x1);
            const curAngleDeg = Math.round(((curRad * (180 / Math.PI)) + 360) % 360);
            const lineLength = Math.round(Math.hypot(activeLine.x2 - activeLine.x1, activeLine.y2 - activeLine.y1));

            // If line is merely hovered but not selected, show compact quick pill
            if (!isCurrentSelected) {
              return (
                <div
                  style={{
                    left: `${(midX / 1000) * 100}%`,
                    top: `${(midY / 500) * 100}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-40 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-sky-300 text-xs select-none pointer-events-auto"
                >
                  <span className="font-bold text-sky-800 text-[11px]">
                    {activeLine.type === 'dashed' ? 'Línea Discontinua' : 'Línea Sólida'} ({curAngleDeg}°)
                  </span>
                  <button
                    onClick={() => setSelectedLineId(activeLine.id)}
                    className="px-2 py-0.5 bg-sky-600 hover:bg-sky-700 text-white rounded-full font-semibold text-[10px] cursor-pointer"
                  >
                    Girar 360° / Editar
                  </button>
                </div>
              );
            }

            // When selected, show rich 360° inspector & controller card
            return (
              <div
                style={{
                  left: `${Math.max(14, Math.min(86, (midX / 1000) * 100))}%`,
                  top: `${Math.max(10, Math.min(84, ((midY - 60) / 500) * 100))}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-full z-45 mb-2 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-sky-300/90 p-3 text-xs select-none pointer-events-auto min-w-[310px] animate-in fade-in zoom-in-95 duration-150"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-sky-600 animate-spin-slow" />
                    <div>
                      <span className="font-bold text-slate-800 text-[11px] block leading-tight">
                        Línea {activeLine.type === 'dashed' ? 'Discontinua' : 'Sólida'}
                      </span>
                      <span className="text-[9px] text-sky-600 font-semibold">
                        Giro 360°: {curAngleDeg}°
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDuplicateLine(activeLine.id, e)}
                      className="px-2 py-0.5 text-[10px] font-bold text-sky-700 bg-sky-100 hover:bg-sky-200 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                      title="Duplicar esta línea"
                    >
                      <Copy className="w-2.5 h-2.5" />
                      <span>Duplicar</span>
                    </button>
                    <button
                      onClick={(e) => handleToggleLineType(activeLine.id, e)}
                      className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full cursor-pointer transition-colors"
                      title={activeLine.type === 'dashed' ? 'Cambiar a línea sólida' : 'Cambiar a línea discontinua'}
                    >
                      {activeLine.type === 'dashed' ? 'A Sólida' : 'A Discontinua'}
                    </button>
                    {lines.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteLine(activeLine.id, e)}
                        className="p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-700 rounded-full cursor-pointer transition-colors"
                        title="Eliminar esta línea"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedLineId(null)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer text-xs leading-none"
                      title="Cerrar panel"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* 360° Cardinal Directions (Arriba, Abajo, Izquierda, Derecha) */}
                <div className="mb-2 bg-sky-50/80 p-2 rounded-xl border border-sky-100">
                  <div className="flex items-center justify-between text-[10px] font-bold text-sky-900 mb-1.5">
                    <span>Girar en 360° (Direcciones Cardinales):</span>
                    <span className="bg-sky-200/70 text-sky-800 px-1.5 py-0.2 rounded-full">
                      {curAngleDeg}°
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    <button
                      onClick={() => handleRotateLine(activeLine.id, 270)}
                      className={`px-1.5 py-1 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                        curAngleDeg === 270
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-100'
                      }`}
                      title="Girar 90° hacia Arriba (270°)"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span>Arriba</span>
                    </button>
                    <button
                      onClick={() => handleRotateLine(activeLine.id, 90)}
                      className={`px-1.5 py-1 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                        curAngleDeg === 90
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-100'
                      }`}
                      title="Girar 90° hacia Abajo (90°)"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                      <span>Abajo</span>
                    </button>
                    <button
                      onClick={() => handleRotateLine(activeLine.id, 180)}
                      className={`px-1.5 py-1 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                        curAngleDeg === 180
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-100'
                      }`}
                      title="Girar hacia la Izquierda (180°)"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Izquierda</span>
                    </button>
                    <button
                      onClick={() => handleRotateLine(activeLine.id, 0)}
                      className={`px-1.5 py-1 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                        curAngleDeg === 0 || curAngleDeg === 360
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-100'
                      }`}
                      title="Girar hacia la Derecha (0°)"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Derecha</span>
                    </button>
                  </div>
                </div>

                {/* Continuous 360° Slider & Step Adjustments */}
                <div className="space-y-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100 mb-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-700">Ángulo libre 360°:</span>
                    <span className="font-mono font-bold text-sky-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {curAngleDeg}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="359"
                    step="1"
                    value={curAngleDeg}
                    onChange={(e) => handleRotateLine(activeLine.id, parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                  />

                  {/* Step buttons */}
                  <div className="flex items-center justify-between gap-1 pt-1">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleStepLineRotation(activeLine.id, -45, e)}
                        className="px-1.5 py-0.5 text-[9px] bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 rounded font-semibold cursor-pointer"
                        title="Girar -45°"
                      >
                        -45°
                      </button>
                      <button
                        onClick={(e) => handleStepLineRotation(activeLine.id, -15, e)}
                        className="px-1.5 py-0.5 text-[9px] bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 rounded font-semibold cursor-pointer"
                        title="Girar -15°"
                      >
                        -15°
                      </button>
                      <button
                        onClick={(e) => handleStepLineRotation(activeLine.id, +15, e)}
                        className="px-1.5 py-0.5 text-[9px] bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 rounded font-semibold cursor-pointer"
                        title="Girar +15°"
                      >
                        +15°
                      </button>
                      <button
                        onClick={(e) => handleStepLineRotation(activeLine.id, +45, e)}
                        className="px-1.5 py-0.5 text-[9px] bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 rounded font-semibold cursor-pointer"
                        title="Girar +45°"
                      >
                        +45°
                      </button>
                    </div>
                    <button
                      onClick={(e) => handleStepLineRotation(activeLine.id, 180, e)}
                      className="px-2 py-0.5 text-[9px] bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 rounded font-semibold flex items-center gap-0.5 cursor-pointer"
                      title="Invertir dirección 180°"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Invertir 180°</span>
                    </button>
                  </div>
                </div>

                {/* Isometric Angle Presets */}
                <div className="flex items-center justify-between gap-1 text-[9px] text-slate-500 pt-1 border-t border-slate-100">
                  <span className="font-medium">Isométricos:</span>
                  <div className="flex items-center gap-1">
                    {[30, 150, 210, 330].map((isoDeg) => (
                      <button
                        key={isoDeg}
                        onClick={() => handleRotateLine(activeLine.id, isoDeg)}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-semibold cursor-pointer ${
                          curAngleDeg === isoDeg
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isoDeg}°
                      </button>
                    ))}
                  </div>
                  <span className="text-slate-400 font-mono">{lineLength}px</span>
                </div>
              </div>
            );
          })()}

          {/* Floating 3D Circle Inspector & Controller Panel */}
          {(() => {
            const activeCircle =
              circles3D.find((c) => c.id === selectedCircleId) ||
              (isCustomizing ? circles3D.find((c) => c.id === hoveredCircleId) : null) ||
              (selectedCubeKey === 'purple' ? circles3D[0] : null);

            if (!activeCircle) return null;

            const polysP = computeCubePolygons('purple', cubesDimensions.purple);
            const baseX = polysP.cx + cubesPositions.purple.dx;
            const baseY = polysP.cy + polysP.ry + polysP.thickness + cubesPositions.purple.dy;
            const curX = baseX + activeCircle.x;
            const curY = baseY + activeCircle.y - activeCircle.z;
            const colInfo = CIRCLE_3D_COLORS[activeCircle.color];

            return (
              <div
                style={{
                  left: `${Math.max(12, Math.min(88, (curX / 1000) * 100))}%`,
                  top: `${Math.max(10, Math.min(86, ((curY - 48) / 500) * 100))}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-full z-45 mb-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-2.5 text-xs select-none pointer-events-auto min-w-[280px] animate-in fade-in zoom-in-95 duration-150"
              >
                {/* Header with Title & Color badge */}
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: colInfo.hex }}
                    />
                    <span className="font-bold text-slate-800 text-[11px]">
                      Círculo 3D ({colInfo.name})
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDuplicateCircle(activeCircle.id, e)}
                      className="px-2 py-0.5 text-[10px] font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                      title="Duplicar este círculo 3D"
                    >
                      <Copy className="w-2.5 h-2.5" />
                      <span>Duplicar</span>
                    </button>
                    {circles3D.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteCircle(activeCircle.id, e)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full cursor-pointer transition-colors"
                        title="Eliminar este círculo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedCircleId(null)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer text-xs leading-none"
                      title="Cerrar panel"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Color Chooser: Morado, Verde, Celeste, Azul */}
                <div className="mb-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-semibold text-slate-600 mb-1 flex items-center justify-between">
                    <span>Cambiar color:</span>
                    <span className="font-bold" style={{ color: colInfo.hex }}>{colInfo.name}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {(['purple', 'green', 'cyan', 'blue'] as Circle3DColor[]).map((cKey) => {
                      const item = CIRCLE_3D_COLORS[cKey];
                      const isSelected = activeCircle.color === cKey;
                      return (
                        <button
                          key={cKey}
                          onClick={(e) => handleSetCircleColor(activeCircle.id, cKey, e)}
                          className={`py-1 px-1.5 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all ${
                            isSelected
                              ? `${item.bgClass} text-white shadow-xs scale-102`
                              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                          }`}
                          title={`Color ${item.name}`}
                        >
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: isSelected ? '#ffffff' : item.hex }}
                          />
                          <span className="truncate">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3D Coordinates & Elevation (Z-Axis) */}
                <div className="space-y-1.5 text-[10px]">
                  {/* Z-Axis (3D Elevation) */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-600 flex items-center gap-1">
                      <span className="font-bold text-sky-600">Eje Z</span> (Elevación 3D):
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleAdjustZ(activeCircle.id, -10, e)}
                        className="w-4 h-4 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold cursor-pointer"
                        title="Bajar en eje Z"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="-150"
                        max="320"
                        step="5"
                        value={activeCircle.z}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          const updated = circles3D.map((c) =>
                            c.id === activeCircle.id ? { ...c, z: val } : c
                          );
                          saveCircles3D(updated);
                        }}
                        className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                      />
                      <button
                        onClick={(e) => handleAdjustZ(activeCircle.id, 10, e)}
                        className="w-4 h-4 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold cursor-pointer"
                        title="Subir en eje Z"
                      >
                        +
                      </button>
                      <span className="w-10 text-right font-bold text-slate-800">
                        {activeCircle.z}px
                      </span>
                    </div>
                  </div>

                  {/* 360° Rotation Angle */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-600 flex items-center gap-1">
                      <RotateCcw className="w-2.5 h-2.5 text-purple-600" />
                      <span>Giro 360°:</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleAdjustRotation(activeCircle.id, -45, e)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[9px] cursor-pointer"
                        title="Girar -45°"
                      >
                        -45°
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="359"
                        step="5"
                        value={activeCircle.rotation360}
                        onChange={(e) =>
                          handleSetRotationExact(activeCircle.id, parseInt(e.target.value, 10))
                        }
                        className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <button
                        onClick={(e) => handleAdjustRotation(activeCircle.id, 45, e)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[9px] cursor-pointer"
                        title="Girar +45°"
                      >
                        +45°
                      </button>
                      <span className="w-8 text-right font-bold text-slate-800">
                        {activeCircle.rotation360}°
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Elevation Animation Toggle */}
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-sky-50/80 border border-sky-200/80">
                    <span className="font-semibold text-sky-900 flex items-center gap-1 text-[10px]">
                      <Sparkles className="w-3 h-3 text-sky-600" />
                      <span>Elevación dinámica:</span>
                    </span>
                    <button
                      onClick={() => setIsSpheresAnimationActive((p) => !p)}
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold cursor-pointer transition-colors ${
                        isSpheresAnimationActive
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isSpheresAnimationActive ? 'Activa (Ascendiendo)' : 'Pausada'}
                    </button>
                  </div>

                  {/* Coordinates X, Y readout & reset */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[9px] text-slate-500">
                    <span>
                      X: <strong className="text-slate-700">{activeCircle.x}</strong> | Y:{' '}
                      <strong className="text-slate-700">{activeCircle.y}</strong>
                    </span>
                    <button
                      onClick={(e) => handleResetCircle3D(activeCircle.id, e)}
                      className="text-sky-600 hover:underline cursor-pointer font-semibold"
                    >
                      Restablecer posición
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* FLOATING KPI NUMBERS & SPARKLINE OVERLAY (Sin fondo de ventana, trasladable a la ubicación de la plataforma) */}
          <FloatingKpiWidget
            containerRef={canvasRef}
            isCustomizing={isCustomizing}
            onNavigateToDashboard={() => onSelectNode?.('metricas')}
          />

          {/* DYNAMIC DRAGGABLE POOLS */}
          {pools.map((pool) => {
            const styles = getColorClasses(pool.color);
            const isBeingDragged = draggingPoolId === pool.id;

            return (
              <div
                key={pool.id}
                style={{
                  left: `${pool.leftPercent}%`,
                  top: `${pool.topPercent}%`,
                }}
                className={`absolute z-30 transition-transform ${
                  isBeingDragged ? 'scale-105 z-40 shadow-2xl opacity-90' : ''
                }`}
              >
                <div className="relative group flex items-center">
                  {/* Drag Handle (always visible or in custom mode) */}
                  <div
                    onMouseDown={(e) => handleMouseDownOnPool(e, pool.id)}
                    onTouchStart={(e) => handleTouchStartOnPool(e, pool.id)}
                    className={`cursor-grab active:cursor-grabbing p-1.5 bg-white/90 border border-slate-200 rounded-l-full shadow-md text-slate-400 hover:text-slate-800 transition-colors ${
                      isCustomizing ? 'block' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    title="Arrastrar pool para mover"
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>

                  {/* Main Pool Button (Uniform size across all buttons) */}
                  <button
                    onClick={() => {
                      if (!isBeingDragged && onSelectNode) {
                        onSelectNode(pool.targetAction);
                      }
                    }}
                    onMouseDown={(e) => {
                      if (isCustomizing) {
                        handleMouseDownOnPool(e, pool.id);
                      }
                    }}
                    onTouchStart={(e) => {
                      if (isCustomizing) {
                        handleTouchStartOnPool(e, pool.id);
                      }
                    }}
                    className={`w-[215px] h-[54px] flex items-center gap-2.5 px-3.5 rounded-full bg-white/95 hover:bg-white shadow-lg border ${
                      styles.border
                    } hover:scale-105 transition-all cursor-pointer group text-left ${
                      isCustomizing ? 'cursor-grab active:cursor-grabbing' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full text-white flex items-center justify-center shrink-0 shadow-xs ${styles.iconBg} transition-colors`}
                    >
                      {renderIcon(pool.icon)}
                    </div>
                    <div className="flex flex-col justify-center flex-1 min-w-0 pr-1 overflow-hidden">
                      {pool.id === 'pool-equipos' ? (
                        <>
                          <EditableText
                            storageKey="header_pool_equipos_title_v2"
                            defaultText={pool.title}
                            className="text-xs font-bold text-slate-800 truncate block"
                            showIconOnHover={true}
                          />
                          {pool.subtitle ? (
                            <EditableText
                              storageKey="header_pool_equipos_subtitle_v2"
                              defaultText={pool.subtitle}
                              className="text-[11px] text-slate-500 truncate block leading-tight"
                              showIconOnHover={true}
                            />
                          ) : null}
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-bold text-slate-800 truncate block">
                            {pool.title}
                          </span>
                          {pool.subtitle ? (
                            <span className="text-[11px] text-slate-500 truncate block leading-tight">
                              {pool.subtitle}
                            </span>
                          ) : null}
                        </>
                      )}
                    </div>
                  </button>

                  {/* Edit Pool Button */}
                  {isCustomizing && (
                    <button
                      onClick={() => handleOpenEditPool(pool)}
                      className="p-1.5 ml-1 bg-white hover:bg-sky-50 text-sky-600 rounded-full border border-slate-200 shadow-sm cursor-pointer"
                      title="Editar pool"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pool Editor Modal */}
      <PoolEditorModal
        isOpen={poolModalOpen}
        pool={editingPool}
        isNew={isNewPool}
        onClose={() => setPoolModalOpen(false)}
        onSave={handleSavePool}
        onDelete={handleDeletePool}
      />
    </section>
  );
};
