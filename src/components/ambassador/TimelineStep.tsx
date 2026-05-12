import Flower from "./icons/Flower";
import Crown from "./icons/Crown";
import Community from "./icons/Community";
import Arrow from "./icons/Arrow";

export default function TimelineStep({
  label,
  icon,
}: {
  label: string;
  icon: "flower" | "crown" | "community" | "arrow";
}) {
  const Icon =
    icon === "flower"
      ? Flower
      : icon === "crown"
      ? Crown
      : icon === "community"
      ? Community
      : Arrow;

  return (
    <div className="timeline-step">
      <div className="timeline-step-circle">
        <div className="timeline-step-inner-circle">
          <Icon />
        </div>
      </div>

      <span className="timeline-step-label">
        {label}
      </span>
    </div>
  );
}