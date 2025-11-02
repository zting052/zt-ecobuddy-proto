// Minimal hash-based router + tiny state store for the prototype

const app = document.getElementById('app');

const state = {
  level: 2,
  biome: 'Bushes',
  progress: 0.35, // 0..1
  xp: 0,
  lightsOn: 3,
  devices: {
    theatreLights: true,
    oven: true,
    thermostat: { from: 30, to: 26 }
  },
  leaderboard: [
    { name: 'You', delta: +50 },
    { name: 'Dad', delta: +10 },
    { name: 'Josh', delta: -150 }
  ]
};

const routes = {
  '/home': renderHome,
  '/actions': renderActions,
  '/leaderboard': renderLeaderboard
};

function setActiveNav(path){
  document.querySelectorAll('.nav-btn').forEach(btn=>{
    btn.classList.toggle('active', btn.dataset.route === path);
  });
}

// Navigation events
document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const path = btn.dataset.route;
    if (location.hash !== '#'+path) location.hash = path;
    else route(); // re-render if same
  });
});

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', ()=>{
  if (!location.hash) location.hash = '/home';
  route();
});

function route(){
  const path = location.hash.replace('#','') || '/home';
  const renderer = routes[path] || renderHome;
  setActiveNav(path);
  renderer();
}

function setProgress(el, value){
  const clamped = Math.max(0, Math.min(1, value));
  const bar = el.querySelector('.progress > span');
  if (bar) bar.style.width = `${Math.round(clamped*100)}%`;
}

/* ---------- Page 1: Prompt / XP (Row 1) ---------- */
function renderHome(){
  app.innerHTML = `
    <section class="screen">
      <button class="settings" type="button" aria-label="Settings" title="Settings">
        ${hexIcon()}
      </button>

      <div class="leaf" aria-hidden="true">🍃</div>

      <div style="margin:60px 8px 12px;">
        <div class="prompt">
          <h3>${state.lightsOn} LIGHTS are on in the house, would you like me to TURN THEM OFF?</h3>
          <div class="actions">
            <button class="btn yes" id="yesBtn">YES</button>
            <button class="btn no" id="noBtn">NO</button>
            <span class="xp" id="xpGained" aria-live="polite"></span>
          </div>
        </div>
      </div>

      <div class="level-row">
        <span>Level ${state.level}</span>
        <span class="level-sub">${state.biome}</span>
        <div class="progress"><span style="width:0%"></span></div>
      </div>

      <div class="hills" aria-hidden="true">
        <div class="hill left"></div>
        <div class="hill right"></div>
      </div>
    </section>
  `;

  setProgress(app, state.progress);

  const yes = document.getElementById('yesBtn');
  const no = document.getElementById('noBtn');
  const xpEl = document.getElementById('xpGained');

  yes.addEventListener('click', ()=>{
    const reward = 115;
    state.xp += reward;
    state.lightsOn = 0;
    state.devices.theatreLights = false;
    xpEl.textContent = `+${reward} XP`;
    state.progress = Math.min(1, state.progress + 0.08);
    setProgress(app, state.progress);
  });

  no.addEventListener('click', ()=>{
    xpEl.textContent = `No change`;
  });

  // Settings button: no action for now (stub for future settings page)
  // document.querySelector('.settings').addEventListener('click', ()=> {
  //   location.hash = '/settings'; // to be implemented later
  // });
}

/* ---------- Page 2: Actions / Devices (Row 2) ---------- */
function renderActions(){
  app.innerHTML = `
    <section class="screen">
      <button class="settings" type="button" aria-label="Settings" title="Settings">
        ${hexIcon()}
      </button>

      <div class="level-row">
        <span>Level ${state.level}</span>
        <span class="level-sub">${state.biome}</span>
        <div class="progress"><span style="width:0%"></span></div>
      </div>

      <div class="card" role="region" aria-label="Devices">
        <div class="row">
          <div class="kv">
            <span class="k">Lights:</span>
            <span>Theatre</span>
          </div>
          <div class="toggle">
            <span>${state.devices.theatreLights ? 'ON' : 'OFF'}</span>
            <span class="switch ${state.devices.theatreLights ? 'on':''}" id="theatreSwitch" role="switch" aria-checked="${state.devices.theatreLights}"></span>
          </div>
        </div>
        <div class="row">
          <div class="kv">
            <span class="k">Thermostat:</span>
            <span>Central</span>
          </div>
          <div class="kv" aria-label="Thermostat adjustment">
            <span>${state.devices.thermostat.from}°C</span>
            <span>→</span>
            <span>${state.devices.thermostat.to}°C</span>
          </div>
        </div>
        <div class="row">
          <div class="kv">
            <span class="k">Kitchen:</span>
            <span>Oven</span>
          </div>
          <div class="toggle">
            <span>${state.devices.oven ? 'ON' : 'OFF'}</span>
            <span class="switch ${state.devices.oven ? 'on':''}" id="ovenSwitch" role="switch" aria-checked="${state.devices.oven}"></span>
          </div>
        </div>
      </div>

      <div class="footer-links">
        <button class="link-btn" id="googleHomeBtn">Google Home</button>
        <button class="link-btn" id="myCreatedBtn">My Created</button>
      </div>

      <div class="hills" aria-hidden="true">
        <div class="hill left"></div>
        <div class="hill right"></div>
      </div>
    </section>
  `;

  setProgress(app, state.progress);

  // Wire toggles
  const theatre = document.getElementById('theatreSwitch');
  const oven = document.getElementById('ovenSwitch');

  theatre.addEventListener('click', ()=>{
    state.devices.theatreLights = !state.devices.theatreLights;
    state.lightsOn = state.devices.theatreLights ? 1 : 0;
    renderActions(); // re-render this screen
  });

  oven.addEventListener('click', ()=>{
    state.devices.oven = !state.devices.oven;
    renderActions();
  });

  document.getElementById('googleHomeBtn').addEventListener('click', ()=> alert('Stub: open Google Home'));
  document.getElementById('myCreatedBtn').addEventListener('click', ()=> alert('Stub: open My Created'));

  // Settings button: no action for now (stub for future settings page)
}

/* ---------- Page 3: Leaderboard / Social (Row 3) ---------- */
function renderLeaderboard(){
  app.innerHTML = `
    <section class="screen">
      <button class="settings" type="button" aria-label="Settings" title="Settings">
        ${hexIcon()}
      </button>

      <!-- Level 2 Bushes theme (same as other screens) -->
      <div class="level-row">
        <span>Level ${state.level}</span>
        <span class="level-sub">${state.biome}</span>
        <div class="progress"><span style="width:0%"></span></div>
      </div>

      <div class="card" role="region" aria-label="Weekly Leaderboard">
        <div class="row" style="justify-content:space-between; align-items:center;">
          <strong>Weekly Leaderboard</strong>
          <button class="link-btn" id="addPerson">+</button>
        </div>
        ${state.leaderboard.map(entry => `
          <div class="lb-row">
            <div style="display:flex; align-items:center; gap:10px;">
              <span aria-hidden="true" style="background:#fff; border:2px solid #ccc; width:22px; height:22px; border-radius:6px; display:inline-block;"></span>
              <span>${entry.name}</span>
            </div>
            <div style="font-weight:700; color:${entry.delta>=0? 'var(--accent)':'var(--no)'}">
              ${entry.delta>=0? '+' : ''}${entry.delta} XP
            </div>
          </div>
        `).join('')}
        <div class="row" style="justify-content:center;">
          <button class="link-btn" id="morePeople">More People</button>
        </div>
      </div>

      <div class="hills" aria-hidden="true">
        <div class="hill left"></div>
        <div class="hill right"></div>
      </div>
    </section>
  `;

  setProgress(app, state.progress);

  // Demo interactions
  document.getElementById('addPerson').addEventListener('click', ()=>{
    const name = prompt('Add person name:');
    if (!name) return;
    state.leaderboard.push({ name, delta: 0 });
    renderLeaderboard();
  });
  document.getElementById('morePeople').addEventListener('click', ()=> alert('Stub: show more people'));

  // Settings button: no action for now (stub for future settings page)
}

/* ----- tiny helper ----- */
function hexIcon(){
  return `
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2zm0 2.3L5.34 7.5v9L12 19.7l6.66-3.2v-9L12 4.3z" fill="currentColor"/>
    </svg>
  `;
}
}
