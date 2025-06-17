import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Play, Eye, MessageSquare, CreditCard, Globe, Shield, TrendingUp, Users, Settings, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { PRICING_PLANS } from "@/lib/constants";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Secure file sharing for <span className="text-primary">creators</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Let clients preview your work, provide feedback, and pay securely before receiving final files. 
              Professional file sharing made simple.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gradient-primary text-white">
                <Link href="/register">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
          </div>
          
          {/* Hero Dashboard Mockup */}
          <div className="mt-16 relative">
            <Card className="shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 px-4 py-3 flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="ml-4 text-slate-400 text-sm">designer.payvidi.com</div>
              </div>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="bg-slate-100 rounded-xl aspect-video flex items-center justify-center">
                      <Play className="text-primary text-4xl" />
                    </div>
                    <div className="mt-4 bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">00:00</span>
                        <div className="flex-1 mx-4 bg-slate-200 rounded-full h-2">
                          <div className="bg-primary w-1/3 h-2 rounded-full"></div>
                        </div>
                        <span className="text-sm text-slate-600">02:34</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">JD</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-600">Love the intro! Can we make the logo bigger at 0:15?</p>
                          <span className="text-xs text-slate-400">2 hours ago</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">SM</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-600">Perfect! Ready to approve.</p>
                          <span className="text-xs text-slate-400">1 hour ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to share files securely
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From preview sharing to payment processing, PayVidi handles the entire client workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Eye className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Preview Sharing</h3>
                <p className="text-slate-600">Share watermarked previews with clients. They can comment and approve before payment.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Timeline Comments</h3>
                <p className="text-slate-600">Clients can leave feedback at specific timestamps in videos or sections in documents.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <CreditCard className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Secure Payments</h3>
                <p className="text-slate-600">Integrated payment processing with automatic commission calculation and payouts.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Custom Subdomains</h3>
                <p className="text-slate-600">Professional branded URLs like yourname.payvidi.com for your clients.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Secure Delivery</h3>
                <p className="text-slate-600">Time-limited, IP-restricted download links sent via email after payment confirmation.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Analytics Dashboard</h3>
                <p className="text-slate-600">Track preview views, client interactions, and payment status in real-time.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Built for every role in your workflow
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Freelancer Dashboard Card */}
            <Card className="shadow-lg overflow-hidden">
              <CardHeader className="gradient-primary text-white p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Users className="text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Freelancer Dashboard</CardTitle>
                    <p className="text-indigo-100">Manage projects and clients</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { title: "Brand Video Project", status: "Pending", color: "yellow" },
                    { title: "Logo Design", status: "Completed", color: "green" },
                    { title: "Website Mockup", status: "Review", color: "blue" }
                  ].map((project, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{project.title}</p>
                        <p className="text-sm text-slate-600">
                          {project.status === "Completed" ? "Payment received" : 
                           project.status === "Pending" ? "Waiting for approval" : "In review"}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.color === "green" ? "bg-green-100 text-green-800" :
                        project.color === "yellow" ? "bg-yellow-100 text-yellow-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Client Preview Card */}
            <Card className="shadow-lg overflow-hidden">
              <CardHeader className="gradient-accent text-white p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Eye className="text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Client Preview</CardTitle>
                    <p className="text-emerald-100">Review and approve work</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-slate-100 rounded-lg aspect-video mb-4 flex items-center justify-center">
                  <Play className="text-slate-400 text-2xl" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs">1</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-600">Great opening sequence!</p>
                      <span className="text-xs text-slate-400">at 0:15</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs">2</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-600">Can we adjust the transition here?</p>
                      <span className="text-xs text-slate-400">at 1:32</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex space-x-2">
                    <Button className="flex-1 gradient-accent text-white">
                      Approve & Pay
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Panel Card */}
            <Card className="shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-900 text-white p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Settings className="text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Admin Panel</CardTitle>
                    <p className="text-slate-300">Platform management</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">1,247</div>
                    <div className="text-xs text-slate-600">Total Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">$12,450</div>
                    <div className="text-xs text-slate-600">Monthly Revenue</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Commission Rate</span>
                    <span className="font-medium">5%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Active Freelancers</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Pending Approvals</span>
                    <span className="font-medium text-orange-600">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Start free and scale as you grow. We only succeed when you succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {Object.entries(PRICING_PLANS).map(([key, plan], index) => (
              <Card key={key} className={`${key === 'professional' ? 'gradient-primary text-white relative' : 'bg-slate-50'}`}>
                {key === 'professional' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-secondary text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className={`text-xl font-semibold mb-2 ${key === 'professional' ? 'text-white' : 'text-slate-900'}`}>
                      {plan.name}
                    </h3>
                    <div className={`text-4xl font-bold mb-1 ${key === 'professional' ? 'text-white' : 'text-slate-900'}`}>
                      {plan.price}
                    </div>
                    <p className={key === 'professional' ? 'text-indigo-200' : 'text-slate-600'}>
                      {key === 'starter' ? 'Perfect for getting started' :
                       key === 'professional' ? 'For growing freelancers' : 'For teams and agencies'}
                    </p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className={`h-5 w-5 ${key === 'professional' ? 'text-green-400' : 'text-green-500'}`} />
                        <span className={key === 'professional' ? 'text-white' : 'text-slate-600'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      key === 'professional' 
                        ? 'bg-white text-primary hover:bg-slate-50' 
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                    asChild
                  >
                    <Link href="/register">
                      {key === 'starter' ? 'Get Started' :
                       key === 'professional' ? 'Start Free Trial' : 'Contact Sales'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Commission Info */}
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-900 mb-2">Transaction Fees</h4>
                <p className="text-slate-600 mb-4">
                  We charge a small commission on successful transactions to keep the platform running.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(PRICING_PLANS).map(([key, plan]) => (
                    <div key={key} className="text-center">
                      <div className={`text-2xl font-bold ${key === 'professional' ? 'text-primary' : 'text-slate-900'}`}>
                        {plan.commission}%
                      </div>
                      <div className="text-sm text-slate-600">{plan.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who trust PayVidi to handle their client relationships professionally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-slate-50">
              <Link href="/register">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-10">
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Play className="text-white text-sm" />
                </div>
                <span className="text-xl font-bold">PayVidi</span>
              </div>
              <p className="text-slate-400 mb-4">
                Secure file sharing for creative professionals. Get paid for your work, professionally.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-slate-400">© 2024 PayVidi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
