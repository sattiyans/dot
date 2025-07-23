import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { getMockResponse } from '@/lib/mock-ai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export async function POST(request: NextRequest) {
  try {
    const { dotId, message, history = [] } = await request.json();

    if (!dotId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle demo dot specially
    let dot;
    if (dotId === 'demo') {
      dot = {
        id: 'demo',
        name: 'Dot AI Assistant',
        context: 'Dot is a SaaS platform that allows businesses to create and embed AI chatbots on their websites.',
        ai_model: 'gpt-3.5-turbo',
        temperature: 0.7
      };
    } else {
      // Get dot configuration from database
      const { data: dotData, error: dotError } = await supabase
        .from('dots')
        .select('*')
        .eq('id', dotId)
        .single();

      if (dotError || !dotData) {
        return NextResponse.json(
          { error: 'Dot not found' },
          { status: 404 }
        );
      }
      dot = dotData;
    }

    // Search knowledge base for relevant content
    const relevantChunks = await searchKnowledgeBase(dotId, message);

    // Generate AI response
    const response = await generateResponse(message, relevantChunks, history, dot, dotId);

    // Store conversation (skip for demo)
    if (dotId !== 'demo') {
      await storeConversation(dotId, message, response);
    }

    return NextResponse.json({
      response,
      relevantChunks: relevantChunks.length
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: 'Chat failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function searchKnowledgeBase(dotId: string, query: string): Promise<string[]> {
  // Hardcoded knowledge base for demo dot
  if (dotId === 'demo') {
    const demoKnowledge = {
      'what is dot': [
        'Dot is a SaaS platform that allows businesses to create and embed AI chatbots on their websites. It provides a simple way to add intelligent conversations to any website instantly.',
        'Dot is an AI chatbot platform that helps businesses engage with their website visitors through intelligent conversations. You can create custom chatbots and embed them on your website.'
      ],
      'how does dot work': [
        'Dot works by allowing you to create a chatbot with custom knowledge, then embed it on your website using a simple JavaScript snippet. The chatbot can answer questions about your business, products, or services.',
        'To use Dot: 1) Create a chatbot with your business information, 2) Customize its appearance and behavior, 3) Get an embed code, 4) Add it to your website. The chatbot will then help visitors with questions.'
      ],
      'features': [
        'Dot features include: Custom AI chatbots, knowledge base management, website embedding, conversation analytics, multiple chatbot themes, real-time chat, and easy setup process.',
        'Key features of Dot: AI-powered responses, customizable appearance, knowledge base integration, conversation history, analytics dashboard, and simple embed process.'
      ],
      'pricing': [
        'Dot offers flexible pricing plans based on usage and features. Contact us for custom pricing tailored to your business needs.',
        'Pricing varies based on the number of chatbots, conversations, and features you need. We offer competitive rates for businesses of all sizes.'
      ],
      'embed': [
        'To embed Dot on your website, you get a simple JavaScript snippet after creating your chatbot. Just paste this code into your website and the chatbot will appear.',
        'Embedding is easy: create your chatbot, copy the provided embed code, and paste it into your website HTML. The chatbot will automatically appear and start helping visitors.'
      ],
      'setup': [
        'Setting up Dot is simple: 1) Sign up for an account, 2) Create your first chatbot, 3) Add your business knowledge, 4) Customize the appearance, 5) Get your embed code and add it to your website.',
        'Getting started with Dot takes just a few minutes: create an account, build your chatbot with your business information, customize it, and embed it on your website.'
      ],
      'ai': [
        'Dot uses advanced AI technology to understand and respond to visitor questions. The AI is trained on your business knowledge to provide accurate and helpful responses.',
        'Our AI technology can understand natural language questions and provide intelligent responses based on your business information and knowledge base.'
      ],
      'chatbot': [
        'A Dot chatbot is an AI assistant that can answer questions about your business, products, or services. It helps engage website visitors and provide instant support.',
        'Dot chatbots are intelligent AI assistants that can handle customer inquiries, provide product information, and help with common questions 24/7.'
      ],
      'business': [
        'Dot helps businesses improve customer engagement, reduce support workload, and provide instant answers to common questions. It\'s perfect for e-commerce, service businesses, and any company with a website.',
        'Businesses use Dot to: increase customer engagement, provide 24/7 support, answer frequently asked questions, generate leads, and improve customer satisfaction.'
      ],
      'website': [
        'Dot can be embedded on any website using a simple JavaScript code. It works with all major website platforms and content management systems.',
        'You can add Dot to any website - whether it\'s built with WordPress, Shopify, custom code, or any other platform. Just paste the embed code and you\'re ready to go.'
      ],
      'help': [
        'Dot helps businesses by providing instant customer support, answering common questions, generating leads, and improving overall customer experience on their website.',
        'Dot helps by: reducing support ticket volume, providing instant answers to customers, improving website engagement, and helping convert visitors into customers.'
      ]
    };

    const queryLower = query.toLowerCase();
    const relevantChunks: string[] = [];

    // Find relevant knowledge based on keywords
    for (const [keywords, content] of Object.entries(demoKnowledge)) {
      if (keywords.includes(queryLower) || queryLower.includes(keywords)) {
        relevantChunks.push(...content);
      }
    }

    // If no specific match, return general information
    if (relevantChunks.length === 0) {
      relevantChunks.push(
        'Dot is a SaaS platform that allows businesses to create and embed AI chatbots on their websites. It provides intelligent conversations to help engage visitors and provide instant support.',
        'With Dot, you can create custom AI chatbots with your business knowledge, customize their appearance, and easily embed them on any website to improve customer engagement.'
      );
    }

    return relevantChunks.slice(0, 3); // Return top 3 most relevant chunks
  }

  // Original logic for other dots
  try {
    // First, try to generate embedding for the query
    let queryEmbedding = null;
    try {
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: query,
        encoding_format: 'float',
      });
      queryEmbedding = embeddingResponse.data[0].embedding;
    } catch (error) {
      console.log('OpenAI embedding failed for query, using text search:', error);
    }

    let chunks: any[] = [];

    if (queryEmbedding) {
      // Use vector similarity search
      const { data: vectorResults } = await supabase.rpc('similarity_search', {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: 5,
        dot_id: dotId
      });
      chunks = vectorResults || [];
    } else {
      // Fallback to text search
      const { data: textResults } = await supabase
        .from('knowledge_chunks')
        .select('content')
        .eq('dot_id', dotId)
        .ilike('content', `%${query}%`)
        .limit(5);
      chunks = textResults || [];
    }

    return chunks.map(chunk => chunk.content).filter(Boolean);
  } catch (error) {
    console.error('Knowledge base search error:', error);
    return [];
  }
}

async function generateResponse(
  message: string, 
  relevantChunks: string[], 
  history: Message[], 
  dot: any,
  dotId: string
): Promise<string> {
  try {
    // Prepare context from relevant chunks
    const context = relevantChunks.length > 0 
      ? `\n\nRelevant information:\n${relevantChunks.join('\n\n')}`
      : '';

    // Prepare conversation history
    const conversationHistory = history
      .slice(-6) // Last 6 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const prompt = `You are an AI assistant for ${dot.name || 'a business'}. 
    
${dotId === 'demo' ? `You are Dot, the AI assistant for the Dot SaaS platform. Dot is a platform that allows businesses to create and embed AI chatbots on their websites. You should explain how Dot works, its features, benefits, and how businesses can use it to improve their website engagement.` : dot.context ? `Business context: ${dot.context}\n` : ''}

${context}

${conversationHistory ? `Recent conversation:\n${conversationHistory}\n` : ''}

User: ${message}

Assistant:`;

    const response = await openai.chat.completions.create({
      model: dot.ai_model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful AI assistant for ${dot.name || 'this business'}. 
          Answer questions based on the provided information. 
          Be friendly, professional, and helpful. 
          If you don't know something, say so politely.
          Keep responses concise but informative.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: dot.temperature || 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Response generation error:', error);
    
    // Check if it's a quota/rate limit error
    if (error instanceof Error && error.message.includes('429')) {
      console.log('Using mock response due to OpenAI quota limit');
      return getMockResponse(message, dotId);
    }
    
    // Fallback response with available context
    if (relevantChunks.length > 0) {
      return `Based on the information I have: ${relevantChunks[0].substring(0, 200)}...`;
    }
    
    // Use mock response as final fallback
    return getMockResponse(message, dotId);
  }
}

async function storeConversation(dotId: string, userMessage: string, aiResponse: string) {
  try {
    const { error } = await supabase
      .from('conversations')
      .upsert({
        dot_id: dotId,
        user_ip: '127.0.0.1', // In production, get from request
        user_agent: 'Chatbot Widget',
        messages: [
          { role: 'user', content: userMessage, timestamp: new Date().toISOString() },
          { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() }
        ]
      });

    if (error) {
      console.error('Error storing conversation:', error);
    }
  } catch (error) {
    console.error('Error storing conversation:', error);
  }
}
