"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import {
  Search,
  Filter,
  FileText,
  MoreVertical,
  Eye,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";

export default function InvoicesPage() {
  const { invoices, updateInvoice } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInvoices = useMemo(() => {
    let filtered = [...invoices];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(searchLower) ||
          inv.customerName.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((inv) => inv.status === statusFilter);
    }

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filtered;
  }, [invoices, search, statusFilter]);

  const stats = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const paid = invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.total, 0);
    const pending = invoices.filter((inv) => inv.status === "sent").reduce((sum, inv) => sum + inv.total, 0);
    const overdue = invoices.filter((inv) => inv.status === "overdue").reduce((sum, inv) => sum + inv.total, 0);
    return { total, paid, pending, overdue };
  }, [invoices]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "draft":
        return { color: "bg-slate-100 text-slate-700", icon: FileText };
      case "sent":
        return { color: "bg-blue-100 text-blue-700", icon: Send };
      case "paid":
        return { color: "bg-green-100 text-green-700", icon: CheckCircle };
      case "overdue":
        return { color: "bg-red-100 text-red-700", icon: AlertCircle };
      default:
        return { color: "bg-slate-100 text-slate-700", icon: FileText };
    }
  };

  const isOverdue = (invoice: typeof invoices[0]) => {
    if (invoice.status === "paid") return false;
    return new Date(invoice.dueDate) < new Date();
  };

  return (
    <>
      <Header
        title="Invoices"
        subtitle={`${invoices.length} invoices`}
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <DollarSign className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Invoiced</p>
                  <p className="text-xl font-bold text-slate-900">{formatCurrency(stats.total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Paid</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(stats.paid)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Pending</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(stats.pending)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={stats.overdue > 0 ? "ring-2 ring-red-200" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Overdue</p>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(stats.overdue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search invoices..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Paid Date</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12">
                        <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No invoices found</p>
                        <p className="text-sm text-slate-400 mt-1">
                          Accept quotes to generate invoices
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((invoice) => {
                      const statusConfig = getStatusConfig(invoice.status);
                      const StatusIcon = statusConfig.icon;
                      const overdue = isOverdue(invoice);

                      return (
                        <tr key={invoice.id} className="group">
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-brand-green/10">
                                <FileText className="h-5 w-5 text-slate-500 group-hover:text-brand-green" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{invoice.invoiceNumber}</p>
                                <p className="text-xs text-slate-500">{formatDate(invoice.createdAt)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="font-medium">{invoice.customerName}</td>
                          <td className="font-semibold">{formatCurrency(invoice.total)}</td>
                          <td>
                            <Badge className={cn(statusConfig.color, "gap-1")}>
                              <StatusIcon className="h-3 w-3" />
                              {invoice.status}
                            </Badge>
                          </td>
                          <td className={cn(overdue && invoice.status !== "paid" && "text-red-600 font-medium")}>
                            {formatDate(invoice.dueDate)}
                            {overdue && invoice.status !== "paid" && (
                              <span className="text-xs block text-red-500">Overdue</span>
                            )}
                          </td>
                          <td className="text-slate-600">
                            {invoice.paidDate ? formatDate(invoice.paidDate) : "—"}
                          </td>
                          <td>
                            <div className="relative group/menu">
                              <button className="p-2 rounded-lg hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="h-4 w-4 text-slate-500" />
                              </button>
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                                <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full">
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </button>
                                {invoice.status === "draft" && (
                                  <button
                                    onClick={() => updateInvoice(invoice.id, { status: "sent" })}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 w-full"
                                  >
                                    <Send className="h-4 w-4" />
                                    Send Invoice
                                  </button>
                                )}
                                {(invoice.status === "sent" || invoice.status === "overdue") && (
                                  <button
                                    onClick={() => updateInvoice(invoice.id, { status: "paid", paidDate: new Date().toISOString() })}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Mark as Paid
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
