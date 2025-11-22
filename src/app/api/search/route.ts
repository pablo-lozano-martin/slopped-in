// ABOUTME: API route for proxying ArXiv search requests
// ABOUTME: Fetches XML from ArXiv API and converts to clean JSON

import { NextRequest, NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  try {
    const arxivUrl = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(
      query
    )}&start=0&max_results=3&sortBy=relevance`;

    const response = await fetch(arxivUrl);

    if (!response.ok) {
      throw new Error(`ArXiv API returned status ${response.status}`);
    }

    const xmlData = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });

    const result = parser.parse(xmlData);

    const entries = result.feed?.entry;

    if (!entries) {
      return NextResponse.json({ papers: [] });
    }

    const papers = (Array.isArray(entries) ? entries : [entries]).map((entry: any) => ({
      title: entry.title?.replace(/\s+/g, " ").trim() || "",
      summary: entry.summary?.replace(/\s+/g, " ").trim() || "",
      published: entry.published || "",
      authors: Array.isArray(entry.author)
        ? entry.author.map((a: any) => a.name).join(", ")
        : entry.author?.name || "Unknown",
      link: entry.id || "",
    }));

    return NextResponse.json({ papers });
  } catch (error) {
    console.error("ArXiv API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch papers from ArXiv" },
      { status: 500 }
    );
  }
}
