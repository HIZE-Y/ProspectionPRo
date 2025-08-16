import React, { useState, useEffect } from "react";
import { Property, ContactLog } from "@/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Phone, 
  TrendingUp, 
  Calendar,
  Users,
  DollarSign,
  ArrowRight,
  Eye,
  Clock
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

import StatsCards from "../components/dashboard/StatsCards";
import RecentProperties from "../components/dashboard/RecentProperties";
import HotLeads from "../components/dashboard/HotLeads";

export default function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [contactLogs, setContactLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [propertiesData, contactData] = await Promise.all([
      Property.list('-created_date', 50),
      ContactLog.list('-created_date', 20)
    ]);
    setProperties(propertiesData);
    setContactLogs(contactData);
    setIsLoading(false);
  };

  const getHotLeads = () => {
    const today = new Date();
    return properties.filter(property => {
      const daysSincePosting = differenceInDays(today, new Date(property.posting_date));
      return daysSincePosting >= 14 && 
             property.is_still_listed && 
             !['contacted', 'not_interested', 'converted', 'sold_elsewhere'].includes(property.lead_status);
    });
  };

  const getStats = () => {
    const totalProperties = properties.length;
    const hotLeads = getHotLeads().length;
    const totalValue = properties.reduce((sum, prop) => sum + (prop.price || 0), 0);
    const avgPrice = totalProperties > 0 ? totalValue / totalProperties : 0;
    const contactedThisMonth = contactLogs.filter(log => {
      const logDate = new Date(log.contact_date);
      const now = new Date();
      return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
    }).length;

    return {
      totalProperties,
      hotLeads,
      avgPrice,
      contactedThisMonth
    };
  };

  const stats = getStats();

  return (
    <div className="p-6 space-y-8" style={{backgroundColor: 'var(--soft-gray)'}}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{color: 'var(--primary-navy)'}}>
            Dashboard
          </h1>
          <p className="text-gray-600">Track your DuProprio leads and opportunities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCards
            title="Total Properties"
            value={stats.totalProperties}
            icon={Building2}
            gradient="from-blue-500 to-blue-600"
            trend={`${properties.filter(p => {
              const days = differenceInDays(new Date(), new Date(p.created_date));
              return days <= 7;
            }).length} added this week`}
          />
          <StatsCards
            title="Hot Leads"
            value={stats.hotLeads}
            icon={Users}
            gradient="from-orange-500 to-red-500"
            trend="Ready to contact"
          />
          <StatsCards
            title="Avg Property Value"
            value={`$${stats.avgPrice.toLocaleString()}`}
            icon={DollarSign}
            gradient="from-green-500 to-emerald-600"
          />
          <StatsCards
            title="Contacts This Month"
            value={stats.contactedThisMonth}
            icon={Phone}
            gradient="from-purple-500 to-purple-600"
            trend="Outreach activity"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Properties */}
          <div className="lg:col-span-2">
            <RecentProperties 
              properties={properties.slice(0, 8)}
              isLoading={isLoading}
            />
          </div>

          {/* Hot Leads Sidebar */}
          <div>
            <HotLeads 
              hotLeads={getHotLeads().slice(0, 6)}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-2" style={{color: 'var(--primary-navy)'}}>
                    Add New Property
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Import from DuProprio listing
                  </p>
                </div>
                <Link to="/properties?action=add">
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-2" style={{color: 'var(--primary-navy)'}}>
                    View All Leads
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Properties ready for contact
                  </p>
                </div>
                <Link to="/leads">
                  <Button variant="outline" className="border-orange-200 hover:bg-orange-50">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-2" style={{color: 'var(--primary-navy)'}}>
                    Contact History
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Review all interactions
                  </p>
                </div>
                <Link to="/contactlog">
                  <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
                    <Clock className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}