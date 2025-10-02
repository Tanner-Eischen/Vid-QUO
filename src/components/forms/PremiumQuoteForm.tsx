import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const PremiumQuoteForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    projectStartDate: '',
    projectEndDate: '',
    productionCompanyName: '',
    numDeliverables: 1,
    avgLengthPerDeliverable: 5,
    filmingDays: 1,
    hoursPerDay: 8,
    numLocations: 1,
    milesFromServiceRep: 0,
    crewPerSetup: 2,
    weightProductionToProfit: 60,
    discount: 0,
  });

  const calculatePremiumQuote = () => {
    const baseRate = 225;
    const roles = 6;
    const editHoursPerDeliverable = 48;
    const hourlyRate = 50;
    const travelCostPerMile = 0.5;

    const totalEditHours = formData.numDeliverables * editHoursPerDeliverable;
    const filmingCost = formData.filmingDays * formData.hoursPerDay * hourlyRate * formData.crewPerSetup;
    const travelCost = formData.milesFromServiceRep * travelCostPerMile;
    const locationMultiplier = 1 + (formData.numLocations - 1) * 0.1;

    const productionCost = baseRate * roles + totalEditHours * hourlyRate + filmingCost + travelCost;
    const weightedCost = productionCost * locationMultiplier;

    const profitMargin = formData.weightProductionToProfit / 100;
    const totalWithProfit = weightedCost / (1 - profitMargin);

    const discountMultiplier = 1 - (formData.discount / 100);

    return totalWithProfit * discountMultiplier;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSuccess(false);

    const totalAmount = calculatePremiumQuote();

    const { error } = await supabase.from('quotes').insert({
      user_id: user.id,
      tier: 'premium',
      client_name: formData.clientName,
      project_start_date: formData.projectStartDate,
      project_end_date: formData.projectEndDate,
      production_company_name: formData.productionCompanyName,
      num_deliverables: formData.numDeliverables,
      avg_length_per_deliverable: formData.avgLengthPerDeliverable,
      filming_days: formData.filmingDays,
      hours_per_day: formData.hoursPerDay,
      num_locations: formData.numLocations,
      miles_from_service_rep: formData.milesFromServiceRep,
      crew_per_setup: formData.crewPerSetup,
      weight_production_to_profit: formData.weightProductionToProfit,
      discount: formData.discount,
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

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Premium Quote</CardTitle>
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

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numDeliverables">Number of Deliverables (1-7)</Label>
              <Input
                id="numDeliverables"
                type="number"
                min="1"
                max="7"
                value={formData.numDeliverables}
                onChange={(e) => handleChange('numDeliverables', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avgLengthPerDeliverable">Avg Length per Deliverable (0-50 mins)</Label>
              <Input
                id="avgLengthPerDeliverable"
                type="number"
                min="0"
                max="50"
                value={formData.avgLengthPerDeliverable}
                onChange={(e) => handleChange('avgLengthPerDeliverable', parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filmingDays">Filming Days (1-7)</Label>
              <Input
                id="filmingDays"
                type="number"
                min="1"
                max="7"
                value={formData.filmingDays}
                onChange={(e) => handleChange('filmingDays', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hoursPerDay">Hours per Day (1-12)</Label>
              <Input
                id="hoursPerDay"
                type="number"
                min="1"
                max="12"
                value={formData.hoursPerDay}
                onChange={(e) => handleChange('hoursPerDay', parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numLocations">Number of Locations (1-7)</Label>
              <Input
                id="numLocations"
                type="number"
                min="1"
                max="7"
                value={formData.numLocations}
                onChange={(e) => handleChange('numLocations', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="milesFromServiceRep">Miles from Service Rep (0-300)</Label>
              <Input
                id="milesFromServiceRep"
                type="number"
                min="0"
                max="300"
                value={formData.milesFromServiceRep}
                onChange={(e) => handleChange('milesFromServiceRep', parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="crewPerSetup">Crew per Setup (1-7)</Label>
              <Input
                id="crewPerSetup"
                type="number"
                min="1"
                max="7"
                value={formData.crewPerSetup}
                onChange={(e) => handleChange('crewPerSetup', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weightProductionToProfit">Weight Production to Profit (40-80%)</Label>
              <Input
                id="weightProductionToProfit"
                type="number"
                min="40"
                max="80"
                value={formData.weightProductionToProfit}
                onChange={(e) => handleChange('weightProductionToProfit', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Discount (0-20%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="20"
                value={formData.discount}
                onChange={(e) => handleChange('discount', parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm font-semibold">Estimated Total: ${calculatePremiumQuote().toFixed(2)}</p>
            <p className="text-xs text-gray-600 mt-1">Based on 6 roles, 48 edit hours per deliverable, with profit margin and discount applied</p>
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
