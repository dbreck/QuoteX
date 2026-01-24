"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useStore } from "@/store";
import {
  Building2,
  Percent,
  DollarSign,
  Bell,
  Palette,
  Save,
  Upload,
  Mail,
  Phone,
  Globe,
  MapPin,
} from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings } = useStore();
  const [activeTab, setActiveTab] = useState("company");
  const [saved, setSaved] = useState(false);

  const [companyInfo, setCompanyInfo] = useState({
    name: settings.company.name,
    email: settings.company.email,
    phone: settings.company.phone,
    address: settings.company.address,
    website: settings.company.website,
    logo: settings.company.logo || "",
  });

  const [pricingSettings, setPricingSettings] = useState({
    defaultMargin: settings.pricing.defaultMargin,
    taxRate: settings.pricing.taxRate,
    quoteValidityDays: settings.pricing.quoteValidityDays,
    invoiceDueDays: 30,
  });

  const [notifications, setNotifications] = useState({
    emailOnQuoteAccepted: true,
    emailOnQuoteRejected: true,
    emailOnInvoicePaid: true,
    lowStockAlerts: true,
    overdueInvoiceReminders: true,
  });

  const handleSave = () => {
    updateSettings({
      company: {
        name: companyInfo.name,
        email: companyInfo.email,
        phone: companyInfo.phone,
        address: companyInfo.address,
        website: companyInfo.website,
        logo: companyInfo.logo || undefined,
      },
      pricing: {
        defaultMargin: pricingSettings.defaultMargin,
        taxRate: pricingSettings.taxRate,
        quoteValidityDays: pricingSettings.quoteValidityDays,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <Header
        title="Settings"
        subtitle="Manage your QuoteX preferences"
        actions={
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        }
      />

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="company" className="gap-2">
              <Building2 className="h-4 w-4" />
              Company
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Pricing & Tax
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Company Information</h3>
                <div className="grid gap-6">
                  <div className="flex items-center gap-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-slate-100 border-2 border-dashed border-slate-300">
                      <Upload className="h-8 w-8 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Company Logo</p>
                      <p className="text-sm text-slate-500 mb-2">Upload your company logo for quotes and invoices</p>
                      <Button variant="outline" size="sm">
                        Upload Logo
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        Company Name
                      </label>
                      <Input
                        value={companyInfo.name}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                        placeholder="Your Company Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-slate-400" />
                        Website
                      </label>
                      <Input
                        value={companyInfo.website}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                        placeholder="https://www.example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        Email
                      </label>
                      <Input
                        type="email"
                        value={companyInfo.email}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                        placeholder="contact@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        Phone
                      </label>
                      <Input
                        type="tel"
                        value={companyInfo.phone}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                        placeholder="(555) 555-5555"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      Address
                    </label>
                    <Input
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                      placeholder="123 Business St, City, State 12345"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Pricing & Tax Settings</h3>
                <div className="grid gap-6 max-w-xl">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Percent className="h-4 w-4 text-slate-400" />
                      Default Margin (%)
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={pricingSettings.defaultMargin}
                      onChange={(e) =>
                        setPricingSettings({ ...pricingSettings, defaultMargin: parseFloat(e.target.value) || 0 })
                      }
                    />
                    <p className="text-xs text-slate-500">Default markup percentage applied to product costs</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Percent className="h-4 w-4 text-slate-400" />
                      Tax Rate (%)
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={pricingSettings.taxRate}
                      onChange={(e) =>
                        setPricingSettings({ ...pricingSettings, taxRate: parseFloat(e.target.value) || 0 })
                      }
                    />
                    <p className="text-xs text-slate-500">Default tax rate applied to quotes and invoices</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Quote Valid Days</label>
                    <Input
                      type="number"
                      min={1}
                      value={pricingSettings.quoteValidityDays}
                      onChange={(e) =>
                        setPricingSettings({ ...pricingSettings, quoteValidityDays: parseInt(e.target.value) || 30 })
                      }
                    />
                    <p className="text-xs text-slate-500">Number of days quotes remain valid by default</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Invoice Due Days</label>
                    <Input
                      type="number"
                      min={1}
                      value={pricingSettings.invoiceDueDays}
                      onChange={(e) =>
                        setPricingSettings({ ...pricingSettings, invoiceDueDays: parseInt(e.target.value) || 30 })
                      }
                    />
                    <p className="text-xs text-slate-500">Default payment terms for invoices (Net X days)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Notification Preferences</h3>
                <div className="space-y-6 max-w-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Quote Accepted</p>
                      <p className="text-sm text-slate-500">Receive email when a quote is accepted</p>
                    </div>
                    <Switch
                      checked={notifications.emailOnQuoteAccepted}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailOnQuoteAccepted: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Quote Rejected</p>
                      <p className="text-sm text-slate-500">Receive email when a quote is rejected</p>
                    </div>
                    <Switch
                      checked={notifications.emailOnQuoteRejected}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailOnQuoteRejected: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Invoice Paid</p>
                      <p className="text-sm text-slate-500">Receive email when an invoice is paid</p>
                    </div>
                    <Switch
                      checked={notifications.emailOnInvoicePaid}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailOnInvoicePaid: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Low Stock Alerts</p>
                      <p className="text-sm text-slate-500">Receive alerts when inventory is low</p>
                    </div>
                    <Switch
                      checked={notifications.lowStockAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, lowStockAlerts: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Overdue Invoice Reminders</p>
                      <p className="text-sm text-slate-500">Receive reminders for overdue invoices</p>
                    </div>
                    <Switch
                      checked={notifications.overdueInvoiceReminders}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, overdueInvoiceReminders: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Appearance Settings</h3>
                <div className="space-y-6 max-w-xl">
                  <div>
                    <p className="font-medium text-slate-900 mb-3">Brand Colors</p>
                    <div className="flex gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-slate-500">Primary</label>
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-lg bg-brand-green border" />
                          <Input value="#8dc63f" className="w-28 font-mono text-sm" readOnly />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-slate-500">Secondary</label>
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-lg bg-brand-navy border" />
                          <Input value="#1a3c5c" className="w-28 font-mono text-sm" readOnly />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-slate-900 mb-3">Theme</p>
                    <div className="flex gap-4">
                      <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-brand-green bg-brand-green/5">
                        <div className="h-12 w-20 rounded-lg bg-white border shadow-sm" />
                        <span className="text-sm font-medium">Light</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-transparent hover:border-slate-300">
                        <div className="h-12 w-20 rounded-lg bg-slate-800 border" />
                        <span className="text-sm text-slate-500">Dark</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-transparent hover:border-slate-300">
                        <div className="h-12 w-20 rounded-lg bg-gradient-to-b from-white to-slate-800 border" />
                        <span className="text-sm text-slate-500">System</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-slate-900 mb-3">Quote/Invoice Template</p>
                    <div className="grid grid-cols-3 gap-4">
                      <button className="aspect-[8.5/11] rounded-xl border-2 border-brand-green bg-white p-3 hover:shadow-md transition-shadow">
                        <div className="h-full w-full rounded bg-slate-50 flex flex-col">
                          <div className="h-8 bg-brand-green rounded-t" />
                          <div className="flex-1 p-2 space-y-1">
                            <div className="h-2 w-3/4 bg-slate-200 rounded" />
                            <div className="h-2 w-1/2 bg-slate-200 rounded" />
                          </div>
                        </div>
                      </button>
                      <button className="aspect-[8.5/11] rounded-xl border-2 border-transparent hover:border-slate-300 bg-white p-3 hover:shadow-md transition-shadow">
                        <div className="h-full w-full rounded bg-slate-50 flex flex-col">
                          <div className="h-8 bg-brand-navy rounded-t" />
                          <div className="flex-1 p-2 space-y-1">
                            <div className="h-2 w-3/4 bg-slate-200 rounded" />
                            <div className="h-2 w-1/2 bg-slate-200 rounded" />
                          </div>
                        </div>
                      </button>
                      <button className="aspect-[8.5/11] rounded-xl border-2 border-transparent hover:border-slate-300 bg-white p-3 hover:shadow-md transition-shadow">
                        <div className="h-full w-full rounded bg-slate-50 flex flex-col">
                          <div className="h-8 bg-white border-b" />
                          <div className="flex-1 p-2 space-y-1">
                            <div className="h-2 w-3/4 bg-slate-200 rounded" />
                            <div className="h-2 w-1/2 bg-slate-200 rounded" />
                          </div>
                        </div>
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Choose a template style for your quotes and invoices
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
