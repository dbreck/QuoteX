"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store";
import { formatCurrency, formatDate, getStatusColor, cn } from "@/lib/utils";
import type { Organization, PricingTier, ActivityType } from "@/types";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Crown,
  Star,
  Award,
  Users,
  Globe,
  Edit,
  Plus,
  StickyNote,
  TrendingUp,
  CheckCircle,
  Clock,
  GraduationCap,
  Landmark,
  Heart,
  Briefcase,
  School,
  Store,
  Send,
  PhoneCall,
  MessageSquare,
  Calendar,
  Activity as ActivityIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const orgTypeIcons: Record<string, typeof Building2> = {
  university: GraduationCap,
  government: Landmark,
  corporate: Briefcase,
  healthcare: Heart,
  k12: School,
  dealer: Store,
  other: Building2,
};

const activityTypeConfig: Record<ActivityType, { icon: typeof FileText; color: string; label: string }> = {
  note: { icon: StickyNote, color: "bg-slate-100 text-slate-600", label: "Note" },
  quote_created: { icon: FileText, color: "bg-blue-100 text-blue-600", label: "Quote Created" },
  quote_sent: { icon: Send, color: "bg-green-100 text-green-600", label: "Quote Sent" },
  call: { icon: PhoneCall, color: "bg-amber-100 text-amber-600", label: "Call" },
  email: { icon: MessageSquare, color: "bg-purple-100 text-purple-600", label: "Email" },
  meeting: { icon: Calendar, color: "bg-pink-100 text-pink-600", label: "Meeting" },
};

export default function OrgDetailPage() {
  const params = useParams();
  const router = useRouter();
  const {
    organizations,
    customers,
    quotes,
    activities,
    settings,
    getOrganization,
    getCustomer,
    updateOrganization,
    addActivity,
  } = useStore();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activityNote, setActivityNote] = useState("");

  const organization = useMemo(() => {
    return organizations.find((o) => o.id === params.orgId);
  }, [organizations, params.orgId]);

  const orgCustomers = useMemo(() => {
    if (!organization) return [];
    return customers.filter((c) => c.organizationId === organization.id);
  }, [customers, organization]);

  const orgQuotes = useMemo(() => {
    if (!organization) return [];
    const customerIds = new Set(orgCustomers.map((c) => c.id));
    return quotes
      .filter((q) => customerIds.has(q.customerId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orgCustomers, quotes, organization]);

  const orgActivities = useMemo(() => {
    if (!organization) return [];
    return activities
      .filter((a) => a.organizationId === organization.id)
      .slice(0, 20);
  }, [activities, organization]);

  const stats = useMemo(() => {
    const totalValue = orgQuotes.reduce((sum, q) => sum + q.total, 0);
    const accepted = orgQuotes.filter((q) => q.status === "accepted");
    const acceptedValue = accepted.reduce((sum, q) => sum + q.total, 0);
    const conversionRate =
      orgQuotes.length > 0 ? Math.round((accepted.length / orgQuotes.length) * 100) : 0;
    return {
      quoteCount: orgQuotes.length,
      totalValue,
      acceptedCount: accepted.length,
      acceptedValue,
      conversionRate,
      customerCount: orgCustomers.length,
    };
  }, [orgQuotes, orgCustomers]);

  const tierConfig = useMemo(() => {
    if (!organization) return null;
    return settings.pricing.pricingTiers.find((t) => t.id === organization.pricingTier) || null;
  }, [organization, settings.pricing.pricingTiers]);

  const [editForm, setEditForm] = useState({
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

  const openEdit = () => {
    if (!organization) return;
    setEditForm({
      name: organization.name,
      type: organization.type,
      pricingTier: organization.pricingTier,
      accountNumber: organization.accountNumber || "",
      website: organization.website || "",
      street: organization.address?.street || "",
      city: organization.address?.city || "",
      state: organization.address?.state || "",
      zip: organization.address?.zip || "",
      notes: organization.notes || "",
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!organization) return;
    updateOrganization(organization.id, {
      name: editForm.name,
      type: editForm.type,
      pricingTier: editForm.pricingTier,
      accountNumber: editForm.accountNumber || undefined,
      website: editForm.website || undefined,
      address: editForm.street
        ? {
            street: editForm.street,
            city: editForm.city,
            state: editForm.state,
            zip: editForm.zip,
            country: "USA",
          }
        : undefined,
      notes: editForm.notes || undefined,
    });
    setIsEditOpen(false);
  };

  const handleAddNote = () => {
    if (!activityNote.trim() || !organization) return;
    addActivity({
      type: "note",
      content: activityNote.trim(),
      organizationId: organization.id,
    });
    setActivityNote("");
  };

  if (!organization) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Organization not found</h2>
          <p className="text-slate-500 mb-4">The organization you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/customers">
            <Button>Back to CRM</Button>
          </Link>
        </div>
      </div>
    );
  }

  const TierIcon = tierIcons[organization.pricingTier];
  const OrgTypeIcon = orgTypeIcons[organization.type] || Building2;

  return (
    <>
      <Header
        title={
          <div className="flex items-center gap-3">
            <Link href="/customers" className="p-2 -ml-2 rounded-lg hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5 text-slate-500" />
            </Link>
            <OrgTypeIcon className="h-5 w-5 text-slate-500" />
            <span>{organization.name}</span>
            {tierConfig && (
              <Badge className={tierColors[organization.pricingTier]}>
                <TierIcon className="h-3 w-3 mr-1" />
                {tierConfig.name}
              </Badge>
            )}
          </div>
        }
        subtitle={`${organization.type.charAt(0).toUpperCase() + organization.type.slice(1)} · ${stats.customerCount} customer${stats.customerCount !== 1 ? "s" : ""} · ${stats.quoteCount} quote${stats.quoteCount !== 1 ? "s" : ""}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={openEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Link href="/quotes/new">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Quote
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <Users className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Customers</p>
                  <p className="text-xl font-bold text-slate-900">{stats.customerCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Quotes</p>
                  <p className="text-xl font-bold text-slate-900">{stats.quoteCount}</p>
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
                  <p className="text-sm text-slate-500">Accepted</p>
                  <p className="text-xl font-bold text-green-600">{stats.acceptedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green/10">
                  <TrendingUp className="h-5 w-5 text-brand-green" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Value</p>
                  <p className="text-xl font-bold text-brand-green">{formatCurrency(stats.totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Win Rate</p>
                  <p className="text-xl font-bold text-amber-600">{stats.conversionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customers */}
            <Card>
              <CardContent className="p-0">
                <div className="p-5 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Customers / Departments</h3>
                </div>
                {orgCustomers.length === 0 ? (
                  <div className="py-12 text-center">
                    <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No customers linked to this organization</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {orgCustomers.map((customer) => {
                      const primaryContact = customer.contacts.find((c) => c.isPrimary) || customer.contacts[0];
                      const custQuotes = quotes.filter((q) => q.customerId === customer.id);
                      return (
                        <Link
                          key={customer.id}
                          href={`/customers/${customer.id}`}
                          className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green font-bold">
                              {customer.companyName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{customer.companyName}</p>
                              <div className="flex items-center gap-3 text-sm text-slate-500">
                                {primaryContact && <span>{primaryContact.name}</span>}
                                {primaryContact?.email && (
                                  <>
                                    <span className="text-slate-300">·</span>
                                    <span>{primaryContact.email}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <p className="font-medium text-slate-900">{custQuotes.length} quotes</p>
                            <p className="text-slate-500">
                              {formatCurrency(custQuotes.reduce((s, q) => s + q.total, 0))}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quotes */}
            <Card>
              <CardContent className="p-0">
                <div className="p-5 border-b">
                  <h3 className="font-semibold text-slate-900">Quote History</h3>
                </div>
                {orgQuotes.length === 0 ? (
                  <div className="py-12 text-center">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No quotes yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Quote</th>
                          <th>Customer</th>
                          <th>Project</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orgQuotes.map((quote) => (
                          <tr
                            key={quote.id}
                            className="group cursor-pointer hover:bg-slate-50"
                            onClick={() => router.push(`/quotes/${quote.id}`)}
                          >
                            <td>
                              <p className="font-medium text-slate-900 group-hover:text-brand-green">
                                {quote.quoteNumber}
                              </p>
                            </td>
                            <td className="text-slate-600">{quote.customerName}</td>
                            <td className="text-slate-600">{quote.projectName || "—"}</td>
                            <td className="font-semibold">{formatCurrency(quote.total)}</td>
                            <td>
                              <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
                            </td>
                            <td className="text-sm text-slate-500">{formatDate(quote.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Org Info */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-xl",
                      organization.pricingTier === "premier"
                        ? "bg-amber-100 text-amber-600"
                        : organization.pricingTier === "preferred"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-slate-100 text-slate-600"
                    )}
                  >
                    <OrgTypeIcon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{organization.name}</h3>
                    <p className="text-sm text-slate-500 capitalize">{organization.type}</p>
                  </div>
                </div>

                {tierConfig && (
                  <Badge className={cn(tierColors[organization.pricingTier], "mb-3")}>
                    <TierIcon className="h-3 w-3 mr-1" />
                    {tierConfig.name} ({tierConfig.discountPercent}% off list)
                  </Badge>
                )}

                <div className="space-y-3 text-sm mt-4">
                  {organization.accountNumber && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <FileText className="h-4 w-4 text-slate-400" />
                      Acct: {organization.accountNumber}
                    </div>
                  )}
                  {organization.website && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Globe className="h-4 w-4 text-slate-400" />
                      <a
                        href={organization.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-brand-green"
                      >
                        {organization.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                  {organization.address && (
                    <div className="flex items-start gap-2 text-slate-600">
                      <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                      <div>
                        <p>{organization.address.street}</p>
                        {organization.address.city && (
                          <p>
                            {organization.address.city}, {organization.address.state}{" "}
                            {organization.address.zip}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {organization.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Notes</p>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{organization.notes}</p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t text-xs text-slate-500">
                  <p>Created {formatDate(organization.createdAt)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Activity */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <ActivityIcon className="h-4 w-4" />
                  Activity
                </h3>

                {/* Add Note */}
                <div className="mb-4">
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                    rows={2}
                    value={activityNote}
                    onChange={(e) => setActivityNote(e.target.value)}
                    placeholder="Add a note..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.metaKey) {
                        e.preventDefault();
                        handleAddNote();
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={handleAddNote}
                    disabled={!activityNote.trim()}
                  >
                    Add Note
                  </Button>
                </div>

                {orgActivities.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">No activity yet</p>
                ) : (
                  <div className="space-y-3">
                    {orgActivities.map((activity) => {
                      const config = activityTypeConfig[activity.type];
                      const Icon = config.icon;
                      return (
                        <div key={activity.id} className="flex items-start gap-2">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-md shrink-0 ${config.color}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-700">{activity.content}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{formatDate(activity.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Organization Name *</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Account Number</label>
                <Input
                  value={editForm.accountNumber}
                  onChange={(e) => setEditForm({ ...editForm, accountNumber: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Type</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value as Organization["type"] })}
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
                <label className="text-sm font-medium text-slate-700">Pricing Tier</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                  value={editForm.pricingTier}
                  onChange={(e) => setEditForm({ ...editForm, pricingTier: e.target.value as PricingTier })}
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
                value={editForm.website}
                onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Address</label>
              <Input
                value={editForm.street}
                onChange={(e) => setEditForm({ ...editForm, street: e.target.value })}
                placeholder="Street address"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input
                value={editForm.city}
                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                placeholder="City"
              />
              <Input
                value={editForm.state}
                onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                placeholder="State"
              />
              <Input
                value={editForm.zip}
                onChange={(e) => setEditForm({ ...editForm, zip: e.target.value })}
                placeholder="ZIP"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Notes</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-green"
                rows={3}
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
