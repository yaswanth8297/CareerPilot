import { CuratedResource } from "../types";
import { CURATED_RESOURCES } from "../data/curatedResources";

export interface RetrievalFilter {
  targetRole?: string;
  language?: "en" | "hinglish" | "hi";
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  topK?: number; // 4 to 6 chunks per PRD
}

export interface RetrievedChunk {
  resource: CuratedResource;
  rrfScore: number;
  keywordRank: number;
  vectorRank: number;
  citationId: string;
}

export interface HybridRetrievalResult {
  chunks: RetrievedChunk[];
  groundedContextText: string;
  citedIds: string[];
}

// 1. Keyword / Full-Text Search Simulation (BM25 Token Overlap)
function computeKeywordRankings(query: string, pool: CuratedResource[]): Map<string, number> {
  const queryTokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const scored = pool.map(item => {
    const text = `${item.title} ${item.platform} ${item.roleTags.join(" ")} ${item.difficulty}`.toLowerCase();
    let score = 0;
    for (const t of queryTokens) {
      if (text.includes(t)) score += 2;
      for (const roleTag of item.roleTags) {
        if (roleTag.includes(t) || t.includes(roleTag)) score += 3;
      }
    }
    return { id: item.id, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const ranks = new Map<string, number>();
  scored.forEach((s, idx) => ranks.set(s.id, idx + 1));
  return ranks;
}

// 2. Vector Cosine Similarity Search Simulation (pgvector Representation)
function computeVectorRankings(query: string, pool: CuratedResource[]): Map<string, number> {
  const hashString = (str: string, seed = 0) => {
    let h = seed;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    }
    return Math.abs(h);
  };

  const scored = pool.map(item => {
    // Simulated semantic cosine similarity
    const qHash = hashString(query.toLowerCase());
    const itemHash = hashString(item.title.toLowerCase());
    const overlap = item.roleTags.filter(r => query.toLowerCase().includes(r.toLowerCase())).length;
    const similarity = 0.5 + (overlap * 0.25) + ((qHash % 100) * 0.001) + ((itemHash % 100) * 0.001);
    return { id: item.id, similarity: Math.min(0.99, similarity) };
  });

  scored.sort((a, b) => b.similarity - a.similarity);

  const ranks = new Map<string, number>();
  scored.forEach((s, idx) => ranks.set(s.id, idx + 1));
  return ranks;
}

// 3. Hybrid Retrieval with Reciprocal Rank Fusion (RRF)
export function performHybridRetrieval(query: string, filter?: RetrievalFilter): HybridRetrievalResult {
  const topK = filter?.topK || 5; // PRD: 4 to 6 chunks returned

  // Metadata filter phase (applies before retrieval per PRD)
  let pool = [...CURATED_RESOURCES];
  if (filter?.targetRole) {
    const roleMatches = pool.filter(r => r.roleTags.includes(filter.targetRole!));
    if (roleMatches.length > 0) {
      pool = roleMatches;
    }
  }
  if (filter?.language) {
    const langMatches = pool.filter(r => r.language === filter.language);
    if (langMatches.length > 0) {
      pool = langMatches;
    }
  }

  // Rank computations
  const keywordRanks = computeKeywordRankings(query, pool);
  const vectorRanks = computeVectorRankings(query, pool);

  // Reciprocal Rank Fusion: RRF = 1 / (60 + rank_keyword) + 1 / (60 + rank_vector)
  const rrfList: RetrievedChunk[] = pool.map(resource => {
    const kRank = keywordRanks.get(resource.id) || 100;
    const vRank = vectorRanks.get(resource.id) || 100;
    const rrfScore = (1 / (60 + kRank)) + (1 / (60 + vRank));
    return {
      resource,
      rrfScore,
      keywordRank: kRank,
      vectorRank: vRank,
      citationId: resource.id
    };
  });

  rrfList.sort((a, b) => b.rrfScore - a.rrfScore);
  const selectedChunks = rrfList.slice(0, topK);

  // Format clearly separated Grounded-Context Section per PRD Section 5
  const contextLines = selectedChunks.map(chunk => {
    return `[ID: ${chunk.resource.id}] "${chunk.resource.title}" | Platform: ${chunk.resource.platform} | Level: ${chunk.resource.difficulty} | Language: ${chunk.resource.language}`;
  });

  const groundedContextText = `
--- BEGIN GROUNDED VETTED KNOWLEDGE CONTEXT ---
${contextLines.join("\n")}
--- END GROUNDED VETTED KNOWLEDGE CONTEXT ---
INSTRUCTION: You must strictly cite internal source IDs [res-xxx] from the grounded context above. Never output free-form or unverified external URLs.
`.trim();

  return {
    chunks: selectedChunks,
    groundedContextText,
    citedIds: selectedChunks.map(c => c.citationId)
  };
}
