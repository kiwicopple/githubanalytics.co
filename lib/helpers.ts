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

// Find the max value from an array of objects (or just an array of numbers)
export function findMax(objects: any[], key?: string): number {
  let max = 0
  for (let i = 0; i < objects.length; i++) {
    const val: number = key ? objects[i][key] : objects[i]
    const valInt = parseInt(val.toString())
    if (valInt > max) max = valInt
  }
  console.log("max", max)
  return max
}
