import ChatbotWidget from '@/components/ChatbotWidget';

export default function LandingPage() {
  return (
    <div className="h-screen bg-black text-white relative overflow-hidden">
      {/* Enhanced Background UI */}
      <div className="absolute inset-0 opacity-25">
        {/* Ambient glow effects - static */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white rounded-full opacity-5 blur-3xl"></div>
        
        {/* Random single dots */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full opacity-40 animate-float"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full opacity-35 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-1 h-1 bg-white rounded-full opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-white rounded-full opacity-45 animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full opacity-25 animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-white rounded-full opacity-40 animate-float" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-white rounded-full opacity-35 animate-float" style={{ animationDelay: '0.8s' }}></div>
        <div className="absolute top-1/4 right-1/2 w-1 h-1 bg-white rounded-full opacity-30 animate-float" style={{ animationDelay: '1.8s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-white rounded-full opacity-40 animate-float" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white rounded-full opacity-25 animate-float" style={{ animationDelay: '3s' }}></div>
        
        {/* Enhanced grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Center - Dot Text */}
        <div className="flex justify-center pt-8">
          <h1 className="text-4xl font-extrabold tracking-wider" style={{ 
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            background: 'linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Dot
          </h1>
        </div>

        {/* Center of Page - Enhanced Typing Animation */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-16">
          <div className="relative">
            {/* Glowing background circle */}
            <div className="absolute inset-0 w-24 h-24 bg-white rounded-full opacity-10 blur-xl animate-pulse"></div>
            
            {/* Main typing animation container */}
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              {/* Enhanced typing dots - properly centered */}
              <div className="flex justify-center space-x-3 items-center">
                <div className="w-4 h-4 bg-white rounded-full animate-typing shadow-lg"></div>
                <div className="w-4 h-4 bg-white rounded-full animate-typing shadow-lg" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-4 h-4 bg-white rounded-full animate-typing shadow-lg" style={{ animationDelay: '0.4s' }}></div>
              </div>
              
              {/* Enhanced context about Dot */}
              <div className="text-center mt-4 space-y-2">
                <p className="text-sm text-white/80 font-medium tracking-wide">Your AI Chatbot</p>
                <p className="text-xs text-white/50 leading-relaxed max-w-xs">
                  Embed intelligent conversations<br/>
                  on any website instantly
                </p>
              </div>
            </div>
            
            {/* Orbiting particles around the typing animation */}
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-white rounded-full opacity-60 animate-float" style={{ animationDelay: '0s' }}></div>
            <div className="absolute -top-2 -right-2 w-2 h-2 bg-white rounded-full opacity-60 animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-white rounded-full opacity-60 animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-white rounded-full opacity-60 animate-float" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
      </div>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}
