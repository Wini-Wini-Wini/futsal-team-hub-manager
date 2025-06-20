
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBackButton = false
}) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 bg-futsal-primary text-white py-4 px-4 flex items-center z-50">
      <div className="w-full max-w-[480px] mx-auto flex items-center">
        {showBackButton && (
          <button 
            onClick={() => navigate(-1)}
            className="mr-4"
            aria-label="Voltar"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        
        <h1 className="text-xl font-bold flex-grow text-center">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default Header;
