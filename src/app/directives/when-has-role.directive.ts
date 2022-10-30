import { directive } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { Subscription } from 'rxjs'
import { authState, getUser } from '../services/auth.service'
import { noChange, nothing, TemplateResult } from 'lit'

class WhenHasRole extends AsyncDirective {

	private subscription: Subscription | null = null

	override render(roles: string[] = [], trueCase: () => TemplateResult, falseCase?: () => TemplateResult) {
		if (this.isConnected) {
			this.subscription = authState.subscribe((state) => {
                if (state && getUser()?.roles?.some((role: string) => roles.includes(role))) {
					this.setValue(trueCase())
				} else if (falseCase) {
					this.setValue(falseCase())
				} else {
					this.setValue(nothing)
				}
            })
		}
		return noChange
	}

	override disconnected() {
		this.subscription?.unsubscribe()
	}
}

export const whenHasRole = directive(WhenHasRole)
