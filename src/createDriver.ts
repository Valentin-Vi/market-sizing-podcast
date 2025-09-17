import { Browser, Builder, WebDriver } from "selenium-webdriver";

export default async (): Promise<WebDriver> => {
    const driver = await new Builder().forBrowser(Browser.FIREFOX).build();
    driver.manage().setTimeouts({ implicit: 2000 });
    return driver;
};
