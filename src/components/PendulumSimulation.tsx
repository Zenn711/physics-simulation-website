
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

function PendulumSimulation() {
    // Simulation parameters
    const [params, setParams] = useState({
        length: 150, // pendulum length (pixels)
        mass: 10,    // mass (visual size)
        gravity: 9.8, // gravitational acceleration (m/s²)
        damping: 0.02, // damping factor
        initialAngle: 30, // initial angle (degrees)
    });
    
    const [angle, setAngle] = useState(params.initialAngle * Math.PI / 180); // Convert to radians
    const [angularVelocity, setAngularVelocity] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [trail, setTrail] = useState([]);
    const [showTrail, setShowTrail] = useState(true);
    
    // Canvas refs
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    
    // Canvas dimensions
    const width = 500;
    const height = 400;
    const origin = { x: width / 2, y: 100 };  // Pivot point for pendulum
    
    // Time step for simulation (seconds)
    const timeStep = 0.016; // ~60fps
    const animationSpeed = 16; // ms - smoother animation
    
    // Reset simulation
    const resetSimulation = () => {
        setAngle(params.initialAngle * Math.PI / 180);
        setAngularVelocity(0);
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
    
    // Physics simulation
    useEffect(() => {
        if (!isRunning) return;
        
        if (animationRef.current) {
            clearInterval(animationRef.current);
        }
        
        animationRef.current = setInterval(() => {
            setTime(prev => prev + timeStep);
            
            setAngle(prevAngle => {
                // Calculate angular acceleration: a = -g*sin(θ)/L - damping*ω
                const angularAcceleration = -(params.gravity / (params.length / 100)) * 
                    Math.sin(prevAngle) - params.damping * angularVelocity;
                
                // Update angular velocity: ω = ω + a*dt
                const newAngularVelocity = angularVelocity + angularAcceleration * timeStep;
                setAngularVelocity(newAngularVelocity);
                
                // Update angle: θ = θ + ω*dt
                const newAngle = prevAngle + newAngularVelocity * timeStep;
                
                // Add to trail
                if (showTrail) {
                    const bobPosition = {
                        x: origin.x + params.length * Math.sin(newAngle),
                        y: origin.y + params.length * Math.cos(newAngle)
                    };
                    setTrail(prev => {
                        const newTrail = [...prev, bobPosition];
                        // Keep trail at a reasonable length
                        return newTrail.slice(Math.max(0, newTrail.length - 100));
                    });
                }
                
                return newAngle;
            });
        }, animationSpeed);
        
        return () => {
            if (animationRef.current) {
                clearInterval(animationRef.current);
            }
        };
    }, [isRunning, angularVelocity, params, showTrail]);
    
    // Calculate pendulum position (for rendering)
    const pendulumX = origin.x + params.length * Math.sin(angle);
    const pendulumY = origin.y + params.length * Math.cos(angle);
    
    // Calculate energy
    const calculateEnergy = () => {
        const L = params.length / 100; // convert pixels to meters
        const m = params.mass;
        const g = params.gravity;
        const h = L * (1 - Math.cos(angle)); // height from lowest point
        
        // Potential energy: PE = mgh
        const potentialEnergy = m * g * h;
        
        // Kinetic energy: KE = 0.5 * m * v²
        // For pendulum, v = L * ω
        const velocity = L * angularVelocity;
        const kineticEnergy = 0.5 * m * velocity * velocity;
        
        const totalEnergy = potentialEnergy + kineticEnergy;
        
        return {
            potential: potentialEnergy.toFixed(2),
            kinetic: kineticEnergy.toFixed(2),
            total: totalEnergy.toFixed(2)
        };
    };
    
    const energy = calculateEnergy();
    
    // Period calculation
    const period = 2 * Math.PI * Math.sqrt(params.length / 100 / params.gravity);
    
    // Handle parameter changes
    const handleLengthChange = (newLength) => {
        setParams(prev => ({ ...prev, length: newLength[0] }));
    };
    
    const handleMassChange = (newMass) => {
        setParams(prev => ({ ...prev, mass: newMass[0] }));
    };
    
    const handleAngleChange = (newAngle) => {
        setParams(prev => ({ ...prev, initialAngle: newAngle[0] }));
    };
    
    const handleDampingChange = (newDamping) => {
        setParams(prev => ({ ...prev, damping: newDamping[0] / 100 }));
    };

    // Toggle simulation
    const toggleSimulation = () => {
        setIsRunning(!isRunning);
    };

    return (
        <div className="flex flex-col items-center w-full p-4 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Pendulum Simulation</h2>
            
            <div className="relative w-full h-[400px] bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg overflow-hidden">
                <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
                    {/* Background grid for reference */}
                    <g opacity="0.1" stroke="currentColor">
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
                        {Array.from({ length: 9 }).map((_, i) => (
                            <line 
                                key={`h-${i}`} 
                                x1="0" 
                                y1={i * (height / 8)} 
                                x2={width} 
                                y2={i * (height / 8)} 
                                strokeWidth="1" 
                            />
                        ))}
                    </g>
                    
                    {/* Pivot support */}
                    <rect x={origin.x - 30} y={origin.y - 80} width="60" height="80" fill="#374151" />
                    <rect x={origin.x - 40} y={origin.y - 85} width="80" height="10" fill="#4B5563" />
                    
                    {/* Pivot point with shadow */}
                    <circle cx={origin.x} cy={origin.y} r="8" fill="#4B5563">
                        <filter id="shadow">
                            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3" />
                        </filter>
                    </circle>
                    <circle cx={origin.x} cy={origin.y} r="6" fill="#374151" filter="url(#shadow)" />
                    
                    {/* Rest position indicator (vertical) */}
                    <line 
                        x1={origin.x} 
                        y1={origin.y} 
                        x2={origin.x} 
                        y2={origin.y + params.length + 30} 
                        stroke="rgba(156, 163, 175, 0.4)" 
                        strokeWidth="1" 
                        strokeDasharray="4"
                    />
                    
                    {/* Pendulum trail */}
                    {showTrail && trail.length > 1 && (
                        <>
                            {/* Add a subtle glow filter for the trail */}
                            <defs>
                                <filter id="trailGlow">
                                    <feGaussianBlur stdDeviation="1.5" result="glow" />
                                    <feMerge>
                                        <feMergeNode in="glow" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            <polyline
                                points={trail.map(p => `${p.x},${p.y}`).join(' ')}
                                fill="none"
                                stroke="rgba(99, 102, 241, 0.5)"
                                strokeWidth="2"
                                filter="url(#trailGlow)"
                            />
                        </>
                    )}
                    
                    {/* Shadow below pendulum (projected onto ground) */}
                    <ellipse 
                        cx={origin.x + Math.sin(angle) * 80} 
                        cy={origin.y + params.length + 30} 
                        rx={Math.sqrt(params.mass) * 4 + 5} 
                        ry={Math.sqrt(params.mass) * 2 + 2} 
                        fill="rgba(0,0,0,0.2)" 
                    />
                    
                    {/* Pendulum string with subtle gradient */}
                    <defs>
                        <linearGradient id="stringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6B7280" />
                            <stop offset="50%" stopColor="#9CA3AF" />
                            <stop offset="100%" stopColor="#6B7280" />
                        </linearGradient>
                    </defs>
                    <line
                        x1={origin.x}
                        y1={origin.y}
                        x2={pendulumX}
                        y2={pendulumY}
                        stroke="url(#stringGradient)"
                        strokeWidth="2"
                    />
                    
                    {/* Pendulum bob with shadow and metallic effect */}
                    <defs>
                        <radialGradient id="bobGradient" cx="40%" cy="40%" r="60%" fx="40%" fy="40%">
                            <stop offset="0%" stopColor="rgba(122, 125, 255, 1)" />
                            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.8)" />
                        </radialGradient>
                        <filter id="bobShadow">
                            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
                        </filter>
                    </defs>
                    <circle
                        cx={pendulumX}
                        cy={pendulumY}
                        r={Math.sqrt(params.mass) * 5}
                        fill="url(#bobGradient)"
                        stroke="#4338ca"
                        strokeWidth="2"
                        filter="url(#bobShadow)"
                    >
                        {/* Add subtle shimmer */}
                        {isRunning && (
                            <animate 
                                attributeName="opacity" 
                                values="1;0.9;1" 
                                dur="1.5s" 
                                repeatCount="indefinite" 
                            />
                        )}
                    </circle>
                    
                    {/* Highlight on the bob */}
                    <circle
                        cx={pendulumX - Math.sqrt(params.mass) * 2}
                        cy={pendulumY - Math.sqrt(params.mass) * 2}
                        r={Math.sqrt(params.mass) * 1.5}
                        fill="rgba(255, 255, 255, 0.3)"
                    />
                    
                    {/* Angle indicator with improved appearance */}
                    <defs>
                        <linearGradient id="angleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(239, 68, 68, 0.7)" />
                            <stop offset="100%" stopColor="rgba(239, 68, 68, 0.2)" />
                        </linearGradient>
                    </defs>
                    <path
                        d={`M ${origin.x},${origin.y} L ${origin.x},${origin.y + 50} A 50 50 0 ${angle > 0 ? 0 : 1} 0 ${origin.x + 50 * Math.sin(angle)},${origin.y + 50 * Math.cos(angle)}`}
                        stroke="url(#angleGradient)"
                        strokeWidth="2"
                        strokeDasharray="4"
                        fill="none"
                    />
                    <text
                        x={origin.x + 30 * Math.sin(angle / 2)}
                        y={origin.y + 30 * Math.cos(angle / 2)}
                        fontSize="14"
                        fill="currentColor"
                        fontWeight="bold"
                    >
                        {Math.abs(angle * 180 / Math.PI).toFixed(0)}°
                    </text>
                    
                    {/* Energy visualization */}
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
                    
                    {/* Stats */}
                    <text x="10" y="30" fontSize="14" fill="currentColor" fontWeight="medium">
                        Time: {time.toFixed(2)} s
                    </text>
                    <text x="10" y="50" fontSize="14" fill="currentColor" fontWeight="medium">
                        Period: {period.toFixed(2)} s
                    </text>
                </svg>
            </div>
            
            <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Length (cm)</span>
                                    <span>{params.length} cm</span>
                                </div>
                                <Slider
                                    defaultValue={[150]}
                                    min={50}
                                    max={250}
                                    step={10}
                                    value={[params.length]}
                                    onValueChange={handleLengthChange}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Mass (kg)</span>
                                    <span>{params.mass} kg</span>
                                </div>
                                <Slider
                                    defaultValue={[10]}
                                    min={1}
                                    max={20}
                                    step={1}
                                    value={[params.mass]}
                                    onValueChange={handleMassChange}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Initial Angle (°)</span>
                                    <span>{params.initialAngle}°</span>
                                </div>
                                <Slider
                                    defaultValue={[30]}
                                    min={0}
                                    max={80}
                                    step={1}
                                    value={[params.initialAngle]}
                                    onValueChange={handleAngleChange}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Damping</span>
                                    <span>{params.damping.toFixed(2)}</span>
                                </div>
                                <Slider
                                    defaultValue={[2]}
                                    min={0}
                                    max={10}
                                    step={1}
                                    value={[params.damping * 100]}
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
                                <p className="text-sm font-medium">Angle</p>
                                <p className="text-lg font-bold">{(angle * 180 / Math.PI).toFixed(1)}°</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                                <p className="text-sm font-medium">Angular Velocity</p>
                                <p className="text-lg font-bold">{angularVelocity.toFixed(2)} rad/s</p>
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
                                onClick={() => setShowTrail(!showTrail)} 
                                variant="outline"
                                size="sm"
                            >
                                {showTrail ? 'Hide Trail' : 'Show Trail'}
                            </Button>
                            
                            <div className="text-sm">
                                <span className="font-medium">Total Energy: </span>
                                <span className="font-bold">{energy.total} J</span>
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

export default PendulumSimulation;
