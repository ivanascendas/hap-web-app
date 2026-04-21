import React from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { AdminDto, UserRoleName } from "@shared/dtos/admins.dtos";
import { useTranslation } from "react-i18next";

const assignableRoles: UserRoleName[] = [
  "DMU_L1",
  "DMU_L2",
  "AP",
  "SuperAdmin",
];

const roleLabels: Partial<Record<UserRoleName, string>> = {
  DMU_L1: "L1",
  DMU_L2: "L2",
  AP: "AP",
  SuperAdmin: "SuperAdmin",
};

export const hasAssignableRole = (admin: AdminDto): boolean =>
  admin.roles.some((role) => assignableRoles.includes(role));

export const formatAdminRoleLabels = (roles: UserRoleName[]): string =>
  roles
    .filter((role) => assignableRoles.includes(role))
    .map((role) => roleLabels[role] || role)
    .join(", ");

export const getAdminOptionLabel = (admin: AdminDto): string => {
  const roles = formatAdminRoleLabels(admin.roles);
  return roles ? `${admin.userName} - ${roles}` : admin.userName;
};

export interface BulkReassignControlsProps {
  adminOptions: AdminDto[];
  selectedAdmin: AdminDto | null;
  selectedCount: number;
  isAdminLoading?: boolean;
  isBulkAssigning?: boolean;
  onSelectedAdminChange: (admin: AdminDto | null) => void;
  onApplyBulkAssign: () => void;
}

export const BulkReassignControls: React.FC<BulkReassignControlsProps> = ({
  adminOptions,
  selectedAdmin,
  selectedCount,
  isAdminLoading = false,
  isBulkAssigning = false,
  onSelectedAdminChange,
  onApplyBulkAssign,
}) => {
  const { t } = useTranslation();
  const isApplyDisabled =
    selectedCount === 0 || !selectedAdmin || isAdminLoading || isBulkAssigning;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexWrap: "wrap",
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 86 }}>
        {t("REFUNDS.BULK_REASSIGN.SELECTED_COUNT", {
          count: selectedCount,
        })}
      </Typography>
      <Autocomplete
        size="small"
        options={adminOptions}
        loading={isAdminLoading}
        value={selectedAdmin}
        onChange={(_, newValue) => onSelectedAdminChange(newValue)}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={getAdminOptionLabel}
        noOptionsText={t("REFUNDS.BULK_REASSIGN.NO_ADMINS")}
        sx={{ minWidth: 260, maxWidth: 360, flex: "1 1 260px" }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("REFUNDS.BULK_REASSIGN.ASSIGN_TO_ADMIN")}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isAdminLoading ? (
                    <CircularProgress color="inherit" size={18} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <Button
        variant="contained"
        onClick={onApplyBulkAssign}
        disabled={isApplyDisabled}
        sx={{ minWidth: 92 }}
      >
        {isBulkAssigning ? (
          <CircularProgress color="inherit" size={20} />
        ) : (
          t("REFUNDS.BULK_REASSIGN.APPLY")
        )}
      </Button>
    </Box>
  );
};
