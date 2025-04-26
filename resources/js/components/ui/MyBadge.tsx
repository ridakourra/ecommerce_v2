import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Status = 'pending' | 'approved' | 'rejected' | 'inactive' | 'active'

interface MyBadgeProps {
    status: Status
    className?: string
}

export default function MyBadge({ status, className }: MyBadgeProps) {
    const variants: Record<Status, { variant: "default" | "secondary" | "destructive" | "outline", text: string }> = {
        pending: {
            variant: "secondary",
            text: "Pending"
        },
        approved: {
            variant: "default",
            text: "Approved"
        },
        rejected: {
            variant: "destructive",
            text: "Rejected"
        },
        inactive: {
            variant: "outline",
            text: "Inactive"
        },
        active: {
            variant: "default",
            text: "Active"
        },
        
    }

    const { variant, text } = variants[status]

    return (
        <Badge 
            variant={variant} 
            className={cn(
                status === 'active' && "bg-green-600",
                status === 'pending' && "bg-yellow-600",
                className,
                'text-white'
            )}
        >
            {text}
        </Badge>
    )
}