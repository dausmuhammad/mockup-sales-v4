# SalesFlow

Aplikasi demo operasional triple X untuk registrasi lead, kelengkapan data Marketing Officer (MO), dan dokumen Surveyor Officer (SO). Implementasi mengacu pada `MASTER_PROMPT_SALESFLOW.md` serta alur di `SalesFlow_Mobile_Mockup_MO_Dashboard_v4.html`. Kedua file referensi tetap dipertahankan.

## Menjalankan

Gunakan Node.js 22.13+ atau Node.js 24/26 dan npm.

```sh
npm ci
npm run dev
```

Buka [localhost:3000](http://localhost:3000). Apabila port terpakai:

```sh
npm run dev -- --port 3001
```

Untuk menjalankan build produksi:

```sh
npm run build
npm run start
```

Tidak membutuhkan environment variable atau akun layanan eksternal.

## Teknologi

- Next.js **15.5.29**, App Router, React 19, JavaScript/JSX.
- Tailwind CSS 4, CSS variables dengan tema terang/gelap/sistem.
- Komponen lokal mengikuti pola shadcn/ui New York dan primitive **Radix UI**, dikonfigurasi melalui `components.json` dengan `tsx: false`.
- React Hook Form + Zod, Lucide React, Sonner, Recharts 3.
- Metadata dan sesi: localStorage. Foto asli: IndexedDB melalui `idb`.

Seluruh pilihan memakai Radix Select, konfirmasi menggunakan AlertDialog, dan modal menggunakan Dialog. Field teks memakai Input/Textarea terstyling. Input file native tersembunyi; pemilihan file/kamera menggunakan fasilitas OS. Tidak ada native select, alert, confirm, prompt, atau date picker browser.

Override PostCSS memperbarui dependency transitif Next.js tanpa mengganti mayor Next.js 15. Override parser/plugin ESLint dan minimatch menjaga kompatibilitas ESLint 9 beserta perbaikan audit. Dependency tooling TypeScript transitif milik ESLint/Next.js tidak berarti aplikasi menggunakan TypeScript; seluruh source aplikasi adalah `.jsx`/`.js`.

## Mencoba alur demo

1. Masuk sebagai **Marketing Officer**, isi nama dan pilih cabang.
2. Pilih **Registrasi lead baru**. Isi NIK 16 digit, nama, telepon `08...` atau `+628...`, dan alamat. Setelah tersimpan, form siap untuk lead berikutnya; tombol Lengkapi lead membuka lead yang baru dibuat.
3. Buka **To Do List**. Filter Semua mencakup lead selesai dan belum lengkap. Pencarian nama, nomor/ID lead, NIK, dan telepon berjalan bersama filter.
4. Buka detail → **Lengkapi data MO**. Isi penghasilan, jenis pembiayaan/kendaraan, tenor, OTR, dan DP. DP boleh nol dan harus lebih kecil dari OTR.
5. Simpan untuk meneruskan ke antrean SO. Simulasi angsuran menggunakan `(OTR − DP) / tenor` tanpa bunga/biaya/asuransi. Perubahan pembiayaan membatalkan jadwal lama.
6. Logout melalui Profil atau sidebar. Masuk kembali sebagai **Surveyor Officer**; lead MO lengkap tersedia untuk survei.
7. Buka lead → **Lengkapi dokumen survei**. Unggah foto rumah dan slip gaji (JPG/PNG/WebP, maksimal 5 MB per foto). File divalidasi format, ukuran, dan kemampuan decode.
8. Foto langsung disimpan setelah unggahan berhasil. Pilih **Simpan & selesaikan survei** untuk menandai tugas selesai. Refresh untuk memeriksa persistensi foto.
9. Periksa Dashboard dan Performa. Grafik tujuh hari menggunakan penyelesaian pertama sesuai peran; edit ulang tidak menggandakan capaian.
10. Preferensi dan Pusat bantuan tersedia di Profil. Reset demo memerlukan konfirmasi dan menghapus data aplikasi, dokumen, serta sesi pada browser tersebut.

Prioritas dashboard mengambil dua lead pending yang paling awal didaftarkan. Ringkasan dashboard menghitung seluruh periode; grafik menghitung tujuh hari lokal pengguna. Cabang merupakan konteks tampilan sesi, bukan pembatas antrean demo. Data awal kosong; aplikasi tidak membuat konsumen palsu secara otomatis.

## Penyimpanan dan migrasi

- `salesflow:data:v1`: metadata dengan schema version 1.
- `salesflow:session:v1`: sesi demo aktif.
- `salesflow-theme-reference-v1`: preferensi tema. Default terang mengikuti HTML referensi; preferensi tema lama tidak diterapkan otomatis. Tema gelap tetap dapat dipilih secara eksplisit lewat Profil.
- IndexedDB `salesflow-documents`, object store `photos`: Blob foto asli.
- `tripleX_salesflow_demo_v3`: data lama dari HTML referensi. Bila tersedia pada origin yang sama, metadata dipulihkan ke schema baru tanpa mengubah key asli. Foto boolean lama wajib diunggah kembali. Tanggal historis yang tidak tersedia tidak dimasukkan ke grafik.

localStorage mengikuti **origin**. Data HTML yang dibuka melalui `file://` atau host/port berbeda tidak otomatis dapat dibaca aplikasi pada localhost. Login ulang antarperan dilakukan pada origin yang sama agar mengakses antrean yang sama.

Parsing data rusak menghasilkan pesan pemulihan; aplikasi tidak diam-diam menimpa metadata dengan array kosong. Kegagalan menulis tidak mengubah state lead yang tampil sebagai tersimpan. Unggah pengganti menyimpan Blob baru terlebih dahulu; metadata yang gagal ditulis tidak menghapus foto lama. Reset hanya menghapus key/object store milik SalesFlow, bukan seluruh localStorage.

Foto dan lead hanya tersedia pada browser/perangkat ini. Mode privat, kuota penyimpanan, pembersihan data browser, atau eviction oleh browser dapat menghapus/membatasi penyimpanan. Penyimpanan lokal ini tidak terenkripsi oleh aplikasi. Gunakan identitas dan dokumen simulasi.

## Struktur

```text
app/                         Layout, metadata, route App Router
  (workspace)/               Route dengan guard sesi demo dan shell responsif
components/
  ui/                        Komponen shadcn-style berbasis Radix
  dashboard/                 Dashboard dan kartu metrik
  forms/                     Form registrasi, pembiayaan, dan survei
  leads/                     Daftar, detail, dan preview foto
  layout/                    Sidebar, topbar, bottom navigation
  providers/                 State, mutasi terpusat, tema, dan toast
lib/
  storage/                   Adapter localStorage dan IndexedDB
  validation/                Schema form dan validasi file
  lead-actions.js            Transisi status lead
  lead-selectors.js          Filter, metrik, dan aktivitas
  installment-service.js     Simulasi asynchronous dan kalkulasi
tests/                       Unit/integrasi storage dan browser E2E
```

## Pemeriksaan

```sh
npm run lint
npm test
npm run build
npm run test:e2e
npm run format:check
```

`npm run test:e2e` menjalankan Playwright dengan Microsoft Edge terpasang dan server produksi pada port **3100**. Jalankan build terlebih dahulu. Konfigurasi dapat diubah ke Chromium sesuai lingkungan; instal browser Playwright bila diperlukan. Test memakai browser context terisolasi sehingga tidak menghapus data browser pengguna sehari-hari.

Tes browser meliputi registrasi, mandatory dan duplikasi NIK, DP tidak valid, simulasi, filter/pencarian, konfirmasi form, pergantian peran, pembatasan URL, validasi foto, persistensi setelah refresh, penghapusan dokumen, tema, bantuan, reset, serta overflow pada 360/390/768/1024/1440px. Screenshot/trace hasil pemeriksaan berada di `test-results/` (diabaikan Git).

## Batasan produksi

Login dan guard peran berjalan pada client untuk **simulasi**, bukan autentikasi/otorisasi keamanan produksi. Tidak ada backend, database server, integrasi layanan installment, pengiriman data, atau deployment. Antrean dibagikan antar pengguna demo pada browser yang sama. Untuk produksi, tambahkan autentikasi, otorisasi server, validasi server, database, object storage, audit trail, serta kebijakan perlindungan data yang sesuai.

Konfirmasi perubahan form berlaku untuk navigasi internal melalui kontrol aplikasi. Menutup tab, me-refresh, atau menggunakan tombol Back browser tidak diblokir dengan dialog native; input form yang belum disimpan dapat hilang pada tindakan tersebut. Foto berhasil diunggah sudah langsung dipersist.
