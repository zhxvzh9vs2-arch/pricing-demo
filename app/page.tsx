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
  seasonTicketPrice: number;
  minPriceManual: number;
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
    { name: "СКА-1946", arena: "СК Юбилейный", capacity: 7000 },
    { name: "Красная Армия", arena: "ЦСКА Арена", capacity: 12100 },
    { name: "МХК Спартак", arena: "Мегаспорт / МСА", capacity: 11748 },
    { name: "Омские Ястребы", arena: "G-Drive Арена", capacity: 12011 },
    { name: "Локо", arena: "Арена 2000", capacity: 9070 },
    { name: "Чайка", arena: "КРК Нагорный", capacity: 5500 },
  ],
  НМХЛ: [
    { name: "Арктика", arena: "Ледовый дворец Арктика", capacity: 1000 },
    { name: "Буран Москва", arena: "Арена Морозово", capacity: 500 },
    { name: "Юниор", arena: "Ледовый дворец", capacity: 1000 },
    { name: "МХК Рязань-ВДВ", arena: "ДС Олимпийский", capacity: 2700 },
  ],
};

export default function Home() {
  const [лига, setЛига] = useState("КХЛ");
  const [клуб, setКлуб] = useState(клубыПоЛигам["КХЛ"][0].name);

  const выбранныйКлуб =
    клубыПоЛигам[лига].find((item) => item.name === клуб) ||
    клубыПоЛигам[лига][0];

  const [этапПродаж, setЭтапПродаж] = useState("В течение сезона");
  const [раундПлейофф, setРаундПлейофф] = useState("Первый раунд");
  const [счетВСерии, setСчетВСерии] = useState("Равный счёт");
  const [решающаяИгра, setРешающаяИгра] = useState(false);
  const [топ10БомбардирСоперника, setТоп10БомбардирСоперника] = useState(false);
  const [борьбаЗаПлейофф, setБорьбаЗаПлейофф] = useState(false);

  const [матчейВДомашнемСезоне, setМатчейВДомашнемСезоне] = useState(30);

  const [категорииЦен, setКатегорииЦен] = useState<КатегорияЦены[]>([
    {
      id: 1,
      name: "VIP",
      base: 12000,
      seasonTicketPrice: 240000,
      minPriceManual: 8000,
    },
    {
      id: 2,
      name: "Премиум",
      base: 5000,
      seasonTicketPrice: 120000,
      minPriceManual: 4000,
    },
    {
      id: 3,
      name: "Стандарт",
      base: 2500,
      seasonTicketPrice: 60000,
      minPriceManual: 2000,
    },
    {
      id: 4,
      name: "Эконом",
      base: 900,
      seasonTicketPrice: 24000,
      minPriceManual: 800,
    },
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

  const минимальнаяЦенаАктивнойКатегории = Math.max(
    Math.round(
      активнаяКатегория.seasonTicketPrice /
        Math.max(1, матчейВДомашнемСезоне)
    ),
    активнаяКатегория.minPriceManual
  );

  const результат = useMemo(() => {
    let цена = активнаяКатегория.base;
    const коэффициенты: { name: string; coef: number }[] = [];

    const добавить = (name: string, coef: number) => {
      цена *= coef;
      коэффициенты.push({ name, coef });
    };

    добавить("Этап продаж", этапПродаж === "Плей-офф" ? 1.15 : этапПродаж === "До начала сезона" ? 0.98 : 1);

    if (категорияМатча === 1) добавить("Категория матча: топ", 1.75);
    if (категорияМатча === 2) добавить("Категория матча: средняя", 1.35);
    if (категорияМатча === 3) добавить("Категория матча: базовая", 1);

    if (этапПродаж === "До начала сезона") {
      добавить("День недели", выходнойДень ? 1.1 : 0.9);
      добавить("Время матча", удобноеВремя ? 1 : 0.9);

      if (лига === "КХЛ" && естьЗвезда) {
        добавить("Звезда лиги у соперника", 1.1);
      }

      if (продано >= 30 || днейДоМатча <= 21) {
        добавить("Ранний спрос: 3 недели / более 30%", 1.1);
      } else {
        добавить("Ранний спрос ниже 30%", 0.9);
      }

      if (продано >= 40 || днейДоМатча <= 14) {
        добавить("Ранний спрос: 2 недели / более 40%", 1.1);
      } else {
        добавить("Спрос за 2 недели ниже 40%", 0.9);
      }
    }

    if (этапПродаж === "В течение сезона") {
      добавить("День недели", выходнойДень ? 1.1 : 1);
      добавить("Время матча", удобноеВремя ? 1 : 0.95);

      if (местоКоманды <= 4) добавить("Положение клуба: топ-4", 1.15);
      else if (местоКоманды <= 8) добавить("Положение клуба: 4–8 место", 1.1);
      else if (местоКоманды <= 10) добавить("Положение клуба: 9–10 место", 1.05);
      else добавить("Положение клуба: 11–12 место", 1);

      if (местоСоперника <= 4) добавить("Положение соперника: топ-4", 1.15);
      else if (местоСоперника <= 8) добавить("Положение соперника: 4–8 место", 1.1);
      else if (местоСоперника <= 10) добавить("Положение соперника: 9–10 место", 1.05);
      else добавить("Положение соперника: 11–12 место", 1);

      if (топ10БомбардирСоперника) {
        добавить("Топ-10 бомбардир у соперника", 1.05);
      }

      if (борьбаЗаПлейофф) {
        добавить("Борьба за место в плей-офф", 1.1);
      }

      if (победнаяСерия >= 3) добавить("Серия: 3+ победы подряд", 1.15);
      else if (победнаяСерия === 2) добавить("Серия: 2 победы подряд", 1.1);
      else if (победнаяСерия === 1) добавить("Серия: 1 победа", 1.05);
      else if (победнаяСерия === 0) добавить("Серия: без побед", 1);
      else добавить("Поражение", 0.9);

      if (дерби) добавить("Дерби / принципиальный матч", 1.1);

      if (днейДоМатча <= 7) {
        добавить("Продажи за 7 дней до матча", продано >= 50 ? 1.1 : 0.95);
      }

      if (днейДоМатча <= 3) {
        добавить("Продажи за 3 дня до матча", продано >= 65 ? 1.1 : 0.95);
      }

      if (днейДоМатча <= 0) {
        добавить("Продажи в день матча", продано >= 80 ? 1.1 : 1);
      }
    }

    if (этапПродаж === "Плей-офф") {
      добавить("День недели в плей-офф", выходнойДень ? 1.1 : 1);

      if (местоСоперника <= 2) добавить("Соперник: 1–2 место в конференции", 1.2);
      else if (местоСоперника <= 4) добавить("Соперник: 3–4 место в конференции", 1.1);
      else добавить("Соперник: 5–8 место в конференции", 1);

      if (раундПлейофф === "Первый раунд") добавить("Раунд плей-офф: первый раунд", 1);
      if (раундПлейофф === "Второй раунд") добавить("Раунд плей-офф: второй раунд", 1.1);
      if (раундПлейофф === "Финал конференции") добавить("Раунд плей-офф: финал конференции", 1.2);
      if (раундПлейофф === "Финал Кубка Гагарина") добавить("Раунд плей-офф: финал Кубка Гагарина", 1.5);

      if (счетВСерии === "Ведём 1–2 матча") добавить("Счёт в серии: преимущество", 1.1);
      if (счетВСерии === "Ведём 3 матча") добавить("Счёт в серии: близко к победе", 1.2);
      if (счетВСерии === "Равный счёт") добавить("Счёт в серии: равный", 1);
      if (счетВСерии === "Проигрываем 1 матч") добавить("Счёт в серии: проигрываем 1 матч", 1.1);
      if (счетВСерии === "Проигрываем 2 матча") добавить("Счёт в серии: проигрываем 2 матча", 0.8);
      if (счетВСерии === "Проигрываем 3 матча") добавить("Счёт в серии: проигрываем 3 матча", 0.6);

      if (решающаяИгра) добавить("Решающая игра серии", 1.1);

      if (днейДоМатча <= 1) {
        добавить("Продажи за 1 день до матча", продано >= 50 ? 1.1 : 0.9);
      }

      if (днейДоМатча <= 0) {
        добавить("Продажи в день матча", продано >= 80 ? 1.3 : 1);
      }
    }

    const рассчитаннаяЦена = Math.round(цена);

    const итоговаяЦена = Math.max(
      рассчитаннаяЦена,
      минимальнаяЦенаАктивнойКатегории
    );

    const количествоБилетов = 500;
    const базоваяВыручка = активнаяКатегория.base * количествоБилетов;
    const динамическаяВыручка = итоговаяЦена * количествоБилетов;
    const дополнительнаяВыручка = динамическаяВыручка - базоваяВыручка;

    const график = Array.from({ length: 8 }, (_, i) => {
      const спрос = Math.min(100, 15 + i * 10 + продано / 5);

      const ценаГрафика = Math.max(
        минимальнаяЦенаАктивнойКатегории,
        Math.round(
          активнаяКатегория.base *
            (1 + спрос / 100) *
            (категорияМатча === 1 ? 1.45 : категорияМатча === 2 ? 1.2 : 1)
        )
      );

      return {
        спрос,
        price: ценаГрафика,
      };
    });

    let рекомендация = "Сохранять текущую цену";
    let причина = "Спрос находится в нормальном диапазоне";
    let действие = "Продолжать мониторинг продаж";

    if (рассчитаннаяЦена < минимальнаяЦенаАктивнойКатегории) {
      рекомендация = "Не снижать цену ниже минимального порога";
      причина =
        "Расчётная цена ниже экономики абонемента или ручного лимита клуба";
      действие = "Использовать минимально допустимую цену";
    } else if (этапПродаж === "Плей-офф") {
      рекомендация = "Использовать плей-офф коэффициенты";
      причина = "Матчи плей-офф имеют повышенный спрос и дефицитность билетов";
      действие = "Повышать цену осторожно, особенно при высоком спросе";
    } else if (продано > 75 && днейДоМатча < 7) {
      рекомендация = "Повысить цену на 12–18%";
      причина = "Высокий спрос, близкая дата матча и риск sold out";
      действие = "Поднять цену в категориях с высоким спросом";
    } else if (продано < 30 && днейДоМатча < 5) {
      рекомендация = "Снизить цену на 8–12%";
      причина = "Низкий спрос при близкой дате матча";
      действие = "Стимулировать продажи, но не ниже минимальной цены";
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
      рассчитаннаяЦена,
      ростПроцентов:
        активнаяКатегория.base > 0
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
    минимальнаяЦенаАктивнойКатегории,
    этапПродаж,
    раундПлейофф,
    счетВСерии,
    решающаяИгра,
    топ10БомбардирСоперника,
    борьбаЗаПлейофф,
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

    const проданоВКатегории = Math.round(
      местВКатегории * (продано / 100)
    );

    const минимальнаяЦена = Math.max(
      Math.round(
        item.seasonTicketPrice / Math.max(1, матчейВДомашнемСезоне)
      ),
      item.minPriceManual
    );

    const динамическаяЦена =
      item.id === активнаяКатегорияId
        ? результат.итоговаяЦена
        : Math.max(
            минимальнаяЦена,
            Math.round(item.base * (1 + результат.ростПроцентов / 100))
          );

    return {
      ...item,
      минимальнаяЦена,
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
      {
        id: новыйId,
        name: "Новая категория",
        base: 1000,
        seasonTicketPrice: 30000,
        minPriceManual: 800,
      },
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
    поле: "name" | "base" | "seasonTicketPrice" | "minPriceManual",
    значение: string
  ) => {
    setКатегорииЦен(
      категорииЦен.map((item) =>
        item.id === id
          ? {
              ...item,
              [поле]: поле === "name" ? значение : Number(значение) || 0,
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
            Клуб выбирает лигу, настраивает свои билетные категории, задаёт
            базовые цены, а алгоритм рассчитывает рекомендованную цену и прогноз
            выручки.
          </p>
        </div>

        <div style={styles.priceCard}>
          <span style={styles.cardLabel}>Рекомендованная цена</span>

          <h2 style={styles.price}>
            {результат.итоговаяЦена.toLocaleString()} ₽
          </h2>

          <p style={styles.whiteText}>
            +{результат.ростПроцентов}% к базовой цене
          </p>

          <div style={styles.priceSubRow}>
            <span>Минимальный порог</span>
            <b>{минимальнаяЦенаАктивнойКатегории.toLocaleString()} ₽</b>
          </div>
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

        <Kpi title="Этап продаж" value={этапПродаж} />
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
            <small>
              Вместимость: {выбранныйКлуб.capacity.toLocaleString()} мест
            </small>
          </div>

          <Label text="Этап продаж" />

          <select
            style={styles.select}
            value={этапПродаж}
            onChange={(e) => setЭтапПродаж(e.target.value)}
          >
            <option value="До начала сезона">До начала сезона</option>
            <option value="В течение сезона">В течение сезона</option>
            <option value="Плей-офф">Плей-офф</option>
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
            <option value={1}>1 категория / высокий спрос</option>
            <option value={2}>2 категория / средний спрос</option>
            <option value={3}>3 категория / базовый спрос</option>
          </select>

          <Slider
            label="Продано билетов"
            value={продано}
            max={100}
            suffix="%"
            setValue={setПродано}
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
          <h3>Факторы этапа продаж</h3>

          {этапПродаж === "До начала сезона" && (
            <>
              <p style={styles.hint}>
                До начала сезона система оценивает ранний спрос: продажи за 3
                недели, продажи за 2 недели, категорию матча, день недели,
                время матча и наличие звезды у соперника.
              </p>
            </>
          )}

          {этапПродаж === "В течение сезона" && (
            <>
              <Check
                text="Топ-10 бомбардир у соперника"
                checked={топ10БомбардирСоперника}
                setChecked={setТоп10БомбардирСоперника}
              />

              <Check
                text="Борьба за место в плей-офф"
                checked={борьбаЗаПлейофф}
                setChecked={setБорьбаЗаПлейофф}
              />
            </>
          )}

          {этапПродаж === "Плей-офф" && (
            <>
              <Label text="Раунд плей-офф" />

              <select
                style={styles.select}
                value={раундПлейофф}
                onChange={(e) => setРаундПлейофф(e.target.value)}
              >
                <option value="Первый раунд">Первый раунд</option>
                <option value="Второй раунд">Второй раунд</option>
                <option value="Финал конференции">Финал конференции</option>
                <option value="Финал Кубка Гагарина">
                  Финал Кубка Гагарина
                </option>
              </select>

              <Label text="Счёт в серии" />

              <select
                style={styles.select}
                value={счетВСерии}
                onChange={(e) => setСчетВСерии(e.target.value)}
              >
                <option value="Равный счёт">Равный счёт</option>
                <option value="Ведём 1–2 матча">Ведём 1–2 матча</option>
                <option value="Ведём 3 матча">Ведём 3 матча</option>
                <option value="Проигрываем 1 матч">Проигрываем 1 матч</option>
                <option value="Проигрываем 2 матча">Проигрываем 2 матча</option>
                <option value="Проигрываем 3 матча">Проигрываем 3 матча</option>
              </select>

              <Check
                text="Решающая игра серии"
                checked={решающаяИгра}
                setChecked={setРешающаяИгра}
              />
            </>
          )}

          <div style={styles.explainBox}>
            <b>Что изменилось?</b>
            <p>
              Теперь алгоритм использует разные коэффициенты для этапов: до
              начала сезона, в течение сезона и плей-офф. Это позволяет
              разделить ранние продажи, регулярный сезон и матчи повышенного
              спроса.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.grid}>
        <div style={styles.panel}>
          <div style={styles.sectionHeader}>
            <div>
              <h3>Управление билетными категориями</h3>
              <p style={styles.hint}>
                Клуб задаёт базовую цену билета, стоимость абонемента и
                минимально допустимую цену для каждой категории мест.
              </p>
            </div>
          </div>

          <div style={styles.explainBox}>
            <b>Как рассчитывается минимальная цена</b>
            <p>
              Минимальная цена = стоимость абонемента / количество домашних
              матчей. Если клуб задаёт ручной нижний порог выше этой суммы,
              система использует ручной порог.
            </p>
          </div>

          <Label text="Домашних матчей в сезоне" />

          <input
            style={styles.input}
            type="number"
            value={матчейВДомашнемСезоне}
            onChange={(e) =>
              setМатчейВДомашнемСезоне(Number(e.target.value) || 1)
            }
          />

          <div style={styles.minPriceBox}>
            <span>Минимально допустимая цена продажи билета</span>
            <b>{минимальнаяЦенаАктивнойКатегории.toLocaleString()} ₽</b>
          </div>

          <div style={styles.categoryHeader}>
            <span>Категория мест</span>
            <span>Базовая цена</span>
            <span>Абонемент</span>
            <span>Нижний порог</span>
            <span></span>
          </div>

          <div style={styles.categoryList}>
            {категорииЦен.map((item) => {
              const автоМинимум = Math.round(
                item.seasonTicketPrice / Math.max(1, матчейВДомашнемСезоне)
              );

              const итоговыйМинимум = Math.max(
                автоМинимум,
                item.minPriceManual
              );

              return (
                <div key={item.id} style={styles.categoryCard}>
                  <div>
                    <input
                      style={styles.input}
                      value={item.name}
                      onChange={(e) =>
                        обновитьКатегорию(item.id, "name", e.target.value)
                      }
                    />

                    <small style={styles.cellHint}>
                      Название сектора или типа мест
                    </small>
                  </div>

                  <div>
                    <div style={styles.priceInputWrap}>
                      <input
                        style={styles.inputPrice}
                        type="number"
                        value={item.base}
                        onChange={(e) =>
                          обновитьКатегорию(item.id, "base", e.target.value)
                        }
                      />
                      <span>₽</span>
                    </div>

                    <small style={styles.cellHint}>Обычная цена билета</small>
                  </div>

                  <div>
                    <div style={styles.priceInputWrap}>
                      <input
                        style={styles.inputPrice}
                        type="number"
                        value={item.seasonTicketPrice}
                        onChange={(e) =>
                          обновитьКатегорию(
                            item.id,
                            "seasonTicketPrice",
                            e.target.value
                          )
                        }
                      />
                      <span>₽</span>
                    </div>

                    <small style={styles.cellHint}>
                      Цена сезонного абонемента
                    </small>
                  </div>

                  <div>
                    <div style={styles.priceInputWrap}>
                      <input
                        style={styles.inputPrice}
                        type="number"
                        value={item.minPriceManual}
                        onChange={(e) =>
                          обновитьКатегорию(
                            item.id,
                            "minPriceManual",
                            e.target.value
                          )
                        }
                      />
                      <span>₽</span>
                    </div>

                    <small style={styles.cellHint}>Ручной минимум клуба</small>
                  </div>

                  <button
                    style={styles.deleteButton}
                    onClick={() => удалитьКатегорию(item.id)}
                    disabled={категорииЦен.length === 1}
                  >
                    Удалить
                  </button>

                  <div style={styles.minFormula}>
                    <span>
                      Абонемент / матчи: {автоМинимум.toLocaleString()} ₽
                    </span>
                    <b>Итоговый минимум: {итоговыйМинимум.toLocaleString()} ₽</b>
                  </div>
                </div>
              );
            })}
          </div>

          <button style={styles.addButton} onClick={добавитьКатегорию}>
            + Добавить категорию
          </button>
        </div>

        <div style={styles.panel}>
          <h3>Продажи по категориям</h3>

          <div style={styles.salesTable}>
            {категорииСПродажами.map((item) => (
              <div key={item.id} style={styles.salesRow}>
                <b>{item.name}</b>

                <span>
                  {item.проданоВКатегории.toLocaleString()} /{" "}
                  {item.местВКатегории.toLocaleString()} билетов
                </span>

                <span>Мин: {item.минимальнаяЦена.toLocaleString()} ₽</span>

                <span>ДЦО: {item.динамическаяЦена.toLocaleString()} ₽</span>

                <strong>{item.динамическаяВыручка.toLocaleString()} ₽</strong>
              </div>
            ))}
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
            График показывает прогноз роста цены при изменении спроса с учётом
            минимально допустимой цены.
          </p>
        </div>

        <div style={styles.panel}>
          <h3>AI Pricing Engine</h3>

          <div style={styles.aiEngine}>
            <InfoRow
              title="Текущий спрос"
              value={
                продано > 60 ? "Высокий" : продано > 35 ? "Средний" : "Низкий"
              }
            />

            <InfoRow
              title="Confidence score"
              value={`${результат.confidence}%`}
            />

            <InfoRow
              title="Прогноз sold out"
              value={`${результат.вероятностьSoldOut}%`}
            />

            <InfoRow
              title="Revenue uplift"
              value={`${результат.дополнительнаяВыручка.toLocaleString()} ₽`}
            />

            <div style={styles.aiRecommendation}>
              <span style={styles.cardLabel}>Рекомендация системы</span>

              <h2>{результат.рекомендация}</h2>

              <p>
                <b>Причина:</b> {результат.причина}
              </p>

              <p>
                <b>Действие:</b> {результат.действие}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.grid}>
        <div style={styles.panel}>
          <h3>Базовые факторы спроса</h3>

          <Check
            text="Выходной день"
            checked={выходнойДень}
            setChecked={setВыходнойДень}
          />

          <Check
            text="Удобное время"
            checked={удобноеВремя}
            setChecked={setУдобноеВремя}
          />

          {лига === "КХЛ" && (
            <Check
              text="Есть звезда у соперника"
              checked={естьЗвезда}
              setChecked={setЕстьЗвезда}
            />
          )}

          <Check
            text="Дерби / принципиальный матч"
            checked={дерби}
            setChecked={setДерби}
          />
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

function Kpi({ title, value }: any) {
  return (
    <div style={styles.kpi}>
      <span style={styles.cardLabel}>{title}</span>
      <strong style={styles.kpiValue}>{value}</strong>
    </div>
  );
}

function Label({ text }: any) {
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

function InfoRow({ title, value }: any) {
  return (
    <div style={styles.aiRow}>
      <span>{title}</span>
      <b>{value}</b>
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
  },

  whiteText: {
    color: "#ffffff",
    margin: 0,
  },

  priceSubRow: {
    marginTop: 18,
    paddingTop: 16,
    borderTop: "1px solid #2a2a2a",
    display: "flex",
    justifyContent: "space-between",
    color: "#d8d8d8",
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

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 16,
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
  },

  sliderTop: {
    display: "flex",
    justifyContent: "space-between",
  },

  range: {
    width: "100%",
    accentColor: "#ffffff",
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #333333",
    background: "#050505",
    color: "#ffffff",
    boxSizing: "border-box",
  },

  inputPrice: {
    width: "100%",
    padding: 12,
    border: "none",
    background: "transparent",
    color: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
  },

  priceInputWrap: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    paddingRight: 10,
    borderRadius: 12,
    border: "1px solid #333333",
    background: "#050505",
  },

  explainBox: {
    padding: 18,
    borderRadius: 18,
    background: "#0a0a0a",
    border: "1px solid #2a2a2a",
    marginBottom: 18,
    color: "#d8d8d8",
  },

  minPriceBox: {
    marginTop: 18,
    marginBottom: 18,
    padding: 18,
    borderRadius: 18,
    background: "#0a0a0a",
    border: "1px solid #ffffff",
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
  },

  categoryHeader: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr 1fr 1fr 90px",
    gap: 10,
    color: "#9b9b9b",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginTop: 20,
    marginBottom: 10,
  },

  categoryList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  categoryCard: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr 1fr 1fr 90px",
    gap: 10,
    alignItems: "start",
    padding: 14,
    borderRadius: 18,
    background: "#0a0a0a",
    border: "1px solid #2a2a2a",
  },

  cellHint: {
    display: "block",
    marginTop: 7,
    color: "#777777",
    fontSize: 11,
  },

  minFormula: {
    gridColumn: "1 / -1",
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 12,
    marginTop: 4,
    borderTop: "1px solid #222222",
    color: "#bdbdbd",
    fontSize: 13,
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
  },

  factor: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #2a2a2a",
  },
};