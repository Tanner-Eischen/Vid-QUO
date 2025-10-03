import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { QuoteFlowSidebar } from '../components/quote/QuoteFlowSidebar';

export const QuoteReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePrevious = () => {
    navigate('/create-quote/advanced');
  };

  const handleSubmit = async (status: 'draft' | 'submitted') => {
    if (!user) return;

    setLoading(true);

    const quoteData = {
      user_id: user.id,
      client_name: 'Sample Client',
      production_company_name: 'Sample Production',
      project_start_date: new Date().toISOString(),
      project_end_date: new Date().toISOString(),
      num_deliverables: 1,
      avg_length_per_deliverable: 5,
      filming_days: 1,
      hours_per_day: 8,
      num_locations: 1,
      miles_from_service_rep: 0,
      crew_per_setup: 2,
      weight_production_to_profit: 60,
      discount: 0,
      total_amount: 5000,
      status,
    };

    const { error } = await supabase.from('quotes').insert([quoteData]);

    setLoading(false);

    if (error) {
      alert('Error saving quote: ' + error.message);
    } else {
      alert(`Quote ${status === 'draft' ? 'saved as draft' : 'submitted'} successfully!`);
      navigate('/history');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <QuoteFlowSidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <Button onClick={() => navigate('/')} variant="outline" className="mb-4">
            ← Back to Dashboard
          </Button>

          <Card>
          <CardHeader>
            <CardTitle>Step 4: Review Quote</CardTitle>
            <p className="text-sm text-gray-600">Review your quote before submitting</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Quote Summary</h3>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Client Name</p>
                    <p className="font-semibold">Sample Client</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Production Company</p>
                    <p className="font-semibold">Sample Production</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Deliverables</p>
                    <p className="font-semibold">1</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Filming Days</p>
                    <p className="font-semibold">1</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Locations</p>
                    <p className="font-semibold">1</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Crew per Setup</p>
                    <p className="font-semibold">2</p>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-600">$5,000.00</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-3">
                <Button onClick={handlePrevious} variant="outline" disabled={loading}>
                  Previous
                </Button>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleSubmit('draft')}
                    variant="outline"
                    disabled={loading}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => handleSubmit('submitted')}
                    disabled={loading}
                  >
                    Submit Quote
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
