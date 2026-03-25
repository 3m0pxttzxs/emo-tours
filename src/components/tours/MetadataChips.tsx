interface MetadataChipsProps {
  area: string;
  duration: string;
  meetingPoint: string;
  language: string;
  tourType: string;
  availability: string;
}

const items = (props: MetadataChipsProps) => [
  { label: "Area", value: props.area },
  { label: "Duration", value: props.duration },
  { label: "Meeting Point", value: props.meetingPoint },
  { label: "Language", value: props.language },
  { label: "Tour Type", value: props.tourType },
  { label: "Availability", value: props.availability },
];

export default function MetadataChips(props: MetadataChipsProps) {
  const chips = items(props);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-b border-[#ebe7e7]/20">
      {chips.map((chip) => (
        <div key={chip.label}>
          <span className="block text-xs uppercase tracking-widest text-[#78716c] mb-1">
            {chip.label}
          </span>
          <span className="block font-heading font-bold text-lg text-[#1c1b1b]">
            {chip.value}
          </span>
        </div>
      ))}
    </div>
  );
}
