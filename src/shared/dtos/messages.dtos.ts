import { PaggingBaseDto } from "./pagging-base.request";

export interface MessagesRequestDto extends PaggingBaseDto {
  apar_id: number;
}

export interface NotificationsSendDto {
  customerNumbers?: number[];
  title: string;
  message: string;
}

export interface NotificationsExcelSendDto {
  file: File;
  model: NotificationsSendDto;
}

export interface NotificationDto {
  notificationId: number;
  title: string;
  message: string;
  sentDate: Date;
  isRead: boolean;
}

export interface NotificationReportDto extends NotificationDto {
  id: number;
  androidSuccessCount: number;
  iosSuccessCount: number;
  androidFailedCount: number;
  iosFailedCount: number;
  notificationCount: number;
}
