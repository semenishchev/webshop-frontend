const emailValidatorRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
export const isValidEmail = (text: string) => {
	if(text.length === 0) return undefined;
	return emailValidatorRegex.test(text);
}

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

export type ErrorAlert = {
	title: string;
	detailedMessage: string;
}