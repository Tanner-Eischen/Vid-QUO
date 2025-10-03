import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Quote } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentQuotes();
  }, [user]);

  const fetchRecentQuotes = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      setRecentQuotes(data);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name}</h1>
          <p className="text-gray-600 mt-2">
            Membership: <span className="capitalize font-semibold">{profile?.membership_tier}</span>
          </p>
        </div>
        <Button onClick={() => navigate('/create-quote')} size="lg">
          Create New Quote
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{recentQuotes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={() => navigate('/create-quote')} variant="outline" className="w-full">
              New Quote
            </Button>
            <Button onClick={() => navigate('/history')} variant="outline" className="w-full">
              View History
            </Button>
            <Button onClick={() => navigate('/settings')} variant="outline" className="w-full">
              Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">{profile?.membership_tier}</p>
            <p className="text-sm text-gray-600 mt-2">
              {profile?.membership_tier === 'member' && 'Upgrade for more features'}
              {profile?.membership_tier === 'pro' && 'Access to premium features'}
              {profile?.membership_tier === 'executive' && 'Full access to all features'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : recentQuotes.length === 0 ? (
            <p className="text-gray-600">No quotes yet. Create your first quote to get started!</p>
          ) : (
            <div className="space-y-3">
              {recentQuotes.map((quote) => (
                <div key={quote.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{quote.client_name}</p>
                    <p className="text-sm text-gray-600">{quote.production_company_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(quote.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${quote.total_amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-600 capitalize">{quote.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
