import { GetRoomEngine } from '@nitrodevco/nitro-renderer';

export function ProcessRoomObjectOperation(objectId: number, category: number, operation: string): void
{
    GetRoomEngine().processRoomObjectOperation(objectId, category, operation);
}
