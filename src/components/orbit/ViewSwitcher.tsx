
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Info } from 'lucide-react';

interface ViewSwitcherProps {
  activeView: 'simulation' | 'learn';
  setActiveView: (view: 'simulation' | 'learn') => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">Orbit & Gravity Simulation</h3>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setActiveView('simulation')}
          className={activeView === 'simulation' ? 'bg-secondary' : ''}
        >
          <Globe className="mr-1 h-4 w-4" />
          Simulation
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setActiveView('learn')}
          className={activeView === 'learn' ? 'bg-secondary' : ''}
        >
          <Info className="mr-1 h-4 w-4" />
          Learn
        </Button>
      </div>
    </div>
  );
};

export default ViewSwitcher;
