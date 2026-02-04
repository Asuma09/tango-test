import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { parseCSV } from '../utils/csvParser';

export const useQuizData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch main data and overrides
                const [mainRes, ch1Res, ch2Res, ch3Res, ch4Res, ch5Res, ch6Res, ch7Res, ch8Res, ch9Res, ch10Res, ch11Res, ch12Res, ch13Res, ch14Res] = await Promise.all([
                    fetch('/data.csv'),
                    fetch('/chapter1.csv'),
                    fetch('/chapter2.csv'),
                    fetch('/chapter3.csv'),
                    fetch('/chapter4.csv'),
                    fetch('/chapter5.csv'),
                    fetch('/chapter6.csv'),
                    fetch('/chapter7.csv'),
                    fetch('/chapter8.csv'),
                    fetch('/chapter9.csv'),
                    fetch('/chapter10.csv'),
                    fetch('/chapter11.csv'),
                    fetch('/chapter12.csv'),
                    fetch('/chapter13.csv'),
                    fetch('/chapter14.csv')
                ]);

                if (!mainRes.ok) throw new Error('Failed to fetch data.csv');

                const mainText = await mainRes.text();
                const parsedMainData = await parseCSV(mainText);

                const processOverride = async (response, chapterId) => {
                    if (response.ok) {
                        const text = await response.text();
                        await new Promise((resolve) => {
                            Papa.parse(text, {
                                header: true,
                                skipEmptyLines: true,
                                complete: (results) => {
                                    const words = results.data.map(row => ({
                                        english: row['English'] || row['Idiom'], // Handle Idiom column for Ch4
                                        japanese: row['Japanese']
                                    })).filter(w => w.english && w.japanese);

                                    if (words.length > 0) {
                                        parsedMainData[chapterId] = words;
                                    }
                                    resolve();
                                },
                                error: (err) => {
                                    console.warn(`Failed to parse chapter${chapterId}.csv`, err);
                                    resolve();
                                }
                            });
                        });
                    }
                };

                await Promise.all([
                    processOverride(ch1Res, '1'),
                    processOverride(ch2Res, '2'),
                    processOverride(ch3Res, '3'),
                    processOverride(ch4Res, '4'),
                    processOverride(ch5Res, '5'),
                    processOverride(ch6Res, '6'),
                    processOverride(ch7Res, '7'),
                    processOverride(ch8Res, '8'),
                    processOverride(ch9Res, '9'),
                    processOverride(ch10Res, '10'),
                    processOverride(ch11Res, '11'),
                    processOverride(ch12Res, '12'),
                    processOverride(ch13Res, '13'),
                    processOverride(ch14Res, '14')
                ]);

                setData(parsedMainData);
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
