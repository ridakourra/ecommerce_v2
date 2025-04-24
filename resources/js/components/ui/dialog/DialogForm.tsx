import { Button } from "../button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogPortal, DialogTitle, DialogTrigger } from "../dialog";

export default function DialogForm({children = '', title = 'Title', description = 'Description', labelButton = 'Button', submit = () => {}}, id="closeDialog"){
    return <>
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    {labelButton}
                </Button>
            </DialogTrigger>

            <DialogPortal>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>


                    <form onSubmit={submit} className="space-y-6">


                        <div className="space-y-3">
                            {children}
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button id={id}>Close</Button>
                            </DialogClose>
                            <Button>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                    
                </DialogContent>
            </DialogPortal>
        </Dialog>
    </>
}