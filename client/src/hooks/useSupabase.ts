import { useState, useEffect } from 'react';
import { supabase, Employee, isSupabaseConfigured } from '../lib/supabase';
import { Employee as LocalEmployee } from '../types/Employee';

// Convert between local and Supabase employee formats
const convertToSupabaseFormat = (localEmp: LocalEmployee): Omit<Employee, 'id' | 'created_at' | 'updated_at'> => ({
  no: localEmp.no,
  klien: localEmp.klien,
  nama_pic: localEmp.namaPic,
  area: localEmp.area,
  cabang: localEmp.cabang,
  nik: localEmp.nik,
  nama_karyawan: localEmp.namaKaryawan,
  posisi: localEmp.posisi,
  source: localEmp.source,
  tgl_joint: localEmp.tglJoint,
  tgl_eoc: localEmp.tglEoc,
  status_i: localEmp.statusI,
  status_ii: localEmp.statusII,
  tgl_resign: localEmp.tglResign,
  reason_resign: localEmp.reasonResign,
  pkwt: localEmp.pkwt,
  no_pkwt: localEmp.noPkwt,
  bpjs_ketenagakerjaan: localEmp.bpjsKetenagakerjaan,
  bpjs_kesehatan: localEmp.bpjsKesehatan,
  bank: localEmp.bank,
  no_rekening: localEmp.noRekening,
  nama_penerima: localEmp.namaPenerima,
  alamat_email: localEmp.alamatEmail,
  no_telp: localEmp.noTelp,
  kontrak_ke: localEmp.kontrakKe,
  jenis_kelamin: localEmp.jenisKelamin,
  pendidikan_terakhir: localEmp.pendidikanTerakhir,
  agama: localEmp.agama,
  surat_peringatan: localEmp.suratPeringatan || []
});

const convertFromSupabaseFormat = (supabaseEmp: Employee): LocalEmployee => ({
  id: supabaseEmp.id || '',
  no: supabaseEmp.no,
  klien: supabaseEmp.klien,
  namaPic: supabaseEmp.nama_pic,
  area: supabaseEmp.area,
  cabang: supabaseEmp.cabang,
  nik: supabaseEmp.nik,
  namaKaryawan: supabaseEmp.nama_karyawan,
  posisi: supabaseEmp.posisi,
  source: supabaseEmp.source,
  tglJoint: supabaseEmp.tgl_joint,
  tglEoc: supabaseEmp.tgl_eoc,
  statusI: supabaseEmp.status_i,
  statusII: supabaseEmp.status_ii,
  tglResign: supabaseEmp.tgl_resign,
  reasonResign: supabaseEmp.reason_resign,
  pkwt: supabaseEmp.pkwt,
  noPkwt: supabaseEmp.no_pkwt,
  bpjsKetenagakerjaan: supabaseEmp.bpjs_ketenagakerjaan,
  bpjsKesehatan: supabaseEmp.bpjs_kesehatan,
  bank: supabaseEmp.bank,
  noRekening: supabaseEmp.no_rekening,
  namaPenerima: supabaseEmp.nama_penerima,
  alamatEmail: supabaseEmp.alamat_email,
  noTelp: supabaseEmp.no_telp,
  kontrakKe: supabaseEmp.kontrak_ke,
  jenisKelamin: supabaseEmp.jenis_kelamin,
  pendidikanTerakhir: supabaseEmp.pendidikan_terakhir,
  agama: supabaseEmp.agama,
  suratPeringatan: supabaseEmp.surat_peringatan || []
});

export function useSupabase() {
  const [employees, setEmployees] = useState<LocalEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if Supabase is configured
      if (!isSupabaseConfigured() || !supabase) {
        throw new Error('Database tidak dikonfigurasi. Silakan set environment variables VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY atau gunakan mode localStorage.');
      }
      
      try {
        // Check if table exists first
        const canConnect = await supabase.checkConnection();
        if (!canConnect) {
          throw new Error('Database table belum dibuat. Silakan buat table "employees" di Supabase dashboard terlebih dahulu.');
        }
        
        const data = await supabase.getEmployees();
        setEmployees(data.map(convertFromSupabaseFormat));
      } catch (dbError) {
        // If database is not available, fall back to empty array
        console.warn('Database not available, using empty data:', dbError);
        setEmployees([]);
        setError('Database tidak tersedia. Menggunakan mode localStorage.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
      console.error('Fetch employees error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (employee: Omit<LocalEmployee, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const supabaseEmployee = convertToSupabaseFormat(employee as LocalEmployee);
      const created = await supabase.createEmployee(supabaseEmployee);
      const newEmployee = convertFromSupabaseFormat(created);
      setEmployees(prev => [...prev, newEmployee]);
      return newEmployee;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employee');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id: string, updates: Partial<LocalEmployee>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if Supabase is configured
      if (!isSupabaseConfigured() || !supabase) {
        throw new Error('Database tidak dikonfigurasi. Silakan gunakan mode localStorage atau konfigurasikan Supabase credentials.');
      }
      
      const supabaseUpdates = convertToSupabaseFormat(updates as LocalEmployee);
      const updated = await supabase.updateEmployee(id, supabaseUpdates);
      const updatedEmployee = convertFromSupabaseFormat(updated);
      setEmployees(prev => prev.map(emp => emp.id === id ? updatedEmployee : emp));
      return updatedEmployee;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update employee');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await supabase.deleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete employee');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const bulkCreateEmployees = async (employeesData: Omit<LocalEmployee, 'id'>[]) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if Supabase is configured
      if (!isSupabaseConfigured() || !supabase) {
        throw new Error('Database tidak dikonfigurasi. Silakan gunakan mode localStorage atau konfigurasikan Supabase credentials.');
      }
      
      const supabaseEmployees = employeesData.map(emp => convertToSupabaseFormat(emp as LocalEmployee));
      const created = await supabase.bulkCreateEmployees(supabaseEmployees);
      const newEmployees = created.map(convertFromSupabaseFormat);
      setEmployees(prev => [...prev, ...newEmployees]);
      return newEmployees;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk create employees');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const migrateFromLocalStorage = async (localEmployees: LocalEmployee[]) => {
    try {
      setLoading(true);
      setError(null);
      
      if (localEmployees.length === 0) {
        return;
      }

      // Clear existing data and migrate
      const supabaseEmployees = localEmployees.map(emp => convertToSupabaseFormat(emp));
      const created = await supabase.bulkCreateEmployees(supabaseEmployees);
      const newEmployees = created.map(convertFromSupabaseFormat);
      setEmployees(newEmployees);
      
      return newEmployees;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to migrate from localStorage');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Delete all employees one by one
      const currentEmployees = [...employees];
      for (const emp of currentEmployees) {
        await supabase.deleteEmployee(emp.id);
      }
      
      setEmployees([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear all data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    bulkCreateEmployees,
    migrateFromLocalStorage,
    clearAllData
  };
}