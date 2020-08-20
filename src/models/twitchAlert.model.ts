export interface TwitchAlertAccount {
    discord: {
        alertChannelID: Array<string>,
        alertMessage: string
    },
    twitch: {
        userName: string,
        streamTitle?: string,
        type?: string,
        url: string,
    }
}

export interface TwitchAccount {
    id: string,
    user_id: string,
    user_name: string,
    game_id: string,
    type: string,
    title: string,
    viewer_count: number,
    started_at: string,
    language: string,
    thumbnail_url: string,
    tag_ids: Array<string>
}