export interface BannerInterface {
    success?: boolean;
    data?: BannerDataInterface | any;
    loading?: boolean
}


export interface BannerDataInterface {
    id: number,
    title: string,
    slug: string,
    banner_image_id: number,
    order: string,
    status: number,
    created_by_id: string,
    created_at: string,
    updated_at: string,
    deleted_at: null,
    banner_image: BannerImageInterface
}

export interface BannerImageInterface {
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