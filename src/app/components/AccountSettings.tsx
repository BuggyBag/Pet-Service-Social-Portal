import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Mail, Lock, Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { handleError } from '../../lib/errorHandler';
import { validators } from '../../lib/validation';

interface AccountSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    username?: string;
    email?: string;
    phone?: string;
  };
}

export default function AccountSettings({
  open,
  onOpenChange,
  user,
}: AccountSettingsProps) {
  const [loading, setLoading] = useState(false);

  // Profile tab state
  const [profileData, setProfileData] = useState({
    username: user.username || '',
    email: user.email || '',
    phone: user.phone || '',
  });

  // Password tab state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Password recovery tab state
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'email' | 'code' | 'reset'>('email');
  const [resetCode, setResetCode] = useState('');
  const [resetPassword, setResetPassword] = useState('');

  const handleUpdateProfile = async () => {
    if (!validators.email(profileData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!validators.name(profileData.username)) {
      toast.error('Please enter a valid name');
      return;
    }

    if (!validators.phone(profileData.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: profileData.username,
          phone: profileData.phone,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update email if changed
      if (profileData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profileData.email,
        });
        if (emailError) throw emailError;
        toast.success('Profile updated! A confirmation email has been sent.');
      } else {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(handleError(error, 'AccountSettings.updateProfile'));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validators.required(passwordData.currentPassword)) {
      toast.error('Please enter your current password');
      return;
    }

    const passwordValidation = validators.password(passwordData.newPassword);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.errors[0]);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // First verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email || '',
        password: passwordData.currentPassword,
      });

      if (signInError) {
        toast.error('Current password is incorrect');
        return;
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (updateError) throw updateError;

      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(handleError(error, 'AccountSettings.changePassword'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordRecoveryRequest = async () => {
    if (!validators.email(recoveryEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        recoveryEmail
      );
      if (error) throw error;

      toast.success('Password reset email sent! Check your inbox.');
      setRecoveryStep('code');
    } catch (error) {
      toast.error(handleError(error, 'AccountSettings.passwordRecovery'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetCode.trim()) {
      toast.error('Please enter the reset code');
      return;
    }

    const passwordValidation = validators.password(resetPassword);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.errors[0]);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: recoveryEmail,
        token: resetCode,
        type: 'recovery',
      });

      if (error) throw error;

      const { error: updateError } = await supabase.auth.updateUser({
        password: resetPassword,
      });

      if (updateError) throw updateError;

      toast.success('Password reset successfully!');
      setRecoveryEmail('');
      setResetCode('');
      setResetPassword('');
      setRecoveryStep('email');
    } catch (error) {
      toast.error(handleError(error, 'AccountSettings.resetPassword'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your account information and security
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="recovery">Recovery</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 mt-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-sm text-blue-800">
                Update your profile information. If you change your email, you'll
                receive a confirmation link.
              </p>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="username"
                value={profileData.username}
                onChange={(e) =>
                  setProfileData({ ...profileData, username: e.target.value })
                }
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData({ ...profileData, phone: e.target.value })
                }
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <Button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password" className="space-y-4 mt-4">
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <p className="text-sm text-yellow-800">
                Keep your account secure by using a strong password.
              </p>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="current-password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Current Password
              </Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-600">
                Must be 8+ characters with uppercase letter and number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
              />
            </div>

            <Button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Updating...' : 'Change Password'}
            </Button>
          </TabsContent>

          {/* Recovery Tab */}
          <TabsContent value="recovery" className="space-y-4 mt-4">
            <Card className="p-4 bg-green-50 border-green-200">
              <p className="text-sm text-green-800">
                Reset your password via email if you forget it.
              </p>
            </Card>

            {recoveryStep === 'email' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="recovery-email">Email Address</Label>
                  <Input
                    id="recovery-email"
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>

                <Button
                  onClick={handlePasswordRecoveryRequest}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? 'Sending...' : 'Send Reset Email'}
                </Button>
              </>
            )}

            {recoveryStep === 'code' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="reset-code">Reset Code</Label>
                  <Input
                    id="reset-code"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Enter code from email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reset-password">New Password</Label>
                  <Input
                    id="reset-password"
                    type="password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <Button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setRecoveryStep('email')}
                  className="w-full"
                >
                  Back
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}