import { Position, Range, window, DecorationOptions } from "vscode";
import { extensionConfig } from "./extension";

export interface Association {
	charStart: Position;
	charEnd: Position;
	wordStart: Position;
	wordEnd: Position;
}

function makeAssociation(range: Range): Association {
	const doc = window.activeTextEditor!.document;
	const charStart = range.start;
	const charEnd = range.end;

	const wordRange = doc.getWordRangeAtPosition(charStart);
	const wordStart = wordRange ? wordRange.start : charStart;
	const wordEnd = wordRange ? wordRange.end : charEnd;

	return { charStart, charEnd, wordStart, wordEnd };
}

export class AssociationManager {
	/* Update to association instead of range */
	public associations: Map<string, Association> = new Map();
	public jumpChars = extensionConfig.jumpChars;

	/* Remain the original signature */
	public createAssociation = (
		char: string,
		range: Range
	): DecorationOptions => {
		const finalLetter =
			/[a-zA-Z]/.test(char) && char === char.toUpperCase()
				? `⇧${char.toLowerCase()}`
				: char;

		/* convert range to association */
		const assoc = makeAssociation(range);
		this.associations.set(char, assoc);

		const decorationOptions: DecorationOptions = {
			range,
			renderOptions: { before: { contentText: finalLetter } },
		};
		return decorationOptions;
	};

	public dispose = (): void => {
		this.associations.clear();
	};
}
