import type { Metadata } from "next";
import { routeTitle } from "@/components/layout/routes";
import { primitives } from "@/lib/tokens";
import { GroupTitle, Swatch } from "../showcase";

export const metadata: Metadata = {
  title: routeTitle("/dev/primitives"),
};

export const instant = false;

export default function PrimitivesDocs() {
  return (
    <section className="flex flex-col gap-6">
      {Object.entries(primitives).map(([group, tokens]) => (
        <div key={group} className="flex flex-col gap-3">
          <GroupTitle>{group}</GroupTitle>
          <div className="flex flex-wrap gap-3">
            {tokens.map((token) => (
              <Swatch key={token.name} token={token} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
