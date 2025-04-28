import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { useLayoutEffect, useState } from 'react';

export default function SectionThree({ filters, setFilters }) {
    const [departments, setDepartments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);

    async function getDepartments() {
        const res = await axios.get(route('getCategoriesById'));
        setDepartments(res.data.categories);
    }
    async function getCategories(value) {
        const res = await axios.get(route('getCategoriesById', { category: value }));
        setCategories(res.data.categories);
    }
    async function getTypes(value) {
        const res = await axios.get(route('getCategoriesById', { category: value }));
        setTypes(res.data.categories);
    }

    useLayoutEffect(() => {
        getDepartments();
    }, []);
    return (
        <div className="flex w-full flex-col gap-3 md:flex-row">
            {/* Departments */}
            <Select
                disabled={departments.length === 0 && true}
                value={filters.department}
                onValueChange={(value) => {
                    setFilters({ ...filters, department: value });
                    getCategories(value);
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">HHH</SelectItem>
                    {departments.map((dep, key) => (
                        <SelectItem key={key} value={`${dep.id}`}>
                            {dep.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {/* Categories */}
            <Select
                disabled={categories.length === 0 && true}
                value={filters.category}
                onValueChange={(value) => {
                    setFilters({ ...filters, category: value });
                    getTypes(value);
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((dep, key) => (
                        <SelectItem key={key} value={`${dep.id}`}>
                            {dep.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {/* Types */}
            <Select disabled={types.length === 0 && true} value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                    {types.map((dep, key) => (
                        <SelectItem key={key} value={`${dep.id}`}>
                            {dep.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
