import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Globe, Sparkles } from 'lucide-react';

export default function AddSitePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/admin" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Add New Site</h1>
        <p className="text-gray-400 mt-2">Add your website to start using Dot chatbot</p>
      </div>

      <div className="max-w-2xl">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Site Information
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your website details to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="siteName" className="text-white">Site Name</Label>
              <Input
                id="siteName"
                placeholder="My Company Website"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain" className="text-white">Website URL</Label>
              <Input
                id="domain"
                type="url"
                placeholder="https://example.com"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <p className="text-sm text-gray-400">
                Enter the full URL including https://
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your website..."
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                rows={3}
              />
            </div>

            <div className="pt-4 border-t border-gray-800">
              <div className="flex items-center mb-4">
                <Sparkles className="mr-2 h-5 w-5" />
                <h3 className="font-semibold">Content Scraping</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Dot will automatically scrape your website to learn about your content and create intelligent responses.
              </p>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-scrape homepage</p>
                    <p className="text-sm text-gray-400">Extract content from your main page</p>
                  </div>
                  <div className="w-12 h-6 bg-white rounded-full relative">
                    <div className="w-4 h-4 bg-black rounded-full absolute top-1 right-1"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Link href="/admin">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  Cancel
                </Button>
              </Link>
              <Button className="bg-white text-black hover:bg-gray-100">
                Add Site & Start Scraping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
