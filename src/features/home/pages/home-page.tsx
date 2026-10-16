import { HomeIcon } from "lucide-react";

import { PageLayout } from "@/components/layout/page";
import { PageHeader } from "@/components/layout/page-header";
import { routeTitle } from "@/components/layout/routes";
import { Callout } from "@/components/ui/callout";

export function HomePage() {
  return (
    <PageLayout>
      <PageHeader title={routeTitle("/home")} icon={<HomeIcon />} />

      <Callout variant="warning" title="Área sem autenticação">
        Esta rota é pública: qualquer pessoa chega aqui digitando a URL, e o
        login aceita qualquer credencial. É provisório, para destravar a
        navegação — precisa de sessão e guard antes de exibir qualquer dado
        real.
      </Callout>
    </PageLayout>
  );
}
