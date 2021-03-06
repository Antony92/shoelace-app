import { html, LitElement, css } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'

@customElement('app-paginator')
export class AppPaginator extends LitElement {
	static styles = css`
		:host {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-end;
			align-content: center;
		}

		sl-icon-button {
			font-size: 1.5rem;
		}

		sl-select {
			margin: 0 10px;
		}
	`

	@property({ type: Number })
	length = 0

	@property({ type: Number, reflect: true })
	pageIndex = 0

	@property({ type: Number, reflect: true })
	pageSize = 5

	@property({ type: Array })
	pageSizeOptions = [5, 10, 20]

	@query('sl-select')
	select!: HTMLElementTagNameMap['sl-select']

	private previousPageIndex = 0

	override firstUpdated() {
		this.select.addEventListener('sl-change', (event) => {
			const pageSize = parseInt(this.select.value?.toString())
			const startIndex = this.pageIndex * this.pageSize
			this.previousPageIndex = this.pageIndex
			this.pageIndex = Math.floor(startIndex / pageSize) || 0
			this.pageSize = pageSize
			this.emitPageEvent()
		})
	}

	hasPreviousPage() {
		return this.pageIndex >= 1 && this.pageSize != 0
	}

	hasNextPage() {
		const maxPageIndex = this.getNumberOfPages() - 1
		return this.pageIndex < maxPageIndex && this.pageSize != 0
	}

	getNumberOfPages() {
		return Math.ceil(this.length / this.pageSize)
	}

	firstPage() {
		if (!this.hasPreviousPage()) return
		this.previousPageIndex = this.pageIndex
		this.pageIndex = 0
		this.emitPageEvent()
	}

	lastPage() {
		if (!this.hasNextPage()) return
		this.previousPageIndex = this.pageIndex
		this.pageIndex = this.getNumberOfPages() - 1
		this.emitPageEvent()
	}

	nextPage() {
		if (!this.hasNextPage()) return
		this.previousPageIndex = this.pageIndex
		this.pageIndex = this.pageIndex + 1
		this.emitPageEvent()
	}

	previousPage() {
		if (!this.hasPreviousPage()) return
		this.previousPageIndex = this.pageIndex
		this.pageIndex = this.pageIndex - 1
		this.emitPageEvent()
	}

	getRangeLabel() {
		if (this.length == 0 || this.pageSize == 0) return `0 of ${this.length}`
		const startIndex = this.pageIndex * this.pageSize
		const endIndex = startIndex < this.length ? Math.min(startIndex + this.pageSize, this.length) : startIndex + this.pageSize
		return `${startIndex + 1} - ${endIndex} of ${this.length}`
	}

	emitPageEvent() {
		this.dispatchEvent(
			new CustomEvent('app-paginate', {
				bubbles: true,
				composed: true,
				detail: {
					pageSize: this.pageSize,
					pageIndex: this.pageIndex,
					previousPageIndex: this.previousPageIndex,
					length: this.length,
				},
			})
		)
	}

	override render() {
		return html`
			Items per page:
			<sl-select value=${this.pageSize} size="small">
				${this.pageSizeOptions.map((value) => html`<sl-menu-item value=${value}>${value}</sl-menu-item>`)}
			</sl-select>
			${this.getRangeLabel()}
			<sl-icon-button
				name="arrow-left-square-fill"
				label="First"
				title="First"
				@click=${this.firstPage}
				?disabled=${!this.hasPreviousPage()}
			>
			</sl-icon-button>
			<sl-icon-button
				name="arrow-left-circle-fill"
				label="Previous"
				title="Previous"
				@click=${this.previousPage}
				?disabled=${!this.hasPreviousPage()}
			>
			</sl-icon-button>
			<sl-icon-button
				name="arrow-right-circle-fill"
				label="Next"
				title="Next"
				@click=${this.nextPage}
				?disabled=${!this.hasNextPage()}
			>
			</sl-icon-button>
			<sl-icon-button 
				name="arrow-right-square-fill" 
				label="Last" 
				title="Last" 
				@click=${this.lastPage}
				?disabled=${!this.hasNextPage()}
			>
			</sl-icon-button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-paginator': AppPaginator
	}
}
