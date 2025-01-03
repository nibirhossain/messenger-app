import React, { useEffect, useState, useRef } from 'react';
import { FaEllipsisH, FaEdit, FaSistrix } from 'react-icons/fa';
import ActiveFriend from "./ActiveFriend";
import Friends from "./Friends";
import RightSide from "./RightSide";
import { useDispatch, useSelector } from 'react-redux';
import { getFriends, messageSend, getMessages, ImageMessageSend } from '../store/actions/messengerAction';
import toast, { Toaster } from 'react-hot-toast';
import useSound from 'use-sound';
import notificationSound from '../audio/notification.mp3';
import sendingSound from '../audio/sending.mp3';
import { io } from 'socket.io-client';

const Messenger = () => {
    const scrollRef = useRef();
    const socket = useRef();
    const [notificationPlay] = useSound(notificationSound);   
    const [sendingPlay] = useSound(sendingSound); 
    const { myInfo } = useSelector(state => state.auth);
    const { friends, message } = useSelector(state => state.messenger);
    const [currentfriend, setCurrentFriend] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [activeUser, setActiveUser] = useState([]);
    const [socketMessage, setSocketMessage] = useState('');
    const [typingMessage, setTypingMessage] = useState('');

    // console.log(currentfriend);

    useEffect(() => {
        socket.current = io('ws://localhost:8000');
        socket.current.on('getMessage', (data) => {
            setSocketMessage(data);
        })

        socket.current.on('typingMessageGet', (data) => {
            setTypingMessage(data);
        })
    }, []);

    useEffect(() => {
        if (socketMessage && currentfriend) {
            if (socketMessage.senderId === currentfriend._id && socketMessage.receiverId === myInfo.id) {
                dispatch({
                    type: 'SOCKET_MESSAGE',
                    payload: {
                        message: socketMessage
                    }
                })
            }
        }
        setSocketMessage('')
    }, [socketMessage]);

    useEffect(() => {
        socket.current.emit('addUser', myInfo.id, myInfo)
    }, []);

    useEffect(() => {
        socket.current.on('getUser', (users) => {
            const filterUser = users.filter(u => u.userId !== myInfo.id);
            setActiveUser(filterUser);
        })
    }, []);

    useEffect(() => {
        if (socketMessage && socketMessage.senderId !== currentfriend._id && socketMessage.receiverId === myInfo.id) {
            notificationPlay();
            toast.success(`${socketMessage.senderName} sent you a new message`)
        }
    }, [socketMessage]);

    const inputHandle = (e) => {
        setNewMessage(e.target.value);
        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            receiverId: currentfriend._id,
            msg: e.target.value
        })
    }

    const sendMessage = (e) => {
        e.preventDefault();
        sendingPlay();
        const data = {
            senderName: myInfo.username,
            receiverId: currentfriend._id,
            message: newMessage ? newMessage : '❤'
        }

        socket.current.emit('sendMessage', {
            senderId: myInfo.id,
            senderName: myInfo.username,
            receiverId: currentfriend._id,
            time: new Date(),
            message: {
                text: newMessage ? newMessage : '❤',
                image: ''
            }
        })

        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            receiverId: currentfriend._id,
            msg: ''
        })

        dispatch(messageSend(data));
        setNewMessage('')
    }

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getFriends());
    }, []);

    useEffect(() => {
        if (friends && friends.length > 0)
            setCurrentFriend(friends[0])
    }, [friends]);

    useEffect(() => {
        dispatch(getMessages(currentfriend._id))
    }, [currentfriend?._id]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [message]);

    const emojiSend = (emu) => {
        setNewMessage(`${newMessage}` + emu);
        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            receiverId: currentfriend._id,
            msg: emu
        })
    }

    const ImageSend = (e) => {
        if (e.target.files.length !== 0) {
            sendingPlay();
            const imagename = e.target.files[0].name;
            const newImageName = Date.now() + imagename;

            socket.current.emit('sendMessage', {
                senderId: myInfo.id,
                senderName: myInfo.username,
                receiverId: currentfriend._id,
                time: new Date(),
                message: {
                    text: '',
                    image: newImageName
                }
            })

            const formData = new FormData();

            formData.append('senderName', myInfo.username);
            formData.append('imageName', newImageName);
            formData.append('receiverId', currentfriend._id);
            formData.append('image', e.target.files[0]);
            dispatch(ImageMessageSend(formData));

        }
    }

    return (
        <div className="messenger">
            <Toaster
                position={'top-right'}
                reverseOrder={false}
                toastOptions={{
                    style: {
                        fontSize: '18px'
                    }
                }}

            />
            <div className="row">
                <div className="col-3">
                    <div className="left-side">
                        <div className="top">
                            <div className="image-name">
                                <div className="image">
                                    <img src={`./images/${myInfo.image}`} alt='' />
                                </div>
                                <div className="name">
                                    <h2> &nbsp; {myInfo.username} </h2>
                                </div>
                            </div>
                            <div className='icons'>
                                <div className='icon'>
                                    <FaEllipsisH />
                                </div>
                                <div className='icon'>
                                    <FaEdit />
                                </div>
                            </div>
                        </div>
                        <div className='friend-search'>
                            <div className='search'>
                                <button> <FaSistrix /> </button>
                                <input type="text" placeholder='Search' className='form-control' />
                            </div>
                        </div>
                        <div className='active-friends'>
                            {
                                activeUser && activeUser.length > 0 ? activeUser.map(u => <ActiveFriend setCurrentFriend={setCurrentFriend} user={u} />) : ''
                            }
                        </div>
                        <div className='friends'>
                            {
                                 friends && friends.length>0 ? friends.map((fd) => <div onClick={()=> setCurrentFriend(fd.fndInfo)} className={currentfriend._id === fd.fndInfo._id ? 'hover-friend active' : 'hover-friend' }> 
                                    <Friends myId = {myInfo.id}  friend={fd} />
                                </div>) : 'No Friend'
                            }

                        </div>
                    </div>
                </div>
                {
                    currentfriend ? <RightSide
                        currentfriend={currentfriend}
                        inputHandle={inputHandle}
                        newMessage={newMessage}
                        sendMessage={sendMessage}
                        message={message}
                        scrollRef={scrollRef}
                        emojiSend={emojiSend}
                        ImageSend={ImageSend}
                        activeUser={activeUser}
                        typingMessage={typingMessage}
                    /> : 'Please Select your Friend'
                }
            </div>
        </div>
    )
}

export default Messenger;