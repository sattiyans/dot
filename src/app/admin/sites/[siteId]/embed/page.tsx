import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Code, Eye, Settings } from 'lucide-react';
import ChatbotWidget from '@/components/ChatbotWidget';

export default function EmbedPage() {
  // Mock site data - replace with real data
  const siteId = "abc123";
  const siteName = "My Company Website";
  const siteDomain = "mycompany.com";

  const embedCode = `<script src="https://cdn.d0t.my/dot.js" defer></script>
<script>
  window.DOT_CHATBOT = {
    siteId: '${siteId}',
    welcomeMessage: "Ask me anything about us",
    theme: "dark"
  };
</script>`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Embed Chatbot</h2>
          <p className="text-gray-400">Copy the code below and paste it into your website</p>
        </div>
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
          <Settings className="mr-2 h-4 w-4" />
          Customize Widget
        </Button>
      </div>

      {/* Embed Code Section */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="mr-2 h-5 w-5" />
            Embed Code
          </CardTitle>
          <CardDescription className="text-gray-400">
            Add this code to your website's &lt;head&gt; section or before the closing &lt;/body&gt; tag
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
              <code>{embedCode}</code>
            </pre>
            <Button
              onClick={handleCopyCode}
              size="sm"
              className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Code
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Badge variant="outline" className="border-white text-white">
              Ready to Embed
            </Badge>
            <span>• Site ID: {siteId}</span>
            <span>• Domain: {siteDomain}</span>
          </div>
        </CardContent>
      </Card>

      {/* Widget Preview */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5" />
            Widget Preview
          </CardTitle>
          <CardDescription className="text-gray-400">
            This is how your chatbot will appear on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-96 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            {/* Mock website content */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">{siteName}</h3>
              <p className="text-gray-400 mb-4">This is a preview of how your website might look with the Dot chatbot.</p>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
            
            {/* Chatbot Widget */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <ChatbotWidget />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Installation Instructions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">📋 Installation Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                <span>Copy the embed code above</span>
              </li>
              <li className="flex items-start">
                <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                <span>Paste it into your website&apos;s HTML</span>
              </li>
              <li className="flex items-start">
                <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                <span>Save and publish your website</span>
              </li>
              <li className="flex items-start">
                <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                <span>Your chatbot will appear automatically</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">⚙️ Customization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-gray-300">
              <div>
                <p className="font-medium">Welcome Message</p>
                <p className="text-sm text-gray-400">Customize the initial greeting</p>
              </div>
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-gray-400">Choose between light and dark themes</p>
              </div>
              <div>
                <p className="font-medium">Position</p>
                <p className="text-sm text-gray-400">Adjust widget placement on your site</p>
              </div>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800 mt-2">
                <Settings className="mr-2 h-4 w-4" />
                Configure Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Troubleshooting */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg">🔧 Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-gray-300">
            <div>
              <p className="font-medium">Widget not appearing?</p>
              <p className="text-sm text-gray-400">Make sure the code is placed before the closing &lt;/body&gt; tag</p>
            </div>
            <div>
              <p className="font-medium">Not responding to questions?</p>
              <p className="text-sm text-gray-400">Check that your site content has been scraped and Q&As are added</p>
            </div>
            <div>
              <p className="font-medium">Need help?</p>
              <p className="text-sm text-gray-400">Contact our support team or check our documentation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
