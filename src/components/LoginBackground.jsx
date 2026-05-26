const BUBBLES = [
  { size: 48, top: "12%", left: "8%", delay: "0s", sparkle: true },
  { size: 32, top: "28%", left: "82%", delay: "1.2s", sparkle: false },
  { size: 64, top: "68%", left: "6%", delay: "2.4s", sparkle: true },
  { size: 24, top: "78%", left: "88%", delay: "0.8s", sparkle: false },
  { size: 40, top: "45%", left: "92%", delay: "3s", sparkle: true },
  { size: 56, top: "8%", left: "72%", delay: "1.8s", sparkle: false },
  { size: 20, top: "55%", left: "4%", delay: "2.8s", sparkle: true },
];

export default function LoginBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className={`bubble ${b.sparkle ? "sparkle" : ""}`}
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            animationDelay: b.delay,
          }}
        />
      ))}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(31,162,225,0.12), transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,136,0,0.1), transparent 45%)",
        }}
      />
    </div>
  );
}
