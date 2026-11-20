'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Accueil' },
        //{ href: '/shop', label: 'Shopping' },
       // { href: '/coaching', label: 'Coaching' },
        { href: '/#community', label: 'Challenge' },
        { href: '/suivi', label: 'Mon suivi' },
        //{ href: '/carnet', label: 'Mon carnet' },
    ];

    const infoLinks = [
        { href: '/challenge', label: 'À propos' },
        { href: '/ambassador', label: 'Devenir ambassadeur' },
        { href: '/termandprivacy', label: 'Mentions légales' },
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

    // Remontée fluide en haut de page (animation gérée manuellement, indépendante des réglages du navigateur)
    const scrollToTopSmooth = () => {
        const startY = window.scrollY;
        if (startY === 0) return;

        // Durée proportionnelle à la distance : entre 0,5 s et 1,2 s
        const duration = Math.min(1200, Math.max(500, startY * 0.4));
        const startTime = performance.now();

        const easeInOutCubic = (t: number) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const step = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            window.scrollTo({ top: startY * (1 - easeInOutCubic(progress)), behavior: 'instant' as ScrollBehavior });
            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    };

    return (
        <footer className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[radial-gradient(circle_at_92%_7%,rgba(255,128,196,0.72)_0,rgba(255,128,196,0)_20%),radial-gradient(circle_at_58%_38%,rgba(170,204,220,0.95)_0,rgba(170,204,220,0)_32%),radial-gradient(circle_at_39%_64%,rgba(231,176,241,0.75)_0,rgba(231,176,241,0)_29%),linear-gradient(105deg,#eef2f8_0%,#B6C0F8_31%,#E7B0F1_55%,#AACCDC_78%,#e9eef4_100%)] px-5 py-6 font-['Inria_Sans'] text-[#201a2b] shadow-sm sm:px-7 sm:py-8 lg:px-9">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 lg:px-12">
                <div className="grid gap-8 rounded-lg bg-white/55 p-5 backdrop-blur-md sm:p-7 lg:grid-cols-[1.05fr_1fr_1fr_1.4fr_72px] lg:items-start">
                    <div className="flex flex-col items-start gap-5">
                        <div className="flex h-25 w-25 ">
                            <Image
                                src="/images/logo_sorea.webp"
                                alt="SOREA"
                                width={100}
                                height={100}
                                className="rounded-full object-cover"
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
                        <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#201a2b]/45">Moyens de paiement</h3>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            <div className="flex h-7 w-11 items-center justify-center rounded bg-white p-1 shadow-sm border border-gray-100">
                                <Image src="/image_icone/PaymentVISA.svg" alt="Visa" width={32} height={20} className="h-4 w-auto object-contain" />
                            </div>
                            <div className="flex h-7 w-11 items-center justify-center rounded bg-white p-1 shadow-sm border border-gray-100">
                                <Image src="/image_icone/PaymentMasterCard.svg" alt="Mastercard" width={32} height={20} className="h-5 w-auto object-contain" />
                            </div>
                            <div className="flex h-7 w-11 items-center justify-center rounded bg-white p-1 shadow-sm border border-gray-100">
                                <Image src="/image_icone/PaymentApplePay.svg" alt="Apple Pay" width={32} height={20} className="h-10 w-auto object-contain" />
                            </div>
                            <div className="flex h-7 w-11 items-center justify-center rounded bg-white p-1 shadow-sm border border-gray-100">
                                <Image src="/image_icone/PaymentGooglePay.svg" alt="Google Pay" width={32} height={20} className="h-8 w-auto object-contain" />
                            </div>
                            <div className="flex h-7 w-11 items-center justify-center rounded bg-white p-1 shadow-sm border border-gray-100">
                                <Image src="/image_icone/PaymentPaypal.svg" alt="PayPal" width={32} height={20} className="h-10 w-auto object-contain" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={scrollToTopSmooth}
                        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white p-2.5 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg active:scale-95 lg:justify-self-end cursor-pointer"
                        style={{
                            border: '3px solid transparent',
                            backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #F4C4E4, #C0BBFC, #B7F8F5)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                        }}
                    >
                        <img src="/image_icone/ArrowTop.svg" alt="Remonter en haut" className="w-7 h-7 object-contain" />
                    </button>
                    
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
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr] lg:items-end">
                    <div className="flex flex-col gap-5">
                        

                        <div>
                            <p className="text-2xl font-bold text-[#201a2b]">SOREA, votre bulle de sérénité où que vous soyez.</p>
                            <p className="mt-2 max-w-md text-sm font-medium leading-relaxed text-[#201a2b]/70">
                                Prenez soin de vous avec des kits bien-être personnalisés, un espace digital apaisant et du coaching inspirant.
                            </p>
                        </div>
                    </div>

                </div>

                <p className="text-center text-xs font-medium text-[#201a2b]/60">
                    &copy; {new Date().getFullYear()} SOREA. Tous Droits Réservés.
                </p>
            </div>
        </footer>
    );
}
