import ExpiryMap from 'expiry-map'
import pMemoize from 'p-memoize'

import type * as types from './types'
import { api } from './config'

export const searchNotion = pMemoize(searchNotionImpl, {
  cacheKey: (args) => args[0]?.query,
  cache: new ExpiryMap(10_000)
})

async function searchNotionImpl(
  params: types.SearchParams
): Promise<types.SearchResults> {
  try {
    const response = await fetch(api.searchNotion, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'content-type': 'application/json'
      }
    })

    if (!response.ok) {
      console.warn('Search API error:', response.status, response.statusText)
      // Return empty results instead of throwing error
      return {
        results: [],
        total: 0,
        recordMap: {} as types.RecordMap
      }
    }

    return response.json() as Promise<types.SearchResults>
  } catch (error) {
    console.warn('Search failed:', error)
    // Return empty results on any error
    return {
      results: [],
      total: 0,
      recordMap: {} as types.RecordMap
    }
  }

  // return ky
  //   .post(api.searchNotion, {
  //     json: params
  //   })
  //   .json()
}
