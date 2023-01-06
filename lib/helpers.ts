import { useRouter } from "next/router"

// @ts-ignore
export const fetcher = (...args) => fetch(...args).then((res) => res.json())

type UrlFilters = {
  org: string | string[]
}
export const useUrlFilters = (): UrlFilters => {
  const router = useRouter()
  const query = router.query
  const filters = {
    org: query.org || "supabase",
  }
  return filters
}
