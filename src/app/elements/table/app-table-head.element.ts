import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('app-table-head')
export class AppTableHead extends LitElement {
	static styles = css`
		:host {
            display: table-row-group;
        }
	`

	override connectedCallback() {
		super.connectedCallback()
		this.addEventListener('app-table-column-filter', (event) => {
			const { target, detail: { order }} = (<CustomEvent>event)
			if (order) {
				this.headings
				.filter(heading => heading !== target)
				.forEach(heading => heading.clearOrderFilter())
			}
		})
	}

	get headings() {
		const slot = this.renderRoot.querySelector('slot')
		const headings = (<HTMLSlotElement>slot).assignedElements().filter((node) => node.matches('app-table-heading'))
		return Array.from(headings) as HTMLElementTagNameMap['app-table-heading'][]
	}

	override render() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-table-head': AppTableHead
	}
}