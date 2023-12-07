import mapBuildingTools from '../map-building-tools.js'
import municipalitiesSvg from '../maps/sp-state-municipalities.svg.js'

const getResolver = () => new Promise((resolve) => resolve(municipalitiesSvg))

export class SaoPauloMunicipalitiesBuilder {
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

  colorizeBlues(codesAndValues) {
    this.currentData = codesAndValues
    mapBuildingTools.colorizeBlues(this.pathElementsMap, codesAndValues)
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

export default { SaoPauloMunicipalitiesBuilder }