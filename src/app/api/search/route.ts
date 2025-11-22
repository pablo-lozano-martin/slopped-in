// ABOUTME: API route for proxying ArXiv search requests
// ABOUTME: Fetches XML from ArXiv API and converts to clean JSON

import { NextRequest, NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

function formatArxivDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}0000`;
}

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
    let searchQuery = `all:${query}`;

    if (yearFilter !== "all") {
      const today = new Date();
      const startDate = new Date();

      if (yearFilter === "month") {
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (yearFilter === "year") {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      const fromDate = formatArxivDate(startDate);
      const toDate = formatArxivDate(today);

      searchQuery = `all:${query} AND submittedDate:[${fromDate} TO ${toDate}]`;
    }

    const arxivUrl = `http://export.arxiv.org/api/query?search_query=${encodeURIComponent(
      searchQuery
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
