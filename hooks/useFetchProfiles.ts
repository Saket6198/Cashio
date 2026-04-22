import {
  fetchAllProfiles,
  fetchProfileById,
  fetchProfileSettingsByMonthYear,
  fetchProfileSettingsHistory,
} from "@/services/profileServices";
import { useQuery } from "@tanstack/react-query";

export const useFetchProfiles = () => {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: fetchAllProfiles,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFetchProfileById = (profileId: string) => {
  return useQuery({
    queryKey: ["profile", profileId],
    queryFn: () => fetchProfileById(profileId),
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFetchProfileSettingsHistory = (profileId: string) => {
  return useQuery({
    queryKey: ["profile-settings-history", profileId],
    queryFn: () => fetchProfileSettingsHistory(profileId),
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFetchProfileSettingsByMonthYear = (
  profileId: string,
  year: number,
  month: number
) => {
  return useQuery({
    queryKey: ["profile-settings-history-month-year", profileId, year, month],
    queryFn: () => fetchProfileSettingsByMonthYear(profileId, year, month),
    enabled: !!profileId && !!year && !!month,
    staleTime: 5 * 60 * 1000,
  });
};
