import React from "react";
import { IconButton, Button, TablePaginationActionsProps } from "@mui/material";

export const TablePaginationActions = (props: TablePaginationActionsProps) => {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page + 1);
  };
  return (
    <div className="table-pagination-actions">
      <Button onClick={handleBackButtonClick} disabled={page === 0}>
        Previous
      </Button>
      <Button
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        Next
      </Button>
    </div>
  );
};
