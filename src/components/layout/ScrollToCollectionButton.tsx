"use client";

type Props = {
  label: string;
  className?: string;
};

export default function ScrollToCollectionButton({ label, className }: Props) {
  return (
    <button
      type="button"
      onClick={() => {
        document.getElementById("collection")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }}
      className={className}
    >
      <span className="relative z-10">{label}</span>
    </button>
  );
}
