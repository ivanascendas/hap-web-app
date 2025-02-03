import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useGetReportsQuery } from "../../../shared/services/Report.service";
import ArticleIcon from "@mui/icons-material/Article";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CircularProgress from "@mui/material/CircularProgress";
import "./reports.component.scss";
import { ReportDto } from "../../../shared/dtos/reports.dto";

export const ReportsComponent = (): JSX.Element => {
  const { data, isLoading } = useGetReportsQuery();

  const openReportHandler = (report: ReportDto) => {
    window.open(report.url, "_blank");
  };

  return (
    <Box p={3} sx={{ overflow: "auto", maxHeight: "calc(100vh - 80px)" }}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        data?.map((report) => (
          <Button
            fullWidth
            key={report.id}
            className="report"
            onClick={() => openReportHandler(report)}
          >
            <ArticleIcon />
            <Box className="report_name">
              <Typography component="span">{report.name}</Typography>
              <Typography component="span" className="report_sort">
                {report.sort}
              </Typography>
            </Box>
            <ArrowForwardIosIcon className="report_arrow" />
          </Button>
        ))
      )}
    </Box>
  );
};
