
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save, Building2, DownloadCloud, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Property } from "@/entities";

const propertyTypes = [
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "duplex", label: "Duplex" },
  { value: "land", label: "Land" }
];

const leadStatuses = [
  { value: "new", label: "New" },
  { value: "ready_to_contact", label: "Ready to Contact" },
  { value: "contacted", label: "Contacted" },
  { value: "interested", label: "Interested" },
  { value: "not_interested", label: "Not Interested" },
  { value: "converted", label: "Converted" },
  { value: "sold_elsewhere", label: "Sold Elsewhere" }
];

export default function PropertyForm({ property, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(property || {
    address: "",
    city: "",
    price: "",
    posting_date: "",
    property_type: "house",
    bedrooms: "",
    bathrooms: "",
    square_feet: "",
    owner_name: "",
    owner_phone: "",
    owner_email: "",
    duproprio_url: "",
    lead_status: "new",
    notes: "",
    is_still_listed: true
  });

  const [isImporting, setIsImporting] = useState(false);
  const [importUrl, setImportUrl] = useState("");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImport = async () => {
    if (!importUrl) return;
    setIsImporting(true);
    try {
      // For now, just set the URL and posting date
      // In a real app, you would implement URL parsing logic here
      setFormData(prev => ({
        ...prev,
        duproprio_url: importUrl,
        posting_date: new Date().toISOString().split('T')[0],
      }));
      
      // Show a simple success message
      alert('URL imported successfully! You can now fill in the property details manually.');
      
    } catch (error) {
      console.error("Failed to import from URL", error);
      alert('Import failed. Please fill in the details manually.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null,
      bedrooms: formData.bedrooms ? parseFloat(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
      square_feet: formData.square_feet ? parseFloat(formData.square_feet) : null,
    };
    onSubmit(processedData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl font-bold" style={{color: 'var(--primary-navy)'}}>
              <Building2 className="w-5 h-5" />
              {property ? 'Edit Property' : 'Add New Property'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-6">
              {/* AI Importer */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <Label htmlFor="import_url" className="font-semibold text-blue-800">
                  Import from DuProprio URL
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="import_url"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    placeholder="Paste DuProprio URL here..."
                  />
                  <Button
                    type="button"
                    onClick={handleImport}
                    disabled={isImporting || !importUrl}
                    className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                  >
                    {isImporting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <DownloadCloud className="w-4 h-4 mr-2" />
                    )}
                    Import
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Paste a link and click import to auto-fill the form with AI.
                </p>
              </div>

              {/* Basic Property Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Property Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Montreal"
                    required
                  />
                </div>
              </div>

              {/* Price and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (CAD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="450000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="posting_date">Posting Date *</Label>
                  <Input
                    id="posting_date"
                    type="date"
                    value={formData.posting_date}
                    onChange={(e) => handleInputChange('posting_date', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="property_type">Property Type</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(value) => handleInputChange('property_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    placeholder="3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    placeholder="2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="square_feet">Square Feet</Label>
                  <Input
                    id="square_feet"
                    type="number"
                    min="0"
                    value={formData.square_feet}
                    onChange={(e) => handleInputChange('square_feet', e.target.value)}
                    placeholder="1500"
                  />
                </div>
              </div>

              {/* Owner Contact Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--primary-navy)'}}>
                  Owner Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="owner_name">Owner Name *</Label>
                    <Input
                      id="owner_name"
                      value={formData.owner_name}
                      onChange={(e) => handleInputChange('owner_name', e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner_phone">Phone Number</Label>
                    <Input
                      id="owner_phone"
                      value={formData.owner_phone}
                      onChange={(e) => handleInputChange('owner_phone', e.target.value)}
                      placeholder="(514) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner_email">Email Address</Label>
                    <Input
                      id="owner_email"
                      type="email"
                      value={formData.owner_email}
                      onChange={(e) => handleInputChange('owner_email', e.target.value)}
                      placeholder="john@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="duproprio_url">DuProprio URL</Label>
                    <Input
                      id="duproprio_url"
                      value={formData.duproprio_url}
                      onChange={(e) => handleInputChange('duproprio_url', e.target.value)}
                      placeholder="https://duproprio.com/listing/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lead_status">Lead Status</Label>
                    <Select
                      value={formData.lead_status}
                      onValueChange={(value) => handleInputChange('lead_status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {leadStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Add any relevant notes about this property or owner..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3 p-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {property ? 'Update Property' : 'Save Property'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}
