const mapBuildingTools = require('./map-building-tools.js')
const statesSvgPath = 'https://raw.githubusercontent.com/pliniocampinas/svg-colored-maps/main/map-tools/assets/brazil-states.svg'

class BrazilStatesBuilder {
  constructor(params) {
    mapBuildingTools.construct(this, params)
  }

  async render() {
    return mapBuildingTools.render(this, {
      codeAttribute: 'statecode',
      svgPath: statesSvgPath,
    })
  }

  togglePath(code) {
    return mapBuildingTools.togglePath(this, code)
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

module.exports = { BrazilStatesBuilder }