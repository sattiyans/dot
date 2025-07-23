import { BusinessInfo } from './ai-content-analyzer';

export class MockAnalyzer {
  async analyzeWebsite(url: string, customInstructions?: string): Promise<BusinessInfo> {
    console.log(`Using mock analyzer for: ${url}`);
    
    // Extract domain for better mock data
    const domain = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    return {
      company: {
        name: domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1) + ' Solutions',
        description: `A professional company providing digital solutions and services. ${customInstructions ? 'Custom focus: ' + customInstructions : ''}`,
        industry: 'Technology',
        website: url
      },
      products: [
        {
          name: 'Digital Platform',
          description: 'Comprehensive digital solution for businesses',
          features: ['User-friendly interface', 'Scalable architecture', '24/7 support'],
          pricing: 'Contact for pricing'
        }
      ],
      services: [
        {
          name: 'Web Development',
          description: 'Custom website and web application development',
          benefits: ['Responsive design', 'SEO optimized', 'Fast loading']
        },
        {
          name: 'Digital Consulting',
          description: 'Strategic digital transformation consulting',
          benefits: ['Expert guidance', 'Custom solutions', 'Ongoing support']
        }
      ],
      contact: {
        email: 'contact@' + domain,
        phone: '+1 (555) 123-4567',
        address: '123 Business Street, Tech City, TC 12345',
        social: ['LinkedIn', 'Twitter', 'Facebook']
      },
      faq: [
        {
          question: 'What services do you offer?',
          answer: 'We offer comprehensive digital solutions including web development, consulting, and ongoing support.'
        },
        {
          question: 'How can I get started?',
          answer: 'Contact us through our website or email to discuss your project requirements and get a custom quote.'
        },
        {
          question: 'Do you provide ongoing support?',
          answer: 'Yes, we provide 24/7 support and maintenance services for all our clients.'
        }
      ],
      keyFeatures: [
        'Professional expertise',
        'Custom solutions',
        'Ongoing support',
        'Modern technology stack'
      ],
      targetAudience: 'Businesses looking for digital transformation and web development services'
    };
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