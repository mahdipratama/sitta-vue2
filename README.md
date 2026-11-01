# Tugas Praktik 3 - SITTA (Vue.js, Vue Component & Template)

## Cara menjalankan
Aplikasi memakai `fetch()` untuk membaca JSON dan template, jadi **tidak bisa dibuka dengan klik dua kali (file://)**. Jalankan lewat web server lokal dari folder ini:

    python -m http.server 8000      # lalu buka http://localhost:8000
    # atau: ekstensi "Live Server" di VS Code

## Struktur
- `index.html`: root `#app`, navigasi tab (`stok` | `tracking` | `order`)
- `js/services/api.js`: baca JSON + muat `templates/*.html`
- `js/app.js`: filter (`rupiah`, `satuan`, `tanggalIndo`) dan root Vue
- `js/components/*.js`: `ba-stock-table`, `do-tracking`, `order-form`, `status-badge`, `app-modal`
- `templates/*.html`: template (`tpl-stock`, `tpl-tracking`, `tpl-order`, `tpl-badge`, `tpl-modal`)
- `data/dataBahanAjar.json`: data dummy (GANTI dengan file JSON dari dosen jika ada)

## Pemetaan ke rubrik (bahan video penjelasan)
| Rubrik | Di mana |
|---|---|
| 1.1 Arsitektur & komponen | Struktur folder, `Vue.component(...)`, `template: '#tpl-...'`, props ke bawah, `$emit` ke atas |
| 1.2 Data binding, v-for, filter | `{{ }}`, `v-html` (tooltip catatan), `v-model`, `:bind`; `v-for (item, index)` dan `(msg, field) in errors`; filter `rupiah`, `satuan`, `tanggalIndo` |
| 1.3 Conditional | `v-if/v-else-if/v-else` di `status-badge`; `v-if` kategori dependen; `v-show` per tab di `index.html` |
| 1.4 Computed/methods | computed: `filteredItems`, `sortedItems`, `kategoriOptions`, `nextDONumber`, `totalHarga`; methods: `save`, `validate`, dll. |
| 1.5 Watcher (min. 2) | `filter.upbjj` (reset kategori), `showForm` (bersihkan form), `keyword` (tracking), `form.paketKode` (order) |
| 1.6 Form, validasi, event | Enter = simpan (stok, order, progress), Enter/Esc di pencarian DO, `@mouseenter` tooltip, modal konfirmasi hapus |
| 1.7 Kreativitas | Badge status berwarna + ikon, baris stok diwarnai, timeline perjalanan, tampilan responsif |

## Catatan
- Filter tidak dihitung ulang tiap render karena memakai **computed** (di-cache sampai dependensinya berubah).
- Nomor DO otomatis: `DO` + tahun berjalan + urutan 3 digit (contoh `DO2026-001`).
