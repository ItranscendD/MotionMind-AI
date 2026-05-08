import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { nanoid } from 'nanoid';

export type LayerType = 'text' | 'shape' | 'image' | 'video' | 'group';

export interface Keyframe {
  id: string;
  time: number;
  value: any;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bezier';
  controlPoints?: [number, number, number, number];
}

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  opacity: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  content?: string;
  style?: any;
  keyframes: Record<string, Keyframe[]>;
  parentId?: string;
}

interface EditorState {
  currentTime: number;
  duration: number;
  layers: Layer[];
  selectedLayerId: string | null;
  isPlaying: boolean;
  flashLayerId: string | null;
  suggestions: any[];
  suggestionHistory: any[];
  previewLayers: Layer[] | null;
  history: Layer[][];
  historyIndex: number;
}

type EditorAction =
  | { type: 'SET_TIME'; time: number }
  | { type: 'TOGGLE_PLAYBACK' }
  | { type: 'ADD_LAYER'; layer: Layer }
  | { type: 'UPDATE_LAYER'; id: string; updates: Partial<Layer> }
  | { type: 'SELECT_LAYER'; id: string | null }
  | { type: 'DELETE_LAYER'; id: string }
  | { type: 'FLASH_LAYER'; id: string | null }
  | { type: 'AI_EDIT'; ops: any[] }
  | { type: 'SET_SUGGESTIONS'; suggestions: any[] }
  | { type: 'APPLY_FIX'; suggestionId: string }
  | { type: 'PREVIEW_FIX'; suggestionId: string | null }
  | { type: 'REORDER_LAYERS'; layers: Layer[] }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_STATE'; state: Partial<EditorState> };

const initialState: EditorState = {
  currentTime: 0,
  duration: 10, // seconds
  layers: [
    {
      id: 'bg-1',
      name: 'Background Solid',
      type: 'shape',
      visible: true,
      locked: false,
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      style: { fill: '#0F0F11' },
      keyframes: {}
    }
  ],
  selectedLayerId: null,
  isPlaying: false,
  flashLayerId: null,
  suggestions: [],
  suggestionHistory: [],
  previewLayers: null,
  history: [],
  historyIndex: -1
};

const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
} | null>(null);

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_TIME':
      return { ...state, currentTime: Math.max(0, Math.min(action.time, state.duration)) };
    case 'TOGGLE_PLAYBACK':
      return { ...state, isPlaying: !state.isPlaying };
    case 'FLASH_LAYER':
      return { ...state, flashLayerId: action.id };
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.suggestions };
    case 'PREVIEW_FIX': {
      if (!action.suggestionId) return { ...state, previewLayers: null };
      const sug = state.suggestions.find(s => s.id === action.suggestionId);
      if (!sug) return state;
      // Mock preview: apply fix to layers without history
      const newLayers = state.layers.map(l => {
        if (l.id === sug.layerId) {
           if (sug.fix.op === 'UPDATE_LAYER') {
             const [prop, field] = sug.fix.property.split('.');
             if (field) return { ...l, [prop]: { ...l[prop as keyof Layer], [field]: sug.fix.value } };
             return { ...l, [sug.fix.property]: sug.fix.value };
           }
        }
        return l;
      });
      return { ...state, previewLayers: newLayers };
    }
    case 'APPLY_FIX': {
      const sug = state.suggestions.find(s => s.id === action.suggestionId);
      if (!sug) return state;
      const newLayers = state.layers.map(l => {
        if (l.id === sug.layerId) {
           if (sug.fix.op === 'UPDATE_LAYER') {
              const [prop, field] = sug.fix.property.split('.');
              if (field) return { ...l, [prop]: { ...l[prop as keyof Layer], [field]: sug.fix.value } };
              return { ...l, [sug.fix.property]: sug.fix.value };
           }
        }
        return l;
      });
      return { 
        ...state, 
        layers: newLayers,
        suggestions: state.suggestions.filter(s => s.id !== action.suggestionId),
        suggestionHistory: [...state.suggestionHistory, { ...sug, status: 'Applied', appliedAt: new Date().toLocaleTimeString() }],
        previewLayers: null,
        history: [...state.history.slice(0, state.historyIndex + 1), newLayers],
        historyIndex: state.historyIndex + 1
      };
    }
    case 'ADD_LAYER': {
      const newLayers = [...state.layers, action.layer];
      return { 
        ...state, 
        layers: newLayers,
        history: [...state.history.slice(0, state.historyIndex + 1), newLayers],
        historyIndex: state.historyIndex + 1
      };
    }
    case 'UPDATE_LAYER': {
      const newLayers = state.layers.map(l => l.id === action.id ? { ...l, ...action.updates } : l);
      return { ...state, layers: newLayers };
    }
    case 'SELECT_LAYER':
      return { ...state, selectedLayerId: action.id };
    case 'DELETE_LAYER': {
        const newLayers = state.layers.filter(l => l.id !== action.id);
        return { ...state, layers: newLayers, selectedLayerId: null };
    }
    case 'REORDER_LAYERS':
      return { ...state, layers: action.layers };
    case 'UNDO':
      if (state.historyIndex > 0) {
        return { 
          ...state, 
          layers: state.history[state.historyIndex - 1], 
          historyIndex: state.historyIndex - 1 
        };
      }
      return state;
    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        return { 
          ...state, 
          layers: state.history[state.historyIndex + 1], 
          historyIndex: state.historyIndex + 1 
        };
      }
      return state;
    case 'SET_STATE':
        return { ...state, ...action.state };
    default:
      return state;
  }
}

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, {
      ...initialState,
      history: [initialState.layers],
      historyIndex: 0
  });

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
}

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error('useEditor must be used within EditorProvider');
  return context;
};
