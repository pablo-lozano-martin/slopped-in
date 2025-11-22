// ABOUTME: TypeScript type definitions for Slopped-in
// ABOUTME: Defines interfaces for papers, AI engine states, and component props

export interface Paper {
  title: string;
  summary: string;
  published: string;
  authors: string;
  link: string;
}

export type EngineState = "loading" | "ready" | "generating" | "error";
