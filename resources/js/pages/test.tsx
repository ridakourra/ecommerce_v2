import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';

export default function ExampleCollapsible() {
    const items = [
        { value: "item1", label: "Item 1" },
        { value: "item2", label: "Item 2" },
        { value: "item3", label: "Item 3" }
    ];
    return (
        <>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Test..." />
                </SelectTrigger>
                <SelectContent>
                    {items.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    );
}
