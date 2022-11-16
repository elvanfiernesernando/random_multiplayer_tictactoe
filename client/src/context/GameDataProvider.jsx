import React, { useState, createContext } from 'react';

export const GameDataContext = createContext();

export default function GameDataProvider({ children }) {

    const [lastTurn, setLastTurn] = useState("");
    const [xPlayer, setXPlayer] = useState("");
    const [player, setPlayer] = useState([]);

    return (
        <GameDataContext.Provider value={[lastTurn, setLastTurn, xPlayer, setXPlayer, player, setPlayer]}>
            {children}
        </GameDataContext.Provider>
    )
}