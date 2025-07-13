import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const employees = pgTable("employees", {
  id: text("id").primaryKey(),
  no: integer("no").notNull(),
  klien: text("klien").notNull(),
  namaPic: text("nama_pic").default(""),
  area: text("area").notNull(),
  cabang: text("cabang").notNull(),
  nik: text("nik").notNull().unique(),
  namaKaryawan: text("nama_karyawan").notNull(),
  posisi: text("posisi").notNull(),
  source: text("source").default(""),
  tglJoint: text("tgl_joint").default(""),
  tglEoc: text("tgl_eoc").default(""),
  statusI: text("status_i").default("Active"),
  statusII: text("status_ii").default("Contract"),
  tglResign: text("tgl_resign").default(""),
  reasonResign: text("reason_resign").default(""),
  pkwt: text("pkwt").default(""),
  noPkwt: text("no_pkwt").default(""),
  bpjsKetenagakerjaan: text("bpjs_ketenagakerjaan").default(""),
  bpjsKesehatan: text("bpjs_kesehatan").default(""),
  bank: text("bank").default(""),
  noRekening: text("no_rekening").default(""),
  namaPenerima: text("nama_penerima").default(""),
  alamatEmail: text("alamat_email").default(""),
  noTelp: text("no_telp").default(""),
  kontrakKe: integer("kontrak_ke").default(1),
  jenisKelamin: text("jenis_kelamin").default(""),
  pendidikanTerakhir: text("pendidikan_terakhir").default(""),
  agama: text("agama").default(""),
  suratPeringatan: json("surat_peringatan").default([]),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
