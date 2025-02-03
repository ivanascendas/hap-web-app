import {
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Container,
  CssBaseline,
  TextField,
  MenuItem,
  Select,
  Checkbox,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./letters.component.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyGetAdminDepartmentsQuery } from "../../../shared/services/Department.service";
import { useAuth } from "../../../shared/providers/Auth.provider";
import { useLazyGetLettersQuery } from "../../../shared/services/Letters.service";
import { get } from "http";
import { LettersDto } from "../../../shared/dtos/letters.dto";
import {
  ColumnItem,
  TableComponent,
} from "../../../shared/components/Table.component";
import { InvitionLettersComponent } from "../components/InvitionLetters.component";
import { ReminderLettersComponent } from "../components/ReminderLetters.component";

export const LettersComponent = () => {
  const { type } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedIncDepts, setIncDepts] = useState("");
  const [fetchDepartments, { data: properties }] =
    useLazyGetAdminDepartmentsQuery();
  const [customerFrom, setCustomerFrom] = useState("");
  const [customerTo, setCustomerTo] = useState("");
  const [counter, setCounter] = useState("50");
  const [getLetters, { data: letters, isFetching }] = useLazyGetLettersQuery();
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    navigate(`/admin/letters/${newAlignment}`);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDepartments();
    }
  }, [fetchDepartments, isAuthenticated]);

  useEffect(() => {
    if (selectedIncDepts) {
      getLetters({
        idFrom: customerFrom,
        idTo: customerTo,
        take: parseInt(counter),
        skip: 0,
        IncDept: selectedIncDepts,
      });
    }
  }, [selectedIncDepts, customerFrom, customerTo, counter]);

  const columns: ColumnItem<LettersDto>[] = [
    {
      key: "aparId",
      label: "ADMIN.LETTER.COLUMNS.CUSTOMER_NUMBER",
      colRnder() {
        return (
          <Box>
            <Checkbox /> &nbsp;
            <span> {t("ADMIN.LETTER.COLUMNS.CUSTOMER_NUMBER")}</span>
          </Box>
        );
      },
      rowRender(row) {
        return (
          <Box>
            <Checkbox /> &nbsp;
            <span> {row.aparId}</span>
          </Box>
        );
      },
      // onClick: (col) => setrOrderAdminName(orderAdminName === 'asc' ? 'desc' : 'asc')
    },
    { key: "customerName", label: "ADMIN.LETTER.COLUMNS.AGRESSO_NAME" },
    { key: "address", label: "ADMIN.LETTER.COLUMNS.AGRESSO_ADDRESS" },

    {
      key: "revcollName",
      label: "ADMIN.LETTER.COLUMNS.ENTERED_NAME",
    },
  ];

  return (
    <Box className="letters">
      <Box className="admin-container__header">
        <ToggleButtonGroup
          color="primary"
          value={type}
          exclusive
          onChange={handleChange}
          aria-label="Letter Type"
        >
          <ToggleButton value="InvitationLetter">
            {t("ADMIN.LETTER.INVITATION_TITLE")}
          </ToggleButton>
          <ToggleButton value="ReminderLetter">
            {t("ADMIN.LETTER.REMINDER_TITLE")}
          </ToggleButton>
          <ToggleButton value="SignupLetter">
            {t("ADMIN.LETTER.SIGNUP_TITLE")}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <CssBaseline />
      <Box className="letters__container">
        <Container maxWidth="xl">
          <Box className="letters__filters">
            <TextField
              label={t("ADMIN.LETTER.CUSTOMER_FROM")}
              value={customerFrom}
              onChange={(e) => setCustomerFrom(e.target.value)}
            />
            <TextField
              value={customerTo}
              onChange={(e) => setCustomerTo(e.target.value)}
              label={t("ADMIN.LETTER.CUSTOMER_TO")}
            />
            <TextField
              value={counter}
              onChange={(e) => setCounter(e.target.value)}
              label={t("ADMIN.LETTER.COUNTER")}
            />
            <Select
              labelId="property-select-label"
              label={t("ADMIN.LETTER.DEPT")}
              value={selectedIncDepts}
              onChange={(e) => setIncDepts(e.target.value)}
            >
              {properties?.map((property) => (
                <MenuItem key={property.incDept} value={property.incDept}>
                  {property.incDept}
                </MenuItem>
              ))}
            </Select>
          </Box>
          {type === "InvitationLetter" && selectedIncDepts && (
            <InvitionLettersComponent
              selectedIncDepts={selectedIncDepts}
              customerFrom={customerFrom}
              customerTo={customerTo}
              counter={counter}
            />
          )}
          {type === "ReminderLetter" && selectedIncDepts && (
            <ReminderLettersComponent
              selectedIncDepts={selectedIncDepts}
              customerFrom={customerFrom}
              customerTo={customerTo}
              counter={counter}
            />
          )}
        </Container>
      </Box>
    </Box>
  );
};
