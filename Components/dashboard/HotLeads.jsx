import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "react-router-dom"
import { Flame, MapPin, Calendar, ArrowRight } from "lucide-react"
import { differenceInDays } from "date-fns"

export default function HotLeads({ hotLeads, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Hot Leads</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Hot Leads
        </CardTitle>
        <Link to="/leads">
          <Button variant="outline" size="sm">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hotLeads.slice(0, 3).map((lead) => {
            const daysOnMarket = differenceInDays(new Date(), new Date(lead.posting_date))
            const priority = daysOnMarket >= 30 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
            
            return (
              <div key={lead.id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {lead.address}
                  </p>
                  <Badge className={`${priority} text-xs`}>
                    {daysOnMarket} days
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <MapPin className="w-3 h-3 mr-1" />
                  {lead.city}
                  <span className="mx-2">•</span>
                  <Calendar className="w-3 h-3 mr-1" />
                  ${lead.price?.toLocaleString()}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    {lead.owner_name}
                  </span>
                  <Link to={`/leads?property=${lead.id}`}>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      Contact
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
          
          {hotLeads.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No hot leads yet</p>
              <p className="text-xs text-gray-400">Properties become hot after 14+ days</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 