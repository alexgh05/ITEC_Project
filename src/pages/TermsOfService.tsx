import { useEffect } from 'react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  useEffect(() => {
    // Set page title
    document.title = "Terms of Service | CultureDrop";
    
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
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-8">
              Last updated: April 5, 2023
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              Welcome to CultureDrop. By accessing or using our website, mobile applications, and services, you agree to be bound by these Terms of Service ("Terms"). 
              If you do not agree to these Terms, please do not use our services.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of any material changes by updating the "Last Updated" date at the top of this page. 
              Your continued use of our services after such modifications will constitute your acknowledgment and acceptance of the modified Terms.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Account Registration</h2>
            <p>
              To access certain features of our services, you may be required to register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device. You agree to accept responsibility for all activities that occur under your account.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">4. User Conduct</h2>
            <p>When using our services, you agree not to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe the intellectual property rights of others</li>
              <li>Transmit any material that is harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or invasive of another's privacy</li>
              <li>Impersonate any person or entity or falsely state or misrepresent your affiliation with a person or entity</li>
              <li>Engage in any activity that interferes with or disrupts our services</li>
              <li>Attempt to gain unauthorized access to any portion of our services or any systems or networks connected to our services</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Purchasing Products</h2>
            <p>
              All product purchases are subject to availability. Prices for our products are subject to change without notice. We reserve the right to discontinue any products at any time.
            </p>
            <p>
              We do our best to display as accurately as possible the colors and images of our products. We cannot guarantee that your computer monitor's display of any color will be accurate.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Payment and Billing</h2>
            <p>
              By providing a credit card or other payment method accepted by us, you represent and warrant that you are authorized to use the designated payment method and authorize us to charge your payment method for the total amount of your purchase (including any applicable taxes and other charges).
            </p>
            <p>
              If the payment method you provide cannot be verified, is invalid, or is otherwise not acceptable, your order may be suspended or cancelled. You must resolve any payment method problems to proceed with your order.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Shipping and Delivery</h2>
            <p>
              Delivery times are estimates only and cannot be guaranteed. We are not liable for any delays in shipments. Risk of loss and title for items purchased from our website pass to you upon delivery of the items to the carrier.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">8. Returns and Refunds</h2>
            <p>
              We accept returns within 30 days of purchase. Products must be in their original condition, unworn/unused with all original tags and packaging. Certain items are non-returnable for hygiene reasons.
            </p>
            <p>
              Refunds will be processed to the original method of payment. Processing times for refunds may vary depending on your payment method.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">9. Intellectual Property</h2>
            <p>
              All content included on our website, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of CultureDrop or its content suppliers and protected by international copyright laws.
            </p>
            <p>
              Our name, logo, and related marks are trademarks of CultureDrop and may not be used in connection with any product or service without our prior written consent.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">10. Limitation of Liability</h2>
            <p>
              IN NO EVENT SHALL CULTUREDROP, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS, BE LIABLE TO YOU FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES WHATSOEVER RESULTING FROM ANY (I) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT, (II) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF OUR SERVICES, (III) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (IV) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM OUR SERVICES, (IV) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE, WHICH MAY BE TRANSMITTED TO OR THROUGH OUR SERVICES BY ANY THIRD PARTY, AND/OR (V) ANY ERRORS OR OMISSIONS IN ANY CONTENT OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF YOUR USE OF ANY CONTENT POSTED, EMAILED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES, WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT THE COMPANY IS ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">11. Dispute Resolution</h2>
            <p>
              Any dispute arising from or relating to these Terms or our services will be resolved through binding arbitration in accordance with the applicable commercial arbitration rules. Any such dispute shall be arbitrated on an individual basis and shall not be consolidated with any other arbitration or proceeding involving a third party.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">13. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> legal@culturedrop.com<br />
              <strong>Address:</strong> CultureDrop Inc., 123 Fashion Street, New York, NY 10001
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TermsOfService; 