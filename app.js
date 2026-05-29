const toast = document.querySelector(".toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Local files and privacy settings can block direct clipboard writes.
    }
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.left = "-9999px";
  helper.style.top = "0";
  document.body.appendChild(helper);
  helper.select();

  try {
    return document.execCommand("copy");
  } finally {
    helper.remove();
  }
}

function selectPromptText(container) {
  const promptText = container?.querySelector("p");
  if (!promptText) return;

  const range = document.createRange();
  range.selectNodeContents(promptText);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const container = button.closest(".prompt-strip");
    const prompt = container?.querySelector("p")?.textContent.trim().replace(/\s+/g, " ");

    if (!prompt) return;

    if (await copyText(prompt)) {
      showToast("Prompt copied.");
    } else {
      selectPromptText(container);
      showToast("Prompt selected. Press Command+C or Ctrl+C.");
    }
  });
});
