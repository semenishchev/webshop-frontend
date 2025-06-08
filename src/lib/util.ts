const emailValidatorRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const nameValidatorRegex = new RegExp(/^[a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF\s\-']{2,50}$/);
const formattedPhoneValidatorRegex = new RegExp(/^(\+?1[-.\s]?)?(\(?[0-9]{3}\)?[-.\s]?)?[0-9]{3}[-.\s]?[0-9]{4}$|^(\+?[1-9]\d{0,3}[-.\s]?)?(\(?[0-9]{1,4}\)?[-.\s]?)?[0-9]{1,4}[-.\s]?[0-9]{1,9}$/);
const phoneValidatorRegex = new RegExp(/^(\+?1?)?[0-9]{7,15}$/);

export const isValidEmail = (text: string) => {
	if(!text) return undefined;
	const trimmed = text.trim();
	if(trimmed.length === 0) return undefined;
	return emailValidatorRegex.test(text);
}

export const isValidName = (name: string) => {
	if (!name) return undefined;

	const trimmedName = name.trim();
	if (trimmedName.length === 0) return undefined;
	return nameValidatorRegex.test(trimmedName);
};

export const isValidPhoneNumber = (phone: string) => {
	if (!phone) return undefined;

	const cleanPhone = phone.replace(/\D/g, '');

	if (cleanPhone.length === 0) return undefined;
	return phoneValidatorRegex.test(cleanPhone) && formattedPhoneValidatorRegex.test(phone);
};

export type PasswordCheck = {
	label: string;
	check: (input: string) => boolean;
}

export const passwordChecks: PasswordCheck[] = [
	{
		label: 'Password length (minimum 8 characters)',
		check: pw => pw.length >= 8
	},
	{
		label: 'Has uppercase letter',
		check: pw => /[A-Z]/.test(pw)
	},
	{
		label: 'Has number',
		check: pw => /\d/.test(pw)
	},
	{
		label: 'Has special character',
		check: pw => /[^A-Za-z0-9]/.test(pw)
	}
];

export type CheckResult = {
	check: PasswordCheck;
	passed: boolean;
}

export class ValidationResult {
	public checks: CheckResult[];
	public passedAmount: number;

	public constructor(checks: CheckResult[], passedAmount: number) {
		this.checks = checks;
		this.passedAmount = passedAmount;
	}

	describeFailures(): string {
		let result = "";
		const length = this.checks.length;
		for (let i = 0; i < length; i++){
			const check = this.checks[i];
			if(check.passed) continue;
			result = result.concat(check.check.label + (i + 1 < length ? "\n" : ""));
		}
		return result;
	}
}

export const checkPassword = (password: string): ValidationResult => {
	const checks: CheckResult[] = []
	let passed = 0;
	for (const passwordCheck of passwordChecks) {
		const result = passwordCheck.check(password);
		checks.push({
			check: passwordCheck,
			passed: result,
		})
		if(result) {
			passed++;
		}
	}
	return new ValidationResult(checks, passed);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractMessage = (obj: any | undefined | null): string | null => {
	if(!obj) {
		return null;
	}
	if(typeof obj === "string") return obj;
	if(typeof obj === "object") {
		if(obj.message) {
			return obj.message.toString();
		}
		if(obj["error-message"]) {
			return obj["error-message"].toString();
		}
		if(obj.details) {
			return obj.details;
		}
		if(obj.detail) {
			return obj.detail;
		}
	}

	return obj.toString();
}

export type ErrorAlert = {
	title: string;
	detailedMessage: string;
}