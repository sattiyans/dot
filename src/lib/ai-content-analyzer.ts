import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface BusinessInfo {
  company: {
    name: string;
    description: string;
    industry: string;
    website: string;
  };
  products: Array<{
    name: string;
    description: string;
    features: string[];
    pricing?: string;
  }>;
  services: Array<{
    name: string;
    description: string;
    benefits: string[];
  }>;
  contact: {
    email?: string;
    phone?: string;
    address?: string;
    social?: string[];
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
  keyFeatures: string[];
  targetAudience: string;
}

export class AIContentAnalyzer {
  private openai: OpenAI;

  constructor() {
    this.openai = openai;
  }

  async analyzeWebsite(url: string, customInstructions?: string): Promise<BusinessInfo> {
    try {
      console.log(`Analyzing website with AI: ${url}`);
      
      const basePrompt = `
        Analyze this website: ${url}
        
        Visit the website and extract comprehensive business information. Structure your response as a JSON object with the following format:
        
        {
          "company": {
            "name": "Company name",
            "description": "What the company does",
            "industry": "Industry/sector",
            "website": "${url}"
          },
          "products": [
            {
              "name": "Product name",
              "description": "Product description",
              "features": ["feature1", "feature2"],
              "pricing": "Pricing info if available"
            }
          ],
          "services": [
            {
              "name": "Service name", 
              "description": "Service description",
              "benefits": ["benefit1", "benefit2"]
            }
          ],
          "contact": {
            "email": "contact email",
            "phone": "phone number",
            "address": "address if available",
            "social": ["social media links"]
          },
          "faq": [
            {
              "question": "Common question",
              "answer": "Detailed answer"
            }
          ],
          "keyFeatures": ["key feature 1", "key feature 2"],
          "targetAudience": "Who this business targets"
        }
        
        Focus on:
        - What the business actually does
        - Products/services they offer
        - Key benefits and features
        - Information customers would typically ask about
        - Contact and business details
        
        Be comprehensive but accurate. If information is not available, use null or empty arrays.
      `;

      const customPrompt = customInstructions ? `
        
        Additional Instructions: ${customInstructions}
        
        Please follow these specific instructions when analyzing the website.
      ` : '';

      const prompt = basePrompt + customPrompt;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Free tier compatible model
        messages: [
          {
            role: "system",
            content: "You are a business analyst. Analyze websites and extract structured business information. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 3000 // Reduced for free tier
      });

      const content = response.choices[0].message.content;
      console.log(`AI analysis completed for ${url}`);
      
      if (!content) {
        throw new Error('No response content received from AI');
      }
      
      const businessInfo: BusinessInfo = JSON.parse(content);
      return businessInfo;
    } catch (error) {
      console.error(`Error analyzing website ${url}:`, error);
      
      // Handle specific OpenAI errors
      if (error instanceof Error) {
        if (error.message.includes('429') || error.message.includes('quota')) {
          throw new Error('OpenAI quota exceeded. Please check your billing or try again later.');
        }
        if (error.message.includes('401') || error.message.includes('invalid_api_key')) {
          throw new Error('Invalid OpenAI API key. Please check your configuration.');
        }
        if (error.message.includes('model_not_found')) {
          throw new Error('AI model not available. Please check your OpenAI plan.');
        }
      }
      
      throw new Error(`Failed to analyze website: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateKnowledgeChunks(businessInfo: BusinessInfo): Promise<string[]> {
    const chunks: string[] = [];
    
    // Company information chunk
    if (businessInfo.company) {
      const companyChunk = `Company: ${businessInfo.company.name}
Description: ${businessInfo.company.description}
Industry: ${businessInfo.company.industry}
Website: ${businessInfo.company.website}`;
      chunks.push(companyChunk);
    }
    
    // Products chunks
    if (businessInfo.products && businessInfo.products.length > 0) {
      businessInfo.products.forEach(product => {
        const productChunk = `Product: ${product.name}
Description: ${product.description}
Features: ${product.features?.join(', ') || 'Not specified'}
Pricing: ${product.pricing || 'Contact for pricing'}`;
        chunks.push(productChunk);
      });
    }
    
    // Services chunks
    if (businessInfo.services && businessInfo.services.length > 0) {
      businessInfo.services.forEach(service => {
        const serviceChunk = `Service: ${service.name}
Description: ${service.description}
Benefits: ${service.benefits?.join(', ') || 'Not specified'}`;
        chunks.push(serviceChunk);
      });
    }
    
    // Contact information chunk
    if (businessInfo.contact) {
      const contactChunk = `Contact Information:
Email: ${businessInfo.contact.email || 'Not available'}
Phone: ${businessInfo.contact.phone || 'Not available'}
Address: ${businessInfo.contact.address || 'Not available'}
Social Media: ${businessInfo.contact.social?.join(', ') || 'Not available'}`;
      chunks.push(contactChunk);
    }
    
    // FAQ chunks
    if (businessInfo.faq && businessInfo.faq.length > 0) {
      businessInfo.faq.forEach(faq => {
        const faqChunk = `Q: ${faq.question}
A: ${faq.answer}`;
        chunks.push(faqChunk);
      });
    }
    
    // Key features chunk
    if (businessInfo.keyFeatures && businessInfo.keyFeatures.length > 0) {
      const featuresChunk = `Key Features: ${businessInfo.keyFeatures.join(', ')}`;
      chunks.push(featuresChunk);
    }
    
    // Target audience chunk
    if (businessInfo.targetAudience) {
      const audienceChunk = `Target Audience: ${businessInfo.targetAudience}`;
      chunks.push(audienceChunk);
    }
    
    return chunks.filter(chunk => chunk.length > 10);
  }
}

// Utility function for quick analysis
export async function analyzeWebsite(url: string, customInstructions?: string): Promise<BusinessInfo> {
  const analyzer = new AIContentAnalyzer();
  return await analyzer.analyzeWebsite(url, customInstructions);
}

// Utility function to generate knowledge chunks
export async function generateKnowledgeFromWebsite(url: string, customInstructions?: string): Promise<string[]> {
  const analyzer = new AIContentAnalyzer();
  const businessInfo = await analyzer.analyzeWebsite(url, customInstructions);
    return await analyzer.generateKnowledgeChunks(businessInfo);
} 