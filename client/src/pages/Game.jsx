import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import batman from '../assets/batman.png';
import avatar from '../assets/avatar.png';
import robot from '../assets/robot.png';
import X from '../assets/x.png';
import O from '../assets/o.png';
import { SocketContext } from '../context/SocketProvider';
import { GameDataContext } from '../context/GameDataProvider';

export default function Game() {

    const getLocalStorage = () => {
        return JSON.parse(localStorage.getItem("sessionID"));
    }

    const localSession = getLocalStorage();

    const socket = useContext(SocketContext);
    const [lastTurn, setLastTurn, xPlayer, setXPlayer, player, setPlayer] = useContext(GameDataContext)

    const winCondition = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    const navigate = useNavigate();

    // state
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isWaiting, setIsWaiting] = useState(false);
    const [tileFilled, setTileFilled] = useState(0);
    const [winner, setWinner] = useState(null);

    useEffect(() => {

        socket.emit("find room");

        socket.on("waitingOpponent", () => {
            setIsWaiting(true);
        })

        socket.on('gameMatched', (data) => {
            setPlayer(data.gameData.player);
            setXPlayer(data.gameData.xPlayer);
            setLastTurn(data.gameData.lastTurn);
            setIsWaiting(false);
        })

        socket.on("updatedBoard", (data) => {
            setLastTurn(data.lastTurn);
            setTileFilled(data.tileFilled);
            setBoard(data.board);
        })

        socket.on("gameResult", ({ winner }) => {
            setWinner(winner);
        })

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('updatedBoard');
        };
    }, []);

    const handleClick = (idx, v) => {

        const newBoard = board.map((e, i) => {
            if (i === idx) {
                return v
            } else {
                return e
            }
        })

        socket.emit("boardClick", {
            lastTurn: localSession.name,
            board: newBoard,
            tileFilled: (tileFilled + 1)
        })

    }

    if (winner) {
        if (xPlayer === localSession.name) {
            if (winner === "Draw") {
                navigate('/result', { state: { message: "Draw" } });
            } else if (winner === "X") {
                navigate('/result', { state: { message: "You Won!" } });
            } else {
                navigate('/result', { state: { message: "You Lose!" } });
            }
        } else {
            if (winner === "Draw") {
                navigate('/result', { state: { message: "Draw" } });
            } else if (winner === "X") {
                navigate('/result', { state: { message: "You Lose!" } });
            } else {
                navigate('/result', { state: { message: "You Won!" } });
            }
        }
    }


    if (isWaiting) {
        return (
            <div className={'max-w-[430px] min-w-[430px] max-h-screen w-screen h-screen flex bg-base-img bg-cover px-8 py-10 mx-auto justify-center items-center'}>
                <h1 className='text-white text-lg font-semibold'>Searching Opponent ...</h1>
            </div>
        )
    }

    return (

        <div className={'max-w-[430px] min-w-[430px] max-h-screen w-screen h-screen flex flex-col mx-auto bg-base-img bg-cover px-8 py-10 items-center'
        }>

            {/* player info */}
            <div className='w-full flex justify-center gap-16 mb-20'>

                {player.map((player, i) => {
                    return (
                        <div key={i} className='w-[125px] h-[175px] bg-black bg-opacity-25 flex flex-col items-center justify-center gap-2 p-2 rounded-lg'>
                            <img src={require(`../assets/${player.avatarImage}`)} alt="avatar" width={'50px'} height={'50px'} className={'rounded-full'} />

                            <h2 className='text-white'>{player.name}</h2>

                            <img src={player.name === xPlayer ? X : O} alt="icon X" width={'50px'} height={'50px'} className={'rounded-full'} />
                        </div>
                    )
                })}


            </div>

            <div className='mb-4 text-white text-lg'>
                <p>{lastTurn !== localSession.name ? 'Your Turn' : 'Opponent Turn'}</p>
            </div>

            {/* board game */}
            <div className='w-[335px] h-[335px] bg-violet-800 bg-opacity50 rounded-lg'>
                <ul className='grid grid-cols-3 w-full h-full justify-items-center items-center'>
                    {board.map((e, i) => {
                        return (
                            <li key={i} className='w-[100px] h-[100px] bg-gray-800 rounded-lg cursor-pointer flex justify-center items-center' onClick={() => {
                                e === null && localSession.name !== lastTurn && handleClick(i, localSession.name === xPlayer ? 'X' : 'O')
                            }}>
                                {e ? <img src={e === "X" ? X : O} alt="icon X" width={'75px'} height={'75px'} className={'rounded-full'} /> : ''}
                            </li>
                        )
                    })}
                </ul>
            </div>

        </div >

    )
}
