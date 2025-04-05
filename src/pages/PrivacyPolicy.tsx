import { useEffect } from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  useEffect(() => {
    // Set page title
    document.title = "Privacy Policy | CultureDrop";
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-8">
              Last updated: April 5, 2023
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to CultureDrop. We are committed to protecting your personal information and your right to privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              and use our services.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Information We Collect</h2>
            <p>We collect information that you provide directly to us when you:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Create an account or user profile</li>
              <li>Make a purchase</li>
              <li>Sign up for our newsletter</li>
              <li>Contact our customer service</li>
              <li>Participate in surveys, contests, or promotions</li>
            </ul>
            <p>This information may include:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your name, email address, shipping address, and phone number</li>
              <li>Payment information (processed securely through our payment processors)</li>
              <li>Your preferences and interests related to our products</li>
              <li>Communication history with our team</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We may use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Process your orders and transactions</li>
              <li>Manage your account and provide customer support</li>
              <li>Send you order confirmations, updates, and marketing communications</li>
              <li>Personalize your shopping experience</li>
              <li>Improve our website, products, and services</li>
              <li>Protect against fraud and unauthorized transactions</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and store certain information. 
              These technologies help us understand user behavior, remember your preferences, and provide personalized experiences.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, 
              some features of our website may not function properly without cookies.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Service providers who help us operate our business</li>
              <li>Payment processors to complete transactions</li>
              <li>Shipping partners to deliver your orders</li>
              <li>Marketing partners (with your consent)</li>
              <li>Legal authorities when required by law</li>
            </ul>
            <p>
              We do not sell your personal information to third parties.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access, 
              alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic 
              storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access the personal information we have about you</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to our processing of your information</li>
              <li>Withdraw consent for future processing</li>
              <li>Request a copy of your information in a structured, machine-readable format</li>
            </ul>
            <p>
              To exercise these rights, please contact us at privacy@culturedrop.com.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">8. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, 
              legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page 
              and updating the "Last updated" date.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">9. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> privacy@culturedrop.com<br />
              <strong>Address:</strong> CultureDrop Inc., 123 Fashion Street, New York, NY 10001
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PrivacyPolicy; 