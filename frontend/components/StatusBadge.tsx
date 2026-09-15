import { Status } from "@/lib/types";

const STYLES: Record<Status, { wrap: string; dot: string }> = {
  Pending: {
    wrap: "border-amber/30 bg-amber/10 text-amber",
    dot: "bg-amber",
  },
  "In Progress": {
    wrap: "border-sky/30 bg-sky/10 text-sky",
    dot: "bg-sky",
  },
  Completed: {
    wrap: "border-mint/30 bg-mint/10 text-mint",
    dot: "bg-mint",
  },
};

export default function StatusBadge({ status }: { status: Status }) {
  const style = STYLES[status] ?? STYLES.Pending;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${style.wrap}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
