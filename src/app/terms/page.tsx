import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle } from 'lucide-react';

export default function TermsPage() {
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
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
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
                <Scale className="mr-2 h-5 w-5 text-white/60" />
                Agreement to Terms
              </h2>
              <p className="text-white/80 leading-relaxed">
                By accessing and using Dot's AI chatbot service, you agree to be bound by these Terms of Service. 
                If you disagree with any part of these terms, you may not access our service.
              </p>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Service Description</h2>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <p className="text-white/80 mb-4">
                  Dot provides an AI-powered chatbot service that can be embedded on your website to:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-white/60 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Answer customer questions automatically</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-white/60 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Learn from your website content</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-white/60 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Provide 24/7 customer support</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-white/60 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Generate analytics and insights</span>
                  </div>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">User Responsibilities</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Account Security</h3>
                  <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                    <li>Keep your account credentials secure</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>You are responsible for all activities under your account</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Content Guidelines</h3>
                  <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                    <li>Ensure your website content complies with applicable laws</li>
                    <li>Do not use our service for illegal or harmful purposes</li>
                    <li>Respect intellectual property rights</li>
                    <li>Maintain appropriate content for your audience</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Service Usage</h3>
                  <ul className="list-disc list-inside text-white/80 space-y-1 ml-4">
                    <li>Use the service in accordance with these terms</li>
                    <li>Do not attempt to reverse engineer or hack our systems</li>
                    <li>Respect rate limits and fair usage policies</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Prohibited Uses */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-white/60" />
                Prohibited Uses
              </h2>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <p className="text-white/80 mb-4">You may not use our service to:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-white/80 text-sm">Generate harmful or malicious content</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-white/80 text-sm">Violate privacy or data protection laws</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-white/80 text-sm">Impersonate others or misrepresent yourself</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-white/80 text-sm">Distribute spam or unsolicited content</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-white/80 text-sm">Interfere with service operation</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-white/80 text-sm">Use for illegal activities</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Intellectual Property</h2>
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Our Rights</h4>
                  <p className="text-sm text-white/60">
                    Dot retains all rights to our service, including but not limited to our AI models, 
                    software, trademarks, and proprietary technology.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Your Content</h4>
                  <p className="text-sm text-white/60">
                    You retain ownership of your website content. By using our service, you grant us 
                    a license to process your content for providing the chatbot functionality.
                  </p>
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Payment Terms</h2>
              <div className="space-y-4">
                <p className="text-white/80">
                  Our service offers both free and paid plans. Payment terms vary by plan:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Free Plan</h4>
                    <ul className="text-sm text-white/60 space-y-1">
                      <li>• Basic chatbot functionality</li>
                      <li>• Limited conversations per month</li>
                      <li>• Standard support</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Paid Plans</h4>
                    <ul className="text-sm text-white/60 space-y-1">
                      <li>• Advanced features and analytics</li>
                      <li>• Higher conversation limits</li>
                      <li>• Priority support</li>
                      <li>• Custom integrations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <p className="text-white/80 mb-4">
                  To the maximum extent permitted by law, Dot shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages, including but not limited to:
                </p>
                <div className="space-y-2 text-white/60">
                  <div className="flex items-start">
                    <span className="w-1 h-1 bg-white/40 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Loss of profits, data, or business opportunities</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-1 h-1 bg-white/40 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Service interruptions or technical issues</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-1 h-1 bg-white/40 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Inaccurate or inappropriate AI responses</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-1 h-1 bg-white/40 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Third-party service disruptions</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Termination</h2>
              <div className="space-y-4">
                <p className="text-white/80">
                  Either party may terminate this agreement at any time:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">By You</h4>
                    <p className="text-sm text-white/60">
                      You may cancel your account at any time through your dashboard or by contacting support.
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">By Us</h4>
                    <p className="text-sm text-white/60">
                      We may terminate accounts that violate these terms or for non-payment of fees.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to Terms</h2>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <p className="text-white/80 mb-4">
                  We reserve the right to modify these terms at any time. We will notify you of significant changes by:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-white/80">Email notification to registered users</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-white/80">Posting updated terms on our website</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-white/80">In-app notifications</span>
                  </div>
                </div>
                <p className="text-white/60 mt-4 text-sm">
                  Continued use of our service after changes constitutes acceptance of the updated terms.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <p className="text-white/80 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
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
