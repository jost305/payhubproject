import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Play, 
  Eye, 
  MessageSquare, 
  CreditCard, 
  Globe, 
  Shield, 
  TrendingUp,
  Users,
  Settings,
  Check,
  Star,
  ArrowRight,
  FileVideo,
  FileImage,
  FileText,
  Download,
  Zap,
  Clock,
  Award
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Play className="text-white w-4 h-4" />
                </div>
                <span className="text-xl font-bold text-slate-900">PayVidi</span>
              </div>
              <div className="hidden md:flex space-x-6">
                <a href="#features" className="text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
                <a href="#how-it-works" className="text-slate-600 hover:text-indigo-600 transition-colors">How it works</a>
                <a href="#pricing" className="text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-indigo-600">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-indigo-100 text-indigo-700 border-indigo-200">
              Trusted by 10,000+ creators worldwide
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Share work.<br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Get paid.</span><br />
              Stay secure.
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              The modern platform for creators to share previews, collect feedback, and process payments 
              before delivering final files. Professional client management made effortless.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 px-8 py-4 text-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-slate-300">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-slate-500 mt-4">No credit card required • 14-day free trial</p>
          </div>
          
          {/* Hero Visual */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
            <Card className="relative bg-white/80 backdrop-blur-sm shadow-2xl border border-slate-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="ml-4 text-slate-300 text-sm font-mono">designer.payvidi.com</div>
              </div>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
                      <Play className="text-indigo-600 w-20 h-20 relative z-10" />
                    </div>
                    <div className="mt-6 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 font-medium">00:00</span>
                        <div className="flex-1 mx-6 bg-slate-200 rounded-full h-3 relative">
                          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-1/3 h-3 rounded-full"></div>
                          <div className="absolute top-0 left-1/4 w-4 h-4 bg-orange-500 rounded-full -mt-0.5 border-2 border-white shadow-sm"></div>
                          <div className="absolute top-0 left-1/2 w-4 h-4 bg-blue-500 rounded-full -mt-0.5 border-2 border-white shadow-sm"></div>
                        </div>
                        <span className="text-sm text-slate-600 font-medium">03:24</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Card className="bg-white border border-slate-200/50 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-9 h-9 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">JD</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-700 font-medium">Love the intro! Can we make the logo bigger at 0:15?</p>
                            <span className="text-xs text-slate-500 mt-1">2 hours ago • Timeline comment</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white border border-slate-200/50 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-9 h-9 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">SM</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-700 font-medium">Perfect! Ready to approve and pay.</p>
                            <div className="flex items-center mt-2">
                              <Check className="w-4 h-4 text-emerald-500 mr-1" />
                              <span className="text-xs text-emerald-600 font-medium">Approved</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-purple-100 text-purple-700 border-purple-200">
              Core Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Everything you need to share files
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">professionally</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From preview sharing to payment processing, PayVidi handles the entire client workflow 
              with enterprise-grade security and modern design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group bg-white border border-slate-200/50 hover:border-indigo-200 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="text-white w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Preview Sharing</h3>
                <p className="text-slate-600 leading-relaxed">Share watermarked previews with clients. They can comment and approve before payment, ensuring satisfaction.</p>
              </CardContent>
            </Card>

            <Card className="group bg-white border border-slate-200/50 hover:border-indigo-200 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="text-white w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Timeline Comments</h3>
                <p className="text-slate-600 leading-relaxed">Clients can leave feedback at specific timestamps in videos or sections in documents with precision.</p>
              </CardContent>
            </Card>

            <Card className="group bg-white border border-slate-200/50 hover:border-indigo-200 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CreditCard className="text-white w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Payments</h3>
                <p className="text-slate-600 leading-relaxed">Integrated payment processing with automatic commission calculation and instant payouts.</p>
              </CardContent>
            </Card>

            <Card className="group bg-white border border-slate-200/50 hover:border-indigo-200 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="text-white w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Custom Subdomains</h3>
                <p className="text-slate-600 leading-relaxed">Professional branded URLs like yourname.payvidi.com for seamless client experience.</p>
              </CardContent>
            </Card>

            <Card className="group bg-white border border-slate-200/50 hover:border-indigo-200 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="text-white w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Delivery</h3>
                <p className="text-slate-600 leading-relaxed">Time-limited, IP-restricted download links sent via email after payment confirmation.</p>
              </CardContent>
            </Card>

            <Card className="group bg-white border border-slate-200/50 hover:border-indigo-200 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="text-white w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Analytics Dashboard</h3>
                <p className="text-slate-600 leading-relaxed">Track preview views, client interactions, and payment status in real-time analytics.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-emerald-100 text-emerald-700 border-emerald-200">
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              From upload to payment in
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">4 simple steps</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              PayVidi streamlines your entire client workflow, from initial preview sharing to final file delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileVideo className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Upload & Share</h3>
              <p className="text-slate-600">Upload your work and create secure preview links to share with clients instantly.</p>
            </div>

            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Review & Feedback</h3>
              <p className="text-slate-600">Clients review your work and leave precise timeline-based comments and suggestions.</p>
            </div>

            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Approve & Pay</h3>
              <p className="text-slate-600">Once satisfied, clients approve the work and complete secure payment processing.</p>
            </div>

            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Download className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Delivery</h3>
              <p className="text-slate-600">Final files are delivered via secure, time-limited download links sent by email.</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-slate-100 text-slate-700 border-slate-200">
              For Everyone
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Built for every role in your
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">creative workflow</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Freelancer Dashboard */}
            <Card className="bg-white shadow-xl overflow-hidden border-0">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Users className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">For Freelancers</h3>
                    <p className="text-indigo-100">Manage projects effortlessly</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-slate-900">Brand Video Project</p>
                      <p className="text-sm text-slate-600">Waiting for approval</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                      Pending
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-slate-900">Logo Design</p>
                      <p className="text-sm text-slate-600">Payment received</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      Completed
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-slate-900">Website Mockup</p>
                      <p className="text-sm text-slate-600">In review</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      Review
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Preview Interface */}
            <Card className="bg-white shadow-xl overflow-hidden border-0">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Eye className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">For Clients</h3>
                    <p className="text-emerald-100">Review and approve work</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl aspect-video mb-6 flex items-center justify-center">
                  <Play className="text-slate-500 w-12 h-12" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                    <div className="w-7 h-7 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">Great opening sequence!</p>
                      <span className="text-xs text-slate-500">at 0:15</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">Can we adjust the transition here?</p>
                      <span className="text-xs text-slate-500">at 1:32</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="flex space-x-3">
                    <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700">
                      Approve & Pay
                    </Button>
                    <Button variant="outline" size="icon" className="border-slate-300">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              <div className="payvidi-gradient p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Users className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Freelancer Dashboard</h3>
                    <p className="text-indigo-100">Manage projects and clients</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Brand Video Project</p>
                      <p className="text-sm text-slate-600">Waiting for approval</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Pending
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Logo Design</p>
                      <p className="text-sm text-slate-600">Payment received</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Website Mockup</p>
                      <p className="text-sm text-slate-600">In review</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      Review
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Panel */}
            <Card className="bg-white shadow-xl overflow-hidden border-0">
              <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Settings className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">For Admins</h3>
                    <p className="text-slate-300">Platform management</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl">
                    <div className="text-3xl font-bold text-slate-900 mb-2">1,247</div>
                    <div className="text-sm text-slate-600 font-medium">Total Users</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-xl">
                    <div className="text-3xl font-bold text-slate-900 mb-2">$12.4K</div>
                    <div className="text-sm text-slate-600 font-medium">Monthly Revenue</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg">
                    <span className="text-slate-700 font-medium">Commission Rate</span>
                    <span className="font-bold text-slate-900">8.5%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-green-50 rounded-lg">
                    <span className="text-slate-700 font-medium">Active Freelancers</span>
                    <span className="font-bold text-slate-900">156</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-orange-50 rounded-lg">
                    <span className="text-slate-700 font-medium">Pending Approvals</span>
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">3</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-indigo-100 text-indigo-700 border-indigo-200">
              Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Simple, transparent
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">pricing</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Start free and scale as you grow. We only succeed when you succeed with transparent, usage-based pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <Card className="bg-white border border-slate-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Starter</h3>
                  <div className="text-5xl font-bold text-slate-900 mb-2">Free</div>
                  <p className="text-slate-600">Perfect for getting started</p>
                </div>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700">Up to 5 projects</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700">1GB storage</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700">Basic preview sharing</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700">PayVidi subdomain</span>
                  </li>
                </ul>
                <Button className="w-full bg-slate-200 text-slate-700 hover:bg-slate-300">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="payvidi-gradient text-white relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-secondary text-white">Most Popular</Badge>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold mb-2">Professional</h3>
                  <div className="text-4xl font-bold mb-1">$29<span className="text-lg">/mo</span></div>
                  <p className="text-indigo-200">For growing freelancers</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Unlimited projects</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>50GB storage</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Custom subdomain</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full bg-white text-primary hover:bg-slate-50 font-semibold">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-slate-50 border border-slate-200">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Enterprise</h3>
                  <div className="text-4xl font-bold text-slate-900 mb-1">$99<span className="text-lg">/mo</span></div>
                  <p className="text-slate-600">For teams and agencies</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">Everything in Professional</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">500GB storage</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">Team collaboration</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">White-label option</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">API access</span>
                  </li>
                </ul>
                <Button className="w-full bg-slate-200 text-slate-700 hover:bg-slate-300">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Commission Info */}
          <div className="mt-12 text-center">
            <Card className="bg-slate-50 max-w-2xl mx-auto">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-900 mb-2">Transaction Fees</h4>
                <p className="text-slate-600 mb-4">
                  We charge a small commission on successful transactions to keep the platform running.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">5%</div>
                    <div className="text-sm text-slate-600">Starter</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">3%</div>
                    <div className="text-sm text-slate-600">Professional</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">2%</div>
                    <div className="text-sm text-slate-600">Enterprise</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 payvidi-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who trust PayVidi to handle their client relationships professionally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-slate-50">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-10">
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
                <div className="w-8 h-8 payvidi-gradient rounded-lg flex items-center justify-center">
                  <Play className="text-white w-4 h-4" />
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
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Status</a></li>
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
