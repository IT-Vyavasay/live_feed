'use client';
import React, { useState, useEffect, useCallback } from 'react';
import GameLoading from '../shared/GameLoading';
import OneCoin from './oneCoin/OneCoin';
import FourCoin from './fourCoin/FourCoin';
import { useApi } from '../hooks/useApi';
import { API_ENDPOINTS } from '@/lib/apiEndpoints';
import {
    GET,
    NEW_ROUND,
    ROUND_STATE_CHANGED,
    BALANCE_UPDATED,
    FOUR_COIN,
    ONE_COIN,
    PLAYER_JOIN,
    PLAYER_LEAVE,
    betOpen,
} from '@/lib/constants';
import { useRoundState } from '@/zustandstore/hooks/roundStateHook';
import useSocket from '@/hooks/useSocket';
import { getCoinType } from '@/utils/customFunction';
import { useSelectedGame } from '@/zustandstore/hooks/useSelectedGame';
import { usePlaceBetValue } from '@/zustandstore/hooks/placeBetValueHook';
import { usePlayerInfo } from '@/zustandstore/hooks/usePlayerInfo';
import { useRoomList } from '@/zustandstore/hooks/useRoomList';
import { useBetCountdown } from '@/hooks/useBetCountdown';

const gameViewComponents = {
    [ONE_COIN]: OneCoin,
    [FOUR_COIN]: FourCoin,
};

function CoinGameViewSwitch({ onBack, roomId }) {
    const [currentView, setCurrentView] = useState('loading');

    const { setRoundStatics, updateLobbyMemberCount } = useRoundState();
    const { gameRoomList } = useRoomList();
    const { on, joinRoom } = useSocket();
    const { api, isLoading } = useApi();
    const { setUserInfo } = usePlayerInfo();
    const { phase } = useBetCountdown();
    const { setSelectedRoom } = useSelectedGame();
    const { resetPlaceBetValue, newRoundResetPlaceBetValue } = usePlaceBetValue();

    const fetchCoinData = useCallback(
        async (id) => {
            setCurrentView('loading');

            try {
                const response = await api({
                    method: GET,
                    endPoint: API_ENDPOINTS.roundState(id),
                    minLoadingTime: 1000,
                });

                if (!response?.success) {
                    onBack();
                }

                const data = response?.data?.data;

                setRoundStatics(data);
                setSelectedRoom(data);

                const roomType = getCoinType(data?.variantName);
                if (roomType) {
                    setCurrentView(roomType);
                }
            } catch (_error) {
                // manage the error here
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [api, setRoundStatics, setSelectedRoom]
    );

    useEffect(() => {
        fetchCoinData(roomId);
        joinRoom(getVariantNameById(roomId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchCoinData, roomId]);

    useEffect(() => {
        const unsubscribeRoundStateChanged = on(ROUND_STATE_CHANGED, (data) => {
            const roundData = data?.data;
            setRoundStatics(roundData);
        });

        const unsubscribeNewRound = on(NEW_ROUND, (data) => {
            const roundData = data?.data;
            newRoundResetPlaceBetValue();
            setRoundStatics(roundData);
        });

        const unsubscribeBalanceUpdated = on(BALANCE_UPDATED, (data) => {
            const balance = data?.balance;
            if (balance !== undefined && balance !== null) {
                if (phase === betOpen) {
                    setUserInfo({ balance: balance });
                } else {
                    setUserInfo({ lastUpdatedBalance: balance });
                }
            }
        });

        const handleLobbyUpdate = (data) => {
            updateLobbyMemberCount(data?.roomMembersCount);
        };

        const cleanupJoin = on(PLAYER_JOIN, handleLobbyUpdate);
        const cleanupLeave = on(PLAYER_LEAVE, handleLobbyUpdate);

        return () => {
            if (unsubscribeRoundStateChanged) unsubscribeRoundStateChanged();
            if (unsubscribeNewRound) unsubscribeNewRound();
            if (unsubscribeBalanceUpdated) unsubscribeBalanceUpdated();
            if (cleanupJoin) cleanupJoin();
            if (cleanupLeave) cleanupLeave();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [on, phase]);

    const getVariantNameById = (id) => {
        const room = Object.values(gameRoomList)
            ?.flat?.(1)
            ?.find?.((room) => room.id === id);
        return room?.name;
    };

    const changeGameType = (id) => {
        resetPlaceBetValue();
        fetchCoinData(id);
        joinRoom(getVariantNameById(id));
    };

    const backToLobby = () => {
        setCurrentView('loading');
        resetPlaceBetValue();
        setTimeout(() => {
            onBack();
        }, 1000);
    };

    if (!currentView) {
        return;
    }

    if (isLoading || currentView === 'loading') {
        return <GameLoading />;
    }

    const GameComponent = gameViewComponents[currentView] || OneCoin;

    return <GameComponent onBack={backToLobby} onRoomChange={changeGameType} />;
}

export default React.memo(CoinGameViewSwitch);