import React, { useState, useEffect } from 'react';
import { Settings, Pickaxe, Rocket, Wallet, DollarSign, X, User } from 'lucide-react';
import Character from './components/Character';
import Config from './components/Config';
import Navbar from './components/Navbar';
import MiningScene from './components/MiningScene';
import TasksScene from './components/TasksScene';
import TokenInfoScene from './components/TokenInfoScene';
import FriendsScene from './components/FriendsScene';

function App() {
  const [coins, setCoins] = useState(0);
  const [miningRate, setMiningRate] = useState(0);
  const [currentScene, setCurrentScene] = useState('home');
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(Date.now());
  const [activePopup, setActivePopup] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prevCoins => prevCoins + miningRate);
    }, 1000);
    return () => clearInterval(interval);
  }, [miningRate]);

  const handleCharacterClick = () => {
    const now = Date.now();
    if (now - lastClickTime > 3000) {
      setClickCount(0);
    }
    if (clickCount < 7) {
      setCoins(prevCoins => prevCoins + 100);
      setClickCount(prevCount => prevCount + 1);
      setLastClickTime(now);
    }
  };

  const renderPopup = () => {
    switch (activePopup) {
      case 'win1000':
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-2">¡Gana 1000 monedas!</h2>
              <p>Completa una tarea para ganar 1000 monedas extra.</p>
              <button onClick={() => setActivePopup(null)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                Cerrar
              </button>
            </div>
          </div>
        );
      case 'booster':
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Potenciador</h2>
              <p>Activa un potenciador para aumentar tu tasa de minería por 30 segundos.</p>
              <button onClick={() => setActivePopup(null)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                Cerrar
              </button>
            </div>
          </div>
        );
      case 'wallet':
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Billetera</h2>
              <p>Aquí puedes ver y gestionar tus monedas y USDT.</p>
              <button onClick={() => setActivePopup(null)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                Cerrar
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getLevel = () => {
    if (coins < 1000) return { level: 1, color: '#81d4fa' };
    if (coins < 5000) return { level: 2, color: '#25b6ee' };
    if (coins < 10000) return { level: 3, color: '#4caf50' };
    if (coins < 30000) return { level: 4, color: '#e8cd3f' };
    return { level: 5, color: '#9a13f8' };
  };

  const { level, color } = getLevel();

  const renderScene = () => {
    switch (currentScene) {
      case 'mining':
        return <MiningScene coins={coins} setCoins={setCoins} miningRate={miningRate} setMiningRate={setMiningRate} />;
      case 'tasks':
        return <TasksScene coins={coins} setCoins={setCoins} />;
      case 'tokenInfo':
        return <TokenInfoScene setCurrentScene={setCurrentScene} />;
      case 'friends':
        return <FriendsScene coins={coins} setCoins={setCoins} />;
      case 'config':
        return <Config onClose={() => setCurrentScene('home')} />;
      default:
        return (
          <>
            <div className="flex flex-col items-center mb-4">
              <div className="flex items-center justify-center mb-2">
                <img src="https://i.ibb.co/Q9NNLK5/tu-ruta-moneda-amarilla.png" alt="Coin" className="w-8 h-8 mr-2" />
                <span className="text-3xl font-bold text-white">{coins.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-center text-white font-bold text-sm">
                <Pickaxe size={16} className="mr-1" />
                <span>{Math.floor(miningRate * 3600)} x hora</span>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div onClick={handleCharacterClick} className="flex-grow">
                <Character />
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2">
                <button
                  onClick={() => setActivePopup('win1000')}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold p-2 rounded-full absolute"
                  style={{ bottom: '150px', left: '90px' }}
                >
                  <DollarSign size={20} />
                </button>
                <button
                  onClick={() => setActivePopup('booster')}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded-full absolute"
                  style={{ top: '-60px', right: '120px' }}
                >
                  <Rocket size={20} />
                </button>
                <button
                  onClick={() => setActivePopup('wallet')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold p-2 rounded-full absolute"
                  style={{ bottom: '-30px', right: '120px' }}
                >
                  <Wallet size={20} />
                </button>
              </div>
            </div>
            <p className="text-white font-bold text-center mt-2">{clickCount}/7 clicks</p>
          </>
        );
    }
  };

  const showButtons = !['mining', 'tasks', 'friends', 'tokenInfo'].includes(currentScene);
  const showNavbar = currentScene !== 'tokenInfo';

  return (
    <div className="min-h-screen flex flex-col items-center p-4" style={{ backgroundColor: color }}>
      {showButtons && (
        <div className="w-full flex justify-between items-center mb-4">
          <div className="flex items-center">
            <button onClick={() => setCurrentScene('config')} className="text-white mr-2">
              <Settings size={24} />
            </button>
            <button className="text-white">
              <User size={24} />
            </button>
          </div>
          <button
            onClick={() => setCurrentScene('tokenInfo')}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded"
          >
            Acerca del Token
          </button>
        </div>
      )}
      <div className="w-full max-w-md flex-grow">
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-2 flex items-center justify-center mb-4">
          <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" alt="USDT" className="w-6 h-6 mr-2" />
          <span className="font-bold">{(coins / 100).toFixed(2)} USDT</span>
        </div>
        {renderScene()}
      </div>
      {showNavbar && <Navbar setCurrentScene={setCurrentScene} backgroundColor={color} />}
      {renderPopup()}
    </div>
  );
}

export default App;