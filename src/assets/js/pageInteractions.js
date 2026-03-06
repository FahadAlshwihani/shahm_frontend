export function initPageInteractions() {
  document.querySelectorAll(".faq-question").forEach((q) => {
    q.onclick = () => {
      const item = q.closest(".faq-item");
      if (!item) return;

      const open = item.classList.contains("active");

      document
        .querySelectorAll(".faq-item.active")
        .forEach((i) => i.classList.remove("active"));

      if (!open) item.classList.add("active");
    };
  });
}
