# 🔧 Update Schema Supabase - WAJIB DIJALANKAN

## Status: Schema belum sinkron! 
Kolom `nama_penerima` belum ada di database Supabase.

## Langkah Update Schema:

### 1. Buka Supabase Dashboard
- Masuk ke: [Supabase Dashboard](https://supabase.com/dashboard/projects)
- Pilih project Anda: `smrcndetprrmonmzaogj`

### 2. Jalankan SQL Script
- Klik **"SQL Editor"** di sidebar kiri
- Klik **"New Query"** 
- Copy dan paste script berikut:

```sql
-- Update schema employees - Hapus kolom lama, tambah kolom baru
ALTER TABLE employees DROP COLUMN IF EXISTS update_bank;
ALTER TABLE employees DROP COLUMN IF EXISTS update_no_rekening;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS nama_penerima TEXT;

-- Verifikasi perubahan
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'employees' 
  AND column_name IN ('nama_penerima', 'update_bank', 'update_no_rekening')
ORDER BY column_name;
```

### 3. Jalankan Script
- Klik tombol **"Run"** atau tekan `Ctrl+Enter`
- Pastikan muncul pesan sukses
- Hasil query harus menampilkan:
  ```
  column_name    | data_type
  nama_penerima  | text
  ```

### 4. Selesai!
Setelah script berhasil dijalankan, schema akan sinkron dengan aplikasi.

## Verifikasi Schema
Script akan otomatis memverifikasi bahwa:
- ✅ Kolom `update_bank` sudah dihapus
- ✅ Kolom `update_no_rekening` sudah dihapus  
- ✅ Kolom `nama_penerima` sudah ditambahkan

## Jika Ada Error
Jika muncul error "permission denied", gunakan script alternatif:
```sql
-- Untuk user dengan permission terbatas
COMMENT ON COLUMN employees.nama_penerima IS 'Nama penerima rekening bank';
```

Laporan ke admin project untuk menjalankan ALTER TABLE command.