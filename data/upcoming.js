// Próximas estreias escritas à mão, por saga (slug), para os títulos anunciados que o Wikidata não liga à
// saga. Junta-se às que o `npm run update` encontra sozinho (data/auto.json).
// date: 'AAAA-MM-DD' quando há dia marcado, ou só 'AAAA' quando só se sabe o ano.
// Quando a data passa, o título sai daqui sozinho e entra nas vistas normais da saga; se a estreia for
// adiada, atualiza a data. Datas tiradas do Cinemeta (IMDb).

module.exports = {
  marvel: [
    { id: 'tt16360004', type: 'movie', name: 'Spider-Man: Beyond the Spider-Verse', date: '2027-06-20', animated: true },
  ],
  dc: [
    { id: 'tt37833661', type: 'movie', name: 'Man of Tomorrow', date: '2027', animated: false },
    { id: 'tt19850008', type: 'movie', name: 'The Batman: Part II', date: '2028', animated: false },
  ],
  'harry-potter': [
    { id: 'tt13918446', type: 'series', name: 'Harry Potter', date: '2026-12-25', animated: false },
  ],
  'how-to-train-your-dragon': [
    { id: 'tt36416299', type: 'movie', name: 'How to Train Your Dragon 2', date: '2027', animated: false },
  ],
};
