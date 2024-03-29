import { escapeHtml } from '../utils/html'

export const confirmDialog = (title: string, message: string): Promise<boolean> => {
	return new Promise(async (resolve, reject) => {
		await import('@shoelace-style/shoelace/dist/components/dialog/dialog.js')
		await import('@shoelace-style/shoelace/dist/components/button/button.js')

		if (document.body.querySelector('#confirm-dialog')) {
			reject('Dialog already opened')
			return
		}

		const dialog = Object.assign(document.createElement('sl-dialog'), {
			id: 'confirm-dialog',
			label: title,
			innerHTML: `
                ${escapeHtml(message)}
                <sl-button slot="footer" class="cancel" variant="text">Cancel</sl-button>
                <sl-button slot="footer" class="confirm" variant="primary">Confirm</sl-button>
            `,
		})

		// Prevent the dialog from closing when the user clicks on the overlay
		dialog.addEventListener('sl-request-close', (event) => {
			if (event.detail.source === 'overlay') {
				event.preventDefault()
			}
			if (event.detail.source === 'close-button' || event.detail.source === 'keyboard') {
				resolve(false)
			}
		})

		dialog.addEventListener('sl-after-hide', () => dialog.remove())

		dialog.querySelector('.cancel')?.addEventListener('click', (event) => {
			dialog.hide().then(() => resolve(false))
		})
		dialog.querySelector('.confirm')?.addEventListener('click', (event) => {
			dialog.hide().then(() => resolve(true))
		})

		document.body.appendChild(dialog)
		
		requestAnimationFrame(() => {
			dialog.getBoundingClientRect()
			dialog.show()
		})
	})
}
