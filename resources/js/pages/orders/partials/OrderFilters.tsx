import { Input } from '@/components/ui/input';
import MyButton from '@/components/ui/MyButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    filters: {
        users: Array<{ id: number; first_name: string; last_name: string }>;
        statuses: string[];
        payment_statuses: string[];
        payment_methods: string[];
    };
    filtersState: {
        user_id: string;
        status: string;
        payment_status: string;
        payment_method: string;
        archived: string;
        search: string;
    };
    onFilterChange: (key: keyof Props['filtersState'], value: string) => void;
    onResetFilters: () => void;
}

export default function OrderFilters({ filters, filtersState, onFilterChange, onResetFilters }: Props) {
    return (
        <div className="space-y-4 rounded-md border p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <Select value={filtersState.user_id} onValueChange={(value) => onFilterChange('user_id', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by user" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Users</SelectItem> {/* قيمة غير فارغة هنا */}
                        {filters.users.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                                {user.first_name} {user.last_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filtersState.status} onValueChange={(value) => onFilterChange('status', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem> {/* القيمة غير فارغة هنا */}
                        {filters.statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filtersState.payment_status} onValueChange={(value) => onFilterChange('payment_status', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by payment status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Payment Statuses</SelectItem>
                        {filters.payment_statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filtersState.payment_method} onValueChange={(value) => onFilterChange('payment_method', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by payment method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Payment Methods</SelectItem> {/* القيمة غير فارغة هنا */}
                        {filters.payment_methods.map((method) => (
                            <SelectItem key={method} value={method}>
                                {method}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filtersState.archived} onValueChange={(value) => onFilterChange('archived', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Archived?" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">True</SelectItem>
                        <SelectItem value="0">False</SelectItem>
                    </SelectContent>
                </Select>

                <Input placeholder="Search..." value={filtersState.search} onChange={(e) => onFilterChange('search', e.target.value)} />
            </div>

            <MyButton text="Reset Filters" onClick={onResetFilters} />
        </div>
    );
}
