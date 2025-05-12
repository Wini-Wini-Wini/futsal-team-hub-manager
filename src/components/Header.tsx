
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBackButton = false,
  rightElement
}) => {
  const navigate = useNavigate();

  return (
    <header className="bg-futsal-primary text-white py-4 px-4 flex items-center">
      {showBackButton && (
        <button 
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft size={24} />
        </button>
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
