import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { FaRegCheckCircle } from 'react-icons/fa';

const Message = ({ message, currentfriend, scrollRef, typingMessage }) => {
    const { myInfo } = useSelector(state => state.auth);
    return (
        <>
            <div className='message-show'>
                {
                    message && message.length > 0 ? message.map((m, index) =>
                        m.senderId === myInfo.id ? <div ref={scrollRef} className='my-message'>
                            <div className='image-message'>
                                <div className='my-text'>
                                    <p className='message-text'> {m.message.text === '' ? <img src={`./images/${m.message.image}`} /> : m.message.text} </p>
                                    {
                                        index === message.length - 1 && m.senderId === myInfo.id ? m.status === 'seen' ? <img className='img' src={`./images/${currentfriend.image}`} alt='' /> : m.status === 'delivared' ? <span> <FaRegCheckCircle /> </span> : <span> <FaRegCheckCircle /> </span> : ''
                                    }
                                </div>
                            </div>
                            <div className='time'>
                                {moment(m.createdAt).startOf('mini').fromNow()}
                            </div>
                        </div> : <div ref={scrollRef} className='fd-message'>
                            <div className='image-message-time'>
                                <img src={`./images/${currentfriend.image}`} alt='' />
                                <div className='message-time'>
                                    <div className='fd-text'>
                                        <p className='message-text'> {m.message.text === '' ? <img src={`./images/${m.message.image}`} /> : m.message.text}  </p>
                                    </div>
                                    <div className='time'>
                                        {moment(m.createdAt).startOf('mini').fromNow()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : <div className='friend_connect'>
                        <img src={`./images/${currentfriend.image}`} alt='' />
                        <h3>{currentfriend.username} Connects You </h3>
                        <span> {moment(currentfriend.createdAt).startOf('mini').fromNow()} </span>
                    </div>
                }
            </div>
            {
                typingMessage && typingMessage.msg && typingMessage.senderId === currentfriend._id ? <div className='typing-message'>
                    <div className='fd-message'>
                        <div className='image-message-time'>
                            <img src={`./images/${currentfriend.image}`} alt='' />
                            <div className='message-time'>
                                <div className='fd-text'>
                                    <p className='time'>Typing Message.... </p>
                                </div>

                            </div>
                        </div>
                    </div>

                </div> : ''
            }
        </>
    )
};

export default Message;