import React, { useEffect } from "react";
import {
  Box,
  Container,
  CssBaseline,
  MenuItem,
  Select,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import {
  ColumnItem,
  TableComponent,
} from "../../../shared/components/Table.component";
import { CustomerDto } from "../../../shared/dtos/customer.dtos";
import { useLazyGetCustomersQuery } from "../../../shared/services/Customers.service";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserDetailsModal } from "./components/user-details.modal";
import { useLazyGetAdminDepartmentsQuery } from "../../../shared/services/Department.service";
import { useAuth } from "../../../shared/providers/Auth.provider";

export const UsersComponent = () => {
  const top = 5;
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(0);
  const [filterValue, setFilterValue] = useState("");
  const [selectedIncDepts, setIncDepts] = useState("All");
  const [orderUserName, setOrderUserName] = useState<"asc" | "desc">("asc");
  const [fetchDepartments, { data: properties }] =
    useLazyGetAdminDepartmentsQuery();
  const [fetch, { data: customers, isFetching }] = useLazyGetCustomersQuery();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const columns: ColumnItem<CustomerDto>[] = [
    {
      key: "userName",
      label: "LABELS.CUSTOMER_NUMBER",
      onClick: (col) =>
        setOrderUserName(orderUserName === "asc" ? "desc" : "asc"),
    },
    { key: "cust_name", label: "LABELS.NAME" },
    { key: "address", label: "LABELS.ADDRESS" },

    {
      key: "isActive",
      label: "LABELS.STATUS",
      rowRender: (row: CustomerDto) => (row.isActive ? "Active" : "Inactive"),
    },
  ];

  const rateClickHandler = (row: CustomerDto): void => {
    setSelectedUserId(row.userName);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPage(0);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDepartments();
    }
  }, [fetchDepartments, isAuthenticated]);

  useEffect(() => {
    if (selectedUserId) {
      return;
    }
    if (isAuthenticated) {
      fetch({
        $filter: `substringof('${filterValue}',CustomerName) or substringof('${filterValue}',Address) or substringof('${filterValue}',UserName)`,
        incDepts: selectedIncDepts,
        $inlinecount: "allpages",
        $orderby: `UserName ${orderUserName}`,
        $skip: page * top,
        $top: top,
      });
    }
  }, [
    fetch,
    filterValue,
    selectedIncDepts,
    orderUserName,
    page,
    top,
    selectedUserId,
    isAuthenticated,
  ]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
        maxHeight: "calc(100vh - 130px)",
      }}
    >
      <CssBaseline />
      <Container maxWidth="xl" sx={{ mt: "4rem ", mb: "2rem" }}>
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
              {t("ADMIN.USERS.TITLE")}
            </Typography>
            <Box
              className="personal_box_filter_select"
              sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              {t("ADMIN.USERS.FILTERS.DEPTS")}{" "}
              <Select
                labelId="property-select-label"
                label={t("ADMIN.USERS.FILTERS.DEPTS")}
                value={selectedIncDepts}
                onChange={(e) => setIncDepts(e.target.value)}
              >
                <MenuItem key={"All"} value={"All"}>
                  All
                </MenuItem>
                {properties?.map((property) => (
                  <MenuItem key={property.incDept} value={property.incDept}>
                    {property.incDept}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <TextField
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </Box>
          <TableComponent
            aria-label="customers table"
            isLoading={isFetching}
            columns={columns}
            rows={customers?.items || []}
            onItemClick={rateClickHandler}
            className="rates_table"
          />
          <Box
            className="personal_box_footer"
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "space-between",
            }}
          >
            <TablePagination
              rowsPerPageOptions={[top]}
              component="div"
              count={customers?.count || 0}
              rowsPerPage={top}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Box>
      </Container>
      <UserDetailsModal
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        userId={selectedUserId!}
      />
    </Box>
  );
};
