import React from 'react';
import { Users, Building2, UserCheck, UserX, FileText, Calendar, TrendingUp, Award } from 'lucide-react';
import { Employee } from '../types/Employee';

interface DashboardProps {
  employees: Employee[];
}

export function Dashboard({ employees }: DashboardProps) {
  const activeEmployees = employees.filter(emp => emp.statusI === 'Active').length;
  const resignedEmployees = employees.filter(emp => emp.statusI === 'Resigned').length;
  const contractEmployees = employees.filter(emp => emp.statusII === 'Contract').length;
  const permanentEmployees = employees.filter(emp => emp.statusII === 'Permanent').length;
  const uniqueClients = new Set(employees.map(emp => emp.klien)).size;
  const uniqueArea = new Set(employees.map(emp => emp.area)).size;

  const stats = [
    {
      name: 'Total Karyawan',
      value: employees.length,
      icon: Users,
      gradient: 'from-blue-600 to-blue-700',
      bgGradient: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-800',
      iconBg: 'bg-blue-600',
      description: 'Semua karyawan',
      change: '+0%'
    },
    {
      name: 'Karyawan Aktif',
      value: activeEmployees,
      icon: UserCheck,
      gradient: 'from-emerald-600 to-emerald-700',
      bgGradient: 'from-emerald-50 to-emerald-100',
      textColor: 'text-emerald-800',
      iconBg: 'bg-emerald-600',
      description: 'Status aktif',
      change: '+0%'
    },
    {
      name: 'Karyawan Resign',
      value: resignedEmployees,
      icon: UserX,
      gradient: 'from-red-600 to-red-700',
      bgGradient: 'from-red-50 to-red-100',
      textColor: 'text-red-800',
      iconBg: 'bg-red-600',
      description: 'Sudah resign',
      change: '+0%'
    },
    {
      name: 'Kontrak',
      value: contractEmployees,
      icon: FileText,
      gradient: 'from-amber-600 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-100',
      textColor: 'text-amber-800',
      iconBg: 'bg-amber-600',
      description: 'Status kontrak',
      change: '+0%'
    },
    {
      name: 'Permanent',
      value: permanentEmployees,
      icon: Award,
      gradient: 'from-purple-600 to-purple-700',
      bgGradient: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-800',
      iconBg: 'bg-purple-600',
      description: 'Status tetap',
      change: '+0%'
    },
    {
      name: 'Total Area',
      value: uniqueArea,
      icon: Building2,
      gradient: 'from-indigo-600 to-indigo-700',
      bgGradient: 'from-indigo-50 to-indigo-100',
      textColor: 'text-indigo-800',
      iconBg: 'bg-indigo-600',
      description: 'Wilayah kerja',
      change: '+0%'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
      {stats.map((stat, index) => (
        <div 
          key={stat.name} 
          className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} rounded-2xl lg:rounded-3xl shadow-lg lg:shadow-xl border border-white/60 p-4 lg:p-6 hover:shadow-xl lg:hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-60"></div>
          <div className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6 w-20 h-20 lg:w-32 lg:h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3 lg:mb-5">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-gray-600 mb-2 lg:mb-3 uppercase tracking-wider truncate">
                  {stat.name}
                </p>
                <p className={`text-2xl lg:text-4xl font-black ${stat.textColor} mb-1 lg:mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-600 font-bold truncate">
                  {stat.description}
                </p>
              </div>
              
              <div className={`${stat.iconBg} rounded-xl lg:rounded-2xl p-2 lg:p-4 shadow-lg lg:shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 ring-2 lg:ring-4 ring-white/40 flex-shrink-0`}>
                <stat.icon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="w-full bg-white/40 rounded-full h-1.5 lg:h-2 mb-2 lg:mb-3">
              <div 
                className={`bg-gradient-to-r ${stat.gradient} h-1.5 lg:h-2 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${employees.length > 0 ? Math.min((stat.value / employees.length) * 100, 100) : 0}%` }}
              ></div>
            </div>
            
            {/* Trend indicator */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-700 font-bold">
                {employees.length > 0 ? ((stat.value / employees.length) * 100).toFixed(1) : '0.0'}%
              </span>
              <div className="flex items-center text-green-700">
                <TrendingUp className="w-2 h-2 lg:w-3 lg:h-3 mr-1" />
                <span className="font-bold">{stat.change}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}