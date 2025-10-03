import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Quote } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export const QuoteHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, [user]);

  const fetchQuotes = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quotes:', error);
    } else {
      setQuotes(data || []);
    }

    setLoading(false);
  };

  const handleDelete = async (quoteId: string) => {
    if (!confirm('Are you sure you want to delete this quote?')) return;

    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', quoteId);

    if (error) {
      alert('Error deleting quote: ' + error.message);
    } else {
      fetchQuotes();
    }
  };

  const exportToPDF = async (quote: Quote) => {
    if (profile?.membership_tier === 'member') {
      alert('PDF export is available for Pro and Executive members only. Please upgrade your membership.');
      return;
    }

    alert('PDF export functionality will be implemented. Quote will be sent to your email.');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button onClick={() => navigate('/')} variant="outline" className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Quote History</h1>
          <p className="text-gray-600 mt-2">View and manage your saved quotes</p>
        </div>

        {quotes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-600">No quotes found. Create your first quote to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <Card key={quote.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{quote.client_name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {quote.production_company_name}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
                      {quote.tier.toUpperCase()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Project Dates</p>
                      <p className="font-medium">
                        {new Date(quote.project_start_date).toLocaleDateString()} - {new Date(quote.project_end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-medium text-lg">${quote.total_amount.toFixed(2)}</p>
                    </div>
                  </div>

                  {quote.tier !== 'basic' && (
                    <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">Deliverables</p>
                        <p className="font-medium">{quote.num_deliverables}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Filming Days</p>
                        <p className="font-medium">{quote.filming_days}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Locations</p>
                        <p className="font-medium">{quote.num_locations}</p>
                      </div>
                    </div>
                  )}

                  {quote.tier === 'premium' && (
                    <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">Crew Size</p>
                        <p className="font-medium">{quote.crew_per_setup}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Profit Weight</p>
                        <p className="font-medium">{quote.weight_production_to_profit}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Discount</p>
                        <p className="font-medium">{quote.discount}%</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToPDF(quote)}
                    >
                      Export PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(quote.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 mt-4">
                    Created: {new Date(quote.created_at).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
