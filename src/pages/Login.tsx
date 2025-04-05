import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  rememberMe: z.boolean().default(false)
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, error: authError, loading, isAuthenticated } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Get the location to redirect to after login (from state)
  const from = location.state?.from || '/';

  // Reset login error when form is changed
  useEffect(() => {
    // If the user is already authenticated, redirect to the appropriate page
    if (isAuthenticated) {
      navigate(from);
    }
  }, [isAuthenticated, navigate, from]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    },
  });

  // Listen for form changes to clear errors
  useEffect(() => {
    const subscription = form.watch(() => {
      if (loginError) {
        setLoginError(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, loginError]);

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    setLoginError(null);
    
    try {
      // Use the login function from AuthProvider with remember me option
      await login(data.email, data.password, data.rememberMe);
      
      // If there's no error from the auth provider but we're not authenticated yet,
      // we won't show a success message until we confirm authentication
      if (!authError) {
        // Show success toast
        toast.success('Login successful! Redirecting...');
        // We'll let the useEffect handle the redirect
      }
    } catch (error) {
      console.error('Login error:', error);
      // Set the login error state
      setLoginError(authError || 'Invalid email or password. Please try again.');
    }
  };

  // Handle Google login success
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoginError(null);
      // Extract the token from the response
      const { credential } = credentialResponse;
      
      // Call the loginWithGoogle function from AuthProvider
      await loginWithGoogle(credential);
      
      // If there's no error from the auth provider but we're not authenticated yet,
      // we won't show a success message until we confirm authentication
      if (!authError) {
        // Show success toast
        toast.success('Login successful with Google! Redirecting...');
        // We'll let the useEffect handle the redirect
      }
    } catch (error) {
      console.error('Google login error:', error);
      setLoginError(authError || 'Failed to sign in with Google. Please try again.');
    }
  };

  // Handle Google login error
  const handleGoogleError = () => {
    toast.error('Google sign-in was cancelled or failed. Please try again.');
  };

  return (
    <section className="py-16 px-4 min-h-[80vh] flex items-center">
      <div className="container mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-lg shadow-lg p-8"
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your CultureDrop account</p>
          </div>

          {loginError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          {/* Google Sign-in Button */}
          <div className="mb-4">
            <div className="flex justify-center mb-3">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_black"
                text="signin_with"
                shape="rectangular"
                locale="en"
              />
            </div>
            
            <div className="relative my-4">
              <Separator />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                OR
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">
                          {showPassword ? 'Hide password' : 'Show password'}
                        </span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer">Remember me</FormLabel>
                    </FormItem>
                  )}
                />
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-primary hover:underline font-medium inline-flex items-center"
                  >
                    Create account
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
};

export default Login; 