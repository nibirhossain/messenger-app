import React from 'react';
import { FaPhoneAlt, FaVideo, FaRocketchat } from "react-icons/fa";
import Message from './Message';
import MessageSend from './MessageSend';
import FriendInfo from './FriendInfo';

const RightSide = (props) => {

    const { currentfriend, inputHandle, newMessage, sendMessage, message, scrollRef, emojiSend, ImageSend, activeUser } = props;

    return (
        <div className='col-9'>
            <div className='right-side'>
                <input type="checkbox" id='dot' />
                <div className='row'>
                    <div className='col-8'>
                        <div className='message-send-show'>
                            <div className='header'>
                                <div className='image-name'>
                                    <div className='image'>
                                        <img src={`./images/${currentfriend.image}`} alt='' />
                                        {
                                            activeUser && activeUser.length > 0 && activeUser.some(u => u.userId === currentfriend._id) ? <div className='active-icon'></div> : ''
                                        }
                                    </div>
                                    <div className='name'>
                                        <h3> {currentfriend.username} </h3>
                                    </div>
                                </div>

                                <div className='icons'>
                                    <div className='icon'>
                                        <FaPhoneAlt />
                                    </div>

                                    <div className='icon'>
                                        <FaVideo />
                                    </div>

                                    <div className='icon'>
                                        <label htmlFor='dot'> <FaRocketchat /> </label>
                                    </div>

                                </div>
                            </div>
                            <Message
                                message={message}
                                currentfriend={currentfriend}
                                scrollRef={scrollRef}
                            />
                            <MessageSend
                                inputHandle={inputHandle}
                                newMessage={newMessage}
                                sendMessage={sendMessage}
                                emojiSend={emojiSend}
                                ImageSend={ImageSend}
                            />
                        </div>
                    </div>
                    <div className='col-4'>
                        <FriendInfo currentfriend={currentfriend} activeUser={activeUser} />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default RightSide;