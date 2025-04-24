import InputError from '@/components/input-error';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogPortal, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Edit2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Category {
    id: number;
    name: string;
    description: string;
    flag: File;
    parent_id: BigInteger;
}

export default function Edit({ category }: { category: Category }) {
    // alert(category.flag);
    const { data, setData, post, processing, errors } = useForm({
        name: category.name,
        description: category.description,
        flag: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('categories.update', category.id), {
            onSuccess: () => {
                document.getElementById('closeDialogUpdateCategory')?.click();
            },
        });
    };

    const [flag, setFlag] = useState(`storage/${category.flag}`);

    const handleFlag = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('flag', e.target.files?.[0]);

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setFlag(event.target.result as string);
            }
        };
        if (e.target.files?.[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button size="sm" className="text-blue-500 hover:text-blue-600" variant="ghost">
                        <Edit2 />
                    </Button>
                </DialogTrigger>

                <DialogPortal>
                    <DialogContent>
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
                                    <Input onChange={handleFlag} id="flag" type="file" accept="image/*" />
                                    <div className="mt-2">
                                        <Avatar className="flex h-24 w-24 items-center justify-center rounded-none ring-1 ring-gray-800">
                                            <AvatarImage src={flag} className="h-full w-full" alt="Flag preview" />
                                            <AvatarFallback>No Page</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <InputError message={errors.flag} />
                                </div>

                                <DialogFooter className="flex gap-2">
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline" id="closeDialogUpdateCategory">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Updating...' : 'Update'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </div>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </>
    );
}
