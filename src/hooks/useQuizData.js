import { useState, useEffect } from 'react';
import { parseCSV } from '../utils/csvParser';

export const useQuizData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data.csv');
                if (!response.ok) {
                    throw new Error('Failed to fetch data.csv');
                }
                const text = await response.text();
                const parsedData = await parseCSV(text);
                setData(parsedData);
            } catch (err) {
                console.error("Error loading quiz data:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};
