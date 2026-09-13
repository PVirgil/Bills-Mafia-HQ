export type Game = {
  week: number;
  opponent: string;
  date: string;
  home: boolean;
  location: string;
};

export type FanConfig = {
  fanName: string;
  fanSince: number;
  favoritePlayer: string;
  motto: string;
  predictionRecord: { w: number; l: number; pct: number };
  schedule: Game[];
  achievements: { icon: string; title: string; description: string }[];
  gameDayChecklist: string[];
  memories: { title: string; caption: string }[];
};

export const fanConfig: FanConfig = {
  fanName: "Patrick",
  fanSince: 1978,
  favoritePlayer: "Josh Allen",
  motto: "Built for Sundays, snow games, fourth-quarter chaos, and believing this is the year.",
  predictionRecord: { w: 0, l: 0, pct: 0 },

  // Official Buffalo 2026 regular-season dates/times, current as of Sept. 13, 2026.
  // Week 18 vs. the NY Jets is omitted because its date/time is still TBD.
  schedule: [
    { week: 2, opponent: "Detroit Lions", date: "2026-09-17T20:15:00-04:00", home: true, location: "Highmark Stadium" },
    { week: 3, opponent: "Los Angeles Chargers", date: "2026-09-27T13:00:00-04:00", home: true, location: "Highmark Stadium" },
    { week: 4, opponent: "New England Patriots", date: "2026-10-04T13:00:00-04:00", home: true, location: "Highmark Stadium" },
    { week: 5, opponent: "Los Angeles Rams", date: "2026-10-12T20:15:00-04:00", home: false, location: "SoFi Stadium" },
    { week: 6, opponent: "Las Vegas Raiders", date: "2026-10-18T16:25:00-04:00", home: false, location: "Allegiant Stadium" },
    { week: 8, opponent: "Baltimore Ravens", date: "2026-11-01T13:00:00-05:00", home: true, location: "Highmark Stadium" },
    { week: 9, opponent: "Minnesota Vikings", date: "2026-11-09T20:15:00-05:00", home: false, location: "U.S. Bank Stadium" },
    { week: 10, opponent: "New York Jets", date: "2026-11-15T13:00:00-05:00", home: false, location: "MetLife Stadium" },
    { week: 11, opponent: "Miami Dolphins", date: "2026-11-22T13:00:00-05:00", home: true, location: "Highmark Stadium" },
    { week: 12, opponent: "Kansas City Chiefs", date: "2026-11-26T20:20:00-05:00", home: true, location: "Highmark Stadium" },
    { week: 13, opponent: "New England Patriots", date: "2026-12-06T16:25:00-05:00", home: false, location: "Gillette Stadium" },
    { week: 14, opponent: "Green Bay Packers", date: "2026-12-13T20:20:00-05:00", home: false, location: "Lambeau Field" },
    { week: 15, opponent: "Chicago Bears", date: "2026-12-19T20:20:00-05:00", home: true, location: "Highmark Stadium" },
    { week: 16, opponent: "Denver Broncos", date: "2026-12-25T16:30:00-05:00", home: false, location: "Empower Field at Mile High" },
    { week: 17, opponent: "Miami Dolphins", date: "2027-01-03T13:00:00-05:00", home: false, location: "Hard Rock Stadium" }
  ],

  achievements: [
    { icon: "❄️", title: "Snow Game Certified", description: "Cold weather only makes it better." },
    { icon: "🦬", title: "Mafia Loyalist", description: "Optimism level: permanently elevated." },
    { icon: "🏆", title: "Never Doubted Them", description: "Awarded after every comeback." }
  ],

  gameDayChecklist: [
    "Bills gear on",
    "Snacks secured",
    "Prediction locked",
    "Group chat activated",
    "Volume unreasonably high"
  ],

  memories: [
    { title: "The First Game", caption: "Replace this card with Patrick's first Bills memory." },
    { title: "Best Win", caption: "Add the game Patrick still talks about." },
    { title: "Mafia Moment", caption: "Drop in a tailgate, road trip, or family tradition." }
  ]
};
