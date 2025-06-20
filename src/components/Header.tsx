
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  rightElement?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBackButton = false,
  showHomeButton = false,
  rightElement
}) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 bg-futsal-primary text-white py-4 px-4 flex items-center z-50 max-w-[480px] mx-auto">
      {showBackButton && (
        <button 
          onClick={() => navigate(-1)}
          className="mr-4"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
      )}
      
      {showHomeButton && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="mr-4 text-white hover:text-white hover:bg-futsal-primary/80"
          aria-label="Ir para Home"
        >
          <Home size={24} />
        </Button>
      )}
      
      <h1 className="text-xl font-bold flex-grow text-center">
        {title}
      </h1>
      
      {rightElement && (
        <div className="ml-auto">
          {rightElement}
        </div>
      )}
    </header>
  );
};

export default Header;
