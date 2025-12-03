export interface ServiceInterface {
    success?: boolean;
    serviceData?: ServiceDataInterface | [];
    loading?: boolean
}

export interface ServiceDataInterface {
    id: number,
    name: string,
    slug: string,
    service_image_id: number,
    type: string,
    status: number,
    is_primary: number,
    created_by_id: string,
    created_at: string,
    updated_at: string,
    deleted_at: string,
    service_image: ServiceImageDataInterface
}

export interface ServiceImageDataInterface {
    id: number,
    name: string,
    file_name: string,
    mime_type: string,
    disk: string,
    size: string,
    created_by_id: string,
    created_at: string,
    original_url: string,
    preview_url: string
}
