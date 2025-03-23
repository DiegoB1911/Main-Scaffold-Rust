"use client"

import { useState } from "react"
import { ChevronDown, Code, Copy, Eye, Save, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface TemplateCustomizationProps {
  templateId: string
}

export function TemplateCustomization({ templateId }: TemplateCustomizationProps) {
  const [primaryColor, setPrimaryColor] = useState("#0070f3")
  const [appName, setAppName] = useState(
    templateId === "marketplace" ? "NFT Marketplace" : templateId === "dao" ? "DAO Governance" : "Web3 App",
  )
  const [networkType, setNetworkType] = useState("testnet")
  const [features, setFeatures] = useState({
    darkMode: true,
    analytics: true,
    notifications: true,
    socialSharing: false,
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Template Customization
          </CardTitle>
          <CardDescription>Customize your application before downloading or deploying</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="app-name">Application Name</Label>
                  <Input
                    id="app-name"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="Enter your application name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="network-type">Network Type</Label>
                  <Select value={networkType} onValueChange={setNetworkType}>
                    <SelectTrigger id="network-type">
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="testnet">Testnet</SelectItem>
                      <SelectItem value="mainnet">Mainnet</SelectItem>
                      <SelectItem value="local">Local Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Application Description</Label>
                  <Input id="description" placeholder="Enter a short description of your application" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="primary-color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded border p-1"
                    />
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-32" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input type="radio" id="theme-light" name="theme" defaultChecked />
                      <Label htmlFor="theme-light">Light</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="radio" id="theme-dark" name="theme" />
                      <Label htmlFor="theme-dark">Dark</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="radio" id="theme-system" name="theme" />
                      <Label htmlFor="theme-system">System</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Slider defaultValue={[16]} max={24} min={12} step={1} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode Support</Label>
                    <p className="text-sm text-muted-foreground">Enable dark mode toggle for your application</p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={features.darkMode}
                    onCheckedChange={(checked) => setFeatures({ ...features, darkMode: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics">Analytics</Label>
                    <p className="text-sm text-muted-foreground">Include analytics tracking for user interactions</p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={features.analytics}
                    onCheckedChange={(checked) => setFeatures({ ...features, analytics: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-sm text-muted-foreground">Enable in-app notifications for transactions</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={features.notifications}
                    onCheckedChange={(checked) => setFeatures({ ...features, notifications: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="social-sharing">Social Sharing</Label>
                    <p className="text-sm text-muted-foreground">Add social media sharing capabilities</p>
                  </div>
                  <Switch
                    id="social-sharing"
                    checked={features.socialSharing}
                    onCheckedChange={(checked) => setFeatures({ ...features, socialSharing: checked })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <span className="font-medium">Smart Contract Configuration</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <Card>
                    <CardContent className="pt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="contract-fee">Transaction Fee (XLM)</Label>
                        <Input id="contract-fee" type="number" defaultValue="0.00001" step="0.00001" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contract-timeout">Transaction Timeout (seconds)</Label>
                        <Input id="contract-timeout" type="number" defaultValue="30" />
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="font-medium">API Configuration</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <Card>
                    <CardContent className="pt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="api-endpoint">Horizon API Endpoint</Label>
                        <Input
                          id="api-endpoint"
                          defaultValue={
                            networkType === "testnet"
                              ? "https://horizon-testnet.stellar.org"
                              : "https://horizon.stellar.org"
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="api-rate-limit">Rate Limit (requests per minute)</Label>
                        <Input id="api-rate-limit" type="number" defaultValue="60" />
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" className="gap-2">
          <Eye className="h-4 w-4" />
          Preview Changes
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Copy className="h-4 w-4" />
            Export Configuration
          </Button>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

