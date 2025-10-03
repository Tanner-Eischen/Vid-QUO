import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export const QuoteProductionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/create-quote/advanced');
  };

  const handlePrevious = () => {
    navigate('/create-quote/basic');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button onClick={() => navigate('/')} variant="outline" className="mb-4">
          ← Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Production Details</CardTitle>
            <p className="text-sm text-gray-600">Specify filming and deliverable information</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deliverables">Number of Deliverables</Label>
                <Input
                  id="deliverables"
                  type="number"
                  min="1"
                  defaultValue="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avgLength">Avg Length per Deliverable (min)</Label>
                <Input
                  id="avgLength"
                  type="number"
                  min="1"
                  defaultValue="5"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filmingDays">Filming Days</Label>
                <Input
                  id="filmingDays"
                  type="number"
                  min="1"
                  defaultValue="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hoursPerDay">Hours per Day</Label>
                <Input
                  id="hoursPerDay"
                  type="number"
                  min="1"
                  defaultValue="8"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="locations">Number of Locations</Label>
                <Input
                  id="locations"
                  type="number"
                  min="1"
                  defaultValue="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="miles">Miles from Service Rep</Label>
                <Input
                  id="miles"
                  type="number"
                  min="0"
                  defaultValue="0"
                />
              </div>
            </div>

            <div className="flex justify-between gap-3 mt-6">
              <Button onClick={handlePrevious} variant="outline">
                Previous
              </Button>
              <Button onClick={handleNext}>
                Next: Advanced Options
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
