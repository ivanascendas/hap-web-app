import { useMemo } from "react";
import { useGetConfigurationQuery } from "@shared/services/Configurations.service";
import { ConfigurationDto } from "@shared/dtos/configuration.dto";

/**
 * Extended configuration type that includes both API and environment variables
 */
export type ExtendedConfigurationDto = ConfigurationDto & {
  baseUrl: string;
  publicKey: string;
  androidLink: string;
  iosLink: string;
  passwordMinLength: number;
  passwordUseLowercase: boolean;
  passwordUseUppercase: boolean;
  passwordUseNumbers: boolean;
  passwordUseSpecialCharacter: boolean;
  passwordMaxRepeating: number | false;
  refundMinAmount: number;
  depDefaultValue: string;
  useRefundFeature: boolean;
  paymentUrl: string;
};

/**
 * Custom hook that fetches configuration from API and merges it with environment variables
 *
 * @returns {Object} Object containing:
 *   - config: Merged configuration data (ExtendedConfigurationDto | undefined)
 *   - isLoading: Loading state (boolean)
 *   - error: Error object if request failed
 *   - refetch: Function to refetch configuration
 *
 * @example
 * const { config, isLoading, error } = useConfiguration();
 *
 * if (isLoading) return <Loader />;
 * if (error) return <Error />;
 *
 * return <div>{config?.titlePage}</div>;
 */
export const useConfiguration = () => {
  const {
    data: apiConfig,
    error,
    isLoading,
    refetch,
  } = useGetConfigurationQuery();

  const config = useMemo<ExtendedConfigurationDto | undefined>(() => {
    if (!apiConfig) return undefined;

    // Merge API configuration with environment variables
    return {
      // API configuration
      ...apiConfig,

      // Environment variables
      baseUrl: process.env.REACT_APP_BASE_URL || "",
      publicKey: process.env.REACT_APP_PUBLIC_KEY || "",
      androidLink: process.env.REACT_APP_ANDROID_LINK || "",
      iosLink: process.env.REACT_APP_IOS_LINK || "",

      // Idle settings - prefer API value if exists, otherwise use env
      idle: apiConfig.idle || parseInt(process.env.REACT_APP_IDLE || "600000"),

      // Password settings
      passwordMinLength: parseInt(
        process.env.REACT_APP_PASSWORD_MIN_LENGTH || "8",
      ),
      passwordUseLowercase:
        process.env.REACT_APP_PASSWORD_USE_LOWERCASE === "true",
      passwordUseUppercase:
        process.env.REACT_APP_PASSWORD_USE_UPPERCASE === "true",
      passwordUseNumbers: process.env.REACT_APP_PASSWORD_USE_NUMBERS === "true",
      passwordUseSpecialCharacter:
        process.env.REACT_APP_PASSWORD_USE_SPECIAL_CHARACTER === "true",
      passwordMaxRepeating:
        process.env.REACT_APP_PASSWORD_MAX_REPEATING &&
        process.env.REACT_APP_PASSWORD_MAX_REPEATING !== "false"
          ? parseInt(process.env.REACT_APP_PASSWORD_MAX_REPEATING)
          : false,

      // Refund settings
      refundMinAmount: parseInt(
        process.env.REACT_APP_REFUND_MIN_AMOUNT || "50",
      ),
      useRefundFeature: process.env.REACT_APP_USE_REFUND_FEATURE === "true",

      // Department and payment settings
      depDefaultValue:
        apiConfig.defaultIncDepartment ||
        process.env.REACT_APP_DEP_DEFAULT_VALUE ||
        "hap",
      paymentUrl:
        apiConfig.paymentURL || process.env.REACT_APP_PAYMENT_URL || "",
    };
  }, [apiConfig]);

  return {
    config,
    isLoading,
    error,
    refetch,
  };
};
