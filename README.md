<div align="center">

# 🧠 MindBridge

### Your home to happiness.

A privacy-first, tiered mental health support platform built for college students — combining self-help tools, anonymous peer support, and AI-assisted care escalation in one place.

<img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,nodejs,mongodb,vercel,git,github" alt="Tech Stack" />

</div>

---

## 💭 The Problem

College is stressful — exams, deadlines, homesickness, and pressure to perform pile up fast. Most students never reach out for help, not because support doesn't exist, but because the first step (booking a counsellor, admitting something's wrong) feels too big.

**MindBridge** closes that gap with a graduated support model: start with private self-help tools, move to anonymous peer conversations if you need more, and get connected to a real counsellor automatically if things get serious — all without ever forcing a student to expose their identity before they're ready.

## 🩺 How It Works — The 3-Tier Model

```
   TIER 1                    TIER 2                     TIER 3
 Self-Help          →      Peer Support         →      Counsellor
 (private, instant)       (anonymous, real-time)      (consent-gated)

 • Mood tracking            • Matched peer chat         • Auto-escalation on
 • PHQ-9 / GAD-7 / PSS-10     rooms (24h auto-delete)     crisis detection
   assessments              • Certified peer               or high-severity
 • MindBot AI companion       supporters                   assessment scores
 • CBT thought reframing    • Escalation button if       • Alerts routed to
 • Vent Box & roleplay        a chat gets too heavy         the student's college
   simulator
```

Every assessment is scored and silently tagged with a support tier (1–3), so the right level of help finds the student — instead of the student having to go find it.

## ✨ Features

| Category | What it does |
|---|---|
| 🌤️ **Mood Tracker** | Daily 1–5 mood logging with emoji, tags (exam stress, sleep, family...), and journal notes; trends visualized with Recharts |
| 📋 **Clinical Assessments** | Standardized PHQ-9 (depression), GAD-7 (anxiety), and PSS-10 (stress) screeners with automatic severity + tier scoring |
| 🤖 **MindBot** | An AI companion with persistent memory and conversation summarization — it remembers past check-ins and adjusts tone based on recent assessment history |
| 🧩 **Detangle (CBT Tool)** | Feed it an anxious thought, get back the cognitive distortion it represents and a balanced reframe |
| 📝 **Vent Box** | Dump a chaotic wall of stress; get back the 1–2 things that actually matter right now |
| 🎭 **Conversation Simulator** | Practice a hard conversation (asking for an extension, confronting a friend) against an AI roleplaying the other person, at adjustable difficulty |
| 🫂 **Anonymous Peer Rooms** | Real-time chat via Pusher, matched by pseudonym hash — never by identity. Messages self-destruct after 24 hours |
| 🚨 **Crisis Detection & Escalation** | Passive detection on chat input flags crisis language and silently opens a counsellor alert — no student has to press a button to be safe |
| 🔒 **Consent-Gated Contact** | Even in an emergency alert, a student's identity is only attached if they've explicitly opted in |

## 🛡️ Privacy & Safety, By Design

MindBridge treats anonymity as a first-class feature, not an afterthought:

- **No real identities in peer chat** — students are matched and chat via `studentHash` / `peerHash`, never a name or email.
- **Self-destructing messages** — a MongoDB TTL index wipes peer chat history 24 hours after it's written.
- **Hashed accounts** — emails are stored as `emailHash`, not plaintext, for lookup purposes only.
- **Consent before contact** — an assessment or crisis flag can open a counsellor alert, but the student's identity is only shared if `consentToContact` is explicitly true.
- **Crisis protocol built into the AI layer** — MindBot is instructed to drop its casual tone the moment self-harm intent is detected, surface real hotline numbers, and defer to a human immediately rather than attempt to "handle" it.

## 🧰 Tech Stack

<img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,nodejs,mongodb,vercel,git,github" alt="Tech Stack" />

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | MongoDB via Mongoose |
| Auth | NextAuth.js |
| Realtime | Pusher (peer chat channels) |
| AI / LLM | Local Ollama runtime (OpenAI-compatible SDK), model configurable via `OLLAMA_MODEL` |
| Email | Resend |
| Forms & Validation | React Hook Form + Zod |
| Charts | Recharts |

> Ollama, Pusher, and Resend don't have square icons on skillicons.dev yet — they're called out in the table above instead of forced into the icon row.

## 🚀 Getting Started

**1. Clone and install**
```bash
git clone https://github.com/theanarchist123/MindBridge.git
cd MindBridge
npm install
```

**2. Set up environment variables**

Create a `.env.local` in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_random_secret

# Peer chat (Pusher)
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=

# AI (Ollama, OpenAI-compatible endpoint)
OLLAMA_BASE_URL=
OLLAMA_API_KEY=
OLLAMA_MODEL=llama3.2

# Counsellor onboarding
COUNSELLOR_INVITE_CODE=
```

**3. (Optional) Seed the database**
```bash
npm run seed
```

**4. Run the dev server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Project Structure

```
MindBridge/
├── src/
│   ├── app/
│   │   ├── (dashboard)/      # mood, assessment, mindbot, peer, resources
│   │   ├── (counsellor)/     # counsellor-facing views
│   │   ├── api/              # ai, assessment, auth, counsellor, mindbot, mood, peer, pusher, user
│   │   └── auth/              # sign in / sign up
│   ├── components/
│   ├── lib/                  # auth, mongoose, ollama, pusher, resources helpers
│   ├── models/                # Assessment, ChatMessage, CounsellorAlert, MindBotMemory, MoodLog, PeerRoom, User
│   └── hooks/
└── scripts/seed.ts
```

## ⚠️ A Note on Scope

MindBridge is a support and triage layer — it is **not** a replacement for professional mental healthcare, and MindBot is **not** a therapist. If you or someone you know is in crisis, please reach out directly:

- **KIRAN (Govt. of India):** 1800-599-0019 (24/7, toll-free)
- **Vandrevala Foundation:** 9999 666 555 (24/7, multilingual)

## 📜 License

No license file is currently included in this repo. If you intend for others to use, fork, or contribute to MindBridge, consider adding one (MIT is a common, permissive choice for portfolio/open projects).

---

<div align="center">

Built with care, for students who need a lower-friction first step toward feeling better. 💙

</div>