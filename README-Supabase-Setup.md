# Setup Database Supabase untuk Employee Management System

## Langkah 1: Buat Table di Supabase

1. **Buka Supabase Dashboard**
   - Pergi ke: https://smrcndetprrmonmzaogj.supabase.co
   - Login dengan akun Supabase Anda

2. **Akses SQL Editor**
   - Di sidebar kiri, klik "SQL Editor"
   - Klik "+ New query"

3. **Jalankan Script SQL**
   - Copy seluruh isi file `supabase-setup.sql`
   - Paste ke SQL Editor
   - Klik "Run" untuk menjalankan script

4. **Verifikasi Table**
   - Di sidebar kiri, klik "Table Editor"
   - Pastikan table "employees" sudah terbuat
   - Cek kolom-kolom sudah sesuai

## Langkah 2: Aktivasi Database Mode di Aplikasi

1. **Buka Aplikasi Employee Management**
   - Pastikan aplikasi sudah running
   - Lihat bar di bawah navbar

2. **Switch ke Database Mode**
   - Klik tombol "Switch to Database"
   - Aplikasi akan coba koneksi ke Supabase

3. **Migrate Data (Opsional)**
   - Jika Anda punya data di localStorage
   - Klik tombol "Migrate to Database"
   - Konfirmasi untuk pindahkan data

## Langkah 3: Test Functionality

1. **Test CRUD Operations**
   - Tambah karyawan baru
   - Edit data existing
   - Hapus data
   - Import CSV

2. **Test Persistence**
   - Refresh browser
   - Buka di browser/device lain
   - Data harus tetap ada

## Benefits Database Mode

✅ **Data Persistent**: Tidak hilang meski clear cache
✅ **Multi-Device**: Akses dari mana saja
✅ **Real-time**: Data tersinkronisasi
✅ **Backup**: Otomatis backup di cloud
✅ **Scalable**: Bisa handle data besar
✅ **Search**: Full-text search capabilities

## Troubleshooting

**Error "table not found"**
- Pastikan script SQL sudah dijalankan
- Cek di Table Editor apakah table "employees" ada

**Error "permission denied"**
- Pastikan RLS policy sudah dibuat
- Cek API key masih valid

**Data tidak muncul**
- Refresh aplikasi
- Cek di Supabase dashboard apakah data tersimpan

## Security Notes

- Table menggunakan Row Level Security (RLS)
- Saat ini policy set ke "public access"
- Untuk production, tambahkan authentication
- Update policy sesuai kebutuhan security

## Database Schema

```sql
employees (
  id: UUID (Primary Key)
  no: INTEGER
  klien: TEXT
  nama_pic: TEXT
  area: TEXT
  cabang: TEXT
  nik: TEXT
  nama_karyawan: TEXT
  posisi: TEXT
  source: TEXT
  tgl_joint: TEXT
  tgl_eoc: TEXT
  status_i: TEXT
  status_ii: TEXT
  tgl_resign: TEXT
  reason_resign: TEXT
  pkwt: TEXT
  no_pkwt: TEXT
  bpjs_ketenagakerjaan: TEXT
  bpjs_kesehatan: TEXT
  bank: TEXT
  no_rekening: TEXT
  update_bank: TEXT
  update_no_rekening: TEXT
  alamat_email: TEXT
  no_telp: TEXT
  kontrak_ke: INTEGER
  jenis_kelamin: TEXT
  pendidikan_terakhir: TEXT
  agama: TEXT
  surat_peringatan: JSONB
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
)
```