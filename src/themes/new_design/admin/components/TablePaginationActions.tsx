import React, { useEffect } from "react";
import "./TablePaginationActions.scss";
import {
  Box,
  Container,
  CssBaseline,
  IconButton,
  MenuItem,
  Select,
  TablePagination,
  TextField,
  Typography,
  Button,
} from "@mui/material";
// ...existing imports...
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage,
} from "@mui/icons-material";

// Add this custom pagination actions component
interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

export const TablePaginationActions = (
  props: TablePaginationActionsProps,
): JSX.Element => {
  const { count, page, rowsPerPage, onPageChange } = props;
  const totalPages = Math.ceil(count / rowsPerPage);

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

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

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, Math.max(0, totalPages - 1));
  };

  const handlePageClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    pageNumber: number,
  ) => {
    onPageChange(event, pageNumber);
  };

  // Generate page numbers to display
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(0, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (range[0] > 1) {
      rangeWithDots.push(0);
      if (range[0] > 2) {
        rangeWithDots.push("...");
      }
    }

    rangeWithDots.push(...range);

    if (range[range.length - 1] < totalPages - 2) {
      if (range[range.length - 1] < totalPages - 3) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(totalPages - 1);
    }

    return rangeWithDots;
  };

  return (
    <Box className="TablePaginationActions">
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>

      {getVisiblePages().map((pageNumber, index) => (
        <React.Fragment key={index}>
          {pageNumber === "..." ? (
            <Typography sx={{ mx: 1 }}>...</Typography>
          ) : (
            <Button
              onClick={(event) => handlePageClick(event, pageNumber as number)}
              variant={page === pageNumber ? "contained" : "text"}
              size="small"
              sx={{
                minWidth: "32px",
                height: "32px",
                mx: 0.5,
                borderRadius: "4px",
              }}
            >
              {(pageNumber as number) + 1}
            </Button>
          )}
        </React.Fragment>
      ))}

      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= totalPages - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
};
