export const GlobeStill = ({ compact = false }: { compact?: boolean }) => (
  <div className={`globe-still${compact ? ' globe-still--compact' : ''}`}>
    <img
      src="/map/globe-still.webp"
      alt="A still ivory-on-charcoal globe, centred on Europe and Africa"
      width={1600}
      height={1600}
      decoding="async"
    />
  </div>
);
