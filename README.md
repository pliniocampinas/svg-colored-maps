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

## mapBuildingTools Methods

The methods are built to support the implementation of a builder class, but without restricting the interface with a base class. For that reason the methods often receive a builderInstance parameter.


| Parameter | Description | 
| --- | --- |
| construct(builderInstance, configParams) | Initiate a builderInstance with the necessary parameters. |
| render(builderInstance, renderParams) | Render an svg map on the configured container element |
| colorizeRdYlGn(pathElementsMap, codesAndValues) | Color pathElements with a Red-Yellow-Green pallete based on a 10-quantil, or decil. |
| colorizeCategories(pathElementsMap, codesAndValues, { customPallete } = {}) | Color pathElements with a 10 colors pallete proper for categorical data types, non ordinal. |
| togglePath(builderInstance, code) | Add the selected class or remove it if already selected. |
| clearAllSelectedPaths(builderInstance) | Remove the selected class from all pathElements. |
| clearSelectedPaths(builderInstance, codes) | Remove the selected class from a list of pathElements. |
| selectPaths(builderInstance, codes) | Add the selected class to a list of pathElements. |


### mapBuildingTools.construct

Initialize an object that will hold the states of the map builder.

| Parameter | Type | Description | 
| --- | --- | --- |
| builderInstance | BuilderInstance | States of the builder. |
| configParams | ConfigParams | Base configurations. |

## mapBuildingTools Types

### BuilderInstance

| Property | Type | Description | 
| --- | --- | --- |
| rendered | boolean | Set to true if the map renders successfully. |
| containerSelector | string | CSS selector where the svg element will be appended. |
| selectedPathClass | string | CSS class to style a path element with a selected state. |
| onPathClick | function(details: {code: string, pathElement: HTMLElement}) | Event triggered on click. The code is the key of the element. |
| pathElementsMap | HTMLElement[code: string] | Object with key-values of all path elements of the initialized map. |
| currentData | Array<{code: string, value: any}> | Array of codes and values that will base the colors of the map. |
| selectedCodes | Array<string> | List of codes with selected state. |

