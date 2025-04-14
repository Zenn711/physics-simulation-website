import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

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
    
    const handleLaunch = ({}) => {
        // This is a fix for the TS2554 error: Expected 1-3 arguments, but got 0
        // Line 196 is modified to pass an argument to handleLaunch()
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
    }, [params, environment, basescale, autoScale, width, height, environments]);
    
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

                const newPosition = { x, y };
                setPosition(newPosition);
                
                if (showTrail) {
                    setTrajectory((prev) => [...prev, newPosition]);
                }

                // Check if projectile has landed (y <= 0)
                if (y <= 0) {
                    setHasLanded(true);
                    clearInterval(animationRef.current);
                    
                    // Calculate landing position
                    const a = 0.5 * currGravity;
                    const b = -vy * (1 - airResistance * newTime);
                    const c = 0;
                    
                    const discriminant = b * b - 4 * a * c;
                    const tLand = (-b - Math.sqrt(discriminant)) / (2 * a);
                    const xLand = vx * tLand * (1 - airResistance * tLand);
                    
                    setPosition({ x: xLand, y: 0 });
                    return newTime;
                }

                return newTime;
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
                    <circle cx={width - 65} cy={height - 45} r="12" fill="#2d6a1e" />
                    <circle cx={width - 30} cy={height - 50} r="10" fill="#2d6a1e" />
                    
                    {/* Clouds */}
                    <circle cx={width/4} cy={30} r="12" fill="rgba(255,255,255,0.7)" />
                    <circle cx={width/4 + 10} cy={25} r="15" fill="rgba(255,255,255,0.7)" />
                    <circle cx={width/4 + 25} cy={30} r="12" fill="rgba(255,255,255,0.7)" />
                    
                    <circle cx={width/2 + 80} cy={50} r="10" fill="rgba(255,255,255,0.7)" />
                    <circle cx={width/2 + 95} cy={45} r="14" fill="rgba(255,255,255,0.7)" />
                </>
            );
        } else if (environment === 'moon') {
            return (
                <>
                    {/* Craters */}
                    <circle cx={width - 150} cy={height - 10} r="20" fill="rgba(100,100,100,0.3)" strokeWidth="2" stroke="rgba(80,80,80,0.5)" />
                    <circle cx={width - 70} cy={height - 5} r="15" fill="rgba(100,100,100,0.3)" strokeWidth="2" stroke="rgba(80,80,80,0.5)" />
                    <circle cx={width/3} cy={height - 8} r="12" fill="rgba(100,100,100,0.3)" strokeWidth="2" stroke="rgba(80,80,80,0.5)" />
                    
                    {/* Stars */}
                    {Array(20).fill().map((_, i) => (
                        <circle 
                            key={i} 
                            cx={Math.random() * width} 
                            cy={Math.random() * (height - 50)} 
                            r={Math.random() * 1.5} 
                            fill="white" 
                        />
                    ))}
                </>
            );
        } else if (environment === 'mars') {
            return (
                <>
                    {/* Mars hills */}
                    <path d="M0,300 C100,270 200,290 300,280 C400,270 500,290 600,300" fill="#b84c32" />
                    
                    {/* Rocks */}
                    <polygon points="150,290 160,275 170,290" fill="#8c3a26" />
                    <polygon points="410,290 425,280 430,290" fill="#8c3a26" />
                    <polygon points="490,290 500,280 510,290" fill="#8c3a26" />
                </>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col items-center w-full p-4">
            <div className="w-full flex flex-wrap items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Projectile Motion Simulator</h2>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => setEnvironment('earth')}
                        className={`px-3 py-1 rounded-md ${environment === 'earth' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                        Earth
                    </button>
                    <button 
                        onClick={() => setEnvironment('moon')}
                        className={`px-3 py-1 rounded-md ${environment === 'moon' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                        Moon
                    </button>
                    <button 
                        onClick={() => setEnvironment('mars')}
                        className={`px-3 py-1 rounded-md ${environment === 'mars' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                        Mars
                    </button>
                </div>
            </div>
            
            <div className={`relative w-full physics-canvas ${environments[environment].background} h-64 md:h-80 rounded-lg shadow-lg overflow-hidden`}>
                <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="mx-auto">
                    {/* Environment terrain */}
                    {generateTerrain()}
                    
                    {/* Ground line */}
                    <line 
                        x1="0" 
                        y1={height} 
                        x2={width} 
                        y2={height} 
                        stroke={environment === 'moon' ? '#aaa' : '#666'} 
                        strokeWidth="2" 
                    />

                    {/* Grid for scale reference */}
                    {autoScale && viewScale !== 1 && (
                        <g opacity="0.2">
                            <text x="10" y="20" fontSize="12" fill="currentColor">
                                Scale: 1:{viewScale.toFixed(1)}
                            </text>
                        </g>
                    )}

                    {/* Trajectory path */}
                    {showTrail && trajectory.length > 1 && (
                        <polyline
                            points={trajectory.map((p) => {
                                const canvasX = toCanvasX(p.x);
                                const canvasY = toCanvasY(Math.max(0, p.y));
                                // Check if point is within canvas
                                if (canvasX >= 0 && canvasX <= width && canvasY >= 0 && canvasY <= height) {
                                    return `${canvasX},${canvasY}`;
                                }
                                return '';
                            }).filter(p => p !== '').join(' ')}
                            fill="none"
                            stroke={environment === 'earth' ? "rgba(59, 130, 246, 0.6)" : 
                                    environment === 'moon' ? "rgba(255, 255, 255, 0.6)" :
                                    "rgba(220, 38, 38, 0.6)"}
                            strokeWidth="2"
                        />
                    )}

                    {/* Angle indicator */}
                    <line
                        x1="0"
                        y1={height}
                        x2={60 * Math.cos(angleRad)}
                        y2={height - 60 * Math.sin(angleRad)}
                        stroke="rgba(239, 68, 68, 0.7)"
                        strokeWidth="2"
                        strokeDasharray="4"
                    />
                    <text x="25" y={height - 30} fontSize="14" fill="currentColor" fontWeight="bold">
                        {params.angle}°
                    </text>

                    {/* Velocity indicator */}
                    <text x="20" y={height - 10} fontSize="12" fill="currentColor">
                        v₀ = {params.velocity} m/s
                    </text>

                    {/* Landing marker - only shown if within canvas */}
                    {hasLanded && toCanvasX(position.x) <= width && (
                        <circle
                            cx={toCanvasX(position.x)}
                            cy={height}
                            r="4"
                            fill="rgba(239, 68, 68, 0.8)"
                        />
                    )}

                    {/* Projectile object */}
                    {toCanvasX(position.x) <= width && toCanvasY(Math.max(0, position.y)) >= 0 && (
                        <circle
                            cx={toCanvasX(position.x)}
                            cy={toCanvasY(Math.max(0, position.y))}
                            r="8"
                            fill={environment === 'earth' ? "rgba(239, 68, 68, 1)" : 
                                environment === 'moon' ? "rgba(200, 200, 200, 1)" : 
                                "rgba(220, 38, 38, 1)"}
                            stroke="white"
                            strokeWidth="1"
                        >
                            {/* Add animation pulse effect */}
                            <animate 
                                attributeName="opacity" 
                                values="1;0.7;1" 
                                dur="1s" 
                                repeatCount="indefinite" 
                                begin={isRunning && !hasLanded ? "0s" : "indefinite"}
                            />
                        </circle>
                    )}

                    {/* Height indicator - only if projectile is visible */}
                    {position.y > 0.5 && toCanvasX(position.x) <= width && (
                        <>
                            <line 
                                x1={toCanvasX(position.x)} 
                                y1={toCanvasY(position.y)} 
                                x2={toCanvasX(position.x)} 
                                y2={height} 
                                stroke="rgba(107, 114, 128, 0.5)" 
                                strokeWidth="1" 
                                strokeDasharray="3"
                            />
                            <text 
                                x={toCanvasX(position.x) + 5} 
                                y={toCanvasY(position.y / 2)} 
                                fontSize="12" 
                                fill="currentColor"
                            >
                                {position.y.toFixed(1)}m
                            </text>
                        </>
                    )}
                </svg>
            </div>
            
            <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Launch Angle (°)</span>
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
                                    <span>Initial Velocity (m/s)</span>
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
                            
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={() => setShowTrail(!showTrail)}
                                    className={`px-3 py-1 text-sm rounded-md ${showTrail ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                                >
                                    {showTrail ? 'Hide Trail' : 'Show Trail'}
                                </button>
                                <button 
                                    onClick={() => setAutoScale(!autoScale)}
                                    className={`px-3 py-1 text-sm rounded-md ${autoScale ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                                >
                                    {autoScale ? 'Auto Scale: ON' : 'Auto Scale: OFF'}
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                                <p className="text-sm font-medium">Environment</p>
                                <p className="text-lg font-bold capitalize">{environment}</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                                <p className="text-sm font-medium">Gravity</p>
                                <p className="text-lg font-bold">{environments[environment].gravity} m/s²</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                                <p className="text-sm font-medium">Max Height</p>
                                <p className="text-lg font-bold">{maxHeight.toFixed(2)} m</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                                <p className="text-sm font-medium">Range</p>
                                <p className="text-lg font-bold">{range.toFixed(2)} m</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div className="flex justify-center space-x-4 mt-6">
                <Button 
                    onClick={toggleSimulation} 
                    variant="outline"
                    size="lg"
                    className="space-x-2"
                >
                    {isRunning ? <Pause size={18} /> : <Play size={18} />}
                    <span>{isRunning ? "Pause" : "Play"}</span>
                </Button>
                
                <Button 
                    onClick={resetSimulation} 
                    variant="outline"
                    size="lg"
                    className="space-x-2"
                >
                    <RefreshCw size={18} />
                    <span>Reset</span>
                </Button>
            </div>
        </div>
    );
}

export default ProjectileSimulation;
