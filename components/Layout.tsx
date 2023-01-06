import { useState } from "react"
import { Block, Card, ColGrid, Tab, TabList, Text, Title } from "@tremor/react"
import Stars from "./Stars"
import Issues from "./Issues"
import Navbar from "./Navbar"
import { useRouter } from "next/router"

export default function KpiCardGrid() {
  return (
    <div className="min-h-full">
      <Navbar />
      <main className="bg-slate-50 p-6 sm:p-10">
        <>
          <Block marginTop="mt-6">
            <Stars />
          </Block>
          <Block marginTop="mt-6">
            <Issues />
          </Block>
        </>
      </main>
    </div>
  )
}
