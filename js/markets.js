/**
 * 🎯 MARKETS ENGINE — Prediction markets (Polymarket) + Token Launchpad
 * Prediction: real events from /api/prediction/events with category filter,
 * outcome prices. CLOB order placement remains disabled until its
 * non-custodial signing and settlement path is certified.
 * Launchpad: bonding-curve token launches with create/buy/sell.
 * All data real or honestly empty — no invented content.
 */

import { ApiClient } from "./api.js";
import { TokenMeta } from "./tokens.js";

const fmtUsd = (n) =>
  "$" + Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });

const fmtCompact = (n) => {
  const v = Number(n || 0);
  if (v >= 1e9) return "$" + (v / 1e9).toFixed(1) + "B";
  if (v >= 1e6) return "$" + (v / 1e6).toFixed(1) + "M";
  if (v >= 1e3) return "$" + (v / 1e3).toFixed(1) + "K";
  return "$" + v.toFixed(0);
};

const escapeHtml = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);

/** Keep only chars safe for inline JS handler strings. */
const safeAttr = (s) =>
  String(s ?? "").replace(/[^a-zA-Z0-9_@.\-,:]/g, "");

const CATEGORY_ICONS = {
  crypto: "₿", politics: "🏛", sports: "🏆", "pop-culture": "🎬",
  science: "🔬", markets: "📈", geopolitics: "🌍", ai: "🤖", world: "🌐",
};

export const MarketsEngine = {
  container: null,
  subTab: "prediction", // 'prediction' | 'launchpad'
  category: "",
  sort: "trending",
  events: [],
  launches: [],
  launchSort: "latest",

  init(containerElement) {
    this.container = containerElement;
  },

  /* ══════════ PREDICTION MARKETS ══════════ */

  async loadPrediction() {
    this.renderPredictionLoading();
    try {
      const data = await ApiClient.getPredictionEvents({
        category: this.category || undefined,
        sort: this.sort,
        limit: 30,
      });
      this.events = data.events || [];
      this.renderPrediction();
    } catch (err) {
      this.renderError(String(err?.message || err), () => this.loadPrediction());
    }
  },

  setCategory(cat) {
    this.category = cat;
    this.loadPrediction();
  },

  setSort(sort) {
    this.sort = sort;
    this.loadPrediction();
  },

  openEvent(slug) {
    const ev = this.events.find((e) => e.slug === slug);
    if (!ev) return;
    const modal = document.getElementById("marketEventModal");
    document.getElementById("marketEventTitle").textContent = ev.title || ev.slug;
    const m = (ev.markets || [])[0] || {};
    const outcomes = m.outcomes || [];
    const prices = m.outcomePrices || [];
    let buttonsHtml = "";
    for (let i = 0; i < outcomes.length && i < 2; i++) {
      const price = Number(prices[i] || 0);
      buttonsHtml += `
        <div style="flex:1; background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px">
          <div style="font-size:12px; color:var(--text-secondary); margin-bottom:6px">${escapeHtml(outcomes[i])}</div>
          <div style="font-size:22px; font-weight:700; color:var(--accent-green)">${Math.round(price * 100)}¢</div>
          <div style="font-size:10.5px; color:var(--text-tertiary); margin:4px 0 12px">Gana ${escapeHtml(outcomes[i])} → $1</div>
          <button class="btn btn-secondary btn-sm" style="width:100%" disabled title="Firma y liquidación de órdenes aún no verificadas">Solo consulta</button>
        </div>`;
    }
    document.getElementById("marketEventBody").innerHTML = `
      ${ev.image ? `<img src="${escapeHtml(ev.image)}" alt="" style="width:100%; max-height:150px; object-fit:cover; border-radius:var(--radius-md); margin-bottom:14px" onerror="this.style.display='none'">` : ""}
      <div style="display:flex; gap:14px; margin-bottom:14px; font-size:11.5px; color:var(--text-secondary)">
        <span>📊 Vol ${fmtCompact(ev.volumeUsd)}</span>
        <span>💧 Liq ${fmtCompact(ev.liquidityUsd)}</span>
        <span>📅 ${ev.endDate ? new Date(ev.endDate).toLocaleDateString("es", { month: "short", year: "numeric" }) : "—"}</span>
      </div>
      <p style="font-size:12.5px; color:var(--text-secondary); line-height:1.6; margin-bottom:16px">${escapeHtml((ev.description || "").slice(0, 400))}${(ev.description || "").length > 400 ? "…" : ""}</p>
      <div style="display:flex; gap:10px">${buttonsHtml}</div>
      ${m.orderBookEnabled === false ? `<p style="font-size:10.5px; color:var(--text-tertiary); margin-top:10px">⚠️ Este mercado no acepta órdenes ahora mismo</p>` : ""}`;
    modal.classList.add("open");
  },

  closeEvent() {
    document.getElementById("marketEventModal").classList.remove("open");
  },

  async promptOrder(tokenId, outcome, price, slug) {
    alert("Solo consulta: la firma y liquidación de órdenes de predicción aún no están verificadas.");
  },

  /* ══════════ LAUNCHPAD (bonding curve, simulada en el servidor) ══════════ */

  async loadLaunches() {
    this.renderLaunchpadLoading();
    try {
      const data = await ApiClient.getLaunches({ sort: this.launchSort, limit: 30 });
      this.launches = data.launches || [];
      this.renderLaunchpad();
      this.scheduleLaunchRefresh();
    } catch (err) {
      this.renderError(String(err?.message || err), () => this.loadLaunches());
    }
  },

  /** Live board: refresh silently every 8s while the launchpad view is open. */
  scheduleLaunchRefresh() {
    clearTimeout(this._launchTimer);
    this._launchTimer = setTimeout(() => {
      if (!this.container || this.subTab !== "launchpad") return;
      if (document.hidden) { this.scheduleLaunchRefresh(); return; }
      if (document.querySelector("#launchDetailModal.open, #launchCreateModal.open")) {
        this.scheduleLaunchRefresh();
        return;
      }
      this.loadLaunches();
    }, 8000);
  },

  setLaunchSort(sort) {
    this.launchSort = sort;
    this.loadLaunches();
  },

  async promptCreateLaunch() {
    if (!ApiClient.isAuthenticated()) {
      alert("Conecta tu wallet primero");
      return;
    }
    closeLaunchModals();
    document.getElementById("launchCreateForm").reset();
    const errBox = document.getElementById("launchCreateError");
    if (errBox) { errBox.style.display = "none"; errBox.textContent = ""; }
    toggleCreateFields();
    document.getElementById("launchCreateModal").classList.add("open");
  },

  async submitCreateLaunch(e) {
    e.preventDefault();
    const get = (id) => (document.getElementById(id)?.value || "").trim();
    const payload = {
      chain: get("lcChain"),
      name: get("lcName"),
      symbol: get("lcSymbol"),
      description: get("lcDescription"),
      imageUrl: get("lcImage"),
      totalSupply: get("lcSupply").replace(/[,_]/g, "") || "1000000000000",
      twitterUrl: get("lcTwitter"),
      telegramUrl: get("lcTelegram"),
      websiteUrl: get("lcWebsite"),
    };
    const btn = document.getElementById("launchCreateSubmit");
    btn.disabled = true;
    try {
      await ApiClient.createLaunch(payload);
      closeLaunchModals();
      this.loadLaunches();
    } catch (err) {
      const box = document.getElementById("launchCreateError");
      box.textContent = "❌ " + String(err?.message || err);
      box.style.display = "block";
    } finally {
      btn.disabled = false;
    }
  },

  /** Token detail sheet: stats + position + trade panel. */
  async openLaunch(launchId) {
    if (!ApiClient.isAuthenticated()) {
      alert("Conecta tu wallet primero");
      return;
    }
    closeLaunchModals();
    const modal = document.getElementById("launchDetailModal");
    document.getElementById("launchDetailBody").innerHTML = `<p style="color:var(--text-tertiary); font-size:12.5px; padding:8px 0">Cargando ficha…</p>`;
    modal.classList.add("open");
    this._detailLaunchId = launchId;
    await this.refreshLaunchDetail();
  },

  async refreshLaunchDetail() {
    const id = this._detailLaunchId;
    if (!id || !document.getElementById("launchDetailModal").classList.contains("open")) return;
    try {
      const [detail, pos, claim, pool] = await Promise.all([
        ApiClient.getLaunch(id),
        ApiClient.isAuthenticated() ? ApiClient.getLaunchPosition(id).catch(() => null) : Promise.resolve(null),
        ApiClient.isAuthenticated() ? ApiClient.getLaunchClaim(id).catch(() => null) : Promise.resolve(null),
        ApiClient.getLaunchPool(id).catch(() => null),
      ]);
      if (this._detailLaunchId !== id) return;
      this._lastPos = pos?.position || null;
      this._lastClaim = claim?.claim || null;
      this._lastPool = pool?.pool || null;
      this._lastLaunch = detail.launch;
      this.renderLaunchDetail(detail.launch, pos?.position || null, detail.curveSimulated !== false);
    } catch (err) {
      document.getElementById("launchDetailBody").innerHTML =
        `<p style="color:var(--text-secondary); font-size:12.5px">No se pudo cargar la ficha</p>`;
    }
  },

  renderLaunchDetail(l, pos, simulated) {
    const mcap = Number(l.marketCapUsdc || 0) / 1e6;
    const raised = Number(l.raisedUsdc || 0) / 1e6;
    const price = Number(l.currentPriceUsdc || 0) / 1e6;
    const progress = Math.min(100, Number(l.progressPct ?? 0));
    const canTrade = l.status === "created" || l.status === "funding";
    const held = pos ? Number(pos.tokens) : 0;
    const graduated = l.graduatedOnChain === true;
    const mintLink = l.mintAddress
      ? `<a href="https://solscan.io/token/${encodeURIComponent(l.mintAddress)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-teal, var(--accent-green)); font-family:monospace">${escapeHtml(String(l.mintAddress).slice(0, 6))}…${escapeHtml(String(l.mintAddress).slice(-6))}</a>`
      : "";
    const body = document.getElementById("launchDetailBody");
    body.innerHTML = `
      ${graduated
        ? `<p style="font-size:10.5px; color:var(--accent-green); background:var(--bg-canvas); border-radius:6px; padding:6px 10px; margin-bottom:12px">🎓 <b>Graduado on-chain:</b> token real emitido (oferta fija) · mint ${mintLink}</p>`
        : simulated ? `<p style="font-size:10px; color:var(--text-tertiary); background:var(--bg-canvas); border-radius:6px; padding:6px 10px; margin-bottom:12px">⚠️ Curva simulada en el servidor: sin contrato on-chain ni custodia de fondos todavía.</p>` : ""}
      <div style="display:flex; gap:12px; align-items:center; margin-bottom:14px">
        ${TokenMeta.logoHtml(l.symbol, { size: 46, round: false, imageUrl: l.imageUrl })}
        <div style="flex:1; min-width:0">
          <p style="font-size:15px; font-weight:700; color:var(--text-primary)">${escapeHtml(l.name)} <span style="color:var(--text-tertiary); font-weight:400">\$${escapeHtml(l.symbol)}</span></p>
          <div style="display:flex; gap:10px; font-size:10.5px; color:var(--text-tertiary); margin-top:3px; flex-wrap:wrap">
            <span>⛓ ${escapeHtml(l.chain)}</span>
            <span>📊 $${price > 0 ? price.toPrecision(3) : "0"}</span>
            <span>💰 FDV ${fmtUsd(mcap)}</span>
            <span>👥 ${l.buyersCount ?? 0}</span>
            ${l.status === "graduated" ? '<span title="Graduado">🎓</span>' : ""}
            ${l.twitterUrl ? `<a href="${escapeHtml(l.twitterUrl)}" target="_blank" rel="noopener noreferrer">𝕏</a>` : ""}
            ${l.telegramUrl ? `<a href="${escapeHtml(l.telegramUrl)}" target="_blank" rel="noopener noreferrer">✈</a>` : ""}
            ${l.websiteUrl ? `<a href="${escapeHtml(l.websiteUrl)}" target="_blank" rel="noopener noreferrer">🌐</a>` : ""}
          </div>
        </div>
      </div>
      ${l.description ? `<p style="font-size:11.5px; color:var(--text-secondary); line-height:1.5; margin-bottom:12px">${escapeHtml(String(l.description).slice(0, 300))}</p>` : ""}
      <div style="display:flex; justify-content:space-between; font-size:10.5px; color:var(--text-tertiary); margin-bottom:4px">
        <span>💰 ${fmtUsd(raised)} recaudado</span><span>meta ${fmtUsd(Number(l.graduateThreshold || 0) / 1e6)}</span>
      </div>
      <div style="height:5px; background:var(--bg-canvas); border-radius:3px; overflow:hidden; margin-bottom:14px">
        <div style="height:100%; width:${progress}%; background:linear-gradient(90deg, var(--accent-green), var(--accent-teal, var(--accent-green)))"></div>
      </div>
      ${pos ? `
      <div style="background:var(--bg-canvas); border-radius:var(--radius-md); padding:10px 14px; margin-bottom:14px; display:flex; gap:16px; flex-wrap:wrap; font-size:11px; color:var(--text-secondary)">
        <span>Tus tokens: <b style="color:var(--text-primary)">${held.toLocaleString("en-US")}</b></span>
        <span>Coste medio: <b style="color:var(--text-primary)">${pos.avgCostUsdc && Number(pos.avgCostUsdc) > 0 ? "$" + (Number(pos.avgCostUsdc) / 1e6).toPrecision(3) : "—"}</b></span>
        <span>Valor hoy: <b style="color:var(--accent-green)">${fmtUsd(Number(pos.valueUsdc || 0) / 1e6)}</b></span>
        <span>PnL ab.: <b style="color:${Number(pos.unrealizedUsdc || 0) >= 0 ? "var(--accent-green)" : "var(--accent-red, #ff5a5f)"}">${fmtUsd(Number(pos.unrealizedUsdc || 0) / 1e6)}</b></span>
      </div>` : ""}
      ${graduated ? "" : this.renderLaunchClaimSection()}
      ${this.renderPoolSection(l)}
      ${canTrade ? `
      <div style="display:flex; gap:8px; margin-bottom:10px">
        <button class="pill-tab ${this._tradeSide !== "sell" ? "active" : ""}" style="flex:1" onclick="window.MarketsEngine.setLaunchTradeSide('buy')">Comprar</button>
        <button class="pill-tab ${this._tradeSide === "sell" ? "active" : ""}" style="flex:1" ${held > 0 ? "" : "disabled"} onclick="window.MarketsEngine.setLaunchTradeSide('sell')">Vender</button>
      </div>
      <div id="launchTradePresets" style="display:flex; gap:6px; margin-bottom:8px"></div>
      <div style="display:flex; gap:8px; align-items:center; margin-bottom:8px">
        <input id="launchTradeAmount" type="text" inputmode="decimal" placeholder="${this._tradeSide === "sell" ? "Cantidad de tokens" : "Monto en USDC"}" style="flex:1; background:var(--bg-canvas); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:9px 12px; color:var(--text-primary); font-size:13px">
        <button class="btn btn-primary btn-sm" id="launchTradeSubmit" onclick="window.MarketsEngine.submitLaunchTrade()">${this._tradeSide === "sell" ? "Vender" : "Comprar"}</button>
      </div>
      <p id="launchQuoteLine" style="font-size:10.5px; color:var(--text-tertiary); margin-bottom:10px">Introduce un monto para ver la estimación de la curva.</p>` : `
      <p style="font-size:11.5px; color:var(--text-tertiary)">Este token ya no acepta operaciones en la curva${l.status === "graduated" ? " (graduado)" : ""}.</p>`}
      <p style="font-size:9.5px; color:var(--text-tertiary); opacity:0.7">La curva vive en la base de datos del servidor: los montos no salen de tu wallet y no existen contratos aún.</p>`;
    this._tradeSide = this._tradeSide || "buy";
    this.setLaunchTradeSide(this._tradeSide);
    if (this._detailTimer) clearInterval(this._detailTimer);
    this._detailTimer = setInterval(() => this.refreshLaunchDetail(), 6000);
  },

  /** Claim section: opt-in wallet that would receive curve holdings on a real migration. */
  renderLaunchClaimSection() {
    const claim = this._lastClaim;
    if (!claim) return "";
    const tokens = Number(claim.tokens || 0);
    const short = (w) => `${String(w).slice(0, 4)}…${String(w).slice(-4)}`;
    return `
    <div style="background:var(--bg-canvas); border-radius:var(--radius-md); padding:10px 14px; margin-bottom:14px; font-size:11px; color:var(--text-secondary)">
      <p style="font-weight:700; color:var(--text-primary); margin-bottom:4px">🎁 Reclamo para migración on-chain</p>
      ${claim.wallet
        ? `<p style="margin-bottom:6px">Wallet registrada: <b style="color:var(--text-primary)">${escapeHtml(short(claim.wallet.address))}</b> <span style="color:var(--text-tertiary)">(${escapeHtml(claim.wallet.chain)})</span></p>
           <p style="color:var(--text-tertiary); font-size:10.5px; margin-bottom:8px">Si este token se migra a un contrato real, ${tokens > 0 ? `${tokens.toLocaleString("en-US")} tokens` : "tus tokens netos"} se emitirían a esta wallet.</p>`
        : `<p style="margin-bottom:8px">Registra tu wallet para poder reclamar si el token llega a migrarse on-chain. Requiere firmar un mensaje gratuito (sin gas); la curva sigue siendo simulada.</p>`}
      <button class="btn btn-sm ${claim.wallet ? "" : "btn-primary"}" onclick="window.MarketsEngine.submitLaunchClaim()">${claim.wallet ? "Cambiar wallet" : "Registrar wallet para reclamo"}</button>
    </div>`;
  },

  /** Pool section: post-graduation secondary market (real on-chain reserves). */
  renderPoolSection(l) {
    const pool = this._lastPool;
    if (!pool || l.graduatedOnChain !== true) return "";
    const price = Number(pool.priceTokenInUsdc || 0);
    const rToken = Number(pool.reserveToken || 0);
    const rUsdc = Number(pool.reserveUsdc || 0) / 1e6;
    return `
    <div style="background:var(--bg-canvas); border-radius:var(--radius-md); padding:10px 14px; margin-bottom:14px; font-size:11px; color:var(--text-secondary)">
      <p style="font-weight:700; color:var(--text-primary); margin-bottom:4px">🔄 Mercado (pool on-chain real)</p>
      <div style="display:flex; gap:14px; flex-wrap:wrap; margin-bottom:6px">
        <span>Precio: <b style="color:var(--accent-green)">$${price > 0 ? price.toPrecision(3) : "0"}</b></span>
        <span>Lado token: <b>${rToken.toLocaleString("en-US")}</b></span>
        <span>Lado USDC: <b>${fmtUsd(rUsdc)}</b></span>
      </div>
      <p style="color:var(--text-tertiary); font-size:11px; margin-bottom:8px">Reservas bajo control del operador. Ejecución de esta pool pendiente de validación; el trading spot está disponible en el terminal.</p>
      <button class="btn btn-sm" disabled>Pool en preparación</button>
    </div>`;
  },

  /** Open the pool swap flow: wallet + quote via live reserves, then sign. */
  async openPoolSwap() {
    const pool = this._lastPool;
    const l = this._lastLaunch;
    if (!pool || pool.executionAvailable !== true) return;
    try {
      if (!window.solana?.isConnected || !window.solana.publicKey) {
        await window.solana?.connect?.();
      }
      const wallet = window.solana?.publicKey?.toString();
      if (!wallet) throw new Error("Conecta Phantom para operar en el pool");
      this._poolWallet = wallet;
      const side = prompt("Escribe 'buy' (USDC → token) o 'sell' (token → USDC):", "buy");
      if (side !== "buy" && side !== "sell") return;
      const amountStr = prompt(side === "buy" ? "USDC a gastar (ej. 5):" : "Tokens a vender (ej. 1000):", "");
      if (!amountStr) return;
      const amount = Number(amountStr);
      if (!Number.isFinite(amount) || amount <= 0) throw new Error("Monto inválido");
      // Buy: USDC has 6 decimals; sell: the mint has 0 decimals (whole tokens).
      const amountIn = BigInt(Math.round(side === "buy" ? amount * 1e6 : amount)).toString();
      const quote = await ApiClient.quoteLaunchSwap(l.id, { side, amountIn });
      const q = quote.quote;
      const outHuman = side === "buy"
        ? (Number(q.amountOut)).toLocaleString("en-US") + " tokens"
        : "$" + (Number(q.amountOut) / 1e6).toFixed(2);
      const inHuman = side === "buy" ? "$" + (Number(q.amountIn) / 1e6).toFixed(2) : Number(q.amountIn).toLocaleString("en-US") + " tokens";
      const impact = Number(q.priceImpactPct || 0).toFixed(2);
      const ok = confirm(`${side === "buy" ? "Comprar" : "Vender"} por ${inHuman}\n→ Recibes ≈ ${outHuman}\nMínimo garantizado: ${side === "buy" ? Number(q.minOut).toLocaleString("en-US") + " tokens" : "$" + (Number(q.minOut) / 1e6).toFixed(2)}\nImpacto: ${impact}%\nFee: 0.3%\n\n¿Preparar la transacción?`);
      if (!ok) return;
      await this.executePoolSwap(l.id, { side, amountIn: q.amountIn, minOut: q.minOut });
    } catch (err) {
      alert(err?.message || "No se pudo preparar el swap");
    }
  },

  /** Prepare → sign in Phantom → submit for pool co-sign + broadcast. */
  async executePoolSwap(launchId, { side, amountIn, minOut }) {
    const wallet = this._poolWallet;
    if (!wallet) throw new Error("Wallet no conectada");
    const prepared = await ApiClient.prepareLaunchSwap(launchId, { side, amountIn, minOut, wallet });
    const { VersionedTransaction } = await import("https://esm.sh/@solana/web3.js@1.98.4");
    // The server sends a legacy unsigned tx with only the pool slot empty;
    // the user is fee payer and first signer.
    const raw = Uint8Array.from(atob(prepared.serialized), (c) => c.charCodeAt(0));
    const tx = VersionedTransaction.deserialize(raw);
    const signed = await window.solana.signTransaction(tx);
    const bytes = signed.serialize();
    let binary = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    const serialized = btoa(binary);
    const result = await ApiClient.submitLaunchSwap(launchId, { side, amountIn, minOut, wallet, signedTx: serialized });
    alert(`✅ Swap confirmado:\n${result.signature}`);
    this.refreshLaunchDetail();
  },

  /** Sign a fresh challenge with the user's wallet and register the claim. */
  async submitLaunchClaim() {
    const id = this._detailLaunchId;
    if (!id) return;
    let chain, address, message, signature;
    try {
      if (window.solana?.isPhantom) {
        chain = "solana";
        const resp = await window.solana.connect();
        address = resp.publicKey.toString();
        const ch = await ApiClient.getChallenge("solana");
        const signed = await window.solana.signMessage(new TextEncoder().encode(ch.message), "utf8");
        signature = Array.from(signed.signature).map((b) => b.toString(16).padStart(2, "0")).join("");
        message = ch.message;
      } else if (window.ethereum) {
        chain = "evm";
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        address = accounts[0];
        const ch = await ApiClient.getChallenge("evm");
        signature = await window.ethereum.request({ method: "personal_sign", params: [ch.message, address] });
        message = ch.message;
      } else {
        alert("No se detectó Phantom ni MetaMask. Instala una wallet para registrar el reclamo.");
        return;
      }
      await ApiClient.registerLaunchClaim(id, { chain, address, message, signature });
      await this.refreshLaunchDetail();
    } catch (err) {
      alert("❌ No se pudo registrar el reclamo: " + String(err?.message || err));
    }
  },

  setLaunchTradeSide(side) {
    this._tradeSide = side;
    const presets = document.getElementById("launchTradePresets");
    if (!presets) return;
    if (side === "buy") {
      presets.innerHTML = ["1", "5", "20", "100"].map((v) =>
        `<button class="pill-tab" onclick="window.MarketsEngine.setLaunchPreset('${v}')">${v} USDC</button>`).join("");
    } else {
      const held = Number((this._lastPos || {}).tokens || 0);
      presets.innerHTML = [25, 50, 75, 100].map((p) =>
        `<button class="pill-tab" onclick="window.MarketsEngine.setLaunchPreset('${p}')">${p}%</button>`).join("");
    }
    const submit = document.getElementById("launchTradeSubmit");
    if (submit) submit.textContent = side === "sell" ? "Vender" : "Comprar";
    const input = document.getElementById("launchTradeAmount");
    if (input) input.placeholder = side === "sell" ? "Cantidad de tokens" : "Monto en USDC";
  },

  setLaunchPreset(v) {
    const input = document.getElementById("launchTradeAmount");
    if (!input) return;
    if (this._tradeSide === "sell") {
      const held = Number((this._lastPos || {}).tokens || 0);
      input.value = String(Math.floor(held * Number(v) / 100));
    } else {
      input.value = v;
    }
    input.dispatchEvent(new Event("input"));
  },

  /** Debounced live estimate from the server curve (no mutation). */
  async debouncedLaunchQuote() {
    clearTimeout(this._quoteTimer);
    this._quoteTimer = setTimeout(() => this.fetchLaunchQuote(), 350);
  },

  async fetchLaunchQuote() {
    const id = this._detailLaunchId;
    const input = document.getElementById("launchTradeAmount");
    const line = document.getElementById("launchQuoteLine");
    if (!id || !input || !line) return;
    const raw = (input.value || "").replace(/[,_]/g, "").trim();
    if (!raw || Number(raw) <= 0) {
      line.textContent = "Introduce un monto para ver la estimación de la curva.";
      return;
    }
    try {
      if (this._tradeSide === "buy") {
        const micro = BigInt(Math.round(Number(raw) * 1e6));
        if (micro <= 0n) throw new Error("monto inválido");
        const q = await ApiClient.quoteLaunch(id, "buy", micro.toString());
        const tokens = Number(q.out);
        line.textContent = tokens > 0
          ? `≈ ${tokens.toLocaleString("en-US", { maximumFractionDigits: 0 })} tokens por ${raw} USDC`
          : "Monto demasiado pequeño para la curva (mínimo 0.1 USDC)";
      } else {
        const tokens = BigInt(Math.round(Number(raw)));
        if (tokens <= 0n) throw new Error("cantidad inválida");
        const q = await ApiClient.quoteLaunch(id, "sell", tokens.toString());
        const usdc = Number(q.out) / 1e6;
        line.textContent = usdc > 0
          ? `≈ ${usdc.toFixed(2)} USDC por ${tokens.toLocaleString("en-US")} tokens`
          : "Cantidad demasiado pequeña";
      }
    } catch (err) {
      line.textContent = "Sin estimación: " + String(err?.message || err);
    }
  },

  async submitLaunchTrade() {
    const id = this._detailLaunchId;
    const input = document.getElementById("launchTradeAmount");
    if (!id || !input) return;
    const raw = (input.value || "").replace(/[,_]/g, "").trim();
    const btn = document.getElementById("launchTradeSubmit");
    if (!raw || !(Number(raw) > 0)) {
      alert("Introduce un monto válido");
      return;
    }
    btn.disabled = true;
    try {
      if (this._tradeSide === "buy") {
        const micro = BigInt(Math.round(Number(raw) * 1e6));
        await ApiClient.buyLaunchTokens(id, micro.toString());
      } else {
        await ApiClient.sellLaunchTokens(id, BigInt(Math.round(Number(raw))).toString());
      }
      closeLaunchModals();
      this.loadLaunches();
    } catch (err) {
      alert("❌ " + String(err?.message || err));
    } finally {
      btn.disabled = false;
    }
  },

  closeLaunch() {
    closeLaunchModals();
  },

  /** Old inline actions kept working from cards. */
  async promptBuy(launchId, symbol) {
    this.openLaunch(launchId);
  },

  async promptSell(launchId, symbol) {
    this._tradeSide = "sell";
    this.openLaunch(launchId);
  },

  /* ══════════ RENDERING ══════════ */

  render() {
    if (!this.container) return;
    this.renderShell();
    if (this.subTab === "prediction") this.loadPrediction();
    else this.loadLaunches();
  },

  setSubTab(tab, btn) {
    this.subTab = tab;
    document.querySelectorAll("#view-markets .markets-subtab").forEach((b) =>
      b.classList.toggle("active", b === btn || b.getAttribute("data-subtab") === tab)
    );
    this.renderShell();
    if (tab === "prediction") this.loadPrediction();
    else this.loadLaunches();
  },

  /** Jump to the launchpad from anywhere (e.g. Discover search results). */
  viewLaunchpad() {
    this.subTab = "launchpad";
    if (window.App?.switchView) window.App.switchView("markets");
    this.render();
  },

  renderShell() {
    const subtabs = `
      <div class="pill-tabs-bar" style="margin-bottom:16px">
        <button class="pill-tab markets-subtab ${this.subTab === "prediction" ? "active" : ""}" onclick="window.MarketsEngine.setSubTab('prediction', this)">🎯 Predicción</button>
        <button class="pill-tab markets-subtab ${this.subTab === "launchpad" ? "active" : ""}" onclick="window.MarketsEngine.setSubTab('launchpad', this)">🚀 Launchpad</button>
      </div>`;
    if (this.subTab === "prediction") {
      this.container.innerHTML = `
        ${subtabs}
        <div class="pill-tabs-bar" style="margin-bottom:10px">
          <button class="pill-tab ${!this.category ? "active" : ""}" onclick="window.MarketsEngine.setCategory('')">Todas</button>
          ${Object.keys(CATEGORY_ICONS).map((c) =>
            `<button class="pill-tab ${this.category === c ? "active" : ""}" onclick="window.MarketsEngine.setCategory('${c}')">${CATEGORY_ICONS[c]} ${c}</button>`
          ).join("")}
        </div>
        <div style="display:flex; gap:8px; margin-bottom:16px">
          <button class="pill-tab ${this.sort === "trending" ? "active" : ""}" onclick="window.MarketsEngine.setSort('trending')">🔥 Trending</button>
          <button class="pill-tab ${this.sort === "new" ? "active" : ""}" onclick="window.MarketsEngine.setSort('new')">🆕 Nuevos</button>
        </div>
        <div id="marketsList"></div>`;
    } else {
      this.container.innerHTML = `
        ${subtabs}
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px">
          <div style="display:flex; gap:8px">
            <button class="pill-tab ${this.launchSort === "latest" ? "active" : ""}" onclick="window.MarketsEngine.setLaunchSort('latest')">Recientes</button>
            <button class="pill-tab ${this.launchSort === "raised" ? "active" : ""}" onclick="window.MarketsEngine.setLaunchSort('raised')">💰 Más recaudado</button>
            <button class="pill-tab ${this.launchSort === "active" ? "active" : ""}" onclick="window.MarketsEngine.setLaunchSort('active')">⏳ En curva</button>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.MarketsEngine.promptCreateLaunch()">+ Crear token</button>
        </div>
        <p style="font-size:10px; color:var(--text-tertiary); margin-bottom:12px">⚠️ Curva de bonding simulada en el servidor: sin token on-chain ni custodia todavía.</p>
        <div id="marketsList"></div>
        <div style="margin-top:16px">
          <p style="font-size:11px; font-weight:600; color:var(--text-secondary); margin-bottom:8px">Actividad reciente</p>
          <div id="launchActivity" style="display:flex; flex-direction:column; gap:6px"><p style="font-size:10.5px; color:var(--text-tertiary)">Cargando…</p></div>
        </div>`;
    }
  },

  renderPredictionLoading() {
    const el = document.getElementById("marketsList");
    if (el) el.innerHTML = `<p style="color:var(--text-tertiary); font-size:12.5px; padding:20px 0">Cargando mercados de predicción…</p>`;
  },

  renderLaunchpadLoading() {
    const el = document.getElementById("marketsList");
    if (el) el.innerHTML = `<p style="color:var(--text-tertiary); font-size:12.5px; padding:20px 0">Cargando lanzamientos…</p>`;
    this.renderLaunchActivity([]);
    ApiClient.getLaunchActivity(12)
      .then((d) => this.renderLaunchActivity(d.activity || []))
      .catch(() => this.renderLaunchActivity([]));
  },

  renderLaunchActivity(items) {
    const el = document.getElementById("launchActivity");
    if (!el) return;
    if (!items.length) {
      el.innerHTML = `<p style="font-size:10.5px; color:var(--text-tertiary)">Sin operaciones en la curva todavía.</p>`;
      return;
    }
    el.innerHTML = items.map((t) => {
      const usdc = Number(t.usdcAmount || 0) / 1e6;
      const tokens = Number(t.tokenAmount || 0);
      const time = t.ts ? new Date(t.ts * 1000).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }) : "";
      const color = t.side === "buy" ? "var(--accent-green)" : "var(--accent-red, #ff5a5f)";
      const who = t.traderName ? escapeHtml(t.traderName) : "anon";
      return `<div style="display:flex; justify-content:space-between; align-items:center; font-size:10.5px; color:var(--text-secondary); background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:8px; padding:6px 10px">
        <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap"><b style="color:var(--text-primary)">${who}</b> ${t.side === "buy" ? "compró" : "vendió"} <b style="color:var(--text-primary)">${escapeHtml(t.symbol)}</b></span>
        <span style="flex-shrink:0; margin-left:8px"><b style="color:${color}">${t.side === "buy" ? "+" : "−"}${fmtUsd(usdc)}</b> <span style="color:var(--text-tertiary)">· ${tokens.toLocaleString("en-US", { maximumFractionDigits: 0 })} tokens · ${time}</span></span>
      </div>`;
    }).join("");
  },

  renderError(msg, retry) {
    const el = document.getElementById("marketsList");
    if (!el) return;
    el.innerHTML = `
      <div style="text-align:center; padding:40px 20px">
        <p style="color:var(--text-secondary); font-size:13px; margin-bottom:14px">No se pudieron cargar los mercados</p>
        <p style="color:var(--text-tertiary); font-size:11px; margin-bottom:16px">${escapeHtml(msg)}</p>
        <button class="btn btn-primary btn-sm" id="marketsRetryBtn">Reintentar</button>
      </div>`;
    document.getElementById("marketsRetryBtn").onclick = retry;
  },

  renderPrediction() {
    const el = document.getElementById("marketsList");
    if (!el) return;
    if (!this.events.length) {
      el.innerHTML = `
        <div style="text-align:center; padding:48px 20px; border:1px dashed var(--border-subtle); border-radius:var(--radius-md)">
          <p style="font-size:26px; margin-bottom:8px">🎯</p>
          <p style="color:var(--text-secondary); font-size:13px">No hay mercados en esta categoría</p>
        </div>`;
      return;
    }
    el.innerHTML = this.events
      .map((ev) => {
        const m = (ev.markets || [])[0] || {};
        const outcomes = m.outcomes || ["Sí", "No"];
        const prices = (m.outcomePrices || ["0", "0"]).map(Number);
        const pct = Math.round((prices[0] || 0) * 100);
        return `
        <div style="background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:14px 16px; margin-bottom:10px; cursor:pointer" onclick="window.MarketsEngine.openEvent('${safeAttr(ev.slug)}')">
          <div style="display:flex; gap:12px; align-items:flex-start">
            ${ev.image ? `<img src="${escapeHtml(ev.image)}" alt="" style="width:42px; height:42px; border-radius:var(--radius-sm); object-fit:cover; flex-shrink:0" onerror="this.style.display='none'">` : ""}
            <div style="flex:1; min-width:0">
              <p style="font-size:13px; font-weight:600; color:var(--text-primary); margin-bottom:5px">${escapeHtml(ev.title)}</p>
              <div style="display:flex; gap:12px; font-size:10.5px; color:var(--text-tertiary)">
                <span>📊 ${fmtCompact(ev.volumeUsd)}</span>
                <span>💧 ${fmtCompact(ev.liquidityUsd)}</span>
                ${ev.endDate ? `<span>📅 ${new Date(ev.endDate).toLocaleDateString("es", { month: "short", year: "numeric" })}</span>` : ""}
              </div>
            </div>
            <div style="text-align:right; flex-shrink:0">
              <div style="font-size:17px; font-weight:700; color:var(--accent-green)">${pct}%</div>
              <div style="font-size:9.5px; color:var(--text-tertiary)">${escapeHtml(outcomes[0])}</div>
            </div>
          </div>
        </div>`;
      })
      .join("");
  },

  renderLaunchpad() {
    const el = document.getElementById("marketsList");
    if (!el) return;
    if (!this.launches.length) {
      el.innerHTML = `
        <div style="text-align:center; padding:48px 20px; border:1px dashed var(--border-subtle); border-radius:var(--radius-md)">
          <p style="font-size:26px; margin-bottom:8px">🚀</p>
          <p style="color:var(--text-secondary); font-size:13px; margin-bottom:6px">Nadie ha lanzado un token todavía</p>
          <p style="color:var(--text-tertiary); font-size:11.5px; margin-bottom:16px">Sé el primero — bonding curve, price discovery automático</p>
          <button class="btn btn-primary btn-sm" onclick="window.MarketsEngine.promptCreateLaunch()">🚀 Crear el primer token</button>
        </div>`;
      return;
    }
    el.innerHTML = this.launches
      .map((l) => {
        // API returns micro-USDC units (1e6 = $1) and precomputed progressPct
        const mcap = Number(l.marketCapUsdc || 0) / 1e6;
        const raised = Number(l.raisedUsdc || 0) / 1e6;
        const price = Number(l.currentPriceUsdc || 0) / 1e6;
        const progress = Math.min(100, Number(l.progressPct ?? 0));
        return `
        <div style="background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:14px 16px; margin-bottom:10px; cursor:pointer" onclick="window.MarketsEngine.openLaunch(${Number(l.id)})">
          <div style="display:flex; gap:12px; align-items:flex-start; margin-bottom:10px">
            ${TokenMeta.logoHtml(l.symbol, { size: 42, round: false, imageUrl: l.imageUrl })}
            <div style="flex:1; min-width:0">
              <p style="font-size:13.5px; font-weight:700; color:var(--text-primary)">${escapeHtml(l.name)} <span style="color:var(--text-tertiary); font-weight:400">\$${escapeHtml(l.symbol)}</span></p>
              <div style="display:flex; gap:12px; font-size:10.5px; color:var(--text-tertiary); margin-top:3px; flex-wrap:wrap">
                <span>⛓ ${escapeHtml(l.chain)}</span>
                <span>📊 $${price > 0 ? price.toPrecision(3) : "0"}</span>
                <span>💰 FDV ${fmtUsd(mcap)}</span>
                <span>👥 ${l.buyersCount ?? l.buyers_count ?? 0}</span>
                ${l.status === "graduated" ? '<span title="Graduado">🎓</span>' : ""}
                ${l.twitterUrl ? `<a href="${escapeHtml(l.twitterUrl)}" target="_blank" rel="noopener noreferrer" title="X / Twitter" onclick="event.stopPropagation()" style="color:var(--text-tertiary); text-decoration:none">𝕏</a>` : ""}
                ${l.telegramUrl ? `<a href="${escapeHtml(l.telegramUrl)}" target="_blank" rel="noopener noreferrer" title="Telegram" onclick="event.stopPropagation()" style="color:var(--text-tertiary); text-decoration:none">✈</a>` : ""}
                ${l.websiteUrl ? `<a href="${escapeHtml(l.websiteUrl)}" target="_blank" rel="noopener noreferrer" title="Website" onclick="event.stopPropagation()" style="color:var(--text-tertiary); text-decoration:none">🌐</a>` : ""}
              </div>
            </div>
            <div style="text-align:right">
              <div style="font-size:13px; font-weight:700; color:var(--accent-green)">${fmtUsd(raised)}</div>
              <div style="font-size:9.5px; color:var(--text-tertiary)">recaudado</div>
            </div>
          </div>
          ${l.description ? `<p style="font-size:11.5px; color:var(--text-secondary); margin-bottom:10px; line-height:1.5">${escapeHtml(String(l.description).slice(0, 140))}</p>` : ""}
          <div style="height:5px; background:var(--bg-canvas); border-radius:3px; overflow:hidden; margin-bottom:10px">
            <div style="height:100%; width:${progress}%; background:linear-gradient(90deg, var(--accent-green), var(--accent-teal, var(--accent-green)))"></div>
          </div>
          <div style="display:flex; gap:8px">
            <button class="btn btn-primary btn-sm" style="flex:1" onclick="event.stopPropagation(); window.MarketsEngine.openLaunch(${Number(l.id)})">Ficha y trading</button>
            <button class="btn btn-sm" style="flex:1; background:var(--bg-canvas); border:1px solid var(--border-subtle); color:var(--text-secondary)" onclick="event.stopPropagation(); window.MarketsEngine.promptSell(${Number(l.id)}, '${safeAttr(l.symbol)}')">Vender</button>
          </div>
        </div>`;
      })
      .join("");
  },
};

// Expose for inline onclick handlers
if (typeof window !== "undefined") {
  window.MarketsEngine = MarketsEngine;
}

/** Close every launchpad modal and stop its detail refresh timer. */
function closeLaunchModals() {
  document.getElementById("launchDetailModal")?.classList.remove("open");
  document.getElementById("launchCreateModal")?.classList.remove("open");
  if (MarketsEngine._detailTimer) {
    clearInterval(MarketsEngine._detailTimer);
    MarketsEngine._detailTimer = null;
  }
}
