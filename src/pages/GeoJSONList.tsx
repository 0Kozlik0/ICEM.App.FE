import { useState, useMemo, useEffect } from 'react';
import '../styles/Table.css';
import { GeoJSONFileResponse } from '../application/Domain/Response';
import { GeoJSONRecord } from '../application/Domain/Records';
import { DataHandlerService } from '../application/Application/DataHandlerService';

function GeoJSONList() {
    const [records, setRecords] = useState<GeoJSONRecord[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGeoJSONFiles = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_FAST_API_HOST}/ikem_api/get-geojson-files`);
                if (!response.ok) {
                    throw new Error('Failed to fetch GeoJSON files');
                }
                const data: GeoJSONFileResponse = await response.json();
                
                const formattedRecords: GeoJSONRecord[] = data.geojson_files.map(file => ({
                    id: file.id,
                    name: `${file.id}.geojson`,
                    date: file.last_modified,
                    size: `${file.size_bytes.toFixed(2)} MB`
                }));
                
                setRecords(formattedRecords);
            } catch (error) {
                console.error('Error fetching GeoJSON files:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGeoJSONFiles();
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

    const handleDownload = async (id: string) => {
        try {
            const dataService = new DataHandlerService();
            await dataService.downloadGeoJSON(id);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const toggleSortDirection = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="page-container">
            <h1>GeoJSON Files</h1>
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
                                        <td className='table-results-first-column'>{record.name}</td>
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
                </>
            )}
        </div>
    );
}

export default GeoJSONList; 