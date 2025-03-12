import React from 'react';

const Messages = ({ messages, room }) => {
    return (
        <div className="messages">
            <div id="list">
                <ul>
                    {messages.filter(message => message.room === room).map((message, index) => (
                        <li key={index}>
                            {message.url ? (
                                <div>
                                    <div className="msg">
                                        <h4>{message.from}</h4>
                                        <div className="body">
                                            <a href={message.url} rel="noopener noreferrer" target="_blank">My current location</a>
                                        </div>
                                    </div>
                                    <span className="createdDate">{message.createdDate}</span>
                                </div>
                            ) : (
                                <div>
                                    <div className="msg">
                                        <h4>{message.from}</h4>
                                        <div className="body">
                                            <p>{message.text}</p>
                                        </div>
                                    </div>
                                    <span className="createdDate">{message.createdDate}</span>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Messages;
