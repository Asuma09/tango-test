import Papa from 'papaparse';

export const parseCSV = (csvText) => {
    return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data;
                const chapters = {};

                data.forEach((row) => {
                    // Assuming CSV headers are Chapter, English, Japanese based on the file inspection
                    const chapter = row['Chapter'];
                    if (!chapter) return;

                    if (!chapters[chapter]) {
                        chapters[chapter] = [];
                    }

                    chapters[chapter].push({
                        english: row['English'],
                        japanese: row['Japanese']
                    });
                });

                resolve(chapters);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};
