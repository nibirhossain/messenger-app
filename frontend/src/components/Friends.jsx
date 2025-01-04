import React from 'react';
import moment from 'moment';
import { FaRegCheckCircle } from "react-icons/fa";

const Friends = (props) => {
     const { fndInfo, msgInfo } = props.friend;
     const myId = props.myId;
     return (
          <div className='friend'>
               <div className='friend-image'>
                    <div className='image'>
                         <img src={`./images/${fndInfo.image}`} alt='' />
                    </div>
               </div>

               <div className='friend-name-seen'>
                    <div className='friend-name'>
                         <h4> {fndInfo.username} </h4>
                         <div className='msg-time'>
                              {
                                   msgInfo && msgInfo.senderId === myId ? <span>You </span> : <span> {fndInfo.username + ' '} </span>
                              }
                              {
                                   msgInfo && msgInfo.message.text ? <span>{msgInfo.message.text.slice(0, 10)}</span> : msgInfo && msgInfo.message.image ? <span>&nbsp;sent an image&nbsp;</span> : <span>&nbsp;connect You</span>
                              }
                              <span>{msgInfo ? ' ' + moment(msgInfo.createdAt).startOf('mini').fromNow() : ' ' + moment(fndInfo.createdAt).startOf('mini').fromNow()}</span>
                         </div>
                    </div>
                    {
                         myId === msgInfo?.senderId ?
                              <div className='seen-unseen-icon'>
                                   {
                                        msgInfo.status === 'seen' ?
                                             <img src={`./images/${fndInfo.image}`} alt='' /> : msgInfo.status === 'delivered' ? <div className='delivered'> <FaRegCheckCircle /> </div> : <div className='unseen'> </div>
                                   }
                              </div> :
                              <div className='seen-unseen-icon'>
                                   {
                                        msgInfo?.status !== undefined && msgInfo?.status !== 'seen' ? <div className='seen-icon'> </div> : ''
                                   }
                              </div>
                    }
               </div>

          </div>
     )
};

export default Friends;