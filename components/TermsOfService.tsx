import React from 'react';

export const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">Terms of Service</h1>
      
      <div className="prose prose-slate prose-invert max-w-none">
        <p className="text-sm text-slate-400 mb-6">
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Important: Community Directory</h2>
          <p className="text-slate-300">
            This is a community-driven directory application for n8n workflows. By using this application, you acknowledge that 
            all workflows are sourced from public repositories under MIT license and agree to the terms outlined below.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">1. Acceptance of Terms</h2>
          <div className="text-slate-300 space-y-3">
            <p>
              By accessing or using the n8n Workflow Directory ("Directory"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use this Directory.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">2. Directory Purpose</h2>
          <div className="text-slate-300 space-y-3">
            <p>This application is provided for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Discovering and browsing n8n workflows from the community</li>
              <li>Educational and learning purposes</li>
              <li>Community resource sharing</li>
              <li>Workflow development inspiration</li>
            </ul>
            <p className="font-semibold text-slate-200">
              This is a community directory and should be used responsibly for its intended purpose.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">3. Workflow Content Disclaimer</h2>
          <div className="text-slate-300 space-y-3">
            <p className="font-semibold text-slate-200">ALL WORKFLOWS ARE PROVIDED "AS IS" FROM PUBLIC REPOSITORIES.</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Workflows are sourced from public repositories under MIT license</li>
              <li>Content is community-contributed and not verified by us</li>
              <li>Workflows may not be functional, secure, or suitable for your use case</li>
              <li>You should review and test all workflows before use</li>
              <li>Use in production environments is at your own risk</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">4. Limitation of Liability</h2>
          <div className="text-slate-300 space-y-3">
            <p className="font-semibold text-slate-200">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>This Directory is provided "AS IS" without warranties of any kind</li>
              <li>Guy Chenya shall not be liable for any direct, indirect, incidental, or consequential damages</li>
              <li>No liability for any issues arising from downloaded or used workflows</li>
              <li>No responsibility for data loss, security breaches, or system failures</li>
              <li>No liability for workflow functionality or suitability</li>
              <li>Maximum liability, if any, shall not exceed $0 (zero dollars)</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">5. No Warranty</h2>
          <div className="text-slate-300 space-y-3">
            <p>This Directory is provided without any express or implied warranties, including but not limited to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Merchantability or fitness for a particular purpose</li>
              <li>Accuracy, reliability, or completeness of workflow information</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Security or data protection guarantees</li>
              <li>Workflow functionality or compatibility</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">6. User Responsibilities</h2>
          <div className="text-slate-300 space-y-3">
            <p>By using this Directory, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the application responsibly and for its intended purpose</li>
              <li>Review and test all workflows before implementation</li>
              <li>Understand that workflows come with no guarantee of functionality</li>
              <li>Respect the MIT license terms of the original workflow creators</li>
              <li>Not attempt to exploit or misuse the directory features</li>
              <li>Take full responsibility for any workflows you download or use</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">7. Third-Party Services and Content</h2>
          <div className="text-slate-300 space-y-3">
            <p>
              This Directory integrates with third-party services (Netlify, GitHub) and displays content from public repositories. 
              Your use of these services is subject to their respective terms of service and privacy policies. 
              Guy Chenya is not responsible for the performance, policies, or content of these third-party services.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">8. Intellectual Property</h2>
          <div className="text-slate-300 space-y-3">
            <p>
              The Directory code and design are the intellectual property of Guy Chenya. All workflows are the intellectual 
              property of their respective creators and are provided under MIT license. The Directory simply aggregates and 
              displays publicly available content.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">9. MIT License Compliance</h2>
          <div className="text-slate-300 space-y-3">
            <p>All workflows in this directory are sourced from public repositories under MIT license, which means:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You may use, modify, and distribute the workflows</li>
              <li>You must include the original copyright notice and license</li>
              <li>The software is provided "as is" without warranty</li>
              <li>The original authors are not liable for any damages</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">10. Termination</h2>
          <div className="text-slate-300 space-y-3">
            <p>
              Access to this Directory may be terminated at any time without notice. These terms shall survive any 
              termination of your access to the application.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">11. Governing Law</h2>
          <div className="text-slate-300 space-y-3">
            <p>
              These terms shall be governed by and construed in accordance with applicable law. Any disputes shall be 
              resolved through binding arbitration or small claims court.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">12. Changes to Terms</h2>
          <div className="text-slate-300 space-y-3">
            <p>
              These terms may be updated at any time without notice. Your continued use of the Directory after any 
              changes constitutes acceptance of the new terms.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">13. Contact Information</h2>
          <div className="text-slate-300 space-y-3">
            <p>For questions about these terms or the Directory:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Visit: <a href="https://www.guyc.dev" className="text-brand-primary hover:text-brand-secondary">www.guyc.dev</a></li>
              <li>GitHub: <a href="https://github.com/guychenya/n8n-workflow-directory" className="text-brand-primary hover:text-brand-secondary">n8n-workflow-directory</a></li>
            </ul>
          </div>
        </section>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mt-8">
          <p className="text-slate-300 font-semibold">
            <strong>Final Notice:</strong> By using this n8n Workflow Directory, you acknowledge that you have read, 
            understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};