import React from 'react';

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-slate prose-invert max-w-none">
        <p className="text-sm text-slate-400 mb-6">
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Directory Application Notice</h2>
          <p className="text-slate-300">
            This is a community-driven directory application for n8n workflows. All workflows are sourced from public repositories under MIT license. 
            This application is provided for educational and community purposes only.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">1. Information We Collect</h2>
          <div className="text-slate-300 space-y-3">
            <p>This directory application may collect the following information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Usage analytics for understanding workflow discovery patterns</li>
              <li>Browser and device information for optimal display</li>
              <li>Search queries and filter preferences to improve user experience</li>
              <li>Download activity for popular workflow tracking</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">2. How We Use Your Information</h2>
          <div className="text-slate-300 space-y-3">
            <p>Information collected is used solely for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Improving the workflow discovery experience</li>
              <li>Understanding which workflows are most useful to the community</li>
              <li>Optimizing search and filtering functionality</li>
              <li>Analytics to understand usage patterns and improve the service</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">3. Data Storage and Security</h2>
          <div className="text-slate-300 space-y-3">
            <p>Your data is handled securely:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>No personal information is stored on our servers</li>
              <li>Analytics data is anonymized and aggregated</li>
              <li>Industry-standard encryption for data transmission</li>
              <li>Minimal data retention policies</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">4. Third-Party Services</h2>
          <div className="text-slate-300 space-y-3">
            <p>This directory application integrates with:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Netlify for hosting and deployment</li>
              <li>GitHub for workflow source management</li>
              <li>Basic web analytics services</li>
            </ul>
            <p>Each service has its own privacy policy and terms of service.</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">5. Workflow Content Disclaimer</h2>
          <div className="text-slate-300 space-y-3">
            <p>All workflows in this directory are:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Sourced from public repositories under MIT license</li>
              <li>Provided as-is without warranty</li>
              <li>Not guaranteed to be functional or secure</li>
              <li>Community-contributed content</li>
              <li>Should be reviewed before use in production environments</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">6. Your Rights</h2>
          <div className="text-slate-300 space-y-3">
            <p>As a user, you have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access information about data collection</li>
              <li>Opt out of analytics collection</li>
              <li>Request information about your data usage</li>
              <li>Understand how the directory operates</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">7. Contact Information</h2>
          <div className="text-slate-300 space-y-3">
            <p>For questions about this privacy policy or the directory application:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Visit: <a href="https://www.guyc.dev" className="text-brand-primary hover:text-brand-secondary">www.guyc.dev</a></li>
              <li>GitHub: <a href="https://github.com/guychenya/n8n-workflow-directory" className="text-brand-primary hover:text-brand-secondary">n8n-workflow-directory</a></li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">8. Changes to This Policy</h2>
          <div className="text-slate-300 space-y-3">
            <p>
              This privacy policy may be updated to reflect changes in the directory application or legal requirements. 
              Any changes will be posted on this page with an updated date.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};