import { useState } from "react"
import {
  AreaChart,
  Block,
  Card,
  Flex,
  Icon,
  Text,
  Title,
  Toggle,
  ToggleItem,
} from "@tremor/react"
import useSWR from "swr"
import { fetcher, useUrlFilters } from "../lib/helpers"

export default function ChartView() {
  const filters = useUrlFilters()
  const [selectedKpi, setSelectedKpi] = useState("stars")
  const { data, error } = useSWR(
    ["https://play.clickhouse.com/?user=play", `stars-${filters.org}`],
    ([url]) =>
      fetcher(url, {
        method: "POST",
        body: `
WITH data AS (
  select * from github_events
  WHERE repo_name like '${filters.org}/%' AND event_type = 'WatchEvent'
)
SELECT
  count(actor_login) as daily,
  toDate(created_at) as date,
  sum(count(actor_login)) OVER w AS stars
FROM
  data
GROUP BY toDate(created_at)
WINDOW w AS (ORDER BY date ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
FORMAT JSON`,
      })
  )
  // console.log("data", data)
  // console.log("error", error)

  if (!data || !data.data) return <div>Loading...</div>

  const starHistory = data.data
  const max = starHistory.length
    ? parseInt(starHistory[starHistory.length - 1]["stars"])
    : 0
  return (
    <Card>
      <div className="md:flex justify-between">
        <Block>
          <Flex
            justifyContent="justify-start"
            spaceX="space-x-0.5"
            alignItems="items-center"
          >
            <Title>Star History</Title>
          </Flex>
          <Text>Star growth across all repos</Text>
        </Block>
        <div className="mt-6 md:mt-0">
          <Toggle
            color="zinc"
            defaultValue={selectedKpi}
            handleSelect={(value) => setSelectedKpi(value)}
          >
            <ToggleItem value="stars" text="Growth" />
            <ToggleItem value="daily" text="Daily" />
          </Toggle>
        </div>
      </div>
      <AreaChart
        data={starHistory}
        dataKey="date"
        categories={[selectedKpi]}
        colors={["blue"]}
        showLegend={false}
        yAxisWidth="w-14"
        height="h-96"
        marginTop="mt-8"
        maxValue={selectedKpi == "stars" ? max : undefined}
      />
    </Card>
  )
}
