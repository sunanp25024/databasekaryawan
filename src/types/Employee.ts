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
  updateBank: string;
  updateNoRekening: string;
  alamatEmail: string;
  noTelp: string;
  kontrakKe: number;
  sp1Date?: string;
  sp1Reason?: string;
  sp2Date?: string;
  sp2Reason?: string;
  sp3Date?: string;
  sp3Reason?: string;
}

export interface FilterOptions {
  klien: string;
  area: string;
  cabang: string;
  statusI: string;
  statusII: string;
}