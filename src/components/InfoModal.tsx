import { X } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  return (
    <div className={`absolute inset-0 flex items-center justify-center z-50 transition-all duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <div className={`w-full max-w-3xl border-2 border-black bg-white shadow-retro relative flex flex-col transition-all duration-300 transform ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black p-3 bg-gray-50">
          <h2 className="text-lg font-bold uppercase tracking-wider">System Manual / README</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-retro-red hover:text-white border-2 border-transparent hover:border-black transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 font-mono flex flex-col gap-6">
          {/* Main Section */}
          <section className="border-b-2 border-black pb-6">
            <h3 className="text-lg font-bold uppercase mb-3 bg-black text-white inline-block px-2">Mission</h3>
            <p className="text-sm mb-2">
              <strong>Sloppedin</strong> proves you only need a 2GB model to replicate the intellectual depth of most daily LinkedIn posts.
            </p>
            <p className="text-sm">
              The entire process runs <strong>100% locally</strong> in your browser.
            </p>
          </section>

          <div className="grid grid-cols-2 gap-8">
            {/* Bottom Left: How to use */}
            <section>
              <h3 className="text-lg font-bold uppercase mb-3 border-b-2 border-black inline-block">Workflow</h3>
              <ul className="text-sm space-y-3">
                <li>
                  <span className="font-bold bg-gray-200 px-1 mr-2">01</span>
                  <strong>SEARCH</strong> for a topic (e.g. &quot;LLMs&quot;, &quot;CRISPR&quot;).
                </li>
                <li>
                  <span className="font-bold bg-gray-200 px-1 mr-2">02</span>
                  <strong>SELECT</strong> a paper from arXiv search results.
                </li>
                <li>
                  <span className="font-bold bg-gray-200 px-1 mr-2">03</span>
                  <strong>GENERATE</strong> content using the selected model.
                </li>
              </ul>
            </section>

            {/* Bottom Right: Model Info */}
            <section>
              <h3 className="text-lg font-bold uppercase mb-3 border-b-2 border-black inline-block">Models</h3>
              <ul className="text-sm space-y-2">
                <li><strong>Qwen 3B:</strong> Fast & Light (~2GB)</li>
                <li><strong>Qwen 7B:</strong> High IQ (~4GB)</li>
                <li><strong>Llama 3B:</strong> Balanced (~2GB)</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}