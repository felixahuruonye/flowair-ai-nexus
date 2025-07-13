
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';
import PaymentDialog from './PaymentDialog';

const PricingSection = () => {
  const plans = [
    {
      name: "Free Starter",
      price: "0",
      period: "forever",
      description: "Perfect for trying out FlowAIr",
      badge: null,
      features: [
        "5 AI bot tasks per month",
        "Access to 10 basic AI bots",
        "Standard response time",
        "Email support",
        "Basic templates",
        "Community access"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Pro Monthly",
      price: "29",
      period: "per month",
      description: "Everything you need to scale your productivity",
      badge: "Most Popular",
      features: [
        "Unlimited AI bot tasks",
        "Access to all 24 AI bots",
        "Priority response time",
        "Email & chat support",
        "Premium templates",
        "Advanced customization",
        "Export in multiple formats",
        "Usage analytics",
        "API access"
      ],
      buttonText: "Start Pro Trial",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Pro Yearly",
      price: "290",
      period: "per year",
      description: "Best value with 2 months free",
      badge: "Best Value",
      features: [
        "Everything in Pro Monthly",
        "2 months free (save $88)",
        "Priority customer support",
        "Early access to new bots",
        "Custom integrations",
        "Team collaboration tools",
        "Advanced analytics",
        "White-label options",
        "Dedicated account manager"
      ],
      buttonText: "Choose Yearly",
      buttonVariant: "default" as const,
      popular: false
    }
  ];

  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const handlePlanSelect = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setIsPaymentDialogOpen(true);
  };

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Flexible Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Choose Your
            <span className="text-gradient"> Perfect Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Start free and upgrade when you're ready. All plans include access to our growing library 
            of AI job bots with no hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-primary shadow-lg scale-105 bg-gradient-to-b from-primary/5 to-transparent' 
                  : 'hover:scale-102'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="gradient-primary text-white px-4 py-1">
                    {plan.badge === "Most Popular" && <Crown className="w-3 h-3 mr-1" />}
                    {plan.badge === "Best Value" && <Zap className="w-3 h-3 mr-1" />}
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground"> {plan.period}</span>
                </div>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features List */}
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="gradient-primary p-1 rounded-full mt-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  variant={plan.buttonVariant}
                  className={`w-full py-3 font-semibold ${
                    plan.buttonVariant === 'default' 
                      ? 'gradient-primary text-white hover:opacity-90' 
                      : 'border-2 hover:bg-muted'
                  }`}
                  size="lg"
                  onClick={() => handlePlanSelect(plan)}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <div className="bg-muted/30 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">All Plans Include:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                No Setup Fees
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Cancel Anytime
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Secure Payments
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                24/7 Support
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Questions about our pricing? <a href="#contact" className="text-primary hover:underline">Contact our sales team</a> for custom enterprise solutions.
            </p>
          </div>
        </div>

        {/* Payment Dialog */}
        {selectedPlan && (
          <PaymentDialog
            isOpen={isPaymentDialogOpen}
            onClose={() => {
              setIsPaymentDialogOpen(false);
              setSelectedPlan(null);
            }}
            plan={selectedPlan}
          />
        )}
      </div>
    </section>
  );
};

export default PricingSection;
