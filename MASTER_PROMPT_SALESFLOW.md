# Master Prompt Codex — SalesFlow

## Peran dan tujuan

Kamu adalah senior full-stack engineer sekaligus UI/UX designer. Bangun aplikasi SalesFlow berdasarkan file `SalesFlow_Mobile_Mockup_MO_Dashboard_v4.html` di workspace ini. Baca seluruh file referensi sebelum mengimplementasikan. Gunakan referensi tersebut sebagai sumber alur bisnis dan data, kemudian kembangkan tampilannya agar nyaman digunakan melalui browser desktop, tablet, dan ponsel.

Kerjakan implementasi sampai aplikasi dapat dijalankan dan alur utama terverifikasi. Jangan berhenti pada rencana, wireframe, atau komponen statis. Gunakan Bahasa Indonesia untuk seluruh antarmuka dan pesan validasi.

## Stack wajib

- Next.js **15.x**, App Router. Jangan mengganti ke Next.js 16 atau versi mayor lain. Pilih patch 15.x yang tersedia dan aman; gunakan versi React yang kompatibel.
- JavaScript dengan **JSX**: komponen `.jsx`, utility/config JavaScript `.js` atau `.mjs`. Jangan menggunakan TypeScript, `.tsx`, `.ts`, interface, atau type annotation.
- Tailwind CSS dengan konfigurasi yang kompatibel dengan Next.js 15 dan shadcn/ui yang dipilih.
- **shadcn/ui berbasis Radix UI** sebagai sistem komponen. Jangan memilih varian berbasis Base UI. Jika generator menawarkan pilihan, pilih Radix dan output JavaScript.
- Lucide React untuk ikon; jangan memakai emoji sebagai ikon UI utama.
- React Hook Form dan Zod untuk pengelolaan serta validasi form, dengan versi yang saling kompatibel.
- Gunakan package manager sesuai lockfile yang sudah ada; bila proyek kosong, gunakan npm.
- Pastikan dependency, konfigurasi alias, global CSS, dan komponen hasil generator benar-benar tersedia. Jangan hanya mengimpor komponen yang belum dibuat.

Periksa struktur repository dan instruksi `AGENTS.md` sebelum mengubah file. Pertahankan pekerjaan pengguna yang sudah ada. Bila ada keputusan implementasi kecil yang belum ditentukan, gunakan asumsi yang masuk akal dan lanjutkan.

## Aturan mutlak komponen UI dan field

Seluruh kontrol yang terlihat wajib mengikuti styling shadcn/ui dan interaksi Radix UI. Tidak boleh ada field atau popup yang tampak sebagai kontrol bawaan browser.

1. Gunakan `Input`, `Textarea`, `Label`, `Button`, dan komposisi form shadcn/ui untuk field teks. Elemen HTML native yang menjadi implementasi internal komponen shadcn diperbolehkan; yang dilarang adalah kontrol native mentah tanpa styling dan perilaku sistem desain.
2. Seluruh dropdown pilihan wajib menggunakan shadcn `Select` berbasis Radix. Jangan gunakan `<select>` dan `<option>` native, termasuk untuk peran, cabang, jenis pembiayaan, kendaraan, dan tenor.
3. Gunakan `Checkbox`, `RadioGroup`, `Switch`, `Tabs`, `Dialog`, `AlertDialog`, `Popover`, `DropdownMenu`, `Tooltip`, dan `Sheet` berbasis shadcn/Radix sesuai kebutuhan. Jangan membuat kontrol interaktif tiruan dengan `<div onClick>`.
4. Jangan gunakan `window.alert`, `window.confirm`, atau `window.prompt`. Gunakan `AlertDialog` untuk reset data dan toast bergaya shadcn/Sonner untuk umpan balik.
5. Unggah foto menggunakan upload card/dropzone yang distyling, tombol shadcn, preview, dan aksi ganti/hapus. `<input type="file">` native hanya boleh tersembunyi dan dipicu melalui kontrol yang aksesibel. Dialog pemilihan file/kamera milik perangkat boleh digunakan karena merupakan fasilitas OS.
6. Bila menambahkan tanggal, gunakan `Popover` + `Calendar` shadcn; jangan tampilkan date picker browser. Field angka/rupiah memakai `Input` dengan `inputMode="numeric"` atau `decimal`, formatting yang konsisten, dan tanpa spinner native.
7. Gunakan validasi inline sendiri, terhubung dengan field melalui `aria-describedby` dan `aria-invalid`; cegah bubble validasi native melalui `noValidate` pada form.
8. Semua tombol memiliki state hover, focus-visible, disabled, dan loading yang jelas. Jangan menghilangkan focus ring tanpa pengganti.
9. Warna, radius, border, shadow, spacing, dan typography harus konsisten melalui token Tailwind/CSS variables shadcn.

## Arah visual

Pertahankan identitas **triple X / SALESFLOW** dengan navy `#101b3d`, blue `#4169f5`, cyan `#27c4c7`, background abu muda, dan kartu putih. Gunakan warna sukses, peringatan, dan error secara semantik dengan kontras yang baik.

- Tampilan profesional untuk aplikasi operasional pembiayaan, bersih dan mudah dipindai.
- Gunakan hirarki judul yang jelas, angka ringkasan menonjol, radius kartu sekitar 16–20px, serta shadow halus.
- Font dapat memakai Geist atau font sans-serif yang sesuai. Sediakan fallback sistem dan hindari build yang bergantung pada jaringan font bila lingkungan tidak mendukungnya.
- Hindari dekorasi berlebihan dan animasi yang mengganggu pekerjaan. Hormati `prefers-reduced-motion`.
- Tampilkan status dalam badge teks dan ikon; jangan mengandalkan warna saja.

## Layout responsif wajib

Jangan mempertahankan pembatas global `max-width: 430px` dari mockup untuk seluruh aplikasi.

### Mobile, kurang dari 768px

- Layout satu kolom dengan padding 16–20px dan bottom navigation: Beranda, To Do List, Performa, Profil.
- Header ringkas berisi brand, identitas pengguna, dan peran/cabang.
- Kartu metrik dua kolom bila ruang cukup; sesuaikan untuk layar sangat kecil.
- Daftar lead berbentuk kartu yang mudah disentuh. Area sentuh aksi utama minimal sekitar 44px.
- Form satu kolom dan tombol aksi mudah dijangkau tanpa menutup field.
- Perhitungkan safe area dan tinggi navigasi bawah. Tidak ada konten yang tertutup navigasi, toast, atau sticky action.
- Sheet/dialog tidak melewati viewport, dapat discroll, dan nyaman saat keyboard virtual terbuka.

### Tablet, 768–1023px

- Gunakan dua kolom untuk konten yang cocok dan navigasi yang tidak berdesakan.
- Form dapat menjadi dua kolom hanya bila label dan nilai tetap terbaca.

### Desktop, mulai 1024px

- Sidebar navigasi permanen, topbar identitas pengguna, dan area konten lebar yang proporsional.
- Dashboard dengan empat kartu metrik serta area progres/prioritas yang tersusun efisien.
- To Do List dapat menggunakan tabel shadcn dengan kolom yang relevan dan aksi jelas.
- Detail lead memakai susunan dua kolom: informasi konsumen dan progres/aksi.
- Jangan sekadar memperbesar tampilan ponsel di tengah layar desktop.

Verifikasi pada lebar 360px, 390px, 768px, 1024px, dan 1440px. Tidak boleh ada overflow horizontal pada halaman. Gunakan satu sumber state/data untuk semua variasi layout.

## Ruang lingkup produk

Ini adalah aplikasi demo operasional yang berfungsi penuh dengan persistensi lokal. Login adalah simulasi, bukan autentikasi produksi. Tampilkan penanda demo secara wajar. Jangan mengklaim telah mengintegrasikan backend, autentikasi sungguhan, ataupun layanan pembiayaan eksternal.

### 1. Login dan sesi demo

- Field peran: Marketing Officer (MO), Surveyor Officer (SO).
- Field nama pengguna wajib, trim whitespace.
- Field cabang: Jakarta Selatan, Bandung, Surabaya.
- Tombol masuk, serta tombol reset data demo dengan konfirmasi `AlertDialog`.
- Nama, inisial, peran, dan cabang pilihan harus digunakan konsisten di header dan profil.
- Sesi bertahan saat refresh. Logout menghapus sesi aktif tanpa menghapus lead.
- Pengguna dapat logout lalu masuk dengan peran lain untuk melanjutkan lead yang sama.
- Pilihan cabang merupakan konteks sesi/tampilan demo; antrean lead dibagikan antarperan dan pengguna demo. Jangan mengarang otorisasi atau pemisahan data produksi.

### 2. Dashboard

Untuk MO tampilkan:

- CTA Registrasi Lead Baru.
- Total lead.
- Perlu dilengkapi: lead yang belum menyelesaikan tahap MO.
- Selesai MO: lead yang sudah menyelesaikan tahap MO.
- Menunggu SO: tahap MO lengkap, tahap SO belum lengkap.
- Progres tahap MO = lead selesai MO / seluruh lead.

Untuk SO tampilkan:

- Menunggu survei: tahap MO lengkap dan tahap SO belum lengkap.
- Dokumen belum lengkap: jumlah lead antrean SO yang masih kekurangan foto wajib.
- Selesai survei.
- Total ditangani: seluruh lead yang tahap MO-nya lengkap.
- Progres tahap SO = lead selesai SO / seluruh lead dengan MO lengkap.

Untuk kedua peran:

- Alert pekerjaan tertunda hanya muncul bila ada pekerjaan yang perlu aksi.
- Prioritas menampilkan maksimal dua lead tertunda, dengan urutan yang konsisten dan terdokumentasi.
- CTA membuka To Do List sesuai peran.
- Kondisi belum memiliki lead berbeda dari kondisi semua pekerjaan selesai.
- Pembagian nol menghasilkan progres 0%, bukan NaN.
- Jangan memberi label “Hari ini” atau “Target harian” untuk angka sepanjang waktu. Gunakan label periode yang sesuai dengan perhitungan sebenarnya.

### 3. To Do List

- Pencarian nama, ID lead, NIK, atau telepon, case-insensitive.
- Filter Semua, Belum lengkap, Selesai beserta jumlahnya bila bermanfaat.
- **Semua wajib benar-benar menampilkan seluruh lead yang relevan untuk peran**, bukan hanya yang pending seperti bug pada referensi.
- MO melihat seluruh lead; SO hanya melihat lead yang tahap MO-nya lengkap.
- Pencarian dan filter dapat digunakan bersamaan. Nilai pencarian yang terlihat harus sesuai dengan hasil yang ditampilkan.
- Aksi registrasi lead hanya untuk MO.
- State kosong informatif dengan CTA yang sesuai, serta state pencarian tanpa hasil.
- Klik nama atau tombol detail membuka halaman detail lead melalui route yang dapat direfresh.

### 4. Registrasi lead oleh MO

Field wajib:

- NIK: string tepat 16 digit; pertahankan angka nol di depan.
- Telepon: terima bentuk lokal `08...` atau `+62...`, normalisasi secara konsisten; validasi format dan panjang yang masuk akal.
- Nama sesuai KTP: trim dan wajib berisi teks.
- Alamat KTP: gunakan `Textarea`, trim dan wajib diisi.

Tolak duplikasi NIK dengan pesan yang jelas. Buat ID lead unik yang stabil, misalnya UUID internal dan nomor tampilan `LD-...`; jangan hanya mengandalkan potongan timestamp.

Setelah berhasil disimpan, lead muncul pada antrean MO. Pengguna bisa langsung registrasi lead berikutnya atau melengkapi lead dari To Do List. Tombol batal/kembali harus menuju daftar atau halaman asal yang valid, bukan detail kosong.

### 5. Detail lead

- Identitas konsumen, ID lead, kontak, alamat, tanggal dibuat, dan status alur.
- Ringkasan data MO dan status dokumen SO.
- Indikator tahap: Terdaftar → Data MO lengkap → Survei selesai.
- Aksi disesuaikan dengan peran aktif.
- Lead yang tidak ditemukan menampilkan state yang jelas dan tombol kembali.
- Nilai yang belum diisi ditampilkan sebagai “Belum diisi”, tanpa `undefined`, `null`, atau format rupiah kosong.

### 6. Melengkapi data MO

Field wajib:

- Pendapatan per bulan.
- Pendapatan per tahun; boleh diisi otomatis dari bulanan × 12, tetap dapat diedit dengan petunjuk yang jelas.
- Jenis pembiayaan: Kendaraan atau Dana Tunai.
- Jenis kendaraan: Mobil atau Motor.
- Tenor: 12, 24, 36, atau 48 bulan.
- Harga OTR.
- DP/uang muka.

Pertahankan seluruh field referensi untuk kedua jenis pembiayaan; jangan menambah aturan produk pembiayaan yang tidak diberikan. Semua nilai finansial disimpan sebagai angka rupiah, bukan string dengan pemisah ribuan. Penghasilan dan OTR harus lebih besar dari nol; DP boleh nol dan harus lebih kecil dari OTR.

Validasi seluruh nilai sebelum melakukan mutasi state atau persistensi. Input tidak valid tidak boleh mengubah lead tersimpan. Beri error di dekat field dan fokus ke error pertama.

Tombol “Simpan & teruskan ke Surveyor” menandai tahap MO lengkap dan membuat lead tersedia di antrean SO. Data tetap dapat dilihat/diubah oleh MO setelah selesai. Perubahan data pembiayaan membatalkan jadwal angsuran lama agar tidak menampilkan simulasi yang kedaluwarsa; jelaskan kepada pengguna bila diperlukan.

### 7. Dokumen survei SO

- Dua dokumen wajib: foto rumah dan foto slip gaji.
- Mendukung kamera perangkat bila tersedia serta pemilihan file.
- Preview gambar, nama file, ukuran, dan aksi ganti/hapus yang jelas.
- Validasi file JPG, PNG, atau WebP, batas ukuran 5 MB per file, dan kemampuan decode gambar; `accept` saja tidak cukup.
- Foto harus tetap tersedia setelah refresh, bukan hanya boolean atau placeholder “file tersimpan”.
- Gunakan IndexedDB untuk Blob gambar; simpan referensi dokumen pada data lead. Jangan menaruh gambar base64 besar di localStorage.
- Revoke object URL saat tidak dipakai lagi. Tangani penyimpanan gagal tanpa mengklaim sukses atau menghilangkan data lama.
- Penyelesaian survei baru berhasil bila kedua dokumen valid sudah tersimpan.
- Menghapus dokumen wajib harus mengembalikan status survei menjadi belum lengkap secara konsisten.
- Dokumen yang tersimpan dapat dibuka lagi pada detail/form.

### 8. Simulasi jadwal angsuran

- Hanya tersedia setelah data MO lengkap.
- Simulasikan pemanggilan service asynchronous dengan loading, cegah submit berulang, dan tampilkan sukses/error yang sesuai.
- Jangan menggunakan nominal angsuran statis dari mockup.
- Gunakan simulasi sederhana pokok = OTR − DP, cicilan = pokok / tenor. Nyatakan secara eksplisit bahwa estimasi tidak memasukkan bunga, biaya, asuransi, dan bukan penawaran pembiayaan resmi.
- Tampilkan tenor, pokok pembiayaan, dan estimasi per bulan. Jika menampilkan rincian seluruh cicilan, sesuaikan cicilan terakhir untuk mengatasi pembulatan.
- Persist hasil beserta waktu pembuatan dan parameter perhitungan.
- Tangkap ID lead saat operasi dimulai; berpindah ke lead lain selama loading tidak boleh menyimpan hasil ke lead yang salah.

### 9. Performa

- Kartu capaian mengikuti data lead dan peran aktif.
- Grafik aktivitas tujuh hari berasal dari timestamp aktivitas yang benar, bukan bar statis.
- Definisikan aktivitas dengan jelas: MO = penyelesaian MO pertama; SO = penyelesaian survei pertama. Edit biasa tidak menggandakan capaian.
- Tampilkan periode, label hari, nilai, dan empty state bila belum ada aktivitas.
- Gunakan chart yang konsisten dengan shadcn, responsif, memiliki tooltip bila berguna, dan ringkasan teks yang aksesibel.

### 10. Profil dan preferensi

- Tampilkan nama, inisial, peran, dan cabang aktual.
- Preferensi aplikasi membuka dialog/sheet yang berfungsi, minimal pengaturan tema sistem/terang/gelap yang tersimpan.
- Pusat bantuan membuka panduan singkat alur MO–SO, persistensi lokal, dan batasan demo.
- Logout berfungsi.
- Jangan tampilkan menu atau tombol aktif yang tidak melakukan apa pun. Jangan meminta izin notifikasi browser tanpa fitur nyata yang memerlukannya.

## Model data dan persistensi

Gunakan model data yang terpusat dan eksplisit, misalnya:

```js
{
  id: "uuid",
  leadNumber: "LD-...",
  name: "...",
  nik: "...",
  phone: "...",
  address: "...",
  incomeMonthly: null,
  incomeAnnual: null,
  financeType: "Kendaraan",
  vehicleType: "Motor",
  tenorMonths: 12,
  otr: null,
  downPayment: null,
  moCompletedAt: null,
  soCompletedAt: null,
  firstMoCompletedAt: null,
  firstSoCompletedAt: null,
  documents: { house: null, salarySlip: null },
  installmentSchedule: null,
  createdAt: "ISO timestamp",
  updatedAt: "ISO timestamp"
}
```

Gunakan localStorage untuk metadata ringan dan sesi demo, IndexedDB untuk gambar. Sertakan versi schema, parsing defensif, dan penanganan storage tidak tersedia/kuota penuh. Jangan mengakses `window`, localStorage, atau IndexedDB selama server render. Pastikan inisialisasi tidak menimpa data tersimpan dengan state kosong dan tidak menimbulkan hydration mismatch. Sediakan loading singkat selama pemuatan state.

Jika menemukan data lama dengan key `tripleX_salesflow_demo_v3`, lakukan migrasi metadata yang dapat dipulihkan tanpa merusak data asli. Boolean foto lama tidak membuktikan file tersedia; tandai dokumen perlu diunggah kembali dan sesuaikan status SO. Jangan mengarang tanggal penyelesaian historis untuk grafik. Jelaskan hasil migrasi bila ada dampak bagi pengguna.

Reset demo menghapus metadata, gambar, dan sesi demo milik aplikasi setelah konfirmasi; jangan memakai `localStorage.clear()` yang dapat menghapus data aplikasi lain. Bila sebagian penghapusan gagal, jangan menampilkan pesan bahwa seluruh reset berhasil.

## Arsitektur implementasi

Gunakan App Router dengan route yang jelas, misalnya:

```text
app/
  layout.jsx
  globals.css
  login/page.jsx
  (workspace)/
    layout.jsx
    page.jsx
    tasks/page.jsx
    leads/new/page.jsx
    leads/[id]/page.jsx
    leads/[id]/mo/page.jsx
    leads/[id]/survey/page.jsx
    performance/page.jsx
    profile/page.jsx
components/
  ui/
  layout/
  dashboard/
  leads/
  forms/
  providers/
lib/
  storage/
  validation/
  formatters.js
  lead-selectors.js
  installment-service.js
```

Struktur boleh disesuaikan dengan proyek selama tanggung jawab tetap jelas. Pisahkan komponen presentasi, validasi, business logic, dan storage. Jangan memindahkan seluruh HTML referensi menjadi satu komponen besar.

Gunakan server components sebagai default dan client components untuk interaksi/browser state. Session guard demo dan pembatasan aksi per peran harus konsisten, termasuk saat URL form diakses langsung. Tegaskan di README bahwa guard client ini bukan keamanan produksi.

Seluruh perubahan lead melewati fungsi terpusat agar status, timestamp, dokumen, dan dashboard konsisten. Gunakan selector untuk menghitung metrik/filter agar logika tidak tersebar. Pakai React escaping standar; jangan menyuntikkan input pengguna melalui `dangerouslySetInnerHTML`.

## Aksesibilitas dan UX

- Label terhubung ke field; placeholder bukan pengganti label.
- Semua fitur dapat digunakan dengan keyboard; urutan tab dan focus-visible jelas.
- Dialog memiliki judul/deskripsi aksesibel, focus trap, serta pengembalian fokus ke pemicu.
- Ikon tanpa teks wajib memiliki accessible name.
- Gunakan elemen semantik, heading berurutan, alt text preview, dan pengumuman status yang sesuai.
- Format rupiah dan tanggal menggunakan locale `id-ID`; tampilkan tanggal secara konsisten dengan zona waktu pengguna.
- Tampilkan loading, empty, error, success, dan disabled state pada operasi yang relevan.
- Saat meninggalkan form yang sudah berubah, tampilkan konfirmasi shadcn untuk navigasi internal yang dikendalikan aplikasi. Hindari dialog native.
- Jangan kehilangan input akibat render ulang, pergantian tab komponen, atau kegagalan penyimpanan.

## Verifikasi yang wajib dilakukan

Jalankan build produksi, lint sesuai konfigurasi proyek, dan tes yang relevan. Periksa UI dengan browser jika alat tersedia. Jangan mengklaim pemeriksaan browser bila tidak dilakukan; laporkan keterbatasannya.

Verifikasi minimal:

1. Login MO dengan cabang Bandung; nama, peran, cabang benar di seluruh UI.
2. Registrasi dua lead; validasi mandatory, NIK salah, dan NIK duplikat berfungsi.
3. Filter Semua menampilkan pending dan selesai; pencarian tetap konsisten bersama filter.
4. Lengkapi satu lead sebagai MO; metrik dan antrean berubah; data invalid tidak memutasi data tersimpan.
5. Buat simulasi angsuran; nilai mengikuti OTR, DP, dan tenor. Pindah lead ketika operasi berjalan tidak merusak data.
6. Logout dan login SO; hanya lead MO lengkap yang tersedia.
7. Unggah satu foto: belum dapat menyelesaikan survei. Unggah kedua foto: survei selesai.
8. Refresh halaman detail: metadata, sesi, dan foto tetap tersedia.
9. Edit pembiayaan membatalkan jadwal lama; hapus foto wajib mengembalikan status SO menjadi pending.
10. Grafik menampilkan aktivitas nyata tanpa menggandakan penyelesaian karena edit.
11. Batal reset mempertahankan data; konfirmasi reset membersihkan data aplikasi termasuk gambar.
12. Direct URL ke lead tidak ada dan form peran yang tidak sesuai ditangani dengan benar.
13. Layout mobile/tablet/desktop bebas overflow dan konten tertutup navigasi; keyboard dan fokus dialog bekerja.
14. Tidak ada dropdown native, confirm/alert native, field mentah, tombol mati, error console, atau hydration warning.

Utamakan tes untuk validasi, transisi status, selector metrik/filter, perhitungan angsuran, dan persistensi. Hindari tes yang hanya menyalin struktur implementasi atau snapshot dekoratif.

## Hasil akhir yang harus diserahkan

- Source aplikasi Next.js 15 berbasis JSX yang siap dijalankan.
- Komponen shadcn/ui berbasis Radix yang lengkap dan konsisten.
- Semua alur MO–SO, persistensi, foto, dan simulasi angsuran berfungsi.
- README berisi cara instalasi, perintah development/build/lint/test yang benar-benar tersedia, alur penggunaan demo, serta batasan penyimpanan dan autentikasi lokal.
- Ringkasan singkat perubahan, hasil verifikasi yang benar-benar dijalankan, dan kendala tersisa jika ada.

Mulai dengan membaca referensi dan repository, kemudian langsung implementasikan. Jangan meminta konfirmasi untuk keputusan rutin yang telah tercakup dalam prompt ini. Jangan melakukan deployment atau integrasi layanan berbayar kecuali diminta terpisah.
