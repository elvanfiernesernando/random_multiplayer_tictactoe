import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Result from './pages/Result';
import SocketProvider from './context/SocketProvider';
import GameDataProvider from './context/GameDataProvider';

export default function App() {
  return (

    <SocketProvider>
      <GameDataProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/game' element={<Game />} />
          <Route path='/result' element={<Result />} />
        </Routes>
      </GameDataProvider>
    </SocketProvider>

  )
}
