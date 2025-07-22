// public/dot.js
(function () {
  if (window.DOT_CHATBOT_WIDGET_LOADED) return;
  window.DOT_CHATBOT_WIDGET_LOADED = true;

  // Read config
  const config = window.DOT_CHATBOT || {};
  const dot = document.createElement('div');
  dot.id = 'dot-chatbot-dot';
  dot.style.position = 'fixed';
  dot.style.left = '50%';
  dot.style.bottom = '32px';
  dot.style.transform = 'translateX(-50%)';
  dot.style.width = '48px';
  dot.style.height = '48px';
  dot.style.background = '#ffffff';
  dot.style.color = '#000000';
  dot.style.borderRadius = '50%';
  dot.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)';
  dot.style.display = 'flex';
  dot.style.alignItems = 'center';
  dot.style.justifyContent = 'center';
  dot.style.cursor = 'pointer';
  dot.style.zIndex = 9999;
  dot.style.transition = 'box-shadow 0.2s';
  dot.innerHTML = '<span style="font-size:2rem;font-weight:bold;">•</span>';

  // TODO: Add animation

  // Chat box
  const chatBox = document.createElement('div');
  chatBox.id = 'dot-chatbot-box';
  chatBox.style.position = 'fixed';
  chatBox.style.left = '50%';
  chatBox.style.bottom = '88px';
  chatBox.style.transform = 'translateX(-50%)';
  chatBox.style.minWidth = '320px';
  chatBox.style.maxWidth = '90vw';
  chatBox.style.background = '#18181b';
  chatBox.style.borderRadius = '24px';
  chatBox.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
  chatBox.style.padding = '16px';
  chatBox.style.display = 'none';
  chatBox.style.flexDirection = 'column';
  chatBox.style.zIndex = 9999;

  // TODO: Add chat history, input, and send logic
  chatBox.innerHTML = '<div style="color:white;text-align:center;margin-bottom:8px;">'+(config.welcomeMessage||'Ask me anything!')+'</div>'+
    '<input id="dot-chatbot-input" style="width:100%;padding:8px;border-radius:8px;border:none;outline:none;" placeholder="Type your question..." />'+
    '<button id="dot-chatbot-send" style="margin-top:8px;width:100%;padding:8px;border-radius:8px;background:#ffffff;color:#000000;border:none;">Send</button>';

  dot.addEventListener('click', function () {
    chatBox.style.display = chatBox.style.display === 'none' ? 'flex' : 'none';
  });

  document.body.appendChild(dot);
  document.body.appendChild(chatBox);

  // TODO: Add chat send logic, API call, and message display
})();
