import { IMessageEvent } from '#renderer/api';
import { MessageEvent } from '#renderer/events';
import { CompetitionRoomsDataMessageParser } from '../../parser';

export class CompetitionRoomsDataMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, CompetitionRoomsDataMessageParser);
    }

    public getParser(): CompetitionRoomsDataMessageParser
    {
        return this.parser as CompetitionRoomsDataMessageParser;
    }
}
