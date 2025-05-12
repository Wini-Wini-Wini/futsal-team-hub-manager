
import React from 'react';

interface TabBarProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex justify-around border-b border-futsal-light bg-futsal-secondary/20">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`py-2 px-4 flex-1 text-center ${
            activeTab === index 
              ? 'bg-futsal-primary/20 text-futsal-dark font-semibold border-b-2 border-futsal-primary' 
              : 'text-gray-700'
          }`}
          onClick={() => onTabChange(index)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabBar;
