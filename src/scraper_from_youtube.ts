import { Builder, Browser, By, WebElement, WebDriver } from 'selenium-webdriver';
import ChannelStats, { ViewData } from './ChannelStats';

export async function extractViewsData(driver: WebDriver, url_channel: string, title_patern?: string): Promise<ChannelStats | void> {
    let videos_scraped = 0;
    let total_views: number = 0;
    let views_data: ViewData[] = [];
    let most_views_in_a_single_video: number = 0;
    let least_views_in_a_single_video: number = 100000000;
    
    await driver.get(url_channel + '/videos'); // Go to videos tab of channel's profile.
    
    const content_list = await getContent(driver, title_patern);
    videos_scraped = content_list.length;

    for(const [idx, entry] of content_list.entries()) {
        try {
            const title_element = await entry.findElement(By.id('video-title-link'));
            const title = await (await title_element.findElement(By.xpath('./*'))).getText();
            const link = await title_element.getAttribute('href');
            const metadata = await entry.findElement(By.id('metadata-line'));
            const views = await parseViews((await (await metadata.findElements(By.xpath('./*')))[2].getText()).split(' ')[0]);
            const uploaded: string = await (await metadata.findElements(By.xpath('./*')))[3].getText();
            
            if(views > most_views_in_a_single_video) {
                most_views_in_a_single_video = views;
            } else if(views < least_views_in_a_single_video) {
                least_views_in_a_single_video = views;
            };
    
            total_views = total_views + views;
            views_data.push({ id: idx, title, views, uploaded, link });
        } catch(err) {
            continue;
        };
    };

    return {
        url: url_channel,
        videos_scraped,
        uploads: {
            total_views,
            median: total_views / videos_scraped,
            most_views_in_a_single_video,
            least_views_in_a_single_video,
            views_data
        }
    };
};

async function reduceToMatchingTitle(elements: WebElement[], title_patterm: string): Promise<WebElement[]> {
    const filtered = [];
    for (const el of elements) {
        const titelElement = await el.findElement(By.className('yt-simple-endpoint focus-on-expand style-scope ytd-rich-grid-media'));
        const title = await titelElement.getText();
        if(title.includes(title_patterm)) {
            filtered.push(el);
        };
    };
    return filtered;
};


export async function getContent(driver: WebDriver, title_patern?: string): Promise<WebElement[]> {
    let content_table = await driver.findElement(By.xpath('//*[@id="contents"]'));
    let content_list = await content_table.findElements(By.xpath('./*'));
    
    if(title_patern) {
        content_list = await reduceToMatchingTitle(content_list, title_patern);
    };
    return content_list ?? [];
};

async function parseViews(views_string: string): Promise<number> {
    const measurements: { [key: string]: number } = {
        K: 1000,
        M: 1000000,
        B: 1000000000
    };
    
    const match = views_string.match(/^(\d+(?:\.\d+)?)([a-zA-Z])$/);
    if(!match) {
        throw new Error(`Invalid views string: ${views_string}`);
    };
    const number = parseInt(match[1]);
    const unit = match[2].toUpperCase();

    return number * measurements[unit];
};
