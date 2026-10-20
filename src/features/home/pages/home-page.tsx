import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  BarChart3Icon,
  BoxesIcon,
  DollarSignIcon,
  DownloadIcon,
  HomeIcon,
  LayersIcon,
  LifeBuoyIcon,
  MegaphoneIcon,
  PackageIcon,
  PlusIcon,
  ShoppingCartIcon,
  TruckIcon,
  Undo2Icon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import type { ComponentType } from "react";
import { PageLayout } from "@/components/layout/page";
import { PageHeader } from "@/components/layout/page-header";
import { routeTitle } from "@/components/layout/routes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Icon = ComponentType<{ className?: string }>;

type Metric = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  hint: string;
  icon: Icon;
};

const metrics: Metric[] = [
  {
    label: "Receita",
    value: "R$ 128.430",
    delta: "+12,5%",
    trend: "up",
    hint: "vs. mês anterior",
    icon: DollarSignIcon,
  },
  {
    label: "Pedidos",
    value: "1.842",
    delta: "+4,2%",
    trend: "up",
    hint: "vs. mês anterior",
    icon: ShoppingCartIcon,
  },
  {
    label: "Novos clientes",
    value: "312",
    delta: "-1,8%",
    trend: "down",
    hint: "vs. mês anterior",
    icon: UsersIcon,
  },
  {
    label: "Ticket médio",
    value: "R$ 69,70",
    delta: "+7,9%",
    trend: "up",
    hint: "vs. mês anterior",
    icon: DollarSignIcon,
  },
];

type Module = {
  id: string;
  title: string;
  description: string;
  icon: Icon;
  highlight: string;
  tone: "info" | "success" | "warning";
};

// Os módulos refletem os domínios de negócio que a plataforma cobre:
// pedidos, logística, financeiro, comercial, pós-venda e gestão.
const modules: Module[] = [
  {
    id: "orders",
    title: "Pedidos",
    description:
      "Hub de pedidos e assistências técnicas, da venda à aprovação.",
    icon: ShoppingCartIcon,
    highlight: "128 em aberto",
    tone: "info",
  },
  {
    id: "logistics",
    title: "Logística",
    description:
      "Transportadoras, CDs, cotação de frete e auditoria de faturas.",
    icon: TruckIcon,
    highlight: "9 transportadoras",
    tone: "info",
  },
  {
    id: "financial",
    title: "Financeiro",
    description: "Repasses, faturas a pagar, débitos e conciliação.",
    icon: WalletIcon,
    highlight: "R$ 42 mil a repassar",
    tone: "warning",
  },
  {
    id: "commercial",
    title: "Comercial",
    description: "Canais, metas, campanhas, KPIs e precificação.",
    icon: MegaphoneIcon,
    highlight: "4 campanhas ativas",
    tone: "success",
  },
  {
    id: "returns",
    title: "Devoluções",
    description: "Agendamentos de coleta e fluxo de devolução.",
    icon: Undo2Icon,
    highlight: "17 agendadas",
    tone: "warning",
  },
  {
    id: "fulfillment",
    title: "Fulfillment",
    description: "Faturas de fulfillment e expedição de pedidos.",
    icon: PackageIcon,
    highlight: "Em dia",
    tone: "success",
  },
  {
    id: "tickets",
    title: "Tickets",
    description: "Atendimento e suporte integrados à operação.",
    icon: LifeBuoyIcon,
    highlight: "23 na fila",
    tone: "warning",
  },
  {
    id: "catalog",
    title: "Catálogo",
    description: "Mídias de produtos e regras de disponibilidade de estoque.",
    icon: BoxesIcon,
    highlight: "1.204 SKUs",
    tone: "info",
  },
  {
    id: "team",
    title: "Gestão de equipe",
    description: "Usuários, grupos, setores e permissões por tela.",
    icon: UsersIcon,
    highlight: "48 usuários",
    tone: "info",
  },
  {
    id: "dashboards",
    title: "Dashboards",
    description: "Visão geral de desempenho e relatórios exportáveis.",
    icon: BarChart3Icon,
    highlight: "12 painéis",
    tone: "success",
  },
];

type OrderStatus = "pago" | "pendente" | "cancelado";

type Order = {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: OrderStatus;
};

const orders: Order[] = [
  {
    id: "#10432",
    customer: "Ana Martins",
    date: "20 out, 14:32",
    amount: "R$ 420,00",
    status: "pago",
  },
  {
    id: "#10431",
    customer: "Bruno Carvalho",
    date: "20 out, 11:08",
    amount: "R$ 89,90",
    status: "pendente",
  },
  {
    id: "#10430",
    customer: "Lojas Aurora",
    date: "19 out, 18:45",
    amount: "R$ 1.260,00",
    status: "pago",
  },
  {
    id: "#10429",
    customer: "Carla Souza",
    date: "19 out, 09:17",
    amount: "R$ 54,30",
    status: "cancelado",
  },
  {
    id: "#10428",
    customer: "Diego Nunes",
    date: "18 out, 16:02",
    amount: "R$ 310,00",
    status: "pago",
  },
];

const statusVariant: Record<
  OrderStatus,
  "success" | "warning" | "destructive"
> = {
  pago: "success",
  pendente: "warning",
  cancelado: "destructive",
};

const statusLabel: Record<OrderStatus, string> = {
  pago: "Pago",
  pendente: "Pendente",
  cancelado: "Cancelado",
};

type Task = {
  id: string;
  title: string;
  done: boolean;
};

const tasks: Task[] = [
  { id: "t1", title: "Revisar pedidos pendentes", done: false },
  { id: "t2", title: "Aprovar campanha de outubro", done: false },
  { id: "t3", title: "Conciliar pagamentos da semana", done: true },
  { id: "t4", title: "Responder tickets do suporte", done: true },
];

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;
  const TrendIcon =
    metric.trend === "up" ? ArrowUpRightIcon : ArrowDownRightIcon;

  return (
    <Card
      size="sm"
      className="transition-shadow duration-300 ease-out hover:shadow-md"
    >
      <CardHeader>
        <CardDescription>{metric.label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{metric.value}</CardTitle>
        <CardAction>
          <span
            aria-hidden
            className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground ring-1 ring-foreground/10 [&>svg]:size-4"
          >
            <Icon />
          </span>
        </CardAction>
      </CardHeader>
      <CardFooter className="gap-2 text-sm text-muted-foreground">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 font-medium tabular-nums",
            metric.trend === "up" ? "text-success" : "text-destructive",
          )}
        >
          <TrendIcon className="size-3.5" />
          {metric.delta}
        </span>
        <span>{metric.hint}</span>
      </CardFooter>
    </Card>
  );
}

function ModuleCard({ module }: { module: Module }) {
  const Icon = module.icon;

  return (
    <Card
      size="sm"
      className="group/module border border-transparent transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <CardHeader>
        <CardAction>
          <span
            aria-hidden
            className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground ring-1 ring-foreground/10 transition-colors group-hover/module:bg-primary group-hover/module:text-primary-foreground [&>svg]:size-5"
          >
            <Icon />
          </span>
        </CardAction>
        <CardTitle>{module.title}</CardTitle>
        <CardDescription className="text-pretty">
          {module.description}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Badge variant={module.tone}>{module.highlight}</Badge>
      </CardFooter>
    </Card>
  );
}

export function HomePage() {
  return (
    <PageLayout>
      <PageHeader
        title={routeTitle("/home")}
        icon={<HomeIcon />}
        description="Visão geral da operação e dos módulos da plataforma."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <DownloadIcon data-icon="inline-start" />
              Exportar
            </Button>
            <Button size="sm">
              <PlusIcon data-icon="inline-start" />
              Novo pedido
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <LayersIcon className="size-4 text-muted-foreground" />
          <h2 className="font-heading text-lg font-medium">
            Módulos da plataforma
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Pedidos recentes</CardTitle>
            <CardDescription>
              Últimas transações registradas na plataforma.
            </CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="pl-6 font-medium tabular-nums">
                      {order.id}
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.date}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[order.status]}>
                        {statusLabel[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right tabular-nums">
                      {order.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tarefas</CardTitle>
            <CardDescription>
              {tasks.filter((task) => !task.done).length} pendentes de{" "}
              {tasks.length}.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {tasks.map((task) => (
              <label
                key={task.id}
                className="flex cursor-pointer items-center gap-3 text-sm"
              >
                <input
                  type="checkbox"
                  defaultChecked={task.done}
                  className="size-4 shrink-0 rounded border-border accent-primary"
                />
                <span
                  className={cn(
                    task.done && "text-muted-foreground line-through",
                  )}
                >
                  {task.title}
                </span>
              </label>
            ))}
          </CardContent>
          <CardFooter className="border-t">
            <Button variant="outline" size="sm" className="w-full">
              <PlusIcon data-icon="inline-start" />
              Nova tarefa
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
}
