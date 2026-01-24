"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store";
import { formatCurrency, cn, generateId } from "@/lib/utils";
import {
  baseSeries,
  heightOptions,
  finishColors,
  topShapes,
  topMaterials,
  edgeOptions,
  accessories,
  calculateTablePrice,
} from "@/data/products";
import type { BaseSeriesType, HeightOption, TopShape, TopMaterial, EdgeType } from "@/types";
import {
  ShoppingCart,
  RotateCcw,
  Check,
  ChevronRight,
  Ruler,
  Palette,
  Square,
  Layers,
  Plug,
  Info,
} from "lucide-react";

export default function ConfiguratorPage() {
  const router = useRouter();
  const { currentConfig, updateCurrentConfig, resetCurrentConfig } = useStore();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: "base", label: "Base", icon: Layers },
    { id: "height", label: "Height", icon: Ruler },
    { id: "finish", label: "Finish", icon: Palette },
    { id: "top", label: "Top", icon: Square },
    { id: "accessories", label: "Accessories", icon: Plug },
  ];

  const selectedBase = useMemo(
    () => baseSeries.find((b) => b.id === currentConfig.baseSeries),
    [currentConfig.baseSeries]
  );

  const selectedFinish = useMemo(
    () => finishColors.find((f) => f.id === currentConfig.finish),
    [currentConfig.finish]
  );

  const totalPrice = useMemo(
    () => calculateTablePrice(currentConfig),
    [currentConfig]
  );

  const handleAddToQuote = () => {
    const configWithPrice = {
      ...currentConfig,
      id: generateId(),
      calculatedPrice: totalPrice,
    };
    // Store in session for quote builder
    sessionStorage.setItem("pendingConfiguration", JSON.stringify(configWithPrice));
    router.push("/quotes/new");
  };

  return (
    <>
      <Header
        title="Table Configurator"
        subtitle="Build your custom table configuration"
        actions={
          <Button variant="ghost" size="sm" onClick={resetCurrentConfig} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="xl:col-span-2 space-y-6">
            {/* Step Navigation */}
            <Card>
              <CardContent className="p-4">
                <nav className="flex items-center gap-2 overflow-x-auto">
                  {steps.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(index)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                        activeStep === index
                          ? "bg-brand-green text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      <step.icon className="h-4 w-4" />
                      {step.label}
                      {index < steps.length - 1 && (
                        <ChevronRight className="h-4 w-4 ml-1 text-slate-400" />
                      )}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* Step Content */}
            <Card>
              <CardContent className="p-6">
                {/* Step 1: Base Selection */}
                {activeStep === 0 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">Select Base Series</h3>
                      <p className="text-sm text-slate-500">Choose the foundation for your table</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {baseSeries.map((base) => (
                        <button
                          key={base.id}
                          onClick={() => updateCurrentConfig({ baseSeries: base.id })}
                          className={cn(
                            "relative flex flex-col items-center p-4 rounded-xl border-2 transition-all hover:shadow-md",
                            currentConfig.baseSeries === base.id
                              ? "border-brand-green bg-brand-green/5"
                              : "border-slate-200 hover:border-slate-300"
                          )}
                        >
                          {currentConfig.baseSeries === base.id && (
                            <div className="absolute top-2 right-2">
                              <Check className="h-5 w-5 text-brand-green" />
                            </div>
                          )}
                          {/* Base Icon/Image Placeholder */}
                          <div className="w-16 h-16 mb-3 flex items-center justify-center bg-slate-100 rounded-lg">
                            <Layers className="h-8 w-8 text-slate-400" />
                          </div>
                          <span className="font-medium text-slate-900 text-sm text-center">
                            {base.name}
                          </span>
                          <span className="text-xs text-slate-500 mt-1">
                            from {formatCurrency(base.basePrice)}
                          </span>
                        </button>
                      ))}
                    </div>

                    {selectedBase && (
                      <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                        <h4 className="font-medium text-slate-900 mb-2">{selectedBase.name} Features</h4>
                        <p className="text-sm text-slate-600 mb-3">{selectedBase.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedBase.supportsFolding && (
                            <Badge variant="secondary">Folding Available</Badge>
                          )}
                          {selectedBase.supportsFlipTop && (
                            <Badge variant="secondary">Flip-Top Available</Badge>
                          )}
                          {selectedBase.supportsNesting && (
                            <Badge variant="secondary">Nesting Available</Badge>
                          )}
                          {selectedBase.supportsChrome && (
                            <Badge variant="secondary">Chrome Option</Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Height Options */}
                {activeStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">Height & Mechanism</h3>
                      <p className="text-sm text-slate-500">Select height adjustment options</p>
                    </div>

                    <div className="space-y-3">
                      {heightOptions
                        .filter((h) => selectedBase?.heightOptions.includes(h.id))
                        .map((height) => (
                          <button
                            key={height.id}
                            onClick={() => updateCurrentConfig({ height: height.id })}
                            className={cn(
                              "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                              currentConfig.height === height.id
                                ? "border-brand-green bg-brand-green/5"
                                : "border-slate-200 hover:border-slate-300"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                  currentConfig.height === height.id
                                    ? "border-brand-green"
                                    : "border-slate-300"
                                )}
                              >
                                {currentConfig.height === height.id && (
                                  <div className="w-3 h-3 rounded-full bg-brand-green" />
                                )}
                              </div>
                              <span className="font-medium text-slate-900">{height.name}</span>
                            </div>
                            <span className="text-sm text-slate-600">
                              {height.priceAdder > 0 ? `+${formatCurrency(height.priceAdder)}` : "Included"}
                            </span>
                          </button>
                        ))}
                    </div>

                    {/* Feature Toggles */}
                    {selectedBase && (
                      <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-medium text-slate-900">Additional Features</h4>

                        {selectedBase.supportsFolding && (
                          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={currentConfig.folding}
                                onCheckedChange={(checked) =>
                                  updateCurrentConfig({ folding: checked as boolean })
                                }
                              />
                              <span className="text-sm font-medium text-slate-700">Folding</span>
                            </div>
                            <span className="text-sm text-slate-500">+$125</span>
                          </label>
                        )}

                        {selectedBase.supportsFlipTop && (
                          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={currentConfig.flipTop}
                                onCheckedChange={(checked) =>
                                  updateCurrentConfig({ flipTop: checked as boolean })
                                }
                              />
                              <span className="text-sm font-medium text-slate-700">Flip-Top</span>
                            </div>
                            <span className="text-sm text-slate-500">+$145</span>
                          </label>
                        )}

                        {selectedBase.supportsNesting && (
                          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={currentConfig.nesting}
                                onCheckedChange={(checked) =>
                                  updateCurrentConfig({ nesting: checked as boolean })
                                }
                              />
                              <span className="text-sm font-medium text-slate-700">Nesting</span>
                            </div>
                            <span className="text-sm text-slate-500">+$165</span>
                          </label>
                        )}

                        <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={currentConfig.footRing}
                              onCheckedChange={(checked) =>
                                updateCurrentConfig({ footRing: checked as boolean })
                              }
                            />
                            <span className="text-sm font-medium text-slate-700">Foot Ring</span>
                          </div>
                          <span className="text-sm text-slate-500">+$125</span>
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Finish Selection */}
                {activeStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">Base Finish</h3>
                      <p className="text-sm text-slate-500">Choose your powdercoat finish color</p>
                    </div>

                    {/* Chrome Toggle */}
                    {selectedBase?.supportsChrome && (
                      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                        <div>
                          <p className="font-medium text-slate-900">Chrome Finish</p>
                          <p className="text-sm text-slate-500">Polished chrome instead of powdercoat</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-slate-600">+$150</span>
                          <Switch
                            checked={currentConfig.isChrome}
                            onCheckedChange={(checked) =>
                              updateCurrentConfig({ isChrome: checked })
                            }
                          />
                        </div>
                      </div>
                    )}

                    {!currentConfig.isChrome && (
                      <>
                        {/* Color Categories */}
                        <Tabs defaultValue="neutral" className="w-full">
                          <TabsList className="grid grid-cols-5 mb-4">
                            <TabsTrigger value="neutral">Neutral</TabsTrigger>
                            <TabsTrigger value="metallic">Metallic</TabsTrigger>
                            <TabsTrigger value="warm">Warm</TabsTrigger>
                            <TabsTrigger value="cool">Cool</TabsTrigger>
                            <TabsTrigger value="bold">Bold</TabsTrigger>
                          </TabsList>

                          {["neutral", "metallic", "warm", "cool", "bold"].map((category) => (
                            <TabsContent key={category} value={category}>
                              <div className="grid grid-cols-5 md:grid-cols-8 gap-3">
                                {finishColors
                                  .filter((c) => c.category === category)
                                  .map((color) => (
                                    <button
                                      key={color.id}
                                      onClick={() => updateCurrentConfig({ finish: color.id })}
                                      className="group relative"
                                      title={color.name}
                                    >
                                      <div
                                        className={cn(
                                          "w-12 h-12 rounded-xl border-2 transition-all shadow-sm",
                                          currentConfig.finish === color.id
                                            ? "border-brand-green scale-110 shadow-md"
                                            : "border-transparent hover:scale-105"
                                        )}
                                        style={{ backgroundColor: color.hex }}
                                      >
                                        {currentConfig.finish === color.id && (
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <Check
                                              className={cn(
                                                "h-5 w-5",
                                                ["#FFFFFF", "#F8F8FF", "#F5F5DC", "#FFFDD0", "#FDEEF4"].includes(color.hex)
                                                  ? "text-slate-900"
                                                  : "text-white"
                                              )}
                                            />
                                          </div>
                                        )}
                                      </div>
                                      <span className="block text-xs text-slate-600 mt-1 text-center truncate">
                                        {color.name}
                                      </span>
                                    </button>
                                  ))}
                              </div>
                            </TabsContent>
                          ))}
                        </Tabs>
                      </>
                    )}
                  </div>
                )}

                {/* Step 4: Top Configuration */}
                {activeStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">Table Top</h3>
                      <p className="text-sm text-slate-500">Configure your table surface</p>
                    </div>

                    {/* Top Dimensions */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Width (inches)
                        </label>
                        <Input
                          type="number"
                          value={currentConfig.topWidth || 60}
                          onChange={(e) =>
                            updateCurrentConfig({ topWidth: parseInt(e.target.value) || 60 })
                          }
                          min={24}
                          max={120}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Depth (inches)
                        </label>
                        <Input
                          type="number"
                          value={currentConfig.topDepth || 30}
                          onChange={(e) =>
                            updateCurrentConfig({ topDepth: parseInt(e.target.value) || 30 })
                          }
                          min={18}
                          max={60}
                        />
                      </div>
                    </div>

                    {/* Top Shape */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Shape</label>
                      <div className="grid grid-cols-5 gap-3">
                        {topShapes.map((shape) => (
                          <button
                            key={shape.id}
                            onClick={() => updateCurrentConfig({ topShape: shape.id })}
                            className={cn(
                              "flex flex-col items-center p-3 rounded-xl border-2 transition-all",
                              currentConfig.topShape === shape.id
                                ? "border-brand-green bg-brand-green/5"
                                : "border-slate-200 hover:border-slate-300"
                            )}
                          >
                            <span className="text-2xl mb-1">{shape.icon}</span>
                            <span className="text-xs text-slate-600">{shape.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Top Material */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Material</label>
                      <div className="space-y-2">
                        {topMaterials.map((material) => (
                          <button
                            key={material.id}
                            onClick={() => updateCurrentConfig({ topMaterial: material.id })}
                            className={cn(
                              "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                              currentConfig.topMaterial === material.id
                                ? "border-brand-green bg-brand-green/5"
                                : "border-slate-200 hover:border-slate-300"
                            )}
                          >
                            <div>
                              <span className="font-medium text-slate-900">{material.name}</span>
                              <p className="text-sm text-slate-500">{material.description}</p>
                            </div>
                            <span className="text-sm text-slate-600 whitespace-nowrap">
                              ${material.pricePerSqFt}/sq ft
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Edge Selection */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Edge Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        {edgeOptions.map((edge) => (
                          <button
                            key={edge.id}
                            onClick={() => updateCurrentConfig({ edgeType: edge.id })}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg border-2 transition-all text-left",
                              currentConfig.edgeType === edge.id
                                ? "border-brand-green bg-brand-green/5"
                                : "border-slate-200 hover:border-slate-300"
                            )}
                          >
                            <span className="text-sm text-slate-700">{edge.name}</span>
                            <span className="text-xs text-slate-500">${edge.pricePerLinearFt}/ft</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Accessories */}
                {activeStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">Accessories</h3>
                      <p className="text-sm text-slate-500">Add optional accessories to your table</p>
                    </div>

                    {/* Group accessories by category */}
                    {["panel", "wire-management", "caster", "power", "other"].map((category) => {
                      const categoryAccessories = accessories.filter((a) => a.category === category);
                      const categoryLabel = category
                        .split("-")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ");

                      return (
                        <div key={category}>
                          <h4 className="font-medium text-slate-900 mb-3">{categoryLabel}</h4>
                          <div className="space-y-2">
                            {categoryAccessories.map((accessory) => {
                              const isSelected = currentConfig.accessories?.includes(accessory.id);
                              return (
                                <label
                                  key={accessory.id}
                                  className={cn(
                                    "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                                    isSelected
                                      ? "border-brand-green bg-brand-green/5"
                                      : "border-slate-200 hover:border-slate-300"
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={(checked) => {
                                        const current = currentConfig.accessories || [];
                                        if (checked) {
                                          updateCurrentConfig({
                                            accessories: [...current, accessory.id],
                                          });
                                        } else {
                                          updateCurrentConfig({
                                            accessories: current.filter((id) => id !== accessory.id),
                                          });
                                        }
                                      }}
                                    />
                                    <div>
                                      <span className="font-medium text-slate-900">{accessory.name}</span>
                                      <p className="text-sm text-slate-500">{accessory.description}</p>
                                    </div>
                                  </div>
                                  <span className="font-medium text-slate-700">
                                    +{formatCurrency(accessory.price)}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Step Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                  >
                    Previous
                  </Button>
                  {activeStep < steps.length - 1 ? (
                    <Button onClick={() => setActiveStep(activeStep + 1)}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button onClick={handleAddToQuote} className="gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Add to Quote
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview & Summary Panel */}
          <div className="space-y-6">
            {/* Visual Preview */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center relative overflow-hidden">
                  {/* Table Preview Visualization */}
                  <div className="relative">
                    {/* Table Top */}
                    <div
                      className={cn(
                        "relative transition-all duration-300",
                        currentConfig.topShape === "round" && "rounded-full",
                        currentConfig.topShape === "squircle" && "rounded-3xl",
                        currentConfig.topShape === "rectangle" && "rounded-lg",
                        currentConfig.topShape === "ellipse" && "rounded-full"
                      )}
                      style={{
                        width: Math.min(180, (currentConfig.topWidth || 60) * 2.5),
                        height: Math.min(120, (currentConfig.topDepth || 30) * 2.5),
                        backgroundColor:
                          currentConfig.topMaterial === "stainless-steel"
                            ? "#c0c0c0"
                            : currentConfig.topMaterial === "butcher-block"
                            ? "#d4a574"
                            : "#f5f5f5",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                      }}
                    >
                      {/* Wood grain effect for butcher block */}
                      {currentConfig.topMaterial === "butcher-block" && (
                        <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-amber-900/20 to-transparent" />
                      )}
                    </div>

                    {/* Base */}
                    <div
                      className="absolute left-1/2 -bottom-8 -translate-x-1/2 w-8 h-16 rounded-b-lg"
                      style={{
                        backgroundColor: currentConfig.isChrome
                          ? "#c0c0c0"
                          : selectedFinish?.hex || "#1a1a1a",
                      }}
                    />

                    {/* Base feet */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-12">
                      <div
                        className="w-16 h-2 rounded-full"
                        style={{
                          backgroundColor: currentConfig.isChrome
                            ? "#c0c0c0"
                            : selectedFinish?.hex || "#1a1a1a",
                        }}
                      />
                    </div>
                  </div>

                  {/* Pattern background */}
                  <div className="absolute inset-0 pattern-bg opacity-50" />
                </div>
              </CardContent>
            </Card>

            {/* Configuration Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Configuration Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Base</span>
                    <span className="font-medium text-slate-900">{selectedBase?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Height</span>
                    <span className="font-medium text-slate-900">
                      {heightOptions.find((h) => h.id === currentConfig.height)?.name || "Standard"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Finish</span>
                    <div className="flex items-center gap-2">
                      {!currentConfig.isChrome && selectedFinish && (
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: selectedFinish.hex }}
                        />
                      )}
                      <span className="font-medium text-slate-900">
                        {currentConfig.isChrome ? "Chrome" : selectedFinish?.name || "Black"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Top Size</span>
                    <span className="font-medium text-slate-900">
                      {currentConfig.topWidth}" × {currentConfig.topDepth}"
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Top Material</span>
                    <span className="font-medium text-slate-900">
                      {topMaterials.find((m) => m.id === currentConfig.topMaterial)?.name || "HPL"}
                    </span>
                  </div>
                  {currentConfig.accessories && currentConfig.accessories.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Accessories</span>
                      <span className="font-medium text-slate-900">
                        {currentConfig.accessories.length} selected
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-900">Total Price</span>
                    <span className="text-2xl font-bold text-brand-green">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">per unit</p>
                </div>

                <Button className="w-full gap-2" size="lg" onClick={handleAddToQuote}>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Quote
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
