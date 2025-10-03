import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface FormData {
  clientName: string;
  projectStartDate: string;
  projectEndDate: string;
  productionCompanyName: string;
  numDeliverables: number;
  avgLengthPerDeliverable: number;
  filmingDays: number;
  hoursPerDay: number;
  numLocations: number;
  milesFromServiceRep: number;
  crewPerSetup: number;
  weightProductionToProfit: number;
  discount: number;
}

const steps = [
  { id: 'basic', label: 'Basic Info', description: 'Client and project details', path: '/create-quote/basic' },
  { id: 'production', label: 'Production Details', description: 'Filming and deliverables', path: '/create-quote/production' },
  { id: 'advanced', label: 'Advanced Options', description: 'Crew and pricing', path: '/create-quote/advanced' },
  { id: 'review', label: 'Review', description: 'Review and submit', path: '/create-quote/review' },
];

export const QuoteWizard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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

  const updateField = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateQuote = () => {
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

    const discountMultiplier = 1 - formData.discount / 100;

    return totalWithProfit * discountMultiplier;
  };

  const handleSubmit = async (status: 'draft' | 'submitted') => {
    if (!user) return;

    setLoading(true);

    const totalAmount = calculateQuote();
    const quoteData = {
      user_id: user.id,
      tier: 'premium',
      status,
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
    };

    const { error } = await supabase.from('quotes').insert(quoteData);

    setLoading(false);

    if (error) {
      alert('Error saving quote: ' + error.message);
    } else {
      navigate('/');
    }
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return (
        formData.clientName.trim() !== '' &&
        formData.projectStartDate !== '' &&
        formData.projectEndDate !== '' &&
        formData.productionCompanyName.trim() !== ''
      );
    }
    return true;
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 3) {
      const nextStep = currentStep + 1;
      navigate(steps[nextStep].path);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      navigate(steps[prevStep].path);
    }
  };

  return (
    <div className="flex">
      <div className="w-64 bg-white border rounded-lg p-6 mr-6">
        <h2 className="font-bold text-lg mb-4">Create Quote</h2>

        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`p-3 rounded-lg transition cursor-pointer hover:bg-gray-100 ${
                index === currentStep
                  ? 'bg-blue-100 border-blue-500 border-2'
                  : index < currentStep
                  ? 'bg-green-50 border-green-300 border'
                  : 'bg-gray-50 border-gray-300 border'
              }`}
              onClick={() => {
                if (index < currentStep) {
                  navigate(steps[index].path);
                } else if (index === currentStep + 1 && canProceed()) {
                  navigate(steps[index].path);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    index === currentStep
                      ? 'bg-blue-500 text-white'
                      : index < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <div>
                  <p className="font-semibold text-sm">{step.label}</p>
                  <p className="text-xs text-gray-600">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].label}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => updateField('clientName', e.target.value)}
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
                      onChange={(e) => updateField('projectStartDate', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectEndDate">Project End Date</Label>
                    <Input
                      id="projectEndDate"
                      type="date"
                      value={formData.projectEndDate}
                      onChange={(e) => updateField('projectEndDate', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productionCompanyName">Production Company Name</Label>
                  <Input
                    id="productionCompanyName"
                    value={formData.productionCompanyName}
                    onChange={(e) => updateField('productionCompanyName', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numDeliverables">Number of Deliverables (1-7)</Label>
                    <Input
                      id="numDeliverables"
                      type="number"
                      min="1"
                      max="7"
                      value={formData.numDeliverables}
                      onChange={(e) => updateField('numDeliverables', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avgLengthPerDeliverable">Avg Length (0-50 mins)</Label>
                    <Input
                      id="avgLengthPerDeliverable"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.avgLengthPerDeliverable}
                      onChange={(e) => updateField('avgLengthPerDeliverable', parseInt(e.target.value))}
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
                      onChange={(e) => updateField('filmingDays', parseInt(e.target.value))}
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
                      onChange={(e) => updateField('hoursPerDay', parseInt(e.target.value))}
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
                      onChange={(e) => updateField('numLocations', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="milesFromServiceRep">Miles from Rep (0-300)</Label>
                    <Input
                      id="milesFromServiceRep"
                      type="number"
                      min="0"
                      max="300"
                      value={formData.milesFromServiceRep}
                      onChange={(e) => updateField('milesFromServiceRep', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="crewPerSetup">Crew per Setup (1-7)</Label>
                    <Input
                      id="crewPerSetup"
                      type="number"
                      min="1"
                      max="7"
                      value={formData.crewPerSetup}
                      onChange={(e) => updateField('crewPerSetup', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weightProductionToProfit">Profit Weight (40-80%)</Label>
                    <Input
                      id="weightProductionToProfit"
                      type="number"
                      min="40"
                      max="80"
                      value={formData.weightProductionToProfit}
                      onChange={(e) => updateField('weightProductionToProfit', parseInt(e.target.value))}
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
                      onChange={(e) => updateField('discount', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Estimated Total</p>
                  <p className="text-4xl font-bold text-blue-600">${calculateQuote().toFixed(2)}</p>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Client</p>
                    <p className="font-semibold">{formData.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Production Company</p>
                    <p className="font-semibold">{formData.productionCompanyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Project Dates</p>
                    <p className="font-semibold">
                      {formData.projectStartDate} to {formData.projectEndDate}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Deliverables</p>
                      <p className="font-semibold">{formData.numDeliverables}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Filming Days</p>
                      <p className="font-semibold">{formData.filmingDays}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Crew Size</p>
                      <p className="font-semibold">{formData.crewPerSetup}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Discount</p>
                      <p className="font-semibold">{formData.discount}%</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleSubmit('draft')}
                    variant="outline"
                    disabled={loading}
                    className="flex-1"
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => handleSubmit('submitted')}
                    disabled={loading}
                    className="flex-1"
                  >
                    Submit Quote
                  </Button>
                </div>
              </div>
            )}

            {currentStep < 3 && (
              <div className="flex justify-end gap-3 mt-6">
                {currentStep > 0 && (
                  <Button onClick={handlePrevious} variant="outline">
                    Previous
                  </Button>
                )}
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


export { QuoteWizard }