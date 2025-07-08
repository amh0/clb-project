import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { ModeToggle} from '@/components/mode-toggle'

interface HeaderProps {
    title: string;
}

const Header = ({ title }: HeaderProps) => {
    return (
        <div className="flex items-center justify-between py-4 sticky top-0 bg-white z-10 border-b border-gray-100">
            <Sheet key="left">
                <SheetTrigger asChild>
                    <Button variant="outline"><Menu size={24} /></Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle>CienciaLInk</SheetTitle>
                        <SheetDescription>
                            give you a good day
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex items-center py-4">
                        <ModeToggle />
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button >Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold">{title}</h1>
            <div className="w-6"></div> {/* Spacer para alineación */}
        </div>
    );
};

export default Header;
