import io from 'socket.io-client';
import React, { createContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser as addUserAction } from '../redux/user/user-actions';
import { addMessage as addMessageAction } from '../redux/message/message-actions';
import { setRoom } from '../redux/room/room-actions';
import { useLocation } from 'react-router';
import { displayMessage } from '../redux/display-message/display-message-actions';

let socket = null;
// let baseUrl = process.env.NODE_ENV === 'development' ?  'http://localhost:5000' : 'https://easychat.chat';
let baseUrl = 'http://localhost:5000';

let socketOptions = {
    transports: ['websocket', 'polling'],
    secure: true,
    // reconnection: true,
    // rejectUnauthorized: false,
}

if(process.env.NODE_ENV === 'production') {
    baseUrl = 'https://easychat.chat';
    socketOptions = {
        ...socketOptions,   
        path: '/backend/socket.io',
    }
}

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {

    const dispatch = useDispatch();
    const location = useLocation();

    const user = useSelector(state => state.userReducer.user);

    useEffect(() => {

        if (user) {

            const { name, room } = user;
            console.log(baseUrl);
            socket = io(baseUrl, {
                ...socketOptions,
                query: { room },
            });

            socket.on("connect_error", (err) => {
                console.log(`connect_error due to ${err.message}`);
            });

            //doing the imit here instead in the addUser because user needs to be added to the room again in the server 
            //in case the browser is refreshed
            socket.emit('addUser', { name, room }, error => {

                if (error) {

                    if (location.pathname === '/login') {
                        socket.disconnect(true);
                        dispatch(addUserAction(null));
                        dispatch(displayMessage({type:'alert', message: error}));
                    }
                    return;
                }
            });

            //Messages shared by users in the room
            socket.on('addMessage', messageData => {
                dispatch(addMessageAction(messageData));
            });

            //Notify when users join and leave the room
            socket.on('setRoom', room => {
                dispatch(setRoom(room));
            });
        }
    }, [user]);


    const addUser = props => {

        if (props) {

            const { name, room } = props;

            dispatch(addUserAction({ name, room }));

        } else {

            dispatch(addUserAction(null));
        }
    }

    const removeUserFromRoom = user => {

        if (user && user.name) {

            socket.emit('removeUserFromRoom', user, error => {

                if (error) {
                    console.log(error);
                    return;
                }

                socket.disconnect();

                addUser(null);
            });
        }
    }

    const addMessage = messageFields => {

        if (messageFields && messageFields.text) {
            
            socket.emit('addMessage', messageFields, error => {

                if (error) {
                    alert(error);
                    return;
                }
            });
        }
    }

    const context = {
        addUser,
        removeUserFromRoom,
        addMessage
    }

    return (
        <WebSocketContext.Provider value={context}>
            {children}
        </WebSocketContext.Provider>
    )

}
