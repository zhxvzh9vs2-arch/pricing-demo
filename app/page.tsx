"use client";

import { useMemo, useState } from "react";

const seatCategories = [
  { id: 1, name: "Категория 1", base: 3000 },
  { id: 6, name: "Категория 6", base: 1000 },
  { id: 14, name: "Категория 14", base: 450 },
];

export default function Home() {
  const [seat, setSeat] = useState(seatCategories[0]);
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

  const result = useMemo(() => {
    let price = seat.base;
    const factors: { name: string; coef: number }[] = [];

    const add = (name: string, coef: number) => {
      price *= coef;
      factors.push({ name, coef });
    };

    if (matchCategory === 1) add("Категория матча 1", 2);
    if (matchCategory === 2) add("Категория матча 2", 1.5);
    if (matchCategory === 3) add("Категория матча 3", 1);

    add("День недели", isWeekend ? 1.1 : 0.9);
    add("Время матча", goodTime ? 1.05 : 0.95);

    if (hasStar) add("Звезда у соперника", 1.1);
    if (isDerby) add("Дерби", 1.15);

    if (teamPlace <= 3) add("Положение команды", 1.15);
    else if (teamPlace <= 8) add("Положение команды", 1.05);
    else add("Положение команды", 0.95);

    if (opponentPlace <= 3) add("Положение соперника", 1.15);
    else if (opponentPlace <= 8) add("Положение соперника", 1.05);
    else add("Положение соперника", 0.95);

    if (winStreak >= 3) add("Победная серия", 1.1);
    else if (winStreak === 0) add("Нет победной серии", 0.95);

    if (sold > 30) add("Продано более 30%", 1.1);
    if (sold > 50) add("Продано более 50%", 1.15);
    if (sold > 70) add("Продано более 70%", 1.25);
    if (sold > 85) add("Дефицит билетов", 1.2);

    if (days < 7) add("Меньше 7 дней до матча", 1.1);
    if (days < 2) add("Меньше 2 дней до матча", 1.2);

    const finalPrice = Math.round(price);
    const baseRevenue = seat.base * 500;
    const dynamicRevenue = finalPrice * 500;
    const revenueGrowth = dynamicRevenue - baseRevenue;

    return {
      finalPrice,
      growthPercent: Math.round(((finalPrice / seat.base) - 1) * 100),
      baseRevenue,
      dynamicRevenue,
      revenueGrowth,
      factors,
    };
  }, [
    seat,
    matchCategory,
    sold,
    days,
    isWeekend,
    goodTime,
    hasStar,
    isDerby,
    teamPlace,
    opponentPlace,
    winStreak,
  ]);

  return (
    <main style={{ padding: 40, fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1>Dynamic Ticket Pricing</h1>
      <p>Демо-система автоматического изменения цены билета</p>

      <section style={{ background: "white", padding: 24, borderRadius: 20, marginTop: 24 }}>
        <h2>Матч: Спартак vs ЦСКА</h2>

        <h3>Текущая цена: {result.finalPrice.toLocaleString()} ₽</h3>
        <p>Рост к базовой цене: +{result.growthPercent}%</p>
        <p>Прогноз дополнительной выручки: {result.revenueGrowth.toLocaleString()} ₽</p>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
        <div style={{ background: "white", padding: 24, borderRadius: 20 }}>
          <h3>Настройки матча</h3>

          <label>Категория места</label>
          <select
            style={{ width: "100%", padding: 12, margin: "8px 0 16px" }}
            onChange={(e) => setSeat(seatCategories.find(s => s.id === Number(e.target.value))!)}
          >
            {seatCategories.map(s => (
              <option key={s.id} value={s.id}>{s.name} — {s.base} ₽</option>
            ))}
          </select>

          <label>Категория матча</label>
          <select
            style={{ width: "100%", padding: 12, margin: "8px 0 16px" }}
            value={matchCategory}
            onChange={(e) => setMatchCategory(Number(e.target.value))}
          >
            <option value={1}>1 категория</option>
            <option value={2}>2 категория</option>
            <option value={3}>3 категория</option>
          </select>

          <label>Продано билетов: {sold}%</label>
          <input type="range" min="0" max="100" value={sold} onChange={(e) => setSold(Number(e.target.value))} />

          <br /><br />

          <label>Дней до матча: {days}</label>
          <input type="range" min="0" max="60" value={days} onChange={(e) => setDays(Number(e.target.value))} />

          <br /><br />

          <label>Место команды: {teamPlace}</label>
          <input type="range" min="1" max="12" value={teamPlace} onChange={(e) => setTeamPlace(Number(e.target.value))} />

          <br /><br />

          <label>Место соперника: {opponentPlace}</label>
          <input type="range" min="1" max="12" value={opponentPlace} onChange={(e) => setOpponentPlace(Number(e.target.value))} />

          <br /><br />

          <label>Победная серия: {winStreak}</label>
          <input type="range" min="0" max="5" value={winStreak} onChange={(e) => setWinStreak(Number(e.target.value))} />
        </div>

        <div style={{ background: "white", padding: 24, borderRadius: 20 }}>
          <h3>Факторы</h3>

          <p><input type="checkbox" checked={isWeekend} onChange={() => setIsWeekend(!isWeekend)} /> Выходной день</p>
          <p><input type="checkbox" checked={goodTime} onChange={() => setGoodTime(!goodTime)} /> Удобное время матча</p>
          <p><input type="checkbox" checked={hasStar} onChange={() => setHasStar(!hasStar)} /> Есть звезда у соперника</p>
          <p><input type="checkbox" checked={isDerby} onChange={() => setIsDerby(!isDerby)} /> Дерби</p>

          <h3>Применённые коэффициенты</h3>
          {result.factors.map((f, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", padding: "8px 0" }}>
              <span>{f.name}</span>
              <b>x{f.coef}</b>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "white", padding: 24, borderRadius: 20, marginTop: 24 }}>
        <h3>Сравнение выручки</h3>
        <p>Фиксированная цена: {result.baseRevenue.toLocaleString()} ₽</p>
        <p>Динамическая цена: {result.dynamicRevenue.toLocaleString()} ₽</p>
        <p><b>Дополнительная выручка: {result.revenueGrowth.toLocaleString()} ₽</b></p>
      </section>
    </main>
  );
}