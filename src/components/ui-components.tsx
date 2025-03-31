
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Loader2 } from "lucide-react"; // Changed from ExclamationTriangleIcon to AlertTriangle

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
}
export function SectionHeader({
  title,
  subtitle,
  className,
  align = 'left'
}: SectionHeaderProps) {
  return <div className={cn("mb-8", {
    'text-left': align === 'left',
    'text-center': align === 'center',
    'text-right': align === 'right'
  }, className)}>
      <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-2 py-[20px]">{title}</h2>
      {subtitle && <p className="text-muted text-lg">{subtitle}</p>}
    </div>;
}

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}
export function Section({
  children,
  className,
  id
}: SectionProps) {
  return <section id={id} className={cn("py-12 md:py-16", className)}>
      <div className="container-wide">
        {children}
      </div>
    </section>;
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}
export function EmptyState({
  title,
  description,
  icon,
  action,
  className
}: EmptyStateProps) {
  return <div className={cn("flex flex-col items-center justify-center text-center py-16 px-4", className)}>
      {icon || <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-6">
          <AlertTriangle className="h-8 w-8 text-muted" /> {/* Changed from ExclamationTriangleIcon to AlertTriangle */}
        </div>}
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      {description && <p className="text-muted mb-6 max-w-md">{description}</p>}
      {action}
    </div>;
}

interface ErrorStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}
export function ErrorState({
  title,
  description,
  action,
  className
}: ErrorStateProps) {
  return <div className={cn("flex flex-col items-center justify-center text-center py-16 px-4", className)}>
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      {description && <p className="text-muted mb-6 max-w-md">{description}</p>}
      {action}
    </div>;
}

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}
export function Loader({
  className,
  size = 'md',
  text
}: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };
  return <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <p className="text-sm text-muted">{text}</p>}
    </div>;
}

interface DividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}
export function Divider({
  className,
  orientation = 'horizontal',
  label
}: DividerProps) {
  if (orientation === 'vertical') {
    return <div className={cn("relative h-full w-px bg-gray-200 mx-2", className)}>
        {label && <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted">
            {label}
          </span>}
      </div>;
  }
  return <div className={cn("relative h-px w-full bg-gray-200 my-6", className)}>
      {label && <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-muted">
          {label}
        </span>}
    </div>;
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'outline' | 'secondary';
  className?: string;
}
export function Badge({
  children,
  variant = 'default',
  className
}: BadgeProps) {
  return <span className={cn("inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium transition-colors", {
    'bg-primary text-white': variant === 'primary',
    'bg-accent text-muted': variant === 'default',
    'border border-gray-200 text-muted': variant === 'outline',
    'bg-light text-dark': variant === 'secondary'
  }, className)}>
      {children}
    </span>;
}
