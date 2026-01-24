"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useStore } from "@/store";
import { formatCurrency, generateId, cn } from "@/lib/utils";
import { baseSeries, finishColors, topMaterials } from "@/data/products";
import type { QuoteLineItem, TableConfiguration } from "@/types";
import {
  Plus,
  Trash2,
  Layers,
  Save,
  Send,
  User,
  Building,
  ChevronRight,
  Minus,
  Edit2,
  FileText,
} from "lucide-react";

export default function NewQuotePage() {
  const router = useRouter();
  const { customers, addQuote, settings } = useStore();

  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [notes, setNotes] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  // Check for pending configuration from configurator
  useEffect(() => {
    const pendingConfig = sessionStorage.getItem("pendingConfiguration");
    if (pendingConfig) {
      try {
        const config = JSON.parse(pendingConfig) as TableConfiguration;
        const newItem: QuoteLineItem = {
          id: generateId(),
          configuration: config,
          quantity: 1,
          unitPrice: config.calculatedPrice,
          totalPrice: config.calculatedPrice,
        };
        setLineItems((prev) => [...prev, newItem]);
        sessionStorage.removeItem("pendingConfiguration");
      } catch (e) {
        console.error("Failed to parse pending configuration");
      }
    }
  }, []);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId),
    [customers, selectedCustomerId]
  );

  const calculations = useMemo(() => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountAmount =
      discountType === "percentage"
        ? subtotal * (discountValue / 100)
        : discountValue;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (settings.pricing.taxRate / 100);
    const total = afterDiscount + taxAmount;

    return { subtotal, discountAmount, taxAmount, total };
  }, [lineItems, discountType, discountValue, settings.pricing.taxRate]);

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setLineItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleSave = (status: "draft" | "sent") => {
    if (!selectedCustomerId) {
      alert("Please select a customer");
      return;
    }

    if (lineItems.length === 0) {
      alert("Please add at least one item");
      return;
    }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + settings.pricing.quoteValidityDays);

    const quote = addQuote({
      customerId: selectedCustomerId,
      customerName: selectedCustomer?.companyName || "",
      projectName,
      lineItems,
      subtotal: calculations.subtotal,
      discountType,
      discountValue,
      discountAmount: calculations.discountAmount,
      taxRate: settings.pricing.taxRate,
      taxAmount: calculations.taxAmount,
      total: calculations.total,
      status,
      notes,
      validUntil: validUntil.toISOString(),
      sentAt: status === "sent" ? new Date().toISOString() : undefined,
    });

    router.push(`/quotes/${quote.id}`);
  };

  const getConfigSummary = (config: TableConfiguration) => {
    const base = baseSeries.find((b) => b.id === config.baseSeries);
    const finish = finishColors.find((f) => f.id === config.finish);
    const material = topMaterials.find((m) => m.id === config.topMaterial);

    return {
      base: base?.name || config.baseSeries,
      finish: config.isChrome ? "Chrome" : finish?.name || config.finish,
      finishHex: config.isChrome ? "#c0c0c0" : finish?.hex || "#1a1a1a",
      material: material?.name || config.topMaterial,
      size: `${config.topWidth}" × ${config.topDepth}"`,
    };
  };

  return (
    <>
      <Header
        title="New Quote"
        subtitle="Create a new quote for a customer"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={() => handleSave("draft")} className="gap-2">
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={() => handleSave("sent")} className="gap-2">
              <Send className="h-4 w-4" />
              Save & Send
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCustomer ? (
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy text-white font-bold">
                        {selectedCustomer.companyName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{selectedCustomer.companyName}</p>
                        <p className="text-sm text-slate-500">
                          {selectedCustomer.contacts.find((c) => c.isPrimary)?.email}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setShowCustomerModal(true)}>
                      Change
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCustomerModal(true)}
                    className="w-full flex items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-brand-green hover:text-brand-green transition-colors"
                  >
                    <User className="h-5 w-5" />
                    Select Customer
                  </button>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Name (Optional)
                  </label>
                  <Input
                    placeholder="e.g., Conference Room Refresh"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Line Items
                  </CardTitle>
                  <Link href="/configurator">
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Product
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {lineItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Layers className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 mb-4">No items added yet</p>
                    <Link href="/configurator">
                      <Button variant="outline" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Configure a Table
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lineItems.map((item, index) => {
                      const summary = getConfigSummary(item.configuration);
                      return (
                        <div
                          key={item.id}
                          className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-navy text-white font-bold text-sm">
                            {index + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {summary.base} Table
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <div className="flex items-center gap-1.5">
                                    <div
                                      className="w-3 h-3 rounded-full border"
                                      style={{ backgroundColor: summary.finishHex }}
                                    />
                                    <span className="text-xs text-slate-600">{summary.finish}</span>
                                  </div>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-xs text-slate-600">{summary.size}</span>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-xs text-slate-600">{summary.material}</span>
                                </div>
                                {item.configuration.accessories &&
                                  item.configuration.accessories.length > 0 && (
                                    <p className="text-xs text-slate-500 mt-1">
                                      +{item.configuration.accessories.length} accessories
                                    </p>
                                  )}
                              </div>

                              <div className="text-right">
                                <p className="font-semibold text-slate-900">
                                  {formatCurrency(item.totalPrice)}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {formatCurrency(item.unitPrice)} each
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    updateItemQuantity(item.id, Math.max(1, item.quantity - 1))
                                  }
                                  className="p-1 rounded hover:bg-slate-200"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateItemQuantity(item.id, parseInt(e.target.value) || 1)
                                  }
                                  className="w-16 h-8 text-center"
                                  min={1}
                                />
                                <button
                                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                  className="p-1 rounded hover:bg-slate-200"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon-sm">
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  placeholder="Add any notes or special instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-24 px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green"
                />
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Quote Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium">{formatCurrency(calculations.subtotal)}</span>
                  </div>

                  {/* Discount */}
                  <div className="flex items-center gap-2">
                    <Select
                      value={discountType}
                      onValueChange={(v) => setDiscountType(v as "percentage" | "fixed")}
                    >
                      <SelectTrigger className="w-24 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">%</SelectItem>
                        <SelectItem value="fixed">$</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                      className="h-8 flex-1"
                      placeholder="Discount"
                      min={0}
                    />
                  </div>

                  {calculations.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(calculations.discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">
                      Tax ({settings.pricing.taxRate}%)
                    </span>
                    <span className="font-medium">{formatCurrency(calculations.taxAmount)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-brand-green">
                      {formatCurrency(calculations.total)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <Button
                    className="w-full gap-2"
                    onClick={() => handleSave("sent")}
                    disabled={!selectedCustomerId || lineItems.length === 0}
                  >
                    <Send className="h-4 w-4" />
                    Save & Send Quote
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => handleSave("draft")}
                    disabled={!selectedCustomerId || lineItems.length === 0}
                  >
                    <Save className="h-4 w-4" />
                    Save as Draft
                  </Button>
                </div>

                <p className="text-xs text-slate-500 text-center">
                  Quote valid for {settings.pricing.quoteValidityDays} days
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Customer Selection Modal */}
      <Dialog open={showCustomerModal} onOpenChange={setShowCustomerModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {customers.map((customer) => (
              <button
                key={customer.id}
                onClick={() => {
                  setSelectedCustomerId(customer.id);
                  setShowCustomerModal(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                  selectedCustomerId === customer.id
                    ? "bg-brand-green/10 border-2 border-brand-green"
                    : "bg-slate-50 hover:bg-slate-100"
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-navy text-white font-bold">
                  {customer.companyName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{customer.companyName}</p>
                  <p className="text-sm text-slate-500">
                    {customer.contacts.find((c) => c.isPrimary)?.email}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Link href="/customers/new">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                New Customer
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
