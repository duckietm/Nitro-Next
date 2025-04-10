import { IMessageEvent } from '#renderer/api';
import { MessageEvent } from '#renderer/events';
import { GuideSessionDetachedMessageParser } from '../../parser';

export class GuideSessionDetachedMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, GuideSessionDetachedMessageParser);
    }

    public getParser(): GuideSessionDetachedMessageParser
    {
        return this.parser as GuideSessionDetachedMessageParser;
    }
}
