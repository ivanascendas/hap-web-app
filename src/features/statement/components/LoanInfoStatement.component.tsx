import { Box, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import '../Statement.component.scss';
import { useLazyGetBalanceQuery, useLazyGetLoanInfoQuery, useLazyGetPropertiesQuery, useLazyGetStatementsQuery } from "../../../shared/services/Statements.service";
import moment from "moment";
import currency from "../../../shared/utils/currency";
import { useAuth } from "../../../shared/providers/Auth.provider";


export type RentsStatementProps = {
    department: string;
};

export const LoanInfoStatementComponent = ({ department }: RentsStatementProps): JSX.Element => {

    const [page, setPage] = useState(0);
    const { t } = useTranslation();

    const { isAuthenticated } = useAuth();
    const [getLoanInfo, { data: loanInfo }] = useLazyGetLoanInfoQuery();


    useEffect(() => {
        if (isAuthenticated) {
            getLoanInfo();
        }
    }, [isAuthenticated]);



    return (<Box className="personal_box ">

        <Box className="personal_box_content">
            <TableContainer>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('LOAN_INFO.COLUMNS.LOAN_NUMBER')}</TableCell>
                            <TableCell >{t('LOAN_INFO.COLUMNS.CAPITAL_BALANCE')}</TableCell>
                            <TableCell >{t('LOAN_INFO.COLUMNS.INTEREST_RATE')}</TableCell>
                            <TableCell >{t('LOAN_INFO.COLUMNS.LOAN_END_DATE')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loanInfo ?
                            <TableRow >
                                <TableCell scope="row">
                                    {loanInfo.loanNumber}
                                </TableCell>
                                <TableCell scope="row">
                                    {currency.format(loanInfo.capitalBalance)}
                                </TableCell>
                                <TableCell scope="row">
                                    {loanInfo.interestRate}
                                </TableCell>
                                <TableCell scope="row">
                                    {moment(loanInfo.loanEndDate).format("DD MMM YYYY")}
                                </TableCell>
                            </TableRow> : <TableRow >
                                <TableCell scope="row" colSpan={4}>
                                    loading ...
                                </TableCell>
                            </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>

        </Box>
    </Box>);
};
