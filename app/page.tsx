"use client";

import { useMemo, useState } from "react";

type Клуб = {
  name: string;
  arena: string;
  capacity: number;
};

type КатегорияЦены = {
  id: number;
  name: string;
  base: number;
};

const клубыПоЛигам: Record<string, Клуб[]> = {
  КХЛ: [
    { name: "Авангард", arena: "G-Drive Арена", capacity: 12011 },
    { name: "Автомобилист", arena: "УГМК Арена", capacity: 12000 },
    { name: "Адмирал", arena: "Фетисов Арена", capacity: 7500 },
    { name: "Ак Барс", arena: "Татнефть Арена", capacity: 8890 },
    { name: "Амур", arena: "Платинум Арена", capacity: 7100 },
    { name: "Барыс", arena: "Барыс Арена", capacity: 11578 },
    { name: "Динамо Москва", arena: "ВТБ Арена", capacity: 11478 },
    { name: "Динамо Минск", arena: "Минск-Арена", capacity: 15086 },
    { name: "Шанхайские Драконы", arena: "СКА Арена", capacity: 22500 },
    { name: "Лада", arena: "Лада-Арена", capacity: 6000 },
    { name: "Локомотив", arena: "Арена 2000", capacity: 9070 },
    { name: "Металлург", arena: "Арена Металлург", capacity: 7704 },
    { name: "Нефтехимик", arena: "Нефтехим Арена", capacity: 5500 },
    { name: "Салават Юлаев", arena: "Уфа-Арена", capacity: 8070 },
    { name: "Северсталь", arena: "Ледовый дворец Череповец", capacity: 6064 },
    { name: "Сибирь", arena: "Сибирь-Арена", capacity: 10500 },
    { name: "СКА", arena: "Ледовый дворец Санкт-Петербург", capacity: 12300 },
    { name: "Спартак", arena: "Мегаспорт", capacity: 11748 },
    { name: "Торпедо", arena: "КРК Нагорный", capacity: 5500 },
    { name: "Трактор", arena: "Арена Трактор", capacity: 7500 },
    { name: "ЦСКА", arena: "ЦСКА Арена", capacity: 12100 },
  ],

  ВХЛ: [
    { name: "АКМ", arena: "Ледовый дворец Тулы", capacity: 3000 },
    { name: "Барс", arena: "Дворец спорта", capacity: 3500 },
    { name: "Буран", arena: "ДС Юбилейный", capacity: 3040 },
    { name: "Горняк-УГМК", arena: "Ледовая арена им. Козицына", capacity: 1500 },
    { name: "Дизель", arena: "Дизель-Арена", capacity: 5500 },
    { name: "Динамо-Алтай", arena: "Титов Арена", capacity: 4500 },
    { name: "Динамо Санкт-Петербург", arena: "СК Юбилейный", capacity: 7000 },
    { name: "Зауралье", arena: "Ледовый дворец им. Парышева", capacity: 2500 },
    { name: "Звезда", arena: "ЦСКА Арена", capacity: 12100 },
    { name: "Ижсталь", arena: "Ледовый дворец Ижсталь", capacity: 3900 },
    { name: "Кристалл", arena: "ДС Кристалл", capacity: 5000 },
    { name: "Магнитка", arena: "Арена Металлург", capacity: 7704 },
    { name: "Металлург Новокузнецк", arena: "Арена Кузнецких Металлургов", capacity: 7533 },
    { name: "Молот", arena: "УДС Молот", capacity: 7000 },
    { name: "Нефтяник", arena: "ДС Юбилейный Альметьевск", capacity: 2200 },
    { name: "Норильск", arena: "Арена Норильск", capacity: 2000 },
    { name: "Олимпия", arena: "ДС Олимпия", capacity: 2500 },
    { name: "Омские Крылья", arena: "G-Drive Арена", capacity: 12011 },
    { name: "Ростов", arena: "Дворец спорта Ростов-на-Дону", capacity: 4000 },
    { name: "Рубин", arena: "Дворец спорта Тюмень", capacity: 3346 },
    { name: "Рязань-ВДВ", arena: "ДС Олимпийский", capacity: 2700 },
    { name: "СКА-Нева", arena: "СК Юбилейный", capacity: 7000 },
    { name: "Сокол", arena: "Платинум Арена Красноярск", capacity: 7000 },
    { name: "Тамбов", arena: "ЛДС Кристалл Тамбов", capacity: 3500 },
    { name: "Торос", arena: "Ледовый дворец Нефтекамск", capacity: 2000 },
    { name: "Торпедо-Горький", arena: "КРК Нагорный", capacity: 5500 },
    { name: "Химик", arena: "ЛДС Подмосковье", capacity: 4500 },
    { name: "Челмет", arena: "ДС Юность", capacity: 3650 },
    { name: "Югра", arena: "Арена Югра", capacity: 5500 },
  ],

  МХЛ: [
    { name: "Авто", arena: "КРК Уралец / УГМК Арена", capacity: 5000 },
    { name: "Академия Михайлова", arena: "Ледовый дворец Тулы", capacity: 3000 },
    { name: "Академия СКА", arena: "Хоккейный город", capacity: 1500 },
    { name: "Алмаз", arena: "Ледовый дворец Череповец", capacity: 6064 },
    { name: "Амурские Тигры", arena: "Платинум Арена", capacity: 7100 },
    { name: "Белые Медведи", arena: "ДС Юность", capacity: 3650 },
    { name: "Динамо-Карелия", arena: "Луми", capacity: 1450 },
    { name: "Ирбис", arena: "Татнефть Арена", capacity: 8890 },
    { name: "Капитан", arena: "ЛД Витязь", capacity: 5500 },
    { name: "Красная Армия", arena: "ЦСКА Арена", capacity: 12100 },
    { name: "Красная Машина-Юниор", arena: "Красная Машина Арена", capacity: 1000 },
    { name: "Крылья Советов", arena: "Арена Крылья Советов", capacity: 5500 },
    { name: "Кузнецкие Медведи", arena: "Арена Кузнецких Металлургов", capacity: 7533 },
    { name: "Ладья", arena: "Лада-Арена", capacity: 6000 },
    { name: "Локо", arena: "Арена 2000", capacity: 9070 },
    { name: "Локо-76", arena: "Арена 2000", capacity: 9070 },
    { name: "Мамонты Югры", arena: "Арена Югра", capacity: 5500 },
    { name: "МХК Динамо Москва", arena: "ВТБ Арена", capacity: 11478 },
    { name: "МХК Динамо СПб", arena: "СК Юбилейный", capacity: 7000 },
    { name: "МХК Динамо-Шинник", arena: "Бобруйск-Арена", capacity: 7000 },
    { name: "МХК Молот", arena: "УДС Молот", capacity: 7000 },
    { name: "МХК Спартак", arena: "Мегаспорт / МСА", capacity: 11748 },
    { name: "Омские Ястребы", arena: "G-Drive Арена", capacity: 12011 },
    { name: "Реактор", arena: "Нефтехим Арена", capacity: 5500 },
    { name: "Сахалинские Акулы", arena: "Арена Сити", capacity: 1500 },
    { name: "СКА-1946", arena: "СК Юбилейный", capacity: 7000 },
    { name: "Снежные Барсы", arena: "Барыс Арена", capacity: 11578 },
    { name: "Спутник", arena: "Ледовый дворец Нижний Тагил", capacity: 4200 },
    { name: "Стальные Лисы", arena: "Арена Металлург", capacity: 7704 },
    { name: "Тайфун", arena: "Фетисов Арена", capacity: 7500 },
    { name: "Толпар", arena: "Уфа-Арена", capacity: 8070 },
    { name: "Тюменский Легион", arena: "Дворец спорта Тюмень", capacity: 3346 },
    { name: "Чайка", arena: "КРК Нагорный", capacity: 5500 },
  ],

  НМХЛ: [
    { name: "Арктика", arena: "Ледовый дворец Арктика", capacity: 1000 },
    { name: "Буран Москва", arena: "Арена Морозово", capacity: 500 },
    { name: "Воевода", arena: "Ледовый дворец", capacity: 1000 },
    { name: "Гранит-Чехов", arena: "ЛХЦ Витязь", capacity: 3300 },
    { name: "Динамо-576", arena: "СК Юбилейный", capacity: 7000 },
    { name: "Ленинградец", arena: "Ледовая арена", capacity: 1000 },
    { name: "Металлург ВО", arena: "Ледовая арена", capacity: 1000 },
    { name: "МХК Ермак", arena: "Ермак", capacity: 6900 },
    { name: "МХК Калуга", arena: "ДС Центральный", capacity: 2000 },
    { name: "МХК Кристалл С", arena: "ДС Кристалл", capacity: 5000 },
    { name: "МХК Рязань-ВДВ", arena: "ДС Олимпийский", capacity: 2700 },
    { name: "Полет Рыбинск", arena: "ДС Полет", capacity: 2000 },
    { name: "Протон", arena: "Ледовый дворец", capacity: 1500 },
    { name: "ЭкоНива-Бобров", arena: "Ледовый дворец им. Фетисова", capacity: 2000 },
    { name: "Юниор", arena: "Ледовый дворец", capacity: 1000 },
  ],
};

export default function Home() {
  const [лига, setЛига] = useState("КХЛ");
  const [клуб, setКлуб] = useState(клубыПоЛигам["КХЛ"][0].name);

  const выбранныйКлуб =
    клубыПоЛигам[лига].find((item) => item.name === клуб) ||
    клубыПоЛигам[лига][0];

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

    if (лига === "КХЛ" && естьЗвезда) добавить("Звезда в составе", 1.1);
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
    лига,
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

  const проданоБилетовВсего = Math.round(
    выбранныйКлуб.capacity * (продано / 100)
  );

  const категорииСПродажами = категорииЦен.map((item, index) => {
    const доля =
      index === 0
        ? 0.08
        : index === 1
        ? 0.22
        : index === 2
        ? 0.45
        : 0.25 / Math.max(1, категорииЦен.length - 3);

    const местВКатегории = Math.round(выбранныйКлуб.capacity * доля);
    const проданоВКатегории = Math.round(местВКатегории * (продано / 100));

    const динамическаяЦена =
      item.id === активнаяКатегорияId
        ? результат.итоговаяЦена
        : Math.round(item.base * (1 + результат.ростПроцентов / 100));

    return {
      ...item,
      местВКатегории,
      проданоВКатегории,
      динамическаяЦена,
      базоваяВыручка: проданоВКатегории * item.base,
      динамическаяВыручка: проданоВКатегории * динамическаяЦена,
    };
  });

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
          <h1 style={styles.title}>Универсальная система управления ценами</h1>
          <p style={styles.subtitle}>
            Клуб выбирает лигу, настраивает свои билетные категории, задаёт базовые
цены, а алгоритм рассчитывает рекомендованную цену и прогноз выручки.
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
        <Kpi title="Арена" value={выбранныйКлуб.arena} />
        <Kpi
          title="Динамическая выручка"
          value={`${результат.динамическаяВыручка.toLocaleString()} ₽`}
        />
        <Kpi
          title="Продано билетов"
          value={`${проданоБилетовВсего.toLocaleString()} из ${выбранныйКлуб.capacity.toLocaleString()}`}
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
              setКлуб(клубыПоЛигам[новаяЛига][0].name);
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
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <div style={styles.arenaInfo}>
            <span>Домашняя арена</span>
            <b>{выбранныйКлуб.arena}</b>
            <small>Вместимость: {выбранныйКлуб.capacity.toLocaleString()} мест</small>
          </div>

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

          <div style={{ marginTop: 28 }}>
            <h3>Продажи по категориям</h3>

            <div style={styles.salesTable}>
              {категорииСПродажами.map((item) => (
                <div key={item.id} style={styles.salesRow}>
                  <b>{item.name}</b>
                  <span>
                    {item.проданоВКатегории.toLocaleString()} /{" "}
                    {item.местВКатегории.toLocaleString()} билетов
                  </span>
                  <span>База: {item.base.toLocaleString()} ₽</span>
                  <span>ДЦО: {item.динамическаяЦена.toLocaleString()} ₽</span>
                  <strong>{item.динамическаяВыручка.toLocaleString()} ₽</strong>
                </div>
              ))}
            </div>
          </div>
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
              color="#ffffff"
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

          {лига === "КХЛ" && (
            <Check
              text="Есть звезда у соперника"
              checked={естьЗвезда}
              setChecked={setЕстьЗвезда}
            />
          )}

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
        borderColor: highlight ? "#ffffff" : "#2a2a2a",
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

function InfoRow({ title, value, color = "#ffffff" }: any) {
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
    background: "#050505",
    color: "#ffffff",
    padding: 36,
    fontFamily: "Inter, Arial, sans-serif",
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 54,
    lineHeight: 1,
    margin: 0,
    letterSpacing: "-2px",
    color: "#ffffff",
  },
  subtitle: {
    maxWidth: 760,
    color: "#bdbdbd",
    fontSize: 18,
    lineHeight: 1.5,
  },
  priceCard: {
    background: "#111111",
    border: "1px solid #2a2a2a",
    borderRadius: 28,
    padding: 28,
  },
  cardLabel: {
    color: "#9b9b9b",
    fontSize: 14,
  },
  price: {
    fontSize: 52,
    margin: "14px 0 6px",
    color: "#ffffff",
  },
  green: {
    color: "#ffffff",
    margin: 0,
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    marginBottom: 24,
  },
  kpi: {
    background: "#111111",
    border: "1px solid #2a2a2a",
    borderRadius: 22,
    padding: 22,
  },
  kpiValue: {
    display: "block",
    fontSize: 22,
    marginTop: 10,
    color: "#ffffff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
    marginBottom: 24,
  },
  panel: {
    background: "#111111",
    border: "1px solid #2a2a2a",
    borderRadius: 28,
    padding: 24,
  },
  label: {
    color: "#bdbdbd",
    marginBottom: 8,
  },
  select: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "1px solid #333333",
    background: "#050505",
    color: "#ffffff",
    marginBottom: 16,
  },
  arenaInfo: {
    marginTop: 4,
    marginBottom: 18,
    padding: 18,
    borderRadius: 18,
    background: "#0a0a0a",
    border: "1px solid #2a2a2a",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    color: "#dddddd",
  },
  sliderTop: {
    display: "flex",
    justifyContent: "space-between",
    color: "#dddddd",
  },
  range: {
    width: "100%",
    accentColor: "#ffffff",
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
    border: "1px solid #333333",
    background: "#050505",
    color: "#ffffff",
  },
  inputPrice: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid #333333",
    background: "#050505",
    color: "#ffffff",
  },
  addButton: {
    marginTop: 18,
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "1px solid #ffffff",
    background: "#ffffff",
    color: "#000000",
    fontWeight: 800,
    cursor: "pointer",
  },
  deleteButton: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid #444444",
    background: "#0a0a0a",
    color: "#ffffff",
    cursor: "pointer",
  },
  salesTable: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 14,
  },
  salesRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr 1fr 1fr 1.2fr",
    gap: 10,
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    background: "#0a0a0a",
    border: "1px solid #2a2a2a",
    color: "#dddddd",
    fontSize: 13,
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
    background: "#ffffff",
  },
  barLabel: {
    marginTop: 8,
    color: "#9b9b9b",
    fontSize: 12,
  },
  hint: {
    color: "#9b9b9b",
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
    background: "#0a0a0a",
    border: "1px solid #2a2a2a",
    color: "#dddddd",
  },
  aiRecommendation: {
    marginTop: 10,
    padding: 24,
    borderRadius: 24,
    background: "#0a0a0a",
    border: "1px solid #ffffff",
  },
  check: {
    display: "block",
    marginBottom: 14,
    color: "#dddddd",
  },
  factor: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #2a2a2a",
    color: "#dddddd",
  },
};