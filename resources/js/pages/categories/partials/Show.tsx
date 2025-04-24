import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Eye } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    description: string;
    flag: string;
    parent_id: BigInteger;
    parent?: {
        name: string;
    };
}

export default function Show({ category }: { category: Category }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{category.name}</DialogTitle>
                    <DialogDescription>Category Details</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-medium">Description</h4>
                        <p className="text-muted-foreground text-sm">{category.description || 'No description available'}</p>
                    </div>

                    {category.parent && (
                        <div>
                            <h4 className="text-sm font-medium">Parent Category</h4>
                            <p className="text-muted-foreground text-sm">{category.parent.name}</p>
                        </div>
                    )}

                    {category.flag && (
                        <div>
                            <h4 className="text-sm font-medium">Flag</h4>
                            <Avatar className="overflow-hidden rounded-md">
                                <AvatarImage className="h-30 w-30" src={`storage/${category.flag}`} />
                                <AvatarFallback>No Flag</AvatarFallback>
                            </Avatar>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
