"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, Bell, Box, ChevronDown, CircleHelp, Coins, Crown, Gift, History, Home, Menu, Package, Search, ShieldCheck, Sparkles, Swords, UserRound, Wallet, X, Zap } from "lucide-react";

type Skin = { name: string; weapon: string; rarity: string; value: number; color: string; symbol: string };
const skins: Skin[] = [
  { name: "Dragon Lore", weapon: "AWP", rarity: "Тайное", value: 12500, color: "#d69a35", symbol: "龍" },
  { name: "Howl", weapon: "M4A4", rarity: "Тайное", value: 8900, color: "#e45b43", symbol: "狼" },
  { name: "Printstream", weapon: "USP-S", rarity: "Тайное", value: 4200, color: "#e6e8ee", symbol: "✦" },
  { name: "Asiimov", weapon: "AWP", rarity: "Засекреченное", value: 2100, color: "#ed7b35", symbol: "◈" },
  { name: "Violet", weapon: "Glock-18", rarity: "Запрещённое", value: 780, color: "#a77cff", symbol: "✧" },
  { name: "Neon Rider", weapon: "AK-47", rarity: "Засекреченное", value: 1650, color: "#df5aa6", symbol: "⚡" },
];
const cases = [
  { name: "Начальный", price: 250, tone: "blue", icon: "◈", desc: "Для первого открытия" },
  { name: "Феникс", price: 650, tone: "purple", icon: "✦", desc: "Огненная коллекция" },
  { name: "Император", price: 1400, tone: "gold", icon: "♛", desc: "Предметы высокого класса" },
  { name: "Тайный", price: 2800, tone: "red", icon: "✧", desc: "Редкие находки" },
];
const nav = [{ label: "Главная", icon: Home }, { label: "Кейсы", icon: Box }, { label: "Апгрейд", icon: Zap }, { label: "Контракт", icon: Swords }, { label: "Инвентарь", icon: Package }];
const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

export default function HomePage() {
  const [balance, setBalance] = useState(10000);
  const [inventory, setInventory] = useState<Skin[]>([]);
  const [active, setActive] = useState("Главная");
  const [notice, setNotice] = useState("Добро пожаловать! Тебе начислено 10 000 демо-монет.");
  const [opening, setOpening] = useState(false);
  const [lastDrop, setLastDrop] = useState<Skin | null>(null);
  const [daily, setDaily] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [upgradeTarget, setUpgradeTarget] = useState(0);
  const filtered = useMemo(() => skins.filter(s => (s.name + s.weapon).toLowerCase().includes(search.toLowerCase())), [search]);

  function openCase(price: number) {
    if (opening) return;
    if (balance < price) { setNotice("Недостаточно демо-монет. Забери ежедневный бонус!"); return; }
    setBalance(v => v - price);
    setOpening(true);
    setLastDrop(null);
    window.setTimeout(() => {
      const drop = skins[Math.floor(Math.random() * skins.length)];
      setLastDrop(drop);
      setInventory(v => [drop, ...v]);
      setOpening(false);
      setNotice("Выпал предмет: " + drop.name + " · +" + fmt(drop.value) + " DEMO в коллекцию");
    }, 1100);
  }
  function claimDaily() {
    if (daily) return;
    setDaily(true); setBalance(v => v + 500); setNotice("Ежедневный бонус получен: +500 DEMO!");
  }
  function upgrade() {
    const item = inventory[0];
    if (!item) { setNotice("Сначала открой кейс, чтобы получить предмет для апгрейда."); return; }
    const target = skins[upgradeTarget];
    setInventory(v => v.slice(1));
    if (Math.random() < 0.35) {
      setInventory(v => [target, ...v]); setNotice("Успех! Получен " + target.name + ".");
    } else setNotice("Неудача апгрейда. Это демо-режим — реальные средства не затрагиваются.");
  }
  function contract() {
    if (inventory.length < 3) { setNotice("Для контракта нужно минимум 3 предмета в инвентаре."); return; }
    const chosen = inventory.slice(0, 3);
    const total = chosen.reduce((a, s) => a + s.value, 0);
    const prize = skins.find(s => s.value > total * 0.65) ?? skins[0];
    setInventory(v => [prize, ...v.slice(3)]);
    setNotice("Контракт собран! Получен предмет " + prize.name + ".");
  }

  return <main className="site-shell">
    <div className="demo-strip"><ShieldCheck size={14}/> ДЕМО-РЕЖИМ <span>Все монеты и предметы виртуальные · реальные платежи и вывод отключены</span></div>
    <header className="topbar">
      <button className="mobile-toggle icon-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Меню">{mobileMenu ? <X/> : <Menu/>}</button>
      <a className="brand" href="#"><span className="brand-mark">S</span><span>SKINBRO<small>DEMO</small></span></a>
      <nav className="main-nav">{nav.map(n => <button key={n.label} className={active === n.label ? "nav-link active" : "nav-link"} onClick={() => {setActive(n.label);setMobileMenu(false);}}><n.icon size={16}/>{n.label}</button>)}</nav>
      <div className="top-actions"><button className="icon-button" aria-label="Уведомления"><Bell size={18}/></button><div className="balance"><Coins size={17}/><b>{fmt(balance)}</b><span>DEMO</span></div><button className="profile-button" onClick={() => setActive("Профиль")}><UserRound size={17}/><span>Профиль</span><ChevronDown size={14}/></button></div>
      {mobileMenu && <div className="mobile-nav">{nav.map(n => <button key={n.label} onClick={() => {setActive(n.label);setMobileMenu(false);}}><n.icon size={17}/>{n.label}</button>)}</div>}
    </header>

    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><Sparkles size={14}/> ВИРТУАЛЬНАЯ CS2-ПЛАТФОРМА</div><h1>ОТКРЫВАЙ.<br/><em>НАХОДИ СВОЁ.</em></h1><p>Открывай кейсы, собирай коллекцию и пробуй удачу. Только виртуальные монеты — играй без риска.</p><div className="hero-buttons"><button className="primary-button" onClick={() => setActive("Кейсы")}>Смотреть кейсы <span>↗</span></button><button className="secondary-button" onClick={claimDaily}><Gift size={16}/> Забрать бонус +500</button></div></div>
      <div className="hero-art"><div className="orb orb-one"/><div className="orb orb-two"/><div className="hero-case"><div className="case-top">SB / 01</div><div className="case-glyph">✦</div><div className="case-name">MYSTERY<br/>DROP</div><div className="case-bottom">SPECIAL COLLECTION</div></div><div className="floating-tag tag-left">RARE DROP <b>★</b></div><div className="floating-tag tag-right"><span>DEMO</span><b>100%</b> SAFE PLAY</div></div>
    </section>

    <div className="ticker"><span>✦</span> ВИРТУАЛЬНЫЕ ПРЕДМЕТЫ <i/> БЕСПЛАТНЫЕ БОНУСЫ <i/> БЕЗ РЕАЛЬНЫХ ДЕНЕГ <i/> ТВОЯ КОЛЛЕКЦИЯ <i/> <span>✦</span></div>

    <section className="content-grid">
      <aside className="sidebar"><div className="side-label">МЕНЮ</div>{nav.map(n => <button key={n.label} className={active === n.label ? "side-link selected" : "side-link"} onClick={() => setActive(n.label)}><n.icon size={17}/>{n.label}</button>)}<div className="side-label side-label-gap">ТВОЙ АККАУНТ</div><button className="side-link" onClick={() => setActive("Бонусы")}><Gift size={17}/>Бонусы</button><button className="side-link" onClick={() => setActive("История")}><History size={17}/>История</button><div className="side-promo"><div className="promo-icon"><Crown/></div><b>Бонус каждый день</b><p>Заглядывай ежедневно и забирай +500 демо-монет.</p><button onClick={claimDaily} disabled={daily}>{daily ? "Уже получен" : "Получить бонус"}</button></div></aside>
      <div className="main-content">
        <div className="welcome-row"><div><div className="section-kicker">ПОНЕДЕЛЬНИК · ДЕМО-СЕССИЯ</div><h2>{active === "Главная" ? "Добро пожаловать в игру" : active}</h2></div><div className="user-level"><span>УРОВЕНЬ</span><b>01</b><div className="level-bar"><i/></div></div></div>
        <div className="notice"><Sparkles size={16}/><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Закрыть"><X size={14}/></button></div>
        {active === "Главная" || active === "Кейсы" ? <>
          <div className="section-heading"><div><span className="section-kicker">ВЫБЕРИ СВОЙ ШАНС</span><h3>Популярные кейсы</h3></div><button className="text-button" onClick={() => setActive("Кейсы")}>Все кейсы <span>→</span></button></div>
          <div className="case-grid">{cases.map((c,i) => <article className={"case-card "+c.tone} key={c.name}><div className="case-card-top"><span>CASE / 0{i+1}</span><span className="case-live">● DEMO</span></div><div className="case-illustration"><div className="case-halo"/><div className="case-box">{c.icon}</div></div><h4>{c.name}</h4><p>{c.desc}</p><div className="case-card-bottom"><span><Coins size={15}/>{fmt(c.price)} <small>DEMO</small></span><button onClick={() => openCase(c.price)} disabled={opening}>{opening ? "Открываем…" : "Открыть"}</button></div></article>)}</div>
          <div className="section-heading drop-heading"><div><span className="section-kicker">ПОСЛЕДНИЕ НАХОДКИ</span><h3>Предметы коллекции</h3></div><button className="text-button" onClick={() => setActive("Инвентарь")}>Мой инвентарь →</button></div>
          {lastDrop && <div className="drop-result"><div className="drop-star">✦</div><div><small>ПОСЛЕДНЕЕ ОТКРЫТИЕ</small><b>{lastDrop.weapon} · {lastDrop.name}</b></div><strong>{fmt(lastDrop.value)} DEMO</strong></div>}
          <div className="skin-grid">{filtered.slice(0,4).map(s => <div className="skin-card" key={s.name}><div className="skin-art" style={{"--skin-color":s.color} as React.CSSProperties}><span>{s.symbol}</span></div><div className="skin-meta"><small>{s.weapon}</small><b>{s.name}</b><span>{s.rarity}</span></div><strong>{fmt(s.value)} <small>DEMO</small></strong></div>)}</div>
        </> : active === "Инвентарь" ? <><div className="section-heading"><div><span className="section-kicker">ТВОЯ КОЛЛЕКЦИЯ</span><h3>Инвентарь <small>({inventory.length})</small></h3></div></div>{inventory.length ? <div className="skin-grid">{inventory.map((s,i)=><div className="skin-card" key={s.name+i}><div className="skin-art" style={{"--skin-color":s.color} as React.CSSProperties}><span>{s.symbol}</span></div><div className="skin-meta"><small>{s.weapon}</small><b>{s.name}</b><span>{s.rarity}</span></div><strong>{fmt(s.value)} <small>DEMO</small></strong></div>)}</div> : <div className="empty-state"><Package size={36}/><b>Пока здесь пусто</b><p>Открой кейс, чтобы получить первый предмет.</p><button className="primary-button" onClick={()=>setActive("Кейсы")}>К кейсам</button></div>}</>
        : active === "Апгрейд" ? <><div className="section-heading"><div><span className="section-kicker">РИСКНИ И ПОЛУЧИ БОЛЬШЕ</span><h3>Апгрейд предметов</h3></div></div><div className="game-panel"><div className="upgrade-columns"><div className="upgrade-slot"><small>ТВОЙ ПРЕДМЕТ</small><b>{inventory[0]?.name ?? "Нет предмета"}</b><span>{inventory[0] ? fmt(inventory[0].value)+" DEMO" : "Открой кейс"}</span></div><div className="upgrade-arrow"><ArrowDownUp/></div><div className="upgrade-slot"><small>ЖЕЛАЕМАЯ НАГРАДА</small><select value={upgradeTarget} onChange={e=>setUpgradeTarget(Number(e.target.value))}>{skins.map((s,i)=><option value={i} key={s.name}>{s.name} · {fmt(s.value)} DEMO</option>)}</select><span>Шанс успеха: 35%</span></div></div><button className="primary-button wide-button" onClick={upgrade}>Попробовать апгрейд</button></div></>
        : active === "Контракт" ? <><div className="section-heading"><div><span className="section-kicker">ОБЪЕДИНИ ПРЕДМЕТЫ</span><h3>Контракт обмена</h3></div></div><div className="game-panel"><div className="contract-symbol">✦</div><h3>3 предмета → 1 новый</h3><p>Обмени три первых предмета из инвентаря на новый случайный предмет.</p><div className="contract-slots">{[0,1,2].map(i=><div key={i}>{inventory[i]?.symbol ?? "+"}<small>{inventory[i]?.name ?? "Пусто"}</small></div>)}</div><button className="primary-button wide-button" onClick={contract}>Собрать контракт</button></div></>
        : active === "Бонусы" ? <><div className="section-heading"><div><span className="section-kicker">ПОДАРКИ ДЛЯ ТЕБЯ</span><h3>Бонусный центр</h3></div></div><div className="bonus-card"><Gift size={34}/><div><small>ЕЖЕДНЕВНАЯ НАГРАДА</small><h3>+500 DEMO</h3><p>Забирай виртуальные монеты один раз за демо-сессию.</p></div><button onClick={claimDaily} disabled={daily}>{daily ? "Получено" : "Забрать"}</button></div></>
        : active === "История" ? <><div className="section-heading"><div><span className="section-kicker">АКТИВНОСТЬ</span><h3>История операций</h3></div></div><div className="empty-state"><History size={36}/><b>История пока пуста</b><p>Здесь будут отображаться открытия и игровые действия.</p></div></>
        : <><div className="section-heading"><div><span className="section-kicker">АККАУНТ</span><h3>Профиль игрока</h3></div></div><div className="profile-card"><div className="avatar"><UserRound/></div><div><b>Игрок SKINBRO DEMO</b><p>Уровень 1 · Демо-аккаунт</p><small>Регистрация и синхронизация аккаунта появятся на следующем этапе.</small></div></div></>}
        <div className="safety-note"><ShieldCheck size={16}/><span>SKINBRO DEMO — независимый демонстрационный проект. Баланс, предметы и результаты не имеют денежной стоимости.</span></div>
      </div>
    </section>
    <footer><a className="brand footer-brand" href="#"><span className="brand-mark">S</span><span>SKINBRO<small>DEMO</small></span></a><span>© 2026 SKINBRO DEMO · Только виртуальная экономика</span><span><CircleHelp size={14}/> Демо-проект</span></footer>
  </main>;
}
