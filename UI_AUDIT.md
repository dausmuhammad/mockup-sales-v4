# Audit UI — penyamaan referensi

Referensi: `SalesFlow_Mobile_Mockup_MO_Dashboard_v4.html`.

## Perubahan

- Background `#f4f6fb`, teks `#17213d`, teks sekunder `#7c879f`, border `#e8ecf4`, kartu putih, primary `#4169f5`.
- Header mengikuti gradasi asli 145° dari `#101b3d` ke `#1d3470`, dengan brand teks, nama, peran, cabang, dan avatar.
- Login memakai gradasi asli 155° dari `#101b3d` ke `#27499b` dan form kartu.
- Banner promosi tambahan dan kartu promosi sidebar dihapus. Metrik dan progres dipadatkan kembali.
- Tombol mengikuti gradasi `#4169f5` → `#5b7bff`; progres berakhir pada `#27c4c7`.
- Field `#fbfcff`, badge sukses `#e7f8f1` / `#13815e`, badge pending `#fff3df` / `#a66a12`, alert `#fff7e9` / `#ffe3b5` / `#895a12`.
- Default terang, terpisah dari preferensi tema lama. Pilihan dark mode manual masih tersedia.

## Hasil verifikasi

- Build produksi berhasil; lint bersih.
- Tes browser alur MO–SO lulus, termasuk foto, refresh, tema, dan reset.
- Audit browser membandingkan token warna langsung dengan HTML asli serta memeriksa gradasi header.
- Default tetap terang saat perangkat disimulasikan dark mode dan key tema lama berisi dark.
- Tidak ada overflow horizontal pada 360, 390, 768, 1024, dan 1440 px.
- Field tetap memakai komponen terstyling, Radix Select, serta focus ring keyboard.
- Screenshot aplikasi dan HTML asli diperiksa untuk membandingkan visual mobile.

## Penyesuaian yang tetap disengaja

Desktop tetap memiliki sidebar dan layout lebar; referensi asli hanya menyediakan layout maksimum 430 px. Ikon Lucide, kontrol shadcn/Radix, target sentuh, serta label periode yang sesuai data dipertahankan. Karena itu implementasi bukan salinan pixel-per-pixel seluruh layout, tetapi palet tema light dan gradasi utama mengikuti nilai asli.

Screenshot audit: `test-results/reference-theme-390.png`, `test-results/reference-theme-1440.png`, dan `test-results/original-html-390.png`.
