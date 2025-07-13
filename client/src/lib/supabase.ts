const SUPABASE_URL = 'https://smrcndetprrmonmzaogj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtcmNuZGV0cHJybW9ubXphb2dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0Mjg2MTMsImV4cCI6MjA2ODAwNDYxM30.SsTyBGO8E2o6Jj_-NVVR-egbCFYJ87oqqgaugJ2iMKg';

export interface Employee {
  id?: string;
  no: number;
  klien: string;
  nama_pic: string;
  area: string;
  cabang: string;
  nik: string;
  nama_karyawan: string;
  posisi: string;
  source: string;
  tgl_joint: string;
  tgl_eoc: string;
  status_i: string;
  status_ii: string;
  tgl_resign: string;
  reason_resign: string;
  pkwt: string;
  no_pkwt: string;
  bpjs_ketenagakerjaan: string;
  bpjs_kesehatan: string;
  bank: string;
  no_rekening: string;
  nama_penerima: string;
  alamat_email: string;
  no_telp: string;
  kontrak_ke: number;
  jenis_kelamin: string;
  pendidikan_terakhir: string;
  agama: string;
  surat_peringatan: any[];
  created_at?: string;
  updated_at?: string;
}

class SupabaseClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(url: string, key: string) {
    this.baseUrl = url;
    this.apiKey = key;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/rest/v1${endpoint}`;
    const headers = {
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Supabase error: ${response.status} ${error}`);
    }

    return response.json();
  }

  async getEmployees(): Promise<Employee[]> {
    return this.request('/employees?select=*&order=no.asc');
  }

  async createEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
    const [result] = await this.request('/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
    return result;
  }

  async updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee> {
    const [result] = await this.request(`/employees?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(employee),
    });
    return result;
  }

  async deleteEmployee(id: string): Promise<void> {
    await this.request(`/employees?id=eq.${id}`, {
      method: 'DELETE',
    });
  }

  async bulkCreateEmployees(employees: Omit<Employee, 'id' | 'created_at' | 'updated_at'>[]): Promise<Employee[]> {
    return this.request('/employees', {
      method: 'POST',
      body: JSON.stringify(employees),
    });
  }

  async checkConnection(): Promise<boolean> {
    try {
      await this.request('/employees?select=id&limit=1');
      return true;
    } catch (error) {
      console.log('Table not found, need to create via Supabase dashboard');
      return false;
    }
  }
}

export const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);