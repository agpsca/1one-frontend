import type { Metadata } from "next";
import { routeTitle } from "@/components/layout/routes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { semantics } from "@/lib/tokens";
import { ModalDemo } from "../modal-demo";
import { Demo } from "../showcase";
import { ToastDemo } from "../toast-demo";

export const metadata: Metadata = {
  title: routeTitle("/dev/components"),
};

export const instant = false;

export default function ComponentsDocs() {
  return (
    <section className="flex flex-col gap-6">
      <Demo
        name="Alert Dialog"
        note="Para ação irreversível: não fecha por clique fora nem por Esc, e não tem botão de X — a saída é Cancelar ou confirmar."
      >
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="self-start">
              Excluir conta
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir conta</AlertDialogTitle>
              <AlertDialogDescription>
                Todos os dados vinculados serão removidos. Esta ação não pode
                ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction variant="destructive">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Demo>

      <Demo
        name="Badge"
        note="As cinco variantes semânticas reusam os mesmos pares superfície + texto do Callout: badge e callout do mesmo estado nunca divergem de cor."
      >
        <div className="flex flex-wrap items-center gap-3">
          {semantics.map(({ variant }) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
          <Badge variant="secondary">secondary</Badge>
          <Badge variant="outline">outline</Badge>
        </div>
      </Demo>

      <Demo name="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Início</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Produtos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Mesa Lateral</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Demo>

      <Demo name="Button" note="Um `primary` por tela — é o CTA.">
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {(["xs", "sm", "default", "lg"] as const).map((size) => (
            <Button key={size} size={size} variant="secondary">
              {size}
            </Button>
          ))}
        </div>
      </Demo>

      <Demo
        name="Callout"
        note="Mensagem fixa no fluxo da página. Para a mesma mensagem flutuante, use Toast — a pele é a mesma."
      >
        <div className="flex flex-col gap-3">
          {semantics.map((semantic) => (
            <Callout
              key={semantic.variant}
              variant={semantic.variant}
              title={semantic.variant}
            >
              {semantic.whenToUse}
            </Callout>
          ))}
        </div>
      </Demo>

      <Demo name="Card">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Produtos ativos</CardTitle>
              <CardDescription>Atualizado há 5 minutos.</CardDescription>
              <CardAction>
                <Badge variant="success">+12%</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-4xl font-medium">1.284</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                Ver listagem
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Custo médio</CardTitle>
              <CardDescription>Últimos 30 dias.</CardDescription>
              <CardAction>
                <Badge variant="warning">-3%</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-4xl font-medium">R$ 1.540</p>
            </CardContent>
          </Card>
        </div>
      </Demo>

      <Demo
        name="Dialog"
        note="Uso direto, quando o gatilho está ao lado do conteúdo e não há risco de aninhamento em dropdown."
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button className="self-start">Abrir dialog</Button>
          </DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogHeader className="border-b border-border pb-3">
              <DialogTitle>Dialog Example</DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-foreground/80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
              condimentum elementum enim. Cras in malesuada arcu. Sed tincidunt
              nunc ut neque elementum, nec gravida augue tincidunt.
            </DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="text-destructive hover:bg-destructive-surface"
                >
                  Cancelar
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>Confirmar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Demo>

      <Demo
        name="Dropdown Menu"
        note="Gatilho de ações em linha de tabela. Para abrir modal a partir daqui, use a store — Dialog aninhado em dropdown briga pelo foco."
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="self-start">
              Ações
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Produto A</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Editar
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>Duplicar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Demo>

      <Demo
        name="Field"
        note="Invólucro de campo: rótulo, descrição e estado inválido. O inválido usa o token `destructive`, o mesmo do Callout."
      >
        <FieldGroup className="max-w-md">
          <Field>
            <FieldLabel htmlFor="doc-name">Nome</FieldLabel>
            <Input id="doc-name" placeholder="Ana Souza" />
          </Field>
          <Field>
            <FieldLabel htmlFor="doc-email">E-mail</FieldLabel>
            <Input id="doc-email" type="email" placeholder="ana@exemplo.com" />
            <FieldDescription>
              Usado para notificações do sistema.
            </FieldDescription>
          </Field>
          <Field data-invalid="true">
            <FieldLabel htmlFor="doc-sku">SKU</FieldLabel>
            <Input id="doc-sku" aria-invalid defaultValue="??" />
            <FieldDescription>Formato inválido.</FieldDescription>
          </Field>
        </FieldGroup>
      </Demo>

      <Demo
        name="Input"
        note="Sempre com rótulo associado — dentro de um Field, ou com `<Label htmlFor>`."
      >
        <div className="flex max-w-md flex-col gap-3">
          <Input placeholder="Texto" />
          <Input type="email" placeholder="E-mail" />
          <Input type="number" placeholder="Número" />
          <Input placeholder="Desabilitado" disabled />
          <Input aria-invalid defaultValue="Inválido" />
        </div>
      </Demo>

      <Demo
        name="Modal — registro"
        note="Caminho padrão: `useModalStore().open(nome, payload)`. O catálogo fica em stores/modal-types.ts, o mapa nome → componente em components/modal/constants.ts e o ModalProvider na raiz — mesma estrutura do ttp. O payload é tipado por modal, então o consumidor não precisa de cast."
      >
        <ModalDemo />
      </Demo>

      <Demo
        name="Popover"
        note="Conteúdo interativo curto. Formulário inteiro vai para Dialog ou Sheet."
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="self-start">
              Abrir popover
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <PopoverHeader>
              <PopoverTitle>Popover</PopoverTitle>
              <PopoverDescription>
                Ancorado no gatilho, fecha por clique fora e por Esc.
              </PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      </Demo>

      <Demo
        name="Select"
        note="Duas formas de carregamento, porque tem dois: o gatilho antes do valor chegar e a lista buscada ao abrir. Ver a seção Skeletons."
      >
        <div className="flex max-w-md flex-col gap-3">
          <Select defaultValue="active">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="paused">Pausado</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
            </SelectContent>
          </Select>
          <Select disabled>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Desabilitado" />
            </SelectTrigger>
            <SelectContent />
          </Select>
        </div>
      </Demo>

      <Demo
        name="Separator"
        note="Marcação local: não tem estado de carregamento."
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <span className="text-sm text-muted-foreground">horizontal</span>
            <Separator />
          </div>
          <div className="flex h-8 items-center gap-3 text-sm text-muted-foreground">
            <span>vertical</span>
            <Separator orientation="vertical" />
            <span>entre itens</span>
          </div>
        </div>
      </Demo>

      <Demo
        name="Sheet"
        note="Mesma primitiva do Dialog, ancorada numa borda. `side` aceita top, right, bottom e left."
      >
        <div className="flex flex-wrap gap-3">
          {(["right", "left", "top", "bottom"] as const).map((side) => (
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="outline">{side}</Button>
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>Gaveta — {side}</SheetTitle>
                  <SheetDescription>
                    Cabeçalho e rodapé carregam o próprio padding; o corpo rola.
                  </SheetDescription>
                </SheetHeader>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="outline">Fechar</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      </Demo>

      <Demo
        name="Table"
        note="Primitivas de marcação, sem ordenação nem paginação. A data-table (TanStack) entra quando a primeira listagem real precisar."
      >
        <Table>
          <TableCaption>Produtos cadastrados no período.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Custo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { sku: "A-1001", name: "Mesa Lateral", status: "success" },
              { sku: "A-1002", name: "Cadeira Alta", status: "warning" },
              {
                sku: "A-1003",
                name: "Estante Dupla",
                status: "destructive",
              },
            ].map((row, index) => (
              <TableRow key={row.sku}>
                <TableCell className="font-mono text-xs">{row.sku}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      row.status as "success" | "warning" | "destructive"
                    }
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-xs">
                  R$ {(1200 + index * 340).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Demo>

      <Demo
        name="Toast"
        note="Mesma pele do Callout sobre as primitivas do Radix Toast: timer, pausa no hover, swipe e região live. Dispara no fim de uma ação; para avisar durante, use Callout."
      >
        <ToastDemo />
      </Demo>

      <Demo
        name="Tooltip"
        note="Só texto de apoio. Nada clicável dentro — não é alcançável por teclado nem em toque."
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="self-start">
              Passe o mouse
            </Button>
          </TooltipTrigger>
          <TooltipContent>Texto curto, só de apoio.</TooltipContent>
        </Tooltip>
      </Demo>
    </section>
  );
}
