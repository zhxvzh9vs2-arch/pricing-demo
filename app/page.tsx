"use client";

import { useMemo, useState } from "react";

const клубыПоЛигам: Record<string, string[]> = {
  КХЛ: [
    "Авангард", "Автомобилист", "Адмирал", "Ак Барс", "Амур", "Барыс",
    "Витязь", "Динамо Москва", "Динамо Минск", "Куньлунь / Шанхайские Драконы",
    "Лада", "Локомотив", "Металлург", "Нефтехимик", "Салават Юлаев",
    "Северсталь", "Сибирь", "СКА", "Спартак", "Торпедо", "Трактор", "ЦСКА"
  ],
  ВХЛ: [
    "АКМ", "Барс", "Буран", "Горняк-УГМК", "Дизель", "Динамо-Алтай",
    "Динамо Санкт-Петербург", "Зауралье", "Звезда", "Ижсталь", "Кристалл",
    "Магнитка", "Металлург Новокузнецк", "Молот", "Нефтяник", "Норильск",
    "Олимпия", "Омские Крылья", "Ростов", "Рубин", "Рязань-ВДВ", "СКА-Нева",
    "Сокол", "Тамбов", "Торос", "Торпедо-Горький", "Химик", "Челмет",
    "Югра"
  ],
  МХЛ: [
    "Авто", "Академия Михайлова", "Академия СКА", "Алмаз", "Амурские Тигры",
    "Белые Медведи", "Динамо-Карелия", "Ирбис", "Капитан", "Красная Армия",
    "Красная Машина-Юниор", "Крылья Советов", "Кузнецкие Медведи", "Ладья",
    "Локо", "Локо-76", "Мамонты Югры", "МХК Динамо Москва", "МХК Динамо СПб",
    "МХК Динамо-Шинник", "МХК Молот", "МХК Спартак", "МХК Спартак МАХ",
    "Омские Ястребы", "Реактор", "Сахалинские Акулы", "СКА-1946",
    "Снежные Барсы", "Спутник", "Стальные Лисы", "Тайфун", "Толпар",
    "Тюменский Легион", "Чайка"
  ],
  НМХЛ: [
    "Арктика", "Буран Москва", "Воевода", "Гранит-Чехов", "Динамо-576",
    "Ленинградец", "Металлург ВО", "МХК Ермак", "МХК Калуга",
    "МХК Кристалл С", "МХК Рязань-ВДВ", "Полет Рыбинск", "Протон",
    "ЭкоНива-Бобров", "Юниор"
  ],
};

type КатегорияЦены = {
  id: number;
  name: string;
  base: number;
};

export default function Home() {
  const [лига, setЛига] = useState("КХЛ");
  const [клуб, setКлуб] = useState(клубыПоЛигам["КХЛ"][0]);

  const [категорииЦен, setКатегорииЦен] = useState<КатегорияЦены[]>([
    { id: 1, name: "VIP", base: 12000 },
    { id: 2, name: "Премиум", base: 5000 },
    { id: 3, name: "Стандарт", base: 2500 },
    { id: 4, name: "Эконом", base: 900 },
  ]);

  const [активнаяКатегорияId, setАктивнаяКатегорияId] = useState(2);
  const [категорияМатча, setКатегорияМатча] = useState(1);
  const [продано, setПродано] = useState(42);
  const [днейДоМатча, setДнейДоМатча] = useState(12);
  const [выходнойДень, setВыходнойДень] = useState(false);
  const [удобноеВремя, setУдобноеВремя] = useState(true);
  const [естьЗвезда, setЕстьЗвезда] = useState(true);
  const [дерби, setДерби] = useState(false);
  const [местоКоманды, setМестоКоманды] = useState(5);
  const [местоСоперника, setМестоСоперника] = useState(4);
  const [победнаяСерия, setПобеднаяСерия] = useState(1);

  const активнаяКатегория =
    категорииЦен.find((item) => item.id === активнаяКатегорияId) ||
    категорииЦен[0];

  const результат = useMemo(() => {
    let цена = активнаяКатегория?.base || 0;
    const коэффициенты: { name: string; coef: number }[] = [];

    const добавить = (name: string, coef: number) => {
      цена *= coef;
      коэффициенты.push({ name, coef });
    };

    if (категорияМатча === 1) добавить("Категория матча: топ", 1.75);
    if (категорияМатча === 2) добавить("Категория матча: средняя", 1.35);
    if (категорияМатча === 3) добавить("Категория матча: базовая", 1);

    добавить("День недели", выходнойДень ? 1.1 : 0.95);
    добавить("Время матча", удобноеВремя ? 1.05 : 0.95);

    if (естьЗвезда) добавить("Звезда в составе", 1.1);
    if (дерби) добавить("Дерби / принципиальный матч", 1.15);

    if (местоКоманды <= 3) добавить("Высокое место клуба", 1.12);
    else if (местоКоманды <= 8) добавить("Среднее место клуба", 1.04);
    else добавить("Низкое место клуба", 0.95);

    if (местоСоперника <= 3) добавить("Сильный соперник", 1.12);
    else if (местоСоперника <= 8) добавить("Средний соперник", 1.04);
    else добавить("Слабый соперник", 0.96);

    if (победнаяСерия >= 3) добавить("Победная серия", 1.1);
    if (победнаяСерия === 0) добавить("Нет победной серии", 0.97);

    if (продано > 30) добавить("Продано более 30%", 1.08);
    if (продано > 50) добавить("Продано более 50%", 1.12);
    if (продано > 70) добавить("Продано более 70%", 1.18);
    if (продано > 85) добавить("Дефицит билетов", 1.22);

    if (днейДоМатча < 7) добавить("Менее 7 дней до матча", 1.08);
    if (днейДоМатча < 2) добавить("Менее 2 дней до матча", 1.15);

    const итоговаяЦена = Math.max(0, Math.round(цена));
    const количествоБилетов = 500;
    const базоваяВыручка = (активнаяКатегория?.base || 0) * количествоБилетов;
    const динамическаяВыручка = итоговаяЦена * количествоБилетов;
    const дополнительнаяВыручка = динамическаяВыручка - базоваяВыручка;

    const график = Array.from({ length: 8 }, (_, i) => {
      const спрос = Math.min(100, 15 + i * 10 + продано / 5);
      const ценаГрафика = Math.round(
        (активнаяКатегория?.base || 0) *
          (1 + спрос / 100) *
          (категорияМатча === 1 ? 1.45 : категорияМатча === 2 ? 1.2 : 1)
      );
      return { спрос, price: ценаГрафика };
    });

    let рекомендация = "Сохранять текущую цену";
    let причина = "Спрос находится в нормальном диапазоне";
    let действие = "Продолжать мониторинг продаж";

    if (продано > 75 && днейДоМатча < 7) {
      рекомендация = "Повысить цену на 12–18%";
      причина = "Высокий спрос, близкая дата матча и риск sold out";
      действие = "Поднять цену в категориях с высоким спросом";
    } else if (продано < 30 && днейДоМатча < 5) {
      рекомендация = "Снизить цену на 8–12%";
      причина = "Низкий спрос при близкой дате матча";
      действие = "Стимулировать продажи в доступных категориях";
    } else if (продано > 50) {
      рекомендация = "Повысить цену на 5–10%";
      причина = "Спрос выше среднего";
      действие = "Постепенно увеличить цену";
    }

    const вероятностьSoldOut = Math.min(
      97,
      Math.max(8, Math.round(продано + (60 - днейДоМатча) * 0.7))
    );

    const confidence = Math.min(96, Math.round(70 + продано * 0.2));

    return {
      итоговаяЦена,
      ростПроцентов:
        активнаяКатегория?.base > 0
          ? Math.round((итоговаяЦена / активнаяКатегория.base - 1) * 100)
          : 0,
      базоваяВыручка,
      динамическаяВыручка,
      дополнительнаяВыручка,
      коэффициенты,
      график,
      рекомендация,
      причина,
      действие,
      вероятностьSoldOut,
      confidence,
    };
  }, [
    активнаяКатегория,
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

  const maxPrice = Math.max(...результат.график.map((g) => g.price), 1);

  const добавитьКатегорию = () => {
    const новыйId = Date.now();
    setКатегорииЦен([
      ...категорииЦен,
      { id: новыйId, name: "Новая категория", base: 1000 },
    ]);
    setАктивнаяКатегорияId(новыйId);
  };

  const удалитьКатегорию = (id: number) => {
    const новыйСписок = категорииЦен.filter((item) => item.id !== id);
    setКатегорииЦен(новыйСписок);
    if (активнаяКатегорияId === id && новыйСписок.length > 0) {
      setАктивнаяКатегорияId(новыйСписок[0].id);
    }
  };

  const обновитьКатегорию = (
    id: number,
    поле: "name" | "base",
    значение: string
  ) => {
    setКатегорииЦен(
      категорииЦен.map((item) =>
        item.id === id
          ? {
              ...item,
              [поле]: поле === "base" ? Number(значение) || 0 : значение,
            }
          : item
      )
    );
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <div style={styles.badge}>AI-платформа для хоккейных клубов</div>
          <h1 style={styles.title}>Универсальная система управления ценами</h1>
          <p style={styles.subtitle}>
            MVP для КХЛ, ВХЛ, МХЛ и НМХЛ: клуб выбирает лигу, настраивает свои
            билетные категории, задаёт базовые цены, а алгоритм рассчитывает
            рекомендованную цену и прогноз выручки.
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
        <Kpi title="Клуб" value={клуб} />
        <Kpi
          title="Динамическая выручка"
          value={`${результат.динамическаяВыручка.toLocaleString()} ₽`}
        />
        <Kpi
          title="Дополнительная выручка"
          value={`${результат.дополнительнаяВыручка.toLocaleString()} ₽`}
          highlight
        />
        <Kpi title="Вероятность sold out" value={`${результат.вероятностьSoldOut}%`} />
      </section>

      <section style={styles.grid}>
        <div style={styles.panel}>
          <h3>Клуб и матч</h3>

          <Label text="Лига" />
          <select
            style={styles.select}
            value={лига}
            onChange={(e) => {
              const новаяЛига = e.target.value;
              setЛига(новаяЛига);
              setКлуб(клубыПоЛигам[новаяЛига][0]);
            }}
          >
            {Object.keys(клубыПоЛигам).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <Label text="Клуб" />
          <select
            style={styles.select}
            value={клуб}
            onChange={(e) => setКлуб(e.target.value)}
          >
            {клубыПоЛигам[лига].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <Label text="Активная ценовая категория" />
          <select
            style={styles.select}
            value={активнаяКатегорияId}
            onChange={(e) => setАктивнаяКатегорияId(Number(e.target.value))}
          >
            {категорииЦен.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} — {item.base.toLocaleString()} ₽
              </option>
            ))}
          </select>

          <Label text="Категория матча" />
          <select
            style={styles.select}
            value={категорияМатча}
            onChange={(e) => setКатегорияМатча(Number(e.target.value))}
          >
            <option value={1}>Топ-матч / высокий спрос</option>
            <option value={2}>Средний спрос</option>
            <option value={3}>Базовый матч / низкий спрос</option>
          </select>

          <Slider label="Продано билетов" value={продано} max={100} suffix="%" setValue={setПродано} />
          <Slider label="Дней до матча" value={днейДоМатча} max={60} setValue={setДнейДоМатча} />
          <Slider label="Место команды" value={местоКоманды} min={1} max={12} setValue={setМестоКоманды} />
          <Slider label="Место соперника" value={местоСоперника} min={1} max={12} setValue={setМестоСоперника} />
          <Slider label="Победная серия" value={победнаяСерия} max={5} setValue={setПобеднаяСерия} />
        </div>

        <div style={styles.panel}>
          <h3>Редактор ценовых категорий</h3>
          <p style={styles.hint}>
            Здесь клуб вручную задаёт любое количество ценовых категорий.
          </p>

          <div style={styles.categoryList}>
            {категорииЦен.map((item) => (
              <div key={item.id} style={styles.categoryRow}>
                <input
                  style={styles.input}
                  value={item.name}
                  onChange={(e) =>
                    обновитьКатегорию(item.id, "name", e.target.value)
                  }
                />
                <input
                  style={styles.inputPrice}
                  type="number"
                  value={item.base}
                  onChange={(e) =>
                    обновитьКатегорию(item.id, "base", e.target.value)
                  }
                />
                <button
                  style={styles.deleteButton}
                  onClick={() => удалитьКатегорию(item.id)}
                  disabled={категорииЦен.length === 1}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>

          <button style={styles.addButton} onClick={добавитьКатегорию}>
            + Добавить категорию
          </button>
        </div>
      </section>

      <section style={styles.grid}>
        <div style={styles.panel}>
          <h3>Прогноз роста цены</h3>

          <div style={styles.chart}>
            {результат.график.map((point, i) => (
              <div key={i} style={styles.barWrap}>
                <div
                  style={{
                    ...styles.bar,
                    height: `${(point.price / maxPrice) * 190}px`,
                  }}
                />
                <span style={styles.barLabel}>
                  {point.price.toLocaleString()} ₽
                </span>
              </div>
            ))}
          </div>

          <p style={styles.hint}>
            График показывает прогноз роста цены при изменении спроса.
          </p>
        </div>

        <div style={styles.panel}>
          <h3>AI Pricing Engine</h3>

          <div style={styles.aiEngine}>
            <InfoRow
              title="Текущий спрос"
              value={продано > 60 ? "Высокий" : продано > 35 ? "Средний" : "Низкий"}
              color={продано > 60 ? "#ef4444" : продано > 35 ? "#f59e0b" : "#22c55e"}
            />
            <InfoRow title="Confidence score" value={`${результат.confidence}%`} />
            <InfoRow title="Прогноз sold out" value={`${результат.вероятностьSoldOut}%`} />
            <InfoRow title="Revenue uplift" value={`${результат.дополнительнаяВыручка.toLocaleString()} ₽`} />

            <div style={styles.aiRecommendation}>
              <span style={styles.cardLabel}>Рекомендация системы</span>
              <h2>{результат.рекомендация}</h2>
              <p><b>Причина:</b> {результат.причина}</p>
              <p><b>Действие:</b> {результат.действие}</p>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.grid}>
        <div style={styles.panel}>
          <h3>Факторы спроса</h3>
          <Check text="Выходной день" checked={выходнойДень} setChecked={setВыходнойДень} />
          <Check text="Удобное время" checked={удобноеВремя} setChecked={setУдобноеВремя} />
          <Check text="Есть звезда у соперника" checked={естьЗвезда} setChecked={setЕстьЗвезда} />
          <Check text="Дерби / принципиальный матч" checked={дерби} setChecked={setДерби} />
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

function Kpi({ title, value, highlight = false }: any) {
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

function Label({ text }: any) {
  return <p style={styles.label}>{text}</p>;
}

function Slider({ label, value, setValue, min = 0, max, suffix = "" }: any) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={styles.sliderTop}>
        <span>{label}</span>
        <b>{value}{suffix}</b>
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
      <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} /> {text}
    </label>
  );
}

function InfoRow({ title, value, color = "#fff" }: any) {
  return (
    <div style={styles.aiRow}>
      <span>{title}</span>
      <b style={{ color }}>{value}</b>
    </div>
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
    fontSize: 54,
    lineHeight: 1,
    margin: 0,
    letterSpacing: "-2px",
  },
  subtitle: {
    maxWidth: 760,
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
    fontSize: 22,
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
  categoryList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 18,
  },
  categoryRow: {
    display: "grid",
    gridTemplateColumns: "1fr 130px 90px",
    gap: 10,
    alignItems: "center",
  },
  input: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#101623",
    color: "#fff",
  },
  inputPrice: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#101623",
    color: "#fff",
  },
  addButton: {
    marginTop: 18,
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #27e6a1, #3b82f6)",
    color: "#061016",
    fontWeight: 800,
    cursor: "pointer",
  },
  deleteButton: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(239,68,68,0.15)",
    color: "#fff",
    cursor: "pointer",
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
  aiEngine: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  aiRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "18px 20px",
    borderRadius: 18,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#dce3ef",
  },
  aiRecommendation: {
    marginTop: 10,
    padding: 24,
    borderRadius: 24,
    background: "linear-gradient(135deg, rgba(39,230,161,0.14), rgba(59,130,246,0.14))",
    border: "1px solid rgba(39,230,161,0.25)",
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