import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

// Admin verification code - in a real app, this would be stored securely
const ADMIN_VERIFICATION_CODE = "ADMIN123";

// Form validation schema
const registerSchema = z.object({
  fullName: z.string().min(2, { message: 'Please enter your full name.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
  role: z.enum(['user', 'admin']).default('user'),
  adminCode: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine(
  (data) => {
    // Only validate admin code if role is admin
    if (data.role === 'admin') {
      return data.adminCode === ADMIN_VERIFICATION_CODE;
    }
    return true;
  },
  {
    message: "Invalid admin verification code",
    path: ["adminCode"],
  }
);

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const navigate = useNavigate();
  const { register, error: authError, loading } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      adminCode: '',
      termsAccepted: false,
    },
  });

  // Watch for role changes to show/hide admin code field
  const role = form.watch('role');
  
  useEffect(() => {
    setShowAdminCode(role === 'admin');
  }, [role]);

  // Handle form submission
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // If admin role but invalid code, prevent registration
      if (data.role === 'admin' && data.adminCode !== ADMIN_VERIFICATION_CODE) {
        toast.error('Please enter a valid admin verification code');
        return;
      }
      
      // Use the register function from AuthProvider
      await register(data.fullName, data.email, data.password, data.role);
      
      // Show success toast
      toast.success('Account created successfully!');
      
      // Redirect to home page
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(authError || 'Registration failed. Please try again.');
    }
  };

  // Handle Google login success
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      // Extract the token from the response
      const { credential } = credentialResponse;
      
      // Call the registerWithGoogle function from AuthProvider
      // This will need to be implemented in your AuthProvider component
      await register(null, null, null, 'user', credential);
      
      // Show success toast
      toast.success('Account created successfully with Google!');
      
      // Redirect to home page
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(authError || 'Failed to sign up with Google. Please try again.');
    }
  };

  // Handle Google login error
  const handleGoogleError = () => {
    toast.error('Google sign-up was cancelled or failed. Please try again.');
  };

  return (
    <section className="py-6 px-4 min-h-screen overflow-auto">
      <div className="container mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-lg shadow-lg p-6"
        >
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-muted-foreground text-sm mt-1">Join CultureDrop and explore urban cultures</p>
          </div>

          {/* Google Sign-up Button */}
          <div className="mb-4">
            <div className="flex justify-center mb-3">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_black"
                text="signup_with"
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="h-9" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} className="h-9" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...field}
                            className="h-9 pr-8"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-9 w-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          <span className="sr-only">
                            {showPassword ? 'Hide password' : 'Show password'}
                          </span>
                        </Button>
                      </div>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Confirm</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...field}
                            className="h-9 pr-8"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-9 w-8"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          <span className="sr-only">
                            {showConfirmPassword ? 'Hide password' : 'Show password'}
                          </span>
                        </Button>
                      </div>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <FormDescription className="text-xs -mt-1 mb-0 pb-0">
                Password must be at least 8 characters
              </FormDescription>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Account Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">Regular User</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {showAdminCode && (
                <>
                  <Alert variant="default" className="py-2 text-xs bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30">
                    <AlertCircle className="h-3 w-3" />
                    <AlertTitle className="text-xs font-medium">Admin verification required</AlertTitle>
                    <AlertDescription className="text-xs">
                      Enter the admin code to create an admin account
                    </AlertDescription>
                  </Alert>
                  
                  <FormField
                    control={form.control}
                    name="adminCode"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Admin Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter admin code" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0 pt-1">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-xs font-normal">
                        I agree to the{' '}
                        <Link
                          to="/terms"
                          className="text-primary hover:underline"
                        >
                          terms and conditions
                        </Link>
                      </FormLabel>
                      <FormMessage className="text-xs" />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-9 mt-2" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="text-center mt-3">
                <p className="text-xs text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-primary hover:underline font-medium inline-flex items-center"
                  >
                    Sign in
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

export default Register; 