import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

export default function ExampleCollapsible() {
    return (
        <>
            <Button onClick={() => getData('get')}>CLICK</Button>
        </>
    );
}

function getData(method) {
    router[method](
        '/test',
        {},
        {
            onSuccess: (page) => {
                console.log(page);
            },
            onError: (err) => {
                console.log(err);
            },
        }
    );
}
