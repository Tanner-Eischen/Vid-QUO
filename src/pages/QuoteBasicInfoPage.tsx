import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export const QuoteBasicInfoPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNext = () => {
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
            <CardTitle>Step 1: Basic Information</CardTitle>
            <p className="text-sm text-gray-600">Enter client and project details</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                placeholder="Enter client name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productionCompany">Production Company Name</Label>
              <Input
                id="productionCompany"
                placeholder="Enter production company name"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Project Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Project End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button onClick={handleNext}>
                Next: Production Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
