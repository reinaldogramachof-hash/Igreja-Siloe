"use client"

import { useMemo, useState } from "react"
import {
  Landmark,
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Filter,
  Search,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Receipt,
  PiggyBank,
  Building2,
  DollarSign,
  ChevronRight,
  Printer,
  Sparkles,
  LayoutGrid,
  List,
} from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  cultoOfferings as initialCultos,
  financialTransactions as initialTransactions,
  members,
} from "@/lib/mock-data"
import type {
  FinancialAccount,
  FinancialCategory,
  FinancialTransaction,
  FinancialTransactionType,
  CultoOfferingSummary,
} from "@/lib/types"
import { useDemoUser } from "@/lib/prototype-auth"
import { getRoleLabel } from "@/lib/mock-data"
import Link from "next/link"
import { cn } from "@/lib/utils"

const categoryOptions: FinancialCategory[] = [
  "Dízimos",
  "Ofertas Gerais",
  "Oferta de Missões",
  "Oferta de Construção",
  "Eventos / Inscrições",
  "Manutenção & Reformas",
  "Energia / Água / Telecom",
  "Aluguel & Taxas",
  "Preletor / Abono Pastoral",
  "Ação Social / Cestas",
  "Equipamentos / Som",
  "Material de Escritório / Limpeza",
]

const accountOptions: FinancialAccount[] = [
  "Conta Corrente Itaú",
  "Caixa Físico (Tesouraria)",
  "Chave PIX Oficial",
]

export default function FinanceiroPage() {
  const { user, role } = useDemoUser()
  const isFinanceManager = role === "admin" || role === "tesoureiro"

  // Active Tab
  const [activeTab, setActiveTab] = useState<"geral" | "lancamentos" | "cultos" | "contas">("geral")

  // Transactions State
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => [...initialTransactions])
  const [cultos, setCultos] = useState<CultoOfferingSummary[]>(() => [...initialCultos])

  // Filters State
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<"todos" | "receita" | "despesa">("todos")
  const [categoryFilter, setCategoryFilter] = useState<string>("todas")

  // View Mode (Cards vs Table)
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards")

  // Modal States
  const [isTxModalOpen, setIsTxModalOpen] = useState(false)
  const [isCultoModalOpen, setIsCultoModalOpen] = useState(false)
  const [selectedTxDetail, setSelectedTxDetail] = useState<FinancialTransaction | null>(null)

  // Transaction Form State
  const [txType, setTxType] = useState<FinancialTransactionType>("receita")
  const [txCategory, setTxCategory] = useState<FinancialCategory>("Dízimos")
  const [txDescription, setTxDescription] = useState("")
  const [txAmount, setTxAmount] = useState("")
  const [txDate, setTxDate] = useState(new Date().toISOString().split("T")[0])
  const [txAccount, setTxAccount] = useState<FinancialAccount>("Conta Corrente Itaú")
  const [txPaymentMethod, setTxPaymentMethod] = useState<"PIX" | "Dinheiro" | "Transferência" | "Cartão" | "Boleto">("PIX")
  const [txMemberName, setTxMemberName] = useState("")

  // Culto Form State
  const [cultoServiceName, setCultoServiceName] = useState("Culto de Celebração (Domingo 19h)")
  const [cultoDate, setCultoDate] = useState(new Date().toISOString().split("T")[0])
  const [cultoDizimos, setCultoDizimos] = useState("")
  const [cultoOfertas, setCultoOfertas] = useState("")
  const [cultoMissoes, setCultoMissoes] = useState("")

  // Financial KPI Computations
  const totalReceitas = useMemo(() => {
    return transactions
      .filter((t) => t.type === "receita" && t.status === "confirmado")
      .reduce((acc, curr) => acc + curr.amount, 0)
  }, [transactions])

  const totalDespesas = useMemo(() => {
    return transactions
      .filter((t) => t.type === "despesa" && t.status === "confirmado")
      .reduce((acc, curr) => acc + curr.amount, 0)
  }, [transactions])

  const saldoTotal = useMemo(() => {
    return 31200.0 + (totalReceitas - totalDespesas)
  }, [totalReceitas, totalDespesas])

  const saldoCaixaFisico = useMemo(() => {
    const rec = transactions.filter(t => t.account === "Caixa Físico (Tesouraria)" && t.type === "receita" && t.status === "confirmado").reduce((a, b) => a + b.amount, 0)
    const desp = transactions.filter(t => t.account === "Caixa Físico (Tesouraria)" && t.type === "despesa" && t.status === "confirmado").reduce((a, b) => a + b.amount, 0)
    return 3500.0 + (rec - desp)
  }, [transactions])

  const saldoItau = useMemo(() => {
    const rec = transactions.filter(t => t.account === "Conta Corrente Itaú" && t.type === "receita" && t.status === "confirmado").reduce((a, b) => a + b.amount, 0)
    const desp = transactions.filter(t => t.account === "Conta Corrente Itaú" && t.type === "despesa" && t.status === "confirmado").reduce((a, b) => a + b.amount, 0)
    return 27700.0 + (rec - desp)
  }, [transactions])

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.memberName && t.memberName.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesType = typeFilter === "todos" || t.type === typeFilter
      const matchesCategory = categoryFilter === "todas" || t.category === categoryFilter
      return matchesSearch && matchesType && matchesCategory
    })
  }, [transactions, searchTerm, typeFilter, categoryFilter])

  // Handlers
  function handleAddTransaction(e: React.FormEvent) {
    e.preventDefault()
    if (!txDescription || !txAmount || Number(txAmount) <= 0) {
      toast.error("Por favor, preencha a descrição e um valor válido.")
      return
    }

    const newTx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      type: txType,
      category: txCategory,
      description: txDescription,
      amount: parseFloat(txAmount),
      date: txDate,
      account: txAccount,
      paymentMethod: txPaymentMethod,
      status: "confirmado",
      memberName: txMemberName ? txMemberName : undefined,
    }

    setTransactions([newTx, ...transactions])
    setIsTxModalOpen(false)
    resetTxForm()
    toast.success(txType === "receita" ? "Receita lançada com sucesso!" : "Despesa registrada com sucesso!")
  }

  function handleAddCulto(e: React.FormEvent) {
    e.preventDefault()
    const diz = parseFloat(cultoDizimos || "0")
    const ofe = parseFloat(cultoOfertas || "0")
    const mis = parseFloat(cultoMissoes || "0")
    const total = diz + ofe + mis

    if (total <= 0) {
      toast.error("Insira ao menos um valor arrecadado para fechar o culto.")
      return
    }

    const newCulto: CultoOfferingSummary = {
      id: `co-${Date.now()}`,
      date: cultoDate,
      serviceName: cultoServiceName,
      dizimosAmount: diz,
      ofertasAmount: ofe,
      ofertaMissoesAmount: mis,
      totalAmount: total,
      status: "fechado",
      responsible: `${user.name} (${user.role === "admin" ? "Admin" : "Tesouraria"})`,
    }

    // Criar também a transação de entrada automática no extrato
    const newTx: FinancialTransaction = {
      id: `tx-culto-${Date.now()}`,
      type: "receita",
      category: "Ofertas Gerais",
      description: `Fechamento ${cultoServiceName}`,
      amount: total,
      date: cultoDate,
      account: "Conta Corrente Itaú",
      paymentMethod: "Dinheiro",
      status: "confirmado",
    }

    setCultos([newCulto, ...cultos])
    setTransactions([newTx, ...transactions])
    setIsCultoModalOpen(false)
    resetCultoForm()
    toast.success("Fechamento de culto registrado no livro caixa!")
  }

  function resetTxForm() {
    setTxType("receita")
    setTxCategory("Dízimos")
    setTxDescription("")
    setTxAmount("")
    setTxMemberName("")
  }

  function resetCultoForm() {
    setCultoDizimos("")
    setCultoOfertas("")
    setCultoMissoes("")
  }

  function handleExportDRE() {
    toast.info("Gerando DRE sintético e extrato em PDF...", {
      description: "O documento com os balanços deste mês foi compilado.",
    })
  }

  if (!isFinanceManager) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6 animate-fade-in">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-danger/10 text-danger mb-4 shadow-sm border border-danger/20">
          <ShieldAlert className="size-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Acesso Restrito</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
          Você está navegando como <span className="font-semibold text-foreground">{getRoleLabel(role)}</span>. O Módulo Financeiro é de acesso exclusivo para a Administração e Tesouraria. Para ver um resumo financeiro, acesse a Prestação de Contas.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/prestacao-contas" className="inline-flex h-10 items-center justify-center rounded-xl bg-accent px-6 text-sm font-semibold text-white shadow transition-colors hover:bg-accent/90">
            Ir para Prestação de Contas
          </Link>
          <Link href="/dashboard" className="inline-flex h-10 items-center justify-center rounded-xl bg-muted px-6 text-sm font-semibold text-foreground shadow transition-colors hover:bg-muted/80">
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent shrink-0">
              <Landmark className="size-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Tesouraria & Finanças
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-3xl">
            Gestão transparente de dízimos, ofertas, contas a pagar e prestações de contas da Igreja Siloé.
          </p>
        </div>

        {isFinanceManager && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
            <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:items-center sm:w-auto">
              <Button
                onClick={handleExportDRE}
                variant="outline"
                size="sm"
                className="gap-2 rounded-xl h-10 px-3 border-border/60 hover:bg-muted font-semibold whitespace-nowrap text-xs sm:text-sm w-full sm:w-auto"
              >
                <FileSpreadsheet className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                Relatório DRE
              </Button>
              <Button
                onClick={() => setIsCultoModalOpen(true)}
                variant="outline"
                size="sm"
                className="gap-2 rounded-xl h-10 px-3 border-accent/40 bg-accent-soft/20 text-accent hover:bg-accent-soft/40 font-semibold whitespace-nowrap text-xs sm:text-sm w-full sm:w-auto"
              >
                <Receipt className="size-4 shrink-0" />
                Lançar Culto
              </Button>
            </div>
            <Button
              onClick={() => setIsTxModalOpen(true)}
              size="sm"
              className="gap-2 rounded-xl h-10 px-4 bg-accent hover:bg-accent/90 text-white font-semibold shadow-md shadow-accent/10 whitespace-nowrap text-xs sm:text-sm w-full sm:w-auto"
            >
              <Plus className="size-4.5 shrink-0" />
              Novo Lançamento
            </Button>
          </div>
        )}
      </div>

      {/* CARDS DE KPI FINANCEIROS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="size-16 text-foreground" />
          </div>
          <CardContent className="p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Saldo Geral Consolidado</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1 tracking-tight">
              R$ {saldoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </h3>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/30 pt-2">
              <span>Itaú: R$ {saldoItau.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              <span>Caixa: R$ {saldoCaixaFisico.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-15">
            <TrendingUp className="size-16 text-emerald-500" />
          </div>
          <CardContent className="p-5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="size-4" /> Entradas / Arrecadação
            </div>
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tracking-tight">
              R$ {totalReceitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </h3>
            <p className="mt-3 text-[11px] font-medium text-emerald-700/80 dark:text-emerald-300/80 border-t border-emerald-500/20 pt-2 flex items-center justify-between">
              <span>Dízimos & Ofertas no mês</span>
              <span className="font-bold">+12.4% vs mês ant.</span>
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-rose-500/20 bg-rose-500/5 backdrop-blur-md shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-15">
            <TrendingDown className="size-16 text-rose-500" />
          </div>
          <CardContent className="p-5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              <ArrowDownLeft className="size-4" /> Saídas / Despesas
            </div>
            <h3 className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 tracking-tight">
              R$ {totalDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </h3>
            <p className="mt-3 text-[11px] font-medium text-rose-700/80 dark:text-rose-300/80 border-t border-rose-500/20 pt-2 flex items-center justify-between">
              <span>Manutenção, Contas e Ações</span>
              <span className="font-bold">Dentro da Meta</span>
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-accent/30 bg-accent-soft/20 backdrop-blur-md shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-15">
            <PiggyBank className="size-16 text-accent" />
          </div>
          <CardContent className="p-5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
              <Sparkles className="size-4" /> Resultado / Superávit
            </div>
            <h3 className="text-2xl font-extrabold text-accent mt-1 tracking-tight">
              R$ {(totalReceitas - totalDespesas).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </h3>
            <p className="mt-3 text-[11px] font-medium text-muted-foreground border-t border-accent/20 pt-2 flex items-center justify-between">
              <span>Saldo Operacional Mês</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Positivo</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ABA DE NAVEGAÇÃO INTERNA */}
      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 border-b border-border/40 pb-3 w-full sm:w-auto">
        <Button
          variant={activeTab === "geral" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("geral")}
          className="rounded-xl h-9 text-xs font-bold px-3 w-full sm:w-auto"
        >
          Visão Geral & Gráficos
        </Button>
        <Button
          variant={activeTab === "lancamentos" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("lancamentos")}
          className="rounded-xl h-9 text-xs font-bold px-3 relative w-full sm:w-auto"
        >
          Extrato Lançamentos
          <Badge className="ml-1.5 bg-accent-soft text-accent text-[10px] px-1.5 py-0 font-bold border-0">
            {transactions.length}
          </Badge>
        </Button>
        <Button
          variant={activeTab === "cultos" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("cultos")}
          className="rounded-xl h-9 text-xs font-bold px-3 w-full sm:w-auto"
        >
          Envelope de Cultos
        </Button>
        <Button
          variant={activeTab === "contas" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("contas")}
          className="rounded-xl h-9 text-xs font-bold px-3 w-full sm:w-auto"
        >
          Contas a Pagar
        </Button>
      </div>

      {/* Conteúdo Aba 1: VISÃO GERAL */}
      {activeTab === "geral" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resumo de Contas Bancárias */}
          <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm">
            <CardHeader className="p-4 pb-2 border-b border-border/30">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                <Building2 className="size-4 text-accent" />
                Contas & Tesouraria
              </CardTitle>
              <CardDescription className="text-xs">Saldos atuais e caixas de movimentação</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs">
                    ITAÚ
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Conta Corrente Sede</p>
                    <p className="text-[10px] text-muted-foreground">Ag: 0412 · CC: 98214-5</p>
                  </div>
                </div>
                <p className="text-sm font-extrabold text-foreground">
                  R$ {saldoItau.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                    PIX
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Chave PIX Oficial (CNPJ)</p>
                    <p className="text-[10px] text-muted-foreground">pix@igrejasiloe.org.br</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px]">
                  Integrado
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    R$
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Caixa Físico (Espécie)</p>
                    <p className="text-[10px] text-muted-foreground">Fundo Fixo da Secretaria</p>
                  </div>
                </div>
                <p className="text-sm font-extrabold text-foreground">
                  R$ {saldoCaixaFisico.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico Visual de Distribuição por Categoria (CSS Purista) */}
          <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm lg:col-span-2">
            <CardHeader className="p-4 pb-2 border-b border-border/30 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                  <DollarSign className="size-4 text-accent" />
                  Distribuição de Despesas Por Categoria
                </CardTitle>
                <CardDescription className="text-xs">Para onde foram os recursos da igreja este mês</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-semibold">Agosto / 2026</Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span>Manutenção, Energia & Aluguel do Templo</span>
                    <span className="font-bold">R$ 5.690,20 (52%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "52%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span>Ação Social & Cestas Básicas</span>
                    <span className="font-bold">R$ 2.400,00 (22%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "22%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span>Equipamentos de Som & Audiovisual</span>
                    <span className="font-bold">R$ 1.120,00 (10%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: "10%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span>Honorários de Preletores & Eventos</span>
                    <span className="font-bold">R$ 1.600,00 (16%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: "16%" }} />
                  </div>
                </div>
              </div>

              {/* Banner Informativo Transparência */}
              <div className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent-soft/10 p-3 text-xs text-muted-foreground">
                <Sparkles className="size-5 shrink-0 text-accent" />
                <p>
                  <span className="font-bold text-foreground">Transparência Ativa:</span> Todos os lançamentos possuem suporte para anexo de nota fiscal/recibo em PDF para prestação de contas no conselho fiscal.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Conteúdo Aba 2: EXTRATO DE LANÇAMENTOS */}
      {(activeTab === "geral" || activeTab === "lancamentos") && (
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
          <CardHeader className="p-4 border-b border-border/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Extrato Financeiro</CardTitle>
              <CardDescription className="text-xs">
                Histórico detalhado de todas as entradas e saídas registradas no caixa
              </CardDescription>
            </div>

            {/* Filtros da Tabela & Modo de Visualização */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Buscar lançamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 pl-8 text-xs rounded-xl border-border/50"
                />
              </div>

              <div className="flex items-center gap-1 rounded-xl border border-border/40 bg-background/50 p-1">
                <Button
                  variant={typeFilter === "todos" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTypeFilter("todos")}
                  className="h-6 text-[10px] font-bold px-2 rounded-lg"
                >
                  Todos
                </Button>
                <Button
                  variant={typeFilter === "receita" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTypeFilter("receita")}
                  className="h-6 text-[10px] font-bold px-2 rounded-lg text-emerald-600 dark:text-emerald-400"
                >
                  Entradas
                </Button>
                <Button
                  variant={typeFilter === "despesa" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTypeFilter("despesa")}
                  className="h-6 text-[10px] font-bold px-2 rounded-lg text-rose-600 dark:text-rose-400"
                >
                  Saídas
                </Button>
              </div>

              {/* TOGGLE CARDS / LISTA */}
              <div className="flex items-center gap-1 rounded-xl bg-muted/60 p-1 border border-border/50 shrink-0">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("table")}
                  className="size-7 rounded-lg"
                  title="Visualização em Lista/Tabela"
                >
                  <List className="size-3.5" />
                </Button>
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("cards")}
                  className="size-7 rounded-lg"
                  title="Visualização em Cards"
                >
                  <LayoutGrid className="size-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {viewMode === "cards" ? (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <Card key={tx.id} className="rounded-2xl border-border/40 bg-card/60 p-4 space-y-3 shadow-xs flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-bold border-0",
                              tx.type === "receita"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            )}
                          >
                            {tx.type === "receita" ? "↑ Receita" : "↓ Despesa"}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground font-semibold">{tx.date}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground">{tx.description}</h4>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium">
                              {tx.category}
                            </Badge>
                            {tx.memberName && (
                              <span className="text-[11px] text-muted-foreground">Doador: {tx.memberName}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">{tx.account}</p>
                            <p className="text-xs font-semibold text-foreground">{tx.paymentMethod}</p>
                          </div>
                          <div className="text-right">
                            <p
                              className={cn(
                                "text-base font-extrabold",
                                tx.type === "receita"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-rose-600 dark:text-rose-400"
                              )}
                            >
                              {tx.type === "receita" ? "+" : "-"} R${" "}
                              {tx.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTxDetail(tx)}
                          className="w-full h-8 rounded-xl text-xs gap-1.5 font-semibold"
                        >
                          <Receipt className="size-3.5 text-accent" /> Ver Detalhes / Recibo
                        </Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-muted-foreground italic text-xs">
                    Nenhum lançamento encontrado para os filtros selecionados.
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/20 border-b border-border/30 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Tipo</th>
                      <th className="py-3 px-4">Descrição & Categoria</th>
                      <th className="py-3 px-4">Conta</th>
                      <th className="py-3 px-4">Método</th>
                      <th className="py-3 px-4">Data</th>
                      <th className="py-3 px-4 text-right">Valor</th>
                      <th className="py-3 px-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 font-medium">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4">
                            {tx.type === "receita" ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                <ArrowUpRight className="size-3" /> Receita
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                                <ArrowDownLeft className="size-3" /> Despesa
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-foreground">{tx.description}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-normal">
                                {tx.category}
                              </Badge>
                              {tx.memberName && (
                                <span className="text-[10px] text-muted-foreground">Doador: {tx.memberName}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{tx.account}</td>
                          <td className="py-3 px-4">{tx.paymentMethod}</td>
                          <td className="py-3 px-4 text-muted-foreground">{tx.date}</td>
                          <td className="py-3 px-4 text-right font-extrabold text-sm">
                            <span
                              className={
                                tx.type === "receita"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-rose-600 dark:text-rose-400"
                              }
                            >
                              {tx.type === "receita" ? "+" : "-"} R${" "}
                              {tx.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedTxDetail(tx)}
                              className="size-7 rounded-lg hover:bg-accent-soft/40 text-muted-foreground hover:text-accent"
                              title="Ver detalhes/recibo"
                            >
                              <Receipt className="size-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-muted-foreground italic">
                          Nenhum lançamento encontrado para os filtros selecionados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Conteúdo Aba 3: ENVELOPE DE CULTOS */}
      {activeTab === "cultos" && (
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm">
          <CardHeader className="p-4 border-b border-border/30 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Fechamentos de Cultos</CardTitle>
              <CardDescription className="text-xs">
                Controle de contagem de dízimos e ofertas coletados em envelopes por culto
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsCultoModalOpen(true)}
              size="sm"
              className="gap-2 rounded-xl h-8 px-3 text-xs bg-accent hover:bg-accent/90 text-white font-semibold"
            >
              <Plus className="size-3.5" /> Registrar Culto
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/20 border-b border-border/30 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Data & Culto</th>
                    <th className="py-3 px-4">Dízimos</th>
                    <th className="py-3 px-4">Ofertas Gerais</th>
                    <th className="py-3 px-4">Ofertas Missões</th>
                    <th className="py-3 px-4">Total Geral</th>
                    <th className="py-3 px-4">Responsável</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 font-medium">
                  {cultos.map((culto) => (
                    <tr key={culto.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-foreground">{culto.serviceName}</p>
                        <span className="text-[10px] text-muted-foreground">{culto.date}</span>
                      </td>
                      <td className="py-3.5 px-4 text-foreground font-semibold">
                        R$ {culto.dizimosAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-foreground font-semibold">
                        R$ {culto.ofertasAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-purple-600 dark:text-purple-400 font-semibold">
                        R$ {culto.ofertaMissoesAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                        R$ {culto.totalAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{culto.responsible}</td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-0 text-[10px]">
                          Fechado & Depositado
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conteúdo Aba 4: CONTAS A PAGAR */}
      {activeTab === "contas" && (
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm">
          <CardHeader className="p-4 border-b border-border/30">
            <CardTitle className="text-base font-bold text-foreground">Contas a Pagar & Pendências</CardTitle>
            <CardDescription className="text-xs">
              Compromissos agendados e boletos pendentes de quitação
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {transactions
              .filter((t) => t.status === "pendente")
              .map((tx) => (
                <div
                  key={tx.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-foreground text-sm">{tx.description}</p>
                      <p className="text-muted-foreground mt-0.5">
                        Categoria: <span className="font-semibold text-foreground">{tx.category}</span> · Vencimento:{" "}
                        <span className="font-bold text-amber-600 dark:text-amber-400">{tx.date}</span>
                      </p>
                      {tx.notes && <p className="text-[11px] italic text-muted-foreground mt-1">{tx.notes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-amber-500/20">
                    <span className="text-base font-extrabold text-rose-600 dark:text-rose-400">
                      R$ {tx.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => {
                        setTransactions(
                          transactions.map((t) => (t.id === tx.id ? { ...t, status: "confirmado" } : t))
                        )
                        toast.success("Pagamento da conta confirmado com sucesso!")
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold px-3 h-8"
                    >
                      Dar Baixa (Pagar)
                    </Button>
                  </div>
                </div>
              ))}

            {transactions.filter((t) => t.status === "pendente").length === 0 && (
              <div className="py-8 text-center text-muted-foreground text-xs italic">
                Nenhuma conta ou boleto pendente para pagamento neste período.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* MODAL 1: NOVO LANÇAMENTO (RECEITA OU DESPESA) */}
      <Dialog open={isTxModalOpen} onOpenChange={setIsTxModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl border-border/80 bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">Novo Lançamento Financeiro</DialogTitle>
            <DialogDescription className="text-xs">
              Registre uma nova entrada (dízimo/oferta) ou saída de caixa da igreja.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddTransaction} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={txType === "receita" ? "default" : "outline"}
                onClick={() => {
                  setTxType("receita")
                  setTxCategory("Dízimos")
                }}
                className={cn(
                  "rounded-xl font-bold text-xs h-10",
                  txType === "receita" && "bg-emerald-600 hover:bg-emerald-700 text-white"
                )}
              >
                <ArrowUpRight className="size-4 mr-1" /> Entradas (Receita)
              </Button>
              <Button
                type="button"
                variant={txType === "despesa" ? "default" : "outline"}
                onClick={() => {
                  setTxType("despesa")
                  setTxCategory("Manutenção & Reformas")
                }}
                className={cn(
                  "rounded-xl font-bold text-xs h-10",
                  txType === "despesa" && "bg-rose-600 hover:bg-rose-700 text-white"
                )}
              >
                <ArrowDownLeft className="size-4 mr-1" /> Saídas (Despesa)
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Descrição do Lançamento</Label>
              <Input
                placeholder="Ex: Dízimo Irmão João / Parcela Som"
                value={txDescription}
                onChange={(e) => setTxDescription(e.target.value)}
                className="h-10 rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Valor (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="h-10 rounded-xl font-bold"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Data do Lançamento</Label>
                <Input
                  type="date"
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Categoria</Label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value as FinancialCategory)}
                  className="w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium focus:ring-accent"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Conta Destino / Origem</Label>
                <select
                  value={txAccount}
                  onChange={(e) => setTxAccount(e.target.value as FinancialAccount)}
                  className="w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium focus:ring-accent"
                >
                  {accountOptions.map((acc) => (
                    <option key={acc} value={acc}>
                      {acc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {txType === "receita" && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Nome do Doador / Dizimista (Opcional)</Label>
                <Input
                  placeholder="Ex: Pr. Mateus Silva"
                  value={txMemberName}
                  onChange={(e) => setTxMemberName(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            )}

            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTxModalOpen(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold">
                Confirmar e Lançar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: FECHAMENTO DE CULTO */}
      <Dialog open={isCultoModalOpen} onOpenChange={setIsCultoModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl border-border/80 bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">Fechamento de Envelope de Culto</DialogTitle>
            <DialogDescription className="text-xs">
              Registre a contagem de ofertas e dízimos arrecadados em uma celebração.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddCulto} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Identificação do Culto</Label>
              <Input
                value={cultoServiceName}
                onChange={(e) => setCultoServiceName(e.target.value)}
                className="h-10 rounded-xl text-xs"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Data da Realização</Label>
              <Input
                type="date"
                value={cultoDate}
                onChange={(e) => setCultoDate(e.target.value)}
                className="h-10 rounded-xl text-xs"
                required
              />
            </div>

            <div className="space-y-3 p-3 rounded-xl border border-border/40 bg-muted/20">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Detalhamento dos Valores Arrecadados</p>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-[11px] font-medium">Dízimos (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={cultoDizimos}
                    onChange={(e) => setCultoDizimos(e.target.value)}
                    className="h-9 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-medium">Oferta Geral</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={cultoOfertas}
                    onChange={(e) => setCultoOfertas(e.target.value)}
                    className="h-9 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-medium">Missões</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={cultoMissoes}
                    onChange={(e) => setCultoMissoes(e.target.value)}
                    className="h-9 rounded-lg text-xs font-bold text-purple-600 dark:text-purple-400"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCultoModalOpen(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold">
                Gravar Fechamento
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: RECIBO / DETALHES DE LANÇAMENTO */}
      <Dialog open={!!selectedTxDetail} onOpenChange={() => setSelectedTxDetail(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl border-border/80 bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Receipt className="size-4 text-accent" />
              Comprovante de Lançamento
            </DialogTitle>
          </DialogHeader>

          {selectedTxDetail && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="p-4 rounded-xl border border-border/40 bg-muted/20 space-y-2">
                <div className="flex items-center justify-between border-b border-border/30 pb-2">
                  <span className="text-muted-foreground">ID do Registro</span>
                  <span className="font-mono font-bold">{selectedTxDetail.id}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/30 pb-2">
                  <span className="text-muted-foreground">Tipo</span>
                  <span className="font-bold capitalize">{selectedTxDetail.type}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/30 pb-2">
                  <span className="text-muted-foreground">Categoria</span>
                  <span className="font-semibold">{selectedTxDetail.category}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/30 pb-2">
                  <span className="text-muted-foreground">Conta / Origem</span>
                  <span>{selectedTxDetail.account}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/30 pb-2">
                  <span className="text-muted-foreground">Data do Lançamento</span>
                  <span>{selectedTxDetail.date}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-foreground">Valor Total</span>
                  <span className="text-base font-extrabold text-accent">
                    R$ {selectedTxDetail.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-muted-foreground">Descrição / Histórico:</p>
                <p className="p-2.5 rounded-lg bg-background border border-border/30 font-medium text-foreground">
                  {selectedTxDetail.description}
                </p>
              </div>

              <DialogFooter className="pt-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast.success("Recibo enviado para impressão.")
                  }}
                  className="rounded-xl gap-1.5 text-xs font-semibold"
                >
                  <Printer className="size-3.5" /> Imprimir Recibo
                </Button>
                <Button
                  size="sm"
                  onClick={() => setSelectedTxDetail(null)}
                  className="rounded-xl text-xs font-semibold"
                >
                  Fechar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
