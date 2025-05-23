export const sendMessageToJason = async (message, context) => {
    // Mocked responses based on context and message
    const responses = {
      greeting: "Hi there! I'm Jason, your shopping assistant. How can I help?",
      products: "Based on your preferences, here are some products you might like...",
      tracking: "Let me check your order status...",
      default: "I'm still learning! Can you ask me something else?"
    };
  
    return new Promise(resolve => {
      setTimeout(() => {
        // Determine response key based on message content
        const key = message.toLowerCase().includes('hello') ? 'greeting' :
                   message.toLowerCase().includes('product') ? 'products' :
                   message.toLowerCase().includes('order') ? 'tracking' : 'default';
  
        // Utilize context for personalized responses
        const personalizedMessage = context?.userName
          ? `Hi ${context.userName}, ${responses[key]}`
          : responses[key];
  
        resolve({ text: personalizedMessage });
      }, 1000);
    });
  };
  