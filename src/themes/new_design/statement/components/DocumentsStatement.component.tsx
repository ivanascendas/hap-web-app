import { Box, Button, TablePagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../Statement.component.scss";
import {
  useLazyDownloadDocumentsPdfQuery,
  useLazyGetDocumentsQuery,
} from "@shared/services/Statements.service";
import moment from "moment";
import DownloadForOfflineIcon from "@mui/icons-material/Download";
import { useAuth } from "@shared/providers/Auth.provider";
import { ColumnItem, TableComponent } from "@shared/components/Table.component";
import { DocumentDto } from "@shared/dtos/documents.dto";
import { TablePaginationActions } from "@shared/components/TablePaginationActions";

export type RentsStatementProps = {
  department: string;
};

export const DocumentsStatementComponent = ({
  department,
}: RentsStatementProps): JSX.Element => {
  const [page, setPage] = useState(0);
  const { t } = useTranslation();
  const [downloadPdf] = useLazyDownloadDocumentsPdfQuery();
  const { isAuthenticated } = useAuth();

  const [getDocuments, { data: documents, isFetching }] =
    useLazyGetDocumentsQuery();

  useEffect(() => {
    if (isAuthenticated) {
      getDocuments();
    }
  }, [isAuthenticated]);

  const columns: ColumnItem<DocumentDto>[] = [
    {
      key: "CreatedOn",
      label: "DOCUMENTS.DATE_CELL",
      rowRender: (row: DocumentDto) =>
        moment(row.CreatedOn).format("DD MMM. YYYY"),
    },
    {
      key: "HAPDocumentName",
      label: "DOCUMENTS.DOC_NAME_CELL",
      rowClassName: () => "strong",
    },
    {
      key: "Id",
      label: "RATES.COLUMNS.REFERENCE",
      colRnder: () => <>Download</>,
      rowRender: (row: DocumentDto) => (
        <Button
          className="download-icon"
          startIcon={<DownloadForOfflineIcon />}
        >
          Download
        </Button>
      ),
    },
  ];

  const hadleDownloadDocument = async (dto: DocumentDto) => {
    const result = await downloadPdf(dto.Id);
    if (result.data) {
      const downloadUrl = window.URL.createObjectURL(result.data);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = dto.HAPDocumentName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPage(0);
  };
  return (
    <Box className="rates_statement_container ">
      <Box className=" personal_box personal_box_content">
        <TableComponent
          isLoading={isFetching}
          aria-label="documents table"
          onItemClick={hadleDownloadDocument}
          columns={columns}
          rows={documents || []}
        />

        {
          <Box
            className="personal_box_footer"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <TablePagination
              rowsPerPageOptions={[50]}
              component="div"
              count={documents?.length || 0}
              rowsPerPage={50}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </Box>
        }
      </Box>
    </Box>
  );
};
