import { useEffect } from 'react';

export const usePageTitle = (title: string) => {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = `${title} | NutriGuide AI`;

        return () => {
            document.title = prevTitle;
        };
    }, [title]);
};
