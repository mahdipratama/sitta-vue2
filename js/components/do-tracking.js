/* Komponen <do-tracking>: pencarian DO (Enter = cari, Esc = reset) + tambah progress */
Vue.component('do-tracking', {
  template: '#tpl-tracking',
  props: {
    data: { type: Array, required: true },
    paket: { type: Array, default: () => [] }
  },
  data() {
    return {
      keyword: '',       // isi input
      submitted: '',     // keyword yang sudah di-submit (Enter)
      progressInput: {}  // keterangan progress per nomor DO
    };
  },
  computed: {
    results() {
      const q = this.submitted.trim().toLowerCase();
      if (!q) return [];
      return this.data.filter((d) =>
        d.nomorDO.toLowerCase().includes(q) || String(d.nim).toLowerCase().includes(q));
    },
    hasSearched() {
      return this.submitted.trim() !== '';
    }
  },
  watch: {
    // Watcher: input dikosongkan -> hasil pencarian ikut dibersihkan
    keyword(val) {
      if (val.trim() === '') this.submitted = '';
    }
  },
  methods: {
    search() {
      this.submitted = this.keyword;
    },
    clear() {
      this.keyword = '';
      this.submitted = '';
    },
    namaPaket(kode) {
      const p = this.paket.find((x) => x.kode === kode);
      return p ? p.kode + ' - ' + p.nama : kode;
    },
    statusTerakhir(d) {
      if (d.status) return d.status;
      const n = d.perjalanan.length;
      return n ? d.perjalanan[n - 1].keterangan : 'Belum ada progress';
    },
    addProgress(d) {
      const text = (this.progressInput[d.nomorDO] || '').trim();
      if (!text) {
        this.$set(this.progressInput, d.nomorDO + '_err', true);
        return;
      }
      this.$emit('add-progress', { nomorDO: d.nomorDO, keterangan: text });
      this.$set(this.progressInput, d.nomorDO, '');
      this.$set(this.progressInput, d.nomorDO + '_err', false);
    },
    setProgressText(nomorDO, val) {
      this.$set(this.progressInput, nomorDO, val);
      this.$set(this.progressInput, nomorDO + '_err', false);
    }
  }
});
