import { useState, useMemo } from 'react';
import '../styles/Table.css';

interface TiffRecord {
    id: number;
    name: string;
    date: string;
    resolution: string;
    size: string;
    status: string;
}

function TiffList() {
    const [records] = useState<TiffRecord[]>([
        { id: 1, name: 'satellite_1.tiff', date: '2024-03-20', resolution: '1024x1024', size: '5.2 MB' , status: 'Processing...' },
        { id: 2, name: 'terrain_2.tiff', date: '2024-03-19', resolution: '2048x2048', size: '8.7 MB', status: 'Processing...' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [selectedRecords, setSelectedRecords] = useState<number[]>([]);

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

    const handleCheckboxChange = (id: number) => {
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

    const handleProcess = () => {
        console.log('Processing selected records:', selectedRecords);
    };

    const toggleSortDirection = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="page-container">
            <h1>TIFF Files</h1>
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
                            <th>Resolution</th>
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
                                <td>{record.resolution}</td>
                                <td>{record.size}</td>
                                <td>{record.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TiffList; 