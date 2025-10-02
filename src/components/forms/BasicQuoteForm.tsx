import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const BasicQuoteForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    projectStartDate: '',
    projectEndDate: '',
    productionCompanyName: '',
  });

  const calculateBasicQuote = () => {
    const baseRate = 125;
    const roles = 3;
    const editHours = 12;
    const hourlyRate = 50;

    return baseRate * roles + editHours * hourlyRate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSuccess(false);

    const totalAmount = calculateBasicQuote();

    const { error } = await supabase.from('quotes').insert({
      user_id: user.id,
      tier: 'basic',
      client_name: formData.clientName,
      project_start_date: formData.projectStartDate,
      project_end_date: formData.projectEndDate,
      production_company_name: formData.productionCompanyName,
      total_amount: totalAmount,
    });

    setLoading(false);

    if (error) {
      alert('Error saving quote: ' + error.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Quote</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => handleChange('clientName', e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectStartDate">Project Start Date</Label>
              <Input
                id="projectStartDate"
                type="date"
                value={formData.projectStartDate}
                onChange={(e) => handleChange('projectStartDate', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectEndDate">Project End Date</Label>
              <Input
                id="projectEndDate"
                type="date"
                value={formData.projectEndDate}
                onChange={(e) => handleChange('projectEndDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productionCompanyName">Production Company Name</Label>
            <Input
              id="productionCompanyName"
              value={formData.productionCompanyName}
              onChange={(e) => handleChange('productionCompanyName', e.target.value)}
              required
            />
          </div>

          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm font-semibold">Estimated Total: ${calculateBasicQuote().toFixed(2)}</p>
            <p className="text-xs text-gray-600 mt-1">Based on 3 roles, 12 edit hours</p>
          </div>

          {success && (
            <div className="bg-green-50 text-green-700 p-3 rounded">
              Quote saved successfully!
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Quote'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
