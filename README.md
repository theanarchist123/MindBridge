<div align="center">

<img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f9e0/512.gif" alt="🧠" width="72" height="72">

<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=800&size=50&pause=1000&color=0D9488&center=true&vCenter=true&width=800&height=100&lines=MindBridge;Your+Home+to+Happiness;A+Safe+Space+for+Students;Track.+Chat.+Heal." alt="Typing SVG" /></a>

<img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,nodejs,mongodb,vercel,git,github" alt="Tech Stack" />

<br/>
<br/>

<!-- Terminal Boot Sequence Simulation -->
<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=16&pause=500&color=10B981&background=0F172A&center=false&vCenter=false&multiline=true&width=600&height=140&lines=%3E_+npm+run+dev;%5Binfo%5D+Starting+MindBridge+Environment...;%5Bwait%5D+Initializing+Anonymous+Peer+Tunnels...;%5Bwait%5D+Connecting+to+MindBot+Neural+Net...;%5Bready%5D+MindBridge+is+Live!+Open+http%3A%2F%2Flocalhost%3A3000" alt="Terminal Demo" /></a>

<br/>
<br/>

<img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f308/512.gif" alt="🌈" width="32" height="32"> **Zero forced identification. Total data privacy. Immediate help.** <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/2728/512.gif" alt="✨" width="32" height="32">

</div>

---

## <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1fa7a/512.gif" alt="🩺" width="28" height="28"> The 3-Tier Support Architecture

```mermaid
graph TD
    classDef selfhelp fill:#f1f5f9,stroke:#94a3b8,stroke-width:2px,color:#0f172a;
    classDef peer fill:#ccfbf1,stroke:#14b8a6,stroke-width:2px,color:#0f172a;
    classDef clinical fill:#fee2e2,stroke:#ef4444,stroke-width:2px,color:#0f172a;
    classDef user fill:#2563eb,stroke:#1d4ed8,stroke-width:2px,color:#ffffff,border-radius:10px;

    User((Student)):::user

    subgraph Tier 1 : Self-Help [Private & Instant]
        A1[Mood Tracking & Journal]:::selfhelp
        A2[AI MindBot Companion]:::selfhelp
        A3[CBT Distortion Reframing]:::selfhelp
        A4[Roleplay Simulator]:::selfhelp
    end

    subgraph Tier 2 : Peer Support [Anonymous]
        B1[Real-time Peer Matching]:::peer
        B2[24-hour Auto-Delete Rooms]:::peer
        B3[Certified Student Supporters]:::peer
    end

    subgraph Tier 3 : Clinical Escalation [Consent-Gated]
        C1[PHQ-9 / GAD-7 Assessments]:::clinical
        C2[AI Passive Crisis Detection]:::clinical
        C3[Direct Counselor Alerts]:::clinical
    end

    User -->|Daily Use| Tier1
    User -->|Needs Connection| Tier2
    Tier1 -.->|Flags Risk| Tier3
    Tier2 -.->|Escalates| Tier3
```

---

## <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/2728/512.gif" alt="✨" width="28" height="28"> Core Features

| Feature | Description |
| :--- | :--- |
| 🌤️ **Mood Landscapes** | Daily 1–5 mood logging with emotive tags (exam stress, sleep, family). Visualize emotional trends over time with immersive UI. |
| 🤖 **MindBot AI** | A persistent AI companion that remembers past check-ins, reads your assessment scores, and adjusts its tone dynamically to support you. |
| 🧩 **Detangle (CBT)** | Feed the AI a chaotic or anxious thought. It identifies the cognitive distortion (e.g., Catastrophizing) and helps you reframe it. |
| 🫂 **Anonymous Peer Rooms** | Real-time chat powered by Pusher. Matched by pseudonym hashes. All messages self-destruct after 24 hours to protect privacy. |
| 🚨 **Crisis Detection** | Passive natural language processing flags crisis language in real-time, instantly surfacing hotlines and alerting counselors. |
| 📱 **Native Capacitor App** | Wrapped in Capacitor for a true iOS/Android native feel, complete with system-level **Haptic Feedback** (`@capacitor/haptics`). |

---

## <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f512/512.gif" alt="🔒" width="28" height="28"> Privacy & Safety, By Design

MindBridge treats anonymity as a first-class citizen, not an afterthought:
- 🕵️ **Zero Real Identities**: Students chat via hashed pseudonyms (`studentHash`), never real names.
- 🗑️ **Ephemeral Data**: MongoDB TTL indexes automatically wipe peer chat histories after 24 hours.
- 🛡️ **Consent-Gated Contact**: Emergency alerts notify counselors of the *situation*, but the student's real identity is only unmasked if they have explicitly checked `consentToContact`.
- 🛑 **AI Guardrails**: MindBot instantly drops its conversational persona when self-harm is detected, refusing to "play therapist" and enforcing immediate clinical routing.

---

## <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.gif" alt="🚀" width="28" height="28"> Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/theanarchist123/MindBridge.git
cd MindBridge
npm install
```

### 2. Environment Setup
Create a `.env.local` in the project root:
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret

# Realtime Chat (Pusher)
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=

# AI (Local or Remote OpenAI-Compatible)
OLLAMA_BASE_URL=https://api.ollama.com
OLLAMA_API_KEY=your_key
OLLAMA_MODEL=gemma3:4b

# Admin Config
COUNSELLOR_INVITE_CODE=mindbridge-admin-2026
```

### 3. Run the Development Server
```bash
npm run dev
```

### 4. Build for Native (Capacitor)
```bash
npx cap sync
npx cap open ios      # Opens Xcode
npx cap open android  # Opens Android Studio
```

---

<div align="center">

**⚠️ Important Scope Note** <br/>
*MindBridge is a triage and support layer. It is **not** a replacement for professional clinical care. If you are in crisis, please call 1800-599-0019 (KIRAN, India) or 988 (US).*

Built with <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f499/512.gif" alt="💙" width="20" height="20"> for students who just need a safe space to start.

</div>