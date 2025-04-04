import { IMessageDataWrapper, IMessageParser } from '#renderer/api';

export class PollOfferParser implements IMessageParser
{
    private _id = -1;
    private _type = '';
    private _headline = '';
    private _summary = '';

    public flush(): boolean
    {
        this._id = -1;
        this._type = '';
        this._summary = '';
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        this._id = wrapper.readInt();
        this._type = wrapper.readString();
        this._headline = wrapper.readString();
        this._summary = wrapper.readString();
        return true;
    }

    public get id(): number
    {
        return this._id;
    }

    public get type(): string
    {
        return this._type;
    }

    public get headline(): string
    {
        return this._headline;
    }

    public get summary(): string
    {
        return this._summary;
    }
}
