"use client"

import { useState } from "react"
import { 
  PieChart, 
  Plus, 
  Search, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  LayoutGrid, 
  List, 
  CheckCircle2, 
  FileText, 
  Download, 
  ChevronRight,
  Eye,
  ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useDemoUser } from "@/lib/prototype-auth"

interface FinancialReport {
  id: string
  period: string
  year: number
  month: string
  totalIncome: number
  totalExpense: number
  netBalance: number
  status: "approved" | "under_review"
  auditDate: string
  auditorName: string
  incomeBreakdown: { category: string; amount: number }[]
  expenseBreakdown: { category: string; amount: number }[]
}

const initialReports: FinancialReport[] = [
  {
    id: "1",
    period: "Julho / 2026",
    year: 2026,
    month: "07",
    totalIncome: 45800,
    totalExpense: 32400,
    netBalance: 13400,
    status: "approved",
    auditDate: "2026-08-05",
    auditorName: "Conselho Fiscal Siloé",
    incomeBreakdown: [
      { category: "Dízimos", amount: 31000 },
      { category: "Ofertas de Culto", amount: 9800 },
      { category: "Ofertas Especiais / Missões", amount: 5000 }
    ],
    expenseBreakdown: [
      { category: "Manutenção & Utilidades (Água/Luz)", amount: 11200 },
      { category: "Preletores & Ajuda Pastoral", amount: 9500 },
      { category: "Ação Social & Cestas", amount: 6200 },
      { category: "Manutenção de Equipamentos", amount: 5500 }
    ]
  },
  {
    id: "2",
    period: "Junho / 2026",
    year: 2026,
    month: "06",
    totalIncome: 42500,
    totalExpense: 38900,
    netBalance: 3600,
    status: "approved",
    auditDate: "2026-07-04",
    auditorName: "Conselho Fiscal Siloé",
    incomeBreakdown: [
      { category: "Dízimos", amount: 29500 },
      { category: "Ofertas de Culto", amount: 8200 },
      { category: "Ofertas de Construção", amount: 4800 }
    ],
    expenseBreakdown: [
      { category: "Reforma do Anexo Infantil", amount: 14500 },
      { category: "Manutenção & Utilidades", amount: 10800 },
      { category: "Preletores & Ajuda Pastoral", amount: 9000 },
      { category: "Ação Social", amount: 4600 }
    ]
  },
  {
    id: "3",
    period: "Maio / 2026",
    year: 2026,
    month: "05",
    totalIncome: 48200,
    totalExpense: 31000,
    netBalance: 17200,
    status: "approved",
    auditDate: "2026-06-03",
    auditorName: "Conselho Fiscal Siloé",
    incomeBreakdown: [
      { category: "Dízimos", amount: 33000 },
      { category: "Ofertas de Culto", amount: 10200 },
      { category: "Inscrições Evento de Casais", amount: 5000 }
    ],
    expenseBreakdown: [
      { category: "Despesas Evento Casais", amount: 4800 },
      { category: "Manutenção & Utilidades", amount: 11000 },
      { category: "Preletores & Ajuda Pastoral", amount: 9200 },
      { category: "Missões & Evang.", amount: 6000 }
    ]
  }
]

export default function PrestacaoContasPage() {
  const { user, role } = useDemoUser()
  const isFinanceManager = role === "admin" || role === "tesoureiro"

  const [reports, setReports] = useState<FinancialReport[]>(initialReports)
  const [search, setSearch] = useState("")
  const [selectedReport, setSelectedReport] = useState<FinancialReport | null>(null)
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards")

  // Modal Novo Relatório
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newPeriod, setNewPeriod] = useState("")
  const [newIncome, setNewIncome] = useState("")
  const [newExpense, setNewExpense] = useState("")
  const [newAuditor, setNewAuditor] = useState("Conselho Fiscal")

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault()

    const incomeVal = parseFloat(newIncome) || 0
    const expenseVal = parseFloat(newExpense) || 0
    const balance = incomeVal - expenseVal

    const created: FinancialReport = {
      id: Date.now().toString(),
      period: newPeriod || "Agosto / 2026",
      year: 2026,
      month: "08",
      totalIncome: incomeVal,
      totalExpense: expenseVal,
      netBalance: balance,
      status: "approved",
      auditDate: new Date().toISOString().split("T")[0],
      auditorName: newAuditor,
      incomeBreakdown: [
        { category: "Entradas Gerais", amount: incomeVal }
      ],
      expenseBreakdown: [
        { category: "Saídas Gerais", amount: expenseVal }
      ]
    }

    setReports([created, ...reports])
    setIsDialogOpen(false)
    setNewPeriod("")
    setNewIncome("")
    setNewExpense("")
    toast.success("Prestação de contas publicada com sucesso!")
  }

  const handleDownloadReport = (period: string) => {
    toast.success(`Download do Balancete PDF (${period}) iniciado!`)
  }

  const filteredReports = reports.filter(r => 
    r.period.toLowerCase().includes(search.toLowerCase()) || 
    r.auditorName.toLowerCase().includes(search.toLowerCase())
  )

  // KPI Totais
  const totalIncomeAll = reports.reduce((acc, r) => acc + r.totalIncome, 0)
  const totalExpenseAll = reports.reduce((acc, r) => acc + r.totalExpense, 0)
  const totalBalanceAll = totalIncomeAll - totalExpenseAll

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2.5">
            <PieChart className="size-7 text-accent shrink-0" />
            Prestação de Contas
          </h1>
          <p className="text-sm text-muted-foreground max-w-3xl">
            Transparência financeira e relatórios periódicos para toda a igreja.
          </p>
        </div>

        {isFinanceManager && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger 
              render={
                <Button className="w-full sm:w-auto gap-2 bg-accent hover:bg-accent/90 text-accent-foreground whitespace-nowrap shrink-0">
                  <Plus className="size-4" />
                  Publicar Balancete
                </Button>
              }
            />
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleCreateReport}>
              <DialogHeader>
                <DialogTitle>Publicar Prestação de Contas</DialogTitle>
                <DialogDescription>
                  Adicione o balancete mensal aprovado pelo conselho fiscal.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="rperiod">Mês / Ano de Referência</Label>
                  <Input 
                    id="rperiod" 
                    placeholder="Ex: Agosto / 2026" 
                    value={newPeriod}
                    onChange={e => setNewPeriod(e.target.value)}
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="rincome">Total de Entradas (R$)</Label>
                    <Input 
                      id="rincome"
                      type="number"
                      placeholder="0.00" 
                      value={newIncome}
                      onChange={e => setNewIncome(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rexpense">Total de Saídas (R$)</Label>
                    <Input 
                      id="rexpense"
                      type="number"
                      placeholder="0.00" 
                      value={newExpense}
                      onChange={e => setNewExpense(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="rauditor">Órgão / Conselho Auditor</Label>
                  <Input 
                    id="rauditor"
                    value={newAuditor}
                    onChange={e => setNewAuditor(e.target.value)}
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Publicar Balancete</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        )}
      </div>

      {/* KPI Cards Summary */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Total Arrecadado (Acumulado)</p>
              <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                R$ {totalIncomeAll.toLocaleString('pt-BR')}
              </h3>
            </div>
            <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-rose-500/10 border-rose-500/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">Total Investido / Saídas</p>
              <h3 className="text-xl font-bold text-rose-700 dark:text-rose-300">
                R$ {totalExpenseAll.toLocaleString('pt-BR')}
              </h3>
            </div>
            <div className="rounded-full bg-rose-500/20 p-2 text-rose-600 dark:text-rose-400">
              <TrendingDown className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-accent">Saldo Livre Acumulado</p>
              <h3 className="text-xl font-bold text-foreground">
                R$ {totalBalanceAll.toLocaleString('pt-BR')}
              </h3>
            </div>
            <div className="rounded-full bg-accent/20 p-2 text-accent">
              <DollarSign className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 rounded-xl border border-border/40 bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por período ou conselho..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-muted/40 p-1 self-end md:self-auto">
          <Button
            variant={viewMode === "cards" ? "secondary" : "ghost"}
            size="icon"
            className="size-8"
            onClick={() => setViewMode("cards")}
            title="Visualização em Cards"
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="size-8"
            onClick={() => setViewMode("list")}
            title="Visualização em Lista"
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>

      {/* Grid vs List View */}
      {filteredReports.length === 0 ? (
        <Card className="p-8 text-center">
          <CardContent className="space-y-3 pt-6">
            <FileText className="mx-auto size-12 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">Nenhum balancete encontrado</h3>
            <p className="text-sm text-muted-foreground">Tente alterar os termos de busca.</p>
          </CardContent>
        </Card>
      ) : viewMode === "cards" ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map(report => (
            <Card key={report.id} className="flex flex-col justify-between transition-all hover:border-accent/40 shadow-sm">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="font-bold text-accent">
                    {report.period}
                  </Badge>
                  <Badge variant="secondary" className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                    <ShieldCheck className="size-3" /> Auditado
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold">Balancete Mensal</CardTitle>
                <CardDescription className="text-xs">
                  Auditado por {report.auditorName} em {new Date(report.auditDate).toLocaleDateString('pt-BR')}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 flex-1 text-xs">
                <div className="space-y-2 rounded-lg border border-border/40 bg-muted/20 p-3">
                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Entradas Totais:</span>
                    <span className="font-bold">+ R$ {report.totalIncome.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between items-center text-rose-600 dark:text-rose-400 font-medium">
                    <span>Saídas Totais:</span>
                    <span className="font-bold">- R$ {report.totalExpense.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="border-t border-border/40 pt-2 flex justify-between items-center font-bold text-sm text-foreground">
                    <span>Saldo Superávit:</span>
                    <span className="text-accent">R$ {report.netBalance.toLocaleString('pt-BR')}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase text-muted-foreground">Categorias Principais</p>
                  <div className="space-y-1 text-muted-foreground">
                    {report.incomeBreakdown.slice(0, 2).map((inc, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="truncate">{inc.category}</span>
                        <span className="font-semibold">R$ {inc.amount.toLocaleString('pt-BR')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t border-border/40 pt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 gap-1 text-xs"
                  onClick={() => setSelectedReport(report)}
                >
                  <Eye className="size-3.5" /> Detalhes
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="gap-1 text-xs"
                  onClick={() => handleDownloadReport(report.period)}
                >
                  <Download className="size-3.5" /> PDF
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredReports.map(report => (
            <Card key={report.id} className="p-4 transition-all hover:border-accent/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-bold text-accent">{report.period}</Badge>
                    <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600">Auditado</Badge>
                  </div>
                  <h3 className="text-base font-bold">Prestação de Contas - {report.period}</h3>
                  <p className="text-xs text-muted-foreground">Auditado por {report.auditorName}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold shrink-0">
                  <div className="text-emerald-600 dark:text-emerald-400">
                    Entradas: R$ {report.totalIncome.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-rose-600 dark:text-rose-400">
                    Saídas: R$ {report.totalExpense.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-accent font-bold">
                    Saldo: R$ {report.netBalance.toLocaleString('pt-BR')}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedReport(report)}
                      className="gap-1 text-xs"
                    >
                      <Eye className="size-3.5" /> Detalhes
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => handleDownloadReport(report.period)}
                      className="gap-1 text-xs"
                    >
                      <Download className="size-3.5" /> PDF
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Detalhado do Balancete */}
      <Dialog open={!!selectedReport} onOpenChange={open => !open && setSelectedReport(null)}>
        <DialogContent className="sm:max-w-[650px]">
          {selectedReport && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-accent font-bold">{selectedReport.period}</Badge>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">
                    Auditado e Aprovado
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-bold mt-2">Detalhamento da Prestação de Contas</DialogTitle>
                <DialogDescription className="text-xs">
                  Auditoria por {selectedReport.auditorName} em {new Date(selectedReport.auditDate).toLocaleDateString('pt-BR')}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-3 text-xs sm:text-sm">
                {/* Entradas */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                    <TrendingUp className="size-4" />
                    Discriminação de Entradas (Receitas)
                  </h4>
                  <div className="space-y-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                    {selectedReport.incomeBreakdown.map((inc, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-border/20 last:border-0 pb-1.5 last:pb-0">
                        <span>{inc.category}</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          + R$ {inc.amount.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold pt-2 border-t border-emerald-500/30 text-sm">
                      <span>Total Entradas</span>
                      <span>R$ {selectedReport.totalIncome.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                {/* Saídas */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                    <TrendingDown className="size-4" />
                    Discriminação de Saídas (Despesas & Investimentos)
                  </h4>
                  <div className="space-y-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 p-3">
                    {selectedReport.expenseBreakdown.map((exp, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-border/20 last:border-0 pb-1.5 last:pb-0">
                        <span>{exp.category}</span>
                        <span className="font-bold text-rose-600 dark:text-rose-400">
                          - R$ {exp.amount.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold pt-2 border-t border-rose-500/30 text-sm">
                      <span>Total Saídas</span>
                      <span>R$ {selectedReport.totalExpense.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                {/* Resultado */}
                <div className="rounded-lg border border-accent/30 bg-accent/10 p-3 flex justify-between items-center font-bold text-sm">
                  <span>Resultado Superavitário Líquido:</span>
                  <span className="text-accent text-base">R$ {selectedReport.netBalance.toLocaleString('pt-BR')}</span>
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="secondary" 
                  onClick={() => handleDownloadReport(selectedReport.period)}
                  className="gap-2"
                >
                  <Download className="size-4" /> Baixar Balancete Completo (PDF)
                </Button>
                <Button variant="outline" onClick={() => setSelectedReport(null)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
