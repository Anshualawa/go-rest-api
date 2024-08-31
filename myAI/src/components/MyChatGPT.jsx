import { useState } from 'react';

const MyChatGPT = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Handle input change
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Handle form submit to send a message
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (input.trim() === '') return;

    // Add the user message to the chat
    setMessages((prev) => [...prev, { sender: 'User', text: input }]);
    
    try {
      const response = await fetch('http://localhost:8080/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();

      // Add AI response to the chat
      setMessages((prev) => [...prev, { sender: 'AI', text: data.response }]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages((prev) => [...prev, { sender: 'AI', text: 'Error fetching response.' }]);
    }

    // Clear input
    setInput('');
  };

  return (
    <section className="py-10 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full text-center md:max-w-2xl">
          <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
            Start Chatting with AI
          </h2>
        </div>

        {/* Chat Display */}
        <div className="mt-8 w-full max-w-2xl bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4 overflow-y-auto h-96">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === 'User' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`${
                  message.sender === 'User' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                } rounded-lg p-3 max-w-xs`}
              >
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleFormSubmit}
          className="mt-4 flex w-full max-w-2xl space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
          />
          <button
            type="submit"
            className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus:outline-none"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default MyChatGPT;
