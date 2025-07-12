import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { FilterBar } from './components/FilterBar';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeForm } from './components/EmployeeForm';
import { EmployeeDetail } from './components/EmployeeDetail';
import { Employee, FilterOptions } from './types/Employee';
import { mockEmployees } from './data/mockData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Menu, X } from 'lucide-react';

function App() {
  const [employees, setEmployees] = useLocalStorage<Employee[]>('employees', mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKlien, setSelectedKlien] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    klien: '',
    area: '',
    cabang: '',
    statusI: '',
    statusII: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
  const [viewingEmployee, setViewingEmployee] = useState<Employee | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredEmployees = useMemo(() => {
    let filtered = employees;
    
    // Filter by selected client from sidebar
    if (selectedKlien) {
      filtered = filtered.filter(employee => employee.klien === selectedKlien);
    }
    
    return filtered.filter(employee => {
      const matchesSearch = 
        employee.namaKaryawan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.alamatEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.posisi.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesKlien = filters.klien === '' || employee.klien === filters.klien;
      const matchesArea = filters.area === '' || employee.area === filters.area;
      const matchesCabang = filters.cabang === '' || employee.cabang === filters.cabang;
      const matchesStatusI = filters.statusI === '' || employee.statusI === filters.statusI;
      const matchesStatusII = filters.statusII === '' || employee.statusII === filters.statusII;
      
      return matchesSearch && matchesKlien && matchesArea && matchesCabang && matchesStatusI && matchesStatusII;
    });
  }, [employees, searchTerm, filters, selectedKlien]);

  // Calculate employee counts per client
  const employeeCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    employees.forEach(emp => {
      counts[emp.klien] = (counts[emp.klien] || 0) + 1;
    });
    return counts;
  }, [employees]);

  const handleAddEmployee = () => {
    setEditingEmployee(undefined);
    setShowForm(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleViewEmployee = (employee: Employee) => {
    setViewingEmployee(employee);
  };

  const handleSaveEmployee = (employeeData: Omit<Employee, 'id'>) => {
    if (editingEmployee) {
      setEmployees(prev => prev.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...employeeData, id: editingEmployee.id }
          : emp
      ));
    } else {
      const newEmployee: Employee = {
        ...employeeData,
        id: Date.now().toString()
      };
      setEmployees(prev => [...prev, newEmployee]);
    }
    setShowForm(false);
    setEditingEmployee(undefined);
  };

  const handleDeleteEmployee = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data karyawan ini?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const handleExport = () => {
    const csvContent = [
      // Header
      [
        'NO', 'KLIEN', 'NAMA PIC', 'AREA', 'CABANG', 'NIK', 'NAMA KARYAWAN', 'POSISI', 'SOURCE',
        'TGL JOINT', 'TGL EOC', 'STATUS I', 'STATUS II', 'TGL RESIGN', 'REASON RESIGN', 'PKWT',
        'NO PKWT', 'BPJS KETENAGAKERJAAN', 'BPJS KESEHATAN', 'BANK', 'NO REKENING', 'UPDATE BANK',
        'UPDATE NO REKENING', 'ALAMAT EMAIL', 'NO TELP', 'KONTRAK KE', 'SURAT_PERINGATAN'
      ].join(','),
      // Data
      ...employees.map(emp => [
        emp.no, emp.klien, emp.namaPic, emp.area, emp.cabang, emp.nik, emp.namaKaryawan,
        emp.posisi, emp.source, emp.tglJoint, emp.tglEoc, emp.statusI, emp.statusII,
        emp.tglResign, emp.reasonResign, emp.pkwt, emp.noPkwt, emp.bpjsKetenagakerjaan,
        emp.bpjsKesehatan, emp.bank, emp.noRekening, emp.updateBank, emp.updateNoRekening,
        emp.alamatEmail, emp.noTelp, emp.kontrakKe, JSON.stringify(emp.suratPeringatan || [])
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `database-karyawan-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const csv = e.target?.result as string;
          // Basic CSV parsing - in production, use a proper CSV parser
          const lines = csv.split('\n');
          const headers = lines[0].split(',');
          const data = lines.slice(1).filter(line => line.trim()).map(line => {
            const values = line.split(',');
            return {
              id: Date.now().toString() + Math.random(),
              no: parseInt(values[0]) || 0,
              klien: values[1] || '',
              namaPic: values[2] || '',
              area: values[3] || '',
              cabang: values[4] || '',
              nik: values[5] || '',
              namaKaryawan: values[6] || '',
              posisi: values[7] || '',
              source: values[8] || '',
              tglJoint: values[9] || '',
              tglEoc: values[10] || '',
              statusI: values[11] || 'Active',
              statusII: values[12] || 'Contract',
              tglResign: values[13] || '',
              reasonResign: values[14] || '',
              pkwt: values[15] || '',
              noPkwt: values[16] || '',
              bpjsKetenagakerjaan: values[17] || '',
              bpjsKesehatan: values[18] || '',
              bank: values[19] || '',
              noRekening: values[20] || '',
              updateBank: values[21] || '',
              updateNoRekening: values[22] || '',
              alamatEmail: values[23] || '',
              noTelp: values[24] || '',
              kontrakKe: parseInt(values[25]) || 1,
              suratPeringatan: values[26] ? JSON.parse(values[26]) : []
            } as Employee;
          });
          setEmployees(prev => [...prev, ...data]);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearFilters = () => {
    setFilters({
      klien: '',
      area: '',
      cabang: '',
      statusI: '',
      statusII: ''
    });
    setSearchTerm('');
  };

  // Listen for custom event from empty state button
  React.useEffect(() => {
    const handleAddEmployee = () => {
      setEditingEmployee(undefined);
      setShowForm(true);
    };

    window.addEventListener('addEmployee', handleAddEmployee);
    return () => window.removeEventListener('addEmployee', handleAddEmployee);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Navbar 
        onAddEmployee={handleAddEmployee}
        onExport={handleExport}
        onImport={handleImport}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex flex-1 relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 lg:z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 lg:z-40
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          transition-transform duration-300 ease-in-out
        `}>
          <Sidebar
            selectedKlien={selectedKlien}
            onKlienChange={setSelectedKlien}
            employeeCounts={employeeCounts}
            totalEmployees={employees.length}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
        
        {/* Main Content */}
        <div className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'lg:ml-64 xl:ml-72' : 'ml-0'
        }`}>
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 overflow-auto">
            <Dashboard employees={selectedKlien ? employees.filter(emp => emp.klien === selectedKlien) : employees} />
          
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={handleClearFilters}
            />

            <EmployeeTable
              employees={filteredEmployees}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
              onView={handleViewEmployee}
            />
          </div>
        </div>
      </div>

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSave={handleSaveEmployee}
          onCancel={() => {
            setShowForm(false);
            setEditingEmployee(undefined);
          }}
          selectedKlien={selectedKlien}
          employees={employees}
        />
      )}

      {viewingEmployee && (
        <EmployeeDetail
          employee={viewingEmployee}
          onClose={() => setViewingEmployee(undefined)}
        />
      )}
    </div>
  );
}

export default App;