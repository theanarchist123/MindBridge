export type ResourceCategory = "right-now" | "tonight" | "this-week";
export type ResourceType = "interactive" | "guide" | "external" | "exercise";

export interface Resource {
  id: string;
  title: string;
  emoji: string;          // Tool icon emoji
  category: ResourceCategory;
  tags: string[];
  type: ResourceType;
  shortDesc: string;
  description: string;
  duration: string;
  steps?: { title: string; body: string }[];  // Interactive guide steps
  link?: string;
  externalLabel?: string;
}

export const RESOURCES: Resource[] = [
  // ── Right Now (panic / acute anxiety) ──────────────────────────
  {
    id: "breathing-478",
    title: "4-7-8 Breathing",
    emoji: "🫁",
    category: "right-now",
    tags: ["panic", "exam-stress", "anxiety"],
    type: "interactive",
    shortDesc: "Activate your parasympathetic nervous system in 2 minutes.",
    description:
      "The 4-7-8 technique was developed by Dr Andrew Weil and is one of the most evidence-backed breathing exercises for acute anxiety. It slows your heart rate and calms the nervous system within a few cycles.",
    duration: "2–5 mins",
    steps: [
      { title: "Find a position", body: "Sit upright or lie down. Place one hand on your chest and one on your belly." },
      { title: "Exhale completely", body: "Breathe out through your mouth with a whoosh sound until your lungs are empty." },
      { title: "Inhale for 4 counts", body: "Close your mouth. Breathe in quietly through your nose while counting to 4." },
      { title: "Hold for 7 counts", body: "Hold your breath and count to 7. Don't force it — just let the air sit." },
      { title: "Exhale for 8 counts", body: "Breathe out through your mouth with a whoosh sound for a count of 8." },
      { title: "Repeat 3–4 cycles", body: "That's one cycle. Aim for 3–4 cycles. You can do this anywhere, anytime." },
    ],
  },
  {
    id: "grounding-54321",
    title: "5-4-3-2-1 Grounding",
    emoji: "🌱",
    category: "right-now",
    tags: ["panic", "dissociation", "overwhelm"],
    type: "interactive",
    shortDesc: "Anchor yourself to the present moment using your senses.",
    description:
      "When anxiety pulls you out of the present, this technique uses all five senses to bring you back. It's especially effective for panic attacks, dissociation, and feeling overwhelmed.",
    duration: "3–5 mins",
    steps: [
      { title: "5 — See", body: "Look around and name 5 things you can see. The more specific the better: 'a blue water bottle', not just 'a bottle'." },
      { title: "4 — Touch", body: "Notice 4 things you can physically feel. The chair under you, your feet on the floor, air on your skin." },
      { title: "3 — Hear", body: "Listen for 3 sounds around you. A fan humming, distant traffic, your own breathing." },
      { title: "2 — Smell", body: "Name 2 things you can smell. If you can't smell anything, recall a favourite scent." },
      { title: "1 — Taste", body: "Notice 1 thing you can taste. Take a sip of water if needed." },
      { title: "Check in", body: "How do you feel now versus when you started? Even a small shift means it's working." },
    ],
  },
  {
    id: "cold-water",
    title: "Cold Water Face Dip",
    emoji: "💧",
    category: "right-now",
    tags: ["panic", "crisis", "anger"],
    type: "guide",
    shortDesc: "Activate your dive reflex to calm a panic attack in 30 seconds.",
    description:
      "Submerging your face in cold water triggers the mammalian dive reflex — your heart rate slows dramatically within seconds. It's a DBT (Dialectical Behaviour Therapy) technique for emotional crises.",
    duration: "30 seconds",
    steps: [
      { title: "Fill a bowl or sink", body: "Fill a bowl with cold water. Add ice if available. The colder the better." },
      { title: "Hold your breath", body: "Take a deep breath in." },
      { title: "Submerge your face", body: "Dip your face in the water for 30 seconds. Focus on feeling the cold." },
      { title: "Check your heart rate", body: "Your heart rate should have slowed. Take a moment to notice how you feel." },
    ],
  },

  // ── Tonight (sleep / winding down) ──────────────────────────────
  {
    id: "sleep-hygiene",
    title: "Sleep Hygiene for Students",
    emoji: "🌙",
    category: "tonight",
    tags: ["sleep-issues", "academic", "hostel"],
    type: "guide",
    shortDesc: "Evidence-based sleep for hostel and PG life.",
    description:
      "Sleep deprivation is one of the biggest hidden contributors to poor mental health in college students. This guide covers the specific challenges of Indian hostel life.",
    duration: "10 min read",
    steps: [
      { title: "The 10-3-2-1 rule", body: "No caffeine 10 hrs before bed. No big meals 3 hrs before. No work 2 hrs before. No screens 1 hr before." },
      { title: "Deal with noisy roommates", body: "Invest in foam earplugs (₹50 from pharmacy). White noise apps like Noisli can mask irregular sounds better than silence." },
      { title: "Phone addiction fix", body: "Turn your phone face-down and plug it in across the room. 'Out of reach, out of mind' is more effective than willpower." },
      { title: "Keep a consistent wake time", body: "Even on weekends. Your body clock (circadian rhythm) is more sensitive to wake time than sleep time." },
      { title: "5-minute wind-down ritual", body: "Do the same 3 things in the same order every night for 2 weeks. Your brain will start associating them with sleep." },
    ],
  },
  {
    id: "progressive-relaxation",
    title: "Progressive Muscle Relaxation",
    emoji: "💆",
    category: "tonight",
    tags: ["sleep-issues", "anxiety", "tension"],
    type: "interactive",
    shortDesc: "Systematically release physical tension before sleep.",
    description:
      "PMR involves tensing and releasing each muscle group in sequence. It reduces physical tension that prevents sleep and trains your body to recognise the difference between tension and relaxation.",
    duration: "10–15 mins",
    steps: [
      { title: "Lie down comfortably", body: "Dim the lights. Lie on your back with your arms at your sides." },
      { title: "Feet & calves", body: "Curl your toes tightly for 5 seconds, then release. Point your feet and hold for 5 seconds, then release." },
      { title: "Thighs & glutes", body: "Squeeze your thigh muscles for 5 seconds, then release. Tighten your glutes for 5 seconds, then release." },
      { title: "Abdomen & chest", body: "Pull your stomach in tight for 5 seconds. Take a deep breath and hold your chest tense for 5 seconds, then release." },
      { title: "Hands & arms", body: "Make tight fists for 5 seconds, release. Flex your biceps for 5 seconds, release." },
      { title: "Shoulders & face", body: "Shrug your shoulders to your ears for 5 seconds, release. Scrunch your face as tight as possible for 5 seconds, release." },
      { title: "Scan your body", body: "Notice the warmth and heaviness in your body. Let your breathing slow naturally." },
    ],
  },

  // ── This Week (ongoing wellbeing / academic stress) ─────────────
  {
    id: "journaling-prompts",
    title: "Daily Journaling Prompts",
    emoji: "📓",
    category: "this-week",
    tags: ["low-mood", "academic", "self-reflection"],
    type: "interactive",
    shortDesc: "7 prompts to process emotions and gain clarity.",
    description:
      "Regular journaling has been shown to reduce anxiety, improve mood, and boost self-awareness. You don't need to be a good writer — the act of externalising thoughts onto paper does the work.",
    duration: "10–15 mins/day",
    steps: [
      { title: "Monday — Brain dump", body: "Write everything that's on your mind without filtering. Fill half a page. Don't re-read it." },
      { title: "Tuesday — Gratitude", body: "Write 3 specific things you're grateful for. Specific beats generic: 'the sunlight on my desk' beats 'nature'." },
      { title: "Wednesday — What's draining me?", body: "List 3 things that are currently draining your energy. Just naming them reduces their power." },
      { title: "Thursday — Future self", body: "Write a letter from your future self (5 years from now) to current you. What do they want you to know?" },
      { title: "Friday — What went well?", body: "List 3 things that went well this week, big or small. Train your brain to notice wins." },
      { title: "Saturday — One thing I'd change", body: "If you could redo one thing from this week, what would it be? What would you do differently?" },
      { title: "Sunday — Intention", body: "Set one small, specific intention for next week. 'Be happier' doesn't work. 'Call my friend on Tuesday' does." },
    ],
  },
  {
    id: "parental-pressure",
    title: "Navigating Parental Pressure",
    emoji: "👨‍👩‍👦",
    category: "this-week",
    tags: ["family", "academic", "relationships"],
    type: "guide",
    shortDesc: "Handle academic expectations in Indian families.",
    description:
      "Parental pressure is one of the most common stressors for Indian college students — and one of the least discussed. This guide helps you understand the dynamic and communicate without destroying the relationship.",
    duration: "8 min read",
    steps: [
      { title: "Understand where it comes from", body: "Most Indian parents express love through worry about your future. Pressure is often fear in disguise, not a lack of faith in you." },
      { title: "Don't argue in a moment of conflict", body: "Emotions run high after an exam result. Wait 24 hours before having the real conversation." },
      { title: "Use 'I feel' instead of 'You always'", body: "'I feel stressed when exams are the only thing we talk about' lands very differently than 'You always make me feel like a failure'." },
      { title: "Give them a win", body: "Share one small success each week — even a minor one. It reduces their anxiety about the big picture." },
      { title: "Set one boundary at a time", body: "Don't try to reset the entire dynamic at once. Change one small thing and let it stabilise for a few weeks." },
    ],
  },
  {
    id: "icall",
    title: "iCall — Free Counselling",
    emoji: "📞",
    category: "this-week",
    tags: ["all", "professional", "free"],
    type: "external",
    shortDesc: "Free professional counselling. Mon–Sat, 8am–10pm.",
    description:
      "iCall is a psychosocial helpline managed by the Tata Institute of Social Sciences (TISS). It provides free, professional counselling over phone and chat by trained clinical psychologists and social workers.",
    duration: "Call anytime",
    link: "tel:9152987821",
    externalLabel: "Call 9152987821",
  },
];

export function getResourceById(id: string): Resource | undefined {
  return RESOURCES.find((r) => r.id === id);
}

export const FILTER_LABELS: Record<ResourceCategory, { label: string; emoji: string; desc: string }> = {
  "right-now": { label: "Right Now", emoji: "⚡", desc: "For panic, anxiety, overwhelm — use immediately" },
  "tonight":   { label: "Tonight",   emoji: "🌙", desc: "Wind down and prepare for better sleep" },
  "this-week": { label: "This Week", emoji: "🌱", desc: "Build habits and resilience over time" },
};
