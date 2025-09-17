import { WebDriver, WebElement } from "selenium-webdriver";
import { wait } from "./utils";

type ShowType = {
    title: string,
    creator: string
};

type ScrapedDataType = {
    showsScraped: number,
    data: ShowType[]
};

export class SpotifyScraper {
    #driver: WebDriver;
    #shows_list: WebElement[] = [];
    #currentUrl: string = '';
    #spotifyChartsUrl: string = 'https://podcastcharts.byspotify.com/latam';
    #scrapeData: ScrapedDataType = { showsScraped: 0, data: [] };

    constructor(driver: WebDriver) {
        this.#driver = driver;
    };

    async getTopPodcasts() {
        if(this.#scrapeData.showsScraped !== 0) {
            return this.#scrapeData;
        };
        
        await this.navigateTo(this.#spotifyChartsUrl);
        
        await wait(2000);
        
        await this.getListOfShows();
        await this.getTitleAndCreatorFromShowElementList();
    };
    
    async getListOfShows() {
        this.#shows_list = await this.#driver.findElements({ className: 'w-full md:flex flex-col lg:pr-2 pl-4 md:pl-6' });
    };
    
    async navigateTo(url: string) {
        this.#currentUrl = url;
        await this.#driver.get(this.#spotifyChartsUrl);
    };

    async getTitleAndCreatorFromShowElementList() {
        for (const [idx, show] of this.#shows_list.entries()) {
            const titleElement = await show.findElement({ xpath: ".//div[2]/span/span/span" });
            const creatorElement = await show.findElement({ xpath: ".//div[3]/span/span/span" });
            
            const title = await titleElement.getText();
            const creator = await creatorElement.getText();
            
            this.#scrapeData.data.push({ title, creator });
            
            console.log(`[${idx + 1}] ${title} - ${creator}`);
        };
        this.#scrapeData.showsScraped = (this.#scrapeData.showsScraped + this.#shows_list.length);
        
        return this.#scrapeData.data;
    };
};

export async function spotifyTopPodcasts(driver: WebDriver, url_spotidy_charts: string): Promise<{
    shows_found: number,
    data: {
        title: string,
        creator: string
    }[]
}> {
    const data = [];
    
    await driver.get(url_spotidy_charts);

    await wait(2000);

    const shows_list = await driver.findElements(By.className('w-full md:flex flex-col lg:pr-2 pl-4 md:pl-6'));

    // console.log('shows_list.length:', shows_list.length);

    for (const [idx, show] of shows_list.entries()) {
        const titleElement = await show.findElement(By.xpath(".//div[2]/span/span/span"));
        const creatorElement = await show.findElement(By.xpath(".//div[3]/span/span/span"));
        
        const title = await titleElement.getText();
        const creator = await creatorElement.getText();
        console.log(`[${idx + 1}] ${title} - ${creator}`);
        data.push({ title, creator });
    };

    return {
        shows_found: shows_list.length,
        data
    };
};