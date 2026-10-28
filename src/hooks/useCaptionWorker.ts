import type { SelectedImage } from "@/types/image";
import { useState, useRef, useEffect } from "react";
import { isWorkerResponse, type WorkerRequest } from "@/worker-protocol";

export function useCaptionWorker() {
  const reqId = useRef(0);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");

  const [workerFailed, setWorkerFailed] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (workerFailed) return;

    const worker = new Worker(
      new URL("../workers/caption.worker.ts", import.meta.url),
      { type: "module" },
    );
    workerRef.current = worker;

    function onMessage({ data }: MessageEvent<unknown>) {
      if (!isWorkerResponse(data)) {
        setError("Worker sent invalid response.");
        return;
      }

      switch (data.type) {
        case "progress":
          setProgress(data.progress);
          break;
        case "ready":
          setReady(true);
          break;
        case "caption":
          if (data.requestId !== reqId.current) return;
          setCaption(data.text);
          break;
        case "error":
          if (data.requestId !== reqId.current) return;
          setError(data.message);
          break;
      }
    }

    const onError = (event: ErrorEvent) => {
      console.error("Caption worker failed", event);
      setError("Worker had an unexpected error.");
      setReady(false);
      setProgress(0);
      setWorkerFailed(true);
    };

    worker.addEventListener("message", onMessage);
    worker.addEventListener("error", onError);

    return () => {
      worker.removeEventListener("message", onMessage);
      worker.removeEventListener("error", onError);
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
    };
  }, [workerFailed]);

  const restartWorker = () => {
    setError("");
    setCaption("");
    setWorkerFailed(false);
  };

  const analyzeImage = (selectedImage: SelectedImage | null) => {
    if (!selectedImage) return;
    setError("");
    setCaption("");

    const sendtoworker = (msg: WorkerRequest) =>
      workerRef.current?.postMessage(msg);
    reqId.current += 1;
    sendtoworker({
      type: "analyze-image",
      image: selectedImage.input,
      requestId: reqId.current,
    });
  };

  return {
    progress,
    ready,
    error,
    workerFailed,
    caption,
    analyzeImage,
    restartWorker,
  };
}
