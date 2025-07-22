import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, BookOpen, MessageSquare, Settings, Zap } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-800">
        <Link href="/" className="text-2xl font-bold">
          Dot
        </Link>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/register">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about setting up and using Dot chatbot on your website
          </p>
        </div>

        {/* Quick Start */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Zap className="mr-2 h-6 w-6" />
              Quick Start Guide
            </CardTitle>
            <CardDescription className="text-gray-400">
              Get your chatbot up and running in 5 minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Step 1: Create Account</h3>
                <p className="text-gray-300">Sign up for a free Dot account and verify your email</p>
                <Link href="/register">
                  <Button className="bg-white text-black hover:bg-gray-100">
                    Sign Up Now
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Step 2: Add Your Website</h3>
                <p className="text-gray-300">Enter your website URL and let Dot scrape your content</p>
                <div className="bg-gray-800 rounded-lg p-3">
                  <code className="text-sm text-gray-300">https://yourwebsite.com</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Learn the basics of setting up your first chatbot</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Account setup and verification</li>
                <li>• Adding your first website</li>
                <li>• Content scraping process</li>
                <li>• Embedding the widget</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Customize your chatbot's appearance and behavior</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Theme and styling options</li>
                <li>• Welcome message setup</li>
                <li>• Position and placement</li>
                <li>• Domain restrictions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                FAQ Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Add custom Q&A pairs to enhance responses</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Creating Q&A pairs</li>
                <li>• Categorizing questions</li>
                <li>• Editing and deleting</li>
                <li>• Best practices</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="mr-2 h-5 w-5" />
                API Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Integrate Dot with your own applications</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Chat API endpoints</li>
                <li>• Authentication</li>
                <li>• Webhook integration</li>
                <li>• Rate limits</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Advanced Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Unlock advanced chatbot capabilities</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Custom training data</li>
                <li>• Multi-language support</li>
                <li>• Analytics and insights</li>
                <li>• Team collaboration</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Troubleshooting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Common issues and their solutions</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Widget not appearing</li>
                <li>• Chat not responding</li>
                <li>• Content scraping issues</li>
                <li>• Performance optimization</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Code Examples */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Basic Integration</CardTitle>
            <CardDescription className="text-gray-400">
              The simplest way to add Dot to your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-800 rounded-lg p-4">
              <pre className="text-sm text-gray-300 overflow-x-auto">
                <code>{`<!-- Add this to your HTML -->
<script src="https://cdn.d0t.my/dot.js" defer></script>
<script>
  window.DOT_CHATBOT = {
    siteId: 'your-site-id',
    welcomeMessage: "Hi! How can I help you today?",
    theme: "dark"
  };
</script>`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl">Need Help?</CardTitle>
            <CardDescription className="text-gray-400">
              Can't find what you're looking for? We're here to help
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-gray-400 text-sm mb-2">Get help from our support team</p>
                <a href="mailto:support@d0t.my" className="text-white hover:text-gray-300">
                  support@d0t.my
                </a>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-gray-400 text-sm mb-2">Join our community forum</p>
                <a href="#" className="text-white hover:text-gray-300">
                  community.d0t.my
                </a>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Status Page</h3>
                <p className="text-gray-400 text-sm mb-2">Check system status</p>
                <a href="#" className="text-white hover:text-gray-300">
                  status.d0t.my
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
