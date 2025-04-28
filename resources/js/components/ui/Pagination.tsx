import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function PaginationLinks({ links }) {
    return (
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
            {links.map((link, index) => (
                <Button
                    asChild
                    key={index}
                    size="sm"
                    variant={link.active ? 'default' : 'outline'}
                    disabled={!link.url}
                >
                    <Link href={link.url || '#'}>
                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                    </Link>
                </Button>
            ))}
        </div>
    );
}
