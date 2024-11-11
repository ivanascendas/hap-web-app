import { Box, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import '../Statement.component.scss';
import { useLazyGetBalanceQuery, useLazyGetLoanInfoQuery, useLazyGetPropertiesQuery, useLazyGetStatementsQuery } from "../../../shared/services/Statements.service";
import moment from "moment";
import currency from "../../../shared/utils/currency";
import { useAuth } from "../../../shared/providers/Auth.provider";
import { LoanInfoDto } from "../../../shared/dtos/statement.dtos";
import { ColumnItem, TableComponent } from "../../../shared/components/Table.component";


export type RentsStatementProps = {
    department: string;
};

export const LoanInfoStatementComponent = ({ department }: RentsStatementProps): JSX.Element => {

    const [page, setPage] = useState(0);
    const { t } = useTranslation();

    const { isAuthenticated } = useAuth();
    const [getLoanInfo, { data: loanInfo, isFetching }] = useLazyGetLoanInfoQuery();

    const columns: ColumnItem<LoanInfoDto>[] = [
        {
            key: 'loanNumber', label: 'LOAN_INFO.COLUMNS.LOAN_NUMBER',
        },
        {
            key: 'capitalBalance',
            label: 'LOAN_INFO.COLUMNS.CAPITAL_BALANCE',
            rowRender: (row: LoanInfoDto) => currency.format(row.capitalBalance)
        },
        { key: 'interestRate', label: 'LOAN_INFO.COLUMNS.INTEREST_RATE' },
        {
            key: 'loanEndDate',
            label: 'LOAN_INFO.COLUMNS.LOAN_END_DATE',
            rowRender: (row: LoanInfoDto) => moment(row.loanEndDate).format("DD/MM/YYYY")
        },

    ];

    useEffect(() => {
        if (isAuthenticated) {
            getLoanInfo();
        }
    }, [isAuthenticated]);



    return (<Box className="personal_box ">

        <Box className="personal_box_content">
            <TableComponent isLoading={isFetching} aria-label="loans table" columns={columns} rows={loanInfo ? [loanInfo] : []} />

        </Box>
    </Box>);
};
