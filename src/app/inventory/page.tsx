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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useStore } from "@/store";
import { formatCurrency } from "@/lib/utils";
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  TrendingDown,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { InventoryItem } from "@/types";

export default function InventoryPage() {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "base" as InventoryItem["category"],
    quantity: 0,
    reorderPoint: 10,
    reorderQuantity: 50,
    unitCost: 0,
    supplier: "",
  });

  const categories: { value: InventoryItem["category"]; label: string }[] = [
    { value: "base", label: "Bases" },
    { value: "top", label: "Tops" },
    { value: "finish", label: "Finishes" },
    { value: "hardware", label: "Hardware" },
    { value: "accessory", label: "Accessories" },
  ];

  const filteredInventory = useMemo(() => {
    let filtered = [...inventory];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.sku.toLowerCase().includes(searchLower)
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    if (stockFilter === "low") {
      filtered = filtered.filter((item) => item.quantity <= item.reorderPoint);
    } else if (stockFilter === "out") {
      filtered = filtered.filter((item) => item.quantity === 0);
    }

    return filtered;
  }, [inventory, search, categoryFilter, stockFilter]);

  const stats = useMemo(() => {
    const totalValue = inventory.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
    const lowStock = inventory.filter((item) => item.quantity <= item.reorderPoint && item.quantity > 0).length;
    const outOfStock = inventory.filter((item) => item.quantity === 0).length;
    return { totalItems: inventory.length, totalValue, lowStock, outOfStock };
  }, [inventory]);

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      category: "base",
      quantity: 0,
      reorderPoint: 10,
      reorderQuantity: 50,
      unitCost: 0,
      supplier: "",
    });
    setEditingItem(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.sku) return;

    const itemData = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      quantity: formData.quantity,
      reorderPoint: formData.reorderPoint,
      reorderQuantity: formData.reorderQuantity,
      unitCost: formData.unitCost,
      supplier: formData.supplier || undefined,
    };

    if (editingItem) {
      updateInventoryItem(editingItem.id, itemData);
    } else {
      addInventoryItem(itemData);
    }
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      sku: item.sku,
      category: item.category,
      quantity: item.quantity,
      reorderPoint: item.reorderPoint,
      reorderQuantity: item.reorderQuantity,
      unitCost: item.unitCost,
      supplier: item.supplier || "",
    });
    setIsAddDialogOpen(true);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
    if (item.quantity <= item.reorderPoint) return { label: "Low Stock", color: "bg-amber-100 text-amber-700" };
    return { label: "In Stock", color: "bg-green-100 text-green-700" };
  };

  return (
    <>
      <Header
        title="Inventory"
        subtitle={`${stats.totalItems} items tracked`}
        actions={
          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Item" : "Add Inventory Item"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Item name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">SKU *</label>
                    <Input
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="SKU-001"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: InventoryItem["category"]) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Quantity</label>
                    <Input
                      type="number"
                      min={0}
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Reorder Point</label>
                    <Input
                      type="number"
                      min={0}
                      value={formData.reorderPoint}
                      onChange={(e) => setFormData({ ...formData, reorderPoint: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Unit Cost</label>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={formData.unitCost}
                      onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Supplier</label>
                  <Input
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="Supplier name"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingItem ? "Save Changes" : "Add Item"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <Package className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Items</p>
                  <p className="text-xl font-bold text-slate-900">{stats.totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <TrendingDown className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Value</p>
                  <p className="text-xl font-bold text-slate-900">{formatCurrency(stats.totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={stats.lowStock > 0 ? "ring-2 ring-amber-200" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Low Stock</p>
                  <p className="text-xl font-bold text-amber-600">{stats.lowStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={stats.outOfStock > 0 ? "ring-2 ring-red-200" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                  <Package className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Out of Stock</p>
                  <p className="text-xl font-bold text-red-600">{stats.outOfStock}</p>
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
                  placeholder="Search inventory..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Reorder Point</th>
                    <th>Unit Cost</th>
                    <th>Total Value</th>
                    <th>Status</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-12">
                        <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No inventory items found</p>
                        <Button
                          variant="link"
                          className="mt-2"
                          onClick={() => setIsAddDialogOpen(true)}
                        >
                          Add your first item
                        </Button>
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map((item) => {
                      const status = getStockStatus(item);
                      return (
                        <tr key={item.id} className="group">
                          <td className="font-medium">{item.name}</td>
                          <td className="text-slate-500 font-mono text-sm">{item.sku}</td>
                          <td className="capitalize">{item.category}</td>
                          <td className={item.quantity <= item.reorderPoint ? "font-bold text-amber-600" : ""}>
                            {item.quantity}
                          </td>
                          <td className="text-slate-500">{item.reorderPoint}</td>
                          <td>{formatCurrency(item.unitCost)}</td>
                          <td className="font-semibold">{formatCurrency(item.quantity * item.unitCost)}</td>
                          <td>
                            <Badge className={status.color}>{status.label}</Badge>
                          </td>
                          <td>
                            <div className="relative group/menu">
                              <button className="p-2 rounded-lg hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="h-4 w-4 text-slate-500" />
                              </button>
                              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteInventoryItem(item.id)}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
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
