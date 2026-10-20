import { cn } from "@/lib/utils";

export function CorporateLogo({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 998 738"
      aria-hidden
      className={cn(
        "h-10 w-auto fill-corporate-dark dark:fill-corporate-yellow",
        className,
      )}
      {...props}
    >
      <path d="M319.724 0.03125H18.6407C8.51822 0.03125 0.000488281 8.45057 0.000488281 18.3951V737.394H715.676L364.227 27.4244C356.51 11.9281 341.08 0.03125 319.724 0.03125Z" />
      <path d="M986.883 151.82H687.105C673.091 151.82 660.276 160.818 652.546 174.78L563.887 353.622L754.087 737.373H997.63V162.369C997.63 156.661 992.727 151.82 986.883 151.82Z" />
    </svg>
  );
}
