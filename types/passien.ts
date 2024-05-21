export type PassienResponse = {
  passien_id: number;
  nik: string;
  nomor_bpjs: string;
  nama_passien: string;
  tanggal_lahir: Date;
  alamat: string | null;
  kelas_rawat: string | null;
  faskes_tingkat_satu: string;
  poli: string;
  dokter: string;
  status: string;
};

export type AntrianResponse = {
  nomor_bpjs: string;
  nama_passien: string;
  dokter: string;
  poli: string;
  status: string;
  hasil_diagnosa?: string;
  keterangan_resep?: string;
}
