import { Fragment, useContext, useEffect, useState } from "react"
import { Router, useRouter } from "next/router"
import { useUrlFilters } from "../lib/helpers"

export default function Navbar() {
  const filters = useUrlFilters()
  const [gitHubOrg, setGitHubOrg] = useState(filters.org)
  const router = useRouter()

  useEffect(() => {
    setGitHubOrg(filters.org)
  }, [filters.org])

  return (
    <nav className="bg-white shadow">
      <>
        <div className="mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex px-2 lg:px-0">
              <div className="flex flex-shrink-0 items-center">
                <img
                  className="block h-8 w-auto lg:hidden"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt="Your Company"
                />
                <img
                  className="hidden h-8 w-auto lg:block"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt="Your Company"
                />
              </div>
              <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                {/* Date picker */}
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="w-full max-w-lg lg:max-w-xs">
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="relative flex flex-grow items-stretch focus-within:z-10">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={gitHubOrg}
                      onChange={(e) => setGitHubOrg(e.target.value)}
                      className="block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="John Smith"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      return router.push(`/?org=${gitHubOrg}`)
                    }}
                    className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <span>Go</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </nav>
  )
}
