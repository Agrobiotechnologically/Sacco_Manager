const STORAGE_KEY = "umoja-sacco-data-v1";
const PREFERENCES_KEY = "umoja-sacco-preferences-v1";
const today = new Date();
const isoDate = (date = today) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};
const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return isoDate(date);
};

const initialData = {
  members: [
    { id: "UM-2026-001", name: "Grace Wanjiku", phone: "+256 712 345 678", email: "grace.wanjiku@email.com", joinDate: "2024-03-14", status: "Active", savings: 284500, shares: 50000 },
    { id: "UM-2026-002", name: "Peter Kamau", phone: "+256 772 845 221", email: "p.kamau@email.com", joinDate: "2023-11-08", status: "Active", savings: 196000, shares: 40000 },
    { id: "UM-2026-003", name: "Amina Hassan", phone: "+256 701 992 103", email: "amina.h@email.com", joinDate: "2025-01-21", status: "Active", savings: 152000, shares: 35000 },
    { id: "UM-2026-004", name: "David Ochieng", phone: "+256 733 510 499", email: "d.ochieng@email.com", joinDate: "2024-08-02", status: "Active", savings: 128500, shares: 30000 },
    { id: "UM-2026-005", name: "Mercy Njeri", phone: "+256 710 630 117", email: "mercy.njeri@email.com", joinDate: "2025-04-17", status: "Active", savings: 97400, shares: 25000 },
    { id: "UM-2026-006", name: "Brian Kiptoo", phone: "+256 745 887 660", email: "b.kiptoo@email.com", joinDate: "2025-06-11", status: "Active", savings: 83500, shares: 25000 },
    { id: "UM-2026-007", name: "Lucy Atieno", phone: "+256 724 311 876", email: "lucy.atieno@email.com", joinDate: "2024-05-30", status: "Inactive", savings: 0, shares: 20000 },
    { id: "UM-2026-008", name: "Samuel Mutua", phone: "+256 790 256 789", email: "sam.mutua@email.com", joinDate: "2026-02-09", status: "Active", savings: 56200, shares: 15000 },
    { id: "UM-2026-009", name: "Esther Chebet", phone: "+256 711 843 920", email: "esther.c@email.com", joinDate: "2025-08-24", status: "Active", savings: 45200, shares: 15000 },
  ],
  loans: [
    { id: "LN-2026-041", memberId: "UM-2026-001", type: "Development loan", principal: 450000, balance: 312000, rate: 12, term: 24, date: "2026-02-16", dueDate: "2028-02-16", status: "Active" },
    { id: "LN-2026-042", memberId: "UM-2026-004", type: "School fees loan", principal: 180000, balance: 90000, rate: 10, term: 12, date: "2026-04-03", dueDate: "2027-04-03", status: "Active" },
    { id: "LN-2026-043", memberId: "UM-2026-002", type: "Emergency loan", principal: 75000, balance: 25000, rate: 8, term: 6, date: "2026-06-10", dueDate: "2026-12-10", status: "Active" },
    { id: "LN-2026-044", memberId: "UM-2026-005", type: "Development loan", principal: 320000, balance: 274000, rate: 12, term: 24, date: "2026-08-19", dueDate: "2028-08-19", status: "Active" },
    { id: "LN-2026-045", memberId: "UM-2026-003", type: "Business loan", principal: 600000, balance: 600000, rate: 14, term: 36, date: "2026-09-12", dueDate: "2029-09-12", status: "Pending" },
    { id: "LN-2026-046", memberId: "UM-2026-006", type: "School fees loan", principal: 120000, balance: 120000, rate: 10, term: 12, date: "2026-09-21", dueDate: "2027-09-21", status: "Pending" },
  ],
  transactions: [
    { id: "TX-0926-016", memberId: "UM-2026-001", type: "Savings deposit", amount: 15000, date: daysAgo(0), method: "MTN MoMo", reference: "MOMO7M2X91" },
    { id: "TX-0926-015", memberId: "UM-2026-002", type: "Loan repayment", amount: 12500, date: daysAgo(0), method: "Bank transfer", reference: "BNK-40921" },
    { id: "TX-0926-014", memberId: "UM-2026-003", type: "Share contribution", amount: 5000, date: daysAgo(1), method: "Airtel Money", reference: "AIR8L3P55" },
    { id: "TX-0926-013", memberId: "UM-2026-004", type: "Savings deposit", amount: 20000, date: daysAgo(1), method: "Bank transfer", reference: "BNK-40887" },
    { id: "TX-0926-012", memberId: "UM-2026-005", type: "Loan repayment", amount: 18000, date: daysAgo(2), method: "MTN MoMo", reference: "MOMO5R8D12" },
    { id: "TX-0926-011", memberId: "UM-2026-006", type: "Savings deposit", amount: 8000, date: daysAgo(2), method: "Cash", reference: "CSH-0264" },
    { id: "TX-0926-010", memberId: "UM-2026-008", type: "Share contribution", amount: 10000, date: daysAgo(3), method: "Airtel Money", reference: "AIR4T6A90" },
    { id: "TX-0926-009", memberId: "UM-2026-009", type: "Savings deposit", amount: 7500, date: daysAgo(4), method: "MTN MoMo", reference: "MOMO0712" },
  ],
  monthly: [
    { month: "Apr", savings: 268, loans: 188 }, { month: "May", savings: 310, loans: 215 },
    { month: "Jun", savings: 285, loans: 204 }, { month: "Jul", savings: 340, loans: 246 },
    { month: "Aug", savings: 322, loans: 231 }, { month: "Sep", savings: 378, loans: 268 },
  ],
};

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const freshData = structuredClone(initialData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
      return freshData;
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed.members) || !Array.isArray(parsed.loans) || !Array.isArray(parsed.transactions)) {
      throw new Error("Saved SACCO data is missing required collections.");
    }
    let migrated = false;
    parsed.members.forEach((member) => {
      if (typeof member.phone === "string" && member.phone.startsWith("+254")) {
        member.phone = member.phone.replace(/^\+254/, "+256");
        migrated = true;
      }
    });
    parsed.transactions.forEach((transaction) => {
      if (transaction.method === "M-Pesa") {
        transaction.method = "MTN MoMo";
        migrated = true;
      }
    });
    if (migrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return parsed;
  } catch (error) {
    console.error("Unable to load saved SACCO data.", error);
    return structuredClone(initialData);
  }
}

let data = loadData();
let activeView = "dashboard";
let searchTerm = "";
let memberStatusFilter = "All status";
let loanStatusFilter = "All status";
let preferences = { theme: "light" };
try {
  preferences = { ...preferences, ...JSON.parse(localStorage.getItem(PREFERENCES_KEY) || "{}") };
} catch (error) {
  console.error("Unable to load SACCO preferences.", error);
}
document.documentElement.dataset.theme = preferences.theme === "dark" ? "dark" : "light";
const pageContent = document.querySelector("#page-content");
const appDialog = document.querySelector("#app-dialog");
const navItems = [...document.querySelectorAll(".nav-link")];

const money = (amount) => new Intl.NumberFormat("en-UG", {
  style: "currency", currency: "UGX", currencyDisplay: "code", maximumFractionDigits: 0,
}).format(Number(amount) || 0);
const expectedMonthlyPayment = (loan) => {
  const periods = Number(loan.term);
  const monthlyRate = Number(loan.rate) / 1200;
  if (!periods || periods < 0) return 0;
  if (!monthlyRate) return loan.principal / periods;
  const growth = (1 + monthlyRate) ** periods;
  return loan.principal * monthlyRate * growth / (growth - 1);
};
const number = (amount) => new Intl.NumberFormat("en-UG").format(Number(amount) || 0);
const memberFor = (id) => data.members.find((member) => member.id === id);
const memberName = (id) => memberFor(id)?.name || "Unknown member";
const initials = (name) => name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[char]));
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
const dateLabel = (date) => new Date(`${date}T00:00:00`).toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" });
const makeId = (collection, prefix) => `${prefix}-${String(collection.length + 1).padStart(4, "0")}`;
const initialsTone = (index) => ["avatar-green", "avatar-blue", "avatar-gold", "avatar-purple", "avatar-rose"][index % 5];
const totalSavings = () => data.members.reduce((sum, member) => sum + member.savings, 0);
const totalShares = () => data.members.reduce((sum, member) => sum + member.shares, 0);
const activeLoans = () => data.loans.filter((loan) => loan.status === "Active");
const loanPortfolio = () => activeLoans().reduce((sum, loan) => sum + loan.balance, 0);
const pendingLoans = () => data.loans.filter((loan) => loan.status === "Pending");
const transactionRows = (transactions) => transactions.map((transaction, index) => {
  const person = memberFor(transaction.memberId) || { name: "Unknown member", id: transaction.memberId };
  const positive = transaction.type === "Savings deposit" || transaction.type === "Share contribution";
  return `<tr>
    <td>${memberPersonCell(person, index)}</td>
    <td>${escapeHtml(transaction.type)}</td>
    <td class="${positive ? "amount-positive" : ""}">${positive ? "+" : ""}${money(transaction.amount)}</td>
    <td>${escapeHtml(transaction.method)}</td>
    <td>${escapeHtml(dateLabel(transaction.date))}</td>
    <td><span class="status status-paid">Completed</span></td>
  </tr>`;
}).join("");

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Unable to save SACCO data.", error);
    showToast("Changes could not be saved in this browser.");
  }
}

function savePreferences() {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Unable to save SACCO preferences.", error);
    showToast("Theme preference could not be saved on this device.");
  }
}

function pageHeading(eyebrow, title, subtitle, actions = "") {
  return `<div class="page-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="subtitle">${subtitle}</p></div><div class="heading-actions">${actions}</div></div>`;
}
function primaryButton(label, action, symbol = "plus") {
  return `<button class="button button-primary" type="button" data-action="${action}">${icon(symbol)}${label}</button>`;
}
function metricCard(label, value, symbol, change, tone = "", hint = "vs. last month", view = "dashboard") {
  return `<button class="stat-card" type="button" data-view-link="${view}" aria-label="Open ${label}"><span class="stat-top"><span class="stat-label">${label}</span><span class="stat-icon ${tone}">${icon(symbol)}</span></span><span class="stat-value">${value}</span><span class="stat-footer"><span class="stat-change">${change}</span><span>${hint}</span></span></button>`;
}
function memberPersonCell(member, index) {
  const cell = `<span class="person-cell"><span class="avatar ${initialsTone(index)}">${escapeHtml(initials(member.name))}</span><span><strong>${escapeHtml(member.name)}</strong><small>${escapeHtml(member.id)}</small></span></span>`;
  return memberFor(member.id) ? `<button class="member-link" type="button" data-action="view-member" data-id="${escapeHtml(member.id)}">${cell}</button>` : cell;
}
function renderChart() {
  const monthly = data.monthly;
  const maxValue = Math.max(...monthly.flatMap((item) => [item.savings, item.loans]), 400);
  const chartTop = 13;
  const chartBottom = 146;
  const chartHeight = chartBottom - chartTop;
  const grid = [0, 1, 2, 3].map((row) => {
    const y = chartTop + row * chartHeight / 3;
    return `<line class="chart-grid-line" x1="42" x2="590" y1="${y}" y2="${y}"/><text class="chart-y-label" x="2" y="${y + 3}">${row === 0 ? "400k" : row === 1 ? "267k" : row === 2 ? "133k" : "0"}</text>`;
  }).join("");
  const bars = monthly.map((item, index) => {
    const groupWidth = 548 / monthly.length;
    const x = 48 + index * groupWidth + 13;
    const heightSavings = Math.max(2, item.savings / maxValue * chartHeight);
    const heightLoans = Math.max(2, item.loans / maxValue * chartHeight);
    const ySavings = chartBottom - heightSavings;
    const yLoans = chartBottom - heightLoans;
    return `<rect class="chart-bar" x="${x}" y="${ySavings}" width="17" height="${heightSavings}" rx="3"><title>${item.month}: savings ${money(item.savings * 1000)}</title></rect><rect class="chart-bar strong" x="${x + 21}" y="${yLoans}" width="17" height="${heightLoans}" rx="3"><title>${item.month}: loans ${money(item.loans * 1000)}</title></rect><text class="chart-x-label" x="${x + 19}" y="164">${item.month}</text>`;
  }).join("");
  return `<svg class="chart-svg" viewBox="0 0 600 174" role="img" aria-label="Savings and loan portfolio over six months">${grid}${bars}</svg>`;
}

function renderDashboard() {
  const recent = [...data.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const pending = pendingLoans().length;
  const dateHeading = new Intl.DateTimeFormat("en-UG", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(today).toUpperCase();
  pageContent.innerHTML = `
    ${pageHeading(dateHeading, "Good morning, Josh ", "Your SACCO at a glance. Sample data is saved in this browser.", `<button class="button" type="button" data-action="export-transactions">${icon("download")}Export</button>${primaryButton("New transaction", "new-transaction")}`)}
    <div class="stats-grid">
      ${metricCard("Total members", number(data.members.length), "users", "Registered", "", "member accounts", "members")}
      ${metricCard("Member savings", money(totalSavings()), "wallet", "Current", "", "member balances", "savings")}
      ${metricCard("Loan portfolio", money(loanPortfolio()), "landmark", `${activeLoans().length} active`, "amber", `${pending} pending approval`, "loans")}
      ${metricCard("Share capital", money(totalShares()), "trending", "Paid-in", "blue", "member equity", "shares")}
    </div>
    <div class="overview-grid">
      <section class="panel"><div class="panel-header"><div><h2 class="panel-title">Financial overview</h2><p class="panel-subtitle">Savings and loan portfolio · last 6 months</p></div><div class="chart-legend"><span><i class="legend-dot"></i>Savings</span><span><i class="legend-dot light"></i>Loans</span></div></div><div class="chart-area">${renderChart()}</div></section>
      <section class="panel"><div class="panel-header"><div><h2 class="panel-title">Portfolio breakdown</h2><p class="panel-subtitle">Current financial position</p></div><button class="text-button" data-view-link="reports">Details ${icon("arrow")}</button></div>
        <div class="breakdown-list">
          <button class="breakdown-item" type="button" data-view-link="savings"><span class="breakdown-row"><span>Member savings</span><strong>${money(totalSavings())}</strong></span><span class="progress-track"><span class="progress-fill" style="width:76%"></span></span></button>
          <button class="breakdown-item" type="button" data-view-link="loans"><span class="breakdown-row"><span>Loan portfolio</span><strong>${money(loanPortfolio())}</strong></span><span class="progress-track"><span class="progress-fill gold" style="width:58%"></span></span></button>
          <button class="breakdown-item" type="button" data-view-link="shares"><span class="breakdown-row"><span>Share capital</span><strong>${money(totalShares())}</strong></span><span class="progress-track"><span class="progress-fill blue" style="width:37%"></span></span></button>
          <button class="breakdown-item" type="button" data-view-link="loans"><span class="breakdown-row"><span>Pending loan applications</span><strong>${pending}</strong></span><span class="progress-track"><span class="progress-fill purple" style="width:${Math.min(100, pending * 18)}%"></span></span></button>
        </div><div class="portfolio-total"><span>Total member funds</span><strong>${money(totalSavings() + totalShares())}</strong></div>
      </section>
    </div>
    <section class="panel activity-panel"><div class="panel-header"><div><h2 class="panel-title">Recent transactions</h2><p class="panel-subtitle">Latest activity across your SACCO</p></div><button class="text-button" data-view-link="savings">View all ${icon("arrow")}</button></div>
      <div class="table-wrap"><table><thead><tr><th>Member</th><th>Transaction</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr></thead><tbody>${recent.length ? transactionRows(recent) : `<tr><td colspan="6"><div class="empty-state">No transactions recorded yet.</div></td></tr>`}</tbody></table></div>
      <div class="table-footer"><span>Showing ${recent.length} of ${data.transactions.length} transactions</span><div class="footer-pages"><button class="page-control selected">1</button><button class="page-control" data-view-link="savings">→</button></div></div>
    </section>
    <div class="panel-header panel" style="margin-bottom:12px"><div><h2 class="panel-title">Quick actions</h2><p class="panel-subtitle">Common tasks, one click away</p></div></div>
    <div class="quick-actions"><button class="quick-action" data-action="add-member">${icon("users")}<span>Add a member</span></button><button class="quick-action" data-action="new-transaction">${icon("wallet")}<span>Record savings</span></button><button class="quick-action" data-action="new-loan">${icon("landmark")}<span>New loan application</span></button><button class="quick-action" data-action="new-repayment">${icon("receipt")}<span>Record repayment</span></button></div>`;
}

function renderMembers() {
  const filtered = data.members.filter((member) => {
    const matchesSearch = `${member.name} ${member.id} ${member.phone} ${member.email}`.toLowerCase().includes(searchTerm);
    return matchesSearch && (memberStatusFilter === "All status" || member.status === memberStatusFilter);
  });
  const active = data.members.filter((member) => member.status === "Active").length;
  pageContent.innerHTML = `
    ${pageHeading("MEMBER RELATIONSHIPS", "Members", "Manage your membership, member records and account status.", primaryButton("Add member", "add-member"))}
    <div class="metric-strip"><div class="metric-item"><span>Total members</span><strong>${number(data.members.length)}</strong></div><div class="metric-item"><span>Active members</span><strong>${number(active)}</strong></div><div class="metric-item"><span>Inactive members</span><strong>${number(data.members.length - active)}</strong></div></div>
    <section class="panel section-panel"><div class="toolbar"><span class="stat-label">${number(filtered.length)} members</span><span class="toolbar-spacer"></span><select class="filter-select" id="member-status-filter" aria-label="Filter members by status"><option>All status</option><option${memberStatusFilter === "Active" ? " selected" : ""}>Active</option><option${memberStatusFilter === "Inactive" ? " selected" : ""}>Inactive</option></select><button class="button button-small" data-action="export-members">${icon("download")}Export CSV</button></div>
      <div class="table-wrap"><table><thead><tr><th>Member</th><th>Phone / email</th><th>Joined</th><th>Savings</th><th>Shares</th><th>Status</th><th>Action</th></tr></thead><tbody>${filtered.map((member, i) => `<tr><td>${memberPersonCell(member, i)}</td><td>${escapeHtml(member.phone)}<br><small class="muted">${escapeHtml(member.email)}</small></td><td>${dateLabel(member.joinDate)}</td><td>${money(member.savings)}</td><td>${money(member.shares)}</td><td><span class="status status-${member.status.toLowerCase()}">${member.status}</span></td><td><button class="table-action" data-action="view-member" data-id="${escapeHtml(member.id)}">View details</button></td></tr>`).join("") || `<tr><td colspan="7"><div class="empty-state"><strong>No members found</strong>Try another search or adjust the status filter.</div></td></tr>`}</tbody></table></div>
      <div class="table-footer"><span>Showing ${filtered.length} of ${data.members.length} members</span><span>All member records</span></div></section>`;
}

function renderSavings() {
  const transactions = data.transactions.filter((transaction) => transaction.type === "Savings deposit" || transaction.type === "Savings withdrawal")
    .filter((transaction) => `${memberName(transaction.memberId)} ${transaction.id} ${transaction.type} ${transaction.method}`.toLowerCase().includes(searchTerm))
    .sort((a, b) => b.date.localeCompare(a.date));
  const deposits = data.transactions.filter((transaction) => transaction.type === "Savings deposit").reduce((sum, transaction) => sum + transaction.amount, 0);
  const withdrawals = data.transactions.filter((transaction) => transaction.type === "Savings withdrawal").reduce((sum, transaction) => sum + transaction.amount, 0);
  pageContent.innerHTML = `
    ${pageHeading("MEMBER DEPOSITS & WITHDRAWALS", "Savings", "Track deposits, withdrawals and member savings balances.", `<button class="button" data-action="export-savings">${icon("download")}Export</button>${primaryButton("Record transaction", "new-transaction")}`)}
    <div class="metric-strip"><div class="metric-item"><span>Total member savings</span><strong>${money(totalSavings())}</strong></div><div class="metric-item"><span>Recorded deposits</span><strong>${money(deposits)}</strong></div><div class="metric-item"><span>Recorded withdrawals</span><strong>${money(withdrawals)}</strong></div></div>
    <section class="panel section-panel"><div class="toolbar"><span class="stat-label">${number(transactions.length)} savings transactions</span><span class="toolbar-spacer"></span></div><div class="table-wrap"><table><thead><tr><th>Member</th><th>Type</th><th>Amount</th><th>Payment method</th><th>Reference</th><th>Date</th></tr></thead><tbody>${transactions.map((item, i) => { const m = memberFor(item.memberId); const positive = item.type === "Savings deposit"; return `<tr><td>${memberPersonCell(m || { name: "Unknown member", id: item.memberId }, i)}</td><td>${escapeHtml(item.type)}</td><td class="${positive ? "amount-positive" : "amount-negative"}">${positive ? "+" : "−"}${money(item.amount)}</td><td>${escapeHtml(item.method)}</td><td>${escapeHtml(item.reference)}</td><td>${dateLabel(item.date)}</td></tr>`; }).join("") || `<tr><td colspan="6"><div class="empty-state"><strong>No savings activity found</strong>Record a deposit or withdrawal to get started.</div></td></tr>`}</tbody></table></div><div class="table-footer"><span>Showing ${transactions.length} savings transactions</span><span>Balances are updated when transactions are recorded</span></div></section>`;
}

function renderShares() {
  const contributions = data.transactions.filter((transaction) => transaction.type === "Share contribution")
    .filter((transaction) => `${memberName(transaction.memberId)} ${transaction.id} ${transaction.method}`.toLowerCase().includes(searchTerm))
    .sort((a, b) => b.date.localeCompare(a.date));
  pageContent.innerHTML = `
    ${pageHeading("MEMBER EQUITY", "Share capital", "Track member share contributions and ownership capital.", `<button class="button" data-action="export-shares">${icon("download")}Export</button>${primaryButton("Record contribution", "new-share")}`)}
    <div class="metric-strip"><div class="metric-item"><span>Total share capital</span><strong>${money(totalShares())}</strong></div><div class="metric-item"><span>Members with shares</span><strong>${data.members.filter((member) => member.shares > 0).length}</strong></div><div class="metric-item"><span>Minimum shareholding</span><strong>${money(15000)}</strong></div></div>
    <section class="panel section-panel"><div class="toolbar"><span class="stat-label">${number(contributions.length)} recorded contributions</span><span class="toolbar-spacer"></span></div><div class="table-wrap"><table><thead><tr><th>Member</th><th>Current shares</th><th>Contribution amount</th><th>Payment method</th><th>Reference</th><th>Date</th></tr></thead><tbody>${contributions.map((item, i) => { const member = memberFor(item.memberId); return `<tr><td>${memberPersonCell(member || { name: "Unknown member", id: item.memberId }, i)}</td><td>${money(member?.shares || 0)}</td><td class="amount-positive">+${money(item.amount)}</td><td>${escapeHtml(item.method)}</td><td>${escapeHtml(item.reference)}</td><td>${dateLabel(item.date)}</td></tr>`; }).join("") || `<tr><td colspan="6"><div class="empty-state"><strong>No share contributions found</strong>Record a contribution to get started.</div></td></tr>`}</tbody></table></div><div class="table-footer"><span>Showing ${contributions.length} contributions</span><span>Share capital is member equity</span></div></section>`;
}

function renderLoans() {
  const loans = data.loans.filter((loan) => `${memberName(loan.memberId)} ${loan.id} ${loan.type} ${loan.status}`.toLowerCase().includes(searchTerm))
    .filter((loan) => loanStatusFilter === "All status" || loan.status === loanStatusFilter);
  const portfolio = loanPortfolio();
  pageContent.innerHTML = `
    ${pageHeading("CREDIT & LENDING", "Loans", "Review applications, manage disbursements and monitor outstanding balances.", `<button class="button" data-action="export-loans">${icon("download")}Export</button>${primaryButton("New application", "new-loan")}`)}
    <div class="metric-strip"><div class="metric-item"><span>Outstanding portfolio</span><strong>${money(portfolio)}</strong></div><div class="metric-item"><span>Active loans</span><strong>${activeLoans().length}</strong></div><div class="metric-item"><span>Awaiting approval</span><strong>${pendingLoans().length}</strong></div></div>
    <section class="panel section-panel"><div class="toolbar"><span class="stat-label">${number(loans.length)} loan records</span><span class="toolbar-spacer"></span><select class="filter-select" id="loan-status-filter" aria-label="Filter loans by status"><option>All status</option>${["Active", "Pending", "Rejected", "Paid"].map((status) => `<option${loanStatusFilter === status ? " selected" : ""}>${status}</option>`).join("")}</select></div>
      <div class="table-wrap loan-table-wrap"><table><thead><tr><th>Loan / Member</th><th>Product</th><th>Principal</th><th>Balance</th><th>Rate</th><th title="Estimated installment on a reducing balance">Expected monthly payment</th><th>Due date</th><th>Status</th><th>Action</th></tr></thead><tbody>${loans.map((loan, i) => `<tr><td>${memberPersonCell(memberFor(loan.memberId) || { name: memberName(loan.memberId), id: loan.memberId }, i)}</td><td>${escapeHtml(loan.type)}</td><td>${money(loan.principal)}</td><td>${money(loan.balance)}</td><td>${loan.rate}%</td><td>${money(expectedMonthlyPayment(loan))}</td><td>${dateLabel(loan.dueDate)}</td><td><span class="status status-${loan.status.toLowerCase()}">${escapeHtml(loan.status)}</span></td><td>${loan.status === "Pending" ? `<div class="inline-actions"><button class="table-action approve" data-action="approve-loan" data-id="${escapeHtml(loan.id)}">Approve</button><button class="table-action" data-action="reject-loan" data-id="${escapeHtml(loan.id)}">Decline</button></div>` : `<button class="table-action" data-action="view-loan" data-id="${escapeHtml(loan.id)}">Details</button>`}</td></tr>`).join("") || `<tr><td colspan="9"><div class="empty-state"><strong>No loan records found</strong>Try another search or change the status filter.</div></td></tr>`}</tbody></table></div><div class="table-footer"><span>Showing ${loans.length} of ${data.loans.length} loans</span><span>Interest rates are reducing balance p.a.</span></div></section>`;
}

function renderRepayments() {
  const repayments = data.transactions.filter((transaction) => transaction.type === "Loan repayment")
    .filter((transaction) => `${memberName(transaction.memberId)} ${transaction.id} ${transaction.method} ${transaction.reference}`.toLowerCase().includes(searchTerm))
    .sort((a, b) => b.date.localeCompare(a.date));
  const total = repayments.reduce((sum, transaction) => sum + transaction.amount, 0);
  pageContent.innerHTML = `
    ${pageHeading("LOAN COLLECTIONS", "Repayments", "Record payments and review your repayment collection history.", `<button class="button" data-action="export-repayments">${icon("download")}Export</button>${primaryButton("Record repayment", "new-repayment")}`)}
    <div class="metric-strip"><div class="metric-item"><span>Repayments recorded</span><strong>${number(repayments.length)}</strong></div><div class="metric-item"><span>Collected to date</span><strong>${money(total)}</strong></div><div class="metric-item"><span>Loans with balance</span><strong>${activeLoans().length}</strong></div></div>
    <section class="panel section-panel"><div class="toolbar"><span class="stat-label">${number(repayments.length)} repayment records</span><span class="toolbar-spacer"></span></div><div class="table-wrap"><table><thead><tr><th>Member</th><th>Amount received</th><th>Payment method</th><th>Receipt / reference</th><th>Date</th><th>Status</th></tr></thead><tbody>${repayments.map((item, i) => `<tr><td>${memberPersonCell(memberFor(item.memberId) || { name: "Unknown member", id: item.memberId }, i)}</td><td class="amount-positive">+${money(item.amount)}</td><td>${escapeHtml(item.method)}</td><td>${escapeHtml(item.reference)}</td><td>${dateLabel(item.date)}</td><td><span class="status status-paid">Posted</span></td></tr>`).join("") || `<tr><td colspan="6"><div class="empty-state"><strong>No repayments found</strong>Record a repayment to get started.</div></td></tr>`}</tbody></table></div><div class="table-footer"><span>Showing ${repayments.length} repayment records</span><span>Repayments reduce the outstanding loan balance</span></div></section>`;
}

function renderReports() {
  const monthlyDeposits = data.transactions.filter((transaction) => transaction.type === "Savings deposit").reduce((sum, item) => sum + item.amount, 0);
  const monthlyRepayments = data.transactions.filter((transaction) => transaction.type === "Loan repayment").reduce((sum, item) => sum + item.amount, 0);
  pageContent.innerHTML = `
    ${pageHeading("SACCO PERFORMANCE", "Reports", "A snapshot of your SACCO’s financial health and member activity.", `<button class="button" data-action="export-transactions">${icon("download")}Export transactions</button>`)}
    <div class="report-grid">
      <article class="panel report-card"><div class="report-card-header"><div><h2>Member savings</h2><p>Current member savings balances</p></div><span class="stat-icon">${icon("wallet")}</span></div><div class="report-number">${money(totalSavings())}</div><div class="report-foot"><span>${data.members.length} members</span></div></article>
      <article class="panel report-card"><div class="report-card-header"><div><h2>Loan portfolio</h2><p>Outstanding active loan balances</p></div><span class="stat-icon amber">${icon("landmark")}</span></div><div class="report-number">${money(loanPortfolio())}</div><div class="report-foot"><span>${activeLoans().length} active · ${pendingLoans().length} awaiting approval</span></div></article>
      <article class="panel report-card"><div class="report-card-header"><div><h2>Share capital</h2><p>Total member equity contributions</p></div><span class="stat-icon blue">${icon("trending")}</span></div><div class="report-number">${money(totalShares())}</div><div class="report-foot"><span>${data.members.filter((member) => member.shares > 0).length} shareholders</span></div></article>
      <article class="panel report-card"><div class="report-card-header"><div><h2>Cash collections</h2><p>Recorded deposits and repayments</p></div><span class="stat-icon purple">${icon("receipt")}</span></div><div class="report-number">${money(monthlyDeposits + monthlyRepayments)}</div><div class="report-foot"><span>${number(data.transactions.length)} transactions recorded</span></div></article>
    </div>
    <section class="panel" style="margin-top:15px"><div class="panel-header"><div><h2 class="panel-title">Financial overview</h2><p class="panel-subtitle">Savings and loan portfolio · last 6 months</p></div></div><div class="chart-area">${renderChart()}</div></section>
    <section class="panel" style="margin-top:15px"><div class="panel-header"><div><h2 class="panel-title">Available exports</h2><p class="panel-subtitle">Download data for bookkeeping and reconciliation</p></div></div><div class="toolbar"><span class="stat-label">Member register</span><span class="toolbar-spacer"></span><button class="button button-small" data-action="export-members">${icon("download")}Download CSV</button></div><div class="toolbar"><span class="stat-label">Loan register</span><span class="toolbar-spacer"></span><button class="button button-small" data-action="export-loans">${icon("download")}Download CSV</button></div><div class="toolbar"><span class="stat-label">Transaction ledger</span><span class="toolbar-spacer"></span><button class="button button-small" data-action="export-transactions">${icon("download")}Download CSV</button></div></section>`;
}

const renderers = {
  dashboard: renderDashboard, members: renderMembers, savings: renderSavings,
  shares: renderShares, loans: renderLoans, repayments: renderRepayments, reports: renderReports,
};
const viewNames = { dashboard: "Overview", members: "Members", savings: "Savings", shares: "Share capital", loans: "Loans", repayments: "Repayments", reports: "Reports" };

function renderSearchResults(query) {
  const results = document.querySelector("#global-search-results");
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    results.hidden = true;
    results.innerHTML = "";
    return;
  }
  const records = [
    ...data.members.map((member) => ({ kind: "member", id: member.id, view: "members", title: member.name, detail: `Member · ${member.id} · ${member.phone}`, text: `${member.name} ${member.id} ${member.phone} ${member.email} ${member.status}` })),
    ...data.loans.map((loan) => ({ kind: "loan", id: loan.id, view: "loans", title: loan.id, detail: `Loan · ${memberName(loan.memberId)} · ${loan.type} · ${money(loan.balance)}`, text: `${loan.id} ${memberName(loan.memberId)} ${loan.type} ${loan.status} ${loan.balance}` })),
    ...data.transactions.map((transaction) => ({ kind: "transaction", id: transaction.id, view: transaction.type === "Loan repayment" ? "repayments" : transaction.type === "Share contribution" ? "shares" : "savings", title: transaction.type, detail: `${memberName(transaction.memberId)} · ${transaction.id} · ${transaction.method} · ${money(transaction.amount)}`, text: `${transaction.id} ${memberName(transaction.memberId)} ${transaction.type} ${transaction.method} ${transaction.reference} ${transaction.amount} ${transaction.date}` })),
  ];
  const matches = records.filter((record) => record.text.toLowerCase().includes(normalizedQuery)).slice(0, 12);
  results.innerHTML = matches.length ? matches.map((record) => `<button class="search-result" type="button" data-search-result="${record.kind}" data-id="${escapeHtml(record.id)}" data-view="${record.view}"><span><strong>${escapeHtml(record.title)}</strong><small>${escapeHtml(record.detail)}</small></span><span class="search-result-type">${record.kind}</span></button>`).join("") : `<p class="search-empty">No matching members, loans, or transactions.</p>`;
  results.hidden = false;
}

function focusGlobalSearch() {
  const searchWrap = document.querySelector(".search-wrap");
  searchWrap.classList.add("search-open");
  window.requestAnimationFrame(() => document.querySelector("#global-search").focus());
}

function render() {
  document.querySelector("#breadcrumb-current").textContent = viewNames[activeView];
  document.querySelector("#member-count").textContent = data.members.length;
  navItems.forEach((item) => item.classList.toggle("active", item.dataset.view === activeView));
  renderers[activeView]();
  renderSearchResults(document.querySelector("#global-search").value);
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `${icon("check")}<span>${escapeHtml(message)}</span>`;
  document.querySelector("#toast-region").append(toast);
  window.setTimeout(() => toast.remove(), 3300);
}

function field(label, name, type = "text", options = {}) {
  const required = options.required === false ? "" : " required";
  const value = options.value !== undefined ? ` value="${escapeHtml(options.value)}"` : "";
  const min = options.min !== undefined ? ` min="${options.min}"` : "";
  const step = options.step ? ` step="${options.step}"` : "";
  const placeholder = options.placeholder ? ` placeholder="${escapeHtml(options.placeholder)}"` : "";
  if (type === "select") {
    const choices = options.choices || [];
    return `<div class="form-field ${options.full ? "full" : ""}"><label for="${name}">${label}</label><select id="${name}" name="${name}"${required}>${choices.map((choice) => `<option value="${escapeHtml(choice.value)}">${escapeHtml(choice.label)}</option>`).join("")}</select></div>`;
  }
  return `<div class="form-field ${options.full ? "full" : ""}"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}"${value}${min}${step}${placeholder}${required}/></div>`;
}

function openForm(title, description, body, submitLabel, onSubmit) {
  appDialog.classList.remove("wide-dialog");
  appDialog.innerHTML = `<div class="dialog-header"><div><h2 id="dialog-title">${title}</h2><p>${description}</p></div><button class="dialog-close" type="button" aria-label="Close">${icon("close")}</button></div><form class="dialog-form"><div class="form-grid">${body}</div><div class="dialog-actions"><button class="button" type="button" data-dialog-cancel>Cancel</button><button class="button button-primary" type="submit">${submitLabel}</button></div></form>`;
  appDialog.querySelector(".dialog-close").addEventListener("click", () => appDialog.close());
  appDialog.querySelector("[data-dialog-cancel]").addEventListener("click", () => appDialog.close());
  appDialog.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (onSubmit(Object.fromEntries(formData.entries())) === false) return;
    appDialog.close();
    persist();
    render();
  });
  appDialog.showModal();
}

function addMember() {
  openForm("Add a member", "Create a new member record in your SACCO.", [
    field("Full name", "name", "text", { full: true, placeholder: "e.g. Jane Wanjiru" }),
    field("Phone number", "phone", "tel", { placeholder: "+256 7XX XXX XXX" }),
    field("Email address", "email", "email", { required: false, placeholder: "name@email.com" }),
    field("Initial savings (UGX)", "savings", "number", { min: 0, step: 1, value: "0" }),
    field("Initial shares (UGX)", "shares", "number", { min: 0, step: 1, value: "0" }),
  ].join(""), "Add member", (values) => {
    const memberNumber = String(data.members.length + 1).padStart(3, "0");
    const member = { id: `UM-${today.getFullYear()}-${memberNumber}`, name: values.name.trim(), phone: values.phone.trim(), email: values.email.trim(), joinDate: isoDate(), status: "Active", savings: Number(values.savings), shares: Number(values.shares) };
    data.members.unshift(member);
    showToast(`${member.name} was added as a member.`);
  });
}

function addTransaction(type) {
  const isRepayment = type === "Loan repayment";
  const isShare = type === "Share contribution";
  const title = isRepayment ? "Record a loan repayment" : isShare ? "Record a share contribution" : "Record a savings transaction";
  const description = isRepayment ? "Post a payment to a member’s outstanding loan balance." : isShare ? "Add to a member’s share capital balance." : "Record a deposit or withdrawal against member savings.";
  const choices = ["MTN MoMo", "Airtel Money", "Bank transfer", "Cash"].map((value) => ({ value, label: value }));
  const memberOptions = data.members.map((member) => ({ value: member.id, label: `${member.name} · ${member.id}` }));
  if (!memberOptions.length) { showToast("Add a member before recording a transaction."); return; }
  const loansForRepayment = isRepayment ? data.loans.filter((loan) => loan.status === "Active" && loan.balance > 0) : [];
  if (isRepayment && !loansForRepayment.length) { showToast("There are no active loan balances to repay."); return; }
  const fields = [
    field("Member", "memberId", "select", { choices: memberOptions }),
    isRepayment
      ? field("Loan", "loanId", "select", { choices: loansForRepayment.map((loan) => ({ value: loan.id, label: `${loan.id} · ${loan.type} · ${money(loan.balance)} balance` })) })
      : isShare
        ? field("Transaction type", "type", "select", { choices: [{ value: "Share contribution", label: "Share contribution" }] })
        : field("Transaction type", "type", "select", { choices: [{ value: "Savings deposit", label: "Savings deposit" }, { value: "Savings withdrawal", label: "Savings withdrawal" }] }),
    field("Amount (UGX)", "amount", "number", { min: 1, step: 1 }),
    field("Payment method", "method", "select", { choices }),
    field("Transaction date", "date", "date", { value: isoDate() }),
    field("Reference / receipt", "reference", "text", { required: false, placeholder: "e.g. MTN or Airtel receipt number" }),
  ];
  openForm(title, description, fields.join(""), "Save transaction", (values) => {
    const amount = Number(values.amount);
    const member = memberFor(values.memberId);
    if (!Number.isFinite(amount) || amount <= 0 || !member) { showToast("Enter a valid amount and member."); return false; }
    const transactionType = isRepayment ? "Loan repayment" : isShare ? "Share contribution" : values.type;
    if (transactionType === "Savings withdrawal" && amount > member.savings) { showToast("Withdrawal exceeds the member’s available savings."); return false; }
    if (isRepayment) {
      const loan = data.loans.find((item) => item.id === values.loanId && item.memberId === member.id && item.status === "Active");
      if (!loan) { showToast("Select an active loan belonging to this member."); return false; }
      if (amount > loan.balance) { showToast("Repayment exceeds the outstanding loan balance."); return false; }
      loan.balance -= amount;
      if (loan.balance === 0) loan.status = "Paid";
    } else if (transactionType === "Savings deposit") member.savings += amount;
    else if (transactionType === "Savings withdrawal") member.savings -= amount;
    else member.shares += amount;
    const ref = values.reference.trim() || `AUTO-${Date.now().toString().slice(-7)}`;
    data.transactions.unshift({ id: makeId(data.transactions, "TX"), memberId: member.id, type: transactionType, amount, date: values.date, method: values.method, reference: ref });
    showToast(`${transactionType} of ${money(amount)} recorded.`);
    return true;
  });
}

function addLoan() {
  if (!data.members.length) { showToast("Add a member before creating a loan application."); return; }
  const memberOptions = data.members.filter((member) => member.status === "Active").map((member) => ({ value: member.id, label: `${member.name} · ${member.id}` }));
  if (!memberOptions.length) { showToast("There are no active members to apply for a loan."); return; }
  openForm("New loan application", "Capture the loan request for review and approval.", [
    field("Applicant", "memberId", "select", { choices: memberOptions, full: true }),
    field("Loan product", "type", "select", { choices: ["Development loan", "School fees loan", "Emergency loan", "Business loan", "Personal loan"].map((value) => ({ value, label: value })) }),
    field("Principal (UGX)", "principal", "number", { min: 1, step: 1 }),
    field("Interest rate (% p.a.)", "rate", "number", { min: 0, step: 0.1, value: "12" }),
    field("Term (months)", "term", "number", { min: 1, step: 1, value: "12" }),
  ].join(""), "Submit for approval", (values) => {
    const principal = Number(values.principal);
    const term = Number(values.term);
    const rate = Number(values.rate);
    if (!memberFor(values.memberId) || principal <= 0 || term <= 0 || rate < 0) { showToast("Enter valid loan application details."); return false; }
    const date = isoDate();
    const due = new Date(`${date}T00:00:00`);
    due.setMonth(due.getMonth() + term);
    data.loans.unshift({ id: `LN-${today.getFullYear()}-${String(data.loans.length + 1).padStart(3, "0")}`, memberId: values.memberId, type: values.type, principal, balance: principal, rate, term, date, dueDate: isoDate(due), status: "Pending" });
    showToast("Loan application submitted for approval.");
    return true;
  });
}

function updateLoanStatus(id, status) {
  const loan = data.loans.find((item) => item.id === id);
  if (!loan || loan.status !== "Pending") return;
  loan.status = status;
  persist();
  render();
  showToast(`Loan application ${status.toLowerCase()}.`);
}

function viewMember(id) {
  const member = memberFor(id);
  if (!member) return;
  const loans = data.loans.filter((loan) => loan.memberId === id);
  const transactions = data.transactions.filter((item) => item.memberId === id).sort((a, b) => b.date.localeCompare(a.date));
  appDialog.classList.add("wide-dialog");
  appDialog.innerHTML = `<div class="member-dialog">
    <div class="dialog-header"><div><h2 id="dialog-title">${escapeHtml(member.name)}</h2><p>${escapeHtml(member.id)} · Member since ${dateLabel(member.joinDate)}</p></div></div>
    <div class="member-detail-body">
      <div class="member-detail-grid">
        <div class="member-detail-item"><span>Status</span><strong>${escapeHtml(member.status)}</strong></div>
        <div class="member-detail-item"><span>Phone</span><strong>${escapeHtml(member.phone)}</strong></div>
        <div class="member-detail-item"><span>Email</span><strong>${escapeHtml(member.email || "Not provided")}</strong></div>
        <div class="member-detail-item"><span>Savings balance</span><strong>${money(member.savings)}</strong></div>
        <div class="member-detail-item"><span>Share capital</span><strong>${money(member.shares)}</strong></div>
        <div class="member-detail-item"><span>Loan accounts</span><strong>${loans.length}</strong></div>
      </div>
      <section class="member-history"><h3>Loan accounts</h3>${loans.length ? loans.map((loan) => `<div class="member-history-row"><span><strong>${escapeHtml(loan.type)}</strong><small>${escapeHtml(loan.id)} · ${escapeHtml(loan.status)} · due ${dateLabel(loan.dueDate)}</small></span><strong>${money(loan.balance)} balance</strong></div>`).join("") : `<p class="subtitle">No loan accounts.</p>`}</section>
      <section class="member-history"><h3>Transactions</h3>${transactions.length ? transactions.map((transaction) => `<div class="member-history-row"><span><strong>${escapeHtml(transaction.type)} · ${money(transaction.amount)}</strong><small>${dateLabel(transaction.date)} · ${escapeHtml(transaction.method)} · ${escapeHtml(transaction.reference)}</small></span><button class="button button-small" type="button" data-action="print-receipt" data-id="${escapeHtml(transaction.id)}">${icon("receipt")}Print receipt</button></div>`).join("") : `<p class="subtitle">No transactions recorded.</p>`}</section>
    </div>
    <div class="dialog-actions"><button class="button" type="button" data-dialog-close>Close</button><button class="button button-danger" type="button" data-action="remove-member" data-id="${escapeHtml(member.id)}">Remove member</button></div>
  </div>`;
  appDialog.querySelector("[data-dialog-close]").addEventListener("click", () => appDialog.close());
  appDialog.showModal();
}

function printReceipt(id) {
  const transaction = data.transactions.find((item) => item.id === id);
  const member = transaction && memberFor(transaction.memberId);
  if (!transaction || !member) return;
  appDialog.classList.remove("wide-dialog");
  appDialog.innerHTML = `<article class="e-receipt">
    <p class="eyebrow">Umoja SACCO · Uganda</p><h2 id="dialog-title">Electronic receipt</h2>
    <p class="receipt-number">Receipt ${escapeHtml(transaction.id)}</p>
    <dl><div><dt>Member</dt><dd>${escapeHtml(member.name)} · ${escapeHtml(member.id)}</dd></div>
      <div><dt>Phone</dt><dd>${escapeHtml(member.phone)}</dd></div>
      <div><dt>Transaction</dt><dd>${escapeHtml(transaction.type)}</dd></div>
      <div><dt>Amount</dt><dd class="receipt-amount">${money(transaction.amount)}</dd></div>
      <div><dt>Payment method</dt><dd>${escapeHtml(transaction.method)}</dd></div>
      <div><dt>Reference</dt><dd>${escapeHtml(transaction.reference)}</dd></div>
      <div><dt>Date</dt><dd>${dateLabel(transaction.date)}</dd></div>
      <div><dt>Member savings balance</dt><dd>${money(member.savings)}</dd></div>
      <div><dt>Share capital balance</dt><dd>${money(member.shares)}</dd></div>
    </dl><p class="receipt-note">Keep this receipt for your records.</p>
  </article><div class="dialog-actions receipt-actions"><button class="button" type="button" data-action="close-dialog">Close</button><button class="button button-primary" type="button" data-action="print-now">${icon("download")}Print receipt</button></div>`;
  appDialog.showModal();
}

function removeMember(id) {
  const member = memberFor(id);
  if (!member || !window.confirm(`Remove ${member.name}? This permanently deletes their member record, loans, and transaction history from this device.`)) return;
  data.members = data.members.filter((item) => item.id !== id);
  data.loans = data.loans.filter((item) => item.memberId !== id);
  data.transactions = data.transactions.filter((item) => item.memberId !== id);
  appDialog.close();
  persist();
  render();
  showToast(`${member.name} and their linked records were removed.`);
}

function resetData() {
  if (!window.confirm("Reset all SACCO data on this device to the original demo records? This permanently replaces current members, loans, and transactions.")) return;
  data = structuredClone(initialData);
  searchTerm = "";
  memberStatusFilter = "All status";
  loanStatusFilter = "All status";
  document.querySelector("#global-search").value = "";
  persist();
  render();
  showToast("SACCO data was reset to the original demo records.");
}

function exportCsv(filename, rows) {
  if (!rows.length) { showToast("There is no data to export."); return; }
  const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast(`${filename} downloaded.`);
}

function exportData(kind) {
  const date = isoDate();
  if (kind === "members") {
    exportCsv(`umoja-members-${date}.csv`, [["Member ID", "Name", "Phone", "Email", "Join date", "Status", "Savings (UGX)", "Shares (UGX)"], ...data.members.map((m) => [m.id, m.name, m.phone, m.email, m.joinDate, m.status, m.savings, m.shares])]);
  } else if (kind === "loans") {
    exportCsv(`umoja-loans-${date}.csv`, [["Loan ID", "Member", "Product", "Principal (UGX)", "Balance (UGX)", "Rate (%)", "Term (months)", "Application date", "Due date", "Status"], ...data.loans.map((l) => [l.id, memberName(l.memberId), l.type, l.principal, l.balance, l.rate, l.term, l.date, l.dueDate, l.status])]);
  } else {
    const transactions = kind === "savings" ? data.transactions.filter((t) => t.type.startsWith("Savings")) : kind === "shares" ? data.transactions.filter((t) => t.type === "Share contribution") : kind === "repayments" ? data.transactions.filter((t) => t.type === "Loan repayment") : data.transactions;
    exportCsv(`umoja-${kind === "transactions" ? "transactions" : kind}-${date}.csv`, [["Transaction ID", "Member", "Type", "Amount (UGX)", "Date", "Payment method", "Reference"], ...transactions.map((t) => [t.id, memberName(t.memberId), t.type, t.amount, t.date, t.method, t.reference])]);
  }
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-search-result], [data-view], [data-view-link], [data-action]");
  if (!target) return;
  if (target.dataset.searchResult) {
    const { searchResult, id, view } = target.dataset;
    activeView = view;
    document.querySelector("#sidebar").classList.remove("open");
    document.querySelector("#sidebar-backdrop").classList.remove("visible");
    if (searchResult === "loan") {
      searchTerm = id.toLowerCase();
      document.querySelector("#global-search").value = id;
      render();
    } else {
      searchTerm = "";
      document.querySelector("#global-search").value = "";
      render();
      if (searchResult === "member") viewMember(id);
      else printReceipt(id);
    }
    return;
  }
  const view = target.dataset.view || target.dataset.viewLink;
  if (view) {
    activeView = view;
    searchTerm = "";
    document.querySelector("#global-search").value = "";
    render();
    document.querySelector("#sidebar").classList.remove("open");
    document.querySelector("#sidebar-backdrop").classList.remove("visible");
    return;
  }
  const { action, id } = target.dataset;
  if (action === "add-member") addMember();
  else if (action === "new-transaction") addTransaction("Savings deposit");
  else if (action === "new-share") addTransaction("Share contribution");
  else if (action === "new-repayment") addTransaction("Loan repayment");
  else if (action === "new-loan") addLoan();
  else if (action === "approve-loan") updateLoanStatus(id, "Active");
  else if (action === "reject-loan") {
    const loan = data.loans.find((item) => item.id === id);
    if (loan && window.confirm(`Decline the ${loan.type} application for ${memberName(loan.memberId)}?`)) updateLoanStatus(id, "Rejected");
  }
  else if (action === "view-member") viewMember(id);
  else if (action === "remove-member") removeMember(id);
  else if (action === "reset-data") resetData();
  else if (action === "print-receipt") printReceipt(id);
  else if (action === "close-dialog") appDialog.close();
  else if (action === "print-now") window.print();
  else if (action === "toggle-theme") {
    preferences.theme = preferences.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = preferences.theme;
    document.querySelector("#theme-toggle").textContent = preferences.theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
    savePreferences();
  }
  else if (action === "view-loan") {
    const loan = data.loans.find((item) => item.id === id);
    if (loan) showToast(`${loan.id}: ${money(loan.balance)} outstanding at ${loan.rate}% p.a.`);
  } else if (action.startsWith("export-")) exportData(action.slice(7));
  else if (action === "help") showToast("Use the navigation to manage members, savings, shares, loans and repayments.");
});

document.querySelector("#global-search").addEventListener("input", (event) => {
  searchTerm = event.target.value.trim().toLowerCase();
  render();
  const input = document.querySelector("#global-search");
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
});
document.querySelector("#global-search").addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.currentTarget.value = "";
    searchTerm = "";
    render();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".search-wrap")) {
    document.querySelector("#global-search-results").hidden = true;
    document.querySelector(".search-wrap").classList.remove("search-open");
  }
});
document.querySelector("#search-trigger").addEventListener("click", focusGlobalSearch);
pageContent.addEventListener("change", (event) => {
  if (event.target.id === "member-status-filter") memberStatusFilter = event.target.value;
  if (event.target.id === "loan-status-filter") loanStatusFilter = event.target.value;
  if (event.target.matches("#member-status-filter, #loan-status-filter")) render();
});
document.querySelector("#mobile-menu").addEventListener("click", () => {
  document.querySelector("#sidebar").classList.add("open");
  document.querySelector("#sidebar-backdrop").classList.add("visible");
});
document.querySelector("#sidebar-backdrop").addEventListener("click", () => {
  document.querySelector("#sidebar").classList.remove("open");
  document.querySelector("#sidebar-backdrop").classList.remove("visible");
});
document.querySelector("#help-button").addEventListener("click", () => showToast("Use the navigation to manage members, savings, shares, loans and repayments."));
document.querySelector("#notification-button").addEventListener("click", () => {
  const count = pendingLoans().length;
  showToast(count ? `You have ${count} loan application${count === 1 ? "" : "s"} awaiting review.` : "You’re all caught up. No pending loan applications.");
});
document.querySelector("#profile-button").addEventListener("click", () => showToast("Signed in as Josh · Administrator"));
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    focusGlobalSearch();
  }
  if (event.key === "Escape") {
    document.querySelector("#sidebar").classList.remove("open");
    document.querySelector("#sidebar-backdrop").classList.remove("visible");
  }
});

render();
document.querySelector("#theme-toggle").textContent = preferences.theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
