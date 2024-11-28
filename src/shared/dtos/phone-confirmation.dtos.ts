export type PhoneConfirmationRequestDto = {
  PhoneNumber: string;
  UserId: string;
};

export type PhoneConfirmationDto = {
  code: string;
  userId: string;
};
