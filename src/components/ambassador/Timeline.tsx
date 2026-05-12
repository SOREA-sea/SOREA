import TimelineStep from "./TimelineStep";

export default function Timeline() {
  return (
    <section className="ambassador-timeline">
      <h2>
        Je deviens ambassadrice pour...
      </h2>

      <div className="ambassador-timeline-steps">
        <TimelineStep label="Rayonne" icon="flower" />
        <TimelineStep label="Partage" icon="arrow" />
        <TimelineStep label="Inspire" icon="community" />
        <TimelineStep label="Brille" icon="crown" />
      </div>
    </section>
  );
}