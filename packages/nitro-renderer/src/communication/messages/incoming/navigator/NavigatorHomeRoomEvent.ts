import { IMessageEvent } from '#renderer/api';
import { MessageEvent } from '#renderer/events';
import { NavigatorHomeRoomParser } from '../../parser';

export class NavigatorHomeRoomEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, NavigatorHomeRoomParser);
    }

    public getParser(): NavigatorHomeRoomParser
    {
        return this.parser as NavigatorHomeRoomParser;
    }
}
