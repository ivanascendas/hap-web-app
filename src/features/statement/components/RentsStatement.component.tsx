import { Box, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import '../Statement.component.scss';
import { useLazyGetBalanceQuery, useLazyGetPropertiesQuery, useLazyGetStatementsQuery } from "../../../shared/services/Statements.service";
import moment from "moment";
import currency from "../../../shared/utils/currency";
import { useAuth } from "../../../shared/providers/Auth.provider";
import { ColumnItem, TableComponent } from "../../../shared/components/Table.component";
import { StatementDto } from "../../../shared/dtos/statement.dtos";
import { BaseQueryFn, QueryActionCreatorResult } from "@reduxjs/toolkit/query";
import { BalanceRequestDto } from "../../../shared/dtos/balance-request.dto";
import { BalanceDto } from "../../../shared/dtos/balance.dto";
import { MobileStatementsListComponent } from "./MobileStatementsList.component";
import { useDispatch, useSelector } from "react-redux";
import { clearStatements, selectStatements, selectStatementsCount } from "../../../shared/redux/slices/statementSlice";


export type RentsStatementProps = {
    department: string;
    getBalance: (dto: BalanceRequestDto) => QueryActionCreatorResult<any>;
    balance: BalanceDto | undefined;
};

export const RentsStatementComponent = ({ department, getBalance, balance }: RentsStatementProps): JSX.Element => {

    const [selectedPeriod, setSelectedPeriod] = useState<number>(6);
    const [page, setPage] = useState(0);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();
    const statements = useSelector(selectStatements);
    const statementCount = useSelector(selectStatementsCount);
    const [getStatements, { isFetching }] = useLazyGetStatementsQuery();

    const columns: ColumnItem<StatementDto>[] = [
        {
            key: 'statementDate', label: 'RATES.COLUMNS.DATE',
            rowRender: (row: StatementDto) => moment(row.statementDate).format("DD/MM/YYYY")
        },
        { key: 'transType', label: 'RATES.COLUMNS.TRANSACTION' },
        { key: 'invoiceNo', label: 'RATES.COLUMNS.REFERENCE' },
        {
            key: 'amount',
            label: 'RATES.COLUMNS.AMOUNT',
            rowRender: (row: StatementDto) => currency.format(row.amount),
            rowClassName: (row: StatementDto) => row.transType == 'Invoice' ? 'text_red' : 'clr_green'
        },
        {
            key: 'balance',
            label: 'RATES.COLUMNS.BALANCE',
            rowRender: (row: StatementDto) => currency.format(row.balance)
        },
    ];

    useEffect(() => {
        if (isAuthenticated) {
            const balanceReq = getBalance({
                incDept: department.toUpperCase(),
                PropertyNumber: "0",
                from: moment().subtract(selectedPeriod, 'month').startOf('month').format("YYYY-MM-DD"),
                to: moment().format("YYYY-MM-DD")
            });
            const statementsReq = getStatements({
                $inlinecount: "allpages",
                IncDept: department.toUpperCase(),
                $orderby: "ROW_NUMBER asc",
                $skip: (page) * 50,
                $top: 50,
                from: moment().subtract(selectedPeriod, 'month').startOf('month').format("YYYY-MM-DD"),
                to: moment().format("YYYY-MM-DD")
            });

            return () => {
                balanceReq.abort();
                statementsReq.abort();
                dispatch(clearStatements());
            };
        }
    }, [isAuthenticated, selectedPeriod, page]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPage(0);
    };

    const handleLoadMore = () => {
        setPage(page + 1);
    }

    return (<><Box className="personal_box ">
        <Box className="personal_box_filter">

            <Box>
                <FormControl fullWidth>
                    <InputLabel id="date-range-label" >{t('RATES.FILTER.DATE_RANGE')}</InputLabel>
                    <Select
                        labelId="date-range-label"
                        label={t('RATES.FILTER.DATE_RANGE')}
                        value={selectedPeriod.toString()}
                        onChange={(e) => setSelectedPeriod(parseInt(e.target.value.toString()))}
                    >
                        <MenuItem value={'3'} role="option">{t('RENTS.FILTER.DATE_RANGE_OPTIONS.MONTHS_3')}</MenuItem>
                        <MenuItem value={'6'} role="option">{t('RENTS.FILTER.DATE_RANGE_OPTIONS.MONTHS_6')}</MenuItem>
                        <MenuItem value={'12'} role="option">{t('RENTS.FILTER.DATE_RANGE_OPTIONS.MONTHS_12')}</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box className="personal_box_filter_balance" sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <span className="personal_box_filter_title">{t('INVOICES.RATES.CURRENT_BALANCE')}</span>
                <span className="personal_box_filter_value">
                    {currency.format(balance?.currentBalance || 0)}
                </span>
            </Box>
        </Box>
        <Box className="personal_box_content" sx={{ display: { xs: 'none', md: 'block' } }}>
            <TableComponent isLoading={isFetching} aria-label="rents table" columns={columns} rows={statements.slice((page * 50), 50) || []} />

            <Box className="personal_box_footer" sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between' }}>
                <TablePagination
                    rowsPerPageOptions={[50]}
                    component="div"
                    count={statementCount || 0}
                    rowsPerPage={50}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <Box className="personal_box_filter_balance" sx={{ display: 'flex' }}>
                    <span className="personal_box_filter_title">{t('RATES.CLOSING_BALANCE')}</span>
                    <span className="personal_box_filter_value">
                        {currency.format(balance?.closingBalance || 0)}
                    </span>
                </Box>
            </Box>
        </Box>
    </Box>
        <Box className="personal_box_content" sx={{ display: { xs: 'flex', md: 'none' } }}>
            <MobileStatementsListComponent list={statements || []} loadMore={handleLoadMore} />
        </Box>
    </>);
};
