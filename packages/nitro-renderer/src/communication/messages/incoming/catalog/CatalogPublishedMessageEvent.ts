import { IMessageEvent } from '#renderer/api';
import { MessageEvent } from '#renderer/events';
import { CatalogPublishedMessageParser } from '../../parser';

export class CatalogPublishedMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, CatalogPublishedMessageParser);
    }

    public getParser(): CatalogPublishedMessageParser
    {
        return this.parser as CatalogPublishedMessageParser;
    }
}
