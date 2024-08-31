import { useState } from 'react';

const MyChatGPT = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
    setInput(''); // Clear input field
    setLoading(true); // Set loading to true while fetching response

    try {
      const response = await fetch('http://localhost:8080/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      // Log the response to inspect its structure
      console.log('AI Response:', data);

      // Add AI response to the chat, displaying unknown fields dynamically
      setMessages((prev) => [
        ...prev,
        { sender: 'AI', text: data }, // Store the entire response for rendering
      ]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'AI', text: 'Error fetching response.' },
      ]);
    }

    setLoading(false); // Set loading to false after the response is received
  };

  // Function to render message content dynamically
  const renderMessageContent = (message) => {
    if (typeof message.text === 'object') {
      // Handle case where message text is an object (unknown structure)
      return (
        <div className="text-left">
          {Object.entries(message.text).map(([key, value], index) => (
            <p key={index} className="text-sm">
              <strong>{key}:</strong> {JSON.stringify(value)}
            </p>
          ))}
        </div>
      );
    }
    // Handle case where message text is a simple string
    return <p>{message.text}</p>;
  };

  return (
    <section className="w-full mx-auto py-10 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="mx-auto w-4/5 px-4 sm:px-6 lg:px-8">
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
              className={`flex ${message.sender === 'User' ? 'justify-end' : 'justify-start'
                }`}
            >
              <div
                className={`${message.sender === 'User'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-black'
                  } rounded-lg p-3 max-w-xs`}
              >
                {renderMessageContent(message)}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-center">
              <p className="text-gray-500">AI is thinking...</p>
            </div>
          )}
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
            disabled={loading}
          />
          <button
            type="submit"
            className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus:outline-none"
            disabled={loading}
          >
            {loading ? 'Waiting...' : 'Send'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default MyChatGPT;
