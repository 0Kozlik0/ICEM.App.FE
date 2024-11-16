import { useState, useMemo, useEffect } from 'react';
import '../styles/Table.css';
import { DataHandlerService } from '../application/Application/DataHandlerService';
import { TiffRecord } from '../application/Domain/Records';


function TiffList() {
    const [records, setRecords] = useState<TiffRecord[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTiffFiles = async () => {
            try {
                const dataService = new DataHandlerService();
                const response = await dataService.getTiffFiles();
                
                const formattedRecords: TiffRecord[] = response.tiff_files.map(file => ({
                    id: file.id,
                    name: `${file.id}.tiff`,
                    date: file.last_modified,
                    size: `${(file.size_bytes).toFixed(2)} MB`,
                    status: 'Ready'
                }));
                
                setRecords(formattedRecords);
            } catch (error) {
                console.error('Error fetching TIFF files:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTiffFiles();
    }, []);

    const filteredAndSortedRecords = useMemo(() => {
        return records
            .filter(record => 
                record.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
            });
    }, [records, searchTerm, sortDirection]);

    const handleCheckboxChange = (id: string) => {
        setSelectedRecords(prev => {
            if (prev.includes(id)) {
                return prev.filter(recordId => recordId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedRecords.length === filteredAndSortedRecords.length) {
            setSelectedRecords([]);
        } else {
            setSelectedRecords(filteredAndSortedRecords.map(record => record.id));
        }
    };

    const handleProcess = async () => {
        try {
            const dataService = new DataHandlerService();
            await dataService.predictStructure(selectedRecords);
            console.log('Processing started for records:', selectedRecords);
        } catch (error) {
            console.error('Error processing records:', error);
        }
    };

    const toggleSortDirection = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="page-container">
            <h1>TIFF Files</h1>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <div className="table-controls">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button 
                            className="process-button"
                            onClick={handleProcess}
                            disabled={selectedRecords.length === 0}
                        >
                            Process Selected ({selectedRecords.length})
                        </button>
                    </div>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={selectedRecords.length === filteredAndSortedRecords.length}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th>Name</th>
                                    <th onClick={toggleSortDirection} className="sortable-header">
                                        Date {sortDirection === 'asc' ? '↑' : '↓'}
                                    </th>
                                    <th>Size</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedRecords.map((record) => (
                                    <tr key={record.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedRecords.includes(record.id)}
                                                onChange={() => handleCheckboxChange(record.id)}
                                            />
                                        </td>
                                        <td>{record.name}</td>
                                        <td>{record.date}</td>
                                        <td>{record.size}</td>
                                        <td>{record.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default TiffList; 