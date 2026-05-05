'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Accueil' },
        { href: '/#products', label: 'Shopping' },
        { href: '/#sessions', label: 'Coaching' },
        { href: '/#community', label: 'Challenge' },
        { href: '/vibe', label: 'Vibe' },
        { href: '/carnet', label: 'Mon carnet' },
    ];

    return (
        <footer className="w-full [background:linear-gradient(90deg,_rgba(75,_85,_99,_0.2),_rgba(152,_173,_201,_0.2))] py-10 px-6">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
                <div className="flex flex-col md:flex-row justify-between gap-10">

                    {/* Logo + description + réseaux */}
                    <div className="flex flex-col items-start gap-4 max-w-[220px]">
                        <Image
                            src="/images/logo_sorea.webp"
                            alt="SOREA"
                            width={100}
                            height={100}
                            className="object-cover"
                        />
                        <p className="text-sm text-primary-darker/70 font-['Inria_Sans'] tracking-wide leading-relaxed">
                            Prenez soin de vous avec des kits bien-être personnalisés, un espace digital apaisant et du coaching inspirant.
                        </p>
                        <div className="flex items-center gap-5 mt-2">
                            <i className="fa-brands fa-instagram text-xl cursor-pointer hover:opacity-70 transition-opacity text-primary-darker" onClick={() => window.open("https://www.instagram.com/sorea.dp/")} />
                            <i className="fa-brands fa-tiktok text-xl cursor-pointer hover:opacity-70 transition-opacity text-primary-darker" onClick={() => window.open("https://www.tiktok.com")} />
                            <i className="fa-brands fa-youtube text-xl cursor-pointer hover:opacity-70 transition-opacity text-primary-darker" onClick={() => window.open("https://www.youtube.com/channel/UCCushiAoObro2ohiEiyWnuQ")} />
                            <i className="fa-brands fa-linkedin text-xl text-primary-darker" />
                            <i className="fa-brands fa-facebook text-xl text-primary-darker" />
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-['Inria_Sans'] text-primary-darker text-xl tracking-widest">Navigation</h3>
                        <div className="flex flex-col gap-3 text-sm font-['Inria_Sans'] tracking-wide">
                            {navLinks.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    style={pathname === href ? {
                                        background: 'linear-gradient(259.12deg, #8b47ff, #f498c5)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textDecoration: 'underline',
                                    } : undefined}
                                    className={pathname === href ? '' : 'text-primary-darker hover:opacity-70 transition-opacity'}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Informations */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-['Inria_Sans'] text-primary-darker text-xl tracking-widest">Information</h3>
                        <div className="flex flex-col gap-3 text-sm text-primary-darker font-['Inria_Sans'] tracking-wide">
                            <Link href="/register" className="hover:opacity-70 transition-opacity">Devenir ambassadrice</Link>
                            <Link href="/about" className="hover:opacity-70 transition-opacity">À propos</Link>
                            <Link href="/termandprivacy" className="hover:opacity-70 transition-opacity">Politique de confidentialité</Link>
                            <Link href="/termandprivacy" className="hover:opacity-70 transition-opacity">CGU</Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-['Inria_Sans'] text-primary-darker text-xl tracking-widest">Contact</h3>
                        <div className="flex flex-col gap-3 text-sm text-primary-darker font-['Inria_Sans'] tracking-wide">
                            <div className="flex items-center gap-3">
                                <i className="fa-regular fa-envelope text-base text-primary-darker" />
                                <span>contact@sorea-sea.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <i className="fa-solid fa-phone text-base text-primary-darker" />
                                <span>+33 7 44 30 90 09</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <i className="fa-solid fa-location-dot text-base text-primary-darker" />
                                <span>02400 Château-Thierry</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="w-full h-px bg-primary-darker opacity-20" />

                <p className="text-center font-['Inria_Sans'] tracking-[1.95px] text-sm text-primary-darker/70">
                    © {new Date().getFullYear()} SOREA. Tous Droits Réservés.
                </p>
            </div>
        </footer>
    );
}