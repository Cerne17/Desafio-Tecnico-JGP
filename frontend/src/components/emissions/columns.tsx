import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Emissao = {
  id: number
  data: string // "YYYY-MM-DD"
  valor: number // Vem em centavos (Integer)
  link: string | null
  emissor: string
  tipo: string
}

export const columns: ColumnDef<Emissao>[] = [
  {
    accessorKey: "data",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dataString = row.getValue("data") as string
      // Formata YYYY-MM-DD para DD/MM/YYYY
      const date = new Date(dataString)
      // Ajuste de fuso horário simples
      const formatted = date.toLocaleDateString("pt-BR", { timeZone: "UTC" })
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "emissor",
    header: "Emissor",
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
  },
  {
    accessorKey: "valor",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Valor
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
      const valorCentavos = parseFloat(row.getValue("valor"))
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valorCentavos / 100)
 
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const emissao = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(emissao.id.toString())}
            >
              Copiar ID
            </DropdownMenuItem>
            {emissao.link && (
                <DropdownMenuItem onClick={() => window.open(emissao.link!, "_blank")}>
                    Ver Documento Original
                </DropdownMenuItem>
            )}
            <DropdownMenuItem 
                className="text-blue-600 focus:text-blue-700 font-medium"
                // Aqui vamos conectar com o Modal de Edição depois
                onClick={() => console.log("Editar", emissao)} 
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar Oferta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
