const IDLE_LIMIT = 10 * 60 * 1000;

let idleTimer = null;
let listenersAttached = false;

const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

let resetTimer = null;

export function startIdleTimer(onTimeout) {

  resetTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(onTimeout, IDLE_LIMIT);
  };

  if (!listenersAttached) {
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    listenersAttached = true;
  }

  resetTimer();
}

export function stopIdleTimer() {

  clearTimeout(idleTimer);

  if (listenersAttached && resetTimer) {

    events.forEach((event) => {
      window.removeEventListener(event, resetTimer);
    });

    listenersAttached = false;
  }
}