// m() = filme, s() = série; o 3.º argumento é o ano de estreia; a flag 'a' marca animação.
const m = (id, name, year, flags = '') => ({ id, type: 'movie', name, year, animated: flags.includes('a') });
const s = (id, name, year, flags = '') => ({ id, type: 'series', name, year, animated: flags.includes('a') });

module.exports = { m, s };
