import mapBuildingTools from '../map-building-tools.js'

export async function getResolver() {
  try {
    const svg = await import('../maps/municipalities-map.svg');
    return svg.default; // Contains the raw SVG content
  } catch (error) {
    throw new Error(`Error importing SVG municipalities-map.svg: ${error.message}`);
  }
}

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