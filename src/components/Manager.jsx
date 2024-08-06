import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Убедитесь, что этот адрес соответствует вашему серверу

const Manager = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    socket.emit('manager');

    socket.on('userAssigned', (userId) => {
      setCurrentUser(userId);
    });

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('userAssigned');
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && currentUser) {
      socket.emit('message', { roomId: `room-${currentUser}`, message: `Manager: ${input}` });
      setInput('');
    }
  };

  return (
    <div>
      <div ref={chatRef} style={{ border: '1px solid #ccc', height: '400px', overflowY: 'auto', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          placeholder="Type your message here"
          disabled={!currentUser}
        />
      </form>
    </div>
  );
};

export default Manager;