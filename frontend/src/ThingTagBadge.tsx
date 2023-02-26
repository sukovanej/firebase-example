interface ThingTagBadgerops {
  name: string;
  color: string;
}

export default function ThingTagBadge({ name, color }: ThingTagBadgerops) {
  return (
    <div className="thing-tag" style={{ backgroundColor: color }}>
      {name}
    </div>
  );
}
