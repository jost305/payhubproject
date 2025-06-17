
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  Mail, 
  Globe, 
  Palette, 
  Bell, 
  Shield,
  Settings,
  Save,
  Eye,
  Copy
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
    subdomain: user?.subdomain || "",
    brandColor: user?.brandColor || "#4F46E5",
    logoUrl: user?.logoUrl || "",
    bannerUrl: user?.bannerUrl || "",
    customThankYouMessage: user?.customThankYouMessage || "",
    redirectAfterPayment: user?.redirectAfterPayment || "",
    redirectAfterApproval: user?.redirectAfterApproval || ""
  });

  const [notifications, setNotifications] = useState({
    emailComments: true,
    emailApprovals: true,
    emailPayments: true,
    marketingEmails: false
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      const response = await apiRequest('PATCH', `/api/users/${user?.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profile);
  };

  const handleCopyLink = () => {
    if (profile.subdomain) {
      const url = `${window.location.origin}/${profile.subdomain}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Copied!",
        description: "Portfolio link copied to clipboard",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
          <p className="text-slate-600 mt-2">Manage your account and customize your public profile</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subdomain">Portfolio Subdomain</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="subdomain"
                      value={profile.subdomain}
                      onChange={(e) => setProfile({ ...profile, subdomain: e.target.value })}
                      placeholder="yourname"
                    />
                    <span className="text-sm text-slate-500">.payvidi.com</span>
                  </div>
                  {profile.subdomain && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" onClick={handleCopyLink}>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy Link
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/${profile.subdomain}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Branding */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Branding & Customization
                </CardTitle>
                <CardDescription>
                  Customize how your portfolio appears to clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="brandColor">Brand Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="brandColor"
                      type="color"
                      value={profile.brandColor}
                      onChange={(e) => setProfile({ ...profile, brandColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={profile.brandColor}
                      onChange={(e) => setProfile({ ...profile, brandColor: e.target.value })}
                      placeholder="#4F46E5"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={profile.logoUrl}
                    onChange={(e) => setProfile({ ...profile, logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <Label htmlFor="bannerUrl">Banner Image URL</Label>
                  <Input
                    id="bannerUrl"
                    value={profile.bannerUrl}
                    onChange={(e) => setProfile({ ...profile, bannerUrl: e.target.value })}
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="thankYouMessage">Custom Thank You Message</Label>
                  <Textarea
                    id="thankYouMessage"
                    value={profile.customThankYouMessage}
                    onChange={(e) => setProfile({ ...profile, customThankYouMessage: e.target.value })}
                    placeholder="Thank you for choosing our services!"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Redirects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Redirect Settings
                </CardTitle>
                <CardDescription>
                  Set custom URLs to redirect clients after specific actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="redirectAfterPayment">Redirect After Payment</Label>
                  <Input
                    id="redirectAfterPayment"
                    value={profile.redirectAfterPayment}
                    onChange={(e) => setProfile({ ...profile, redirectAfterPayment: e.target.value })}
                    placeholder="https://yourwebsite.com/thank-you"
                  />
                </div>
                <div>
                  <Label htmlFor="redirectAfterApproval">Redirect After Approval</Label>
                  <Input
                    id="redirectAfterApproval"
                    value={profile.redirectAfterApproval}
                    onChange={(e) => setProfile({ ...profile, redirectAfterApproval: e.target.value })}
                    placeholder="https://yourwebsite.com/approved"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified about project updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Comment Notifications</p>
                    <p className="text-sm text-slate-600">Get notified when clients leave comments</p>
                  </div>
                  <Switch 
                    checked={notifications.emailComments}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, emailComments: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Approval Notifications</p>
                    <p className="text-sm text-slate-600">Get notified when projects are approved</p>
                  </div>
                  <Switch 
                    checked={notifications.emailApprovals}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, emailApprovals: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment Notifications</p>
                    <p className="text-sm text-slate-600">Get notified when payments are received</p>
                  </div>
                  <Switch 
                    checked={notifications.emailPayments}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, emailPayments: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-slate-600">Receive updates about new features</p>
                  </div>
                  <Switch 
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, marketingEmails: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Account Summary & Actions */}
          <div className="space-y-6">
            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Role</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {user.role === 'freelancer' ? 'Freelancer' : user.role}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Member Since</span>
                  <span className="text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Portfolio URL</span>
                  <span className="text-sm font-medium">
                    {profile.subdomain ? `/${profile.subdomain}` : 'Not set'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  className="w-full payvidi-gradient"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                
                {profile.subdomain && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`/${profile.subdomain}`} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4 mr-2" />
                      View Portfolio
                    </a>
                  </Button>
                )}
                
                <Button variant="outline" className="w-full">
                  <Shield className="w-4 h-4 mr-2" />
                  Security Settings
                </Button>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-3">
                  Need help with your account or have questions?
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
