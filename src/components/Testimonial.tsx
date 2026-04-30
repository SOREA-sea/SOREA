import Image from 'next/image';

interface TestimonialProps{
  author: string;
  text: string;
  avatarSrc?: string;
}

export default function Testimonial({author, text, avatarSrc}: TestimonialProps){
  return (
    <div className="testimonial h-full">
      <div className="h-16 w-16 rounded-full bg-white/80 flex items-center justify-center overflow-hidden ring-4 ring-white/70 shadow-md">
        {avatarSrc ? <Image src={avatarSrc} alt={author} width={80} height={80} /> : <span>{author.charAt(0)}</span>}
      </div>
      <p className="mt-4 text-sm text-foreground/75 leading-7">“{text}”</p>
      <div className="mt-3 text-sm font-semibold">{author}</div>
    </div>
  );
}