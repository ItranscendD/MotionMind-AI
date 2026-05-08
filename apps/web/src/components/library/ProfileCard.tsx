import React from "react";
import { 
  Play, 
  Share2, 
  Layers, 
  History, 
  Trash2, 
  MoreVertical,
  ExternalLink
} from "lucide-react";

interface ProfileCardProps {
  style: {
    id: string;
    name: string;
    thumbnail?: string;
    tags: string[];
    updatedAt: string;
  };
}

export default function ProfileCard({ style }: ProfileCardProps) {
  return (
    <div className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer relative">
      {/* Thumbnail */}
      <div className="aspect-[4/3] bg-white/5 relative overflow-hidden">
        {style.thumbnail ? (
          <img src={style.thumbnail} alt={style.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10">
            <Layers className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="p-3 bg-primary text-white rounded-full scale-90 group-hover:scale-100 transition-transform shadow-lg">
            <Play className="w-6 h-6 fill-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-white group-hover:text-primary transition-colors">{style.name}</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Updated {style.updatedAt}</p>
          </div>
          <button className="p-1.5 text-white/20 hover:text-white transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {style.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-medium text-white/60">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button title="Share" className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:text-primary transition-colors border border-white/10">
          <Share2 className="w-4 h-4" />
        </button>
        <button title="Blend" className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:text-accent transition-colors border border-white/10">
          <Layers className="w-4 h-4" />
        </button>
        <button title="Version History" className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:text-white/80 transition-colors border border-white/10">
          <History className="w-4 h-4" />
        </button>
        <button title="Delete" className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-red-500 hover:bg-red-500/20 transition-all border border-white/10">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
         <ExternalLink className="w-4 h-4 text-white/20" />
      </div>
    </div>
  );
}
