import { Users, Building2, TrendingUp, Award, UserCheck, UserX, FileText } from 'lucide-react';
import { Employee } from '../types/Employee';
import { ClientLogo } from './ClientLogo';

interface DashboardProps {
  employees: Employee[];
}

export function Dashboard({ employees }: DashboardProps) {
  // Debug: Log all unique status values
  const uniqueStatusI = Array.from(new Set(employees.map(emp => emp.statusI)));
  const uniqueStatusII = Array.from(new Set(employees.map(emp => emp.statusII)));
  console.log('Unique Status I values:', uniqueStatusI);
  console.log('Unique Status II values:', uniqueStatusII);
  
  // Normalize status function
  const normalizeStatus = (status: string): string => {
    if (!status) return '';
    const normalized = status.toString().toUpperCase().trim();
    
    // Active variations
    if (normalized.includes('AKTIF') || normalized.includes('ACTIVE')) return 'AKTIF';
    
    // Resign variations
    if (normalized.includes('RESIGN') || normalized.includes('KELUAR') || normalized.includes('BERHENTI')) return 'RESIGN';
    
    // Terminated variations
    if (normalized.includes('TERMINATED') || normalized.includes('TERMINATE') || normalized.includes('DIBERHENTIKAN')) return 'TERMINATED';
    
    return normalized;
  };

  // Handle different status formats with normalization
  const activeEmployees = employees.filter(emp => 
    normalizeStatus(emp.statusI) === 'AKTIF'
  ).length;
  
  const resignedEmployees = employees.filter(emp => 
    normalizeStatus(emp.statusI) === 'RESIGN'
  ).length;
  
  const terminatedEmployees = employees.filter(emp => 
    normalizeStatus(emp.statusI) === 'TERMINATED'
  ).length;
  
  const contractEmployees = employees.filter(emp => 
    normalizeStatus(emp.statusII).includes('CONTRACT') || normalizeStatus(emp.statusII).includes('KONTRAK')
  ).length;
  
  // Remove permanent and probation calculations
  
  const uniqueClients = new Set(employees.map(emp => emp.klien)).size;
  const uniqueArea = new Set(employees.map(emp => emp.area).filter(area => area && area.trim() !== '')).size;
  
  // Client breakdown statistics
  const clientBreakdown = ['ADIRA', 'MACF', 'SMSF'].map(client => {
    const clientEmployees = employees.filter(emp => emp.klien === client);
    const activeClientEmployees = clientEmployees.filter(emp => normalizeStatus(emp.statusI) === 'AKTIF');
    return {
      client,
      total: clientEmployees.length,
      active: activeClientEmployees.length,
      percentage: employees.length > 0 ? Math.round((clientEmployees.length / employees.length) * 100) : 0
    };
  });
  
  // More detailed breakdown - Only count active employees
  const activeContract = employees.filter(emp => 
    normalizeStatus(emp.statusI) === 'AKTIF' && 
    (normalizeStatus(emp.statusII).includes('CONTRACT') || normalizeStatus(emp.statusII).includes('KONTRAK'))
  ).length;
  
  // Remove active permanent and probation calculations
  
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
      name: 'Terminated',
      value: terminatedEmployees,
      icon: UserX,
      gradient: 'from-gray-600 to-gray-700',
      bgGradient: 'from-gray-50 to-gray-100',
      textColor: 'text-gray-800',
      iconBg: 'bg-gray-600',
      description: 'Diberhentikan',
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
      description: `${activeContract} aktif`,
      change: '+0%'
    },

    {
      name: 'Total Area',
      value: uniqueArea,
      icon: Building2,
      gradient: 'from-teal-600 to-teal-700',
      bgGradient: 'from-teal-50 to-teal-100',
      textColor: 'text-teal-800',
      iconBg: 'bg-teal-600',
      description: 'Wilayah kerja',
      change: '+0%'
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
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

      {/* Client Breakdown Section */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-black text-gray-900 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-blue-600" />
            Breakdown per Klien
          </h3>
          <p className="text-sm text-gray-600 font-medium">Distribusi karyawan berdasarkan klien</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clientBreakdown.map((breakdown, index) => (
              <div 
                key={breakdown.client}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center overflow-hidden">
                      <ClientLogo client={breakdown.client} size="md" />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900">{breakdown.client}</h4>
                      <p className="text-xs text-gray-500 font-medium">Total Karyawan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-gray-900">{breakdown.total}</p>
                    <p className="text-xs text-gray-500 font-bold">{breakdown.percentage}% total</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700">Aktif</span>
                    <span className="text-sm font-black text-emerald-600">{breakdown.active}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700">Non-Aktif</span>
                    <span className="text-sm font-black text-red-600">{breakdown.total - breakdown.active}</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${breakdown.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}