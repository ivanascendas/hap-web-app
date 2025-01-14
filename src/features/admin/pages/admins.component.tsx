import React, { useEffect, useState } from "react";
import { Box, Button, Container, CssBaseline, Typography } from "@mui/material";
import { AdminDetailsModal } from "./components/admin-details.modal";
import { AdminDto } from "../../../shared/dtos/admins.dtos";
import { useLazyGetAdminsQuery } from "../../../shared/services/Admins.service";
import {
  ColumnItem,
  TableComponent,
} from "../../../shared/components/Table.component";

import { useTranslation } from "react-i18next";
import { useAuth } from "../../../shared/providers/Auth.provider";

export const AdminsComponent = () => {
  const [selectedAdmin, setSelectedAdmin] = useState<AdminDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  // const [orderAdminName, setrOrderAdminName] = useState<'asc' | 'desc'>('asc');
  const [fetchAdmins, { data: admins, isFetching }] = useLazyGetAdminsQuery();
  const { t } = useTranslation();
  const columns: ColumnItem<AdminDto>[] = [
    {
      key: "userName",
      label: "ADMIN.MANAGEMENT.ADMIN_NUMBER",
      // onClick: (col) => setrOrderAdminName(orderAdminName === 'asc' ? 'desc' : 'asc')
    },
    { key: "phoneNumber", label: "LABELS.PHONE" },
    { key: "email", label: "LABELS.EMAIL" },

    {
      key: "lockoutEnabled",
      label: "LABELS.STATUS",
      rowRender: (row: AdminDto) =>
        t(
          row.lockoutEnabled
            ? "POPUPS.ADMIN_DETAILS.STATUS.DISABLED"
            : "POPUPS.ADMIN_DETAILS.STATUS.ENABLED",
        ),
    },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdmins();
    }
  }, [isAuthenticated]);

  const handleOpenModal = (admin?: AdminDto) => {
    setSelectedAdmin(admin || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAdmin(null);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    await fetchAdmins();
    handleCloseModal();
  };

  return (
    <Box p={3} sx={{ overflow: "auto", maxHeight: "calc(100vh - 80px)" }}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box className="personal_box ">
          <Box
            className="personal_box_filter"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1.5rem",
              padding: "1rem 0",
            }}
          >
            <Typography
              variant="h5"
              className="personal_box_filter_title"
              sx={{ whiteSpace: "nowrap" }}
            >
              {t("ADMIN.MANAGEMENT.TITLE")}
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              className="header_links_pay"
              onClick={() => handleOpenModal()}
            >
              {t("POPUPS.CREATE_ADMIN.TITLE")}
            </Button>
          </Box>
          <TableComponent
            aria-label="rates table"
            isLoading={isFetching}
            columns={columns}
            rows={admins || []}
            onItemClick={handleOpenModal}
            className="rates_table"
          />
        </Box>
      </Container>

      {isModalOpen && (
        <AdminDetailsModal
          open={isModalOpen}
          admin={selectedAdmin}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </Box>
  );
};
