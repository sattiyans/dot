import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Eye, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-4 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="ghost" className="mb-6 text-white/60 hover:text-white hover:bg-white/10">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-white/60">Last updated: 22/07/2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Eye className="mr-2 h-5 w-5 text-white/60" />
                Introduction
              </h2>
              <p className="text-white/80 leading-relaxed">
                At Dot, we respect your privacy and are committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when 
                you use our AI chatbot service.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Lock className="mr-2 h-5 w-5 text-white/60" />
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                    <li>Email address (for authentication and communication)</li>
                    <li>Name and company information (optional, for account setup)</li>
                    <li>Website URLs where you embed our chatbot</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Usage Data</h3>
                  <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                    <li>Chat conversations and interactions</li>
                    <li>Website content for AI training</li>
                    <li>Analytics and performance metrics</li>
                    <li>Technical information (IP address, browser type, device info)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Provide and maintain our AI chatbot service</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Improve AI responses and service quality</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Send important updates and notifications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Analyze usage patterns and optimize performance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Provide customer support and technical assistance</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your data:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Encryption</h4>
                  <p className="text-sm text-white/60">All data is encrypted in transit and at rest</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Access Control</h4>
                  <p className="text-sm text-white/60">Strict access controls and authentication</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Regular Audits</h4>
                  <p className="text-sm text-white/60">Security audits and vulnerability assessments</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Data Backup</h4>
                  <p className="text-sm text-white/60">Secure backup and disaster recovery</p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                You have the right to:
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white/80">Access your personal data</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white/80">Correct inaccurate information</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white/80">Request deletion of your data</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white/80">Export your data</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white/80">Opt-out of marketing communications</span>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <p className="text-white/80 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, 
                  please contact us:
                </p>
                <div className="space-y-2 text-white/60">
                  <p>Email: support@d0t.my</p>
                  <p className="font-medium text-white/80">Additional Details:</p>
                  <p>Dotkod Solutions (MA0307809-V)</p>
                  <p>+60 11-5405 1276</p>
                  <p>sattiyan@dotkod.com</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
