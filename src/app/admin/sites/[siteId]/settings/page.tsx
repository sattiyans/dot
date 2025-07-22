import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Settings, Palette, MessageSquare, Globe, Save, Eye } from 'lucide-react';

export default function SettingsPage() {
  // Mock settings data - replace with real data
  const settings = {
    siteName: "My Company Website",
    domain: "mycompany.com",
    welcomeMessage: "Hi! I'm here to help. Ask me anything about our company, products, or services.",
    theme: "dark",
    position: "bottom-center",
    enabled: true,
    allowFileUploads: false,
    maxMessages: 50
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Chatbot Settings</h2>
          <p className="text-gray-400">Customize your chatbot's appearance and behavior</p>
        </div>
        <Button className="bg-white text-black hover:bg-gray-100">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Basic Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Basic Settings
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure your site information and chatbot status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName" className="text-white">Site Name</Label>
              <Input
                id="siteName"
                defaultValue={settings.siteName}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain" className="text-white">Domain</Label>
              <Input
                id="domain"
                defaultValue={settings.domain}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="enabled" className="text-white">Enable Chatbot</Label>
              <p className="text-sm text-gray-400">Turn the chatbot on or off</p>
            </div>
            <Switch id="enabled" defaultChecked={settings.enabled} />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="mr-2 h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription className="text-gray-400">
            Customize how your chatbot looks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme" className="text-white">Theme</Label>
              <select
                id="theme"
                defaultValue={settings.theme}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto (follows website)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position" className="text-white">Position</Label>
              <select
                id="position"
                defaultValue={settings.position}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
              >
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage" className="text-white">Welcome Message</Label>
            <Textarea
              id="welcomeMessage"
              defaultValue={settings.welcomeMessage}
              className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
              placeholder="Enter a welcome message for your chatbot..."
            />
            <p className="text-sm text-gray-400">
              This message will be shown when users first open the chat
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Behavior Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Behavior
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure how your chatbot behaves
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxMessages" className="text-white">Max Messages</Label>
              <Input
                id="maxMessages"
                type="number"
                defaultValue={settings.maxMessages}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-sm text-gray-400">Maximum messages to keep in chat history</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="autoOpen" className="text-white">Auto-open Delay</Label>
              <Input
                id="autoOpen"
                type="number"
                placeholder="30"
                className="bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-sm text-gray-400">Seconds before auto-opening (0 = disabled)</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="allowFileUploads" className="text-white">Allow File Uploads</Label>
              <p className="text-sm text-gray-400">Let users upload files in chat</p>
            </div>
            <Switch id="allowFileUploads" defaultChecked={settings.allowFileUploads} />
          </div>
        </CardContent>
      </Card>

      {/* Domain Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5" />
            Domain Settings
          </CardTitle>
          <CardDescription className="text-gray-400">
            Control where your chatbot can be used
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="allowedDomains" className="text-white">Allowed Domains</Label>
            <Textarea
              id="allowedDomains"
              defaultValue={settings.domain}
              className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
              placeholder="Enter domains (one per line) where the chatbot is allowed to run"
            />
            <p className="text-sm text-gray-400">
              Leave empty to allow on any domain. One domain per line.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-white text-white">
              Active
            </Badge>
            <span className="text-sm text-gray-400">Domain verification is enabled</span>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5" />
            Live Preview
          </CardTitle>
          <CardDescription className="text-gray-400">
            See how your chatbot will look with current settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-64 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Preview</h3>
              <p className="text-gray-400 text-sm">Your chatbot will appear here with the current settings</p>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="w-12 h-12 bg-white text-black rounded-full shadow-lg flex items-center justify-center cursor-pointer">
                <span className="text-2xl font-bold">•</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-800">
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
          Reset to Defaults
        </Button>
        <Button className="bg-white text-black hover:bg-gray-100">
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
