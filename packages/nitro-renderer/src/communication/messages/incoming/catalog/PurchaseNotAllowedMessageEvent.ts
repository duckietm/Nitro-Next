import { IMessageEvent } from '#renderer/api';
import { MessageEvent } from '#renderer/events';
import { PurchaseNotAllowedMessageParser } from '../../parser';

export class PurchaseNotAllowedMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, PurchaseNotAllowedMessageParser);
    }

    public getParser(): PurchaseNotAllowedMessageParser
    {
        return this.parser as PurchaseNotAllowedMessageParser;
    }
}
