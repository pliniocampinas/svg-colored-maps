import { BrazilStatesBuilder } from 'svg-colored-maps'
import { fillTable } from './commons.js'

let onFillDetails = (details) => {}
let clearDetails = () => document.querySelector('#state-details').innerHTML = ''

const buildParameters = {
  containerSelector: '#states-map', 
  selectedPathClass: 'path--selected',
  onPathClick: (details) => {
    console.log('custom click code:', details)
    if(!mapBuilder.togglePath(details.code)) {
      document.querySelector('#state-name').innerHTML = 'Select a state'
      clearDetails()
      return
    }
    document.querySelector('#state-name').innerHTML = details.code
    onFillDetails(details)
  }, 
}

const mapBuilder = new BrazilStatesBuilder(buildParameters)
mapBuilder
  .render()
  .then(() => colorWithGdp())

const colorWithGdp = async () => {
  const sampleData = (await import('./state-gdp-loader.js'))
    .default()
    .map(d => ({
      code: d.sigla_uf,
      value: d.pib_per_capita_brl,
      description: d.unidade_federativa
    }))
  
  console.log(sampleData)

  fillTable(sampleData)
  mapBuilder.colorizeRdYlGn(sampleData)
  clearDetails()
  onFillDetails = ({code}) => document.querySelector('#state-details').innerHTML = `
    <span>GDP: </span>
    <span>${sampleData.find(d => d.code == code)?.value}</span>
  `
}

document.querySelector('.switch-view-button[view-name="state-gdp"]').addEventListener('click', colorWithGdp)