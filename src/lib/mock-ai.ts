// Mock AI responses for testing when OpenAI is unavailable
export const mockAIResponses = {
  greetings: [
    "Hello! I'm here to help you with any questions about our services.",
    "Hi there! How can I assist you today?",
    "Welcome! I'm ready to help you find the information you need."
  ],
  
  services: [
    "We offer a comprehensive range of services including web development, AI solutions, and digital consulting. What specific area are you interested in?",
    "Our services include custom software development, AI integration, and digital transformation consulting. Would you like to know more about any particular service?",
    "We provide web development, AI solutions, and business consulting services. Which area would you like to explore?"
  ],
  
  pricing: [
    "Our pricing varies based on project scope and requirements. Would you like to schedule a consultation to discuss your specific needs?",
    "We offer competitive pricing tailored to each project. Let me know what you're looking for and I can provide more specific information.",
    "Pricing depends on the complexity and scope of your project. I'd be happy to connect you with our team for a detailed quote."
  ],
  
  contact: [
    "You can reach us at contact@company.com or call us at +1-555-0123. We're available Monday through Friday, 9 AM to 6 PM.",
    "Feel free to contact us via email at hello@company.com or give us a call at +1-555-0123. We'd love to hear from you!",
    "You can get in touch with us at info@company.com or call +1-555-0123. We're here to help!"
  ],
  
  default: [
    "That's an interesting question! Let me connect you with our team for more detailed information.",
    "I'd be happy to help with that. Could you provide a bit more context so I can give you the best possible answer?",
    "Great question! Let me gather some more information to provide you with a comprehensive response."
  ]
};

export function getMockResponse(userMessage: string, dotId?: string): string {
  // Special handling for demo dot
  if (dotId === 'demo') {
    const message = userMessage.toLowerCase();
    
    if (message.includes('what is dot') || message.includes('what is this') || message.includes('explain dot')) {
      return "Dot is a SaaS platform that allows businesses to create and embed AI chatbots on their websites. It provides intelligent conversations to help engage visitors and provide instant support. You can create custom chatbots with your business knowledge and easily embed them on any website.";
    }
    
    if (message.includes('how does') || message.includes('how to') || message.includes('setup') || message.includes('get started')) {
      return "Getting started with Dot is simple: 1) Sign up for an account, 2) Create your first chatbot, 3) Add your business knowledge, 4) Customize the appearance, 5) Get your embed code and add it to your website. The whole process takes just a few minutes!";
    }
    
    if (message.includes('features') || message.includes('what can') || message.includes('capabilities')) {
      return "Dot features include: Custom AI chatbots, knowledge base management, website embedding, conversation analytics, multiple chatbot themes, real-time chat, and easy setup process. You can customize everything from appearance to behavior.";
    }
    
    if (message.includes('pricing') || message.includes('cost') || message.includes('price')) {
      return "Dot offers flexible pricing plans based on usage and features. We have competitive rates for businesses of all sizes. Contact us for custom pricing tailored to your specific needs and requirements.";
    }
    
    if (message.includes('embed') || message.includes('website') || message.includes('add to site')) {
      return "To embed Dot on your website, you get a simple JavaScript snippet after creating your chatbot. Just paste this code into your website and the chatbot will appear. It works with all major platforms like WordPress, Shopify, and custom websites.";
    }
    
    if (message.includes('ai') || message.includes('artificial intelligence') || message.includes('technology')) {
      return "Dot uses advanced AI technology to understand and respond to visitor questions. The AI is trained on your business knowledge to provide accurate and helpful responses. It can handle natural language conversations and learn from interactions.";
    }
    
    if (message.includes('business') || message.includes('company') || message.includes('help')) {
      return "Dot helps businesses improve customer engagement, reduce support workload, and provide instant answers to common questions. It's perfect for e-commerce, service businesses, and any company with a website. You can increase conversions and customer satisfaction.";
    }
  }

  // Original logic for other dots
  const message = userMessage.toLowerCase();
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return mockAIResponses.greetings[Math.floor(Math.random() * mockAIResponses.greetings.length)];
  }
  
  if (message.includes('web development') || message.includes('website') || message.includes('web app') || message.includes('frontend') || message.includes('backend')) {
    return "We specialize in modern web development! We build responsive websites, web applications, and full-stack solutions using technologies like React, Next.js, Node.js, and more. Our web development services include custom UI/UX design, API development, database integration, and deployment. What type of web project do you have in mind?";
  }
  
  if (message.includes('ai') || message.includes('artificial intelligence') || message.includes('machine learning')) {
    return "Our AI solutions include custom AI model development, chatbot integration, data analysis, and AI-powered automation. We can help you implement AI features like natural language processing, computer vision, or predictive analytics. What AI capabilities are you looking to add to your business?";
  }
  
  if (message.includes('service') || message.includes('what do you do') || message.includes('offer')) {
    return mockAIResponses.services[Math.floor(Math.random() * mockAIResponses.services.length)];
  }
  
  if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
    return mockAIResponses.pricing[Math.floor(Math.random() * mockAIResponses.pricing.length)];
  }
  
  if (message.includes('contact') || message.includes('email') || message.includes('phone') || message.includes('reach')) {
    return mockAIResponses.contact[Math.floor(Math.random() * mockAIResponses.contact.length)];
  }
  
  // More specific responses for common questions
  if (message.includes('technology') || message.includes('tech stack') || message.includes('framework')) {
    return "We work with modern technologies including React, Next.js, Node.js, Python, TypeScript, and various cloud platforms. Our tech stack is chosen based on your specific project requirements and goals. What technologies are you interested in?";
  }
  
  if (message.includes('timeline') || message.includes('how long') || message.includes('duration')) {
    return "Project timelines vary depending on complexity. A simple website might take 2-4 weeks, while a complex web application could take 2-6 months. We'll provide a detailed timeline during our initial consultation. When are you looking to launch?";
  }
  
  if (message.includes('portfolio') || message.includes('examples') || message.includes('work')) {
    return "We'd be happy to show you examples of our work! We have case studies and portfolio pieces across web development, AI solutions, and digital consulting. Would you like to see specific examples in any particular area?";
  }
  
  return mockAIResponses.default[Math.floor(Math.random() * mockAIResponses.default.length)];
} 