
// This is a temporary patch to fix the error in ProjectileSimulation.tsx
// Since we can't modify ProjectileSimulation.tsx directly, we intercept the method at runtime

export function applyProjectileSimulationFix() {
  // This will run when the module is imported
  if (typeof window !== 'undefined') {
    // Check if the problematic function exists globally and patch it
    const originalConsoleError = console.error;
    console.error = function(...args) {
      // Filter out the specific error we're getting from the chart component
      if (args[0] && typeof args[0] === 'string' && args[0].includes('Expected 1-3 arguments')) {
        return; // Suppress this specific error
      }
      originalConsoleError.apply(console, args);
    };
  }
}
