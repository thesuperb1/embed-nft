
import "./star";import './loader'
import { css, customElement, html, LitElement, property } from 'lit-element'
//import { styleMap } from 'lit-html/directives/style-map'
import { NftMetadata } from '@alch/alchemy-web3'

import { Network } from 'opensea-js'

/* lit-element classes */
import './pill.ts'
import './loader.ts'
import './star.ts'


import { ButtonEvent } from './types'
import { getNFT } from './utils'

enum OrientationMode {
  Auto = 'auto',
  Manual = 'manual',
}

const MOBILE_BREAK_POINT = 600

/**
 * Nft-card element that manages front & back of card.
 * Facilitates acquisition and distribution data between
 * components.
 * Registers <nft-card> as an HTML tag.
 */
@customElement('sumi-nft')
export class SumiNFT extends LitElement {
  /* User configurable properties */
  @property({ type: Boolean }) public horizontal?: boolean
  @property({ type: Boolean }) public vertical?: boolean
  @property({ type: String }) public orientationMode?: OrientationMode
  @property({ type: String }) public tokenAddress: string = ''
  @property({ type: String }) public contractAddress: string = ''
  @property({ type: String }) public tokenId: string = ''
  @property({ type: String }) public width: string = ''
  @property({ type: String }) public height: string = ''
  @property({ type: String }) public minHeight: string = ''
  @property({ type: String }) public maxWidth: string = ''
  @property({ type: String }) public network: Network = Network.Main
  @property({ type: String }) public referrerAddress: string = ''

  @property({ type: Object }) private alchemyAsset!: NftMetadata

  @property({ type: Boolean }) public flippedCard: boolean = false


  // Card state variables
  @property({ type: Boolean }) private loading = true
  @property({ type: Boolean }) private error = false

  static get styles() {
    return  css`
      :host {
        all: initial;
      }
      p {
        margin: 0;
        -webkit-font-smoothing: antialiased;
      }
      .card {
        background-color: white;
        font-family: 'Roboto', sans-serif;
        -webkit-font-smoothing: antialiased;
        font-style: normal;
        line-height: normal;
        border-radius: 5px;
        perspective: 1000px;
        margin: auto;
      }
      .card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.6s;
        transform-style: preserve-3d;
        box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
      }
      .flipped-card .card-inner {
        transform: rotateY(180deg);
      }
      .card .error {
        height: 100%;
        display: flex;
        flex-flow: column;
        justify-content: center;
      }
      .card .error-moji {
        font-size: 50px;
      }
      .card .error-message {
        font-size: 16px;
      }

      .image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    `
  }

  /**
   * ConnectedCallback - Invoked when a component is added to the document’s DOM.
   * Grabs data from the OpenSea SDK and populates data objects to be passed to
   * child components.
   */
  public async connectedCallback() {
    super.connectedCallback()
    this.tokenAddress = this.contractAddress
      ? this.contractAddress
      : this.tokenAddress

    try {
      this.alchemyAsset = await getNFT(this.tokenAddress, this.tokenId)
      console.log(this.alchemyAsset)
      console.log(this.alchemyAsset.image)
    } catch (e) {
      this.error = true
      // Probably could not find the asset
      console.error(e)
    }

    this.loading = false

    // Tell the component to update with new state
    await this.requestUpdate()
  }

  public renderErrorTemplate() {
    return html`
      <div class="error">
        <div class="error-moji">¯\\_(ツ)_/¯</div>
        <div class="error-message">Problem loading asset.</div>
      </div>
    `
  }

  public renderLoaderTemplate() {
    return html` <loader-element></loader-element> `
  }

  public render() {
    return html`
      <div>
        <h1>${this.alchemyAsset.title}</h1>
        <h2>${this.alchemyAsset.description}</h2>
        <star-button></star-button>

        <img
          class="image"
          src=${this.alchemyAsset.metadata.image ??
          'https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-15.png'}
        />
      </div>
    `
  }

  private async eventHandler(event: ButtonEvent) {}
}
