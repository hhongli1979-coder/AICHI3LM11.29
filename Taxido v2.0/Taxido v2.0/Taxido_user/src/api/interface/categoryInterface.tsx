export interface CategoryInterface {
    success?: boolean;
    categoryData?: CategoryDataInterface | [];
    loading?: boolean
}

export interface CategoryDataInterface {
    id: number,
    name: string,
    slug: string,
    service_category_image_id: number,
    category_banner_image_id: string,
    type: string,
    status: number,
    created_by_id: string,
    created_at: string,
    updated_at: string,
    deleted_at: string,
    service_category_image: categoryImageInterface,
    category_banner_image: string
}

export interface categoryImageInterface {
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