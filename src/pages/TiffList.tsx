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
    const [pollingTasks, setPollingTasks] = useState<Set<string>>(new Set());
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
            const response = await dataService.predictStructure(selectedRecords);
            
            // Store task information
            dataService.storeTask(response.task_id, selectedRecords);
            
            // Update records with task ID and initial status
            setRecords(prev => prev.map(record => {
                if (selectedRecords.includes(record.id)) {
                    return {
                        ...record,
                        status: 'Processing',
                        taskId: response.task_id
                    };
                }
                return record;
            }));
            
            // Add task to polling set
            setPollingTasks(prev => new Set(prev).add(response.task_id));
            
            setSelectedRecords([]); // Clear selection
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