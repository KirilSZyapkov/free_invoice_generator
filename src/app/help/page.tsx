import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function HelpPage() {
  const sections = [
    {
      id: "basics",
      title: "Invoice Basics",
      items: [
        { title: "Create New Invoice", href: "#create" },
        { title: "Managing Invoices", href: "#manage" },
        { title: "Templates", href: "#templates" },
        { title: "PDF Export", href: "#export" },
      ]
    },
    {
      id: "features",
      title: "Key Features",
      items: [
        { title: "Email Integration", href: "#email" },
        { title: "Custom Branding", href: "#branding" },
        { title: "Payment Terms", href: "#payment" },
        { title: "Tax Calculation", href: "#tax" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-900/30">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-b from-primary/10 to-background pt-16 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            How can we help you?
          </h1>
          {/* {да добавя възможност за търсене} */}
          {/* <div className="max-w-xl mx-auto relative">
            <Input
              placeholder="Search help articles..."
              className="pl-10 h-12 rounded-full"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
          </div> */}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Quick Navigation Sidebar */}
          {/* <aside className="lg:col-span-3">
            <div className="sticky top-4 space-y-6">
              <div className="rounded-lg border bg-card p-4">
                <h2 className="font-semibold mb-4">Quick Navigation</h2>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <div key={section.id} className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {section.title}
                      </h3>
                      <ul className="space-y-1">
                        {section.items.map((item) => (
                          <li key={item.href}>
                            <a
                              href={item.href}
                              className="block text-sm hover:text-primary transition-colors"
                            >
                              {item.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </aside> */}

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-8">
            {/* Getting Started */}
            <section id="create" className="scroll-m-20">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Creating Your First Invoice</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-muted-foreground mb-4">
                      Follow these simple steps to create a professional invoice:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {[
                        {
                          step: "1",
                          title: "Enter Business Details",
                          description: "Add your company information and logo"
                        },
                        {
                          step: "2",
                          title: "Add Client Info",
                          description: "Input your client's billing details"
                        },
                        {
                          step: "3",
                          title: "Add Items",
                          description: "List your products or services with prices"
                        }
                      ].map((item) => (
                        <div key={item.step} className="relative p-4 border rounded-lg">
                          <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                            {item.step}
                          </div>
                          <h3 className="font-semibold mt-2">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Features Section */}
            <section id="features" className="scroll-m-20">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Advanced Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "Email Integration",
                        description: "Send invoices directly to clients via email",
                        icon: "📧"
                      },
                      {
                        title: "PDF Export",
                        description: "Download professional PDF invoices",
                        icon: "📄"
                      },
                      {
                        title: "Tax Calculation",
                        description: "Automatic tax and total calculations",
                        icon: "🧮"
                      },
                      {
                        title: "Multiple Templates",
                        description: "Choose from various professional designs",
                        icon: "🎨"
                      }
                    ].map((feature) => (
                      <div key={feature.title} className="flex gap-4 p-4 border rounded-lg">
                        <span className="text-2xl">{feature.icon}</span>
                        <div>
                          <h3 className="font-semibold mb-1">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="scroll-m-20">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Common Questions</h2>
                  <div className="space-y-4">
                    {[
                      {
                        q: "How do I customize my invoice template?",
                        a: "You can modify colors, add your logo, and adjust layouts in the template settings."
                      },
                      {
                        q: "Can I save draft invoices?",
                        a: "Yes, all changes are automatically saved as drafts until you finalize the invoice."
                      },
                      {
                        q: "How do I handle recurring invoices?",
                        a: "Use the 'Duplicate' feature to create copies of existing invoices for recurring billing."
                      }
                    ].map((item, i) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">{item.q}</h3>
                        <p className="text-sm text-muted-foreground">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Support Section */}
            <section className="bg-primary/5 rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Need More Help?</h2>
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for? We're here to help.
              </p>
              <Button variant="default">Contact Support</Button>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
