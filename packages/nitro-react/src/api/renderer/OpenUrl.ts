import { CreateLinkEvent, HabboWebTools } from '@nitrodevco/nitro-renderer';

export const OpenUrl = (url: string) =>
{
    if (!url || !url.length) return;

    if (url.startsWith('http'))
    {
        HabboWebTools.openWebPage(url);
    }
    else
    {
        CreateLinkEvent(url);
    }
};
