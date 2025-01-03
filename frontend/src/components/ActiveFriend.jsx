import React from 'react';

const ActiveFriend = ({ user }) => {
    return (
        <div className='active-friend'>
            <div className='image-active-icon'>
                <div className='image'>
                    <img src={`./images/${user.userInfo.image}`} alt='' />
                    <div className='active-icon'>

                    </div>
                </div>
            </div>

        </div>
    )
};

export default ActiveFriend;