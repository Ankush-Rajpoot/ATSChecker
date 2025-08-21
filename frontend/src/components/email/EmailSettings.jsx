import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Settings, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import useAuthStore from '../../store/authStore';

const EmailSettings = () => {
  const { user } = useAuthStore();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    loadEmailSettings();
  }, []);

  const loadEmailSettings = async () => {
    try {
      const token = localStorage.getItem('auth-storage');
      const authData = token ? JSON.parse(token) : null;
      
      if (!authData?.state?.token) return;

      const response = await fetch(`${API_BASE_URL}/email/settings`, {
        headers: {
          'Authorization': `Bearer ${authData.state.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Failed to load email settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    try {
      setSending(true);
      setResult(null);
      
      const token = localStorage.getItem('auth-storage');
      const authData = token ? JSON.parse(token) : null;
      
      if (!authData?.state?.token) {
        setResult({ success: false, message: 'Not authenticated' });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/email/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authData.state.token}`
        }
      });

      const data = await response.json();
      setResult(data);
      
      if (data.success && data.data?.previewUrl) {
        console.log('📧 Email preview URL:', data.data.previewUrl);
      }
    } catch (error) {
      console.error('Test email failed:', error);
      setResult({ success: false, message: 'Failed to send test email' });
    } finally {
      setSending(false);
    }
  };

  const sendDashboardSummary = async () => {
    try {
      setSending(true);
      setResult(null);
      
      const token = localStorage.getItem('auth-storage');
      const authData = token ? JSON.parse(token) : null;
      
      if (!authData?.state?.token) {
        setResult({ success: false, message: 'Not authenticated' });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/email/dashboard-summary`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authData.state.token}`
        }
      });

      const data = await response.json();
      setResult(data);
      
      if (data.success && data.data?.previewUrl) {
        console.log('📧 Email preview URL:', data.data.previewUrl);
      }
    } catch (error) {
      console.error('Dashboard email failed:', error);
      setResult({ success: false, message: 'Failed to send dashboard summary' });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-[#0A0A0A] border-[#171717]">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader className="w-6 h-6 animate-spin text-[#A3A3A3]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#0A0A0A] border-[#171717]">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#373737] to-[#262626] rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-[#A3A3A3]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#A3A3A3]">Email Notifications</h3>
            <p className="text-[#737373] text-sm">Manage your email preferences and test email delivery</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Email Status */}
        <div className="p-4 rounded-lg border border-[#262626] bg-[#171717]/30">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-[#A3A3A3]">Email Service Status</h4>
              <p className="text-xs text-[#737373] mt-1">
                {settings?.userEmail || user?.email}
              </p>
            </div>
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              settings?.emailNotificationsEnabled 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {settings?.emailNotificationsEnabled ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  <span>Enabled</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" />
                  <span>Disabled</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Email Features */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[#A3A3A3]">Email Features</h4>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-[#262626] bg-[#171717]/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#A3A3A3]">Report Completion</p>
                  <p className="text-xs text-[#737373]">Get notified when analysis completes</p>
                </div>
              </div>
              <span className="text-xs text-green-400 font-medium">Auto-enabled</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-[#262626] bg-[#171717]/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#A3A3A3]">Dashboard Summary</p>
                  <p className="text-xs text-[#737373]">Weekly progress reports</p>
                </div>
              </div>
              <span className="text-xs text-green-400 font-medium">Available</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[#A3A3A3]">Test Email Service</h4>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={sendTestEmail}
              disabled={sending || !settings?.emailNotificationsEnabled}
              variant="outline"
              size="sm"
              className="flex-1 bg-[#171717] hover:bg-[#262626] text-[#A3A3A3] border-[#373737]"
            >
              {sending ? (
                <Loader className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send Test Email
            </Button>
            
            <Button
              onClick={sendDashboardSummary}
              disabled={sending || !settings?.emailNotificationsEnabled}
              variant="outline"
              size="sm"
              className="flex-1 bg-[#171717] hover:bg-[#262626] text-[#A3A3A3] border-[#373737]"
            >
              {sending ? (
                <Loader className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              Send Dashboard Summary
            </Button>
          </div>
        </div>

        {/* Result Message */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg border text-sm ${
              result.success
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            <div className="flex items-center space-x-2">
              {result.success ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>{result.message}</span>
            </div>
            {result.success && result.data?.previewUrl && (
              <p className="text-xs mt-2 text-[#737373]">
                Email sent successfully! Check your inbox or view the{' '}
                <a 
                  href={result.data.previewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  email preview
                </a>
              </p>
            )}
          </motion.div>
        )}

        {!settings?.emailNotificationsEnabled && (
          <div className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 text-sm">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Email notifications are currently disabled in the server configuration.</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailSettings;
