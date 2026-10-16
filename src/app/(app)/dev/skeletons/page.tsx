import type { Metadata } from "next";
import { routeTitle } from "@/components/layout/routes";
import {
  BadgeSkeleton,
  BreadcrumbSkeleton,
  ButtonSkeleton,
  CalloutSkeleton,
  CardSkeleton,
  FieldSkeleton,
  FormSkeleton,
  MenuSkeleton,
  Skeleton,
  SkeletonText,
  TableSkeleton,
} from "@/components/skeletons";
import { Demo } from "../showcase";

export const metadata: Metadata = {
  title: routeTitle("/dev/skeletons"),
};

export const instant = false;

export default function SkeletonsDocs() {
  return (
    <section className="flex flex-col gap-6">
      <p className="-mt-2 max-w-3xl text-sm text-muted-foreground">
        Todos exportados de{" "}
        <code className="font-mono">components/skeletons.tsx</code>. A animação
        é o <code className="font-mono">animate-pulse</code> da primitiva; as
        formas compostas só montam o formato. Cada uma traz{" "}
        <code className="font-mono">role=status</code>,{" "}
        <code className="font-mono">aria-busy</code> e um rótulo em{" "}
        <code className="font-mono">sr-only</code> — os retângulos não têm
        texto, então sem isso o leitor de tela não anunciaria nada. O invólucro
        que faz isso é o <code className="font-mono">SkeletonBlock</code>, usado
        por todos e sem visual próprio. Separator, Toast e Tooltip não têm
        esqueleto: o primeiro é marcação local, o segundo dispara no fim da ação
        e o terceiro só aparece no hover.
      </p>

      <Demo
        name="Skeleton"
        note="A primitiva. Qualquer forma sai de `className` — barra, botão, pílula, círculo."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-3xl" />
          <Skeleton className="size-9 rounded-full" />
        </div>
      </Demo>

      <Demo name="BadgeSkeleton" note="Para Badge.">
        <BadgeSkeleton />
      </Demo>

      <Demo name="BreadcrumbSkeleton" note="Para Breadcrumb. `segments`.">
        <BreadcrumbSkeleton />
      </Demo>

      <Demo name="ButtonSkeleton" note="Para Button.">
        <ButtonSkeleton />
      </Demo>

      <Demo name="CalloutSkeleton" note="Para Callout.">
        <CalloutSkeleton className="max-w-xl" />
      </Demo>

      <Demo
        name="CardSkeleton"
        note="Para Card. `withFooter`. Usa o Card real: a borda não depende de dados."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <CardSkeleton withFooter />
          <CardSkeleton />
        </div>
      </Demo>

      <Demo
        name="FieldSkeleton"
        note="Para Field, Input e Select — rótulo + controle na altura h-9. Input sem rótulo não existe, nem carregando."
      >
        <div className="flex max-w-md flex-col gap-7">
          <FieldSkeleton />
          <FieldSkeleton />
        </div>
      </Demo>

      <Demo
        name="FormSkeleton"
        note="Corpo de Dialog e Sheet enquanto o formulário carrega. `fields`."
      >
        <FormSkeleton fields={3} className="max-w-md" />
      </Demo>

      <Demo
        name="MenuSkeleton"
        note="Itens de DropdownMenuContent ou SelectContent buscados ao abrir. `items`."
      >
        <MenuSkeleton />
      </Demo>

      <Demo
        name="SkeletonText"
        note="Parágrafo: corpo de AlertDialog, de Popover, texto corrido. `lines` — a última linha sai mais curta."
      >
        <SkeletonText className="max-w-md" />
      </Demo>

      <Demo
        name="TableSkeleton"
        note="Para Table. `rows` e `columns`. Usa as primitivas de Table, então não diverge da tabela real."
      >
        <TableSkeleton rows={3} columns={4} />
      </Demo>
    </section>
  );
}
