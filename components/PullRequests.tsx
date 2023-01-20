import { useState } from "react"
import {
  BarChart,
  Block,
  Card,
  Flex,
  Text,
  Title,
  Toggle,
  ToggleItem,
} from "@tremor/react"
import useSWR from "swr"
import { fetcher, useUrlFilters } from "../lib/helpers"

// Basic formatters for the chart values
const dollarFormatter = (value: number) =>
  `$ ${Intl.NumberFormat("us").format(value).toString()}`

const numberFormatter = (value: number) =>
  `${Intl.NumberFormat("us").format(value).toString()}`

export default function ChartView() {
  const filters = useUrlFilters()
  const [selectedKpi, setSelectedKpi] = useState("tally")
  const { data, error } = useSWR(
    ["https://play.clickhouse.com/?user=play", `pull-requests-${filters.org}`],
    ([url]) =>
      fetcher(url, {
        method: "POST",
        body: `
with 
events as (
    SELECT *
    FROM github_events
    WHERE repo_name like '${filters.org}/%' and event_type = 'PullRequestEvent'
),
timeseries as (
    WITH
    coalesce(toStartOfDay((select min(created_at) from events)), today()) AS start,
    coalesce(toStartOfDay((select max(created_at) from events)), today()) AS end
    SELECT arrayJoin(
        arrayMap(
            x -> toDate(x), 
            range(    
                toUInt32(start), 
                toUInt32(end), 
                24 * 3600
            )
        )
    ) as date
),
opened as (
    select count(*) as opened, toDate(created_at) as created_at
    from events where (action = 'opened' or action = 'reopened') 
    group by created_at
),
closed as (
    select count(*) as closed, toDate(created_at) as created_at
    from events where action = 'closed'
    group by created_at
),
stats as (
  select 
      timeseries.date as date,
      sum(opened.opened) as opened,
      sum(closed.closed) as closed,
      sum(opened.opened - closed.closed) as tally
  from 
      timeseries
  left join
    closed on closed.created_at = timeseries.date
  left join
    opened on opened.created_at = timeseries.date
  group by 
    timeseries.date
)
SELECT
  date,
  sum(opened) as opened,
  sum(closed) as closed,
  sum(sum(tally)) OVER w AS tally
FROM
  stats
GROUP BY date
WINDOW w AS (ORDER BY date ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
FORMAT JSON`,
      })
  )
  // console.log("data", data)
  // console.log("error", error)

  // map formatters by selectedKpi
  const formatters: { [key: string]: any } = {
    Sales: dollarFormatter,
    Profit: dollarFormatter,
    Customers: numberFormatter,
  }

  if (!data) return <div>Loading...</div>

  const chartData = data.data
  return (
    <Card>
      <div className="md:flex justify-between">
        <Block>
          <Flex
            justifyContent="justify-start"
            spaceX="space-x-0.5"
            alignItems="items-center"
          >
            <Title>Issue History</Title>
          </Flex>
          <Text>Issue growth across all repos</Text>
        </Block>
        <div className="mt-6 md:mt-0">
          <Toggle
            color="zinc"
            defaultValue={selectedKpi}
            handleSelect={(value) => setSelectedKpi(value)}
          >
            <ToggleItem value="tally" text="Tally" />
            <ToggleItem value="opened" text="Opened" />
            <ToggleItem value="closed" text="Closed" />
          </Toggle>
        </div>
      </div>
      <BarChart
        data={chartData}
        dataKey="date"
        categories={[selectedKpi]}
        colors={["blue"]}
        showLegend={false}
        valueFormatter={formatters[selectedKpi]}
        yAxisWidth="w-14"
        height="h-96"
        marginTop="mt-8"
      />
    </Card>
  )
}
