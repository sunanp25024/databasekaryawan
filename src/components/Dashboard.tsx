import React from 'react';
import { Users, Building2, UserCheck, UserX, FileText, Calendar, TrendingUp } from 'lucide-react';
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
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-700',
      iconBg: 'bg-blue-500',
      description: 'Semua karyawan'
    },
    {
      name: 'Karyawan Aktif',
      value: activeEmployees,
      icon: UserCheck,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      textColor: 'text-emerald-700',
      iconBg: 'bg-emerald-500',
      description: 'Status aktif'
    },
    {
      name: 'Karyawan Resign',
      value: resignedEmployees,
      icon: UserX,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100',
      textColor: 'text-red-700',
      iconBg: 'bg-red-500',
      description: 'Sudah resign'
    },
    {
      name: 'Kontrak',
      value: contractEmployees,
      icon: FileText,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-100',
      textColor: 'text-amber-700',
      iconBg: 'bg-amber-500',
      description: 'Status kontrak'
    },
    {
      name: 'Permanent',
      value: permanentEmployees,
      icon: Calendar,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-700',
      iconBg: 'bg-purple-500',
      description: 'Status tetap'
    },
    {
      name: 'Total Area',
      value: uniqueClients,
      icon: Building2,
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      textColor: 'text-indigo-700',
      iconBg: 'bg-indigo-500',
      description: 'Wilayah kerja'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={stat.name} 
          className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} rounded-2xl shadow-lg border border-white/50 p-5 lg:p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">
                  {stat.name}
                </p>
                <p className={`text-3xl lg:text-4xl font-black ${stat.textColor} mb-1 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  {stat.description}
                </p>
              </div>
              
              <div className={`${stat.iconBg} rounded-2xl p-3 lg:p-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 ring-2 ring-white/30`}>
                <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="w-full bg-white/30 rounded-full h-1.5 mb-2">
              <div 
                className={`bg-gradient-to-r ${stat.gradient} h-1.5 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${Math.min((stat.value / employees.length) * 100, 100)}%` }}
              ></div>
            </div>
            
            {/* Trend indicator */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 font-medium">
                {((stat.value / employees.length) * 100).toFixed(1)}%
              </span>
              <div className="flex items-center text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span className="font-medium">+2.5%</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}