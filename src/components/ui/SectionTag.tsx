import { cn } from "@/lib/utils";

type SectionTagProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
};

/** Small eyebrow label used above section headings. */
export default function SectionTag({ children, className, tone = "light" }: SectionTagProps) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.28em] uppercase",
        tone === "light" ? "text-clay" : "text-gold",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 rounded-full", tone === "light" ? "bg-clay" : "bg-gold")}
      />
      {children}
    </p>
  );
}