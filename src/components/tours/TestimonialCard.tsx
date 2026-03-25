import Image from "next/image";

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  avatarUrl?: string;
}

/**
 * Highlights words wrapped in *asterisks* in the quote text
 * with Kelly Green bold styling.
 */
function renderQuote(quote: string) {
  const parts = quote.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <span key={i} className="text-[#4cbb17] font-bold not-italic">
          {part.slice(1, -1)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function TestimonialCard({
  quote,
  name,
  title,
  avatarUrl,
}: TestimonialCardProps) {
  return (
    <div className="bg-[#1c1b1b] text-white rounded-3xl px-8 py-12 md:px-16 md:py-20">
      <blockquote className="text-3xl md:text-5xl font-light italic leading-tight mb-10">
        &ldquo;{renderQuote(quote)}&rdquo;
      </blockquote>

      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
            <Image
              src={avatarUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <span className="text-white/60 font-heading font-bold text-lg">
              {name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <p className="font-bold uppercase tracking-wider text-sm">{name}</p>
          <p className="text-white/40 text-sm">{title}</p>
        </div>
      </div>
    </div>
  );
}
