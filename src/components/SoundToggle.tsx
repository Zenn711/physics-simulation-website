
import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SoundToggleProps {
  soundEnabled: boolean;
  toggleSound: () => void;
}

const SoundToggle: React.FC<SoundToggleProps> = ({ soundEnabled, toggleSound }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSound}
          className="relative h-9 w-9 rounded-full"
        >
          <motion.div
            initial={false}
            animate={{ rotate: soundEnabled ? 0 : 180 }}
            transition={{ duration: 0.3 }}
            className="absolute"
          >
            {soundEnabled ? (
              <Volume2 className="h-[1.2rem] w-[1.2rem] text-cyan-500" />
            ) : (
              <VolumeX className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
            )}
          </motion.div>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default SoundToggle;
