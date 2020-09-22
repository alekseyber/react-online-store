import { useEffect } from 'react';
import { useRouter } from '../../hooks/router.hook';


export default () => {

    const { pathname } = useRouter();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
