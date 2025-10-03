import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Quote, Profile } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    const [quotesResponse, usersResponse] = await Promise.all([
      supabase.from('quotes').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*'),
    ]);

    if (quotesResponse.data) {
      setAllQuotes(quotesResponse.data);
    }

    if (usersResponse.data) {
      setAllUsers(usersResponse.data);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {profile?.full_name}</p>
        </div>
        <Button onClick={() => navigate('/create-quote')} size="lg">
          Create New Quote
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{allUsers.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{allQuotes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submitted Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {allQuotes.filter((q) => q.status === 'submitted').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Draft Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {allQuotes.filter((q) => q.status === 'draft').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Quotes (All Users)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : allQuotes.length === 0 ? (
            <p className="text-gray-600">No quotes in the system yet.</p>
          ) : (
            <div className="space-y-3">
              {allQuotes.slice(0, 10).map((quote) => (
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

      <Card>
        <CardHeader>
          <CardTitle>User Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allUsers.slice(0, 10).map((user) => (
              <div key={user.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{user.full_name || 'No Name'}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium capitalize">{user.membership_tier}</p>
                  <p className="text-xs text-gray-600 capitalize">{user.role}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
