import React, { useState, useEffect } from "react";
import { Property } from "@/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  ExternalLink,
  Phone,
  Mail,
  User
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import PropertyForm from "../components/properties/PropertyForm";

const statusColors = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  ready_to_contact: "bg-orange-100 text-orange-700 border-orange-200",
  contacted: "bg-purple-100 text-purple-700 border-purple-200",
  interested: "bg-green-100 text-green-700 border-green-200",
  not_interested: "bg-gray-100 text-gray-700 border-gray-200",
  converted: "bg-emerald-100 text-emerald-700 border-emerald-200",
  sold_elsewhere: "bg-red-100 text-red-700 border-red-200"
};

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, statusFilter]);

  const loadProperties = async () => {
    setIsLoading(true);
    const data = await Property.list('-created_date');
    setProperties(data);
    setIsLoading(false);
  };

  const filterProperties = () => {
    let filtered = [...properties];

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(property => property.lead_status === statusFilter);
    }

    setFilteredProperties(filtered);
  };

  const handleSubmit = async (propertyData) => {
    if (editingProperty) {
      await Property.update(editingProperty.id, propertyData);
    } else {
      await Property.create(propertyData);
    }
    setShowForm(false);
    setEditingProperty(null);
    loadProperties();
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const getDaysOnMarket = (postingDate) => {
    return differenceInDays(new Date(), new Date(postingDate));
  };

  return (
    <div className="p-6 space-y-6" style={{backgroundColor: 'var(--soft-gray)'}}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{color: 'var(--primary-navy)'}}>
              Properties
            </h1>
            <p className="text-gray-600">Manage your DuProprio property listings</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-white shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by address, city, or owner name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="all">All Status</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                  <TabsTrigger value="ready_to_contact">Ready</TabsTrigger>
                  <TabsTrigger value="contacted">Contacted</TabsTrigger>
                  <TabsTrigger value="interested">Interested</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        <div className="grid gap-6">
          <AnimatePresence>
            {filteredProperties.map((property, index) => {
              const daysOnMarket = getDaysOnMarket(property.posting_date);
              const isHot = daysOnMarket >= 14 && property.is_still_listed;
              
              return (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`bg-white shadow-sm hover:shadow-md transition-all duration-300 ${
                    isHot ? 'border-l-4 border-l-orange-500' : ''
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Property Info */}
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
                              {isHot && (
                                <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                                  🔥 Hot Lead ({daysOnMarket} days)
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              Posted {format(new Date(property.posting_date), 'MMM d, yyyy')}
                            </div>
                            <div className="flex items-center text-sm">
                              <Badge className={`${statusColors[property.lead_status]} text-xs border`}>
                                {property.lead_status.replace(/_/g, ' ')}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              {daysOnMarket} days on market
                            </div>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="lg:w-80 bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold mb-3 flex items-center" style={{color: 'var(--primary-navy)'}}>
                            <User className="w-4 h-4 mr-2" />
                            Owner Contact
                          </h4>
                          
                          <div className="space-y-3">
                            <div>
                              <p className="font-medium">{property.owner_name}</p>
                            </div>
                            
                            {property.owner_phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <a 
                                  href={`tel:${property.owner_phone}`}
                                  className="text-blue-600 hover:underline"
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
                                  View on DuProprio
                                </a>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 pt-4 border-t">
                            <Button
                              onClick={() => handleEdit(property)}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              Edit Property
                            </Button>
                          </div>
                        </div>
                      </div>

                      {property.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <h5 className="font-medium mb-2" style={{color: 'var(--primary-navy)'}}>Notes:</h5>
                          <p className="text-gray-600 text-sm">{property.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredProperties.length === 0 && !isLoading && (
            <Card className="bg-white shadow-sm">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold mb-2" style={{color: 'var(--primary-navy)'}}>
                  No properties found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or add a new property
                </p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Property
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Property Form Modal */}
        <AnimatePresence>
          {showForm && (
            <PropertyForm
              property={editingProperty}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingProperty(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}