import { useEffect, useState } from "react"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import type { Emissao } from "@/components/emissions/columns"
import { columns } from "@/components/emissions/columns"
import { DataTable } from "@/components/emissions/data-table"
import { EditModal } from "@/components/emissions/edit-modal"
import { StatsDashboard } from "@/components/dashboard/stats-dashboard"
import { Button } from "@/components/ui/button"

import { api } from "@/services/api"

function App() {
  const [data, setData] = useState<Emissao[]>([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEmissao, setSelectedEmissao] = useState<Emissao | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const result = await api.getEmissoes()
      setData(result)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar dados.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleEdit = (emissao: Emissao) => {
    setSelectedEmissao(emissao)
    setIsModalOpen(true)
  }


  const columnsWithAction = columns.map(col => {
    if (col.id === "actions") {
      return {
        ...col,
        cell: ({ row }: any) => {
          return (
            <Button variant="outline" size="sm" onClick={() => handleEdit(row.original)}>
              Editar
            </Button>
          )
        }
      }
    }
    return col
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <main className="container mx-auto p-4 md:p-8 space-y-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">JGP Crédito</h1>
            <p className="text-slate-500">Gestão de ofertas do mercado primário.</p>
          </div>
          <Button onClick={loadData} variant="outline" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Atualizar Dados
          </Button>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4">Visão Geral</h2>
          <StatsDashboard />
        </section>

        <section className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold">Emissões Recentes</h2>
          </div>

          <DataTable columns={columnsWithAction} data={data} />
        </section>

      </main>

      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        emissao={selectedEmissao}
        onSuccess={loadData}
      />

      <Toaster />
    </div>
  )
}

export default App
