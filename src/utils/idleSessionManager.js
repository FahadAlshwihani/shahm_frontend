const IDLE_LIMIT = 10 * 60 * 1000;

let idleTimer = null;
let listenersAttached = false;
let timerStarted = false;
let activityHandler = null;

const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

function resetTimer(onTimeout) {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(onTimeout, IDLE_LIMIT);
}

export function startIdleTimer(onTimeout) {
  if (timerStarted) return;

  activityHandler = () => resetTimer(onTimeout);

  events.forEach((event) => {
    window.addEventListener(event, activityHandler);
  });

  listenersAttached = true;
  timerStarted = true;

  resetTimer(onTimeout);
}

export function stopIdleTimer() {
  clearTimeout(idleTimer);

  if (listenersAttached && activityHandler) {
    events.forEach((event) => {
      window.removeEventListener(event, activityHandler);
    });
  }

  listenersAttached = false;
  timerStarted = false;
  activityHandler = null;
}