import { fetchAllProfiles } from "@/services/profileServices";
import { useQuery } from "@tanstack/react-query";

export const useFetchProfiles = () => {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: fetchAllProfiles,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
