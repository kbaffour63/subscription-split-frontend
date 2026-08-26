import type { Contributor } from "./types";

const currency = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
});

const AVATAR_COLORS = [
  "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
];

function avatarColor(name: string) {
  const hash = [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function timeAgo(timestamp: number) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ContributorList({
  contributors,
}: {
  contributors: Contributor[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        {contributors.length} contribution{contributors.length === 1 ? "" : "s"}
      </h2>
      <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
        {contributors.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${avatarColor(c.name)}`}
              >
                {c.name.trim().charAt(0).toUpperCase() || "?"}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  {c.name}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {timeAgo(c.timestamp)}
                </span>
              </div>
            </div>
            <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              {currency.format(c.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
