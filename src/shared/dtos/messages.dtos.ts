import { PaggingBaseDto } from "./pagging-base.request";

export interface MessagesRequestDto extends PaggingBaseDto {
    apar_id: number;
}

export interface NotificationDto {
    notificationId: number;
    title: string;
    message: string;
    sentDate: Date;
    isRead: boolean;
}