import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ButtonProps } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { Link } from "@inertiajs/react";

interface MyButtonProps extends ButtonProps {
    text?: string;
    icon?: LucideIcon;
    link?: any;
    className?: string;
    [key: string]: any;
}

export default function MyButton({ 
    icon: IconComponent, 
    link = null,
    text, 
    className, 
    ...props 
}: MyButtonProps) {
    if(link){
        return <>
            <Link href={link}>
                <Button 
                    {...props} 
                    className={cn('flex justify-center items-center gap-2', className)}
                >
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    {text}
                </Button>
            </Link>
        </>
    }else{
        return <Button 
            {...props} 
            className={cn('flex justify-center items-center gap-2', className)}
        >
            {IconComponent && <IconComponent className="h-4 w-4" />}
            {text}
        </Button>
    }
}