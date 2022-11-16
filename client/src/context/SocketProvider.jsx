import React, { createContext } from 'react';
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    autoConnect: false,
    forceNew: true
});

export const SocketContext = createContext();

export default function SocketProvider({ children }) {

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}
