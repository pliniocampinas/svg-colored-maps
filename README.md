# svg-colored-maps
A toolkit to color svg maps based on data.

### Install
```
npm install svg-colored-maps
```

### Examples
<div>
  <img src="https://github.com/pliniocampinas/svg-colored-maps/blob/main/sample-app/prints/prints.png" alt="Sp State" />
</div>

### Built-in maps

This lib include some built-in maps of Brazil, BrazilMunicipalitiesBuilder, BrazilStatesBuilder, SaoPauloMunicipalitiesBuilder, cosuming the main toolkit '**mapBuildingTools**'.

```
<div class="map-container">
  <div id="municipalities-map"></div>
</div>
```

```
import { BrazilMunicipalitiesBuilder } from 'svg-colored-maps'

const buildParameters = {
  containerSelector: '#municipalities-map', 
  selectedPathClass: 'path--selected',
  onPathClick: (details) => {
    console.log('custom click details:', details)
  }, 
}

const mapBuilder = new BrazilMunicipalitiesBuilder(buildParameters);
mapBuilder
  .render()
  .then(() => colorWithGdp())

const colorWithGdp = async () => {
  // Fetch data and map to code and value.
  // In this built-in map the code is the IBGE city code.
  const sampleData = (await fetch('./sample-data/gdp-per-capita-2019.json')
    .then(res => res.json()))
    .map(d => ({
      code: d.code,
      value: d.gdpPerCapitaBrl2019
    }))
  // Color svg paths with a Red-Yellow-Green pallete.
  mapBuilder.colorizeRdYlGn(sampleData)
}
```
