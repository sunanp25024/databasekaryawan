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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 lg:p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1 leading-tight">{stat.name}</p>
              <p className={`text-xl lg:text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
            <div className={`${stat.color} rounded-xl p-1.5 lg:p-2 flex-shrink-0 shadow-sm`}>
              <stat.icon className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}