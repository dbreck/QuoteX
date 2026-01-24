"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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
import { formatCurrency, formatDate, getStatusColor, cn } from "@/lib/utils";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  Send,
  FileText,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";

export default function QuotesPage() {
  const { quotes, deleteQuote, updateQuote } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"date" | "total" | "customer">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const filteredQuotes = useMemo(() => {
    let filtered = [...quotes];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.quoteNumber.toLowerCase().includes(searchLower) ||
          q.customerName.toLowerCase().includes(searchLower) ||
          q.projectName?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((q) => q.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "date":
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case "total":
          comparison = a.total - b.total;
          break;
        case "customer":
          comparison = a.customerName.localeCompare(b.customerName);
          break;
      }
      return sortDirection === "desc" ? -comparison : comparison;
    });

    return filtered;
  }, [quotes, search, statusFilter, sortField, sortDirection]);

  const stats = useMemo(() => {
    return {
      total: quotes.length,
      draft: quotes.filter((q) => q.status === "draft").length,
      sent: quotes.filter((q) => q.status === "sent" || q.status === "viewed").length,
      accepted: quotes.filter((q) => q.status === "accepted").length,
      rejected: quotes.filter((q) => q.status === "rejected").length,
    };
  }, [quotes]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <>
      <Header
        title="Quotes"
        subtitle={`${stats.total} quotes total`}
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
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "All Quotes", value: stats.total, color: "slate" },
            { label: "Drafts", value: stats.draft, color: "slate" },
            { label: "Pending", value: stats.sent, color: "blue" },
            { label: "Accepted", value: stats.accepted, color: "green" },
            { label: "Rejected", value: stats.rejected, color: "red" },
          ].map((stat) => (
            <Card key={stat.label} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search quotes..."
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
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quotes Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>
                      <button
                        onClick={() => toggleSort("date")}
                        className="flex items-center gap-1 hover:text-slate-900"
                      >
                        Quote
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th>
                      <button
                        onClick={() => toggleSort("customer")}
                        className="flex items-center gap-1 hover:text-slate-900"
                      >
                        Customer
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th>Project</th>
                    <th>Items</th>
                    <th>
                      <button
                        onClick={() => toggleSort("total")}
                        className="flex items-center gap-1 hover:text-slate-900"
                      >
                        Total
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th>Status</th>
                    <th>Valid Until</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12">
                        <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No quotes found</p>
                        <Link href="/quotes/new">
                          <Button variant="link" className="mt-2">
                            Create your first quote
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    filteredQuotes.map((quote) => (
                      <tr key={quote.id} className="group">
                        <td>
                          <Link
                            href={`/quotes/${quote.id}`}
                            className="flex items-center gap-3 hover:text-brand-green"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-brand-green/10">
                              <FileText className="h-5 w-5 text-slate-500 group-hover:text-brand-green" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{quote.quoteNumber}</p>
                              <p className="text-xs text-slate-500">{formatDate(quote.updatedAt)}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="font-medium">{quote.customerName}</td>
                        <td className="text-slate-600">{quote.projectName || "—"}</td>
                        <td>{quote.lineItems.length}</td>
                        <td className="font-semibold">{formatCurrency(quote.total)}</td>
                        <td>
                          <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
                        </td>
                        <td className="text-slate-600">{formatDate(quote.validUntil)}</td>
                        <td>
                          <div className="relative group/menu">
                            <button className="p-2 rounded-lg hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="h-4 w-4 text-slate-500" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                              <Link
                                href={`/quotes/${quote.id}`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Link>
                              <Link
                                href={`/quotes/${quote.id}/edit`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Link>
                              <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full">
                                <Copy className="h-4 w-4" />
                                Duplicate
                              </button>
                              {quote.status === "draft" && (
                                <button
                                  onClick={() => updateQuote(quote.id, { status: "sent", sentAt: new Date().toISOString() })}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 w-full"
                                >
                                  <Send className="h-4 w-4" />
                                  Send Quote
                                </button>
                              )}
                              <button
                                onClick={() => deleteQuote(quote.id)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
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
