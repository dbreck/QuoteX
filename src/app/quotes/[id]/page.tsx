"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store";
import { formatCurrency, formatDate, getStatusColor, cn } from "@/lib/utils";
import {
  ArrowLeft,
  Edit,
  Send,
  Download,
  CheckCircle,
  XCircle,
  Copy,
  Trash2,
  FileText,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { quotes, customers, updateQuote, deleteQuote, convertQuoteToInvoice, settings } = useStore();
  const printRef = useRef<HTMLDivElement>(null);

  const quote = useMemo(() => {
    return quotes.find((q) => q.id === params.id);
  }, [quotes, params.id]);

  const customer = useMemo(() => {
    if (!quote) return null;
    return customers.find((c) => c.id === quote.customerId);
  }, [quote, customers]);

  const primaryContact = useMemo(() => {
    if (!customer) return null;
    return customer.contacts.find((c) => c.isPrimary) || customer.contacts[0];
  }, [customer]);

  if (!quote) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Quote not found</h2>
          <p className="text-slate-500 mb-4">The quote you're looking for doesn't exist.</p>
          <Link href="/quotes">
            <Button>Back to Quotes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    updateQuote(quote.id, { status: "sent", sentAt: new Date().toISOString() });
  };

  const handleAccept = () => {
    updateQuote(quote.id, { status: "accepted" });
    convertQuoteToInvoice(quote.id);
  };

  const handleReject = () => {
    updateQuote(quote.id, { status: "rejected" });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this quote?")) {
      deleteQuote(quote.id);
      router.push("/quotes");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Header
        title={
          <div className="flex items-center gap-3">
            <Link href="/quotes" className="p-2 -ml-2 rounded-lg hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5 text-slate-500" />
            </Link>
            <span>{quote.quoteNumber}</span>
            <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
          </div>
        }
        subtitle={`Created ${formatDate(quote.createdAt)}`}
        actions={
          <div className="flex items-center gap-2">
            {quote.status === "draft" && (
              <>
                <Link href={`/quotes/${quote.id}/edit`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Button size="sm" className="gap-2" onClick={handleSend}>
                  <Send className="h-4 w-4" />
                  Send Quote
                </Button>
              </>
            )}
            {(quote.status === "sent" || quote.status === "viewed") && (
              <>
                <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleReject}>
                  <XCircle className="h-4 w-4" />
                  Mark Rejected
                </Button>
                <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700" onClick={handleAccept}>
                  <CheckCircle className="h-4 w-4" />
                  Mark Accepted
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
              <Download className="h-4 w-4" />
              PDF
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quote Document */}
            <Card className="overflow-hidden">
              <div ref={printRef} className="bg-white print:shadow-none">
                {/* Header */}
                <div className="bg-brand-green p-6 text-white print:bg-brand-green">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold">QUOTE</h1>
                      <p className="text-green-100 mt-1">{quote.quoteNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{settings.company.name}</p>
                      {settings.company.address && (
                        <p className="text-green-100 text-sm mt-1">{settings.company.address}</p>
                      )}
                      {settings.company.phone && (
                        <p className="text-green-100 text-sm">{settings.company.phone}</p>
                      )}
                      {settings.company.email && (
                        <p className="text-green-100 text-sm">{settings.company.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quote Info */}
                <div className="p-6 border-b">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Bill To</h3>
                      <p className="font-semibold text-slate-900">{quote.customerName}</p>
                      {customer && (
                        <>
                          {primaryContact && <p className="text-slate-600">{primaryContact.name}</p>}
                          {customer.address?.street && <p className="text-slate-600">{customer.address.street}</p>}
                          {customer.address?.city && customer.address?.state && (
                            <p className="text-slate-600">
                              {customer.address.city}, {customer.address.state} {customer.address.zip}
                            </p>
                          )}
                          {primaryContact?.email && <p className="text-slate-600">{primaryContact.email}</p>}
                        </>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="inline-block text-left">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <span className="text-slate-500">Quote Date:</span>
                          <span className="font-medium">{formatDate(quote.createdAt)}</span>
                          <span className="text-slate-500">Valid Until:</span>
                          <span className="font-medium">{formatDate(quote.validUntil)}</span>
                          {quote.projectName && (
                            <>
                              <span className="text-slate-500">Project:</span>
                              <span className="font-medium">{quote.projectName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                <div className="p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 text-sm font-semibold text-slate-900">Item</th>
                        <th className="text-center py-3 text-sm font-semibold text-slate-900 w-20">Qty</th>
                        <th className="text-right py-3 text-sm font-semibold text-slate-900 w-28">Unit Price</th>
                        <th className="text-right py-3 text-sm font-semibold text-slate-900 w-28">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quote.lineItems.map((item, index) => (
                        <tr key={index} className="border-b border-slate-100">
                          <td className="py-4">
                            <p className="font-medium text-slate-900">
                              {item.configuration.baseSeries.charAt(0).toUpperCase() + item.configuration.baseSeries.slice(1)} Table
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                              {item.configuration.topWidth}" x {item.configuration.topDepth}" {item.configuration.topShape} top, {item.configuration.finish} finish
                            </p>
                          </td>
                          <td className="py-4 text-center">{item.quantity}</td>
                          <td className="py-4 text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="py-4 text-right font-medium">{formatCurrency(item.totalPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="flex justify-end mt-6">
                    <div className="w-72">
                      <div className="flex justify-between py-2 text-sm">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-medium">{formatCurrency(quote.subtotal)}</span>
                      </div>
                      {quote.discountAmount > 0 && (
                        <div className="flex justify-between py-2 text-sm text-green-600">
                          <span>Discount ({quote.discountType === 'percentage' ? `${quote.discountValue}%` : 'Fixed'})</span>
                          <span>-{formatCurrency(quote.discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 text-sm">
                        <span className="text-slate-600">Tax ({quote.taxRate}%)</span>
                        <span className="font-medium">{formatCurrency(quote.taxAmount)}</span>
                      </div>
                      <div className="flex justify-between py-3 border-t-2 border-slate-900 mt-2">
                        <span className="text-lg font-bold text-slate-900">Total</span>
                        <span className="text-lg font-bold text-slate-900">{formatCurrency(quote.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {quote.notes && (
                  <div className="px-6 pb-6">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Notes</h4>
                      <p className="text-sm text-slate-600 whitespace-pre-wrap">{quote.notes}</p>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="bg-slate-50 px-6 py-4 text-center text-sm text-slate-500 print:bg-slate-50">
                  Thank you for your business!
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-slate-900 mb-4">Quote Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Status</span>
                    <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Created</span>
                    <span className="text-sm font-medium">{formatDate(quote.createdAt)}</span>
                  </div>
                  {quote.sentAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Sent</span>
                      <span className="text-sm font-medium">{formatDate(quote.sentAt)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Valid Until</span>
                    <span className={cn(
                      "text-sm font-medium",
                      new Date(quote.validUntil) < new Date() && "text-red-600"
                    )}>
                      {formatDate(quote.validUntil)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Card */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-slate-900 mb-4">Customer</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green font-bold text-lg">
                    {quote.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{quote.customerName}</p>
                    {primaryContact && <p className="text-sm text-slate-500">{primaryContact.name}</p>}
                  </div>
                </div>
                {customer && (
                  <div className="space-y-2 text-sm">
                    {primaryContact?.email && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="h-4 w-4 text-slate-400" />
                        {primaryContact.email}
                      </div>
                    )}
                    {primaryContact?.phone && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="h-4 w-4 text-slate-400" />
                        {primaryContact.phone}
                      </div>
                    )}
                    {customer.address?.city && customer.address?.state && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {customer.address.city}, {customer.address.state}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-slate-900 mb-4">Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Copy className="h-4 w-4" />
                    Duplicate Quote
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
