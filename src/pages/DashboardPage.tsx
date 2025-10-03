import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Quote, Profile } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { ClientDashboard } from '../components/dashboard/ClientDashboard';

export const DashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {profile.role === 'admin' ? <AdminDashboard /> : <ClientDashboard />}
      </div>
    </div>
  );
};
