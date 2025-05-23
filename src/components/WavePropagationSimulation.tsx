
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { PlayCircle, PauseCircle, RotateCcw, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';

const WavePropagationSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [amplitude, setAmplitude] = useState(50);
  const [frequency, setFrequency] = useState(1);
  const [waveSpeed, setWaveSpeed] = useState(2);
  const [damping, setDamping] = useState(0);
  
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = 0; // Start muted
      gainNode.connect(audioContextRef.current.destination);
      gainNodeRef.current = gainNode;
      
      const oscillator = audioContextRef.current.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = Math.min(220 * frequency, 1000); // Base frequency with limit
      oscillator.connect(gainNode);
      oscillator.start();
      oscillatorRef.current = oscillator;
    }
    
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Update oscillator frequency when frequency changes
  useEffect(() => {
    if (oscillatorRef.current) {
      // Cap the audio frequency to avoid very high pitched sounds
      oscillatorRef.current.frequency.value = Math.min(220 * frequency, 1000);
    }
  }, [frequency]);

  // Handle play/pause sound
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isPlaying ? 0.1 : 0;
    }
  }, [isPlaying]);
  
  // Animation function
  const animate = (timestamp: number) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Calculate time delta
    const deltaTime = timestamp - timeRef.current;
    timeRef.current = timestamp;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate wave parameters
    const time = timestamp / 1000;
    const centerY = canvas.height / 2;
    const maxAmplitude = (amplitude / 100) * centerY * 0.8;
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
    
    // Draw wave
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'hsl(var(--primary))';
    
    const segments = Math.min(200, Math.max(100, frequency * 50)); // Adaptive segments based on frequency
    const segmentWidth = canvas.width / segments;
    
    for (let i = 0; i <= segments; i++) {
      const x = i * segmentWidth;
      const wavePos = (x / canvas.width) - (time * waveSpeed * 0.2);
      const dampingFactor = Math.exp(-damping * wavePos * 0.5);
      const y = centerY - maxAmplitude * Math.sin(frequency * 10 * wavePos * Math.PI) * dampingFactor;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Draw particles on the wave (fewer at higher frequencies)
    const particleCount = Math.max(6, Math.min(12, 20 / frequency));
    const particleSpacing = canvas.width / particleCount;
    
    for (let i = 0; i < particleCount; i++) {
      const x = i * particleSpacing;
      const wavePos = (x / canvas.width) - (time * waveSpeed * 0.2);
      const dampingFactor = Math.exp(-damping * wavePos * 0.5);
      const y = centerY - maxAmplitude * Math.sin(frequency * 10 * wavePos * Math.PI) * dampingFactor;
      
      ctx.beginPath();
      ctx.fillStyle = 'hsl(var(--primary))';
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow effect
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.fill();
    }
    
    // Continue animation if playing
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };
  
  // Re-render the wave even when not playing (for parameter changes)
  const renderStatic = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerY = canvas.height / 2;
    const maxAmplitude = (amplitude / 100) * centerY * 0.8;
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
    
    // Draw wave
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'hsl(var(--primary))';
    
    const segments = Math.min(200, Math.max(100, frequency * 50));
    const segmentWidth = canvas.width / segments;
    
    for (let i = 0; i <= segments; i++) {
      const x = i * segmentWidth;
      const wavePos = x / canvas.width;
      const dampingFactor = Math.exp(-damping * wavePos * 0.5);
      const y = centerY - maxAmplitude * Math.sin(frequency * 10 * wavePos * Math.PI) * dampingFactor;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Draw particles on the wave
    const particleCount = Math.max(6, Math.min(12, 20 / frequency));
    const particleSpacing = canvas.width / particleCount;
    
    for (let i = 0; i < particleCount; i++) {
      const x = i * particleSpacing;
      const wavePos = x / canvas.width;
      const dampingFactor = Math.exp(-damping * wavePos * 0.5);
      const y = centerY - maxAmplitude * Math.sin(frequency * 10 * wavePos * Math.PI) * dampingFactor;
      
      ctx.beginPath();
      ctx.fillStyle = 'hsl(var(--primary))';
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow effect
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.fill();
    }
  };
  
  // Update animation when parameters change
  useEffect(() => {
    if (isPlaying) {
      // If animation is already running, it will update automatically
    } else {
      // If not playing, render a static update
      renderStatic();
    }
  }, [amplitude, frequency, waveSpeed, damping]);
  
  // Start/stop animation when isPlaying changes
  useEffect(() => {
    if (isPlaying) {
      timeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationRef.current);
      renderStatic(); // Render static wave when paused
    }
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const container = canvas.parentElement;
        if (container) {
          canvas.width = container.clientWidth;
          canvas.height = 400;
          
          // Re-render when resized
          if (isPlaying) {
            // Animation will update automatically
          } else {
            renderStatic();
          }
        }
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying, amplitude, frequency, waveSpeed, damping]);
  
  // Reset the simulation
  const handleReset = () => {
    setIsPlaying(false);
    setAmplitude(50);
    setFrequency(1);
    setWaveSpeed(2);
    setDamping(0);
    
    // Redraw canvas in reset state
    setTimeout(() => renderStatic(), 50);
  };
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Direct input handlers for precise control
  const handleFrequencyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setFrequency(Math.min(Math.max(0.1, value), 50));
    }
  };

  const handleAmplitudeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setAmplitude(Math.min(Math.max(0, value), 100));
    }
  };

  const handleWaveSpeedInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setWaveSpeed(Math.min(Math.max(0.1, value), 10));
    }
  };

  const handleDampingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setDamping(Math.min(Math.max(0, value), 1));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardContent className="p-6">
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
              <canvas 
                ref={canvasRef}
                className="w-full h-full bg-background border border-border rounded-lg"
              />
            </div>
            
            <div className="flex justify-center mt-4 space-x-4">
              <Button
                onClick={togglePlay}
                variant="outline"
                className="flex items-center gap-2"
                aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
              >
                {isPlaying ? (
                  <>
                    <PauseCircle className="h-5 w-5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-5 w-5" />
                    <span>Play</span>
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex items-center gap-2"
                aria-label="Reset simulation"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Reset</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card className="h-full">
          <CardContent className="p-6 space-y-6">
            <h3 className="text-xl font-semibold mb-4">Wave Parameters</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amplitude" className="flex items-center">
                    Amplitude
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Controls the height of the wave</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="flex items-center">
                    <Input 
                      id="amplitude-input"
                      type="number"
                      value={amplitude}
                      onChange={handleAmplitudeInput}
                      className="w-16 h-8 text-right mr-2"
                      min={0}
                      max={100}
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <Slider
                  id="amplitude"
                  value={[amplitude]}
                  onValueChange={(value) => setAmplitude(value[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="frequency" className="flex items-center">
                    Frequency
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Controls how many waves appear (0.1-50 Hz)</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="flex items-center">
                    <Input 
                      id="frequency-input"
                      type="number"
                      value={frequency}
                      onChange={handleFrequencyInput}
                      className="w-16 h-8 text-right mr-2"
                      step={0.1}
                      min={0.1}
                      max={50}
                    />
                    <span className="text-sm text-muted-foreground">Hz</span>
                  </div>
                </div>
                <Slider
                  id="frequency"
                  value={[frequency]}
                  onValueChange={(value) => setFrequency(value[0])}
                  min={0.1}
                  max={50}
                  step={0.1}
                  className="cursor-pointer"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="waveSpeed" className="flex items-center">
                    Wave Speed
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Controls how fast the wave propagates</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="flex items-center">
                    <Input 
                      id="waveSpeed-input"
                      type="number"
                      value={waveSpeed}
                      onChange={handleWaveSpeedInput}
                      className="w-16 h-8 text-right mr-2"
                      step={0.1}
                      min={0.1}
                      max={10}
                    />
                    <span className="text-sm text-muted-foreground">×</span>
                  </div>
                </div>
                <Slider
                  id="waveSpeed"
                  value={[waveSpeed]}
                  onValueChange={(value) => setWaveSpeed(value[0])}
                  min={0.1}
                  max={10}
                  step={0.1}
                  className="cursor-pointer"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="damping" className="flex items-center">
                    Damping
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Controls how quickly the wave loses energy</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="flex items-center">
                    <Input 
                      id="damping-input"
                      type="number"
                      value={damping}
                      onChange={handleDampingInput}
                      className="w-16 h-8 text-right mr-2"
                      step={0.01}
                      min={0}
                      max={1}
                    />
                  </div>
                </div>
                <Slider
                  id="damping"
                  value={[damping]}
                  onValueChange={(value) => setDamping(value[0])}
                  min={0}
                  max={1}
                  step={0.01}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WavePropagationSimulation;
