"use client";

import { useEffect, useMemo, useState } from "react";
import type { FanConfig, Game } from "@/lib/fanConfig";

function getNextGame(games: Game[]) {
  const now = Date.now();
  return games.find((g) => new Date(g.date).getTime() > now) ?? games[games.length - 1];
}

function useCountdown(date: string) {
  const [parts, setParts] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    function update() {
      const diff = Math.max(0, new Date(date).getTime() - Date.now());
      setParts({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff / 3_600_000) % 24),
        mins: Math.floor((diff / 60_000) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    }
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [date]);

  return parts;
}

function playHorn() {
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtx();
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.03);
  master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.25);
  master.connect(ctx.destination);

  [196, 247, 294].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = i === 0 ? "sawtooth" : "square";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(master);
    osc.start();
    osc.stop(ctx.currentTime + 1.3);
  });

  window.setTimeout(() => ctx.close(), 1500);
}

export default function Dashboard({ config }: { config: FanConfig }) {
  const nextGame = useMemo(() => getNextGame(config.schedule), [config.schedule]);
  const count = useCountdown(nextGame.date);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<boolean[]>(config.gameDayChecklist.map(() => false));

  useEffect(() => {
    const saved = localStorage.getItem("patrick-prediction");
    if (saved) setPrediction(saved);
    const savedChecklist = localStorage.getItem("patrick-checklist");
    if (savedChecklist) {
      try { setChecklist(JSON.parse(savedChecklist)); } catch {}
    }
  }, []);

  function choose(team: string) {
    setPrediction(team);
    localStorage.setItem("patrick-prediction", team);
  }

  function toggleCheck(index: number) {
    const next = checklist.map((done, i) => i === index ? !done : done);
    setChecklist(next);
    localStorage.setItem("patrick-checklist", JSON.stringify(next));
  }

  const nextDate = new Date(nextGame.date);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
  }).format(nextDate);

  return (
    <main className="shell">
      <section className="hero">
        <div className="kicker"><span className="dot" /> Personal Game-Day Command Center</div>
        <h1>{config.fanName}&apos;s<br />Mafia HQ</h1>
        <p>{config.motto}</p>
        <div className="hero-meta">
          <span className="pill">Fan since {config.fanSince}</span>
          <span className="pill">Favorite: {config.favoritePlayer}</span>
          <span className="pill">Buffalo, all season long</span>
        </div>
      </section>

      <section className="grid">
        <article className="card wide">
          <h2>Next game countdown</h2>
          <div className="subtle">{formattedDate} · {nextGame.location}</div>
          <div className="countdown">
            <div className="timebox"><strong>{count.days}</strong><span>Days</span></div>
            <div className="timebox"><strong>{count.hours}</strong><span>Hours</span></div>
            <div className="timebox"><strong>{count.mins}</strong><span>Min</span></div>
            <div className="timebox"><strong>{count.secs}</strong><span>Sec</span></div>
          </div>
          <div className="opponent">
            <div className="opponent-badge">BUF</div>
            <div><strong>Buffalo vs. {nextGame.opponent}</strong><span>{nextGame.home ? "Home" : "Away"} · Week {nextGame.week}</span></div>
          </div>
        </article>

        <article className="card">
          <h2>Patrick&apos;s prediction</h2>
          <div className="subtle">Lock in the pick before kickoff.</div>
          <div className="prediction-row">
            <button className={`choice home ${prediction === "Buffalo" ? "selected" : ""}`} onClick={() => choose("Buffalo")}>Buffalo</button>
            <button className={`choice away ${prediction === nextGame.opponent ? "selected" : ""}`} onClick={() => choose(nextGame.opponent)}>{nextGame.opponent}</button>
          </div>
          <div className="subtle" style={{ marginTop: 14 }}>
            {prediction ? `Pick saved: ${prediction}` : "No pick yet."}
          </div>
        </article>

        <article className="card">
          <h2>Prediction record</h2>
          <div className="subtle">Patrick&apos;s all-time HQ picks</div>
          <div className="record">
  {config.predictionRecord.w}<span className="record-dash">–</span>{config.predictionRecord.l}
  <small>{config.predictionRecord.pct}% correct</small>
</div>
        </article>

        <article className="card">
          <h2>Game-day horn</h2>
          <div className="subtle">For touchdowns, turnovers and unreasonable confidence.</div>
          <button className="horn" onClick={playHorn}>📣 Sound the horn</button>
        </article>

        <article className="card">
          <h2>Achievements</h2>
          <div className="subtle">Highly prestigious. Completely unofficial.</div>
          <div className="achievement-list">
            {config.achievements.map((a) => (
              <div className="achievement" key={a.title}>
                <div className="medal">{a.icon}</div>
                <div><strong>{a.title}</strong><span>{a.description}</span></div>
              </div>
            ))}
          </div>
        </article>

        <article className="card wide">
          <h2>Season board</h2>
          <div className="subtle">Edit the schedule in <code>lib/fanConfig.ts</code>.</div>
          <div className="schedule-list">
            {config.schedule.map((g) => (
              <div className="schedule-item" key={`${g.week}-${g.opponent}`}>
                <div className="schedule-left">
                  <div className="week">W{g.week}</div>
                  <div><strong>{g.home ? "vs." : "@"} {g.opponent}</strong><span>{new Date(g.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {g.location}</span></div>
                </div>
                <span className={`tag ${g.home ? "home" : "away"}`}>{g.home ? "HOME" : "AWAY"}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <h2>Game-day checklist</h2>
          <div className="subtle">Because preparation is part of the ritual.</div>
          <div className="checklist">
            {config.gameDayChecklist.map((item, i) => (
              <div className="check-item" key={item}>
                <button
                  aria-label={`Mark ${item} ${checklist[i] ? "not done" : "done"}`}
                  className={`check-btn ${checklist[i] ? "done" : ""}`}
                  onClick={() => toggleCheck(i)}
                >{checklist[i] ? "✓" : ""}</button>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="card full">
          <h2>Patrick&apos;s Mafia Trophy Room</h2>
          <div className="subtle">A few memories now — easy to replace with real photos later.</div>
          <div className="memory-grid">
            {config.memories.map((m) => (
              <div className="memory" key={m.title}>
                <strong>{m.title}</strong>
                <span>{m.caption}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <footer className="footer">
        Made for Patrick with unreasonable Buffalo optimism. Unofficial fan project; not affiliated with or endorsed by the Buffalo Bills or the NFL.
      </footer>
    </main>
  );
}
