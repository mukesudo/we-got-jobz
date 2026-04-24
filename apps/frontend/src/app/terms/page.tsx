import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the We Got Jobz terms of service to understand your rights and responsibilities when using our freelance marketplace platform.',
  keywords: [
    'terms of service',
    'terms and conditions',
    'user agreement',
    'legal terms',
    'we got jobz terms',
    'freelance platform terms',
    'service agreement'
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfService() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>
          Last updated: January 1, 2025
        </p>
        <p>
          Welcome to We Got Jobz. By using our website and services, you agree to comply with and be bound by the following terms and conditions of use.
        </p>
        <h2 className="text-2xl font-bold mt-8">1. Acceptance of Terms</h2>
        <p>
          By accessing and using We Got Jobz, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use our service.
        </p>
        <h2 className="text-2xl font-bold mt-8">2. User Accounts</h2>
        <p>
          To access certain features of our service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
        </p>
        <h2 className="text-2xl font-bold mt-8">3. User Responsibilities</h2>
        <p>
          Users agree to use the service only for lawful purposes and in accordance with these Terms. Users agree not to:
        </p>
        <ul className="list-disc pl-6">
          <li>Use the service for any fraudulent or unlawful purpose</li>
          <li>Violate any international, federal, provincial or local regulations</li>
          <li>Infringe upon our intellectual property or that of third parties</li>
          <li>Submit false or misleading information</li>
          <li>Harass, abuse, or harm other users</li>
          <li>Transmit viruses or other malicious code</li>
        </ul>
        <h2 className="text-2xl font-bold mt-8">4. Payment Terms</h2>
        <p>
          All payments are processed through our secure escrow system. Funds are held until milestones are approved by both parties. Service fees apply to all transactions and are outlined in our fee schedule.
        </p>
        <h2 className="text-2xl font-bold mt-8">5. Intellectual Property</h2>
        <p>
          All content on We Got Jobz, including text, graphics, logos, and software, is the property of We Got Jobz or its content suppliers and is protected by intellectual property laws.
        </p>
        <h2 className="text-2xl font-bold mt-8">6. Limitation of Liability</h2>
        <p>
          We Got Jobz shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.
        </p>
        <h2 className="text-2xl font-bold mt-8">7. Termination</h2>
        <p>
          We reserve the right to terminate or suspend your account at any time for violation of these Terms or for any other reason at our sole discretion.
        </p>
        <h2 className="text-2xl font-bold mt-8">8. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which We Got Jobz is registered, without regard to its conflict of law provisions.
        </p>
        <h2 className="text-2xl font-bold mt-8">9. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at legal@wegotjobz.com
        </p>
      </div>
    </div>
  );
}
