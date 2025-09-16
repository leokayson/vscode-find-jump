import {
	commands,
	ConfigurationChangeEvent,
	ExtensionContext,
	TextEditorDecorationType,
	workspace,
} from "vscode";
import { updateDecorationTypes } from "./decorations";
import { FindJump } from "./findJump";
import { subscriptions as inlineInputSubscriptions } from "./inlineInput";
import { ExtensionConfig } from "./types";

export let extensionConfig: ExtensionConfig;

export const enum Const {
	EXTENSION_NAME = "findJump",
}

export abstract class Global {
	static letterDecorationType: TextEditorDecorationType;
}

export function activate(context: ExtensionContext) {
	extensionConfig = workspace.getConfiguration(
		Const.EXTENSION_NAME
	) as any as ExtensionConfig;
	updateDecorationTypes();
	const findJump = new FindJump();

	context.subscriptions.push(
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.activateCharStart`,
			findJump.activateCharStart
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.activateCharEnd`,
			findJump.activateCharEnd
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.activateWordStart`,
			findJump.activateWordStart
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.activateWordEnd`,
			findJump.activateWordEnd
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.activateCharStartSelection`,
			findJump.activateCharStartSelection
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.activateCharEndSelection`,
			findJump.activateCharEndSelection
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.activateWordStartSelection`,
			findJump.activateWordStartSelection
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.activateWordEndSelection`,
			findJump.activateWordEndSelection
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.backspace`,
			findJump.backspace
		)
	);

	function updateConfig(e: ConfigurationChangeEvent): void {
		if (!e.affectsConfiguration(Const.EXTENSION_NAME)) {
			return;
		}

		extensionConfig = workspace.getConfiguration(
			Const.EXTENSION_NAME
		) as any as ExtensionConfig;
		updateDecorationTypes();
		findJump.cancel();
	}

	context.subscriptions.push(
		workspace.onDidChangeConfiguration(updateConfig)
	);
}

export function deactivate(): void {
	const subscriptions = [...inlineInputSubscriptions];

	subscriptions.forEach((subscription) => subscription.dispose());
}
