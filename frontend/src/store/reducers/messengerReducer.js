import { MESSAGE_SEND_SUCCESS, SOCKET_MESSAGE } from "../types/messengerType";
import { MESSAGE_GET_SUCCESS } from "../types/messengerType";
import { FRIEND_GET_SUCCESS } from "../types/messengerType";

const messengerState = {
    friends: [],
    messages: []
}

export const messengerReducer = (state = messengerState, action) => {
    const { type, payload } = action;
    if (type === FRIEND_GET_SUCCESS) {
        return {
            ...state,
            friends: payload.friends
        }
    }

    if (type === MESSAGE_GET_SUCCESS) {
        return {
            ...state,
            message: payload.message
        }
    }

    if (type === MESSAGE_SEND_SUCCESS) {
        return {
            ...state,
            message: [...state.message, payload.message]
        }
    }

    if (type === SOCKET_MESSAGE) {
        return {
            ...state,
            message: [...state.message, payload.message]
        }
    }

    return state;
}
