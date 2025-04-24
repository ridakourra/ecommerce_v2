import { Button } from "../button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogPortal, DialogTitle, DialogTrigger } from "../dialog";

interface DialogDeleteProps {
    title?: string;
    description?: string;
    onDelete: () => void;
    trigger?: React.ReactNode;
}

export default function DialogDelete({
    title = 'Confirm Deletion',
    description = 'Are you sure you want to delete this item? This action cannot be undone.',
    onDelete,
    trigger
}: DialogDeleteProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="destructive">
                        Delete
                    </Button>
                )}
            </DialogTrigger>

            <DialogPortal>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button id='closeDialog' variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button 
                            variant="destructive" 
                            onClick={() => {
                                onDelete();
                                document.querySelector('[role="dialog"]')?.querySelector('button[aria-label="Close"]')?.click();
                            }}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}