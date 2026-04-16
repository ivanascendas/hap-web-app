export type PhoneConfirmationRequestDto = {
  PhoneNumber: string;
  UserId: string;
  Password?: string;
};

export type PhoneConfirmationDto = {
  code: string;
  userId: string;
};
