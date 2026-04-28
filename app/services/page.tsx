'use client';

import { Coins, ShoppingCart, Bot } from 'lucide-react';
import ServiceCard from '@/components/ui/ServiceCard';

export default function ServicesPage() {
  const services = [
    {
      title: 'Banking System',
      description: 'Secure your wealth with our advanced banking system',
      icon: Coins,
      color: '#FFD700',
      details: [
        'Deposit and withdraw money safely',
        'Earn interest on your savings',
        'Take loans for big projects',
        'Transaction history tracking',
        'Multi-currency support',
      ],
    },
    {
      title: 'Marketplace',
      description: 'Trade items with other players in a secure environment',
      icon: ShoppingCart,
      color: '#00FFFF',
      details: [
        'Buy and sell items easily',
        'Auction system for rare items',
        'Price history and trends',
        'Secure escrow transactions',
        'Shop creation and management',
      ],
    },
    {
      title: 'Cleo AI Assistant',
      description: 'Your personal AI helper for all server needs',
      icon: Bot,
      color: '#8B00FF',
      details: [
        'Answer questions about the server',
        'Help with commands and features',
        'Provide tips and strategies',
        'Report bugs and issues',
        '24/7 availability',
      ],
    },
  ];

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
          Our Services
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Explore our unique features that make your Minecraft experience extraordinary
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            description={service.description}
            icon={service.icon}
            color={service.color}
            details={service.details}
          />
        ))}
      </div>

      <div className="mt-20 text-center">
        <div className="bg-surface rounded-2xl p-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 gradient-text">
            Ready to Get Started?
          </h2>
          <p className="text-gray-300 mb-6">
            Join our server today and experience all these amazing features!
          </p>
          <code className="bg-background px-6 py-3 rounded-lg text-primary text-xl inline-block">
            play.mcserver.com
          </code>
        </div>
      </div>
    </div>
  );
}
