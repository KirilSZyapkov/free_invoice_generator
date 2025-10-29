import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const Help: React.FC = () => {
  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Help & Documentation
        </h1>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                About Free Invoice Generator
              </h2>
              <p className="text-muted-foreground">
                Free Invoice Generator is a simple, yet powerful tool designed to help freelancers, small businesses,
                and professionals create professional invoices quickly and easily. Our application is completely free
                and runs entirely in your browser, ensuring your data remains private and secure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Getting Started
              </h2>
              <h3 className="text-xl font-medium mb-2">
                Creating Your First Invoice
              </h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Click the "New Invoice" button on the dashboard</li>
                <li>Fill in your business details and logo (optional)</li>
                <li>Add your client's information</li>
                <li>Add items or services with descriptions and prices</li>
                <li>Review the generated invoice</li>
                <li>Download or send the invoice</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-xl font-medium mb-2">📝 Professional Templates</h3>
                  <p className="text-muted-foreground">
                    Choose from multiple professional invoice templates to match your brand identity.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">💾 Local Storage</h3>
                  <p className="text-muted-foreground">
                    Your data is saved locally in your browser for easy access to previous invoices.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">🖨️ Export Options</h3>
                  <p className="text-muted-foreground">
                    Download your invoices as PDF files or print them directly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Tips & Best Practices
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Always include clear payment terms and due dates</li>
                <li>Keep a consistent numbering system for your invoices</li>
                <li>Include your business details and tax information</li>
                <li>Regularly backup your saved invoices</li>
                <li>Preview your invoice before sending it to clients</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Need Additional Help?
              </h2>
              <p className="text-muted-foreground">
                If you need further assistance or want to report an issue, please visit our GitHub repository
                or contact us through our support channels. We're here to help you create professional invoices
                with ease.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Help;
