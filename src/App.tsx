import type { SelectedImage } from "@/types/image";
import { useEffect, useState } from "react";
import { Eye, Moon, Sun } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { CaptionPanel } from "@/components/CaptionPanel";
import { ImageSourcePanel } from "@/components/ImageSourcePanel";
import { useCaptionWorker } from "@/hooks/useCaptionWorker";

function Hero() {
  return (
    <>
      <p className="flex items-center gap-2 text-xs text-muted-foreground italic">
        <Eye size={"16"} />
        TRANSFORMERS.JS - IMAGE-TO-TEXT
      </p>
      <p>
        Choose a sample or upload a photo. A vision model generates a short
        caption on your device.{" "}
      </p>
    </>
  );
}

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <div className="flex h-4 items-center justify-end gap-2 text-xs">
      <Sun fill="true" size={16} />
      <Switch
        aria-label="Toggle dark/light mode"
        onCheckedChange={toggleTheme}
        checked={theme === "dark"}
        size="sm"
      />
      <Moon fill="true" size={16} />
    </div>
  );
}

function App() {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null,
  );
  const {
    progress,
    ready,
    workerFailed,
    error,
    caption,
    analyzeImage,
    restartWorker,
  } = useCaptionWorker();

  useEffect(() => {
    const objectUrl = selectedImage?.ownedPreviewUrl;
    if (!objectUrl) return;

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget?.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const selection = {
      input: file,
      previewUrl,
      ownedPreviewUrl: previewUrl,
    };

    setSelectedImage(selection);
    analyzeImage(selection);
  };

  const handleSampleSelection = (url: string) => {
    const selection = {
      input: url,
      previewUrl: url,
    };

    setSelectedImage(selection);
    analyzeImage(selection);
  };

  return (
    <div className="m-auto flex max-w-225 flex-col justify-center gap-4 p-4">
      <ThemeSwitch />
      <Hero />
      <ImageSourcePanel
        selectedImage={selectedImage}
        handleSampleSelection={handleSampleSelection}
        workerFailed={workerFailed}
        handleImageSelected={handleImageSelected}
      />
      <CaptionPanel
        error={error}
        caption={caption}
        progress={progress}
        ready={ready}
        workerFailed={workerFailed}
        restartWorker={restartWorker}
      />
    </div>
  );
}

export default App;
