import { Icon } from '@/components/icon';
import { Eye, Trash } from 'lucide-react';

export default function Table({ users }) {
    return (
        <table className="table w-full">
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Country</th>
                    <th>City</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, key) => (
                    <tr key={key}>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.email}</td>
                        <td>{user?.details?.country}</td>
                        <td>{user?.details?.city}</td>
                        <td>{user.role}</td>
                        <td>
                            <Icon iconNode={Eye} />
                            <Icon iconNode={Trash} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
