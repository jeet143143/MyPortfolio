document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('chat-send-btn');
    const inputField = document.getElementById('chat-input-field');
    const messagesBox = document.getElementById('chatbot-messages');

    let isTyping = false;

    // Toggle logic
    toggleBtn.addEventListener('click', () => {
        chatbotWindow.classList.toggle('hidden');
        if(!chatbotWindow.classList.contains('hidden')) {
            gsap.fromTo(chatbotWindow, {y: 20, opacity: 0}, {y: 0, opacity: 1, duration: 0.3});
        }
    });

    closeBtn.addEventListener('click', () => {
        chatbotWindow.classList.add('hidden');
    });

    const addMessage = (text, type) => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message', type);
        msgDiv.innerText = text;
        messagesBox.appendChild(msgDiv);
        messagesBox.scrollTop = messagesBox.scrollHeight;
    };

    const handleSend = async () => {
        const text = inputField.value.trim();
        if (!text || isTyping) return;

        addMessage(text, 'user-message');
        inputField.value = '';
        isTyping = true;
        
        // Add typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('chat-message', 'ai-message');
        typingIndicator.innerText = "Typing...";
        messagesBox.appendChild(typingIndicator);
        messagesBox.scrollTop = messagesBox.scrollHeight;

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await res.json();
            
            messagesBox.removeChild(typingIndicator);
            
            if (data.success) {
                addMessage(data.reply, 'ai-message');
            } else {
                addMessage("System Error: AI disconnected.", 'ai-message');
            }
        } catch (error) {
            messagesBox.removeChild(typingIndicator);
            addMessage("Transmission failed. Please try again.", 'ai-message');
        } finally {
            isTyping = false;
        }
    };

    sendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
});
