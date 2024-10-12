import React, { useState, useEffect } from 'react';
import { Pickaxe, RefreshCw } from 'lucide-react';

interface MiningSceneProps {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  miningRate: number;
  setMiningRate: React.Dispatch<React.SetStateAction<number>>;
}

interface MiningCard {
  id: number;
  name: string;
  levels: number[];
  prices: number[];
  currentLevel: number;
  production: number;
}

const initialCards: MiningCard[] = [
  { id: 1, name: "Minero Novato", levels: [10, 15, 25], prices: [1000, 2000, 4000], currentLevel: 0, production: 0 },
  { id: 2, name: "Minero Experimentado", levels: [30, 35, 45], prices: [5000, 7000, 10000], currentLevel: 0, production: 0 },
  { id: 3, name: "Minero Experto", levels: [50, 55, 65], prices: [12000, 15000, 20000], currentLevel: 0, production: 0 },
  { id: 4, name: "Minero Maestro", levels: [70, 75, 100], prices: [22000, 25000, 30000], currentLevel: 0, production: 0 },
];

const MiningScene: React.FC<MiningSceneProps> = ({ coins, setCoins, miningRate, setMiningRate }) => {
  const [cards, setCards] = useState<MiningCard[]>(() => {
    const savedCards = localStorage.getItem('miningCards');
    return savedCards ? JSON.parse(savedCards) : initialCards;
  });
  const [lastUpgradeTime, setLastUpgradeTime] = useState(Date.now());

  useEffect(() => {
    localStorage.setItem('miningCards', JSON.stringify(cards));
    const totalProduction = cards.reduce((total, card) => total + card.production, 0);
    setMiningRate(totalProduction / 3600); // Convertir producción por hora a por segundo
  }, [cards, setMiningRate]);

  const handleUpgrade = (cardId: number) => {
    const now = Date.now();
    if (now - lastUpgradeTime < 5000) {
      alert("Por favor, espera 5 segundos entre mejoras.");
      return;
    }

    setCards(prevCards => prevCards.map(card => {
      if (card.id === cardId && card.currentLevel < 3) {
        const nextLevel = card.currentLevel + 1;
        const upgradeCost = card.prices[card.currentLevel];
        if (coins >= upgradeCost) {
          setCoins(prevCoins => prevCoins - upgradeCost);
          const newProduction = card.levels[card.currentLevel];
          setLastUpgradeTime(now);
          return { 
            ...card, 
            currentLevel: nextLevel, 
            production: card.production + newProduction 
          };
        }
      }
      return card;
    }));
  };

  const resetCache = () => {
    localStorage.removeItem('miningCards');
    setCards(initialCards);
    setCoins(0);
    setMiningRate(0);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-4 w-full mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <img src="/images/coin.png" alt="Coin" className="w-6 h-6 mr-2" />
            <span className="text-2xl font-bold text-black">{coins.toFixed(2)}</span>
          </div>
          <button
            onClick={resetCache}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-2 rounded flex items-center"
          >
            <RefreshCw className="mr-1" size={14} />
            Reiniciar
          </button>
        </div>
        <p className="text-sm text-black">Tasa de minería: {Math.floor(miningRate * 3600)} monedas/hora</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {cards.map(card => (
          <div key={card.id} className="bg-white bg-opacity-80 rounded-lg shadow-lg p-2">
            <h3 className="text-sm font-bold text-black mb-1">{card.name}</h3>
            <p className="text-xs text-black mb-1">
              Nivel: {card.currentLevel} / 3
            </p>
            <p className="text-xs text-black mb-1">
              Producción: {card.production} monedas/hora
            </p>
            {card.currentLevel < 3 && (
              <>
                <p className="text-xs text-black mb-1">
                  Mejora: +{card.levels[card.currentLevel]} monedas/hora
                </p>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleUpgrade(card.id)}
                  disabled={coins < card.prices[card.currentLevel]}
                >
                  {coins < card.prices[card.currentLevel] ? 'Insuficiente' : `Comprar (${card.prices[card.currentLevel]})`}
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiningScene;