import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Quote } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const draftQuotes = quotes.filter((q) => q.status === 'draft');
  const submittedQuotes = quotes.filter((q) => q.status === 'submitted');
  const approvedQuotes = quotes.filter((q) => q.status === 'approved');
  const totalQuotesValue = quotes.reduce((sum, q) => sum + Number(q.total_amount), 0);
  const recentQuotes = quotes.slice(0, 5);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your quotes and activity</p>
        </div>
        <Button onClick={() => navigate('/create-quote')}>
          Create New Quote
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{quotes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Draft Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{draftQuotes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{submittedQuotes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalQuotesValue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-800">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-900">{submittedQuotes.length}</p>
            <p className="text-xs text-yellow-700 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-800">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-900">{approvedQuotes.length}</p>
            <p className="text-xs text-green-700 mt-1">Ready to proceed</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-800">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{draftQuotes.length}</p>
            <p className="text-xs text-gray-700 mt-1">Not yet submitted</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentQuotes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No quotes found</p>
                <Button onClick={() => navigate('/create-quote')}>
                  Create Your First Quote
                </Button>
              </div>
            ) : (
              recentQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => navigate('/history')}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{quote.client_name}</h3>
                      <p className="text-sm text-gray-600">{quote.production_company_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">${Number(quote.total_amount).toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        quote.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                        quote.status === 'approved' ? 'bg-green-100 text-green-800' :
                        quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {quote.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span className="capitalize">{quote.tier} tier</span>
                    <span>{new Date(quote.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
