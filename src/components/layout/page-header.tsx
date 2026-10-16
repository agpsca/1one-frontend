import type { ReactNode } from "react";

import { PageBreadcrumb } from "./page-breadcrumb";

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
};

export function PageHeader({
  title,
  description,
  icon,
  actions,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      {breadcrumb === undefined ? <PageBreadcrumb /> : breadcrumb}

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {icon && (
            <span
              aria-hidden
              className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground ring-1 ring-foreground/10 [&>svg]:size-4"
            >
              {icon}
            </span>
          )}

          <div>
            <h1 className="animate-in font-heading text-2xl font-medium tracking-tight duration-500 fade-in fill-mode-backwards slide-in-from-bottom-2">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>

        {actions}
      </div>
    </div>
  );
}
