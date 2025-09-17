export type ViewData = {
    id: number,
    title: string,
    views: number,
    uploaded: string,
    link: string,
};

type ChannelViews = {
    total_views: number
    median: number | undefined
    most_views_in_a_single_video: number
    least_views_in_a_single_video: number
    views_data: ViewData[]
};

type ChannelStats = {
    url: string
    videos_scraped: number
    uploads: ChannelViews
};

export default ChannelStats;
