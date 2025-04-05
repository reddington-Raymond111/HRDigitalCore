import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Settings, 
  Bell, 
  Shield, 
  Users, 
  Building, 
  Database, 
  Save, 
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AppSettings, NotificationSettings, SecuritySettings } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

// Zod schemas for form validation
const generalSettingsSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  currency: z.string().min(1, "Currency is required"),
  language: z.string().min(1, "Language is required"),
  dateFormat: z.string().min(1, "Date format is required"),
  timeFormat: z.string().min(1, "Time format is required"),
  timezone: z.string().min(1, "Timezone is required"),
  fiscalYearStart: z.string().min(1, "Fiscal year start date is required"),
});

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  contractRenewalNotice: z.coerce.number().int().min(1).max(90),
  documentExpiryNotice: z.coerce.number().int().min(1).max(90),
  birthdayReminders: z.boolean(),
  workAnniversaries: z.boolean(),
});

const securitySettingsSchema = z.object({
  passwordPolicy: z.object({
    minLength: z.coerce.number().int().min(6).max(20),
    requireUppercase: z.boolean(),
    requireLowercase: z.boolean(),
    requireNumbers: z.boolean(),
    requireSpecialChars: z.boolean(),
    expiryDays: z.coerce.number().int().min(0).max(365),
  }),
  twoFactorAuth: z.boolean(),
  sessionTimeout: z.coerce.number().int().min(5).max(1440),
});

const SettingsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");

  // Default settings values
  const defaultGeneralSettings: AppSettings = {
    companyName: "Your Company",
    currency: "USD",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    timezone: "America/New_York",
    fiscalYearStart: "01/01",
  };

  const defaultNotificationSettings: NotificationSettings = {
    emailNotifications: true,
    contractRenewalNotice: 30,
    documentExpiryNotice: 14,
    birthdayReminders: true,
    workAnniversaries: true,
  };

  const defaultSecuritySettings: SecuritySettings = {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expiryDays: 90,
    },
    twoFactorAuth: false,
    sessionTimeout: 30,
  };

  // Set up forms
  const generalForm = useForm<AppSettings>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: defaultGeneralSettings,
  });

  const notificationForm = useForm<NotificationSettings>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: defaultNotificationSettings,
  });

  const securityForm = useForm<SecuritySettings>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: defaultSecuritySettings,
  });

  // Mock mutations for saving settings
  const saveGeneralSettingsMutation = useMutation({
    mutationFn: async (data: AppSettings) => {
      // In a real app, would call an API endpoint
      console.log("Saving general settings:", data);
      return new Promise<void>((resolve) => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved",
        description: "Your general settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveNotificationSettingsMutation = useMutation({
    mutationFn: async (data: NotificationSettings) => {
      // In a real app, would call an API endpoint
      console.log("Saving notification settings:", data);
      return new Promise<void>((resolve) => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved",
        description: "Your notification settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveSecuritySettingsMutation = useMutation({
    mutationFn: async (data: SecuritySettings) => {
      // In a real app, would call an API endpoint
      console.log("Saving security settings:", data);
      return new Promise<void>((resolve) => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved",
        description: "Your security settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Form submission handlers
  const onSubmitGeneral = (data: AppSettings) => {
    saveGeneralSettingsMutation.mutate(data);
  };

  const onSubmitNotifications = (data: NotificationSettings) => {
    saveNotificationSettingsMutation.mutate(data);
  };

  const onSubmitSecurity = (data: SecuritySettings) => {
    saveSecuritySettingsMutation.mutate(data);
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="text-sm text-neutral-600" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1">
            <li>
              <Link href="/">
                <a className="hover:text-primary">Home</a>
              </Link>
            </li>
            <li className="flex items-center space-x-1">
              <span>/</span>
              <span className="text-primary">Settings</span>
            </li>
          </ol>
        </nav>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-2">
          <h1 className="text-2xl font-semibold text-neutral-800">System Settings</h1>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TabsList className="flex flex-col w-full rounded-none">
              <TabsTrigger
                value="general"
                onClick={() => setActiveTab("general")}
                className={`justify-start px-4 py-2 ${activeTab === "general" ? "bg-primary/10 border-l-2 border-primary" : ""}`}
              >
                <Settings className="h-4 w-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                onClick={() => setActiveTab("notifications")}
                className={`justify-start px-4 py-2 ${activeTab === "notifications" ? "bg-primary/10 border-l-2 border-primary" : ""}`}
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="security"
                onClick={() => setActiveTab("security")}
                className={`justify-start px-4 py-2 ${activeTab === "security" ? "bg-primary/10 border-l-2 border-primary" : ""}`}
              >
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger
                value="users"
                onClick={() => setActiveTab("users")}
                className={`justify-start px-4 py-2 ${activeTab === "users" ? "bg-primary/10 border-l-2 border-primary" : ""}`}
              >
                <Users className="h-4 w-4 mr-2" />
                Users & Roles
              </TabsTrigger>
              <TabsTrigger
                value="organization"
                onClick={() => setActiveTab("organization")}
                className={`justify-start px-4 py-2 ${activeTab === "organization" ? "bg-primary/10 border-l-2 border-primary" : ""}`}
              >
                <Building className="h-4 w-4 mr-2" />
                Organization
              </TabsTrigger>
              <TabsTrigger
                value="data"
                onClick={() => setActiveTab("data")}
                className={`justify-start px-4 py-2 ${activeTab === "data" ? "bg-primary/10 border-l-2 border-primary" : ""}`}
              >
                <Database className="h-4 w-4 mr-2" />
                Data Management
              </TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* General Settings */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">General Settings</CardTitle>
                  <CardDescription>
                    Configure basic settings for your HR system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...generalForm}>
                    <form id="general-form" onSubmit={generalForm.handleSubmit(onSubmitGeneral)} className="space-y-6">
                      <FormField
                        control={generalForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              The name of your company as it will appear throughout the system
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={generalForm.control}
                          name="currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Default Currency</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                                  <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={generalForm.control}
                          name="language"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Language</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="es">Spanish</SelectItem>
                                  <SelectItem value="fr">French</SelectItem>
                                  <SelectItem value="de">German</SelectItem>
                                  <SelectItem value="zh">Chinese</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={generalForm.control}
                          name="dateFormat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date Format</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select date format" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={generalForm.control}
                          name="timeFormat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time Format</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select time format" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                                  <SelectItem value="24h">24-hour</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={generalForm.control}
                          name="timezone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Timezone</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select timezone" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                  <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                                  <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                                  <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={generalForm.control}
                          name="fiscalYearStart"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fiscal Year Start</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select fiscal year start" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="01/01">January 1</SelectItem>
                                  <SelectItem value="04/01">April 1</SelectItem>
                                  <SelectItem value="07/01">July 1</SelectItem>
                                  <SelectItem value="10/01">October 1</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-end border-t p-4">
                  <Button 
                    type="submit" 
                    form="general-form"
                    disabled={saveGeneralSettingsMutation.isPending}
                    className="flex items-center"
                  >
                    <Save className="h-4 w-4 mr-1.5" />
                    {saveGeneralSettingsMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Notification Settings</CardTitle>
                  <CardDescription>
                    Configure how and when notifications are sent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...notificationForm}>
                    <form id="notification-form" onSubmit={notificationForm.handleSubmit(onSubmitNotifications)} className="space-y-6">
                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Notifications</FormLabel>
                              <FormDescription>
                                Enable email notifications for system events
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Reminder Settings</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={notificationForm.control}
                            name="contractRenewalNotice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contract Renewal Notice (days)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Days before contract expiry to send a reminder
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={notificationForm.control}
                            name="documentExpiryNotice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Document Expiry Notice (days)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Days before document expiry to send a reminder
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Event Notifications</h3>
                        
                        <FormField
                          control={notificationForm.control}
                          name="birthdayReminders"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Birthday Reminders</FormLabel>
                                <FormDescription>
                                  Send reminders for employee birthdays
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={notificationForm.control}
                          name="workAnniversaries"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Work Anniversaries</FormLabel>
                                <FormDescription>
                                  Send reminders for employee work anniversaries
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-end border-t p-4">
                  <Button 
                    type="submit" 
                    form="notification-form"
                    disabled={saveNotificationSettingsMutation.isPending}
                    className="flex items-center"
                  >
                    <Save className="h-4 w-4 mr-1.5" />
                    {saveNotificationSettingsMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Security Settings</CardTitle>
                  <CardDescription>
                    Configure security and access control settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...securityForm}>
                    <form id="security-form" onSubmit={securityForm.handleSubmit(onSubmitSecurity)} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Password Policy</h3>
                        
                        <FormField
                          control={securityForm.control}
                          name="passwordPolicy.minLength"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Password Length</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormDescription>
                                Minimum number of characters required for passwords
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={securityForm.control}
                            name="passwordPolicy.requireUppercase"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Require Uppercase</FormLabel>
                                  <FormDescription>
                                    Require at least one uppercase letter
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={securityForm.control}
                            name="passwordPolicy.requireLowercase"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Require Lowercase</FormLabel>
                                  <FormDescription>
                                    Require at least one lowercase letter
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={securityForm.control}
                            name="passwordPolicy.requireNumbers"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Require Numbers</FormLabel>
                                  <FormDescription>
                                    Require at least one number
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={securityForm.control}
                            name="passwordPolicy.requireSpecialChars"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Require Special Characters</FormLabel>
                                  <FormDescription>
                                    Require at least one special character
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={securityForm.control}
                          name="passwordPolicy.expiryDays"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password Expiry (days)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormDescription>
                                Number of days after which passwords expire (0 for never)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator />

                      <FormField
                        control={securityForm.control}
                        name="twoFactorAuth"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                              <FormDescription>
                                Require two-factor authentication for all users
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={securityForm.control}
                        name="sessionTimeout"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Session Timeout (minutes)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Minutes of inactivity before a user is automatically logged out
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-end border-t p-4">
                  <Button 
                    type="submit" 
                    form="security-form"
                    disabled={saveSecuritySettingsMutation.isPending}
                    className="flex items-center"
                  >
                    <Save className="h-4 w-4 mr-1.5" />
                    {saveSecuritySettingsMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Users & Roles */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Users & Roles</CardTitle>
                  <CardDescription>
                    Manage user accounts and permission roles
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-3 text-neutral-300" />
                    <h3 className="text-lg font-medium text-neutral-700 mb-1">User Management</h3>
                    <p className="text-neutral-500 mb-4">User management functionality will be implemented soon</p>
                    <Button disabled>
                      Manage Users
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Organization */}
            <TabsContent value="organization">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Organization</CardTitle>
                  <CardDescription>
                    Organization-specific settings and configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 mx-auto mb-3 text-neutral-300" />
                    <h3 className="text-lg font-medium text-neutral-700 mb-1">Organization Settings</h3>
                    <p className="text-neutral-500 mb-4">Organization settings will be implemented soon</p>
                    <Button disabled>
                      Configure Organization
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Management */}
            <TabsContent value="data">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Data Management</CardTitle>
                  <CardDescription>
                    Import, export, and manage your HR data
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <Database className="h-12 w-12 mx-auto mb-3 text-neutral-300" />
                    <h3 className="text-lg font-medium text-neutral-700 mb-1">Data Management Tools</h3>
                    <p className="text-neutral-500 mb-4">Data management functionality will be implemented soon</p>
                    <Button disabled>
                      Access Data Tools
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
