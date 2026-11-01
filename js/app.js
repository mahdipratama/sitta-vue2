/* ===== Filter (formatting teks) ===== */
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
  'Agustus', 'September', 'Oktober', 'November', 'Desember'];

// 65000 -> "Rp 65.000"
Vue.filter('rupiah', function (value) {
  const n = Number(value);
  if (isNaN(n)) return '-';
  return 'Rp ' + n.toLocaleString('id-ID');
});

// 28 -> "28 buah"
Vue.filter('satuan', function (value, unit) {
  return value + ' ' + (unit || 'buah');
});

// "2025-08-25" (atau Date) -> "25 Agustus 2025"
Vue.filter('tanggalIndo', function (value) {
  if (!value) return '-';
  let d, m, y;
  if (value instanceof Date) {
    d = value.getDate(); m = value.getMonth(); y = value.getFullYear();
  } else {
    const parts = String(value).slice(0, 10).split('-');
    if (parts.length !== 3) return value;
    y = Number(parts[0]); m = Number(parts[1]) - 1; d = Number(parts[2]);
  }
  return d + ' ' + BULAN[m] + ' ' + y;
});

// Helper: Date -> "YYYY-MM-DD HH:mm:ss" (waktu lokal)
function formatWaktuLokal(date) {
  const p = (n) => String(n).padStart(2, '0');
  return date.getFullYear() + '-' + p(date.getMonth() + 1) + '-' + p(date.getDate()) + ' ' +
    p(date.getHours()) + ':' + p(date.getMinutes()) + ':' + p(date.getSeconds());
}

/* ===== Root instance ===== */
const templateNames = ['status-badge', 'app-modal', 'stock-table', 'do-tracking', 'order-form'];

Promise.all([api.loadTemplates(templateNames), api.getData()])
  .then(function (results) {
    startApp(results[1]);
  })
  .catch(function (err) {
    startApp(null, err.message + '. Jalankan lewat web server lokal (bukan file://).');
  });

function startApp(data, errorMessage) {
  new Vue({
    el: '#app',
    data: {
      tab: 'stok', // 'stok' | 'tracking' | 'order'
      loading: false,
      loadError: errorMessage || '',
      state: data || { upbjjList: [], kategoriList: [], pengirimanList: [], paket: [], stok: [], tracking: [] }
    },
    computed: {
      // Nomor DO berikutnya: DO + tahun berjalan + sequence 3 digit
      nextDONumber() {
        const year = new Date().getFullYear();
        const prefix = 'DO' + year + '-';
        let max = 0;
        this.state.tracking.forEach(function (t) {
          if (t.nomorDO.indexOf(prefix) === 0) {
            const seq = parseInt(t.nomorDO.slice(prefix.length), 10);
            if (seq > max) max = seq;
          }
        });
        return prefix + String(max + 1).padStart(3, '0');
      }
    },
    methods: {
      findIndexStok(item) {
        return this.state.stok.findIndex(function (s) {
          return s.kode === item.kode && s.upbjj === item.upbjj;
        });
      },
      handleCreateStok(item) {
        this.state.stok.push(item);
        this.$refs.modal.alert('Berhasil', 'Bahan ajar ' + item.kode + ' berhasil ditambahkan.');
      },
      handleUpdateStok(item) {
        const i = this.findIndexStok(item);
        if (i !== -1) this.state.stok.splice(i, 1, item);
        this.$refs.modal.alert('Berhasil', 'Bahan ajar ' + item.kode + ' berhasil diperbarui.');
      },
      async handleDeleteStok(item) {
        const ok = await this.$refs.modal.confirm(
          'Hapus data?',
          'Anda yakin ingin menghapus ' + item.kode + ' - ' + item.judul + ' (' + item.upbjj + ')?');
        if (!ok) return;
        const i = this.findIndexStok(item);
        if (i !== -1) this.state.stok.splice(i, 1);
      },
      handleAddProgress(payload) {
        const target = this.state.tracking.find(function (t) { return t.nomorDO === payload.nomorDO; });
        if (target) {
          target.status = payload.keterangan; // status terbaru mengikuti progress terakhir
          target.perjalanan.push({
            waktu: formatWaktuLokal(new Date()), // waktu lokal otomatis
            keterangan: payload.keterangan
          });
        }
      },
      handleNewDO(doBaru) {
        this.state.tracking.push(doBaru);
        this.$refs.modal.alert('DO berhasil dibuat', 'Nomor DO: ' + doBaru.nomorDO);
        this.tab = 'tracking';
      }
    }
  });
}
