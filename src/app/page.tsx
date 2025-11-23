// ABOUTME: Main application page component integrating all features
// ABOUTME: Orchestrates search, paper selection, AI initialization, and post generation

"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import ResultsGrid from "@/components/ResultsGrid";
import PostPreview from "@/components/PostPreview";
import SlopMeter from "@/components/SlopMeter";
import ModelSelector from "@/components/ModelSelector";
import InfoModal from "@/components/InfoModal";
import { useWebLLM } from "@/hooks/useWebLLM";
import { Paper } from "@/types";
import { Loader2, AlertCircle, Minus, X, Square } from "lucide-react";

export default function Home() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [generatedPost, setGeneratedPost] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [slopLevel, setSlopLevel] = useState(3);
  const [selectedModel, setSelectedModel] = useState("Qwen2.5-3B-Instruct-q4f16_1-MLC");
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);
  const [savedPosts, setSavedPosts] = useState<Record<string, string>>({});
  const [isMinimized, setIsMinimized] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [showHelpHint, setShowHelpHint] = useState(true);
  const [arrowText, setArrowText] = useState("<<<");

  const slopLabels = ["Academic", "Balanced", "Engaging", "Catchy", "Viral"];
  const { engineState, loadingProgress, error: engineError, generatePost, initializeEngine } = useWebLLM(selectedModel);

  useEffect(() => {
    if (!showHelpHint) return;
    const frames = ["", "<", "<<", "<<<", "<<", "<"];
    let i = 0;
    const interval = setInterval(() => {
      setArrowText(frames[i]);
      i = (i + 1) % frames.length;
    }, 400);
    return () => clearInterval(interval);
  }, [showHelpHint]);

  useEffect(() => {
    const saved = localStorage.getItem("sloppedin-posts");
    if (saved) {
      try {
        setSavedPosts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved posts", e);
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(savedPosts).length > 0) {
      localStorage.setItem("sloppedin-posts", JSON.stringify(savedPosts));
    }
  }, [savedPosts]);

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
    setGeneratedPost(savedPosts[paper.link] || "");
  };

  const handleGenerate = async () => {
    if (!selectedPaper || engineState !== "ready") return;

    setGeneratedPost("");
    try {
      const finalPost = await generatePost(selectedPaper.summary, slopLevel, (text) => {
        setGeneratedPost(text);
      });

      if (finalPost) {
        setSavedPosts((prev) => ({
          ...prev,
          [selectedPaper.link]: finalPost,
        }));
      }
    } catch (err) {
      console.error("Generation failed:", err);
    }
  };

  return (
    <div className="h-screen bg-retro-gray p-4 font-mono bg-dither flex flex-col overflow-hidden relative">
      
      {/* Desktop Icon (Minimized State) */}
      <div 
        className={`absolute bottom-8 left-8 flex flex-col items-center gap-2 cursor-pointer group transition-all duration-300 ease-in-out ${
          isMinimized ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"
        }`}
        onClick={() => {
          setIsMinimized(false);
          setIsInfoOpen(false);
        }}
      >
        <div className="w-16 h-16 bg-white border-2 border-black shadow-retro flex items-center justify-center group-hover:bg-retro-red group-hover:text-white transition-colors">
           <svg width="40" height="40" viewBox="0 0 11 11" fill="currentColor" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
             <rect x="4" y="3" width="1" height="1" />
             <rect x="6" y="3" width="1" height="1" />
             <rect x="3" y="6" width="1" height="1" />
             <rect x="7" y="6" width="1" height="1" />
             <rect x="3" y="7" width="5" height="1" />
           </svg>
        </div>
        <span className="bg-white px-2 border border-black text-xs font-bold shadow-sm whitespace-nowrap">SLOPPEDIN.VERCEL.APP</span>
      </div>

      {/* Pablo App Icon (Minimized State) */}
      <a 
        href="https://pablo-lozano.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className={`absolute bottom-8 left-32 flex flex-col items-center gap-2 cursor-pointer group transition-all duration-300 ease-in-out ${
          isMinimized ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"
        }`}
      >
        <div className="w-16 h-16 bg-white border-2 border-black shadow-retro flex items-center justify-center group-hover:bg-retro-red group-hover:text-white transition-colors">
           <svg width="40" height="40" viewBox="0 0 11 11" fill="currentColor" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
             <rect x="3" y="5" width="1" height="1" />
             <rect x="7" y="5" width="1" height="1" />
             <rect x="3" y="7" width="5" height="1" />
           </svg>
        </div>
        <span className="bg-white px-2 border border-black text-xs font-bold shadow-sm whitespace-nowrap">PABLO.APP</span>
      </a>

      <InfoModal 
        isOpen={isInfoOpen} 
        onClose={() => {
          setIsInfoOpen(false);
          setIsMinimized(false);
        }} 
      />

      <div className={`w-full h-full max-w-[1800px] mx-auto border-2 border-black bg-white shadow-retro flex flex-col relative transition-all duration-300 ease-in-out transform origin-bottom-left ${
        isMinimized ? "scale-0 opacity-0 translate-y-[200px] pointer-events-none" : "scale-100 opacity-100 translate-y-0"
      }`}>
        
        {/* Window Title Bar */}
        <div className="border-b-2 border-black bg-white p-1 flex items-center justify-between shrink-0 select-none">
          <div className="flex-1 h-8 bg-stripes flex items-center px-2 overflow-hidden">
            <span className="bg-white px-4 text-lg font-bold uppercase tracking-widest border-2 border-black shadow-sm whitespace-nowrap">
              SYSTEM_V1.0 // SLOPPEDIN.VERCEL.APP
            </span>
          </div>
          <div className="flex gap-1 ml-2 pl-2 bg-white">
            <button 
              onClick={() => setIsMinimized(true)}
              className="w-8 h-8 border-2 border-black bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 border-2 border-black bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors">
              <Square className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 border-2 border-black bg-retro-red flex items-center justify-center text-white hover:bg-red-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main VST Interface */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* LEFT PANEL: INPUTS & CONTROLS */}
          <div className="lg:w-[500px] xl:w-[550px] flex flex-col border-r-2 border-black bg-gray-50 shrink-0">
            
            {/* Header & Search (Fixed Top) */}
            <div className="px-4 pt-2 pb-4 border-b-2 border-black bg-white z-10">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-[3.2rem] font-bold text-black uppercase tracking-tighter leading-none" style={{ textShadow: '2px 2px 0px #e0e0e0' }}>
                  SLOPPED<span className="text-retro-red">IN</span>
                </h1>
                
                {/* Compact Status Indicator */}
                <div className="flex flex-col items-end gap-2 relative">
                   <div className="flex items-center gap-2">
                      {/* Info Display Box */}
                      <div className="h-9 pl-1.5 pr-2 border border-black bg-white text-black flex items-center justify-between min-w-[240px]">
                        <button 
                          onClick={() => {
                            setIsInfoOpen(true);
                            setIsMinimized(true);
                            setShowHelpHint(false);
                          }}
                          className={`mr-2 p-0.5 transition-colors rounded-sm ${showHelpHint ? "bg-retro-red text-white" : "hover:bg-black hover:text-white"}`}
                          onMouseEnter={() => setHoverInfo("OPEN SYSTEM MANUAL")}
                          onMouseLeave={() => setHoverInfo(null)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                        </button>
                        <span className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden text-right flex-1 ${showHelpHint ? "text-retro-red" : ""}`}>
                          {hoverInfo ? hoverInfo : 
                           showHelpHint ? `${arrowText} READ MANUAL FIRST` :
                           engineState === 'loading' ? `DOWNLOADING... ${Math.round(loadingProgress)}%` :
                           engineState === 'generating' ? 'INFERENCE RUNNING' :
                           engineState === 'ready' ? 'SYSTEM READY' : 'WAITING FOR INPUT'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider border border-black px-2 py-1 bg-gray-50 h-9">
                          <div className={`w-2 h-2 border border-black ${engineState === 'loading' || engineState === 'generating' ? 'bg-retro-red animate-pulse' : engineState === 'ready' ? 'bg-black' : 'bg-transparent'}`} />
                          <span>{engineState === 'loading' ? 'INIT' : engineState === 'generating' ? 'BUSY' : engineState === 'ready' ? 'READY' : 'IDLE'}</span>
                      </div>
                   </div>
                   {engineState === 'loading' && (
                      <div className="absolute -bottom-3 right-0 w-full h-1 border border-black bg-white">
                        <div className="h-full bg-retro-red transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
                      </div>
                   )}
                </div>
              </div>

              {/* Subtitle Section */}
              <div className="w-full bg-gray-50 py-1 mb-4">
                 <div className="flex whitespace-nowrap px-1 justify-center">
                    <span className="text-xs uppercase tracking-widest text-gray-500">Viral Post Generator Module (or how to turn serious papers into linked-in ai slop)</span>
                 </div>
              </div>

              <SearchBar onSearch={handleSearch} isLoading={isSearching} onHover={setHoverInfo} />
              
              {searchError && (
                <div className="mt-2 p-2 border-2 border-black bg-white shadow-retro text-xs text-retro-red font-bold uppercase">
                  Error: {searchError}
                </div>
               )}
            </div>

            {/* Results List (Scrollable Middle) */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
               <ResultsGrid
                  papers={papers}
                  selectedPaper={selectedPaper}
                  onSelectPaper={handleSelectPaper}
                />
            </div>

            {/* Controls Footer (Fixed Bottom) */}
            <div className="p-4 border-t-2 border-black bg-white">
               <div className="flex gap-4">
                 <div className="w-1/2">
                    <ModelSelector
                      value={selectedModel}
                      onChange={setSelectedModel}
                      onHover={setHoverInfo}
                      disabled={engineState === "loading"}
                    />
                 </div>
                 <div className="w-1/2">
                    <SlopMeter
                      value={slopLevel}
                      onChange={setSlopLevel}
                      onHover={setHoverInfo}
                      disabled={engineState === "generating"}
                    />
                 </div>
               </div>
               
               {engineState === "idle" || engineState === "error" ? (
                 <button
                    onClick={initializeEngine}
                    onMouseEnter={() => setHoverInfo("INITIALIZE AI ENGINE")}
                    onMouseLeave={() => setHoverInfo(null)}
                    className="w-full py-2 bg-black text-white text-base font-bold border-2 border-black hover:bg-gray-800 transition-all shadow-retro active:shadow-none active:translate-x-[2px] active:translate-y-[2px] uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {engineState === "error" ? "RETRY INITIALIZATION" : "LOAD MODEL"}
                  </button>
               ) : (
                 <button
                    onClick={handleGenerate}
                    onMouseEnter={() => setHoverInfo("INITIATE GENERATION SEQUENCE")}
                    onMouseLeave={() => setHoverInfo(null)}
                    disabled={engineState !== "ready" || !selectedPaper}
                    className="w-full py-2 bg-retro-red text-white text-base font-bold border-2 border-black hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-retro active:shadow-none active:translate-x-[2px] active:translate-y-[2px] uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {engineState === "generating" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        PROCESSING
                      </>
                    ) : engineState === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        LOADING MODEL...
                      </>
                    ) : (
                      "GENERATE"
                    )}
                  </button>
               )}
            </div>
          </div>

          {/* RIGHT PANEL: PREVIEW SCREEN */}
          <div className="flex-1 bg-gray-100 p-4 lg:p-8 flex flex-col overflow-hidden relative">
             <div className="absolute inset-0 bg-dither opacity-50 pointer-events-none"></div>
             
             <div className="flex-1 min-h-0 flex flex-col z-10 mb-5">
               <PostPreview
                  content={generatedPost}
                  isGenerating={engineState === "generating"}
                  model={selectedModel}
                  style={slopLabels[slopLevel - 1]}
                />
             </div>

             {/* Credits / System Info */}
             <div className="absolute bottom-3 left-5 right-5 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest z-10 select-none">
                <div className="flex gap-3">
                    <span>© 2025 PABLO LOZANO</span>
                    <span className="text-gray-300">|</span>
                    <span>MADRID</span>
                </div>
                <a 
                  href="https://pablo-lozano.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-retro-red transition-colors"
                >
                    PABLO-LOZANO.VERCEL.APP
                </a>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
