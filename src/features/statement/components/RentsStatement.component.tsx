import { Box, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import '../Statement.component.scss';
import { useLazyGetBalanceQuery, useLazyGetPropertiesQuery, useLazyGetStatementsQuery } from "../../../shared/services/Statements.service";
import moment from "moment";
import currency from "../../../shared/utils/currency";
import { useAuth } from "../../../shared/providers/Auth.provider";


export type RentsStatementProps = {
    department: string;
};

export const RentsStatementComponent = ({ department }: RentsStatementProps): JSX.Element => {

    const [selectedPeriod, setSelectedPeriod] = useState<number>(6);
    const [page, setPage] = useState(0);
    const { t } = useTranslation();

    const { isAuthenticated } = useAuth();

    const [getProperties, { data: properties }] = useLazyGetPropertiesQuery();
    const [getBalance, { data: balance }] = useLazyGetBalanceQuery();
    const [getStatements, { data: statements }] = useLazyGetStatementsQuery();


    useEffect(() => {
        if (isAuthenticated) {
            getProperties();
            getBalance({
                incDept: department.toUpperCase(),
                PropertyNumber: "0",
                from: moment().subtract(selectedPeriod, 'month').startOf('month').format("YYYY-MM-DD"),
                to: moment().format("YYYY-MM-DD")
            });
            getStatements({
                $inlinecount: "allpages",
                IncDept: department.toUpperCase(),
                $orderby: "ROW_NUMBER asc",
                $skip: (page) * 50,
                $top: 50,
                from: moment().subtract(selectedPeriod, 'month').startOf('month').format("YYYY-MM-DD"),
                to: moment().format("YYYY-MM-DD")
            });
        }
    }, [isAuthenticated, selectedPeriod]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPage(0);
    };

    return (<Box className="personal_box ">
        <Box className="personal_box_filter">

            <Box>
                <FormControl fullWidth>
                    <InputLabel >{t('RATES.FILTER.DATE_RANGE')}</InputLabel>
                    <Select
                        label={t('RATES.FILTER.DATE_RANGE')}
                        value={selectedPeriod.toString()}
                        onChange={(e) => setSelectedPeriod(parseInt(e.target.value.toString()))}
                    >
                        <MenuItem value={'3'}>{t('RENTS.FILTER.DATE_RANGE_OPTIONS.MONTHS_3')}</MenuItem>
                        <MenuItem value={'6'} >{t('RENTS.FILTER.DATE_RANGE_OPTIONS.MONTHS_6')}</MenuItem>
                        <MenuItem value={'12'} >{t('RENTS.FILTER.DATE_RANGE_OPTIONS.MONTHS_12')}</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box className="personal_box_filter_balance">
                <span className="personal_box_filter_title">{t('INVOICES.RATES.CURRENT_BALANCE')}</span>
                <span className="personal_box_filter_value">
                    {currency.format(balance?.currentBalance || 0)}
                </span>
            </Box>
        </Box>
        <Box className="personal_box_content">
            <TableContainer>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('RATES.COLUMNS.DATE')}</TableCell>
                            <TableCell >{t('RATES.COLUMNS.TRANSACTION')}</TableCell>
                            <TableCell >{t('RATES.COLUMNS.REFERENCE')}</TableCell>
                            <TableCell >{t('RATES.COLUMNS.PROPERTY')}</TableCell>
                            <TableCell >{t('RATES.COLUMNS.AMOUNT')}</TableCell>
                            <TableCell >{t('RATES.COLUMNS.BALANCE')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {statements?.items.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell scope="row">
                                    {moment(row.statementDate).format("DD MMM YYYY")}
                                </TableCell>
                                <TableCell scope="row">
                                    {row.transType}
                                </TableCell>
                                <TableCell scope="row">
                                    {row.invoiceNo}
                                </TableCell>
                                <TableCell scope="row">
                                    {row.propertyDescription}
                                </TableCell>
                                <TableCell scope="row" className={row.transType == 'Invoice' ? 'text_red' : 'clr_green'}>
                                    {currency.format(row.amount)}
                                </TableCell>
                                <TableCell scope="row">
                                    {currency.format(row.balance)}
                                </TableCell>
                            </TableRow>))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box className="personal_box_footer" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <TablePagination
                    rowsPerPageOptions={[50]}
                    component="div"
                    count={statements?.count || 0}
                    rowsPerPage={50}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <Box className="personal_box_filter_balance">
                    <span className="personal_box_filter_title">{t('RATES.CLOSING_BALANCE')}</span>
                    <span className="personal_box_filter_value">
                        {currency.format(balance?.closingBalance || 0)}
                    </span>
                </Box>
            </Box>
        </Box>
    </Box>);
};
