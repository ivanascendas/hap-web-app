export type EmailConfirmationRequestDto = {
  EmailId: string;
  UserId: string;
};

export type EmailConfirmationDto = {
  code: string;
  userId: string;
};
