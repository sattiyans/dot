import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageSquare, Edit, Trash2, Save, X } from 'lucide-react';

export default function FAQPage() {
  // Mock FAQ data - replace with real data
  const faqs = [
    {
      id: '1',
      question: 'What are your business hours?',
      answer: 'We are open Monday to Friday, 9 AM to 6 PM EST.',
      category: 'General'
    },
    {
      id: '2',
      question: 'How can I contact support?',
      answer: 'You can reach our support team at support@mycompany.com or call us at 1-800-123-4567.',
      category: 'Support'
    },
    {
      id: '3',
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee on all our products and services.',
      category: 'Billing'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">FAQ & Manual Q&A</h2>
          <p className="text-gray-400">Add custom questions and answers to enhance your chatbot's knowledge</p>
        </div>
        <Button className="bg-white text-black hover:bg-gray-100">
          <Plus className="mr-2 h-4 w-4" />
          Add New Q&A
        </Button>
      </div>

      {/* Add New FAQ Form */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Add New Q&A Pair
          </CardTitle>
          <CardDescription className="text-gray-400">
            Add a custom question and answer to help your chatbot respond better
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-white">Category</Label>
              <Input
                id="category"
                placeholder="e.g., Support, Billing, General"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="question" className="text-white">Question</Label>
              <Input
                id="question"
                placeholder="What is your question?"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer" className="text-white">Answer</Label>
            <Textarea
              id="answer"
              placeholder="Provide a detailed answer..."
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[100px]"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Cancel
            </Button>
            <Button className="bg-white text-black hover:bg-gray-100">
              <Save className="mr-2 h-4 w-4" />
              Save Q&A
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing FAQs */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Existing Q&A Pairs ({faqs.length})</h3>
        
        {faqs.map((faq) => (
          <Card key={faq.id} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {faq.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}

        {faqs.length === 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Q&A pairs yet</h3>
              <p className="text-gray-400 mb-4">Add your first custom question and answer to enhance your chatbot</p>
              <Button className="bg-white text-black hover:bg-gray-100">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Q&A
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tips Section */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg">💡 Tips for Better Q&A</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-gray-300">
            <li>• Keep answers concise but informative</li>
            <li>• Use categories to organize your Q&As</li>
            <li>• Include common customer questions</li>
            <li>• Update Q&As regularly based on customer feedback</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
