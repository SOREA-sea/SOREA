"use client";

import React, { createContext, useState, useContext } from 'react';

type MenuType = 'HOME' | 'ABOUT' | 'SKILLS' | 'PROJECTS' | 'CV' | 'CONTACT';

interface MenuContextProps {
    activeMenu: MenuType;
    setActiveMenu: (menu: MenuType) => void;
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
    const [activeMenu, setActiveMenu] = useState<MenuType>('HOME');

    return (
        <MenuContext.Provider value={{ activeMenu, setActiveMenu }}>
            {children}
        </MenuContext.Provider>
    );
}

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error("useMenu doit être utilisé à l'intérieur de MenuProvider");
    }
    return context;
};