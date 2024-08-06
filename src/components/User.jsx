import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Убедитесь, что этот адрес соответствует вашему серверу

const User = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isAssigned, setIsAssigned] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    socket.emit('user');

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('noManagersAvailable', () => {
      alert('No managers are currently available. Please try again later.');
    });

    socket.on('userAssigned', () => {
      setIsAssigned(true);
    });

    return () => {
      socket.off('message');
      socket.off('noManagersAvailable');
      socket.off('userAssigned');
    };
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && isAssigned) {
      socket.emit('message', { roomId: `room-${socket.id}`, message: `User: ${input}` });
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
          disabled={!isAssigned}
        />
      </form>
    </div>
  );
};

export default User;