import { useState, useMemo, useEffect } from 'react';
import { Menu, X, Database, HardDrive } from 'lucide-react';

// Components
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { FilterBar } from './components/FilterBar';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeForm } from './components/EmployeeForm';
import { EmployeeDetail } from './components/EmployeeDetail';
import { PWAInstall } from './components/PWAInstall';
import { PWAStatus } from './components/PWAStatus';
import { PWAUpdateNotifier } from './components/PWAUpdateNotifier';
import { LoadingScreen } from './components/LoadingScreen';

// Types & Data
import { Employee, FilterOptions } from './types/Employee';
import { mockEmployees } from './data/mockData';

// Hooks
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSupabase } from './hooks/useSupabase';

function App() {
  const [localEmployees, setLocalEmployees] = useLocalStorage<Employee[]>('employees', mockEmployees);
  const [useDatabase, setUseDatabase] = useState(false);
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

  const {
    employees: dbEmployees,
    loading: dbLoading,
    error: dbError,
    fetchEmployees,
    createEmployee: createDbEmployee,
    updateEmployee: updateDbEmployee,
    deleteEmployee: deleteDbEmployee,
    bulkCreateEmployees: bulkCreateDbEmployees,
    migrateFromLocalStorage,
    clearAllData: clearDbData
  } = useSupabase();

  // Add test data for logo testing
  const testData: Employee[] = localEmployees.length === 0 ? [
    {
      id: 'test-adira',
      no: 1,
      namaKaryawan: 'Test Employee ADIRA',
      klien: 'ADIRA',
      nik: '1234567890123456',
      tglJoint: '2024-01-01',
      statusI: 'AKTIF',
      statusII: 'Contract',
      area: 'Jakarta',
      cabang: 'Pusat',
      posisi: 'Test',
      namaPic: 'Test PIC',
      alamatEmail: 'test@adira.com',
      noTelp: '08123456789',
      alamatDomisili: 'Jakarta',
      tglLahir: '1990-01-01',
      jenisKelamin: 'Laki-laki',
      pendidikanTerakhir: 'S1',
      bank: 'BCA',
      noRekening: '1234567890',
      namaPenerima: 'Test ADIRA',
      source: 'Test',
      suratPeringatan: []
    },
    {
      id: 'test-macf',
      no: 2,
      namaKaryawan: 'Test Employee MACF',
      klien: 'MACF',
      nik: '2234567890123456',
      tglJoint: '2024-01-01',
      statusI: 'AKTIF',
      statusII: 'Contract',
      area: 'Jakarta',
      cabang: 'Pusat',
      posisi: 'Test',
      namaPic: 'Test PIC',
      alamatEmail: 'test@macf.com',
      noTelp: '08123456789',
      alamatDomisili: 'Jakarta',
      tglLahir: '1990-01-01',
      jenisKelamin: 'Laki-laki',
      pendidikanTerakhir: 'S1',
      bank: 'BCA',
      noRekening: '1234567890',
      namaPenerima: 'Test MACF',
      source: 'Test',
      suratPeringatan: []
    },
    {
      id: 'test-smsf',
      no: 3,
      namaKaryawan: 'Test Employee SMSF',
      klien: 'SMSF',
      nik: '3234567890123456',
      tglJoint: '2024-01-01',
      statusI: 'AKTIF',
      statusII: 'Contract',
      area: 'Jakarta',
      cabang: 'Pusat',
      posisi: 'Test',
      namaPic: 'Test PIC',
      alamatEmail: 'test@smsf.com',
      noTelp: '08123456789',
      alamatDomisili: 'Jakarta',
      tglLahir: '1990-01-01',
      jenisKelamin: 'Laki-laki',
      pendidikanTerakhir: 'S1',
      bank: 'BCA',
      noRekening: '1234567890',
      namaPenerima: 'Test SMSF',
      source: 'Test',
      suratPeringatan: []
    }
  ] : [];

  // Choose data source based on mode
  const employees = useDatabase ? dbEmployees : [...localEmployees, ...testData];
  const isLoading = useDatabase ? dbLoading : false;

  // Initialize database when switching to database mode
  useEffect(() => {
    if (useDatabase) {
      fetchEmployees();
    }
  }, [useDatabase]);

  // Migration handler
  const handleMigrateToDatabase = async () => {
    if (localEmployees.length === 0) {
      alert('Tidak ada data localStorage untuk dimigrate. Silakan tambah data terlebih dahulu.');
      return;
    }

    if (window.confirm(`Migrate ${localEmployees.length} data karyawan dari localStorage ke Supabase database?\n\nData akan tersimpan permanen di cloud dan bisa diakses dari mana saja.`)) {
      try {
        await migrateFromLocalStorage(localEmployees);
        setUseDatabase(true);
        alert(`Berhasil migrate ${localEmployees.length} data karyawan ke database!`);
      } catch (error) {
        alert(`Gagal migrate data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const toggleDataSource = () => {
    if (!useDatabase && dbEmployees.length === 0 && localEmployees.length > 0) {
      // Suggest migration
      if (window.confirm('Anda memiliki data di localStorage. Ingin migrate ke database sekarang?')) {
        handleMigrateToDatabase();
        return;
      }
    }
    setUseDatabase(!useDatabase);
  };

  const filteredEmployees = useMemo(() => {
    let filtered = employees;
    
    // Filter by selected client from sidebar
    if (selectedKlien) {
      filtered = filtered.filter(employee => employee.klien === selectedKlien);
    }
    
    return filtered.filter(employee => {
      // Enhanced search functionality - searches more fields and uses flexible matching
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = searchLower === '' || [
        employee.namaKaryawan,
        employee.nik,
        employee.alamatEmail,
        employee.posisi,
        employee.area,
        employee.cabang,
        employee.klien,
        employee.noTelp,
        employee.statusI,
        employee.statusII,
        employee.jenisKelamin,
        employee.agama,
        employee.pendidikanTerakhir,
        employee.source,
        employee.bank,
        employee.namaPenerima
      ].some(field => 
        field && field.toString().toLowerCase().includes(searchLower)
      );
      
      // Enhanced filter matching - case insensitive and flexible
      const matchesKlien = filters.klien === '' || 
        employee.klien.toLowerCase().includes(filters.klien.toLowerCase());
      const matchesArea = filters.area === '' || 
        employee.area.toLowerCase().includes(filters.area.toLowerCase());
      const matchesCabang = filters.cabang === '' || 
        employee.cabang.toLowerCase().includes(filters.cabang.toLowerCase());
      const matchesStatusI = filters.statusI === '' || 
        employee.statusI.toLowerCase().includes(filters.statusI.toLowerCase());
      const matchesStatusII = filters.statusII === '' || 
        employee.statusII.toLowerCase().includes(filters.statusII.toLowerCase());
      
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

  const handleSaveEmployee = async (employeeData: Omit<Employee, 'id'>) => {
    try {
      if (useDatabase) {
        // Use database
        if (editingEmployee) {
          await updateDbEmployee(editingEmployee.id, employeeData);
        } else {
          await createDbEmployee(employeeData);
        }
      } else {
        // Use localStorage
        if (editingEmployee) {
          setLocalEmployees(prev => prev.map(emp => 
            emp.id === editingEmployee.id 
              ? { ...employeeData, id: editingEmployee.id }
              : emp
          ));
        } else {
          const newEmployee: Employee = {
            ...employeeData,
            id: Date.now().toString()
          };
          setLocalEmployees(prev => [...prev, newEmployee]);
        }
      }
      setShowForm(false);
      setEditingEmployee(undefined);
    } catch (error) {
      alert(`Gagal menyimpan data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    // Find employee details for confirmation
    const employeeToDelete = employees.find(emp => emp.id === id);
    if (!employeeToDelete) {
      alert('Data karyawan tidak ditemukan!');
      return;
    }

    // Enhanced confirmation dialog
    const confirmed = window.confirm(
      `⚠️ HAPUS DATA KARYAWAN ⚠️\n\n` +
      `Nama: ${employeeToDelete.namaKaryawan}\n` +
      `NIK: ${employeeToDelete.nik}\n` +
      `Klien: ${employeeToDelete.klien}\n` +
      `Posisi: ${employeeToDelete.posisi}\n\n` +
      `❌ DATA AKAN DIHAPUS PERMANEN!\n` +
      `Apakah Anda yakin ingin menghapus data ini?`
    );

    if (confirmed) {
      try {
        if (useDatabase) {
          await deleteDbEmployee(id);
          alert(`✅ Data karyawan "${employeeToDelete.namaKaryawan}" berhasil dihapus dari database!`);
        } else {
          setLocalEmployees(prev => prev.filter(emp => emp.id !== id));
          alert(`✅ Data karyawan "${employeeToDelete.namaKaryawan}" berhasil dihapus dari penyimpanan lokal!`);
        }
      } catch (error) {
        alert(`❌ Gagal menghapus data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
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
        'NO PKWT', 'BPJS KETENAGAKERJAAN', 'BPJS KESEHATAN', 'BANK', 'NO REKENING', 'NAMA PENERIMA',
        'ALAMAT EMAIL', 'NO TELP', 'KONTRAK KE', 'JENIS KELAMIN', 
        'PENDIDIKAN TERAKHIR', 'AGAMA', 'SURAT_PERINGATAN'
      ].join(','),
      // Data
      ...employees.map(emp => [
        emp.no, emp.klien, emp.namaPic, emp.area, emp.cabang, emp.nik, emp.namaKaryawan,
        emp.posisi, emp.source, emp.tglJoint, emp.tglEoc, emp.statusI, emp.statusII,
        emp.tglResign, emp.reasonResign, emp.pkwt, emp.noPkwt, emp.bpjsKetenagakerjaan,
        emp.bpjsKesehatan, emp.bank, emp.noRekening, emp.namaPenerima,
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

  // Helper function to parse CSV properly
  const parseCSVLine = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < line.length) {
      const char = line[i];
      
      if (char === '"' && !inQuotes) {
        inQuotes = true;
      } else if (char === '"' && inQuotes) {
        if (line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
      i++;
    }
    
    values.push(current.trim());
    return values;
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const csv = e.target?.result as string;
            const lines = csv.split('\n').filter(line => line.trim());
            
            if (lines.length < 2) {
              alert('File CSV harus memiliki header dan minimal 1 baris data.');
              return;
            }
            
            const headers = parseCSVLine(lines[0]);
            console.log('Headers found:', headers.length, headers);
            
            let addedCount = 0;
            let updatedCount = 0;
            let errorCount = 0;
            const errors: string[] = [];
            
            // First pass: collect all NIKs to check for duplicates within the file
            const nikInFile: string[] = [];
            const duplicateNIKs = new Set<string>();
            
            lines.slice(1).forEach((line, index) => {
              try {
                const values = parseCSVLine(line);
                if (values.length >= 7) {
                  const nik = values[6].trim();
                  if (nik) {
                    if (nikInFile.includes(nik)) {
                      duplicateNIKs.add(nik);
                    } else {
                      nikInFile.push(nik);
                    }
                  }
                }
              } catch (e) {
                // Skip invalid lines for NIK check
              }
            });
            
            const processedData = lines.slice(1).map((line, index) => {
              try {
                const values = parseCSVLine(line);
                
                if (values.length < 28) {
                  errors.push(`Baris ${index + 2}: Jumlah kolom tidak lengkap (${values.length}/29)`);
                  errorCount++;
                  return null;
                }
                
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
                  statusI: values[11] || 'AKTIF',
                  statusII: values[12] || 'Contract',
                  tglResign: values[13] || '',
                  reasonResign: values[14] || '',
                  pkwt: values[15] || '',
                  noPkwt: values[16] || '',
                  bpjsKetenagakerjaan: values[17] || '',
                  bpjsKesehatan: values[18] || '',
                  bank: values[19] || '',
                  noRekening: values[20] || '',
                  namaPenerima: values[21] || '',
                  alamatEmail: values[22] || '',
                  noTelp: values[23] || '',
                  kontrakKe: parseInt(values[24]) || 1,
                  jenisKelamin: values[25] || '',
                  pendidikanTerakhir: values[26] || '',
                  agama: values[27] || '',
                  suratPeringatan: values[28] && values[28].trim() !== '' ? 
                    (values[28].startsWith('[') ? JSON.parse(values[28]) : []) : []
                };
                
                // Check for duplicate NIK within the same file
                if (duplicateNIKs.has(employeeData.nik)) {
                  errors.push(`Baris ${index + 2}: ❌ NIK "${employeeData.nik}" DUPLIKAT dalam file CSV!`);
                  errorCount++;
                  return null;
                }
                
                // Check if employee with same NIK already exists in database
                const existingEmployeeIndex = employees.findIndex(emp => emp.nik === employeeData.nik);
                
                if (existingEmployeeIndex !== -1) {
                  // Found duplicate NIK - add to errors instead of auto-updating
                  const existingEmp = employees[existingEmployeeIndex];
                  errors.push(`Baris ${index + 2}: ❌ NIK "${employeeData.nik}" DUPLIKAT! Sudah digunakan oleh "${existingEmp.namaKaryawan}" (${existingEmp.klien} - ${existingEmp.area})`);
                  errorCount++;
                  return null;
                } else {
                  // New employee
                  addedCount++;
                  return { ...employeeData, isUpdate: false };
                }
              } catch (error) {
                errors.push(`Baris ${index + 2}: ${error instanceof Error ? error.message : 'Error parsing data'}`);
                errorCount++;
                return null;
              }
            }).filter(item => item !== null);
            
            // Show detailed results
            const totalProcessed = addedCount + updatedCount;
            const duplicateCount = errorCount;
            
            if (processedData.length === 0) {
              alert(`❌ IMPORT DIBATALKAN!\n\n${duplicateCount > 0 ? `Ditemukan ${duplicateCount} data duplikat:` : 'Tidak ada data yang valid untuk diproses:'}\n\n${errors.join('\n')}\n\n💡 Pastikan semua NIK unik sebelum import.`);
              return;
            }
            
            if (duplicateCount > 0) {
              const proceed = confirm(`⚠️ PERINGATAN DUPLIKAT!\n\n✅ Data valid: ${addedCount} baris\n❌ Data duplikat: ${duplicateCount} baris\n\nData duplikat:\n${errors.join('\n')}\n\nLanjutkan import data yang valid saja?`);
              if (!proceed) {
                alert('Import dibatalkan oleh user.');
                return;
              }
            }
            
            // Process the data based on storage mode
            if (useDatabase) {
              // Use database bulk import
              try {
                const newEmployees = processedData.filter((emp: any) => !emp.isUpdate).map((emp: any) => {
                  const { isUpdate, existingIndex, ...employeeData } = emp;
                  return employeeData;
                });
                
                if (newEmployees.length > 0) {
                  await bulkCreateDbEmployees(newEmployees);
                }
                
                // Handle updates one by one (Supabase doesn't support bulk updates easily)
                const updatePromises = processedData
                  .filter((emp: any) => emp.isUpdate)
                  .map((emp: any) => {
                    const { isUpdate, existingIndex, ...employeeData } = emp;
                    return updateDbEmployee(employeeData.id, employeeData);
                  });
                
                if (updatePromises.length > 0) {
                  await Promise.all(updatePromises);
                }
              } catch (error) {
                throw new Error(`Database import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
              }
            } else {
              // Use localStorage
              setLocalEmployees(prev => {
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
                    namaPenerima: empData.namaPenerima,
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
                    namaPenerima: empData.namaPenerima,
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
            }
            
            let message = `✅ IMPORT SELESAI!\n\n📊 ${addedCount} karyawan baru ditambahkan\n📝 ${updatedCount} karyawan diperbarui\n❌ ${duplicateCount} data duplikat ditolak\n\n📁 Total berhasil: ${addedCount + updatedCount} data${duplicateCount > 0 ? `\n💡 ${duplicateCount} data duplikat tidak diimport untuk menjaga integritas database.` : ''}`;
            
            if (errorCount > 0) {
              message += `\n\n⚠️ ${errorCount} baris gagal diproses:\n${errors.slice(0, 5).join('\n')}`;
              if (errors.length > 5) {
                message += `\n... dan ${errors.length - 5} error lainnya`;
              }
            }
            
            alert(message);
          } catch (error) {
            console.error('Import error:', error);
            alert(`Gagal mengimpor file: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPastikan file CSV sesuai dengan template dan encoding UTF-8.`);
          }
        };
        reader.readAsText(file, 'UTF-8');
      }
    };
    input.click();
  };

  const handleDownloadTemplate = () => {
    const headers = [
      'NO', 'KLIEN', 'NAMA PIC', 'AREA', 'CABANG', 'NIK', 'NAMA KARYAWAN', 'POSISI', 'SOURCE',
      'TGL JOINT', 'TGL EOC', 'STATUS I', 'STATUS II', 'TGL RESIGN', 'REASON RESIGN', 'PKWT',
      'NO PKWT', 'BPJS KETENAGAKERJAAN', 'BPJS KESEHATAN', 'BANK', 'NO REKENING', 'NAMA PENERIMA',
      'ALAMAT EMAIL', 'NO TELP', 'KONTRAK KE', 'JENIS KELAMIN', 
      'PENDIDIKAN TERAKHIR', 'AGAMA', 'SURAT_PERINGATAN'
    ];

    // Create sample data rows to show format
    const sampleRows = [
      [
        '1', 'ADIRA', 'John Doe', 'Jakarta Pusat', 'Head Office', '1234567890123456', 
        'Jane Smith', 'Manager', 'Internal Recruitment', '2024-01-15', '2024-01-20', 
        'Active', 'Contract', '', '', 'PKWT-001', 'PKW-2024-001', '1234567890', 
        '0987654321', 'BCA', '1234567890', 'Jane Smith', 
        'jane.smith@email.com', '+62812345678', '1', 'Perempuan', 'S1', 'Islam', '[]'
      ],
      [
        '2', 'MACF', 'Alice Johnson', 'Jakarta Selatan', 'Branch A', '9876543210987654', 
        'Bob Wilson', 'Staff', 'External Recruitment', '2024-02-01', '2024-02-05', 
        'Active', 'Contract', '', '', 'PKWT-002', 'PKW-2024-002', '2345678901', 
        '1098765432', 'Mandiri', '2345678901', 'Bob Wilson', 
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

  // Clear all data handler
  const handleClearAllData = async () => {
    const totalEmployees = employees.length;
    
    if (totalEmployees === 0) {
      alert('Tidak ada data untuk dihapus.');
      return;
    }

    const confirmMessage = `⚠️ PERINGATAN: Menghapus semua data!\n\nAnda akan menghapus ${totalEmployees} data karyawan dari ${useDatabase ? 'database' : 'localStorage'}.\n\nTindakan ini TIDAK DAPAT DIBATALKAN!\n\nApakah Anda yakin ingin melanjutkan?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        if (useDatabase) {
          await clearDbData();
        } else {
          setLocalEmployees([]);
        }
        
        // Reset all UI state
        setShowForm(false);
        setEditingEmployee(undefined);
        setViewingEmployee(undefined);
        setSearchTerm('');
        setFilters({
          klien: '',
          area: '',
          cabang: '',
          statusI: '',
          statusII: ''
        });
        
        alert(`✅ Berhasil menghapus ${totalEmployees} data karyawan!`);
      } catch (error) {
        alert(`❌ Gagal menghapus data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  // Listen for custom event from empty state button
  useEffect(() => {
    const handleAddEmployee = () => {
      setEditingEmployee(undefined);
      setShowForm(true);
    };

    window.addEventListener('addEmployee', handleAddEmployee);
    return () => window.removeEventListener('addEmployee', handleAddEmployee);
  }, []);

  // Show loading screen when database is loading
  if (isLoading && useDatabase) {
    return <LoadingScreen message="Loading data..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex flex-col overflow-hidden">
      <Navbar 
        onAddEmployee={handleAddEmployee}
        onExport={handleExport}
        onImport={handleImport}
        onDownloadTemplate={handleDownloadTemplate}
        onClearAllData={handleClearAllData}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      
      {/* Data Source Toggle */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {useDatabase ? (
                <Database className="h-4 w-4 text-green-600" />
              ) : (
                <HardDrive className="h-4 w-4 text-blue-600" />
              )}
              <span className="text-sm font-medium text-gray-700">
                Storage: {useDatabase ? 'Supabase Database' : 'localStorage'}
              </span>
            </div>
            
            <button
              onClick={toggleDataSource}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              disabled={isLoading}
            >
              Switch to {useDatabase ? 'localStorage' : 'Database'}
            </button>
            
            {!useDatabase && localEmployees.length > 0 && (
              <button
                onClick={handleMigrateToDatabase}
                className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors"
              >
                Migrate to Database
              </button>
            )}
          </div>
          
          <div className="text-xs text-gray-500">
            {employees.length} employees loaded
            {dbError && (
              <span className="text-red-500 ml-2">• Database Error</span>
            )}
          </div>
        </div>
      </div>
      
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
              employees={employees}
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

      {/* PWA Components */}
      <PWAStatus />
      <PWAInstall />
      <PWAUpdateNotifier />
    </div>
  );
}

export default App;