import { useState, useMemo, useEffect } from 'react';
import '../styles/Table.css';
import { GeoJSONFileResponse } from '../application/Domain/Response';
import { GeoJSONRecord } from '../application/Domain/Records';
import { DataHandlerService } from '../application/Application/DataHandlerService';
import Footer from '../components/layout/Footer';
import { AuthService } from '../services/AuthService';

function GeoJSONList() {
    const [records, setRecords] = useState<GeoJSONRecord[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const dataService = new DataHandlerService();

    useEffect(() => {
        const fetchGeoJSONFiles = async () => {
            try {
                const response = await AuthService.fetchWithAuth(
                    `${process.env.REACT_APP_FAST_API_HOST}/ikem_api/get-geojson-files`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch GeoJSON files');
                }
                const data: GeoJSONFileResponse = await response.json();
                console.log(data);
                
                const formattedRecords: GeoJSONRecord[] = data.geojson_files.map(file => {
                    const type = file.id.toLowerCase().includes('tissue') ? 'tissue' : 'cell';
                    return {
                        id: file.id,
                        name: `${file.id}.geojson`,
                        date: file.last_modified,
                        size: `${file.size_bytes.toFixed(2)} MB`,
                        type: type
                    };
                });
                
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

    const handleDownload = async (id: string, type: 'tissue' | 'cell') => {
        try {
            await dataService.downloadGeoJSON(id, type);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const toggleSortDirection = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const handleCheckboxChange = (id: string) => {
        setSelectedRecords(prev => {
            if (!prev.includes(id)) {
                const newSelectedRecords = [...prev, id];
                if (newSelectedRecords.length === filteredAndSortedRecords.length) {
                    return [];
                }
                return newSelectedRecords;
            }
            return prev.filter(recordId => recordId !== id);
        });
    };

    const handleSelectAll = () => {
        if (selectedRecords.length > 0) {
            setSelectedRecords([]);
        } else {
            setSelectedRecords(filteredAndSortedRecords.map(record => record.id));
        }
    };

    const handleDownloadMultiple = async () => {
        try {
            for (const id of selectedRecords) {
                const record = records.find(r => r.id === id);
                if (record) {
                    await dataService.downloadGeoJSON(id, record.type);
                }
            }
            setSelectedRecords([]); // Clear selection after download
        } catch (error) {
            console.error('Error downloading files:', error);
        }
    };

    return (
        <>
            <div className="page-container">
                <div className="table-container">
                    <div className="table-controls">
                        <div className="search-section">
                            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <div className="action-section">
                            <button 
                                className="download-button"
                                onClick={handleDownloadMultiple}
                                disabled={selectedRecords.length === 0}
                            >
                                Download Selected ({selectedRecords.length})
                            </button>
                        </div>
                    </div>
                    
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        className={
                                            selectedRecords.length > 0 && 
                                            selectedRecords.length < filteredAndSortedRecords.length 
                                                ? 'partial-checked' 
                                                : ''
                                        }
                                        ref={checkbox => {
                                            if (checkbox) {
                                                checkbox.indeterminate = 
                                                    selectedRecords.length > 0 && 
                                                    selectedRecords.length < filteredAndSortedRecords.length;
                                            }
                                        }}
                                        checked={selectedRecords.length === filteredAndSortedRecords.length}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th>Name</th>
                                <th onClick={toggleSortDirection} className="sortable-header">
                                    Date {sortDirection === 'asc' ? '↑' : '↓'}
                                </th>
                                <th>Size</th>
                                <th>Actions</th>
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
                                    <td className='table-results-first-column'>{record.name}</td>
                                    <td>{record.date}</td>
                                    <td>{record.size}</td>
                                    <td>
                                        <button 
                                            className="download-button"
                                            onClick={() => handleDownload(record.id, record.type)}
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
            <Footer />
        </>
    );
}

export default GeoJSONList; 