import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { router } from "@inertiajs/react";

export function DangerZone() {
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState("");

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('public.profile.destroy'), {
            password: password
        }, {
            onSuccess: () => setIsOpen(false),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove all associated data.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleDelete} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Confirm Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password to confirm"
                        />
                    </div>
                    <Button type="submit" variant="destructive">
                        Delete Account
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}