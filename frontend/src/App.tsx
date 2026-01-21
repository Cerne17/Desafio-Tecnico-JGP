import { useEffect, useState } from "react"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import type { Emissao } from "@/components/emissions/columns"
import { columns } from "@/components/emissions/columns"
import { DataTable } from "@/components/emissions/data-table"
import { api } from "@/services/api"
import { Skeleton } from "@/components/ui/skeleton"

function App() {
  const [data, setData] = useState<Emissao[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const result = await api.getEmissoes()
      setData(result)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar dados do servidor.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="container mx-auto p-8 space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">JGP Crédito</h1>
            <p className="text-slate-500">Gestão de ofertas do mercado primário.</p>
          </div>
        </div>

        {/* Dashboard Placeholder */}
        <div className="grid gap-4 md:grid-cols-3">
            {/* Espaço reservado para os Cards */}
        </div>

        {/* Tabela de Dados */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Emissões Recentes</h2>
          
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <DataTable columns={columns} data={data} />
          )}
        </div>

      </main>
      <Toaster />
    </div>
  )
}

export default App
