'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Crown,
  Zap,
  Users,
  FileText,
  UserCheck,
  CheckCircle,
  ArrowRight,
  X,
  Star,
  Sparkles
} from 'lucide-react';

interface PlanFeature {
  name: string;
  basic: string | number | boolean;
  pro: string | number | boolean;
  premium: string | number | boolean;
}

interface UpgradePromptProps {
  trigger: 'clients' | 'scripts' | 'therapists' | 'general';
  currentPlan?: 'basic' | 'pro';
  onUpgrade?: (plan: 'pro' | 'premium') => void;
  onClose?: () => void;
  isModal?: boolean;
}

const planFeatures: PlanFeature[] = [
  {
    name: 'Klien per hari',
    basic: 15,
    pro: 50,
    premium: 'Unlimited'
  },
  {
    name: 'Skrip per hari',
    basic: 50,
    pro: 200,
    premium: 'Unlimited'
  },
  {
    name: 'Terapis aktif',
    basic: 3,
    pro: 10,
    premium: 'Unlimited'
  },
  {
    name: 'Template skrip',
    basic: 'Dasar',
    pro: 'Lanjutan',
    premium: 'Semua'
  },
  {
    name: 'Analitik lanjutan',
    basic: false,
    pro: true,
    premium: true
  },
  {
    name: 'Integrasi API',
    basic: false,
    pro: false,
    premium: true
  },
  {
    name: 'Support prioritas',
    basic: false,
    pro: true,
    premium: true
  },
  {
    name: 'Custom branding',
    basic: false,
    pro: false,
    premium: true
  }
];

const planPricing = {
  basic: { price: 0, period: 'gratis' },
  pro: { price: 299000, period: 'bulan' },
  premium: { price: 599000, period: 'bulan' }
};

export function UpgradePrompt({ 
  trigger, 
  currentPlan = 'basic',
  onUpgrade,
  onClose,
  isModal = false 
}: UpgradePromptProps) {
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'premium'>('pro');

  const getTriggerMessage = () => {
    switch (trigger) {
      case 'clients':
        return {
          title: 'Batas Klien Tercapai',
          message: 'Tingkatkan paket untuk menambah lebih banyak klien hari ini.',
          icon: Users,
          color: 'blue'
        };
      case 'scripts':
        return {
          title: 'Batas Skrip Tercapai',
          message: 'Tingkatkan paket untuk membuat lebih banyak skrip hari ini.',
          icon: FileText,
          color: 'green'
        };
      case 'therapists':
        return {
          title: 'Batas Terapis Tercapai',
          message: 'Tingkatkan paket untuk menambah lebih banyak terapis.',
          icon: UserCheck,
          color: 'purple'
        };
      default:
        return {
          title: 'Tingkatkan Paket Anda',
          message: 'Dapatkan akses ke fitur premium dan batas penggunaan yang lebih tinggi.',
          icon: Crown,
          color: 'yellow'
        };
    }
  };

  const triggerInfo = getTriggerMessage();
  const TriggerIcon = triggerInfo.icon;

  const formatFeatureValue = (value: string | number | boolean) => {
    if (typeof value === 'boolean') {
      return value ? <CheckCircle className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-gray-400" />;
    }
    return value;
  };

  const handleUpgradeClick = (plan: 'pro' | 'premium') => {
    if (onUpgrade) {
      onUpgrade(plan);
    } else {
      // Default behavior - would typically redirect to payment
      console.log(`Upgrading to ${plan} plan`);
    }
  };

  const content = (
    <div className="space-y-6">
      {/* Trigger Message */}
      <Card className={`border-${triggerInfo.color}-200 bg-${triggerInfo.color}-50`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-${triggerInfo.color}-100`}>
              <TriggerIcon className={`h-6 w-6 text-${triggerInfo.color}-600`} />
            </div>
            <div>
              <h3 className={`font-semibold text-lg text-${triggerInfo.color}-800`}>
                {triggerInfo.title}
              </h3>
              <p className={`text-${triggerInfo.color}-700 mt-1`}>
                {triggerInfo.message}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pro Plan */}
        <Card className={`relative ${selectedPlan === 'pro' ? 'ring-2 ring-blue-500 border-blue-200' : ''}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Pro
              </CardTitle>
              <Badge variant="default">Populer</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">Rp {planPricing.pro.price.toLocaleString('id-ID')}</span>
              <span className="text-gray-600">/{planPricing.pro.period}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {planFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{feature.name}</span>
                  <span className="font-medium">
                    {formatFeatureValue(feature.pro)}
                  </span>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full"
              onClick={() => handleUpgradeClick('pro')}
              disabled={currentPlan === 'pro'}
            >
              {currentPlan === 'pro' ? 'Paket Saat Ini' : 'Pilih Pro'}
            </Button>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className={`relative ${selectedPlan === 'premium' ? 'ring-2 ring-purple-500 border-purple-200' : ''}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-purple-600" />
                Premium
              </CardTitle>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Star className="h-3 w-3 mr-1" />
                Terbaik
              </Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">Rp {planPricing.premium.price.toLocaleString('id-ID')}</span>
              <span className="text-gray-600">/{planPricing.premium.period}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {planFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{feature.name}</span>
                  <span className="font-medium">
                    {formatFeatureValue(feature.premium)}
                  </span>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => handleUpgradeClick('premium')}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Pilih Premium
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Highlight */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Keuntungan Upgrade
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-blue-600" />
              <span>Batas penggunaan lebih tinggi</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-blue-600" />
              <span>Fitur analitik lanjutan</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-blue-600" />
              <span>Template skrip eksklusif</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-blue-600" />
              <span>Support prioritas 24/7</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guarantee */}
      <div className="text-center text-sm text-gray-600">
        <p>💰 Garansi uang kembali 30 hari</p>
        <p>📞 Support pelanggan 24/7</p>
        <p>🔒 Data aman dan terenkripsi</p>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-yellow-600" />
              Tingkatkan Paket Langganan
            </DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Tingkatkan Paket Anda</h2>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {content}
    </div>
  );
}

// Hook untuk menampilkan upgrade prompt
export function useUpgradePrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [trigger, setTrigger] = useState<UpgradePromptProps['trigger']>('general');

  const showUpgradePrompt = (triggerType: UpgradePromptProps['trigger']) => {
    setTrigger(triggerType);
    setIsOpen(true);
  };

  const hideUpgradePrompt = () => {
    setIsOpen(false);
  };

  const UpgradeModal = ({ onUpgrade }: { onUpgrade?: (plan: 'pro' | 'premium') => void }) => (
    isOpen ? (
      <UpgradePrompt
        trigger={trigger}
        isModal={true}
        onUpgrade={onUpgrade}
        onClose={hideUpgradePrompt}
      />
    ) : null
  );

  return {
    showUpgradePrompt,
    hideUpgradePrompt,
    UpgradeModal
  };
}