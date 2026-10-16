import { CodeXmlIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { PageLayout } from "@/components/layout/page";
import { PageHeader } from "@/components/layout/page-header";
import { PageTabs } from "@/components/layout/page-tabs";
import { childRoutes, routeTitle } from "@/components/layout/routes";

export default function DevLayout({ children }: LayoutProps<"/dev">) {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <PageLayout>
      <PageHeader
        title={routeTitle("/dev")}
        description="Primitives, tokens semânticos e componentes. Só em desenvolvimento."
        icon={<CodeXmlIcon />}
      />

      <PageTabs items={childRoutes("dev")} />

      {children}
    </PageLayout>
  );
}
