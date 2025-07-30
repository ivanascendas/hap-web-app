import React, { useEffect, useTransition } from "react";
import moment from "moment";
import { Box, Button, Checkbox, Skeleton } from "@mui/material";
import currency from "@shared/utils/currency";
import "./MobileInvoicesList.component.scss";
import { InvoiceDto } from "@shared/dtos/invoice.dtos";
import { CheckBox } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export type MobileInvoicesListProps = {
  list: InvoiceDto[];
  isLoading: boolean;
  selectedInvoices: number;
  onClick?: (e: React.ChangeEvent<HTMLInputElement>, row: InvoiceDto) => void;
  loadMore?: () => void;
};
export const MobileInvoicesListComponent = ({
  list,
  loadMore,
  isLoading,
  onClick,
  selectedInvoices,
}: MobileInvoicesListProps): JSX.Element => {
  const [statements, setInvoices] = React.useState<{
    [yearMounth: string]: InvoiceDto[];
  }>({});
  const { t } = useTranslation();
  useEffect(() => {
    const statementsByYearMounth: { [yearMounth: string]: InvoiceDto[] } = {};
    const invoices = [
      list.reduce<InvoiceDto>(
        (acc, payment) => {
          acc.statementDate = payment.statementDate || acc.statementDate;
          acc.invoiceNo = payment.invoiceNo || acc.invoiceNo;
          acc.propertyDescription =
            payment.propertyDescription || acc.propertyDescription;
          acc.total = (acc.total || 0) + (payment.total || 0);
          acc.totalPaid = (acc.totalPaid || 0) + (payment.totalPaid || 0);
          acc.pending = (acc.pending || 0) + (payment.pending || 0);
          acc.voucherNo = payment.voucherNo || acc.voucherNo;
          acc.sequenceNo = payment.sequenceNo || acc.sequenceNo;
          return acc;
        },
        {
          invoiceNo: "",
          propertyDescription: "",
          total: 0,
          totalPaid: 0,
          pending: 0,
          voucherNo: 0,
          sequenceNo: 0,
          issuedOn: null,
          dueDate: null,
        },
      ),
    ];
    invoices.forEach((statement: InvoiceDto) => {
      const yearMounth = moment(statement.statementDate).format("MMM YYYY");
      if (!statementsByYearMounth[yearMounth]) {
        statementsByYearMounth[yearMounth] = [];
      }
      statementsByYearMounth[yearMounth].push(statement);
    });
    setInvoices(statementsByYearMounth);
  }, [list]);

  const handleWrapperClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).tagName === "INPUT") {
      return;
    }

    const checkbox = event.currentTarget.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    if (checkbox) {
      checkbox.click();
    }
  };

  return (
    <Box className="table-invoices-mobile">
      {!isLoading &&
        Object.keys(statements).map((yearMounth: string) => (
          <Box className="table-invoices-mobile_group" key={yearMounth}>
            <Box className="table-invoices-mobile_group_header">
              {yearMounth}
            </Box>

            <Box className="table-invoices-mobile_group_list">
              {statements[yearMounth].map((statemet, i) => (
                <Box
                  onClick={handleWrapperClick}
                  key={yearMounth + i}
                  className={`MuiButtonBase-root MuiButton-root  MuiButton-colorPrimary table-invoices-mobile_group_list_item ${Object.keys(selectedInvoices).some((s) => s === `${statemet.invoiceNo}_${statemet.sequenceNo}_input`) ? "selected" : ""} ripple`}
                >
                  <Box
                    sx={{
                      width: "3.75rem !important",
                      flex: "none",
                      marginLeft: 1,
                    }}
                  >
                    <Box className="table-invoices-mobile_group_list_item_date">
                      <span>{moment(statemet.statementDate).format("DD")}</span>
                      {moment(statemet.statementDate).format("MMM")}
                    </Box>
                  </Box>

                  <Box className="table-invoices-mobile_group_list_item_referance">
                    {statemet.invoiceNo}
                  </Box>

                  <Box
                    className={`table-invoices-mobile_group_list_item_amount `}
                  >
                    <Box className="balance">
                      {currency.format(statemet.total || 0)}
                      <span>
                        {currency.format(statemet.totalPaid || 0)} paid
                      </span>
                    </Box>
                  </Box>
                  <Box className="table-invoices-mobile_group_list_item_chevron">
                    <Checkbox
                      id={`${statemet.invoiceNo}_${statemet.sequenceNo}_input`}
                      onChange={(e) => onClick && onClick(e, statemet)}
                      checked={!!selectedInvoices}
                    />
                  </Box>
                </Box>
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
              className={`MuiButtonBase-root MuiButton-root  MuiButton-colorPrimary table-invoices-mobile_group_list_item `}
            >
              <Box style={{ width: "2.75rem !important", flex: "none" }}>
                <Skeleton
                  variant="rounded"
                  className="table-statements-mobile_group_list_item_date"
                />
              </Box>
              <Box className="table-statements-mobile_group_list_item_referance">
                <Skeleton variant="text" />
              </Box>

              <Box className="table-statements-mobile_group_list_item_chevron">
                <Skeleton variant="rectangular" width={20} height={20} /> &nbsp;
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
