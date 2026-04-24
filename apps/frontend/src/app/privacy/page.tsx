import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the We Got Jobz privacy policy to understand how we collect, use, and protect your personal data. Learn about your privacy rights and data security measures.',
  keywords: [
    'privacy policy',
    'data protection',
    'personal data',
    'privacy rights',
    'data security',
    'we got jobz privacy',
    'freelance platform privacy'
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>
          Last updated: January 1, 2025
        </p>
        <p>
          Welcome to We Got Jobz. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
        </p>
        <h2 className="text-2xl font-bold mt-8">1. Information We Collect</h2>
        <p>
          We may collect, use, store and process different types of personal data about you, which we have grouped together as follows:
        </p>
        <ul className="list-disc pl-6">
          <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
          <li><strong>Contact Data:</strong> includes email address and telephone number.</li>
          <li><strong>Profile Data:</strong> includes your username, profile picture, bio, skills, portfolio, and other information you provide in your profile.</li>
          <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
          <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
          <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
        </ul>
        <h2 className="text-2xl font-bold mt-8">2. How We Use Your Information</h2>
        <p>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
        </p>
        <ul className="list-disc pl-6">
          <li>To provide and maintain our service</li>
          <li>To notify you about changes to our service</li>
          <li>To allow you to participate in interactive features of our service when you choose to do so</li>
          <li>To provide customer care and support</li>
          <li>To provide analysis or valuable information so that we can improve the service</li>
          <li>To monitor the usage of the service</li>
          <li>To detect, prevent and address technical issues</li>
        </ul>
        <h2 className="text-2xl font-bold mt-8">3. Data Security</h2>
        <p>
          We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
        </p>
        <h2 className="text-2xl font-bold mt-8">4. Your Legal Rights</h2>
        <p>
          Under certain circumstances, you have rights under data protection laws in relation to your personal data including the right to request access, correction or erasure of your personal data or to object to or restrict the processing of your personal data.
        </p>
        <h2 className="text-2xl font-bold mt-8">5. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@wegotjobz.com
        </p>
      </div>
    </div>
  );
}
