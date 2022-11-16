import React from 'react';

export default function BoxComponent({ icon, onClick }) {
    return (
        <li className='w-[100px] h-[100px] bg-gray-800 rounded-lg cursor-pointer flex justify-center items-center'>
            {icon ? <img src={icon} alt="icon X" width={'75px'} height={'75px'} className={'rounded-full'} /> : ''}
        </li>
    )
}
