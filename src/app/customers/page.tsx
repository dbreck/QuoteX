"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  Crown,
  Star,
  Award,
  Users,
  Globe,
  ChevronRight,
  Landmark,
  GraduationCap,
  Heart,
  Briefcase,
  School,
  Store,
} from "lucide-react";
import Link from "next/link";
import { Customer, Contact, Organization, PricingTier } from "@/types";

const tierIcons = {
  premier: Crown,
  preferred: Star,
  standard: Award,
};

const tierColors = {
  premier: "bg-amber-100 text-amber-700 border-amber-200",
  preferred: "bg-blue-100 text-blue-700 border-blue-200",
  standard: "bg-slate-100 text-slate-700 border-slate-200",
};

const orgTypeIcons = {
  university: GraduationCap,
  government: Landmark,
  corporate: Briefcase,
  healthcare: Heart,
  k12: School,
  dealer: Store,
  other: Building2,
};

export default function CustomersPage() {
  const {
    customers,
    organizations,
    quotes,
    settings,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addOrganization,
    updateOrganization,
    deleteOrganization,
    getOrganization,
  } = useStore();

  const [activeTab, setActiveTab] = useState("organizations");
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddOrgDialogOpen, setIsAddOrgDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    organizationId: "",
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

  const [orgFormData, setOrgFormData] = useState({
    name: "",
    type: "corporate" as Organization["type"],
    pricingTier: "standard" as PricingTier,
    accountNumber: "",
    website: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
  });

  const [newTag, setNewTag] = useState("");

  const filteredOrganizations = useMemo(() => {
    if (!search) return organizations;
    const searchLower = search.toLowerCase();
    return organizations.filter(
      (o) =>
        o.name.toLowerCase().includes(searchLower) ||
        o.type.toLowerCase().includes(searchLower)
    );
  }, [organizations, search]);

  const filteredCustomers = useMemo(() => {
    if (!search) return customers;
    const searchLower = search.toLowerCase();
    return customers.filter((c) => {
      const primaryContact = c.contacts.find((contact) => contact.isPrimary) || c.contacts[0];
      const org = c.organizationId ? getOrganization(c.organizationId) : null;
      return (
        c.companyName.toLowerCase().includes(searchLower) ||
        primaryContact?.name.toLowerCase().includes(searchLower) ||
        primaryContact?.email.toLowerCase().includes(searchLower) ||
        org?.name.toLowerCase().includes(searchLower)
      );
    });
  }, [customers, search, getOrganization]);

  const getOrgStats = (orgId: string) => {
    const orgCustomers = customers.filter((c) => c.organizationId === orgId);
    const orgQuotes = quotes.filter((q) =>
      orgCustomers.some((c) => c.id === q.customerId)
    );
    const totalValue = orgQuotes.reduce((sum, q) => sum + q.total, 0);
    return {
      customerCount: orgCustomers.length,
      quoteCount: orgQuotes.length,
      totalValue,
    };
  };

  const getCustomerStats = (customerId: string) => {
    const customerQuotes = quotes.filter((q) => q.customerId === customerId);
    const totalValue = customerQuotes.reduce((sum, q) => sum + q.total, 0);
    const acceptedQuotes = customerQuotes.filter((q) => q.status === "accepted").length;
    return { quoteCount: customerQuotes.length, totalValue, acceptedQuotes };
  };

  const getPrimaryContact = (customer: Customer): Contact | undefined => {
    return customer.contacts.find((c) => c.isPrimary) || customer.contacts[0];
  };

  const getCustomerTier = (customer: Customer): PricingTier | null => {
    if (!customer.organizationId) return null;
    const org = getOrganization(customer.organizationId);
    return org?.pricingTier || null;
  };

  const resetForm = () => {
    setFormData({
      companyName: "",
      organizationId: "",
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

  const resetOrgForm = () => {
    setOrgFormData({
      name: "",
      type: "corporate",
      pricingTier: "standard",
      accountNumber: "",
      website: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      notes: "",
    });
    setEditingOrg(null);
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

  const handleSubmitCustomer = () => {
    if (!formData.companyName || !formData.contactName || !formData.contactEmail) return;

    const customerData = {
      companyName: formData.companyName,
      organizationId: formData.organizationId || undefined,
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

  const handleSubmitOrg = () => {
    if (!orgFormData.name) return;

    const orgData = {
      name: orgFormData.name,
      type: orgFormData.type,
      pricingTier: orgFormData.pricingTier,
      accountNumber: orgFormData.accountNumber || undefined,
      website: orgFormData.website || undefined,
      address: orgFormData.street
        ? {
            street: orgFormData.street,
            city: orgFormData.city,
            state: orgFormData.state,
            zip: orgFormData.zip,
            country: "USA",
          }
        : undefined,
      notes: orgFormData.notes || undefined,
    };

    if (editingOrg) {
      updateOrganization(editingOrg.id, orgData);
    } else {
      addOrganization(orgData);
    }
    setIsAddOrgDialogOpen(false);
    resetOrgForm();
  };

  const handleEditCustomer = (customer: Customer) => {
    const primaryContact = getPrimaryContact(customer);
    setEditingCustomer(customer);
    setFormData({
      companyName: customer.companyName,
      organizationId: customer.organizationId || "",
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

  const handleEditOrg = (org: Organization) => {
    setEditingOrg(org);
    setOrgFormData({
      name: org.name,
      type: org.type,
      pricingTier: org.pricingTier,
      accountNumber: org.accountNumber || "",
      website: org.website || "",
      street: org.address?.street || "",
      city: org.address?.city || "",
      state: org.address?.state || "",
      zip: org.address?.zip || "",
      notes: org.notes || "",
    });
    setIsAddOrgDialogOpen(true);
  };

  return (
    <>
      <Header
        title="Customers & Organizations"
        subtitle={`${organizations.length} organizations · ${customers.length} customers`}
      />

      <div className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="organizations" className="gap-2">
                <Building2 className="h-4 w-4" />
                Organizations
              </TabsTrigger>
              <TabsTrigger value="customers" className="gap-2">
                <Users className="h-4 w-4" />
                Customers
              </TabsTrigger>
            </TabsList>

            {activeTab === "organizations" ? (
              <Dialog
                open={isAddOrgDialogOpen}
                onOpenChange={(open) => {
                  setIsAddOrgDialogOpen(open);
                  if (!open) resetOrgForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Organization
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingOrg ? "Edit Organization" : "Add New Organization"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Organization Name *
                        </label>
                        <Input
                          value={orgFormData.name}
                          onChange={(e) =>
                            setOrgFormData({ ...orgFormData, name: e.target.value })
                          }
                          placeholder="e.g., University of Notre Dame"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Account Number
                        </label>
                        <Input
                          value={orgFormData.accountNumber}
                          onChange={(e) =>
                            setOrgFormData({ ...orgFormData, accountNumber: e.target.value })
                          }
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Organization Type
                        </label>
                        <select
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                          value={orgFormData.type}
                          onChange={(e) =>
                            setOrgFormData({
                              ...orgFormData,
                              type: e.target.value as Organization["type"],
                            })
                          }
                        >
                          <option value="university">University / Higher Ed</option>
                          <option value="government">Government</option>
                          <option value="corporate">Corporate</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="k12">K-12 Education</option>
                          <option value="dealer">Dealer / Reseller</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Pricing Tier
                        </label>
                        <select
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                          value={orgFormData.pricingTier}
                          onChange={(e) =>
                            setOrgFormData({
                              ...orgFormData,
                              pricingTier: e.target.value as PricingTier,
                            })
                          }
                        >
                          {settings.pricing.pricingTiers.map((tier) => (
                            <option key={tier.id} value={tier.id}>
                              {tier.name} ({tier.discountPercent}% off list)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Website</label>
                      <Input
                        value={orgFormData.website}
                        onChange={(e) =>
                          setOrgFormData({ ...orgFormData, website: e.target.value })
                        }
                        placeholder="https://..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Address</label>
                      <Input
                        value={orgFormData.street}
                        onChange={(e) =>
                          setOrgFormData({ ...orgFormData, street: e.target.value })
                        }
                        placeholder="Street address"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        value={orgFormData.city}
                        onChange={(e) =>
                          setOrgFormData({ ...orgFormData, city: e.target.value })
                        }
                        placeholder="City"
                      />
                      <Input
                        value={orgFormData.state}
                        onChange={(e) =>
                          setOrgFormData({ ...orgFormData, state: e.target.value })
                        }
                        placeholder="State"
                      />
                      <Input
                        value={orgFormData.zip}
                        onChange={(e) =>
                          setOrgFormData({ ...orgFormData, zip: e.target.value })
                        }
                        placeholder="ZIP"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Notes</label>
                      <textarea
                        className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                        rows={3}
                        value={orgFormData.notes}
                        onChange={(e) =>
                          setOrgFormData({ ...orgFormData, notes: e.target.value })
                        }
                        placeholder="Internal notes..."
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button variant="outline" onClick={() => setIsAddOrgDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSubmitOrg}>
                        {editingOrg ? "Save Changes" : "Add Organization"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
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
                    <DialogTitle>
                      {editingCustomer ? "Edit Customer" : "Add New Customer"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Department / Division *
                        </label>
                        <Input
                          value={formData.companyName}
                          onChange={(e) =>
                            setFormData({ ...formData, companyName: e.target.value })
                          }
                          placeholder="e.g., Hesburgh Libraries"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Organization
                        </label>
                        <select
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                          value={formData.organizationId}
                          onChange={(e) =>
                            setFormData({ ...formData, organizationId: e.target.value })
                          }
                        >
                          <option value="">— No Organization —</option>
                          {organizations.map((org) => {
                            const tier = settings.pricing.pricingTiers.find(
                              (t) => t.id === org.pricingTier
                            );
                            return (
                              <option key={org.id} value={org.id}>
                                {org.name} ({tier?.name || org.pricingTier})
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Contact Name *
                        </label>
                        <Input
                          value={formData.contactName}
                          onChange={(e) =>
                            setFormData({ ...formData, contactName: e.target.value })
                          }
                          placeholder="Primary contact"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email *</label>
                        <Input
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) =>
                            setFormData({ ...formData, contactEmail: e.target.value })
                          }
                          placeholder="email@company.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Phone</label>
                        <Input
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) =>
                            setFormData({ ...formData, contactPhone: e.target.value })
                          }
                          placeholder="(555) 555-5555"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Address</label>
                      <Input
                        value={formData.street}
                        onChange={(e) =>
                          setFormData({ ...formData, street: e.target.value })
                        }
                        placeholder="Street address"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="City"
                      />
                      <Input
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="State"
                      />
                      <Input
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        placeholder="ZIP"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Tags</label>
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag..."
                          onKeyDown={(e) =>
                            e.key === "Enter" && (e.preventDefault(), handleAddTag())
                          }
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
                      <Button onClick={handleSubmitCustomer}>
                        {editingCustomer ? "Save Changes" : "Add Customer"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={
                    activeTab === "organizations"
                      ? "Search organizations..."
                      : "Search customers..."
                  }
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="mt-0">
            <div className="grid gap-4">
              {filteredOrganizations.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No organizations found</p>
                    <Button
                      variant="link"
                      className="mt-2"
                      onClick={() => setIsAddOrgDialogOpen(true)}
                    >
                      Add your first organization
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredOrganizations.map((org) => {
                  const stats = getOrgStats(org.id);
                  const TierIcon = tierIcons[org.pricingTier];
                  const OrgTypeIcon = orgTypeIcons[org.type];
                  const tierConfig = settings.pricing.pricingTiers.find(
                    (t) => t.id === org.pricingTier
                  );
                  const orgCustomers = customers.filter((c) => c.organizationId === org.id);

                  return (
                    <Card
                      key={org.id}
                      className="hover:shadow-lg transition-shadow overflow-hidden"
                    >
                      <div className="flex">
                        {/* Tier Color Bar */}
                        <div
                          className={`w-2 ${
                            org.pricingTier === "premier"
                              ? "bg-amber-400"
                              : org.pricingTier === "preferred"
                              ? "bg-blue-400"
                              : "bg-slate-400"
                          }`}
                        />
                        <CardContent className="flex-1 p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div
                                className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                                  org.pricingTier === "premier"
                                    ? "bg-amber-100 text-amber-600"
                                    : org.pricingTier === "preferred"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                <OrgTypeIcon className="h-7 w-7" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-lg font-semibold text-slate-900">
                                    {org.name}
                                  </h3>
                                  <Badge className={tierColors[org.pricingTier]}>
                                    <TierIcon className="h-3 w-3 mr-1" />
                                    {tierConfig?.name} ({tierConfig?.discountPercent}% off)
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                  <span className="capitalize">{org.type.replace("-", " ")}</span>
                                  {org.accountNumber && <span>Acct: {org.accountNumber}</span>}
                                  {org.website && (
                                    <a
                                      href={org.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 hover:text-brand-green"
                                    >
                                      <Globe className="h-3 w-3" />
                                      Website
                                    </a>
                                  )}
                                </div>
                                {org.address && (
                                  <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
                                    <MapPin className="h-3 w-3" />
                                    {org.address.city}, {org.address.state}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditOrg(org)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => deleteOrganization(org.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-6 mt-4 pt-4 border-t">
                            <div>
                              <p className="text-sm text-slate-500">Customers</p>
                              <p className="text-xl font-semibold text-slate-900">
                                {stats.customerCount}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Quotes</p>
                              <p className="text-xl font-semibold text-slate-900">
                                {stats.quoteCount}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Total Value</p>
                              <p className="text-xl font-semibold text-brand-green">
                                {formatCurrency(stats.totalValue)}
                              </p>
                            </div>
                          </div>

                          {/* Linked Customers */}
                          {orgCustomers.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                                Departments / Customers
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {orgCustomers.map((customer) => {
                                  const primaryContact = getPrimaryContact(customer);
                                  return (
                                    <div
                                      key={customer.id}
                                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-sm"
                                    >
                                      <Users className="h-3 w-3 text-slate-400" />
                                      <span className="font-medium text-slate-700">
                                        {customer.companyName}
                                      </span>
                                      {primaryContact && (
                                        <span className="text-slate-400">
                                          · {primaryContact.name}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCustomers.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center">
                    <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No customers found</p>
                    <Button
                      variant="link"
                      className="mt-2"
                      onClick={() => setIsAddDialogOpen(true)}
                    >
                      Add your first customer
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredCustomers.map((customer) => {
                  const stats = getCustomerStats(customer.id);
                  const primaryContact = getPrimaryContact(customer);
                  const tier = getCustomerTier(customer);
                  const org = customer.organizationId
                    ? getOrganization(customer.organizationId)
                    : null;
                  const TierIcon = tier ? tierIcons[tier] : null;

                  return (
                    <Card key={customer.id} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green font-bold text-lg">
                              {customer.companyName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {customer.companyName}
                              </h3>
                              <p className="text-sm text-slate-500">{primaryContact?.name}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditCustomer(customer)}
                              className="p-2 rounded-lg hover:bg-slate-100"
                            >
                              <Edit className="h-4 w-4 text-slate-500" />
                            </button>
                            <button
                              onClick={() => deleteCustomer(customer.id)}
                              className="p-2 rounded-lg hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </div>

                        {/* Organization & Tier */}
                        {org && tier && TierIcon && (
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="text-xs">
                              {org.name}
                            </Badge>
                            <Badge className={`text-xs ${tierColors[tier]}`}>
                              <TierIcon className="h-3 w-3 mr-1" />
                              {settings.pricing.pricingTiers.find((t) => t.id === tier)
                                ?.discountPercent || 0}
                              % off
                            </Badge>
                          </div>
                        )}

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
                              <p className="font-semibold text-slate-900">
                                {formatCurrency(stats.totalValue)}
                              </p>
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
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
