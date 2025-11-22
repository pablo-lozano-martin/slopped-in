// ABOUTME: Main application page component integrating all features
// ABOUTME: Orchestrates search, paper selection, AI initialization, and post generation

"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ResultsGrid from "@/components/ResultsGrid";
import PostPreview from "@/components/PostPreview";
import SlopMeter from "@/components/SlopMeter";
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

  const { engineState, loadingProgress, error: engineError, generatePost } = useWebLLM();

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">Slopped-in</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform ArXiv papers into viral LinkedIn posts using local AI
          </p>
        </header>

        {engineState === "loading" && (
          <div className="max-w-2xl mx-auto mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              <h3 className="font-semibold text-lg">Loading AI Model</h3>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              Downloading Qwen 2.5 (3B) - {loadingProgress}%
            </p>
            <p className="text-xs text-gray-500 mt-2">
              First load ~2GB. Model will be cached for future visits.
            </p>
          </div>
        )}

        {engineState === "error" && engineError && (
          <div className="max-w-2xl mx-auto mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-lg text-red-900">Error</h3>
                <p className="text-sm text-red-700">{engineError}</p>
                <p className="text-xs text-red-600 mt-2">
                  WebGPU is required. Try Chrome or Edge on desktop.
                </p>
              </div>
            </div>
          </div>
        )}

        <SearchBar onSearch={handleSearch} isLoading={isSearching} />

        {searchError && (
          <div className="max-w-2xl mx-auto mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">{searchError}</p>
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
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
