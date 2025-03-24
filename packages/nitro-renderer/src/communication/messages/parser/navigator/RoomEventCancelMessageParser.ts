import { IMessageDataWrapper, IMessageParser } from '#renderer/api';

export class RoomEventCancelMessageParser implements IMessageParser
{
    public flush(): boolean
    {
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        return true;
    }

}
