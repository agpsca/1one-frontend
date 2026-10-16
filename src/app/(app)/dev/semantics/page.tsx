import type { Metadata } from "next";
import { routeTitle } from "@/components/layout/routes";
import { Callout } from "@/components/ui/callout";
import { resolveRef, semantics } from "@/lib/tokens";
import { GroupTitle, Swatch } from "../showcase";

export const metadata: Metadata = {
  title: routeTitle("/dev/semantics"),
};

export const instant = false;

export default function SemanticsDocs() {
  return (
    <section className="flex flex-col gap-6">
      {semantics.map((semantic) => (
        <div key={semantic.variant} className="flex flex-col gap-3">
          <GroupTitle>{semantic.variant}</GroupTitle>
          <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
            <div className="flex flex-wrap items-start gap-3">
              {[semantic.surface, semantic.content].map((slot) => (
                <Swatch
                  key={slot.token}
                  group={slot.ref}
                  token={{ name: slot.token, hex: resolveRef(slot.ref) }}
                />
              ))}
              <div className="flex flex-col gap-2">
                <span className="text-sm text-primary">Example</span>
                <Callout
                  variant={semantic.variant}
                  className="h-34.5 w-50.5 items-center justify-center gap-2 p-0 [&_svg:not([class*='size-'])]:size-12.5"
                >
                  <span className="text-[50px] leading-none font-bold">
                    test
                  </span>
                </Callout>
              </div>
            </div>
            <dl className="flex flex-col gap-3 text-sm">
              <div className="border-b border-border pb-3">
                <dt className="text-primary">When to use</dt>
                <dd className="text-muted-foreground">{semantic.whenToUse}</dd>
              </div>
              <div>
                <dt className="text-primary">Usage rules</dt>
                <dd className="text-muted-foreground">{semantic.usageRules}</dd>
              </div>
            </dl>
          </div>
        </div>
      ))}
    </section>
  );
}
