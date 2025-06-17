import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Play, Lock, CheckCircle, Mail, CreditCard } from "lucide-react";
import { createPayment, confirmPayment } from "@/lib/stripe";
import type { Project } from "@shared/schema";

const CheckoutForm = ({ project, clientEmail }: { project: Project; clientEmail: string }) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [downloadToken, setDownloadToken] = useState("");
  const [paymentData, setPaymentData] = useState<any>(null);

  const createPaymentMutation = useMutation({
    mutationFn: async () => {
      return await createPayment(project.id, clientEmail);
    },
    onSuccess: (data) => {
      setPaymentData(data);
    },
    onError: (error: any) => {
      toast({
        title: "Payment Creation Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const confirmPaymentMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      return await confirmPayment(paymentId);
    },
    onSuccess: (data) => {
      setPaymentSucceeded(true);
      setDownloadToken(data.downloadToken);
      toast({
        title: "Payment Successful!",
        description: "Check your email for the download link.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Payment Processing Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (!paymentData) {
        const payment = await createPaymentMutation.mutateAsync();
        await confirmPaymentMutation.mutateAsync(payment.paymentId);
      } else {
        await confirmPaymentMutation.mutateAsync(paymentData.paymentId);
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "An error occurred during payment processing.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSucceeded) {
    return (
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="gradient-accent text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-white">Payment Successful!</CardTitle>
              <CardDescription className="text-green-100">
                Your files are being prepared for download
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-green-600 text-2xl" />
          </div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">Check your email!</h4>
          <p className="text-slate-600 mb-4">
            We've sent a secure download link to <strong>{clientEmail}</strong>
          </p>
          <p className="text-sm text-slate-500">
            Link expires in 7 days. Download limit: 3 times.
          </p>
          {downloadToken && (
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 mb-2">Download Token:</p>
              <code className="text-xs bg-white p-2 rounded border">{downloadToken}</code>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl overflow-hidden">
      <CardHeader className="gradient-accent text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <CheckCircle className="text-white" />
          </div>
          <div>
            <CardTitle className="text-xl text-white">Complete Your Payment</CardTitle>
            <CardDescription className="text-emerald-100">
              Secure payment to receive your final files
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="mb-6">
          <h4 className="font-semibold text-slate-900 mb-2">Order Summary</h4>
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">{project.title}</span>
              <span className="font-semibold text-slate-900">${project.price}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Processing fee (3%)</span>
              <span className="text-slate-500">${(parseFloat(project.price) * 0.03).toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-200 mt-3 pt-3">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-slate-900">Total</span>
                <span className="text-slate-900">${(parseFloat(project.price) * 1.03).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={clientEmail}
              readOnly
              className="bg-slate-100"
            />
            <p className="text-xs text-slate-500 mt-1">Download link will be sent to this email</p>
          </div>

          <div>
            <Label className="block text-sm font-medium text-slate-900 mb-2">
              Payment Method
            </Label>
            <div className="border border-slate-300 rounded-lg p-4 bg-slate-50">
              <div className="flex items-center space-x-3">
                <CreditCard className="text-slate-600" />
                <div>
                  <p className="font-medium text-slate-900">Credit Card Payment</p>
                  <p className="text-sm text-slate-600">Secure payment processing</p>
                </div>
              </div>
            </div>
          </div>

          <Button 
            type="submit"
            className="w-full gradient-accent text-white" 
            size="lg"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : `Pay $${(parseFloat(project.price) * 1.03).toFixed(2)}`}
          </Button>

          <div className="text-center">
            <p className="text-xs text-slate-500">
              <Lock className="inline h-3 w-3 mr-1" />
              Secure payment processing. Your information is encrypted.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default function CheckoutPage() {
  const [, params] = useRoute("/checkout/:id");
  
  // Get client email from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const clientEmail = urlParams.get('clientEmail') || "";

  const { data: project, isLoading } = useQuery({
    queryKey: [`/api/projects/${params?.id}?clientEmail=${clientEmail}`],
    enabled: !!params?.id && !!clientEmail,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!project?.project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Project not found</h2>
            <p className="text-slate-600">The requested project is not available or not approved for payment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const projectData = project.project;

  if (projectData.status !== 'approved') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Payment not available</h2>
            <p className="text-slate-600">This project has not been approved for payment yet.</p>
            <Badge className="mt-2 bg-yellow-100 text-yellow-800">
              Status: {projectData.status.replace('_', ' ')}
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Play className="text-white text-sm" />
            </div>
            <span className="text-xl font-bold text-slate-900">PayVidi</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Secure Checkout</h1>
          <p className="text-slate-600">Complete your payment to receive the final files</p>
        </div>

        {/* Payment Form */}
        <CheckoutForm project={projectData} clientEmail={clientEmail} />
      </div>
    </div>
  );
}
