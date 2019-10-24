import React from 'react'
import { GeoJsonObject } from 'geojson'
import { GeoJSON } from 'react-leaflet'
import { ErrorBoundary } from './error-boundary'

export function RoutesSegments({ selectedRoutes }) {
  const [routesSegments, setRoutesSegments] = React.useState<{
    [key: string]: GeoJsonObject
  }>({})

  React.useEffect(
    function() {
      selectedRoutes.forEach((routeId: string) => {
        if (!routesSegments[routeId]) {
          import(
            /* webpackChunkName: "[request]" */
            `../data/route_${routeId}_segments.json`
          )
            .then(routeSegments =>
              setRoutesSegments(rs => ({
                ...rs,
                [routeId]: routeSegments.default,
              })),
            )
            .catch(console.log)
        }
      })
    },
    [routesSegments, selectedRoutes, selectedRoutes.size],
  )

  return (
    <React.Fragment>
      {Object.entries(routesSegments).map(([id, rs]) =>
        selectedRoutes.has(id) ? (
          <ErrorBoundary key={`route-segments-${id}`}>
            <GeoJSON data={rs!} />
          </ErrorBoundary>
        ) : (
          undefined
        ),
      )}
    </React.Fragment>
  )
}