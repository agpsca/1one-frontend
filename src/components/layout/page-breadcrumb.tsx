"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buildTrail } from "@/lib/nav";
import { routes } from "./routes";

export function PageBreadcrumb() {
  const pathname = usePathname();
  const trail = buildTrail(routes, pathname);

  if (trail.length < 2) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {trail.map((step, index) => {
          const isLast = index === trail.length - 1;

          return (
            <Fragment key={step.id}>
              <BreadcrumbItem>
                {isLast || !step.link ? (
                  <BreadcrumbPage>{step.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={step.link}>{step.title}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
