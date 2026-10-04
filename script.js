const challenges = [
  ["💧", "Save Water", "Turn off the tap while brushing.", 20],
  ["🥤", "Skip Plastic", "Avoid one single-use plastic item.", 20],
  ["💡", "Save Energy", "Switch off unused lights.", 15],
  ["♻️", "Recycle", "Recycle one suitable item.", 15]
];

const questions = [
  {
    q: "Which gas is mainly responsible for global warming?",
    a: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
    correct: "Carbon dioxide"
  },
  {
    q: "Which is a renewable source of energy?",
    a: ["Coal", "Petrol", "Solar energy", "Natural gas"],
    correct: "Solar energy"
  },
  {
    q: "What should we do with recyclable materials?",
    a: ["Recycle them", "Burn them", "Waste them", "Throw them anywhere"],
    correct: "Recycle them"
  },
  {
    q: "Which action saves electricity?",
    a: ["Leave lights on", "Switch off unused lights", "Use more chargers", "Keep devices on"],
    correct: "Switch off unused lights"
  },
  {
    q: "What does composting mainly reduce?",
    a: ["Food waste", "Sunlight", "Rainfall", "Oxygen"],
    correct: "Food waste"
  },
  {
    q: "Which is an eco-friendly transport option?",
    a: ["Walking", "Private car", "Taxi", "Large truck"],
    correct: "Walking"
  },
  {
    q: "What is a good way to reduce plastic waste?",
    a: ["Reuse items", "Use more plastic", "Burn plastic", "Throw it anywhere"],
    correct: "Reuse items"
  },
  {
    q: "Which resource should we conserve?",
    a: ["Water", "Smoke", "Waste", "Plastic"],
    correct: "Water"
  }
];

function users() {
  return JSON.parse(localStorage.getItem("ecoUsers")) || [];
}

function saveUsers(list) {
  localStorage.setItem("ecoUsers", JSON.stringify(list));
}

function current() {
  const name = localStorage.getItem("ecoCurrent");
  return users().find(u => u.name === name);
}

function saveUser(user) {
  const list = users();
  const i = list.findIndex(u => u.id === user.id);
  if (i >= 0) list[i] = user;
  saveUsers(list);
  localStorage.setItem("ecoCurrent", user.name);
}

function createProfile() {
  const name = document.getElementById("nameInput").value.trim();
  const cls = document.getElementById("classInput").value.trim();
  const house = document.getElementById("houseInput").value;
  const g1 = document.getElementById("goal1Input").value.trim();
  const g2 = document.getElementById("goal2Input").value.trim();

  if (!name || !cls || !house || !g1 || !g2) {
    alert("Please fill in all the details.");
    return;
  }

  if (users().some(u => u.name.toLowerCase() === name.toLowerCase())) {
    alert("This name is already registered. Please log in.");
    return;
  }

  const user = {
    id: Date.now(),
    name,
    className: cls,
    house,
    goals: [g1, g2],
    points: 0,
    streak: 0,
    completed: [],
    quizDate: "",
    quiz: [],
    quizDone: false,
    quizXP: 0
  };

  const list = users();
  list.push(user);
  saveUsers(list);
  localStorage.setItem("ecoCurrent", name);

  document.getElementById("setup").classList.add("hidden");
  updateAll();
}

function showLogin() {
  document.getElementById("setup").classList.add("hidden");
  document.getElementById("loginBox").classList.remove("hidden");
  renderProfiles();
}

function showSetup() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("setup").classList.remove("hidden");
}

function renderProfiles() {
  const box = document.getElementById("savedProfiles");
  const list = users();

  if (!list.length) {
    box.innerHTML = "<p>No profiles registered yet.</p>";
    return;
  }

  box.innerHTML = list.map(u => `
    <div class="savedUser">
      <span>🌱 <b>${u.name}</b><br>
      <small>${u.className} • ${u.house}</small></span>
      <button onclick="login('${u.name.replace(/'/g, "\\'")}')">
        Continue
      </button>
    </div>
  `).join("");
}

function login(name) {
  localStorage.setItem("ecoCurrent", name);
  document.getElementById("loginBox").classList.add("hidden");
  updateAll();
}

function updateDashboard(u) {
  const level = Math.floor(u.points / 100) + 1;
  const progress = u.points % 100;

  document.getElementById("points").textContent = u.points;
  document.getElementById("level").textContent = level;
  document.getElementById("streak").textContent = u.streak;
  document.getElementById("done").textContent = u.completed.length;
  document.getElementById("xpText").textContent = progress + " / 100 XP";
  document.getElementById("xpBar").style.width = progress + "%";
}

function renderChallenges(u) {
  const box = document.getElementById("challengeList");

  box.innerHTML = challenges.map((c, i) => {
    const done = u.completed.includes(i);

    return `
      <div class="challenge">
        <div class="challengeIcon">${c[0]}</div>
        <h3>${c[1]}</h3>
        <p>${c[2]}</p>
        <b>+${c[3]} XP</b><br><br>

        <button class="complete ${done ? "doneBtn" : ""}"
          onclick="completeChallenge(${i})"
          ${done ? "disabled" : ""}>
          ${done ? "✓ Completed" : "Complete Challenge"}
        </button>
      </div>
    `;
  }).join("");
}

function completeChallenge(i) {
  const u = current();
  if (!u || u.completed.includes(i)) return;

  u.completed.push(i);
  u.points += challenges[i][3];
  u.streak++;

  saveUser(u);
  updateAll();
}

function calculateImpact() {
  const students = Number(document.getElementById("students").value) || 1;
  const days = Number(document.getElementById("days").value) || 1;

  document.getElementById("impactResult").innerHTML = `
    🌱 In ${days} days, ${students} students could collectively:
    <br><br>
    💧 Save about <b>${students * days * 2} litres</b> of water
    <br>
    🥤 Avoid <b>${students * days}</b> single-use plastic items
    <br>
    💡 Complete <b>${students * days}</b> energy-saving actions
  `;
}

function renderProfile(u) {
  document.getElementById("profileName").textContent = u.name;

  document.getElementById("profileDetails").textContent =
    `Class ${u.className} • ${u.house} House`;

  document.getElementById("profileGoals").innerHTML =
    u.goals.map(g => `<span class="goal">${g}</span>`).join("");
}

function renderLeague() {
  const box = document.getElementById("leaderboard");
  const me = current();

  const list = users().sort((a, b) => b.points - a.points);

  box.innerHTML = list.map((u, i) => {
    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" :
      i === 2 ? "🥉" : "🌱";

    const you = me && u.id === me.id;

    return `
      <div class="player ${you ? "you" : ""}">
        <span class="medal">${medal} #${i + 1}</span>
        <span>
          ${u.name}<br>
          <small>Level ${Math.floor(u.points / 100) + 1}
          ${you ? " • YOU" : ""}</small>
        </span>
        <b>${u.points} XP</b>
      </div>
    `;
  }).join("");
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function getQuiz(u) {
  if (u.quizDate !== today()) {
    const picked = [...questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    u.quiz = picked.map(q => ({
      q: q.q,
      options: [...q.a].sort(() => Math.random() - 0.5),
      correct: q.correct
    }));

    u.quizDate = today();
    u.quizDone = false;
    u.quizXP = 0;
    saveUser(u);
  }

  return u.quiz;
}

function renderQuiz(u) {
  const box = document.getElementById("quizBox");
  const quiz = getQuiz(u);

  if (u.quizDone) {
    box.innerHTML = `
      <div class="quizDone">
        <h3>🎉 Daily Quiz Complete!</h3>
        <p>You earned ${u.quizXP} XP today.</p>
        <br>
        <b>Come back tomorrow for 3 new questions!</b>
      </div>
    `;
    return;
  }

  box.innerHTML = quiz.map((q, i) => `
    <div class="quizCard">
      <h3>${i + 1}. ${q.q}</h3>

      ${q.options.map(o => `
        <button class="option"
          onclick="answerQuiz(${i}, '${o.replace(/'/g, "\\'")}')">
          ${o}
        </button>
      `).join("")}

      <p id="quizMsg${i}"></p>
    </div>
  `).join("");
}

function answerQuiz(i, selected) {
  const u = current();
  const q = u.quiz[i];
  const card = document.querySelectorAll(".quizCard")[i];
  const msg = document.getElementById("quizMsg" + i);

  if (msg.dataset.done) return;
  msg.dataset.done = "yes";

  card.querySelectorAll(".option").forEach(btn => {
    btn.disabled = true;

    if (btn.textContent.trim() === q.correct)
      btn.classList.add("correct");

    if (btn.textContent.trim() === selected &&
        selected !== q.correct)
      btn.classList.add("wrong");
  });

  if (selected === q.correct) {
    msg.textContent = "✅ Correct! +5 XP";
    msg.style.color = "green";
    u.points += 5;
    u.quizXP += 5;
  } else {
    msg.textContent = "❌ Correct answer: " + q.correct;
    msg.style.color = "crimson";
  }

  const answered = document.querySelectorAll(
    '[id^="quizMsg"][data-done]'
  ).length;

  if (answered === 3) {
    u.quizDone = true;
    saveUser(u);
    setTimeout(updateAll, 800);
  } else {
    saveUser(u);
    updateDashboard(u);
    renderLeague();
  }
}

function editProfile() {
  const u = current();

  document.getElementById("nameInput").value = u.name;
  document.getElementById("classInput").value = u.className;
  document.getElementById("houseInput").value = u.house;
  document.getElementById("goal1Input").value = u.goals[0];
  document.getElementById("goal2Input").value = u.goals[1];

  document.getElementById("setupTitle").textContent =
    "✏️ Edit Your Profile";

  document.getElementById("setupText").textContent =
    "Update your EcoTrack profile.";

  document.getElementById("saveButton").textContent =
    "Save Changes";

  document.getElementById("saveButton").onclick = saveProfile;

  document.getElementById("setup").classList.remove("hidden");
}

function saveProfile() {
  const u = current();

  u.name = document.getElementById("nameInput").value.trim();
  u.className = document.getElementById("classInput").value.trim();
  u.house = document.getElementById("houseInput").value;
  u.goals = [
    document.getElementById("goal1Input").value.trim(),
    document.getElementById("goal2Input").value.trim()
  ];

  if (!u.name || !u.className || !u.house ||
      !u.goals[0] || !u.goals[1]) {
    alert("Please fill in all the details.");
    return;
  }

  const list = users();
  const i = list.findIndex(x => x.id === u.id);

  list[i] = u;
  saveUsers(list);
  localStorage.setItem("ecoCurrent", u.name);

  document.getElementById("setup").classList.add("hidden");
  updateAll();
}

function logout() {
  localStorage.removeItem("ecoCurrent");
  location.reload();
}

function updateAll() {
  const u = current();

  if (!u) {
    document.getElementById("setup").classList.remove("hidden");
    return;
  }

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("loginBox").classList.add("hidden");

  updateDashboard(u);
  renderChallenges(u);
  renderProfile(u);
  renderLeague();
  renderQuiz(u);
}

if (current()) {
  updateAll();
} else {
  document.getElementById("setup").classList.remove("hidden");
}