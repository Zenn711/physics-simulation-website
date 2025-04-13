
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function SpringSimulation() {
    // Simulation parameters
    const [params, setParams] = useState({
        springConstant: 5,  // N/m
        mass: 1,           // kg
        initialDisplacement: 50, // pixels
        damping: 0.1       // damping coefficient
    });
    
    const [position, setPosition] = useState(params.initialDisplacement);
    const [velocity, setVelocity] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [trail, setTrail] = useState([]);
    const [showTrail, setShowTrail] = useState(true);
    const [activeTab, setActiveTab] = useState("simulation");
    
    // Animation frames
    const animationRef = useRef(null);
    
    // Canvas dimensions
    const width = 600;
    const height = 300;
    const restPosition = width / 3;  // Spring's rest position
    
    // Time step for simulation (seconds)
    const timeStep = 0.016; // ~60fps
    const animationSpeed = 16; // ms - smoother animation
    
    // Reset simulation
    const resetSimulation = () => {
        setPosition(params.initialDisplacement);
        setVelocity(0);
        setTime(0);
        setTrail([]);
        
        if (animationRef.current) {
            clearInterval(animationRef.current);
            animationRef.current = null;
        }
    };
    
    // Update when parameters change
    useEffect(() => {
        resetSimulation();
    }, [params]);
    
    // Toggle simulation
    const toggleSimulation = () => {
        setIsRunning(!isRunning);
    };
    
    // Physics simulation
    useEffect(() => {
        if (!isRunning) return;
        
        if (animationRef.current) {
            clearInterval(animationRef.current);
        }
        
        animationRef.current = setInterval(() => {
            setTime(prev => prev + timeStep);
            
            setPosition(prevPosition => {
                // Force = -k*x - b*v
                const force = -params.springConstant * prevPosition - params.damping * velocity;
                
                // a = F/m
                const acceleration = force / params.mass;
                
                // v = v + a*dt
                const newVelocity = velocity + acceleration * timeStep;
                setVelocity(newVelocity);
                
                // x = x + v*dt
                const newPosition = prevPosition + newVelocity * timeStep;
                
                // Add to trail
                if (showTrail) {
                    setTrail(prev => {
                        const newTrail = [...prev, { x: time, y: newPosition }];
                        // Keep trail at a reasonable length
                        return newTrail.slice(Math.max(0, newTrail.length - 300));
                    });
                }
                
                return newPosition;
            });
        }, animationSpeed);
        
        return () => {
            if (animationRef.current) {
                clearInterval(animationRef.current);
            }
        };
    }, [isRunning, velocity, params, showTrail, time]);
    
    // Current position of the mass
    const currentPosition = restPosition + position;
    
    // Calculate energy
    const calculateEnergy = () => {
        // Potential energy: PE = 0.5 * k * x²
        const potentialEnergy = 0.5 * params.springConstant * position * position;
        
        // Kinetic energy: KE = 0.5 * m * v²
        const kineticEnergy = 0.5 * params.mass * velocity * velocity;
        
        const totalEnergy = potentialEnergy + kineticEnergy;
        
        return {
            potential: potentialEnergy.toFixed(2),
            kinetic: kineticEnergy.toFixed(2),
            total: totalEnergy.toFixed(2)
        };
    };
    
    const energy = calculateEnergy();
    
    // Period calculation (T = 2π√(m/k))
    const period = 2 * Math.PI * Math.sqrt(params.mass / params.springConstant);
    
    // Handle parameter changes
    const handleSpringConstantChange = (newValue) => {
        setParams(prev => ({ ...prev, springConstant: newValue[0] }));
    };
    
    const handleMassChange = (newValue) => {
        setParams(prev => ({ ...prev, mass: newValue[0] }));
    };
    
    const handleDisplacementChange = (newValue) => {
        setParams(prev => ({ ...prev, initialDisplacement: newValue[0] }));
    };
    
    const handleDampingChange = (newValue) => {
        setParams(prev => ({ ...prev, damping: newValue[0] / 10 }));
    };

    // Function to draw the spring
    const drawSpring = () => {
        const anchorX = 50;
        const anchorY = height / 2;
        const numCoils = 10;
        const coilWidth = 15;
        
        let path = `M ${anchorX} ${anchorY}`;
        
        // Calculate available length for the spring
        const springLength = currentPosition - anchorX - 20; // 20px for buffer
        
        // Each coil needs two control points
        const segmentLength = springLength / (numCoils * 2);
        
        for (let i = 0; i < numCoils * 2; i++) {
            const x = anchorX + (i + 1) * segmentLength;
            const y = anchorY + (i % 2 === 0 ? coilWidth : -coilWidth);
            path += ` L ${x} ${y}`;
        }
        
        // Connect to the mass
        path += ` L ${currentPosition} ${anchorY}`;
        
        return path;
    };

    // Convert trail coordinates for plotting
    const plotX = (x) => 50 + x * 30; // Scale time for display
    const plotY = (y) => height / 2 - y; // Invert y for display (positive upward)

    // Calculate velocity arrow dimensions
    const velocityArrowLength = Math.min(Math.abs(velocity) * 2, 50);
    const velocityArrowDirection = velocity > 0 ? 1 : -1;
    
    // Constrain arrow to always be visible
    const arrowStartX = currentPosition + 15 + params.mass * 2.5;
    const arrowEndX = arrowStartX + velocityArrowLength * velocityArrowDirection;

    return (
        <div className="flex flex-col items-center w-full p-4 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Spring-Mass Simulation</h2>
            
            <Tabs 
                defaultValue="simulation" 
                value={activeTab} 
                onValueChange={setActiveTab} 
                className="w-full"
            >
                <div className="flex justify-between items-center mb-4">
                    <TabsList>
                        <TabsTrigger value="simulation">Simulation</TabsTrigger>
                        <TabsTrigger value="graph">Oscillation Graph</TabsTrigger>
                    </TabsList>
                    
                    <div className="flex space-x-2">
                        <Button 
                            onClick={toggleSimulation} 
                            variant="outline"
                            size="sm"
                            className="space-x-1"
                        >
                            {isRunning ? <Pause size={16} /> : <Play size={16} />}
                            <span>{isRunning ? "Pause" : "Play"}</span>
                        </Button>
                        
                        <Button 
                            onClick={resetSimulation} 
                            variant="outline"
                            size="sm"
                            className="space-x-1"
                        >
                            <RefreshCw size={16} />
                            <span>Reset</span>
                        </Button>
                    </div>
                </div>
                
                <TabsContent value="simulation" className="mt-0">
                    <div className="relative w-full h-[300px] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
                            {/* Background grid */}
                            <g opacity="0.1" stroke="currentColor">
                                {Array.from({ length: 13 }).map((_, i) => (
                                    <line 
                                        key={`v-${i}`} 
                                        x1={i * (width / 12)} 
                                        y1="0" 
                                        x2={i * (width / 12)} 
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
                            
                            {/* Wall with better appearance */}
                            <defs>
                                <linearGradient id="wallGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#4b5563" />
                                    <stop offset="100%" stopColor="#6b7280" />
                                </linearGradient>
                            </defs>
                            <rect x="20" y={height/2 - 60} width="30" height="120" fill="url(#wallGradient)" rx="2">
                                <filter id="wallShadow">
                                    <feDropShadow dx="2" dy="0" stdDeviation="3" floodOpacity="0.3" />
                                </filter>
                            </rect>
                            <rect x="30" y={height/2 - 40} width="10" height="80" fill="#4b5563" rx="1" />
                            
                            {/* Rest position marker */}
                            <line
                                x1={restPosition}
                                y1={height/2 - 40}
                                x2={restPosition}
                                y2={height/2 + 40}
                                stroke="rgba(107, 114, 128, 0.3)"
                                strokeWidth="1"
                                strokeDasharray="4"
                            />
                            <text
                                x={restPosition}
                                y={height/2 - 50}
                                fontSize="12"
                                textAnchor="middle"
                                fill="currentColor"
                            >
                                Rest
                            </text>
                            
                            {/* Displacement indicator */}
                            <line
                                x1={restPosition}
                                y1={height/2 + 30}
                                x2={currentPosition}
                                y2={height/2 + 30}
                                stroke="rgba(239, 68, 68, 0.5)"
                                strokeWidth="1"
                                strokeDasharray="3"
                            />
                            <text
                                x={(restPosition + currentPosition) / 2}
                                y={height/2 + 45}
                                fontSize="12"
                                textAnchor="middle"
                                fill="currentColor"
                            >
                                x = {position.toFixed(1)} px
                            </text>
                            
                            {/* Spring with metallic appearance */}
                            <defs>
                                <linearGradient id="springGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#6b7280" />
                                    <stop offset="50%" stopColor="#9ca3af" />
                                    <stop offset="100%" stopColor="#6b7280" />
                                </linearGradient>
                            </defs>
                            <path
                                d={drawSpring()}
                                fill="none"
                                stroke="url(#springGradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            
                            {/* Mass block with shadow and 3D effect */}
                            <defs>
                                <linearGradient id="blockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="rgba(99, 102, 241, 0.9)" />
                                    <stop offset="100%" stopColor="rgba(79, 82, 221, 0.8)" />
                                </linearGradient>
                                <filter id="blockShadow">
                                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
                                </filter>
                            </defs>
                            <rect
                                x={currentPosition}
                                y={height/2 - 15 - params.mass * 5}
                                width={30 + params.mass * 5}
                                height={30 + params.mass * 10}
                                fill="url(#blockGradient)"
                                stroke="#4338ca"
                                strokeWidth="2"
                                rx="2"
                                filter="url(#blockShadow)"
                            />
                            
                            {/* Highlight on block for 3D effect */}
                            <rect
                                x={currentPosition + 5}
                                y={height/2 - 10 - params.mass * 5}
                                width={20 + params.mass * 3}
                                height={5}
                                fill="rgba(255, 255, 255, 0.3)"
                                rx="1"
                            />
                            
                            {/* Force arrow - only when velocity is significant */}
                            {Math.abs(velocity) > 0.1 && (
                                <g>
                                    <defs>
                                        <marker
                                            id="arrowhead"
                                            markerWidth="10"
                                            markerHeight="7"
                                            refX="0"
                                            refY="3.5"
                                            orient="auto"
                                        >
                                            <polygon
                                                points="0 0, 10 3.5, 0 7"
                                                fill={velocity > 0 ? "rgba(239, 68, 68, 0.8)" : "rgba(52, 211, 153, 0.8)"}
                                            />
                                        </marker>
                                    </defs>
                                    <line
                                        x1={arrowStartX}
                                        y1={height/2}
                                        x2={arrowEndX}
                                        y2={height/2}
                                        stroke={velocity > 0 ? "rgba(239, 68, 68, 0.8)" : "rgba(52, 211, 153, 0.8)"}
                                        strokeWidth="2"
                                        markerEnd="url(#arrowhead)"
                                    />
                                    <text
                                        x={arrowStartX + (arrowEndX - arrowStartX) / 2}
                                        y={height/2 - 10}
                                        fontSize="12"
                                        textAnchor="middle"
                                        fill="currentColor"
                                    >
                                        v = {velocity.toFixed(1)} px/s
                                    </text>
                                </g>
                            )}
                            
                            {/* Energy indicators */}
                            <g transform={`translate(${width - 120}, 20)`}>
                                <rect x="0" y="0" width="100" height="70" rx="5" fill="rgba(243, 244, 246, 0.7)" stroke="rgba(209, 213, 219, 0.8)" />
                                <text x="10" y="20" fontSize="12" fill="#374151">Energy:</text>
                                <rect x="10" y="30" width="80" height="8" rx="2" fill="rgba(209, 213, 219, 0.5)" />
                                <rect x="10" y="30" width={80 * (parseFloat(energy.kinetic) / parseFloat(energy.total))} height="8" rx="2" fill="rgba(59, 130, 246, 0.7)" />
                                <rect x="10" y="45" width="80" height="8" rx="2" fill="rgba(209, 213, 219, 0.5)" />
                                <rect x="10" y="45" width={80 * (parseFloat(energy.potential) / parseFloat(energy.total))} height="8" rx="2" fill="rgba(239, 68, 68, 0.7)" />
                                <text x="10" y="65" fontSize="10" fill="#4B5563">KE</text>
                                <text x="80" y="65" fontSize="10" fill="#4B5563" textAnchor="end">PE</text>
                            </g>
                        </svg>
                    </div>
                </TabsContent>
                
                <TabsContent value="graph" className="mt-0">
                    <div className="w-full h-[300px] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
                            {/* Graph background */}
                            <rect x="0" y="0" width={width} height={height} fill="transparent" />
                            
                            {/* Grid lines */}
                            <g opacity="0.2">
                                {Array.from({ length: 11 }).map((_, i) => (
                                    <line 
                                        key={`v-${i}`} 
                                        x1={50 + i * ((width - 70) / 10)} 
                                        y1="20" 
                                        x2={50 + i * ((width - 70) / 10)} 
                                        y2={height - 40} 
                                        stroke="currentColor" 
                                        strokeWidth="1" 
                                    />
                                ))}
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <line 
                                        key={`h-${i}`} 
                                        x1="50" 
                                        y1={20 + i * ((height - 60) / 8)} 
                                        x2={width - 20} 
                                        y2={20 + i * ((height - 60) / 8)} 
                                        stroke="currentColor" 
                                        strokeWidth="1" 
                                    />
                                ))}
                            </g>
                            
                            {/* Axes */}
                            <line x1="50" y1={height/2} x2={width - 20} y2={height/2} stroke="rgba(107, 114, 128, 0.7)" strokeWidth="1.5" />
                            <line x1="50" y1="20" x2="50" y2={height - 40} stroke="rgba(107, 114, 128, 0.7)" strokeWidth="1.5" />
                            
                            {/* Axis labels */}
                            <text x={width - 15} y={height/2 + 5} fontSize="12" fill="currentColor">t</text>
                            <text x="45" y="15" fontSize="12" textAnchor="end" fill="currentColor">x</text>
                            
                            {/* Time markers */}
                            {Array.from({ length: 6 }).map((_, i) => (
                                <g key={`tm-${i}`}>
                                    <line 
                                        x1={50 + i * ((width - 70) / 5)} 
                                        y1={height/2} 
                                        x2={50 + i * ((width - 70) / 5)} 
                                        y2={height/2 + 5} 
                                        stroke="currentColor" 
                                        strokeWidth="1" 
                                    />
                                    <text 
                                        x={50 + i * ((width - 70) / 5)} 
                                        y={height/2 + 20} 
                                        fontSize="10" 
                                        textAnchor="middle" 
                                        fill="currentColor"
                                    >
                                        {i}s
                                    </text>
                                </g>
                            ))}
                            
                            {/* Zero marker */}
                            <text x="40" y={height/2 + 5} fontSize="10" textAnchor="end" fill="currentColor">0</text>
                            
                            {/* Plot trajectory with gradient */}
                            {trail.length > 1 && (
                                <>
                                    <defs>
                                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.3)" />
                                            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.8)" />
                                        </linearGradient>
                                    </defs>
                                    <polyline
                                        points={trail.map(p => `${plotX(p.x)},${plotY(p.y)}`).join(' ')}
                                        fill="none"
                                        stroke="url(#pathGradient)"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </>
                            )}
                            
                            {/* Current time marker */}
                            {trail.length > 0 && (
                                <circle 
                                    cx={plotX(time)} 
                                    cy={plotY(position)} 
                                    r="4" 
                                    fill="rgba(239, 68, 68, 1)" 
                                    stroke="white" 
                                    strokeWidth="1"
                                />
                            )}
                            
                            {/* Graph annotations */}
                            <text x={width/2} y={height - 10} fontSize="12" textAnchor="middle" fill="currentColor">
                                Time (seconds)
                            </text>
                            <text x="15" y={height/2 - 80} fontSize="12" textAnchor="middle" fill="currentColor" transform="rotate(-90, 15, 150)">
                                Position (pixels)
                            </text>
                            
                            {/* Period marker if we have enough data */}
                            {trail.length > 50 && (
                                <g>
                                    <text x={50 + period * 30} y={30} fontSize="12" fill="rgba(99, 102, 241, 1)">
                                        T = {period.toFixed(2)}s
                                    </text>
                                    <line 
                                        x1={50} 
                                        y1={40} 
                                        x2={50 + period * 30} 
                                        y2={40} 
                                        stroke="rgba(99, 102, 241, 0.6)" 
                                        strokeWidth="1.5" 
                                        strokeDasharray="3,2"
                                    />
                                    <line 
                                        x1={50} 
                                        y1={35} 
                                        x2={50} 
                                        y2={45} 
                                        stroke="rgba(99, 102, 241, 0.6)" 
                                        strokeWidth="1.5" 
                                    />
                                    <line 
                                        x1={50 + period * 30} 
                                        y1={35} 
                                        x2={50 + period * 30} 
                                        y2={45} 
                                        stroke="rgba(99, 102, 241, 0.6)" 
                                        strokeWidth="1.5" 
                                    />
                                </g>
                            )}
                        </svg>
                    </div>
                </TabsContent>
            </Tabs>
            
            <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Spring Constant (N/m)</span>
                                    <span>{params.springConstant} N/m</span>
                                </div>
                                <Slider
                                    defaultValue={[5]}
                                    min={1}
                                    max={20}
                                    step={1}
                                    value={[params.springConstant]}
                                    onValueChange={handleSpringConstantChange}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Mass (kg)</span>
                                    <span>{params.mass} kg</span>
                                </div>
                                <Slider
                                    defaultValue={[1]}
                                    min={0.5}
                                    max={5}
                                    step={0.5}
                                    value={[params.mass]}
                                    onValueChange={handleMassChange}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Initial Displacement (px)</span>
                                    <span>{params.initialDisplacement} px</span>
                                </div>
                                <Slider
                                    defaultValue={[50]}
                                    min={-100}
                                    max={100}
                                    step={10}
                                    value={[params.initialDisplacement]}
                                    onValueChange={handleDisplacementChange}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Damping</span>
                                    <span>{params.damping.toFixed(1)}</span>
                                </div>
                                <Slider
                                    defaultValue={[1]}
                                    min={0}
                                    max={5}
                                    step={0.5}
                                    value={[params.damping * 10]}
                                    onValueChange={handleDampingChange}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                                <p className="text-sm font-medium">Position</p>
                                <p className="text-lg font-bold">{position.toFixed(1)} px</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                                <p className="text-sm font-medium">Velocity</p>
                                <p className="text-lg font-bold">{velocity.toFixed(2)} px/s</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                                <p className="text-sm font-medium">Potential Energy</p>
                                <p className="text-lg font-bold">{energy.potential} J</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                                <p className="text-sm font-medium">Kinetic Energy</p>
                                <p className="text-lg font-bold">{energy.kinetic} J</p>
                            </div>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                            <Button 
                                onClick={() => setActiveTab(activeTab === "simulation" ? "graph" : "simulation")} 
                                variant="outline"
                                size="sm"
                                className="space-x-1"
                            >
                                {activeTab === "simulation" ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                <span>{activeTab === "simulation" ? 'Show Graph' : 'Show Simulation'}</span>
                            </Button>
                            
                            <div className="text-sm">
                                <span className="font-medium">Period: </span>
                                <span className="font-bold">{period.toFixed(2)} s</span>
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

export default SpringSimulation;
