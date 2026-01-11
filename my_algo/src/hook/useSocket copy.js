'use client';

import {
    COIN_TOSS,
    CONNECT,
    DISCONNECT,
    joinRoomText,
    leaveRoomText,
    RECONNECT,
} from '@/lib/constants';
import { useCallback, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthToken } from '@/zustandstore/hooks/useAuthToken';
import { useRoundState } from '@/zustandstore/hooks/roundStateHook';

// Singleton socket instance
let socketInstance = null;
let eventListenersSetup = false;

const getSocket = (token) => {
    if (typeof window === 'undefined') return null;

    if (socketInstance) return socketInstance;

    const socketUrl = 'wss://algoapi.smartidealab.com/ws/trades/';
    if (!socketUrl) return null;

    socketInstance = io(socketUrl, {
        // auth: { token: token || '' },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
    });

    socketInstance.on('connect_error', (err) => {
        console.error('[useSocket] Connection error:', err.message);
    });

    return socketInstance;
};

const useSocket = () => {
    // const { token } = useAuthToken();
    const socketRef = useRef(null);

    const { roundStatics } = useRoundState();
    const { variantName } = roundStatics || {};
    const variantNameRef = useRef(null);
    const hasReconnectedRef = useRef(false);

    useEffect(() => {
        variantNameRef.current = variantName;
    }, [variantName]);

    const getSocketRef = useCallback(() => socketRef.current, []);

    const joinRoom = useCallback(
        (room) => {
            const socket = getSocketRef();
            if (!room || !socket?.connected) return;
            socket.emit(joinRoomText, { room });
        },
        [getSocketRef]
    );

    const emit = useCallback(
        (event, payload) => {
            const socket = getSocketRef();
            if (!socket?.connected) return;
            socket.emit(event, payload);
        },
        [getSocketRef]
    );

    const on = useCallback(
        (event, handler) => {
            const socket = getSocketRef();
            if (!socket || typeof handler !== 'function') return () => { };
            socket.on(event, handler);
            return () => socket.off(event, handler);
        },
        [getSocketRef]
    );

    const leaveRoom = useCallback(
        (room) => {
            const socket = getSocketRef();
            if (!room || !socket?.connected) return;
            socket.emit(leaveRoomText, { room });
        },
        [getSocketRef]
    );

    // useEffect(() => {
    //     const socket = getSocket('token');
    //     socketRef.current = socket;

    //     if (!socket) return;

    //     if (!eventListenersSetup) {
    //         const handleConnect = () => {
    //             const currentVariant = variantNameRef.current;

    //             if (hasReconnectedRef.current && currentVariant) {
    //                 socket.emit(leaveRoomText, { room: COIN_TOSS });
    //                 socket.emit(joinRoomText, { room: currentVariant });
    //                 hasReconnectedRef.current = false;
    //             }
    //         };

    //         const handleDisconnect = () => {
    //             console.error('Disconnected socket');
    //         };

    //         const handleReconnect = () => {
    //             hasReconnectedRef.current = true;
    //         };

    //         socket.on(CONNECT, handleConnect);
    //         socket.on(DISCONNECT, handleDisconnect);
    //         socket.io.on(RECONNECT, handleReconnect);

    //         eventListenersSetup = true;

    //         if (socket.connected) {
    //             socket.emit(joinRoomText, { room: COIN_TOSS });
    //         }
    //     }
    // }, [joinRoom]);

    return {
        joinRoom,
        leaveRoom,
        emit,
        on,
    };
};

export default useSocket;