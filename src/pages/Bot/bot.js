import React, { useState, useEffect, useRef } from 'react';
import { queryBot, getAllConversations, deleteConversation } from '../Bot/api';
import '../Bot/bot.css';
import logo from '../../image/koolboks.png';
import { MdOutlineDeleteForever } from "react-icons/md";
import { HiPaperAirplane } from "react-icons/hi2";
import { FiUpload, FiLoader } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";

function App() {
    const [userName] = useState('Uchenna Ikenna Nnamani');
    const [userEmail] = useState('nnamaniuchenna8@gmail.com');
    const [input, setInput] = useState('');
    const [botResponse, setBotResponse] = useState('');
    const [conversationId, setConversationId] = useState('');
    const [conversations, setConversations] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [generatingReply, setGeneratingReply] = useState(false);

    const chatRef = useRef(null);

  
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const result = await getAllConversations(userEmail);
                setConversations(Array.isArray(result.conversations) ? result.conversations : []);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
            setLoadingConversations(false);
        };
        fetchConversations();
    }, [userEmail]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [conversations]);

    // Reset conversation ID to start a new conversation
    const startNewChat = () => {
        setConversationId(''); 
        setInput('');
        setBotResponse('');
        setConversations([]);
    };

    // Function to handle user query
    const handleQuery = async () => {
        const queryText = input;

  
        setConversations(prev => [
            ...prev,
            { text: queryText, isUser: true }
        ]);

       
        setConversations(prev => [
            ...prev,
            { text: null, isUser: false, isGenerating: true }
        ]);

        setInput('');

        try {
           
            const result = await queryBot(queryText, userName, userEmail, conversationId);

            if (result.error) {
                setConversations(prev => [
                    ...prev.slice(0, -1),
                    { text: `Error: ${result.error}. Details: ${result.details}`, isUser: false }
                ]);
            } else {
             
                if (!conversationId) setConversationId(result.conversation_id);

                const botMessage = processBotReply(result.response || 'No response from the bot.');
                setConversations(prev => [
                    ...prev.slice(0, -1),
                    { text: botMessage, isUser: false }
                ]);
            }
        } catch (error) {
            console.error('Error querying the bot:', error);
            setConversations(prev => [
                ...prev.slice(0, -1),
                { text: 'Error querying the bot.', isUser: false}
            ]);
        }
    };

 
    const processBotReply = (response) => {

        if (Array.isArray(response)) {
            let [mainMessage, author, documentName, documentUrl] = response;

            let formattedMainMessage = mainMessage.replace(/\n/g, '<br>')
                .replace(/(\d+)\. /g, '<div class="numbered-item"><strong>$1.</strong> ')
                .replace(/- /g, '<div class="bullet-item">&#8226; ')
                .replace(/<\/div>(?!<div)/g, '</div><br>');

            let additionalInfo = `<div><strong>Document:</strong> ${documentName}</div>`;

            return `${formattedMainMessage}<br>${additionalInfo}`;
        }

        if (typeof response === 'string') {
            let formattedResponse = response.replace(/\n/g, '<br>')
                .replace(/(\d+)\. /g, '<div class="numbered-item"><strong>$1.</strong> ')
                .replace(/- /g, '<div class="bullet-item">&#8226; ')
                .replace(/<\/div>(?!<div)/g, '</div><br>');

            return formattedResponse;
        }

        return 'Invalid response from the bot. Please try again later.';
    };

    return (
        <div className="container">
            <nav className="navbars">
                <img src={logo} alt="Company Logo" />
                <div className='greeting'>Service Desk</div>
                <div className="greeting">Hello, {userName}</div>
            </nav>

            <div className="content-wrapper">
                <aside className="sidebar">
                    <div className="conversation-list">
                        <h2>Conversation History</h2>
                       
                            <button className="new-chat-btn" onClick={startNewChat}>
                                <IoMdArrowRoundBack />
                            </button>
                        
                        {/* <Link to="/user">
                            <button className="new-chat-btn" onClick={startNewChat}>
                                <IoMdArrowRoundBack />
                            </button>
                        </Link> */}
                        {loadingConversations ? (
                            <p>Loading conversations...</p>
                        ) : (
                            <ul>
                                {conversations.length === 0 ? (
                                    <p>No conversations found. Try starting a new chat.</p>
                                ) : (
                                    conversations.map((conv, index) => (
                                        <li key={index}>
                                            <strong>{conv.subject || 'No subject available'}</strong>
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}
                    </div>
                </aside>
                <div className="chat-section" ref={chatRef}>
                    {conversations
                        .filter(conv => conv.text || conv.isGenerating)
                        .map((conv, index) => (
                            <div
                                key={index}
                                className={`message ${conv.isUser ? 'user-message' : 'bot-message'}`}
                            >
                                {conv.isGenerating ? (
                                    <>
                                        <span>Generating reply</span>
                                        <FiLoader className="spinner-icon" />
                                    </>
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: conv.text }} />
                                )}
                            </div>
                        ))}
                </div>

                <div className="chat-inputs-containers">
                    <textarea
                        className="chats-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message"
                    />
                    <button className="send-btn" onClick={handleQuery} disabled={generatingReply}>
                        {generatingReply ? <FiLoader className="spinner-icon" /> : <HiPaperAirplane />}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
