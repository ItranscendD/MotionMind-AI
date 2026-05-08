import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { useEditor } from "@/store/EditorContext";

export default function Canvas() {
  const { state } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const layersRef = useRef<Record<string, PIXI.Container>>({});

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize PixiJS Application
    const app = new PIXI.Application();
    
    const initPixi = async () => {
      await app.init({
        width: 1920,
        height: 1080,
        backgroundColor: 0x0f0f11,
        resolution: window.devicePixelRatio || 1,
        antialias: true,
      });

      if (containerRef.current) {
        app.canvas.style.width = "100%";
        app.canvas.style.height = "100%";
        app.canvas.style.objectFit = "contain";
        containerRef.current.appendChild(app.canvas);
      }
      
      appRef.current = app;
    };

    initPixi();

    return () => {
      app.destroy(true, { children: true, texture: true });
    };
  }, []);

  // Sync Layers with State
  useEffect(() => {
    const app = appRef.current;
    if (!app || !app.stage) return;

    const layersToRender = state.previewLayers || state.layers;

    // Clear removed layers
    Object.keys(layersRef.current).forEach(id => {
      if (!layersToRender.find(l => l.id === id)) {
        app.stage.removeChild(layersRef.current[id]);
        delete layersRef.current[id];
      }
    });

    // Add/Update layers
    layersToRender.forEach((layer) => {
      let container = layersRef.current[layer.id];
      
      if (!container) {
        container = new PIXI.Container();
        app.stage.addChild(container);
        layersRef.current[layer.id] = container;

        if (layer.type === 'text') {
           const text = new PIXI.Text({
             text: layer.content || 'Sample Text',
             style: {
               fill: '#ffffff',
               fontSize: 80,
               fontWeight: 'bold',
               fontFamily: 'Inter',
             }
           });
           container.addChild(text);
        } else if (layer.type === 'shape') {
           const graphics = new PIXI.Graphics();
           graphics.rect(0, 0, 400, 400);
           graphics.fill(layer.style?.fill || 0x4F46E5);
           container.addChild(graphics);
        }
      }

      // Apply basic transforms (simplified for now)
      container.x = layer.x;
      container.y = layer.y;
      container.rotation = (layer.rotation * Math.PI) / 180;
      container.scale.set(layer.scale);
      container.alpha = layer.opacity;
      container.visible = layer.visible;
    });
  }, [state.layers]);

  // Handle Playback/Time
  useEffect(() => {
    const app = appRef.current;
    if (!app) return;

    const ticker = (delta: PIXI.Ticker) => {
       // In a real app, calculate keyframe interpolation here
    };

    if (state.isPlaying) {
      app.ticker.add(ticker);
    } else {
      app.ticker.remove(ticker);
    }

    return () => { app.ticker.remove(ticker); };
  }, [state.isPlaying]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center p-8">
      {/* Viewport Overlay */}
      <div className="absolute inset-0 pointer-events-none border border-white/5 flex items-center justify-center">
         <div className="aspect-video w-[80%] border border-primary/20 shadow-2xl relative">
            {/* Safe Zone */}
            <div className="absolute inset-[10%] border border-white/5 opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-px h-4 bg-primary/40 absolute top-0" />
               <div className="w-px h-4 bg-primary/40 absolute bottom-0" />
               <div className="w-4 h-px bg-primary/40 absolute left-0" />
               <div className="w-4 h-px bg-primary/40 absolute right-0" />
            </div>
         </div>
      </div>
    </div>
  );
}
