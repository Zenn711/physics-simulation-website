import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
    Play,
    Pause,
    RotateCcw as RefreshCw,
    Info
} from 'lucide-react';
import { useToast, toast } from '@/hooks/use-toast';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

function ProjectileSimulation() {
    // Simulation parameters
    const [params, setParams] = useState({
        angle: 45,
        velocity: 20
    });
    
    const [isRunning, setIsRunning] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [time, setTime] = useState(0);
    const [trajectory, setTrajectory] = useState([{ x: 0, y: 0 }]);
    const [hasLanded, setHasLanded] = useState(false);
    
    // Environment and visual settings
    const [environment, setEnvironment] = useState('earth');
    const environments = useMemo(() => ({
        earth: { gravity: 9.8, airResistance: 0.02, background: 'bg-gradient-to-b from-blue-300 to-blue-100 dark:from-blue-900 dark:to-blue-800' },
        moon: { gravity: 1.62, airResistance: 0, background: 'bg-gradient-to-b from-gray-500 to-gray-300 dark:from-gray-800 dark:to-gray-700' },
        mars: { gravity: 3.72, airResistance: 0.01, background: 'bg-gradient-to-b from-red-300 to-red-200 dark:from-red-900 dark:to-red-800' }
    }), []);
    
    // Visual settings
    const [showTrail, setShowTrail] = useState(true);
    const [autoScale, setAutoScale] = useState(true);
    const [viewScale, setViewScale] = useState(1);
    
    // Canvas properties
    const width = 600;
    const height = 300;
    const basescale = 20; // Base pixels per meter
    
    // Animation settings
    const timeStep = 0.05;
    const animationSpeed = 30; // ms
    
    // Animation reference
    const animationRef = useRef(null);
    const maxTrajectoryRef = useRef({ maxX: 0, maxY: 0 });
    
    // Reset simulation
    const resetSimulation = () => {
        setIsRunning(false);
        setTime(0);
        setPosition({ x: 0, y: 0 });
        setTrajectory([{ x: 0, y: 0 }]);
        setHasLanded(false);
        
        if (animationRef.current) {
            clearInterval(animationRef.current);
            animationRef.current = null;
        }
    };
    
    // Handle parameter changes
    const handleAngleChange = (newValue) => {
        setParams(prev => ({ ...prev, angle: newValue[0] }));
    };
    
    const handleVelocityChange = (newValue) => {
        setParams(prev => ({ ...prev, velocity: newValue[0] }));
    };
    
    const handleLaunch = (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement> = {} as React.MouseEvent<HTMLButtonElement>) => {
        if (event && 'preventDefault' in event) {
            event.preventDefault();
        }
        
        setIsRunning(true);
        setHasLanded(false);
        resetSimulation();
    };
    
    // Toggle simulation state
    const toggleSimulation = () => {
        setIsRunning(!isRunning);
    };
    
    // Calculate maximum trajectory
    useEffect(() => {
        if (autoScale) {
            // Calculate expected range and max height for auto-scaling
            const angleRad = params.angle * Math.PI / 180;
            const currGravity = environments[environment].gravity;
            const maxHeight = (params.velocity * params.velocity * Math.sin(angleRad) * Math.sin(angleRad)) / (2 * currGravity);
            const range = (params.velocity * params.velocity * Math.sin(2 * angleRad)) / currGravity;
            
            maxTrajectoryRef.current = { maxX: range, maxY: maxHeight };
            
            // Calculate suitable scale factor to keep trajectory in view
            const xScale = range > 0 ? (width * 0.8) / (range * basescale) : 1;
            const yScale = maxHeight > 0 ? (height * 0.8) / (maxHeight * basescale) : 1;
            
            // Use the more restrictive scale (smaller value)
            const newScale = Math.min(xScale, yScale, 1);
            setViewScale(newScale > 0 ? 1/newScale : 1);
        }
    }, [params, environment, basescale, width, height, environments]);
    
    // Animation logic
    useEffect(() => {
        if (!isRunning || hasLanded) return;
    
        if (animationRef.current) {
            clearInterval(animationRef.current);
        }
    
        animationRef.current = setInterval(() => {
            setTime((prev) => {
                const newTime = prev + timeStep;

                // Calculate projectile motion with environment effects
                const angleRad = params.angle * Math.PI / 180;
                const vx = params.velocity * Math.cos(angleRad);
                const vy = params.velocity * Math.sin(angleRad);
                
                const currGravity = environments[environment].gravity;
                const airResistance = environments[environment].airResistance;
                
                // Apply simple air resistance model
                const x = vx * newTime * (1 - airResistance * newTime);
                const y = vy * newTime * (1 - airResistance * newTime) - 0.5 * currGravity * newTime * newTime;

                // FIX: Check if projectile would go below ground in this update
                if (y <= 0) {
                    // Calculate exact landing position and time
                    // Solving the quadratic equation for time when y = 0
                    const a = 0.5 * currGravity;
                    const b = -vy * (1 - airResistance * newTime);
                    const c = 0;
                    
                    const discriminant = b * b - 4 * a * c;
                    const tLand = (-b - Math.sqrt(discriminant)) / (2 * a);
                    
                    // Calculate x position at landing time
                    const xLand = vx * tLand * (1 - airResistance * tLand);
                    
                    // Set position exactly at ground level
                    setPosition({ x: xLand, y: 0 });
                    setHasLanded(true);
                    clearInterval(animationRef.current);
                    
                    // Add landing position to trajectory if showing trail
                    if (showTrail) {
                        setTrajectory(prev => [...prev, { x: xLand, y: 0 }]);
                    }
                    
                    return tLand; // Update time to exact landing time
                } else {
                    // Normal position update
                    const newPosition = { x, y };
                    setPosition(newPosition);
                    
                    if (showTrail) {
                        setTrajectory(prev => [...prev, newPosition]);
                    }
                    
                    return newTime;
                }
            });
        }, animationSpeed);

        return () => {
            if (animationRef.current) {
                clearInterval(animationRef.current);
            }
        };
    }, [isRunning, params, hasLanded, environment, showTrail, environments]);
    
    // Convert coordinates to canvas space with auto-scaling
    const scale = basescale / viewScale;
    const toCanvasX = (x) => Math.min(width, (x * scale) % (width * 2));
    const toCanvasY = (y) => height - (y * scale);
    
    // Calculate trajectory metrics
    const angleRad = params.angle * Math.PI / 180;
    const currGravity = environments[environment].gravity;
    const maxHeight = (params.velocity * params.velocity * Math.sin(angleRad) * Math.sin(angleRad)) / (2 * currGravity);
    const range = (params.velocity * params.velocity * Math.sin(2 * angleRad)) / currGravity;
    
    // Generate some terrain features
    const generateTerrain = () => {
        if (environment === 'earth') {
            return (
                <>
                    <rect x={width - 80} y={height - 30} width="80" height="30" fill="#4b7b2a" />
                    <rect x={width - 50} y={height - 40} width="30" height="10" fill="#4b7b2a" />
                    
                    {/* Trees */}
                    <path d="M 530,270 L 540,240 L 550,270 Z" fill="#2d4f16" />
                    <rect x={538} y={270} width="5" height="10" fill="#3d341b" />
                    
                    <path d="M 565,270 L 575,230 L 585,270 Z" fill="#2d4f16" />
                    <rect x={572} y={270} width="5" height="10" fill="#3d341b" />
                </>
            );
        } else if (environment === 'moon') {
            return (
                <>
                    {/* Moon craters */}
                    <circle cx={width - 70} cy={height - 10} r="20" fill="#808080" stroke="#707070" />
                    <circle cx={width - 100} cy={height - 20} r="15" fill="#808080" stroke="#707070" />
                    <circle cx={width - 40} cy={height - 15} r="10" fill="#808080" stroke="#707070" />
                </>
            );
        } else if (environment === 'mars') {
            return (
                <>
                    {/* Mars rocks */}
                    <path d="M 520,280 L 530,270 L 545,275 L 540,290 L 525,295 Z" fill="#963a2d" />
                    <path d="M 560,270 L 580,265 L 590,280 L 575,290 Z" fill="#963a2d" />
                    <circle cx={width - 50} cy={height - 10} r="8" fill="#7a3326" />
                </>
            );
        }
        return null;
    };
    
    return (
        <div className="flex flex-col items-center w-full p-4">
            <h2 className="text-xl font-bold mb-4">Projectile Motion Simulator</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="md:col-span-2">
                    <Card className="bg-gray-50 dark:bg-gray-900">
                        <CardContent className="p-4">
                            {/* Simulation Canvas */}
                            <div className={`w-full h-[300px] relative rounded-lg overflow-hidden ${environments[environment].background}`}>
                                <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
                                    {/* Background grid */}
                                    <g opacity="0.2" stroke="currentColor">
                                        {Array.from({ length: 11 }).map((_, i) => (
                                            <line 
                                                key={`v-${i}`} 
                                                x1={i * (width / 10)} 
                                                y1="0" 
                                                x2={i * (width / 10)} 
                                                y2={height} 
                                                strokeWidth="1" 
                                            />
                                        ))}
                                        {Array.from({ length: 7 }).map((_, i) => (
                                            <line 
                                                key={`h-${i}`} 
                                                x1="0" 
                                                y1={i * (height / 6)} 
                                                x2={width} 
                                                y2={i * (height / 6)} 
                                                strokeWidth="1" 
                                            />
                                        ))}
                                    </g>
                                    
                                    {/* Terrain */}
                                    {generateTerrain()}
                                    
                                    {/* Ground */}
                                    <rect x="0" y={height - 20} width={width} height="20" fill={
                                        environment === 'earth' ? "#8b5e3c" : 
                                        environment === 'moon' ? "#c2c2c2" : 
                                        "#d17f64"
                                    } />
                                    <line x1="0" y1={height - 20} x2={width} y2={height - 20} strokeWidth="2" stroke="#333333" />
                                    
                                    {/* Launcher */}
                                    <rect x="10" y={height - 40} width="15" height="20" fill="#555555" />
                                    <line 
                                        x1="18" 
                                        y1={height - 40} 
                                        x2={18 + Math.cos(angleRad) * 40}
                                        y2={height - 40 - Math.sin(angleRad) * 40} 
                                        strokeWidth="4" 
                                        stroke="#777777" 
                                    />
                                    
                                    {/* Projectile trajectory */}
                                    {showTrail && trajectory.length > 1 && (
                                        <polyline
                                            points={trajectory.map(p => `${toCanvasX(p.x)},${toCanvasY(p.y)}`).join(' ')}
                                            fill="none"
                                            stroke="rgba(255, 255, 255, 0.7)"
                                            strokeWidth="2"
                                            strokeDasharray="4"
                                        />
                                    )}
                                    
                                    {/* Projectile */}
                                    <circle 
                                        cx={toCanvasX(position.x)} 
                                        cy={toCanvasY(position.y)} 
                                        r="8" 
                                        fill="red" 
                                        stroke="white" 
                                        strokeWidth="2" 
                                    />
                                    
                                    {/* Position readouts */}
                                    <g className="stats-box">
                                        <rect x="10" y="10" width="160" height="70" rx="5" fill="rgba(0, 0, 0, 0.5)" />
                                        <text x="20" y="30" fill="white" fontSize="12">Time: {time.toFixed(2)}s</text>
                                        <text x="20" y="50" fill="white" fontSize="12">Distance: {position.x.toFixed(2)}m</text>
                                        <text x="20" y="70" fill="white" fontSize="12">Height: {Math.max(0, position.y.toFixed(2))}m</text>
                                    </g>
                                </svg>
                            </div>
                            
                            {/* Control buttons */}
                            <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
                                <div className="flex flex-wrap gap-2">
                                    <Button 
                                        onClick={toggleSimulation} 
                                        variant="outline"
                                        className="border-gray-700 hover:bg-gray-700"
                                    >
                                        {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                                        {isRunning ? 'Pause' : 'Play'}
                                    </Button>
                                    
                                    <Button 
                                        onClick={resetSimulation}
                                        variant="outline"
                                        className="border-gray-700 hover:bg-gray-700"
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Reset
                                    </Button>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        onClick={() => setShowTrail(!showTrail)}
                                        variant={showTrail ? "secondary" : "outline"}
                                        className={`border-gray-700 ${showTrail ? "bg-gray-700 hover:bg-gray-600" : "hover:bg-gray-700"}`}
                                    >
                                        {showTrail ? 'Hide Trail' : 'Show Trail'}
                                    </Button>
                                    
                                    <Button
                                        onClick={() => setAutoScale(!autoScale)}
                                        variant={autoScale ? "secondary" : "outline"}
                                        className={`border-gray-700 ${autoScale ? "bg-gray-700 hover:bg-gray-600" : "hover:bg-gray-700"}`}
                                    >
                                        Auto Scale: {autoScale ? 'ON' : 'OFF'}
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Environment selector */}
                            <div className="flex flex-wrap gap-2 mt-4 justify-center">
                                <Button 
                                    onClick={() => setEnvironment('earth')}
                                    variant={environment === 'earth' ? "secondary" : "outline"}
                                    className={`border-gray-700 ${environment === 'earth' ? "bg-gray-700 hover:bg-gray-600" : "hover:bg-gray-700"}`}
                                >
                                    Earth
                                </Button>
                                <Button 
                                    onClick={() => setEnvironment('moon')}
                                    variant={environment === 'moon' ? "secondary" : "outline"}
                                    className={`border-gray-700 ${environment === 'moon' ? "bg-gray-700 hover:bg-gray-600" : "hover:bg-gray-700"}`}
                                >
                                    Moon
                                </Button>
                                <Button 
                                    onClick={() => setEnvironment('mars')}
                                    variant={environment === 'mars' ? "secondary" : "outline"}
                                    className={`border-gray-700 ${environment === 'mars' ? "bg-gray-700 hover:bg-gray-600" : "hover:bg-gray-700"}`}
                                >
                                    Mars
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                <div>
                    <Card className="bg-gray-50 dark:bg-gray-900">
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-semibold mb-4">Launch Parameters</h3>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Launch Angle</span>
                                        <span>{params.angle}°</span>
                                    </div>
                                    <Slider
                                        defaultValue={[45]}
                                        min={0}
                                        max={90}
                                        step={1}
                                        value={[params.angle]}
                                        onValueChange={handleAngleChange}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Initial Velocity</span>
                                        <span>{params.velocity} m/s</span>
                                    </div>
                                    <Slider
                                        defaultValue={[20]}
                                        min={5}
                                        max={50}
                                        step={1}
                                        value={[params.velocity]}
                                        onValueChange={handleVelocityChange}
                                    />
                                </div>
                                
                                <Button onClick={handleLaunch} className="w-full">
                                    Launch
                                </Button>
                            </div>
                            
                            <div className="mt-6 space-y-4">
                                <h4 className="text-md font-medium">Trajectory Info</h4>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-md">
                                        <p className="text-sm font-medium">Max Height</p>
                                        <p className="text-lg font-bold">{maxHeight.toFixed(2)} m</p>
                                    </div>
                                    <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-md">
                                        <p className="text-sm font-medium">Range</p>
                                        <p className="text-lg font-bold">{range.toFixed(2)} m</p>
                                    </div>
                                    <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-md">
                                        <p className="text-sm font-medium">Gravity</p>
                                        <p className="text-lg font-bold">{environments[environment].gravity} m/s²</p>
                                    </div>
                                    <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-md">
                                        <p className="text-sm font-medium">Air Resistance</p>
                                        <p className="text-lg font-bold">{environments[environment].airResistance}</p>
                                    </div>
                                </div>
                                
                                <div className="mt-4 p-3 bg-gray-200 dark:bg-gray-800 rounded-md">
                                    <p className="text-sm font-medium mb-1">Optimal angle for max range: 45°</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        (without air resistance)
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default ProjectileSimulation;
