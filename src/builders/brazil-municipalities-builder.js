import mapBuildingTools from '../map-building-tools.js'
import municipalitiesSvg from '../maps/municipalities-map.svg.js'


const getResolver = () => new Promise((resolve) => resolve(municipalitiesSvg))

export class BrazilMunicipalitiesBuilder {
  constructor(params) {
    mapBuildingTools.construct(this, {
      ...params,
      codeAttribute: 'citycode',
      svgResolver: getResolver,
    })
  }

  async render() {
    return mapBuildingTools.render(this)
  }

  togglePath(code) {
    return mapBuildingTools.togglePath(this, code)
  }

  selectPaths(codes) {
    return mapBuildingTools.selectPaths(this, codes)
  }

  clearSelectedPaths(codes) {
    mapBuildingTools.clearSelectedPaths(this, codes)
  }

  colorizeRdYlGn(codesAndValues) {
    this.currentData = codesAndValues
    mapBuildingTools.colorizeRdYlGn(this.pathElementsMap, codesAndValues)
  }

  colorizeCategories(codesAndValues, { customPallete } = {}) {
    this.currentData = codesAndValues
    const colorMap = mapBuildingTools.colorizeCategories(this.pathElementsMap, codesAndValues, {customPallete})
    return colorMap
  }
}

export default { BrazilMunicipalitiesBuilder }