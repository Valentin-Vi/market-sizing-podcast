import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(query, (answer) => resolve(answer));
    });
};

type GetUserInputParametersType = {
    url_channel: string,
    title_format: string | undefined,
};

type GetUserInputReturnType = {
    url_channel: string,
    title_format: string | undefined
};

export default async function getUserInput(props?: GetUserInputParametersType): Promise<GetUserInputReturnType> {
    if(props) {
        return {
            url_channel: props.url_channel,
            title_format: props.title_format
        };
    };
    
    const url_channel = await askQuestion('Link del perfil de youtube: ');
    const title_format = await askQuestion('Patron de titlo: ');
    
    rl.close();

    return { url_channel, title_format };
};

export async function readLinesFromFile(filePath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(filePath), 'utf-8', (err, data) => {
        if (err) return reject(err);
        const lines = data
          .split(/\r?\n/)     // handles both Unix and Windows line endings
          .map(line => line.trim())
          .filter(line => line.length > 0); // remove empty lines
        resolve(lines);
      });
    });
  }
