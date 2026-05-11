
import { useState, useEffect, useRef, useCallback } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --cream: #FAF7F2; --cream-dark: #F2EDE4; --rose: #D4939A; --rose-light: #EDD5D7;
    --rose-pale: #F7ECEC; --sage: #8FAF8A; --sage-light: #C8DDC5; --sage-pale: #EDF4EC;
    --char: #2C2422; --char-mid: #5C4F4A; --char-light: #9C8E89; --gold: #C4A882;
    --gold-light: #E8D8C0; --white: #FFFFFF; --blue: #7BA7BC; --blue-pale: #E8F2F7;
    --shadow-soft: 0 2px 20px rgba(44,36,34,0.07); --shadow-card: 0 4px 32px rgba(44,36,34,0.10);
    --radius: 16px; --radius-sm: 10px; --radius-pill: 100px;
  }
  html, body { height: 100%; background: var(--cream); }
  body { font-family: 'DM Sans', sans-serif; color: var(--char); font-size: 14px; line-height: 1.6; -webkit-font-smoothing: antialiased; }
  body::before { content: ''; position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"); pointer-events: none; z-index: 9999; opacity: 0.4; }
  h1,h2,h3,h4 { font-family: 'Cormorant Garamond', serif; font-weight: 400; letter-spacing: -0.01em; }
  .app { display: flex; height: 100vh; overflow: hidden; }

  /* Sidebar */
  .sidebar { width: 220px; flex-shrink: 0; background: var(--white); border-right: 1px solid var(--cream-dark); display: flex; flex-direction: column; padding: 28px 0; }
  .sidebar-logo { padding: 0 24px 28px; border-bottom: 1px solid var(--cream-dark); margin-bottom: 16px; }
  .sidebar-logo h1 { font-size: 28px; font-weight: 300; letter-spacing: 0.08em; font-style: italic; }
  .sidebar-logo p { font-size: 11px; color: var(--char-light); letter-spacing: 0.05em; margin-top: 2px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 11px 24px; cursor: pointer; color: var(--char-mid); font-size: 13px; transition: all 0.18s ease; border-left: 3px solid transparent; }
  .nav-item:hover { background: var(--cream); color: var(--char); }
  .nav-item.active { background: var(--rose-pale); color: var(--rose); border-left-color: var(--rose); font-weight: 500; }
  .nav-icon { font-size: 15px; width: 20px; text-align: center; }
  .sidebar-footer { margin-top: auto; padding: 20px 24px 0; border-top: 1px solid var(--cream-dark); }
  .net-worth-pill { background: linear-gradient(135deg, var(--char), #3D2E2A); border-radius: var(--radius-sm); padding: 14px; }
  .net-worth-pill p { font-size: 10px; color: rgba(255,255,255,0.5); font-weight: 500; letter-spacing: 0.06em; margin-bottom: 4px; }
  .net-worth-pill .amount { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--gold-light); }

  /* Main */
  .main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
  .page { padding: 32px 36px; animation: fadeUp 0.35s ease both; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .page-header { margin-bottom: 28px; }
  .page-header h2 { font-size: 32px; line-height: 1.1; }
  .page-header p { color: var(--char-light); font-size: 13px; margin-top: 4px; }

  /* Cards */
  .card { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow-soft); padding: 22px 24px; border: 1px solid rgba(44,36,34,0.05); }
  .card-label { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; color: var(--char-light); text-transform: uppercase; margin-bottom: 6px; }
  .card-value { font-family: 'Cormorant Garamond', serif; font-size: 34px; font-weight: 400; line-height: 1; }
  .card-sub { font-size: 12px; color: var(--char-light); margin-top: 6px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }

  .stat-card-income { border-top: 3px solid var(--sage); }
  .stat-card-expense { border-top: 3px solid var(--rose); }
  .stat-card-savings { border-top: 3px solid var(--gold); }
  .income-val { color: var(--sage) !important; }
  .expense-val { color: var(--rose) !important; }
  .savings-val { color: var(--gold) !important; }
  .blue-val { color: var(--blue) !important; }

  .section-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; margin-bottom: 16px; font-weight: 400; }

  /* Account cards */
  .account-card { border-radius: var(--radius); padding: 18px 20px; position: relative; overflow: hidden; cursor: pointer; transition: transform 0.2s; }
  .account-card:hover { transform: translateY(-2px); }
  .account-card.cash { background: linear-gradient(135deg, #8FAF8A, #6A9465); }
  .account-card.checking { background: linear-gradient(135deg, #7BA7BC, #5A8AA0); }
  .account-card.savings { background: linear-gradient(135deg, #C4A882, #A88660); }
  .account-card.other { background: linear-gradient(135deg, #D4939A, #B87078); }
  .account-card-label { font-size: 11px; color: rgba(255,255,255,0.7); font-weight: 500; letter-spacing: 0.06em; margin-bottom: 8px; }
  .account-card-amount { font-family: 'Cormorant Garamond', serif; font-size: 28px; color: white; line-height: 1; }
  .account-card-icon { position: absolute; top: 14px; right: 16px; font-size: 20px; opacity: 0.6; }
  .account-card-sub { font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 6px; }
  .edit-bal-btn { background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; border-radius: var(--radius-pill); padding: 4px 10px; font-size: 11px; cursor: pointer; margin-top: 10px; font-family: 'DM Sans', sans-serif; transition: background 0.15s; }
  .edit-bal-btn:hover { background: rgba(255,255,255,0.3); }

  /* balance editor modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(44,36,34,0.4); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal { background: var(--white); border-radius: var(--radius); padding: 28px; width: 100%; max-width: 380px; box-shadow: var(--shadow-card); }
  .modal h3 { font-size: 22px; margin-bottom: 6px; }
  .modal p { color: var(--char-light); font-size: 13px; margin-bottom: 20px; }
  .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
  .modal-field label { font-size: 11px; color: var(--char-light); font-weight: 500; letter-spacing: 0.05em; display: block; margin-bottom: 6px; }
  .modal-field input { width: 100%; padding: 10px 14px; background: var(--cream); border: 1.5px solid var(--cream-dark); border-radius: var(--radius-sm); font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--char); outline: none; }
  .modal-field input:focus { border-color: var(--rose-light); }
  .modal-actions { display: flex; gap: 10px; }

  /* Transactions */
  .tx-list { display: flex; flex-direction: column; gap: 8px; }
  .tx-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--cream); border-radius: var(--radius-sm); transition: background 0.15s; }
  .tx-item:hover { background: var(--cream-dark); }
  .tx-emoji { font-size: 18px; width: 32px; text-align: center; flex-shrink: 0; }
  .tx-info { flex: 1; min-width: 0; }
  .tx-name { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tx-meta { font-size: 11px; color: var(--char-light); margin-top: 1px; }
  .tx-amount { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 500; flex-shrink: 0; }
  .tx-amount.income { color: var(--sage); }
  .tx-amount.expense { color: var(--rose); }
  .tx-delete { background: none; border: none; cursor: pointer; color: var(--char-light); font-size: 16px; opacity: 0; transition: opacity 0.15s; padding: 2px 6px; }
  .tx-item:hover .tx-delete { opacity: 1; }

  /* Category bar */
  .cat-list { display: flex; flex-direction: column; gap: 10px; }
  .cat-item { display: flex; align-items: center; gap: 10px; }
  .cat-label { font-size: 12px; width: 90px; color: var(--char-mid); flex-shrink: 0; text-transform: capitalize; }
  .cat-bar-wrap { flex: 1; height: 7px; background: var(--cream-dark); border-radius: 4px; overflow: hidden; }
  .cat-bar { height: 100%; border-radius: 4px; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
  .cat-amount { font-size: 12px; color: var(--char-light); width: 52px; text-align: right; flex-shrink: 0; }

  /* Chart tooltip */
  .custom-tooltip { background: var(--white); border: 1px solid var(--cream-dark); border-radius: var(--radius-sm); padding: 10px 14px; box-shadow: var(--shadow-soft); font-size: 12px; }
  .custom-tooltip .label { font-weight: 500; color: var(--char); margin-bottom: 3px; }
  .custom-tooltip .value { color: var(--char-light); }

  /* Period toggle */
  .period-toggle { display: flex; gap: 0; background: var(--cream-dark); border-radius: var(--radius-pill); padding: 3px; width: fit-content; margin-bottom: 20px; }
  .period-btn { padding: 6px 16px; border-radius: var(--radius-pill); border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 12px; cursor: pointer; color: var(--char-mid); transition: all 0.2s; }
  .period-btn.active { background: var(--white); color: var(--char); box-shadow: 0 1px 4px rgba(0,0,0,0.1); }

  /* Goals */
  .goals-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .goal-card { background: var(--white); border-radius: var(--radius); padding: 20px 22px; box-shadow: var(--shadow-soft); border: 1px solid rgba(44,36,34,0.05); position: relative; overflow: hidden; }
  .goal-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--rose-light), var(--gold-light)); }
  .goal-emoji { font-size: 24px; margin-bottom: 10px; }
  .goal-name { font-family: 'Cormorant Garamond', serif; font-size: 20px; margin-bottom: 4px; }
  .goal-amounts { font-size: 12px; color: var(--char-light); margin-bottom: 12px; }
  .goal-amounts span { color: var(--char); font-weight: 500; }
  .goal-bar-wrap { height: 8px; background: var(--cream-dark); border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
  .goal-bar { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--rose), var(--gold)); transition: width 0.8s cubic-bezier(.4,0,.2,1); }
  .goal-pct { font-size: 11px; color: var(--char-light); }
  .goal-pct span { color: var(--rose); font-weight: 500; }

  /* Chat */
  .chat-layout { display: flex; flex-direction: column; height: 100vh; }
  .chat-header { padding: 28px 36px 20px; background: var(--white); border-bottom: 1px solid var(--cream-dark); flex-shrink: 0; }
  .chat-header h2 { font-size: 28px; }
  .chat-header p { color: var(--char-light); font-size: 13px; margin-top: 2px; }
  .chat-messages { flex: 1; overflow-y: auto; padding: 24px 36px; display: flex; flex-direction: column; gap: 16px; }
  .msg { display: flex; gap: 10px; max-width: 75%; animation: fadeUp 0.25s ease both; }
  .msg.user { align-self: flex-end; flex-direction: row-reverse; }
  .msg.assistant { align-self: flex-start; }
  .msg-avatar { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; margin-top: 2px; }
  .msg.user .msg-avatar { background: var(--rose-light); }
  .msg.assistant .msg-avatar { background: var(--sage-light); }
  .msg-bubble { padding: 12px 16px; border-radius: 18px; font-size: 13.5px; line-height: 1.55; }
  .msg.user .msg-bubble { background: var(--rose); color: white; border-bottom-right-radius: 5px; }
  .msg.assistant .msg-bubble { background: var(--white); color: var(--char); border: 1px solid var(--cream-dark); border-bottom-left-radius: 5px; box-shadow: var(--shadow-soft); }
  .tx-confirm { background: var(--sage-pale); border: 1px solid var(--sage-light); border-radius: var(--radius-sm); padding: 12px 14px; margin-top: 8px; font-size: 12.5px; }
  .tx-confirm-row { display: flex; justify-content: space-between; padding: 3px 0; }
  .tx-confirm-label { color: var(--char-light); }
  .tx-confirm-value { font-weight: 500; }
  .emotional-tag { display: inline-block; background: var(--rose-pale); color: var(--rose); border-radius: var(--radius-pill); padding: 2px 10px; font-size: 11px; font-weight: 500; margin-top: 4px; }
  .chat-input-area { padding: 16px 36px 24px; background: var(--white); border-top: 1px solid var(--cream-dark); flex-shrink: 0; }
  .chat-input-row { display: flex; gap: 10px; align-items: flex-end; }
  .chat-input { width: 100%; padding: 13px 18px; background: var(--cream); border: 1.5px solid var(--cream-dark); border-radius: var(--radius-pill); font-family: 'DM Sans', sans-serif; font-size: 13.5px; color: var(--char); outline: none; resize: none; transition: border-color 0.2s; line-height: 1.5; max-height: 120px; overflow-y: auto; }
  .chat-input:focus { border-color: var(--rose-light); }
  .chat-input::placeholder { color: var(--char-light); }
  .send-btn { width: 44px; height: 44px; border-radius: 50%; background: var(--rose); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; color: white; flex-shrink: 0; transition: all 0.2s; box-shadow: 0 3px 12px rgba(212,147,154,0.4); }
  .send-btn:hover { background: #C07A82; transform: scale(1.05); }
  .send-btn:disabled { background: var(--char-light); box-shadow: none; cursor: not-allowed; transform: none; }
  .mode-toggle { display: flex; gap: 6px; margin-bottom: 12px; }
  .mode-btn { padding: 6px 14px; border-radius: var(--radius-pill); border: 1.5px solid var(--cream-dark); background: transparent; font-family: 'DM Sans', sans-serif; font-size: 12px; cursor: pointer; color: var(--char-mid); transition: all 0.15s; }
  .mode-btn.active { background: var(--rose); border-color: var(--rose); color: white; }
  .typing-dots { display: flex; gap: 4px; align-items: center; padding: 4px 2px; }
  .typing-dot { width: 7px; height: 7px; background: var(--char-light); border-radius: 50%; animation: bounce 1.2s infinite; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }

  /* Reflection */
  .reflection-card { background: linear-gradient(135deg, var(--char), #3D2E2A); border-radius: var(--radius); padding: 28px; color: white; position: relative; overflow: hidden; }
  .reflection-card h3 { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--gold-light); margin-bottom: 6px; font-style: italic; }
  .reflection-card > p { color: rgba(255,255,255,0.65); font-size: 13px; margin-bottom: 20px; }
  .reflection-text { font-size: 13.5px; line-height: 1.8; color: rgba(255,255,255,0.88); white-space: pre-wrap; }
  .reflection-btn { padding: 11px 24px; background: var(--gold); color: var(--char); border: none; border-radius: var(--radius-pill); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .reflection-btn:hover { background: var(--gold-light); }
  .reflection-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .insight-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
  .insight-pill { padding: 6px 14px; border-radius: var(--radius-pill); border: 1px solid rgba(255,255,255,0.15); font-size: 12px; color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.06); }

  /* Buttons */
  .btn-primary { padding: 10px 20px; background: var(--rose); color: white; border: none; border-radius: var(--radius-pill); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 10px rgba(212,147,154,0.35); }
  .btn-primary:hover { background: #C07A82; transform: translateY(-1px); }
  .btn-ghost { padding: 9px 18px; background: transparent; color: var(--char-mid); border: 1.5px solid var(--cream-dark); border-radius: var(--radius-pill); font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.15s; }
  .btn-ghost:hover { border-color: var(--rose-light); color: var(--rose); }
  input[type="text"], input[type="number"] { width: 100%; padding: 10px 14px; background: var(--white); border: 1.5px solid var(--cream-dark); border-radius: var(--radius-sm); font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--char); outline: none; transition: border-color 0.2s; }
  input:focus { border-color: var(--rose-light); }

  .empty { text-align: center; padding: 40px 20px; color: var(--char-light); }
  .empty-emoji { font-size: 36px; margin-bottom: 10px; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--cream-dark); border-radius: 4px; }

  .add-goal-form { background: var(--cream); border-radius: var(--radius); padding: 20px 22px; border: 2px dashed var(--cream-dark); display: flex; flex-direction: column; gap: 10px; }

  .divider { height: 1px; background: var(--cream-dark); margin: 24px 0; }

  /* overview hero */
  .overview-hero { background: linear-gradient(135deg, var(--char) 0%, #3D2E2A 100%); border-radius: var(--radius); padding: 28px 32px; color: white; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; }
  .overview-hero h3 { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: rgba(255,255,255,0.5); font-weight: 300; letter-spacing: 0.08em; margin-bottom: 6px; }
  .overview-hero .big { font-family: 'Cormorant Garamond', serif; font-size: 52px; color: var(--gold-light); line-height: 1; }
  .overview-hero p { font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 6px; }
  .overview-breakdown { display: flex; gap: 24px; }
  .overview-item { text-align: right; }
  .overview-item label { font-size: 10px; color: rgba(255,255,255,0.45); letter-spacing: 0.06em; display: block; margin-bottom: 4px; }
  .overview-item span { font-family: 'Cormorant Garamond', serif; font-size: 22px; }
  .overview-item span.inc { color: #A8D5A0; }
  .overview-item span.exp { color: #E8A0A6; }

  @media (max-width: 768px) {
    .sidebar { width: 60px; }
    .sidebar-logo p, .nav-item span, .sidebar-footer { display: none; }
    .nav-item { justify-content: center; padding: 14px; }
    .page { padding: 16px; }
    .grid-3, .grid-4 { grid-template-columns: 1fr 1fr; }
    .grid-2, .goals-grid { grid-template-columns: 1fr; }
    .chat-messages, .chat-input-area, .chat-header { padding-left: 16px; padding-right: 16px; }
    .overview-hero { flex-direction: column; gap: 16px; }
    .overview-breakdown { justify-content: flex-start; }
    .overview-item { text-align: left; }
  }
`;

// ── Constants ───────────────────────────────────────────────────────────────
const CAT_EMOJIS = {
  food:"🍜",gas:"⛽",shopping:"🛍️",beauty:"💄",business:"💼",
  subscriptions:"📱",fitness:"🏋️",education:"📚",miscellaneous:"✨",
  doordash:"🚗",ebay:"📦","job income":"💰","side hustle":"💡",
  family:"🏠",gift:"🎁",income:"💰",expense:"💸"
};
const CAT_COLORS = ["#D4939A","#8FAF8A","#C4A882","#9B8EC4","#7BA7BC","#B89AC4","#8FB5AF","#C4B08A","#A0B8A0"];

const DEFAULT_GOALS = [
  {id:1,name:"Move Out Fund",emoji:"🏠",target:5000,saved:1200},
  {id:2,name:"Emergency Fund",emoji:"🛡️",target:2000,saved:650},
  {id:3,name:"Business Fund",emoji:"💼",target:3000,saved:300},
  {id:4,name:"Camera",emoji:"📷",target:800,saved:125},
];

const DEFAULT_ACCOUNTS = {
  cash: 0, checking: 0, savings: 0, other: 0
};

const WELCOME_MSG = {
  id:"welcome",role:"assistant",
  text:`Hey! 🌸 I'm flora, your finance companion. Just talk naturally:\n• "Made $70 from DoorDash"\n• "Spent $18 on gas"\n• "Moved $200 into my move out fund" → goal only\n• "Should I buy AirPods?" → tap Purchase Check`,
  confirmed:null
};

// ── Supabase Config ──────────────────────────────────────────────────────────
const SUPABASE_URL = "https://iieehimihkcdkadbjtfg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpZWVoaW1paGtjZGthZGJqdGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5OTI5ODMsImV4cCI6MjA2MjU2ODk4M30.eFMPHbBsXzBsD4yMQ_iSlbMrH5GHHxJNPQV1vQx1LuQ";

const sb = {
  async get(table) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=created_at.desc`, {
      headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`}
    });
    return r.ok ? r.json() : [];
  },
  async upsert(table, data) {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method:"POST",
      headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json","Prefer":"resolution=merge-duplicates"},
      body: JSON.stringify(data)
    });
  },
  async remove(table, id) {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method:"DELETE",
      headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`}
    });
  },
  async getAccounts() {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/accounts?id=eq.1`, {
      headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`}
    });
    const d = r.ok ? await r.json() : [];
    return d[0] || {cash:0,checking:0,savings:0,other:0};
  },
  async saveAccounts(data) {
    await fetch(`${SUPABASE_URL}/rest/v1/accounts`, {
      method:"POST",
      headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json","Prefer":"resolution=merge-duplicates"},
      body: JSON.stringify({id:1,...data,updated_at:new Date().toISOString()})
    });
  }
};

// ── Utils ───────────────────────────────────────────────────────────────────
function fmtMoney(n) {
  return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:0,maximumFractionDigits:0}).format(n||0);
}
function fmtDate(iso) { return new Date(iso).toLocaleDateString("en-US",{month:"short",day:"numeric"}); }
function todayISO() { return new Date().toISOString().split("T")[0]; }
function getLS(k,fb) { try{const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}catch{return fb;} }
function setLS(k,v) { try{localStorage.setItem(k,JSON.stringify(v));}catch{} }

// ── AI ──────────────────────────────────────────────────────────────────────
async function callClaude(messages, system) {
  const res = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system,messages})
  });
  if(!res.ok) throw new Error(`${res.status}`);
  const d = await res.json();
  return d.content?.[0]?.text||"";
}

const PARSE_SYS = `You are a finance tracker AI. Extract transaction info from natural language.
Return ONLY a JSON object, no markdown, no extra text.

Today's date: ${new Date().toDateString()}

Schema:
{
  "type": "income" | "expense" | "goal_transfer" | "query" | "question" | "unknown",
  "amount": number | null,
  "category": string,
  "note": string,
  "emotional": boolean,
  "emotional_note": string | null,
  "date": "today",
  "goal_action": "add" | "remove" | null,
  "goal_name": string | null,
  "query_month": number | null,
  "query_year": number | null,
  "query_filter": "all" | "income" | "expense" | string,
  "reply": string
}

Income categories: doordash, ebay, job income, side hustle, family, gift, income
- Use "family" when parents, mom, dad, sister, brother, or any family member gives money or pays for something
- Use "gift" for money received as a gift from anyone (birthday, holiday, etc.)
Expense categories: food, gas, shopping, beauty, business, subscriptions, fitness, education, miscellaneous

GOAL TRANSFER RULES — use type "goal_transfer" when the user mentions:
- Moving/adding/putting money INTO a goal/fund/account (goal_action: "add")
- Taking/withdrawing/removing money FROM a goal/fund/account (goal_action: "remove")
- Examples: "moved $200 into my move out fund", "added $50 to camera goal", "had to take $150 from emergency fund"
- Set goal_name to the name they mentioned
- Goal transfers NEVER affect income or expenses

QUERY RULES — use type "query" when user wants to SEE or PULL their history:
- "show me everything from May", "pull this month", "what did I spend in April"
- "how much did I make in May 2026", "show my food spending", "what's my income this month"
- Set query_month (1-12, e.g. May=5) and query_year (e.g. 2026) based on what they said
- If they say "this month" use current month/year. If just "May" assume current year.
- Set query_filter to: "all", "income", "expense", or a category name like "food", "gas"

If emotional spending mentioned, set emotional:true. If "should I buy" set type:"question".
Keep replies warm, brief, 1-2 sentences, occasional soft emoji.`;

const DECISION_SYS = `You are a warm, wise financial coach. Ask 1 reflective question at a time. After 3-4 exchanges give a gentle verdict and classify as: necessity, investment, comfort, impulse, or identity. Be supportive but honest. Short messages, warm tone, occasional emoji. No markdown.`;

const REFLECTION_SYS = `You are a caring financial reflection AI. Write a warm, honest weekly reflection in flowing paragraphs (no bullets). Cover: financial snapshot, spending patterns, emotional purchases, savings progress, one encouraging insight. ~200 words max. Like a wise caring friend who knows money.`;

// ── Custom Chart Tooltip ────────────────────────────────────────────────────
function CustomTooltip({active, payload, label}) {
  if(!active||!payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{label||payload[0]?.name}</div>
      <div className="value">{fmtMoney(payload[0]?.value)}</div>
    </div>
  );
}

// ── Account Balance Modal ───────────────────────────────────────────────────
function AccountModal({accounts, onSave, onClose}) {
  const [vals, setVals] = useState({...accounts});
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h3>Update Balances</h3>
        <p>Enter your current balance for each account.</p>
        <div className="modal-grid">
          {[["cash","💵 Cash"],["checking","🏦 Checking"],["savings","🏦 Savings"],["other","💳 Other"]].map(([k,label])=>(
            <div key={k} className="modal-field">
              <label>{label}</label>
              <input type="number" value={vals[k]||""} placeholder="0" onChange={e=>setVals(p=>({...p,[k]:+e.target.value||0}))} />
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn-primary" onClick={()=>onSave(vals)}>Save Balances</button>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── TxItem ──────────────────────────────────────────────────────────────────
function TxItem({tx, onDelete}) {
  return (
    <div className="tx-item">
      <div className="tx-emoji">{CAT_EMOJIS[tx.category]||(tx.type==="income"?"💰":"✨")}</div>
      <div className="tx-info">
        <div className="tx-name">{tx.note||tx.category}</div>
        <div className="tx-meta">{fmtDate(tx.date)} · {tx.category}{tx.emotional?" · 💭 emotional":""}</div>
      </div>
      <div className={`tx-amount ${tx.type}`}>{tx.type==="income"?"+":"-"}{fmtMoney(tx.amount)}</div>
      <button className="tx-delete" onClick={()=>onDelete(tx.id)}>×</button>
    </div>
  );
}


// ── Transaction Timeline ─────────────────────────────────────────────────────
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS  = ["S","M","T","W","T","F","S"];

function CalendarMonth({mIdx, year, txByDay, onSelectDay, onSelectMonth, selectedDay, selectedMonth}) {
  const firstDay = new Date(year, mIdx, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, mIdx+1, 0).getDate();
  const now = new Date();
  const isCurrentMonth = year===now.getFullYear() && mIdx===now.getMonth();
  const allTx = Object.values(txByDay||{}).flat();
  const monthInc = allTx.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const monthExp = allTx.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const hasTx = allTx.length > 0;
  const isSelected = selectedMonth===mIdx;

  // Build date key like "2026-05-09"
  function dateKey(d) { return `${year}-${String(mIdx+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }

  // What color should a day be?
  function dayStyle(d) {
    const key = dateKey(d);
    const dayTx = txByDay?.[key] || [];
    const isToday = isCurrentMonth && d===now.getDate();
    const hasIncome  = dayTx.some(t=>t.type==="income");
    const hasExpense = dayTx.some(t=>t.type==="expense");
    const isSel = selectedDay===key;

    if(isSel) return {bg:"var(--char)",color:"white",border:"none"};
    if(isToday) return {bg:"var(--rose)",color:"white",border:"none"};
    if(hasIncome && hasExpense) return {bg:"var(--gold-light)",color:"var(--char)",border:"1px solid var(--gold)"};
    if(hasIncome)  return {bg:"var(--sage-light)",color:"var(--char)",border:"1px solid var(--sage)"};
    if(hasExpense) return {bg:"var(--rose-pale)",color:"var(--rose)",border:"1px solid var(--rose-light)"};
    return {bg:"transparent",color:"var(--char-light)",border:"none"};
  }

  const cells = [];
  for(let i=0;i<firstDay;i++) cells.push(null);
  for(let d=1;d<=daysInMonth;d++) cells.push(d);

  return (
    <div style={{cursor:"default"}}>
      {/* Month header */}
      <div onClick={()=>onSelectMonth(mIdx)}
        style={{textAlign:"center",marginBottom:6,cursor:"pointer",padding:"4px 6px",borderRadius:"var(--radius-sm)",
          background:isSelected?"var(--rose-pale)":"transparent",transition:"background 0.15s"}}>
        <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:15,fontWeight:500,
          color:isSelected?"var(--rose)":hasTx?"var(--char)":"var(--char-light)"}}>
          {MONTH_NAMES[mIdx]}
        </div>
        {hasTx && (
          <div style={{fontSize:9,color:"var(--char-light)",marginTop:1,display:"flex",justifyContent:"center",gap:6}}>
            <span style={{color:"var(--sage)"}}>+{fmtMoney(monthInc)}</span>
            <span style={{color:"var(--rose)"}}>-{fmtMoney(monthExp)}</span>
          </div>
        )}
      </div>
      {/* Day of week headers */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,marginBottom:2}}>
        {DAY_LABELS.map((d,i)=>(
          <div key={i} style={{textAlign:"center",fontSize:9,fontWeight:600,color:"var(--char-light)",padding:"2px 0",letterSpacing:"0.03em"}}>{d}</div>
        ))}
      </div>
      {/* Day cells */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {cells.map((d,i)=>{
          if(!d) return <div key={`e${i}`}/>;
          const key = dateKey(d);
          const dayTx = txByDay?.[key]||[];
          const s = dayStyle(d);
          return (
            <div key={d} onClick={()=>dayTx.length>0&&onSelectDay(key)}
              style={{aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",
                borderRadius:"50%",fontSize:10,fontWeight:500,
                background:s.bg,color:s.color,border:s.border,
                cursor:dayTx.length>0?"pointer":"default",
                transition:"all 0.15s",position:"relative"}}>
              {d}
              {dayTx.length>1&&(
                <div style={{position:"absolute",bottom:1,right:1,width:4,height:4,borderRadius:"50%",background:"var(--rose)",opacity:0.7}}/>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TransactionTimeline({transactions}) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDay,   setSelectedDay]   = useState(null); // "2026-05-09"
  const [selectedMonth, setSelectedMonth] = useState(null); // 0-11

  // Get all years
  const years = [...new Set(transactions.map(t=>new Date(t.date).getFullYear()))].sort((a,b)=>b-a);
  if(!years.includes(currentYear)) years.unshift(currentYear);

  // Index: "2026-05-09" → [tx, tx]
  const txByDay = {};
  transactions.forEach(t=>{
    const key = t.date; // already "YYYY-MM-DD"
    if(!txByDay[key]) txByDay[key]=[];
    txByDay[key].push(t);
  });

  // Filter for selected year
  const yearTxByDay = {};
  Object.entries(txByDay).forEach(([k,v])=>{ if(k.startsWith(String(selectedYear))) yearTxByDay[k]=v; });

  // What to show in detail panel
  let detailTx = [];
  let detailLabel = "";
  if(selectedDay) {
    detailTx = txByDay[selectedDay]||[];
    const d = new Date(selectedDay+"T12:00:00");
    detailLabel = d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});
  } else if(selectedMonth!==null) {
    const prefix = `${selectedYear}-${String(selectedMonth+1).padStart(2,"0")}`;
    detailTx = Object.entries(txByDay).filter(([k])=>k.startsWith(prefix)).flatMap(([,v])=>v);
    detailLabel = `${MONTH_NAMES[selectedMonth]} ${selectedYear}`;
  }

  const detailInc = detailTx.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const detailExp = detailTx.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);

  function handleSelectDay(key) {
    if(selectedDay===key){setSelectedDay(null);}
    else{setSelectedDay(key);setSelectedMonth(null);}
  }
  function handleSelectMonth(mIdx) {
    if(selectedMonth===mIdx&&!selectedDay){setSelectedMonth(null);}
    else{setSelectedMonth(mIdx);setSelectedDay(null);}
  }

  return (
    <div className="card" style={{marginTop:24}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div className="section-title" style={{marginBottom:0}}>Transaction Calendar</div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {/* Legend */}
          <div style={{display:"flex",gap:8,marginRight:8,fontSize:10,color:"var(--char-light)",alignItems:"center"}}>
            <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:10,height:10,borderRadius:"50%",background:"var(--sage-light)",border:"1px solid var(--sage)",display:"inline-block"}}/> income</span>
            <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:10,height:10,borderRadius:"50%",background:"var(--rose-pale)",border:"1px solid var(--rose-light)",display:"inline-block"}}/> expense</span>
            <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:10,height:10,borderRadius:"50%",background:"var(--gold-light)",border:"1px solid var(--gold)",display:"inline-block"}}/> both</span>
          </div>
          {years.map(y=>(
            <button key={y} onClick={()=>{setSelectedYear(y);setSelectedDay(null);setSelectedMonth(null);}}
              style={{padding:"5px 14px",borderRadius:"var(--radius-pill)",border:"1.5px solid",fontSize:12,cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontWeight:500,
                borderColor:selectedYear===y?"var(--rose)":"var(--cream-dark)",
                background:selectedYear===y?"var(--rose-pale)":"transparent",
                color:selectedYear===y?"var(--rose)":"var(--char-mid)"}}>
              {y}
            </button>
          ))}
        </div>
      </div>

      {transactions.length===0
        ? <div className="empty"><div className="empty-emoji">📅</div><p>No transactions yet — start chatting!</p></div>
        : <>
          {/* 12-month grid — 3 columns × 4 rows */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"24px 20px",marginBottom:24}}>
            {MONTH_NAMES.map((_,mIdx)=>(
              <CalendarMonth key={mIdx} mIdx={mIdx} year={selectedYear}
                txByDay={yearTxByDay}
                onSelectDay={handleSelectDay}
                onSelectMonth={handleSelectMonth}
                selectedDay={selectedDay}
                selectedMonth={selectedMonth}
              />
            ))}
          </div>

          {/* Detail panel */}
          {(selectedDay||selectedMonth!==null)&&(
            <div style={{borderTop:"1px solid var(--cream-dark)",paddingTop:20,animation:"fadeUp 0.25s ease both"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div>
                  <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,color:"var(--char)"}}>{detailLabel}</div>
                  <div style={{fontSize:12,color:"var(--char-light)",marginTop:2}}>{detailTx.length} transaction{detailTx.length!==1?"s":""}</div>
                </div>
                <div style={{display:"flex",gap:16,alignItems:"center"}}>
                  {detailInc>0&&<div style={{textAlign:"right"}}><div style={{fontSize:10,color:"var(--char-light)",letterSpacing:"0.05em"}}>INCOME</div><div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,color:"var(--sage)"}}>+{fmtMoney(detailInc)}</div></div>}
                  {detailExp>0&&<div style={{textAlign:"right"}}><div style={{fontSize:10,color:"var(--char-light)",letterSpacing:"0.05em"}}>EXPENSES</div><div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,color:"var(--rose)"}}>-{fmtMoney(detailExp)}</div></div>}
                  <button onClick={()=>{setSelectedDay(null);setSelectedMonth(null);}} style={{background:"var(--cream)",border:"1.5px solid var(--cream-dark)",borderRadius:"var(--radius-pill)",padding:"5px 12px",fontSize:11,cursor:"pointer",color:"var(--char-mid)",fontFamily:"DM Sans,sans-serif"}}>✕</button>
                </div>
              </div>
              {detailTx.length===0
                ? <div className="empty" style={{padding:"20px"}}><div className="empty-emoji">🌸</div><p>Nothing logged {selectedDay?"this day":"this month"}</p></div>
                : <div className="tx-list">
                    {detailTx
                      .sort((a,b)=>new Date(b.timestamp||b.date)-new Date(a.timestamp||a.date))
                      .map(t=>(
                        <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"var(--cream)",borderRadius:"var(--radius-sm)"}}>
                          <div style={{fontSize:18,width:32,textAlign:"center",flexShrink:0}}>{CAT_EMOJIS[t.category]||(t.type==="income"?"💰":"✨")}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:13,fontWeight:500,color:"var(--char)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.note||t.category}</div>
                            <div style={{fontSize:11,color:"var(--char-light)",marginTop:1,display:"flex",gap:6,flexWrap:"wrap"}}>
                              <span>{t.category}</span>
                              {t.time&&<><span>·</span><span>{t.time}</span></>}
                              {t.date&&!selectedDay&&<><span>·</span><span>{fmtDate(t.date)}</span></>}
                              {t.emotional&&<><span>·</span><span style={{color:"var(--rose)"}}>💭 emotional</span></>}
                            </div>
                          </div>
                          <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,fontWeight:500,flexShrink:0,color:t.type==="income"?"var(--sage)":"var(--rose)"}}>
                            {t.type==="income"?"+":"-"}{fmtMoney(t.amount)}
                          </div>
                        </div>
                      ))
                    }
                  </div>
              }
            </div>
          )}
        </>
      }
    </div>
  );
}

// ── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard({transactions, accounts, setAccounts, period, setPeriod}) {
  const [showModal, setShowModal] = useState(false);
  const now = new Date();

  const filtered = transactions.filter(t=>{
    const d=new Date(t.date);
    if(period==="weekly"){const w=new Date(now);w.setDate(now.getDate()-7);return d>=w;}
    return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();
  });

  const income  = filtered.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expenses= filtered.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const net     = income-expenses;
  const totalCash = Object.values(accounts).reduce((s,v)=>s+v,0);
  // Net worth = just your real account balances (no double-counting tracked transactions)
  const netWorth  = totalCash;

  // pie data
  const byCategory = {};
  filtered.filter(t=>t.type==="expense").forEach(t=>{byCategory[t.category]=(byCategory[t.category]||0)+t.amount;});
  const pieData = Object.entries(byCategory).map(([name,value])=>({name,value}));

  // bar data — last 6 weeks or last 6 months
  const barData = (() => {
    const map = {};
    transactions.forEach(t=>{
      const d=new Date(t.date);
      const key = period==="weekly"
        ? `${d.getMonth()+1}/${d.getDate()}`
        : d.toLocaleString("en-US",{month:"short"});
      if(!map[key]) map[key]={name:key,income:0,expenses:0};
      if(t.type==="income") map[key].income+=t.amount;
      else map[key].expenses+=t.amount;
    });
    return Object.values(map).slice(-6);
  })();

  function saveAccounts(vals) {
    setAccounts(vals);
    setShowModal(false);
  }

  // ── Export to Excel ──────────────────────────────────────────────────────
  function exportToExcel() {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});

    // Build CSV-style data then convert to Excel-compatible HTML table download
    // We use a proper XML spreadsheet format (SpreadsheetML) which Excel opens natively
    const income  = transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
    const expenses= transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
    const net     = income - expenses;
    const totalCash = Object.values(accounts).reduce((s,v)=>s+v,0);

    // Category totals
    const catTotals = {};
    transactions.forEach(t=>{
      if(!catTotals[t.category]) catTotals[t.category]={income:0,expense:0};
      catTotals[t.category][t.type] += t.amount;
    });

    const esc = v => String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

    const cell = (v, bold=false, color="000000", bg="FFFFFF", fmt="") =>
      `<Cell ss:StyleID="s${bold?"b":"n"}${color}${bg}${fmt?`_${fmt}`:""}" ><Data ss:Type="${typeof v==="number"?"Number":"String"}">${esc(v)}</Data></Cell>`;

    const hCell = (v, bg="2C2422", fg="E8D8C0") =>
      `<Cell ss:StyleID="hdr_${bg}_${fg}"><Data ss:Type="String">${esc(v)}</Data></Cell>`;

    const mCell = (v, color="000000", bg="FAF7F2", bold=false, fmt="") =>
      `<Cell ss:StyleID="${bold?"bold":"norm"}_${color}_${bg}"><Data ss:Type="${typeof v==="number"?"Number":"String"}">${esc(v)}</Data></Cell>`;

    // Build rows
    const txRows = transactions
      .sort((a,b)=>new Date(b.timestamp||b.date)-new Date(a.timestamp||a.date))
      .map(t=>`
        <Row ss:Height="18">
          ${mCell(t.date,"5C4F4A","FAF7F2")}
          ${mCell(t.time||"","9C8E89","FAF7F2")}
          ${mCell(t.type, t.type==="income"?"8FAF8A":"D4939A","FAF7F2",true)}
          ${mCell(t.note||t.category,"2C2422","FAF7F2")}
          ${mCell(t.category,"5C4F4A","FAF7F2")}
          ${mCell(t.amount, t.type==="income"?"8FAF8A":"D4939A","FAF7F2",true,"currency")}
          ${mCell(t.emotional?"yes":"no", t.emotional?"D4939A":"9C8E89","FAF7F2")}
        </Row>`).join("");

    const catRows = Object.entries(catTotals).map(([cat,v])=>`
        <Row ss:Height="18">
          ${mCell(CAT_EMOJIS[cat]||"✨","2C2422","FAF7F2")} 
          ${mCell(cat,"2C2422","FAF7F2")}
          ${mCell(v.income>0?v.income:"","8FAF8A","EDF4EC",true,"currency")}
          ${mCell(v.expense>0?v.expense:"","D4939A","F7ECEC",true,"currency")}
        </Row>`).join("");

    const goalRows = goals.map(g=>`
        <Row ss:Height="20">
          ${mCell(g.emoji+" "+g.name,"2C2422","FAF7F2",true)}
          ${mCell(g.saved,"D4939A","F7ECEC",true,"currency")}
          ${mCell(g.target,"9C8E89","FAF7F2",false,"currency")}
          ${mCell(g.target-g.saved,"C4A882","E8D8C0",false,"currency")}
          ${mCell(Math.round((g.saved/g.target)*100)+"%","8FAF8A","EDF4EC",true)}
        </Row>`).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="norm_2C2422_FAF7F2"><Font ss:FontName="Arial" ss:Size="10" ss:Color="#2C2422"/><Interior ss:Color="#FAF7F2" ss:Pattern="Solid"/><Alignment ss:Vertical="Center"/></Style>
    <Style ss:ID="norm_5C4F4A_FAF7F2"><Font ss:FontName="Arial" ss:Size="10" ss:Color="#5C4F4A"/><Interior ss:Color="#FAF7F2" ss:Pattern="Solid"/><Alignment ss:Vertical="Center"/></Style>
    <Style ss:ID="norm_9C8E89_FAF7F2"><Font ss:FontName="Arial" ss:Size="10" ss:Color="#9C8E89"/><Interior ss:Color="#FAF7F2" ss:Pattern="Solid"/><Alignment ss:Vertical="Center"/></Style>
    <Style ss:ID="norm_8FAF8A_EDF4EC"><Font ss:FontName="Arial" ss:Size="10" ss:Color="#8FAF8A"/><Interior ss:Color="#EDF4EC" ss:Pattern="Solid"/><Alignment ss:Vertical="Center"/></Style>
    <Style ss:ID="norm_D4939A_F7ECEC"><Font ss:FontName="Arial" ss:Size="10" ss:Color="#D4939A"/><Interior ss:Color="#F7ECEC" ss:Pattern="Solid"/><Alignment ss:Vertical="Center"/></Style>
    <Style ss:ID="norm_C4A882_E8D8C0"><Font ss:FontName="Arial" ss:Size="10" ss:Color="#C4A882"/><Interior ss:Color="#E8D8C0" ss:Pattern="Solid"/><Alignment ss:Vertical="Center"/></Style>
    <Style ss:ID="bold_8FAF8A_EDF4EC"><Font ss:FontName="Arial" ss:Size="11" ss:Bold="1" ss:Color="#8FAF8A"/><Interior ss:Color="#EDF4EC" ss:Pattern="Solid"/><Alignment ss:Vertical="Center"/></Style>
    <Style ss:ID="bold_D4939A_F7ECEC"><Font ss:FontName="Arial" ss:Size="11" ss:Bold="1" ss:Color="#D4939A"/><Interior ss:Color="#F7ECEC" ss:Pattern="Solid"/><Alignment ss:Vertical="Center"/></Style>
    <Style ss:ID="bold_8FAF8A_FAF7F2"><Font ss:FontName="Arial" ss:Size="11" ss:Bold="1" ss:Color="#8FAF8A"/><Interior ss:Color="#FAF7F2" ss:Pattern="Solid"/><Alignment ss:Vertical="Center"/></Style>
    <Style ss:ID="bold_D4939A_FAF7F2"><Font ss:FontName="Arial" ss:Size="11" ss:Bold="1" ss:Color="#D4939A"/><Interior ss:Color="#FAF7F2" ss:Pattern="Solid"/><Alignment ss:Vertical="Center"/></Style>
    <Style ss:ID="bold_2C2422_FAF7F2"><Font ss:FontName="Arial" ss:Size="11" ss:Bold="1" ss:Color="#2C2422"/><Interior ss:Color="#FAF7F2" ss:Pattern="Solid"/><Alignment ss:Vertical="Center"/></Style>
    <Style ss:ID="bold_C4A882_E8D8C0"><Font ss:FontName="Arial" ss:Size="11" ss:Bold="1" ss:Color="#C4A882"/><Interior ss:Color="#E8D8C0" ss:Pattern="Solid"/><Alignment ss:Vertical="Center"/></Style>
    <Style ss:ID="bold_9C8E89_FAF7F2"><Font ss:FontName="Arial" ss:Size="10" ss:Bold="0" ss:Color="#9C8E89"/><Interior ss:Color="#FAF7F2" ss:Pattern="Solid"/><Alignment ss:Vertical="Center"/></Style>
    <Style ss:ID="bold_2C2422_2C2422"><Font ss:FontName="Arial" ss:Size="14" ss:Bold="1" ss:Color="#E8D8C0"/><Interior ss:Color="#2C2422" ss:Pattern="Solid"/><Alignment ss:Vertical="Center" ss:Horizontal="Center"/></Style>
    <Style ss:ID="bold_8FAF8A_8FAF8A"><Font ss:FontName="Arial" ss:Size="20" ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#8FAF8A" ss:Pattern="Solid"/><Alignment ss:Vertical="Center" ss:Horizontal="Center"/></Style>
    <Style ss:ID="bold_D4939A_D4939A"><Font ss:FontName="Arial" ss:Size="20" ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#D4939A" ss:Pattern="Solid"/><Alignment ss:Vertical="Center" ss:Horizontal="Center"/></Style>
    <Style ss:ID="bold_C4A882_C4A882"><Font ss:FontName="Arial" ss:Size="20" ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#C4A882" ss:Pattern="Solid"/><Alignment ss:Vertical="Center" ss:Horizontal="Center"/></Style>
    <Style ss:ID="norm_2C2422_5C4F4A"><Font ss:FontName="Arial" ss:Size="9" ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#5C4F4A" ss:Pattern="Solid"/><Alignment ss:Vertical="Center"/></Style>
    <Style ss:ID="norm_8FAF8A_FAF7F2"><Font ss:FontName="Arial" ss:Size="11" ss:Bold="1" ss:Color="#8FAF8A"/><Interior ss:Color="#FAF7F2" ss:Pattern="Solid"/><Alignment ss:Vertical="Center" ss:Horizontal="Center"/></Style>
    <Style ss:ID="norm_D4939A_FAF7F2"><Font ss:FontName="Arial" ss:Size="11" ss:Bold="1" ss:Color="#D4939A"/><Interior ss:Color="#FAF7F2" ss:Pattern="Solid"/><Alignment ss:Vertical="Center" ss:Horizontal="Center"/></Style>
    <Style ss:ID="norm_C4A882_FAF7F2"><Font ss:FontName="Arial" ss:Size="16" ss:Bold="1" ss:Color="#C4A882"/><Interior ss:Color="#FAF7F2" ss:Pattern="Solid"/><Alignment ss:Vertical="Center" ss:Horizontal="Center"/></Style>
    <Style ss:ID="title"><Font ss:FontName="Arial" ss:Size="22" ss:Bold="0" ss:Italic="1" ss:Color="#E8D8C0"/><Interior ss:Color="#2C2422" ss:Pattern="Solid"/><Alignment ss:Vertical="Center" ss:Horizontal="Center"/></Style>
    <Style ss:ID="subhdr"><Font ss:FontName="Arial" ss:Size="9" ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#5C4F4A" ss:Pattern="Solid"/><Alignment ss:Vertical="Center"/></Style>
    <Style ss:ID="currency_green"><NumberFormat ss:Format="$#,##0.00"/><Font ss:FontName="Arial" ss:Size="13" ss:Bold="1" ss:Color="#8FAF8A"/><Interior ss:Color="#EDF4EC" ss:Pattern="Solid"/><Alignment ss:Vertical="Center" ss:Horizontal="Center"/></Style>
    <Style ss:ID="currency_rose"><NumberFormat ss:Format="$#,##0.00"/><Font ss:FontName="Arial" ss:Size="13" ss:Bold="1" ss:Color="#D4939A"/><Interior ss:Color="#F7ECEC" ss:Pattern="Solid"/><Alignment ss:Vertical="Center" ss:Horizontal="Center"/></Style>
    <Style ss:ID="currency_gold"><NumberFormat ss:Format="$#,##0.00"/><Font ss:FontName="Arial" ss:Size="13" ss:Bold="1" ss:Color="#C4A882"/><Interior ss:Color="#E8D8C0" ss:Pattern="Solid"/><Alignment ss:Vertical="Center" ss:Horizontal="Center"/></Style>
  </Styles>

  <Worksheet ss:Name="Summary">
    <Table ss:DefaultRowHeight="18">
      <Column ss:Width="140"/><Column ss:Width="110"/><Column ss:Width="110"/><Column ss:Width="110"/>
      <Row ss:Height="44"><Cell ss:StyleID="title" ss:MergeAcross="3"><Data ss:Type="String">flora  ·  Financial Snapshot  ·  ${dateStr}</Data></Cell></Row>
      <Row ss:Height="8"><Cell ss:StyleID="bold_C4A882_C4A882" ss:MergeAcross="3"><Data ss:Type="String"></Data></Cell></Row>
      <Row ss:Height="22"><Cell ss:StyleID="subhdr" ss:MergeAcross="3"><Data ss:Type="String">  OVERVIEW</Data></Cell></Row>
      <Row ss:Height="28"><Cell ss:StyleID="norm_2C2422_FAF7F2"><Data ss:Type="String">Total Income</Data></Cell><Cell ss:StyleID="currency_green"><Data ss:Type="Number">${income}</Data></Cell><Cell ss:StyleID="norm_2C2422_FAF7F2"><Data ss:Type="String"></Data></Cell><Cell ss:StyleID="norm_2C2422_FAF7F2"><Data ss:Type="String"></Data></Cell></Row>
      <Row ss:Height="28"><Cell ss:StyleID="norm_2C2422_FAF7F2"><Data ss:Type="String">Total Expenses</Data></Cell><Cell ss:StyleID="currency_rose"><Data ss:Type="Number">${expenses}</Data></Cell><Cell ss:StyleID="norm_2C2422_FAF7F2"><Data ss:Type="String"></Data></Cell><Cell ss:StyleID="norm_2C2422_FAF7F2"><Data ss:Type="String"></Data></Cell></Row>
      <Row ss:Height="28"><Cell ss:StyleID="norm_2C2422_FAF7F2"><Data ss:Type="String">Net Savings</Data></Cell><Cell ss:StyleID="currency_gold"><Data ss:Type="Number">${net}</Data></Cell><Cell ss:StyleID="norm_2C2422_FAF7F2"><Data ss:Type="String"></Data></Cell><Cell ss:StyleID="norm_2C2422_FAF7F2"><Data ss:Type="String"></Data></Cell></Row>
      <Row ss:Height="28"><Cell ss:StyleID="norm_2C2422_FAF7F2"><Data ss:Type="String">Cash + Accounts Total</Data></Cell><Cell ss:StyleID="currency_gold"><Data ss:Type="Number">${totalCash}</Data></Cell><Cell ss:StyleID="norm_2C2422_FAF7F2"><Data ss:Type="String"></Data></Cell><Cell ss:StyleID="norm_2C2422_FAF7F2"><Data ss:Type="String"></Data></Cell></Row>
      <Row ss:Height="12"/>
      <Row ss:Height="22"><Cell ss:StyleID="subhdr" ss:MergeAcross="3"><Data ss:Type="String">  ACCOUNTS</Data></Cell></Row>
      <Row ss:Height="22"><Cell ss:StyleID="norm_2C2422_FAF7F2"><Data ss:Type="String">💵 Cash</Data></Cell><Cell ss:StyleID="currency_gold"><Data ss:Type="Number">${accounts.cash||0}</Data></Cell><Cell ss:StyleID="norm_2C2422_FAF7F2"/><Cell ss:StyleID="norm_2C2422_FAF7F2"/></Row>
      <Row ss:Height="22"><Cell ss:StyleID="norm_2C2422_FAF7F2"><Data ss:Type="String">🏦 Checking</Data></Cell><Cell ss:StyleID="currency_gold"><Data ss:Type="Number">${accounts.checking||0}</Data></Cell><Cell ss:StyleID="norm_2C2422_FAF7F2"/><Cell ss:StyleID="norm_2C2422_FAF7F2"/></Row>
      <Row ss:Height="22"><Cell ss:StyleID="norm_2C2422_FAF7F2"><Data ss:Type="String">💰 Savings</Data></Cell><Cell ss:StyleID="currency_gold"><Data ss:Type="Number">${accounts.savings||0}</Data></Cell><Cell ss:StyleID="norm_2C2422_FAF7F2"/><Cell ss:StyleID="norm_2C2422_FAF7F2"/></Row>
      <Row ss:Height="22"><Cell ss:StyleID="norm_2C2422_FAF7F2"><Data ss:Type="String">💳 Other</Data></Cell><Cell ss:StyleID="currency_gold"><Data ss:Type="Number">${accounts.other||0}</Data></Cell><Cell ss:StyleID="norm_2C2422_FAF7F2"/><Cell ss:StyleID="norm_2C2422_FAF7F2"/></Row>
    </Table>
  </Worksheet>

  <Worksheet ss:Name="Transactions">
    <Table ss:DefaultRowHeight="18">
      <Column ss:Width="100"/><Column ss:Width="80"/><Column ss:Width="70"/><Column ss:Width="160"/><Column ss:Width="100"/><Column ss:Width="90"/><Column ss:Width="70"/>
      <Row ss:Height="44"><Cell ss:StyleID="title" ss:MergeAcross="6"><Data ss:Type="String">flora  ·  All Transactions  ·  ${dateStr}</Data></Cell></Row>
      <Row ss:Height="8"><Cell ss:StyleID="bold_D4939A_D4939A" ss:MergeAcross="6"><Data ss:Type="String"></Data></Cell></Row>
      <Row ss:Height="22">
        <Cell ss:StyleID="subhdr"><Data ss:Type="String">Date</Data></Cell>
        <Cell ss:StyleID="subhdr"><Data ss:Type="String">Time</Data></Cell>
        <Cell ss:StyleID="subhdr"><Data ss:Type="String">Type</Data></Cell>
        <Cell ss:StyleID="subhdr"><Data ss:Type="String">Description</Data></Cell>
        <Cell ss:StyleID="subhdr"><Data ss:Type="String">Category</Data></Cell>
        <Cell ss:StyleID="subhdr"><Data ss:Type="String">Amount</Data></Cell>
        <Cell ss:StyleID="subhdr"><Data ss:Type="String">Emotional?</Data></Cell>
      </Row>
      ${txRows}
    </Table>
  </Worksheet>

  <Worksheet ss:Name="Categories">
    <Table ss:DefaultRowHeight="18">
      <Column ss:Width="40"/><Column ss:Width="120"/><Column ss:Width="100"/><Column ss:Width="100"/>
      <Row ss:Height="44"><Cell ss:StyleID="title" ss:MergeAcross="3"><Data ss:Type="String">flora  ·  Category Breakdown  ·  ${dateStr}</Data></Cell></Row>
      <Row ss:Height="8"><Cell ss:StyleID="bold_C4A882_C4A882" ss:MergeAcross="3"><Data ss:Type="String"></Data></Cell></Row>
      <Row ss:Height="22">
        <Cell ss:StyleID="subhdr"><Data ss:Type="String"></Data></Cell>
        <Cell ss:StyleID="subhdr"><Data ss:Type="String">Category</Data></Cell>
        <Cell ss:StyleID="subhdr"><Data ss:Type="String">Income</Data></Cell>
        <Cell ss:StyleID="subhdr"><Data ss:Type="String">Expenses</Data></Cell>
      </Row>
      ${catRows}
    </Table>
  </Worksheet>

  <Worksheet ss:Name="Goals">
    <Table ss:DefaultRowHeight="18">
      <Column ss:Width="180"/><Column ss:Width="90"/><Column ss:Width="90"/><Column ss:Width="90"/><Column ss:Width="70"/>
      <Row ss:Height="44"><Cell ss:StyleID="title" ss:MergeAcross="4"><Data ss:Type="String">flora  ·  Savings Goals  ·  ${dateStr}</Data></Cell></Row>
      <Row ss:Height="8"><Cell ss:StyleID="bold_8FAF8A_8FAF8A" ss:MergeAcross="4"><Data ss:Type="String"></Data></Cell></Row>
      <Row ss:Height="22">
        <Cell ss:StyleID="subhdr"><Data ss:Type="String">Goal</Data></Cell>
        <Cell ss:StyleID="subhdr"><Data ss:Type="String">Saved</Data></Cell>
        <Cell ss:StyleID="subhdr"><Data ss:Type="String">Target</Data></Cell>
        <Cell ss:StyleID="subhdr"><Data ss:Type="String">Still Need</Data></Cell>
        <Cell ss:StyleID="subhdr"><Data ss:Type="String">Progress</Data></Cell>
      </Row>
      ${goalRows}
    </Table>
  </Worksheet>
</Workbook>`;

    const blob = new Blob([xml], {type:"application/vnd.ms-excel"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `flora_${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      {showModal && <AccountModal accounts={accounts} onSave={saveAccounts} onClose={()=>setShowModal(false)} />}

      <div className="page-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <h2>Dashboard</h2>
          <p>Your complete financial picture.</p>
        </div>
        <button onClick={exportToExcel}
          style={{display:"flex",alignItems:"center",gap:8,padding:"10px 20px",background:"var(--char)",
            color:"var(--gold-light)",border:"none",borderRadius:"var(--radius-pill)",
            fontFamily:"DM Sans,sans-serif",fontSize:13,fontWeight:500,cursor:"pointer",
            boxShadow:"0 3px 14px rgba(44,36,34,0.25)",transition:"all 0.2s",flexShrink:0,marginTop:4}}
          onMouseEnter={e=>{e.currentTarget.style.background="#3D2E2A";e.currentTarget.style.transform="translateY(-1px)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="var(--char)";e.currentTarget.style.transform="none";}}>
          ↓ Export to Excel
        </button>
      </div>

      {/* Hero net worth */}
      <div className="overview-hero">
        <div>
          <h3>TOTAL NET WORTH</h3>
          <div className="big">{fmtMoney(netWorth)}</div>
          <p>cash + checking + savings + other</p>
        </div>
        <div className="overview-breakdown">
          <div className="overview-item">
            <label>INCOME</label>
            <span className="inc">{fmtMoney(income)}</span>
          </div>
          <div className="overview-item">
            <label>EXPENSES</label>
            <span className="exp">{fmtMoney(expenses)}</span>
          </div>
          <div className="overview-item">
            <label>NET</label>
            <span style={{color: net>=0?"#A8D5A0":"#E8A0A6"}}>{fmtMoney(net)}</span>
          </div>
        </div>
      </div>

      {/* Account cards */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div className="section-title" style={{marginBottom:0}}>My Accounts</div>
        <button className="btn-ghost" style={{fontSize:12,padding:"6px 14px"}} onClick={()=>setShowModal(true)}>✏️ Update Balances</button>
      </div>
      <div className="grid-4" style={{marginBottom:24}}>
        {[
          {key:"cash",label:"CASH",icon:"💵",cls:"cash"},
          {key:"checking",label:"CHECKING",icon:"🏦",cls:"checking"},
          {key:"savings",label:"SAVINGS",icon:"💰",cls:"savings"},
          {key:"other",label:"OTHER",icon:"💳",cls:"other"},
        ].map(a=>(
          <div key={a.key} className={`account-card ${a.cls}`} onClick={()=>setShowModal(true)}>
            <div className="account-card-icon">{a.icon}</div>
            <div className="account-card-label">{a.label}</div>
            <div className="account-card-amount">{fmtMoney(accounts[a.key])}</div>
            <div className="account-card-sub">tap to update</div>
          </div>
        ))}
      </div>

      {/* Period toggle */}
      <div className="period-toggle">
        <button className={`period-btn ${period==="monthly"?"active":""}`} onClick={()=>setPeriod("monthly")}>Monthly</button>
        <button className={`period-btn ${period==="weekly"?"active":""}`} onClick={()=>setPeriod("weekly")}>Weekly</button>
      </div>

      {/* Stat cards */}
      <div className="grid-3" style={{marginBottom:24}}>
        <div className="card stat-card-income">
          <div className="card-label">Total Income</div>
          <div className="card-value income-val">{fmtMoney(income)}</div>
          <div className="card-sub">{filtered.filter(t=>t.type==="income").length} transactions</div>
        </div>
        <div className="card stat-card-expense">
          <div className="card-label">Total Expenses</div>
          <div className="card-value expense-val">{fmtMoney(expenses)}</div>
          <div className="card-sub">{filtered.filter(t=>t.type==="expense").length} transactions</div>
        </div>
        <div className="card stat-card-savings">
          <div className="card-label">Net Savings</div>
          <div className={`card-value ${net>=0?"savings-val":"expense-val"}`}>{fmtMoney(net)}</div>
          <div className="card-sub">{net>=0?"you're doing great ✨":"spending > earning"}</div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid-2" style={{marginBottom:24}}>
        {/* Donut */}
        <div className="card">
          <div className="section-title">Spending by Category</div>
          {pieData.length===0
            ? <div className="empty"><div className="empty-emoji">🍩</div><p>No expenses yet</p></div>
            : (
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {pieData.map((_,i)=><Cell key={i} fill={CAT_COLORS[i%CAT_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip/>}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="cat-list">
                  {pieData.sort((a,b)=>b.value-a.value).slice(0,5).map((d,i)=>(
                    <div key={d.name} className="cat-item">
                      <div className="cat-label">{CAT_EMOJIS[d.name]||"✨"} {d.name}</div>
                      <div className="cat-bar-wrap"><div className="cat-bar" style={{width:`${(d.value/pieData[0].value)*100}%`,background:CAT_COLORS[i%CAT_COLORS.length]}}/></div>
                      <div className="cat-amount">{fmtMoney(d.value)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }
        </div>

        {/* Bar chart */}
        <div className="card">
          <div className="section-title">Income vs Expenses</div>
          {barData.length===0
            ? <div className="empty"><div className="empty-emoji">📊</div><p>No data yet</p></div>
            : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} barGap={4}>
                  <XAxis dataKey="name" tick={{fontSize:11,fill:"#9C8E89"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fill:"#9C8E89"}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Bar dataKey="income" fill="#8FAF8A" radius={[4,4,0,0]} name="Income"/>
                  <Bar dataKey="expenses" fill="#D4939A" radius={[4,4,0,0]} name="Expenses"/>
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </div>
      </div>

      {/* Year Timeline */}
      <TransactionTimeline transactions={transactions} />
    </div>
  );
}

// ── Goals ───────────────────────────────────────────────────────────────────
function GoalCard({g, onDelete, onTransfer}) {
  const [mode, setMode]     = useState(null); // null | "add" | "withdraw"
  const [amount, setAmount] = useState("");
  const [note, setNote]     = useState("");
  const pct = Math.min(Math.round((g.saved/g.target)*100), 100);
  const recentLog = (g.log||[]).slice(-3).reverse();

  function submit() {
    const amt = parseFloat(amount);
    if(!amt || amt <= 0) return;
    onTransfer(g.id, mode==="add" ? amt : -amt, note||( mode==="add" ? "Added funds" : "Withdrew funds"));
    setAmount(""); setNote(""); setMode(null);
  }

  return (
    <div className="goal-card" style={{display:"flex",flexDirection:"column",gap:0}}>
      <button onClick={()=>onDelete(g.id)} style={{position:"absolute",top:12,right:14,background:"none",border:"none",cursor:"pointer",color:"var(--char-light)",fontSize:14,opacity:0.6}}>×</button>
      <div className="goal-emoji">{g.emoji}</div>
      <div className="goal-name">{g.name}</div>
      <div className="goal-amounts"><span>{fmtMoney(g.saved)}</span> of {fmtMoney(g.target)}</div>
      <div className="goal-bar-wrap"><div className="goal-bar" style={{width:`${pct}%`}}/></div>
      <div className="goal-pct" style={{marginBottom:12}}>
        <span>{pct}%</span> · {fmtMoney(g.target - g.saved)} to go
      </div>

      {/* Action buttons */}
      {!mode && (
        <div style={{display:"flex",gap:6,marginBottom:recentLog.length?10:0}}>
          <button onClick={()=>setMode("add")} style={{flex:1,padding:"7px 0",background:"var(--sage-pale)",border:"1.5px solid var(--sage-light)",borderRadius:"var(--radius-pill)",color:"var(--sage)",fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>+ Add</button>
          <button onClick={()=>setMode("withdraw")} style={{flex:1,padding:"7px 0",background:"var(--rose-pale)",border:"1.5px solid var(--rose-light)",borderRadius:"var(--radius-pill)",color:"var(--rose)",fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>− Withdraw</button>
        </div>
      )}

      {/* Transfer form */}
      {mode && (
        <div style={{background:mode==="add"?"var(--sage-pale)":"var(--rose-pale)",borderRadius:"var(--radius-sm)",padding:"12px",marginBottom:10}}>
          <div style={{fontSize:12,fontWeight:500,color:mode==="add"?"var(--sage)":"var(--rose)",marginBottom:8}}>
            {mode==="add" ? "➕ Adding money" : "➖ Withdrawing money"}
          </div>
          <input type="number" placeholder="Amount ($)" value={amount} onChange={e=>setAmount(e.target.value)}
            style={{marginBottom:6,background:"white",borderColor:mode==="add"?"var(--sage-light)":"var(--rose-light)"}}/>
          <input type="text" placeholder="Note (optional — e.g. emergency)" value={note} onChange={e=>setNote(e.target.value)}
            style={{marginBottom:8,background:"white",borderColor:mode==="add"?"var(--sage-light)":"var(--rose-light)"}}/>
          <div style={{display:"flex",gap:6}}>
            <button onClick={submit} style={{flex:1,padding:"7px 0",background:mode==="add"?"var(--sage)":"var(--rose)",border:"none",borderRadius:"var(--radius-pill)",color:"white",fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>
              Confirm
            </button>
            <button onClick={()=>{setMode(null);setAmount("");setNote("");}} style={{padding:"7px 12px",background:"transparent",border:"1.5px solid rgba(0,0,0,0.1)",borderRadius:"var(--radius-pill)",fontSize:12,cursor:"pointer",fontFamily:"DM Sans,sans-serif",color:"var(--char-mid)"}}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Recent log */}
      {recentLog.length > 0 && (
        <div style={{borderTop:"1px solid var(--cream-dark)",paddingTop:10,display:"flex",flexDirection:"column",gap:5}}>
          {recentLog.map((entry,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11}}>
              <span style={{color:"var(--char-light)"}}>{entry.note} · {fmtDate(entry.date)}</span>
              <span style={{fontWeight:500,color:entry.amount>0?"var(--sage)":"var(--rose)",flexShrink:0,marginLeft:8}}>
                {entry.amount>0?"+":""}{fmtMoney(entry.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GoalsPage({goals, setGoals}) {
  const [newGoal, setNewGoal] = useState({name:"",emoji:"🎯",target:"",saved:""});
  const [adding, setAdding]   = useState(false);

  function saveGoals(updated) { setGoals(updated); }

  function addGoal() {
    if(!newGoal.name||!newGoal.target) return;
    const initialSaved = +(newGoal.saved||0);
    const g = {
      id: Date.now(),
      name: newGoal.name, emoji: newGoal.emoji,
      target: +newGoal.target, saved: initialSaved,
      log: initialSaved > 0
        ? [{amount: initialSaved, note:"Initial balance", date: todayISO()}]
        : []
    };
    saveGoals([...goals, g]);
    setNewGoal({name:"",emoji:"🎯",target:"",saved:""}); setAdding(false);
  }

  function deleteGoal(id) { saveGoals(goals.filter(g=>g.id!==id)); }

  // Transfer: purely internal — NEVER touches dashboard transactions
  function handleTransfer(id, amt, note) {
    const updated = goals.map(g => {
      if(g.id !== id) return g;
      const newSaved = Math.max(0, Math.min(g.saved + amt, g.target));
      const entry = { amount: amt, note, date: todayISO() };
      return { ...g, saved: newSaved, log: [...(g.log||[]), entry] };
    });
    saveGoals(updated);
  }

  const totalTarget = goals.reduce((s,g)=>s+g.target,0);
  const totalSaved  = goals.reduce((s,g)=>s+g.saved,0);

  return (
    <div className="page">
      <div className="page-header">
        <h2>Savings Goals</h2>
        <p>Your saving buckets — completely separate from your spending tracker.</p>
      </div>

      {/* Summary */}
      <div className="card" style={{marginBottom:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:12}}>
          <div>
            <div className="card-label">ALL GOALS COMBINED</div>
            <div className="card-value savings-val">{fmtMoney(totalSaved)}</div>
            <div className="card-sub">of {fmtMoney(totalTarget)} total target</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:32,color:"var(--rose)"}}>{Math.round((totalSaved/Math.max(totalTarget,1))*100)}%</div>
            <div style={{fontSize:12,color:"var(--char-light)"}}>overall progress</div>
          </div>
        </div>
        <div className="goal-bar-wrap" style={{height:10}}>
          <div className="goal-bar" style={{width:`${Math.min((totalSaved/Math.max(totalTarget,1))*100,100)}%`}}/>
        </div>
        <div style={{marginTop:10,fontSize:12,color:"var(--char-light)",display:"flex",alignItems:"center",gap:6}}>
          <span>💡</span>
          <span>Adding or removing money here <strong>does not</strong> affect your dashboard income or expenses — goals are internal transfers only.</span>
        </div>
      </div>

      <div className="goals-grid">
        {goals.map(g=>(
          <GoalCard key={g.id} g={g} onDelete={deleteGoal} onTransfer={handleTransfer}/>
        ))}
        {adding ? (
          <div className="add-goal-form">
            <h4 style={{fontFamily:"Cormorant Garamond, serif",fontSize:18}}>New Goal</h4>
            <div style={{display:"flex",gap:8}}>
              <input type="text" placeholder="Emoji 🎯" value={newGoal.emoji} onChange={e=>setNewGoal(p=>({...p,emoji:e.target.value}))} style={{width:70}} />
              <input type="text" placeholder="Goal name" value={newGoal.name} onChange={e=>setNewGoal(p=>({...p,name:e.target.value}))} />
            </div>
            <input type="number" placeholder="Target amount ($)" value={newGoal.target} onChange={e=>setNewGoal(p=>({...p,target:e.target.value}))} />
            <input type="number" placeholder="Already saved ($) — optional" value={newGoal.saved} onChange={e=>setNewGoal(p=>({...p,saved:e.target.value}))} />
            <div style={{display:"flex",gap:8}}>
              <button className="btn-primary" onClick={addGoal}>Add Goal</button>
              <button className="btn-ghost" onClick={()=>setAdding(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="goal-card" style={{display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:"2px dashed var(--cream-dark)",background:"transparent",boxShadow:"none",minHeight:180}} onClick={()=>setAdding(true)}>
            <div style={{textAlign:"center",color:"var(--char-light)"}}>
              <div style={{fontSize:32,marginBottom:8}}>+</div>
              <div style={{fontSize:13}}>Add a new goal</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Reflection ──────────────────────────────────────────────────────────────
function ReflectionPage({transactions, accounts}) {
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);

  const totalIncome   = transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const totalExpenses = transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const emotional     = transactions.filter(t=>t.emotional);
  const totalCash     = Object.values(accounts).reduce((s,v)=>s+v,0);

  async function generate() {
    setLoading(true); setReflection("");
    try {
      const summary = JSON.stringify({totalIncome,totalExpenses,net:totalIncome-totalExpenses,emotionalCount:emotional.length,totalCashOnHand:totalCash,transactions:transactions.slice(0,20)});
      const text = await callClaude([{role:"user",content:`Transaction data: ${summary}\n\nWrite my weekly financial reflection.`}], REFLECTION_SYS);
      setReflection(text);
    } catch { setReflection("Couldn't connect to AI right now. Try again in a moment! ✨"); }
    setLoading(false);
  }

  return (
    <div className="page">
      <div className="page-header"><h2>Weekly Reflection</h2><p>Understand your patterns. Celebrate your progress.</p></div>
      <div className="reflection-card" style={{marginBottom:20}}>
        <h3>Your Weekly Story</h3>
        <p>Let the AI reflect on your habits, emotional patterns, and progress.</p>
        {reflection
          ? <><div className="reflection-text">{reflection}</div><div style={{marginTop:16}}><button className="reflection-btn" onClick={()=>setReflection("")}>↺ Refresh</button></div></>
          : <button className="reflection-btn" onClick={generate} disabled={loading}>{loading?"Writing... ✨":"✦ Generate My Reflection"}</button>
        }
        <div className="insight-pills">
          <div className="insight-pill">💰 Earned {fmtMoney(totalIncome)}</div>
          <div className="insight-pill">💸 Spent {fmtMoney(totalExpenses)}</div>
          <div className="insight-pill">💵 Cash on hand {fmtMoney(totalCash)}</div>
          <div className="insight-pill">💭 {emotional.length} emotional purchase{emotional.length!==1?"s":""}</div>
          <div className="insight-pill">📈 Net {fmtMoney(totalIncome-totalExpenses)}</div>
        </div>
      </div>
      <div className="card">
        <div className="section-title">All Transactions</div>
        {transactions.length===0
          ? <div className="empty"><div className="empty-emoji">📊</div><p>No transactions yet</p></div>
          : <div className="tx-list">{transactions.map(t=><TxItem key={t.id} tx={t} onDelete={()=>{}}/>)}</div>
        }
      </div>
    </div>
  );
}

// ── Chat ─────────────────────────────────────────────────────────────────────
function ChatPage({transactions, setTransactions, goals, setGoals, onClose}) {
  const [messages, setMessages]   = useState([WELCOME_MSG]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [mode, setMode]           = useState("track");
  const [decisionHistory, setDH]  = useState([]);
  const bottomRef = useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  function addTx(parsed) {
    if(!parsed.amount||parsed.type==="question"||parsed.type==="unknown"||parsed.type==="goal_transfer") return null;
    const now = new Date();
    const tx={
      id:Date.now(),type:parsed.type,amount:parsed.amount,
      category:parsed.category||(parsed.type==="income"?"income":"miscellaneous"),
      note:parsed.note,emotional:parsed.emotional||false,
      emotional_note:parsed.emotional_note||null,
      date:todayISO(),
      time: now.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:true}),
      timestamp: now.toISOString()
    };
    const updated=[tx,...transactions];
    setTransactions(updated);
    return tx;
  }

  // Find the best matching goal by name (fuzzy)
  function findGoal(nameHint) {
    if(!nameHint) return null;
    const hint = nameHint.toLowerCase();
    return goals.find(g => g.name.toLowerCase().includes(hint) || hint.includes(g.name.toLowerCase().split(" ")[0]));
  }

  // Apply a goal transfer — purely internal, never touches dashboard
  function applyGoalTransfer(parsed) {
    if(!parsed.amount || !parsed.goal_action) return null;
    const goal = findGoal(parsed.goal_name);
    if(!goal) return null;
    const delta = parsed.goal_action === "add" ? parsed.amount : -parsed.amount;
    const newSaved = Math.max(0, Math.min(goal.saved + delta, goal.target));
    const entry = { amount: delta, note: parsed.note || (parsed.goal_action==="add" ? "Added via chat" : "Withdrew via chat"), date: todayISO() };
    const updated = goals.map(g => g.id === goal.id ? {...g, saved: newSaved, log: [...(g.log||[]), entry]} : g);
    setGoals(updated);
    return { goal, delta, newSaved };
  }

  // Handle history queries — read-only, never modifies anything
  function handleQuery(parsed) {
    const qMonth = parsed.query_month; // 1-based
    const qYear  = parsed.query_year || new Date().getFullYear();
    const filter = parsed.query_filter || "all";

    let results = transactions.filter(t => {
      const d = new Date(t.date);
      const monthMatch = qMonth ? (d.getMonth() + 1) === qMonth : true;
      const yearMatch  = d.getFullYear() === qYear;
      return monthMatch && yearMatch;
    });

    if(filter === "income")  results = results.filter(t => t.type === "income");
    else if(filter === "expense") results = results.filter(t => t.type === "expense");
    else if(!["all","income","expense"].includes(filter)) {
      results = results.filter(t => t.category?.toLowerCase().includes(filter.toLowerCase()));
    }

    const totalInc = results.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
    const totalExp = results.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
    const monthName = qMonth ? MONTH_NAMES[qMonth-1] : "this period";

    const label = `${filter==="all"?"Everything":filter==="income"?"Income":filter==="expense"?"Expenses":filter} · ${monthName} ${qYear}`;
    return { results, totalInc, totalExp, label, filter };
  }

  async function sendTrack(text) {
    setLoading(true);
    try {
      const goalsContext = goals.map(g=>g.name).join(", ");
      const raw = await callClaude([{role:"user",content:`My current goals are: ${goalsContext}\n\nMessage: ${text}`}], PARSE_SYS);
      let parsed;
      try { parsed=JSON.parse(raw.replace(/```json|```/g,"").trim()); }
      catch { parsed={type:"unknown",reply:"Hmm, could you try again? 💙"}; }

      if(parsed.type==="query") {
        const queryResult = handleQuery(parsed);
        const replyText = queryResult.results.length === 0
          ? `No ${queryResult.filter==="all"?"transactions":queryResult.filter} found for that period 🌸`
          : `Here's ${queryResult.label} — ${queryResult.results.length} transaction${queryResult.results.length!==1?"s":""}:`;
        setMessages(prev=>[...prev,{id:Date.now()+1,role:"assistant",text:replyText,queryResult}]);
      } else if(parsed.type==="goal_transfer") {
        const result = applyGoalTransfer(parsed);
        const replyText = result
          ? parsed.reply || `Got it! ${result.delta>0?"Added":"Removed"} ${fmtMoney(Math.abs(result.delta))} ${result.delta>0?"to":"from"} your ${result.goal.name}. New balance: ${fmtMoney(result.newSaved)} 🌸`
          : `I couldn't find that goal — try saying the full name. Your goals are: ${goals.map(g=>g.name).join(", ")} 💙`;
        setMessages(prev=>[...prev,{id:Date.now()+1,role:"assistant",text:replyText,goalUpdate:result}]);
      } else {
        const tx = addTx(parsed);
        setMessages(prev=>[...prev,{id:Date.now()+1,role:"assistant",text:parsed.reply||"Got it! ✨",confirmed:tx}]);
      }
    } catch {
      setMessages(prev=>[...prev,{id:Date.now(),role:"assistant",text:"Couldn't reach the AI — try again in a moment. 💙"}]);
    }
    setLoading(false);
  }

  async function sendDecision(text) {
    setLoading(true);
    const history=[...decisionHistory,{role:"user",content:text}];
    setDH(history);
    try {
      const t=await callClaude(history,DECISION_SYS);
      setDH([...history,{role:"assistant",content:t}]);
      setMessages(prev=>[...prev,{id:Date.now(),role:"assistant",text:t}]);
    } catch {
      setMessages(prev=>[...prev,{id:Date.now(),role:"assistant",text:"Connection issue, try again! 💙"}]);
    }
    setLoading(false);
  }

  async function handleSend() {
    const text=input.trim(); if(!text||loading) return;
    setInput("");
    setMessages(prev=>[...prev,{id:Date.now(),role:"user",text}]);
    if(mode==="track") await sendTrack(text); else await sendDecision(text);
  }

  function switchMode(m) {
    setMode(m); setDH([]);
    const msg = m==="decide"
      ? "Let's think this through together 🌸 What are you considering buying, and how much does it cost?"
      : "Back to tracking mode! Tell me what you earned or spent. 💰";
    setMessages(prev=>[...prev,{id:Date.now(),role:"assistant",text:msg}]);
  }

  function clearChat() {
    setMessages([WELCOME_MSG]);
    setMode("track");
    setDH([]);
  }

  return (
    <div className="chat-layout">
      <div className="chat-header" style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
        <div>
          <h2>Finance Chat</h2>
          <p>Talk to me like you're texting a friend who's great with money.</p>
        </div>
        <div style={{display:"flex",gap:8,flexShrink:0,marginTop:4}}>
          <button onClick={clearChat} style={{background:"var(--cream)",border:"1.5px solid var(--cream-dark)",borderRadius:"var(--radius-pill)",padding:"6px 14px",fontSize:12,color:"var(--char-mid)",cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>↺ Clear</button>
          {onClose && <button onClick={onClose} style={{background:"var(--rose-pale)",border:"1.5px solid var(--rose-light)",borderRadius:"var(--radius-pill)",padding:"6px 14px",fontSize:12,color:"var(--rose)",cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontWeight:500}}>✕ Close</button>}
        </div>
      </div>
      <div className="chat-messages">
        {messages.map(msg=>(
          <div key={msg.id} className={`msg ${msg.role}`}>
            <div className="msg-avatar">{msg.role==="user"?"✦":"🌸"}</div>
            <div>
              <div className="msg-bubble">{msg.text}</div>
              {msg.confirmed&&(
                <div className="tx-confirm">
                  <div className="tx-confirm-row"><span className="tx-confirm-label">Type</span><span className="tx-confirm-value" style={{color:msg.confirmed.type==="income"?"var(--sage)":"var(--rose)"}}>{msg.confirmed.type}</span></div>
                  <div className="tx-confirm-row"><span className="tx-confirm-label">Amount</span><span className="tx-confirm-value">{fmtMoney(msg.confirmed.amount)}</span></div>
                  <div className="tx-confirm-row"><span className="tx-confirm-label">Category</span><span className="tx-confirm-value">{CAT_EMOJIS[msg.confirmed.category]||"✨"} {msg.confirmed.category}</span></div>
                  {msg.confirmed.emotional&&<div style={{marginTop:6}}><span className="emotional-tag">💭 emotional spending flagged</span></div>}
                </div>
              )}
              {msg.goalUpdate&&(
                <div style={{background:"var(--gold-light)",border:"1px solid var(--gold)",borderRadius:"var(--radius-sm)",padding:"12px 14px",marginTop:8,fontSize:12.5}}>
                  <div style={{fontWeight:500,color:"var(--char)",marginBottom:6}}>🎯 Goal Updated — not counted in dashboard</div>
                  <div className="tx-confirm-row"><span className="tx-confirm-label">Goal</span><span className="tx-confirm-value">{msg.goalUpdate.goal.emoji} {msg.goalUpdate.goal.name}</span></div>
                  <div className="tx-confirm-row"><span className="tx-confirm-label">Change</span><span className="tx-confirm-value" style={{color:msg.goalUpdate.delta>0?"var(--sage)":"var(--rose)"}}>{msg.goalUpdate.delta>0?"+":""}{fmtMoney(msg.goalUpdate.delta)}</span></div>
                  <div className="tx-confirm-row"><span className="tx-confirm-label">New balance</span><span className="tx-confirm-value">{fmtMoney(msg.goalUpdate.newSaved)}</span></div>
                </div>
              )}
              {msg.queryResult&&msg.queryResult.results.length>0&&(
                <div style={{background:"var(--white)",border:"1px solid var(--cream-dark)",borderRadius:"var(--radius-sm)",marginTop:8,overflow:"hidden",maxWidth:360}}>
                  {/* Summary row */}
                  <div style={{padding:"10px 14px",background:"var(--cream)",display:"flex",gap:16,justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:11,fontWeight:500,color:"var(--char-mid)",letterSpacing:"0.04em"}}>{msg.queryResult.label.toUpperCase()}</span>
                    <div style={{display:"flex",gap:12,fontSize:12}}>
                      {msg.queryResult.totalInc>0&&<span style={{color:"var(--sage)",fontWeight:500}}>+{fmtMoney(msg.queryResult.totalInc)}</span>}
                      {msg.queryResult.totalExp>0&&<span style={{color:"var(--rose)",fontWeight:500}}>-{fmtMoney(msg.queryResult.totalExp)}</span>}
                    </div>
                  </div>
                  {/* Transaction list */}
                  <div style={{maxHeight:260,overflowY:"auto"}}>
                    {msg.queryResult.results
                      .sort((a,b)=>new Date(b.timestamp||b.date)-new Date(a.timestamp||a.date))
                      .map(t=>(
                        <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",borderTop:"1px solid var(--cream)"}}>
                          <span style={{fontSize:15}}>{CAT_EMOJIS[t.category]||(t.type==="income"?"💰":"✨")}</span>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:12.5,fontWeight:500,color:"var(--char)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.note||t.category}</div>
                            <div style={{fontSize:11,color:"var(--char-light)"}}>{fmtDate(t.date)}{t.time?` · ${t.time}`:""}</div>
                          </div>
                          <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:17,fontWeight:500,color:t.type==="income"?"var(--sage)":"var(--rose)",flexShrink:0}}>
                            {t.type==="income"?"+":"-"}{fmtMoney(t.amount)}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading&&(
          <div className="msg assistant">
            <div className="msg-avatar">🌸</div>
            <div className="msg-bubble"><div className="typing-dots"><div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/></div></div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
      <div className="chat-input-area">
        <div className="mode-toggle">
          <button className={`mode-btn ${mode==="track"?"active":""}`} onClick={()=>switchMode("track")}>💸 Track Money</button>
          <button className={`mode-btn ${mode==="decide"?"active":""}`} onClick={()=>switchMode("decide")}>🤔 Purchase Check</button>
        </div>
        <div className="chat-input-row">
          <textarea className="chat-input" rows={1}
            placeholder={mode==="track"?"e.g. Made $78 from DoorDash, spent $20 on gas...":"e.g. Should I buy AirPods for $150?"}
            value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();}}}
          />
          <button className="send-btn" onClick={handleSend} disabled={loading||!input.trim()}>➤</button>
        </div>
      </div>
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
const NAV = [
  {id:"dashboard",icon:"📊",label:"Dashboard"},
  {id:"goals",icon:"🎯",label:"Goals"},
  {id:"reflect",icon:"✦",label:"Reflect"},
];

export default function FloraApp() {
  const [page, setPage]                 = useState("dashboard");
  const [chatOpen, setChatOpen]         = useState(false);
  const [transactions, setTransactionsState] = useState([]);
  const [goals, setGoalsState]          = useState(DEFAULT_GOALS);
  const [accounts, setAccountsState]    = useState(DEFAULT_ACCOUNTS);
  const [period, setPeriod]             = useState("monthly");
  const [loading, setLoading]           = useState(true);
  const [syncStatus, setSyncStatus]     = useState(""); // "saving" | "saved" | "error"

  // ── Load all data from Supabase on mount ───────────────────────────────
  useEffect(()=>{
    async function loadAll() {
      try {
        const [txData, goalData, acctData] = await Promise.all([
          sb.get("transactions"),
          sb.get("goals"),
          sb.getAccounts()
        ]);
        if(txData?.length)   setTransactionsState(txData);
        if(goalData?.length) setGoalsState(goalData);
        if(acctData)         setAccountsState(acctData);
      } catch(e) {
        console.error("Load error:", e);
      }
      setLoading(false);
    }
    loadAll();
  },[]);

  // ── Wrappers that save to Supabase + local state ───────────────────────
  async function setTransactions(updated) {
    setTransactionsState(updated);
    setSyncStatus("saving");
    try {
      // find new tx (ones not already in DB — upsert all to be safe)
      const newest = updated[0];
      if(newest) await sb.upsert("transactions", newest);
      setSyncStatus("saved");
    } catch { setSyncStatus("error"); }
    setTimeout(()=>setSyncStatus(""),2500);
  }

  async function setGoals(updated) {
    setGoalsState(updated);
    setSyncStatus("saving");
    try {
      for(const g of updated) {
        await sb.upsert("goals", {...g, updated_at: new Date().toISOString()});
      }
      setSyncStatus("saved");
    } catch { setSyncStatus("error"); }
    setTimeout(()=>setSyncStatus(""),2500);
  }

  async function setAccounts(updated) {
    setAccountsState(updated);
    setSyncStatus("saving");
    try {
      await sb.saveAccounts(updated);
      setSyncStatus("saved");
    } catch { setSyncStatus("error"); }
    setTimeout(()=>setSyncStatus(""),2500);
  }

  const netWorth = Object.values(accounts).reduce((s,v)=>s+(+v||0),0);

  if(loading) return (
    <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--cream)",flexDirection:"column",gap:16,fontFamily:"DM Sans,sans-serif"}}>
      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:36,color:"var(--char)",fontStyle:"italic"}}>flora</div>
      <div style={{fontSize:13,color:"var(--char-light)"}}>Loading your data... 🌸</div>
    </div>
  );

  return (
    <>
      <style>{STYLES}{`
        .bottom-nav {
          display: none;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: var(--white);
          border-top: 1px solid var(--cream-dark);
          padding: 8px 0 20px;
          z-index: 100;
          justify-content: space-around;
          align-items: center;
        }
        .bottom-nav-item {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          cursor: pointer; padding: 4px 16px;
          color: var(--char-light); font-size: 10px; font-weight: 500;
          transition: color 0.15s; letter-spacing: 0.03em;
        }
        .bottom-nav-item.active { color: var(--rose); }
        .bottom-nav-item .bnav-icon { font-size: 20px; }
        .fab {
          position: fixed; bottom: 76px; right: 20px;
          width: 52px; height: 52px; border-radius: 50%;
          background: var(--rose); border: none;
          box-shadow: 0 4px 20px rgba(212,147,154,0.5);
          display: none; align-items: center; justify-content: center;
          font-size: 22px; cursor: pointer; z-index: 101;
          transition: transform 0.2s, background 0.2s;
        }
        .fab:hover { transform: scale(1.08); background: #C07A82; }
        .chat-sheet {
          position: fixed; inset: 0;
          background: var(--white);
          z-index: 200;
          display: flex; flex-direction: column;
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(.4,0,.2,1);
        }
        .chat-sheet.open { transform: translateY(0); }
        .chat-sheet-handle {
          display: none;
          justify-content: center; align-items: center;
          padding: 12px; flex-shrink: 0; gap: 12px;
          border-bottom: 1px solid var(--cream-dark);
          background: var(--white);
        }
        .chat-sheet-handle .handle-bar {
          width: 36px; height: 4px;
          background: var(--cream-dark); border-radius: 2px;
        }
        .chat-close-btn {
          margin-left: auto;
          background: var(--cream); border: 1.5px solid var(--cream-dark);
          border-radius: var(--radius-pill); padding: 5px 14px;
          font-size: 12px; color: var(--char-mid); cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }
        @media (max-width: 768px) {
          .sidebar { display: none !important; }
          .bottom-nav { display: flex; }
          .fab { display: flex; }
          .chat-sheet-handle { display: flex; }
          .main { padding-bottom: 80px; }
        }
      `}</style>
      <div className="app">
        {/* Desktop sidebar */}
        <nav className="sidebar">
          <div className="sidebar-logo">
            <h1>flora</h1>
            <p>your money, beautifully tracked</p>
          </div>
          {[{id:"chat",icon:"💬",label:"Chat"},...NAV].map(n=>(
            <div key={n.id} className={`nav-item ${(n.id==="chat"?chatOpen:page===n.id)?"active":""}`}
              onClick={()=>{ if(n.id==="chat"){setChatOpen(true);}else{setPage(n.id);setChatOpen(false);} }}>
              <span className="nav-icon">{n.icon}</span>
              <span>{n.label}</span>
            </div>
          ))}
          <div className="sidebar-footer">
            <div className="net-worth-pill">
              <p>NET WORTH</p>
              <div className="amount">{fmtMoney(netWorth)}</div>
            </div>
            {syncStatus && (
              <div style={{marginTop:10,padding:"6px 12px",borderRadius:"var(--radius-pill)",fontSize:11,textAlign:"center",fontFamily:"DM Sans,sans-serif",
                background: syncStatus==="saved"?"var(--sage-pale)":syncStatus==="error"?"var(--rose-pale)":"var(--gold-light)",
                color: syncStatus==="saved"?"var(--sage)":syncStatus==="error"?"var(--rose)":"var(--gold)"}}>
                {syncStatus==="saving"?"☁️ Saving...":syncStatus==="saved"?"✓ Saved to cloud":"⚠ Sync error"}
              </div>
            )}
          </div>
        </nav>

        {/* Main pages */}
        <main className="main">
          {page==="dashboard" && <Dashboard transactions={transactions} accounts={accounts} setAccounts={setAccounts} period={period} setPeriod={setPeriod}/>}
          {page==="goals"     && <GoalsPage goals={goals} setGoals={setGoals}/>}
          {page==="reflect"   && <ReflectionPage transactions={transactions} accounts={accounts}/>}
        </main>

        {/* Desktop: inline chat replaces main when open */}
        {chatOpen && <div className="main" style={{position:"absolute",inset:0,left:220,zIndex:50,background:"var(--white)"}}>
          <ChatPage transactions={transactions} setTransactions={setTransactions} goals={goals} setGoals={setGoals} onClose={()=>setChatOpen(false)}/>
        </div>}

        {/* Mobile: floating action button */}
        <button className="fab" onClick={()=>setChatOpen(true)}>💬</button>

        {/* Mobile: chat bottom sheet */}
        <div className={`chat-sheet ${chatOpen?"open":""}`}>
          <div className="chat-sheet-handle">
            <div className="handle-bar"/>
            <button className="chat-close-btn" onClick={()=>setChatOpen(false)}>✕ Close</button>
          </div>
          <ChatPage transactions={transactions} setTransactions={setTransactions} goals={goals} setGoals={setGoals} onClose={()=>setChatOpen(false)}/>
        </div>

        {/* Mobile bottom nav */}
        <nav className="bottom-nav">
          {NAV.map(n=>(
            <div key={n.id} className={`bottom-nav-item ${page===n.id&&!chatOpen?"active":""}`}
              onClick={()=>{setPage(n.id);setChatOpen(false);}}>
              <span className="bnav-icon">{n.icon}</span>
              <span>{n.label}</span>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
