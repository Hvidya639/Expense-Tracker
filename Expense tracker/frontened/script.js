/* ================================================
   PENNYWISE 💜
   COMPLETE JAVASCRIPT - DAY 1 TO DAY 9
================================================ */

// ================================================
// 1. DOM ELEMENTS
// ================================================

// Transactions
const transactionForm = document.getElementById("transactionForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const transactionList = document.getElementById("transactionList");
const searchInput = document.getElementById("search");
const filterType = document.getElementById("filterType");
const filterCategory = document.getElementById("filterCategory");

// Dashboard
const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expenseElement = document.getElementById("expense");

// Analytics
const monthlyIncomeElement = document.getElementById("monthlyIncome");
const monthlyExpenseElement = document.getElementById("monthlyExpense");
const categoryBreakdown = document.getElementById("categoryBreakdown");

// Budget
const budgetForm = document.getElementById("budgetForm");
const budgetAmountInput = document.getElementById("budgetAmount");
const budgetText = document.getElementById("budgetText");
const budgetRemaining = document.getElementById("budgetRemaining");
const budgetProgress = document.getElementById("budgetProgress");
const budgetMessage = document.getElementById("budgetMessage");

// Savings
const savingsForm = document.getElementById("savingsForm");
const goalNameInput = document.getElementById("goalName");
const goalAmountInput = document.getElementById("goalAmount");
const goalSavedInput = document.getElementById("goalSaved");
const savingsDisplay = document.getElementById("savingsDisplay");

// Smart Insights
const totalMonthlySpendingElement = document.getElementById(
  "totalMonthlySpending",
);

const topSpendingCategoryElement = document.getElementById(
  "topSpendingCategory",
);

const savingTipElement = document.getElementById("savingTip");

// Charts
const expenseChartCanvas = document.getElementById("expenseChart");
const incomeExpenseChartCanvas = document.getElementById("incomeExpenseChart");

// Dark Mode
const themeToggle = document.getElementById("themeToggle");

// Challenge
const challengeDuration = document.getElementById("challengeDuration");
const startChallengeButton = document.getElementById("startChallenge");
const challengeDisplay = document.getElementById("challengeDisplay");

// Subscriptions
const subscriptionForm = document.getElementById("subscriptionForm");
const subscriptionName = document.getElementById("subscriptionName");
const subscriptionAmount = document.getElementById("subscriptionAmount");
const subscriptionFrequency = document.getElementById("subscriptionFrequency");
const subscriptionDate = document.getElementById("subscriptionDate");
const subscriptionList = document.getElementById("subscriptionList");
const monthlySubscriptionTotal = document.getElementById(
  "monthlySubscriptionTotal",
);
const subscriptionCount = document.getElementById("subscriptionCount");
const upcomingPayments = document.getElementById("upcomingPayments");

// Day 9 Export
const exportButton = document.getElementById("exportCSV");

// ================================================
// 2. LOCAL STORAGE
// ================================================

function loadData(key, defaultValue) {
  try {
    const savedData = localStorage.getItem(key);
    return savedData !== null ? JSON.parse(savedData) : defaultValue;
  } catch (error) {
    console.error("LocalStorage loading error:", error);
    return defaultValue;
  }
}

let transactions = loadData("pennyWiseTransactions", []);
let monthlyBudget = loadData("pennyWiseBudget", 0);
let savingsGoal = loadData("pennyWiseSavingsGoal", null);
let challenge = loadData("pennyWiseChallenge", null);
let subscriptions = loadData("pennyWiseSubscriptions", []);

function saveTransactions() {
  localStorage.setItem("pennyWiseTransactions", JSON.stringify(transactions));
}

function saveBudget() {
  localStorage.setItem("pennyWiseBudget", JSON.stringify(monthlyBudget));
}

function saveSavingsGoal() {
  localStorage.setItem("pennyWiseSavingsGoal", JSON.stringify(savingsGoal));
}

function saveChallenge() {
  localStorage.setItem("pennyWiseChallenge", JSON.stringify(challenge));
}

function saveSubscriptions() {
  localStorage.setItem("pennyWiseSubscriptions", JSON.stringify(subscriptions));
}

// ================================================
// 3. HELPER FUNCTIONS
// ================================================

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function getLocalDateString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentMonth() {
  const today = new Date();

  return (
    today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0")
  );
}

function getMonthlyTransactions() {
  const currentMonth = getCurrentMonth();

  return transactions.filter(
    (transaction) =>
      transaction.date && transaction.date.startsWith(currentMonth),
  );
}

// ================================================
// 4. TRANSACTIONS
// ================================================

if (dateInput) {
  dateInput.value = getLocalDateString();
}

// Add transaction
transactionForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;

  if (!title || !Number.isFinite(amount) || amount <= 0 || !date) {
    alert("Please enter valid transaction details.");
    return;
  }

  const transaction = {
    id: crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now()) + Math.random(),
    title,
    amount,
    type,
    category,
    date,
  };

  transactions.push(transaction);

  saveTransactions();

  transactionForm.reset();
  dateInput.value = getLocalDateString();

  updateApp();
});

// Delete transaction
function deleteTransaction(id) {
  if (!confirm("Are you sure you want to delete this transaction?")) {
    return;
  }

  transactions = transactions.filter(
    (transaction) => String(transaction.id) !== String(id),
  );

  saveTransactions();
  updateApp();
}

// Display transactions
function displayTransactions() {
  const searchText = searchInput.value.toLowerCase();
  const selectedType = filterType.value;
  const selectedCategory = filterCategory.value;

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.title.toLowerCase().includes(searchText) ||
      transaction.category.toLowerCase().includes(searchText);

    const matchesType =
      selectedType === "all" || transaction.type === selectedType;

    const matchesCategory =
      selectedCategory === "all" || transaction.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  transactionList.innerHTML = "";

  if (filteredTransactions.length === 0) {
    transactionList.innerHTML = `
            <p class="empty">
                No transactions found. Add one to get started! 💜
            </p>
        `;
    return;
  }

  filteredTransactions
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .forEach((transaction) => {
      const item = document.createElement("div");
      item.className = "transaction-item";

      const details = document.createElement("div");
      details.className = "transaction-details";

      const transactionTitle = document.createElement("h3");
      transactionTitle.textContent = transaction.title;

      const transactionInfo = document.createElement("p");
      transactionInfo.textContent = `${transaction.category} • ${transaction.date}`;

      details.appendChild(transactionTitle);
      details.appendChild(transactionInfo);

      const rightSide = document.createElement("div");
      rightSide.className = "transaction-right";

      const amount = document.createElement("span");

      amount.className =
        transaction.type === "income" ? "income-text" : "expense-text";

      const sign = transaction.type === "income" ? "+" : "-";

      amount.textContent = sign + formatCurrency(transaction.amount);

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-btn";
      deleteButton.textContent = "Delete";

      deleteButton.addEventListener("click", function () {
        deleteTransaction(transaction.id);
      });

      rightSide.appendChild(amount);
      rightSide.appendChild(deleteButton);

      item.appendChild(details);
      item.appendChild(rightSide);

      transactionList.appendChild(item);
    });
}

// Search and filters
searchInput.addEventListener("input", displayTransactions);
filterType.addEventListener("change", displayTransactions);
filterCategory.addEventListener("change", displayTransactions);

// ================================================
// 5. DASHBOARD
// ================================================

function updateDashboard() {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      totalIncome += Number(transaction.amount);
    } else {
      totalExpense += Number(transaction.amount);
    }
  });

  balanceElement.textContent = formatCurrency(totalIncome - totalExpense);

  incomeElement.textContent = formatCurrency(totalIncome);
  expenseElement.textContent = formatCurrency(totalExpense);
}

// ================================================
// 6. MONTHLY ANALYTICS
// ================================================

function updateAnalytics() {
  const monthlyTransactions = getMonthlyTransactions();

  let monthlyIncome = 0;
  let monthlyExpense = 0;

  const categoryTotals = {};

  monthlyTransactions.forEach((transaction) => {
    if (transaction.type === "income") {
      monthlyIncome += Number(transaction.amount);
    } else {
      monthlyExpense += Number(transaction.amount);

      categoryTotals[transaction.category] =
        (categoryTotals[transaction.category] || 0) +
        Number(transaction.amount);
    }
  });

  monthlyIncomeElement.textContent = formatCurrency(monthlyIncome);

  monthlyExpenseElement.textContent = formatCurrency(monthlyExpense);

  categoryBreakdown.innerHTML = "";

  const categories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  if (categories.length === 0) {
    categoryBreakdown.innerHTML = `
            <p class="empty">
                No expense data available for this month.
            </p>
        `;
    return;
  }

  categories.forEach(([category, amount]) => {
    const percentage = monthlyExpense > 0 ? (amount / monthlyExpense) * 100 : 0;

    const row = document.createElement("div");
    row.className = "category-row";

    const info = document.createElement("div");
    info.className = "category-info";

    const categoryName = document.createElement("span");
    categoryName.textContent = category;

    const categoryAmount = document.createElement("strong");
    categoryAmount.textContent = `${formatCurrency(amount)} (${percentage.toFixed(1)}%)`;

    info.appendChild(categoryName);
    info.appendChild(categoryAmount);

    const track = document.createElement("div");
    track.className = "category-track";

    const fill = document.createElement("div");
    fill.className = "category-fill";
    fill.style.width = `${percentage}%`;

    track.appendChild(fill);
    row.appendChild(info);
    row.appendChild(track);

    categoryBreakdown.appendChild(row);
  });
}

// ================================================
// 7. MONTHLY BUDGET
// ================================================

budgetForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const amount = Number(budgetAmountInput.value);

  if (!Number.isFinite(amount) || amount <= 0) {
    alert("Please enter a valid budget amount.");
    return;
  }

  monthlyBudget = amount;

  saveBudget();
  budgetForm.reset();

  updateApp();
});

function updateBudget() {
  const monthlyTransactions = getMonthlyTransactions();

  const totalExpense = monthlyTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  budgetText.textContent = `Your monthly budget: ${formatCurrency(monthlyBudget)}`;

  if (monthlyBudget <= 0) {
    budgetRemaining.textContent = "Remaining: ₹0.00";
    budgetProgress.style.width = "0%";
    budgetMessage.textContent = "Set a budget to start tracking your spending.";

    budgetProgress.style.background = "#8B5CF6";
    return;
  }

  const remaining = monthlyBudget - totalExpense;
  const percentage = (totalExpense / monthlyBudget) * 100;
  const progress = Math.min(percentage, 100);

  budgetRemaining.textContent = `Remaining: ${formatCurrency(remaining)}`;

  budgetProgress.style.width = `${progress}%`;

  if (percentage >= 100) {
    budgetMessage.textContent =
      "⚠️ Budget exceeded! Try to reduce your spending.";

    budgetProgress.style.background = "#EF4444";
  } else if (percentage >= 80) {
    budgetMessage.textContent =
      "⚠️ You have used 80% of your budget. Be careful!";

    budgetProgress.style.background = "#F59E0B";
  } else {
    budgetMessage.textContent = "✨ Great! You are managing your budget well.";

    budgetProgress.style.background = "#8B5CF6";
  }
}

// ================================================
// 8. SAVINGS GOAL
// ================================================

savingsForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = goalNameInput.value.trim();
  const target = Number(goalAmountInput.value);
  const saved = Number(goalSavedInput.value);

  if (
    !name ||
    !Number.isFinite(target) ||
    !Number.isFinite(saved) ||
    target <= 0 ||
    saved < 0
  ) {
    alert("Please enter valid savings goal details.");
    return;
  }

  savingsGoal = {
    name,
    target,
    saved,
  };

  saveSavingsGoal();

  savingsForm.reset();
  goalSavedInput.value = "0";

  updateApp();
});

function displaySavingsGoal() {
  savingsDisplay.innerHTML = "";

  if (!savingsGoal) {
    savingsDisplay.innerHTML = `
            <p class="empty">
                Create your first savings goal! 🌱
            </p>
        `;
    return;
  }

  const percentage = Math.min(
    (savingsGoal.saved / savingsGoal.target) * 100,
    100,
  );

  const goalCard = document.createElement("div");
  goalCard.className = "savings-goal-card";

  const heading = document.createElement("h3");
  heading.textContent = `🎯 ${savingsGoal.name}`;

  const savedText = document.createElement("p");
  savedText.textContent = `Saved: ${formatCurrency(savingsGoal.saved)}`;

  const targetText = document.createElement("p");
  targetText.textContent = `Target: ${formatCurrency(savingsGoal.target)}`;

  const progressText = document.createElement("p");
  progressText.textContent = `${percentage.toFixed(1)}% completed`;

  const track = document.createElement("div");
  track.className = "savings-track";

  const fill = document.createElement("div");
  fill.className = "savings-fill";
  fill.style.width = `${percentage}%`;

  track.appendChild(fill);

  const addForm = document.createElement("form");
  addForm.className = "inline-form";
  addForm.style.marginTop = "15px";

  const addInput = document.createElement("input");
  addInput.type = "number";
  addInput.placeholder = "Add savings (₹)";
  addInput.min = "0.01";
  addInput.step = "0.01";
  addInput.required = true;

  const addButton = document.createElement("button");
  addButton.type = "submit";
  addButton.className = "primary-btn";
  addButton.textContent = "Add Savings";

  addForm.appendChild(addInput);
  addForm.appendChild(addButton);

  addForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const amount = Number(addInput.value);

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Enter a valid savings amount.");
      return;
    }

    savingsGoal.saved += amount;

    saveSavingsGoal();
    updateApp();
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-btn";
  deleteButton.style.marginTop = "12px";
  deleteButton.textContent = "Delete Goal";

  deleteButton.addEventListener("click", function () {
    if (confirm("Delete this savings goal?")) {
      savingsGoal = null;
      saveSavingsGoal();
      updateApp();
    }
  });

  goalCard.appendChild(heading);
  goalCard.appendChild(savedText);
  goalCard.appendChild(targetText);
  goalCard.appendChild(progressText);
  goalCard.appendChild(track);
  goalCard.appendChild(addForm);
  goalCard.appendChild(deleteButton);

  if (savingsGoal.saved >= savingsGoal.target) {
    const successMessage = document.createElement("p");

    successMessage.textContent = "🎉 Congratulations! Goal achieved!";

    successMessage.style.color = "#16A34A";
    successMessage.style.marginTop = "12px";

    goalCard.appendChild(successMessage);
  }

  savingsDisplay.appendChild(goalCard);
}

// ================================================
// 9. SMART SPENDING INSIGHTS
// ================================================

function updateSmartInsights() {
  const monthlyTransactions = getMonthlyTransactions();

  let totalSpending = 0;
  const categoryTotals = {};

  monthlyTransactions.forEach((transaction) => {
    if (transaction.type === "expense") {
      totalSpending += Number(transaction.amount);

      categoryTotals[transaction.category] =
        (categoryTotals[transaction.category] || 0) +
        Number(transaction.amount);
    }
  });

  totalMonthlySpendingElement.textContent = formatCurrency(totalSpending);

  const categories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  if (categories.length === 0) {
    topSpendingCategoryElement.textContent = "Not available";

    savingTipElement.textContent =
      "Start adding expenses to receive money-saving tips! 💜";

    return;
  }

  const topCategory = categories[0];

  topSpendingCategoryElement.textContent = topCategory[0];

  const percentage =
    totalSpending > 0 ? (topCategory[1] / totalSpending) * 100 : 0;

  if (percentage >= 50) {
    savingTipElement.textContent = `⚠️ You spent ${percentage.toFixed(1)}% of your monthly expenses on ${topCategory[0]}. Try setting a limit for this category next month!`;
  } else {
    savingTipElement.textContent = `✨ Your highest spending category is ${topCategory[0]}. Keep tracking your expenses and look for small ways to save!`;
  }
}

// ================================================
// 10. CHARTS
// ================================================

let expenseChart = null;
let incomeExpenseChart = null;

function updateCharts() {
  if (typeof Chart === "undefined") {
    console.warn("Chart.js was not loaded. Check your internet connection.");
    return;
  }

  const monthlyTransactions = getMonthlyTransactions();

  const categoryTotals = {};

  let monthlyIncome = 0;
  let monthlyExpense = 0;

  monthlyTransactions.forEach((transaction) => {
    if (transaction.type === "income") {
      monthlyIncome += Number(transaction.amount);
    } else {
      monthlyExpense += Number(transaction.amount);

      categoryTotals[transaction.category] =
        (categoryTotals[transaction.category] || 0) +
        Number(transaction.amount);
    }
  });

  const categoryNames = Object.keys(categoryTotals);
  const categoryAmounts = Object.values(categoryTotals);

  if (expenseChart) {
    expenseChart.destroy();
    expenseChart = null;
  }

  if (incomeExpenseChart) {
    incomeExpenseChart.destroy();
    incomeExpenseChart = null;
  }

  // Doughnut chart
  if (expenseChartCanvas) {
    expenseChart = new Chart(expenseChartCanvas, {
      type: "doughnut",
      data: {
        labels: categoryNames.length ? categoryNames : ["No expenses yet"],
        datasets: [
          {
            data: categoryAmounts.length ? categoryAmounts : [1],
            backgroundColor: categoryAmounts.length
              ? [
                  "#8B5CF6",
                  "#EC4899",
                  "#34D399",
                  "#FBBF24",
                  "#60A5FA",
                  "#F87171",
                  "#A78BFA",
                  "#FB923C",
                  "#94A3B8",
                ]
              : ["#E5E7EB"],
            borderWidth: 2,
            borderColor: "#FFFFFF",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  }

  // Income vs expenses chart
  if (incomeExpenseChartCanvas) {
    incomeExpenseChart = new Chart(incomeExpenseChartCanvas, {
      type: "bar",
      data: {
        labels: ["Income", "Expenses"],
        datasets: [
          {
            label: "Amount (₹)",
            data: [monthlyIncome, monthlyExpense],
            backgroundColor: ["#34D399", "#F87171"],
            borderRadius: 10,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
}

// ================================================
// 11. DARK MODE
// ================================================

function setupTheme() {
  const savedTheme = localStorage.getItem("pennyWiseTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
  } else {
    themeToggle.textContent = "🌙 Dark Mode";
  }
}

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");

  if (isDark) {
    themeToggle.textContent = "☀️ Light Mode";
    localStorage.setItem("pennyWiseTheme", "dark");
  } else {
    themeToggle.textContent = "🌙 Dark Mode";
    localStorage.setItem("pennyWiseTheme", "light");
  }
});

// ================================================
// 12. NO-SPEND CHALLENGE
// ================================================

startChallengeButton.addEventListener("click", function () {
  const duration = Number(challengeDuration.value);

  if (challenge && !challenge.completed) {
    const confirmStart = confirm(
      "Starting a new challenge will replace your current challenge. Continue?",
    );

    if (!confirmStart) return;
  }

  challenge = {
    duration,
    startDate: getLocalDateString(),
    completedDates: [],
    completed: false,
  };

  saveChallenge();
  updateChallengeDisplay();

  alert("Your No-Spend Challenge has started! 🎉");
});

function getChallengeDay() {
  if (!challenge) return 0;

  const start = new Date(challenge.startDate + "T00:00:00");
  const today = new Date(getLocalDateString() + "T00:00:00");

  const difference = Math.floor((today - start) / (1000 * 60 * 60 * 24));

  return difference + 1;
}

function markNoSpendDay() {
  if (!challenge) return;

  const today = getLocalDateString();
  const challengeDay = getChallengeDay();

  if (challengeDay < 1 || challengeDay > challenge.duration) {
    alert("Your challenge is not active today.");
    return;
  }

  if (challenge.completedDates.includes(today)) {
    alert("You have already marked today! 😊");
    return;
  }

  challenge.completedDates.push(today);

  if (challenge.completedDates.length >= challenge.duration) {
    challenge.completed = true;
  }

  saveChallenge();
  updateChallengeDisplay();
}

function updateChallengeDisplay() {
  if (!challengeDisplay) return;

  if (!challenge) {
    challengeDisplay.innerHTML = `
            <p class="empty">
                Start your first No-Spend Challenge! 💜
            </p>
        `;
    return;
  }

  const currentDay = getChallengeDay();
  const completedDays = challenge.completedDates.length;

  const progress = Math.min((completedDays / challenge.duration) * 100, 100);

  const isExpired = currentDay > challenge.duration;

  const isActive =
    currentDay >= 1 && currentDay <= challenge.duration && !challenge.completed;

  let message = "";
  let buttonHTML = "";

  if (challenge.completed) {
    message = `
            🎉 Amazing! You completed your
            ${challenge.duration}-day No-Spend Challenge!
        `;
  } else if (isExpired) {
    message = `
            ⏰ Your challenge period has ended.
            You completed ${completedDays} No-Spend days.
        `;
  } else if (isActive) {
    message = `
            💜 You are on Day ${currentDay}
            of your ${challenge.duration}-day challenge.
            Keep going!
        `;

    buttonHTML = `
            <button
                class="challenge-action-btn"
                id="markNoSpend"
                type="button">
                🌱 Mark Today as No-Spend
            </button>
        `;
  } else {
    message = "Your challenge will begin soon!";
  }

  challengeDisplay.innerHTML = `
        <div class="challenge-display-card">

            <h3>🌟 ${challenge.duration}-Day Challenge</h3>

            <p>Started on: ${challenge.startDate}</p>

            <div class="challenge-stats">

                <div class="challenge-stat">
                    <h4>Completed Days</h4>
                    <h2>${completedDays}</h2>
                </div>

                <div class="challenge-stat">
                    <h4>Challenge Days</h4>
                    <h2>${challenge.duration}</h2>
                </div>

            </div>

            <p>Progress: ${progress.toFixed(0)}%</p>

            <div class="challenge-progress-track">
                <div
                    class="challenge-progress-fill"
                    style="width: ${progress}%">
                </div>
            </div>

            <div class="challenge-message">
                ${message}
            </div>

            ${buttonHTML}

            <br>

            <button
                class="challenge-reset-btn"
                id="resetChallenge"
                type="button">
                🔄 Reset Challenge
            </button>

        </div>
    `;

  const markButton = document.getElementById("markNoSpend");

  if (markButton) {
    markButton.addEventListener("click", markNoSpendDay);
  }

  const resetButton = document.getElementById("resetChallenge");

  if (resetButton) {
    resetButton.addEventListener("click", resetChallenge);
  }
}

function resetChallenge() {
  if (!confirm("Are you sure you want to reset your challenge?")) {
    return;
  }

  challenge = null;
  localStorage.removeItem("pennyWiseChallenge");

  updateChallengeDisplay();
}

// ================================================
// 13. SUBSCRIPTIONS TRACKER
// ================================================

subscriptionForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = subscriptionName.value.trim();
  const amount = Number(subscriptionAmount.value);
  const frequency = subscriptionFrequency.value;
  const nextDate = subscriptionDate.value;

  if (!name || !Number.isFinite(amount) || amount <= 0 || !nextDate) {
    alert("Please enter valid subscription details.");
    return;
  }

  const newSubscription = {
    id: crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now()) + Math.random(),
    name,
    amount,
    frequency,
    nextDate,
  };

  subscriptions.push(newSubscription);

  saveSubscriptions();
  subscriptionForm.reset();

  updateApp();

  alert("Subscription added successfully! 💜");
});

function getMonthlyCost(subscription) {
  if (subscription.frequency === "weekly") {
    return (subscription.amount * 52) / 12;
  }

  if (subscription.frequency === "yearly") {
    return subscription.amount / 12;
  }

  return subscription.amount;
}

function getNextPaymentDate(subscription) {
  const today = new Date(getLocalDateString() + "T00:00:00");

  let paymentDate = new Date(subscription.nextDate + "T00:00:00");

  if (isNaN(paymentDate.getTime())) {
    return today;
  }

  let attempts = 0;

  while (paymentDate < today && attempts < 500) {
    if (subscription.frequency === "weekly") {
      paymentDate.setDate(paymentDate.getDate() + 7);
    } else if (subscription.frequency === "monthly") {
      const originalDay = paymentDate.getDate();

      paymentDate.setDate(1);
      paymentDate.setMonth(paymentDate.getMonth() + 1);

      const lastDay = new Date(
        paymentDate.getFullYear(),
        paymentDate.getMonth() + 1,
        0,
      ).getDate();

      paymentDate.setDate(Math.min(originalDay, lastDay));
    } else {
      paymentDate.setFullYear(paymentDate.getFullYear() + 1);
    }

    attempts++;
  }

  return paymentDate;
}

function formatSubscriptionDate(date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function deleteSubscription(id) {
  if (!confirm("Do you want to delete this subscription?")) {
    return;
  }

  subscriptions = subscriptions.filter(
    (subscription) => String(subscription.id) !== String(id),
  );

  saveSubscriptions();
  updateApp();
}

function displaySubscriptions() {
  subscriptionList.innerHTML = "";

  if (subscriptions.length === 0) {
    subscriptionList.innerHTML = `
            <p class="empty">
                No subscriptions added yet! 💜
            </p>
        `;
    return;
  }

  subscriptions.forEach((subscription) => {
    const nextPayment = getNextPaymentDate(subscription);

    const item = document.createElement("div");
    item.className = "subscription-item";

    const info = document.createElement("div");
    info.className = "subscription-info";

    const name = document.createElement("h3");
    name.textContent = "🔄 " + subscription.name;

    const details = document.createElement("p");
    details.textContent = `${subscription.frequency} • Next payment: ${formatSubscriptionDate(nextPayment)}`;

    info.appendChild(name);
    info.appendChild(details);

    const rightSide = document.createElement("div");

    const amount = document.createElement("p");
    amount.className = "subscription-amount";

    amount.textContent = `${formatCurrency(subscription.amount)} / ${subscription.frequency}`;

    const deleteButton = document.createElement("button");
    deleteButton.className = "subscription-delete";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      deleteSubscription(subscription.id);
    });

    rightSide.appendChild(amount);
    rightSide.appendChild(deleteButton);

    item.appendChild(info);
    item.appendChild(rightSide);

    subscriptionList.appendChild(item);
  });
}

function displayUpcomingPayments() {
  upcomingPayments.innerHTML = "";

  const today = new Date(getLocalDateString() + "T00:00:00");

  const sevenDaysLater = new Date(today);
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

  const upcoming = subscriptions
    .map((subscription) => ({
      subscription,
      paymentDate: getNextPaymentDate(subscription),
    }))
    .filter(
      (item) => item.paymentDate >= today && item.paymentDate <= sevenDaysLater,
    )
    .sort((a, b) => a.paymentDate - b.paymentDate);

  if (upcoming.length === 0) {
    upcomingPayments.innerHTML = `
            <p class="empty">
                No upcoming payments in the next 7 days. 🎉
            </p>
        `;
    return;
  }

  upcoming.forEach((item) => {
    const card = document.createElement("div");
    card.className = "upcoming-payment-item";

    const name = document.createElement("strong");
    name.textContent = item.subscription.name;

    const details = document.createElement("p");
    details.textContent = `${formatCurrency(item.subscription.amount)} • Due ${formatSubscriptionDate(item.paymentDate)}`;

    card.appendChild(name);
    card.appendChild(details);

    upcomingPayments.appendChild(card);
  });
}

function updateSubscriptions() {
  const monthlyTotal = subscriptions.reduce(
    (total, subscription) => total + getMonthlyCost(subscription),
    0,
  );

  monthlySubscriptionTotal.textContent = formatCurrency(monthlyTotal);

  subscriptionCount.textContent = subscriptions.length;

  displaySubscriptions();
  displayUpcomingPayments();
}

// ================================================
// 14. DAY 8 - EXPENSE CALENDAR
// ================================================

let calendarDate = new Date();
let selectedCalendarDate = null;

function renderCalendar() {
  const calendarGrid = document.getElementById("calendarGrid");
  const calendarMonth = document.getElementById("calendarMonth");

  if (!calendarGrid || !calendarMonth) return;

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  calendarMonth.textContent = calendarDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  calendarGrid.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day empty";
    calendarGrid.appendChild(emptyCell);
  }

  const today = getLocalDateString();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString =
      year +
      "-" +
      String(month + 1).padStart(2, "0") +
      "-" +
      String(day).padStart(2, "0");

    const dayTransactions = transactions.filter(
      (transaction) => transaction.date === dateString,
    );

    const dayExpenses = dayTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const cell = document.createElement("div");
    cell.className = "calendar-day";

    cell.classList.add(dayExpenses > 0 ? "spent" : "no-spending");

    if (dateString === today) {
      cell.classList.add("today");
    }

    if (dateString === selectedCalendarDate) {
      cell.classList.add("selected");
    }

    const dateNumber = document.createElement("span");
    dateNumber.className = "calendar-date";
    dateNumber.textContent = day;

    cell.appendChild(dateNumber);

    if (dayExpenses > 0) {
      const amount = document.createElement("span");
      amount.className = "calendar-amount";
      amount.textContent = "₹" + dayExpenses.toLocaleString("en-IN");

      cell.appendChild(amount);
    }

    cell.addEventListener("click", function () {
      selectedCalendarDate = dateString;

      renderCalendar();
      showCalendarTransactions(dateString);
    });

    calendarGrid.appendChild(cell);
  }

  if (selectedCalendarDate) {
    showCalendarTransactions(selectedCalendarDate);
  }
}

function showCalendarTransactions(dateString) {
  const details = document.getElementById("selectedDateDetails");

  if (!details) return;

  const dayTransactions = transactions.filter(
    (transaction) => transaction.date === dateString,
  );

  const formattedDate = new Date(dateString + "T00:00:00").toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  details.innerHTML = "";

  const heading = document.createElement("h3");
  heading.textContent = "📝 Transactions - " + formattedDate;

  details.appendChild(heading);

  if (dayTransactions.length === 0) {
    const message = document.createElement("p");

    message.textContent =
      "No transactions on this date. Enjoy your no-spend day! 💚";

    details.appendChild(message);
    return;
  }

  dayTransactions.forEach((transaction) => {
    const item = document.createElement("div");
    item.className = "calendar-transaction";

    const info = document.createElement("div");

    const title = document.createElement("strong");
    title.textContent = transaction.title;

    const category = document.createElement("small");
    category.textContent = transaction.category;

    info.appendChild(title);
    info.appendChild(category);

    const amount = document.createElement("span");

    if (transaction.type === "expense") {
      amount.className = "expense-amount";
      amount.textContent =
        "-₹" + Number(transaction.amount).toLocaleString("en-IN");
    } else {
      amount.className = "income-amount";
      amount.textContent =
        "+₹" + Number(transaction.amount).toLocaleString("en-IN");
    }

    item.appendChild(info);
    item.appendChild(amount);

    details.appendChild(item);
  });
}

// Calendar navigation
document.getElementById("prevMonth")?.addEventListener("click", function () {
  calendarDate.setDate(1);
  calendarDate.setMonth(calendarDate.getMonth() - 1);

  selectedCalendarDate = null;
  renderCalendar();
});

document.getElementById("nextMonth")?.addEventListener("click", function () {
  calendarDate.setDate(1);
  calendarDate.setMonth(calendarDate.getMonth() + 1);

  selectedCalendarDate = null;
  renderCalendar();
});

// ================================================
// 15. DAY 9 - EXPORT TRANSACTIONS TO CSV
// ================================================

function exportPennyWiseCSV() {
  try {
    // Read saved transactions directly
    const savedTransactions = loadData("pennyWiseTransactions", []);

    if (!Array.isArray(savedTransactions) || savedTransactions.length === 0) {
      alert("No transactions to export! Add transactions first 💜");
      return;
    }

    // CSV headers
    const headers = ["Title", "Amount", "Type", "Category", "Date"];

    // Escape CSV values
    function escapeCSV(value) {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    }

    // Convert transactions to rows
    const rows = savedTransactions.map((transaction) => [
      transaction.title,
      transaction.amount,
      transaction.type,
      transaction.category,
      transaction.date,
    ]);

    // Create CSV content
    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\r\n");

    // Excel UTF-8 support
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    // Download file
    const downloadURL = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = downloadURL;
    link.download = "PennyWise_Transactions.csv";
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(function () {
      URL.revokeObjectURL(downloadURL);
    }, 1000);

    alert("Transactions exported successfully! 💜");
  } catch (error) {
    console.error("Export error:", error);
    alert("Export failed! Check Console for the error.");
  }
}

// Connect the export button
if (exportButton) {
  exportButton.addEventListener("click", exportPennyWiseCSV);
} else {
  console.error("Export button not found! Check your HTML ID.");
}

// ================================================
// 16. UPDATE APP
// ================================================

function updateApp() {
  updateDashboard();
  displayTransactions();
  updateAnalytics();
  updateBudget();
  displaySavingsGoal();
  updateSmartInsights();
  updateChallengeDisplay();
  updateSubscriptions();
  updateCharts();

  // Day 8 Calendar refresh
  renderCalendar();
}

// ================================================
// 17. INITIALIZE PENNYWISE
// ================================================

setupTheme();
updateApp();

console.log("💜 PennyWise Day 1–9 is ready!");
// ================================================
// PENNYWISE PWA - SERVICE WORKER REGISTRATION
// ================================================

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((registration) => {
        console.log("PennyWise Service Worker registered successfully!");
        console.log("Scope:", registration.scope);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
