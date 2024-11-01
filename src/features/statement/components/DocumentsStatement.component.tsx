import { Box, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import '../Statement.component.scss';
import { useLazyGetBalanceQuery, useLazyGetDocumentsQuery, useLazyGetPropertiesQuery, useLazyGetStatementsQuery } from "../../../shared/services/Statements.service";
import moment from "moment";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { useAuth } from "../../../shared/providers/Auth.provider";


export type RentsStatementProps = {
    department: string;
};

export const DocumentsStatementComponent = ({ department }: RentsStatementProps): JSX.Element => {

    const [page, setPage] = useState(0);
    const { t } = useTranslation();

    const { isAuthenticated } = useAuth();

    const [getDocuments, { data: documents }] = useLazyGetDocumentsQuery();


    useEffect(() => {
        if (isAuthenticated) {
            getDocuments()
        }
    }, [isAuthenticated]);

    // const handleChangePage = (event: unknown, newPage: number) => {
    //     setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setPage(0);
    // };

    return (<Box className="personal_box ">

        <Box className="personal_box_content">
            <TableContainer>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('DOCUMENTS.DATE_CELL')}</TableCell>
                            <TableCell >{t('DOCUMENTS.DOC_NAME_CELL')}</TableCell>
                            <TableCell >&nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {documents?.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell scope="row">
                                    {moment(row.CreatedOn).format("DD MMM YYYY")}
                                </TableCell>
                                <TableCell scope="row">
                                    {row.HAPDocumentName}
                                </TableCell>
                                <TableCell scope="row">
                                    <DownloadForOfflineIcon />
                                </TableCell>

                            </TableRow>))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <Box className="personal_box_footer" sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
            </Box> */}
        </Box>
    </Box>);
};
