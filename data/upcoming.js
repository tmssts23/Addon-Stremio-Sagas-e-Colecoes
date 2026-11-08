// Próximas estreias escritas à mão, por saga (slug), para os títulos anunciados que o Wikidata não liga à
// saga. Junta-se às que o `npm run update` encontra sozinho (data/auto.json).
// date: 'AAAA-MM-DD' quando há dia marcado, ou só 'AAAA' quando só se sabe o ano.
// universes (opcional): chaves de data/universes.js onde o título entra quando estrear.
// No dia da estreia, o título sai daqui sozinho e entra nas vistas normais da saga e no seu universo; se a
// estreia for adiada, atualiza a data. Datas tiradas do Cinemeta (IMDb).

module.exports = {
  marvel: [
    { id: 'tt16360004', type: 'movie', name: 'Spider-Man: Beyond the Spider-Verse', date: '2027-06-20', animated: true, universes: ['spider-verse'] },
  ],
  dc: [
    { id: 'tt37833661', type: 'movie', name: 'Man of Tomorrow', date: '2027', animated: false, universes: ['dcu'] },
    { id: 'tt19850008', type: 'movie', name: 'The Batman: Part II', date: '2028', animated: false, universes: ['batman-epic-crime-saga'] },
  ],
  'harry-potter': [
    { id: 'tt13918446', type: 'series', name: 'Harry Potter', date: '2026-12-25', animated: false },
  ],
  'how-to-train-your-dragon': [
    { id: 'tt36416299', type: 'movie', name: 'How to Train Your Dragon 2', date: '2027', animated: false },
  ],
};
