import Delete from './Delete';
import Edit from './Edit';
import Show from './Show';

interface Category {
    id: number;
    name: string;
    description: string;
    flag: File;
    parent_id: BigInteger;
    parent: {
        id: number;
        name: string;
    };
}

export default function ActionsTableCategory({ category }: { category: Category }) {
    return (
        <>
            <div className="flex gap-2">
                <Show category={category} />
                <Edit category={category} />
                <Delete id={category.id} />
            </div>
        </>
    );
}
