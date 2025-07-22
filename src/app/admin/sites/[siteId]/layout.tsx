import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scissors, MessageSquare, Code, Settings } from 'lucide-react';

export default function SiteAdminLayout({ children }: { children: React.ReactNode }) {
  // Mock site data - replace with real data from params
  const siteName = "My Company Website";
  const siteId = "1"; // This would come from params

  const tabs = [
    { href: `/admin/sites/${siteId}/scrape`, label: 'Scrape Content', icon: Scissors },
    { href: `/admin/sites/${siteId}/faq`, label: 'FAQ & Q&A', icon: MessageSquare },
    { href: `/admin/sites/${siteId}/embed`, label: 'Embed Code', icon: Code },
    { href: `/admin/sites/${siteId}/settings`, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/admin" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold">{siteName}</h1>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-800 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <Link key={tab.href} href={tab.href}>
              <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-transparent border-b-2 border-transparent hover:border-white rounded-none px-0 py-2">
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}
