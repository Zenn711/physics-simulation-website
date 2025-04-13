import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

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
    
    // Animation frames
    const animationRef = useRef(null);
    
    // Canvas dimensions
    const width = 600;
    const height = 300;
    const restPosition = width / 3;  // Spring's rest position
    
    // Time step for simulation (seconds)
    const timeStep = 0.01;
    const animationSpeed = 20; // ms
    
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
                    const currentPositionX = restPosition + newPosition;
                    const currentPositionY = height / 2;
                    
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
    const plotX = (x) => 50 + x * 40; // Scale time for display
    const plotY = (y) => height / 2 - y; // Invert y for display (positive upward)

    return (
        <div className="flex flex-col items-center w-full p-4 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Spring-Mass Simulation</h2>
            
            <div className="relative w-full h-[300px] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg overflow-hidden">
                <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
                    {/* Background */}
                    <rect x="0" y="0" width={width} height={height} fill="transparent" />
                    
                    {/* Wall */}
                    <rect x="20" y={height/2 - 60} width="30" height="120" fill="#6b7280" rx="2" />
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
                    
                    {/* Spring */}
                    <path
                        d={drawSpring()}
                        fill="none"
                        stroke="#4b5563"
                        strokeWidth="2"
                    />
                    
                    {/* Mass block */}
                    <rect
                        x={currentPosition}
                        y={height/2 - 15 - params.mass * 5}
                        width={30 + params.mass * 5}
                        height={30 + params.mass * 10}
                        fill="rgba(99, 102, 241, 0.8)"
                        stroke="#4338ca"
                        strokeWidth="2"
                        rx="2"
                    />
                    
                    {/* Force arrow (if moving) */}
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
                                x1={currentPosition + 15 + params.mass * 2.5}
                                y1={height/2}
                                x2={currentPosition + 15 + params.mass * 2.5 + velocity * 5}
                                y2={height/2}
                                stroke={velocity > 0 ? "rgba(239, 68, 68, 0.8)" : "rgba(52, 211, 153, 0.8)"}
                                strokeWidth="2"
                                markerEnd="url(#arrowhead)"
                            />
                            <text
                                x={currentPosition + 15 + params.mass * 2.5 + velocity * 2.5}
                                y={height/2 - 10}
                                fontSize="12"
                                textAnchor="middle"
                                fill="currentColor"
                            >
                                v = {velocity.toFixed(1)} px/s
                            </text>
                        </g>
                    )}
                </svg>
            </div>
            
            {/* Oscillation graph */}
            {showTrail && trail.length > 1 && (
                <div className="w-full h-[150px] mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <svg width={width} height="150" viewBox={`0 0 ${width} 150`} className="mx-auto">
                        {/* Axes */}
                        <line x1="50" y1="75" x2={width - 20} y2="75" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="1" />
                        <line x1="50" y1="20" x2="50" y2="130" stroke="rgba(107, 114, 128, 0.5)" strokeWidth="1" />
                        
                        {/* Labels */}
                        <text x={width - 15} y="75" fontSize="12" fill="currentColor">t</text>
                        <text x="45" y="15" fontSize="12" fill="currentColor">x</text>
                        
                        {/* Plot trajectory */}
                        <polyline
                            points={trail.map(p => `${plotX(p.x)},${plotY(p.y)}`).join(' ')}
                            fill="none"
                            stroke="rgba(99, 102, 241, 0.8)"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
            )}
            
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
                                onClick={() => setShowTrail(!showTrail)} 
                                variant="outline"
                                size="sm"
                            >
                                {showTrail ? 'Hide Oscillation Graph' : 'Show Oscillation Graph'}
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

export default SpringSimulation;
