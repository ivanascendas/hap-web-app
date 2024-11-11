import { Box, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import '../Statement.component.scss';
import { useLazyDownloadDocumentsPdfQuery, useLazyGetBalanceQuery, useLazyGetDocumentsQuery, useLazyGetPropertiesQuery, useLazyGetStatementsQuery } from "../../../shared/services/Statements.service";
import moment from "moment";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { useAuth } from "../../../shared/providers/Auth.provider";
import { ColumnItem, TableComponent } from "../../../shared/components/Table.component";
import { DocumentDto } from "../../../shared/dtos/documents.dto";


export type RentsStatementProps = {
    department: string;
};

export const DocumentsStatementComponent = ({ department }: RentsStatementProps): JSX.Element => {

    const [page, setPage] = useState(0);
    const { t } = useTranslation();
    const [downloadPdf] = useLazyDownloadDocumentsPdfQuery();
    const { isAuthenticated } = useAuth();

    const [getDocuments, { data: documents, isFetching }] = useLazyGetDocumentsQuery();


    useEffect(() => {
        if (isAuthenticated) {
            getDocuments()
        }
    }, [isAuthenticated]);

    const columns: ColumnItem<DocumentDto>[] = [
        {
            key: 'CreatedOn', label: 'DOCUMENTS.DATE_CELL',
            rowRender: (row: DocumentDto) => moment(row.CreatedOn).format("DD/MM/YYYY")
        },
        { key: 'HAPDocumentName', label: 'DOCUMENTS.DOC_NAME_CELL' },
        {
            key: 'Id',
            label: 'RATES.COLUMNS.REFERENCE',
            colRnder: () => <>Download</>,
            rowRender: (row: DocumentDto) => <DownloadForOfflineIcon />,

        },

    ];

    const hadleDownloadDocument = async (dto: DocumentDto) => {
        const result = await downloadPdf(dto.Id);
        if (result.data) {
            const downloadUrl = window.URL.createObjectURL(result.data);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = dto.HAPDocumentName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    return (<Box className="personal_box ">

        <Box className="personal_box_content">
            <TableComponent isLoading={isFetching} aria-label="documents table" onItemClick={hadleDownloadDocument} columns={columns} rows={documents || []} />

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
