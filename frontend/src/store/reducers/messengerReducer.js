import { LOGOUT_SUCCESS } from "../types/authType";
import { MESSAGE_SEND_SUCCESS, MESSAGE_SEND_SUCCESS_CLEAR, SOCKET_MESSAGE, UPDATE_FRIEND_MESSAGE, SEEN_MESSAGE, DELIVERED_MESSAGE, UPDATE, MESSAGE_GET_SUCCESS_CLEAR, SEEN_ALL, THEME_GET_SUCCESS, THEME_SET_SUCCESS } from "../types/messengerType";
import { MESSAGE_GET_SUCCESS } from "../types/messengerType";
import { FRIEND_GET_SUCCESS } from "../types/messengerType";

const messengerState = {
    friends: [],
    message: [],
    mesageSendSuccess: false,
    message_get_success: false,
    themeMood: '',
    new_user_add: ''
}

export const messengerReducer = (state = messengerState, action) => {
    const { type, payload } = action;
    if (type === THEME_GET_SUCCESS || type === THEME_SET_SUCCESS) {
        return {
            ...state,
            themeMood: payload.theme
        }
    }

    if (type === FRIEND_GET_SUCCESS) {
        return {
            ...state,
            friends: payload.friends
        }
    }

    if (type === MESSAGE_GET_SUCCESS) {
        return {
            ...state,
            message_get_success: true,
            message: payload.message
        }
    }

    if (type === MESSAGE_SEND_SUCCESS) {
        return {
            ...state,
            mesageSendSuccess: true,
            message: [...state.message, payload.message]
        }
    }

    if (type === SOCKET_MESSAGE) {
        return {
            ...state,
            message: [...state.message, payload.message]
        }
    }

    if (type === UPDATE_FRIEND_MESSAGE) {
        const index = state.friends.findIndex(f => f.fndInfo._id === payload.msgInfo.receiverId || f.fndInfo._id === payload.msgInfo.senderId);
        state.friends[index].msgInfo = payload.msgInfo;
        state.friends[index].msgInfo.status = payload.status;
        return state;
    }

    if (type === MESSAGE_SEND_SUCCESS_CLEAR) {
        return {
            ...state,
            mesageSendSuccess: false
        }
    }

    if (type === SEEN_MESSAGE) {
        const index = state.friends.findIndex(f => f.fndInfo._id === payload.msgInfo.receiverId || f.fndInfo._id === payload.msgInfo.senderId);
        console.log('seen message', state.friends[index], index);
        state.friends[index].msgInfo.status = 'seen';
        return {
            ...state
        };
    }

    if (type === DELIVERED_MESSAGE) {
        const index = state.friends.findIndex(f => f.fndInfo._id === payload.msgInfo.receiverId || f.fndInfo._id === payload.msgInfo.senderId);
        state.friends[index].msgInfo.status = 'delivered';
        return {
            ...state
        };
    }

    if (type === UPDATE) {
        const index = state.friends.findIndex(f => f.fndInfo._id === payload.id);
        if (state.friends[index].msgInfo) {
            state.friends[index].msgInfo.status = 'seen';
        }
        return {
            ...state
        }
    }

    if (type === MESSAGE_GET_SUCCESS_CLEAR) {
        return {
            ...state,
            message_get_success: false
        }
    }

    if (type === SEEN_ALL) {
        const index = state.friends.findIndex(f => f.fndInfo._id === payload.receiverId);
        state.friends[index].msgInfo.status = 'seen';
        return {
            ...state
        }
    }

    if (type === LOGOUT_SUCCESS) {
        return {
            ...state,
            friends: [],
            message: [],
            mesageSendSuccess: false,
            message_get_success: false,

        }
    }

    if (type === 'NEW_USER_ADD') {
        return {
            ...state,
            new_user_add: payload.new_user_add
        }
    }
    if (type === 'NEW_USER_ADD_CLEAR') {
        return {
            ...state,
            new_user_add: ''
        }
    }

    return state;
}
