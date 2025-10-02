import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BasicQuoteForm } from '../components/forms/BasicQuoteForm';
import { StandardQuoteForm } from '../components/forms/StandardQuoteForm';
import { PremiumQuoteForm } from '../components/forms/PremiumQuoteForm';
import { QuoteTier } from '../lib/supabase';

export const QuoteBuilderPage: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [selectedTier, setSelectedTier] = useState<QuoteTier | null>(null);

  if (!selectedTier) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">VID-QUO Quote Builder</h1>
              <p className="text-gray-600 mt-2">
                Welcome, {profile?.full_name} ({profile?.membership_tier})
              </p>
            </div>
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedTier('basic')}>
              <CardHeader>
                <CardTitle>Basic Quote</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Quick quote generation with essential project details</p>
                <ul className="text-sm space-y-2">
                  <li>• Base Pay: $100-$150</li>
                  <li>• 3 Key Roles</li>
                  <li>• 12 hours edit time</li>
                  <li>• Fastest turnaround</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedTier('standard')}>
              <CardHeader>
                <CardTitle>Standard Quote</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Enhanced accuracy with production scheduling</p>
                <ul className="text-sm space-y-2">
                  <li>• Base Pay: $100-$200</li>
                  <li>• 4 Key Roles</li>
                  <li>• 24 hours edit time</li>
                  <li>• Location-based pricing</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedTier('premium')}>
              <CardHeader>
                <CardTitle>Premium Quote</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Maximum customization and control</p>
                <ul className="text-sm space-y-2">
                  <li>• Base Pay: $100-$300</li>
                  <li>• 6 Key Roles</li>
                  <li>• 48 hours edit time</li>
                  <li>• Crew & profit optimization</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button onClick={() => setSelectedTier(null)} variant="outline">
            ← Back to Quote Selection
          </Button>
        </div>

        {selectedTier === 'basic' && <BasicQuoteForm />}
        {selectedTier === 'standard' && <StandardQuoteForm />}
        {selectedTier === 'premium' && <PremiumQuoteForm />}
      </div>
    </div>
  );
};
