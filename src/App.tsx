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
    if (employees.length === 0) {
      alert('Tidak ada data untuk diekspor. Silakan tambah data karyawan terlebih dahulu.');
      return;
    }

    const csvContent = [
      // Header
      [
        'NO', 'KLIEN', 'NAMA PIC', 'AREA', 'CABANG', 'NIK', 'NAMA KARYAWAN', 'POSISI', 'SOURCE',
        'TGL JOINT', 'TGL EOC', 'STATUS I', 'STATUS II', 'TGL RESIGN', 'REASON RESIGN', 'PKWT',
        'NO PKWT', 'BPJS KETENAGAKERJAAN', 'BPJS KESEHATAN', 'BANK', 'NO REKENING', 'UPDATE BANK',
        'UPDATE NO REKENING', 'ALAMAT EMAIL', 'NO TELP', 'KONTRAK KE', 'JENIS KELAMIN', 
        'PENDIDIKAN TERAKHIR', 'AGAMA', 'SURAT_PERINGATAN'
      ].join(','),
      // Data
      ...employees.map(emp => [
        emp.no, emp.klien, emp.namaPic, emp.area, emp.cabang, emp.nik, emp.namaKaryawan,
        emp.posisi, emp.source, emp.tglJoint, emp.tglEoc, emp.statusI, emp.statusII,
        emp.tglResign, emp.reasonResign, emp.pkwt, emp.noPkwt, emp.bpjsKetenagakerjaan,
        emp.bpjsKesehatan, emp.bank, emp.noRekening, emp.updateBank, emp.updateNoRekening,
        emp.alamatEmail, emp.noTelp, emp.kontrakKe, emp.jenisKelamin, emp.pendidikanTerakhir,
        emp.agama, JSON.stringify(emp.suratPeringatan || [])
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
          try {
            const csv = e.target?.result as string;
            const lines = csv.split('\n');
            const headers = lines[0].split(',');
            
            let addedCount = 0;
            let updatedCount = 0;
            
            const processedData = lines.slice(1).filter(line => line.trim()).map((line, index) => {
              const values = line.split(',');
              const employeeData = {
                id: Date.now().toString() + Math.random(),
                no: parseInt(values[0]) || (employees.length + index + 1),
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
                jenisKelamin: values[26] || '',
                pendidikanTerakhir: values[27] || '',
                agama: values[28] || '',
                suratPeringatan: values[29] ? JSON.parse(values[29]) : []
              };
              
              // Check if employee with same NIK already exists
              const existingEmployeeIndex = employees.findIndex(emp => emp.nik === employeeData.nik);
              
              if (existingEmployeeIndex !== -1) {
                // Update existing employee
                employeeData.id = employees[existingEmployeeIndex].id; // Keep existing ID
                updatedCount++;
                return { ...employeeData, isUpdate: true, existingIndex: existingEmployeeIndex };
              } else {
                // New employee
                addedCount++;
                return { ...employeeData, isUpdate: false };
              }
            });
            
            // Process the data: update existing and add new
            setEmployees(prev => {
              let updatedEmployees = [...prev];
              
              processedData.forEach((empData: any) => {
                if (empData.isUpdate) {
                  // Update existing employee
                  updatedEmployees[empData.existingIndex] = {
                    id: empData.id,
                    no: empData.no,
                    klien: empData.klien,
                    namaPic: empData.namaPic,
                    area: empData.area,
                    cabang: empData.cabang,
                    nik: empData.nik,
                    namaKaryawan: empData.namaKaryawan,
                    posisi: empData.posisi,
                    source: empData.source,
                    tglJoint: empData.tglJoint,
                    tglEoc: empData.tglEoc,
                    statusI: empData.statusI,
                    statusII: empData.statusII,
                    tglResign: empData.tglResign,
                    reasonResign: empData.reasonResign,
                    pkwt: empData.pkwt,
                    noPkwt: empData.noPkwt,
                    bpjsKetenagakerjaan: empData.bpjsKetenagakerjaan,
                    bpjsKesehatan: empData.bpjsKesehatan,
                    bank: empData.bank,
                    noRekening: empData.noRekening,
                    updateBank: empData.updateBank,
                    updateNoRekening: empData.updateNoRekening,
                    alamatEmail: empData.alamatEmail,
                    noTelp: empData.noTelp,
                    kontrakKe: empData.kontrakKe,
                    jenisKelamin: empData.jenisKelamin,
                    pendidikanTerakhir: empData.pendidikanTerakhir,
                    agama: empData.agama,
                    suratPeringatan: empData.suratPeringatan
                  };
                } else {
                  // Add new employee
                  updatedEmployees.push({
                    id: empData.id,
                    no: empData.no,
                    klien: empData.klien,
                    namaPic: empData.namaPic,
                    area: empData.area,
                    cabang: empData.cabang,
                    nik: empData.nik,
                    namaKaryawan: empData.namaKaryawan,
                    posisi: empData.posisi,
                    source: empData.source,
                    tglJoint: empData.tglJoint,
                    tglEoc: empData.tglEoc,
                    statusI: empData.statusI,
                    statusII: empData.statusII,
                    tglResign: empData.tglResign,
                    reasonResign: empData.reasonResign,
                    pkwt: empData.pkwt,
                    noPkwt: empData.noPkwt,
                    bpjsKetenagakerjaan: empData.bpjsKetenagakerjaan,
                    bpjsKesehatan: empData.bpjsKesehatan,
                    bank: empData.bank,
                    noRekening: empData.noRekening,
                    updateBank: empData.updateBank,
                    updateNoRekening: empData.updateNoRekening,
                    alamatEmail: empData.alamatEmail,
                    noTelp: empData.noTelp,
                    kontrakKe: empData.kontrakKe,
                    jenisKelamin: empData.jenisKelamin,
                    pendidikanTerakhir: empData.pendidikanTerakhir,
                    agama: empData.agama,
                    suratPeringatan: empData.suratPeringatan
                  });
                }
              });
              
              return updatedEmployees;
            });
            
            alert(`Berhasil mengimpor data:\n- ${addedCount} karyawan baru ditambahkan\n- ${updatedCount} karyawan diperbarui\n\nTotal: ${addedCount + updatedCount} data diproses.`);
          } catch (error) {
            alert('Gagal mengimpor file. Pastikan format CSV sesuai dengan template.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleDownloadTemplate = () => {
    const headers = [
      'NO', 'KLIEN', 'NAMA PIC', 'AREA', 'CABANG', 'NIK', 'NAMA KARYAWAN', 'POSISI', 'SOURCE',
      'TGL JOINT', 'TGL EOC', 'STATUS I', 'STATUS II', 'TGL RESIGN', 'REASON RESIGN', 'PKWT',
      'NO PKWT', 'BPJS KETENAGAKERJAAN', 'BPJS KESEHATAN', 'BANK', 'NO REKENING', 'UPDATE BANK',
      'UPDATE NO REKENING', 'ALAMAT EMAIL', 'NO TELP', 'KONTRAK KE', 'JENIS KELAMIN', 
      'PENDIDIKAN TERAKHIR', 'AGAMA', 'SURAT_PERINGATAN'
    ];

    // Create sample data rows to show format
    const sampleRows = [
      [
        '1', 'ADIRA', 'John Doe', 'Jakarta Pusat', 'Head Office', '1234567890123456', 
        'Jane Smith', 'Manager', 'Internal Recruitment', '2024-01-15', '2024-01-20', 
        'Active', 'Permanent', '', '', 'PKWT-001', 'PKW-2024-001', '1234567890', 
        '0987654321', 'BCA', '1234567890', '2024-01-15', '2024-01-15', 
        'jane.smith@email.com', '+62812345678', '1', 'Perempuan', 'S1', 'Islam', '[]'
      ],
      [
        '2', 'MACF', 'Alice Johnson', 'Jakarta Selatan', 'Branch A', '9876543210987654', 
        'Bob Wilson', 'Staff', 'External Recruitment', '2024-02-01', '2024-02-05', 
        'Active', 'Contract', '', '', 'PKWT-002', 'PKW-2024-002', '2345678901', 
        '1098765432', 'Mandiri', '2345678901', '2024-02-01', '2024-02-01', 
        'bob.wilson@email.com', '+62823456789', '1', 'Laki-laki', 'SMA/SMK', 'Kristen Protestan', '[]'
      ]
    ];

    const csvContent = [
      headers.join(','),
      ...sampleRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `template-data-karyawan-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex flex-col overflow-hidden">
      <Navbar 
        onAddEmployee={handleAddEmployee}
        onExport={handleExport}
        onImport={handleImport}
        onDownloadTemplate={handleDownloadTemplate}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex flex-1 relative min-h-0">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-40 lg:static lg:translate-x-0 lg:block
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
          transition-transform duration-300 ease-in-out lg:flex-shrink-0
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
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 px-3 sm:px-4 lg:px-6 xl:px-8 py-4 lg:py-6 xl:py-8 overflow-auto">
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