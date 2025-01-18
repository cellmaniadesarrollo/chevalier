export interface ListtiktokvideosI {

    create_time?: any;
    duration?: any;
    is_top?: any;
    play_count?: any;
    title?: any;
    video_id?: any;
    _id?: any;
}
export interface ListfacebookphotosI {
    source: any;
    id: any;
    link: any;
    name: any;
    from: PerfilI;
    likes: LikesI;
}
export interface PerfilI {
    id: any; 
    name: any;
}
export interface LikesI {
    summary:{total_count: any;}
}