-- Script SQL untuk update schema employees
-- Hapus kolom update_bank dan update_no_rekening, tambah kolom nama_penerima

-- 1. Hapus kolom yang tidak diperlukan
ALTER TABLE employees DROP COLUMN IF EXISTS update_bank;
ALTER TABLE employees DROP COLUMN IF EXISTS update_no_rekening;

-- 2. Tambah kolom nama_penerima
ALTER TABLE employees ADD COLUMN IF NOT EXISTS nama_penerima TEXT;

-- 3. Update dokumentasi
COMMENT ON COLUMN employees.nama_penerima IS 'Nama penerima untuk rekening bank';