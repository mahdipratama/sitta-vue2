/* Service akses data: membaca JSON dummy & memuat template komponen */
const api = {
  async getData() {
    const res = await fetch('data/dataBahanAjar.json');
    if (!res.ok) throw new Error('Gagal memuat dataBahanAjar.json (' + res.status + ')');
    const data = await res.json();
    data.tracking = api.normalizeTracking(data.tracking);
    return data;
  },

  // Data asli: tracking = [ { "DO2025-0001": {...} }, ... ] (bisa ada duplikat).
  // Diratakan menjadi [ { nomorDO, ...detail } ] dan duplikat dibuang.
  normalizeTracking(raw) {
    const seen = new Set();
    const list = [];
    (raw || []).forEach((entry) => {
      Object.keys(entry).forEach((nomorDO) => {
        if (seen.has(nomorDO)) return;
        seen.add(nomorDO);
        const detail = entry[nomorDO];
        list.push(Object.assign({ nomorDO: nomorDO, perjalanan: [] }, detail));
      });
    });
    return list;
  },

  // Memuat file /templates/*.html lalu menyisipkannya ke <body>
  // sehingga <template id="tpl-..."> dapat dipakai oleh Vue.component.
  async loadTemplates(names) {
    const texts = await Promise.all(names.map(async (name) => {
      const res = await fetch('templates/' + name + '.html');
      if (!res.ok) throw new Error('Gagal memuat template ' + name);
      return res.text();
    }));
    texts.forEach((html) => document.body.insertAdjacentHTML('beforeend', html));
  }
};
