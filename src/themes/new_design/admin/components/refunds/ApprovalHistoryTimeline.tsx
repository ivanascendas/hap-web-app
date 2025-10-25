import React, { useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { CheckCircle, Cancel, Info, HourglassEmpty } from "@mui/icons-material";
import { ApprovalAction, ApprovalStepDto } from "@shared/dtos/refund.dtos";
import { formatDate, getStatusLabel } from "../../utils/statusLabels";

/**
 * Props for ApprovalHistoryTimeline component
 */
export interface ApprovalHistoryTimelineProps {
  /**
   * Array of approval steps to display
   */
  steps: ApprovalStepDto[];
}
const getActionString = (action: ApprovalAction) => {
  switch (action) {
    case ApprovalAction.Approve:
      return "Approved";
    case ApprovalAction.Reject:
      return "Rejected";
    case ApprovalAction.Return:
      return "Returned for Info";
    case ApprovalAction.RequestInfo:
      return "Requested Info";
    default:
      return "Unknown Action";
  }
};
/**
 * Gets the appropriate icon and color for an approval action
 */
const getActionDisplay = (
  action: ApprovalAction,
): {
  icon: React.ReactElement;
  color: "success" | "error" | "info" | "grey";
} => {
  switch (action) {
    case ApprovalAction.Approve:
      return {
        icon: <CheckCircle />,
        color: "success",
      };

    case ApprovalAction.Reject:
      return {
        icon: <Cancel />,
        color: "error",
      };

    case ApprovalAction.Return:
    case ApprovalAction.RequestInfo:
      return {
        icon: <Info />,
        color: "info",
      };
    default:
      return {
        icon: <HourglassEmpty />,
        color: "grey",
      };
  }
};

/**
 * ApprovalHistoryTimeline component displays the approval history as a timeline
 *
 * @component
 * @example
 * ```tsx
 * <ApprovalHistoryTimeline steps={application.approvalSteps} />
 * ```
 */
export const ApprovalHistoryTimeline: React.FC<
  ApprovalHistoryTimelineProps
> = ({ steps }) => {
  const [sortedSteps, setSortedSteps] =
    React.useState<ApprovalStepDto[]>(steps);
  useEffect(() => {
    console.log("Approval steps:", steps);
    const sorted = [...steps];
    sorted.sort(
      (a, b) => new Date(a.actionAt).getTime() - new Date(b.actionAt).getTime(),
    );
    setSortedSteps(sorted);
  }, [steps]);

  if (!sortedSteps || sortedSteps.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No approval history available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {sortedSteps.map((step, index) => {
        const { icon, color } = getActionDisplay(step.action);

        return (
          <Box
            key={index}
            sx={{ display: "flex", gap: 2, mb: 3, position: "relative" }}
          >
            {/* Timeline line */}
            {index < steps.length - 1 && (
              <Box
                sx={{
                  position: "absolute",
                  left: "20px",
                  top: "40px",
                  bottom: "-24px",
                  width: "2px",
                  backgroundColor: "divider",
                }}
              />
            )}

            {/* Timeline dot */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: `${color}.main`,
                color: "white",
                flexShrink: 0,
                zIndex: 1,
                flex: "none",
              }}
            >
              {icon}
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  backgroundColor:
                    color === "success"
                      ? "success.light"
                      : color === "error"
                        ? "error.light"
                        : color === "info"
                          ? "info.light"
                          : "grey.100",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    Level {getStatusLabel(step.level)}:{" "}
                    {getActionString(step.action as ApprovalAction)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(step.actionAt)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  By: {step.actorName || "System"}
                </Typography>
                {step.comment && (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.5,
                      backgroundColor: "background.paper",
                      borderRadius: 1,
                      borderLeft: "3px solid",
                      borderColor: "primary.main",
                    }}
                  >
                    <Typography variant="caption" fontStyle="italic">
                      &ldquo;{step.comment}&rdquo;
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
