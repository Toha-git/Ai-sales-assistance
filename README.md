# OmniFind AI Sales Agent

A small web chat app for Jarvis, OmniFind's AI sales assistant for the Kids Plush Backpack.

## Run locally

```bash
npm start
```

Open `http://localhost:3000`.

## Add OpenAI

Put your API key in `.env.local`:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5-mini
PORT=3000
```

Without a key, the app still runs with a local fallback reply engine.

## GitHub Pages

GitHub Pages can serve the static demo from `index.html`, but it cannot run the Node server or keep an OpenAI API key secret. For real AI replies, deploy the Node app to a server platform and use `.env.local` or platform environment variables.

## What Jarvis knows

- Product: Kids Plush Backpack - Ultra-Soft Toddler School Bag
- Price: ৳699
- Shipping: 80 tk inside Dhaka, 130 tk outside Dhaka
- Delivery: 3-5 business days
- Ordering: full name, address, phone, product/color/quantity, then cash-on-delivery confirmation
