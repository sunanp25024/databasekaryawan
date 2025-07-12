import React from 'react';
import { Users, Building2, UserCheck, UserX, FileText, Calendar } from 'lucide-react';
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
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      name: 'Karyawan Aktif',
      value: activeEmployees,
      icon: UserCheck,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      name: 'Karyawan Resign',
      value: resignedEmployees,
      icon: UserX,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      name: 'Kontrak',
      value: contractEmployees,
      icon: FileText,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      name: 'Permanent',
      value: permanentEmployees,
      icon: Calendar,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      name: 'Total Area',
      value: uniqueClients,
      icon: Building2,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-5 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 hover:scale-105 hover:border-blue-200 group">
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-xs lg:text-sm font-semibold text-gray-600 mb-2 leading-tight group-hover:text-gray-700 transition-colors">
                {stat.name}
              </p>
              <p className={`text-2xl lg:text-3xl font-bold ${stat.textColor} group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </p>
            </div>
            <div className={`${stat.color} rounded-2xl p-2 lg:p-3 flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
              <stat.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}