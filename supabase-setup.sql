-- SQL Script untuk membuat table employees di Supabase
-- Copy dan paste script ini ke Supabase SQL Editor

-- 1. Buat table employees
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  no INTEGER NOT NULL,
  klien TEXT NOT NULL,
  nama_pic TEXT,
  area TEXT,
  cabang TEXT,
  nik TEXT,
  nama_karyawan TEXT NOT NULL,
  posisi TEXT,
  source TEXT,
  tgl_joint TEXT,
  tgl_eoc TEXT,
  status_i TEXT DEFAULT 'Active',
  status_ii TEXT DEFAULT 'Contract',
  tgl_resign TEXT,
  reason_resign TEXT,
  pkwt TEXT,
  no_pkwt TEXT,
  bpjs_ketenagakerjaan TEXT,
  bpjs_kesehatan TEXT,
  bank TEXT,
  no_rekening TEXT,
  update_bank TEXT,
  update_no_rekening TEXT,
  alamat_email TEXT,
  no_telp TEXT,
  kontrak_ke INTEGER DEFAULT 1,
  jenis_kelamin TEXT,
  pendidikan_terakhir TEXT,
  agama TEXT,
  surat_peringatan JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Buat index untuk pencarian cepat
CREATE INDEX IF NOT EXISTS idx_employees_klien ON employees(klien);
CREATE INDEX IF NOT EXISTS idx_employees_nik ON employees(nik);
CREATE INDEX IF NOT EXISTS idx_employees_nama ON employees(nama_karyawan);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status_i, status_ii);

-- 3. Buat function untuk auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Buat trigger untuk auto-update timestamp
DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- 6. Buat policy untuk akses public (bisa diubah sesuai kebutuhan)
DROP POLICY IF EXISTS "Enable all access for employees" ON employees;
CREATE POLICY "Enable all access for employees" ON employees
  FOR ALL 
  TO public
  USING (true)
  WITH CHECK (true);

-- 7. Insert sample data (opsional - hapus jika tidak diperlukan)
INSERT INTO employees (
  no, klien, nama_pic, area, cabang, nik, nama_karyawan, posisi, source,
  tgl_joint, tgl_eoc, status_i, status_ii, kontrak_ke, jenis_kelamin, 
  pendidikan_terakhir, agama
) VALUES 
(1, 'ADIRA', 'John Doe', 'Jakarta Pusat', 'Head Office', '1234567890123456', 
 'Jane Smith', 'Manager', 'Internal Recruitment', '2024-01-15', '2024-01-20', 
 'Active', 'Permanent', 1, 'Perempuan', 'S1', 'Islam'),
(2, 'MACF', 'Alice Johnson', 'Jakarta Selatan', 'Branch A', '9876543210987654', 
 'Bob Wilson', 'Staff', 'External Recruitment', '2024-02-01', '2024-02-05', 
 'Active', 'Contract', 1, 'Laki-laki', 'SMA/SMK', 'Kristen Protestan')
ON CONFLICT (id) DO NOTHING;