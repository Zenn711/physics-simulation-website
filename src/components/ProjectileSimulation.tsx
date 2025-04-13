
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Moon, Sun, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"

interface ProjectileSimulationProps {
  soundEnabled?: boolean;
  playSound?: (sound: string) => void;
}

const ProjectileSimulation: React.FC<ProjectileSimulationProps> = ({ 
  soundEnabled = false, 
  playSound = () => {} 
}) => {
  const [velocity, setVelocity] = useState(25); // Initial velocity
  const [angle, setAngle] = useState(45);       // Launch angle in degrees
  const [gravity, setGravity] = useState(9.81);   // Acceleration due to gravity (Earth)
  const [windResistance, setWindResistance] = useState(0.01); // Wind resistance coefficient
  const [altitude, setAltitude] = useState(0); // Initial altitude
  const [environment, setEnvironment] = useState('earth'); // 'earth', 'moon', 'mars'
  const [showTrajectory, setShowTrajectory] = useState(true); // Toggle trajectory visibility
  const [showVelocityVectors, setShowVelocityVectors] = useState(false); // Toggle velocity vectors visibility
  const [showForces, setShowForces] = useState(false); // Toggle force vectors visibility
  const [showLabels, setShowLabels] = useState(true); // Toggle labels visibility
  const [showImpactPoint, setShowImpactPoint] = useState(true); // Toggle impact point visibility
  const [showCalculations, setShowCalculations] = useState(false); // Toggle calculations visibility
  const [autoScale, setAutoScale] = useState(true); // Toggle auto scale
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode toggle

  const { theme } = useTheme()

  const [trajectory, setTrajectory] = useState<
    { x: number; y: number; vx: number; vy: number; ax: number; ay: number }[]
  >([]);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const [impactVelocity, setImpactVelocity] = useState(0);

  const simulationContainerRef = useRef<HTMLDivElement>(null);
  const projectileRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Environment effects
  const environments = useMemo(() => ({
    earth: { 
      gravity: 9.81, 
      airResistance: 0.01, 
      background: 'bg-gradient-to-b from-blue-300 to-blue-100 dark:from-blue-900 dark:to-blue-800' 
    },
    moon: { 
      gravity: 1.62, 
      airResistance: 0, 
      background: 'bg-gradient-to-b from-gray-500 to-gray-300 dark:from-gray-800 dark:to-gray-700' 
    },
    mars: { 
      gravity: 3.721, 
      airResistance: 0.01, 
      background: 'bg-gradient-to-b from-red-300 to-red-200 dark:from-red-900 dark:to-red-800' 
    }
  }), []);

  const calculateTrajectory = () => {
    const angleInRadians = (angle * Math.PI) / 180;
    const initialVelocityX = velocity * Math.cos(angleInRadians);
    const initialVelocityY = velocity * Math.sin(angleInRadians);
    let currentX = 0;
    let currentY = altitude;
    let currentVelocityX = initialVelocityX;
    let currentVelocityY = initialVelocityY;
    const newTrajectory: { x: number; y: number; vx: number; vy: number; ax: number; ay: number }[] = [];
    let maxReachHeight = altitude;

    // Reset time and distance
    setTime(0);
    setDistance(0);
    setMaxHeight(altitude);

    // Simulate the projectile motion
    let t = 0;
    while (currentY >= 0) {
      // Calculate forces
      const windForceX = -windResistance * currentVelocityX * currentVelocityX;
      const gravityForceY = -gravity;

      // Calculate acceleration
      const accelerationX = windForceX;
      const accelerationY = gravityForceY;

      // Update velocities
      currentVelocityX += accelerationX * 0.1;
      currentVelocityY += accelerationY * 0.1;

      // Update positions
      currentX += currentVelocityX * 0.1;
      currentY += currentVelocityY * 0.1;

      // Store the point in the trajectory
      newTrajectory.push({
        x: currentX,
        y: currentY,
        vx: currentVelocityX,
        vy: currentVelocityY,
        ax: accelerationX,
        ay: accelerationY,
      });

      maxReachHeight = Math.max(maxReachHeight, currentY);
      t += 0.1;
    }

    // Set the final trajectory
    setTrajectory(newTrajectory);

    // Set the final time and distance
    setTime(parseFloat(t.toFixed(2)));
    setDistance(parseFloat(currentX.toFixed(2)));
    setMaxHeight(parseFloat(maxReachHeight.toFixed(2)));
    setImpactVelocity(parseFloat(Math.sqrt(currentVelocityX * currentVelocityX + currentVelocityY * currentVelocityY).toFixed(2)));

    return {
      finalTime: t,
      finalDistance: currentX,
      finalMaxHeight: maxReachHeight,
      finalVelocity: Math.sqrt(currentVelocityX * currentVelocityX + currentVelocityY * currentVelocityY),
    };
  };

  const startSimulation = async () => {
    if (soundEnabled && playSound) {
      playSound('projectile-launch');
    }
    const { finalTime, finalDistance } = calculateTrajectory();

    // Calculate the scaling factor based on the container width
    const containerWidth = simulationContainerRef.current?.offsetWidth || 500;
    const scaleFactor = containerWidth / 500; // Adjust 500 to your reference width

    await controls.start({
      x: finalDistance * scaleFactor,
      y: 0,
      transition: { duration: finalTime, ease: 'linear' },
    });
  };

  const resetSimulation = async () => {
    await controls.start({
      x: 0,
      y: 0,
      transition: { duration: 0 },
    });
    setTrajectory([]);
  };

  useEffect(() => {
    switch (environment) {
      case 'moon':
        setGravity(1.62);
        setWindResistance(0);
        break;
      case 'mars':
        setGravity(3.721);
        setWindResistance(0.01);
        break;
      default:
        setGravity(9.81);
        setWindResistance(0.01);
        break;
    }
  }, [environment]);

  useEffect(() => {
    setIsDarkMode(theme === "dark")
  }, [theme]);

  // Generate terrain features
  const generateTerrain = () => {
    const width = simulationContainerRef.current?.offsetWidth || 600;
    const height = simulationContainerRef.current?.offsetHeight || 300;

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
          <path d={`M0,${height} C100,${height-30} 200,${height-10} 300,${height-20} C400,${height-30} 500,${height-10} ${width},${height}`} fill="#b84c32" />
          
          {/* Rocks */}
          <polygon points={`150,${height-10} 160,${height-25} 170,${height-10}`} fill="#8c3a26" />
          <polygon points={`410,${height-10} 425,${height-20} 430,${height-10}`} fill="#8c3a26" />
          <polygon points={`490,${height-10} 500,${height-20} 510,${height-10}`} fill="#8c3a26" />
        </>
      );
    }
    return null;
  };

  const getEnvironmentIcon = () => {
    switch (environment) {
      case 'moon':
        return <Moon className="h-5 w-5" />;
      case 'mars':
        return <Globe className="h-5 w-5" />; 
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Simulation Controls */}
      <div className="w-full md:w-1/4 p-4">
        <Card className="mb-4">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Simulation Parameters</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="velocity">Initial Velocity (m/s)</Label>
                <Input
                  type="number"
                  id="velocity"
                  value={velocity}
                  onChange={(e) => setVelocity(parseFloat(e.target.value))}
                />
                <Slider
                  defaultValue={[velocity]}
                  max={100}
                  step={1}
                  onValueChange={(value) => setVelocity(value[0])}
                />
              </div>
              <div>
                <Label htmlFor="angle">Launch Angle (degrees)</Label>
                <Input
                  type="number"
                  id="angle"
                  value={angle}
                  onChange={(e) => setAngle(parseFloat(e.target.value))}
                />
                <Slider
                  defaultValue={[angle]}
                  max={90}
                  step={1}
                  onValueChange={(value) => setAngle(value[0])}
                />
              </div>
              <div>
                <Label htmlFor="altitude">Initial Altitude (m)</Label>
                <Input
                  type="number"
                  id="altitude"
                  value={altitude}
                  onChange={(e) => setAltitude(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="windResistance">Wind Resistance</Label>
                <Input
                  type="number"
                  id="windResistance"
                  value={windResistance}
                  onChange={(e) => setWindResistance(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="gravity">Gravity ({environment})</Label>
                <div className="relative">
                  <Button
                    variant="outline"
                    onClick={() => {
                      switch (environment) {
                        case 'earth':
                          setEnvironment('moon');
                          break;
                        case 'moon':
                          setEnvironment('mars');
                          break;
                        default:
                          setEnvironment('earth');
                          break;
                      }
                    }}
                    className="w-full justify-start gap-2"
                  >
                    {getEnvironmentIcon()}
                    <span>{environment.charAt(0).toUpperCase() + environment.slice(1)}</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Toggles */}
        <Card className="mb-4">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Display Options</h3>
            <div className="space-y-2">
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={showTrajectory}
                  onChange={() => setShowTrajectory(!showTrajectory)}
                />
                <span>Show Trajectory</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={showVelocityVectors}
                  onChange={() => setShowVelocityVectors(!showVelocityVectors)}
                />
                <span>Show Velocity Vectors</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={showForces}
                  onChange={() => setShowForces(!showForces)}
                />
                <span>Show Forces</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={showLabels}
                  onChange={() => setShowLabels(!showLabels)}
                />
                <span>Show Labels</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={showImpactPoint}
                  onChange={() => setShowImpactPoint(!showImpactPoint)}
                />
                <span>Show Impact Point</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={autoScale}
                  onChange={() => setAutoScale(!autoScale)}
                />
                <span>Auto Scale</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={showCalculations}
                  onChange={() => setShowCalculations(!showCalculations)}
                />
                <span>Show Calculations</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Simulation Results */}
        {showCalculations && (
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Simulation Results</h3>
              <div className="space-y-2">
                <p>Time: {time} s</p>
                <p>Distance: {distance} m</p>
                <p>Max Height: {maxHeight} m</p>
                <p>Impact Velocity: {impactVelocity} m/s</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Simulation Controls */}
        <div className="flex justify-between mt-4">
          <Button onClick={startSimulation}>Start</Button>
          <Button variant="secondary" onClick={resetSimulation}>Reset</Button>
        </div>
      </div>

      {/* Simulation Canvas */}
      <div className="w-full md:w-3/4 p-4">
        <div
          className={`relative h-[500px] rounded-md overflow-hidden ${environments[environment]?.background || 'bg-gray-100 dark:bg-gray-900'}`}
          ref={simulationContainerRef}
        >
          {/* Environment and Trajectory */}
          <svg className="absolute top-0 left-0 w-full h-full">
            {/* Environment terrain */}
            {generateTerrain()}
            
            {/* Ground line */}
            <line 
              x1="0" 
              y1="100%" 
              x2="100%" 
              y2="100%" 
              stroke={environment === 'moon' ? '#aaa' : '#666'} 
              strokeWidth="2" 
            />

            {/* Trajectory paths */}
            {showTrajectory && trajectory.map((point, index) => {
              if (index > 0) {
                const prevPoint = trajectory[index - 1];
                const containerWidth = simulationContainerRef.current?.offsetWidth || 500;
                const containerHeight = simulationContainerRef.current?.offsetHeight || 500;
                const scaleFactor = containerWidth / 500;
                const x1 = prevPoint.x * scaleFactor;
                const y1 = containerHeight - prevPoint.y * scaleFactor;
                const x2 = point.x * scaleFactor;
                const y2 = containerHeight - point.y * scaleFactor;

                return (
                  <line
                    key={index}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={
                      environment === 'earth' ? "rgba(59, 130, 246, 0.6)" : 
                      environment === 'moon' ? "rgba(255, 255, 255, 0.6)" :
                      "rgba(220, 38, 38, 0.6)"
                    }
                    strokeWidth="2"
                  />
                );
              }
              return null;
            })}

            {/* Angle indicator */}
            {showLabels && (
              <>
                <line
                  x1="0"
                  y1="100%"
                  x2={60 * Math.cos(angle * Math.PI / 180)}
                  y2={100% - 60 * Math.sin(angle * Math.PI / 180)}
                  stroke="rgba(239, 68, 68, 0.7)"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
                <text x="25" y="95%" fontSize="14" fill="currentColor" fontWeight="bold">
                  {angle}°
                </text>
              </>
            )}
          </svg>

          {/* Projectile */}
          <motion.div
            className={`absolute bottom-0 left-0 w-6 h-6 rounded-full ${
              environment === 'earth' ? "bg-red-500" : 
              environment === 'moon' ? "bg-gray-300" : 
              "bg-red-600"
            }`}
            style={{ originX: 0, originY: 1 }}
            ref={projectileRef}
            animate={controls}
          >
            {/* Add pulse animation */}
            <div className="absolute inset-0 rounded-full animate-pulse opacity-70 bg-white" />
          </motion.div>

          {/* Impact Point */}
          {showImpactPoint && trajectory.length > 0 && (
            <div
              className="absolute w-4 h-4 rounded-full bg-green-500"
              style={{
                left: `${(trajectory[trajectory.length - 1].x / distance) * 100}%`,
                bottom: '0px',
                transform: 'translateX(-50%)',
              }}
            />
          )}

          {/* Velocity Vectors */}
          {showVelocityVectors && trajectory.length > 0 && (
            <svg className="absolute top-0 left-0 w-full h-full">
              {trajectory.map((point, index) => {
                const containerWidth = simulationContainerRef.current?.offsetWidth || 500;
                const containerHeight = simulationContainerRef.current?.offsetHeight || 500;
                const scaleFactor = containerWidth / 500;
                const x = point.x * scaleFactor;
                const y = containerHeight - point.y * scaleFactor;
                const vectorLength = Math.sqrt(point.vx * point.vx + point.vy * point.vy) * 5;
                const angle = Math.atan2(point.vy, point.vx);
                const x2 = x + vectorLength * Math.cos(angle);
                const y2 = y - vectorLength * Math.sin(angle);

                return (
                  <line
                    key={`velocity-${index}`}
                    x1={x}
                    y1={y}
                    x2={x2}
                    y2={y2}
                    stroke="blue"
                    strokeWidth="1"
                  />
                );
              })}
            </svg>
          )}

          {/* Force Vectors */}
          {showForces && trajectory.length > 0 && (
            <svg className="absolute top-0 left-0 w-full h-full">
              {trajectory.map((point, index) => {
                const containerWidth = simulationContainerRef.current?.offsetWidth || 500;
                const containerHeight = simulationContainerRef.current?.offsetHeight || 500;
                const scaleFactor = containerWidth / 500;
                const x = point.x * scaleFactor;
                const y = containerHeight - point.y * scaleFactor;
                const vectorLength = Math.sqrt(point.ax * point.ax + point.ay * point.ay) * 10;
                const angle = Math.atan2(point.ay, point.ax);
                const x2 = x + vectorLength * Math.cos(angle);
                const y2 = y - vectorLength * Math.sin(angle);

                return (
                  <line
                    key={`force-${index}`}
                    x1={x}
                    y1={y}
                    x2={x2}
                    y2={y2}
                    stroke="red"
                    strokeWidth="1"
                  />
                );
              })}
            </svg>
          )}

          {/* Labels */}
          {showLabels && (
            <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-30 p-1 rounded">
              <p>Velocity: {velocity} m/s</p>
              <p>Angle: {angle}°</p>
              <p>Gravity: {gravity} m/s²</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectileSimulation;
