import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/services/api"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface StatsData {
  geral: {
    total_emissoes: number
    valor_total_centavos: number
    valor_medio_centavos: number
  }
  por_emissor: { nome: string; valor_total: number }[]
  por_tipo: { codigo: string; valor_total: number }[]
}

export function StatsDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val / 100)

  if (loading) return (
    <div className="grid gap-4 md:grid-cols-3">
      <Skeleton className="h-24 rounded-xl"/>
      <Skeleton className="h-24 rounded-xl"/>
      <Skeleton className="h-24 rounded-xl"/>
    </div>
  )
  
  if (!stats) return null

  return (
    <div className="space-y-6">
      {/* Cards KPI */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Emissões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.geral.total_emissoes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.geral.valor_total_centavos)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.geral.valor_medio_centavos)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico Top Emissores */}
      <Card>
        <CardHeader>
            <CardTitle>Top 10 Emissores por Volume</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.por_emissor}>
                    <XAxis 
                      dataKey="nome" 
                      tick={{fontSize: 12}} 
                      interval={0} 
                      angle={-15} 
                      textAnchor="end" 
                      height={60}
                    />
                    <YAxis 
                      tickFormatter={(val) => `R$ ${(val/100/1000000).toFixed(0)}M`} 
                      width={80}
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      formatter={(value) => [formatCurrency(Number(value || 0)), "Valor Total"]}
                      labelStyle={{ color: "#333" }}
                    />
                    <Bar 
                      dataKey="valor_total" 
                      fill="#2563eb" 
                      radius={[4, 4, 0, 0]} 
                    />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
