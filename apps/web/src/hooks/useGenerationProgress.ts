import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";

export function useGenerationProgress(jobId: string | null) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "queued" | "processing" | "completed" | "failed">("idle");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!jobId) return;

    setStatus("queued");
    const eventSource = new EventSource(`${API_BASE_URL}/api/jobs/${jobId}/stream`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProgress(data.progress);
      
      if (data.progress > 0 && data.progress < 100) {
        setStatus("processing");
      }

      if (data.state === "completed") {
        setStatus("completed");
        eventSource.close();
        
        // Fetch final result
        fetch(`${API_BASE_URL}/api/styles/jobs/${jobId}`)
          .then(res => res.json())
          .then(data => setResult(data.result));
      }

      if (data.state === "failed") {
        setStatus("failed");
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      setStatus("failed");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [jobId]);

  return { progress, status, result };
}
