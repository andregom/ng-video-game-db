export interface Game {
    id: string;
    background_image: string;
    name: string;
    released: string;
    added: string;
    created: string;
    updated: string;
    metacritic: number;
    metacritic_url: string;
    genres: Array<Genre>;
    parent_platforms: Array<ParentPlatform>;
    publishers: Array<Plubisher>;
    rating: number;
    ratings: Array<Rating>;
    website: string;
    description: string;
    screenshots: Array<Screenshot>;
    trailers: Array<Trailer>;
}

export interface Genre {
    name: string;
}

export interface APIResponse<T> {
    results: Array<T>;
}

export interface ParentPlatform {
    platform: {
        slug: string;
    }
}

export interface Plubisher {
    name: string;
}

export interface Rating {
    id: number;
    count: number;
    title: string;
}

export interface Screenshot {
    image: string;
}

export interface Trailer {
    data: {
        max: string;
    }
}