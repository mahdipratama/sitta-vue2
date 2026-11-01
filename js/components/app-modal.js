/* Komponen <app-modal>: dialog konfirmasi / informasi (dipanggil lewat ref="modal") */
Vue.component('app-modal', {
  template: '#tpl-modal',
  data() {
    return {
      visible: false,
      mode: 'alert', // 'alert' | 'confirm'
      title: '',
      message: '',
      resolver: null
    };
  },
  computed: {
    okText() {
      return this.mode === 'confirm' ? 'Ya, hapus' : 'OK';
    }
  },
  methods: {
    open(mode, title, message) {
      this.mode = mode;
      this.title = title;
      this.message = message;
      this.visible = true;
      return new Promise((resolve) => { this.resolver = resolve; });
    },
    confirm(title, message) {
      return this.open('confirm', title, message);
    },
    alert(title, message) {
      return this.open('alert', title, message);
    },
    close(result) {
      this.visible = false;
      if (this.resolver) this.resolver(result);
      this.resolver = null;
    },
    onKey(e) {
      if (this.visible && e.key === 'Escape') this.close(false);
    }
  },
  mounted() {
    window.addEventListener('keydown', this.onKey);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onKey);
  }
});
