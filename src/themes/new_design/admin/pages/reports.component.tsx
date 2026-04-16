import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useGetReportsQuery } from "@shared/services/Report.service";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CircularProgress from "@mui/material/CircularProgress";
import "./reports.component.scss";
import { ReportDto } from "@shared/dtos/reports.dto";
import { SvgIcon } from "@mui/material";
import { ReactComponent as ArticleIcon } from "../../../../assets/img/documenttext.svg";
export const ReportsComponent = (): JSX.Element => {
  const { data, isLoading } = useGetReportsQuery();

  const openReportHandler = (report: ReportDto) => {
    window.open(report.url, "_blank");
  };
  const colors = ["#DC0963", "#7A003C", "#224D96"];
  return (
    <Box
      p={3}
      sx={{
        overflow: "auto",
        maxHeight: "calc(100vh - 80px)",
        display: "flex",
        gap: "1rem",
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : (
        data?.map((report, i) => (
          <Button
            fullWidth
            key={report.id}
            className="report"
            onClick={() => openReportHandler(report)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              borderRadius: "16px !important",
            }}
          >
            <SvgIcon
              component={ArticleIcon}
              sx={{
                width: 60,
                height: 60,
                fill: "transparent",
                "& path": {
                  fill: "transparent",
                  stroke: colors[i % colors.length],
                  width: 60,
                  height: 60,
                },
                "& *": {
                  fill: "transparent",
                  stroke: colors[i % colors.length],
                  width: 60,
                  height: 60,
                },
              }}
              viewBox="0 0 60 60"
            />
            <Box
              className="report_name"
              sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <Typography component="span">{report.name}</Typography>
              <Typography component="span" className="report_sort">
                {report.sort}
              </Typography>
            </Box>
          </Button>
        ))
      )}
    </Box>
  );
};
