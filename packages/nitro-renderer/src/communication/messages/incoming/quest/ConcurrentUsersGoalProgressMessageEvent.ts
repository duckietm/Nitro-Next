import { IMessageEvent } from '#renderer/api';
import { MessageEvent } from '#renderer/events';
import { ConcurrentUsersGoalProgressMessageParser } from '../../parser';

export class ConcurrentUsersGoalProgressMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, ConcurrentUsersGoalProgressMessageParser);
    }

    public getParser(): ConcurrentUsersGoalProgressMessageParser
    {
        return this.parser as ConcurrentUsersGoalProgressMessageParser;
    }
}
