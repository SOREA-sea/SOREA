export default function Wheeltestcopy() {
  const segments = 10;
  const cx = 151.5;
  const cy = 151.5;
  const radius = 140;
  const colors = ["#FEF0F9", "#BA98F4"];

  const icons = [
    "/image_wheel/checklist 1.svg",
    "/image_wheel/dna 1.svg",
    "/image_wheel/hearts 1.svg",
    "/image_wheel/hug 1.svg",
    "/image_wheel/light-bulb 1.svg",
    "/image_wheel/lightning 1.svg",
    "/image_wheel/lotus 1.svg",
    "/image_wheel/mirror 1.png",
    "/image_wheel/notebook 1.svg",
    "/image_wheel/sun 1.svg",
  ];

  function getSegmentPath(index: number) {
    const angleStep = (2 * Math.PI) / segments;
    const startAngle = index * angleStep - Math.PI / 2;
    const endAngle = startAngle + angleStep;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  }

  function getIconPosition(index: number) {
    const angleStep = (2 * Math.PI) / segments;
    const midAngle = index * angleStep - Math.PI / 2 + angleStep / 2;
    const iconRadius = radius * 0.65;
    return {
      x: cx + iconRadius * Math.cos(midAngle),
      y: cy + iconRadius * Math.sin(midAngle),
    };
  }

  return (
    <div
      className="relative flex justify-center items-center"
      style={{
        width: "303px",
        height: "303px",
        filter: "drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.5)) drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.35))"
      }}
    >
      
      <svg width="303" height="303" style={{ position: "absolute", top: 0, left: 0 }}>
        {Array.from({ length: segments }).map((_, i) => (
          <path key={i} d={getSegmentPath(i)} fill={colors[i % 2]} />
        ))}
      </svg>

      
      <svg width="303" height="303" style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}>
        <defs>
          <radialGradient id="innerShadow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(80, 40, 120, 0.4)" />
          </radialGradient>
        </defs>
        <circle cx="151.5" cy="151.5" r="133" fill="url(#innerShadow)" />
      </svg>

      
      {icons.map((src, i) => {
        const { x, y } = getIconPosition(i);
        return (
          <img
            key={i}
            src={src}
            alt=""
            style={{
              position: "absolute",
              width: "28px",
              height: "28px",
              left: `${x - 14}px`,
              top: `${y - 14}px`,
              zIndex: 2,
              objectFit: "contain",
            }}
          />
        );
      })}

      
      <div
        className="rounded-full"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          border: "18px solid #DBCEEF",
          boxSizing: "border-box",
          zIndex: 3
        }}
      />

      
      {Array.from({ length: segments }).map((_, i) => {
        const angle = (i * 360) / segments;
        const rad = (angle * Math.PI) / 180;
        const x = cx + 145 * Math.sin(rad) - 4;
        const y = cy - 145 * Math.cos(rad) - 4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              border: "1px solid #9d6bf5",
              background: "radial-gradient(circle, #ffffff, #8B47FF)",
              boxSizing: "border-box",
              left: `${x}px`,
              top: `${y}px`,
              zIndex: 4
            }}
          />
        );
      })}
    </div>
  );
}