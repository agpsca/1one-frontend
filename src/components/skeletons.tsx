import { cn } from "cn";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

function SkeletonBlock({
  label = "Carregando",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { label?: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      data-slot="skeleton-block"
      className={className}
      {...props}
    >
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

function SkeletonText({
  lines = 3,
  className,
  ...props
}: React.ComponentProps<typeof SkeletonBlock> & { lines?: number }) {
  return (
    <SkeletonBlock className={cn("flex flex-col gap-2", className)} {...props}>
      {Array.from({ length: lines }, (_, line) => (
        <Skeleton
          key={`line-${line}`}
          className={cn("h-4", line === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </SkeletonBlock>
  );
}

/* ------------------------------------------------------------------ *
 * Por componente
 * ------------------------------------------------------------------ */

/** Mesma altura e raio do `Button` tamanho default. */
function ButtonSkeleton({
  className,
  ...props
}: React.ComponentProps<typeof SkeletonBlock>) {
  return (
    <SkeletonBlock className={cn("w-fit", className)} {...props}>
      <Skeleton className="h-9 w-24 rounded-md" />
    </SkeletonBlock>
  );
}

/** Pílula com a altura e o raio do `Badge`. */
function BadgeSkeleton({
  className,
  ...props
}: React.ComponentProps<typeof SkeletonBlock>) {
  return (
    <SkeletonBlock className={cn("w-fit", className)} {...props}>
      <Skeleton className="h-5 w-16 rounded-3xl" />
    </SkeletonBlock>
  );
}

function BreadcrumbSkeleton({
  segments = 3,
  className,
  ...props
}: React.ComponentProps<typeof SkeletonBlock> & { segments?: number }) {
  return (
    <SkeletonBlock
      className={cn("flex items-center gap-2.5", className)}
      {...props}
    >
      {Array.from({ length: segments }, (_, segment) => (
        <div key={`segment-${segment}`} className="flex items-center gap-2.5">
          {segment > 0 && <Skeleton className="size-3.5" />}
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </SkeletonBlock>
  );
}

/** Ícone redondo + título + corpo, no padding do `Callout`. */
function CalloutSkeleton({
  className,
  ...props
}: React.ComponentProps<typeof SkeletonBlock>) {
  return (
    <SkeletonBlock
      className={cn(
        "flex items-start gap-3 rounded-md bg-muted/40 p-4",
        className,
      )}
      {...props}
    >
      <Skeleton className="size-5 shrink-0 rounded-full" />
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-full" />
      </div>
    </SkeletonBlock>
  );
}

/** Usa o `Card` real: a borda e o padding não dependem de dados. */
function CardSkeleton({
  withFooter = false,
  className,
  ...props
}: React.ComponentProps<typeof SkeletonBlock> & { withFooter?: boolean }) {
  return (
    <SkeletonBlock className={className} {...props}>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-28" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
        {withFooter && (
          <CardFooter>
            <Skeleton className="h-8 w-28 rounded-md" />
          </CardFooter>
        )}
      </Card>
    </SkeletonBlock>
  );
}

/**
 * Rótulo + controle, na altura do `Input` e do `SelectTrigger` (h-9). Serve
 * para os três: Field, Input e Select.
 */
function FieldSkeleton({
  className,
  ...props
}: React.ComponentProps<typeof SkeletonBlock>) {
  return (
    <SkeletonBlock className={cn("flex flex-col gap-3", className)} {...props}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-9 w-full rounded-md" />
    </SkeletonBlock>
  );
}

/** Corpo de modal com formulário: N campos + rodapé. */
function FormSkeleton({
  fields = 2,
  className,
  ...props
}: React.ComponentProps<typeof SkeletonBlock> & { fields?: number }) {
  return (
    <SkeletonBlock className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-7">
        {Array.from({ length: fields }, (_, field) => (
          <div key={`field-${field}`} className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </SkeletonBlock>
  );
}

/** Itens de `DropdownMenuContent` ou `SelectContent` carregando. */
function MenuSkeleton({
  items = 4,
  className,
  ...props
}: React.ComponentProps<typeof SkeletonBlock> & { items?: number }) {
  return (
    <SkeletonBlock
      className={cn(
        "flex w-48 flex-col gap-1 rounded-2xl bg-popover p-1.5 ring-1 ring-foreground/5",
        className,
      )}
      {...props}
    >
      {Array.from({ length: items }, (_, item) => (
        <div
          key={`item-${item}`}
          className="flex items-center gap-2.5 px-3 py-2"
        >
          <Skeleton className="size-4 shrink-0" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </SkeletonBlock>
  );
}

function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
  ...props
}: React.ComponentProps<typeof SkeletonBlock> & {
  rows?: number;
  columns?: number;
}) {
  return (
    <SkeletonBlock className={className} {...props}>
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }, (_, column) => (
              <TableHead key={`head-${column}`}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_, row) => (
            <TableRow key={`row-${row}`}>
              {Array.from({ length: columns }, (_, column) => (
                <TableCell key={`cell-${row}-${column}`}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SkeletonBlock>
  );
}

export {
  BadgeSkeleton,
  BreadcrumbSkeleton,
  ButtonSkeleton,
  CalloutSkeleton,
  CardSkeleton,
  FieldSkeleton,
  FormSkeleton,
  MenuSkeleton,
  Skeleton,
  SkeletonBlock,
  SkeletonText,
  TableSkeleton,
};
