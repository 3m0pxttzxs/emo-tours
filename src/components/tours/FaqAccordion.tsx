import type { FaqItem } from "@/types";

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <details
          key={index}
          className="group bg-white border border-[#ebe7e7]/20 rounded-xl overflow-hidden"
        >
          <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-heading font-bold text-lg text-[#1c1b1b] list-none [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <span className="material-symbols-outlined text-[#78716c] transition-transform duration-300 group-open:rotate-180">
              expand_more
            </span>
          </summary>
          <div className="px-6 pb-5 text-[#78716c] leading-relaxed">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
