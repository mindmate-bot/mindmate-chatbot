const chatBox = document.getElementById('chat-box');
const form = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  addMessage('user', userMessage);
  userInput.value = '';

  addMessage('bot', 'Typing...');

  const response = await getBotReply(userMessage);

  // Remove 'Typing...'
  chatBox.removeChild(chatBox.lastChild);

  addMessage('bot', response);
});

function addMessage(sender, text) {
  const message = document.createElement('div');
  message.className = sender === 'user' ? 'user-message' : 'bot-message';
  message.textContent = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 🧠 AI Bot Response (uses Hugging Face API)
async function getBotReply(userMessage) {
  try {
    const res = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_HUGGINGFACE_API_KEY",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: { text: userMessage } }),
    });

    const data = await res.json();
    return data.generated_text || "I'm not sure how to respond, but I'm here for you. 💚";
  } catch (err) {
    console.error(err);
    return "Oops! Something went wrong. Try again later.";
  }
}
