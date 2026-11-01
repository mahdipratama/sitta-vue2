/* Komponen <ba-stock-table>: daftar stok + filter + sort + CRUD */
function emptyStokForm() {
  return { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: '', qty: '', safety: '', catatanHTML: '' };
}

Vue.component('ba-stock-table', {
  template: '#tpl-stock',
  props: {
    items: { type: Array, required: true },
    upbjjList: { type: Array, default: () => [] },
    kategoriList: { type: Array, default: () => [] }
  },
  data() {
    return {
      filter: { upbjj: '', kategori: '', reorderOnly: false },
      sortBy: '',
      sortDir: 'asc',
      hoveredKey: null,
      showForm: false,
      editMode: false,
      form: emptyStokForm(),
      errors: {}
    };
  },
  computed: {
    // Opsi kategori bergantung pada UT-Daerah yang dipilih (dependent options)
    kategoriOptions() {
      if (!this.filter.upbjj) return [];
      const set = new Set(
        this.items.filter((i) => i.upbjj === this.filter.upbjj).map((i) => i.kategori));
      return Array.from(set).sort();
    },
    // computed di-cache: hanya dihitung ulang jika dependensinya berubah
    filteredItems() {
      return this.items.filter((i) => {
        if (this.filter.upbjj && i.upbjj !== this.filter.upbjj) return false;
        if (this.filter.kategori && i.kategori !== this.filter.kategori) return false;
        if (this.filter.reorderOnly && !(i.qty < i.safety || i.qty === 0)) return false;
        return true;
      });
    },
    sortedItems() {
      const list = this.filteredItems.slice();
      if (!this.sortBy) return list;
      const dir = this.sortDir === 'asc' ? 1 : -1;
      const key = this.sortBy;
      return list.sort((a, b) => {
        if (typeof a[key] === 'string') return a[key].localeCompare(b[key]) * dir;
        return (a[key] - b[key]) * dir;
      });
    },
    reorderCount() {
      return this.items.filter((i) => i.qty < i.safety || i.qty === 0).length;
    },
    isFiltered() {
      return !!(this.filter.upbjj || this.filter.kategori || this.filter.reorderOnly || this.sortBy);
    }
  },
  watch: {
    // Watcher 1: ganti UT-Daerah -> reset filter kategori
    'filter.upbjj'() {
      this.filter.kategori = '';
    },
    // Watcher 2: form ditutup -> bersihkan isian dan pesan error
    showForm(val) {
      if (!val) {
        this.form = emptyStokForm();
        this.errors = {};
        this.editMode = false;
      }
    }
  },
  methods: {
    rowKey(item) {
      return item.kode + '|' + item.upbjj;
    },
    resetFilter() {
      this.filter = { upbjj: '', kategori: '', reorderOnly: false };
      this.sortBy = '';
      this.sortDir = 'asc';
    },
    openCreate() {
      this.form = emptyStokForm();
      this.errors = {};
      this.editMode = false;
      this.showForm = true;
    },
    openEdit(item) {
      this.form = Object.assign({}, item);
      this.errors = {};
      this.editMode = true;
      this.showForm = true;
    },
    validate() {
      const e = {};
      const f = this.form;
      if (!String(f.kode).trim()) e.kode = 'Kode wajib diisi';
      if (!String(f.judul).trim()) e.judul = 'Judul wajib diisi';
      if (!f.kategori) e.kategori = 'Pilih kategori';
      if (!f.upbjj) e.upbjj = 'Pilih UT-Daerah';
      if (!String(f.lokasiRak).trim()) e.lokasiRak = 'Lokasi rak wajib diisi';
      if (f.harga === '' || Number(f.harga) <= 0) e.harga = 'Harga harus lebih dari 0';
      if (f.qty === '' || Number(f.qty) < 0 || !Number.isInteger(Number(f.qty))) e.qty = 'Jumlah stok minimal 0 (bilangan bulat)';
      if (f.safety === '' || Number(f.safety) < 0 || !Number.isInteger(Number(f.safety))) e.safety = 'Stok safety minimal 0 (bilangan bulat)';
      if (!this.editMode && !e.kode && !e.upbjj) {
        const dup = this.items.some((i) => i.kode === f.kode.trim() && i.upbjj === f.upbjj);
        if (dup) e.kode = 'Kode ini sudah ada di UT-Daerah tersebut';
      }
      this.errors = e;
      return Object.keys(e).length === 0;
    },
    save() {
      if (!this.showForm || !this.validate()) return;
      const f = this.form;
      const item = {
        kode: f.kode.trim(),
        judul: f.judul.trim(),
        kategori: f.kategori,
        upbjj: f.upbjj,
        lokasiRak: f.lokasiRak.trim(),
        harga: Number(f.harga),
        qty: Number(f.qty),
        safety: Number(f.safety),
        catatanHTML: f.catatanHTML
      };
      this.$emit(this.editMode ? 'update' : 'create', item);
      this.showForm = false;
    },
    cancelForm() {
      this.showForm = false;
    },
    remove(item) {
      this.$emit('delete', item);
    }
  }
});
