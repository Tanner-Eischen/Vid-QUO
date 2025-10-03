import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, QuoteTier } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { QuoteWizard } from '../components/wizard/QuoteWizard';

export const CreateQuotePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<QuoteTier | null>(null);

  if (selectedTier) {
    return <QuoteWizard tier={selectedTier} onBack={() => setSelectedTier(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button onClick={() => navigate('/')} variant="outline">
            ← Back to Dashboard
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Quote</h1>
          <p className="text-gray-600 mt-2">Select a quote tier to get started</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:border-blue-500"
            onClick={() => setSelectedTier('basic')}
          >
            <CardHeader>
              <CardTitle>Basic Quote</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Quick quote generation with essential project details
              </p>
              <ul className="text-sm space-y-2">
                <li>• Base Pay: $100-$150</li>
                <li>• 3 Key Roles</li>
                <li>• 12 hours edit time</li>
                <li>• Fastest turnaround</li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:border-blue-500"
            onClick={() => setSelectedTier('standard')}
          >
            <CardHeader>
              <CardTitle>Standard Quote</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Enhanced accuracy with production scheduling
              </p>
              <ul className="text-sm space-y-2">
                <li>• Base Pay: $100-$200</li>
                <li>• 4 Key Roles</li>
                <li>• 24 hours edit time</li>
                <li>• Location-based pricing</li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:border-blue-500"
            onClick={() => setSelectedTier('premium')}
          >
            <CardHeader>
              <CardTitle>Premium Quote</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Maximum customization and control
              </p>
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
};
