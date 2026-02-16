import { useState, useEffect, useCallback, useRef } from "react";

/* ══════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════ */

const COLORS = {
  vision: { bg: "#C8E6F0", accent: "#1A5276", border: "#1A5276", light: "#E8F4F8", gradient: "linear-gradient(135deg, #C8E6F0, #A8D8EA)" },
  glue: { bg: "#E8F5A3", accent: "#4A5D23", border: "#4A5D23", light: "#F5FADC", gradient: "linear-gradient(135deg, #E8F5A3, #D4E88A)" },
  craft: { bg: "#9B6DBF", accent: "#FFFFFF", border: "#5C2D82", light: "#E8D5F5", gradient: "linear-gradient(135deg, #9B6DBF, #7B4FA0)" },
  maverick: { bg: "#C5CAE9", accent: "#1A237E", border: "#283593", light: "#E8EAF6", gradient: "linear-gradient(135deg, #C5CAE9, #9FA8DA)" },
  spark: { bg: "#F8C8C8", accent: "#7B1A1A", border: "#7B1A1A", light: "#FDE8E8", gradient: "linear-gradient(135deg, #F8C8C8, #F0A0A0)" },
  flex: { bg: "#C8E6C8", accent: "#1B5E20", border: "#1B5E20", light: "#E8F5E8", gradient: "linear-gradient(135deg, #C8E6C8, #A5D6A5)" },
  heart: { bg: "#F3C8E8", accent: "#880E4F", border: "#880E4F", light: "#FCE4EC", gradient: "linear-gradient(135deg, #F3C8E8, #F48FB1)" },
};

const CLASS_DISPLAY = { vision: "THE VISION", glue: "THE GLUE", craft: "THE CRAFT", maverick: "THE MAVERICK", spark: "THE SPARK", flex: "THE FLEX", heart: "THE HEART" };
const CLASS_SUB = { vision: "sets the plan", glue: "organizes the team", craft: "makes it beautiful", maverick: "thinks ahead", spark: "whips it up", flex: "fills in the gaps", heart: "makes it worth it" };

const ALL_CHAMPIONS = [
  { id: "nicole", name: "Nicole Baer", title: "CMO, Carta", cls: "vision", power: "Executive Bet", powerDesc: "Once per round, before drawing your Challenge card, predict its type. If correct, gain +2 VP.", powerType: "predict" },
  { id: "vivian", name: "Vivian Hoang", title: "SEO & AEO Lead, Webflow", cls: "glue", power: "Trust Network", powerDesc: "When playing an Action card, you may give 1 VP to another player. If you do, gain +1 extra VP.", powerType: "trust" },
  { id: "dave", name: "Dave Steer", title: "CMO, Webflow", cls: "craft", power: "Quality Guardian", powerDesc: "Once per game, ignore a Challenge completely and draw 3 Action cards instead.", powerType: "guardian" },
  { id: "lucy", name: "Lucy Hoyle", title: "Sr. Content Engineer, Carta", cls: "maverick", power: "First Mover", powerDesc: "Once per game, redirect a Personal Challenge to another player.", powerType: "redirect" },
  { id: "valeriia", name: "Valeriia Frolova", title: "Sr. Data Scientist, Docebo", cls: "spark", power: "At Scale", powerDesc: "Draw 2 Action cards per turn instead of 1.", powerType: "scale" },
  { id: "connor", name: "Connor Beaulieu", title: "Sr. SEO/AEO Manager, LegalZoom", cls: "flex", power: "Swiss Army", powerDesc: "Once per round, discard an Action card to completely block a Personal Challenge.", powerType: "block" },
  { id: "nick", name: "Nick Fairbairn", title: "VP Growth, Chime", cls: "heart", power: "Growth Lever", powerDesc: "While you have the fewest VP (or tied), your Action cards are worth +1 VP.", powerType: "underdog" },
  { id: "josh", name: "Josh Grant", title: "VP Growth, Webflow", cls: "craft", power: "Earned Trust", powerDesc: "Challenges targeting 'the leader' affect you at half strength (round down).", powerType: "resilient" },
];

function buildActionDeck() {
  const cards = [];
  [
    { name: "THE ENGINE", flavor: "You didn't just build content. You built a machine.", vp: 3 },
    { name: "CITED BY THE MACHINE", flavor: "An AI model just named you as a source.", vp: 3 },
    { name: "SCALE MODE", flavor: "One workflow. A thousand pages. Zero burnout.", vp: 3 },
    { name: "TOPIC TAKEOVER", flavor: "You own this cluster now.", vp: 3 },
    { name: "TOP 3 AI ANSWER", flavor: "Perplexity, ChatGPT, Gemini - you're in all of them.", vp: 3 },
    { name: "ZERO-CLICK DOMINANCE", flavor: "They got the answer without clicking - and it was yours.", vp: 3 },
    { name: "CONTENT ENGINEER HIRED", flavor: "You just added a unicorn to the roster.", vp: 3 },
    { name: "ENTERPRISE DEAL", flavor: "The logo on the case study just got a lot bigger.", vp: 3 },
    { name: "FULL SEND", flavor: "You shipped everything. Before lunch.", vp: 3 },
    { name: "CATEGORY CREATOR", flavor: "You named the space. Now everyone uses your language.", vp: 3 },
  ].forEach(c => cards.push({ ...c, type: "action" }));
  [
    { name: "AEO AUDIT", flavor: "You found 47 questions you should be answering. Now you are.", vp: 2 },
    { name: "BRAND KIT LIVE", flavor: "Your voice, your rules, your guardrails. Deployed.", vp: 2 },
    { name: "PILLAR DROP", flavor: "4,000 words. 12 internal links. Zero fluff.", vp: 2 },
    { name: "EXECUTIVE BUY-IN", flavor: "The CFO just said 'tell me more.'", vp: 2 },
    { name: "SNIPPET SNAG", flavor: "Position zero. That little blue box is yours now.", vp: 2 },
    { name: "PIPELINE BUILT", flavor: "Briefed, drafted, reviewed, published - on repeat forever.", vp: 2 },
    { name: "CONTENT REFRESH", flavor: "That 2022 post just started ranking again.", vp: 2 },
    { name: "BACKLINK EARNED", flavor: "A DA 90 site just linked to you organically.", vp: 2 },
    { name: "ORIGINAL RESEARCH", flavor: "You surveyed 1,000 marketers and now everyone's citing you.", vp: 2 },
    { name: "PROGRAMMATIC PLAY", flavor: "200 pages. One template. All ranking.", vp: 2 },
    { name: "ATTRIBUTION CLOSED", flavor: "Marketing can finally prove it drove the deal.", vp: 2 },
    { name: "PERPLEXITY OPTIMIZED", flavor: "You rewrote for AI readability and it worked immediately.", vp: 2 },
  ].forEach(c => cards.push({ ...c, type: "action" }));
  [
    { name: "SHIPPED IT", flavor: "It's not perfect. But it's live.", vp: 1 },
    { name: "LINKEDIN MOMENT", flavor: "You posted something real and the comments went off.", vp: 1 },
    { name: "LINK CLEANUP", flavor: "You just killed 200 404s. Nobody noticed.", vp: 1 },
    { name: "META GLOW-UP", flavor: "New titles, new descriptions, new CTR.", vp: 1 },
    { name: "BRIEF NAILED", flavor: "The writer read it once and didn't ask a single question.", vp: 1 },
    { name: "HEADLINE TEST", flavor: "Variant B won by 40%. Trust the data.", vp: 1 },
    { name: "WEBINAR REMIX", flavor: "One recording became a blog, 3 clips, and a newsletter.", vp: 1 },
    { name: "SOCIAL LOADED", flavor: "30 days of posts. Scheduled. Done. Go outside.", vp: 1 },
    { name: "GUEST SPOT", flavor: "Someone else's audience just met you for the first time.", vp: 1 },
    { name: "FORUM DROP", flavor: "You answered a real question. The algorithm noticed.", vp: 1 },
    { name: "JOURNALIST REPLY", flavor: "A reporter needed a quote. You were fast.", vp: 1 },
    { name: "CMS DETOX", flavor: "You deleted 84 draft posts from 2021. It felt amazing.", vp: 1 },
    { name: "CASE STUDY LIVE", flavor: "Real customer. Real numbers. Real trust.", vp: 1 },
    { name: "ANALYTICS FIX", flavor: "You finally set up UTM tracking correctly.", vp: 1 },
    { name: "INTERN'S IDEA", flavor: "They said it in the standup. Best idea all quarter.", vp: 1 },
  ].forEach(c => cards.push({ ...c, type: "action" }));
  [
    { name: "AIROPS WORKFLOW", flavor: "10 minutes vs. a week.", vp: 1, effect: "draw2", effectText: "Draw 2 extra Action cards." },
    { name: "COMPETITIVE TEARDOWN", flavor: "You published a comparison page.", vp: 2, effect: "steal1", effectText: "Choose one opponent - they lose 1 VP." },
    { name: "BURN IT DOWN", flavor: "New quarter. New strategy. New hand.", vp: 0, effect: "burnDraw4", effectText: "Discard hand, draw 4 new Action cards." },
    { name: "BRAND MOAT", flavor: "They can copy your content. Not your brand.", vp: 1, effect: "immune", effectText: "Immune to Challenges next turn." },
    { name: "EXECUTIVE SPONSOR", flavor: "The CEO just reshared your post.", vp: 2, effect: "none", effectText: "Cannot be reduced or blocked." },
    { name: "THOUGHT LEADER ARC", flavor: "Three months of consistent POV. It's clicking.", vp: 2, effect: "draw2", effectText: "Draw 2 extra Action cards." },
    { name: "COMMUNITY UNLOCKED", flavor: "They're talking about you when you're not there.", vp: 1, effect: "draw2", effectText: "Draw 2 extra Action cards." },
    { name: "DATA PLAY", flavor: "Turned a spreadsheet into a story.", vp: 2, effect: "steal1", effectText: "Choose one opponent - they lose 1 VP." },
    { name: "DARK SOCIAL HIT", flavor: "Someone screenshotted your post. You'll never see the data.", vp: 2, effect: "darkSocial", effectText: "If not in first place, gain +1 bonus VP." },
    { name: "CONTENT MOAT", flavor: "300 articles. 40 topics. Nobody's catching up.", vp: 2, effect: "immune", effectText: "Immune to Challenges next turn." },
    { name: "SOURCE OF TRUTH", flavor: "Every competitor links back to your research.", vp: 3, effect: "none", effectText: "Cannot be reduced or blocked." },
    { name: "VIRAL THREAD", flavor: "You posted at 7am. By noon: 2M impressions.", vp: 0, effect: "viralThread", effectText: "Gain VP = cards in hand (max 5)." },
  ].forEach(c => cards.push({ ...c, type: "special" }));
  return shuffle(cards);
}

const CHALLENGE_DEFS = [
  { name: "Algorithm Update", effect: "Lose 2 VP.", resolveId: "vp:-2", ctype: "personal" },
  { name: "Budget Cut", effect: "Skip your Action play this turn.", resolveId: "skipAction", ctype: "personal" },
  { name: "Scope Creep", effect: "Next Action card worth 1 less VP (min 0).", resolveId: "reduceNext:1", ctype: "personal" },
  { name: "AI Hallucination", effect: "Lose 1 VP.", resolveId: "vp:-1", ctype: "personal" },
  { name: "Writer's Block", effect: "You can only play 1-point cards this turn.", resolveId: "maxPlayable:1", ctype: "personal" },
  { name: "Team Turnover", effect: "Discard 2 random cards from your hand.", resolveId: "discardRandom:2", ctype: "personal" },
  { name: "Broken Workflow", effect: "Lose 1 VP and skip drawing next turn.", resolveId: "vp:-1,skipDraw", ctype: "personal" },
  { name: "Client Churn", effect: "Lose 2 VP but draw 2 Action cards.", resolveId: "vp:-2,drawCards:2", ctype: "personal" },
  { name: "Seasonal Slump", effect: "Lose 1 VP.", resolveId: "vp:-1", ctype: "personal" },
  { name: "Keyword Cannibalization", effect: "Lose 1 VP. Next Action worth 1 less.", resolveId: "vp:-1,reduceNext:1", ctype: "personal" },
  { name: "Plagiarism Accusation", effect: "Lose 1 VP. If 6+ VP, lose 2 instead.", resolveId: "plagiarism", ctype: "personal" },
  { name: "Stakeholder Review", effect: "Skip Action play. Draw 2 cards.", resolveId: "skipAction,drawCards:2", ctype: "personal" },
  { name: "Vendor Lock-In", effect: "Cannot use Champion power next turn.", resolveId: "lockPower", ctype: "personal" },
  { name: "CMS Migration", effect: "Discard entire hand. Draw 3 new cards.", resolveId: "discardAll,drawCards:3", ctype: "personal" },
  { name: "Content Decay", effect: "Lose 1 VP per 5 VP you have.", resolveId: "contentDecay", ctype: "personal" },
  { name: "Reorg", effect: "Discard your highest-value Action card.", resolveId: "discardHighest", ctype: "personal" },
  { name: "Executive Pivot", effect: "Swap hands with the player with the most cards.", resolveId: "swapHands", ctype: "personal" },
  { name: "Market Crash", effect: "ALL players lose 1 VP.", resolveId: "allVp:-1", ctype: "global" },
  { name: "Google Core Update", effect: "ALL lose 1 VP. Leader loses 2.", resolveId: "allVp:-1,leaderExtra:-1", ctype: "global" },
  { name: "Platform Outage", effect: "ALL players skip Action play.", resolveId: "allSkipAction", ctype: "global" },
  { name: "Content Saturation", effect: "ALL players' next Action worth 1 less.", resolveId: "allReduceNext:1", ctype: "global" },
  { name: "New Competitor Enters", effect: "Last place gains +2 VP. Others lose 1.", resolveId: "newCompetitor", ctype: "global" },
  { name: "AI Generates Everything Now", effect: "ALL lose 1 VP. Holding a 3-point card? Safe.", resolveId: "allVpUnless3", ctype: "global" },
  { name: "Economic Downturn", effect: "ALL players lose 2 VP.", resolveId: "allVp:-2", ctype: "global" },
  { name: "Privacy Regulation", effect: "ALL lose 1 VP. 5+ VP lose 2.", resolveId: "privacyReg", ctype: "global" },
  { name: "Trending Topic", effect: "ALL players draw 1 extra Action card.", resolveId: "allDraw:1", ctype: "global" },
  { name: "Budget Freeze", effect: "ALL discard highest-value Action card.", resolveId: "allDiscardHighest", ctype: "global" },
  { name: "Layoffs Hit Marketing", effect: "ALL lose 1 VP and discard 1 card.", resolveId: "allVp:-1,allDiscardRandom:1", ctype: "global" },
  { name: "AI Model Refresh", effect: "ALL discard 1 random card.", resolveId: "allDiscardRandom:1", ctype: "global" },
  { name: "Tool Consolidation", effect: "ALL discard 2 random cards.", resolveId: "allDiscardRandom:2", ctype: "global" },
  { name: "Channel Consolidation", effect: "ALL discard to 3 cards.", resolveId: "allDiscardTo:3", ctype: "global" },
  { name: "Industry Shakeup", effect: "ALL pass hand to the left.", resolveId: "passHands", ctype: "global" },
  { name: "Viral Moment", effect: "Gain +2 VP!", resolveId: "vp:2", ctype: "lucky" },
  { name: "PR Feature", effect: "Gain +1 VP and draw 2 cards.", resolveId: "vp:1,drawCards:2", ctype: "lucky" },
  { name: "Inbound Lead Surge", effect: "Gain +1 VP. Last place: +3 instead.", resolveId: "vpOrLast", ctype: "lucky" },
  { name: "Speaking Invitation", effect: "Gain +2 VP!", resolveId: "vp:2", ctype: "lucky" },
  { name: "AirOps Free Trial", effect: "Draw 3 Action cards, keep 2.", resolveId: "drawCards:3,discardRandom:1", ctype: "lucky" },
  { name: "Podcast Appearance", effect: "Gain +1 VP and draw 1 card.", resolveId: "vp:1,drawCards:1", ctype: "lucky" },
  { name: "Competitor Implodes", effect: "Gain +2 VP!", resolveId: "vp:2", ctype: "lucky" },
  { name: "Conference Keynote", effect: "Gain +3 VP!", resolveId: "vp:3", ctype: "lucky" },
  { name: "Award Winner", effect: "Gain +2 VP and draw 1 card.", resolveId: "vp:2,drawCards:1", ctype: "lucky" },
  { name: "Organic Traffic Spike", effect: "Gain +2 VP!", resolveId: "vp:2", ctype: "lucky" },
  { name: "Media Coverage", effect: "Gain +2 VP!", resolveId: "vp:2", ctype: "lucky" },
  { name: "Customer Testimonial", effect: "Gain +1 VP. Next Action unblockable.", resolveId: "vp:1,unblockable", ctype: "lucky" },
  { name: "Surprise Budget", effect: "Draw 3 Action cards!", resolveId: "drawCards:3", ctype: "lucky" },
  { name: "Partnership Announced", effect: "Gain +1 VP and draw 2 cards.", resolveId: "vp:1,drawCards:2", ctype: "lucky" },
  { name: "Content Goes Evergreen", effect: "Gain +1 VP now and +1 next turn.", resolveId: "vp:1,vpNextTurn:1", ctype: "lucky" },
  { name: "Board Sees the Deck", effect: "Gain +1 VP. Next Action +1 VP.", resolveId: "vp:1,boostNext:1", ctype: "lucky" },
];

function buildChallengeDeck() { return shuffle([...CHALLENGE_DEFS]); }
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* ═══════════════════════════ DEEP CLONE ═══════════════════════════ */
function cloneGame(g) {
  return {
    ...g,
    players: g.players.map(p => ({ ...p, champion: { ...p.champion }, hand: p.hand.map(c => ({ ...c })), effects: { ...p.effects } })),
    actionDeck: g.actionDeck.map(c => ({ ...c })),
    challengeDeck: g.challengeDeck.map(c => ({ ...c })),
    actionDiscard: g.actionDiscard.map(c => ({ ...c })),
    log: [...g.log],
    currentChallenge: g.currentChallenge ? { ...g.currentChallenge } : null,
    winner: g.winner ? { ...g.winner } : null,
  };
}

/* ═══════════════════════════ RESOLVE ENGINE ═══════════════════════════ */

function adjVp(g, idx, amt) { g.players[idx].vp = Math.max(0, g.players[idx].vp + amt); }
function drw(g, idx, n) { const d = []; for (let i = 0; i < n && g.actionDeck.length; i++) d.push(g.actionDeck.shift()); g.players[idx].hand.push(...d); return d; }
function discRand(g, idx, n) { const p = g.players[idx]; for (let i = 0; i < n && p.hand.length; i++) { const ri = Math.floor(Math.random() * p.hand.length); g.actionDiscard.push(p.hand.splice(ri, 1)[0]); } }
function discHigh(g, idx) { const p = g.players[idx]; if (!p.hand.length) return; let mi = 0; p.hand.forEach((c, i) => { if (c.vp > p.hand[mi].vp) mi = i; }); g.actionDiscard.push(p.hand.splice(mi, 1)[0]); }

function execResolve(g, card, targetIdx) {
  const parts = card.resolveId.split(",");
  const logs = [];
  const p = g.players[targetIdx];

  for (const part of parts) {
    const [key, val] = part.includes(":") ? [part.split(":")[0], part.split(":").slice(1).join(":")] : [part, undefined];
    const n = val !== undefined ? parseInt(val) : 0;

    switch (key) {
      case "vp": adjVp(g, targetIdx, n); logs.push(n > 0 ? `${p.name} gains +${n} VP!` : `${p.name} loses ${Math.abs(n)} VP.`); break;
      case "skipAction": p.effects.skipAction = true; logs.push(`${p.name} must skip Action play.`); break;
      case "reduceNext": p.effects.reduceNext = (p.effects.reduceNext || 0) + n; logs.push(`${p.name}'s next Action worth ${n} less VP.`); break;
      case "maxPlayable": p.effects.maxPlayable = n; logs.push(`${p.name} can only play ${n}-point cards.`); break;
      case "discardRandom": discRand(g, targetIdx, n); logs.push(`${p.name} discards ${n} random card(s).`); break;
      case "skipDraw": p.effects.skipDraw = true; logs.push(`${p.name} skips draw next turn.`); break;
      case "drawCards": drw(g, targetIdx, n); logs.push(`${p.name} draws ${n} card(s).`); break;
      case "lockPower": p.effects.lockPower = true; logs.push(`${p.name}'s Champion power locked next turn.`); break;
      case "discardAll": g.actionDiscard.push(...p.hand); p.hand = []; logs.push(`${p.name} discards entire hand.`); break;
      case "discardHighest": discHigh(g, targetIdx); logs.push(`${p.name} discards highest-value card.`); break;
      case "vpNextTurn": p.effects.vpNextTurn = n; break;
      case "boostNext": p.effects.boostNext = (p.effects.boostNext || 0) + n; logs.push(`${p.name}'s next Action worth +${n} more VP.`); break;
      case "unblockable": p.effects.unblockable = true; break;
      case "plagiarism": { const loss = p.vp >= 6 ? -2 : -1; adjVp(g, targetIdx, loss); logs.push(`${p.name} loses ${Math.abs(loss)} VP.`); break; }
      case "contentDecay": { const loss = Math.floor(p.vp / 5); if (loss > 0) { adjVp(g, targetIdx, -loss); logs.push(`${p.name} loses ${loss} VP from decay.`); } else logs.push(`${p.name} unaffected.`); break; }
      case "swapHands": {
        let maxC = 0, maxI = targetIdx;
        g.players.forEach((pl, i) => { if (i !== targetIdx && pl.hand.length > maxC) { maxC = pl.hand.length; maxI = i; } });
        if (maxI !== targetIdx) { const t = p.hand; p.hand = g.players[maxI].hand; g.players[maxI].hand = t; logs.push(`${p.name} swapped hands with ${g.players[maxI].name}!`); }
        break;
      }
      case "vpOrLast": { const minV = Math.min(...g.players.map(pl => pl.vp)); const gain = p.vp <= minV ? 3 : 1; adjVp(g, targetIdx, gain); logs.push(`${p.name} gains +${gain} VP!`); break; }
      case "allVp": g.players.forEach((_, i) => adjVp(g, i, n)); logs.push(`ALL players ${n > 0 ? "gain" : "lose"} ${Math.abs(n)} VP.`); break;
      case "leaderExtra": { const mx = Math.max(...g.players.map(pl => pl.vp)); g.players.forEach((pl, i) => { if (pl.vp >= mx) adjVp(g, i, n); }); logs.push(`Leader(s) lose extra ${Math.abs(n)} VP.`); break; }
      case "allSkipAction": g.players.forEach(pl => { pl.effects.skipAction = true; }); logs.push("ALL players skip Action play."); break;
      case "allReduceNext": g.players.forEach(pl => { pl.effects.reduceNext = (pl.effects.reduceNext || 0) + n; }); logs.push(`ALL: next Action worth ${n} less VP.`); break;
      case "newCompetitor": {
        const minV = Math.min(...g.players.map(pl => pl.vp));
        g.players.forEach((pl, i) => { if (pl.vp <= minV) { adjVp(g, i, 2); logs.push(`${pl.name} (last) gains +2 VP!`); } else { adjVp(g, i, -1); logs.push(`${pl.name} loses 1 VP.`); } });
        break;
      }
      case "allVpUnless3": g.players.forEach((pl, i) => { if (pl.hand.some(c => c.vp >= 3)) logs.push(`${pl.name} safe (holds 3pt).`); else { adjVp(g, i, -1); logs.push(`${pl.name} loses 1 VP.`); } }); break;
      case "privacyReg": g.players.forEach((pl, i) => { const l = pl.vp >= 5 ? -2 : -1; adjVp(g, i, l); logs.push(`${pl.name} loses ${Math.abs(l)} VP.`); }); break;
      case "allDraw": g.players.forEach((_, i) => drw(g, i, n)); logs.push(`ALL draw ${n} card(s).`); break;
      case "allDiscardHighest": g.players.forEach((_, i) => discHigh(g, i)); logs.push("ALL discard highest-value card."); break;
      case "allDiscardRandom": g.players.forEach((_, i) => discRand(g, i, n)); logs.push(`ALL discard ${n} random card(s).`); break;
      case "allDiscardTo": g.players.forEach(pl => { while (pl.hand.length > n) g.actionDiscard.push(pl.hand.splice(Math.floor(Math.random() * pl.hand.length), 1)[0]); }); logs.push(`ALL discard down to ${n} cards.`); break;
      case "passHands": { const hs = g.players.map(pl => pl.hand); g.players.forEach((pl, i) => { pl.hand = hs[(i + g.players.length - 1) % g.players.length]; }); logs.push("ALL pass hands left!"); break; }
    }
  }
  return logs;
}

const PH = { DRAW: "draw", CHALLENGE: "challenge", CHALLENGE_RESOLVE: "challenge_resolve", PLAY: "play", CLEANUP: "cleanup", GAME_OVER: "game_over" };
function checkWin(g) { for (const p of g.players) { if (p.vp >= g.winVp) { g.winner = p; g.phase = PH.GAME_OVER; return true; } } return false; }

/* ══════════════════════════════════════════════ UI COMPONENTS ══════════════════════════════════════════════ */

const btnStyle = { padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600, letterSpacing: 0.5, transition: "all 0.2s ease" };

function MiniCard({ card, onClick, selected, disabled, small }) {
  const isA = card.type === "action" || card.type === "special";
  const vc = card.vp >= 3 ? "#D4AF37" : card.vp >= 2 ? "#7B8794" : "#A0724A";
  return (
    <div onClick={disabled ? undefined : onClick} style={{ width: small ? 120 : 150, minHeight: small ? 155 : 195, borderRadius: 12, padding: small ? "10px 10px 8px" : "14px 14px 10px", cursor: disabled ? "default" : onClick ? "pointer" : "default", opacity: disabled ? 0.4 : 1, background: isA ? "linear-gradient(145deg, #1a1a2e, #16213e)" : "#fff", border: selected ? "3px solid #D4AF37" : isA ? "2px solid rgba(255,255,255,0.1)" : "2px solid #ddd", boxShadow: selected ? "0 0 20px rgba(212,175,55,0.3)" : "0 2px 8px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", transition: "all 0.2s ease", transform: selected ? "translateY(-6px)" : "translateY(0)", position: "relative", flexShrink: 0 }}>
      {isA && <div style={{ position: "absolute", top: 8, right: 8, width: small ? 24 : 30, height: small ? 24 : 30, borderRadius: "50%", background: vc, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: small ? 12 : 15, color: "#fff", fontWeight: 900 }}>+{card.vp}</div>}
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: small ? 8 : 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: isA ? "rgba(255,255,255,0.5)" : "#999", marginBottom: 4 }}>{card.type === "special" ? "SPECIAL" : card.type?.toUpperCase() || "ACTION"}</div>
      <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: small ? 13 : 16, color: isA ? "#fff" : "#1a1a2e", lineHeight: 1.2, marginBottom: 6, paddingRight: isA ? 30 : 0 }}>{card.name}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: small ? 8 : 9, color: isA ? "rgba(255,255,255,0.6)" : "#666", lineHeight: 1.4, flex: 1 }}>{card.flavor || card.effect}</div>
      {card.effectText && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: small ? 7 : 8, color: "#D4AF37", marginTop: 4, fontWeight: 600 }}>{card.effectText}</div>}
    </div>
  );
}

function ChallengeCard({ card }) {
  const bg = card.ctype === "lucky" ? "linear-gradient(135deg, #2E7D32, #1B5E20)" : card.ctype === "global" ? "linear-gradient(135deg, #B71C1C, #880E4F)" : "linear-gradient(135deg, #E65100, #BF360C)";
  const icon = card.ctype === "lucky" ? "★" : card.ctype === "global" ? "⚡" : "⚠";
  return (
    <div style={{ width: 220, borderRadius: 14, padding: "18px 16px 14px", background: bg, border: "2px solid rgba(255,255,255,0.2)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>{icon} {card.ctype} challenge</div>
      <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 20, color: "#fff", lineHeight: 1.2, marginBottom: 8 }}>{card.name}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{card.effect}</div>
    </div>
  );
}

function PlayerStrip({ player, isActive, isCurrent, color }) {
  const c = COLORS[color] || COLORS.vision;
  return (
    <div style={{ background: isActive ? c.gradient : isCurrent ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)", border: isActive ? `3px solid ${c.border}` : isCurrent ? "2px solid #D4AF37" : "1px solid #ddd", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, transition: "all 0.3s ease", boxShadow: isActive ? `0 4px 20px ${c.border}40` : "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: c.bg, border: `2px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 16, color: c.accent, fontWeight: 900 }}>{player.name.charAt(0)}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 14, color: isActive ? c.accent : "#333" }}>{player.name}{player.isHuman ? " (YOU)" : ""}</div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: isActive ? c.accent : "#999", letterSpacing: 1 }}>{CLASS_DISPLAY[player.champion.cls]} | {player.hand.length} cards</div>
      </div>
      <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 28, color: isActive ? c.accent : "#333" }}>{player.vp}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: isActive ? c.accent : "#999" }}>VP</div>
    </div>
  );
}

/* ══════════════════════════════════════════════ MAIN COMPONENT ══════════════════════════════════════════════ */

export default function VisibilityQuest() {
  const [screen, setScreen] = useState("title");
  const [game, setGame] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [gameLength, setGameLength] = useState("normal");
  const logRef = useRef(null);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [game?.log]);

  const winVpMap = { short: 10, normal: 20, long: 50 };

  function startGame() {
    if (!selectedChampion) return;
    const winVp = winVpMap[gameLength];
    const available = ALL_CHAMPIONS.filter(c => c.id !== selectedChampion.id);
    const opponents = shuffle(available).slice(0, 3);
    const actionDeck = buildActionDeck();
    const challengeDeck = buildChallengeDeck();
    const players = [
      { ...makePlayer(selectedChampion, true), hand: [] },
      ...opponents.map(c => ({ ...makePlayer(c, false), hand: [] })),
    ];
    players.forEach(p => { for (let i = 0; i < 4 && actionDeck.length; i++) p.hand.push(actionDeck.shift()); });
    setGame({
      players, actionDeck, challengeDeck, actionDiscard: [],
      currentPlayerIdx: 0, round: 1, phase: PH.DRAW,
      log: ["Game started! Draw your first card."],
      currentChallenge: null, winner: null, winVp,
    });
    setScreen("game");
    setSelectedCard(null);
  }

  function makePlayer(champ, isHuman) {
    return { name: champ.name, champion: { ...champ }, vp: 0, hand: [], isHuman, effects: {}, powerUsedThisGame: false, powerUsedThisRound: false };
  }

  function act(fn) {
    setGame(prev => {
      const g = cloneGame(prev);
      fn(g);
      return g;
    });
  }

  function doDraw(g) {
    const p = g.players[g.currentPlayerIdx];
    if (p.effects.skipDraw) { g.log.push(`${p.name} skips draw (effect).`); delete p.effects.skipDraw; }
    else {
      const n = p.champion.powerType === "scale" ? 2 : 1;
      const drawn = drw(g, g.currentPlayerIdx, n);
      g.log.push(`${p.name} draws ${drawn.length} card(s).`);
    }
    if (p.effects.vpNextTurn) { adjVp(g, g.currentPlayerIdx, p.effects.vpNextTurn); g.log.push(`${p.name} gains +${p.effects.vpNextTurn} VP (evergreen).`); delete p.effects.vpNextTurn; }
    g.phase = PH.CHALLENGE;
  }

  function doChallenge(g) {
    if (!g.challengeDeck.length) g.challengeDeck = buildChallengeDeck();
    const card = g.challengeDeck.shift();
    g.currentChallenge = card;
    g.log.push(`Challenge: ${card.name} (${card.ctype})`);
    g.phase = PH.CHALLENGE_RESOLVE;
  }

  function resolveChallenge(g) {
    const card = g.currentChallenge;
    const idx = g.currentPlayerIdx;
    const p = g.players[idx];
    if (p.effects.immune) { g.log.push(`${p.name} is immune! Challenge ignored.`); delete p.effects.immune; }
    else {
      const logs = execResolve(g, card, idx);
      logs.forEach(l => g.log.push(l));
    }
    g.currentChallenge = null;
    if (checkWin(g)) return;
    g.phase = PH.PLAY;
  }

  function playCard(g, cardIndex) {
    const p = g.players[g.currentPlayerIdx];
    if (p.effects.skipAction) { g.log.push(`${p.name} skips Action play.`); delete p.effects.skipAction; g.phase = PH.CLEANUP; return; }
    const card = p.hand[cardIndex];
    if (!card) return;
    if (p.effects.maxPlayable !== undefined && card.vp > p.effects.maxPlayable) return;
    p.hand.splice(cardIndex, 1);
    let vpGain = card.vp;
    if (p.effects.reduceNext) { vpGain = Math.max(0, vpGain - p.effects.reduceNext); delete p.effects.reduceNext; }
    if (p.effects.boostNext) { vpGain += p.effects.boostNext; delete p.effects.boostNext; }
    const minVp = Math.min(...g.players.map(pl => pl.vp));
    if (p.champion.powerType === "underdog" && p.vp <= minVp) vpGain += 1;
    adjVp(g, g.currentPlayerIdx, vpGain);
    g.log.push(`${p.name} plays ${card.name} for +${vpGain} VP!`);
    if (card.effect === "draw2") { drw(g, g.currentPlayerIdx, 2); g.log.push(`${p.name} draws 2 bonus cards.`); }
    if (card.effect === "steal1") { const opp = g.players.findIndex((_, i) => i !== g.currentPlayerIdx); if (opp >= 0) { adjVp(g, opp, -1); g.log.push(`${g.players[opp].name} loses 1 VP.`); } }
    if (card.effect === "burnDraw4") { g.actionDiscard.push(...p.hand); p.hand = []; drw(g, g.currentPlayerIdx, 4); g.log.push(`${p.name} burns hand, draws 4.`); }
    if (card.effect === "immune") { p.effects.immune = true; g.log.push(`${p.name} gains immunity next turn.`); }
    if (card.effect === "darkSocial") { const mx = Math.max(...g.players.map(pl => pl.vp)); if (p.vp < mx) { adjVp(g, g.currentPlayerIdx, 1); g.log.push(`${p.name} gains +1 bonus VP (not in first).`); } }
    if (card.effect === "viralThread") { const bonus = Math.min(p.hand.length, 5); adjVp(g, g.currentPlayerIdx, bonus); g.log.push(`${p.name} gains +${bonus} VP (viral)!`); }
    g.actionDiscard.push(card);
    delete p.effects.maxPlayable;
    if (checkWin(g)) return;
    g.phase = PH.CLEANUP;
  }

  function skipPlay(g) {
    g.log.push(`${g.players[g.currentPlayerIdx].name} skips Action play.`);
    g.phase = PH.CLEANUP;
  }

  function doCleanup(g) {
    let next = (g.currentPlayerIdx + 1) % g.players.length;
    if (next === 0) g.round++;
    g.currentPlayerIdx = next;
    g.players.forEach(p => { p.powerUsedThisRound = false; });
    g.phase = PH.DRAW;
    if (!g.players[next].isHuman) runAiTurn(g);
  }

  function runAiTurn(g) {
    const idx = g.currentPlayerIdx;
    const p = g.players[idx];
    doDraw(g);
    doChallenge(g);
    resolveChallenge(g);
    if (g.phase === PH.GAME_OVER) return;
    if (p.effects.skipAction) { g.log.push(`${p.name} skips Action play.`); delete p.effects.skipAction; }
    else if (p.hand.length > 0) {
      let best = 0;
      p.hand.forEach((c, i) => {
        if (p.effects.maxPlayable !== undefined && c.vp > p.effects.maxPlayable) return;
        if (c.vp > p.hand[best].vp || (p.effects.maxPlayable !== undefined && p.hand[best].vp > p.effects.maxPlayable)) best = i;
      });
      if (p.effects.maxPlayable !== undefined && p.hand[best].vp > p.effects.maxPlayable) {
        g.log.push(`${p.name} can't play any card.`);
      } else {
        playCard(g, best);
        if (g.phase === PH.GAME_OVER) return;
      }
    }
    delete p.effects.maxPlayable;
    let next2 = (idx + 1) % g.players.length;
    if (next2 === 0) g.round++;
    g.currentPlayerIdx = next2;
    g.players.forEach(pl => { pl.powerUsedThisRound = false; });
    g.phase = PH.DRAW;
    if (!g.players[next2].isHuman) runAiTurn(g);
  }

  /* ═══════════════════════════ SCREENS ═══════════════════════════ */

  if (screen === "title") {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a1a, #1a1a2e, #16213e)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 30, fontFamily: "'DM Mono', monospace" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 4, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>AIROPS PRESENTS</div>
          <h1 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 64, color: "#fff", margin: 0, letterSpacing: 3, lineHeight: 1 }}>VISIBILITY</h1>
          <h1 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 64, color: "#D4AF37", margin: 0, letterSpacing: 3, lineHeight: 1 }}>QUEST</h1>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 12 }}>The Content Marketing Card Game</div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", maxWidth: 700, marginBottom: 30 }}>
          {ALL_CHAMPIONS.map(ch => {
            const c = COLORS[ch.cls];
            const sel = selectedChampion?.id === ch.id;
            return (
              <div key={ch.id} onClick={() => setSelectedChampion(ch)} style={{ width: 140, padding: "14px 12px", borderRadius: 12, cursor: "pointer", background: sel ? c.gradient : "rgba(255,255,255,0.05)", border: sel ? `3px solid ${c.border}` : "2px solid rgba(255,255,255,0.1)", transition: "all 0.2s ease", transform: sel ? "translateY(-4px)" : "none", boxShadow: sel ? `0 4px 20px ${c.border}40` : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: c.bg, border: `2px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 16, color: c.accent, fontWeight: 900, margin: "0 auto 8px" }}>{ch.name.charAt(0)}</div>
                <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 13, color: sel ? c.accent : "#fff", textAlign: "center" }}>{ch.name.split(" ")[0]}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, color: sel ? c.accent : "rgba(255,255,255,0.4)", textAlign: "center", letterSpacing: 1, marginTop: 2 }}>{CLASS_DISPLAY[ch.cls]}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: sel ? c.accent : "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 4 }}>{ch.power}</div>
              </div>
            );
          })}
        </div>
        {selectedChampion && (
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "16px 24px", marginBottom: 24, maxWidth: 400, textAlign: "center" }}>
            <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 18, color: "#fff" }}>{selectedChampion.name}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>{selectedChampion.title}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#D4AF37", marginBottom: 4 }}>{selectedChampion.power}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.6)" }}>{selectedChampion.powerDesc}</div>
          </div>
        )}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[{ k: "short", label: "SHORT", sub: "10 VP / ~10 min" }, { k: "normal", label: "NORMAL", sub: "20 VP / ~25 min" }, { k: "long", label: "LONG", sub: "50 VP / ~60 min" }].map(o => (
            <div key={o.k} onClick={() => setGameLength(o.k)} style={{ padding: "10px 18px", borderRadius: 10, cursor: "pointer", background: gameLength === o.k ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.05)", border: gameLength === o.k ? "2px solid #D4AF37" : "2px solid rgba(255,255,255,0.1)", textAlign: "center", transition: "all 0.2s ease" }}>
              <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 14, color: gameLength === o.k ? "#D4AF37" : "#fff" }}>{o.label}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.4)" }}>{o.sub}</div>
            </div>
          ))}
        </div>
        <button onClick={startGame} disabled={!selectedChampion} style={{ ...btnStyle, background: selectedChampion ? "linear-gradient(135deg, #D4AF37, #B8860B)" : "#333", color: selectedChampion ? "#1a1a2e" : "#666", fontSize: 14, padding: "14px 40px" }}>START GAME</button>
      </div>
    );
  }

  if (!game) return null;

  const me = game.players.find(p => p.isHuman);
  const meIdx = game.players.findIndex(p => p.isHuman);
  const isMyTurn = game.currentPlayerIdx === meIdx;
  const phase = game.phase;

  if (phase === PH.GAME_OVER) {
    const w = game.winner;
    const wc = COLORS[w.champion.cls];
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a1a, #1a1a2e)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 30 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 4, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>GAME OVER</div>
        <h1 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 48, color: "#D4AF37", margin: 0 }}>{w.name} WINS!</h1>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>{w.vp} VP in {game.round} rounds</div>
        <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
          {game.players.sort((a, b) => b.vp - a.vp).map((p, i) => (
            <div key={i} style={{ background: p === w ? wc.gradient : "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 20px", textAlign: "center", border: p === w ? `2px solid ${wc.border}` : "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 24, color: p === w ? wc.accent : "#fff" }}>{i + 1}</div>
              <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 14, color: p === w ? wc.accent : "#fff" }}>{p.name}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: p === w ? wc.accent : "rgba(255,255,255,0.5)" }}>{p.vp} VP</div>
            </div>
          ))}
        </div>
        <button onClick={() => { setScreen("title"); setGame(null); setSelectedChampion(null); setSelectedCard(null); }} style={{ ...btnStyle, background: "linear-gradient(135deg, #D4AF37, #B8860B)", color: "#1a1a2e", marginTop: 30, fontSize: 14, padding: "14px 40px" }}>PLAY AGAIN</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", fontFamily: "'DM Mono', monospace" }}>
      {/* LEFT SIDEBAR */}
      <div style={{ width: 260, background: "#1a1a2e", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
        <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 20, color: "#D4AF37", marginBottom: 4, textAlign: "center" }}>VISIBILITY QUEST</div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 8 }}>Round {game.round} | Target: {game.winVp} VP</div>
        {game.players.map((p, i) => (
          <PlayerStrip key={i} player={p} isActive={game.currentPlayerIdx === i} isCurrent={p.isHuman} color={p.champion.cls} />
        ))}
        <div style={{ flex: 1 }} />
        <div ref={logRef} style={{ maxHeight: 200, overflowY: "auto", background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 10 }}>
          {game.log.slice(-15).map((l, i) => (
            <div key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.6)", marginBottom: 3, lineHeight: 1.4 }}>{l}</div>
          ))}
        </div>
      </div>

      {/* MAIN AREA */}
      <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Phase Banner */}
        <div style={{ background: "#1a1a2e", borderRadius: 12, padding: "12px 20px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>
              {isMyTurn ? "YOUR TURN" : `${game.players[game.currentPlayerIdx].name.toUpperCase()}'S TURN`}
            </div>
            <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 22, color: "#fff" }}>
              {phase === PH.DRAW && "DRAW PHASE"}
              {phase === PH.CHALLENGE && "CHALLENGE PHASE"}
              {phase === PH.CHALLENGE_RESOLVE && "RESOLVE CHALLENGE"}
              {phase === PH.PLAY && "ACTION PHASE"}
              {phase === PH.CLEANUP && "END OF TURN"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {isMyTurn && phase === PH.DRAW && (
              <button onClick={() => act(g => { doDraw(g); })} style={{ ...btnStyle, background: "linear-gradient(135deg, #D4AF37, #B8860B)", color: "#1a1a2e" }}>DRAW CARD</button>
            )}
            {isMyTurn && phase === PH.CHALLENGE && (
              <button onClick={() => act(g => { doChallenge(g); })} style={{ ...btnStyle, background: "linear-gradient(135deg, #E65100, #BF360C)", color: "#fff" }}>DRAW CHALLENGE</button>
            )}
            {isMyTurn && phase === PH.CHALLENGE_RESOLVE && (
              <button onClick={() => act(g => { resolveChallenge(g); })} style={{ ...btnStyle, background: "linear-gradient(135deg, #E65100, #BF360C)", color: "#fff" }}>RESOLVE</button>
            )}
            {isMyTurn && phase === PH.PLAY && (
              <button onClick={() => act(g => skipPlay(g))} style={{ ...btnStyle, background: "rgba(255,255,255,0.1)", color: "#fff" }}>SKIP</button>
            )}
            {isMyTurn && phase === PH.CLEANUP && (
              <button onClick={() => act(g => doCleanup(g))} style={{ ...btnStyle, background: "linear-gradient(135deg, #D4AF37, #B8860B)", color: "#1a1a2e" }}>END TURN</button>
            )}
          </div>
        </div>

        {/* Challenge Display */}
        {game.currentChallenge && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <ChallengeCard card={game.currentChallenge} />
          </div>
        )}

        {/* Hand */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#999", letterSpacing: 1, marginBottom: 8 }}>YOUR HAND ({me.hand.length} cards)</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {me.hand.map((card, i) => {
              const canPlay = isMyTurn && phase === PH.PLAY && !me.effects.skipAction && (me.effects.maxPlayable === undefined || card.vp <= me.effects.maxPlayable);
              return (
                <MiniCard key={i} card={card} selected={selectedCard === i} disabled={!canPlay && phase === PH.PLAY}
                  onClick={canPlay ? () => {
                    if (selectedCard === i) {
                      act(g => playCard(g, i));
                      setSelectedCard(null);
                    } else setSelectedCard(i);
                  } : undefined}
                />
              );
            })}
            {me.hand.length === 0 && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#999", padding: 20 }}>No cards in hand.</div>}
          </div>
          {selectedCard !== null && isMyTurn && phase === PH.PLAY && (
            <div style={{ marginTop: 12, fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#D4AF37" }}>Click again to play this card.</div>
          )}
        </div>
      </div>
    </div>
  );
}
