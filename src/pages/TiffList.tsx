import { useState, useMemo, useEffect } from 'react';
import '../styles/Table.css';
import { DataHandlerService } from '../application/Application/DataHandlerService';
import { TiffRecord } from '../application/Domain/Records';
import { PredictionResponse } from '../application/Domain/Response';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import Footer from '../components/layout/Footer';

const MODEL_OPTIONS = [
    {
        value: 'VPP 2024',
        label: 'VPP 2024',
        description: 'Latest model used for segmentation and prediction of hearth tissue structures'
    },
    // {
    //     value: 'VPP 2023',
    //     label: 'VPP 2023',
    //     description: 'Legacy model for vegetation pattern processing'
    // }
];

function TiffList() {
    const [records, setRecords] = useState<TiffRecord[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pollingTasks, setPollingTasks] = useState<Set<string>>(new Set());
    const [selectedModel, setSelectedModel] = useState<string>('VPP 2024');
    const dataService = new DataHandlerService();

    // Load records and check for existing tasks
    useEffect(() => {
        const fetchTiffFiles = async () => {
            try {
                const response = await dataService.getTiffFiles();
                const storedTasks = dataService.getStoredTasks();
                
                const formattedRecords: TiffRecord[] = response.tiff_files.map(file => {
                    // Find if this record has an associated task
                    const associatedTask = storedTasks.find(task => 
                        task.recordIds.includes(file.id)
                    );
                    
                    return {
                        id: file.id,
                        name: `${file.id}.tiff`,
                        date: file.last_modified,
                        size: `${(file.size_bytes).toFixed(2)} MB`,
                        status: associatedTask ? 'Processing' : 'Ready',
                        taskId: associatedTask?.taskId
                    };
                });
                
                setRecords(formattedRecords);
                
                // Add stored tasks to polling
                const storedTaskIds = new Set(storedTasks.map(task => task.taskId));
                setPollingTasks(storedTaskIds);
            } catch (error) {
                console.error('Error fetching TIFF files:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTiffFiles();
    }, []);

    // Status polling effect
    useEffect(() => {
        const a = Array.from(pollingTasks);
        if (a[0] === undefined) return;
        
        const pollInterval = setInterval(async () => {
            const updatedRecords = [...records];
            let tasksCompleted = new Set<string>();
            
            console.log(pollingTasks);
            for (const taskId of pollingTasks) {
                try {
                    const status = await dataService.checkTaskStatus(taskId);
                    // Only update records that have this specific taskId
                    updatedRecords.forEach((record, index) => {
                        if (record.taskId === taskId) {
                            updatedRecords[index] = {
                                ...record,
                                status: status.status
                            };
                            
                            if (status.status === 'Success') {
                                tasksCompleted.add(taskId);
                                dataService.removeTask(taskId);
                            }
                        }
                    });
                } catch (error) {
                    console.error('Error polling status:', error);
                }
            }
            
            setRecords(updatedRecords);
            
            // Remove completed tasks from polling
            if (tasksCompleted.size > 0) {
                setPollingTasks(prev => {
                    const newTasks = new Set(prev);
                    tasksCompleted.forEach(taskId => newTasks.delete(taskId));
                    return newTasks;
                });
            }
        }, 5000);

        return () => clearInterval(pollInterval);
    }, [pollingTasks, records]);

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
            // If we're adding a new selection
            if (!prev.includes(id)) {
                const newSelectedRecords = [...prev, id];
                // If after adding this selection we have all records selected,
                // clear the selection
                if (newSelectedRecords.length === filteredAndSortedRecords.length) {
                    return [];
                }
                return newSelectedRecords;
            }
            // If we're removing a selection, just remove it
            return prev.filter(recordId => recordId !== id);
        });
    };

    const handleSelectAll = () => {
        if (selectedRecords.length > 0) {
            // If any records are selected, clear the selection
            setSelectedRecords([]);
        } else {
            // If no records are selected, select all
            setSelectedRecords(filteredAndSortedRecords.map(record => record.id));
        }
    };

    const handleProcess = async () => {
        try {
            let response: PredictionResponse | undefined;
            if (selectedModel === 'VPP 2024') {
                response = await dataService.predictStructureVPP2024(selectedRecords);
            } else if (selectedModel === 'VPP 2023') {
                // TODO: Implement new model
            }
            
            if (response === undefined) {
                throw new Error('No response from prediction');
            } else {
                // Store task information
                dataService.storeTask(response!.task_id, selectedRecords);
                
                // Update records with task ID and initial status
                setRecords(prev => prev.map(record => {
                    if (selectedRecords.includes(record.id)) {
                        return {
                            ...record,
                            status: 'Processing',
                            taskId: response!.task_id
                        };
                    }
                    return record;
                }));
                
                // Add task to polling set
                setPollingTasks(prev => new Set(prev).add(response!.task_id));
                
                setSelectedRecords([]); // Clear selection
            }
        } catch (error) {
            console.error('Error processing records:', error);
        }
    };

    const toggleSortDirection = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
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
                            {/* <button className="icon-button">
                                <DeleteIcon />
                            </button> */}
                        </div>
                        <div className="action-section">
                            <select 
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className="model-select-inline"
                            >
                                <option value="">Select model</option>
                                {MODEL_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <button 
                                className="process-button"
                                onClick={handleProcess}
                                disabled={selectedRecords.length === 0}
                            >
                                Process Selected ({selectedRecords.length})
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
                                <th onClick={toggleSortDirection}>
                                    Date {sortDirection === 'asc' ? '↑' : '↓'}
                                </th>
                                {/* <th>Model</th> */}
                                <th>Status</th>
                                {/* <th>Results</th> */}
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
                                    <td>{record.name}</td>
                                    <td>{record.date}</td>
                                    {/* <td>
                                        <select className="model-select-inline">
                                            <option value="">Select model</option>
                                            {MODEL_OPTIONS.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </td> */}
                                    <td>
                                        <span className={`status-badge status-${record.status.toLowerCase()}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    {/* <td>
                                        {record.status === 'Processed' && (
                                            <button className="icon-button">
                                                <DownloadIcon />
                                            </button>
                                        )}
                                    </td> */}
                                    <td>
                                        <button className="icon-button">
                                            <DeleteIcon />
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

export default TiffList; 