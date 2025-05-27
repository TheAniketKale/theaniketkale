// Pune, Maharashtra: Approximate sunrise 6:00, sunset 18:45 (local time)
function addSkyEffect(type, sunPercent = 0, moonPercent = 0) {
  const sky = document.getElementById('sky-effect');
  if (!sky) return;
  sky.innerHTML = ''; // Clear previous

  if (type === 'day') {
    // Sun moves from left (sunrise) to right (sunset)
    sky.innerHTML += `<div id="sky-sun" class="sky-sun"></div>`;
    sky.innerHTML += `<div class="sky-cloud" style="top:120px;left:30vw;"></div>`;
    sky.innerHTML += `<div class="sky-cloud" style="top:180px;left:60vw;"></div>`;
  } else if (type === 'night') {
    // Moon moves similarly
    sky.innerHTML += `<div id="sky-moon" class="sky-moon"></div>`;
    for (let i = 0; i < 40; i++) {
      const top = Math.random() * 300 + 20;
      const left = Math.random() * 100;
      sky.innerHTML += `<div class="sky-star" style="top:${top}px;left:${left}vw;"></div>`;
    }
  }
}

function setSkyEffectForPune() {
  const now = new Date();
  const sunPercent = getSunMoonPercent(now, true);
  const moonPercent = getSunMoonPercent(now, false);

  if (sunPercent !== null) {
    addSkyEffect('day', sunPercent, 0);
    setTimeout(() => {
      const sun = document.getElementById('sky-sun');
      if (sun) {
        sun.style.left = `${5 + 90 * sunPercent}vw`; // from 5vw to 95vw
        sun.style.top = `${120 - 60 * Math.sin(Math.PI * sunPercent)}px`; // arc
      }
    }, 10);
  } else if (moonPercent !== null) {
    addSkyEffect('night', 0, moonPercent);
    setTimeout(() => {
      const moon = document.getElementById('sky-moon');
      if (moon) {
        moon.style.left = `${5 + 90 * moonPercent}vw`;
        moon.style.top = `${120 - 60 * Math.sin(Math.PI * moonPercent)}px`;
      }
    }, 10);
  } else {
    addSkyEffect('cloudy');
  }
}

function getSunMoonPercent(now, isSun) {
  // Pune: sunrise ~6:00, sunset ~18:45 (IST)
  // Moon: opposite, rises ~18:45, sets ~6:00
  // Returns percent across the sky (0 = left, 1 = right)
  const sunrise = 6 + 0/60;   // 6:00
  const sunset = 18 + 45/60;  // 18:45
  const moonrise = sunset;
  const moonset = sunrise + 24; // next day

  // Convert to IST
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ist = new Date(utc + (5.5 * 60 * 60 * 1000));
  const hour = ist.getHours() + ist.getMinutes()/60;

  if (isSun) {
    if (hour < sunrise || hour > sunset) return null; // not visible
    return (hour - sunrise) / (sunset - sunrise);
  } else {
    let moonHour = hour;
    if (moonHour < sunset) moonHour += 24; // after midnight
    if (moonHour < moonrise || moonHour > moonset) return null; // not visible
    return (moonHour - moonrise) / ((moonset + 24) - moonrise);
  }
}

window.addEventListener('DOMContentLoaded', setSkyEffectForPune);