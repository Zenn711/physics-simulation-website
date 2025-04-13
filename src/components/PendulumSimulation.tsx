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
    const timeStep = 0.01; 
    const animationSpeed = 20; // ms
    
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

    return (
        <div className="flex flex-col items-center w-full p-4 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Pendulum Simulation</h2>
            
            <div className="relative w-full h-[400px] bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg overflow-hidden">
                <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
                    {/* Background */}
                    <rect x="0" y="0" width={width} height={height} fill="transparent" />
                    
                    {/* Pivot point */}
                    <circle cx={origin.x} cy={origin.y} r="6" fill="#374151" />
                    
                    {/* Pendulum trail */}
                    {showTrail && trail.length > 1 && (
                        <polyline
                            points={trail.map(p => `${p.x},${p.y}`).join(' ')}
                            fill="none"
                            stroke="rgba(99, 102, 241, 0.3)"
                            strokeWidth="2"
                        />
                    )}
                    
                    {/* Pendulum string */}
                    <line
                        x1={origin.x}
                        y1={origin.y}
                        x2={pendulumX}
                        y2={pendulumY}
                        stroke="#374151"
                        strokeWidth="2"
                    />
                    
                    {/* Pendulum bob */}
                    <circle
                        cx={pendulumX}
                        cy={pendulumY}
                        r={Math.sqrt(params.mass) * 5}
                        fill="rgba(99, 102, 241, 0.8)"
                        stroke="#4338ca"
                        strokeWidth="2"
                    />
                    
                    {/* Angle indicator */}
                    <path
                        d={`M ${origin.x},${origin.y} L ${origin.x},${origin.y + 50} A 50 50 0 ${angle > 0 ? 0 : 1} 0 ${origin.x + 50 * Math.sin(angle)},${origin.y + 50 * Math.cos(angle)}`}
                        stroke="rgba(239, 68, 68, 0.5)"
                        strokeWidth="2"
                        strokeDasharray="3"
                        fill="none"
                    />
                    <text
                        x={origin.x + 30 * Math.sin(angle / 2)}
                        y={origin.y + 30 * Math.cos(angle / 2)}
                        fontSize="14"
                        fill="currentColor"
                    >
                        {Math.abs(angle * 180 / Math.PI).toFixed(0)}°
                    </text>
                    
                    {/* Stats */}
                    <text x="10" y="30" fontSize="14" fill="currentColor">
                        Time: {time.toFixed(2)} s
                    </text>
                    <text x="10" y="50" fontSize="14" fill="currentColor">
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
                    onClick={() => setIsRunning(!isRunning)} 
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
