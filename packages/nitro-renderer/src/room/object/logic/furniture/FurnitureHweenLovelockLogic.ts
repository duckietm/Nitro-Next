import { FriendFurniEngravingWidgetType } from '#renderer/api';
import { FurnitureFriendFurniLogic } from './FurnitureFriendFurniLogic';

export class FurnitureHweenLovelockLogic extends FurnitureFriendFurniLogic
{
    public get engravingDialogType(): number
    {
        return FriendFurniEngravingWidgetType.HABBOWEEN;
    }
}
