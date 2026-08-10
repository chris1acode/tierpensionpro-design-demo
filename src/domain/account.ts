import type { Account, AccountUpdate } from '../domain'
import { isValidEmail } from './email'

export function isValidAccountUpdate(update: AccountUpdate): boolean {
  return update.firstName.trim().length > 0
    && update.lastName.trim().length > 0
    && isValidEmail(update.email)
}

/**
 * Compares exactly the fields that an account form is allowed to persist.
 * Keeping this policy outside the form makes dirty-state checks independent
 * from presentation components and protects stable account fields such as role.
 */
export function areAccountUpdatesEqual(first: AccountUpdate, second: AccountUpdate): boolean {
  return first.firstName === second.firstName
    && first.lastName === second.lastName
    && first.email === second.email
}

export function accountInitials(account: Pick<Account, 'firstName' | 'lastName'>): string {
  return `${account.firstName.charAt(0)}${account.lastName.charAt(0)}`.toLocaleUpperCase('de-DE')
}
