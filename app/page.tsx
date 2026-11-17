"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
import { ArrowLeftRight, ArrowUpRight, ChevronDown, CircleHelp, Coins, Home, Menu, Package, Paintbrush, Search, ShieldCheck, Sparkles, Swords, Target, Trophy, UserRound, Wallet, X, Zap } from "lucide-react";

type Item = { name: string; price: number; image?: string; rarity?: string; rarityColor?: string };
type Collection = { name: string; subtitle: string; tone: string; price: number; image?: string; items: Item[] };
const collections: Collection[] = [
 {name:"Fever Case",subtitle:"Оружейный кейс · 2025",tone:"red",price:129,items:[]},
 {name:"Gallery Case",subtitle:"Оружейный кейс · 2024",tone:"violet",price:119,items:[]},
 {name:"Kilowatt Case",subtitle:"Оружейный кейс · 2024",tone:"blue",price:109,items:[]},
 {name:"Revolution Case",subtitle:"Оружейный кейс · 2023",tone:"pink",price:99,items:[]},
 {name:"Dreams & Nightmares Case",subtitle:"Оружейный кейс · 2022",tone:"green",price:149,items:[]},
 {name:"Recoil Case",subtitle:"Оружейный кейс · 2022",tone:"orange",price:89,items:[]},
 {name:"Glove Case",subtitle:"Оружейный кейс · 2016",tone:"gold",price:199,items:[]},
 {name:"Clutch Case",subtitle:"Оружейный кейс · 2018",tone:"pink",price:119,items:[]},
 {name:"Prisma 2 Case",subtitle:"Оружейный кейс · 2020",tone:"ice",price:109,items:[]},
 {name:"Snakebite Case",subtitle:"Оружейный кейс · 2021",tone:"sand",price:89,items:[]},
 {name:"Fracture Case",subtitle:"Оружейный кейс · 2020",tone:"wolf",price:99,items:[]},
 {name:"Danger Zone Case",subtitle:"Оружейный кейс · 2018",tone:"blue",price:99,items:[]}
];
const nav = [{label:"Главная",icon:Home},{label:"Кейсы",icon:Package},{label:"Перекраска",icon:Paintbrush},{label:"Апгрейд",icon:Zap},{label:"Контракт",icon:Swords},{label:"Батл Пас",icon:Trophy},{label:"Инвентарь",icon:Wallet},{label:"Профиль",icon:UserRound},{label:"История",icon:ArrowLeftRight}];
const fmt=(n:number)=>new Intl.NumberFormat("ru-RU").format(n);
const taskIcons=[Swords,Trophy,Target,Package,Sparkles];
export default function HomePage(){
 const [active,setActive]=useState("Главная"),[realCollections,setRealCollections]=useState<Collection[]>(collections),[balance,setBalance]=useState(10000),[inventory,setInventory]=useState<Item[]>([]),[search,setSearch]=useState(""),[min,setMin]=useState(""),[max,setMax]=useState(""),[mobile,setMobile]=useState(false),[notice,setNotice]=useState(""),[opened,setOpened]=useState<Item|null>(null);
 const [selected,setSelected]=useState<number[]>([]),[target,setTarget]=useState(2),[paint,setPaint]=useState("Ruby"),[upgradeSpinning,setUpgradeSpinning]=useState(false),[upgradeRoll,setUpgradeRoll]=useState<Item[]>([]),[upgradeOutcome,setUpgradeOutcome]=useState<"win"|"lose"|null>(null),[upgradeRollId,setUpgradeRollId]=useState(0),[wheelRotation,setWheelRotation]=useState(0),[upgradeWinnerIndex,setUpgradeWinnerIndex]=useState(0),[history,setHistory]=useState<string[]>([]),[claimed,setClaimed]=useState<number[]>([]),[stars,setStars]=useState(0),[nickname,setNickname]=useState("Demo Player");
 const [userId,setUserId]=useState<string|null>(null),[authEmail,setAuthEmail]=useState(""),[authPassword,setAuthPassword]=useState(""),[authMode,setAuthMode]=useState<"login"|"signup">("login"),[authOpen,setAuthOpen]=useState(false),[authBusy,setAuthBusy]=useState(false),[authError,setAuthError]=useState(""),[authMessage,setAuthMessage]=useState(""),[stateLoaded,setStateLoaded]=useState(false);

 useEffect(()=>{
  let alive=true;
  fetch("https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/crates.json")
   .then(r=>{if(!r.ok)throw new Error("CS2 catalog unavailable");return r.json();})
   .then((rows: any[])=>{
    if(!alive)return;
    const next=collections.map(base=>{
     const found=rows.find(crate=>crate.type==="Case"&&crate.name===base.name);
     const drops=Array.isArray(found?.contains)?found.contains:[];
     return {...base,image:found?.image,items:drops.map((drop:any,index:number)=>({
      name:drop.name, image:drop.image, rarity:drop.rarity?.name??"Skin", rarityColor:drop.rarity?.color??"#6b8fc7",
      price:drop.rarity?.name==="Covert"?950+index*15:drop.rarity?.name==="Classified"?420+index*9:drop.rarity?.name==="Restricted"?180+index*5:70+index*3
     }))};
    });
    setRealCollections(next.filter(c=>c.items.length>0));
   })
   .catch(()=>{ if(alive)setNotice("Не удалось загрузить каталог CS2. Попробуй обновить страницу."); });
  return ()=>{alive=false;};
 },[]);
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
 const visible=useMemo(()=>realCollections.map(c=>({...c,items:c.items.filter(i=>i.name.toLowerCase().includes(search.toLowerCase())&&(!min||i.price>=Number(min))&&(!max||i.price<=Number(max)))})).filter(c=>c.items.length),[search,min,max,realCollections]);
 function record(label:string){setHistory(v=>[new Date().toLocaleString("ru-RU")+" — "+label,...v]);}
 function addPrize(item:Item,label:string){setInventory(v=>[item,...v]);setOpened(item);record(label);}
 function openCase(collection:Collection){
  if(!collection.items.length){setNotice("Содержимое кейса ещё загружается.");return;}
  if(balance<collection.price){setNotice("Недостаточно BROCOIN для открытия кейса.");return;}
  const drop=collection.items[Math.floor(Math.random()*collection.items.length)];
  setBalance(v=>v-collection.price);
  const prize={...drop,price:Math.max(25,drop.price),name:drop.name};
  addPrize(prize,"Открытие "+collection.name+" → "+drop.name);
  setNotice("Кейс открыт! Реальный скин CS2 добавлен в демо-инвентарь.");
 }
 function toggleSelect(i:number){setSelected(v=>v.includes(i)?v.filter(x=>x!==i):v.length<10?[...v,i]:v);}
 function doContract(){if(selected.length!==10){setNotice("Для контракта выбери ровно 10 предметов.");return;}const chosen=selected.map(i=>inventory[i]);const cost=chosen.reduce((n,x)=>n+x.price,0);const prize={name:"Контракт · "+["AK-47","AWP","M4A1-S","Нож"][Math.floor(Math.random()*4)]+" (виртуальный)",price:Math.round(cost*(0.85+Math.random()*0.7))};setInventory(v=>[prize,...v.filter((_,i)=>!selected.includes(i))]);setSelected([]);setOpened(prize);record("Контракт на 10 предметов");setNotice("Контракт успешно создан в демо-режиме.");}
 function doUpgrade(){
   const source=inventory[selected[0]];
   if(!source){setNotice("Сначала выбери предмет из инвентаря.");return;}
   if(upgradeSpinning)return;
   const price=Math.round(source.price*target);
   const chance=Math.max(5,Math.min(85,Math.round(70/target)));
   const success=Math.random()*100<chance;
   const pool=[...inventory.filter((_,i)=>i!==selected[0]),...realCollections.flatMap(x=>x.items)].filter(x=>x.price>0&&x.image);
   const eligible=pool.filter(x=>x.price>=price);
   const prize=eligible[Math.floor(Math.random()*eligible.length)]??pool[Math.floor(Math.random()*pool.length)]??{name:"AK-47 | Redline",price,image:"https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_ak47_cu_redline_light_png.png"};
   const tiles=Array.from({length:12},()=>pool[Math.floor(Math.random()*pool.length)]??prize);
   const winnerIndex=Math.floor(Math.random()*12);
   tiles[winnerIndex]=success?prize:{name:"Попытка не удалась",price:0,rarity:"FAIL"};
   setUpgradeRoll(tiles);setUpgradeWinnerIndex(winnerIndex);setUpgradeOutcome(success?"win":"lose");setUpgradeRollId(v=>v+1);
   setWheelRotation(0);setUpgradeSpinning(false);
   window.setTimeout(()=>{setUpgradeSpinning(true);window.setTimeout(()=>setWheelRotation(1800+((360-winnerIndex*30+360)%360)),40);},80);
   window.setTimeout(()=>{
    if(success){setInventory(v=>[prize,...v.filter((_,i)=>i!==selected[0])]);setOpened(prize);record("Успешный апгрейд · x"+target);setNotice("Апгрейд успешен! Новый скин добавлен в инвентарь.");}
    else{setInventory(v=>v.filter((_,i)=>i!==selected[0]));record("Неудачный апгрейд · x"+target);setNotice("Колесо остановилось. Предмет использован.");}
    setSelected([]);setUpgradeSpinning(false);
   },5480);
  }function doPaint(){const source=inventory[selected[0]];if(!source){setNotice("Выбери предмет для перекраски.");return;}const cost=Math.max(25,Math.round(source.price*.15));if(balance<cost){setNotice("Недостаточно BROCOIN для перекраски.");return;}setBalance(v=>v-cost);const prize={name:source.name.split(" — ")[0]+" — "+paint+" (перекраска)",price:source.price};setInventory(v=>v.map((x,i)=>i===selected[0]?prize:x));setSelected([]);record("Перекраска в "+paint);setNotice("Предмет перекрашен!");}
 function claimTask(i:number){if(claimed.includes(i))return;setClaimed(v=>[...v,i]);setStars(v=>v+tasks[i].reward);setBalance(v=>v+tasks[i].reward*5);record("Получена награда задания: "+tasks[i].name);setNotice("Награда начислена: "+tasks[i].reward+" звёзд и "+tasks[i].reward*5+" BC.");}
 const go=(s:string)=>{setActive(s);setMobile(false);setOpened(null);setSelected([]);window.scrollTo({top:0,behavior:"smooth"});};
 return <main className="app">
  <div className="demo-bar"><ShieldCheck size={14}/> ДЕМО-ВЕРСИЯ <span>Только виртуальные монеты и предметы · без платежей и вывода</span></div>
  <header className="header"><button className="mobile-menu" onClick={()=>setMobile(!mobile)} aria-label="Открыть меню">{mobile?<X/>:<Menu/>}</button><button className="logo" onClick={()=>go("Главная")}><span className="logo-mark">S</span><span>SKINBRO<small>BC</small></span></button><nav className="top-nav">{nav.slice(0,6).map(n=><button className={active===n.label?"chosen":""} key={n.label} onClick={()=>go(n.label)}><n.icon size={15}/><span>{n.label}</span></button>)}</nav><div className="header-right"><div className="wallet"><Coins size={17}/><b>{fmt(balance)}</b><small>BC</small></div><button className="user" onClick={()=>{setAuthOpen(true);setAuthError("");setAuthMessage("");}}>{userId?<><UserRound size={16}/>{authEmail.split("@")[0]||"Аккаунт"}</>:<>Войти <ChevronDown size={14}/></>}</button></div>{mobile&&<nav className="mobile-nav"><div className="mobile-nav-head"><b>Навигация</b><span>SKINBRO DEMO</span></div>{nav.map(n=><button className={active===n.label?"chosen":""} key={n.label} onClick={()=>go(n.label)}><n.icon size={17}/>{n.label}<ArrowUpRight size={14}/></button>)}<button className="mobile-account" onClick={()=>{setAuthOpen(true);setMobile(false);}}><UserRound size={17}/>{userId?"Аккаунт и сохранения":"Войти / регистрация"}</button></nav>}</header>
  {active==="Главная"||active==="Кейсы"?<><div className="subnav"><span>SKINBRO DEMO</span><span>Главная</span><span>›</span><b>{active==="Главная"?"Операция CS2":"Кейсы CS2"}</b></div>
  {active==="Главная"?<><section className="operation-hero"><div className="operation-copy"><div className="season-tag"><i/> НОВАЯ ОПЕРАЦИЯ</div><h1>Играй в CS2<br/><em>Побеждай. Получай скины.</em></h1><p>Открывай редкие коллекции, собирай предметы и выполняй задания. Каждый запуск — новый шанс пополнить свою коллекцию.</p><div className="hero-actions"><button className="lime-btn" onClick={()=>go("Батл Пас")}>Получить скины <span>↗</span></button><button className="outline-btn" onClick={()=>go("Кейсы")}>Открыть кейсы</button></div><div className="operation-points"><span>✦ Еженедельные награды</span><span>✦ Коллекции CS2</span><span>✦ Демо-режим</span></div></div><div className="operation-visual"><div className="season-orbit orbit-a"/><div className="season-orbit orbit-b"/><div className="gem gem-ruby">◆</div><div className="gem gem-emerald">◆</div><div className="gem gem-sapphire">◆</div><div className="season-title">SPRING<br/><b>SPECTRUM</b><small>OPERATION · DEMO</small></div></div><div className="season-bottom"><span>ОПЕРАЦИЯ CS2 · SPRING SPECTRUM</span><span>СЕЗОН DEMO <b>01</b></span></div></section>
  <section className="featured-section"><div className="case-shelf-head"><div className="case-shelf-tabs"><b className="active">Новые</b><b>Популярные</b></div><button onClick={()=>go("Кейсы")}>Посмотреть все <ArrowUpRight size={14}/></button></div><div className="featured-grid">{realCollections.slice(0,8).map((c,i)=><article className={"featured-card "+c.tone} key={c.name} onClick={()=>go("Кейсы")}><div className="featured-art">{c.image?<img src={c.image} alt={c.name} loading="lazy"/>:<span>◈</span>}</div><h3>{c.name}</h3><b>{fmt(c.price)} <small>BC</small></b></article>)}</div></section><section className="home-quick"><div className="section-title"><div><small>ТВОЙ ПРОФИЛЬ И ИНСТРУМЕНТЫ</small><h2>Быстрый доступ</h2></div></div><div className="quick-grid"><button className="quick-card" onClick={()=>go("Инвентарь")}><span className="quick-icon"><Wallet size={21}/></span><span className="quick-copy"><b>Инвентарь</b><small>{inventory.length} предметов · твоя коллекция</small></span><ArrowUpRight size={17}/></button><button className="quick-card" onClick={()=>go("Апгрейд")}><span className="quick-icon purple"><Zap size={21}/></span><span className="quick-copy"><b>Апгрейд</b><small>Проверь удачу и улучши скин</small></span><ArrowUpRight size={17}/></button><button className="quick-card" onClick={()=>go("Перекраска")}><span className="quick-icon blue"><Paintbrush size={21}/></span><span className="quick-copy"><b>Перекраска</b><small>Добавь предметам новый облик</small></span><ArrowUpRight size={17}/></button><button className="quick-card" onClick={()=>go("Батл Пас")}><span className="quick-icon gold"><Trophy size={21}/></span><span className="quick-copy"><b>Battle Pass</b><small>{stars} звёзд · задания и награды</small></span><ArrowUpRight size={17}/></button></div></section><section className="home-footer-strip"><div><span className="live-dot"></span><b>Демо-режим активен</b><small>Только виртуальные монеты и предметы</small></div><button onClick={()=>go("Профиль")}>Мой профиль <ArrowUpRight size={14}/></button></section></>:<section className="store"><div className="store-heading"><div><small>МАГАЗИН SKINBRO DEMO</small><h1>Кейсы CS2</h1><p>Открывай коллекции CS2/CS:GO за BROCOIN — валюту игрового мира SKINBRO.</p></div><div className="store-count"><b>{realCollections.length}</b><span>КОЛЛЕКЦИЙ</span></div></div><div className="store-tools"><label><Search size={17}/><input placeholder="Поиск контейнера..." value={search} onChange={e=>setSearch(e.target.value)}/></label><label className="price-filter"><span>От</span><input inputMode="numeric" placeholder="0" value={min} onChange={e=>setMin(e.target.value)}/></label><label className="price-filter"><span>До</span><input inputMode="numeric" placeholder="∞" value={max} onChange={e=>setMax(e.target.value)}/></label><button className="filter-reset" onClick={()=>{setSearch("");setMin("");setMax("");}}>Сбросить</button></div><div className="availability"><span><i/> Доступно</span><span>{visible.reduce((n,c)=>n+c.items.length,0)} контейнеров</span></div>{visible.map(c=><section className="collection" key={c.name}><div className={"collection-banner "+c.tone}><div className="collection-symbol">{c.image?<img src={c.image} alt={c.name} loading="lazy"/>:"◈"}</div><div><small>{c.subtitle}</small><h2>{c.name}</h2><small className="case-cost">{fmt(c.price)} BC · виртуальная цена</small></div><button className="case-open-btn" onClick={()=>openCase(c)}>Открыть кейс <ArrowUpRight size={14}/></button></div><div className="item-grid">{c.items.map((item,i)=><article className="store-item" key={item.name}><div className={"item-art "+c.tone}>{item.image?<img src={item.image} alt={item.name} loading="lazy"/>:<span>◈</span>}<small>{item.rarity??"CS2 SKIN"}</small></div><div className="item-info"><b>{item.name}</b><div><strong>{item.rarity??"Скин CS2"}</strong></div></div></article>)}</div></section>)}</section>}</>:<section className="other-page"><div className="other-heading"><div><small>SKINBRO DEMO · ЛИЧНЫЙ КАБИНЕТ</small><h1>{active}</h1><p>Играй, собирай коллекцию и управляй своими предметами в безопасном демо-режиме.</p></div><div className="other-balance"><Coins size={17}/><b>{fmt(balance)}</b><small>BC</small></div></div>
 {active==="Инвентарь"&&<><div className="tool-row"><span>Предметов: <b>{inventory.length}</b></span><button onClick={()=>go("Кейсы")}>Открыть кейсы →</button></div>{inventory.length?<div className="item-grid">{inventory.map((item,i)=><article className={"store-item selectable "+(selected.includes(i)?"selected":"")} key={i} onClick={()=>toggleSelect(i)}><div className="item-art spectrum">{item.image?<img src={item.image} alt={item.name} loading="lazy"/>:<span>✦</span>}</div><div className="item-info"><b>{item.name}</b><div><strong>{fmt(item.price)}</strong><small>BC</small></div><button onClick={e=>{e.stopPropagation();setInventory(v=>v.filter((_,j)=>j!==i));setNotice("Предмет удалён из демо-инвентаря.");}}>Удалить</button></div></article>)}</div>:<div className="empty-state"><Package size={38}/><h3>Инвентарь пока пуст</h3><p>Открой контейнер, чтобы получить первые виртуальные предметы.</p><button className="lime-btn" onClick={()=>go("Кейсы")}>Перейти в магазин</button></div>}</>}
 {active==="Контракт"&&<><div className="mode-panel"><div><small>TRADE UP CONTRACT</small><h2>Создай новый предмет из 10 скинов</h2><p>Выбери десять предметов из инвентаря. Их стоимость формирует ориентир стоимости результата.</p></div><div className="contract-slots">{Array.from({length:10},(_,i)=><div className={selected[i]!==undefined?"filled":""} key={i}>{selected[i]!==undefined?"✦":"+"}</div>)}</div><button className="lime-btn" disabled={selected.length!==10} onClick={doContract}>Создать контракт · {selected.length}/10</button></div>{inventory.length?<div className="item-grid">{inventory.map((item,i)=><article className={"store-item selectable "+(selected.includes(i)?"selected":"")} key={i} onClick={()=>toggleSelect(i)}><div className="item-art spectrum"><span>✦</span></div><div className="item-info"><b>{item.name}</b><div><strong>{fmt(item.price)}</strong><small>BC</small></div><button>{selected.includes(i)?"Выбрано":"Добавить"}</button></div></article>)}</div>:<p className="muted">Сначала получи предметы, открыв кейсы.</p>}</>}
 {active==="Апгрейд"&&<><div className="mode-panel upgrade-panel"><div className="upgrade-panel-head"><div><small>✦ BROCOIN UPGRADE LAB</small><h2>Рискни. Прокрути. Забери дроп.</h2><p>Выбери предмет и множитель. Рулетка покажет результат апгрейда в реальном времени.</p></div><div className="upgrade-emblem"><Zap size={28}/><span>BC</span></div></div><div className="multiplier-row">{[1.25,2,3,5,10].map(n=><button className={target===n?"active":""} key={n} onClick={()=>{if(!upgradeSpinning)setTarget(n);}}>{n}x</button>)}</div><div className="upgrade-odds"><span>Цель <b>x{target}</b></span><span>Шанс <b>{Math.max(5,Math.min(85,Math.round(70/target)))}%</b></span><span>Цена цели <b>{selected.length&&inventory[selected[0]]?fmt(Math.round(inventory[selected[0]].price*target))+" BC":"—"}</b></span></div><div className={"upgrade-roulette "+(upgradeSpinning?"is-spinning":"")+(upgradeOutcome==="win"&&!upgradeSpinning?" is-win":"")+(upgradeOutcome==="lose"&&!upgradeSpinning?" is-lose":"")}><div className="roulette-label"><span>UPGRADE WHEEL</span><b>{upgradeSpinning?"КОЛЕСО ВРАЩАЕТСЯ...":upgradeOutcome==="win"?"УСПЕШНЫЙ ДРОП":upgradeOutcome==="lose"?"НЕ ПОВЕЗЛО":"ГОТОВО К ЗАПУСКУ"}</b></div><div className="wheel-stage"><div className="wheel-pointer"><span/></div><div className={"wheel-disc "+(upgradeSpinning?"spinning":"")} style={{transform:"rotate("+wheelRotation+"deg)"}} key={upgradeRollId}>{(upgradeRoll.length?upgradeRoll:Array.from({length:12},(_,i)=>({name:["AK-47 | Redline","AWP | Asiimov","M4A1-S | Printstream","USP-S | Kill Confirmed"][i%4],price:300+i*120,image:undefined}))).map((item,i)=><div className={"wheel-item "+(i===upgradeWinnerIndex?"wheel-winner":"")} key={i} style={{"--wheel-angle":(i*30)+"deg","--wheel-counter-angle":(-i*30)+"deg"} as React.CSSProperties}><div className="wheel-item-card">{item.image?<img src={item.image} alt={item.name} loading="lazy"/>:<span>✦</span>}<b>{item.name}</b></div></div>)}<div className="wheel-hub"><Zap size={25}/><small>BC</small></div></div></div><div className="roulette-caption"><span>12 СЕКТОРОВ</span><span>НЕПОДВИЖНАЯ СТРЕЛКА</span><span>CS2 SKINS</span></div></div><button className="lime-btn upgrade-launch" disabled={!selected.length||!inventory[selected[0]]||upgradeSpinning} onClick={doUpgrade}>{upgradeSpinning?"Рулетка вращается...":"Запустить уникальную рулетку"}</button></div><h3 className="subheading">Выбери предмет для апгрейда</h3>{inventory.length?<div className="item-grid">{inventory.map((item,i)=><article className={"store-item selectable "+(selected[0]===i?"selected":"")} key={i} onClick={()=>setSelected([i])}><div className="item-art spectrum"><span>✦</span></div><div className="item-info"><b>{item.name}</b><div><strong>{fmt(item.price)}</strong><small>BC</small></div><button>{selected[0]===i?"Выбрано":"Выбрать"}</button></div></article>)}</div>:<p className="muted">В инвентаре пока нет предметов.</p>}</>}
 {active==="Перекраска"&&<><div className="mode-panel"><small>SKIN REPAINT · DEMO</small><h2>Выбери новый цвет скина</h2><p>Перекраска изменяет название и оформление виртуального предмета. Стоимость — 15% от его демо-цены.</p><div className="paint-options">{paintColors.map(color=><button className={paint===color?"active":""} key={color} onClick={()=>setPaint(color)}>{color}</button>)}</div><button className="lime-btn" disabled={!selected.length||!inventory[selected[0]]} onClick={doPaint}>Перекрасить выбранный предмет</button></div><h3 className="subheading">Мои предметы</h3>{inventory.length?<div className="item-grid">{inventory.map((item,i)=><article className={"store-item selectable "+(selected[0]===i?"selected":"")} key={i} onClick={()=>setSelected([i])}><div className="item-art spectrum">{item.image?<img src={item.image} alt={item.name} loading="lazy"/>:<span>◈</span>}</div><div className="item-info"><b>{item.name}</b><div><strong>{fmt(item.price)}</strong><small>BC</small></div><button>{selected[0]===i?"Выбрано":"Выбрать"}</button></div></article>)}</div>:<p className="muted">Список пуст — сначала открой кейс.</p>}</>}
 {active==="Батл Пас"&&<><div className="pass-hero"><div><small>OPERATION · SPRING SPECTRUM</small><h2>Боевой пропуск</h2><p>Выполняй задания, собирай звёзды и получай виртуальные награды.</p><b>{stars} <small>ЗВЁЗД</small></b></div><div className="pass-crystal">✦</div></div><div className="pass-tabs"><span className="active">Задания</span><span>Награды</span><span>Аукционы · DEMO</span><span>Рефералы · DEMO</span></div><div className="task-list">{tasks.map((task,i)=><article className="task-card" key={task.name}><div className="task-icon">{(()=>{const TaskIcon=taskIcons[i];return <TaskIcon size={19}/>})()}</div><div className="task-copy"><b>{task.name}</b><p>{task.desc}</p><small>Награда: {task.reward} звёзд</small></div><div className="task-progress">{claimed.includes(i)?"Выполнено":"0 / 1"}</div><button className={claimed.includes(i)?"claimed":""} disabled={claimed.includes(i)} onClick={()=>claimTask(i)}>{claimed.includes(i)?"Получено":"Забрать"}</button></article>)}</div><p className="demo-note">Задания здесь демонстрационные: прогресс не синхронизируется со Steam, Faceit или игровыми матчами.</p></>}
 {active==="Профиль"&&<><div className="profile-card"><div className="profile-avatar"><UserRound size={35}/></div><div><small>DEMO ACCOUNT</small><h2>{nickname}</h2><p>Локальный профиль · без авторизации Steam</p></div></div><div className="profile-settings"><label>Имя профиля<input value={nickname} onChange={e=>setNickname(e.target.value)} maxLength={24}/></label><div><span>Баланс</span><b>{fmt(balance)} BC</b></div><div><span>Предметов в инвентаре</span><b>{inventory.length}</b></div><div><span>Звёзды операции</span><b>{stars}</b></div><button className="dark-btn" onClick={()=>{setBalance(10000);setInventory([]);setHistory([]);setSelected([]);setStars(0);setClaimed([]);setNotice("Демо-профиль сброшен. Баланс восстановлен.");}}>Сбросить демо-прогресс</button></div></>}
 {active==="История"&&<div className="history-list"><h2>История операций</h2>{history.length?history.map((entry,i)=><div key={i}><span>◷</span>{entry}</div>):<p>Пока нет операций. Открой кейс или попробуй режимы.</p>}</div>}
 <div className="other-links"><button onClick={()=>go("Кейсы")}>Магазин кейсов</button><button onClick={()=>go("Инвентарь")}>Мой инвентарь</button><button onClick={()=>go("История")}>История операций</button><button onClick={()=>go("Профиль")}>Профиль</button></div>
 </section>}
  {authOpen&&<div className="result-modal auth-overlay"><div className="auth-card"><button className="modal-close" onClick={()=>setAuthOpen(false)}><X/></button><div className="auth-brand"><span className="logo-mark">S</span><b>SKINBRO <small>BC</small></b></div>{userId?<><h2>Аккаунт подключён</h2><p className="auth-subtitle">{authEmail}</p><p className="auth-cloud"><ShieldCheck size={16}/> Облачное сохранение активно</p><button className="lime-btn auth-submit" onClick={()=>{setAuthOpen(false);go("Профиль");}}>Открыть профиль</button><button className="auth-secondary" onClick={signOut}>Выйти из аккаунта</button></>:<><h2>{authMode==="login"?"Вход в аккаунт":"Создать аккаунт"}</h2><p className="auth-subtitle">Сохраняй баланс, инвентарь и историю между посещениями.</p><label className="auth-label">Электронная почта<input type="email" autoComplete="email" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="you@example.com"/></label><label className="auth-label">Пароль<input type="password" autoComplete={authMode==="login"?"current-password":"new-password"} value={authPassword} onChange={e=>setAuthPassword(e.target.value)} placeholder="Минимум 6 символов"/></label>{authError&&<p className="auth-error">{authError}</p>}{authMessage&&<p className="auth-message">{authMessage}</p>}<button className="lime-btn auth-submit" disabled={authBusy} onClick={submitAuth}>{authBusy?"Подожди...":authMode==="login"?"Войти":"Зарегистрироваться"}</button><button className="auth-switch" onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setAuthError("");setAuthMessage("");}}>{authMode==="login"?"Нет аккаунта? Зарегистрироваться":"Уже есть аккаунт? Войти"}</button><p className="auth-footnote">Только демо-аккаунт SKINBRO. Не используй пароль от Steam или других сервисов.</p></>}</div></div>}
  <nav className="mobile-dock" aria-label="Быстрая навигация">{[{label:"Главная",icon:Home},{label:"Кейсы",icon:Package},{label:"Инвентарь",icon:Wallet},{label:"Апгрейд",icon:Zap},{label:"Профиль",icon:UserRound}].map(n=><button className={active===n.label?"active":""} key={n.label} onClick={()=>go(n.label)}><n.icon size={19}/><span>{n.label}</span></button>)}</nav>
  {notice&&<div className="toast"><ShieldCheck size={16}/>{notice}<button onClick={()=>setNotice("")}><X size={15}/></button></div>}
  {opened&&<div className="result-modal"><div className="result-card"><button className="modal-close" onClick={()=>setOpened(null)}><X/></button><small>ТВОЙ ДЕМО-ДРОП</small><div className="result-gem">{opened.image?<img src={opened.image} alt={opened.name}/>: "✦"}</div><h2>{opened.name}</h2><b>{fmt(opened.price)} BC</b><p>Предмет добавлен в виртуальный инвентарь.</p><button className="lime-btn" onClick={()=>{setOpened(null);go("Инвентарь")}}>В инвентарь</button></div></div>}
  <footer><div className="footer-brand"><span className="logo-mark">S</span><b>SKINBRO BC</b></div><span>© 2026 SKINBRO DEMO · Независимый демонстрационный проект</span><span><CircleHelp size={14}/> Только виртуальная экономика</span></footer>
 </main>;
}
