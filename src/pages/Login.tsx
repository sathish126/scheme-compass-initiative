
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-healthcare-700">Healthcare Scheme Compass</h1>
          <p className="text-muted-foreground mt-2">Log in to access your dashboard</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-healthcare-600 hover:text-healthcare-500">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-healthcare-600 hover:bg-healthcare-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" /> Please wait
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 text-center text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-left">
            <div className="p-2 bg-gray-50 rounded-md">
              <p><strong>Facility User:</strong></p>
              <p>jane.smith@facility.com</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-md">
              <p><strong>Hospital Admin:</strong></p>
              <p>michael.johnson@hospital.com</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-md">
              <p><strong>District Admin:</strong></p>
              <p>amanda.lee@district.com</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-md">
              <p><strong>State Admin:</strong></p>
              <p>robert.chen@state.com</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-md col-span-1 md:col-span-2">
              <p><strong>Super Admin:</strong></p>
              <p>sarah.williams@super.com</p>
            </div>
          </div>
          <p className="mt-4 text-muted-foreground">You can use any password</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
