/* Komponen <status-badge>: menampilkan status stok berdasarkan qty dan safety */
Vue.component('status-badge', {
  template: '#tpl-badge',
  props: {
    qty: { type: Number, required: true },
    safety: { type: Number, required: true }
  },
  computed: {
    status() {
      if (this.qty === 0) return 'kosong';
      if (this.qty < this.safety) return 'menipis';
      return 'aman';
    }
  }
});
