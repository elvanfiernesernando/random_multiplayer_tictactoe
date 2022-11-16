import React, { useContext } from 'react';
import batman from '../assets/batman.png';
import avatar from '../assets/avatar.png';
import robot from '../assets/robot.png';
import X from '../assets/x.png';
import O from '../assets/o.png';
import resultWon from '../assets/won_icon.png';
import resultDraw from '../assets/draw_icon.png';
import resultLose from '../assets/lose.png';
import { IoIosRefresh } from "react-icons/io";
import { useNavigate, useLocation } from 'react-router-dom';


import { GameDataContext } from '../context/GameDataProvider';

export default function Result() {

    const location = useLocation();
    const navigate = useNavigate();

    // context
    const [lastTurn, setLastTurn, xPlayer, setXPlayer, player, setPlayer] = useContext(GameDataContext)

    const handleRefresh = () => {
        navigate('/game')
    }


    if (location.state.message === 'Draw') {
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

                <div className='w-[350px] h-[350px] bg-game-status bg-cover relative flex flex-col items-center'>

                    {/* menang top = 1, draw / lose top = 7 */}
                    <div className={`flex flex-col items-center absolute top- ${location.state.message === "You Won!" ? 'top-1' : 'top-7'}`}>
                        {/* result image */}
                        <img src={resultDraw} alt="result won" width={'200px'} height={'200px'} className={'rounded-full'} />

                        <h1 className='text-white text-2xl font-semibold mt-5'>It's a Draw!</h1>

                    </div>


                    {/* refresh button */}
                    <div className='w-[60px] h-[60px] bg-gradient-to-b from-orange-500 to-red-600 rounded-full text-white flex justify-center items-center absolute -bottom-7 cursor-pointer' onClick={handleRefresh}>
                        <IoIosRefresh className='text-4xl font-bold' />
                    </div>
                </div>


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

            <div className='w-[350px] h-[350px] bg-game-status bg-cover relative flex flex-col items-center'>

                {/* menang top = 1, draw / lose top = 7 */}
                <div className={`flex flex-col items-center absolute top- ${location.state.message === "You Won!" ? 'top-1' : 'top-7'}`}>
                    {/* result image */}
                    <img src={location.state.message === "You Won!" ? resultWon : resultLose} alt="result won" width={'200px'} height={'200px'} className={'rounded-full'} />

                    <h1 className='text-white text-2xl font-semibold mt-5'>{location.state.message}</h1>

                </div>


                {/* refresh button */}
                <div className='w-[60px] h-[60px] bg-gradient-to-b from-orange-500 to-red-600 rounded-full text-white flex justify-center items-center absolute -bottom-7 cursor-pointer' onClick={handleRefresh}>
                    <IoIosRefresh className='text-4xl font-bold' />
                </div>
            </div>


        </div>
    )
}
