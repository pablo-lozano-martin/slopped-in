// ABOUTME: Main application page component integrating all features
// ABOUTME: Orchestrates search, paper selection, AI initialization, and post generation

"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ResultsGrid from "@/components/ResultsGrid";
import PostPreview from "@/components/PostPreview";
import SlopMeter from "@/components/SlopMeter";
import ModelSelector from "@/components/ModelSelector";
import { useWebLLM } from "@/hooks/useWebLLM";
import { Paper } from "@/types";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

export default function Home() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [generatedPost, setGeneratedPost] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [slopLevel, setSlopLevel] = useState(3);
  const [selectedModel, setSelectedModel] = useState("Qwen2.5-3B-Instruct-q4f16_1-MLC");

  const { engineState, loadingProgress, error: engineError, generatePost } = useWebLLM(selectedModel);

  const handleSearch = async (query: string, yearFilter: string) => {
    setIsSearching(true);
    setSearchError(null);
    setPapers([]);
    setSelectedPaper(null);
    setGeneratedPost("");

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&years=${yearFilter}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to search papers");
      }

      setPapers(data.papers || []);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPaper = (paper: Paper) => {
    setSelectedPaper(paper);
    setGeneratedPost("");
  };

  const handleGenerate = async () => {
    if (!selectedPaper || engineState !== "ready") return;

    setGeneratedPost("");
    try {
      await generatePost(selectedPaper.summary, slopLevel, (text) => {
        setGeneratedPost(text);
      });
    } catch (err) {
      console.error("Generation failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-retro-gray py-12 px-4 font-mono">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-retro-red" />
            <h1 className="text-5xl font-bold text-black uppercase tracking-widest">Slopped-in</h1>
          </div>
          <p className="text-xl text-black max-w-2xl mx-auto border-2 border-black bg-white p-2 shadow-retro inline-block">
            Transform ArXiv papers into viral LinkedIn posts using local AI
          </p>
        </header>

        <ModelSelector
          value={selectedModel}
          onChange={setSelectedModel}
          disabled={engineState === "loading"}
        />

        {engineState === "loading" && (
          <div className="max-w-2xl mx-auto mb-8 p-6 bg-white border-2 border-black shadow-retro">
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="w-6 h-6 text-black animate-spin" />
              <h3 className="font-semibold text-lg uppercase tracking-wider">Loading AI Model</h3>
            </div>
            <div className="w-full bg-dither border-2 border-black h-6 mb-2 p-1">
              <div
                className="bg-retro-red h-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-sm text-black">
              Downloading {selectedModel.includes("3B") ? "Qwen 2.5 (3B)" : "Qwen 2.5 (7B)"} - {loadingProgress}%
            </p>
            <p className="text-xs text-gray-500 mt-2">
              First load {selectedModel.includes("3B") ? "~2GB" : "~4GB"}. Model will be cached for future visits.
            </p>
          </div>
        )}

        {engineState === "error" && engineError && (
          <div className="max-w-2xl mx-auto mb-8 p-6 bg-white border-2 border-black shadow-retro">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-black" />
              <div>
                <h3 className="font-semibold text-lg text-black uppercase tracking-wider">Error</h3>
                <p className="text-sm text-black">{engineError}</p>
                <p className="text-xs text-gray-600 mt-2">
                  WebGPU is required. Try Chrome or Edge on desktop.
                </p>
              </div>
            </div>
          </div>
        )}

        <SearchBar onSearch={handleSearch} isLoading={isSearching} />

        {searchError && (
          <div className="max-w-2xl mx-auto mt-4 p-4 bg-white border-2 border-black shadow-retro">
            <p className="text-sm text-black">{searchError}</p>
          </div>
        )}

        <ResultsGrid
          papers={papers}
          selectedPaper={selectedPaper}
          onSelectPaper={handleSelectPaper}
        />

        {selectedPaper && (
          <>
            <SlopMeter
              value={slopLevel}
              onChange={setSlopLevel}
              disabled={engineState === "generating"}
            />
            <div className="w-full max-w-2xl mx-auto mb-8">
              <button
                onClick={handleGenerate}
                disabled={engineState !== "ready"}
                className="w-full px-6 py-3 bg-retro-red text-white font-semibold border-2 border-black hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-retro active:shadow-none active:translate-x-[2px] active:translate-y-[2px] uppercase tracking-wider"
              >
                {engineState === "generating" ? "Generating..." : "Generate Post"}
              </button>
            </div>
          </>
        )}

        <PostPreview
          content={generatedPost}
          isGenerating={engineState === "generating"}
        />
      </div>
    </div>
  );
}
