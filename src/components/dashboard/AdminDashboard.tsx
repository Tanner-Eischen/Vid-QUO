import React, { useEffect, useState } from 'react';
import { supabase, Quote, Profile } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useNavigate } from 'react-router-dom';

interface ClientSummary {
  profile: Profile;
  totalQuotes: number;
  submittedQuotes: number;
  totalValue: number;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [quotesResult, profilesResult] = await Promise.all([
      supabase.from('quotes').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').eq('role', 'client'),
    ]);

    if (quotesResult.data) {
      setQuotes(quotesResult.data);
    }

    if (profilesResult.data) {
      const clientSummaries = profilesResult.data.map((profile) => {
        const clientQuotes = quotesResult.data?.filter((q) => q.user_id === profile.id) || [];
        const submittedQuotes = clientQuotes.filter((q) => q.status === 'submitted');
        const totalValue = clientQuotes.reduce((sum, q) => sum + Number(q.total_amount), 0);

        return {
          profile,
          totalQuotes: clientQuotes.length,
          submittedQuotes: submittedQuotes.length,
          totalValue,
        };
      });

      setClients(clientSummaries);
    }

    setLoading(false);
  };

  const recentQuotes = quotes.slice(0, 5);
  const submittedQuotes = quotes.filter((q) => q.status === 'submitted');
  const totalQuotesValue = quotes.reduce((sum, q) => sum + Number(q.total_amount), 0);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of all clients and quotes</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{clients.length}</p>
          </CardContent>
        </Card>

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
            <CardTitle className="text-sm font-medium text-gray-600">Submitted Quotes</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Client Summaries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clients.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No clients yet</p>
            ) : (
              clients.map((client) => (
                <div
                  key={client.profile.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{client.profile.full_name || 'No name'}</h3>
                      <p className="text-sm text-gray-600">{client.profile.email}</p>
                      {client.profile.company_name && (
                        <p className="text-sm text-gray-600">{client.profile.company_name}</p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded capitalize">
                      {client.profile.membership_tier}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-600">Total Quotes</p>
                      <p className="text-lg font-semibold">{client.totalQuotes}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Submitted</p>
                      <p className="text-lg font-semibold">{client.submittedQuotes}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Value</p>
                      <p className="text-lg font-semibold">${client.totalValue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentQuotes.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No quotes yet</p>
            ) : (
              recentQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
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
