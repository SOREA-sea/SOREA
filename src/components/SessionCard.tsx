import Image from 'next/image';

interface SessionCardProps{
  title: string;
  price: number;
  kind?: string;
  imageSrc?: string;
}

export default function SessionCard({title, price, kind, imageSrc}: SessionCardProps){
  return (
    <div className="card h-full overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      {imageSrc ? (
        <div className="overflow-hidden rounded-[1.5rem] bg-white/60">
          <Image src={imageSrc} alt={title} width={400} height={180} className="object-cover w-full h-40" style={{ width: '100%', height: '10rem' }} />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-[1.5rem]" />
      )}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold leading-6">{title}</h4>
          <p className="text-sm text-foreground/70 mt-2 leading-6">{kind ?? 'Session summary'}</p>
        </div>
        <div className="rounded-full bg-white/80 px-3 py-2 text-sm font-semibold shadow-sm">€{price.toFixed(2)}</div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-xs uppercase tracking-[0.22em] text-foreground/50">45 min</span>
        <a className="text-sm font-semibold text-violet-700" href="#">Réserver</a>
      </div>
    </div>
  );
}
