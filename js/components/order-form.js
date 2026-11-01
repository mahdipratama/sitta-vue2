/* Komponen <order-form>: input Delivery Order baru */
function todayISO() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

function emptyOrderForm() {
  return { nim: '', nama: '', ekspedisi: '', paketKode: '', tanggalKirim: todayISO() };
}

Vue.component('order-form', {
  template: '#tpl-order',
  props: {
    paket: { type: Array, required: true },
    ekspedisi: { type: Array, required: true },
    nextNumber: { type: String, required: true }
  },
  data() {
    return {
      form: emptyOrderForm(),
      errors: {}
    };
  },
  computed: {
    selectedPaket() {
      return this.paket.find((p) => p.kode === this.form.paketKode) || null;
    },
    totalHarga() {
      return this.selectedPaket ? this.selectedPaket.harga : 0;
    }
  },
  watch: {
    // Watcher: setelah paket dipilih, hapus pesan error paket
    'form.paketKode'() {
      this.$delete(this.errors, 'paketKode');
    }
  },
  methods: {
    validate() {
      const e = {};
      const f = this.form;
      if (!/^\d{5,15}$/.test(f.nim.trim())) e.nim = 'NIM harus berupa angka (5-15 digit)';
      if (f.nama.trim().length < 3) e.nama = 'Nama minimal 3 karakter';
      if (!f.ekspedisi) e.ekspedisi = 'Pilih ekspedisi';
      if (!f.paketKode) e.paketKode = 'Pilih paket bahan ajar';
      if (!f.tanggalKirim) e.tanggalKirim = 'Tanggal kirim wajib diisi';
      this.errors = e;
      return Object.keys(e).length === 0;
    },
    submit() {
      if (!this.validate()) return;
      const f = this.form;
      this.$emit('created', {
        nomorDO: this.nextNumber,
        nim: f.nim.trim(),
        nama: f.nama.trim(),
        ekspedisi: f.ekspedisi,
        paket: f.paketKode,
        status: 'Diproses',
        tanggalKirim: f.tanggalKirim,
        total: this.totalHarga,
        perjalanan: []
      });
      this.reset();
    },
    reset() {
      this.form = emptyOrderForm();
      this.errors = {};
    }
  }
});
