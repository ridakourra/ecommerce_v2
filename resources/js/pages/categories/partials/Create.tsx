import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Create() {
    const {
        ziggy: { location },
    } = usePage<{ ziggy: { location: string } }>().props;

    const parent_id = location.split('/')[5] || null;
    console.log(`Parent Id: ${parent_id}`)
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        flag: null as File | null,
        parent_id: parent_id,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('categories.store'), {
            onSuccess: () => {
                console.log('success');
                (document.querySelector('#closeDialogCreateCategory') as HTMLElement)?.click();
            },
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    New Category
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                    <DialogDescription>Add a new category to organize your products.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                    <form className="space-y-3" onSubmit={submit}>
                        {/* Name */}
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                onChange={(e) => setData('name', e.target.value)}
                                value={data.name}
                                id="name"
                                type="text"
                                placeholder="Enter category name"
                            />
                            <InputError message={errors.name} />
                        </div>
                        {/* Description */}
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input
                                onChange={(e) => setData('description', e.target.value)}
                                value={data.description}
                                id="description"
                                type="text"
                                placeholder="Enter category description"
                            />
                            <InputError message={errors.description} />
                        </div>
                        {/* Flag */}
                        <div>
                            <Label htmlFor="flag">Flag</Label>
                            <Input onChange={(e) => setData('flag', e.target.files?.[0] || null)} id="flag" type="file" accept="image/*" />
                            <InputError message={errors.flag} />
                        </div>

                        <DialogFooter className="flex gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline" id="closeDialogCreateCategory">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Category'}
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
