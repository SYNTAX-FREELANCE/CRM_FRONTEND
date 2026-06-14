import { useQuery } from "@tanstack/react-query";
import {
  FetchAllAluminiDetail,
} from "./CommonFun";



export const useFetchAllAluminDetail = () => {
  return useQuery({
    queryKey: ["getallAlumini"],
    queryFn: FetchAllAluminiDetail,
    staleTime: Infinity, // optional (5 min cache)
  });
};
