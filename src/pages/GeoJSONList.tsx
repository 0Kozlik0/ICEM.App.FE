import { useState, useMemo } from 'react';
import '../styles/Table.css';

interface GeoJSONRecord {
    id: number;
    name: string;
    date: string;
    size: string;
}

function GeoJSONList() {
    const [records] = useState<GeoJSONRecord[]>([
        { id: 1, name: 'map_data_1.geojson', date: '2024-03-20', size: '2.3 MB' },
        { id: 2, name: 'boundaries_2.geojson', date: '2024-03-19', size: '1.8 MB' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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

    const handleDownload = (id: number) => {
        console.log(`Downloading GeoJSON with id: ${id}`);
    };

    const toggleSortDirection = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="page-container">
            <h1>GeoJSON Files</h1>
            <div className="table-controls">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th onClick={toggleSortDirection} className="sortable-header">
                                Date {sortDirection === 'asc' ? '↑' : '↓'}
                            </th>
                            <th>Size</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedRecords.map((record) => (
                            <tr key={record.id}>
                                <td>{record.name}</td>
                                <td>{record.date}</td>
                                <td>{record.size}</td>
                                <td>
                                    <button 
                                        className="download-button"
                                        onClick={() => handleDownload(record.id)}
                                    >
                                        Download
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GeoJSONList; 