"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Building2,
  Mail,
  Phone,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
  FileText,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { Customer, Contact } from "@/types";

export default function CustomersPage() {
  const { customers, quotes, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");

  const filteredCustomers = useMemo(() => {
    if (!search) return customers;
    const searchLower = search.toLowerCase();
    return customers.filter((c) => {
      const primaryContact = c.contacts.find((contact) => contact.isPrimary) || c.contacts[0];
      return (
        c.companyName.toLowerCase().includes(searchLower) ||
        primaryContact?.name.toLowerCase().includes(searchLower) ||
        primaryContact?.email.toLowerCase().includes(searchLower)
      );
    });
  }, [customers, search]);

  const getCustomerStats = (customerId: string) => {
    const customerQuotes = quotes.filter((q) => q.customerId === customerId);
    const totalValue = customerQuotes.reduce((sum, q) => sum + q.total, 0);
    const acceptedQuotes = customerQuotes.filter((q) => q.status === "accepted").length;
    return { quoteCount: customerQuotes.length, totalValue, acceptedQuotes };
  };

  const getPrimaryContact = (customer: Customer): Contact | undefined => {
    return customer.contacts.find((c) => c.isPrimary) || customer.contacts[0];
  };

  const resetForm = () => {
    setFormData({
      companyName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      notes: "",
      tags: [],
    });
    setNewTag("");
    setEditingCustomer(null);
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = () => {
    if (!formData.companyName || !formData.contactName || !formData.contactEmail) return;

    const customerData = {
      companyName: formData.companyName,
      contacts: [
        {
          id: editingCustomer?.contacts[0]?.id || crypto.randomUUID(),
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone || undefined,
          isPrimary: true,
        },
      ],
      address: formData.street
        ? {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: "USA",
          }
        : undefined,
      tags: formData.tags,
      notes: formData.notes || undefined,
    };

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, customerData);
    } else {
      addCustomer(customerData);
    }
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (customer: Customer) => {
    const primaryContact = getPrimaryContact(customer);
    setEditingCustomer(customer);
    setFormData({
      companyName: customer.companyName,
      contactName: primaryContact?.name || "",
      contactEmail: primaryContact?.email || "",
      contactPhone: primaryContact?.phone || "",
      street: customer.address?.street || "",
      city: customer.address?.city || "",
      state: customer.address?.state || "",
      zip: customer.address?.zip || "",
      notes: customer.notes || "",
      tags: customer.tags || [],
    });
    setIsAddDialogOpen(true);
  };

  return (
    <>
      <Header
        title="Customers"
        subtitle={`${customers.length} customers`}
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
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCustomer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Company *</label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Contact Name *</label>
                    <Input
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="Primary contact"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email *</label>
                    <Input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="email@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Phone</label>
                    <Input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="(555) 555-5555"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Address</label>
                  <Input
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="Street address"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">City</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">State</label>
                    <Input
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">ZIP</label>
                    <Input
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      placeholder="ZIP code"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Tags</label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer hover:bg-red-100 hover:text-red-700"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingCustomer ? "Save Changes" : "Add Customer"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="p-6 space-y-6">
        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No customers found</p>
                <Button variant="link" className="mt-2" onClick={() => setIsAddDialogOpen(true)}>
                  Add your first customer
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredCustomers.map((customer) => {
              const stats = getCustomerStats(customer.id);
              const primaryContact = getPrimaryContact(customer);
              return (
                <Card key={customer.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green font-bold text-lg">
                          {customer.companyName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{customer.companyName}</h3>
                          <p className="text-sm text-slate-500">{primaryContact?.name}</p>
                        </div>
                      </div>
                      <div className="relative group/menu">
                        <button className="p-2 rounded-lg hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4 text-slate-500" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                          <button
                            onClick={() => handleEdit(customer)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => deleteCustomer(customer.id)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-slate-600 mb-4">
                      {primaryContact?.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          {primaryContact.email}
                        </div>
                      )}
                      {primaryContact?.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          {primaryContact.phone}
                        </div>
                      )}
                      {customer.address?.city && customer.address?.state && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {customer.address.city}, {customer.address.state}
                        </div>
                      )}
                    </div>

                    {customer.tags && customer.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {customer.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Quotes</p>
                          <p className="font-semibold text-slate-900">{stats.quoteCount}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Total Value</p>
                          <p className="font-semibold text-slate-900">{formatCurrency(stats.totalValue)}</p>
                        </div>
                      </div>
                      <Link href={`/quotes/new?customer=${customer.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <FileText className="h-3 w-3" />
                          Quote
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
