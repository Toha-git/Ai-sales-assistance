const messagesEl = document.querySelector("#messages");
const form = document.querySelector("#chatForm");
const input = document.querySelector("#messageInput");
const modeBadge = document.querySelector("#modeBadge");

const messages = [];

addMessage(
  "assistant",
  "Hi there! 👋✨ Welcome to OmniFind.\n\nThe Kids Plush Backpack price is ৳699.\n\nWhich backpack color/picture and quantity would you like?"
);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  addMessage("user", text);
  setBusy(true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, messages })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed");

    modeBadge.textContent = data.mode === "openai" ? "OpenAI" : "Fallback";
    addMessage("assistant", data.reply);
  } catch (error) {
    addMessage("assistant", "Sorry, I had trouble replying just now. Please try again.");
  } finally {
    setBusy(false);
    input.focus();
  }
});

function addMessage(role, content) {
  messages.push({ role, content });

  const message = document.createElement("div");
  message.className = `message ${role}`;
  message.textContent = content;
  messagesEl.append(message);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function setBusy(isBusy) {
  form.querySelector("button").disabled = isBusy;
  input.disabled = isBusy;
}
