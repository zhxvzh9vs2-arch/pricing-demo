"use client";

import { useMemo, useState } from "react";

const seatCategories = [
  { id: 1, name: "Premium Center", base: 3000 },
  { id: 6, name: "Standard", base: 1000 },
  { id: 14, name: "Economy", base: 450 },
];

export default function Home() {
  const [seatId, setSeatId] = useState(1);
  const [matchCategory, setMatchCategory] = useState(1);
  const [sold, setSold] = useState(35);
  const [days, setDays] = useState(10);
  const [isWeekend, setIsWeekend] = useState(false);
  const [goodTime, setGoodTime] = useState(true);
  const [hasStar, setHasStar] = useState(true);
  const [isDerby, setIsDerby] = useState(true);
  const [teamPlace, setTeamPlace] = useState(5);
  const [opponentPlace, setOpponentPlace] = useState(3);
  const [winStreak, setWinStreak] = useState(1);

  const seat = seatCategories.find((s) => s.id === seatId) || seatCategories[0];

  const result = useMemo(() => {
    let price = seat.base;
    const factors: { name: string; coef: number }[] = [];

    const add = (name: string, coef: number) => {
      price *= coef;
      factors.push({ name, coef });
    };

    if (matchCategory === 1) add("Match category", 2);
    if (matchCategory === 2) add("Match category", 1.5);
    if (matchCategory === 3) add("Match category", 1);

    add("Day of week", isWeekend ? 1.1 : 0.9);
    add("Match time", goodTime ? 1.05 : 0.95);

    if (hasStar) add("Opponent star player", 1.1);
    if (isDerby) add("Derby factor", 1.15);

    if (teamPlace <= 3) add("Team position", 1.15);
    else if (teamPlace <= 8) add("Team position", 1.05);
    else add("Team position", 0.95);

    if (opponentPlace <= 3) add("Opponent position", 1.15);
    else if (opponentPlace <= 8) add("Opponent position", 1.05);
    else add("Opponent position", 0.95);

    if (winStreak >= 3) add("Winning streak", 1.1);
    else if (winStreak === 0) add("No winning streak", 0.95);

    if (sold > 30) add("Demand > 30%", 1.1);
    if (sold > 50) add("Demand > 50%", 1.15);
    if (sold > 70) add("Demand > 70%", 1.25);
    if (sold > 85) add("Ticket scarcity", 1.2);

    if (days < 7) add("Less than 7 days", 1.1);
    if (days < 2) add("Less than 2 days", 1.2);

    const finalPrice = Math.round(price);
    const tickets = 500;
    const baseRevenue = seat.base * tickets;
    const dynamicRevenue = finalPrice * tickets;
    const revenueGrowth = dynamicRevenue - baseRevenue;

    const chart = Array.from({ length: 8 }, (_, i) => {
      const demand = Math.min(100, 10 + i * 12 + sold / 5);
      const chartPrice = Math.round(seat.base * (1 + demand / 100) * (matchCategory === 1 ? 1.6 : matchCategory === 2 ? 1.25 : 1));
      return { demand, price: chartPrice };
    });

    return {
      finalPrice,
      growthPercent: Math.round(((finalPrice / seat.base) - 1) * 100),
      baseRevenue,
      dynamicRevenue,
      revenueGrowth,
      factors,
      chart,
    };
  }, [seat, matchCategory, sold, days, isWeekend, goodTime, hasStar, isDerby, teamPlace, opponentPlace, winStreak]);

  const maxChartPrice = Math.max(...result.chart.map((p) => p.price));

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <div style={styles.badge}>AI Ticket Revenue Engine</div>
          <h1 style={styles.title}>Dynamic Pricing Platform</h1>
          <p style={styles.subtitle}>
            Автоматическое изменение цены билетов на основе спроса, времени до матча,
            категории события и спортивных факторов.
          </p>
        </div>

        <div style={styles.priceCard}>
          <span style={styles.cardLabel}>Current recommended price</span>
          <h2 style={styles.price}>{result.finalPrice.toLocaleString()} ₽</h2>
          <p style={styles.green}>+{result.growthPercent}% к базовой цене</p>
        </div>
      </section>

      <section style={styles.kpiGrid}>
        <Kpi title="Base revenue" value={`${result.baseRevenue.toLocaleString()} ₽`} />
        <Kpi title="Dynamic revenue" value={`${result.dynamicRevenue.toLocaleString()} ₽`} />
        <Kpi title="Additional revenue" value={`${result.revenueGrowth.toLocaleString()} ₽`} highlight />
        <Kpi title="Tickets sold" value={`${sold}%`} />
      </section>

      <section style={styles.grid}>
        <div style={styles.panel}>
          <h3>Match settings</h3>

          <Label text="Seat category" />
          <select style={styles.select} value={seatId} onChange={(e) => setSeatId(Number(e.target.value))}>
            {seatCategories.map((s) => (
              <option key={s.id} value={s.id}>{s.name} — {s.base} ₽</option>
            ))}
          </select>

          <Label text="Match category" />
          <select style={styles.select} value={matchCategory} onChange={(e) => setMatchCategory(Number(e.target.value))}>
            <option value={1}>Category 1 — top demand</option>
            <option value={2}>Category 2 — medium demand</option>
            <option value={3}>Category 3 — low demand</option>
          </select>

          <Slider label="Tickets sold" value={sold} max={100} setValue={setSold} suffix="%" />
          <Slider label="Days to match" value={days} max={60} setValue={setDays} />
          <Slider label="Team position" value={teamPlace} min={1} max={12} setValue={setTeamPlace} />
          <Slider label="Opponent position" value={opponentPlace} min={1} max={12} setValue={setOpponentPlace} />
          <Slider label="Winning streak" value={winStreak} max={5} setValue={setWinStreak} />
        </div>

        <div style={styles.panel}>
          <h3>Revenue forecast</h3>
          <div style={styles.chart}>
            {result.chart.map((point, i) => (
              <div key={i} style={styles.barWrap}>
                <div
                  style={{
                    ...styles.bar,
                    height: `${(point.price / maxChartPrice) * 190}px`,
                  }}
                />
                <span style={styles.barLabel}>{point.price}</span>
              </div>
            ))}
          </div>
          <p style={styles.hint}>График показывает рост рекомендованной цены при увеличении спроса.</p>
        </div>
      </section>

      <section style={styles.grid}>
        <div style={styles.panel}>
          <h3>Active factors</h3>

          <Check text="Weekend match" checked={isWeekend} setChecked={setIsWeekend} />
          <Check text="Good match time" checked={goodTime} setChecked={setGoodTime} />
          <Check text="Opponent has star player" checked={hasStar} setChecked={setHasStar} />
          <Check text="Derby match" checked={isDerby} setChecked={setIsDerby} />
        </div>

        <div style={styles.panel}>
          <h3>Applied coefficients</h3>
          {result.factors.map((f, i) => (
            <div key={i} style={styles.factor}>
              <span>{f.name}</span>
              <b>x{f.coef}</b>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Kpi({ title, value, highlight = false }: { title: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ ...styles.kpi, borderColor: highlight ? "#27e6a1" : "rgba(255,255,255,0.08)" }}>
      <span style={styles.cardLabel}>{title}</span>
      <strong style={styles.kpiValue}>{value}</strong>
    </div>
  );
}

function Label({ text }: { text: string }) {
  return <p style={styles.label}>{text}</p>;
}

function Slider({ label, value, setValue, min = 0, max, suffix = "" }: any) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={styles.sliderTop}>
        <span>{label}</span>
        <b>{value}{suffix}</b>
      </div>
      <input style={styles.range} type="range" min={min} max={max} value={value} onChange={(e) => setValue(Number(e.target.value))} />
    </div>
  );
}

function Check({ text, checked, setChecked }: any) {
  return (
    <label style={styles.check}>
      <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />
      {text}
    </label>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top left, #1f2a44, #080b12 45%, #05060a)",
    color: "#fff",
    padding: 36,
    fontFamily: "Inter, Arial, sans-serif",
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: 24,
    marginBottom: 24,
  },
  badge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(39,230,161,0.12)",
    color: "#27e6a1",
    fontSize: 13,
    marginBottom: 16,
  },
  title: {
    fontSize: 56,
    lineHeight: 1,
    margin: 0,
    letterSpacing: "-2px",
  },
  subtitle: {
    maxWidth: 680,
    color: "#aeb7c7",
    fontSize: 18,
    lineHeight: 1.5,
  },
  priceCard: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 28,
    padding: 28,
    backdropFilter: "blur(20px)",
  },
  cardLabel: {
    color: "#8e9bb0",
    fontSize: 14,
  },
  price: {
    fontSize: 52,
    margin: "14px 0 6px",
  },
  green: {
    color: "#27e6a1",
    margin: 0,
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    marginBottom: 24,
  },
  kpi: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 22,
    padding: 22,
  },
  kpiValue: {
    display: "block",
    fontSize: 24,
    marginTop: 10,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
    marginBottom: 24,
  },
  panel: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 28,
    padding: 24,
    backdropFilter: "blur(18px)",
  },
  label: {
    color: "#aeb7c7",
    marginBottom: 8,
  },
  select: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#101623",
    color: "#fff",
    marginBottom: 16,
  },
  sliderTop: {
    display: "flex",
    justifyContent: "space-between",
    color: "#dce3ef",
  },
  range: {
    width: "100%",
  },
  chart: {
    height: 260,
    display: "flex",
    alignItems: "end",
    gap: 18,
    paddingTop: 30,
  },
  barWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "end",
  },
  bar: {
    width: "100%",
    borderRadius: "14px 14px 4px 4px",
    background: "linear-gradient(180deg, #27e6a1, #3b82f6)",
    boxShadow: "0 0 30px rgba(39,230,161,0.25)",
  },
  barLabel: {
    marginTop: 8,
    color: "#8e9bb0",
    fontSize: 12,
  },
  hint: {
    color: "#8e9bb0",
  },
  check: {
    display: "block",
    marginBottom: 14,
    color: "#dce3ef",
  },
  factor: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    color: "#dce3ef",
  },
};