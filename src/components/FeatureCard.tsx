interface FeatureCardProps{
  title: string;
  description?: string;
}

export default function FeatureCard({title, description}: FeatureCardProps){
  return (
    <div className="card h-full transition-transform duration-300 hover:-translate-y-1">
      <div className="mb-5 h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-400 shadow-lg" />
      <h3 className="text-lg font-bold tracking-[-0.02em]">{title}</h3>
      {description && <p className="text-sm leading-6 text-foreground/70 mt-3">{description}</p>}
    </div>
  );
}