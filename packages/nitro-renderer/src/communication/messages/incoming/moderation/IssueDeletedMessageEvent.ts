import { IMessageEvent } from '#renderer/api';
import { MessageEvent } from '#renderer/events';
import { IssueDeletedMessageParser } from '../../parser';

export class IssueDeletedMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, IssueDeletedMessageParser);
    }

    public getParser(): IssueDeletedMessageParser
    {
        return this.parser as IssueDeletedMessageParser;
    }
}
