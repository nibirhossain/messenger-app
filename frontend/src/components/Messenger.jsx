import React, { useEffect, useState, useRef } from 'react';
import { FaEllipsisH, FaEdit, FaSistrix } from 'react-icons/fa';
import ActiveFriend from "./ActiveFriend";
import Friends from "./Friends";
import RightSide from "./RightSide";
import { useDispatch, useSelector } from 'react-redux';
import { getFriends, messageSend, getMessages, ImageMessageSend, seenMessage, updateMessage } from '../store/actions/messengerAction';
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
    const { friends, message, mesageSendSuccess, message_get_success } = useSelector(state => state.messenger);
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

        socket.current.on('msgSeenResponse', msg => {
            dispatch({
                type: 'SEEN_MESSAGE',
                payload: {
                    msgInfo: msg
                }
            })
        })

        socket.current.on('msgDeliveredResponse', msg => {
            dispatch({
                type: 'DELIVERED_MESSAGE',
                payload: {
                    msgInfo: msg
                }
            })
        })

        socket.current.on('seenSuccess', data => {
            dispatch({
                type: 'SEEN_ALL',
                payload: data
            })
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
                dispatch(seenMessage(socketMessage))
                socket.current.emit('messageSeen', socketMessage);
                dispatch({
                    type: 'UPDATE_FRIEND_MESSAGE',
                    payload: {
                        msgInfo: socketMessage,
                        status: 'seen'
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
            dispatch(updateMessage(socketMessage));
            socket.current.emit('deliveredMessage', socketMessage);
            dispatch({
                type: 'UPDATE_FRIEND_MESSAGE',
                payload: {
                    msgInfo: socketMessage,
                    status: 'delivered'
                }
            })
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

        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            receiverId: currentfriend._id,
            msg: ''
        })

        dispatch(messageSend(data));
        setNewMessage('')
    }

    useEffect(() => {
        if (mesageSendSuccess) {
            socket.current.emit('sendMessage', message[message.length - 1]);
            dispatch({
                type: 'UPDATE_FRIEND_MESSAGE',
                payload: {
                    msgInfo: message[message.length - 1]
                }
            })
            dispatch({
                type: 'MESSAGE_SEND_SUCCESS_CLEAR'
            })
        }
    }, [mesageSendSuccess]);


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getFriends());
    }, []);

    useEffect(() => {
        if (friends && friends.length > 0)
            setCurrentFriend(friends[0].fndInfo)
    }, [friends]);

    useEffect(() => {
        dispatch(getMessages(currentfriend._id));
        if (friends.length > 0) {
            
        }
    }, [currentfriend?._id]);

    useEffect(() => {
        if (message.length > 0) {
            if (message[message.length - 1].senderId !== myInfo.id && message[message.length - 1].status !== 'seen') {
                dispatch({
                    type: 'UPDATE',
                    payload: {
                        id: currentfriend._id
                    }
                })
                socket.current.emit('seen', { senderId: currentfriend._id, receiverId: myInfo.id })
                dispatch(seenMessage({ _id: message[message.length - 1]._id }))
            }
        }
        dispatch({
            type: 'MESSAGE_GET_SUCCESS_CLEAR'
        })

    }, [message_get_success]);

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
                                friends && friends.length > 0 ? friends.map((fd) => <div onClick={() => setCurrentFriend(fd.fndInfo)} className={currentfriend._id === fd.fndInfo._id ? 'hover-friend active' : 'hover-friend'}>
                                    <Friends myId={myInfo.id} friend={fd} />
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