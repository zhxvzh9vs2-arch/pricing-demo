"use client";

import { useMemo, useState } from "react";

const категорииМест = [
  { id: 1, name: "Премиум центр", base: 3000 },
  { id: 6, name: "Стандарт", base: 1000 },
  { id: 14, name: "Эконом", base: 450 },
];

export default function Home() {
  const [категорияМестаId, setКатегорияМестаId] = useState(1);
  const [категорияМатча, setКатегорияМатча] = useState(1);
  const [продано, setПродано] = useState(35);
  const [днейДоМатча, setДнейДоМатча] = useState(10);
  const [выходнойДень, setВыходнойДень] = useState(false);
  const [удобноеВремя, setУдобноеВремя] = useState(true);
  const [естьЗвезда, setЕстьЗвезда] = useState(true);
  const [дерби, setДерби] = useState(true);
  const [местоКоманды, setМестоКоманды] = useState(5);
  const [местоСоперника, setМестоСоперника] = useState(3);
  const [победнаяСерия, setПобеднаяСерия] = useState(1);

  const категорияМеста =
    категорииМест.find((s) => s.id === категорияМестаId) || категорииМест[0];

  const результат = useMemo(() => {
    let цена = категорияМеста.base;
    const коэффициенты: { name: string; coef: number }[] = [];

    const добавить = (name: string, coef: number) => {
      цена *= coef;
      коэффициенты.push({ name, coef });
    };

    if (категорияМатча === 1) добавить("Категория матча", 2);
    if (категорияМатча === 2) добавить("Категория матча", 1.5);
    if (категорияМатча === 3) добавить("Категория матча", 1);

    добавить("День недели", выходнойДень ? 1.1 : 0.9);
    добавить("Время матча", удобноеВремя ? 1.05 : 0.95);

    if (естьЗвезда) добавить("Звезда у соперника", 1.1);
    if (дерби) добавить("Дерби", 1.15);

    if (местоКоманды <= 3) добавить("Положение команды", 1.15);
    else if (местоКоманды <= 8) добавить("Положение команды", 1.05);
    else добавить("Положение команды", 0.95);

    if (местоСоперника <= 3) добавить("Положение соперника", 1.15);
    else if (местоСоперника <= 8) добавить("Положение соперника", 1.05);
    else добавить("Положение соперника", 0.95);

    if (победнаяСерия >= 3) добавить("Победная серия", 1.1);
    else if (победнаяСерия === 0) добавить("Нет победной серии", 0.95);

    if (продано > 30) добавить("Продано более 30%", 1.1);
    if (продано > 50) добавить("Продано более 50%", 1.15);
    if (продано > 70) добавить("Продано более 70%", 1.25);
    if (продано > 85) добавить("Дефицит билетов", 1.2);

    if (днейДоМатча < 7) добавить("Менее 7 дней до матча", 1.1);
    if (днейДоМатча < 2) добавить("Менее 2 дней до матча", 1.2);

    const итоговаяЦена = Math.round(цена);
    const количествоБилетов = 500;
    const выручкаФикс = категорияМеста.base * количествоБилетов;
    const выручкаДинамическая = итоговаяЦена * количествоБилетов;
    const дополнительнаяВыручка = выручкаДинамическая - выручкаФикс;

    const график = Array.from({ length: 8 }, (_, i) => {
      const спрос = Math.min(100, 10 + i * 12 + продано / 5);
      const ценаГрафика = Math.round(
        категорияМеста.base *
          (1 + спрос / 100) *
          (категорияМатча === 1 ? 1.6 : категорияМатча === 2 ? 1.25 : 1)
      );

      return { спрос, price: ценаГрафика };
    });

    let рекомендация = "Сохранять текущую цену";
    let причина = "Спрос находится в нормальном диапазоне";
    let действие = "Наблюдать за продажами";

    if (продано > 75 && днейДоМатча < 7) {
      рекомендация = "Повысить цену на 12–18%";
      причина = "Высокий спрос, дефицит мест и близкая дата матча";
      действие = "Поднять цену в премиальных секторах";
    } else if (продано < 30 && днейДоМатча < 5) {
      рекомендация = "Снизить цену на 8–12%";
      причина = "Низкий спрос при близкой дате матча";
      действие = "Стимулировать продажи в эконом-секторах";
    } else if (продано > 50) {
      рекомендация = "Повысить цену на 5–10%";
      причина = "Спрос выше среднего";
      действие = "Постепенно увеличить цену";
    }

    return {
      итоговаяЦена,
      ростПроцентов: Math.round((итоговаяЦена / категорияМеста.base - 1) * 100),
      выручкаФикс,
      выручкаДинамическая,
      дополнительнаяВыручка,
      коэффициенты,
      график,
      рекомендация,
      причина,
      действие,
    };
  }, [
    категорияМеста,
    категорияМатча,
    продано,
    днейДоМатча,
    выходнойДень,
    удобноеВремя,
    естьЗвезда,
    дерби,
    местоКоманды,
    местоСоперника,
    победнаяСерия,
  ]);

  const максимальнаяЦенаГрафика = Math.max(
    ...результат.график.map((p) => p.price)
  );

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <div style={styles.badge}>Алгоритм динамического ценообразования</div>
          <h1 style={styles.title}>Платформа управления ценами</h1>
          <p style={styles.subtitle}>
            Система автоматически рассчитывает стоимость билета на основе спроса,
            времени до матча, категории события, соперника и спортивных факторов.
          </p>
        </div>

        <div style={styles.priceCard}>
          <span style={styles.cardLabel}>Рекомендованная цена</span>
          <h2 style={styles.price}>
            {результат.итоговаяЦена.toLocaleString()} ₽
          </h2>
          <p style={styles.green}>
            +{результат.ростПроцентов}% к базовой цене
          </p>
        </div>
      </section>

      <section style={styles.kpiGrid}>
        <Kpi
          title="Базовая выручка"
          value={`${результат.выручкаФикс.toLocaleString()} ₽`}
        />
        <Kpi
          title="Динамическая выручка"
          value={`${результат.выручкаДинамическая.toLocaleString()} ₽`}
        />
        <Kpi
          title="Дополнительная выручка"
          value={`${результат.дополнительнаяВыручка.toLocaleString()} ₽`}
          highlight
        />
        <Kpi title="Продано билетов" value={`${продано}%`} />
      </section>

      <section style={styles.grid}>
        <div style={styles.panel}>
          <h3>Настройки матча</h3>

          <Label text="Категория места" />
          <select
            style={styles.select}
            value={категорияМестаId}
            onChange={(e) => setКатегорияМестаId(Number(e.target.value))}
          >
            {категорииМест.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.base} ₽
              </option>
            ))}
          </select>

          <Label text="Категория матча" />
          <select
            style={styles.select}
            value={категорияМатча}
            onChange={(e) => setКатегорияМатча(Number(e.target.value))}
          >
            <option value={1}>1 категория — высокий спрос</option>
            <option value={2}>2 категория — средний спрос</option>
            <option value={3}>3 категория — низкий спрос</option>
          </select>

          <Slider
            label="Продано билетов"
            value={продано}
            max={100}
            setValue={setПродано}
            suffix="%"
          />
          <Slider
            label="Дней до матча"
            value={днейДоМатча}
            max={60}
            setValue={setДнейДоМатча}
          />
          <Slider
            label="Место команды"
            value={местоКоманды}
            min={1}
            max={12}
            setValue={setМестоКоманды}
          />
          <Slider
            label="Место соперника"
            value={местоСоперника}
            min={1}
            max={12}
            setValue={setМестоСоперника}
          />
          <Slider
            label="Победная серия"
            value={победнаяСерия}
            max={5}
            setValue={setПобеднаяСерия}
          />
        </div>

        <div style={styles.panel}>
          <h3>Прогноз цены</h3>

          <div style={styles.chart}>
            {результат.график.map((point, i) => (
              <div key={i} style={styles.barWrap}>
                <div
                  style={{
                    ...styles.bar,
                    height: `${(point.price / максимальнаяЦенаГрафика) * 190}px`,
                  }}
                />
                <span style={styles.barLabel}>
                  {point.price.toLocaleString()} ₽
                </span>
              </div>
            ))}
          </div>

          <p style={styles.hint}>
            График показывает рост рекомендованной цены при увеличении спроса.
          </p>
        </div>
      </section>

      <section style={styles.grid}>
        <div style={styles.panel}>
          <h3>Heatmap арены «Мегаспорт»</h3>

          <div style={styles.megasportMap}>
            <div style={styles.mapRow}>
              {["A21", "A22", "A23", "A24"].map((s, i) => (
                <Sector
                  key={s}
                  name={s}
                  demand={[45, 52, 61, 48][i]}
                  base={[1200, 1400, 1400, 1200][i]}
                />
              ))}
            </div>

            <div style={styles.mapRow}>
              {["A1", "A2", "A0", "A3", "A4"].map((s, i) => (
                <Sector
                  key={s}
                  name={s}
                  demand={[72, 83, 94, 86, 74][i]}
                  base={[3000, 4500, 8000, 4500, 3000][i]}
                />
              ))}
            </div>

            <div style={styles.middleArena}>
              <div style={styles.sideColumn}>
                {["D21", "D22", "D23", "D24"].map((s, i) => (
                  <Sector
                    key={s}
                    name={s}
                    demand={[28, 34, 39, 31][i]}
                    base={[900, 1000, 1000, 900][i]}
                  />
                ))}
              </div>

              <div style={styles.sideColumn}>
                {["D1", "D2", "D3", "D4"].map((s, i) => (
                  <Sector
                    key={s}
                    name={s}
                    demand={[46, 57, 62, 51][i]}
                    base={[1200, 1500, 1500, 1200][i]}
                  />
                ))}
              </div>

              <div style={styles.iceRink}>
                <span>МЕГАСПОРТ</span>
                <small>хоккейная конфигурация</small>
              </div>

              <div style={styles.sideColumn}>
                {["B1", "B2", "B3", "B4"].map((s, i) => (
                  <Sector
                    key={s}
                    name={s}
                    demand={[68, 76, 73, 64][i]}
                    base={[2000, 2500, 2500, 2000][i]}
                  />
                ))}
              </div>

              <div style={styles.sideColumn}>
                {["B21", "B22", "B23", "B24"].map((s, i) => (
                  <Sector
                    key={s}
                    name={s}
                    demand={[38, 44, 49, 41][i]}
                    base={[1000, 1200, 1200, 1000][i]}
                  />
                ))}
              </div>
            </div>

            <div style={styles.mapRow}>
              {["C1", "C2", "C0", "C3", "C4"].map((s, i) => (
                <Sector
                  key={s}
                  name={s}
                  demand={[71, 82, 91, 84, 70][i]}
                  base={[3000, 4500, 8000, 4500, 3000][i]}
                />
              ))}
            </div>

            <div style={styles.mapRow}>
              {["C21", "C22", "C23", "C24"].map((s, i) => (
                <Sector
                  key={s}
                  name={s}
                  demand={[42, 55, 58, 44][i]}
                  base={[1200, 1400, 1400, 1200][i]}
                />
              ))}
            </div>

            <div style={styles.vipRow}>
              {["VIP A", "VIP B", "VIP C"].map((s, i) => (
                <Sector
                  key={s}
                  name={s}
                  demand={[88, 79, 86][i]}
                  base={[12000, 10000, 12000][i]}
                />
              ))}
            </div>
          </div>

          <p style={styles.hint}>
            Цвет показывает уровень спроса по сектору: красный — высокий спрос,
            синий — низкий.
          </p>
        </div>

        <div style={styles.panel}>
          <h3>AI-рекомендация</h3>

          <div style={styles.aiBox}>
            <span style={styles.cardLabel}>Рекомендация системы</span>
            <h2 style={styles.aiTitle}>{результат.рекомендация}</h2>

            <p>
              <b>Причина:</b> {результат.причина}
            </p>

            <p>
              <b>Действие:</b> {результат.действие}
            </p>

            <p style={styles.green}>
              Потенциальный эффект:{" "}
              {Math.max(
                0,
                Math.round(результат.дополнительнаяВыручка * 0.18)
              ).toLocaleString()} ₽
            </p>
          </div>
        </div>
      </section>

      <section style={styles.grid}>
        <div style={styles.panel}>
          <h3>Факторы спроса</h3>

          <Check
            text="Выходной день"
            checked={выходнойДень}
            setChecked={setВыходнойДень}
          />
          <Check
            text="Удобное время матча"
            checked={удобноеВремя}
            setChecked={setУдобноеВремя}
          />
          <Check
            text="Есть звезда у соперника"
            checked={естьЗвезда}
            setChecked={setЕстьЗвезда}
          />
          <Check text="Дерби" checked={дерби} setChecked={setДерби} />
        </div>

        <div style={styles.panel}>
          <h3>Применённые коэффициенты</h3>

          {результат.коэффициенты.map((f, i) => (
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

function Sector({
  name,
  demand,
  base,
}: {
  name: string;
  demand: number;
  base: number;
}) {
  const color =
    demand > 80
      ? "#ef4444"
      : demand > 60
      ? "#f59e0b"
      : demand > 40
      ? "#22c55e"
      : "#3b82f6";

  const price = Math.round(base * (1 + demand / 100));

  return (
    <div
      style={{
        ...styles.megasportSector,
        background: color,
        boxShadow: `0 0 22px ${color}66`,
      }}
    >
      <b>{name}</b>
      <span>{demand}%</span>
      <small>{price.toLocaleString()} ₽</small>
    </div>
  );
}

function Kpi({
  title,
  value,
  highlight = false,
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        ...styles.kpi,
        borderColor: highlight ? "#27e6a1" : "rgba(255,255,255,0.08)",
      }}
    >
      <span style={styles.cardLabel}>{title}</span>
      <strong style={styles.kpiValue}>{value}</strong>
    </div>
  );
}

function Label({ text }: { text: string }) {
  return <p style={styles.label}>{text}</p>;
}

function Slider({
  label,
  value,
  setValue,
  min = 0,
  max,
  suffix = "",
}: any) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={styles.sliderTop}>
        <span>{label}</span>
        <b>
          {value}
          {suffix}
        </b>
      </div>
      <input
        style={styles.range}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    </div>
  );
}

function Check({ text, checked, setChecked }: any) {
  return (
    <label style={styles.check}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />{" "}
      {text}
    </label>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #1f2a44, #080b12 45%, #05060a)",
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
  megasportMap: {
    marginTop: 20,
    padding: 20,
    borderRadius: 28,
    background:
      "radial-gradient(circle at center, rgba(255,255,255,0.09), rgba(255,255,255,0.025))",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  mapRow: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
  },
  middleArena: {
    display: "grid",
    gridTemplateColumns: "72px 72px 1fr 72px 72px",
    gap: 8,
    alignItems: "center",
    margin: "8px 0",
  },
  sideColumn: {
    display: "grid",
    gap: 8,
  },
  iceRink: {
    minHeight: 260,
    borderRadius: 120,
    border: "2px solid rgba(255,255,255,0.35)",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 900,
    letterSpacing: "1px",
  },
  megasportSector: {
    width: 66,
    height: 58,
    borderRadius: 12,
    padding: 7,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    color: "#fff",
    fontWeight: 800,
    fontSize: 11,
  },
  vipRow: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  aiBox: {
    marginTop: 18,
    padding: 24,
    borderRadius: 24,
    background:
      "linear-gradient(135deg, rgba(39,230,161,0.12), rgba(59,130,246,0.12))",
    border: "1px solid rgba(39,230,161,0.25)",
  },
  aiTitle: {
    fontSize: 34,
    margin: "12px 0",
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