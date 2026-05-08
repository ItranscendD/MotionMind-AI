import React, { useState } from "react";
import { 
  X, 
  Upload, 
  Video, 
  Image as ImageIcon, 
  FileCode, 
  Link as LinkIcon, 
  Box,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [method, setMethod] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const methods = [
    { id: "video", name: "Video File", icon: Video, desc: "MP4, MOV, WebM (Max 500MB)" },
    { id: "image", name: "Image Seq", icon: ImageIcon, desc: "ZIP archive of PNG/JPG" },
    { id: "aep", name: "After Effects", icon: FileCode, desc: ".aep Project File" },
    { id: "lottie", name: "Lottie JSON", icon: Box, desc: "JSON or dotLottie" },
    { id: "design", name: "Design File", icon: Layers, desc: "Figma or Sketch link" },
    { id: "url", name: "URL Input", icon: LinkIcon, desc: "YouTube, Vimeo, or Direct link" },
  ];

  const handleUpload = async () => {
    setIsUploading(true);
    setError(null);
    
    try {
      // 1. Get Upload Intent
      const intentRes = await fetch('http://localhost:3001/api/styles/upload-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: 'style_source.mp4', fileSize: 123456, fileType: 'video/mp4' })
      });
      const { uploadId } = await intentRes.json();

      // 2. Start Job
      const jobRes = await fetch('http://localhost:3001/api/styles/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId, userId: 'user_123', workspaceId: 'ws_123', type: method })
      });
      const { jobId } = await jobRes.json();

      // 3. Poll for Progress
      let p = 0;
      const interval = setInterval(async () => {
        const statusRes = await fetch(`http://localhost:3001/api/styles/jobs/${jobId}`);
        const status = await statusRes.json();
        
        if (status.progress) setProgress(status.progress);
        
        if (status.state === 'completed') {
          clearInterval(interval);
          setIsUploading(false);
          onClose();
          window.location.href = `/library/review/${jobId}`;
        }
      }, 1000);

    } catch (err) {
      setError("Failed to initiate ingestion pipeline.");
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#161618] border border-white/10 rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">New Style Ingestion</h2>
            <p className="text-white/40 text-sm">Choose a source to extract cinematic DNA.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6 text-white/40" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {!method ? (
            <div className="grid grid-cols-2 gap-4">
              {methods.map((m) => (
                <button 
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 text-left transition-all group"
                >
                  <m.icon className="w-8 h-8 text-white/20 group-hover:text-primary transition-colors mb-4" />
                  <h4 className="font-bold text-sm mb-1">{m.name}</h4>
                  <p className="text-[10px] text-white/40">{m.desc}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <button 
                onClick={() => setMethod(null)}
                className="text-xs font-bold text-primary mb-6 hover:underline flex items-center gap-1"
              >
                Change Method
              </button>

              {isUploading ? (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-white/5 border-t-primary animate-spin mb-8" />
                  <h3 className="text-xl font-bold mb-2">Uploading Style Source...</h3>
                  <p className="text-white/40 text-sm mb-8">Chunked multipart upload to S3 in progress.</p>
                  
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex w-full justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    <span>{progress}% complete</span>
                    <span>32.4 MB / 145.2 MB</span>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={handleUpload}
                  className="border-2 border-dashed border-white/10 rounded-3xl p-16 flex flex-col items-center justify-center gap-6 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                >
                  <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary transition-colors">
                    <Upload className="w-10 h-10" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">Drag and drop your file</h3>
                    <p className="text-white/40 text-sm">Or click to browse your local files.</p>
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 px-4 py-2 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {method && !isUploading && (
          <div className="p-8 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/20 text-[10px] font-bold uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4" />
              S3 Multi-part enabled
            </div>
            <button 
              onClick={handleUpload}
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Start Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
