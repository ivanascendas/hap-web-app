import React, { useEffect, useState } from "react";
import { Box, Chip, Skeleton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { RefundApplicationDto, RefundStatus } from "@shared/dtos/refund.dtos";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./MobileRefundsList.component.scss";

export type MobileRefundsListProps = {
  list: RefundApplicationDto[];
  isLoading: boolean;
  onItemClick: (item: RefundApplicationDto) => void;
  getStatusColor: (
    status: RefundStatus,
  ) => "default" | "primary" | "success" | "error" | "warning";
  loadMore?: () => void;
};

export const MobileRefundsListComponent = ({
  list,
  isLoading,
  onItemClick,
  getStatusColor,
}: MobileRefundsListProps): JSX.Element => {
  const { t } = useTranslation();
  const [groupedRefunds, setGroupedRefunds] = useState<{
    [yearMonth: string]: RefundApplicationDto[];
  }>({});

  useEffect(() => {
    const grouped: { [yearMonth: string]: RefundApplicationDto[] } = {};
    list.forEach((refund) => {
      const yearMonth = moment(refund.updatedAt).format("MMM YYYY");
      if (!grouped[yearMonth]) {
        grouped[yearMonth] = [];
      }
      grouped[yearMonth].push(refund);
    });
    setGroupedRefunds(grouped);
  }, [list]);

  return (
    <Box className="mobile-refunds-list">
      {!isLoading &&
        Object.keys(groupedRefunds).map((yearMonth) => (
          <Box key={yearMonth} className="mobile-refunds-list__group">
            <Box className="mobile-refunds-list__group-header">{yearMonth}</Box>
            <Box className="mobile-refunds-list__group-list">
              {groupedRefunds[yearMonth].map((refund) => (
                <Box
                  key={refund.applicationId}
                  className="mobile-refunds-list__item"
                  onClick={() => onItemClick(refund)}
                >
                  <Box className="mobile-refunds-list__item-date">
                    <span>{moment(refund.updatedAt).format("DD")}</span>
                    {moment(refund.updatedAt).format("MMM")}
                  </Box>
                  <Box className="mobile-refunds-list__item-content">
                    <Box className="mobile-refunds-list__item-title">
                      {refund.applicantName || `#${refund.applicationId}`}
                    </Box>
                    <Box className="mobile-refunds-list__item-status">
                      <Chip
                        label={t(`REFUNDS.STATUS.${refund.status}`)}
                        color={getStatusColor(refund.status)}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Box className="mobile-refunds-list__item-amount">
                    €{refund.amount?.toFixed(2) || "0.00"}
                  </Box>
                  <Box className="mobile-refunds-list__item-chevron">
                    <ChevronRightIcon />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      {isLoading && (
        <Box className="mobile-refunds-list__group">
          <Box className="mobile-refunds-list__group-header">
            <Skeleton variant="text" height={40} width="30%" />
          </Box>
          <Box className="mobile-refunds-list__group-list">
            {[1, 2, 3].map((i) => (
              <Box key={i} className="mobile-refunds-list__item">
                <Skeleton
                  variant="circular"
                  width={60}
                  height={60}
                  className="mobile-refunds-list__item-date"
                />
                <Box className="mobile-refunds-list__item-content">
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton variant="rectangular" width={100} height={24} />
                </Box>
                <Skeleton variant="text" width={60} height={20} />
                <Skeleton variant="circular" width={24} height={24} />
              </Box>
            ))}
          </Box>
        </Box>
      )}
      {!isLoading && list.length === 0 && (
        <Box className="mobile-refunds-list__empty">
          <Typography variant="body1" color="textSecondary">
            {t("REFUNDS.LIST.NO_REFUNDS")}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
