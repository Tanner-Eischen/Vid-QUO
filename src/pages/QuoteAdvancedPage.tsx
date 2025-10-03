import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export const QuoteAdvancedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/create-quote/review');
  };

  const handlePrevious = () => {
    navigate('/create-quote/production');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button onClick={() => navigate('/')} variant="outline" className="mb-4">
          ← Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Advanced Options</CardTitle>
            <p className="text-sm text-gray-600">Fine-tune crew size and pricing</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="crewSize">Crew per Setup</Label>
              <Input
                id="crewSize"
                type="number"
                min="1"
                defaultValue="2"
              />
              <p className="text-xs text-gray-500">Number of crew members needed per filming setup</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profitWeight">Weight Production to Profit (%)</Label>
              <Input
                id="profitWeight"
                type="number"
                min="0"
                max="100"
                defaultValue="60"
              />
              <p className="text-xs text-gray-500">
                Percentage allocated to production costs vs profit margin (0-100)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                defaultValue="0"
              />
              <p className="text-xs text-gray-500">Apply a discount percentage to the final quote</p>
            </div>

            <div className="flex justify-between gap-3 mt-6">
              <Button onClick={handlePrevious} variant="outline">
                Previous
              </Button>
              <Button onClick={handleNext}>
                Next: Review Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
