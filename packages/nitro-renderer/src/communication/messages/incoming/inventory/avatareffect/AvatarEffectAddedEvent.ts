﻿import { IMessageEvent } from '#renderer/api';
import { MessageEvent } from '#renderer/events';
import { AvatarEffectAddedParser } from '../../../parser';

export class AvatarEffectAddedEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, AvatarEffectAddedParser);
    }

    public getParser(): AvatarEffectAddedParser
    {
        return this.parser as AvatarEffectAddedParser;
    }
}
