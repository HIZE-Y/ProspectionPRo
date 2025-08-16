import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsCards({ title, value, icon: Icon, gradient, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 border-0">
        <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-gradient-to-br ${gradient} rounded-full opacity-10`} />
        <CardHeader className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <CardTitle className="text-2xl lg:text-3xl font-bold" style={{color: 'var(--primary-navy)'}}>
                {value}
              </CardTitle>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
          {trend && (
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 mr-2 text-emerald-500" />
              <span className="text-gray-600 font-medium">{trend}</span>
            </div>
          )}
        </CardHeader>
      </Card>
    </motion.div>
  );
}