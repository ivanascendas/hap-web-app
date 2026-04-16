export type EmailConfirmationRequestDto = {
  EmailId: string;
  UserId: string;
  Password?: string;
};

export type EmailConfirmationDto = {
  code: string;
  userId: string;
};
