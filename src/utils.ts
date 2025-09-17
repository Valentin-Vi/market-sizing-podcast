
export async function wait(ms: number): Promise<void> {
    await new Promise(res => setTimeout(res, ms));
};
