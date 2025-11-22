// ABOUTME: API route for proxying ArXiv search requests
// ABOUTME: Fetches XML from ArXiv API and converts to clean JSON

import { NextRequest, NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const yearFilter = searchParams.get("years") || "all";

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  try {
    const arxivUrl = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(
      query
    )}&start=0&max_results=10&sortBy=relevance`;

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

    let papers = (Array.isArray(entries) ? entries : [entries]).map((entry: any) => ({
      title: entry.title?.replace(/\s+/g, " ").trim() || "",
      summary: entry.summary?.replace(/\s+/g, " ").trim() || "",
      published: entry.published || "",
      authors: Array.isArray(entry.author)
        ? entry.author.map((a: any) => a.name).join(", ")
        : entry.author?.name || "Unknown",
      link: entry.id || "",
    }));

    if (yearFilter !== "all") {
      const cutoffDate = new Date();

      if (yearFilter === "month") {
        cutoffDate.setMonth(cutoffDate.getMonth() - 1);
      } else if (yearFilter === "year") {
        cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
      }

      papers = papers.filter((paper) => {
        const publishedDate = new Date(paper.published);
        return publishedDate >= cutoffDate;
      });
    }

    return NextResponse.json({ papers: papers.slice(0, 3) });
  } catch (error) {
    console.error("ArXiv API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch papers from ArXiv" },
      { status: 500 }
    );
  }
}
