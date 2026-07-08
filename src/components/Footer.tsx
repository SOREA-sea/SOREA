'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Accueil' },
        { href: '/shop', label: 'Shopping' },
        { href: '/coaching', label: 'Coaching' },
        { href: '/#community', label: 'Challenge' },
        { href: '/carnet', label: 'Mon carnet' },
    ];

    const infoLinks = [
        { href: '/about', label: 'A propos' },
        { href: '/termandprivacy', label: 'Politique de confidentialite' },
        { href: '/termandprivacy', label: 'CGU' },
    ];

    const socialLinks = [
        { icon: 'fa-instagram', label: 'Instagram SOREA', url: 'https://www.instagram.com/sorea.dp/' },
        { icon: 'fa-tiktok', label: 'TikTok SOREA', url: 'https://www.tiktok.com' },
        { icon: 'fa-youtube', label: 'YouTube SOREA', url: 'https://www.youtube.com/channel/UCCushiAoObro2ohiEiyWnuQ' },
        { icon: 'fa-linkedin', label: 'LinkedIn SOREA', url: 'https://www.linkedin.com' },
        { icon: 'fa-facebook-f', label: 'Facebook SOREA', url: 'https://www.facebook.com' },
    ];

    const isActive = (href: string) => {
        if (href === '/login?tab=inscription') return pathname === '/login';
        return pathname === href;
    };

    const activeStyle = {
        background: 'linear-gradient(259.12deg, #FF80C4, #B6C0F8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textDecoration: 'underline',
    };

    return (
        <footer className="w-full px-5 py-8 sm:px-8 lg:px-12">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 bg-[radial-gradient(circle_at_92%_7%,rgba(255,128,196,0.72)_0,rgba(255,128,196,0)_20%),radial-gradient(circle_at_58%_38%,rgba(170,204,220,0.95)_0,rgba(170,204,220,0)_32%),radial-gradient(circle_at_39%_64%,rgba(231,176,241,0.75)_0,rgba(231,176,241,0)_29%),linear-gradient(105deg,#eef2f8_0%,#B6C0F8_31%,#E7B0F1_55%,#AACCDC_78%,#e9eef4_100%)] px-5 py-6 font-['Inria_Sans'] text-[#201a2b] shadow-sm sm:px-7 sm:py-8 lg:px-9">
                <div className="grid gap-8 rounded-lg bg-white/55 p-5 backdrop-blur-md sm:p-7 lg:grid-cols-[1.05fr_1fr_1fr_1.4fr_72px] lg:items-start">
                    <div className="flex flex-col items-start gap-5">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/70 shadow-sm">
                            <Image
                                src="/images/logo_sorea.webp"
                                alt="SOREA"
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#201a2b]/45">Navigation</h3>
                        <div className="flex flex-col gap-1.5 text-sm font-medium leading-snug">
                            {navLinks.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    style={isActive(href) ? activeStyle : undefined}
                                    className={isActive(href) ? '' : 'text-[#201a2b] transition-opacity hover:opacity-60'}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#201a2b]/45">Information</h3>
                        <div className="flex flex-col gap-1.5 text-sm font-medium leading-snug">
                            {infoLinks.map(({ href, label }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    style={isActive(href) ? activeStyle : undefined}
                                    className={isActive(href) ? '' : 'text-[#201a2b] transition-opacity hover:opacity-60'}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#201a2b]/45">Contact</h3>
                        <div className="flex flex-col gap-2 text-sm font-medium leading-snug text-[#201a2b]">
                            <div className="flex items-center gap-2.5">
                                <i className="fa-regular fa-envelope text-[#6b5acb]" />
                                <span>contact@sorea-sea.com</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <i className="fa-solid fa-phone text-[#6b5acb]" />
                                <span>+33 7 44 30 90 09</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <i className="fa-solid fa-location-dot text-[#6b5acb]" />
                                <span>02400 Chateau-Thierry</span>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/login?tab=inscription"
                        className="inline-flex h-9 w-14 items-center justify-center rounded-md bg-[#201a2b] text-[10px] font-bold uppercase text-white transition-transform hover:-translate-y-0.5 lg:justify-self-end"
                    >
                        CTA
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr] lg:items-end">
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-2">
                            {socialLinks.map(({ icon, label, url }) => (
                                <button
                                    key={icon}
                                    type="button"
                                    aria-label={label}
                                    onClick={() => window.open(url)}
                                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#201a2b] text-xs text-white transition-transform hover:-translate-y-0.5"
                                >
                                    <i className={`fa-brands ${icon}`} />
                                </button>
                            ))}
                        </div>

                        <div>
                            <p className="text-2xl font-bold text-[#201a2b]">Citation</p>
                            <p className="mt-2 max-w-md text-sm font-medium leading-relaxed text-[#201a2b]/70">
                                Prenez soin de vous avec des kits bien-etre personnalises, un espace digital apaisant et du coaching inspirant.
                            </p>
                        </div>
                    </div>

                    <form className="flex flex-col gap-2" onSubmit={(event) => event.preventDefault()}>
                        <label htmlFor="footer-email" className="text-xs font-semibold text-white">
                            Just send us your email and we will contact you.
                        </label>
                        <div className="flex h-10 overflow-hidden rounded-md border border-white/80 bg-white/15 text-white backdrop-blur">
                            <input
                                id="footer-email"
                                type="email"
                                placeholder="mail"
                                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/75"
                            />
                            <button
                                type="submit"
                                aria-label="Envoyer l'email"
                                className="flex w-12 items-center justify-center text-white transition-colors hover:bg-white/15"
                            >
                                <i className="fa-solid fa-arrow-right text-sm" />
                            </button>
                        </div>
                    </form>
                </div>

                <p className="text-center text-xs font-medium text-[#201a2b]/60">
                    &copy; {new Date().getFullYear()} SOREA. Tous Droits Reserves.
                </p>
            </div>
        </footer>
    );
}
