import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Phone, Save } from "lucide-react";
import { motion } from "framer-motion";

const contactMethods = [
  { value: "phone", label: "Phone Call" },
  { value: "email", label: "Email" },
  { value: "text", label: "Text Message" },
  { value: "in_person", label: "In Person" }
];

const outcomes = [
  { value: "no_answer", label: "No Answer" },
  { value: "answered", label: "Answered" },
  { value: "voicemail", label: "Left Voicemail" },
  { value: "callback_requested", label: "Callback Requested" },
  { value: "not_interested", label: "Not Interested" },
  { value: "interested", label: "Interested" },
  { value: "meeting_scheduled", label: "Meeting Scheduled" }
];

export default function ContactModal({ property, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    contact_date: new Date().toISOString().split('T')[0],
    contact_method: 'phone',
    outcome: '',
    notes: '',
    follow_up_date: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.outcome) return;
    onSubmit(formData);
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
        className="w-full max-w-2xl"
      >
        <Card className="bg-white shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl font-bold" style={{color: 'var(--primary-navy)'}}>
              <Phone className="w-5 h-5" />
              Log Contact Attempt
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-6">
              {/* Property Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2" style={{color: 'var(--primary-navy)'}}>
                  {property.address}
                </h4>
                <p className="text-gray-600">Owner: {property.owner_name}</p>
                {property.owner_phone && (
                  <p className="text-blue-600 font-medium">{property.owner_phone}</p>
                )}
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact_date">Contact Date *</Label>
                  <Input
                    id="contact_date"
                    type="date"
                    value={formData.contact_date}
                    onChange={(e) => handleInputChange('contact_date', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_method">Contact Method *</Label>
                  <Select
                    value={formData.contact_method}
                    onValueChange={(value) => handleInputChange('contact_method', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contactMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="outcome">Outcome *</Label>
                <Select
                  value={formData.outcome}
                  onValueChange={(value) => handleInputChange('outcome', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select outcome..." />
                  </SelectTrigger>
                  <SelectContent>
                    {outcomes.map((outcome) => (
                      <SelectItem key={outcome.value} value={outcome.value}>
                        {outcome.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Add details about the conversation, their interest level, concerns, etc..."
                  rows={4}
                />
              </div>

              {formData.outcome === 'callback_requested' || formData.outcome === 'meeting_scheduled' || formData.outcome === 'interested' ? (
                <div className="space-y-2">
                  <Label htmlFor="follow_up_date">Follow-up Date</Label>
                  <Input
                    id="follow_up_date"
                    type="date"
                    value={formData.follow_up_date}
                    onChange={(e) => handleInputChange('follow_up_date', e.target.value)}
                  />
                </div>
              ) : null}
            </CardContent>

            <CardFooter className="flex justify-end gap-3 p-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                disabled={!formData.outcome}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Contact Log
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}