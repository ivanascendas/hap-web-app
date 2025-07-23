import React, { useState } from "react";
import { StatementDto } from "@shared/dtos/statement.dtos";
import moment from "moment";
import {
  Box,
  Button,
  Skeleton,
  TablePagination,
  TablePaginationActions,
  Typography,
} from "@mui/material";
import currency from "@shared/utils/currency";
import "./MobileStatementsList.component.scss";
import { t } from "i18next";
import { selectStatementsCount } from "@shared/redux/slices/statementSlice";
import { useSelector } from "react-redux";

export type MobileStatementsListProps = {
  list: StatementDto[];
  isLoading: boolean;
  page: number;
  onClick?: (statement: StatementDto) => void;
  handleChangeRowsPerPage: () => void;
  handleChangePage: (event: unknown, newPage: number) => void;
};
export const MobileStatementsListComponent = ({
  list,
  page,
  isLoading,
  onClick,
  handleChangeRowsPerPage,
  handleChangePage,
}: MobileStatementsListProps): JSX.Element => {
  const statementCount = useSelector(selectStatementsCount);

  return (
    <Box className="table-statements-mobile">
      {!isLoading && (
        <Box className="table-statements-mobile_group">
          <Box className="table-statements-mobile_group_list">
            {list.map((statement, i) => (
              <Button
                fullWidth
                onClick={() => onClick && onClick(statement)}
                key={i}
                className="table-statements-mobile_group_list_item ripple"
                aria-label={`${statement.invoiceNo} - ${statement.sequenceNo}`}
              >
                <Box sx={{ display: "flex", flex: 1 }}>
                  <Typography component={"strong"}>
                    {statement.transType}
                  </Typography>
                  <Box className="table-statements-mobile_group_list_item_date">
                    {moment(statement.statementDate).format("DD MMM YYYY")}
                  </Box>
                </Box>

                <Box
                  className={`table-statements-mobile_group_list_item_amount `}
                >
                  <Typography component={"span"}>
                    {t("RATES.COLUMNS.AMOUNT")}:&nbsp;
                  </Typography>
                  <Typography component={"strong"}>
                    {currency.format(statement.amount)}
                  </Typography>
                </Box>
                <Box
                  className={`table-statements-mobile_group_list_item_amount `}
                >
                  <Typography component={"span"}>
                    {t("RATES.COLUMNS.REFERENCE")}:&nbsp;
                  </Typography>
                  <Typography component={"strong"}>
                    {statement.invoiceNo}
                  </Typography>
                </Box>
                <Box className="table-statements-mobile_group_list_item_footer">
                  <Typography component={"span"}>
                    {t("RATES.COLUMNS.BALANCE")}:&nbsp;
                  </Typography>
                  <Typography component={"strong"} className="negative">
                    {currency.format(statement.balance)}
                  </Typography>
                </Box>
              </Button>
            ))}

            <Box
              className="personal_box_footer"
              sx={{
                display: { md: "flex" },
                marginTop: "3rem",
                justifyContent: "space-between",
              }}
            >
              <TablePagination
                rowsPerPageOptions={[50]}
                component="div"
                count={statementCount || 0}
                rowsPerPage={50}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </Box>
          </Box>
        </Box>
      )}
      {isLoading && (
        <Box className="table-statements-mobile_group">
          <Box className="table-statements-mobile_group_header">
            <Skeleton variant="text" />
          </Box>

          <Box className="table-statements-mobile_group_list">
            <Box
              className={`MuiButtonBase-root MuiButton-root  MuiButton-colorPrimary table-statements-mobile_group_list_item `}
            >
              <Box style={{ width: "3.75rem !important", flex: "none" }}>
                <Skeleton
                  variant="rounded"
                  className="table-statements-mobile_group_list_item_date"
                />
              </Box>
              <Box className="table-statements-mobile_group_list_item_referance">
                <Skeleton variant="text" />
              </Box>

              <Box
                className={`table-statements-mobile_group_list_item_amount `}
              >
                <Skeleton variant="text" />
              </Box>
              <Box className="table-statements-mobile_group_list_item_chevron">
                <Skeleton variant="text" />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
