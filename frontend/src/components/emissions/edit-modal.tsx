import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Emissao } from "./columns"
import { api } from "@/services/api"

const formSchema = z.object({
  valor: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "O valor deve ser um número positivo.",
  }),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Data inválida (formato esperado: YYYY-MM-DD)",
  }),
  link: z.string().url({ message: "Insira uma URL válida" }).optional().or(z.literal("")),
})

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  emissao: Emissao | null
  onSuccess: () => void // Para atualizar a tabela após salvar
}

export function EditModal({ isOpen, onClose, emissao, onSuccess }: EditModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valor: "",
      data: "",
      link: "",
    },
  })

  useEffect(() => {
    if (emissao) {
      form.reset({
        valor: (emissao.valor / 100).toFixed(2), // Converte centavos para real
        data: emissao.data, // Já vem YYYY-MM-DD do backend
        link: emissao.link || "",
      })
    }
  }, [emissao, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!emissao) return

    try {
      const payload = {
        ...values,
        valor: parseFloat(values.valor),
      }
      
      await api.updateEmissao(emissao.id, payload)
      toast.success("Emissão atualizada com sucesso!")
      onSuccess()
      onClose()
    } catch (error) {
      console.error(error)
      toast.error("Erro ao salvar alterações.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Oferta #{emissao?.id}</DialogTitle>
          <DialogDescription>
            Alterações feitas aqui serão salvas imediatamente no banco de dados.
            <br/>
            <strong>Emissor:</strong> {emissao?.emissor} | <strong>Tipo:</strong> {emissao?.tipo}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Emissão</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input placeholder="1000.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link do Documento</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
