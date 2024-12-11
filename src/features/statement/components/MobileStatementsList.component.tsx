import React, { useEffect } from "react";
import { StatementDto } from "../../../shared/dtos/statement.dtos";
import moment from "moment";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import currency from "../../../shared/utils/currency";
import "./MobileStatementsList.component.scss";

export type MobileStatementsListProps = {
  list: StatementDto[];
  isLoading: boolean;
  onClick?: (statement: StatementDto) => void;
  loadMore: () => void;
};
export const MobileStatementsListComponent = ({
  list,
  loadMore,
  isLoading,
  onClick,
}: MobileStatementsListProps): JSX.Element => {
  const [statements, setStatements] = React.useState<{
    [yearMounth: string]: StatementDto[];
  }>({});

  useEffect(() => {
    const statementsByYearMounth: { [yearMounth: string]: StatementDto[] } = {};
    list.forEach((statement: StatementDto) => {
      const yearMounth = moment(statement.statementDate).format("MMM YYYY");
      if (!statementsByYearMounth[yearMounth]) {
        statementsByYearMounth[yearMounth] = [];
      }
      statementsByYearMounth[yearMounth].push(statement);
    });
    setStatements(statementsByYearMounth);
  }, [list]);

  return (
    <Box className="table-statements-mobile">
      {!isLoading &&
        Object.keys(statements).map((yearMounth: string) => (
          <Box className="table-statements-mobile_group" key={yearMounth}>
            <Box className="table-statements-mobile_group_header">
              {yearMounth}
            </Box>

            <Box className="table-statements-mobile_group_list">
              {statements[yearMounth].map((statement, i) => (
                <Button
                  fullWidth
                  onClick={() => onClick && onClick(statement)}
                  key={yearMounth + i}
                  className="table-statements-mobile_group_list_item ripple"
                  aria-label={`${statement.invoiceNo} - ${statement.sequenceNo}`}
                >
                  <Box style={{ width: "3.75rem !important", flex: "none" }}>
                    <Box className="table-statements-mobile_group_list_item_date">
                      <span>
                        {moment(statement.statementDate).format("DD")}
                      </span>
                      {moment(statement.statementDate).format("MMM")}
                    </Box>
                  </Box>
                  <Box className="table-statements-mobile_group_list_item_referance">
                    {statement.invoiceNo}
                  </Box>

                  <Box
                    className={`table-statements-mobile_group_list_item_amount ${statement.transType == "Invoice" ? "text_red" : "clr_green"}`}
                  >
                    {currency.format(statement.amount)}
                  </Box>
                  <Box className="table-statements-mobile_group_list_item_chevron">
                    <ChevronRightIcon fontSize="large" />
                  </Box>
                </Button>
              ))}
            </Box>
          </Box>
        ))}
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
                <ChevronRightIcon fontSize="large" />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
