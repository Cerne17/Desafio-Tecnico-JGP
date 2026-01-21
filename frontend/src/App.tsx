import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">JGP Crédito - Painel de Emissões</h1>
        
        <p className="text-slate-500">O sistema está sendo carregado...</p>
      </main>
      
      <Toaster />
    </div>
  )
}

export default App;
