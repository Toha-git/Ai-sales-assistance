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
    modeBadge.textContent = "Static";
    addMessage("assistant", generateStaticReply(messages, text));
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

function generateStaticReply(history, customerMessage) {
  const text = customerMessage.toLowerCase();
  const transcript = history
    .map((message) => String(message.content || "").toLowerCase())
    .join("\n");
  const lastAssistant = [...history]
    .reverse()
    .find((message) => message.role === "assistant")?.content
    ?.toLowerCase() || "";

  if (/(refund|return|angry|complain|bad service|custom|wholesale|bulk)/i.test(text)) {
    return "I want to make sure we get this perfectly right for you. Let me get a human teammate to jump in and take over. Hold on just a moment!";
  }

  if (/(shoe|dress|toy|bottle|lunch|bagpack|other|different)/i.test(text) && !/(backpack|bag)/i.test(text)) {
    return "We don't currently offer that, but I'd love to help you find an alternative from our current collection!";
  }

  if (/(price|koto|কত|tk|৳|cost)/i.test(text)) {
    return "The Kids Plush Backpack is ৳699 ✨\n\nDelivery is 80 tk inside Dhaka and 130 tk outside Dhaka.";
  }

  if (lastAssistant.includes("color/picture")) {
    return "Wonderful choice! ✨\n\nPlease send your full name to start the order.";
  }

  if (/(buy|order|নিতে|confirm|cod|cash)/i.test(text) && !transcript.includes("color/picture")) {
    return "Sure! Which backpack color/picture and quantity would you like?";
  }

  if (lastAssistant.includes("full name") || looksLikeName(customerMessage)) {
    return "Thank you! Please send your full shipping address.";
  }

  if (lastAssistant.includes("shipping address")) {
    return "Got it 👍\n\nPlease send your phone number.";
  }

  if (lastAssistant.includes("phone number") && !/(01[3-9]\d{8})/.test(customerMessage.replace(/\s|-/g, ""))) {
    return "Please send a valid phone number so we can confirm delivery.";
  }

  if (/(01[3-9]\d{8})/.test(customerMessage.replace(/\s|-/g, ""))) {
    return "Order summary 🛍️\n\nBackpack: ৳699\nShipping:\nInside Dhaka: 80 tk\nOutside Dhaka: 130 tk\n\nPlease confirm if everything looks correct. It is cash on delivery: please send the shipping fee to bKash 01741848662 to confirm, then pay the rest after receiving the product.";
  }

  if (/(delivery|shipping|charge|dhaka|outside|time|দিন|কবে)/i.test(text)) {
    return "Delivery takes 3-5 business days 🛍️\n\nShipping is 80 tk inside Dhaka and 130 tk outside Dhaka.";
  }

  return "Hi there! 👋✨ Welcome to OmniFind.\n\nThe Kids Plush Backpack price is ৳699.\n\nWhich backpack color/picture and quantity would you like?";
}

function looksLikeName(value) {
  const trimmed = value.trim();
  return /^[a-zA-Z .'-]{2,50}$/.test(trimmed) && trimmed.split(/\s+/).length <= 4;
}
