import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import {
  CircleCheckBigIcon,
  CircleXIcon,
  InfoIcon,
  SparklesIcon,
  TriangleAlertIcon,
} from "lucide-react";
import * as React from "react";

const calloutVariants = cva(
  "flex items-start gap-3 rounded-md p-4 text-sm [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      // cada variante = par superfície + texto/ícone definido em globals.css
      variant: {
        destructive: "bg-destructive-surface text-destructive",
        info: "bg-info-surface text-info",
        primary: "bg-primary text-primary-foreground",
        success: "bg-success-surface text-success",
        warning: "bg-warning-surface text-warning",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

const calloutIcons = {
  destructive: CircleXIcon,
  info: InfoIcon,
  primary: SparklesIcon,
  success: CircleCheckBigIcon,
  warning: TriangleAlertIcon,
} as const;

function Callout({
  className,
  variant = "info",
  title,
  icon,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof calloutVariants> & {
    title?: React.ReactNode;
    /** `null` remove o ícone */
    icon?: React.ReactNode | null;
  }) {
  const Icon = calloutIcons[variant ?? "info"];

  return (
    <div
      data-slot="callout"
      data-variant={variant}
      role={variant === "destructive" ? "alert" : "status"}
      className={cn(calloutVariants({ variant, className }))}
      {...props}
    >
      {icon === null ? null : (icon ?? <Icon aria-hidden />)}
      <div className="flex flex-col gap-1">
        {title && <p className="font-medium">{title}</p>}
        {/* sem título não há nada de que se diferenciar, então não esmaece */}
        {children && (
          <div className={title ? "opacity-90" : undefined}>{children}</div>
        )}
      </div>
    </div>
  );
}

export { Callout, calloutIcons, calloutVariants };
