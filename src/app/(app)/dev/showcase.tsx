import type { ReactNode } from "react";

import type { Primitive } from "@/lib/tokens";

export function Swatch({ group, token }: { group?: string; token: Primitive }) {
  return (
    <figure className="w-50.5 overflow-hidden rounded-md bg-card">
      <div
        className="h-20 border border-border"
        style={{ backgroundColor: token.hex }}
      />
      <figcaption className="flex flex-col gap-2 p-3">
        <span className="text-sm text-primary">{token.name}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {group ? `${group} → ${token.hex}` : token.hex}
        </span>
      </figcaption>
    </figure>
  );
}

export function Demo({
  name,
  note,
  children,
}: {
  name: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-medium">{name}</h2>
      {note && <p className="-mt-2 text-sm text-muted-foreground">{note}</p>}
      {children}
    </div>
  );
}

export function GroupTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-medium">{children}</h2>;
}
