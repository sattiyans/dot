import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface EmbeddingResponse {
  embedding: number[];
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class AIService {
  private model: string;
  private temperature: number;

  constructor(model: string = 'gpt-4', temperature: number = 0.7) {
    this.model = model;
    this.temperature = temperature;
  }

  /**
   * Generate embeddings for text using OpenAI
   */
  async generateEmbedding(text: string): Promise<EmbeddingResponse> {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
      });

      return {
        embedding: response.data[0].embedding,
        usage: {
          prompt_tokens: response.usage.prompt_tokens,
          total_tokens: response.usage.total_tokens,
        },
      };
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  /**
   * Generate a response using ChatGPT with context
   */
  async generateResponse(
    messages: ChatMessage[],
    context?: string,
    systemPrompt?: string
  ): Promise<ChatResponse> {
    try {
      // Build the system message
      let systemMessage = systemPrompt || 
        `You are a helpful AI assistant for a website. You provide accurate, helpful, and friendly responses based on the website's content and context. Always be conversational and human-like in your responses.`;

      // Add context if provided
      if (context) {
        systemMessage += `\n\nHere is relevant information from the website:\n${context}\n\nUse this information to provide accurate and helpful responses. If the information doesn't contain the answer, say so politely and offer to help with other questions.`;
      }

      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemMessage },
          ...messages,
        ],
        temperature: this.temperature,
        max_tokens: 1000,
        stream: false,
      });

      return {
        content: response.choices[0].message.content || 'I apologize, but I couldn\'t generate a response.',
        usage: {
          prompt_tokens: response.usage?.prompt_tokens || 0,
          completion_tokens: response.usage?.completion_tokens || 0,
          total_tokens: response.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response');
    }
  }

  /**
   * Generate a response for a specific dot with its knowledge base
   */
  async generateDotResponse(
    userMessage: string,
    dotId: string,
    conversationHistory: ChatMessage[] = [],
    relevantChunks: Array<{ content: string; similarity: number }> = []
  ): Promise<ChatResponse> {
    // Build context from relevant chunks
    let context = '';
    if (relevantChunks.length > 0) {
      context = relevantChunks
        .map(chunk => chunk.content)
        .join('\n\n');
    }

    // Create system prompt for the specific dot
    const systemPrompt = `You are a helpful AI assistant for a website. You provide accurate, helpful, and friendly responses based on the website's content and context. 

Key guidelines:
- Be conversational and human-like
- Use the provided context to answer questions accurately
- If you don't have information about something, say so politely
- Keep responses concise but informative
- Be helpful and professional
- If asked about the website or company, use the context provided
- If the context doesn't contain the answer, offer to help with other questions`;

    // Prepare messages
    const messages: ChatMessage[] = [
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: userMessage },
    ];

    return await this.generateResponse(messages, context, systemPrompt);
  }

  /**
   * Generate embeddings for multiple texts
   */
  async generateEmbeddings(texts: string[]): Promise<EmbeddingResponse[]> {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: texts,
        encoding_format: 'float',
      });

      return response.data.map((item, index) => ({
        embedding: item.embedding,
        usage: {
          prompt_tokens: response.usage.prompt_tokens,
          total_tokens: response.usage.total_tokens,
        },
      }));
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw new Error('Failed to generate embeddings');
    }
  }

  /**
   * Extract key information from text for better context
   */
  async extractKeyInfo(text: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Extract the most important and relevant information from the given text. Focus on facts, key details, and useful information that would help answer user questions. Keep it concise but comprehensive.',
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      return response.choices[0].message.content || text;
    } catch (error) {
      console.error('Error extracting key info:', error);
      return text; // Fallback to original text
    }
  }

  /**
   * Check if text is relevant to a query
   */
  async isRelevant(query: string, text: string): Promise<boolean> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Determine if the given text is relevant to the user query. Respond with only "yes" or "no".',
          },
          {
            role: 'user',
            content: `Query: "${query}"\n\nText: "${text}"\n\nIs this text relevant to the query?`,
          },
        ],
        temperature: 0.1,
        max_tokens: 10,
      });

      const answer = response.choices[0].message.content?.toLowerCase().trim();
      return answer === 'yes';
    } catch (error) {
      console.error('Error checking relevance:', error);
      return true; // Default to relevant if check fails
    }
  }
}

// Export singleton instance
export const aiService = new AIService();

// Utility functions
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await aiService.generateEmbedding(text);
  return response.embedding;
}

export async function generateResponse(
  messages: ChatMessage[],
  context?: string
): Promise<string> {
  const response = await aiService.generateResponse(messages, context);
  return response.content;
} 