import { Edit, Eye, Trash } from "lucide-react";
import { Button } from "../button";
import { Link } from "@inertiajs/react";

export function Table ({ headers = [], children }){
    return (
        <table className="w-full p-2 rounded-md border">
            <thead> 
                <tr>
                    {headers.map((head, key) => <th className="px-4 py-2 text-left text-sm font-medium text-gray-500" key={key}>{head}</th>)}
                    <th className="px-4 py-2 text-sm font-medium text-gray-500 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {children}
            </tbody>
        </table>
    );
}

export function Tr({children, ...props}){
    return <tr className="px-4 py-2 text-sm" {...props}>{children}</tr>
}
export function Td({children, ...props}){
    return <td className="px-4 py-2 text-sm" {...props}>{children}</td>
}

interface TdActionsProps extends React.HTMLAttributes<HTMLTableCellElement> {
    children?: React.ReactNode;
    eye?: {
        status: boolean;
        component: React.ReactNode | null;
    };
    edit?: boolean;
    trash?: boolean;
}

export function TdActions({
    children, 
    
    ...props
}: TdActionsProps) {
    return <td className="pace-x-2 px-4 py-2 text-sm flex justify-end" {...props}>
        {children}
    </td>
}

export function TdAction({type = 'button', color="blue", icon=<Eye />,href=null, dialog=null}){
    const className = `text-${color}-500 hover:text-${color}-600 dark:hover:bg-gray-800`
    switch (type){
        case 'button':
            return <Button size="sm" variant="ghost" type="button" className={className}>{icon}</Button>
        case 'link':
            return <>
                <Link href={href}>
                    <Button size="sm" variant="ghost" type="button" className={className}>{icon}</Button>
                </Link>
            </>
        case 'dialog':
            return dialog;
        default: 
            return <Button size="sm" variant="ghost" type="button" className={className}>{icon}</Button>
    }
}