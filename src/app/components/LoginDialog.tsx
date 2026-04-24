import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { handleError } from '../../lib/errorHandler';
import { validators } from '../../lib/validation';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    isProvider: false
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validators.email(loginData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!validators.required(loginData.password)) {
      toast.error('Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(loginData);
      if (success) {
        toast.success('Welcome back!');
        onOpenChange(false);
        setLoginData({ email: '', password: '' });
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      const message = handleError(error, 'LoginDialog');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validators.email(signupData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!validators.name(signupData.username)) {
      toast.error('Please enter a valid name (at least 2 characters, letters only)');
      return;
    }

    if (!validators.phone(signupData.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    const passwordValidation = validators.password(signupData.password);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.errors[0]);
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup(signupData);
      if (success) {
        toast.success('Account created successfully!');
        onOpenChange(false);
        setSignupData({
          username: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          isProvider: false
        });
      } else {
        toast.error('Failed to create account');
      }
    } catch (error) {
      const message = handleError(error, 'LoginDialog');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Welcome to PetConnect</DialogTitle>
          <DialogDescription>
            Sign in to book services or create an account to get started
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>

              {import.meta.env.DEV && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                  <p className="text-yellow-900 font-semibold mb-2">🔨 Development Only:</p>
                  <p className="text-yellow-800 text-xs">Demo: john@example.com / password123</p>
                  <p className="text-yellow-800 text-xs">Provider: contact@pawsitivegrooming.com / provider123</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-username">Username</Label>
                <Input
                  id="signup-username"
                  type="text"
                  placeholder="johndoe"
                  value={signupData.username}
                  onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-phone">Phone</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={signupData.phone}
                  onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500">
                  Only visible to providers for booking cancellations
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirm Password</Label>
                <Input
                  id="signup-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is-provider"
                  checked={signupData.isProvider}
                  onChange={(e) => setSignupData({ ...signupData, isProvider: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is-provider" className="text-sm cursor-pointer">
                  I'm a service provider
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
