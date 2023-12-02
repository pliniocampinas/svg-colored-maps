const mapBuildingTools = require('./map-building-tools.js')
const municipalitiesSvg = require('../maps/municipalities-map.svg.js')

const getResolver = () => new Promise((resolve) => resolve(municipalitiesSvg))

class BrazilMunicipalitiesBuilder {
  constructor(params) {
    mapBuildingTools.construct(this, params)
  }

  async render() {
    return mapBuildingTools.render(this, {
      codeAttribute: 'citycode',
      svgResolver: getResolver(),
    })
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

module.exports = { BrazilMunicipalitiesBuilder }