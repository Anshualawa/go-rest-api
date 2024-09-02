import React, { useState, useRef, useEffect } from 'react';

const MyChatGPT = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Handle input change
  const handleInputChange = (e) => setInput(e.target.value);

  // Handle form submit to send a message
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    setMessages(prev => [...prev, { sender: 'User', text: input }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const responseText = await response.text();
      let parsedContent;

      try {
        parsedContent = JSON.parse(responseText);
      } catch {
        parsedContent = 'Error parsing response.';
      }

      if (parsedContent?.AIResponse) {
        const aiResponseContent = parsedContent.AIResponse[0]?.Content?.Parts[0];
        try {
          parsedContent = JSON.parse(aiResponseContent);
        } catch {
          parsedContent = aiResponseContent;
        }
      }

      setMessages(prev => [...prev, { sender: 'AI', text: parsedContent }]);
    } catch {
      setMessages(prev => [...prev, { sender: 'AI', text: 'Error fetching response.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to the bottom of the chat container whenever messages change
  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  const renderMessageContent = (message) => {
    if (typeof message.text === 'string') {
      try {
        const jsonObject = JSON.parse(message.text);
        return renderObjectContent(jsonObject);
      } catch {
        return <p>{message.text}</p>;
      }
    }

    return renderObjectContent(message.text) || <p>{message.text}</p>;
  };

  const renderObjectContent = (obj) => {
    if (typeof obj !== 'object' || obj === null) return <p>{obj}</p>;

    return (
      <div>
        {Object.entries(obj).map(([key, value], index) => (
          <div key={index} className="text-sm mb-4">
            <h3 className="font-bold text-lg mb-2">{key}</h3>
            <div className="whitespace-pre-wrap">
              {Array.isArray(value) ? (
                <ul className="list-disc ml-5">
                  {value.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              ) : typeof value === 'object' ? (
                renderObjectContent(value)
              ) : (
                <p>{value}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="w-full mx-auto py-5 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="mx-auto w-4/5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full text-center md:max-w-2xl">
          <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
            Start Chatting with AI
          </h2>
        </div>

        {/* Chat Display */}
        <div
          ref={chatContainerRef}
          className="mt-8 w-full max-w-full bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4 overflow-y-auto h-96"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'User' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`${message.sender === 'User' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} rounded-lg p-3 max-w-xs`}
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
          className="mt-4 flex w-full space-x-2"
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
