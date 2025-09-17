import getUserInput from "./user-input";
import * as scrape from  "./scraper_from_youtube";
import * as scrape_spotify_scharts from "./scraper_from_spotify";
import { writeFile } from 'fs';
import { readLinesFromFile } from "./user-input";
import { WebDriver } from "selenium-webdriver";
import ChannelStats from "./ChannelStats";
import createDriver from "./createDriver";

async function scrapeFromYoutubeLink(driver: WebDriver, url_channel?: string, title_format?: string): Promise<ChannelStats | void> {    
    let show_info;
    if(url_channel) {
        show_info = await getUserInput({ url_channel, title_format });
    } else {
        show_info = await getUserInput();
    };

    return await scrape.extractViewsData(driver, show_info.url_channel, show_info.title_format);
};

// readLinesFromFile('data/links.txt').then(async (links) => {
//     const driver = await createDriver();
//     let data = [];
//     for (const [idx, link] of links.entries()) {
//         data.push(await scrapeFromYoutubeLink(driver, link, ''))
//     };

//     writeFile('data/output.txt', JSON.stringify(data, null, 2), (err) => {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log('Done.');
//         };
//     });

//     driver.close();
//     driver.quit();
// });

readLinesFromFile('data/links.txt').then(async (links) => {
    const driver = await createDriver();
    const data = await scrape_spotify_scharts.spotifyTopPodcasts(driver, 'https://podcastcharts.byspotify.com/latam');
    console.log('show_listed:', data.shows_found);
    writeFile('data/top_podcasts_argentina.txt', JSON.stringify(data.data, null, 2), (err) => {
        if(err) {
            // console.log(err);
        } else {
            console.log('Done.');
        };
    });

    driver.close();
    driver.quit();
});