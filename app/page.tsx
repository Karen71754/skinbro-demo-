"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
import { ArrowLeftRight, ArrowUpRight, ChevronDown, CircleHelp, Coins, Home, Menu, Package, Paintbrush, Search, ShieldCheck, Sparkles, Swords, Target, Trophy, UserRound, Wallet, X, Zap } from "lucide-react";

type Item = { name: string; price: number };
type Collection = { name: string; subtitle: string; tone: string; items: Item[] };
const collections: Collection[] = [
 {name:"Dead Hand Repack",subtitle:"Коллекция · Dead Hand",tone:"green",items:[{name:"Dead Hand Repack",price:100},{name:"Dead Hand Gloves",price:18880}]},
 {name:"Genesis Repack",subtitle:"Коллекция · Genesis",tone:"violet",items:[{name:"Genesis Repack",price:67}]},
 {name:"Anubis Repack",subtitle:"Коллекция · Anubis",tone:"sand",items:[{name:"Anubis Repack",price:300}]},
 {name:"Sport & Field Repack",subtitle:"Коллекция · Sport & Field",tone:"blue",items:[{name:"Sport & Field Repack",price:200}]},
 {name:"Recoil Repack",subtitle:"Коллекция · Recoil",tone:"red",items:[{name:"Recoil Repack",price:222}]},
 {name:"Spring Spectrum",subtitle:"Операция · Spring Spectrum",tone:"spectrum",items:[{name:"Руби тир 3",price:500},{name:"Эмеральд тир 3",price:550},{name:"Сапфир тир 3",price:650},{name:"Чёрный перл тир 3",price:700},{name:"Руби тир 2",price:1500},{name:"Эмеральд тир 2",price:2150},{name:"Сапфир тир 2",price:2750},{name:"Чёрный перл тир 2",price:3350},{name:"Сапфир тир 1",price:33333},{name:"Эмеральд тир 1",price:44000},{name:"Руби тир 1",price:55555},{name:"Чёрный перл тир 1",price:90000}]},
 {name:"Arctic Bear",subtitle:"Операция · Arctic Bear",tone:"ice",items:[{name:"AK-47 Bloodsport",price:250},{name:"AWP Longdog",price:1375},{name:"M4A4 Poseidon",price:3600},{name:"AWP Medusa",price:5600},{name:"AWP Gungnir",price:9000}]},
 {name:"Arms Dealer",subtitle:"Операция · Arms Dealer",tone:"orange",items:[{name:"Камуфляжный сет",price:600},{name:"Фиолетовый сет",price:2100},{name:"Розовый сет",price:2500},{name:"Неоновый сет",price:6500},{name:"Черный сет",price:9990},{name:"Красный сет",price:12500},{name:"Зеленый сет",price:13500},{name:"Белый сет",price:15000},{name:"Синий сет",price:30000},{name:"Золотой сет",price:35000},{name:"Градиент сет",price:42500}]},
 {name:"Ace",subtitle:"Операция · Ace",tone:"gold",items:[{name:"Изи",price:990},{name:"Эко",price:1980},{name:"Ноу скоп",price:2970},{name:"Фул бай",price:4950},{name:"Трейдер",price:7425},{name:"Вин-Вин",price:9990}]},
 {name:"Frost Wolf",subtitle:"Операция · Frost Wolf",tone:"wolf",items:[{name:"Промышленный",price:29},{name:"Армейский",price:49},{name:"Запрещенный",price:149},{name:"Засекреченный",price:750},{name:"Случайный",price:3500},{name:"Тайный",price:6500}]},
 {name:"Clutch",subtitle:"Коллекция · Clutch",tone:"pink",items:[{name:"Клатч | P250",price:89},{name:"Клатч | Tec-9",price:89},{name:"Клатч | Five-SeveN",price:89},{name:"Клатч | Glock-18",price:89},{name:"Клатч | Usp-s",price:120},{name:"Клатч | Mac-10",price:149},{name:"Клатч | SSG-08",price:149},{name:"Клатч | P90",price:149},{name:"Клатч | Deagle",price:199},{name:"Клатч | Famas",price:249},{name:"Клатч | AUG",price:279},{name:"Клатч | M4A1-S",price:299},{name:"Клатч | AK-47",price:399},{name:"Клатч | M4A4",price:399},{name:"Клатч | AWP",price:649},{name:"Клатч | Агенты",price:1450},{name:"Клатч | Перчаточный",price:18990},{name:"Клатч | Ножевой",price:20990}]},
 {name:"VIP",subtitle:"Коллекция · VIP",tone:"vip",items:[{name:"Vip 1",price:1000},{name:"Vip 2",price:1200},{name:"Vip 3",price:5000},{name:"Vip 4",price:20000},{name:"Vip 5",price:60000}]},
 {name:"Бюджетный старт",subtitle:"Кейс-батл · Доступные дропы",tone:"blue",items:[{name:"Первый шанс",price:49},{name:"Лёгкий старт",price:99},{name:"Разогрев",price:149},{name:"Двойной шанс",price:249},{name:"Экспресс",price:399}]},
 {name:"AK-47 Collection",subtitle:"Оружейный кейс · AK-47",tone:"orange",items:[{name:"AK-47 | стартовый",price:199},{name:"AK-47 | охотник",price:499},{name:"AK-47 | элита",price:999},{name:"AK-47 | легенда",price:2499},{name:"AK-47 | топ-дроп",price:5999}]},
 {name:"AWP Sniper",subtitle:"Оружейный кейс · Снайперские дропы",tone:"ice",items:[{name:"Снайперский выстрел",price:299},{name:"AWP | охота",price:699},{name:"AWP | элитный прицел",price:1499},{name:"AWP | легендарный",price:3999},{name:"AWP | джекпот",price:8999}]},
 {name:"Knife Rush",subtitle:"Премиум-кейс · Ножи",tone:"gold",items:[{name:"Острый старт",price:999},{name:"Клинок удачи",price:2499},{name:"Ножевой азарт",price:4999},{name:"Золотой клинок",price:9999},{name:"Тайный нож",price:19999}]},
 {name:"Glove Drop",subtitle:"Премиум-кейс · Перчатки",tone:"pink",items:[{name:"Перчаточный старт",price:799},{name:"Тактический хват",price:1999},{name:"Профи-перчатки",price:4499},{name:"Элитный стиль",price:8999},{name:"Перчатки мечты",price:17999}]},
 {name:"Mystery Jackpot",subtitle:"Риск-кейс · Редкие дропы",tone:"violet",items:[{name:"Секретный шанс",price:499},{name:"Тёмная лошадка",price:1299},{name:"Ва-банк",price:2999},{name:"Большой куш",price:6999},{name:"Мистический джекпот",price:14999}]}
];
const nav = [{label:"Главная",icon:Home},{label:"Кейсы",icon:Package},{label:"Перекраска",icon:Paintbrush},{label:"Апгрейд",icon:Zap},{label:"Контракт",icon:Swords},{label:"Батл Пас",icon:Trophy},{label:"Инвентарь",icon:Wallet},{label:"Профиль",icon:UserRound},{label:"История",icon:ArrowLeftRight}];
const fmt=(n:number)=>new Intl.NumberFormat("ru-RU").format(n);
const taskIcons=[Swords,Trophy,Target,Package,Sparkles];
export default function HomePage(){
 const [active,setActive]=useState("Главная"),[balance,setBalance]=useState(10000),[inventory,setInventory]=useState<Item[]>([]),[search,setSearch]=useState(""),[min,setMin]=useState(""),[max,setMax]=useState(""),[mobile,setMobile]=useState(false),[notice,setNotice]=useState(""),[opened,setOpened]=useState<Item|null>(null);
 const [selected,setSelected]=useState<number[]>([]),[target,setTarget]=useState(2),[paint,setPaint]=useState("Ruby"),[upgradeSpinning,setUpgradeSpinning]=useState(false),[upgradeRoll,setUpgradeRoll]=useState<Item[]>([]),[upgradeOutcome,setUpgradeOutcome]=useState<"win"|"lose"|null>(null),[upgradeRollId,setUpgradeRollId]=useState(0),[history,setHistory]=useState<string[]>([]),[claimed,setClaimed]=useState<number[]>([]),[stars,setStars]=useState(0),[nickname,setNickname]=useState("Demo Player");
 const [userId,setUserId]=useState<string|null>(null),[authEmail,setAuthEmail]=useState(""),[authPassword,setAuthPassword]=useState(""),[authMode,setAuthMode]=useState<"login"|"signup">("login"),[authOpen,setAuthOpen]=useState(false),[authBusy,setAuthBusy]=useState(false),[authError,setAuthError]=useState(""),[authMessage,setAuthMessage]=useState(""),[stateLoaded,setStateLoaded]=useState(false);

 useEffect(()=>{
  if(!notice)return;
  const timer=window.setTimeout(()=>setNotice(""),3600);
  return ()=>window.clearTimeout(timer);
 },[notice]);
 useEffect(()=>{
  if(!supabase){setAuthError("Supabase не настроен. Проверь переменные окружения Vercel.");return;}
  let alive=true;
  const loadUserState=async(id:string)=>{
   setStateLoaded(false);
   const {data,error}=await supabase.from("player_state").select("*").eq("user_id",id).maybeSingle();
   if(!alive)return;
   if(error){setNotice("Не удалось загрузить сохранение: "+error.message);setStateLoaded(true);return;}
   if(data){
    setNickname(data.nickname??"Demo Player");
    setBalance(Number(data.balance??10000));
    setInventory(Array.isArray(data.inventory)?data.inventory:[]);
    setHistory(Array.isArray(data.history)?data.history:[]);
    setStars(Number(data.stars??0));
    setClaimed(Array.isArray(data.claimed_tasks)?data.claimed_tasks:[]);
    setNotice("Прогресс загружен из облачного сохранения.");
   }else{
    const {error:insertError}=await supabase.from("player_state").insert({user_id:id,nickname:"Demo Player",balance:10000,inventory:[],history:[],stars:0,claimed_tasks:[]});
    if(insertError&&alive)setNotice("Не удалось создать сохранение: "+insertError.message);
   }
   if(alive)setStateLoaded(true);
  };
  supabase.auth.getSession().then(({data})=>{
   if(!alive)return;
   const user=data.session?.user;
   setUserId(user?.id??null);
   setAuthEmail(user?.email??"");
   if(user)void loadUserState(user.id);else setStateLoaded(false);
  });
  const {data:listener}=supabase.auth.onAuthStateChange((_event,session)=>{
   if(!alive)return;
   const user=session?.user;
   setUserId(user?.id??null);
   setAuthEmail(user?.email??"");
   if(user)void loadUserState(user.id);else setStateLoaded(false);
  });
  return ()=>{alive=false;listener.subscription.unsubscribe();};
 },[]);
 useEffect(()=>{
  if(!supabase||!userId||!stateLoaded)return;
  const timer=window.setTimeout(async()=>{
   const {error}=await supabase.from("player_state").upsert({
    user_id:userId,nickname,balance,inventory,history,stars,claimed_tasks:claimed,updated_at:new Date().toISOString()
   },{onConflict:"user_id"});
   if(error)setNotice("Ошибка сохранения: "+error.message);
  },500);
  return ()=>window.clearTimeout(timer);
 },[userId,stateLoaded,nickname,balance,inventory,history,stars,claimed]);
 async function submitAuth(){
  if(!supabase){setAuthError("Supabase не подключён. Проверь настройки проекта.");return;}
  if(!authEmail.trim()||!authPassword){setAuthError("Введи электронную почту и пароль.");return;}
  if(authPassword.length<6){setAuthError("Пароль должен содержать минимум 6 символов.");return;}
  setAuthBusy(true);setAuthError("");setAuthMessage("");
  try{
   if(authMode==="signup"){
    const {data,error}=await supabase.auth.signUp({email:authEmail.trim(),password:authPassword});
    if(error)throw error;
    if(data.session){setAuthOpen(false);setAuthPassword("");setNotice("Аккаунт создан. Добро пожаловать!");}
    else setAuthMessage("Аккаунт создан. Проверь почту и подтверди регистрацию, затем войди.");
   }else{
    const {error}=await supabase.auth.signInWithPassword({email:authEmail.trim(),password:authPassword});
    if(error)throw error;
    setAuthOpen(false);setAuthPassword("");setNotice("Вход выполнен. Загружаем твой прогресс.");
   }
  }catch(e){setAuthError(e instanceof Error?e.message:"Не удалось выполнить вход.");}
  finally{setAuthBusy(false);}
 }
 async function signOut(){
  if(!supabase)return;
  await supabase.auth.signOut();setAuthOpen(false);setNotice("Ты вышел из аккаунта. Демо-просмотр доступен без входа.");
 }
 const tasks=[{name:"Сыграй один матч",desc:"Отметь выполнение демо-задания",reward:10},{name:"Одержи победу",desc:"Получить победу в матче",reward:15},{name:"Сделай 10 убийств",desc:"Набери 10 фрагов",reward:20},{name:"Открой любой кейс",desc:"Один открытый контейнер",reward:10},{name:"Собери контракт",desc:"Создай новый предмет",reward:25}];
 const paintColors=["Ruby","Emerald","Sapphire","Black Pearl","Golden"];
 const visible=useMemo(()=>collections.map(c=>({...c,items:c.items.filter(i=>i.name.toLowerCase().includes(search.toLowerCase())&&(!min||i.price>=Number(min))&&(!max||i.price<=Number(max)))})).filter(c=>c.items.length),[search,min,max]);
 function record(label:string){setHistory(v=>[new Date().toLocaleString("ru-RU")+" — "+label,...v]);}
 function addPrize(item:Item,label:string){setInventory(v=>[item,...v]);setOpened(item);record(label);}
 function open(item:Item){if(balance<item.price){setNotice("Недостаточно BROCOIN для открытия.");return;}setBalance(v=>v-item.price);const prize={name:item.name+" · виртуальный предмет",price:Math.max(25,Math.round(item.price*(0.5+Math.random()*2)))};addPrize(prize,"Открытие: "+item.name);setNotice("Открытие завершено! Предмет добавлен в демо-инвентарь.");}
 function toggleSelect(i:number){setSelected(v=>v.includes(i)?v.filter(x=>x!==i):v.length<10?[...v,i]:v);}
 function doContract(){if(selected.length!==10){setNotice("Для контракта выбери ровно 10 предметов.");return;}const chosen=selected.map(i=>inventory[i]);const cost=chosen.reduce((n,x)=>n+x.price,0);const prize={name:"Контракт · "+["AK-47","AWP","M4A1-S","Нож"][Math.floor(Math.random()*4)]+" (виртуальный)",price:Math.round(cost*(0.85+Math.random()*0.7))};setInventory(v=>[prize,...v.filter((_,i)=>!selected.includes(i))]);setSelected([]);setOpened(prize);record("Контракт на 10 предметов");setNotice("Контракт успешно создан в демо-режиме.");}
 function doUpgrade(){
   const source=inventory[selected[0]];
   if(!source){setNotice("Сначала выбери предмет из инвентаря.");return;}
   if(upgradeSpinning)return;
   const price=Math.round(source.price*target);
   const chance=Math.max(5,Math.min(85,Math.round(70/target)));
   const success=Math.random()*100<chance;
   const prize={name:"Апгрейд · "+["AK-47 | элитный дроп","AWP | редкий прицел","Нож | виртуальный дроп","Перчатки | премиум"][Math.floor(Math.random()*4)],price};
   const pool=[...inventory.filter((_,i)=>i!==selected[0]),...collections.flatMap(x=>x.items)].filter(x=>x.price>0);
   const tiles=Array.from({length:13},(_,i)=>{
    if(i===12)return success?prize:{name:"Попытка не удалась",price:0};
    return pool[Math.floor(Math.random()*pool.length)]??{name:"Случайный дроп",price:100};
   });
   setUpgradeRoll(tiles);setUpgradeOutcome(success?"win":"lose");setUpgradeRollId(v=>v+1);setUpgradeSpinning(true);
   window.setTimeout(()=>{
    if(success){setInventory(v=>[prize,...v.filter((_,i)=>i!==selected[0])]);setOpened(prize);record("Успешный апгрейд · x"+target);setNotice("Апгрейд успешен! Новый предмет добавлен в инвентарь.");}
    else{setInventory(v=>v.filter((_,i)=>i!==selected[0]));record("Неудачный апгрейд · x"+target);setNotice("Рулетка остановилась на неудаче. Предмет использован.");}
    setSelected([]);setUpgradeSpinning(false);
   },3600);
  }function doPaint(){const source=inventory[selected[0]];if(!source){setNotice("Выбери предмет для перекраски.");return;}const cost=Math.max(25,Math.round(source.price*.15));if(balance<cost){setNotice("Недостаточно BROCOIN для перекраски.");return;}setBalance(v=>v-cost);const prize={name:source.name.split(" — ")[0]+" — "+paint+" (перекраска)",price:source.price};setInventory(v=>v.map((x,i)=>i===selected[0]?prize:x));setSelected([]);record("Перекраска в "+paint);setNotice("Предмет перекрашен!");}
 function claimTask(i:number){if(claimed.includes(i))return;setClaimed(v=>[...v,i]);setStars(v=>v+tasks[i].reward);setBalance(v=>v+tasks[i].reward*5);record("Получена награда задания: "+tasks[i].name);setNotice("Награда начислена: "+tasks[i].reward+" звёзд и "+tasks[i].reward*5+" BC.");}
 const go=(s:string)=>{setActive(s);setMobile(false);setOpened(null);setSelected([]);window.scrollTo({top:0,behavior:"smooth"});};
 return <main className="app">
  <div className="demo-bar"><ShieldCheck size={14}/> ДЕМО-ВЕРСИЯ <span>Только виртуальные монеты и предметы · без платежей и вывода</span></div>
  <header className="header"><button className="mobile-menu" onClick={()=>setMobile(!mobile)} aria-label="Открыть меню">{mobile?<X/>:<Menu/>}</button><button className="logo" onClick={()=>go("Главная")}><span className="logo-mark">S</span><span>SKINBRO<small>BC</small></span></button><nav className="top-nav">{nav.slice(0,6).map(n=><button className={active===n.label?"chosen":""} key={n.label} onClick={()=>go(n.label)}><n.icon size={15}/><span>{n.label}</span></button>)}</nav><div className="header-right"><div className="wallet"><Coins size={17}/><b>{fmt(balance)}</b><small>BC</small></div><button className="user" onClick={()=>{setAuthOpen(true);setAuthError("");setAuthMessage("");}}>{userId?<><UserRound size={16}/>{authEmail.split("@")[0]||"Аккаунт"}</>:<>Войти <ChevronDown size={14}/></>}</button></div>{mobile&&<nav className="mobile-nav"><div className="mobile-nav-head"><b>Навигация</b><span>SKINBRO DEMO</span></div>{nav.map(n=><button className={active===n.label?"chosen":""} key={n.label} onClick={()=>go(n.label)}><n.icon size={17}/>{n.label}<ArrowUpRight size={14}/></button>)}<button className="mobile-account" onClick={()=>{setAuthOpen(true);setMobile(false);}}><UserRound size={17}/>{userId?"Аккаунт и сохранения":"Войти / регистрация"}</button></nav>}</header>
  {active==="Главная"||active==="Кейсы"?<><div className="subnav"><span>SKINBRO DEMO</span><span>Главная</span><span>›</span><b>{active==="Главная"?"Операция CS2":"Кейсы CS2"}</b></div>
  {active==="Главная"?<><section className="operation-hero"><div className="operation-copy"><div className="season-tag"><i/> НОВАЯ ОПЕРАЦИЯ</div><h1>Играй в CS2<br/><em>Побеждай. Получай скины.</em></h1><p>Открывай редкие коллекции, собирай предметы и выполняй задания. Каждый запуск — новый шанс пополнить свою коллекцию.</p><div className="hero-actions"><button className="lime-btn" onClick={()=>go("Батл Пас")}>Получить скины <span>↗</span></button><button className="outline-btn" onClick={()=>go("Кейсы")}>Открыть кейсы</button></div><div className="operation-points"><span>✦ Еженедельные награды</span><span>✦ Коллекции CS2</span><span>✦ Демо-режим</span></div></div><div className="operation-visual"><div className="season-orbit orbit-a"/><div className="season-orbit orbit-b"/><div className="gem gem-ruby">◆</div><div className="gem gem-emerald">◆</div><div className="gem gem-sapphire">◆</div><div className="season-title">SPRING<br/><b>SPECTRUM</b><small>OPERATION · DEMO</small></div></div><div className="season-bottom"><span>ОПЕРАЦИЯ CS2 · SPRING SPECTRUM</span><span>СЕЗОН DEMO <b>01</b></span></div></section>
  <section className="featured-section"><div className="section-title"><div><small>ВЫБИРАЙ СВОЙ ДРОП</small><h2>Популярные контейнеры</h2></div><button onClick={()=>go("Кейсы")}>Все кейсы <ArrowUpRight size={14}/></button></div><div className="featured-grid">{collections.slice(0,5).map((c,i)=><article className={"featured-card "+c.tone} key={c.name} onClick={()=>go("Кейсы")}><div className="featured-art"><span>{["◈","✦","◉","✧","⬡"][i]}</span></div><small>{c.subtitle}</small><h3>{c.name}</h3><b>от {fmt(Math.min(...c.items.map(x=>x.price)))} <small>BC</small></b></article>)}</div></section><section className="home-quick"><div className="section-title"><div><small>ТВОЙ ПРОФИЛЬ И ИНСТРУМЕНТЫ</small><h2>Быстрый доступ</h2></div></div><div className="quick-grid"><button className="quick-card" onClick={()=>go("Инвентарь")}><span className="quick-icon"><Wallet size={21}/></span><span className="quick-copy"><b>Инвентарь</b><small>{inventory.length} предметов · твоя коллекция</small></span><ArrowUpRight size={17}/></button><button className="quick-card" onClick={()=>go("Апгрейд")}><span className="quick-icon purple"><Zap size={21}/></span><span className="quick-copy"><b>Апгрейд</b><small>Проверь удачу и улучши скин</small></span><ArrowUpRight size={17}/></button><button className="quick-card" onClick={()=>go("Перекраска")}><span className="quick-icon blue"><Paintbrush size={21}/></span><span className="quick-copy"><b>Перекраска</b><small>Добавь предметам новый облик</small></span><ArrowUpRight size={17}/></button><button className="quick-card" onClick={()=>go("Батл Пас")}><span className="quick-icon gold"><Trophy size={21}/></span><span className="quick-copy"><b>Battle Pass</b><small>{stars} звёзд · задания и награды</small></span><ArrowUpRight size={17}/></button></div></section><section className="home-footer-strip"><div><span className="live-dot"></span><b>Демо-режим активен</b><small>Только виртуальные монеты и предметы</small></div><button onClick={()=>go("Профиль")}>Мой профиль <ArrowUpRight size={14}/></button></section></>:<section className="store"><div className="store-heading"><div><small>МАГАЗИН SKINBRO DEMO</small><h1>Кейсы CS2</h1><p>Открывай коллекции CS2/CS:GO за BROCOIN — валюту игрового мира SKINBRO.</p></div><div className="store-count"><b>{collections.length}</b><span>КОЛЛЕКЦИЙ</span></div></div><div className="store-tools"><label><Search size={17}/><input placeholder="Поиск контейнера..." value={search} onChange={e=>setSearch(e.target.value)}/></label><label className="price-filter"><span>От</span><input inputMode="numeric" placeholder="0" value={min} onChange={e=>setMin(e.target.value)}/></label><label className="price-filter"><span>До</span><input inputMode="numeric" placeholder="∞" value={max} onChange={e=>setMax(e.target.value)}/></label><button className="filter-reset" onClick={()=>{setSearch("");setMin("");setMax("");}}>Сбросить</button></div><div className="availability"><span><i/> Доступно</span><span>{visible.reduce((n,c)=>n+c.items.length,0)} контейнеров</span></div>{visible.map(c=><section className="collection" key={c.name}><div className={"collection-banner "+c.tone}><div className="collection-symbol">✦</div><div><small>{c.subtitle}</small><h2>{c.name}</h2></div><span>{c.items.length} предметов</span></div><div className="item-grid">{c.items.map((item,i)=><article className="store-item" key={item.name}><div className={"item-art "+c.tone}><span>{["◈","✦","◇","⬡","✧"][i%5]}</span><small>SKINBRO</small></div><div className="item-info"><b>{item.name}</b><div><strong>{fmt(item.price)}</strong><small>BC</small></div><button onClick={()=>open(item)}>Открыть <span>→</span></button></div></article>)}</div></section>)}</section>}</>:<section className="other-page"><div className="other-heading"><div><small>SKINBRO DEMO · ЛИЧНЫЙ КАБИНЕТ</small><h1>{active}</h1><p>Играй, собирай коллекцию и управляй своими предметами в безопасном демо-режиме.</p></div><div className="other-balance"><Coins size={17}/><b>{fmt(balance)}</b><small>BC</small></div></div>
 {active==="Инвентарь"&&<><div className="tool-row"><span>Предметов: <b>{inventory.length}</b></span><button onClick={()=>go("Кейсы")}>Открыть кейсы →</button></div>{inventory.length?<div className="item-grid">{inventory.map((item,i)=><article className={"store-item selectable "+(selected.includes(i)?"selected":"")} key={i} onClick={()=>toggleSelect(i)}><div className="item-art spectrum"><span>✦</span></div><div className="item-info"><b>{item.name}</b><div><strong>{fmt(item.price)}</strong><small>BC</small></div><button onClick={e=>{e.stopPropagation();setInventory(v=>v.filter((_,j)=>j!==i));setNotice("Предмет удалён из демо-инвентаря.");}}>Удалить</button></div></article>)}</div>:<div className="empty-state"><Package size={38}/><h3>Инвентарь пока пуст</h3><p>Открой контейнер, чтобы получить первые виртуальные предметы.</p><button className="lime-btn" onClick={()=>go("Кейсы")}>Перейти в магазин</button></div>}</>}
 {active==="Контракт"&&<><div className="mode-panel"><div><small>TRADE UP CONTRACT</small><h2>Создай новый предмет из 10 скинов</h2><p>Выбери десять предметов из инвентаря. Их стоимость формирует ориентир стоимости результата.</p></div><div className="contract-slots">{Array.from({length:10},(_,i)=><div className={selected[i]!==undefined?"filled":""} key={i}>{selected[i]!==undefined?"✦":"+"}</div>)}</div><button className="lime-btn" disabled={selected.length!==10} onClick={doContract}>Создать контракт · {selected.length}/10</button></div>{inventory.length?<div className="item-grid">{inventory.map((item,i)=><article className={"store-item selectable "+(selected.includes(i)?"selected":"")} key={i} onClick={()=>toggleSelect(i)}><div className="item-art spectrum"><span>✦</span></div><div className="item-info"><b>{item.name}</b><div><strong>{fmt(item.price)}</strong><small>BC</small></div><button>{selected.includes(i)?"Выбрано":"Добавить"}</button></div></article>)}</div>:<p className="muted">Сначала получи предметы, открыв кейсы.</p>}</>}
 {active==="Апгрейд"&&<><div className="mode-panel upgrade-panel"><div className="upgrade-panel-head"><div><small>✦ BROCOIN UPGRADE LAB</small><h2>Рискни. Прокрути. Забери дроп.</h2><p>Выбери предмет и множитель. Рулетка покажет результат апгрейда в реальном времени.</p></div><div className="upgrade-emblem"><Zap size={28}/><span>BC</span></div></div><div className="multiplier-row">{[1.25,2,3,5,10].map(n=><button className={target===n?"active":""} key={n} onClick={()=>{if(!upgradeSpinning)setTarget(n);}}>{n}x</button>)}</div><div className="upgrade-odds"><span>Цель <b>x{target}</b></span><span>Шанс <b>{Math.max(5,Math.min(85,Math.round(70/target)))}%</b></span><span>Цена цели <b>{selected.length&&inventory[selected[0]]?fmt(Math.round(inventory[selected[0]].price*target))+" BC":"—"}</b></span></div><div className={"upgrade-roulette "+(upgradeSpinning?"is-spinning":"")+(upgradeOutcome==="win"&&!upgradeSpinning?" is-win":"")+(upgradeOutcome==="lose"&&!upgradeSpinning?" is-lose":"")}><div className="roulette-label"><span>ROLL THE DROP</span><b>{upgradeSpinning?"ПРОКРУТКА...":upgradeOutcome==="win"?"УСПЕШНЫЙ ДРОП":upgradeOutcome==="lose"?"НЕ ПОВЕЗЛО":"ГОТОВ К ЗАПУСКУ"}</b></div><div className="roulette-window"><div className="roulette-marker"/><div className="roulette-track" key={upgradeRollId} style={{transform:upgradeRoll.length?"translateX(calc(50% - 12 * 122px - 56px))":"translateX(0)",transition:upgradeSpinning?"transform 3.45s cubic-bezier(.08,.72,.12,1)":"none"}}>{(upgradeRoll.length?upgradeRoll:Array.from({length:13},(_,i)=>({name:["AK-47","AWP","Нож","Перчатки","Редкий дроп"][i%5],price:250+i*180}))).map((item,i)=><div className={"roulette-tile "+(i===12?"roulette-final":"")} key={i}><span>{i%4===0?"◆":i%4===1?"✦":i%4===2?"◈":"⬡"}</span><b>{item.name}</b><small>{item.price?fmt(item.price)+" BC":"—"}</small></div>)}</div></div><div className="roulette-caption"><span>СТАРТ</span><span>ЦЕНТРАЛЬНЫЙ УКАЗАТЕЛЬ</span><span>ФИНИШ</span></div></div><button className="lime-btn upgrade-launch" disabled={!selected.length||!inventory[selected[0]]||upgradeSpinning} onClick={doUpgrade}>{upgradeSpinning?"Рулетка вращается...":"Запустить уникальную рулетку"}</button></div><h3 className="subheading">Выбери предмет для апгрейда</h3>{inventory.length?<div className="item-grid">{inventory.map((item,i)=><article className={"store-item selectable "+(selected[0]===i?"selected":"")} key={i} onClick={()=>setSelected([i])}><div className="item-art spectrum"><span>✦</span></div><div className="item-info"><b>{item.name}</b><div><strong>{fmt(item.price)}</strong><small>BC</small></div><button>{selected[0]===i?"Выбрано":"Выбрать"}</button></div></article>)}</div>:<p className="muted">В инвентаре пока нет предметов.</p>}</>}
 {active==="Перекраска"&&<><div className="mode-panel"><small>SKIN REPAINT · DEMO</small><h2>Выбери новый цвет скина</h2><p>Перекраска изменяет название и оформление виртуального предмета. Стоимость — 15% от его демо-цены.</p><div className="paint-options">{paintColors.map(color=><button className={paint===color?"active":""} key={color} onClick={()=>setPaint(color)}>{color}</button>)}</div><button className="lime-btn" disabled={!selected.length||!inventory[selected[0]]} onClick={doPaint}>Перекрасить выбранный предмет</button></div><h3 className="subheading">Мои предметы</h3>{inventory.length?<div className="item-grid">{inventory.map((item,i)=><article className={"store-item selectable "+(selected[0]===i?"selected":"")} key={i} onClick={()=>setSelected([i])}><div className="item-art spectrum"><span>◈</span></div><div className="item-info"><b>{item.name}</b><div><strong>{fmt(item.price)}</strong><small>BC</small></div><button>{selected[0]===i?"Выбрано":"Выбрать"}</button></div></article>)}</div>:<p className="muted">Список пуст — сначала открой кейс.</p>}</>}
 {active==="Батл Пас"&&<><div className="pass-hero"><div><small>OPERATION · SPRING SPECTRUM</small><h2>Боевой пропуск</h2><p>Выполняй задания, собирай звёзды и получай виртуальные награды.</p><b>{stars} <small>ЗВЁЗД</small></b></div><div className="pass-crystal">✦</div></div><div className="pass-tabs"><span className="active">Задания</span><span>Награды</span><span>Аукционы · DEMO</span><span>Рефералы · DEMO</span></div><div className="task-list">{tasks.map((task,i)=><article className="task-card" key={task.name}><div className="task-icon">{(()=>{const TaskIcon=taskIcons[i];return <TaskIcon size={19}/>})()}</div><div className="task-copy"><b>{task.name}</b><p>{task.desc}</p><small>Награда: {task.reward} звёзд</small></div><div className="task-progress">{claimed.includes(i)?"Выполнено":"0 / 1"}</div><button className={claimed.includes(i)?"claimed":""} disabled={claimed.includes(i)} onClick={()=>claimTask(i)}>{claimed.includes(i)?"Получено":"Забрать"}</button></article>)}</div><p className="demo-note">Задания здесь демонстрационные: прогресс не синхронизируется со Steam, Faceit или игровыми матчами.</p></>}
 {active==="Профиль"&&<><div className="profile-card"><div className="profile-avatar"><UserRound size={35}/></div><div><small>DEMO ACCOUNT</small><h2>{nickname}</h2><p>Локальный профиль · без авторизации Steam</p></div></div><div className="profile-settings"><label>Имя профиля<input value={nickname} onChange={e=>setNickname(e.target.value)} maxLength={24}/></label><div><span>Баланс</span><b>{fmt(balance)} BC</b></div><div><span>Предметов в инвентаре</span><b>{inventory.length}</b></div><div><span>Звёзды операции</span><b>{stars}</b></div><button className="dark-btn" onClick={()=>{setBalance(10000);setInventory([]);setHistory([]);setSelected([]);setStars(0);setClaimed([]);setNotice("Демо-профиль сброшен. Баланс восстановлен.");}}>Сбросить демо-прогресс</button></div></>}
 {active==="История"&&<div className="history-list"><h2>История операций</h2>{history.length?history.map((entry,i)=><div key={i}><span>◷</span>{entry}</div>):<p>Пока нет операций. Открой кейс или попробуй режимы.</p>}</div>}
 <div className="other-links"><button onClick={()=>go("Кейсы")}>Магазин кейсов</button><button onClick={()=>go("Инвентарь")}>Мой инвентарь</button><button onClick={()=>go("История")}>История операций</button><button onClick={()=>go("Профиль")}>Профиль</button></div>
 </section>}
  {authOpen&&<div className="result-modal auth-overlay"><div className="auth-card"><button className="modal-close" onClick={()=>setAuthOpen(false)}><X/></button><div className="auth-brand"><span className="logo-mark">S</span><b>SKINBRO <small>BC</small></b></div>{userId?<><h2>Аккаунт подключён</h2><p className="auth-subtitle">{authEmail}</p><p className="auth-cloud"><ShieldCheck size={16}/> Облачное сохранение активно</p><button className="lime-btn auth-submit" onClick={()=>{setAuthOpen(false);go("Профиль");}}>Открыть профиль</button><button className="auth-secondary" onClick={signOut}>Выйти из аккаунта</button></>:<><h2>{authMode==="login"?"Вход в аккаунт":"Создать аккаунт"}</h2><p className="auth-subtitle">Сохраняй баланс, инвентарь и историю между посещениями.</p><label className="auth-label">Электронная почта<input type="email" autoComplete="email" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="you@example.com"/></label><label className="auth-label">Пароль<input type="password" autoComplete={authMode==="login"?"current-password":"new-password"} value={authPassword} onChange={e=>setAuthPassword(e.target.value)} placeholder="Минимум 6 символов"/></label>{authError&&<p className="auth-error">{authError}</p>}{authMessage&&<p className="auth-message">{authMessage}</p>}<button className="lime-btn auth-submit" disabled={authBusy} onClick={submitAuth}>{authBusy?"Подожди...":authMode==="login"?"Войти":"Зарегистрироваться"}</button><button className="auth-switch" onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setAuthError("");setAuthMessage("");}}>{authMode==="login"?"Нет аккаунта? Зарегистрироваться":"Уже есть аккаунт? Войти"}</button><p className="auth-footnote">Только демо-аккаунт SKINBRO. Не используй пароль от Steam или других сервисов.</p></>}</div></div>}
  <nav className="mobile-dock" aria-label="Быстрая навигация">{[{label:"Главная",icon:Home},{label:"Кейсы",icon:Package},{label:"Инвентарь",icon:Wallet},{label:"Апгрейд",icon:Zap},{label:"Профиль",icon:UserRound}].map(n=><button className={active===n.label?"active":""} key={n.label} onClick={()=>go(n.label)}><n.icon size={19}/><span>{n.label}</span></button>)}</nav>
  {notice&&<div className="toast"><ShieldCheck size={16}/>{notice}<button onClick={()=>setNotice("")}><X size={15}/></button></div>}
  {opened&&<div className="result-modal"><div className="result-card"><button className="modal-close" onClick={()=>setOpened(null)}><X/></button><small>ТВОЙ ДЕМО-ДРОП</small><div className="result-gem">✦</div><h2>{opened.name}</h2><b>{fmt(opened.price)} BC</b><p>Предмет добавлен в виртуальный инвентарь.</p><button className="lime-btn" onClick={()=>{setOpened(null);go("Инвентарь")}}>В инвентарь</button></div></div>}
  <footer><div className="footer-brand"><span className="logo-mark">S</span><b>SKINBRO BC</b></div><span>© 2026 SKINBRO DEMO · Независимый демонстрационный проект</span><span><CircleHelp size={14}/> Только виртуальная экономика</span></footer>
 </main>;
}
