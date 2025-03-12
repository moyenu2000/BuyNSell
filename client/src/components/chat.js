// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";

// const ChatComponent = () => {
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");


//   useEffect(() => {
//     const newSocket = io("http://localhost:8000"); // Connect to your server
//     setSocket(newSocket);

//     newSocket.on("receive_message", (message) => {
//       setMessages((prev) => [...prev, message]);
//     });


//     return () => newSocket.close();
//   }, [setSocket]);



//   const sendMessage = () => {
//     if (socket) {
//       socket.emit("send_message", input);
//       setMessages((prev) => [...prev, input]);
//       setInput("");
//     }
//   };



//   return (
//     <div>
//       <div>
//         {messages.map((message, idx) => (
//           <p key={idx}>{message}</p>
//         ))}
//       </div>
//       <div>
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type a message"
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default ChatComponent;


import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');

function Chat({ senderID, receiverID }) {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3001/chatHistory?senderID=${senderID}&receiverID=${receiverID}`)
            .then(res => res.json())
            .then(data => setMessages(data));

        socket.on('receive_message', data => {
            setMessages(prevMessages => [...prevMessages, data]);
        });
    }, [senderID, receiverID]);

    const sendMessage = () => {
        if (currentMessage) {
            const messageData = {
                senderID,
                receiverID,
                messageText: currentMessage
            };

            socket.emit('send_message', messageData);
            setCurrentMessage('');
        }
    };

    return (
        <div>
            <div>
                {messages.map((message, index) => (
                    <p key={index}>{message.messageText}</p>
                ))}
            </div>
            <input value={currentMessage} onChange={e => setCurrentMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default Chat;

