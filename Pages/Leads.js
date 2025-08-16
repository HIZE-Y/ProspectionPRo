
import React, { useState, useEffect } from "react";
import { Property, ContactLog } from "@/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  Flame, // Changed from Fire to Flame
  Clock,
  User,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import ContactModal from "../components/leads/ContactModal";

export default function Leads() {
  const [properties, setProperties] = useState([]);
  const [hotLeads, setHotLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setIsLoading(true);
    const propertiesData = await Property.list('-posting_date');
    setProperties(propertiesData);
    
    const today = new Date();
    const leads = propertiesData.filter(property => {
      const daysSincePosting = differenceInDays(today, new Date(property.posting_date));
      return daysSincePosting >= 14 && 
             property.is_still_listed && 
             !['converted', 'sold_elsewhere', 'not_interested'].includes(property.lead_status);
    });
    
    setHotLeads(leads);
    setIsLoading(false);
  };

  const handleContact = (property) => {
    setSelectedProperty(property);
    setShowContactModal(true);
  };

  const handleContactSubmit = async (contactData) => {
    // Create contact log entry
    await ContactLog.create({
      property_id: selectedProperty.id,
      ...contactData
    });

    // Update property lead status
    await Property.update(selectedProperty.id, {
      lead_status: 'contacted',
      last_contact_date: contactData.contact_date
    });

    setShowContactModal(false);
    setSelectedProperty(null);
    loadLeads();
  };

  const getFilteredLeads = () => {
    switch (filter) {
      case "hot":
        return hotLeads.filter(lead => differenceInDays(new Date(), new Date(lead.posting_date)) >= 21);
      case "warm":
        return hotLeads.filter(lead => {
          const days = differenceInDays(new Date(), new Date(lead.posting_date));
          return days >= 14 && days < 21;
        });
      case "contacted":
        return hotLeads.filter(lead => lead.lead_status === 'contacted');
      default:
        return hotLeads;
    }
  };

  const filteredLeads = getFilteredLeads();

  const getDaysOnMarket = (postingDate) => {
    return differenceInDays(new Date(), new Date(postingDate));
  };

  const getLeadPriority = (days) => {
    if (days >= 30) return { color: "bg-red-100 text-red-700 border-red-200", label: "🔥 Very Hot" };
    if (days >= 21) return { color: "bg-orange-100 text-orange-700 border-orange-200", label: "🔥 Hot" };
    return { color: "bg-yellow-100 text-yellow-700 border-yellow-200", label: "🔸 Warm" };
  };

  return (
    <div className="p-6 space-y-6" style={{backgroundColor: 'var(--soft-gray)'}}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3" style={{color: 'var(--primary-navy)'}}>
            <Flame className="w-8 h-8 text-orange-500" /> {/* Changed from Fire to Flame */}
            Hot Leads
          </h1>
          <p className="text-gray-600">Properties on market for 14+ days - perfect for outreach</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Total Hot Leads</p>
                  <p className="text-2xl font-bold">{hotLeads.length}</p>
                </div>
                <Flame className="w-8 h-8 text-orange-100" /> {/* Changed from Fire to Flame */}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Very Hot (30+ days)</p>
                  <p className="text-2xl font-bold">
                    {hotLeads.filter(lead => getDaysOnMarket(lead.posting_date) >= 30).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-red-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Contacted</p>
                  <p className="text-2xl font-bold">
                    {hotLeads.filter(lead => lead.lead_status === 'contacted').length}
                  </p>
                </div>
                <Phone className="w-8 h-8 text-purple-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Interested</p>
                  <p className="text-2xl font-bold">
                    {hotLeads.filter(lead => lead.lead_status === 'interested').length}
                  </p>
                </div>
                <User className="w-8 h-8 text-green-100" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Card className="bg-white shadow-sm mb-6">
          <CardContent className="p-6">
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="bg-gray-100">
                <TabsTrigger value="all">All Leads ({hotLeads.length})</TabsTrigger>
                <TabsTrigger value="hot">
                  Very Hot ({hotLeads.filter(lead => getDaysOnMarket(lead.posting_date) >= 21).length})
                </TabsTrigger>
                <TabsTrigger value="warm">
                  Warm ({hotLeads.filter(lead => {
                    const days = getDaysOnMarket(lead.posting_date);
                    return days >= 14 && days < 21;
                  }).length})
                </TabsTrigger>
                <TabsTrigger value="contacted">
                  Contacted ({hotLeads.filter(lead => lead.lead_status === 'contacted').length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Leads List */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredLeads.map((property, index) => {
              const daysOnMarket = getDaysOnMarket(property.posting_date);
              const priority = getLeadPriority(daysOnMarket);
              
              return (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Property Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold mb-2" style={{color: 'var(--primary-navy)'}}>
                                {property.address}
                              </h3>
                              <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="w-4 h-4 mr-1" />
                                {property.city}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
                                {property.square_feet && (
                                  <span>{property.square_feet.toLocaleString()} sq ft</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold mb-2" style={{color: 'var(--primary-gold)'}}>
                                ${property.price?.toLocaleString()}
                              </p>
                              <Badge className={`${priority.color} border`}>
                                {priority.label}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              Posted {format(new Date(property.posting_date), 'MMM d, yyyy')}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-2" />
                              {daysOnMarket} days on market
                            </div>
                            <div className="text-sm">
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                {property.lead_status.replace(/_/g, ' ')}
                              </Badge>
                            </div>
                          </div>

                          {property.last_contact_date && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                              <p className="text-sm text-gray-600">
                                Last contacted: {format(new Date(property.last_contact_date), 'MMM d, yyyy')}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Contact Section */}
                        <div className="lg:w-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                          <h4 className="font-semibold mb-4 flex items-center" style={{color: 'var(--primary-navy)'}}>
                            <User className="w-4 h-4 mr-2" />
                            {property.owner_name}
                          </h4>
                          
                          <div className="space-y-3 mb-4">
                            {property.owner_phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <a 
                                  href={`tel:${property.owner_phone}`}
                                  className="text-blue-600 hover:underline font-medium"
                                >
                                  {property.owner_phone}
                                </a>
                              </div>
                            )}
                            
                            {property.owner_email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <a 
                                  href={`mailto:${property.owner_email}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {property.owner_email}
                                </a>
                              </div>
                            )}

                            {property.duproprio_url && (
                              <div className="flex items-center gap-2">
                                <ExternalLink className="w-4 h-4 text-gray-500" />
                                <a 
                                  href={property.duproprio_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm"
                                >
                                  DuProprio Listing
                                </a>
                              </div>
                            )}
                          </div>

                          <div className="space-y-3">
                            <Button
                              onClick={() => handleContact(property)}
                              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                              disabled={property.lead_status === 'not_interested'}
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              {property.lead_status === 'contacted' ? 'Follow Up' : 'Contact Now'}
                            </Button>
                            
                            {property.owner_email && (
                              <Button
                                variant="outline"
                                className="w-full"
                                asChild
                              >
                                <a href={`mailto:${property.owner_email}`}>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send Email
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {property.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <h5 className="font-medium mb-2 flex items-center" style={{color: 'var(--primary-navy)'}}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Notes:
                          </h5>
                          <p className="text-gray-600 text-sm">{property.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredLeads.length === 0 && !isLoading && (
            <Card className="bg-white shadow-sm">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flame className="w-8 h-8 text-gray-400" /> {/* Changed from Fire to Flame */}
                </div>
                <h3 className="font-semibold mb-2" style={{color: 'var(--primary-navy)'}}>
                  No leads in this category
                </h3>
                <p className="text-gray-600">
                  Try switching to a different filter or add more properties
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact Modal */}
        <AnimatePresence>
          {showContactModal && (
            <ContactModal
              property={selectedProperty}
              onSubmit={handleContactSubmit}
              onClose={() => {
                setShowContactModal(false);
                setSelectedProperty(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
