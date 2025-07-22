import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Edit, Save, RefreshCw } from 'lucide-react';

export default function ScrapePage() {
  // Mock scraped content - replace with real data
  const scrapedContent = [
    {
      id: '1',
      type: 'page',
      url: 'https://mycompany.com',
      title: 'Homepage',
      content: 'Welcome to My Company. We provide innovative solutions for businesses...',
      status: 'scraped',
      wordCount: 245
    },
    {
      id: '2',
      type: 'page',
      url: 'https://mycompany.com/about',
      title: 'About Us',
      content: 'Founded in 2020, My Company has been at the forefront of...',
      status: 'scraped',
      wordCount: 189
    },
    {
      id: '3',
      type: 'page',
      url: 'https://mycompany.com/services',
      title: 'Our Services',
      content: 'We offer a comprehensive range of services including...',
      status: 'processing',
      wordCount: 0
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Scraped Content</h2>
          <p className="text-gray-400">Review and edit the content that will train your chatbot</p>
        </div>
        <Button className="bg-white text-black hover:bg-gray-100">
          <RefreshCw className="mr-2 h-4 w-4" />
          Re-scrape Site
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pages Scraped</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Words</p>
                <p className="text-2xl font-bold">434</p>
              </div>
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">W</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p className="text-2xl font-bold text-white">Ready</p>
              </div>
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {scrapedContent.map((item) => (
          <Card key={item.id} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold">P</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="text-gray-400">{item.url}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={item.status === 'scraped' ? 'default' : 'secondary'} className="bg-white text-black">
                    {item.status === 'scraped' ? 'Scraped' : 'Processing'}
                  </Badge>
                  <span className="text-sm text-gray-400">{item.wordCount} words</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  value={item.content}
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                  placeholder="Content will appear here..."
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                    <Save className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-800">
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
          Skip for Now
        </Button>
        <Button className="bg-white text-black hover:bg-gray-100">
          Accept All & Continue
        </Button>
      </div>
    </div>
  );
}
