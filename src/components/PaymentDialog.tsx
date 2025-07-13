import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: string;
    period: string;
    features: string[];
  };
}

const PaymentDialog = ({ isOpen, onClose, plan }: PaymentDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'flutterwave' | 'paystack'>('flutterwave');
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // TODO: Replace with actual payment integration once APIs are provided
      // For now, simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful!",
        description: `Welcome to ${plan.name}. Your subscription is now active.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Subscription</DialogTitle>
          <DialogDescription>
            You're about to subscribe to {plan.name} for ${plan.price} {plan.period}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Summary */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">{plan.name}</h3>
              <Badge variant="secondary">${plan.price}/{plan.period.replace('per ', '')}</Badge>
            </div>
            <div className="space-y-2">
              {plan.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
              {plan.features.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{plan.features.length - 3} more features
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <h4 className="font-medium">Choose Payment Method</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedPaymentMethod('flutterwave')}
                className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  selectedPaymentMethod === 'flutterwave' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted hover:border-primary/50'
                }`}
              >
                <CreditCard className="h-5 w-5" />
                <span className="text-sm font-medium">Flutterwave</span>
                <span className="text-xs text-muted-foreground">Global payments</span>
              </button>
              
              <button
                onClick={() => setSelectedPaymentMethod('paystack')}
                className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  selectedPaymentMethod === 'paystack' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted hover:border-primary/50'
                }`}
              >
                <Globe className="h-5 w-5" />
                <span className="text-sm font-medium">Paystack</span>
                <span className="text-xs text-muted-foreground">African payments</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 gradient-primary text-white"
            >
              {isProcessing ? 'Processing...' : `Pay $${plan.price}`}
            </Button>
          </div>

          {/* Security Note */}
          <div className="text-xs text-center text-muted-foreground">
            Your payment is secured with 256-bit SSL encryption
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;