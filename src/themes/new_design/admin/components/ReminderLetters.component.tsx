import React, { useEffect, useState } from "react";
import { Box, Button, Checkbox } from "@mui/material";
import { t } from "i18next";
import { ColumnItem, TableComponent } from "@shared/components/Table.component";
import { LettersDto } from "@shared/dtos/letters.dto";
import {
  useGenerateReminderPdfMutation,
  useGetLettersQuery,
  useGetRemaindersQuery,
  useLazyGetLettersQuery,
} from "@shared/services/Letters.service";
import { useConfig } from "@shared/providers/Configuration.provider";
import { MaskedField } from "@shared/components/MaskedField";

export type InvitionLettersProps = {
  selectedIncDepts: string;
  customerFrom: string;
  customerTo: string;
  counter: string;
};

export const ReminderLettersComponent = ({
  selectedIncDepts,
  customerFrom,
  customerTo,
  counter,
}: InvitionLettersProps): JSX.Element => {
  const [generatePdf] = useGenerateReminderPdfMutation();
  const { config } = useConfig();
  const { data: letters, isFetching } = useGetRemaindersQuery({
    idFrom: customerFrom,
    idTo: customerTo,
    take: parseInt(counter),
    skip: 0,
    IncDept: selectedIncDepts,
  });

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  useEffect(() => {
    setSelectedIds([]);
  }, [selectedIncDepts]);

  const toogleSelectAll = () => {
    if (letters?.items.length === selectedIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(letters?.items.map((letter) => letter.aparId) || []);
    }
  };

  const toogleSelectId = (id: number) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
  };

  const handleChange = async () => {
    const response = await generatePdf({
      ids: selectedIds,
      incDept: selectedIncDepts,
    });

    if (response && response.data) {
      window.open(
        `${config?.baseUrl}/api/letters/pdf/${encodeURIComponent(response.data)}`,
        "_blank",
      );
    }
  };

  const columns: ColumnItem<LettersDto>[] = [
    {
      key: "aparId",
      label: "ADMIN.LETTER.COLUMNS.CUSTOMER_NUMBER",
      colRnder() {
        return (
          <Box>
            <Checkbox
              checked={letters?.items.length === selectedIds.length}
              onChange={toogleSelectAll}
            />{" "}
            &nbsp;
            <span> {t("ADMIN.LETTER.COLUMNS.CUSTOMER_NUMBER")}</span>
          </Box>
        );
      },
      rowRender(row) {
        return (
          <Box>
            <Checkbox
              checked={selectedIds.includes(row.aparId)}
              onChange={() => toogleSelectId(row.aparId)}
            />{" "}
            &nbsp;
            <span> {row.aparId}</span>
          </Box>
        );
      },
      // onClick: (col) => setrOrderAdminName(orderAdminName === 'asc' ? 'desc' : 'asc')
    },
    { key: "customerName", label: "ADMIN.LETTER.COLUMNS.AGRESSO_NAME" },
    {
      key: "address",
      label: "ADMIN.LETTER.COLUMNS.AGRESSO_ADDRESS",
      rowRender: (row) => <MaskedField value={row.address} type="address" />,
    },

    {
      key: "revcollName",
      label: "ADMIN.LETTER.COLUMNS.ENTERED_NAME",
    },
  ];

  return (
    <Box>
      {letters?.count && (
        <>
          <TableComponent
            aria-label="rates table"
            isLoading={isFetching}
            columns={columns}
            rows={letters?.items || []}
            className="rates_table"
          />

          <Box sx={{ maxWidth: "10rem", flex: "none" }}>
            <button
              color="secondary"
              className="btn-primary"
              onClick={handleChange}
            >
              {" "}
              {t("ADMIN.LETTER.BUTTONS.GENERATE_AND_PRINT")}
            </button>
          </Box>
        </>
      )}
    </Box>
  );
};
