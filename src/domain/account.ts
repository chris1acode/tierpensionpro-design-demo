import type { Account, AccountUpdate } from '../domain'
import { isValidEmail } from './email'

export function isValidAccountUpdate(update: AccountUpdate): boolean {
  return update.firstName.trim().length > 0
    && update.lastName.trim().length > 0
    && isValidEmail(update.email)
}

export function accountInitials(account: Pick<Account, 'firstName' | 'lastName'>): string {
  return `${account.firstName.charAt(0)}${account.lastName.charAt(0)}`.toLocaleUpperCase('de-DE')
}
