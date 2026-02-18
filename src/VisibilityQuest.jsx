import { useState } from "react";

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
    turnsUsed: g.turnsUsed,
    turnLimit: g.turnLimit,
    gameMode: g.gameMode,
    soloResult: g.soloResult,
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
function checkWin(g) {
  for (const p of g.players) {
    if (p.vp >= g.winVp) {
      g.winner = p;
      if (g.gameMode === "solo") g.soloResult = "win";
      g.phase = PH.GAME_OVER;
      return true;
    }
  }
  return false;
}

/* ══════════════════════════════════════════════ UI COMPONENTS ══════════════════════════════════════════════ */

const btnStyle = { padding: "12px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: 0, transition: "all 0.2s ease" };

function MiniCard({ card, onClick, selected, disabled, small }) {
  const isA = card.type === "action" || card.type === "special";
  const vc = card.vp >= 3 ? "#00e87b" : card.vp >= 2 ? "#6b6b6b" : "#aaa";
  return (
    <div onClick={disabled ? undefined : onClick} style={{ width: small ? 120 : 150, minHeight: small ? 155 : 195, borderRadius: 8, padding: small ? "10px 10px 8px" : "14px 14px 10px", cursor: disabled ? "default" : onClick ? "pointer" : "default", opacity: disabled ? 0.4 : 1, background: "#fff", border: selected ? "2px solid #00e87b" : "1px solid #e5e5e5", boxShadow: selected ? "0 0 16px rgba(0,232,123,0.15)" : "0 1px 3px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", transition: "all 0.2s ease", transform: selected ? "translateY(-4px)" : "translateY(0)", position: "relative", flexShrink: 0 }}>
      {isA && <div style={{ position: "absolute", top: 8, right: 8, width: small ? 22 : 26, height: small ? 22 : 26, borderRadius: "50%", background: vc, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", fontSize: small ? 11 : 12, color: "#fff", fontWeight: 700 }}>+{card.vp}</div>}
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: small ? 8 : 9, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#6b6b6b", marginBottom: 4 }}>{card.type === "special" ? "SPECIAL" : card.type?.toUpperCase() || "ACTION"}</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: small ? 13 : 15, color: "#0a0a0a", lineHeight: 1.2, marginBottom: 6, paddingRight: isA ? 28 : 0, fontWeight: 600 }}>{card.name}</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: small ? 9 : 10, color: "#6b6b6b", lineHeight: 1.4, flex: 1 }}>{card.flavor || card.effect}</div>
      {card.effectText && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: small ? 8 : 9, color: "#00e87b", marginTop: 4, fontWeight: 600 }}>{card.effectText}</div>}
    </div>
  );
}

function ChallengeCard({ card }) {
  const border = card.ctype === "lucky" ? "#00e87b" : card.ctype === "global" ? "#e5e5e5" : "#e5e5e5";
  const badge = card.ctype === "lucky" ? { bg: "#e6fff2", color: "#00a85a" } : card.ctype === "global" ? { bg: "#f5f5f5", color: "#6b6b6b" } : { bg: "#f5f5f5", color: "#6b6b6b" };
  const icon = card.ctype === "lucky" ? "★" : card.ctype === "global" ? "⚡" : "⚠";
  return (
    <div style={{ width: 240, borderRadius: 8, padding: "18px 16px 14px", background: "#fff", border: `1px solid ${border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: badge.color, marginBottom: 6, display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ background: badge.bg, padding: "2px 8px", borderRadius: 4, fontSize: 9 }}>{icon} {card.ctype}</span></div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: "#0a0a0a", lineHeight: 1.2, marginBottom: 8, fontWeight: 700 }}>{card.name}</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6b6b6b", lineHeight: 1.5 }}>{card.effect}</div>
    </div>
  );
}

function PlayerStrip({ player, isActive, isCurrent, color }) {
  const c = COLORS[color] || COLORS.vision;
  return (
    <div style={{ background: isActive ? "#f5f5f5" : "#fff", border: isActive ? `2px solid ${c.border}` : isCurrent ? "2px solid #00e87b" : "1px solid #e5e5e5", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: c.light, border: `2px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", fontSize: 14, color: c.accent, fontWeight: 700 }}>{player.name.charAt(0)}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0a0a0a", fontWeight: 600 }}>{player.name}{isCurrent ? " (YOU)" : ""}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6b6b6b", letterSpacing: 0 }}>{CLASS_DISPLAY[player.champion.cls]} | {player.hand.length} cards</div>
      </div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, color: "#0a0a0a", fontWeight: 700 }}>{player.vp}</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#6b6b6b" }}>VP</div>
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
  const [showRules, setShowRules] = useState(false);
  const [gameMode, setGameMode] = useState(null); // "solo" | "vs_ai" | "local"
  const [playerCount, setPlayerCount] = useState(2); // for local mode
  const [setupStep, setSetupStep] = useState(0); // which player is picking champion in local mode
  const [localChampions, setLocalChampions] = useState([]); // selected champions for local mode
  const [showPassScreen, setShowPassScreen] = useState(false); // pass-and-play interstitial

  const winVpMap = { short: 10, normal: 20, long: 50 };
  const turnLimitMap = { short: 15, normal: 30, long: 60 };

  function startGame() {
    const winVp = winVpMap[gameLength];
    const actionDeck = buildActionDeck();
    const challengeDeck = buildChallengeDeck();
    let players;

    if (gameMode === "solo") {
      if (!selectedChampion) return;
      players = [{ ...makePlayer(selectedChampion, true), hand: [] }];
    } else if (gameMode === "vs_ai") {
      if (!selectedChampion) return;
      const available = ALL_CHAMPIONS.filter(c => c.id !== selectedChampion.id);
      const opponents = shuffle(available).slice(0, 3);
      players = [
        { ...makePlayer(selectedChampion, true), hand: [] },
        ...opponents.map(c => ({ ...makePlayer(c, false), hand: [] })),
      ];
    } else if (gameMode === "local") {
      if (localChampions.length !== playerCount) return;
      players = localChampions.map(c => ({ ...makePlayer(c, true), hand: [] }));
    } else return;

    players.forEach(p => { for (let i = 0; i < 4 && actionDeck.length; i++) p.hand.push(actionDeck.shift()); });
    setGame({
      players, actionDeck, challengeDeck, actionDiscard: [],
      currentPlayerIdx: 0, round: 1, phase: PH.DRAW,
      log: [gameMode === "solo" ? "Solo game started! Click the deck to draw." : "Game started! Click the deck to draw."],
      currentChallenge: null, winner: null, winVp,
      gameMode,
      turnsUsed: 0,
      turnLimit: gameMode === "solo" ? turnLimitMap[gameLength] : null,
      soloResult: null, // "win" | "lose" for solo mode
    });
    setScreen("game");
    setSelectedCard(null);
    setShowPassScreen(false);
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
    // Solo mode: increment turn count and check limit
    if (g.gameMode === "solo") {
      g.turnsUsed++;
      if (g.turnLimit && g.turnsUsed >= g.turnLimit) {
        g.soloResult = "lose";
        g.winner = g.players[0]; // show player's stats
        g.phase = PH.GAME_OVER;
        g.log.push(`Out of turns! Final score: ${g.players[0].vp} VP.`);
        return;
      }
      // Solo: stays on player 0
      g.players.forEach(p => { p.powerUsedThisRound = false; });
      g.round++;
      g.phase = PH.DRAW;
      return;
    }

    let next = (g.currentPlayerIdx + 1) % g.players.length;
    if (next === 0) g.round++;
    g.currentPlayerIdx = next;
    g.players.forEach(p => { p.powerUsedThisRound = false; });
    g.phase = PH.DRAW;

    if (g.gameMode === "local") {
      // Pass-and-play: show interstitial
      return; // caller will set showPassScreen
    }

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
    // Determine which champion(s) are already taken in local mode
    const takenIds = localChampions.map(c => c.id);
    const availableForPick = gameMode === "local" ? ALL_CHAMPIONS.filter(c => !takenIds.includes(c.id)) : ALL_CHAMPIONS;
    const isLocalSetup = gameMode === "local" && setupStep < playerCount;
    const currentPickLabel = isLocalSetup ? `Player ${setupStep + 1}: Choose your champion` : "Choose your champion";

    // Can we start?
    const canStart = gameMode === "solo" || gameMode === "vs_ai"
      ? !!selectedChampion
      : gameMode === "local"
        ? localChampions.length === playerCount
        : false;

    function handleLocalPick(ch) {
      setSelectedChampion(ch);
    }

    function confirmLocalPick() {
      if (!selectedChampion) return;
      const next = [...localChampions, selectedChampion];
      setLocalChampions(next);
      setSelectedChampion(null);
      setSetupStep(setupStep + 1);
    }

    return (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 4, color: "#6b6b6b", marginBottom: 12, fontWeight: 500 }}>AIROPS PRESENTS</div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 64, color: "#0a0a0a", margin: 0, letterSpacing: -1, lineHeight: 1, fontWeight: 700 }}>Visibility</h1>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 64, color: "#00e87b", margin: 0, letterSpacing: -1, lineHeight: 1, fontWeight: 700 }}>Quest</h1>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6b6b6b", marginTop: 16 }}>The Content Marketing Card Game</div>
        </div>

        {/* Game Mode Selector */}
        {!gameMode && (
          <>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0a0a0a", fontWeight: 600, marginBottom: 16 }}>Choose a game mode</div>
            <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap", justifyContent: "center" }}>
              {[
                { k: "solo", label: "Solo", sub: "Reach the VP target in a limited number of turns" },
                { k: "vs_ai", label: "vs Computers", sub: "Compete against 3 AI opponents" },
                { k: "local", label: "Pass and Play", sub: "Take turns on the same device with friends" },
              ].map(m => (
                <div key={m.k} onClick={() => { setGameMode(m.k); setSelectedChampion(null); setLocalChampions([]); setSetupStep(0); }} style={{ width: 180, padding: "20px 16px", borderRadius: 8, cursor: "pointer", background: "#fff", border: "1px solid #e5e5e5", textAlign: "center", transition: "all 0.2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#0a0a0a", fontWeight: 700, marginBottom: 6 }}>{m.label}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6b6b6b", lineHeight: 1.5 }}>{m.sub}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* How to Play (only show after mode is chosen) */}
        {gameMode && (
          <>
            <div style={{ background: "#f5f5f5", borderRadius: 8, padding: "28px 32px", marginBottom: 40, maxWidth: 560, width: "100%", border: "1px solid #e5e5e5" }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#0a0a0a", fontWeight: 700, marginBottom: 16 }}>How to Play</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6b6b6b", lineHeight: 1.7 }}>
                <div style={{ marginBottom: 14 }}>
                  {gameMode === "solo" && <>Race to earn <span style={{ fontWeight: 600, color: "#0a0a0a" }}>Victory Points (VP)</span> by playing content marketing action cards before you run out of turns.</>}
                  {gameMode === "vs_ai" && <>You and 3 AI opponents compete to earn <span style={{ fontWeight: 600, color: "#0a0a0a" }}>Victory Points (VP)</span> by playing content marketing action cards. First to reach the target wins.</>}
                  {gameMode === "local" && <>Take turns on the same device. Compete to earn <span style={{ fontWeight: 600, color: "#0a0a0a" }}>Victory Points (VP)</span> by playing content marketing action cards. First to reach the target wins.</>}
                </div>
                <div style={{ fontWeight: 600, color: "#0a0a0a", marginBottom: 8 }}>Each turn has 3 steps:</div>
                <div style={{ marginBottom: 6, paddingLeft: 8 }}><span style={{ color: "#00e87b", fontWeight: 700 }}>1. Draw</span> — Click the deck to draw an action card</div>
                <div style={{ marginBottom: 6, paddingLeft: 8 }}><span style={{ color: "#00e87b", fontWeight: 700 }}>2. Challenge</span> — Click the deck to reveal a random event</div>
                <div style={{ marginBottom: 14, paddingLeft: 8 }}><span style={{ color: "#00e87b", fontWeight: 700 }}>3. Play</span> — Click a card from your hand to select it, then click again to play it for VP</div>
                <div style={{ paddingTop: 14, borderTop: "1px solid #e5e5e5" }}>Cards are worth <span style={{ fontWeight: 600, color: "#0a0a0a" }}>1, 2, or 3 VP</span>. Some special cards have bonus effects like drawing extra cards or stealing VP from opponents.</div>
              </div>
            </div>

            {/* Local mode: player count selector */}
            {gameMode === "local" && localChampions.length === 0 && setupStep === 0 && (
              <>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0a0a0a", fontWeight: 600, marginBottom: 12 }}>How many players?</div>
                <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
                  {[2, 3, 4].map(n => (
                    <div key={n} onClick={() => setPlayerCount(n)} style={{ padding: "10px 24px", borderRadius: 8, cursor: "pointer", background: playerCount === n ? "#e6fff2" : "#fff", border: playerCount === n ? "1px solid #00e87b" : "1px solid #e5e5e5", textAlign: "center", transition: "all 0.2s ease" }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: "#0a0a0a", fontWeight: 700 }}>{n}</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6b6b6b" }}>players</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Champion Selection */}
            {(gameMode !== "local" || isLocalSetup) && (
              <>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0a0a0a", fontWeight: 600, marginBottom: 12 }}>{currentPickLabel}</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", maxWidth: 700, marginBottom: 32 }}>
                  {availableForPick.map(ch => {
                    const c = COLORS[ch.cls];
                    const sel = selectedChampion?.id === ch.id;
                    return (
                      <div key={ch.id} onClick={() => gameMode === "local" ? handleLocalPick(ch) : setSelectedChampion(ch)} style={{ width: 140, padding: "16px 12px", borderRadius: 8, cursor: "pointer", background: sel ? c.light : "#fff", border: sel ? `2px solid ${c.border}` : "1px solid #e5e5e5", transition: "all 0.2s ease", transform: sel ? "translateY(-3px)" : "none", boxShadow: sel ? `0 4px 12px rgba(0,0,0,0.08)` : "0 1px 3px rgba(0,0,0,0.04)" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: c.light, border: `2px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", fontSize: 14, color: c.accent, fontWeight: 700, margin: "0 auto 8px" }}>{ch.name.charAt(0)}</div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#0a0a0a", textAlign: "center", fontWeight: 600 }}>{ch.name.split(" ")[0]}</div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#6b6b6b", textAlign: "center", marginTop: 2 }}>{CLASS_DISPLAY[ch.cls]}</div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#6b6b6b", textAlign: "center", marginTop: 4 }}>{ch.power}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Selected champion detail */}
            {selectedChampion && (
              <div style={{ background: "#f5f5f5", borderRadius: 8, padding: "16px 24px", marginBottom: 24, maxWidth: 400, textAlign: "center", border: "1px solid #e5e5e5" }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: "#0a0a0a", fontWeight: 700 }}>{selectedChampion.name}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6b6b6b", marginBottom: 6 }}>{selectedChampion.title}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#00e87b", marginBottom: 4, fontWeight: 600 }}>{selectedChampion.power}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6b6b6b" }}>{selectedChampion.powerDesc}</div>
              </div>
            )}

            {/* Already-picked champions in local mode */}
            {gameMode === "local" && localChampions.length > 0 && (
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", justifyContent: "center" }}>
                {localChampions.map((ch, i) => {
                  const c = COLORS[ch.cls];
                  return (
                    <div key={ch.id} style={{ background: c.light, border: `1px solid ${c.border}`, borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: c.light, border: `2px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: c.accent, fontWeight: 700 }}>{ch.name.charAt(0)}</div>
                      <div style={{ fontSize: 12, color: "#0a0a0a", fontWeight: 600 }}>P{i + 1}: {ch.name.split(" ")[0]}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Confirm pick button for local mode */}
            {isLocalSetup && selectedChampion && (
              <button onClick={confirmLocalPick} style={{ ...btnStyle, background: "#00e87b", color: "#0a0a0a", fontSize: 14, padding: "12px 32px", marginBottom: 16 }}>Confirm Player {setupStep + 1}</button>
            )}

            {/* Game length selector (show when champion selection is done) */}
            {(gameMode !== "local" || !isLocalSetup) && (
              <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                {[
                  { k: "short", label: "Short", sub: gameMode === "solo" ? "10 VP / 15 turns" : "10 VP" },
                  { k: "normal", label: "Normal", sub: gameMode === "solo" ? "20 VP / 30 turns" : "20 VP" },
                  { k: "long", label: "Long", sub: gameMode === "solo" ? "50 VP / 60 turns" : "50 VP" },
                ].map(o => (
                  <div key={o.k} onClick={() => setGameLength(o.k)} style={{ padding: "10px 20px", borderRadius: 8, cursor: "pointer", background: gameLength === o.k ? "#e6fff2" : "#fff", border: gameLength === o.k ? "1px solid #00e87b" : "1px solid #e5e5e5", textAlign: "center", transition: "all 0.2s ease" }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0a0a0a", fontWeight: 600 }}>{o.label}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6b6b6b" }}>{o.sub}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Back + Start buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => { setGameMode(null); setSelectedChampion(null); setLocalChampions([]); setSetupStep(0); }} style={{ ...btnStyle, background: "transparent", color: "#6b6b6b", border: "1px solid #e5e5e5", fontSize: 14, padding: "12px 24px" }}>Back</button>
              {(gameMode !== "local" || !isLocalSetup) && (
                <button onClick={startGame} disabled={!canStart} style={{ ...btnStyle, background: canStart ? "#00e87b" : "#e5e5e5", color: canStart ? "#0a0a0a" : "#6b6b6b", fontSize: 14, padding: "12px 32px" }}>Start Game</button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  if (!game) return null;

  // In local mode, "me" is the current player. In other modes, it's the human player.
  const me = game.gameMode === "local"
    ? game.players[game.currentPlayerIdx]
    : game.players.find(p => p.isHuman);
  const meIdx = game.gameMode === "local"
    ? game.currentPlayerIdx
    : game.players.findIndex(p => p.isHuman);
  const isMyTurn = game.currentPlayerIdx === meIdx;
  const phase = game.phase;

  // Sub-copy per phase
  const subCopy = {
    [PH.DRAW]: "Click the deck to draw an action card",
    [PH.CHALLENGE]: "Click the deck to reveal a challenge",
    [PH.CHALLENGE_RESOLVE]: "Click the challenge card to resolve its effect",
    [PH.PLAY]: "Select a card from your hand, then click it again to play",
    [PH.CLEANUP]: "Click to end your turn",
  };

  // Handle cleanup with pass screen for local mode
  function handleCleanup() {
    let gameOver = false;
    setGame(prev => {
      const g = cloneGame(prev);
      doCleanup(g);
      if (g.phase === PH.GAME_OVER) gameOver = true;
      return g;
    });
    if (game.gameMode === "local" && !gameOver) {
      setShowPassScreen(true);
    }
  }

  // Game Over Screen
  if (phase === PH.GAME_OVER) {
    const isSolo = game.gameMode === "solo";
    const soloWin = game.soloResult === "win";
    const sorted = [...game.players].sort((a, b) => b.vp - a.vp);

    return (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 4, color: "#6b6b6b", marginBottom: 12, fontWeight: 500 }}>GAME OVER</div>
        {isSolo ? (
          <>
            <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 48, color: soloWin ? "#00e87b" : "#0a0a0a", margin: 0, fontWeight: 700 }}>
              {soloWin ? "You Win!" : "Out of Turns"}
            </h1>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#6b6b6b", marginTop: 8 }}>
              {game.players[0].vp} / {game.winVp} VP in {game.turnsUsed} turns
            </div>
            <div style={{ background: soloWin ? "#e6fff2" : "#f5f5f5", borderRadius: 8, padding: "20px 32px", textAlign: "center", border: soloWin ? "1px solid #00e87b" : "1px solid #e5e5e5", marginTop: 24 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0a0a0a", fontWeight: 600 }}>{game.players[0].name}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, color: "#0a0a0a", fontWeight: 700, marginTop: 4 }}>{game.players[0].vp} VP</div>
            </div>
          </>
        ) : (
          <>
            <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 48, color: "#0a0a0a", margin: 0, fontWeight: 700 }}>{game.winner.name} Wins!</h1>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#6b6b6b", marginTop: 8 }}>{game.winner.vp} VP in {game.round} rounds</div>
            <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap", justifyContent: "center" }}>
              {sorted.map((p, i) => (
                <div key={i} style={{ background: p === game.winner ? "#e6fff2" : "#f5f5f5", borderRadius: 8, padding: "14px 24px", textAlign: "center", border: p === game.winner ? "1px solid #00e87b" : "1px solid #e5e5e5" }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, color: "#0a0a0a", fontWeight: 700 }}>{i + 1}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0a0a0a", fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6b6b6b" }}>{p.vp} VP</div>
                </div>
              ))}
            </div>
          </>
        )}
        <button onClick={() => { setScreen("title"); setGame(null); setSelectedChampion(null); setSelectedCard(null); setGameMode(null); setLocalChampions([]); setSetupStep(0); setShowPassScreen(false); }} style={{ ...btnStyle, background: "#00e87b", color: "#0a0a0a", marginTop: 32, fontSize: 14, padding: "12px 32px" }}>Play Again</button>
      </div>
    );
  }

  // Pass-and-play interstitial
  if (showPassScreen && game.gameMode === "local") {
    const nextPlayer = game.players[game.currentPlayerIdx];
    const nc = COLORS[nextPlayer.champion.cls];
    return (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, fontFamily: "'Inter', sans-serif" }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 4, color: "#6b6b6b", marginBottom: 24, fontWeight: 500 }}>PASS THE DEVICE</div>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: nc.light, border: `3px solid ${nc.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: nc.accent, fontWeight: 700, marginBottom: 16 }}>{nextPlayer.name.charAt(0)}</div>
        <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 36, color: "#0a0a0a", margin: 0, fontWeight: 700, marginBottom: 8 }}>Pass to {nextPlayer.name}</h1>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6b6b6b", marginBottom: 32 }}>{CLASS_DISPLAY[nextPlayer.champion.cls]} | Round {game.round}</div>
        <button onClick={() => setShowPassScreen(false)} style={{ ...btnStyle, background: "#00e87b", color: "#0a0a0a", fontSize: 16, padding: "14px 40px" }}>Ready</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", fontFamily: "'Inter', sans-serif", position: "relative" }}>
      {/* RULES PANEL */}
      {showRules && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowRules(false)}>
          <div style={{ background: "#fff", borderRadius: 8, padding: "32px", maxWidth: 480, width: "90%", maxHeight: "80vh", overflowY: "auto", border: "1px solid #e5e5e5", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#0a0a0a" }}>How to Play</div>
              <button onClick={() => setShowRules(false)} style={{ background: "none", border: "none", fontSize: 20, color: "#6b6b6b", cursor: "pointer", padding: 4 }}>x</button>
            </div>
            <div style={{ fontSize: 14, color: "#6b6b6b", lineHeight: 1.7 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, color: "#0a0a0a", marginBottom: 6 }}>Each turn has 3 steps</div>
                <div style={{ marginBottom: 4, paddingLeft: 8 }}><span style={{ color: "#00e87b", fontWeight: 700 }}>1. Draw</span> — Click the deck to draw an action card</div>
                <div style={{ marginBottom: 4, paddingLeft: 8 }}><span style={{ color: "#00e87b", fontWeight: 700 }}>2. Challenge</span> — Click the deck to reveal a challenge</div>
                <div style={{ paddingLeft: 8 }}><span style={{ color: "#00e87b", fontWeight: 700 }}>3. Play</span> — Select a card from your hand, then click again to play it for VP</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, color: "#0a0a0a", marginBottom: 6 }}>Action cards</div>
                <div>Cards are worth <span style={{ fontWeight: 600, color: "#0a0a0a" }}>1, 2, or 3 VP</span>. The VP value is shown in the circle on each card. Special cards also have bonus effects (shown in green text) like drawing extra cards, gaining immunity, or stealing VP from opponents.</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, color: "#0a0a0a", marginBottom: 6 }}>Challenge types</div>
                <div style={{ marginBottom: 4 }}><span style={{ fontWeight: 600, color: "#00e87b" }}>Lucky</span> — Good news. You gain VP or draw extra cards.</div>
                <div style={{ marginBottom: 4 }}><span style={{ fontWeight: 600, color: "#0a0a0a" }}>Personal</span> — Bad news for you. Lose VP, discard cards, or skip your action.</div>
                <div><span style={{ fontWeight: 600, color: "#0a0a0a" }}>Global</span> — Affects all players. Sometimes the player in last place gets a break.</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, color: "#0a0a0a", marginBottom: 6 }}>Champions</div>
                <div>Each champion has a unique power. Some are passive (always active), others can be used once per round or once per game.</div>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "#0a0a0a", marginBottom: 6 }}>Winning</div>
                <div>
                  {game.gameMode === "solo" ? "Reach the VP target before you run out of turns." : "First player to reach the VP target wins."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* LEFT SIDEBAR */}
      <div style={{ width: 260, background: "#fff", borderRight: "1px solid #e5e5e5", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: "#0a0a0a", fontWeight: 700 }}>Visibility Quest</div>
          <button onClick={() => setShowRules(!showRules)} style={{ background: "#f5f5f5", border: "1px solid #e5e5e5", borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, color: "#6b6b6b", fontWeight: 600 }}>?</button>
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6b6b6b", textAlign: "center", marginBottom: 8 }}>
          {game.gameMode === "solo"
            ? `Turn ${game.turnsUsed + 1} / ${game.turnLimit} | Target: ${game.winVp} VP`
            : `Round ${game.round} | Target: ${game.winVp} VP`}
        </div>
        {game.players.map((p, i) => (
          <PlayerStrip key={i} player={p} isActive={game.currentPlayerIdx === i} isCurrent={i === meIdx} color={p.champion.cls} />
        ))}
      </div>

      {/* MAIN AREA */}
      <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Phase Banner (informational only - no buttons) */}
        <div style={{ background: "#fff", borderRadius: 8, padding: "14px 20px", marginBottom: 16, border: "1px solid #e5e5e5" }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6b6b6b", letterSpacing: 0, fontWeight: 500 }}>
            {game.gameMode === "local"
              ? `${me.name}'s turn`
              : isMyTurn ? "Your turn" : `${game.players[game.currentPlayerIdx].name}'s turn`}
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, color: "#0a0a0a", fontWeight: 700 }}>
            {phase === PH.DRAW && "Draw Phase"}
            {phase === PH.CHALLENGE && "Challenge Phase"}
            {phase === PH.CHALLENGE_RESOLVE && "Resolve Challenge"}
            {phase === PH.PLAY && "Action Phase"}
            {phase === PH.CLEANUP && "End of Turn"}
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6b6b6b", marginTop: 4 }}>
            {subCopy[phase] || ""}
          </div>
        </div>

        {/* Clickable Deck Cards (center area) */}
        {isMyTurn && phase === PH.DRAW && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 16, padding: "20px 0" }}>
            <div onClick={() => act(g => doDraw(g))} style={{ width: 160, height: 210, borderRadius: 12, background: "#fff", border: "2px solid #e5e5e5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}>
              <div style={{ fontSize: 40, color: "#e5e5e5", marginBottom: 8 }}>?</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0a0a0a", fontWeight: 600 }}>Action Deck</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6b6b6b", marginTop: 4 }}>Click to draw</div>
            </div>
          </div>
        )}

        {isMyTurn && phase === PH.CHALLENGE && !game.currentChallenge && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 16, padding: "20px 0" }}>
            <div onClick={() => act(g => doChallenge(g))} style={{ width: 160, height: 210, borderRadius: 12, background: "#fff", border: "2px solid #e5e5e5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}>
              <div style={{ fontSize: 40, color: "#e5e5e5", marginBottom: 8 }}>!</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0a0a0a", fontWeight: 600 }}>Challenge Deck</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6b6b6b", marginTop: 4 }}>Click to reveal</div>
            </div>
          </div>
        )}

        {/* Challenge Display (clickable to resolve) */}
        {game.currentChallenge && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, cursor: isMyTurn && phase === PH.CHALLENGE_RESOLVE ? "pointer" : "default" }}
            onClick={isMyTurn && phase === PH.CHALLENGE_RESOLVE ? () => act(g => resolveChallenge(g)) : undefined}>
            <div style={{ transition: "all 0.2s ease" }}
              onMouseEnter={isMyTurn && phase === PH.CHALLENGE_RESOLVE ? e => { e.currentTarget.style.transform = "translateY(-4px)"; } : undefined}
              onMouseLeave={isMyTurn && phase === PH.CHALLENGE_RESOLVE ? e => { e.currentTarget.style.transform = "translateY(0)"; } : undefined}>
              <ChallengeCard card={game.currentChallenge} />
              {isMyTurn && phase === PH.CHALLENGE_RESOLVE && (
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#00e87b", textAlign: "center", marginTop: 8, fontWeight: 600 }}>Click to resolve</div>
              )}
            </div>
          </div>
        )}

        {/* Cleanup: End Turn card */}
        {isMyTurn && phase === PH.CLEANUP && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 16, padding: "20px 0" }}>
            <div onClick={handleCleanup} style={{ width: 160, height: 210, borderRadius: 12, background: "#fff", border: "2px solid #00e87b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 2px 8px rgba(0,232,123,0.1)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,232,123,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,232,123,0.1)"; }}>
              <div style={{ fontSize: 32, color: "#00e87b", marginBottom: 8 }}>&#10003;</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#0a0a0a", fontWeight: 600 }}>End Turn</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6b6b6b", marginTop: 4 }}>Click to continue</div>
            </div>
          </div>
        )}

        {/* Game Log - "What happened" panel */}
        {game.log.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 8, padding: "12px 16px", marginBottom: 16, border: "1px solid #e5e5e5" }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6b6b6b", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>What happened</div>
            {game.log.slice(-5).map((l, i, arr) => {
              const isLatest = i === arr.length - 1;
              return (
                <div key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: isLatest ? "#0a0a0a" : "#6b6b6b", marginBottom: 4, lineHeight: 1.5, paddingLeft: 10, borderLeft: isLatest ? "3px solid #00e87b" : "3px solid transparent", background: isLatest ? "#e6fff2" : "transparent", borderRadius: isLatest ? "0 4px 4px 0" : 0, padding: isLatest ? "4px 8px 4px 10px" : "2px 8px 2px 10px" }}>{l}</div>
              );
            })}
          </div>
        )}

        {/* Hand */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6b6b6b", fontWeight: 500 }}>
              {game.gameMode === "local" ? `${me.name}'s hand` : "Your hand"} ({me.hand.length} cards)
            </div>
            {isMyTurn && phase === PH.PLAY && (
              <span onClick={() => act(g => skipPlay(g))} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6b6b6b", cursor: "pointer", textDecoration: "underline" }}>Skip</span>
            )}
          </div>
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
            {me.hand.length === 0 && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6b6b6b", padding: 20 }}>No cards in hand.</div>}
          </div>
          {selectedCard !== null && isMyTurn && phase === PH.PLAY && (
            <div style={{ marginTop: 12, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#00e87b", fontWeight: 500 }}>Click again to play this card.</div>
          )}
        </div>
      </div>
    </div>
  );
}
