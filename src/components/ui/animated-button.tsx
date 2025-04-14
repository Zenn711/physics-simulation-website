
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const animatedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground active:scale-95 group",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-95",
        link: "text-primary underline-offset-4 hover:underline",
        glow: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]",
        glass: "backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 active:scale-95 text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof animatedButtonVariants> {
  asChild?: boolean;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  glowColor?: string;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, asChild = false, iconBefore, iconAfter, glowColor, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const glowStyle = glowColor && variant === 'glow' 
      ? { 
          '--glow-color': glowColor, 
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 0 15px var(--glow-color)`,
          }
        } 
      : {};
      
    return (
      <Comp
        className={cn(animatedButtonVariants({ variant, size, className }))}
        ref={ref}
        style={glowStyle as React.CSSProperties}
        {...props}
      >
        {iconBefore && <span className="mr-1 transition-transform duration-300 group-hover:-translate-x-0.5">{iconBefore}</span>}
        {children}
        {iconAfter && <span className="ml-1 transition-transform duration-300 group-hover:translate-x-0.5">{iconAfter}</span>}
      </Comp>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton, animatedButtonVariants };
