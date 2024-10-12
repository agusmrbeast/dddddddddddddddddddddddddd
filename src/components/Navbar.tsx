import React from 'react';
import { Home, Pickaxe, Users, ClipboardList } from 'lucide-react';

interface NavbarProps {
  setCurrentScene: React.Dispatch<React.SetStateAction<string>>;
  backgroundColor?: string;
}

const Navbar: React.FC<NavbarProps> = ({ setCurrentScene, backgroundColor = '#ffffff' }) => {
  // Función para determinar si el color de fondo es oscuro
  const isColorDark = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness < 128;
  };

  // Determinar el color del icono basado en el color de fondo
  const iconColor = isColorDark(backgroundColor) ? 'white' : 'black';

  return (
    <nav className="fixed bottom-1 left-0 right-0 bg-white bg-opacity-80 rounded-t-lg shadow-lg">
      <ul className="flex justify-around py-2">
        <li>
          <button className="flex flex-col items-center" onClick={() => setCurrentScene('home')}>
            <Home size={24} color={iconColor} />
            <span className="text-xs mt-1" style={{ color: iconColor }}>Inicio</span>
          </button>
        </li>
        <li>
          <button className="flex flex-col items-center" onClick={() => setCurrentScene('mining')}>
            <Pickaxe size={24} color={iconColor} />
            <span className="text-xs mt-1" style={{ color: iconColor }}>Minería</span>
          </button>
        </li>
        <li>
          <button className="flex flex-col items-center" onClick={() => setCurrentScene('tasks')}>
            <ClipboardList size={24} color={iconColor} />
            <span className="text-xs mt-1" style={{ color: iconColor }}>Tareas</span>
          </button>
        </li>
        <li>
          <button className="flex flex-col items-center" onClick={() => setCurrentScene('friends')}>
            <Users size={24} color={iconColor} />
            <span className="text-xs mt-1" style={{ color: iconColor }}>Amigos</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;