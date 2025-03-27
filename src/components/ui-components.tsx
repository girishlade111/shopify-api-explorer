
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// Section Container
export const Section = ({
  className,
  children,
  fullWidth = false,
}: {
  className?: string;
  children: ReactNode;
  fullWidth?: boolean;
}) => (
  <section className={cn("py-12 md:py-16", className)}>
    <div className={cn(fullWidth ? "px-4 sm:px-6 lg:px-8" : "container-tight")}>
      {children}
    </div>
  </section>
);

// Section Header with optional subheading
export const SectionHeader = ({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
  center = false,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  center?: boolean;
}) => (
  <div className={cn("mb-8 md:mb-12", center && "text-center", className)}>
    <h2 className={cn("text-3xl font-semibold tracking-tight", titleClassName)}>
      {title}
    </h2>
    {subtitle && (
      <p
        className={cn(
          "mt-2 text-lg text-muted",
          subtitleClassName
        )}
      >
        {subtitle}
      </p>
    )}
  </div>
);

// Badge Component
export const Badge = ({
  children,
  className,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive";
}) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors";
  
  const variantClasses = {
    default: "bg-primary text-white",
    outline: "border border-primary text-primary bg-transparent",
    secondary: "bg-accent text-dark",
    destructive: "bg-destructive text-white",
  };
  
  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

// Chip Component
export const Chip = ({
  children,
  className,
  active = false,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors",
      active
        ? "bg-primary text-white"
        : "bg-accent text-secondary hover:bg-accent/80",
      className
    )}
  >
    {children}
  </button>
);

// Grid Container
export const Grid = ({
  children,
  className,
  cols = 3,
}: {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
}) => {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };
  
  return (
    <div
      className={cn(
        "grid gap-6 md:gap-8",
        colClasses[cols],
        className
      )}
    >
      {children}
    </div>
  );
};

// Horizontal Scroll Container
export const ScrollContainer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("relative", className)}>
    <div className="flex overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
      <div className="flex space-x-4 md:space-x-6 px-4 sm:px-0">
        {children}
      </div>
    </div>
  </div>
);

// Animated Image
export const AnimatedImage = ({
  src,
  alt,
  className,
  aspectRatio = "aspect-[3/4]",
}: {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg bg-accent/30",
        aspectRatio,
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover object-center transition-all duration-300 hover:scale-105"
        loading="lazy"
        onLoad={(e) => {
          const target = e.target as HTMLImageElement;
          target.classList.remove("image-loading");
          target.classList.add("image-loaded");
        }}
      />
    </div>
  );
};

// Loader Component
export const Loader = ({ className }: { className?: string }) => (
  <div className={cn("flex justify-center py-8", className)}>
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

// Empty State
export const EmptyState = ({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center py-12 text-center",
      className
    )}
  >
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="mt-2 mb-6 text-muted max-w-md">{description}</p>
    {action}
  </div>
);

// Error State
export const ErrorState = ({
  title = "Something went wrong",
  description = "We encountered an error while loading this data. Please try again later.",
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center py-12 text-center",
      className
    )}
  >
    <div className="rounded-full bg-red-100 p-3 mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-red-500"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="mt-2 mb-6 text-muted max-w-md">{description}</p>
    {action}
  </div>
);
