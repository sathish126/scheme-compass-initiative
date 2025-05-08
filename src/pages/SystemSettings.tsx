
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Database, Shield, Link as LinkIcon, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SystemSettings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">Configure HDIMS system parameters</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Database className="mr-2 h-5 w-5 text-healthcare-600" />
            <CardTitle>Data Management</CardTitle>
          </div>
          <CardDescription>Configure data collection and storage settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Data Retention Period</label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1">
              <option value="90days">90 Days</option>
              <option value="180days">180 Days</option>
              <option value="1year" selected>1 Year</option>
              <option value="3years">3 Years</option>
              <option value="5years">5 Years</option>
              <option value="indefinite">Indefinite</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Data Backup Frequency</label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1">
              <option value="daily" selected>Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <Button variant="outline" className="w-full">Apply Data Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-healthcare-600" />
            <CardTitle>Security Settings</CardTitle>
          </div>
          <CardDescription>Configure system security parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Session Timeout (minutes)</label>
            <input 
              type="number" 
              defaultValue={30} 
              min={5} 
              max={120} 
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enforce Two-Factor Authentication</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Allow Mobile Access</label>
            <input type="checkbox" defaultChecked />
          </div>
          <Button variant="outline" className="w-full">Update Security Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <LinkIcon className="mr-2 h-5 w-5 text-healthcare-600" />
            <CardTitle>Integration Settings</CardTitle>
          </div>
          <CardDescription>Configure external system integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">API Keys</label>
            <Textarea 
              placeholder="Enter API keys for external integrations"
              className="mt-1"
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enable External API Access</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div>
            <label className="text-sm font-medium">Integration Sync Frequency</label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1">
              <option value="5min">Every 5 minutes</option>
              <option value="15min" selected>Every 15 minutes</option>
              <option value="30min">Every 30 minutes</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
          <Button variant="outline" className="w-full">Save Integration Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-healthcare-600" />
            <CardTitle>Administrative Settings</CardTitle>
          </div>
          <CardDescription>Configure system administrative parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">System Notification Email</label>
            <input 
              type="email" 
              defaultValue="admin@healthcare.gov.in" 
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enable System Audit Logs</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Send Monthly Reports</label>
            <input type="checkbox" defaultChecked />
          </div>
          <Button variant="outline" className="w-full">Update Administrative Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
