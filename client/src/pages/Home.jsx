import React, { useContext, useEffect } from 'react';
import logo from '../assets/logo.png';
import { IoMdTrophy, IoIosPlay } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketProvider';

export default function Home() {

    // use socket context
    const socket = useContext(SocketContext)

    // create navigate
    const navigate = useNavigate();

    const handleForm = (e) => {
        e.preventDefault();

        const name = e.target.name.value.trim();
        const email = e.target.email.value.trim();

        socket.auth = {
            name: name,
            email: email
        };

        socket.connect();

    }

    useEffect(() => {
        socket.on("session", (data) => {
            // set sessionID from server to localstorage
            localStorage.setItem("sessionID", JSON.stringify(data));

            navigate('/game');
        });

        return () => {
            socket.off("session");
        }
    }, [])

    return (
        <div className={'max-w-[430px] min-w-[430px] max-h-screen w-screen h-screen flex flex-col mx-auto bg-base-img bg-cover px-8 py-10 items-center justify-center'
        }>

            <img src={logo} alt="logo" width={'250px'} height={'250px'} className={'mb-12'} />

            <form className={'flex flex-col gap-4 w-full mb-2 items-center'} onSubmit={handleForm}>

                <input type="text" name="name" id="name" placeholder='NAME' className={'w-full h-full py-2 px-2 rounded-full bg-slate-100 bg-opacity-50 text-center text-white placeholder:text-white outline-none font-nerko tracking-widest text-2xl capitalize'} required />

                <input type="email" name="email" id="email" placeholder='E-MAIL' className={'w-full h-full py-2 px-2 rounded-full bg-slate-100 bg-opacity-50 text-center text-white placeholder:text-white outline-none font-nerko tracking-widest text-2xl lowercase'} required />

                <button type='submit' className='w-[200px] flex justify-center items-center py-1 px-2 mx-16 rounded-full text-white font-bold bg-gradient-to-r from-emerald-300 via-teal-500 to-cyan-500 font-nerko tracking-widest text-xl'>
                    <IoIosPlay className=' text-4xl' />
                    Start
                </button>

            </form>

            <button className='w-[200px] flex justify-center items-center gap-2 py-3 px-2 mx-16 rounded-full text-white font-bold bg-gradient-to-r from-pink-500 via-fuchsia-600 to-fuchsia-700 font-nerko tracking-widest text-xl'>
                <IoMdTrophy className=' text-3xl' />
                Leaderboard
            </button>


        </div >
    )
}
