// Free embedding service as fallback when OpenAI quota is exceeded
// This provides basic semantic search capabilities without API costs

export interface FreeEmbeddingResponse {
  embedding: number[];
}

export class FreeEmbeddingService {
  // Simple hash-based embedding generation
  // This is not as sophisticated as OpenAI embeddings but provides basic semantic search
  async generateEmbedding(text: string): Promise<FreeEmbeddingResponse> {
    try {
      console.log('Generating free embedding for text:', text.substring(0, 100) + '...');
      
      // Create a simple embedding based on word frequency and text characteristics
      const embedding = this.createSimpleEmbedding(text);
      
      return {
        embedding: embedding
      };
    } catch (error) {
      console.error('Error generating free embedding:', error);
      // Return a zero vector as fallback
      return {
        embedding: new Array(1536).fill(0)
      };
    }
  }

  private createSimpleEmbedding(text: string): number[] {
    const embedding = new Array(1536).fill(0);
    
    // Convert text to lowercase and split into words
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    // Create a simple hash-based embedding
    words.forEach((word, index) => {
      const hash = this.simpleHash(word);
      const position = hash % 1536;
      embedding[position] += 1;
    });
    
    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] = embedding[i] / magnitude;
      }
    }
    
    return embedding;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

export const freeEmbeddingService = new FreeEmbeddingService(); 