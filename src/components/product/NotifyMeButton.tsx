import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';

// Change relative URL to absolute with proper backend server
const API_URL = 'http://localhost:5000/api';

// Schema for email validation
const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type EmailFormValues = z.infer<typeof emailSchema>;

interface NotifyMeButtonProps {
  productId: string;
  productName: string;
  className?: string;
}

const NotifyMeButton = ({ productId, productName, className }: NotifyMeButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, token } = useAuth();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user?.email || '',
    },
  });

  const handleNotifyClick = () => {
    if (user) {
      // If user is logged in, subscribe directly
      subscribeToNotifications(user.email);
    } else {
      // If no user, open dialog to collect email
      setIsDialogOpen(true);
    }
  };

  const subscribeToNotifications = async (email: string) => {
    setIsSubmitting(true);
    
    try {
      console.log('Subscribing with:', { email, productId });
      
      if (!email || !productId) {
        toast.error('Both email and product ID are required');
        setIsSubmitting(false);
        return;
      }
      
      // Check if productId looks like a MongoDB ObjectId (24 hex chars)
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(productId);
      if (!isValidObjectId) {
        console.error('Invalid ObjectId format:', productId);
        toast.error('Invalid product ID format');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        email,
        productId,
      };
      
      console.log('Request payload:', payload);
      
      const response = await fetch(`${API_URL}/notifications/stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        toast.success('You will be notified when this product is back in stock');
        reset();
        setIsDialogOpen(false);
      } else {
        toast.error(data.error || 'Failed to subscribe for notifications');
        console.error('Error response:', data);
      }
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      toast.error('Failed to subscribe for notifications');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (values: EmailFormValues) => {
    subscribeToNotifications(values.email);
  };

  return (
    <>
      <Button 
        variant="outline" 
        className={`${className} flex items-center gap-2`}
        onClick={handleNotifyClick}
      >
        <Bell size={16} />
        Notify Me When In Stock
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Get notified when back in stock</DialogTitle>
            <DialogDescription>
              Enter your email address to be notified when {productName} is back in stock.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Notify Me'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotifyMeButton; 