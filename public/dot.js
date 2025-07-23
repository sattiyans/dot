// Dot AI Assistant Widget
(function () {
  if (window.DOT_CHATBOT_WIDGET_LOADED) return;
  window.DOT_CHATBOT_WIDGET_LOADED = true;

  // Configuration with defaults
  const config = window.DOT_CHATBOT || {};
  const dotId = config.dotId;
  const theme = config.theme || 'dark';
  const position = config.position || 'bottom-center';
  const welcomeMessage = config.welcomeMessage || 'Hi! I\'m your AI assistant. How can I help you today?';

  if (!dotId) {
    console.warn('Dot: dotId is required in DOT_CHATBOT configuration');
    return;
  }

  // Position mapping
  const positions = {
    'bottom-center': { left: '50%', bottom: '16px', transform: 'translateX(-50%)' },
    'bottom-right': { right: '16px', bottom: '16px' },
    'bottom-left': { left: '16px', bottom: '16px' },
    'top-center': { left: '50%', top: '16px', transform: 'translateX(-50%)' },
    'top-right': { right: '16px', top: '16px' },
    'top-left': { left: '16px', top: '16px' }
  };

  const pos = positions[position] || positions['bottom-center'];

  // Theme colors
  const themes = {
    dark: {
      dot: { bg: '#ffffff', color: '#000000', shadow: '0 4px 24px rgba(0,0,0,0.3)' },
      chat: { bg: '#ffffff', color: '#000000', border: '#e5e5e5' }
    },
    light: {
      dot: { bg: '#000000', color: '#ffffff', shadow: '0 4px 24px rgba(0,0,0,0.2)' },
      chat: { bg: '#000000', color: '#ffffff', border: '#333333' }
    }
  };

  const themeColors = themes[theme] || themes.dark;

  // Create main container
  const container = document.createElement('div');
  container.id = 'dot-chatbot-container';
  Object.assign(container.style, {
    position: 'fixed',
    ...pos,
    zIndex: '999999',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  });

  // Create the dot
  const dot = document.createElement('div');
  dot.id = 'dot-chatbot-dot';
  Object.assign(dot.style, {
    width: '40px',
    height: '40px',
    background: themeColors.dot.bg,
    color: themeColors.dot.color,
    borderRadius: '50%',
    boxShadow: themeColors.dot.shadow,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    outline: 'none'
  });

  // Animated dot content with pulse rings (matching ChatbotWidget)
  dot.innerHTML = `
    <div class="flex items-center justify-center w-full h-full relative">
      <div class="absolute inset-0 rounded-full bg-white animate-ping opacity-20"></div>
      <div class="absolute inset-1 rounded-full bg-white animate-ping opacity-30" style="animation-delay: 0.5s;"></div>
      <div class="absolute inset-2 rounded-full bg-white animate-ping opacity-40" style="animation-delay: 1s;"></div>
      <div class="relative w-5 h-5 bg-white rounded-full shadow-inner"></div>
    </div>
  `;

  // Create suggestions container
  const suggestionsContainer = document.createElement('div');
  suggestionsContainer.id = 'dot-suggestions';
  Object.assign(suggestionsContainer.style, {
    marginBottom: '12px',
    display: 'none',
    justifyContent: 'center'
  });

  // Create message history container
  const messagesContainer = document.createElement('div');
  messagesContainer.id = 'dot-messages';
  Object.assign(messagesContainer.style, {
    marginBottom: '12px',
    maxWidth: '320px',
    marginLeft: 'auto',
    marginRight: 'auto',
    position: 'relative',
    display: 'none'
  });

  // Create fade background for messages
  const messagesFade = document.createElement('div');
  Object.assign(messagesFade.style, {
    position: 'absolute',
    inset: '0',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    backdropFilter: 'blur(4px)'
  });

  // Create scrollable messages area
  const messagesArea = document.createElement('div');
  Object.assign(messagesArea.style, {
    position: 'relative',
    maxHeight: '320px',
    overflowY: 'auto',
    borderRadius: '8px'
  });

  const messagesContent = document.createElement('div');
  Object.assign(messagesContent.style, {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  });

  messagesArea.appendChild(messagesContent);
  messagesContainer.appendChild(messagesFade);
  messagesContainer.appendChild(messagesArea);

  // Create main widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'dot-widget';
  Object.assign(widgetContainer.style, {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  });

  // Create expandable input container
  const inputContainer = document.createElement('div');
  inputContainer.id = 'dot-input-container';
  Object.assign(inputContainer.style, {
    width: '40px',
    height: '40px',
    background: themeColors.dot.bg,
    color: themeColors.dot.color,
    borderRadius: '50%',
    boxShadow: themeColors.dot.shadow,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.5s ease-in-out',
    overflow: 'hidden'
  });

  // Create input area (hidden initially)
  const inputArea = document.createElement('div');
  Object.assign(inputArea.style, {
    display: 'none',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '8px 16px'
  });

  const input = document.createElement('input');
  Object.assign(input.style, {
    flex: '1',
    background: 'transparent',
    color: themeColors.dot.color,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    placeholder: 'Type a message...'
  });
  input.placeholder = 'Type a message...';

  const sendBtn = document.createElement('button');
  Object.assign(sendBtn.style, {
    background: themeColors.dot.color,
    color: themeColors.dot.bg,
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    fontSize: '12px'
  });
  sendBtn.innerHTML = '→';

  const closeBtn = document.createElement('button');
  Object.assign(closeBtn.style, {
    background: 'none',
    border: 'none',
    color: themeColors.dot.color,
    cursor: 'pointer',
    fontSize: '16px',
    opacity: '0.5',
    transition: 'opacity 0.2s'
  });
  closeBtn.innerHTML = '×';

  inputArea.appendChild(input);
  inputArea.appendChild(sendBtn);
  inputArea.appendChild(closeBtn);

  inputContainer.appendChild(inputArea);

  // Assemble widget
  widgetContainer.appendChild(inputContainer);

  // Assemble main container
  container.appendChild(suggestionsContainer);
  container.appendChild(messagesContainer);
  container.appendChild(widgetContainer);

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes dot-ping {
      0%, 100% { transform: scale(1); opacity: 0.2; }
      50% { transform: scale(1.1); opacity: 0.4; }
    }
    .animate-ping {
      animation: dot-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    #dot-chatbot-dot:hover {
      transform: ${pos.transform || 'none'} scale(1.1);
    }
    #dot-input-container.expanded {
      width: 320px;
      max-width: 90vw;
      border-radius: 50px;
    }
    #dot-input-container.expanded #dot-input-area {
      display: flex !important;
    }
    #dot-input-container.expanded #dot-dot-content {
      display: none !important;
    }
  `;
  document.head.appendChild(style);

  // State management
  let isExpanded = false;
  let messages = [];
  let isLoading = false;

  // Add message to chat
  const addMessage = (text, isUser = false) => {
    const message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    };
    messages.push(message);
    renderMessages();
  };

  // Render messages
  const renderMessages = () => {
    messagesContent.innerHTML = '';
    
    messages.forEach(message => {
      const messageDiv = document.createElement('div');
      Object.assign(messageDiv.style, {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        flexDirection: message.isUser ? 'row-reverse' : 'row'
      });

      // Avatar for AI messages
      if (!message.isUser) {
        const avatar = document.createElement('div');
        Object.assign(avatar.style, {
          flexShrink: '0',
          width: '24px',
          height: '24px',
          background: themeColors.dot.bg,
          borderRadius: '50%',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        });
        avatar.innerHTML = '<div style="width: 12px; height: 12px; background: white; border-radius: 50%; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);"></div>';
        messageDiv.appendChild(avatar);
      }

      // Message bubble
      const bubble = document.createElement('div');
      Object.assign(bubble.style, {
        fontSize: '12px',
        padding: '12px',
        borderRadius: '8px',
        maxWidth: '70%',
        background: message.isUser ? themeColors.dot.bg : '#f3f4f6',
        color: message.isUser ? themeColors.dot.color : '#000000',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      });

      const text = document.createElement('p');
      text.style.wordBreak = 'break-words';
      text.textContent = message.text;
      bubble.appendChild(text);

      const time = document.createElement('p');
      Object.assign(time.style, {
        fontSize: '10px',
        opacity: '0.5',
        marginTop: '4px'
      });
      time.textContent = message.timestamp.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      bubble.appendChild(time);

      messageDiv.appendChild(bubble);
      messagesContent.appendChild(messageDiv);
    });

    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
  };

  // Show loading indicator
  const showLoading = () => {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'dot-loading';
    Object.assign(loadingDiv.style, {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px'
    });

    const avatar = document.createElement('div');
    Object.assign(avatar.style, {
      flexShrink: '0',
      width: '24px',
      height: '24px',
      background: themeColors.dot.bg,
      borderRadius: '50%',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    });
    avatar.innerHTML = '<div style="width: 12px; height: 12px; background: white; border-radius: 50%; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);"></div>';

    const loadingBubble = document.createElement('div');
    Object.assign(loadingBubble.style, {
      background: '#f3f4f6',
      padding: '12px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    });

    const dots = document.createElement('div');
    Object.assign(dots.style, {
      display: 'flex',
      gap: '4px'
    });

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      Object.assign(dot.style, {
        width: '6px',
        height: '6px',
        background: '#000000',
        borderRadius: '50%',
        animation: 'dot-bounce 1.4s ease-in-out infinite',
        animationDelay: `${i * 0.1}s`
      });
      dots.appendChild(dot);
    }

    loadingBubble.appendChild(dots);
    loadingDiv.appendChild(avatar);
    loadingDiv.appendChild(loadingBubble);
    messagesContent.appendChild(loadingDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  };

  // Hide loading indicator
  const hideLoading = () => {
    const loading = document.getElementById('dot-loading');
    if (loading) {
      loading.remove();
    }
  };

  // Send message
  const sendMessage = async () => {
    const message = input.value.trim();
    if (!message || isLoading) return;

    addMessage(message, true);
    input.value = '';
    isLoading = true;
    showLoading();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          dotId,
          conversationId: null
        })
      });

      hideLoading();

      if (response.ok) {
        const data = await response.json();
        addMessage(data.response || 'I\'m here to help! How can I assist you today?', false);
      } else {
        addMessage('Sorry, I\'m having trouble connecting right now. Please try again later.', false);
      }
    } catch (error) {
      console.error('Chat error:', error);
      hideLoading();
      addMessage('Sorry, I\'m having trouble connecting right now. Please try again later.', false);
    } finally {
      isLoading = false;
      input.focus();
    }
  };

  // Event handlers
  dot.addEventListener('click', () => {
    if (!isExpanded) {
      isExpanded = true;
      inputContainer.classList.add('expanded');
      inputContainer.style.width = '320px';
      inputContainer.style.maxWidth = '90vw';
      inputContainer.style.borderRadius = '50px';
      inputArea.style.display = 'flex';
      input.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    isExpanded = false;
    inputContainer.classList.remove('expanded');
    inputContainer.style.width = '40px';
    inputContainer.style.borderRadius = '50%';
    inputArea.style.display = 'none';
    input.value = '';
  });

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isExpanded) {
      closeBtn.click();
    }
  });

  // Show/hide messages based on state
  const updateVisibility = () => {
    if (messages.length > 0) {
      messagesContainer.style.display = 'block';
    } else {
      messagesContainer.style.display = 'none';
    }
  };

  // Add to page
  document.body.appendChild(container);

  // Add bounce animation
  const bounceStyle = document.createElement('style');
  bounceStyle.textContent = `
    @keyframes dot-bounce {
      0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(bounceStyle);
})();
