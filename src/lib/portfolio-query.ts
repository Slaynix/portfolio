import { queryOptions } from "@tanstack/react-query";
import { getPortfolio } from "./portfolio.functions";

export type PortfolioData = Awaited<ReturnType<typeof getPortfolio>>;

export const portfolioQueryOptions = queryOptions({
  queryKey: ["portfolio"],
  queryFn: () => getPortfolio(),
  staleTime: 60_000,
});
