![Slopped-In](./slopped-in.png)

**Slopped-In** proves you only need a 2GB model to replicate the intellectual depth of most daily LinkedIn posts.

The entire process runs **100% locally** in your browser using WebGPU. No data is sent to external servers for generation.

**Live Demo:** [slopped-in.vercel.app](https://slopped-in.vercel.app)

## 🔄 Workflow

1.  **SEARCH** for a topic (e.g., "LLMs", "CRISPR") to find real academic papers from arXiv.
2.  **SELECT** a paper from the search results.
3.  **GENERATE** a LinkedIn-style post using a local LLM running directly in your browser.

## 🤖 Models

The app supports various local models via WebLLM:
*   **Qwen 3B:** Fast & Light (~2GB)
*   **Qwen 7B:** High IQ (~4GB)
*   **Llama 3B:** Balanced (~2GB)

## 🚀 Getting Started

First, install the dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ⚠️ Requirements

*   A browser with **WebGPU** support (Chrome 113+, Edge 113+, or other modern browsers).
*   A GPU capable of running the selected models.
