import { fetchAllProfiles, fetchProfileById } from "@/services/profileServices";
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
