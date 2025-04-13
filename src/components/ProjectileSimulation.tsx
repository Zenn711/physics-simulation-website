
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
    
    // Reset simulation
    const resetSimulation = () => {
        setIsRunning(false);
        // Add reset logic here
    };
    
    // Handle parameter changes
    const handleAngleChange = (newValue) => {
        setParams(prev => ({ ...prev, angle: newValue[0] }));
    };
    
    const handleVelocityChange = (newValue) => {
        setParams(prev => ({ ...prev, velocity: newValue[0] }));
    };
    
    // Toggle simulation state
    const toggleSimulation = () => {
        setIsRunning(!isRunning);
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
            
            <div className={`relative w-full physics-canvas ${environments[environment].background}`}>
                {/* Canvas content will be rendered here */}
                <svg width="100%" height="100%" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
                    {/* Placeholder for the simulation content */}
                    <text x="300" y="150" fontSize="16" fill="currentColor" textAnchor="middle">
                        {isRunning ? "Simulation Running" : "Press Play to Start Simulation"}
                    </text>
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
                                <p className="text-sm font-medium">Air Resistance</p>
                                <p className="text-lg font-bold">{environments[environment].airResistance > 0 ? 'Present' : 'None'}</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                                <p className="text-sm font-medium">Status</p>
                                <p className="text-lg font-bold">{isRunning ? 'Running' : 'Idle'}</p>
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
