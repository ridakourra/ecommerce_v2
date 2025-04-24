import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { Trash } from 'lucide-react';

export default function Delete({ id }: { id: number }) {
    const handleDelete = () => {
        router.delete(route('categories.destroy', id), {
            onSuccess: () => {
                document.getElementById('closeDialogDeleteCategory')?.click();
            },
        });
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
                        <Trash />
                    </Button>
                </DialogTrigger>

                <DialogPortal>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Department</DialogTitle>
                            <DialogDescription>Are you sure you want to delete this department? This action cannot be undone.</DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button id="closeDialogDeleteCategory" variant="outline" size="sm">
                                    No
                                </Button>
                            </DialogClose>
                            <Button onClick={handleDelete} variant="destructive" size="sm">
                                Yes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </>
    );
}
