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