export interface AdminDto {
  id: string;
  email: string;
  phoneNumber: string;
  twoFactorEnabled: boolean;
  lockoutEndDateUtc: string | null;
  lockoutEnabled: boolean;
  userName: string;
  incDepts: string[];
  password?: string;
}

export interface CreateAdminDto {
  UserName: string;
  Phone: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
  TwoFactorEnabled: boolean;
  LockoutEnabled: boolean;
  IncDepts: string[];
}

export interface UpdatePasswordByAdminDto {
  Id?: string;
  Password: string;
  ConfirmPassword: string;
}

interface AdminRequestDto {
  Phone: string;
  Email: string;
  TwoFactorEnabled: boolean;
  LockoutEnabled: boolean;
  IncDepts: string[];
}

export interface UpdateAdminDto extends AdminRequestDto {
  Id?: string;
}

export interface CreateAdminDto
  extends AdminRequestDto,
    UpdatePasswordByAdminDto {
  UserName: string;
}
