"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import {
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ChevronRight,
  Layers,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const revenueData = [
  { month: "Sep", revenue: 45000 },
  { month: "Oct", revenue: 52000 },
  { month: "Nov", revenue: 48000 },
  { month: "Dec", revenue: 61000 },
  { month: "Jan", revenue: 55000 },
  { month: "Feb", revenue: 72000 },
];

const quotesByStatus = [
  { name: "Accepted", value: 35, color: "#8dc63f" },
  { name: "Pending", value: 25, color: "#3b82f6" },
  { name: "Sent", value: 20, color: "#8b5cf6" },
  { name: "Draft", value: 15, color: "#94a3b8" },
  { name: "Rejected", value: 5, color: "#ef4444" },
];

const topProducts = [
  { name: "Foundation Series", count: 142, revenue: 125000 },
  { name: "Surge Electric", count: 87, revenue: 156000 },
  { name: "VertiGO Adjustable", count: 64, revenue: 98000 },
  { name: "Elite Series", count: 53, revenue: 72000 },
  { name: "Fundamental Series", count: 45, revenue: 48000 },
];

export default function DashboardPage() {
  const { quotes, customers, invoices } = useStore();

  const stats = useMemo(() => {
    const pendingQuotes = quotes.filter((q) => q.status === "sent" || q.status === "viewed");
    const acceptedQuotes = quotes.filter((q) => q.status === "accepted");
    const totalRevenue = acceptedQuotes.reduce((sum, q) => sum + q.total, 0);
    const pendingRevenue = pendingQuotes.reduce((sum, q) => sum + q.total, 0);
    const conversionRate = quotes.length > 0
      ? Math.round((acceptedQuotes.length / quotes.length) * 100)
      : 0;

    return {
      totalQuotes: quotes.length,
      pendingQuotes: pendingQuotes.length,
      acceptedQuotes: acceptedQuotes.length,
      totalRevenue,
      pendingRevenue,
      conversionRate,
      totalCustomers: customers.length,
    };
  }, [quotes, customers]);

  const recentQuotes = useMemo(() => {
    return [...quotes]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [quotes]);

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening."
        actions={
          <Link href="/quotes/new">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Quote
            </Button>
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card" hover>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-600 font-medium">12.5%</span>
                    <span className="text-slate-500">vs last month</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-100">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card" hover>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Pending Pipeline</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {formatCurrency(stats.pendingRevenue)}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <span className="text-slate-600 font-medium">{stats.pendingQuotes} quotes</span>
                    <span className="text-slate-500">awaiting response</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-blue-100">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card" hover>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Conversion Rate</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {stats.conversionRate}%
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-600 font-medium">3.2%</span>
                    <span className="text-slate-500">improvement</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-brand-green/10">
                  <TrendingUp className="h-6 w-6 text-brand-green" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card" hover>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Active Customers</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {stats.totalCustomers}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-600 font-medium">8</span>
                    <span className="text-slate-500">new this month</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Revenue Trend</CardTitle>
              <select className="text-sm border rounded-lg px-3 py-1.5 bg-white text-slate-600">
                <option>Last 6 months</option>
                <option>Last 12 months</option>
                <option>This year</option>
              </select>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8dc63f" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8dc63f" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white rounded-lg shadow-lg border p-3">
                              <p className="text-sm font-medium text-slate-900">
                                {formatCurrency(payload[0].value as number)}
                              </p>
                              <p className="text-xs text-slate-500">{payload[0].payload.month}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8dc63f"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quote Status Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Quote Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={quotesByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {quotesByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white rounded-lg shadow-lg border p-3">
                              <p className="text-sm font-medium text-slate-900">
                                {payload[0].payload.name}
                              </p>
                              <p className="text-xs text-slate-500">{payload[0].value}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {quotesByStatus.map((status) => (
                  <div key={status.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-xs text-slate-600">{status.name}</span>
                    <span className="text-xs font-medium text-slate-900 ml-auto">{status.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Quotes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Recent Quotes</CardTitle>
              <Link href="/quotes">
                <Button variant="ghost" size="sm" className="text-sm gap-1">
                  View all
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {recentQuotes.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/quotes/${quote.id}`}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                        <FileText className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{quote.quoteNumber}</p>
                        <p className="text-xs text-slate-500">{quote.customerName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900 text-sm">{formatCurrency(quote.total)}</p>
                      <Badge className={getStatusColor(quote.status)} variant="secondary">
                        {quote.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Top Products</CardTitle>
              <Link href="/configurator">
                <Button variant="ghost" size="sm" className="text-sm gap-1">
                  Configure
                  <Layers className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-navy text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.count} units sold</p>
                      </div>
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-brand-navy to-brand-navy-dark text-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">Ready to create a new quote?</h3>
                <p className="text-white/70 mt-1">
                  Use our visual configurator to build custom tables and generate quotes instantly.
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/configurator">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <Layers className="h-4 w-4 mr-2" />
                    Open Configurator
                  </Button>
                </Link>
                <Link href="/quotes/new">
                  <Button className="bg-brand-green hover:bg-brand-green/90">
                    <Plus className="h-4 w-4 mr-2" />
                    New Quote
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
          {/* Decorative pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <div className="pattern-bg w-full h-full" />
          </div>
        </Card>
      </div>
    </>
  );
}
