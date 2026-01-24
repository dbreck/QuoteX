"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Save,
  Trash2,
  User,
  Calendar,
  FileText,
} from "lucide-react";
import { QuoteLineItem } from "@/types";

export default function EditQuotePage() {
  const params = useParams();
  const router = useRouter();
  const { quotes, customers, updateQuote, settings } = useStore();

  const quote = useMemo(() => {
    return quotes.find((q) => q.id === params.id);
  }, [quotes, params.id]);

  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    projectName: "",
    notes: "",
    validUntil: "",
    lineItems: [] as QuoteLineItem[],
    discountValue: 0,
    discountType: "fixed" as "fixed" | "percentage",
  });

  useEffect(() => {
    if (quote) {
      setFormData({
        customerId: quote.customerId,
        customerName: quote.customerName,
        projectName: quote.projectName || "",
        notes: quote.notes || "",
        validUntil: quote.validUntil.split("T")[0],
        lineItems: [...quote.lineItems],
        discountValue: quote.discountValue,
        discountType: quote.discountType,
      });
    }
  }, [quote]);

  if (!quote) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Quote not found</h2>
          <Link href="/quotes">
            <Button>Back to Quotes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const calculateTotals = () => {
    const subtotal = formData.lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountAmount = formData.discountType === "percentage"
      ? subtotal * (formData.discountValue / 100)
      : formData.discountValue;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (settings.pricing.taxRate / 100);
    const total = taxableAmount + taxAmount;
    return { subtotal, discountAmount, taxAmount, total };
  };

  const totals = calculateTotals();

  const updateLineItem = (index: number, field: "quantity" | "unitPrice" | "notes", value: string | number) => {
    const newItems = [...formData.lineItems];
    if (field === "quantity") {
      const qty = typeof value === "number" ? value : parseInt(value) || 1;
      newItems[index] = {
        ...newItems[index],
        quantity: qty,
        totalPrice: qty * newItems[index].unitPrice,
      };
    } else if (field === "unitPrice") {
      const price = typeof value === "number" ? value : parseFloat(value) || 0;
      newItems[index] = {
        ...newItems[index],
        unitPrice: price,
        totalPrice: newItems[index].quantity * price,
      };
    } else if (field === "notes") {
      newItems[index] = {
        ...newItems[index],
        notes: value as string,
      };
    }
    setFormData({ ...formData, lineItems: newItems });
  };

  const removeLineItem = (index: number) => {
    setFormData({
      ...formData,
      lineItems: formData.lineItems.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    const customer = customers.find((c) => c.id === formData.customerId);
    updateQuote(quote.id, {
      customerId: formData.customerId,
      customerName: customer?.companyName || formData.customerName,
      projectName: formData.projectName || undefined,
      notes: formData.notes || undefined,
      validUntil: new Date(formData.validUntil).toISOString(),
      lineItems: formData.lineItems,
      subtotal: totals.subtotal,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      discountAmount: totals.discountAmount,
      taxAmount: totals.taxAmount,
      total: totals.total,
    });
    router.push(`/quotes/${quote.id}`);
  };

  const getConfigSummary = (item: QuoteLineItem) => {
    const config = item.configuration;
    return `${config.topWidth}" x ${config.topDepth}" ${config.topShape} top, ${config.finish} finish`;
  };

  return (
    <>
      <Header
        title={`Edit ${quote.quoteNumber}`}
        subtitle="Make changes to this quote"
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/quotes/${quote.id}`}>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </Link>
            <Button size="sm" className="gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        <div className="mb-4">
          <Link href={`/quotes/${quote.id}`} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Quote
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quote Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Quote Details</h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        Customer
                      </label>
                      <Select
                        value={formData.customerId}
                        onValueChange={(value) => {
                          const customer = customers.find((c) => c.id === value);
                          setFormData({
                            ...formData,
                            customerId: value,
                            customerName: customer?.companyName || "",
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.companyName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        Valid Until
                      </label>
                      <Input
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Project Name</label>
                    <Input
                      value={formData.projectName}
                      onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                      placeholder="Optional project name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Line Items</h3>
                  <Link href="/configurator">
                    <Button variant="outline" size="sm">
                      Configure New Product
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {formData.lineItems.map((item, index) => (
                    <div key={item.id} className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium text-slate-900">
                            {item.configuration.baseSeries.charAt(0).toUpperCase() + item.configuration.baseSeries.slice(1)} Table
                          </p>
                          <p className="text-sm text-slate-500 mt-1">{getConfigSummary(item)}</p>
                        </div>
                        <button
                          onClick={() => removeLineItem(index)}
                          className="p-2 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Quantity</label>
                          <Input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => updateLineItem(index, "quantity", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Unit Price</label>
                          <Input
                            type="number"
                            min={0}
                            step={0.01}
                            value={item.unitPrice}
                            onChange={(e) => updateLineItem(index, "unitPrice", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Total</label>
                          <div className="h-10 flex items-center font-semibold text-slate-900">
                            {formatCurrency(item.totalPrice)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="text-xs text-slate-500 mb-1 block">Notes</label>
                        <Input
                          value={item.notes || ""}
                          onChange={(e) => updateLineItem(index, "notes", e.target.value)}
                          placeholder="Optional item notes"
                        />
                      </div>
                    </div>
                  ))}
                  {formData.lineItems.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <p>No items in this quote.</p>
                      <Link href="/configurator">
                        <Button variant="link" className="mt-2">
                          Configure a product
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Notes</h3>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any notes or special instructions..."
                />
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Quote Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-600">Discount</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min={0}
                        value={formData.discountValue}
                        onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                        className="flex-1"
                      />
                      <Select
                        value={formData.discountType}
                        onValueChange={(value: "fixed" | "percentage") =>
                          setFormData({ ...formData, discountType: value })
                        }
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">$</SelectItem>
                          <SelectItem value="percentage">%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(totals.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Tax ({settings.pricing.taxRate}%)</span>
                    <span className="font-medium">{formatCurrency(totals.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-lg font-bold text-slate-900">{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
