'use client';

import { useCallback, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const joinRoomText = 'join-room';
export const leaveRoomText = 'leave-room';
export const CONNECT = 'connect';
export const DISCONNECT = 'disconnect';
export const RECONNECT = 'reconnect';
// Singleton socket instance
let socketInstance = null;
let eventListenersSetup = false;

export const getSocket = (token) => {
    if (typeof window === 'undefined') return null;
    if (socketInstance) return socketInstance;

    const socketUrl = 'https://algoapi.smartidealab.com';

    socketInstance = io(socketUrl, {
        path: '/socket.io',
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        // auth: { token }, // enable later if needed
    });

    socketInstance.on('connect', () => {
        console.log('✅ Socket connected:', socketInstance.id);
    });

    socketInstance.on('connect_error', (err) => {
        console.error('[useSocket] Connection error:', err.message);
    });

    return socketInstance;
};


const useSocket = () => {
    const socketRef = useRef(null);


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

    useEffect(() => {
        const socket = getSocket('token');
        socketRef.current = socket;

        if (!socket) return;

        if (!eventListenersSetup) {
            const handleConnect = () => {
                const currentVariant = variantNameRef.current;

                if (hasReconnectedRef.current && currentVariant) {
                    socket.emit(leaveRoomText, {});
                    socket.emit(joinRoomText, {});
                    hasReconnectedRef.current = false;
                }
            };

            const handleDisconnect = () => {
                console.error('Disconnected socket');
            };

            const handleReconnect = () => {
                hasReconnectedRef.current = true;
            };

            socket.on(CONNECT, handleConnect);
            socket.on(DISCONNECT, handleDisconnect);
            socket.io.on(RECONNECT, handleReconnect);

            eventListenersSetup = true;

            if (socket.connected) {
                socket.emit(joinRoomText, {});
            }
        }
    }, [joinRoom]);

    return {
        joinRoom,
        leaveRoom,
        emit,
        on,
    };
};


const WS_URL = 'wss://algoapi.smartidealab.com/ws/trades/';

export function useTradeWS(onMessage) {
    const wsRef = useRef(null);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('✅ WS connected');
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('📩 WS message:', data);
                onMessage?.(data);
            } catch (e) {
                console.error('WS parse error', e);
            }
        };

        ws.onerror = (err) => {
            console.error('❌ WS error', err);
        };

        ws.onclose = () => {
            console.log('🔌 WS closed');
        };

        return () => {
            ws.close();
        };
    }, []);

    return wsRef;
}