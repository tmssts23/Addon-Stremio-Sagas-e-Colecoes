// Universos (continuidades) dentro das sagas. Cada um aparece como vista no filtro das sagas onde tem
// títulos, desde que não seja a saga inteira (ex.: na DC aparecem DCEU, DCU, Arrowverse…).
// ids: títulos do universo (IDs IMDb). wikidata: entidades do Wikidata (universo ou série) que o
// `npm run update` usa para pôr os títulos novos no universo certo.
// O nome em inglês aparece com a app em inglês; o namePt com a app em português.

module.exports = [
  {
    key: 'mcu',
    name: 'Marvel Cinematic Universe (MCU)',
    namePt: 'Universo Cinematográfico Marvel (MCU)',
    wikidata: ['Q642878'],
    ids: [
      'tt0371746', // Iron Man (2008)
      'tt0800080', // The Incredible Hulk (2008)
      'tt1228705', // Iron Man 2 (2010)
      'tt0800369', // Thor (2011)
      'tt0458339', // Captain America: The First Avenger (2011)
      'tt0848228', // The Avengers (2012)
      'tt1300854', // Iron Man 3 (2013)
      'tt2364582', // Agents of S.H.I.E.L.D. (2013)
      'tt1981115', // Thor: The Dark World (2013)
      'tt1843866', // Captain America: The Winter Soldier (2014)
      'tt2015381', // Guardians of the Galaxy (2014)
      'tt3475734', // Agent Carter (2015)
      'tt2395427', // Avengers: Age of Ultron (2015)
      'tt0478970', // Ant-Man (2015)
      'tt3498820', // Captain America: Civil War (2016)
      'tt1211837', // Doctor Strange (2016)
      'tt3896198', // Guardians of the Galaxy: Vol. 2 (2017)
      'tt2250912', // Spider-Man: Homecoming (2017)
      'tt3501632', // Thor: Ragnarok (2017)
      'tt1825683', // Black Panther (2018)
      'tt4154756', // Avengers: Infinity War (2018)
      'tt5095030', // Ant-Man and the Wasp (2018)
      'tt4154664', // Captain Marvel (2019)
      'tt4154796', // Avengers: Endgame (2019)
      'tt6320628', // Spider-Man: Far from Home (2019)
      'tt9140560', // WandaVision (2021)
      'tt9208876', // The Falcon and the Winter Soldier (2021)
      'tt9140554', // Loki (2021)
      'tt3480822', // Black Widow (2021)
      'tt10168312', // What If...? (2021)
      'tt9376612', // Shang-Chi and the Legend of the Ten Rings (2021)
      'tt9032400', // Eternals (2021)
      'tt10160804', // Hawkeye (2021)
      'tt10872600', // Spider-Man: No Way Home (2021)
      'tt10234724', // Moon Knight (2022)
      'tt9419884', // Doctor Strange in the Multiverse of Madness (2022)
      'tt10857164', // Ms. Marvel (2022)
      'tt10648342', // Thor: Love and Thunder (2022)
      'tt13623148', // I Am Groot (2022)
      'tt10857160', // She-Hulk: Attorney at Law (2022)
      'tt15318872', // Werewolf by Night (2022)
      'tt9114286', // Black Panther: Wakanda Forever (2022)
      'tt13623136', // The Guardians of the Galaxy Holiday Special (2022)
      'tt10954600', // Ant-Man and the Wasp: Quantumania (2023)
      'tt6791350', // Guardians of the Galaxy Vol. 3 (2023)
      'tt13157618', // Secret Invasion (2023)
      'tt10676048', // The Marvels (2023)
      'tt13966962', // Echo (2024)
      'tt6263850', // Deadpool & Wolverine (2024)
      'tt15571732', // Agatha All Along (2024)
      'tt16027074', // Your Friendly Neighborhood Spider-Man (2025)
      'tt14513804', // Captain America: Brave New World (2025)
      'tt18923754', // Daredevil: Born Again (2025)
      'tt20969586', // Thunderbolts* (2025)
      'tt13623126', // Ironheart (2025)
      'tt10676052', // The Fantastic Four: First Steps (2025)
      'tt13968252', // Eyes of Wakanda (2025)
      'tt16027014', // Marvel Zombies (2025)
      'tt21066182', // Wonder Man (2026)
      'tt22084616', // Spider-Man: Brand New Day (2026)
      'tt23112594', // VisionQuest (2026)
    ],
  },
  {
    key: 'marvel-netflix',
    name: 'Marvel Netflix (The Defenders Saga)',
    namePt: 'Marvel Netflix (Saga Defensores)',
    ids: [
      'tt3322312', // Daredevil (2015)
      'tt2357547', // Jessica Jones (2015)
      'tt3322314', // Luke Cage (2016)
      'tt3322310', // Iron Fist (2017)
      'tt4230076', // The Defenders (2017)
      'tt5675620', // The Punisher (2017)
    ],
  },
  {
    key: 'marvel-television',
    name: 'Marvel Television (ABC & Hulu)',
    namePt: 'Marvel Television (ABC e Hulu)',
    ids: [
      'tt2364582', // Agents of S.H.I.E.L.D. (2013)
      'tt3475734', // Agent Carter (2015)
      'tt4154858', // Inhumans (2017)
      'tt1236246', // Runaways (2017)
      'tt5614844', // Cloak & Dagger (2018)
      'tt10266874', // Helstrom (2020)
    ],
  },
  {
    key: 'fox-x-men',
    name: 'X-Men (Fox)',
    namePt: 'X-Men (Fox)',
    wikidata: ['Q2006869'],
    ids: [
      'tt0120903', // X-Men (2000)
      'tt0290334', // X2: X-Men United (2003)
      'tt0376994', // X-Men: The Last Stand (2006)
      'tt0458525', // X-Men Origins: Wolverine (2009)
      'tt1270798', // X-Men: First Class (2011)
      'tt1430132', // The Wolverine (2013)
      'tt1877832', // X-Men: Days of Future Past (2014)
      'tt1431045', // Deadpool (2016)
      'tt3385516', // X-Men: Apocalypse (2016)
      'tt3315342', // Logan (2017)
      'tt5114356', // Legion (2017)
      'tt4396630', // The Gifted (2017)
      'tt5463162', // Deadpool 2 (2018)
      'tt6565702', // X-Men: Dark Phoenix (2019)
      'tt4682266', // The New Mutants (2020)
    ],
  },
  {
    key: 'x-men-animated',
    name: 'X-Men: The Animated Series',
    namePt: 'X-Men: A Série Animada',
    ids: [
      'tt0103584', // X-Men: The Animated Series (1992)
      'tt16026746', // X-Men '97 (2024)
    ],
  },
  {
    key: 'raimi-spider-man',
    name: 'Spider-Man (Sam Raimi)',
    namePt: 'Homem-Aranha de Sam Raimi',
    wikidata: ['Q18636789'],
    ids: [
      'tt0145487', // Spider-Man (2002)
      'tt0316654', // Spider-Man 2 (2004)
      'tt0413300', // Spider-Man 3 (2007)
    ],
  },
  {
    key: 'amazing-spider-man',
    name: 'The Amazing Spider-Man',
    namePt: 'O Fantástico Homem-Aranha',
    wikidata: ['Q18636794'],
    ids: [
      'tt0948470', // The Amazing Spider-Man (2012)
      'tt1872181', // The Amazing Spider-Man 2 (2014)
    ],
  },
  {
    key: 'sony-spider-man-universe',
    name: "Sony's Spider-Man Universe",
    namePt: 'Universo Homem-Aranha da Sony',
    wikidata: ['Q55537283'],
    ids: [
      'tt1270797', // Venom (2018)
      'tt7097896', // Venom: Let There Be Carnage (2021)
      'tt5108870', // Morbius (2022)
      'tt11057302', // Madame Web (2024)
      'tt16366836', // Venom: The Last Dance (2024)
      'tt8790086', // Kraven the Hunter (2024)
    ],
  },
  {
    key: 'spider-verse',
    name: 'Spider-Verse',
    namePt: 'Aranhaverso',
    wikidata: ['Q99601314'],
    ids: [
      'tt4633694', // Spider-Man: Into the Spider-Verse (2018)
      'tt9362722', // Spider-Man: Across the Spider-Verse (2023)
    ],
  },
  {
    key: 'blade-trilogy',
    name: 'Blade (1998–2004)',
    namePt: 'Blade (1998–2004)',
    ids: [
      'tt0120611', // Blade (1998)
      'tt0187738', // Blade II (2002)
      'tt0359013', // Blade: Trinity (2004)
    ],
  },
  {
    key: 'fox-fantastic-four',
    name: 'Fantastic Four (Fox)',
    namePt: 'Quarteto Fantástico (Fox)',
    ids: [
      'tt0120667', // Fantastic Four (2005)
      'tt0486576', // Fantastic Four: Rise of the Silver Surfer (2007)
      'tt1502712', // Fantastic Four (2015)
    ],
  },
  {
    key: 'fox-daredevil',
    name: 'Daredevil & Elektra (Fox)',
    namePt: 'Demolidor e Elektra (Fox)',
    ids: [
      'tt0287978', // Daredevil (2003)
      'tt0357277', // Elektra (2005)
    ],
  },
  {
    key: 'ghost-rider',
    name: 'Ghost Rider (Sony)',
    namePt: 'Ghost Rider (Sony)',
    ids: [
      'tt0259324', // Ghost Rider (2007)
      'tt1071875', // Ghost Rider: Spirit of Vengeance (2011)
    ],
  },
  {
    key: 'dceu',
    name: 'DC Extended Universe (DCEU)',
    namePt: 'Universo Estendido DC (DCEU)',
    wikidata: ['Q18281265'],
    ids: [
      'tt0770828', // Man of Steel (2013)
      'tt2975590', // Batman v Superman: Dawn of Justice (2016)
      'tt1386697', // Suicide Squad (2016)
      'tt0451279', // Wonder Woman (2017)
      'tt0974015', // Justice League (2017)
      'tt1477834', // Aquaman (2018)
      'tt0448115', // Shazam! (2019)
      'tt7713068', // Birds of Prey (2020)
      'tt7126948', // Wonder Woman 1984 (2020)
      'tt12361974', // Zack Snyder's Justice League (2021)
      'tt6334354', // The Suicide Squad (2021)
      'tt13146488', // Peacemaker (2022)
      'tt6443346', // Black Adam (2022)
      'tt10151854', // Shazam! Fury of the Gods (2023)
      'tt0439572', // The Flash (2023)
      'tt9362930', // Blue Beetle (2023)
      'tt9663764', // Aquaman and the Lost Kingdom (2023)
    ],
  },
  {
    key: 'dcu',
    name: 'DC Universe (DCU)',
    namePt: 'Universo DC (DCU)',
    wikidata: ['Q116545465'],
    ids: [
      'tt26545355', // Creature Commandos (2024)
      'tt5950044', // Superman (2025)
      'tt13146488', // Peacemaker (2022)
      'tt8814476', // Supergirl (2026)
      'tt26545992', // Lanterns (2026)
      'tt34890576', // Clayface (2026)
    ],
  },
  {
    key: 'arrowverse',
    name: 'Arrowverse',
    namePt: 'Arrowverse',
    wikidata: ['Q20775209', 'Q113094863'],
    ids: [
      'tt2193021', // Arrow (2012)
      'tt3107288', // The Flash (2014)
      'tt3489184', // Constantine (2014)
      'tt4016454', // Supergirl (2015)
      'tt4532368', // Legends of Tomorrow (2016)
      'tt6045840', // Black Lightning (2018)
      'tt8712204', // Batwoman (2019)
      'tt8722888', // Stargirl (2020)
      'tt11192306', // Superman & Lois (2021)
    ],
  },
  {
    key: 'dcau',
    name: 'DC Animated Universe (DCAU)',
    namePt: 'Universo Animado DC (DCAU)',
    wikidata: ['Q900829'],
    ids: [
      'tt0103359', // Batman: The Animated Series (1992)
      'tt0106364', // Batman: Mask of the Phantasm (1993)
      'tt0115378', // Superman: The Animated Series (1996)
      'tt0118266', // The New Batman Adventures (1997)
      'tt0147746', // Batman Beyond (1999)
      'tt0233298', // Batman Beyond: Return of the Joker (2000)
      'tt0247729', // Static Shock (2000)
      'tt0275137', // Justice League (2001)
      'tt6025022', // Justice League Unlimited (2004)
    ],
  },
  {
    key: 'dark-knight-trilogy',
    name: 'The Dark Knight Trilogy (Nolan)',
    namePt: 'Trilogia O Cavaleiro das Trevas (Nolan)',
    wikidata: ['Q12859908', 'Q69920250'],
    ids: [
      'tt0372784', // Batman Begins (2005)
      'tt0468569', // The Dark Knight (2008)
      'tt1345836', // The Dark Knight Rises (2012)
    ],
  },
  {
    key: 'burton-schumacher-batman',
    name: 'Batman (Burton & Schumacher)',
    namePt: 'Batman de Burton e Schumacher',
    wikidata: ['Q71328820'],
    ids: [
      'tt0096895', // Batman (1989)
      'tt0103776', // Batman Returns (1992)
      'tt0112462', // Batman Forever (1995)
      'tt0118688', // Batman & Robin (1997)
    ],
  },
  {
    key: 'batman-epic-crime-saga',
    name: 'The Batman (Matt Reeves)',
    namePt: 'The Batman (Matt Reeves)',
    ids: [
      'tt1877830', // The Batman (2022)
      'tt15435876', // The Penguin (2024)
    ],
  },
  {
    key: 'batman-1966',
    name: 'Batman (1966)',
    namePt: 'Batman (1966)',
    wikidata: ['Q92205230'],
    ids: [
      'tt0059968', // Batman (1966)
      'tt0060153', // Batman: The Movie (1966)
    ],
  },
  {
    key: 'reeve-superman',
    name: 'Superman (Christopher Reeve)',
    namePt: 'Superman de Christopher Reeve',
    ids: [
      'tt0078346', // Superman (1978)
      'tt0081573', // Superman II (1980)
      'tt0086393', // Superman III (1983)
      'tt0088206', // Supergirl (1984)
      'tt0094074', // Superman IV: The Quest for Peace (1987)
      'tt0348150', // Superman Returns (2006)
    ],
  },
  {
    key: 'joker',
    name: 'Joker (Todd Phillips)',
    namePt: 'Joker (Todd Phillips)',
    ids: [
      'tt7286456', // Joker (2019)
      'tt11315808', // Joker: Folie à Deux (2024)
    ],
  },
  {
    key: 'titans-doom-patrol',
    name: 'Titans & Doom Patrol (Earth-9)',
    namePt: 'Titãs e Doom Patrol (Terra-9)',
    ids: [
      'tt1043813', // Titans (2018)
      'tt8416494', // Doom Patrol (2019)
      'tt8362852', // Swamp Thing (2019)
    ],
  },
  {
    key: 'teen-titans-animated',
    name: 'Teen Titans (animated)',
    namePt: 'Teen Titans (animação)',
    ids: [
      'tt0343314', // Teen Titans (2003)
      'tt2771780', // Teen Titans Go! (2013)
      'tt7424200', // Teen Titans Go! To the Movies (2018)
    ],
  },
  {
    key: 'watchmen',
    name: 'Watchmen',
    namePt: 'Watchmen',
    ids: [
      'tt0409459', // Watchmen (2009)
      'tt7049682', // Watchmen (2019)
    ],
  },
  {
    key: 'star-wars-legends',
    name: 'Star Wars Legends',
    namePt: 'Star Wars Legends (fora do cânone)',
    wikidata: ['Q3551295'],
    ids: [
      'tt0193524', // The Star Wars Holiday Special (1978)
      'tt0087225', // The Ewok Adventure (1984)
      'tt0089110', // Ewoks: The Battle for Endor (1985)
      'tt0088510', // Star Wars: Droids (1985)
      'tt0088515', // Star Wars: Ewoks (1985)
      'tt0361243', // Star Wars: Clone Wars (2003)
    ],
  },
  {
    key: 'star-wars-canon',
    name: 'Star Wars (official canon)',
    namePt: 'Star Wars (cânone oficial)',
    ids: [
      'tt0076759', // Star Wars: Episode IV - A New Hope (1977)
      'tt0080684', // Star Wars: Episode V - The Empire Strikes Back (1980)
      'tt0086190', // Star Wars: Episode VI - Return of the Jedi (1983)
      'tt0120915', // Star Wars: Episode I - The Phantom Menace (1999)
      'tt0121765', // Star Wars: Episode II - Attack of the Clones (2002)
      'tt0121766', // Star Wars: Episode III - Revenge of the Sith (2005)
      'tt1185834', // Star Wars: The Clone Wars (2008)
      'tt0458290', // Star Wars: The Clone Wars (2008)
      'tt2930604', // Star Wars Rebels (2014)
      'tt2488496', // Star Wars: Episode VII - The Force Awakens (2015)
      'tt3748528', // Rogue One: A Star Wars Story (2016)
      'tt2527336', // Star Wars: Episode VIII - The Last Jedi (2017)
      'tt3778644', // Solo: A Star Wars Story (2018)
      'tt8336340', // Star Wars Resistance (2018)
      'tt2527338', // Star Wars: Episode IX - The Rise of Skywalker (2019)
      'tt8111088', // The Mandalorian (2019)
      'tt12708542', // Star Wars: The Bad Batch (2021)
      'tt13668894', // The Book of Boba Fett (2021)
      'tt8466564', // Obi-Wan Kenobi (2022)
      'tt9253284', // Andor (2022)
      'tt20723374', // Tales of the Jedi (2022)
      'tt13622776', // Ahsoka (2023)
      'tt32019314', // Star Wars: Tales of the Empire (2024)
      'tt12262202', // The Acolyte (2024)
      'tt20600980', // Star Wars: Skeleton Crew (2024)
      'tt36414431', // Star Wars: Tales of the Underworld (2025)
      'tt30825738', // The Mandalorian and Grogu (2026)
      'tt36594331', // Star Wars: Maul - Shadow Lord (2026)
    ],
  },
  {
    key: 'star-trek-kelvin',
    name: 'Kelvin Timeline',
    namePt: 'Linha temporal Kelvin',
    wikidata: ['Q47164023'],
    ids: [
      'tt0796366', // Star Trek (2009)
      'tt1408101', // Star Trek Into Darkness (2013)
      'tt2660888', // Star Trek Beyond (2016)
    ],
  },
  {
    key: 'star-trek-prime',
    name: 'Prime Timeline',
    namePt: 'Linha temporal principal',
    ids: [
      'tt0060028', // Star Trek (1966)
      'tt0069637', // Star Trek: The Animated Series (1973)
      'tt0079945', // Star Trek: The Motion Picture (1979)
      'tt0084726', // Star Trek II: The Wrath of Khan (1982)
      'tt0088170', // Star Trek III: The Search for Spock (1984)
      'tt0092007', // Star Trek IV: The Voyage Home (1986)
      'tt0092455', // Star Trek: The Next Generation (1987)
      'tt0098382', // Star Trek V: The Final Frontier (1989)
      'tt0102975', // Star Trek VI: The Undiscovered Country (1991)
      'tt0106145', // Star Trek: Deep Space Nine (1993)
      'tt0111280', // Star Trek: Generations (1994)
      'tt0112178', // Star Trek: Voyager (1995)
      'tt0117731', // Star Trek: First Contact (1996)
      'tt0120844', // Star Trek: Insurrection (1998)
      'tt0244365', // Star Trek: Enterprise (2001)
      'tt0253754', // Star Trek: Nemesis (2002)
      'tt5171438', // Star Trek: Discovery (2017)
      'tt8806524', // Star Trek: Picard (2020)
      'tt9184820', // Star Trek: Lower Decks (2020)
      'tt9795876', // Star Trek: Prodigy (2021)
      'tt12327578', // Star Trek: Strange New Worlds (2022)
      'tt9603060', // Star Trek: Section 31 (2025)
      'tt8622160', // Star Trek: Starfleet Academy (2026)
    ],
  },
  {
    key: 'transformers-g1',
    name: 'Transformers Generation 1',
    namePt: 'Transformers Geração 1 (1984)',
    ids: [
      'tt0086817', // The Transformers (1984)
      'tt0092106', // The Transformers: The Movie (1986)
    ],
  },
  {
    key: 'transformers-bayverse',
    name: 'Transformers (Michael Bay)',
    namePt: 'Transformers de Michael Bay',
    wikidata: ['Q116480347'],
    ids: [
      'tt0418279', // Transformers (2007)
      'tt1055369', // Transformers: Revenge of the Fallen (2009)
      'tt1399103', // Transformers: Dark of the Moon (2011)
      'tt2109248', // Transformers: Age of Extinction (2014)
      'tt3371366', // Transformers: The Last Knight (2017)
    ],
  },
  {
    key: 'transformers-bumblebee',
    name: 'Bumblebee & Rise of the Beasts',
    namePt: 'Bumblebee e O Despertar das Feras',
    ids: [
      'tt4701182', // Bumblebee (2018)
      'tt5090568', // Transformers: Rise of the Beasts (2023)
    ],
  },
  {
    key: 'tmnt-1990',
    name: 'Teenage Mutant Ninja Turtles (1990–2007 films)',
    namePt: 'Tartarugas Ninja (filmes 1990–2007)',
    wikidata: ['Q132392380'],
    ids: [
      'tt0100758', // Teenage Mutant Ninja Turtles (1990)
      'tt0103060', // Teenage Mutant Ninja Turtles II: The Secret of the Ooze (1991)
      'tt0108308', // Teenage Mutant Ninja Turtles III (1993)
      'tt0453556', // TMNT (2007)
    ],
  },
  {
    key: 'tmnt-2014',
    name: 'Teenage Mutant Ninja Turtles (2014–2016 films)',
    namePt: 'Tartarugas Ninja (filmes 2014–2016)',
    wikidata: ['Q136536441'],
    ids: [
      'tt1291150', // Teenage Mutant Ninja Turtles (2014)
      'tt3949660', // Teenage Mutant Ninja Turtles: Out of the Shadows (2016)
    ],
  },
  {
    key: 'tmnt-rise',
    name: 'Rise of the Teenage Mutant Ninja Turtles',
    namePt: 'O Despertar das Tartarugas Ninja',
    wikidata: ['Q136483440'],
    ids: [
      'tt6601082', // Rise of the Teenage Mutant Ninja Turtles (2018)
      'tt9784708', // Rise of the Teenage Mutant Ninja Turtles: The Movie (2022)
    ],
  },
  {
    key: 'tmnt-mutant-mayhem',
    name: 'Mutant Mayhem',
    namePt: 'Caos Mutante',
    wikidata: ['Q136536453'],
    ids: [
      'tt8589698', // Teenage Mutant Ninja Turtles: Mutant Mayhem (2023)
      'tt28521741', // Tales of the Teenage Mutant Ninja Turtles (2024)
    ],
  },
  {
    key: 'apes-original',
    name: 'Planet of the Apes (1968–1973)',
    namePt: 'Planeta dos Macacos (1968–1973)',
    ids: [
      'tt0063442', // Planet of the Apes (1968)
      'tt0065462', // Beneath the Planet of the Apes (1970)
      'tt0067065', // Escape from the Planet of the Apes (1971)
      'tt0068408', // Conquest of the Planet of the Apes (1972)
      'tt0069768', // Battle for the Planet of the Apes (1973)
    ],
  },
  {
    key: 'apes-reboot',
    name: 'Planet of the Apes (2011–)',
    namePt: 'Planeta dos Macacos (2011–)',
    ids: [
      'tt1318514', // Rise of the Planet of the Apes (2011)
      'tt2103281', // Dawn of the Planet of the Apes (2014)
      'tt3450958', // War for the Planet of the Apes (2017)
      'tt11389872', // Kingdom of the Planet of the Apes (2024)
    ],
  },
  {
    key: 'dune-legendary',
    name: 'Dune (Denis Villeneuve)',
    namePt: 'Duna de Denis Villeneuve',
    ids: [
      'tt1160419', // Dune (2021)
      'tt15239678', // Dune: Part Two (2024)
      'tt10466872', // Dune: Prophecy (2024)
    ],
  },
  {
    key: 'jackson-middle-earth',
    name: "Peter Jackson's Middle-earth",
    namePt: 'Terra Média de Peter Jackson',
    wikidata: ['Q26214973'],
    ids: [
      'tt0120737', // The Lord of the Rings: The Fellowship of the Ring (2001)
      'tt0167261', // The Lord of the Rings: The Two Towers (2002)
      'tt0167260', // The Lord of the Rings: The Return of the King (2003)
      'tt0903624', // The Hobbit: An Unexpected Journey (2012)
      'tt1170358', // The Hobbit: The Desolation of Smaug (2013)
      'tt2310332', // The Hobbit: The Battle of the Five Armies (2014)
      'tt14824600', // The Lord of the Rings: The War of the Rohirrim (2024)
    ],
  },
  {
    key: 'rankin-bass-middle-earth',
    name: 'Rankin/Bass Middle-earth',
    namePt: 'Terra Média da Rankin/Bass',
    ids: [
      'tt0077687', // The Hobbit (1977)
      'tt0079802', // The Return of the King (1980)
    ],
  },
  {
    key: 'alien-vs-predator',
    name: 'Alien vs. Predator',
    namePt: 'Alien vs. Predador',
    wikidata: ['Q2967318', 'Q23016617'],
    ids: [
      'tt0370263', // AVP: Alien vs. Predator (2004)
      'tt0758730', // Aliens vs. Predator: Requiem (2007)
    ],
  },
  {
    key: 'sommers-mummy',
    name: 'The Mummy (Stephen Sommers)',
    namePt: 'A Múmia de Stephen Sommers',
    ids: [
      'tt0120616', // The Mummy (1999)
      'tt0209163', // The Mummy Returns (2001)
      'tt0859163', // The Mummy: Tomb of the Dragon Emperor (2008)
    ],
  },
];
