export interface TiffFileResponse {
    tiff_files: {
      id: string;
      last_modified: string;
      size_bytes: number;
    }[];
}

export interface GeoJSONFileResponse {
    geojson_files: {
      id: string;
      last_modified: string;
      size_bytes: number;
    }[];
}

export interface PredictionResponse {
    message: string;
    task_id: string;
}

export interface TaskStatusResponse {
    status: string;
    task_id: string;
}