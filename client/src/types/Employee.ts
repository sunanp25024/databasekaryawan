export interface SuratPeringatan {
  id: string;
  type: 'SP1' | 'SP2' | 'SP3';
  date: string;
  reason: string;
  photoUrl?: string;
  photoFile?: File;
}

export interface Employee {
  id: string;
  no: number;
  klien: string;
  namaPic: string;
  area: string;
  cabang: string;
  nik: string;
  namaKaryawan: string;
  posisi: string;
  source: string;
  tglJoint: string;
  tglEoc: string;
  statusI: string;
  statusII: string;
  tglResign: string;
  reasonResign: string;
  pkwt: string;
  noPkwt: string;
  bpjsKetenagakerjaan: string;
  bpjsKesehatan: string;
  bank: string;
  noRekening: string;
  namaPenerima: string;
  alamatEmail: string;
  noTelp: string;
  kontrakKe: number;
  jenisKelamin: string;
  pendidikanTerakhir: string;
  agama: string;
  suratPeringatan: SuratPeringatan[];
}

export interface FilterOptions {
  klien: string;
  area: string;
  cabang: string;
  statusI: string;
  statusII: string;
}