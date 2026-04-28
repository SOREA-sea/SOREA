import Image from 'next/image';

interface ProductCardProps{
  name: string;
  price: number;
  description?: string;
  imageSrc?: string;
}

export default function ProductCard({name, price, description, imageSrc}: ProductCardProps){
  return (
    <article className="product-card h-full overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      {imageSrc ? (
        <div className="rounded-[1.5rem] overflow-hidden bg-white/60">
          <Image src={imageSrc} alt={name} width={400} height={220} className="object-cover w-full h-48" style={{ width: '100%', height: '12rem' }} />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-tr from-pink-100 via-white to-violet-100 rounded-[1.5rem]" />
      )}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold leading-6">{name}</h4>
          {description && <p className="mt-2 text-sm text-foreground/70 leading-6">{description}</p>}
        </div>
        <div className="shrink-0 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-foreground shadow-sm">
          €{price.toFixed(2)}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-[0.22em] text-foreground/50">Disponible</span>
        <button className="btn-secondary">Ajouter</button>
      </div>
    </article>
  );
}
