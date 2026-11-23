# Clearance

Check every mile of a road trip against your car's ground clearance before you leave.

Pick your car (make, model, generation), add any lowering or a front lip, enter a start and a destination, and every section of the route is rated green, yellow or red for your ride height. You get warnings, where the pavement ends, an elevation profile and a paved alternate when one exists.

## Data
- Road surface, track grade, smoothness and 4WD tags: OpenStreetMap contributors (via the OSM API, Overpass as fallback)
- Routing, road attributes and elevation: Valhalla (valhalla1.openstreetmap.de)
- Search: Photon (komoot) and Nominatim
- Map tiles: CARTO, Esri

Clearance figures for preset cars are approximate. Mapped data can be missing or out of date.

The whole app is one static file, `index.html`.
