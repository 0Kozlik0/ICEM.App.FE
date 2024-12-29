export interface TiffRecord {
    id: string;
    name: string;
    date: string;
    size: string;
    status: string;
    taskId?: string;
}

export interface GeoJSONRecord {
    id: string;
    name: string;
    date: string;
    size: string;
    type: 'tissue' | 'cell';
}