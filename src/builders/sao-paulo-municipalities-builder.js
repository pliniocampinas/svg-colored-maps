import mapBuildingTools from '../map-building-tools.js'

export async function getResolver() {
  try {
    const svg = await import('../maps/sp-state-municipalities.svg');
    return svg.default; // Contains the raw SVG content
  } catch (error) {
    throw new Error(`Error importing SVG sp-state-municipalities.svg: ${error.message}`);
  }
}

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
    mapBuildingTools.colorizeBlues(this.pathElementsMap, codesAndValues, {
      numberOfQuantiles: 4
    })
  }

  colorizeRdYlGn(codesAndValues) {
    this.currentData = codesAndValues
    mapBuildingTools.colorizeRdYlGn(this.pathElementsMap, codesAndValues)
  }

  colorizeGreens(codesAndValues) {
    this.currentData = codesAndValues
    mapBuildingTools.colorizeCustomWithPallete(this.pathElementsMap, codesAndValues, { 
      customPallete: ["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"]
    })
  }

  colorizeCategories(codesAndValues, { customPallete } = {}) {
    this.currentData = codesAndValues
    const colorMap = mapBuildingTools.colorizeCategories(this.pathElementsMap, codesAndValues, {customPallete})
    return colorMap
  }
}

export default { SaoPauloMunicipalitiesBuilder }