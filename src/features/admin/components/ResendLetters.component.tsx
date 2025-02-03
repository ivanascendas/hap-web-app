import React, { useEffect, useState } from "react";
import { Box, Button, Checkbox } from "@mui/material";
import { t } from "i18next";
import {
  ColumnItem,
  TableComponent,
} from "../../../shared/components/Table.component";
import { LettersDto, ResendLettersDto } from "../../../shared/dtos/letters.dto";
import {
  useGenerateResendPdfMutation,
  useGetLettersQuery,
  useGetRemaindersQuery,
  useGetResendQuery,
  useLazyGetLettersQuery,
  useRemoveLettersMutation,
} from "../../../shared/services/Letters.service";

export type InvitionLettersProps = {
  selectedIncDepts: string;
  customerFrom: string;
  customerTo: string;
  counter: string;
};

export const ResendLettersComponent = ({
  selectedIncDepts,
  customerFrom,
  customerTo,
  counter,
}: InvitionLettersProps): JSX.Element => {
  const [generatePdf] = useGenerateResendPdfMutation();
  const [removeLetters] = useRemoveLettersMutation();
  const {
    data: letters,
    isFetching,
    refetch,
  } = useGetResendQuery({
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
        `${process.env.REACT_APP_BASE_URL}/api/letters/pdf/${encodeURIComponent(response.data)}`,
        "_blank",
      );
    }
  };

  const handleRemove = async () => {
    console.log("handleRemove");
    try {
      await removeLetters(selectedIds);
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const columns: ColumnItem<ResendLettersDto>[] = [
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
    { key: "address", label: "ADMIN.LETTER.COLUMNS.AGRESSO_ADDRESS" },

    {
      key: "enteredName",
      label: "ADMIN.LETTER.COLUMNS.ENTERED_NAME",
    },
    {
      key: "enteredAddress",
      label: "ADMIN.LETTER.COLUMNS.WEB_ADDRESS",
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
          <Button
            variant="outlined"
            color="secondary"
            sx={{ width: "250px" }}
            className="header_links_pay"
            onClick={handleChange}
          >
            {" "}
            {t("ADMIN.LETTER.BUTTONS.GENERATE_AND_PRINT")}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ width: "250px" }}
            className="header_links_pay"
            onClick={handleRemove}
          >
            {" "}
            {t("ADMIN.LETTER.BUTTONS.REMOVE")}
          </Button>
        </>
      )}
    </Box>
  );
};
